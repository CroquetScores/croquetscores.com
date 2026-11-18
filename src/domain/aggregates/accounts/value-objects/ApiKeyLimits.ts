import { Validator } from "../../../common/validation/Validator.js";

/** Every rule a key's limits can break. */
export type ApiKeyLimitsErrorCode =
  "ApiKeyLimits.NoneAMinute" | "ApiKeyLimits.NoneADay";

interface Given {
  readonly perMinute: number;
  readonly perDay: number;
}

// A limit is a whole number of requests above none: a key that may make none
// is a key that does nothing, which revoking says better, and one that could
// make a fraction of a request is a mistake in whoever typed it.
const isAllowance = (given: unknown): boolean =>
  typeof given === "number" && Number.isInteger(given) && given > 0;

const limits = new Validator<Given, ApiKeyLimitsErrorCode>({
  fields: [
    {
      field: "perMinute",
      code: "ApiKeyLimits.NoneAMinute",
      isBrokenBy: ({ perMinute }) => !isAllowance(perMinute),
    },
    {
      field: "perDay",
      code: "ApiKeyLimits.NoneADay",
      isBrokenBy: ({ perDay }) => !isAllowance(perDay),
    },
  ],
});

/**
 * How many requests a key may make a minute and a day, held with the key so
 * that one can be raised without any other changing (#684: a limit is stored
 * on the key).
 */
export class ApiKeyLimits {
  readonly perMinute: number;
  readonly perDay: number;

  private constructor(perMinute: number, perDay: number) {
    this.perMinute = perMinute;
    this.perDay = perDay;
  }

  /** What a key is given when it is made, which is where #684 started. */
  static usual(): ApiKeyLimits {
    return new ApiKeyLimits(60, 10_000);
  }

  /** The limits given. Throws a validation refusal naming the first rule broken. */
  static from(perMinute: number, perDay: number): ApiKeyLimits {
    limits.ensureValid({ perMinute, perDay });
    return new ApiKeyLimits(perMinute, perDay);
  }

  equals(other: ApiKeyLimits): boolean {
    return this.perMinute === other.perMinute && this.perDay === other.perDay;
  }
}
