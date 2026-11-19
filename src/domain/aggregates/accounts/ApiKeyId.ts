import { Id } from "../../common/Id.js";

const kind = "api-key";

/**
 * What one of an account's keys is known by, which is not the key: the id is
 * shown in lists and used to revoke, so it must say nothing that would let
 * anybody act as the key.
 */
export class ApiKeyId extends Id {
  static create(): ApiKeyId {
    return new ApiKeyId(Id.mint(kind));
  }

  /** The key id written as `written`, or a validation refusal. */
  static from(written: string): ApiKeyId {
    return new ApiKeyId(Id.read(kind, written));
  }
}
