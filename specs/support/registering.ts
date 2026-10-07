// What a scenario registers through. The feature is the application's, so it
// may not name what keeps accounts or queues emails; this is
// the shape whatever stands those up puts on the world, and the steps ask only
// this. Application and domain types only, for the reason at the top of
// world.ts.
import type { Role } from "../../src/domain/aggregates/accounts/value-objects/Role.js";
import type { ConfirmEmailAddress } from "../../src/application/operations/accounts/ConfirmEmailAddress.js";
import type { SignIn } from "../../src/application/operations/accounts/SignIn.js";
import type { SignInWithGoogle } from "../../src/application/operations/accounts/SignInWithGoogle.js";
import type { AccountId } from "../../src/domain/aggregates/accounts/AccountId.js";
import type { AskToForgetAccount } from "../../src/application/operations/accounts/AskToForgetAccount.js";
import type { AskToSetPassword } from "../../src/application/operations/accounts/AskToSetPassword.js";
import type { ForgetAccount } from "../../src/application/operations/accounts/ForgetAccount.js";
import type { ChangeName } from "../../src/application/operations/accounts/ChangeName.js";
import type { ChangePassword } from "../../src/application/operations/accounts/ChangePassword.js";
import type { AskToChangeEmailAddress } from "../../src/application/operations/accounts/AskToChangeEmailAddress.js";
import type { ChangeEmailAddress } from "../../src/application/operations/accounts/ChangeEmailAddress.js";
import type {
  MovingLinkWorth,
  WhatAMovingLinkIsWorth,
} from "../../src/application/operations/accounts/WhatAMovingLinkIsWorth.js";
import type {
  AccountProfile,
  Profile,
} from "../../src/application/operations/accounts/AccountProfile.js";
import type { ReportUnreachableService } from "../../src/application/operations/accounts/ReportUnreachableService.js";
import type { SetNewPassword } from "../../src/application/operations/accounts/SetNewPassword.js";
import type { ResetPassword } from "../../src/application/operations/accounts/ResetPassword.js";
import type { SendConfirmationLinkAgain } from "../../src/application/operations/accounts/SendConfirmationLinkAgain.js";
import type { WhatAConfirmationLinkIsWorth } from "../../src/application/operations/accounts/WhatAConfirmationLinkIsWorth.js";
import type { ConfirmationLinkWorth } from "../../src/application/operations/accounts/confirmationLinks.js";
import type { RegisterAccount } from "../../src/application/operations/accounts/RegisterAccount.js";
import type { Account } from "../../src/domain/aggregates/accounts/Account.js";
import type { AccountAsGiven } from "./accounts.js";

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

  /** Signs in. Answers with the account, or throws what the mediator throws. */
  signIn(command: SignIn): Promise<AccountId>;

  /** How many passwords have been checked against a hash, or against none. */
  passwordsChecked(): number;

  /** Whether `hash` is of the old site's making, not yet made again. */
  isTheOldSitesHash(hash: string | undefined): boolean;

  /** Signs in with Google. Answers with the account, or throws. */
  signInWithGoogle(command: SignInWithGoogle): Promise<AccountId>;

  /**
   * Has the next signing in with Google find no account by its Google account,
   * as one that looked before another had linked it would.
   */
  lookForGoogleAccountTooEarly(): void;

  /**
   * Has the account the next signing in with Google finds by its Google
   * account forgotten before that signing in holds it, as one forgotten while
   * the signing in waited its turn would be.
   */
  forgetAccountOnceFoundByGoogle(): void;

  /** Links the account for `address` to the Google account `subject`. */
  linkToGoogle(address: string, subject: string): Promise<void>;

  /** Asks for an account to be forgotten. Throws what the mediator throws. */
  askToForget(command: AskToForgetAccount): Promise<void>;

  /** Asks for a link to set a password. Throws what the mediator throws. */
  askToSetPassword(command: AskToSetPassword): Promise<void>;

  /** Forgets an account with its link. Answers with it, or throws. */
  forgetWithLink(command: ForgetAccount): Promise<AccountId>;

  /** Changes an account's name. Answers with the account, or throws. */
  changeName(command: ChangeName): Promise<AccountId>;

  /** Changes an account's password. Answers with the account, or throws. */
  changePassword(command: ChangePassword): Promise<AccountId>;

  /** Asks to move an account to another address. Throws what the mediator throws. */
  askToMove(command: AskToChangeEmailAddress): Promise<void>;

  /** What a link to confirm moving is worth, without moving anything. */
  worthOfMovingLink(query: WhatAMovingLinkIsWorth): Promise<MovingLinkWorth>;

  /** Moves an account with its link. Answers with the account, or throws. */
  moveWithLink(command: ChangeEmailAddress): Promise<AccountId>;

  /** What an account is called and where it is reached, or nothing. */
  profile(query: AccountProfile): Promise<Profile | undefined>;

  /** Has reporting tell `address`, or nobody where there is none. */
  tellsAdministrator(address: string | undefined): void;

  /** Reports a service unreachable. Throws what the mediator throws. */
  report(command: ReportUnreachableService): Promise<void>;

  /** Sets a new password. Answers with the account, or throws. */
  setNewPassword(command: SetNewPassword): Promise<AccountId>;

  /** A link to confirm the email address of the account for `address`. */
  aLinkToConfirm(address: string): Promise<string>;

  /** Asks for a way back in. Throws what the mediator throws. */
  resetPassword(command: ResetPassword): Promise<void>;

  /** Asks for the link to be sent again. Throws what the mediator throws. */
  sendAgain(command: SendConfirmationLinkAgain): Promise<void>;

  /** Asks what a link is worth, without following it. */
  worthOf(query: WhatAConfirmationLinkIsWorth): Promise<ConfirmationLinkWorth>;

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

  /** Gives the account for `address` the role `role`. */
  giveRole(address: string, role: Role): Promise<void>;

  /** Takes the role `role` from the account for `address`. */
  takeRole(address: string, role: Role): Promise<void>;

  /** An account for `address`, made before the scenario's own request. */
  giveAnAccount(address: string, as: AccountAsGiven): Promise<void>;

  /** That `kind` was written to the account for `address`, `times` times. */
  wroteTo(address: string, kind: string, times: number): Promise<void>;

  /** That `kind` was written `times` times to `address`, which has no account. */
  wroteToAddress(address: string, kind: string, times: number): Promise<void>;

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
