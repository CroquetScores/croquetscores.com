import type { GameErrorCode } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import type { ScoreErrorCode } from "../../../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddGame, type AddGameErrorCode } from "./AddGame.js";

type Code = AddGameErrorCode | ScoreErrorCode | GameErrorCode;

// Whatever it goes on to say, a score begins with its number of points.
const BEGINS_WITH_A_DIGIT = /^\s*\d/;

/**
 * Asked on the way in: what a game must be that needs nothing of the
 * tournament. Each part is given, each score begins with a digit, and the
 * winner and the loser are two players. The rest — the website's marks, and
 * whether drawn games are allowed — is the game's to ask once the tournament
 * has said them.
 */
export class AddGameValidator extends CommandValidator<AddGame> {
  readonly validates: RequestType<AddGame> = AddGame;

  validate(command: AddGame): readonly BrokenRule<Code>[] {
    const { winner, winnerScore, loser, loserScore } = command.game;
    const broken: BrokenRule<Code>[] = [];
    const given = (said: string | undefined): said is string =>
      said !== undefined && said.trim() !== "";
    const score = (
      said: string | undefined,
      missing: Code,
      field: string,
    ): void => {
      if (!given(said)) broken.push({ code: missing, fields: [field] });
      else if (!BEGINS_WITH_A_DIGIT.test(said))
        broken.push({ code: "Score.NoPoints", fields: [field] });
    };
    if (!given(winner))
      broken.push({ code: "Game.WinnerMissing", fields: ["winner"] });
    score(winnerScore, "Game.WinnerScoreMissing", "winnerScore");
    if (!given(loser))
      broken.push({ code: "Game.LoserMissing", fields: ["loser"] });
    score(loserScore, "Game.LoserScoreMissing", "loserScore");
    if (given(winner) && winner === loser)
      broken.push({ code: "Game.SamePlayer", fields: ["loser"] });
    return broken;
  }
}
