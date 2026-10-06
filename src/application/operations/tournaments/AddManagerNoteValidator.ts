import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddManagerNote } from "./AddManagerNote.js";
import { brokenByManagerNote } from "./managerNoteOperations.js";

/** What a note to be added must be, asked on the way in. */
export class AddManagerNoteValidator extends CommandValidator<AddManagerNote> {
  readonly validates: RequestType<AddManagerNote> = AddManagerNote;

  validate(command: AddManagerNote): readonly BrokenRule[] {
    return brokenByManagerNote(command);
  }
}
