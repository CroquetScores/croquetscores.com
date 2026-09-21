import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Links } from "../../services/Links.js";
import { worthOfForgettingLink } from "./forgettingLinks.js";
import { ForgetAccount } from "./ForgetAccount.js";

/** Every way forgetting is refused. */
export type ForgetAccountErrorCode = "Link.NoLongerWorks";

/** Forgetting refused. One code, because there is one thing to say. */
export class ForgettingRefused extends Error {
  readonly code: ForgetAccountErrorCode;

  constructor(code: ForgetAccountErrorCode, message: string) {
    super(message);
    this.name = "ForgettingRefused";
    this.code = code;
  }
}

/**
 * Forgetting an account from the link it was emailed, followed by a reader
 * signed in to it.
 *
 * What the link is worth is the question the page the link opened asked, of
 * the same place (`forgettingLinks.ts`), so that what the reader was shown and
 * what their confirming is answered with cannot disagree. A link is spent by
 * the account being forgotten: forgetting it again would find it forgotten.
 */
export class ForgetAccountHandler extends CommandHandler<
  ForgetAccount,
  AccountId
> {
  readonly handles: RequestType<ForgetAccount> = ForgetAccount;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: ForgetAccount): Promise<AccountId> {
    const judged = await worthOfForgettingLink(
      this.links,
      this.accounts,
      command.link,
      AccountId.from(command.reader),
      command.requestedAt,
    );
    if (judged.worth !== "Link.Works") {
      throw new ForgettingRefused(
        "Link.NoLongerWorks",
        "The link cannot forget this reader's account.",
      );
    }
    const { account } = judged;
    account.forget(command.requestedAt);
    await this.accounts.save(account);
    return account.id;
  }
}
