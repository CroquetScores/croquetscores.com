import { Refused } from "../../../domain/common/Refused.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { WorldRankingSport } from "../../services/WorldRankingLists.js";
import type { WorldRankingPlayerNames } from "../../services/WorldRankingPlayers.js";
import {
  type PlayersMatching,
  WorldRankingPlayersMatching,
} from "./WorldRankingPlayersMatching.js";

/** Why finding the players a name may be is refused. */
export type WorldRankingPlayersErrorCode =
  "WorldRankingPlayersMatching.NoSuchSport";

/**
 * Finding them refused, named by its code. The code is what whoever asked
 * decides by; the message is only for whoever reads the log.
 */
export class WorldRankingPlayersRefused extends Refused<WorldRankingPlayersErrorCode> {}

// One letter begins the names of thousands of players, so nobody is found for
// less than two.
const FEWEST_CHARACTERS = 2;

// As many as can be chosen from at a glance. A manager who has not found
// their player among them types more.
const MOST_FOUND = 10;

const isWorldRankingSport = (code: string): code is WorldRankingSport =>
  code === "ac" || code === "gc";

/**
 * The players a name typed may be, and whether it is one the world rankings
 * know (WorldRankingPlayersMatching.feature).
 */
export class WorldRankingPlayersMatchingHandler extends QueryHandler<
  WorldRankingPlayersMatching,
  PlayersMatching
> {
  readonly handles: RequestType<WorldRankingPlayersMatching> =
    WorldRankingPlayersMatching;

  constructor(private readonly names: WorldRankingPlayerNames) {
    super();
  }

  async handle(query: WorldRankingPlayersMatching): Promise<PlayersMatching> {
    const { sport } = query;
    if (!isWorldRankingSport(sport)) {
      throw new WorldRankingPlayersRefused(
        "WorldRankingPlayersMatching.NoSuchSport",
        "There are no world ranking players of that sport.",
      );
    }
    const typed = query.typed.trim();
    return {
      players:
        [...typed].length < FEWEST_CHARACTERS
          ? []
          : await this.names.beginning(sport, typed, MOST_FOUND),
      known: await this.names.has(sport, typed),
    };
  }
}
