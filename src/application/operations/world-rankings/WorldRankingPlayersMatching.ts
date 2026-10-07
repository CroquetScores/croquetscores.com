import { Query } from "../../common/Query.js";

/** What a name typed may be, as a player dialog shows it. */
export interface PlayersMatching {
  /** The players whose names the typing may be the start of. */
  readonly players: readonly string[];
  /** Whether what was typed is a name the world rankings know exactly. */
  readonly known: boolean;
}

/**
 * The world ranking players of the sport `sport` a name typed may be, and
 * whether the world rankings know it (WorldRankingPlayersMatching.feature).
 * A code that is not a sport with world rankings is refused as
 * `WorldRankingPlayersMatching.NoSuchSport`.
 */
export class WorldRankingPlayersMatching extends Query<PlayersMatching> {
  constructor(
    /** The sport, by its code: "ac" or "gc". */
    readonly sport: string,
    /** What was typed, as it was typed. */
    readonly typed: string,
  ) {
    super();
  }
}
