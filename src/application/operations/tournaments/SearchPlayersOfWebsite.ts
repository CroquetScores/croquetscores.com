import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { PlayersFound } from "./searching.js";

/** Every reason searching the players can be refused where it is asked. */
export type SearchPlayersOfWebsiteRefusedCode =
  "SearchPlayersOfWebsite.NotText";

/**
 * The players of the website being read whose names the words of `text` are
 * found in, as the page of players answers a search. For anybody, so it names
 * nobody.
 */
export class SearchPlayersOfWebsite extends Query<PlayersFound> {
  constructor(
    readonly website: string,
    readonly text: string,
  ) {
    super();
    if (typeof website !== "string" || typeof text !== "string") {
      throw new ValidationError<SearchPlayersOfWebsiteRefusedCode>(
        "SearchPlayersOfWebsite.NotText",
      );
    }
  }
}
