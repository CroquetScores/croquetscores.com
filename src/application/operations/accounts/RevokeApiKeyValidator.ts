import { ApiKeyId } from "../../../domain/aggregates/accounts/ApiKeyId.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { RevokeApiKey } from "./RevokeApiKey.js";

/** What revoking a key must carry, asked on the way in: the id of a key. */
export class RevokeApiKeyValidator extends CommandValidator<RevokeApiKey> {
  readonly validates: RequestType<RevokeApiKey> = RevokeApiKey;

  validate(command: RevokeApiKey): readonly BrokenRule[] {
    return brokenBy("keyId", () => ApiKeyId.from(command.keyId));
  }
}
