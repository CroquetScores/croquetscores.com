// The one shape every error of /api/v0 has, wherever it came from: a code apps
// rely on, the field that was wrong where there is one, and a sentence for
// whoever reads a log, which apps never rely on (errors.feature).
import type { FastifyReply } from "fastify";

/** What an error of the API says. */
export interface ApiError {
  readonly code: string;
  readonly message: string;
  /** The field of the request that was wrong, where one was. */
  readonly field?: string;
}

/** The body of an error, in its one shape. */
export const apiError = (
  code: string,
  message: string,
  field?: string,
): ApiError => ({ code, message, ...(field === undefined ? {} : { field }) });

/**
 * Answers with an error in its shape. Kept by nobody, the caller included: an
 * error is for the one who asked, now.
 */
export const refusal = (
  reply: FastifyReply,
  status: number,
  code: string,
  message: string,
  field?: string,
): FastifyReply =>
  reply
    .code(status)
    .header("cache-control", "no-store")
    .send(apiError(code, message, field));
