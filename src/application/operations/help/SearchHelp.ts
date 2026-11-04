import { Query } from "../../common/Query.js";
import type { HelpSearchResult } from "../../services/HelpSearchIndex.js";

/**
 * The pages of the help in the language with `tag` that have any of the words
 * `query` names, best first (helpSearch.feature). The words are already
 * expanded, and `rules` already chosen, by whoever knows the language.
 */
export class SearchHelp extends Query<readonly HelpSearchResult[]> {
  constructor(
    /** The language, by the tag the site knows it by. */
    readonly tag: string,
    /** What Postgres calls the rules the language is searched by. */
    readonly rules: string,
    /** Quoted words joined by " | ". */
    readonly query: string,
  ) {
    super();
  }
}
