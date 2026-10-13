import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { SearchPlayersOfWebsite } from "./SearchPlayersOfWebsite.js";
import {
  MOST_FOUND,
  type PlayerFound,
  type SearchByWebsite,
  wordsOfSearch,
} from "./searching.js";

export class SearchPlayersOfWebsiteHandler extends QueryHandler<
  SearchPlayersOfWebsite,
  readonly PlayerFound[]
> {
  readonly handles: RequestType<SearchPlayersOfWebsite> =
    SearchPlayersOfWebsite;

  constructor(private readonly searched: SearchByWebsite) {
    super();
  }

  handle(query: SearchPlayersOfWebsite): Promise<readonly PlayerFound[]> {
    const words = wordsOfSearch(query.text);
    // Nothing to find by is nobody, rather than everybody.
    if (words.length === 0) return Promise.resolve([]);
    return this.searched.players(
      Website.from(query.website),
      words,
      MOST_FOUND,
    );
  }
}
