import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { PlayerOfWebsiteFound } from "./searching.js";

/** Every reason asking for a player of a website can be refused where it is asked. */
export type PlayerOfWebsiteRefusedCode = "PlayerOfWebsite.NotText";

/**
 * The player of the website being read whose page is at "players" followed by
 * `slug`, with each competition they are in. For anybody, so it names nobody.
 * Refused as `PlayerOfWebsite.NoSuchPlayer` where there is none.
 */
export class PlayerOfWebsite extends Query<PlayerOfWebsiteFound> {
  constructor(
    readonly website: string,
    readonly slug: string,
  ) {
    super();
    if (typeof website !== "string" || typeof slug !== "string") {
      throw new ValidationError<PlayerOfWebsiteRefusedCode>(
        "PlayerOfWebsite.NotText",
      );
    }
  }
}
