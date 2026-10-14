import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { PlayerOfWebsite } from "./PlayerOfWebsite.js";
import type { PlayerOfWebsiteFound, SearchByWebsite } from "./searching.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";

export class PlayerOfWebsiteHandler extends QueryHandler<
  PlayerOfWebsite,
  PlayerOfWebsiteFound
> {
  readonly handles: RequestType<PlayerOfWebsite> = PlayerOfWebsite;

  constructor(private readonly searched: SearchByWebsite) {
    super();
  }

  async handle(query: PlayerOfWebsite): Promise<PlayerOfWebsiteFound> {
    const found = await this.searched.player(
      Website.from(query.website),
      query.slug,
    );
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "PlayerOfWebsite.NoSuchPlayer",
        "There is no such player.",
      );
    }
    return found;
  }
}
