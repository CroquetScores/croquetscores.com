import { AggregateRoot } from "../../common/AggregateRoot.js";
import type { DomainEvent } from "../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../common/ReadOnlyDate.js";
import { AccountBroughtOver } from "./events/AccountBroughtOver.js";
import { AccountForgotten } from "./events/AccountForgotten.js";
import { AccountRegistered } from "./events/AccountRegistered.js";
import { EmailAddressConfirmed } from "./events/EmailAddressConfirmed.js";
import { PasswordHashedAgain } from "./events/PasswordHashedAgain.js";
import { PasswordSet } from "./events/PasswordSet.js";
import { RoleAdded } from "./events/RoleAdded.js";
import { RoleRemoved } from "./events/RoleRemoved.js";
import { SignedIn } from "./events/SignedIn.js";
import type { AccountId } from "./AccountId.js";
import { EmailAddress } from "./value-objects/EmailAddress.js";
import { PersonName } from "./value-objects/PersonName.js";
import type { Role } from "./value-objects/Role.js";

/** Why an account will not do what it was asked. */
export type AccountErrorCode = "Account.NotConfirmed" | "Account.Forgotten";

/**
 * An account's refusal, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class AccountRefused extends Error {
  readonly code: AccountErrorCode;

  constructor(code: AccountErrorCode, message: string) {
    super(message);
    this.name = "AccountRefused";
    this.code = code;
  }
}

/**
 * Somebody known to the site by an email address. Registered with nothing but
 * the address, and given a name and a password only once somebody has shown
 * they read mail there; or brought over from the old site already named,
 * confirmed and with the old site's hash of their password.
 *
 * Every event it records gives the account's own id as its cause: nobody but
 * whoever the account is can register it, confirm it, sign in to it, give it a
 * password or have it forgotten. Its roles are the exception, given and taken
 * away by somebody else, and so caused by whoever that was.
 */
export class Account extends AggregateRoot {
  #emailAddress: EmailAddress | undefined;
  #name: PersonName | undefined;
  #passwordHash: string | undefined;
  #passwordImported = false;
  #passwordSetAt: ReadOnlyDate | undefined;
  #confirmed = false;
  #forgotten = false;
  readonly #roles = new Set<Role>();

  private constructor(id: AccountId) {
    super(id);
  }

  /**
   * A new account at `emailAddress`, and nothing else: no name and no
   * password, because whoever registers has not yet shown the address is
   * theirs. `emailAddressHash` is made by whatever registers it, since the key
   * it is made with is the site's and not the domain's.
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
   * An account the old site had, begun as it was there: called `name`,
   * confirmed, and with `passwordHash` as the old site made it, so that its
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

  /** The account its stream, `events`, leaves. */
  static rebuiltFrom(id: AccountId, events: readonly DomainEvent[]): Account {
    const account = new Account(id);
    account.replay(events);
    return account;
  }

  override get id(): AccountId {
    return super.id;
  }

  /** Where the account is reached. */
  get emailAddress(): EmailAddress {
    // Every account's stream begins by giving it an address, so one without
    // is a stream that was never an account's, and a mistake in whoever
    // rebuilt it rather than something to answer.
    if (this.#emailAddress === undefined) {
      throw new Error("The account's stream did not begin by registering it.");
    }
    return this.#emailAddress;
  }

  /** What the account is called, or nothing until it is confirmed. */
  get name(): PersonName | undefined {
    return this.#name;
  }

  /**
   * The hash of the password the account is signed in with, or nothing until
   * it has one. Nothing rather than an empty string, so that whatever checks a
   * password has to decide what an account without one means.
   */
  get passwordHash(): string | undefined {
    return this.#passwordHash;
  }

  /** Whether the hash is still the old site's, to be made again when it can. */
  get passwordImported(): boolean {
    return this.#passwordImported;
  }

