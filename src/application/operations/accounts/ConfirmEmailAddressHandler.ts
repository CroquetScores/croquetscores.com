import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { LinkCarried, Links } from "../../services/Links.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import { ConfirmEmailAddress } from "./ConfirmEmailAddress.js";

/** Every way confirming is refused for something other than a broken rule. */
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
 * Confirming an account's email address from the link it was emailed, and the
 * name and password submitted with it.
 *
 * What is asked, and in what order, is the substance of this. The link is
 * judged first, because a link that no longer works leaves nothing to have
 * typed into and a reader whose link has expired is owed that rather than a
 * complaint about their password. A link is only ever called expired once it
 * is known to be one of ours, unaltered, and for an account that could still
 * be confirmed — because an expired link is not the end of it: it still shows
 * which account it was sent for and can be traded for a new one, and offering
 * that trade for an account that is forgotten, or already confirmed, would be
 * offering something that cannot be had.
 *
 * The name and the password have been asked about before this runs: their
 * rules are the command's own, and every command's rules are asked on the way
 * in. So what is left here is everything a validator cannot ask — the account
 * the link names, whether it has been forgotten or confirmed, whether the link
 * has expired, and whether the password has been breached, which is a request
 * over the network.
 */
export class ConfirmEmailAddressHandler extends CommandHandler<
  ConfirmEmailAddress,
  void
> {
  readonly handles: RequestType<ConfirmEmailAddress> = ConfirmEmailAddress;

  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly links: Links,
    private readonly passwords: PasswordHasher,
    private readonly breached: BreachedPasswords,
    private readonly handled: HandledRequests,
  ) {
    super();
  }

  async handle(command: ConfirmEmailAddress): Promise<void> {
    // Claimed before anything is done, so that a confirmation sent twice
    // because its answer was lost confirms once and is answered as the first
    // was. A second submission carries an id of its own and is not this.
    if (!(await this.handled.claim(command.requestId, command.requestedAt))) {
      return;
    }

    const carried = this.carriedBy(command.link);
    const account = await this.accounts.load(carried.account);

    // An account the link names and the store has never heard of is a link
    // nobody here made for anything that exists.
    if (account === undefined) throw noLongerWorks("names no account");
    if (account.forgotten) throw noLongerWorks("is for a forgotten account");

    // Asked here rather than of the account, because the account says nothing
    // about it: confirming a confirmed account records nothing and refuses
    // nothing. Without this a second submission would be answered as though it
    // had confirmed the address, under a name and a password thrown away.
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

    // Made from what the validator has already found sound, so neither can
    // refuse here.
    const name = PersonName.from(command.name);
    const password = Password.from(command.password);

    // Asked after the link, so a password is not sent anywhere for a link that
    // was never going to confirm anything; and before it is hashed, so a
    // breached one costs no hash either.
    if (await this.breached.isBreached(password.reveal())) {
      throw new RequestInvalid(command, [
        { code: "Password.Breached", fields: ["password"] },
      ]);
    }

    account.confirm(
      name,
      await this.passwords.hash(password.reveal()),
      command.requestedAt,
    );
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
