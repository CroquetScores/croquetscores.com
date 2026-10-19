import { CommentaryTitle } from "../../../domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { StartCommentary } from "./StartCommentary.js";

/** What a commentary to be started must carry, asked on the way in: a title. */
export class StartCommentaryValidator extends CommandValidator<StartCommentary> {
  readonly validates: RequestType<StartCommentary> = StartCommentary;

  validate(command: StartCommentary): readonly BrokenRule<string>[] {
    return brokenBy("title", () => CommentaryTitle.from(command.title));
  }
}
