import { Query } from "../../common/Query.js";

/**
 * What the competitions of a website are called, each name once and the most
 * used first, for the dialog that names a competition to suggest from: those
 * in use in tournaments that are not archived, except any name the tournament
 * `tournament` already has, since another of its competitions with it would be
 * refused (`Tournament.CompetitionNameTaken`). The names are those of the
 * website's public pages, so it names no account.
 */
export class CompetitionNamesOfWebsite extends Query<readonly string[]> {
  constructor(
    /** The host of the website, which is how a website is known. */
    readonly website: string,
    /** The id of the tournament the competition is being named in. */
    readonly tournament: string,
  ) {
    super();
  }
}
