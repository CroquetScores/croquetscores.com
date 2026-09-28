import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { MovePlayer, type MovePlayerErrorCode } from "./MovePlayer.js";

/** Asked on the way in: that the way to move is up or down. */
export class MovePlayerValidator extends CommandValidator<MovePlayer> {
  readonly validates: RequestType<MovePlayer> = MovePlayer;

  validate(command: MovePlayer): readonly BrokenRule<MovePlayerErrorCode>[] {
    return command.direction === "up" || command.direction === "down"
      ? []
      : [{ code: "MovePlayer.NoSuchDirection", fields: ["direction"] }];
  }
}
