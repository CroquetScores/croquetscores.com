// Accounts by their email address, for registering to ask whether an address
// has one, and for asking for a way back in to ask whose it is. Neither can
// replay every account's events to find out, so this keeps the answer, as
// accounts are registered and forgotten, and is asked.
//
// It holds a keyed hash of each address, never the address: useless to anyone
// who takes the table without the key. The hash is taken from the registering
// event, where registering put it, rather than made here, so that the read
// model can be rebuilt from the events alone, forgotten accounts and all, whose
// addresses can no longer be read to be hashed.
import type { Projection } from "../../application/common/Projection.js";
import type { EmailAddressHasher } from "../../application/services/EmailAddressHasher.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { AccountRegistered } from "../../domain/aggregates/accounts/events/AccountRegistered.js";
import { AccountId } from "../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { EmailAddress } from "../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/** Every reason the read model refuses. */
export type AccountsByEmailAddressErrorCode =
  "AccountsByEmailAddress.AddressTaken";

export class AccountsByEmailAddressRefused extends Error {
  readonly code: AccountsByEmailAddressErrorCode;

  constructor(code: AccountsByEmailAddressErrorCode, message: string) {
    super(message);
    this.name = "AccountsByEmailAddressRefused";
    this.code = code;
  }
}

// 23505 is unique_violation. The account's own id is kept once by an insert
// that does nothing when it is there already, so the one key a registering
// can break is the address's. What is thrown is asked whether it is something
// with fields before its fields are read, as the event store's is: a rejection
// with nothing in it must not become a TypeError that hides what really
// failed.
const isTheAddressTaken = (failure: unknown): boolean =>
  typeof failure === "object" &&
  failure !== null &&
  (failure as { code?: unknown }).code === "23505" &&
  (failure as { constraint?: unknown }).constraint ===
    "one_account_per_email_address";

export class AccountsByEmailAddress implements Projection {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly hasher: EmailAddressHasher,
  ) {}

  /**
   * Keeps the table in step with `events`. Safe to run twice: an account's
   * registering projected again changes nothing, nor does its forgetting.
   * A second account for an address one not forgotten has is refused with
   * `AccountsByEmailAddress.AddressTaken`, failing the append that registered
   * it.
   */
  async project(
    stream: Id,
    _firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const event of events) await this.#project(stream.value, event);
  }

  /**
   * Reserves `address` for `account`, and says who holds it afterwards: the
   * account given when the reservation was made here, and whoever already held
   * it when it was not. Always somebody: the answer is never that nobody does.
   *
   * The insert is the reservation. Looking first and inserting after leaves a
   * gap in which somebody else inserts, and two registrations that both looked
   * before either wrote would both go on to make an account; the unique key on
   * the address is what decides instead, and it decides once. It is asked not
   * to fail on a conflict, so that losing costs the request nothing: a unique
   * key that raised would leave the transaction unable to go on, and the
   * failure would have said the address was taken, which registering must
   * never say.
   *
   * The row is the same one projecting a registering writes, so an account and
   * its reservation are the same fact rather than two that can drift. Written
   * here first and projected after, which changes nothing: the projection's
   * insert does nothing when the row is already there, and rebuilding from the
   * events writes it again from what the registering event carries.
   *
   * The unique key it is asked about is the partial one: an address held by an
   * account that has been forgotten is held by nobody, and reserving it again
   * is how that address comes to have an account once more.
   */
  async reserve(address: EmailAddress, account: AccountId): Promise<AccountId> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `insert into accounts_by_email_address (account_id, email_address_hash)
         values ($1, $2)
         on conflict (email_address_hash) where not forgotten do nothing
         returning account_id`,
        [account.value, this.hasher.hash(address)],
      );
    if (rows.length === 1) return account;
    // The insert conflicted, so a row holds the address; one that is not there
    // to be found a moment later is a database that is not doing what its key
    // says, and is not something to register into. An account made regardless
    // would fail the same key when its events were projected, and that failure
    // would say the address was taken.
    const holder = await this.find(address);
    if (holder === undefined) {
      throw new Error("The address is reserved, and by no account.");
    }
    return holder;
  }

  /** The account `address` belongs to, or nothing when it has none. */
  async find(address: EmailAddress): Promise<AccountId | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string }>(
        `select account_id
           from accounts_by_email_address
          where email_address_hash = $1 and not forgotten`,
        [this.hasher.hash(address)],
      );
    const row = rows[0];
    return row === undefined ? undefined : AccountId.from(row.account_id);
  }

  /**
   * Makes the table again from `events`, every event there is. It needs no
   * account's key: the hash is in the event, and a forgotten account's events
   * read back without one.
   *
   * Which accounts were forgotten is worked out before a single row is
   * written, and each row is written once, already marked. Replaying instead
   * — a row inserted when the registering is read and marked when the
   * forgetting is — would depend on reading one stream before another, which
   * nothing gives: an address given up by one account and registered by
   * another would be refused as taken whenever the newer account's stream came
   * first.
   */
  async rebuildFrom(events: readonly StoredEvent[]): Promise<void> {
    const connection = this.unitOfWork.connection();
    await connection.query(`truncate accounts_by_email_address`);
    const forgotten = new Set(
      events
        .filter(({ event }) => event instanceof AccountForgotten)
        .map(({ stream }) => stream),
    );
    for (const { stream, event } of events) {
      if (!(event instanceof AccountRegistered)) continue;
      await connection.query(
        `insert into accounts_by_email_address
           (account_id, email_address_hash, forgotten)
         values ($1, $2, $3)
         on conflict (account_id) do nothing`,
        [stream, event.emailAddressHash, forgotten.has(stream)],
      );
    }
  }

  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    if (event instanceof AccountRegistered) {
      try {
        await connection.query(
          `insert into accounts_by_email_address (account_id, email_address_hash)
           values ($1, $2)
           on conflict (account_id) do nothing`,
          [stream, event.emailAddressHash],
        );
      } catch (failure) {
        if (isTheAddressTaken(failure)) {
          throw new AccountsByEmailAddressRefused(
            "AccountsByEmailAddress.AddressTaken",
            "The email address already has an account.",
          );
        }
        throw failure;
      }
    } else if (event instanceof AccountForgotten) {
      await connection.query(
        `update accounts_by_email_address set forgotten = true
          where account_id = $1`,
        [stream],
      );
    }
  }
}
