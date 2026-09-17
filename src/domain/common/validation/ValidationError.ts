/**
 * Thrown when a value is required to be valid and is not.
 *
 * By then an invalid candidate is a mistake in the calling code rather than in
 * anything somebody typed, since what they typed was checked first and they
 * were told everything wrong with it. So this names the first rule broken and
 * nothing else: it is likely to be logged, and the candidate may be exactly
 * what somebody typed.
 *
 * The code is whatever the rules declare. This does not know which codes exist.
 */
export class ValidationError<TCode extends string = string> extends Error {
  readonly code: TCode;

  constructor(code: TCode) {
    super(code);
    this.name = "ValidationError";
    this.code = code;
  }
}
