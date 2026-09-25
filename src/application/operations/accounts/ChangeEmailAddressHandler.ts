import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailAddressHasher } from "../../services/EmailAddressHasher.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { Links } from "../../services/Links.js";
import { ChangeEmailAddress } from "./ChangeEmailAddress.js";
import { ChangeEmailAddressRefused } from "./ChangeEmailAddressRefused.js";
import { worthOfMovingLink } from "./movingLinks.js";

const taken = (): ChangeEmailAddressRefused =>
  new ChangeEmailAddressRefused(
    "ChangeEmailAddress.Taken",
    "The address has been given to another account since the move was asked for.",
  );

// What finding accounts by address says when a move would give an address to
// a second account. Named here by its code rather than its class, which is the
// read model's own.
const isTheAddressTaken = (failure: unknown): boolean =>
  (failure as { code?: unknown } | null)?.code ===
  "AccountsByEmailAddress.AddressTaken";

/**
 * Moving the account the reader is signed in to, to the address its link was
 * sent to.
 *
 * The link is judged as the page it opens judged it, and every way it is worth
 * nothing is refused with `Link.NoLongerWorks`. An address given to another
 * account since the asking, by somebody registering it, is refused with
 * `ChangeEmailAddress.Taken`, and nothing moves: whoever confirms has shown
 * they read mail there, so the account there is theirs to know about. Finding
 * accounts by address is what notices, as the move is kept, which is the one
 * place that also notices a move and a registering that arrive at once.
 *
 * Once moved, the old address is told, and to where, so that an owner who did
 * not move it finds out while they can still read mail for the account.
 */
export class ChangeEmailAddressHandler extends CommandHandler<
  ChangeEmailAddress,
  AccountId
> {
  readonly handles: RequestType<ChangeEmailAddress> = ChangeEmailAddress;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly addresses: EmailAddressHasher,
    private readonly queue: EmailQueue,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: ChangeEmailAddress): Promise<AccountId> {
    const judged = await worthOfMovingLink(
      this.links,
      this.accounts,
      command.link,
      AccountId.from(command.reader),
      command.requestedAt,
    );
    if (judged.worth !== "Link.Works") {
      throw new ChangeEmailAddressRefused(
        "Link.NoLongerWorks",
        "The link cannot move the account.",
      );
    }
    const { account, emailAddress } = judged;

    const from = account.emailAddress;
    account.changeEmailAddress(
      emailAddress,
      this.addresses.hash(emailAddress),
      command.requestedAt,
    );
    try {
      await this.accounts.save(account);
    } catch (failure) {
      if (isTheAddressTaken(failure)) throw taken();
      throw failure;
    }

    await this.queue.queue({
      kind: "Email.EmailAddressChanged",
      to: from.toString(),
      account: account.id,
      language: command.language,
      fill: { emailAddress: emailAddress.toString() },
      queuedAt: command.requestedAt,
    });
    return account.id;
  }
}
