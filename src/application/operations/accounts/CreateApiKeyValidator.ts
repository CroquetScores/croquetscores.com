import { ApiKeyLabel } from "../../../domain/aggregates/accounts/value-objects/ApiKeyLabel.js";
import { ApiKeyScope } from "../../../domain/aggregates/accounts/value-objects/ApiKeyScope.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { CreateApiKey } from "./CreateApiKey.js";

/**
 * What making a key must carry, asked on the way in: a label, a scope the site
 * knows, and, where one is named, a tournament id. Whether that tournament
 * exists is not asked: a key limited to one that does not is a key that opens
 * nothing, which harms nobody.
 */
export class CreateApiKeyValidator extends CommandValidator<CreateApiKey> {
  readonly validates: RequestType<CreateApiKey> = CreateApiKey;

  validate(command: CreateApiKey): readonly BrokenRule[] {
    return [
      ...brokenBy("label", () => ApiKeyLabel.from(command.label)),
      ...brokenBy("scope", () => ApiKeyScope.from(command.scope)),
      ...(command.tournament === undefined
        ? []
        : brokenBy("tournament", () => TournamentId.from(command.tournament!))),
    ];
  }
}
