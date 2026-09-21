import { AggregateRoot } from "../../common/AggregateRoot.js";
import type { DomainEvent } from "../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../common/ReadOnlyDate.js";
import { AccountBroughtOver } from "./events/AccountBroughtOver.js";
import { AccountForgotten } from "./events/AccountForgotten.js";
import { AccountRegistered } from "./events/AccountRegistered.js";
import { EmailAddressConfirmed } from "./events/EmailAddressConfirmed.js";
import { PasswordHashedAgain } from "./events/PasswordHashedAgain.js";
import { PasswordSet } from "./events/PasswordSet.js";
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
// or being brought over makes it, and confirming, signing in, hashing a
// password again and forgetting are each asked for by whoever the account is. So an event is given the
// account's own id as its cause, and nothing asks who else it might have been.

/**
 * Somebody who has registered, from registering until the account is
 * forgotten: an email address to begin with, and a name and a hash of their
 * password once they have confirmed the address is theirs.
 */
export class Account extends AggregateRoot {
  #name: PersonName | undefined;
  #emailAddress: EmailAddress | undefined;
  #passwordHash: string | undefined;
  #passwordImported = false;
  #passwordSetAt: ReadOnlyDate | undefined;
  #confirmed = false;
  #forgotten = false;

  private constructor(id: AccountId) {
    super(id);
  }

  /**
   * A new account: unconfirmed, unnamed and with no password. It is given its
   * id by whatever registers it, and a keyed hash of its email address, since
   * the key is the site's.
   *
   * Nothing else, because registering is open to anybody who can type an
   * address, and a name or a password kept from it would be kept for whoever
   * owns the address, whoever typed them. Both are given with confirming.
   */
  static register(
    id: AccountId,
    emailAddress: EmailAddress,
    emailAddressHash: string,
    at: ReadOnlyDate,
  ): Account {
    const account = new Account(id);
    account.record(
      new AccountRegistered(emailAddress.toString(), emailAddressHash, id, at),
    );
    return account;
  }

  /**
   * An account that was somebody's on the old site, with the name it had
   * there and the hash the old site made of its password, and confirmed: its
   * owner gets in with the password they already have.
   */
  static bringOver(
    id: AccountId,
    name: PersonName,
    emailAddress: EmailAddress,
    emailAddressHash: string,
    passwordHash: string,
    at: ReadOnlyDate,
  ): Account {
    const account = new Account(id);
    account.record(
      new AccountBroughtOver(
        name.toString(),
        emailAddress.toString(),
        emailAddressHash,
        passwordHash,
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

  /** What the account is called, or nothing until it has been confirmed. */
  get name(): PersonName | undefined {
    return this.#name;
  }

  /** Where the account is reached. */
  get emailAddress(): EmailAddress {
    if (this.#emailAddress === undefined) throw notRegistered();
    return this.#emailAddress;
  }

  /**
   * The hash of the account's password, as it is now, or nothing until the
   * account has been confirmed. Nothing rather than an empty hash, so that
   * whatever checks a password against it has to say what it does with an
   * account that has none.
   */
  get passwordHash(): string | undefined {
    return this.#passwordHash;
  }

  /** Whether the hash is still the old site's, to be made again when it can. */
  get passwordImported(): boolean {
    return this.#passwordImported;
  }

  /**
   * When the account was last given a password — by confirming its address, by
   * being brought over, or by setting a new one — or nothing where it has
   * none. What a link that sets a password is judged against: one made before
   * the password was last set has been spent.
   */
  get passwordSetAt(): ReadOnlyDate | undefined {
    return this.#passwordSetAt;
  }

  get confirmed(): boolean {
    return this.#confirmed;
  }

  get forgotten(): boolean {
    return this.#forgotten;
  }

  /**
   * That the account's email address is confirmed, by somebody called `name`
   * whose password hashes to `passwordHash`. It is confirmed once: confirming
   * it again records nothing and changes neither, so that a link followed
   * twice leaves one event, and a link left in an inbox is not a way to take
   * over an account that has since become somebody's. Refused with
   * `Account.Forgotten` for an account forgotten.
   */
  confirm(name: PersonName, passwordHash: string, at: ReadOnlyDate): void {
    this.#refuseIfForgotten();
    if (this.#confirmed) return;
    this.record(
      new EmailAddressConfirmed(name.toString(), passwordHash, this.id, at),
    );
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

  /**
   * That somebody has given the account a new password, whose hash is
   * `passwordHash`. Refused with `Account.Forgotten` for an account forgotten,
   * and with `Account.NotConfirmed` for one whose address nobody has shown
   * they read: it has no password to replace, and giving it one here would
   * hand the account to whoever asked.
   */
  setNewPassword(passwordHash: string, at: ReadOnlyDate): void {
    this.#refuseIfForgotten();
    if (!this.#confirmed) {
      throw new AccountRefused(
        "Account.NotConfirmed",
        "The account's email address has not been confirmed.",
      );
    }
    this.record(new PasswordSet(passwordHash, this.id, at));
  }

  /**
   * That the account's password now has `passwordHash`, made a better way.
   * Refused with `Account.Forgotten` for an account forgotten, since a new
   * hash would be something new kept of the person after forgetting was to
   * have kept nothing more.
   */
  hashPasswordAgain(passwordHash: string, at: ReadOnlyDate): void {
    this.#refuseIfForgotten();
    this.record(new PasswordHashedAgain(passwordHash, this.id, at));
  }

  /**
   * That the account is forgotten, which cannot be undone. It is forgotten
   * once: forgetting it again records nothing, so that whatever acts on its
   * being forgotten acts once.
   */
  forget(at: ReadOnlyDate): void {
    if (this.#forgotten) return;
    this.record(new AccountForgotten(this.id, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof AccountRegistered) {
      this.#emailAddress = EmailAddress.from(event.emailAddress);
    } else if (event instanceof AccountBroughtOver) {
      this.#name = PersonName.from(event.name);
      this.#emailAddress = EmailAddress.from(event.emailAddress);
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = true;
      this.#passwordSetAt = event.occurredAt;
      this.#confirmed = true;
    } else if (event instanceof EmailAddressConfirmed) {
      this.#name = PersonName.from(event.name);
      this.#passwordHash = event.passwordHash;
      this.#passwordSetAt = event.occurredAt;
      this.#confirmed = true;
    } else if (event instanceof PasswordHashedAgain) {
      // The same password, hashed a better way, so the moment it was set is
      // still the moment somebody chose it.
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = false;
    } else if (event instanceof PasswordSet) {
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = false;
      this.#passwordSetAt = event.occurredAt;
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

// An account rebuilt from a stream that begins with neither its registering
// nor its being brought over is a stream that is not an account's, and asking
// it anything is a mistake in whoever rebuilt it.
const notRegistered = (): Error =>
  new Error("The account's stream does not begin with its registering.");
