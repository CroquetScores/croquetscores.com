import { ApiKeyId } from "../../../domain/aggregates/accounts/ApiKeyId.js";
import { ApiKeyLimits } from "../../../domain/aggregates/accounts/value-objects/ApiKeyLimits.js";
import type { BrokenRule } from "../../../domain/common/validation/Validator.js";
import { brokenBy } from "../../common/brokenBy.js";
import { CommandValidator } from "../../common/CommandValidator.js";
import type { RequestType } from "../../common/Mediator.js";
import { ChangeApiKeyLimits } from "./ChangeApiKeyLimits.js";

/**
 * What changing a key's limits must carry, asked on the way in: the id of a
 * key and limits that are whole numbers above none. The limits are asked about
 * together, since they are made together, and each rule names its own field.
 */
export class ChangeApiKeyLimitsValidator extends CommandValidator<ChangeApiKeyLimits> {
  readonly validates: RequestType<ChangeApiKeyLimits> = ChangeApiKeyLimits;

  validate(command: ChangeApiKeyLimits): readonly BrokenRule[] {
    const keyId = brokenBy("keyId", () => ApiKeyId.from(command.keyId));
    if (keyId.length > 0) return keyId;
    return brokenBy("limits", () =>
      ApiKeyLimits.from(command.perMinute, command.perDay),
    );
  }
}
