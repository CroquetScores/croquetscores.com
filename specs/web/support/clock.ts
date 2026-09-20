// The server's clock, as a scenario sets it. On its own rather than with the
// application, because not everything that reads the server's clock needs the
// application built: what sends the email queue is given a clock and a queue
// and nothing else, and its scenarios say what the clock reads in the same
// words the application's do.
import { Given } from "@cucumber/cucumber";

import { askedAt } from "../../support/examples.js";
import type { SpecWorld } from "../../support/world.js";

export interface ScenarioClock {
  /** What the server's clock reads. The scenario moves it; nothing else does. */
  now: Date;
}

const clocks = new WeakMap<SpecWorld, ScenarioClock>();

// Made when it is first asked for, reading a fixed moment until the scenario
// sets it, so that a step which sets the clock and a step which builds what
// reads it can come in either order.
export const clockFor = (world: SpecWorld): ScenarioClock => {
  let clock = clocks.get(world);
  if (clock === undefined) {
    clock = { now: askedAt.toDate() };
    clocks.set(world, clock);
  }
  return clock;
};

Given(
  "the server's clock reads {string}",
  function (this: SpecWorld, moment: string) {
    clockFor(this).now = new Date(moment);
  },
);
