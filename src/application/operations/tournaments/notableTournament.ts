import type { TournamentDetails } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
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
 * told if and only if it is kept. Nothing where it is neither.
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
    readonly website: string;
  },
  details: Pick<TournamentDetails, "national" | "international">,
  change: "added" | "edited",
  at: ReadOnlyDate,
): Promise<void> => {
  const level = notableLevelOf(details);
  if (level === undefined) return;
  await queue.queue({
    kind: "Email.NotableTournament",
    to: administratorEmailAddress,
    language: "en",
    website: tournament.website,
    fill: {
      level,
      change,
      tournament: tournament.name,
      address: tournament.address,
    },
    queuedAt: at,
  });
};
