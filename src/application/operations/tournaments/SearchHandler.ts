import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { Search } from "./Search.js";
import {
  MOST_FOUND,
  type SearchByWebsite,
  type SearchFound,
  wordsOfSearch,
} from "./searching.js";

export class SearchHandler extends QueryHandler<Search, SearchFound> {
  readonly handles: RequestType<Search> = Search;

  constructor(private readonly searched: SearchByWebsite) {
    super();
  }

  async handle(query: Search): Promise<SearchFound> {
    const words = wordsOfSearch(query.text);
    // Nothing to find by is nothing found, rather than everything.
    if (words.length === 0) {
      return { tournaments: [], players: [], competitions: [] };
    }
    const website = Website.from(query.website);
    const [tournaments, players, competitions] = await Promise.all([
      this.searched.tournaments(website, words, MOST_FOUND),
      this.searched.players(website, words, MOST_FOUND),
      this.searched.competitions(website, words, MOST_FOUND),
    ]);
    return { tournaments, players, competitions };
  }
}
