import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { Team } from "../../../domain/aggregates/tournaments/Team.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddTeam } from "./AddTeam.js";

/**
 * What a team to be added must carry, asked on the way in: a team name, a
 * short name no longer than it, and a flag there is if there is one. Asked
 * by making the team, which asks them all.
 */
export class AddTeamValidator extends CommandValidator<AddTeam> {
  readonly validates: RequestType<AddTeam> = AddTeam;

  validate(command: AddTeam): readonly BrokenRule<string>[] {
    return brokenBy("team", () => Team.ensureValid(command.team));
  }
}
