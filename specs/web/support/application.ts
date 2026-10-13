// The application as the server builds it, for scenarios about what the web
// layer puts together, and what they need of it: a clock the scenario sets, the
// example route, and what the route answered.
//
// Here rather than in specs/support/ because it builds the whole application,
// infrastructure and all, and specs/support/ is loaded by every spec in the
// repository and so may not.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { LightMyRequestResponse } from "fastify";
import { Writable } from "node:stream";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import {
  applicationEvents,
  buildApplication,
  type Application,
} from "../../../src/web/server.js";
import { RecordingSender } from "../../infrastructure/support/emailQueue.js";
import { aFakeOfHaveIBeenPwned } from "../../infrastructure/support/breachedPasswords.js";
import { useUnitOfWork } from "../../infrastructure/support/transactions.js";
import { listsStoodUpBy } from "../../infrastructure/support/worldRankings.js";
import { exampleRegistry } from "../../support/exampleEvents.js";
import type { SpecWorld } from "../../support/world.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import { accountsThrough } from "./accounts.js";
import { clockFor } from "./clock.js";
import { scenarioLanguages } from "./languages.js";

export interface Built {
  /**
   * The application as it is now. Replaced when the scenario says the site is
   * restarted, so that what asks for it asks afresh.
   */
  application: Application;
  route?: { method: "GET" | "POST"; url: string };
  response?: LightMyRequestResponse;
  /**
   * What the scenario has mounted on the application's server, kept so that a
   * restarted site has the same routes: a route belongs to a server, and a
   * restart is a new one.
   */
  readonly mounted: Array<(application: Application) => void>;
}

const built = new WeakMap<SpecWorld, Built>();

export const builtFor = (world: SpecWorld): Built => {
  const found = built.get(world);
  assert.ok(
    found !== undefined,
    "This scenario has not built the application.",
  );
  return found;
};

// What the scenario has said of how the site is set up, as the environment
// would say it, so that it goes through the same reading the site's own
// configuration does. Held apart from the application because setting it
// builds the application again: the application is built before a scenario
// says anything, as a Background.
const settings = new WeakMap<SpecWorld, Record<string, string>>();

/** Sets one setting as `.env` would, for the next time the site is built. */
export const settingOf = (world: SpecWorld): Record<string, string> => {
  let found = settings.get(world);
  if (found === undefined) {
    found = {};
    settings.set(world, found);
  }
  return found;
};

// What the application is told to send an email with, and what it logged.
// Kept per scenario, across a restart, so that what the first site sent is
// still there to count when the second has sent more.
const senders = new WeakMap<SpecWorld, RecordingSender>();
const logs = new WeakMap<SpecWorld, string[]>();

/** What the site sent, and how it fails to when the scenario says so. */
export const senderOf = (world: SpecWorld): RecordingSender => {
  let found = senders.get(world);
  if (found === undefined) {
    found = new RecordingSender();
    senders.set(world, found);
  }
  return found;
};

const linesOf = (world: SpecWorld): string[] => {
  let found = logs.get(world);
  if (found === undefined) {
    found = [];
    logs.set(world, found);
  }
  return found;
};

/** Everything the site logged at warning or worse, as lines of JSON. */
export const logOf = (world: SpecWorld): readonly string[] => linesOf(world);

// Over the scenario's own database, with a clock the scenario sets, reading a
// fixed moment until it does. The steps every pipeline feature is written in
// keep the mediator, the validation behaviour and the unit of work on the
// scenario, and here they are handed the application's: so "the example
// command is sent" goes through what the composition root put together, and
// nothing a step assembled for itself.
// The scenarios that were built with the site's own events and read models.
const ownKinds = new WeakSet<SpecWorld>();

