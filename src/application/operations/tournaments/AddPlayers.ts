import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { TournamentPlayerDetails } from "../../../domain/aggregates/tournaments/TournamentPlayer.js";

/**
 * What each field of a list of players may be called, in any case, and what it
 * is of a player. The names are the ones a manager sees in the players dialog.
 */
export const playerFieldNamed: Readonly<
  Record<string, keyof TournamentPlayerDetails>
> = {
  name: "name",
  representing: "representing",
  flag: "flag",
  handicap: "handicap",
  worldrankingplayername: "worldRankingName",
};

/**
 * What a field written in a list is of a player, or nothing where it is no
 * field there is. Only the table's own names count: a name such as
 * "constructor" is one every object has, and is no field.
 */
export const playerFieldOf = (
  written: string,
): keyof TournamentPlayerDetails | undefined => {
  const name = written.trim().toLowerCase();
  return Object.hasOwn(playerFieldNamed, name)
    ? playerFieldNamed[name]
    : undefined;
};

/**
 * The most players one list may hold. A list is added in one save, and each
 * player is asked about against every player already there, so a list that
 * had no end would make the work grow with the square of its length.
 */
export const mostPlayersAtOnce = 500;

/**
 * Adding several players to a tournament at once, all of them or none. It is
 * answered with the new players' ids, in the order the players were given.
 *
 * The players come as they were written: the names of the fields, and for each
 * player a value for each of them, in the same order. Whether the fields are
 * ones there are and every player has a value for each is the validator's to
 * say, so that a list is refused in one place however it arrives.
 */
export class AddPlayers extends Command<readonly TournamentPlayerId[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The field each value is of, as it was written. */
    readonly fields: readonly string[],
    /** The values of each player to be added, in the order they are to come. */
    readonly rows: readonly (readonly string[])[],
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }

  /** What each row says a player is, every value trimmed. */
  players(): readonly TournamentPlayerDetails[] {
    const kinds = this.fields.map(playerFieldOf);
    return this.rows.map((row) => {
      const said: Record<string, string> = {};
      kinds.forEach((kind, place) => {
        if (kind !== undefined) said[kind] = (row[place] ?? "").trim();
      });
      return {
        name: said["name"] ?? "",
        ...(said["representing"] ? { representing: said["representing"] } : {}),
        ...(said["flag"] ? { flag: said["flag"] } : {}),
        ...(said["handicap"] ? { handicap: said["handicap"] } : {}),
        ...(said["worldRankingName"]
          ? { worldRankingName: said["worldRankingName"] }
          : {}),
      };
    });
  }
}
