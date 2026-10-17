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
import { servedAsOf } from "./site.js";
import type { FastifyRequest } from "fastify";

import type { EmailSender } from "../../application/services/EmailSender.js";
import type { EmailWriter } from "../../application/services/EmailWriter.js";

const A_MINUTE = 60 * 1000;

/** What telling the administrator is done with. */
export interface TellingTheAdministrator {
  /** Who is told, or nothing where there is nobody to tell. */
  readonly administrator: string;
  /** The address the email is sent from: the site's own. */
  readonly from: string;
  /** How many minutes to wait between telling them. */
  readonly intervalMinutes: number;
  readonly writer: EmailWriter;
  readonly sender: EmailSender;
}

/** What the error mapping asks of it, and what a scenario waits on. */
export interface DatabaseOutage {
  /**
   * Tells the administrator of the request that found the database gone, if
   * it is time. Does not wait: it returns at once, so that a mail provider
   * that is slow or hanging cannot hold up the answer the reader is owed,
   * which is the very thing the site is trying to give quickly.
   */
  tell(request: FastifyRequest): void;
  /** Resolves once everything told so far has been sent or has failed. */
  settled(): Promise<void>;
}

export const tellingTheAdministrator = ({
  administrator,
  from,
  intervalMinutes,
  writer,
  sender,
}: TellingTheAdministrator): DatabaseOutage => {
  let toldAt: number | undefined;
  const sending = new Set<Promise<void>>();

  const send = async (request: FastifyRequest, now: number): Promise<void> => {
    const at = request.requestedAt;
    try {
      const written = writer.write({
        kind: "Email.DatabaseUnreachable",
        // The site's own language: the administrator reads what the site is
        // written in, not whatever the reader who was turned away asked for.
        language: "en",
        // The website of the request that found it out: the site is the one
        // server, and the administrator is told as it is called there.
        website: servedAsOf(request).host,
        fill: {
          when: new Date(now).toISOString(),
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
        at,
      );
    } catch (failure) {
      request.log.error(
        failure,
        "Could not tell the administrator the database cannot be reached.",
      );
    }
  };

  return {
    tell: (request) => {
      // Inside the try as well: a request whose moment was never stamped,
      // because an earlier hook failed, is still owed its answer.
      let now: number;
      try {
        now = request.requestedAt.toDate().getTime();
      } catch (failure) {
        request.log.error(
          failure,
          "Could not tell the administrator the database cannot be reached.",
        );
        return;
      }

      // Within the interval either side of the last telling, so that two
      // requests stamped a moment apart and out of order tell once, and a
      // stamp far in the future does not silence the site for as long as it
      // is ahead: the next request, being more than an interval before it,
      // tells and begins again from its own moment.
      if (
        toldAt !== undefined &&
        Math.abs(now - toldAt) < intervalMinutes * A_MINUTE
      ) {
        return;
      }
      // Before anything is awaited, so that requests turned away at the same
      // moment tell the administrator once between them.
      toldAt = now;

      const sent = send(request, now).finally(() => sending.delete(sent));
      sending.add(sent);
    },
    settled: async () => {
      while (sending.size > 0) await Promise.all([...sending]);
    },
  };
};
