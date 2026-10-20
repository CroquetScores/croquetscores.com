import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { BestOf } from "../../../domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddSwiss } from "./AddSwiss.js";

/**
 * What a competition to be added must carry, asked on the way in: a
 * competition's name, and a best-of.
 */
export class AddSwissValidator extends CommandValidator<AddSwiss> {
  readonly validates: RequestType<AddSwiss> = AddSwiss;

  validate(command: AddSwiss): readonly BrokenRule[] {
    return [
      ...brokenBy("name", () => CompetitionName.from(command.name)),
      ...brokenBy("bestOf", () => BestOf.from(command.bestOf)),
    ];
  }
}
