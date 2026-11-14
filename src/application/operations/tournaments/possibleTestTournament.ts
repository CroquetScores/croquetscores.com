import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../../domain/common/Website.js";
import type { EmailQueue } from "../../services/EmailQueue.js";

// Whole words, so that "Contest Open" and "Fakeland Cup" are left alone: a
// name that merely holds the letters is far more often a real tournament than
// a test one. The issue spelled the third word "dumy", which is taken as a
// slip for "dummy" and not looked for as written. Names are the manager's own
// words in any language, but only the English ones are looked for: they are
// what somebody learning the site types.
const looksLikeATest = /\b(?:test|fake|dummy)\b/i;

/**
 * Telling the administrator of a tournament whose name suggests it was only a
 * test, in the transaction that keeps it so that they are told if and only if
 * it is kept, with a link to its page in the admin to look at and remove it
 * from. Nothing on a try website, which is where a
 * reader is sent to make test tournaments.
 *
 * Only creating is looked at: a tournament renamed afterwards is not, since
 * somebody who has been through a name once chose it.
 *
 * In English whatever language the reader was using, as the email about a
 * notable tournament is.
 */
export const tellOfPossibleTestTournament = async (
  queue: EmailQueue,
  administratorEmailAddress: string,
  tournament: {
    readonly name: string;
    readonly address: string;
    readonly website: Website;
  },
  at: ReadOnlyDate,
): Promise<void> => {
  if (tournament.website.isTry) return;
  if (!looksLikeATest.test(tournament.name)) return;
  await queue.queue({
    kind: "Email.PossibleTestTournament",
    to: administratorEmailAddress,
    language: "en",
    website: tournament.website.host,
    fill: { tournament: tournament.name, address: tournament.address },
    queuedAt: at,
  });
};
