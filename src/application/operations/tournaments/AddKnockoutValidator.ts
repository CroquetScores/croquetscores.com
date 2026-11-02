import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { KnockoutDraw } from "../../../domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddKnockout } from "./AddKnockout.js";

/**
 * What a knockout to be added must carry, asked on the way in: a
 * competition's name, and a draw's shape.
 */
export class AddKnockoutValidator extends CommandValidator<AddKnockout> {
  readonly validates: RequestType<AddKnockout> = AddKnockout;

  validate(command: AddKnockout): readonly BrokenRule[] {
    return [
      ...brokenBy("name", () => CompetitionName.from(command.name)),
      ...brokenBy("draw", () =>
        KnockoutDraw.from(command.places, command.rounds),
      ),
      ...command.losers.flatMap((each) =>
        brokenBy("losers", () => CompetitionName.from(each.name)),
      ),
    ];
  }
}
