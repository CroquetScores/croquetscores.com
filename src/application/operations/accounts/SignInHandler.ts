import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import { SignIn } from "./SignIn.js";

/** Every way signing in is refused. */
export type SignInErrorCode = "SignIn.Failed";

/**
 * Signing in refused. One code, because one answer: which of the several
 * reasons it was is exactly what must not be said.
 */
export class SignInRefused extends Error {
  readonly code: SignInErrorCode;

  constructor(code: SignInErrorCode, message: string) {
    super(message);
    this.name = "SignInRefused";
    this.code = code;
  }
}

/** What signing in asks of where accounts are found by their address. */
export interface AccountsByAddressForSigningIn {
  find(address: EmailAddress): Promise<AccountId | undefined>;
}

/**
 * Signing in with an email address and a password.
 *
 * A wrong password, an address with no account, and an account that has been
 * forgotten are refused alike and take alike. The password is checked against
 * a hash whether or not there is an account to check it against, because
 * checking is slow on purpose and an answer that came back sooner for an
 * address with none would say the address has none. That is what a hasher
 * asked to check against no hash is for.
 *
 * A forgotten account needs nothing of its own here: it is not found by its
 * address any more, so it arrives as an address with no account does, which is
 * what it is to whoever is asking.
 *
 * An account whose hash is still the old site's has it made again today's way
 * as it signs in, since this is the first moment its password is to hand. The
 * hasher says when that is wanted; nothing here knows how a hash is made.
 */
export class SignInHandler extends CommandHandler<SignIn, AccountId> {
  readonly handles: RequestType<SignIn> = SignIn;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: AccountsByAddressForSigningIn,
    private readonly passwords: PasswordHasher,
  ) {
    super();
  }

  async handle(command: SignIn): Promise<AccountId> {
    const account = await this.accountFor(command.emailAddress);
    const checked = await this.passwords.check(
      command.password.trim(),
      account?.passwordHash,
    );
    if (!checked.matches || account === undefined) {
      throw new SignInRefused(
        "SignIn.Failed",
        "That email address and password do not sign in to anything.",
      );
    }

    // The account's own refusal for an address nobody has shown they read.
    // Nothing reaches it by the ordinary way in, since an account has no
    // password until somebody confirms its address with one; it is the
    // account's all the same, for whatever reaches it another way.
    account.signIn(command.requestedAt);
    if (checked.remake) {
      account.hashPasswordAgain(
        await this.passwords.hash(command.password.trim()),
        command.requestedAt,
      );
    }
    await this.accounts.save(account);
    return account.id;
  }

  // An address that breaks its own rules is an address nobody registered, and
  // is answered as one: the rules are not asked here, because which guesses
  // are worth making must not be found out from the answer.
  private async accountFor(given: string): Promise<Account | undefined> {
    let address: EmailAddress;
    try {
      address = EmailAddress.from(given);
    } catch {
      return undefined;
    }
    const id = await this.byAddress.find(address);
    return id === undefined ? undefined : this.accounts.load(id);
  }
}
