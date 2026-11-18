import { Validator } from "../../../common/validation/Validator.js";

/**
 * What a key may do, as it is kept in an event. Once kept, a scope is spelled
 * this way for good.
 */
export const apiKeyScopes = ["read", "read-and-write"] as const;

export type ApiKeyScopeCode = (typeof apiKeyScopes)[number];

/** Every rule a key's scope can break. */
export type ApiKeyScopeErrorCode = "ApiKeyScope.Unknown";

const scopes = new Validator<string, ApiKeyScopeErrorCode>({
  fields: [
    {
      field: "scope",
      code: "ApiKeyScope.Unknown",
      isBrokenBy: (given) =>
        !(apiKeyScopes as readonly string[]).includes(given),
    },
  ],
});

/** Whether a key only reads, or reads and writes. */
export class ApiKeyScope {
  readonly #code: ApiKeyScopeCode;

  private constructor(code: ApiKeyScopeCode) {
    this.#code = code;
  }

  /** The scope written as `written`. Throws a validation refusal if it is none. */
  static from(written: string): ApiKeyScope {
    scopes.ensureValid(written);
    return new ApiKeyScope(written as ApiKeyScopeCode);
  }

  /** Every key may read. */
  get mayRead(): boolean {
    return true;
  }

  get mayWrite(): boolean {
    return this.#code === "read-and-write";
  }

  get code(): ApiKeyScopeCode {
    return this.#code;
  }
}
