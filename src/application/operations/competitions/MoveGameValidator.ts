import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { MoveGame, type MoveGameErrorCode } from "./MoveGame.js";

/** Asked on the way in: that the way to move is up or down. */
export class MoveGameValidator extends CommandValidator<MoveGame> {
  readonly validates: RequestType<MoveGame> = MoveGame;

  validate(command: MoveGame): readonly BrokenRule<MoveGameErrorCode>[] {
    return command.direction === "up" || command.direction === "down"
      ? []
      : [{ code: "MoveGame.NoSuchDirection", fields: ["direction"] }];
  }
}
