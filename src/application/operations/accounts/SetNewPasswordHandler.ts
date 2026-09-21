import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../domain/aggregates/accounts/value-objects/AccountId.js";
import { Password } from "../../../domain/aggregates/accounts/value-objects/Password.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { RequestInvalid } from "../../common/ValidationBehaviour.js";
import type { BreachedPasswords } from "../../services/BreachedPasswords.js";
import type { HandledRequests } from "../../services/HandledRequests.js";
import type { Links } from "../../services/Links.js";
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
 * The link is judged before the password is sent anywhere, as confirming does
 * it and for the same reason: a password is not handed to an outside service
 * for a link that was never going to set anything.
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
    private readonly breached: BreachedPasswords,
    private readonly handled: HandledRequests,
  ) {
    super();
  }

  async handle(command: SetNewPassword): Promise<AccountId> {
    // The request id is claimed with the link it came with, so that it is a
    // retry only of a setting sent with that same link. An id is whatever the
    // form's address says, and one claimed by anything else — another command,
    // or a setting with another link — must not pass for a setting that was
    // kept, which would answer as though a password had been set when none was.
    const asked = `${spent(command.link)}#${command.requestId}`;

    // A setting already kept, sent again because its answer was lost, is
    // answered as the first was. Asked before the link is judged, because the
    // first setting spent it, and judged now it would be refused.
    if (await this.handled.wasHandled(asked)) {
      const carried = this.links.read(command.link);
      if (carried?.purpose === "set-new-password") return carried.account;
    }

    // The same question the page the link opened asked, of the same place, so
    // that what the reader was shown and what their submission is answered
    // with cannot disagree.
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
    const { account } = judged;

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
    if (await this.breached.isBreached(password.reveal())) {
      throw new RequestInvalid(command, [
        { code: "Password.Breached", fields: ["password"] },
      ]);
    }

    account.setNewPassword(
      await this.passwords.hash(password.reveal()),
      command.requestedAt,
    );
    await this.accounts.save(account);
    return account.id;
  }
}
