import { Query } from "../../common/Query.js";

/**
 * What the tournaments of a website are called, each name once and in order of
 * the name, for the form that names a tournament to suggest from. None that is
 * archived, as no list of a website's tournaments has one. For anybody who may
 * create a tournament, but the names are those of the website's public pages,
 * so it names no account.
 */
export class TournamentNamesOfWebsite extends Query<readonly string[]> {
  constructor(
    /** The host of the website, which is how a website is known. */
    readonly website: string,
  ) {
    super();
  }
}
