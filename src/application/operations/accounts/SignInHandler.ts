import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
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

  /**
   * Holds `account` until the request is done, so that signings in to it at
   * once take turns rather than each reading it before any has changed it.
   */
  hold(account: AccountId): Promise<void>;
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
 * The account is held before it is read to be signed in to, as signing in with
 * Google holds it, so that signings in to one account at once, however each
 * came, take turns with it: each is recorded on the account, and two that read
 * it before either had recorded anything would be kept at the same version,
 * and all but one refused for it.
 *
 * It is held only once the password has matched, and read again when it is.
 * Held while the password is checked, which is slow on purpose, every wrong
 * guess at an address would keep the account from everybody else for as long
 * as a check takes: guesses sent at once at an address with an account would
 * be answered one after another, and at an address with none all together,
 * which says which addresses have accounts; and enough of them would keep its
 * owner out. A hash that changed while it was not held is checked again.
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
    const password = command.password.trim();
    const found = await this.accountFor(command.emailAddress);
    let checked = await this.passwords.check(password, found?.passwordHash);
    if (!checked.matches || found === undefined) throw refusal();

    await this.byAddress.hold(found.id);
    const account = await this.accounts.load(found.id);
    // Forgotten while it was not held: refused as any account not found by its
    // address is, rather than by the account's own refusal.
    if (account === undefined || account.forgotten) throw refusal();
    if (account.passwordHash !== found.passwordHash) {
      checked = await this.passwords.check(password, account.passwordHash);
      if (!checked.matches) throw refusal();
    }

    // The account's own refusal for an address nobody has shown they read.
    // Nothing reaches it by the ordinary way in, since an account has no
    // password until somebody confirms its address with one; it is the
    // account's all the same, for whatever reaches it another way.
    account.signIn(command.requestedAt);
    if (checked.remake) {
      account.hashPasswordAgain(
        await this.passwords.hash(password),
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

const refusal = (): SignInRefused =>
  new SignInRefused(
    "SignIn.Failed",
    "That email address and password do not sign in to anything.",
  );
