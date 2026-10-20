import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { KnockoutDraw } from "../../../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { brokenBy } from "../../common/brokenBy.js";
import { UpdateKnockout } from "./UpdateKnockout.js";

/**
 * What a knockout's update must carry, asked on the way in, as adding one asks
 * it.
 */
export class UpdateKnockoutValidator extends CommandValidator<UpdateKnockout> {
  readonly validates: RequestType<UpdateKnockout> = UpdateKnockout;

  validate(command: UpdateKnockout): readonly BrokenRule[] {
    return [
      ...brokenBy("name", () => CompetitionName.from(command.name)),
      ...brokenBy("draw", () =>
        KnockoutDraw.from(command.places, command.rounds),
      ),
    ];
  }
}
