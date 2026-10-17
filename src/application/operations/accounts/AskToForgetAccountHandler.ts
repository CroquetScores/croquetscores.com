import { Website } from "../../../domain/common/Website.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { Links } from "../../services/Links.js";
import { AskToForgetAccount } from "./AskToForgetAccount.js";

/**
 * How long a link to confirm forgetting works. Short, because what it does
 * cannot be undone and a link that sat in an inbox would be a way to forget
 * the account for whoever came across it.
 */
const LINK_WORKS_FOR_MILLISECONDS = 15 * 60 * 1000;

/**
 * Asking for an account to be forgotten: a link to the account's own address.
 *
 * Nothing about the account changes. An account already forgotten, or one the
 * store has never heard of, is sent nothing: the reader signed in to it is
 * signed in to nothing, and there is no address to write to.
 */
export class AskToForgetAccountHandler extends CommandHandler<
  AskToForgetAccount,
  void
> {
  readonly handles: RequestType<AskToForgetAccount> = AskToForgetAccount;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly queue: EmailQueue,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: AskToForgetAccount): Promise<void> {
    const id = AccountId.from(command.account);
    const account = await this.accounts.load(id);
    if (account === undefined || account.forgotten) return;

    const until = ReadOnlyDate.from(
      new Date(
        command.requestedAt.toDate().getTime() + LINK_WORKS_FOR_MILLISECONDS,
      ),
    );
    await this.queue.queue({
      kind: "Email.ConfirmForgetting",
      to: account.emailAddress.toString(),
      account: id,
      language: command.language,
      website: command.website,
      fill: {
        link: this.links.make(
          Website.from(command.website),
          "confirm-forgetting",
          id,
          until,
        ),
      },
      linkWorksUntil: until,
      queuedAt: command.requestedAt,
    });
  }
}
