import { competitionFound } from "./competitionOperations.js";
import { Score } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { ScoringFraction } from "../../../domain/aggregates/tournaments/competitions/value-objects/ScoringFraction.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/**
 * The rules a request for a game breaks once the competition says whether it
 * is Advantage (advantage.feature): a score typed as points in one that is, and
 * hoops and targets in one that is not. Each is refused rather than taken for
 * the other, since a scorer who typed one meant the competition to be the
 * kind it is not.
 */
export type AdvantageScoresErrorCode =
  "Game.AdvantageScoreTyped" | "Game.HoopsAndTargetsNotAdvantage";

/** What a request for a game says of its two scores. */
export interface ScoresAsked {
  /** As typed, as "26" or "6w", in a competition that is not Advantage. */
  readonly winnerScore?: string | undefined;
  readonly loserScore?: string | undefined;
  /**
   * In an Advantage competition, the hoops each side made and its target, as
   * numbers, one that is no number being NaN so that it is refused as a
   * scoring fraction refuses it.
   */
  readonly winnerHoops?: number | undefined;
  readonly winnerTarget?: number | undefined;
  readonly loserHoops?: number | undefined;
  readonly loserTarget?: number | undefined;
}

/**
 * Whether a request names any of the four that make an Advantage game, which
 * is what makes it a request for one wherever it is asked: whether the
 * competition is Advantage is the tournament's to say, once it has.
 */
export const namesHoopsOrTargets = (asked: ScoresAsked): boolean =>
  [
    asked.winnerHoops,
    asked.winnerTarget,
    asked.loserHoops,
    asked.loserTarget,
  ].some((said) => said !== undefined);

const given = (said: string | undefined): boolean =>
  said !== undefined && said.trim() !== "";

/**
 * The two scores a request is for, in the competition `competition` of
 * `tournament`: as typed where it is not Advantage, and, where it is, the
 * scoring fractions the hoops and targets make, written as a game keeps them
 * (`ScoringFraction.feature`) so that everything that reads a score reads the
 * percentage. Throws {@link ValidationError} as the competition's kind says, or
 * as a scoring fraction refuses hoops and a target that cannot make one,
 * the winner's first.
 */
export const scoresOfRequest = (
  tournament: Tournament,
  competition: CompetitionId,
  asked: ScoresAsked,
): { readonly winner: Score; readonly loser: Score } => {
  const advantage = competitionFound(tournament, competition).rules.advantage;
  if (!advantage) {
    if (namesHoopsOrTargets(asked)) {
      throw new ValidationError<AdvantageScoresErrorCode>(
        "Game.HoopsAndTargetsNotAdvantage",
      );
    }
    return {
      winner: Score.read(asked.winnerScore ?? "", tournament.website),
      loser: Score.read(asked.loserScore ?? "", tournament.website),
    };
  }
  if (given(asked.winnerScore) || given(asked.loserScore)) {
    throw new ValidationError<AdvantageScoresErrorCode>(
      "Game.AdvantageScoreTyped",
    );
  }
  // Each is there, once the validator has let it in.
  const winner = ScoringFraction.from(
    asked.winnerHoops ?? Number.NaN,
    asked.winnerTarget ?? Number.NaN,
  );
  const loser = ScoringFraction.from(
    asked.loserHoops ?? Number.NaN,
    asked.loserTarget ?? Number.NaN,
  );
  return {
    winner: Score.read(String(winner), tournament.website),
    loser: Score.read(String(loser), tournament.website),
  };
};
