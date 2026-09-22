import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import {
  worthOfConfirmationLink,
  type ConfirmationLinkWorth,
} from "./confirmationLinks.js";
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

// Why each answer but "it would confirm" is refused, in the words the log
// reads. The codes are the contract, and the same codes the page shows a reader
// a page for, so they are not restated here.
const said: Readonly<
  Record<Exclude<ConfirmationLinkWorth, "Link.Works">, string>
> = {
  "Link.NoLongerWorks":
    "The link was not made here, was made for something else, or is for an account that cannot be confirmed.",
  "Link.Expired":
    "The link has stopped working, and a new one can be asked for.",
  "Account.AlreadyConfirmed":
    "The account's email address is already confirmed.",
};

/**
 * Confirming an account's email address from the link it was emailed, and the
 * name and password submitted with it.
 *
 * What is asked, and in what order, is the substance of this. The link is
 * judged first, because a link that no longer works leaves nothing to have
 * typed into and a reader whose link has expired is owed that rather than a
 * complaint about their password. That judgement is in `confirmationLinks.ts`,
 * because the page the link opens asks it too, before it shows the form.
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

    // The same question the page the link opened asked, of the same place, so
    // that what the reader was shown and what their submission is answered
    // with cannot disagree.
    const judged = await worthOfConfirmationLink(
      this.links,
      this.accounts,
      command.link,
      command.requestedAt,
    );
    if (judged.worth !== "Link.Works") {
      throw new ConfirmingRefused(judged.worth, said[judged.worth]);
    }
    const { account } = judged;

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
}
