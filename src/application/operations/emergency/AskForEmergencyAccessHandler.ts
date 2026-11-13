import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Refused } from "../../../domain/common/Refused.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import type { RequestType } from "../../common/Mediator.js";
import type { EmailQueue } from "../../services/EmailQueue.js";
import type { EmailsWritten, WrittenTo } from "../../services/EmailsWritten.js";
import { AskForEmergencyAccess } from "./AskForEmergencyAccess.js";

/** Why asking for emergency access is refused. */
export type EmergencyAccessErrorCode =
  | "EmergencyAccess.MessageMissing"
  | "EmergencyAccess.MessageTooLong"
  | "EmergencyAccess.NoContacts"
  | "EmergencyAccess.NoSuchAccount"
  | "EmergencyAccess.TooSoon";

export class EmergencyAccessRefused extends Refused<EmergencyAccessErrorCode> {}

/** The most characters a message may have, once trimmed. */
export const MOST_CHARACTERS = 2000;

/**
 * How long an account waits before it may ask again. The two people asked may
 * be slow to answer, away, or grieving, and asking again before they have had
 * time only doubles what they have to read: a message with a slip in it is put
 * right by answering the one already sent.
 */
export const HOURS_BETWEEN_ASKINGS = 48;

const KIND = "Email.EmergencyAccessAsked";

const A_DAY = 24 * AN_HOUR;

/**
 * How long ago an account was begun, in the one unit a reader takes in at a
 * glance: days for the first month, then months, then years. The people asked
 * read it to judge whether an account is new, so more precision is not wanted.
 */
const ageOf = (began: ReadOnlyDate | undefined, now: ReadOnlyDate): string => {
  if (began === undefined)
    return "on the old site, and how long ago is not known";
  const days = Math.floor(
    (now.toDate().getTime() - began.toDate().getTime()) / A_DAY,
  );
  const counted = (count: number, unit: string): string =>
    `${count} ${unit}${count === 1 ? "" : "s"}`;
  if (days < 1) return "less than a day ago";
  if (days < 31) return `${counted(days, "day")} ago`;
  // At most 11, so that the last days of a year are not "12 months".
  if (days < 365) {
    return `${counted(Math.min(11, Math.floor(days / 30)), "month")} ago`;
  }
  return `${counted(Math.floor(days / 365), "year")} ago`;
};

/**
 * Emailing each of the people who hold the site's passwords what somebody
 * said when they asked for them (AskForEmergencyAccess.feature).
 *
 * Counted where every email is counted, once for each asking and not once for
 * each person emailed, and with the account held until this transaction ends,
 * so that two askings at once from one account are sent once between them.
 */
export class AskForEmergencyAccessHandler extends CommandHandler<
  AskForEmergencyAccess,
  void
> {
  readonly handles: RequestType<AskForEmergencyAccess> = AskForEmergencyAccess;

  /**
   * @param contacts the addresses of the people asked. They are a setting and
   *   nothing in the code, because the code is public and they are not meant
   *   to be.
   */
  constructor(
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly queue: EmailQueue,
    private readonly written: EmailsWritten,
    private readonly contacts: readonly string[],
  ) {
    super();
  }

  async handle(command: AskForEmergencyAccess): Promise<void> {
    const message = command.message.trim();
    if (message === "") {
      throw new EmergencyAccessRefused(
        "EmergencyAccess.MessageMissing",
        "Nothing was said.",
      );
    }
    if (Array.from(message).length > MOST_CHARACTERS) {
      throw new EmergencyAccessRefused(
        "EmergencyAccess.MessageTooLong",
        `More than ${MOST_CHARACTERS} characters were said.`,
      );
    }
    if (this.contacts.length === 0) {
      throw new EmergencyAccessRefused(
        "EmergencyAccess.NoContacts",
        "The site has nobody to ask.",
      );
    }

    // Made sure of by the command, which refuses to be made without one.
    const asking = command.requestedBy;
    if (asking === undefined) {
      throw new Error("An asking for emergency access names no account.");
    }
    const account = await this.accounts.load(asking);
    const name = account?.name;
    if (
      account === undefined ||
      account.forgotten ||
      !account.confirmed ||
      name === undefined
    ) {
      throw new EmergencyAccessRefused(
        "EmergencyAccess.NoSuchAccount",
        "The account that asked cannot be found.",
      );
    }

    // After the account is known, so that one that cannot ask at all is told
    // so and not told to wait two days and be refused again.
    const whom: WrittenTo = { emergencyAccessBy: asking };
    const since = shiftedBy(
      command.requestedAt,
      -HOURS_BETWEEN_ASKINGS * AN_HOUR,
    );
    if ((await this.written.countSince(whom, since)) > 0) {
      throw new EmergencyAccessRefused(
        "EmergencyAccess.TooSoon",
        "This account has asked lately.",
      );
    }

    for (const contact of this.contacts) {
      await this.queue.queue({
        kind: KIND,
        to: contact,
        // The sender's account, so that an account forgotten before this is
        // sent is not told to anybody: what is said here is theirs.
        account: asking,
        replyTo: account.emailAddress.toString(),
        // The site's own language: the people asked read what the site is
        // written in, not whatever the sender's browser asked for.
        language: "en",
        website: command.website,
        fill: {
          message,
          senderName: name.toString(),
          senderEmailAddress: account.emailAddress.toString(),
          when: command.requestedAt.toDate().toISOString(),
          accountAge: ageOf(account.registeredAt, command.requestedAt),
        },
        queuedAt: command.requestedAt,
      });
    }
    await this.written.record(whom, KIND, command.requestedAt);
  }
}
