import { Website } from "../../../domain/common/Website.js";
import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailAddressHasher } from "../../services/EmailAddressHasher.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten, WrittenTo } from "../../services/EmailsWritten.js";
import type { Links } from "../../services/Links.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import type { FindsAccountByAddress } from "./accountsByAddress.js";
import { AskToChangeEmailAddress } from "./AskToChangeEmailAddress.js";
import { ChangeEmailAddressRefused } from "./ChangeEmailAddressRefused.js";
import { MOVING_LINK_WORKS_FOR_MILLISECONDS } from "./movingLinks.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import { EMAILS_AN_HOUR } from "./emailsAnHour.js";

/**
 * Asking to move the account the reader is signed in to, to another address.
 *
 * The password the account has now is checked first, as signing in checks it,
 * and nothing is sent without it. The address the account has already,
 * however it is written, is refused, since there is nowhere to move it.
 *
 * It moves nothing. An address with no account is sent a link to confirm the
 * move, and the asking is recorded on the account with the reference the link
 * carries, so that the link names its asking without the address written into
 * it. An address that has an account already is sent an email saying so, and
 * nothing is recorded. Either way it answers the same, so that which addresses
 * have accounts is not found out by asking to move to them.
 *
 * The new address is one the reader typed, and need not be theirs, so what is
 * written to it is counted as every other email the site writes to somebody
 * is: by the account where the address has one, and by the address where it
 * has none. Past the limit nothing is sent or recorded, and it answers the
 * same, so that knowing one's own password is not a way to fill somebody
 * else's inbox.
 */
export class AskToChangeEmailAddressHandler extends CommandHandler<
  AskToChangeEmailAddress,
  void
> {
  readonly handles: RequestType<AskToChangeEmailAddress> =
    AskToChangeEmailAddress;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: FindsAccountByAddress,
    private readonly addresses: EmailAddressHasher,
    private readonly passwords: PasswordHasher,
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: AskToChangeEmailAddress): Promise<void> {
    const account = await this.accounts.load(AccountId.from(command.account));
    // A reader signed in to an account the store has never heard of, or one
    // forgotten since, has no password to give: refused as a wrong one is.
    const checked =
      account === undefined || account.forgotten
        ? undefined
        : await this.passwords.check(
            command.password.trim(),
            account.passwordHash,
          );
    if (account === undefined || checked?.matches !== true) {
      throw new ChangeEmailAddressRefused(
        "ChangeEmailAddress.WrongPassword",
        "That is not the password the account has now.",
      );
    }

    // Made from what the validator has already found sound.
    const address = EmailAddress.from(command.emailAddress);
    if (address.equals(account.emailAddress)) {
      throw new ChangeEmailAddressRefused(
        "ChangeEmailAddress.Unchanged",
        "The account is at that address already.",
      );
    }

    // Counting holds whoever is counted until this transaction ends, so that
    // askings sent at once cannot each count before any has recorded.
    const holder = await this.byAddress.find(address);
    const whom: WrittenTo =
      holder === undefined
        ? { emailAddressHash: this.addresses.hash(address) }
        : { account: holder };
    const since = shiftedBy(command.requestedAt, -AN_HOUR);
    if ((await this.written.countSince(whom, since)) >= EMAILS_AN_HOUR) return;

    if (holder !== undefined) {
      await this.queue.queue({
        kind: "Email.AlreadyHasAnAccount",
        to: address.toString(),
        language: command.language,
        website: command.website,
        fill: {},
        queuedAt: command.requestedAt,
      });
      await this.written.record(
        whom,
        "Email.AlreadyHasAnAccount",
        command.requestedAt,
      );
      return;
    }

    const reference = crypto.randomUUID();
    account.askToChangeEmailAddress(address, reference, command.requestedAt);
    await this.accounts.save(account);

    const until = ReadOnlyDate.from(
      new Date(
        command.requestedAt.toDate().getTime() +
          MOVING_LINK_WORKS_FOR_MILLISECONDS,
      ),
    );
    await this.queue.queue({
      kind: "Email.ConfirmNewEmailAddress",
      to: address.toString(),
      account: account.id,
      language: command.language,
      website: command.website,
      fill: {
        link: this.links.make(
          Website.addressedTo(command.website),
          "change-email-address",
          account.id,
          until,
          reference,
        ),
      },
      linkWorksUntil: until,
      queuedAt: command.requestedAt,
    });
    await this.written.record(
      whom,
      "Email.ConfirmNewEmailAddress",
      command.requestedAt,
    );
  }
}
