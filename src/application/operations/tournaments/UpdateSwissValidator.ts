import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { BestOf } from "../../../domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { brokenBy } from "../../common/brokenBy.js";
import { UpdateSwiss } from "./UpdateSwiss.js";

/**
 * What a competition's update must carry, asked on the way in, as adding one
 * asks it.
 */
export class UpdateSwissValidator extends CommandValidator<UpdateSwiss> {
  readonly validates: RequestType<UpdateSwiss> = UpdateSwiss;

  validate(command: UpdateSwiss): readonly BrokenRule[] {
    return [
      ...brokenBy("name", () => CompetitionName.from(command.name)),
      ...brokenBy("bestOf", () => BestOf.from(command.bestOf)),
    ];
  }
}
