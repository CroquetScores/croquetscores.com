import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { EnterPlayers, mostPlayersAtOnce } from "./EnterPlayers.js";

/**
 * What a list of players to be entered must be, asked on the way in: that
 * there are some, and not too many. Whether each is one the tournament has,
 * and one the competition will take, is for the handler to say, since only it
 * has the tournament and the competition in hand.
 */
export class EnterPlayersValidator extends CommandValidator<EnterPlayers> {
  readonly validates: RequestType<EnterPlayers> = EnterPlayers;

  validate(command: EnterPlayers): readonly BrokenRule[] {
    const fields = ["players"];
    if (command.playerIds.length === 0) {
      return [{ code: "EnterPlayers.PlayersMissing", fields }];
    }
    if (command.playerIds.length > mostPlayersAtOnce) {
      return [{ code: "EnterPlayers.TooManyPlayers", fields }];
    }
    return [];
  }
}
