import { Query } from "../../common/Query.js";
import type { TournamentFingerprint } from "./tournamentsOfWebsite.js";

/**
 * A mark for each tournament of a website, none archived, that changes
 * whenever anything is kept of the tournament or of any of its competitions,
 * and not otherwise, so that whoever copies the tournaments somewhere can tell
 * which have changed since they last did (exportTournamentsCli.feature).
 *
 * It is made of what was kept and not of when, since a moment says nothing of
 * an append that was made at the same time as another, or that a slow
 * transaction kept after a later one.
 */
export class TournamentFingerprints extends Query<
  readonly TournamentFingerprint[]
> {
  constructor(
    /** The host of the website, which is how a website is known. */
    readonly website: string,
  ) {
    super();
  }
}
