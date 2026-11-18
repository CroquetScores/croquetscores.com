import type { ScoreErrorCode } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { CorrectGame, type CorrectGameErrorCode } from "./CorrectGame.js";
import { namesHoopsOrTargets } from "./advantageScores.js";

type Code = CorrectGameErrorCode | ScoreErrorCode;

// Whatever it goes on to say, a score begins with its number of points.
const BEGINS_WITH_A_DIGIT = /^\s*\d/;

/**
 * Asked on the way in, as it is of a game added (AddGameValidator): both
 * scores are given, and each begins with a digit. The rest — the website's
 * marks, whether drawn games are allowed, and that the result is kept — is
 * the game's to ask once the tournament has said what it needs to.
 */
export class CorrectGameValidator extends CommandValidator<CorrectGame> {
  readonly validates: RequestType<CorrectGame> = CorrectGame;

  validate(command: CorrectGame): readonly BrokenRule<Code>[] {
    const { winnerScore, loserScore } = command.scores;
    const broken: BrokenRule<Code>[] = [];
    const score = (
      said: string | undefined,
      missing: Code,
      field: string,
    ): void => {
      if (said === undefined || said.trim() === "")
        broken.push({ code: missing, fields: [field] });
      else if (!BEGINS_WITH_A_DIGIT.test(said))
        broken.push({ code: "Score.NoPoints", fields: [field] });
    };
    const hoops = (said: number | undefined, missing: Code, field: string) => {
      if (said === undefined) broken.push({ code: missing, fields: [field] });
    };
    // As when a game is added (AddGameValidator): a request that names any of
    // the hoops and targets is for an Advantage game, and is asked for all four.
    if (namesHoopsOrTargets(command.scores)) {
      hoops(
        command.scores.winnerHoops,
        "Game.WinnerHoopsMissing",
        "winnerHoops",
      );
      hoops(
        command.scores.winnerTarget,
        "Game.WinnerTargetMissing",
        "winnerTarget",
      );
      hoops(command.scores.loserHoops, "Game.LoserHoopsMissing", "loserHoops");
      hoops(
        command.scores.loserTarget,
        "Game.LoserTargetMissing",
        "loserTarget",
      );
    } else {
      score(winnerScore, "Game.WinnerScoreMissing", "winnerScore");
      score(loserScore, "Game.LoserScoreMissing", "loserScore");
    }
    return broken;
  }
}
