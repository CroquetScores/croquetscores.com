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
  | "Game.AdvantageScoreTyped"
  | "Game.HoopsAndTargetsNotAdvantage"
  | "Game.WinnerMarkedNotLevel";

/** What a request for a game says of its two scores. */
export interface ScoresAsked {
  /** As typed, as "26" or "6w", in a competition that is not Advantage. */
  readonly winnerScore?: string | undefined;
  readonly loserScore?: string | undefined;
  /**
   * In an Advantage competition, the hoops each side made and its target, as
   * they were typed: a number, or text with a "w" after it where the side is
   * declared the winner (`readTyped`).
   */
  readonly winnerHoops?: Typed | undefined;
  readonly winnerTarget?: Typed | undefined;
  readonly loserHoops?: Typed | undefined;
  readonly loserTarget?: Typed | undefined;
}

/** A side's hoops or target as it was typed. */
export type Typed = number | string;

/**
 * What a side's hoops or target was typed as: its number, and whether a "w" was
 * typed after it, which declares that side the winner as "6w" does for a score
 * (`Score.feature`) whichever of the hoops and the target it is typed after. A
 * number said as one has no mark. The count is nothing where none was typed, and
 * `NaN` where what was typed is not a whole number to look at, so that it is
 * refused as a scoring fraction refuses it. Only a lowercase "w" is a mark, and
 * only one: "3ww" is not a number.
 */
export const readTyped = (
  said: Typed | undefined,
): { readonly count: number | undefined; readonly marked: boolean } => {
  if (said === undefined) return { count: undefined, marked: false };
  if (typeof said === "number") return { count: said, marked: false };
  const typed = said.trim();
  const found = /^(.*?)\s*w$/.exec(typed);
  const digits = found === null ? typed : (found[1] ?? "");
  const marked = found !== null;
  if (digits === "") return { count: undefined, marked };
  return {
    count: /^-?\d+(?:\.\d+)?$/.test(digits) ? Number(digits) : Number.NaN,
    marked,
  };
};

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
  // Each is there, once the validator has let it in. A "w" after either of a
  // side's two is that side declared the winner. A loser's is refused by the
  // game, as a loser's score marked is in any other competition.
  const winnerHoops = readTyped(asked.winnerHoops);
  const winnerTarget = readTyped(asked.winnerTarget);
  const loserHoops = readTyped(asked.loserHoops);
  const loserTarget = readTyped(asked.loserTarget);
  const winner = ScoringFraction.from(
    winnerHoops.count ?? Number.NaN,
    winnerTarget.count ?? Number.NaN,
    winnerHoops.marked || winnerTarget.marked,
  );
  const loser = ScoringFraction.from(
    loserHoops.count ?? Number.NaN,
    loserTarget.count ?? Number.NaN,
    loserHoops.marked || loserTarget.marked,
  );
  // The mark is for deciding a game the two sides are level in, since it is
  // only there that somebody has to say who won. A winner who is ahead has no
  // need of it, and is refused rather than kept with a mark that says nothing.
  // One who is behind is refused by the game, as ever.
  if (winner.won && winner.percentage > loser.percentage) {
    throw new ValidationError<AdvantageScoresErrorCode>(
      "Game.WinnerMarkedNotLevel",
    );
  }
  return {
    winner: Score.kept(String(winner), winner.won),
    loser: Score.kept(String(loser), loser.won),
  };
};
