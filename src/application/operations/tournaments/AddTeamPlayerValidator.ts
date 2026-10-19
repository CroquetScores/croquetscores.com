import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamPlayer } from "../../../domain/aggregates/tournaments/TeamPlayer.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddTeamPlayer } from "./AddTeamPlayer.js";

/**
 * What a player to be added to a team must carry, asked on the way in: a
 * person's name, and not a bye's.
 */
export class AddTeamPlayerValidator extends CommandValidator<AddTeamPlayer> {
  readonly validates: RequestType<AddTeamPlayer> = AddTeamPlayer;

  validate(command: AddTeamPlayer): readonly BrokenRule<string>[] {
    return brokenBy("player", () => TeamPlayer.ensureValid(command.player));
  }
}
