// Telling the administrator that the site failed on a request.
//
// The reader is shown a reference and the log has the cause, but nobody reads
// the log until they are told something is in it. So the administrator is
// emailed, but not about every failure: a site that is broken tends to fail on
// every request, and an email for each would fill the inbox, risk the mail
// provider stopping the site's sending altogether, and say no more after the
// first few than before.
//
// As with the database being unreachable (databaseOutage.ts), the email goes
// straight to whatever sends email and the count is kept in the running site's
// memory. A failure can be the database, which the email queue is in, and a
// queue that was failing could not say that it was. A site that is restarted
// forgets, and where more than one copy is running each counts for itself, so
// an hour may see a few more than the limit. That was accepted over a count
// that could not be kept when it matters (errorReport.feature).
//
// What the email says is chosen with care. It gives the address asked for
// without its query, because a query can carry a link that signs somebody in,
// and it does not give the failure's message, because a message can carry what
// somebody typed. The reference is what finds the log's entry, which has both.
//
// Whatever goes wrong with the telling is logged and not shown, and a try that
// failed counts as a try, so that a mail server that is down is not asked
// again by every request that fails.
import type { FastifyRequest } from "fastify";

import { AN_HOUR } from "../../application/common/moments.js";
import type { EmailSender } from "../../application/services/EmailSender.js";
import type { EmailWriter } from "../../application/services/EmailWriter.js";
import { servedAsOf } from "./site.js";

/** How many emails the administrator is sent about failures in an hour. */
const MOST_IN_AN_HOUR = 4;

/** What telling the administrator is done with. */
export interface TellingOfFailures {
  /** Who is told. */
  readonly administrator: string;
  /** The address the email is sent from: the site's own. */
  readonly from: string;
  readonly writer: EmailWriter;
  readonly sender: EmailSender;
}

/** What the error mapping asks of it, and what a scenario waits on. */
export interface ErrorReport {
  /**
   * Tells the administrator of a request the site failed on, if the hour has
   * room. Does not wait, so that a slow mail provider cannot hold up the
   * answer the reader is owed.
   */
  tell(request: FastifyRequest, reference: string): void;
  /** Resolves once everything told so far has been sent or has failed. */
  settled(): Promise<void>;
}

export const tellingOfFailures = ({
  administrator,
  from,
  writer,
  sender,
}: TellingOfFailures): ErrorReport => {
  // The moments the administrator was told, those within the last hour.
  let told: number[] = [];
  const sending = new Set<Promise<void>>();

  const send = async (
    request: FastifyRequest,
    now: number,
    reference: string,
  ): Promise<void> => {
    try {
      const written = writer.write({
        kind: "Email.UnhandledError",
        // The site's own language: the administrator reads what the site is
        // written in, not whatever the reader who met the failure asked for.
        language: "en",
        website: servedAsOf(request).host,
        fill: {
          when: new Date(now).toISOString(),
          asked: `${request.method} ${request.url.split("?")[0] ?? ""}`,
          reference,
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
        "Could not tell the administrator the site failed.",
      );
    }
  };

  return {
    tell: (request, reference) => {
      // Inside the try as well: a request whose moment was never stamped,
      // because an earlier hook failed, is still owed its answer.
      let now: number;
      try {
        now = request.requestedAt.toDate().getTime();
      } catch (failure) {
        request.log.error(
          failure,
          "Could not tell the administrator the site failed.",
        );
        return;
      }

      // Within an hour either side, so that requests stamped out of order
      // count against one another, and a stamp far in the future does not use
      // up the hour for as long as it is ahead.
      told = told.filter((moment) => Math.abs(now - moment) < AN_HOUR);
      if (told.length >= MOST_IN_AN_HOUR) return;
      // Before anything is awaited, so that requests failing at the same
      // moment cannot between them send more than the limit.
      told.push(now);

      const sent = send(request, now, reference).finally(() =>
        sending.delete(sent),
      );
      sending.add(sent);
    },
    settled: async () => {
      while (sending.size > 0) await Promise.all([...sending]);
    },
  };
};
