import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import type { LinkCarried, Links } from "../../services/Links.js";
import { ConfirmEmailAddress } from "./ConfirmEmailAddress.js";

/** Every reason confirming is refused. */
export type ConfirmEmailAddressErrorCode =
  "Link.NoLongerWorks" | "Link.Expired" | "Account.AlreadyConfirmed";

/**
 * Confirming refused. Named by a code, because the code is the contract: what
 * a reader is shown for each — a page saying it is done, one offering a new
 * link, one saying the link is no good — is the page's to decide.
 */
export class ConfirmingRefused extends Error {
  readonly code: ConfirmEmailAddressErrorCode;

  constructor(code: ConfirmEmailAddressErrorCode, message: string) {
    super(message);
    this.name = "ConfirmingRefused";
    this.code = code;
  }
}

const noLongerWorks = (why: string): ConfirmingRefused =>
  new ConfirmingRefused("Link.NoLongerWorks", `The link ${why}.`);

/**
 * Confirming an account's email address from the link it was emailed.
 *
 * The order the refusals come in is the point of them. A link is only ever
 * called expired once it is known to be one of ours, unaltered, and for an
 * account that could still be confirmed — because an expired link is not the
 * end of it: it still shows which account it was sent for and can be traded
 * for a new one, and saying that of a link nobody here made, or of an account
 * that is forgotten, would offer a trade that cannot be made.
 */
export class ConfirmEmailAddressHandler extends CommandHandler<
  ConfirmEmailAddress,
  void
> {
  readonly handles: RequestType<ConfirmEmailAddress> = ConfirmEmailAddress;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
  ) {
    super();
  }

  async handle(command: ConfirmEmailAddress): Promise<void> {
    const carried = this.carriedBy(command.link);
    const account = await this.accounts.load(carried.account);

    // An account the link names and the store has never heard of is a link
    // nobody here made for anything that exists.
    if (account === undefined) throw noLongerWorks("names no account");

    // Forgotten before expired, and confirmed before expired, because an
    // expired link is only worth telling apart when there is still something
    // to trade it for.
    if (account.forgotten) throw noLongerWorks("is for a forgotten account");
    if (account.confirmed) {
      throw new ConfirmingRefused(
        "Account.AlreadyConfirmed",
        "The account's email address is already confirmed.",
      );
    }
    if (carried.worksUntil.toDate() < command.requestedAt.toDate()) {
      throw new ConfirmingRefused(
        "Link.Expired",
        "The link has stopped working, and a new one can be asked for.",
      );
    }

    account.confirm(command.requestedAt);
    await this.accounts.save(account);
  }

  private carriedBy(link: string): LinkCarried {
    const carried = this.links.read(link);
    if (carried === undefined) throw noLongerWorks("was not made here");
    // A link made for something else is refused as one that does not work,
    // rather than followed: what it is for is signed with the rest exactly so
    // that one cannot stand in for another.
    if (carried.purpose !== "confirm-email-address") {
      throw noLongerWorks("was made for something else");
    }
    return carried;
  }
}
