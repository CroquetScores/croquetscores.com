// What the public API asks of the read models that keep what is in a
// tournament, so that it asks the events nothing (TournamentContents.feature).
// The application names what it asks; the infrastructure keeps the answer.
import type { CompetitionHead } from "./competitionForApps.js";
import type { TournamentForAppsRead } from "./TournamentForApps.js";

/** A competition looked for by the ids an app was given, or why it is not found. */
export type CompetitionOfApps =
  | { readonly found: "no tournament" }
  | { readonly found: "no competition" }
  | {
      readonly found: "competition";
      readonly head: CompetitionHead;
      /** Where its page is on the public site, as "2026/ac/spring-open/competitions/block-a". */
      readonly address: string;
    };

export interface TournamentContents {
  /**
   * The tournament `tournament`, by its id, of the website `website`, with its
   * competitions in use, its players and its teams; nothing where there is
   * none there, or it is archived, and nothing for what is no id at all.
   */
  tournament(
    website: string,
    tournament: string,
  ): Promise<TournamentForAppsRead | undefined>;

  /**
   * The competition `competition` of the tournament `tournament`, not
   * archived, or why there is none.
   */
  competition(
    website: string,
    tournament: string,
    competition: string,
  ): Promise<CompetitionOfApps>;
}
