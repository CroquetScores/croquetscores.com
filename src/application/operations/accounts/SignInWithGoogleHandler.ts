import { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailAddressHasher } from "../../services/EmailAddressHasher.js";
import type { AccountsByAddress } from "./RegisterAccountHandler.js";
import { SignInWithGoogle } from "./SignInWithGoogle.js";

/** Every way signing in with Google is refused. */
export type SignInWithGoogleErrorCode =
  | "SignInWithGoogle.EmailAddressNotVerified"
  | "SignInWithGoogle.LinkedToAnother"
  | "SignInWithGoogle.NameMissing";

export class SignInWithGoogleRefused extends Error {
  readonly code: SignInWithGoogleErrorCode;

  constructor(code: SignInWithGoogleErrorCode, message: string) {
    super(message);
    this.name = "SignInWithGoogleRefused";
    this.code = code;
  }
}

/** What signing in with Google asks of where accounts are found by address. */
export interface AccountsByAddressForGoogle extends AccountsByAddress {
  find(address: EmailAddress): Promise<AccountId | undefined>;

  /**
   * Holds `account` until the request is done, as reserving its address does,
   * so that two requests for it take turns rather than both changing it from
   * where it stood before either began.
   */
  hold(account: AccountId): Promise<void>;
}

/** What signing in with Google asks of where accounts are found by Google. */
export interface AccountsByGoogleAccount {
  find(subject: string): Promise<AccountId | undefined>;
}

/**
 * Signing in with Google.
 *
 * A Google account already linked signs in to its account, found by its
 * subject alone. One not linked is matched by its email address, but only an
 * address Google has verified: that is what makes it the reader's as surely as
 * following a link sent there would, and one it has not verified proves
 * nothing, so it is refused before anything is looked up. The account at the
 * address is linked, unless it is linked to another Google account already,
 * and confirmed if it was not. An address with no account gets one.
 *
 * Whoever holds the address is found by reserving it, as registering does,
 * rather than by looking and then writing: between a look that found nothing
 * and the writing after it, another request could have made an account there.
 * Reserving holds the account until the request is done, and one found by its
 * Google account is held the same way, so that signings in at once, as from a
 * double click, take turns with it rather than each changing it from where it
 * stood before any began, and all but one being refused for it.
 *
 * An account made or confirmed here is given no password: its owner signs in
 * with Google, and sets one of their own, if they want one, by asking for a
 * way back in.
 */
export class SignInWithGoogleHandler extends CommandHandler<
  SignInWithGoogle,
  AccountId
> {
  readonly handles: RequestType<SignInWithGoogle> = SignInWithGoogle;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: AccountsByAddressForGoogle,
    private readonly byGoogle: AccountsByGoogleAccount,
    private readonly addresses: EmailAddressHasher,
  ) {
    super();
  }

  async handle(command: SignInWithGoogle): Promise<AccountId> {
    if (!command.emailAddressVerified) {
      throw new SignInWithGoogleRefused(
        "SignInWithGoogle.EmailAddressNotVerified",
        "Google has not verified the email address.",
      );
    }

    const linked = await this.byGoogle.find(command.subject);
    if (linked !== undefined) {
      // Held before it is loaded, as one found by its address is held by
      // reserving it, so that signings in at once take turns with the account
      // whichever way each found it.
      await this.byAddress.hold(linked);
      const account = await this.load(linked);
      // Forgotten while this waited its turn: looked for now, the Google
      // account would be linked to nothing, so it is carried on with as one
      // linked to nothing is, and gets a new account at its address.
      if (!account.forgotten) {
        account.signIn(command.requestedAt);
        await this.accounts.save(account);
        return account.id;
      }
    }

    const address = EmailAddress.from(command.emailAddress);
    const id = AccountId.create();
    const holder = await this.byAddress.reserve(address, id);
    const account = holder.equals(id)
      ? Account.register(
          id,
          address,
          this.addresses.hash(address),
          command.requestedAt,
        )
      : await this.load(holder);

    // Another Google account is linked already, and whoever holds the address
    // for now does not get to add a second. This one linked already is not
    // another: a second signing in that looked before the first had linked it
    // finds it here, and is to sign in rather than be refused.
    if (
      account.googleSubject !== undefined &&
      account.googleSubject !== command.subject
    ) {
      throw new SignInWithGoogleRefused(
        "SignInWithGoogle.LinkedToAnother",
        "The account is linked to another Google account.",
      );
    }
    if (!account.confirmed) {
      account.confirm(this.nameOf(command), undefined, command.requestedAt);
    }
    account.linkGoogleAccount(command.subject, command.requestedAt);
    account.signIn(command.requestedAt);
    await this.accounts.save(account);
    return account.id;
  }

  // Asked only where a name is needed: an account already called something
  // keeps what it is called, and Google's name for the reader is not wanted.
  private nameOf(command: SignInWithGoogle): PersonName {
    if (command.name === undefined || command.name.trim() === "") {
      throw new SignInWithGoogleRefused(
        "SignInWithGoogle.NameMissing",
        "Google gave no name, and the account needs one.",
      );
    }
    return PersonName.from(command.name.trim());
  }

  private async load(id: AccountId): Promise<Account> {
    const account = await this.accounts.load(id);
    if (account === undefined) {
      throw new Error(`The account ${id.value} has no events.`);
    }
    return account;
  }
}
