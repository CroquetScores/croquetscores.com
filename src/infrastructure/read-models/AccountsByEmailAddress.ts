// Accounts by their email address, for registering to ask whether an address
// has one, and for asking for a way back in to ask whose it is. Neither can
// replay every account's events to find out, so this keeps the answer, as
// accounts are registered and forgotten, and is asked. It keeps whether each
// is confirmed too, so that whatever gives an account something by its address
// asks one query rather than loading the account, whose every sign-in is an
// event of its own.
//
// It holds a keyed hash of each address, never the address: useless to anyone
// who takes the table without the key. The hash is taken from the registering
// event, where registering put it, rather than made here, so that the read
// model can be rebuilt from the events alone, forgotten accounts and all, whose
// addresses can no longer be read to be hashed.
import type { Projection } from "../../application/common/Projection.js";
import type { EmailAddressHasher } from "../../application/services/EmailAddressHasher.js";
import { AccountBroughtOver } from "../../domain/aggregates/accounts/events/AccountBroughtOver.js";
import { AccountForgotten } from "../../domain/aggregates/accounts/events/AccountForgotten.js";
import { AccountRegistered } from "../../domain/aggregates/accounts/events/AccountRegistered.js";
import { EmailAddressChanged } from "../../domain/aggregates/accounts/events/EmailAddressChanged.js";
import { EmailAddressConfirmed } from "../../domain/aggregates/accounts/events/EmailAddressConfirmed.js";
import { AccountId } from "../../domain/aggregates/accounts/AccountId.js";
import type { EmailAddress } from "../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { DomainEvent } from "../../domain/common/DomainEvent.js";
import type { Id } from "../../domain/common/Id.js";
import { Refused } from "../../domain/common/Refused.js";
import type { UnitOfWork } from "../database/UnitOfWork.js";
import type { StoredEvent } from "../event-store/PostgresEventStore.js";

/** Every reason the read model refuses. */
export type AccountsByEmailAddressErrorCode =
  "AccountsByEmailAddress.AddressTaken";

