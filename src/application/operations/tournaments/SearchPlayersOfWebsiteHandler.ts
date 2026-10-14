import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { SearchPlayersOfWebsite } from "./SearchPlayersOfWebsite.js";
import {
  MOST_FOUND,
  type PlayersFound,
  type SearchByWebsite,
  wordsOfSearch,
} from "./searching.js";

export class SearchPlayersOfWebsiteHandler extends QueryHandler<
  SearchPlayersOfWebsite,
  PlayersFound
> {
  readonly handles: RequestType<SearchPlayersOfWebsite> =
    SearchPlayersOfWebsite;

  constructor(private readonly searched: SearchByWebsite) {
    super();
  }

  async handle(query: SearchPlayersOfWebsite): Promise<PlayersFound> {
    const words = wordsOfSearch(query.text);
    // Nothing to find by is nobody, rather than everybody.
    if (words.length === 0) return { players: [], more: false };
    const found = await this.searched.players(
      Website.from(query.website),
      words,
      MOST_FOUND,
    );
    return { players: found.found, more: found.more };
  }
}
