import { AggregateRoot } from "../../common/AggregateRoot.js";
import type { DomainEvent } from "../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../common/ReadOnlyDate.js";
import { AccountForgotten } from "./events/AccountForgotten.js";
import { AccountRegistered } from "./events/AccountRegistered.js";
import { EmailAddressConfirmed } from "./events/EmailAddressConfirmed.js";
import { PasswordHashedAgain } from "./events/PasswordHashedAgain.js";
import { SignedIn } from "./events/SignedIn.js";
import type { AccountId } from "./value-objects/AccountId.js";
import { EmailAddress } from "./value-objects/EmailAddress.js";
import { PersonName } from "./value-objects/PersonName.js";

/** Every reason an account refuses what it is asked. */
export type AccountErrorCode = "Account.NotConfirmed" | "Account.Forgotten";

/**
 * Something an account will not do. Named by a code, because the code is the
 * contract: whoever asked decides what to tell a reader from it.
 */
export class AccountRefused extends Error {
  readonly code: AccountErrorCode;

  constructor(code: AccountErrorCode, message: string) {
    super(message);
    this.name = "AccountRefused";
    this.code = code;
  }
}

// Every event an account records is caused by the account itself: registering
// makes it, and confirming, signing in, hashing a password again and forgetting
// are each asked for by whoever the account is. So an event is given the
// account's own id as its cause, and nothing asks who else it might have been.

/**
 * Somebody who has registered: a name, an email address, and a hash of their
 * password, from registering until the account is forgotten.
 */
export class Account extends AggregateRoot {
  #name: PersonName | undefined;
  #emailAddress: EmailAddress | undefined;
  #passwordHash = "";
  #passwordImported = false;
  #confirmed = false;
  #forgotten = false;

  private constructor(id: AccountId) {
    super(id);
  }

  /**
   * A new account, unconfirmed. It is given its id by whatever registers it,
   * and a hash of its password rather than the password, which the domain
   * never holds.
   */
  static register(
    id: AccountId,
    name: PersonName,
    emailAddress: EmailAddress,
    passwordHash: string,
    at: ReadOnlyDate,
  ): Account {
    const account = new Account(id);
    account.record(
      new AccountRegistered(
        name.toString(),
        emailAddress.toString(),
        passwordHash,
        false,
        id,
        at,
      ),
    );
    return account;
  }

  /** The account `events` leave, which are its stream. */
  static rebuiltFrom(id: AccountId, events: readonly DomainEvent[]): Account {
    const account = new Account(id);
    account.replay(events);
    return account;
  }

  override get id(): AccountId {
    return super.id;
  }

  /** What the account is called. */
  get name(): PersonName {
    if (this.#name === undefined) throw notRegistered();
    return this.#name;
  }

  /** Where the account is reached. */
  get emailAddress(): EmailAddress {
    if (this.#emailAddress === undefined) throw notRegistered();
    return this.#emailAddress;
  }

  /** The hash of the account's password, as it is now. */
  get passwordHash(): string {
    return this.#passwordHash;
  }

  /** Whether the hash is still the old site's, to be made again when it can. */
  get passwordImported(): boolean {
    return this.#passwordImported;
  }

  get confirmed(): boolean {
    return this.#confirmed;
  }

  get forgotten(): boolean {
    return this.#forgotten;
  }

  /**
   * That the account's email address is confirmed. It is confirmed once:
   * confirming it again records nothing, so that a link followed twice leaves
   * one event. Refused with `Account.Forgotten` for an account forgotten.
   */
  confirm(at: ReadOnlyDate): void {
    this.#refuseIfForgotten();
    if (this.#confirmed) return;
    this.record(new EmailAddressConfirmed(this.id, at));
  }

  /**
   * That the account was signed in to. Refused with `Account.Forgotten` for an
   * account forgotten, and with `Account.NotConfirmed` for one whose address
   * nobody has yet shown they read. Checking the password is not the
   * account's: it is asked only once the password is known to be right.
   */
  signIn(at: ReadOnlyDate): void {
    this.#refuseIfForgotten();
    if (!this.#confirmed) {
      throw new AccountRefused(
        "Account.NotConfirmed",
        "The account's email address has not been confirmed.",
      );
    }
    this.record(new SignedIn(this.id, at));
  }

  /** That the account's password now has `passwordHash`, made a better way. */
  hashPasswordAgain(passwordHash: string, at: ReadOnlyDate): void {
    this.record(new PasswordHashedAgain(passwordHash, this.id, at));
  }

  /** That the account is forgotten, which cannot be undone. */
  forget(at: ReadOnlyDate): void {
    this.record(new AccountForgotten(this.id, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof AccountRegistered) {
      this.#name = PersonName.from(event.name);
      this.#emailAddress = EmailAddress.from(event.emailAddress);
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = event.passwordImported;
    } else if (event instanceof EmailAddressConfirmed) {
      this.#confirmed = true;
    } else if (event instanceof PasswordHashedAgain) {
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = false;
    } else if (event instanceof AccountForgotten) {
      this.#forgotten = true;
    }
    // Signing in changes nothing the account decides anything by, so it has no
    // case here: it is in the stream only as a record that it happened.
  }

  #refuseIfForgotten(): void {
    if (this.#forgotten) {
      throw new AccountRefused(
        "Account.Forgotten",
        "The account is forgotten.",
      );
    }
  }
}

// An account rebuilt from a stream that does not begin with its registering is
// a stream that is not an account's, and asking it anything is a mistake in
// whoever rebuilt it.
const notRegistered = (): Error =>
  new Error("The account's stream does not begin with its registering.");
