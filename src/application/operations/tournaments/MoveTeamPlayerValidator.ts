import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import {
  MoveTeamPlayer,
  type MoveTeamPlayerErrorCode,
} from "./MoveTeamPlayer.js";

/** Asked on the way in: that the way to move is up or down. */
export class MoveTeamPlayerValidator extends CommandValidator<MoveTeamPlayer> {
  readonly validates: RequestType<MoveTeamPlayer> = MoveTeamPlayer;

  validate(
    command: MoveTeamPlayer,
  ): readonly BrokenRule<MoveTeamPlayerErrorCode>[] {
    return command.direction === "up" || command.direction === "down"
      ? []
      : [{ code: "MoveTeamPlayer.NoSuchDirection", fields: ["direction"] }];
  }
}
