// Telling the administrator that the database cannot be reached.
//
// Every email the site sends otherwise goes through the email queue, which is
// in the database, so this one cannot: it is written and handed straight to
// whatever sends email. And how long ago the administrator was last told is
// kept here, in the running site's memory, because that is the one place that
// is still there when the database is not.
//
// Memory is a weaker place to count from. A site that is restarted forgets,
// and where more than one copy is running each counts for itself, so an
// outage may send a few more than the limit says. That was accepted, over a
// count that could not be kept when it matters
// (databaseUnavailable.feature).
//
// Whatever goes wrong with the telling is logged and not shown: the reader is
// owed the answer to what they asked, which is that it cannot be done just
// now. And a try that failed counts as a try, since a mail server that is
// down as well would otherwise be asked again by every request while the
// database is down, which is when the site can least afford it.
import type { FastifyRequest } from "fastify";

import type { EmailSender } from "../../application/services/EmailSender.js";
import type { EmailWriter } from "../../application/services/EmailWriter.js";

const A_MINUTE = 60 * 1000;

/** What telling the administrator is done with. */
export interface TellingTheAdministrator {
  /** Who is told, or nothing where there is nobody to tell. */
  readonly administrator: string | undefined;
  /** The address the email is sent from: the site's own. */
  readonly from: string;
  /** How many minutes to wait between telling them. */
  readonly intervalMinutes: number;
  readonly writer: EmailWriter;
  readonly sender: EmailSender;
}

/** Tells the administrator of the request that found the database gone. */
export type DatabaseOutage = (request: FastifyRequest) => Promise<void>;

export const tellingTheAdministrator = ({
  administrator,
  from,
  intervalMinutes,
  writer,
  sender,
}: TellingTheAdministrator): DatabaseOutage => {
  let toldAt: number | undefined;

  return async (request) => {
    if (administrator === undefined) return;

    const now = request.requestedAt.toDate().getTime();
    // A clock that has gone backwards is not a reason to stay quiet for as
    // long as it went back.
    if (toldAt !== undefined) {
      const since = now - toldAt;
      if (since >= 0 && since < intervalMinutes * A_MINUTE) return;
    }
    // Before the first await, so that requests turned away at the same
    // moment tell the administrator once between them.
    toldAt = now;

    try {
      const written = writer.write({
        kind: "Email.DatabaseUnreachable",
        // The site's own language: the administrator reads what the site is
        // written in, not whatever the reader who was turned away asked for.
        language: "en",
        fill: {
          when: request.requestedAt.toDate().toISOString(),
          minutes: String(intervalMinutes),
        },
      });
      await sender.send(
        {
          to: administrator,
          from,
          subject: written.subject,
          body: written.body,
        },
        request.requestedAt,
      );
    } catch (failure) {
      request.log.error(
        failure,
        "Could not tell the administrator the database cannot be reached.",
      );
    }
  };
};
