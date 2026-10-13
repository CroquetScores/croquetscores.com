import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { SearchFound } from "./searching.js";

/** Every reason searching a website can be refused where it is asked. */
export type SearchRefusedCode = "Search.NotText";

/**
 * The tournaments, the players and the competitions of the website being read
 * that the words of `text` are found in. For anybody, so it names nobody.
 */
export class Search extends Query<SearchFound> {
  constructor(
    readonly website: string,
    readonly text: string,
  ) {
    super();
    if (typeof website !== "string" || typeof text !== "string") {
      throw new ValidationError<SearchRefusedCode>("Search.NotText");
    }
  }
}
