import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddPair } from "./AddPair.js";

/**
 * What a pair must be, asked on the way in: that it is two players, and not
 * the same one twice. Whether each is a player the tournament has is the
 * handler's to say, since only it has the tournament in hand.
 */
export class AddPairValidator extends CommandValidator<AddPair> {
  readonly validates: RequestType<AddPair> = AddPair;

  validate(command: AddPair): readonly BrokenRule[] {
    return command.first === command.second
      ? [{ code: "AddPair.SamePlayerTwice", fields: ["second"] }]
      : [];
  }
}
