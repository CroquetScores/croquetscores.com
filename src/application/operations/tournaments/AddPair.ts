import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentPlayerId } from "../../../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";

/** The pair that was made: its id, which is a player's, and its name. */
export interface AddedPair {
  readonly id: TournamentPlayerId;
  readonly name: string;
}

/**
 * Adding a doubles pair to a tournament, made from two of its players. It is
 * answered with the pair's id, which is a player's id: a pair is a player of
 * the tournament as any other is, named from the two it is made of
 * (`pairName`).
 */
export class AddPair extends Command<AddedPair> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The first player of the pair, by their id in the tournament. */
    readonly first: string,
    /** The second player of the pair, by their id in the tournament. */
    readonly second: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
