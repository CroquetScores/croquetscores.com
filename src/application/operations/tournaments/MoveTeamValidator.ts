import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { MoveTeam, type MoveTeamErrorCode } from "./MoveTeam.js";

/** Asked on the way in: that the way to move is up or down. */
export class MoveTeamValidator extends CommandValidator<MoveTeam> {
  readonly validates: RequestType<MoveTeam> = MoveTeam;

  validate(command: MoveTeam): readonly BrokenRule<MoveTeamErrorCode>[] {
    return command.direction === "up" || command.direction === "down"
      ? []
      : [{ code: "MoveTeam.NoSuchDirection", fields: ["direction"] }];
  }
}
