import { CommentaryTitle } from "../../../domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { ChangeCommentaryTitle } from "./ChangeCommentaryTitle.js";

/** What a commentary's new title must be, asked on the way in. */
export class ChangeCommentaryTitleValidator extends CommandValidator<ChangeCommentaryTitle> {
  readonly validates: RequestType<ChangeCommentaryTitle> =
    ChangeCommentaryTitle;

  validate(command: ChangeCommentaryTitle): readonly BrokenRule<string>[] {
    return brokenBy("title", () => CommentaryTitle.from(command.title));
  }
}
