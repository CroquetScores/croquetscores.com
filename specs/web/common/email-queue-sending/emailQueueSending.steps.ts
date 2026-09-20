import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import Fastify, { type FastifyInstance } from "fastify";

import {
  sendTheEmailQueue,
  type QueueToSend,
  type Timers,
} from "../../../../src/web/common/emailQueueSending.js";
import type { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import { clockFor } from "../../support/clock.js";

// A queue that records what it was asked to send and when, and takes as long
// over it as the scenario says: a round ends when the scenario's clock reaches
// the moment it is to, and not before.
interface Sending {
  /** The moment each round was asked to send what was due by. */
  readonly sentAt: string[];
  takes: number;
  fails: boolean;
  /** The rounds still going: when each ends, and what ends it. */
  going: { endsAt: number; end: () => void }[];
  /** What the scenario's timer calls, how often, and when it next does. */
  ticking: { every: number; work: () => void; next: number } | undefined;
  /** What the scenario's timer is to call once, and when. */
  waiting: { at: number; work: () => void }[];
  server: FastifyInstance | undefined;
  /** What happened, in the order it did, for whatever asserts an order. */
  readonly happened: ("a round finished" | "the server stopped")[];
}

const sendings = new WeakMap<SpecWorld, Sending>();

const sendingOf = (world: SpecWorld): Sending => {
  const sending = sendings.get(world);
  assert.ok(sending !== undefined, "This scenario has no queue.");
  return sending;
};

Given("a queue that records its sending", function (this: SpecWorld) {
  sendings.set(this, {
    sentAt: [],
    takes: 0,
    fails: false,
    going: [],
    ticking: undefined,
    waiting: [],
    server: undefined,
    happened: [],
  });
});

Given(
  "sending takes {int} seconds",
  function (this: SpecWorld, seconds: number) {
    sendingOf(this).takes = seconds * 1000;
  },
);

Given("sending the queue will fail", function (this: SpecWorld) {
  sendingOf(this).fails = true;
});

// A server with nothing on it but the sending, listening on a port of the
// machine's choosing: the sending starts when a server listens and ends when
// it closes, so the scenarios start and close a real one.
Given("the server is started", async function (this: SpecWorld) {
  const sending = sendingOf(this);
  const clock = clockFor(this);

  const queue: QueueToSend = {
    sendDue: (at: ReadOnlyDate) => {
      sending.sentAt.push(at.toISOString());
      return new Promise<void>((resolve, reject) => {
        const end = (): void => {
          sending.happened.push("a round finished");
          if (sending.fails) reject(new Error("The queue could not be sent."));
          else resolve();
        };
        if (sending.takes === 0) end();
        else
          sending.going.push({
            endsAt: clock.now.getTime() + sending.takes,
            end,
          });
      });
    },
  };

  const timers: Timers = {
    every: (every, work) => {
      sending.ticking = { every, work, next: clock.now.getTime() + every };
      return () => {
        sending.ticking = undefined;
      };
    },
    after: (milliseconds, work) => {
      const wait = { at: clock.now.getTime() + milliseconds, work };
      sending.waiting.push(wait);
      return () => {
        sending.waiting = sending.waiting.filter((other) => other !== wait);
      };
    },
  };

  const server = Fastify({ logger: false });
  sendTheEmailQueue(server, queue, () => new Date(clock.now.getTime()), timers);
  await server.listen({ port: 0, host: "127.0.0.1" });
  sending.server = server;
});

// Whatever was waiting on a promise gets its turn, so that a round which ended
// is known to have ended before the next thing happens.
const letThingsSettle = (): Promise<void> =>
  new Promise((resolve) => setImmediate(resolve));

// A second at a time. Within a second, the rounds that are to end do so before
// the timer is called, as they would on a machine: a round that ends as the 10
// seconds come up is out of the way of the round that starts then.
When("{int} seconds pass", async function (this: SpecWorld, seconds: number) {
  const sending = sendingOf(this);
  const clock = clockFor(this);

  for (let second = 0; second < seconds; second++) {
    clock.now = new Date(clock.now.getTime() + 1000);
    const now = clock.now.getTime();

    const ended = sending.going.filter((round) => round.endsAt <= now);
    sending.going = sending.going.filter((round) => round.endsAt > now);
    for (const round of ended) round.end();
    await letThingsSettle();

    if (sending.ticking !== undefined && sending.ticking.next <= now) {
      sending.ticking.next += sending.ticking.every;
      sending.ticking.work();
    }
    await letThingsSettle();

    const due = sending.waiting.filter((wait) => wait.at <= now);
    sending.waiting = sending.waiting.filter((wait) => wait.at > now);
    for (const wait of due) wait.work();
    await letThingsSettle();
  }
});

// Asked, and not waited for: a server with a round going has not stopped until
// the round's time is up, and only the scenario's next step moves the time.
When("the server is asked to stop", async function (this: SpecWorld) {
  const sending = sendingOf(this);
  assert.ok(sending.server !== undefined, "The server was never started.");
  void sending.server.close().then(() => {
    sending.happened.push("the server stopped");
  });
  await letThingsSettle();
});

Then(
  /^the queue has been sent (\d+) times?$/,
  function (this: SpecWorld, times: string) {
    assert.equal(sendingOf(this).sentAt.length, Number(times));
  },
);

Then(
  "the queue was last sent at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(sendingOf(this).sentAt.at(-1), new Date(moment).toISOString());
  },
);

Then("the server has stopped", function (this: SpecWorld) {
  assert.ok(sendingOf(this).happened.includes("the server stopped"));
});

Then("the server has not stopped", function (this: SpecWorld) {
  assert.ok(!sendingOf(this).happened.includes("the server stopped"));
});

Then(
  "the round being sent finished before the server stopped",
  function (this: SpecWorld) {
    assert.deepEqual(sendingOf(this).happened.slice(-2), [
      "a round finished",
      "the server stopped",
    ]);
  },
);

// A scenario that never asked its server to stop still leaves nothing
// listening. The rounds still going are ended first, since closing waits on
// them and nothing else is going to move the time.
After(async function (this: SpecWorld) {
  const sending = sendings.get(this);
  if (sending?.server === undefined) return;
  for (const round of sending.going) round.end();
  sending.going = [];
  await sending.server.close();
});
