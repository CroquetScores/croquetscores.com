/**
 * Something that will not be done, named by a code (Refused.feature). The code
 * is the contract: it is what whoever asked decides by, and the message is only
 * for whoever reads the log. Each kind of refusal extends this with the codes
 * it can give, and needs nothing else.
 */
export abstract class Refused<TCode extends string> extends Error {
  readonly code: TCode;

  constructor(code: TCode, message: string, cause?: unknown) {
    // Given no cause at all where there is none, rather than an undefined one,
    // so that the log does not show a cause of nothing.
    super(message, cause === undefined ? undefined : { cause });
    // Named after the kind that was thrown, so the log says which it was.
    this.name = new.target.name;
    this.code = code;
  }
}
