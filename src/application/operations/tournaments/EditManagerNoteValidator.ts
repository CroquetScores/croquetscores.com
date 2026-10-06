import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { EditManagerNote } from "./EditManagerNote.js";
import { brokenByManagerNote } from "./managerNoteOperations.js";

/** What a note to be edited must be, asked on the way in. */
export class EditManagerNoteValidator extends CommandValidator<EditManagerNote> {
  readonly validates: RequestType<EditManagerNote> = EditManagerNote;

  validate(command: EditManagerNote): readonly BrokenRule[] {
    return brokenByManagerNote(command);
  }
}
