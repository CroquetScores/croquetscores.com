// An email is queued in the transaction of the command it is about, and sent
// outside any request. This is what sends it: every 10 seconds while the server
// is up, the queue is sent what is due by the moment the server's clock reads.
//
// In the server rather than in a process of its own, which would be a second
// thing to deploy, watch and restart; and here in the web layer because it
// reads the server's clock, and nothing below the web layer reads one.
import type { FastifyInstance } from "fastify";

import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";
import type { Clock } from "./requestedAt.js";

/**
 * What is asked of the queue: to send whatever is due by the moment given. By
 * its shape rather than by naming the Postgres queue, which only the
 * composition root may.
 */
export interface QueueToSend {
  sendDue(at: ReadOnlyDate): Promise<void>;
}

/**
 * What the sending asks of time: to be called over and over, and to be called
 * once. Each answers with how to call it off.
 */
export interface Timers {
  every(milliseconds: number, work: () => void): () => void;
  after(milliseconds: number, work: () => void): () => void;
}

const machineTimers: Timers = {
  every: (milliseconds, work) => {
    const timer = setInterval(work, milliseconds);
    return () => {
      clearInterval(timer);
    };
  },
  after: (milliseconds, work) => {
    const timer = setTimeout(work, milliseconds);
    return () => {
      clearTimeout(timer);
    };
  },
};

const BETWEEN_ROUNDS = 10_000;

// Less than the 30 seconds a host commonly allows a process to stop in, so
// that it is the server that decides to stop waiting and not the host.
const LONGEST_WAIT_TO_STOP = 20_000;

export const sendTheEmailQueue = (
  server: FastifyInstance,
  queue: QueueToSend,
  clock: Clock,
  // The machine's timers, unless a scenario passes the seconds itself.
  timers: Timers = machineTimers,
): void => {
  let stopTicking: (() => void) | undefined;
  let roundGoing: Promise<void> | undefined;

  const round = async (): Promise<void> => {
    try {
      await queue.sendDue(ReadOnlyDate.from(clock()));
    } catch (error) {
      // The database or the mail provider could not be reached. What was due
      // is still due, and the next round tries it again; letting this out
      // would be an unhandled rejection, which ends the process.
      server.log.error(error, "The email queue could not be sent.");
    }
  };

  const tick = (): void => {
    // A slow mail provider holds up the next round rather than piling rounds
    // on top of it. The tick is let pass rather than kept for later, so the
    // round after a slow one starts on the next tick and not the moment the
    // slow one ends.
    if (roundGoing !== undefined) return;
    roundGoing = round().finally(() => {
      roundGoing = undefined;
    });
  };

  // Once the server is listening, rather than as it is built or made ready:
  // an application a scenario builds and sends requests to without starting
  // is not up, and sends nothing.
  server.addHook("onListen", (done) => {
    stopTicking = timers.every(BETWEEN_ROUNDS, tick);
    done();
  });

  // Fastify waits on this before it says it has closed. Stopping part way
  // through a round is the one way an email gets sent twice, and a deploy is
  // the ordinary way a server stops.
  //
  // But not for ever. A mail provider that has stopped answering would hold
  // the server up until the host ends it where it stands, which cuts the
  // sending off just the same and leaves the deploy looking as though it had
  // failed. The email being sent then may be sent again, which is the lesser
  // harm.
  server.addHook("onClose", async () => {
    stopTicking?.();
    const going = roundGoing;
    if (going === undefined) return;

    await new Promise<void>((resolve) => {
      const stopWaiting = timers.after(LONGEST_WAIT_TO_STOP, () => {
        server.log.warn(
          "The server stopped while the email queue was still being sent.",
        );
        resolve();
      });
      // A round never rejects: what goes wrong in one is logged where it does.
      void going.then(() => {
        stopWaiting();
        resolve();
      });
    });
  });
};
