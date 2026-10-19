import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { WorldRankingName } from "../../../domain/aggregates/tournaments/value-objects/WorldRankingName.js";
import { ChangeTeamPlayerWorldRankingName } from "./ChangeTeamPlayerWorldRankingName.js";
import { brokenBy } from "../../common/brokenBy.js";

/** What a team player's world ranking name changed must be, asked on the way in. */
export class ChangeTeamPlayerWorldRankingNameValidator extends CommandValidator<ChangeTeamPlayerWorldRankingName> {
  readonly validates: RequestType<ChangeTeamPlayerWorldRankingName> =
    ChangeTeamPlayerWorldRankingName;

  validate(command: ChangeTeamPlayerWorldRankingName): readonly BrokenRule[] {
    return brokenBy("worldRankingName", () =>
      WorldRankingName.from(command.worldRankingName),
    );
  }
}
