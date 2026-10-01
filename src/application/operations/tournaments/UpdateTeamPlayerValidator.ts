import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { TeamPlayer } from "../../../domain/aggregates/tournaments/TeamPlayer.js";
import { brokenBy } from "./tournamentOperations.js";
import { UpdateTeamPlayer } from "./UpdateTeamPlayer.js";

/** What a player in a team is updated to must carry, asked as a player added is. */
export class UpdateTeamPlayerValidator extends CommandValidator<UpdateTeamPlayer> {
  readonly validates: RequestType<UpdateTeamPlayer> = UpdateTeamPlayer;

  validate(command: UpdateTeamPlayer): readonly BrokenRule<string>[] {
    return brokenBy("details", () => TeamPlayer.ensureValid(command.details));
  }
}
