import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  MoveCompetition,
  type MoveCompetitionErrorCode,
} from "./MoveCompetition.js";

/** Asked on the way in: that the way to move is up or down. */
export class MoveCompetitionValidator extends CommandValidator<MoveCompetition> {
  readonly validates: RequestType<MoveCompetition> = MoveCompetition;

  validate(
    command: MoveCompetition,
  ): readonly BrokenRule<MoveCompetitionErrorCode>[] {
    return command.direction === "up" || command.direction === "down"
      ? []
      : [{ code: "MoveCompetition.NoSuchDirection", fields: ["direction"] }];
  }
}
