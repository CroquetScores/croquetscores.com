import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import { PersonName } from "../../../domain/aggregates/accounts/value-objects/PersonName.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { RequestType } from "../../common/Mediator.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
import type { Transactions } from "../../services/Transactions.js";
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
 * The name and the password have had their own rules asked before this runs,
 * as every command's are on the way in. What is left here is everything a
 * validator cannot ask — the account the link names, whether it has been
 * forgotten or confirmed, whether the link has expired — and whether the
 * password has been breached, which is asked here rather than in front of
 * everything.
 *
 * That is why this runs its own transactions, and it is the shape of the whole
 * method. Asking Have I Been Pwned takes as long as another site takes, and a
 * transaction open across it holds a database connection doing nothing; enough
 * of those at once and the site has no connections left. So the reading comes
 * first, in a read-only transaction that is finished with; then the asking,
 * with nothing held; then the writing, in a transaction of its own. A link
 * that was never any good, and a confirmation already carried out, are both
 * settled by the reading, and neither costs Have I Been Pwned a request.
 *
 * The reading is a guard and not a decision. It is over before the writing
 * begins, so what it saw may have changed; everything it asked is asked again
 * inside the transaction, where the answer has to hold. What it saves is the
 * asking, not the checking.
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
    private readonly handled: HandledRequests,
    private readonly transactions: Transactions,
    private readonly breached: BreachedPasswords,
  ) {
    super();
  }

  async handle(command: ConfirmEmailAddress): Promise<void> {
    // Read first, and on a transaction of its own that is finished with before
    // anything else happens. What this settles — a confirmation already
    // carried out, a link that was never any good — is settled without Have I
    // Been Pwned being asked anything at all, which is the whole reason the
    // reading is separated from the writing.
    const worth = await this.transactions.inReadOnlyTransaction(async () => {
      if (await this.handled.wasHandled(command.requestId)) return "Handled";

      const judged = await worthOfConfirmationLink(
        this.links,
        this.accounts,
        command.link,
        command.requestedAt,
      );
      return judged.worth;
    });

    // A confirmation already kept, sent again because its answer was lost, is
    // answered as the first was: it confirmed, and says so by answering
    // nothing. Judging the link now would refuse it, the first confirmation
    // having spent it.
    if (worth === "Handled") return;
    if (worth !== "Link.Works") throw new ConfirmingRefused(worth, said[worth]);

    // Asked with no connection held, which is what all of this is for: the
    // request goes to another site and is given as long as it takes, and no
    // transaction is waiting on it. Refused the way a password too short is
    // refused, because it is the same thing to whoever typed it. A password
    // nobody could check is neither allowed nor refused here; the check's own
    // refusal is let out as it came.
    if (await this.breached.isBreached(command.password.trim())) {
      throw new RequestInvalid(command, [
        { code: "Password.Breached", fields: ["password"] },
      ]);
    }

    await this.transactions.inTransaction(async () => {
      // Claimed inside the transaction that keeps the work, so that the id is
      // remembered if and only if the confirmation was. The reading above is
      // over by now and may have gone stale, so everything it asked is asked
      // again here, where the answer has to hold.
      if (!(await this.handled.claim(command.requestId, command.requestedAt))) {
        return;
      }

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

      account.confirm(
        name,
        await this.passwords.hash(password.reveal()),
        command.requestedAt,
      );
      await this.accounts.save(account);
    });
  }
}