const standUp = async (
  world: SpecWorld,
  first: boolean,
): Promise<Application> => {
  const databaseUrl = world.database.options.connectionString;
  assert.ok(databaseUrl !== undefined, "The scenario's database has no URL.");

  loadEnvFile();
  const clock = clockFor(world);
  // Asking whether a password has been breached goes to a fake of Have I Been
  // Pwned, stood up here rather than left to the scenario: the application
  // would otherwise be built asking the real service, and a scenario that sent
  // a command carrying a password would reach across the internet from a test
  // run. Standing it up for every scenario costs a port and nothing else, and
  // means what the application was asked can be read in any of them.
  if (world.breachedPasswords === undefined) await aFakeOfHaveIBeenPwned(world);
  const breachedPasswords = world.breachedPasswords;
  assert.ok(
    breachedPasswords !== undefined,
    "The fake of Have I Been Pwned left no check behind it.",
  );
  const lines = linesOf(world);
  const application = await buildApplication(
    {
      ...loadConfig({ ...process.env, ...settingOf(world) }),
      databaseUrl,
    },
    {
      // Warnings and worse, kept for a scenario that asks what was logged. A
      // request log is not wanted here, and is what "off" was for.
      logger: {
        level: "warn",
        stream: new Writable({
          write(chunk, _encoding, done) {
            lines.push(String(chunk));
            done();
          },
        }),
      },
      clock: () => new Date(clock.now.getTime()),
      breachedPasswords,
      // Whatever the scenario's sender does: nothing leaves the machine, and
      // what the site sent can be read.
      emailSender: senderOf(world),
      // Never the rankings' own site: whatever fake the scenario stands up.
      worldRankingLists: listsStoodUpBy(world),
      // English and the test locale, as every browser scenario is served.
      languages: scenarioLanguages,
      // The example events, and the scenario's own list of projections, so
      // that a projection named after this step is still given what the
      // application's store appends. Unless the scenario asked for the site's
      // own: then the kinds of event it keeps beside the examples, and the
      // read models it is given, which is what finding an account needs.
      ...(ownKinds.has(world)
        ? { events: exampleRegistry({ on: applicationEvents() }) }
        : { events: exampleRegistry(), projections: world.projections }),
    },
  );

  // Closed with the scenario's database, before it is dropped, rather than by
  // a hook of its own that might run either side of the drop. The server and
  // the pool each on their own, so that the server failing to close does not
  // leave the pool open, holding the run up until its idle connections time
  // out. Every application a scenario starts is closed here, and none sooner:
  // what the scenario's steps hold on to, the first one's unit of work among
  // them, goes on working over its pool until the scenario is over.
  world.closeBeforeDropping.push(
    () => application.server.close(),
    () => application.pool.end(),
  );

  world.mediator = application.mediator;
  world.validation = application.validation;
  // Once, since a scenario has one unit of work however many times its site
  // is started: what it is told to watch is the first's.
  if (first) useUnitOfWork(world, application.unitOfWork);
  // The steps the event store's features are written in append through the
  // scenario's store, as a request would; here, the application's. Asked of
  // the scenario's application when it is used, so that a site that has been
  // started again is the one a request runs in.
  world.eventStore = application.eventStore;
  world.asARequest = (work) =>
    builtFor(world).application.unitOfWork.inTransaction(work);
  // The accounts a scenario says are already there are made as the site makes
  // them, through this application.
  world.accountsInHand = accountsThrough(application, () =>
    ReadOnlyDate.from(new Date(clock.now.getTime())),
  );
  return application;
};

async function buildTheApplication(this: SpecWorld): Promise<void> {
  // A step that came first would have made the scenario a mediator of its own
  // and registered with that, and handing over the application's here would
  // quietly leave what it registered behind.
  assert.ok(
    this.mediator === undefined && this.validation === undefined,
    "This scenario already has a mediator. The application is built before anything is registered.",
  );

  const entry: Built = {
    application: await standUp(this, true),
    mounted: [],
  };
  built.set(this, entry);
  this.closeBeforeDropping.push(() => {
    built.delete(this);
    return Promise.resolve();
  });
}

Given("the application is built", buildTheApplication);

// For a scenario that needs accounts, or anything else the site keeps in its
// own events: the example kinds of event stay, beside them. The example
// projections are left out, since the site's own read models are what find an
// account, and a scenario that sets its own projections is not asking for this.
Given(
  "the application is built with the site's own events and read models",
  async function (this: SpecWorld) {
    ownKinds.add(this);
    await buildTheApplication.call(this);
  },
);

/** Mounts something on the application's server, and on every one after it. */
export const mount = (
  world: SpecWorld,
  mounting: (application: Application) => void,
): void => {
  const entry = builtFor(world);
  mounting(entry.application);
  entry.mounted.push(mounting);
};

/**
 * Starts the site again over the same database, with whatever the scenario
 * has said of its settings since, and everything it mounted. What the site
 * held in its memory is gone, which is the point of doing it. The one it
 * replaces is left open until the scenario ends: a step may still be holding
 * its unit of work.
 */
export const restart = async (world: SpecWorld): Promise<void> => {
  const entry = builtFor(world);
  // What the site was telling the administrator is finished first, so that a
  // restart does not leave a send half done to be counted by nobody.
  await entry.application.databaseOutageTold();
  world.mediator = undefined;
  world.validation = undefined;
  entry.application = await standUp(world, false);
  for (const mounting of entry.mounted) mounting(entry.application);
};
