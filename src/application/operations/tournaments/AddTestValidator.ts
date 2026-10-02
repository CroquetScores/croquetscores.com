import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddTest } from "./AddTest.js";
import { brokenByTest } from "./testOperations.js";

/**
 * What a test to be added must carry, asked on the way in: two teams chosen,
 * days that can be read, expected matches and a best-of that are whole
 * numbers from 1 up, and a group no longer than a group may be. What the
 * tournament asks of them together is the tournament's.
 */
export class AddTestValidator extends CommandValidator<AddTest> {
  readonly validates: RequestType<AddTest> = AddTest;

  validate(command: AddTest): readonly BrokenRule[] {
    return brokenByTest(command.test, "AddTest");
  }
}
