import { After, Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ExampleCommand } from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";
import { builtFor } from "../../support/application.js";
import { clockFor } from "../../support/clock.js";

// Moved from inside the handler, so that it moves while the request is being
// served: after the request arrived, and before anything else it sends.
Given(
  "the server's clock moves on a minute whenever the example command is handled",
  function (this: SpecWorld) {
    const clock = clockFor(this);
    this.whatTheExampleHandlerAlsoDoes.push(() => {
      clock.now = new Date(clock.now.getTime() + 60_000);
      return Promise.resolve();
    });
  },
);

Given(
  "an example route that sends the example command twice",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.post("/example", async (request) => {
      await request.server.mediator.send(
        new ExampleCommand(request.requestedAt),
      );
      return request.server.mediator.send(
        new ExampleCommand(request.requestedAt),
      );
    });
    scenario.route = { method: "POST", url: "/example" };
  },
);

// The zone the whole process reads local time in, which is what "the server is
// in" amounts to. Node takes a change to TZ from the next date it reads, and
// the zone the run started in is put back after the scenario.
const zoneBefore = new WeakMap<SpecWorld, { zone: string | undefined }>();

Given(
  "the server is in the time zone {string}",
  function (this: SpecWorld, zone: string) {
    if (!zoneBefore.has(this)) zoneBefore.set(this, { zone: process.env.TZ });
    process.env.TZ = zone;
  },
);

After(function (this: SpecWorld) {
  const before = zoneBefore.get(this);
  if (before === undefined) return;
  if (before.zone === undefined) delete process.env.TZ;
  else process.env.TZ = before.zone;
});

// The commands the handler was given, as it was given them: what the route
// sent, rather than what the route meant to.
const examplesHandled = (world: SpecWorld): ExampleCommand[] =>
  world.handledRequests.filter(
    (request): request is ExampleCommand => request instanceof ExampleCommand,
  );

const askedFor = (command: ExampleCommand | undefined): string => {
  assert.ok(command !== undefined, "That example command was never handled.");
  return command.requestedAt.toISOString();
};

Then(
  "the example command was asked for at {string}",
  function (this: SpecWorld, moment: string) {
    const handled = examplesHandled(this);
    assert.equal(
      handled.length,
      1,
      `The example command was handled ${handled.length} times.`,
    );
    assert.equal(askedFor(handled[0]), moment);
  },
);

Then(
  /^the (first|second) example command was asked for at "([^"]*)"$/,
  function (this: SpecWorld, which: string, moment: string) {
    const handled = examplesHandled(this);
    assert.equal(askedFor(handled[which === "first" ? 0 : 1]), moment);
  },
);
