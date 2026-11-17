// Time passing, as a scenario says it: the site's clock is put on by what is said,
// from wherever it reads now, which for a scenario that has said nothing is the
// machine's. A link made before is as old as it has been let to get.
import { Given } from "@cucumber/cucumber";

import { setTheClock, siteNow } from "./control.js";
import type { WebWorld } from "./world.js";

const aMinute = 60 * 1000;
const anHour = 60 * aMinute;
const aDay = 24 * anHour;

export const passes = async (milliseconds: number): Promise<void> => {
  const now = await siteNow();
  await setTheClock(new Date(now.getTime() + milliseconds).toISOString());
};

Given("an hour and a minute have passed", async function (this: WebWorld) {
  await passes(anHour + aMinute);
});

Given(
  "{int} hours and a minute have passed",
  async function (this: WebWorld, hours: number) {
    await passes(hours * anHour + aMinute);
  },
);

Given(
  "{int} hours and {int} minutes have passed",
  async function (this: WebWorld, hours: number, minutes: number) {
    await passes(hours * anHour + minutes * aMinute);
  },
);

Given(
  "{int} hours have passed",
  async function (this: WebWorld, hours: number) {
    await passes(hours * anHour);
  },
);

Given("a minute has passed", async function (this: WebWorld) {
  await passes(aMinute);
});

Given(
  "{int} minutes have passed",
  async function (this: WebWorld, minutes: number) {
    await passes(minutes * aMinute);
  },
);

Given("{int} days have passed", async function (this: WebWorld, days: number) {
  await passes(days * aDay);
});
