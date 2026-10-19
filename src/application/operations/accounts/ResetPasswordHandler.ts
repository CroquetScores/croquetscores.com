import { Website } from "../../../domain/common/Website.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailAddressHasher } from "../../services/EmailAddressHasher.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten, WrittenTo } from "../../services/EmailsWritten.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { LinkPurpose, Links } from "../../services/Links.js";
import type { FindsAccountByAddress } from "./accountsByAddress.js";
import { ResetPassword } from "./ResetPassword.js";
import { SET_NEW_PASSWORD_LINK_HOURS } from "./setNewPasswordLinks.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import { inboxIsFull } from "./emailsAnHour.js";

// What each kind of email carries, said here once rather than worked out from
// its name where it is queued, so that the next kind added has to say.
const emails: Readonly<
  Record<Kind, { readonly link?: LinkPurpose; readonly hours: number }>
> = {
  "Email.SetNewPassword": {
    link: "set-new-password",
    hours: SET_NEW_PASSWORD_LINK_HOURS,
  },
  "Email.ConfirmAddressAgain": { link: "confirm-email-address", hours: 24 },
  "Email.RegisterInstead": { hours: 0 },
};

type Kind =
  | "Email.SetNewPassword"
  | "Email.ConfirmAddressAgain"
  | "Email.RegisterInstead";

/**
 * Asking for a way back in.
 *
 * The shape of the work is the same whoever the address belongs to, because
 * the answer must not say: one email is queued and counted, whether the
 * address has an account, has one that is waiting to be confirmed, or has
 * none at all.
 *
 * A link to set a new password lasts an hour. It is shorter than the day a
 * link to confirm an address lasts because of what it does: whoever follows
 * it chooses the password the account is signed in with afterwards, and a link
 * that sat in an inbox for days would be a key left under the mat.
 */
export class ResetPasswordHandler extends CommandHandler<ResetPassword, void> {
  readonly handles: RequestType<ResetPassword> = ResetPassword;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: FindsAccountByAddress,
    private readonly addresses: EmailAddressHasher,
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly handled: HandledRequests,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: ResetPassword): Promise<void> {
    // Claimed before anything is done, so that an asking sent twice because
    // its answer was lost sends one email rather than two.
    if (!(await this.handled.claim(command.requestId, command.requestedAt))) {
      return;
    }

    // Made from what the validator has already found sound.
    const address = EmailAddress.from(command.emailAddress);
    const id = await this.byAddress.find(address);
    const account = id === undefined ? undefined : await this.accounts.load(id);

    // Counted by the account where there is one and by the address where there
    // is not, so that an address nobody registered cannot be buried in email
    // either. Counting holds whoever is counted until this transaction ends.
    const whom: WrittenTo =
      id === undefined
        ? { emailAddressHash: this.addresses.hash(address) }
        : { account: id };
    if (await inboxIsFull(this.written, whom, command.requestedAt)) return;

    // To the address the account holds where there is one, never the one this
    // asking typed: an address differing only in case is the same address, and
    // not every mail host thinks so.
    if (account === undefined) {
      await this.write(command, whom, address, "Email.RegisterInstead", id);
      return;
    }
    await this.write(
      command,
      whom,
      account.emailAddress,
      // An account waiting to be confirmed has no password to replace, so what
      // its reader needs is the link they never followed.
      account.confirmed ? "Email.SetNewPassword" : "Email.ConfirmAddressAgain",
      id,
    );
  }

  private async write(
    command: ResetPassword,
    whom: WrittenTo,
    to: EmailAddress,
    kind: Kind,
    account: AccountId | undefined,
  ): Promise<void> {
    const { link: purpose, hours } = emails[kind];
    const until = shiftedBy(command.requestedAt, hours * AN_HOUR);

    await this.queue.queue({
      kind,
      to: to.toString(),
      // An email about no account is kept with the site's key rather than an
      // account's, because there is no account whose key could seal it.
      ...(account === undefined ? {} : { account }),
      language: command.language,
      website: command.website,
      fill:
        purpose === undefined || account === undefined
          ? {}
          : {
              link: this.links.make(
                Website.addressedTo(command.website),
                purpose,
                account,
                until,
              ),
            },
      ...(purpose === undefined || account === undefined
        ? {}
        : { linkWorksUntil: until }),
      queuedAt: command.requestedAt,
    });
    await this.written.record(whom, kind, command.requestedAt);
  }
}
