// What a scenario registers through. The feature is the application's, so it
// may not name what keeps accounts or queues emails; this is
// the shape whatever stands those up puts on the world, and the steps ask only
// this. Application and domain types only, for the reason at the top of
// world.ts.
import type { ConfirmEmailAddress } from "../../src/application/operations/accounts/ConfirmEmailAddress.js";
import type { LinkPurpose } from "../../src/application/services/Links.js";
import type { RegisterAccount } from "../../src/application/operations/accounts/RegisterAccount.js";
import type { Account } from "../../src/domain/aggregates/accounts/Account.js";

/** A queued email, as a scenario reads it back. */
export interface SeenEmail {
  readonly kind: string;
  /** The address it goes to, as it was queued. */
  readonly to: string;
  /** The link it carries, when it carries one. */
  readonly link: string | undefined;
  /** When that link stops working, when the queue was told. */
  readonly worksUntil: Date | undefined;
}

export interface Registering {
  /** Sends a registration. Throws what the mediator throws. */
  send(command: RegisterAccount): Promise<void>;

  /** Sends a confirming. Throws what the mediator throws. */
  confirm(command: ConfirmEmailAddress): Promise<void>;

  /**
   * The link in the email queued for `address` — the only one, or the one of
   * `kind` where more than one is waiting.
   */
  linkEmailedTo(address: string, kind?: string): Promise<string>;

  /**
   * `link` with what it carries changed and its signature left as it was,
   * which is what a link somebody has tampered with looks like. The account is
   * named by the address it was registered at.
   */
  alteredToName(link: string, address: string): Promise<string>;

  /** `link` with the moment it stops working changed, and not signed again. */
  alteredToWorkUntil(link: string, until: string): string;

  /**
   * A link of another kind, made for the account for `address`. The kind is
   * named by its own type rather than by any text, so that a scenario asking
   * for a kind there is no such thing as is a build that fails rather than a
   * link to nowhere that every purpose check refuses for the wrong reason.
   */
  aLinkFor(purpose: LinkPurpose, address: string): Promise<string>;

  /** Forgets the account for `address`, as forgetting one will. */
  forget(address: string): Promise<void>;

  /** How many events the account for `address` has recorded. */
  eventsRecordedFor(address: string): Promise<number>;

  /** An account for `address`, registered before the scenario's registration. */
  giveAnAccount(address: string, confirmed: boolean): Promise<void>;

  /** That `kind` was written to the account for `address`, `times` times. */
  wroteTo(address: string, kind: string, times: number): Promise<void>;

  /** The account for `address` as its stream reads now. */
  accountFor(address: string): Promise<Account | undefined>;

  /** How many accounts have been registered for `address`. */
  accountsFor(address: string): Promise<number>;

  /** Every email waiting to be sent. */
  queued(): Promise<readonly SeenEmail[]>;

  /**
   * The email queued for `address`, as the reader gets it: written out by the
   * writer the site writes with, from the kind and the filling the queue holds.
   * The one place a scenario can see where an email's buttons point, since
   * where they point is the writer's to decide from the kind.
   */
  writtenFor(address: string): Promise<string>;

  /** Has keeping the account's events fail, to see what is kept with it. */
  makeRecordingFail(): void;
}
