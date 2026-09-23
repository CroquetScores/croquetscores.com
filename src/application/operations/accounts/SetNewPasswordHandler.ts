import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { RequestType } from "../../common/Mediator.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
import type { Transactions } from "../../services/Transactions.js";
import type { PasswordHasher } from "../../services/PasswordHasher.js";
import { SetNewPassword } from "./SetNewPassword.js";
import { spent, worthOfSetNewPasswordLink } from "./setNewPasswordLinks.js";

/** Every way setting a new password is refused for something but a rule. */
export type SetNewPasswordErrorCode = "Link.NoLongerWorks" | "Link.Expired";

/**
 * Setting a new password refused. Named by a code, because the code is the
 * contract: what a reader is shown for each is the page's to decide.
 */
export class SettingRefused extends Error {
  readonly code: SetNewPasswordErrorCode;

  constructor(code: SetNewPasswordErrorCode, message: string) {
    super(message);
    this.name = "SettingRefused";
    this.code = code;
  }
}

const noLongerWorks = (why: string): SettingRefused =>
  new SettingRefused("Link.NoLongerWorks", `The link ${why}.`);

/**
 * Setting a new password from the link it was emailed.
 *
 * The password's own rules have been asked before this runs, as every
 * command's are on the way in. What is left here is what a validator cannot
 * ask — the account the link names, whether the link still works — and whether
 * the password has been breached, which is asked here.
 *
 * That is why this runs its own transactions, and it is the shape of `handle`.
 * Asking Have I Been Pwned takes as long as another site takes, and a
 * transaction open across it holds a database connection doing nothing; enough
 * of those at once and the site has no connections left. So the reading comes
 * first, in a read-only transaction that is finished with; then the asking,
 * with nothing held; then the writing, in a transaction of its own. A link
 * that was never any good, and a setting already kept, are both settled by the
 * reading, and neither costs Have I Been Pwned a request.
 *
 * A link works once, and what spends it is a setting that was kept: the link
 * is written down among the requests already carried out, so a second
 * submission with the same link finds it there. Written down rather than
 * worked out from when the password was last set, because an account confirmed
 * and a link asked for can share a moment, and a moment cannot tell a link
 * that has just been used from one that has not been used at all.
 */
export class SetNewPasswordHandler extends CommandHandler<
  SetNewPassword,
  AccountId
> {
  readonly handles: RequestType<SetNewPassword> = SetNewPassword;

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

  async handle(command: SetNewPassword): Promise<AccountId> {
    // Read first, on a transaction of its own that is finished with before
    // anything else happens, so that a setting already kept and a link that was
    // never any good are both settled without Have I Been Pwned being asked
    // anything. The asking then happens with nothing held open, and the writing
    // in a transaction of its own after it. See the note on the class.
    const settled = await this.transactions.inReadOnlyTransaction(() =>
      this.read(command),
    );
    if (settled !== undefined) return settled;

    // Asked with no connection held, which is what all of this is for. Refused
    // the way a password too short is refused, because it is the same thing to
    // whoever typed it. A password nobody could check is neither allowed nor
    // refused here; the check's own refusal is let out as it came.
    if (await this.breached.isBreached(command.password.trim())) {
      throw new RequestInvalid(command, [
        { code: "Password.Breached", fields: ["password"] },
      ]);
    }

    return this.transactions.inTransaction(() => this.write(command));
  }

  /**
   * What the reading settles, or nothing when the setting is to go on.
   *
   * A guard rather than a decision: it is over before the writing begins, so
   * what it saw may have changed, and everything it asks is asked again inside
   * the transaction where the answer has to hold. A link found no good here is
   * refused here, because a link no good now will not become good, and that is
   * the answer whoever asked is owed without another site being troubled.
   */
  private async read(command: SetNewPassword): Promise<AccountId | undefined> {
    const kept = await this.alreadyKept(command);
    if (kept !== undefined) return kept;

    await this.accountTheLinkNames(command);
    return undefined;
  }

  /**
   * The account to answer with when this very setting was already kept, and
   * nothing when it was not.
   *
   * Asked before the link is judged, because a setting that was kept spent the
   * link, and judging it now would refuse a retry that ought to be answered as
   * the first sending was. The id is the link and the request id together, so
   * that it is a retry only of a setting sent with that same link: an id is
   * whatever the form's address says, and one claimed by anything else must
   * not pass for a setting that was kept.
   */
  private async alreadyKept(
    command: SetNewPassword,
  ): Promise<AccountId | undefined> {
    const asked = `${spent(command.link)}#${command.requestId}`;
    if (!(await this.handled.wasHandled(asked))) return undefined;

    const carried = this.links.read(command.link);
    return carried?.purpose === "set-new-password"
      ? carried.account
      : undefined;
  }

  /**
   * The account a working link names, or a refusal saying what is wrong with
   * the link.
   *
   * Asked by both halves, once either side of the stretch where the password
   * is asked about, so that the question and the refusals it raises are
   * written once and cannot drift apart.
   */
  private async accountTheLinkNames(command: SetNewPassword): Promise<Account> {
    const judged = await worthOfSetNewPasswordLink(
      this.links,
      this.accounts,
      this.handled,
      command.link,
      command.requestedAt,
    );
    if (judged.worth !== "Link.Works") {
      throw judged.worth === "Link.Expired"
        ? new SettingRefused(
            "Link.Expired",
            "The link has stopped working, and a new one can be asked for.",
          )
        : noLongerWorks("cannot set a password");
    }
    return judged.account;
  }

  private async write(command: SetNewPassword): Promise<AccountId> {
    // Both asked again inside the transaction that keeps the work, because the
    // reading before the password was asked about is over by now and may have
    // gone stale. These are the answers that count.
    const kept = await this.alreadyKept(command);
    if (kept !== undefined) return kept;

    const account = await this.accountTheLinkNames(command);
    const asked = `${spent(command.link)}#${command.requestId}`;

    // Claimed once the link is known to be good, so that a setting sent twice
    // at once sets one password: the second waits on the first's claim, and
    // finds it made. A retry of a refused setting is refused again, as it
    // should be, since a refused setting's claim is rolled back.
    if (!(await this.handled.claim(asked, command.requestedAt))) {
      return account.id;
    }

    // And the link itself, so that it works once: a second submission carries
    // an id of its own and would otherwise set a second password. It is
    // claimed here rather than worked out from when the password was last set,
    // because the two can be the same moment — an account confirmed and a link
    // asked for in the same second — and a moment cannot tell those apart. A
    // setting that is refused after this rolls the claim back with everything
    // else, so a link is only spent by a setting that was kept.
    if (!(await this.handled.claim(spent(command.link), command.requestedAt))) {
      throw noLongerWorks("has already set a password");
    }

    // Made from what the validator has already found sound.
    const password = Password.from(command.password);
    account.setNewPassword(
      await this.passwords.hash(password.reveal()),
      command.requestedAt,
    );
    await this.accounts.save(account);
    return account.id;
  }
}
