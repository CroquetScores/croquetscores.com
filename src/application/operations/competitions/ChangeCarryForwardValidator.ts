import {
  CarryForward,
  type CarryForwardErrorCode,
} from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { ChangeCarryForward } from "./ChangeCarryForward.js";

/**
 * Asked on the way in: each count is a whole number from 0 up, where there is
 * one. Every count broken comes back, each with the count it is about, so a
 * form can say each beside its own field.
 */
export class ChangeCarryForwardValidator extends CommandValidator<ChangeCarryForward> {
  readonly validates: RequestType<ChangeCarryForward> = ChangeCarryForward;

  validate(
    command: ChangeCarryForward,
  ): readonly BrokenRule<CarryForwardErrorCode>[] {
    return CarryForward.check(command.counts);
  }
}
