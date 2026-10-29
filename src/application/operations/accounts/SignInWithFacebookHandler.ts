import {
  Account,
  AccountRefused,
} from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailAddressHasher } from "../../services/EmailAddressHasher.js";
import type {
  FindsAccountByAddress,
  HoldsAccount,
  ReservesAddress,
} from "./accountsByAddress.js";
import { SignInWithFacebook } from "./SignInWithFacebook.js";

/** Every way signing in with Facebook is refused. */
export type SignInWithFacebookErrorCode =
  | "SignInWithFacebook.EmailAddressMissing"
  | "SignInWithFacebook.LinkedToAnother";

export class SignInWithFacebookRefused extends Refused<SignInWithFacebookErrorCode> {}

// Asked after confirming, which changes nothing here: an account nobody has
// confirmed has never been linked to anything.
const isLinkedToAnother = (failure: unknown): boolean =>
  failure instanceof AccountRefused &&
  failure.code === "Account.FacebookAccountAlreadyLinked";

/** What signing in with Facebook asks of where accounts are found by address. */
export interface AccountsByAddressForFacebook
  extends ReservesAddress, FindsAccountByAddress, HoldsAccount {}

/** What signing in with Facebook asks of where accounts are found by Facebook. */
export interface AccountsByFacebookAccount {
  find(facebookId: string): Promise<AccountId | undefined>;
}

/**
 * Signing in with Facebook.
 *
 * A Facebook account already linked signs in to its account, found by its id
 * alone, and needs no email address. One not linked is matched by its email
 * address, which Facebook gives only where the reader has one it has
 * confirmed, and which is taken to be the reader's as surely as following a
 * link sent there would. Without one there is nothing to find or make an
 * account by, and it is refused before anything is looked up. The account at
 * the address is linked, unless it is linked to another Facebook account
 * already, and confirmed if it was not. An address with no account gets one.
 *
 * Whoever holds the address is found by reserving it, as registering does,
 * rather than by looking and then writing: between a look that found nothing
 * and the writing after it, another request could have made an account there.
 * Reserving holds the account until the request is done, and one found by its
 * Facebook account is held the same way, so that signings in at once, as from
 * a double click, take turns with it rather than each changing it from where
 * it stood before any began, and all but one being refused for it.
 *
 * An account made or confirmed here is given no password: its owner signs in
 * with Facebook, and sets one of their own, if they want one, by asking for a
 * way back in.
 */
export class SignInWithFacebookHandler extends CommandHandler<
  SignInWithFacebook,
  AccountId
> {
  readonly handles: RequestType<SignInWithFacebook> = SignInWithFacebook;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: AccountsByAddressForFacebook,
    private readonly byFacebook: AccountsByFacebookAccount,
    private readonly addresses: EmailAddressHasher,
  ) {
    super();
  }

  async handle(command: SignInWithFacebook): Promise<AccountId> {
    const linked = await this.byFacebook.find(command.facebookId);
    if (linked !== undefined) {
      // Held before it is loaded, as one found by its address is held by
      // reserving it, so that signings in at once take turns with the account
      // whichever way each found it.
      await this.byAddress.hold(linked);
      const account = await this.load(linked);
      // Forgotten while this waited its turn: looked for now, the Facebook
      // account would be linked to nothing, so it is carried on with as one
      // linked to nothing is, and gets a new account at its address.
      if (!account.forgotten) {
        account.signIn(command.requestedAt);
        await this.accounts.save(account);
        return account.id;
      }
    }

    if (command.emailAddress === undefined || command.emailAddress === "") {
      throw new SignInWithFacebookRefused(
        "SignInWithFacebook.EmailAddressMissing",
        "Facebook gave no email address, and the account is found by it.",
      );
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

    if (!account.confirmed) {
      account.confirm(
        PersonName.from(command.name.trim()),
        undefined,
        command.requestedAt,
      );
    }
    // Whoever holds the address for now does not get to add a second Facebook
    // account, and the account is what refuses it. This one linked already is
    // not a second: a signing in that looked before another had linked it
    // finds it here, and the account links it again by recording nothing.
    try {
      account.linkFacebookAccount(command.facebookId, command.requestedAt);
    } catch (failure) {
      if (isLinkedToAnother(failure)) {
        throw new SignInWithFacebookRefused(
          "SignInWithFacebook.LinkedToAnother",
          "The account is linked to another Facebook account.",
        );
      }
      throw failure;
    }
    account.signIn(command.requestedAt);
    await this.accounts.save(account);
    return account.id;
  }

  private async load(id: AccountId): Promise<Account> {
    const account = await this.accounts.load(id);
    if (account === undefined) {
      throw new Error(`The account ${id.value} has no events.`);
    }
    return account;
  }
}
