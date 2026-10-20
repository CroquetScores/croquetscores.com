import { Website } from "../../../domain/common/Website.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten } from "../../services/EmailsWritten.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
import { SendConfirmationLinkAgain } from "./SendConfirmationLinkAgain.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import { inboxIsFull } from "./emailsAnHour.js";
import { CONFIRMATION_LINK_WORKS_FOR_HOURS } from "./confirmationLinks.js";

/** Every way sending the link again is refused. */
export type SendConfirmationLinkAgainErrorCode =
  | "Account.NotFound"
  | "Account.Forgotten"
  | "Account.AlreadyConfirmed"
  | "EmailsWritten.TooManyLately";

/**
 * Sending the link again refused. Named by a code, because the code is the
 * contract: what a reader is shown for each is the page's to decide.
 */
export class SendingRefused extends Refused<SendConfirmationLinkAgainErrorCode> {}

/**
 * Sending the link that confirms an account's email address again.
 *
 * Nothing about the account changes: a link sent is not something the account
 * records, since an email written to an address by somebody who is not its
 * owner is not a fact about the person. So this queues an email and counts it,
 * and that is all.
 *
 * The limit is counted with registering's, because both fill the one inbox,
 * and counting holds the account until this transaction ends, so that two
 * askings at once are counted one after the other rather than both finding the
 * account under its limit.
 */
export class SendConfirmationLinkAgainHandler extends CommandHandler<
  SendConfirmationLinkAgain,
  void
> {
  readonly handles: RequestType<SendConfirmationLinkAgain> =
    SendConfirmationLinkAgain;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly handled: HandledRequests,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: SendConfirmationLinkAgain): Promise<void> {
    // Claimed before anything is done, so that an asking sent twice because
    // its answer was lost sends one email rather than two.
    if (!(await this.handled.claim(command.requestId, command.requestedAt))) {
      return;
    }

    const id = AccountId.from(command.account);
    const account = await this.accounts.load(id);
    if (account === undefined) {
      throw new SendingRefused(
        "Account.NotFound",
        "There is no account of that id.",
      );
    }
    if (account.forgotten) {
      throw new SendingRefused(
        "Account.Forgotten",
        "The account has been forgotten.",
      );
    }
    if (account.confirmed) {
      throw new SendingRefused(
        "Account.AlreadyConfirmed",
        "The account's email address is already confirmed.",
      );
    }

    if (await inboxIsFull(this.written, { account: id }, command.requestedAt)) {
      throw new SendingRefused(
        "EmailsWritten.TooManyLately",
        "The account has been written to as often as it is to be this hour.",
      );
    }

    const until = shiftedBy(
      command.requestedAt,
      CONFIRMATION_LINK_WORKS_FOR_HOURS * AN_HOUR,
    );
    // To the address the account holds, and never one given with the asking.
    await this.queue.queue({
      kind: "Email.ConfirmAddressAgain",
      to: account.emailAddress.toString(),
      account: id,
      language: command.language,
      website: command.website,
      fill: {
        link: this.links.make(
          Website.addressedTo(command.website),
          "confirm-email-address",
          id,
          until,
        ),
      },
      linkWorksUntil: until,
      queuedAt: command.requestedAt,
    });
    await this.written.record(
      { account: id },
      "Email.ConfirmAddressAgain",
      command.requestedAt,
    );
  }
}
