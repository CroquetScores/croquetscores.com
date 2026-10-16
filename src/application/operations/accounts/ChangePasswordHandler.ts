import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import type { Transactions } from "../../services/Transactions.js";
import { ChangePassword } from "./ChangePassword.js";

/** Every way changing a password is refused, past its rules. */
export type ChangePasswordErrorCode = "ChangePassword.WrongPassword";

export class ChangePasswordRefused extends Refused<ChangePasswordErrorCode> {}

const wrongPassword = (): ChangePasswordRefused =>
  new ChangePasswordRefused(
    "ChangePassword.WrongPassword",
    "That is not the password the account has now.",
  );

/**
 * Changing the password of the account the reader is signed in to, with the
 * one it has now.
 *
 * The one it has now is checked first, as signing in checks it, and a wrong
 * one is refused before anything is asked about the new one: a reader guessing
 * at the password would otherwise have the site ask another site about every
 * guess. How often a wrong one may be given is the page's to count, as it is
 * for signing in.
 *
 * It runs in three steps, as setting a new password does: the account is read
 * and the password checked in a transaction that is over before Have I Been
 * Pwned is asked, the asking holds nothing open, and the writing is a
 * transaction of its own. The account is read and the password checked again
 * as it is written, so that a password changed elsewhere meanwhile is not
 * replaced by somebody who no longer knows it.
 *
 * The account's address is told, so that an owner who did not change the
 * password finds out. Every link to set a password made before now is spent by
 * it without anything being written for them, since a link is worth nothing
 * made before the password was last set.
 */
export class ChangePasswordHandler extends CommandHandler<
  ChangePassword,
  AccountId
> {
  readonly handles: RequestType<ChangePassword> = ChangePassword;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly passwords: PasswordHasher,
    private readonly queue: EmailQueue,
    private readonly transactions: Transactions,
    private readonly breached: BreachedPasswords,
  ) {
    super();
  }

  async handle(command: ChangePassword): Promise<AccountId> {
    await this.transactions.inReadOnlyTransaction(() =>
      this.accountWhosePasswordIs(command),
    );

    // Asked with no connection held, and refused as a password too short is,
    // because it is the same thing to whoever typed it.
    if (await this.breached.isBreached(command.password.trim())) {
      throw new RequestInvalid(command, [
        { code: "Password.Breached", fields: ["password"] },
      ]);
    }

    return this.transactions.inTransaction(() => this.write(command));
  }

  private async accountWhosePasswordIs(
    command: ChangePassword,
  ): Promise<Account> {
    const account = await this.accounts.load(AccountId.from(command.account));
    // A reader signed in to an account the store has never heard of, or one
    // forgotten since, has no password to give: refused as a wrong one is.
    if (account === undefined || account.forgotten) throw wrongPassword();
    const checked = await this.passwords.check(
      command.currentPassword.trim(),
      account.passwordHash,
    );
    if (!checked.matches) throw wrongPassword();
    return account;
  }

  private async write(command: ChangePassword): Promise<AccountId> {
    const account = await this.accountWhosePasswordIs(command);

    // Made from what the validator has already found sound.
    const password = Password.from(command.password);
    account.setNewPassword(
      await this.passwords.hash(password.reveal()),
      command.requestedAt,
    );
    await this.accounts.save(account);

    await this.queue.queue({
      kind: "Email.PasswordChanged",
      to: account.emailAddress.toString(),
      account: account.id,
      language: command.language,
      website: command.website,
      fill: {},
      queuedAt: command.requestedAt,
    });
    return account.id;
  }
}
