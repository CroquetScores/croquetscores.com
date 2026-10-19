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
import { AskToSetPassword } from "./AskToSetPassword.js";
import { SET_NEW_PASSWORD_LINK_HOURS } from "./setNewPasswordLinks.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import { inboxIsFull } from "./emailsAnHour.js";

/** Every way asking to set a password is refused. */
export type AskToSetPasswordErrorCode = "AskToSetPassword.HasPassword";

export class AskToSetPasswordRefused extends Refused<AskToSetPasswordErrorCode> {}

/**
 * Asking for a link to set a password: an email of its own, carrying the link
 * a way back in carries, to the account's own address.
 *
 * Nothing about the account changes. An account that has a password is
 * refused, since what its reader wants is to change it. An account already
 * forgotten, or one the store has never heard of, is sent nothing: the reader
 * signed in to it is signed in to nothing, and there is no address to write
 * to.
 *
 * It counts toward the emails an address may be sent in an hour, with every
 * other email asked for with an address, since all of them fill the same
 * inbox; past the limit it sends nothing, and answers as it always does.
 */
export class AskToSetPasswordHandler extends CommandHandler<
  AskToSetPassword,
  void
> {
  readonly handles: RequestType<AskToSetPassword> = AskToSetPassword;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly handled: HandledRequests,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: AskToSetPassword): Promise<void> {
    const id = AccountId.from(command.account);
    const account = await this.accounts.load(id);
    if (account === undefined || account.forgotten) return;
    if (account.passwordHash !== undefined) {
      throw new AskToSetPasswordRefused(
        "AskToSetPassword.HasPassword",
        "The account has a password already.",
      );
    }

    // Claimed once the asking is known to be one that sends, so that an
    // asking sent twice because its answer was lost sends one email rather
    // than two.
    if (!(await this.handled.claim(command.requestId, command.requestedAt))) {
      return;
    }

    // Counting holds the account until this transaction ends.
    const whom = { account: id };
    if (await inboxIsFull(this.written, whom, command.requestedAt)) return;

    const until = shiftedBy(
      command.requestedAt,
      SET_NEW_PASSWORD_LINK_HOURS * AN_HOUR,
    );
    await this.queue.queue({
      kind: "Email.SetPassword",
      to: account.emailAddress.toString(),
      account: id,
      language: command.language,
      website: command.website,
      fill: {
        link: this.links.make(
          Website.addressedTo(command.website),
          "set-new-password",
          id,
          until,
        ),
      },
      linkWorksUntil: until,
      queuedAt: command.requestedAt,
    });
    await this.written.record(whom, "Email.SetPassword", command.requestedAt);
  }
}
