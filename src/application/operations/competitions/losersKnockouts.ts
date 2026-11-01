// Putting the losers of a knockout's round into the knockouts that take them.
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { Competition } from "../../../domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import {
  type Competitions,
  competitionOf,
  toldOf,
} from "./competitionOperations.js";

/**
 * Enters whoever has lost a match of `source` into each knockout of
 * `tournament` that takes the losers of its round, in the place of the match
 * they lost. The knockouts are found by searching the tournament's, so there
 * can be one for each round, or several for the same.
 *
 * It looks at every match of the round and not only the one just decided, and
 * a place already filled is left alone (`Competition.enterLoser`), so asking
 * again does no harm. That is why it is safe for the save here to be a
 * separate one from the game's: if it fails after the game is kept, the next
 * game of the knockout, or the next time the knockout is added, puts the
 * losers in. Setting a game aside or correcting it after its loser has gone
 * on is not carried over, and a manager can only archive the losers knockout.
 */
export const carryLosersOn = async (
  competitions: Competitions,
  tournament: Tournament,
  source: Competition,
  sourceId: CompetitionId,
  by: AccountId,
  at: ReadOnlyDate,
): Promise<void> => {
  for (const found of tournament.competitions) {
    const { shape, reference } = found;
    if (
      shape.kind !== "knockout" ||
      shape.losersOf === undefined ||
      !shape.losersOf.competitionId.equals(sourceId) ||
      reference.archived
    ) {
      continue;
    }
    const losers = source.losersOfRound(
      shape.losersOf.round,
      toldOf(tournament, sourceId),
    );
    const taking = await competitionOf(competitions, reference.id);
    const told = toldOf(tournament, reference.id);
    losers.forEach((loser, place) => {
      if (loser.is === "player") {
        taking.enterLoser(loser.player.tournamentPlayerId, place, told, by, at);
      } else if (loser.is === "nobody") {
        // The match had nobody to lose it, which is a bye.
        taking.enterLoser(undefined, place, told, by, at);
      }
    });
    await competitions.save(taking);
  }
};
