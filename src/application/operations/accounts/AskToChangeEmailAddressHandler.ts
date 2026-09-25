import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { Links } from "../../services/Links.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import { AskToChangeEmailAddress } from "./AskToChangeEmailAddress.js";
import { ChangeEmailAddressRefused } from "./ChangeEmailAddressRefused.js";
import { MOVING_LINK_WORKS_FOR_MILLISECONDS } from "./movingLinks.js";

/** What moving to another address asks of where accounts are found by address. */
export interface AccountsByAddressForMoving {
  find(address: EmailAddress): Promise<AccountId | undefined>;
}

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
 */
export class AskToChangeEmailAddressHandler extends CommandHandler<
  AskToChangeEmailAddress,
  void
> {
  readonly handles: RequestType<AskToChangeEmailAddress> =
    AskToChangeEmailAddress;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly byAddress: AccountsByAddressForMoving,
    private readonly passwords: PasswordHasher,
    private readonly queue: EmailQueue,
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

    if ((await this.byAddress.find(address)) !== undefined) {
      await this.queue.queue({
        kind: "Email.AlreadyHasAnAccount",
        to: address.toString(),
        language: command.language,
        fill: {},
        queuedAt: command.requestedAt,
      });
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
      fill: {
        link: this.links.make(
          "change-email-address",
          account.id,
          until,
          reference,
        ),
      },
      linkWorksUntil: until,
      queuedAt: command.requestedAt,
    });
  }
}
