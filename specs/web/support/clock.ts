// The server's clock, as a scenario sets it, and the steps that move time on.
// On its own rather than with the application, because not everything that
// reads the server's clock needs the application built: what sends the email
// queue is given a clock and a queue and nothing else, and its scenarios say
// what the clock reads in the same words the application's do.
//
// Moving time moves both clocks a scenario might have: the moment an
// application scenario stamps its requests with, and the clock a browser
// scenario's application reads. A scenario has one or the other, and saying it
// once means a feature need not know which kind of scenario it is in.
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

const A_MINUTE = 60 * 1000;
const AN_HOUR = 60 * A_MINUTE;
const A_DAY = 24 * AN_HOUR;

export const movePast = (world: SpecWorld, milliseconds: number): void => {
  if (world.moment !== undefined) {
    world.moment = new Date(world.moment.getTime() + milliseconds);
  }
  const clock = clockFor(world);
  clock.now = new Date(clock.now.getTime() + milliseconds);
};

Given("an hour and a minute have passed", function (this: SpecWorld) {
  movePast(this, AN_HOUR + A_MINUTE);
});

Given(
  "{int} hours and a minute have passed",
  function (this: SpecWorld, hours: number) {
    movePast(this, hours * AN_HOUR + A_MINUTE);
  },
);

Given(
  "{int} hours and {int} minutes have passed",
  function (this: SpecWorld, hours: number, minutes: number) {
    movePast(this, hours * AN_HOUR + minutes * A_MINUTE);
  },
);

Given("{int} minutes have passed", function (this: SpecWorld, minutes: number) {
  movePast(this, minutes * A_MINUTE);
});

Given("{int} days have passed", function (this: SpecWorld, days: number) {
  movePast(this, days * A_DAY);
});
