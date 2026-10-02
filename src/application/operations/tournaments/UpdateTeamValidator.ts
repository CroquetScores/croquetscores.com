import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { Team } from "../../../domain/aggregates/tournaments/Team.js";
import { brokenBy } from "./tournamentOperations.js";
import { UpdateTeam } from "./UpdateTeam.js";

/** What a team is updated to must carry, asked as a team to be added is. */
export class UpdateTeamValidator extends CommandValidator<UpdateTeam> {
  readonly validates: RequestType<UpdateTeam> = UpdateTeam;

  validate(command: UpdateTeam): readonly BrokenRule<string>[] {
    return brokenBy("details", () => Team.ensureValid(command.details));
  }
}
