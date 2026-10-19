import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { WorldRankingName } from "../../../domain/aggregates/tournaments/value-objects/WorldRankingName.js";
import { ChangePlayerWorldRankingName } from "./ChangePlayerWorldRankingName.js";
import { brokenBy } from "../../common/brokenBy.js";

/** What a world ranking name changed must be, asked on the way in. */
export class ChangePlayerWorldRankingNameValidator extends CommandValidator<ChangePlayerWorldRankingName> {
  readonly validates: RequestType<ChangePlayerWorldRankingName> =
    ChangePlayerWorldRankingName;

  validate(command: ChangePlayerWorldRankingName): readonly BrokenRule[] {
    return brokenBy("worldRankingName", () =>
      WorldRankingName.from(command.worldRankingName),
    );
  }
}
