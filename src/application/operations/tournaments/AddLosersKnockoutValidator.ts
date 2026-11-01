import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { CompetitionName } from "../../../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { brokenBy } from "../../common/brokenBy.js";
import { AddLosersKnockout } from "./AddLosersKnockout.js";

/**
 * What a losers knockout to be added must carry, asked on the way in: a
 * competition's name, and the id of the knockout it takes losers from. Which
 * rounds that knockout has is the tournament's to say.
 */
export class AddLosersKnockoutValidator extends CommandValidator<AddLosersKnockout> {
  readonly validates: RequestType<AddLosersKnockout> = AddLosersKnockout;

  validate(command: AddLosersKnockout): readonly BrokenRule[] {
    return [
      ...brokenBy("name", () => CompetitionName.from(command.name)),
      ...brokenBy("from", () => CompetitionId.from(command.from)),
    ];
  }
}