  /**
   * When somebody last chose the account's password, or nothing if nobody
   * has. A link that sets a password is judged against it: one made before
   * the password was last chosen has been spent.
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

  get isAdministrator(): boolean {
    return this.#roles.has("administrator");
  }

  get isWorldRankingOfficer(): boolean {
    return this.#roles.has("world-ranking-officer");
  }

  /**
   * That the address is somebody's, who is called `name` and signs in with a
   * password hashing to `passwordHash`. Only the first confirming counts: a
   * link followed twice records one event, and a link left in an inbox cannot
   * rename an account or change its password once it is somebody's.
   */
  confirm(name: PersonName, passwordHash: string, at: ReadOnlyDate): void {
    this.#refuseOnceForgotten();
    if (this.#confirmed) return;
    this.record(
      new EmailAddressConfirmed(name.toString(), passwordHash, this.id, at),
    );
  }

  /**
   * That somebody signed in to the account. Whether their password was right
   * is decided before the account is asked; what the account decides is
   * whether it is one that can be signed in to at all.
   */
  signIn(at: ReadOnlyDate): void {
    this.#refuseOnceForgotten();
    this.#refuseUntilConfirmed();
    this.record(new SignedIn(this.id, at));
  }

  /**
   * That somebody chose a new password, hashing to `passwordHash`. An account
   * not yet confirmed is refused: it has no password to replace, and giving it
   * one would hand an account to somebody who never showed they read mail at
   * its address.
   */
  setNewPassword(passwordHash: string, at: ReadOnlyDate): void {
    this.#refuseOnceForgotten();
    this.#refuseUntilConfirmed();
    this.record(new PasswordSet(passwordHash, this.id, at));
  }

  /**
   * That the same password is now hashed a better way, as `passwordHash`.
   * Refused once the account is forgotten, since a new hash would be something
   * new kept of the person after forgetting was to keep nothing more.
   */
  hashPasswordAgain(passwordHash: string, at: ReadOnlyDate): void {
    this.#refuseOnceForgotten();
    this.record(new PasswordHashedAgain(passwordHash, this.id, at));
  }

  /**
   * That `by` gave the account `role`. Only an account somebody has shown is
   * theirs is given one, since a role given to any other would be given to
   * whoever turns out to own the address. Whether `by` may give it is not the
   * account's to know. A role already held is not given again, so a request
   * sent twice records one event.
   */
  addRole(role: Role, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseOnceForgotten();
    this.#refuseUntilConfirmed();
    if (this.#roles.has(role)) return;
    this.record(new RoleAdded(role, by, at));
  }

  /**
   * That `by` took `role` away from the account. One it does not hold is not
   * taken away, and not refused either: there is nothing to lose, and a
   * request sent twice records one event.
   */
  removeRole(role: Role, by: AccountId, at: ReadOnlyDate): void {
    this.#refuseOnceForgotten();
    if (!this.#roles.has(role)) return;
    this.record(new RoleRemoved(role, by, at));
  }

  /**
   * That the account is forgotten, for good. Only the first forgetting is
   * recorded, so that whatever acts on it acts once.
   */
  forget(at: ReadOnlyDate): void {
    if (this.#forgotten) return;
    this.record(new AccountForgotten(this.id, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof AccountRegistered) {
      this.#emailAddress = EmailAddress.from(event.emailAddress);
    } else if (event instanceof AccountBroughtOver) {
      this.#emailAddress = EmailAddress.from(event.emailAddress);
      this.#name = PersonName.from(event.name);
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = true;
      this.#passwordSetAt = event.occurredAt;
      this.#confirmed = true;
    } else if (event instanceof EmailAddressConfirmed) {
      this.#name = PersonName.from(event.name);
      this.#passwordHash = event.passwordHash;
      this.#passwordSetAt = event.occurredAt;
      this.#confirmed = true;
    } else if (event instanceof PasswordSet) {
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = false;
      this.#passwordSetAt = event.occurredAt;
    } else if (event instanceof PasswordHashedAgain) {
      // Nobody chose anything: it is the same password, so when it was set
      // stays when somebody last chose it.
      this.#passwordHash = event.passwordHash;
      this.#passwordImported = false;
    } else if (event instanceof RoleAdded) {
      this.#roles.add(event.role);
    } else if (event instanceof RoleRemoved) {
      this.#roles.delete(event.role);
    } else if (event instanceof AccountForgotten) {
      this.#forgotten = true;
      // So that whatever asks what an account may do gets the right answer
      // without also having to ask whether it is forgotten.
      this.#roles.clear();
    }
    // Signing in is kept as a record that it happened, and changes nothing
    // the account decides by, so it has no case here.
  }

  // Forgotten is asked before confirmed, so that a forgotten account says it
  // is forgotten whether or not it was ever confirmed.
  #refuseOnceForgotten(): void {
    if (this.#forgotten) {
      throw new AccountRefused(
        "Account.Forgotten",
        "The account is forgotten.",
      );
    }
  }

  #refuseUntilConfirmed(): void {
    if (!this.#confirmed) {
      throw new AccountRefused(
        "Account.NotConfirmed",
        "The account's email address has not been confirmed.",
      );
    }
  }
}