export class AccountsByEmailAddressRefused extends Refused<AccountsByEmailAddressErrorCode> {}

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
   * Where the address is held, the row holding it is written to as it stands
   * rather than left alone, which changes nothing in it and holds it until the
   * transaction is done. So whoever reserves an address holds its account
   * until they are finished with it, whether they made the account or found
   * it, and the next to reserve the address waits, then finds the account as
   * they left it. Left alone instead, every request finding the same account
   * at once would load it as it was before any of them changed it, and all
   * but the first would be refused for keeping what they did over what the
   * first kept. Signing in with Google at once is what showed it
   * (SignInWithGoogle.feature).
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
         on conflict (email_address_hash) where not forgotten
           do update set email_address_hash = excluded.email_address_hash
         returning account_id`,
        [account.value, this.hasher.hash(address)],
      );
    // One row either way: the one inserted, or the one that already held the
    // address. None would be a database not doing what its key says, and is
    // not something to register into.
    const holder = rows[0];
    if (holder === undefined) {
      throw new Error("The address is reserved, and by no account.");
    }
    return AccountId.from(holder.account_id);
  }

  /**
   * Holds `account` until the transaction is done, as reserving its address
   * does, for a request that found the account some other way: the next to
   * reserve its address or hold it waits, and then finds it as this left it.
   */
  async hold(account: AccountId): Promise<void> {
    await this.unitOfWork.connection().query(
      `select 1 from accounts_by_email_address
          where account_id = $1 for update`,
      [account.value],
    );
  }

  /**
   * The account `address` belongs to where it is confirmed, or nothing when it
   * has none or has one waiting to be confirmed.
   */
  async findConfirmed(address: EmailAddress): Promise<AccountId | undefined> {
    const found = await this.#accountAt(address);
    return found?.confirmed === true ? found.id : undefined;
  }

  /** The account `address` belongs to, or nothing when it has none. */
  async find(address: EmailAddress): Promise<AccountId | undefined> {
    return (await this.#accountAt(address))?.id;
  }

  // The account `address` belongs to, among those not forgotten, and whether
  // it is confirmed: one statement of which row an address names, for both
  // finding an account and finding one that can be given something.
  async #accountAt(
    address: EmailAddress,
  ): Promise<{ id: AccountId; confirmed: boolean } | undefined> {
    const { rows } = await this.unitOfWork
      .connection()
      .query<{ account_id: string; confirmed: boolean }>(
        `select account_id, confirmed
           from accounts_by_email_address
          where email_address_hash = $1 and not forgotten`,
        [this.hasher.hash(address)],
      );
    const row = rows[0];
    return row === undefined
      ? undefined
      : { id: AccountId.from(row.account_id), confirmed: row.confirmed };
  }

  /** Empties its table, so that every stream can be handed to it again. */
  async clear(): Promise<void> {
    await this.unitOfWork
      .connection()
      .query(`truncate accounts_by_email_address`);
  }

  /**
   * Makes the table again from the streams it is handed, every event there is. It needs no
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
  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    // Which of its own events say the account was forgotten, is confirmed, and
    // where it ended up, all read before its row is written, so that the row
    // is written once, already as the stream leaves it: at the address it
    // moved to last, since a row written at one it later moved from would
    // take that address from whichever account has it now, if that account's
    // stream were handed over first. Confirmed by its address being
    // confirmed, or by arriving from the old site, where every account was.
    let forgotten = false;
    let confirmed = false;
    let movedTo: string | undefined;
    for (const { event } of events) {
      if (event instanceof AccountForgotten) forgotten = true;
      if (
        event instanceof EmailAddressConfirmed ||
        event instanceof AccountBroughtOver
      ) {
        confirmed = true;
      }
      if (event instanceof EmailAddressChanged) {
        movedTo = event.emailAddressHash;
      }
    }
    for (const { event } of events) {
      if (
        !(event instanceof AccountRegistered) &&
        !(event instanceof AccountBroughtOver)
      ) {
        continue;
      }
      await this.unitOfWork.connection().query(
        `insert into accounts_by_email_address
           (account_id, email_address_hash, forgotten, confirmed)
         values ($1, $2, $3, $4)
         on conflict (account_id) do nothing`,
        [stream, movedTo ?? event.emailAddressHash, forgotten, confirmed],
      );
    }
  }

  async #project(stream: string, event: DomainEvent): Promise<void> {
    const connection = this.unitOfWork.connection();
    // An account comes to have an address two ways: it is registered here, or
    // it came over from the old site with the address it had there. Both are
    // one row, and both are refused the same if the address is taken.
    if (
      event instanceof AccountRegistered ||
      event instanceof AccountBroughtOver
    ) {
      try {
        // Brought over is confirmed, as every account on the old site was.
        await connection.query(
          `insert into accounts_by_email_address
             (account_id, email_address_hash, confirmed)
           values ($1, $2, $3)
           on conflict (account_id) do nothing`,
          [stream, event.emailAddressHash, event instanceof AccountBroughtOver],
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
    } else if (event instanceof EmailAddressChanged) {
      // The account's one row, found somewhere else. Refused as registering
      // is when the address has an account already, which is what stops a
      // move and a registering sent at once giving one address to two.
      try {
        await connection.query(
          `update accounts_by_email_address set email_address_hash = $2
            where account_id = $1`,
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
    } else if (event instanceof EmailAddressConfirmed) {
      await connection.query(
        `update accounts_by_email_address set confirmed = true
          where account_id = $1`,
        [stream],
      );
    } else if (event instanceof AccountForgotten) {
      await connection.query(
        `update accounts_by_email_address set forgotten = true
          where account_id = $1`,
        [stream],
      );
    }
  }
}
