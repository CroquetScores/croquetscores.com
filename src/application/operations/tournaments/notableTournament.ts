import type { TournamentDetails } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { Website } from "../../../domain/common/Website.js";
import type { EmailQueue } from "../../services/EmailQueue.js";

/**
 * Which level a tournament is notable at, or nothing where it is neither. The
 * one place that says it, since the tournament refuses to be both
 * (`create.feature`) and a reader of either must agree on which wins.
 */
export const notableLevelOf = (
  tournament: Pick<TournamentDetails, "national" | "international">,
): "national" | "international" | undefined =>
  tournament.international
    ? "international"
    : tournament.national
      ? "national"
      : undefined;

/**
 * Telling the administrator of a tournament that is national or international,
 * which is the more notable, in the transaction that keeps it so that they are
 * told if and only if it is kept. Nothing where it is neither, and nothing on a
 * try website, where what is entered is practice and may be removed.
 *
 * In English whatever language the reader who made the change was using: the
 * administrator reads the site's own language, as when a service cannot be
 * reached (`ReportUnreachableServiceHandler`).
 */
export const tellOfNotableTournament = async (
  queue: EmailQueue,
  administratorEmailAddress: string,
  tournament: {
    readonly name: string;
    readonly address: string;
    readonly website: Website;
  },
  details: Pick<TournamentDetails, "national" | "international">,
  change: "added" | "edited",
  at: ReadOnlyDate,
): Promise<void> => {
  // A try website is for learning the system and what is entered there may be
  // removed, so a notable tournament there is practice and not news. Decided
  // here, by the website the tournament was created on, rather than by each
  // handler, so that creating and updating cannot disagree.
  if (tournament.website.isTry) return;
  const level = notableLevelOf(details);
  if (level === undefined) return;
  await queue.queue({
    kind: "Email.NotableTournament",
    to: administratorEmailAddress,
    language: "en",
    website: tournament.website.host,
    fill: {
      level,
      change,
      tournament: tournament.name,
      address: tournament.address,
    },
    queuedAt: at,
  });
};
