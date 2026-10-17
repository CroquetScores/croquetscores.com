// Telling the administrator that a service a page needed could not be reached.
//
// Every page that asks a service outside the site — reCAPTCHA, Have I Been
// Pwned — does this the same way, so it is said once. The telling is its own
// request to the application, in its own transaction, because the work that
// found the service down was refused and recorded nothing.
//
// Whatever goes wrong with the telling is logged and not shown: the reader is
// owed the answer to what they asked, which is that it cannot be done just
// now, and not an error page about an email they will never see.
import { servedAsOf } from "./site.js";
import type { FastifyRequest } from "fastify";

import { ReportUnreachableService } from "../../application/operations/accounts/ReportUnreachableService.js";

/** The names the administrator is told, as their email says them. */
export type Service = "reCAPTCHA" | "Have I Been Pwned";

export const reportUnreachable = async (
  request: FastifyRequest,
  service: Service,
): Promise<void> => {
  try {
    await request.server.mediator.send(
      new ReportUnreachableService(
        service,
        servedAsOf(request).host,
        request.requestedAt,
      ),
    );
  } catch (failure) {
    request.log.error(failure, `Could not report ${service} unreachable.`);
  }
};
