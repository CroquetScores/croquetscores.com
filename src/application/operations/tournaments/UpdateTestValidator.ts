import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenByTest } from "./testOperations.js";
import { UpdateTest } from "./UpdateTest.js";

/** What a test is updated to must carry, asked as a test to be added is. */
export class UpdateTestValidator extends CommandValidator<UpdateTest> {
  readonly validates: RequestType<UpdateTest> = UpdateTest;

  validate(command: UpdateTest): readonly BrokenRule[] {
    return brokenByTest(command.test, "UpdateTest");
  }
}
