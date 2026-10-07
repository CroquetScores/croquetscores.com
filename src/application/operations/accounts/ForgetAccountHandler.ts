import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { Links } from "../../services/Links.js";
import { worthOfForgettingLink } from "./forgettingLinks.js";
import { ForgetAccount } from "./ForgetAccount.js";
import type { AccountsByRole } from "./roleOperations.js";

/** Every way forgetting is refused. */
export type ForgetAccountErrorCode =
  "Link.NoLongerWorks" | "ForgetAccount.LastAdministrator";

/**
 * Forgetting refused: the link worth nothing, however it came to be, or the
 * account the site's last administrator.
 */
export class ForgettingRefused extends Refused<ForgetAccountErrorCode> {}

/**
 * Forgetting an account from the link it was emailed, followed by a reader
 * signed in to it.
 *
 * What the link is worth is the question the page the link opened asked, of
 * the same place (`forgettingLinks.ts`), so that what the reader was shown and
 * what their confirming is answered with cannot disagree. A link is spent by
 * the account being forgotten: forgetting it again would find it forgotten.
 *
 * The administrators are held before anything is read, as taking the role
 * holds them (RemoveRoleHandler.ts): the last two forgetting their accounts at
 * once, or one forgetting while the other takes the role from them, would
 * otherwise each find the other still an administrator, and leave none. Held
 * for every account, an administrator or not, because which it is is read from
 * the account, which has to be read after they are held to be read as the
 * other request left it.
 */
export class ForgetAccountHandler extends CommandHandler<
  ForgetAccount,
  AccountId
> {
  readonly handles: RequestType<ForgetAccount> = ForgetAccount;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
    private readonly byRole: AccountsByRole,
  ) {
    super();
  }

  async handle(command: ForgetAccount): Promise<AccountId> {
    const administrators = await this.byRole.holdEvery("administrator");
    const judged = await worthOfForgettingLink(
      this.links,
      this.accounts,
      command.link,
      AccountId.from(command.reader),
      command.requestedAt,
      administrators,
    );
    if (judged.worth === "ForgetAccount.LastAdministrator") {
      throw new ForgettingRefused(
        "ForgetAccount.LastAdministrator",
        "The site's last administrator cannot be forgotten.",
      );
    }
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
