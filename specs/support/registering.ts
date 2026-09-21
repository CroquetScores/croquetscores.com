// What a scenario registers through. The feature is the application's, so it
// may not name what keeps accounts or queues emails; this is
// the shape whatever stands those up puts on the world, and the steps ask only
// this. Application and domain types only, for the reason at the top of
// world.ts.
import type { ConfirmEmailAddress } from "../../src/application/operations/accounts/ConfirmEmailAddress.js";
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

  /** Sends a confirmation. Throws what the mediator throws. */
  confirm(command: ConfirmEmailAddress): Promise<void>;

  /**
   * The link in the email queued for `address` — the only one, or the `nth`
   * of them, counting from one, where registering has sent more than one.
   */
  linkEmailedTo(address: string, nth?: number): Promise<string>;

  /** `link` with what it carries changed and its signature left as it was. */
  altered(link: string): string;

  /** A link to confirm forgetting the account for `address`. */
  aLinkToForget(address: string): Promise<string>;

  /** Forgets the account for `address`, as forgetting one will. */
  forget(address: string): Promise<void>;

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

  /** Everything kept for the account for `address`, as one piece of text. */
  everythingKeptFor(address: string): Promise<string>;

  /** Has keeping the account's events fail, to see what is kept with it. */
  makeRecordingFail(): void;
}
