import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenByTournament } from "./tournamentOperations.js";
import { CreateTournament } from "./CreateTournament.js";

/**
 * What a tournament to be created must carry, asked on the way in: each value
 * its own rules. What the tournament asks of them together is its own to
 * refuse.
 */
export class CreateTournamentValidator extends CommandValidator<CreateTournament> {
  readonly validates: RequestType<CreateTournament> = CreateTournament;

  validate(command: CreateTournament): readonly BrokenRule[] {
    return brokenByTournament(command.tournament, "CreateTournament");
  }
}
