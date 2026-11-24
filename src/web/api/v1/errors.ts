// How the routes of /api/v1 answer an error in its one shape (errors.feature).
import type { FastifyReply } from "fastify";

import { apiError } from "../../common/apiError.js";

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
