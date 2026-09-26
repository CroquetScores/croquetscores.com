import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenByTournament } from "./tournamentOperations.js";
import { UpdateTournament } from "./UpdateTournament.js";

/**
 * What an update of a tournament must carry, asked on the way in, as creating
 * one asks it.
 */
export class UpdateTournamentValidator extends CommandValidator<UpdateTournament> {
  readonly validates: RequestType<UpdateTournament> = UpdateTournament;

  validate(command: UpdateTournament): readonly BrokenRule[] {
    return brokenByTournament(command.details, "UpdateTournament");
  }
}
