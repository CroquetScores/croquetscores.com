import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  MoveCompetitionPlayer,
  type MoveCompetitionPlayerErrorCode,
} from "./MoveCompetitionPlayer.js";

/** Asked on the way in: that the way to move is up or down. */
export class MoveCompetitionPlayerValidator extends CommandValidator<MoveCompetitionPlayer> {
  readonly validates: RequestType<MoveCompetitionPlayer> =
    MoveCompetitionPlayer;

  validate(
    command: MoveCompetitionPlayer,
  ): readonly BrokenRule<MoveCompetitionPlayerErrorCode>[] {
    return command.direction === "up" || command.direction === "down"
      ? []
      : [
          {
            code: "MoveCompetitionPlayer.NoSuchDirection",
            fields: ["direction"],
          },
        ];
  }
}
