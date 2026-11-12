import type { TournamentDetails } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { EmailQueue } from "../../services/EmailQueue.js";

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
  const level = details.international
    ? "international"
    : details.national
      ? "national"
      : undefined;
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
