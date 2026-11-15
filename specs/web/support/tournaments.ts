// The tournaments a scenario says are already there, made by the site's own
// control as an account that is there, and changed the way the form changes
// one: everything it is, said again, with what the scenario changed. Known by
// the name the scenario gave them, and nothing but an id and a name is kept of
// them here, the rest being what the site says.
import { Given } from "@cucumber/cucumber";

import { call } from "./control.js";
import { telling } from "./headers.js";
import type { WebWorld } from "./world.js";

// What a tournament is when the scenario says nothing else: well made, in the
// sport and format its website offers first, from 3 to 5 October 2026, in
// Victoria.
const usual = (name: string): Record<string, unknown> => ({
  name,
  starts: "2026-10-03T00:00:00Z",
  finishes: "2026-10-05T00:00:00Z",
  format: "Standard",
  sport: "ac",
  country: "au",
  region: "vic",
});

// Where a country's tournaments are when one is moved to it, so that it is
// somewhere in it: the first of its regions, which a scenario that says which
// goes on to say so.
const firstRegionOf: Record<string, string> = { au: "act", nz: "auc" };

const refused = async (what: string, answer: Response): Promise<never> => {
  throw new Error(
    `The site would not ${what}: ${String(answer.status)} ${await answer.text()}`,
  );
};

const create = async (
  world: WebWorld,
  manager: string,
  name: string,
  website?: string,
): Promise<void> => {
  // The sport its website offers first, which is not croquet on a website for
  // another game.
  const request = {
    ...usual(name),
    ...world.ofTheNext,
    ...(website?.startsWith("gateballscores") === true ? { sport: "gb" } : {}),
  };
  const answer = await call("POST", "/tournaments", {
    manager,
    ...(website === undefined ? {} : { website }),
    tournament: request,
  });
  if (answer.status !== 201) await refused("make the tournament", answer);
  const { id } = (await answer.json()) as { id: string };
  world.tournaments.set(name, { id, manager, request });
};

const found = (world: WebWorld, name: string) => {
  const tournament = world.tournaments.get(name);
  if (tournament === undefined) {
    throw new Error(`No tournament called ${name} was created.`);
  }
  return tournament;
};

const change = async (
  world: WebWorld,
  name: string,
  changed: Record<string, unknown>,
): Promise<void> => {
  const tournament = found(world, name);
  const request = { ...tournament.request, ...changed };
  const answer = await call("POST", "/tournaments/update", {
    manager: tournament.manager,
    id: tournament.id,
    tournament: request,
  });
  if (answer.status !== 200) await refused("change the tournament", answer);
  tournament.request = request;
};

const moment = (date: string): string => `${date}T00:00:00Z`;

Given(
  "{string} has created the tournament {string}",
  async function (this: WebWorld, manager: string, name: string) {
    await create(this, manager, name);
  },
);

Given(
  "{string} has created the tournament {string} on the website {string}",
  async function (
    this: WebWorld,
    manager: string,
    name: string,
    website: string,
  ) {
    await create(this, manager, name, website);
  },
);

Given(
  "the tournament {string} starts on {string}",
  async function (this: WebWorld, name: string, date: string) {
    // A one-day tournament, until the scenario says it finishes later.
    await change(this, name, { starts: moment(date), finishes: moment(date) });
  },
);

Given(
  "the tournament {string} finishes on {string}",
  async function (this: WebWorld, name: string, date: string) {
    await change(this, name, { finishes: moment(date) });
  },
);

Given(
  "the tournament {string} is for the sport {string}",
  async function (this: WebWorld, name: string, sport: string) {
    await change(this, name, { sport });
  },
);

Given(
  "the tournament {string} is played in the country {string}",
  async function (this: WebWorld, name: string, country: string) {
    const region = firstRegionOf[country];
    if (region === undefined) {
      throw new Error(`The scenarios do not know the regions of ${country}.`);
    }
    await change(this, name, { country, region });
  },
);

Given(
  "the tournament {string} is played in the region {string}",
  async function (this: WebWorld, name: string, region: string) {
    await change(this, name, { region });
  },
);

Given(
  "the tournament {string} is national",
  async function (this: WebWorld, name: string) {
    await change(this, name, { national: true });
  },
);

Given(
  "the tournament {string} is international",
  async function (this: WebWorld, name: string) {
    await change(this, name, { international: true });
  },
);

Given(
  "{string} has archived the tournament {string}",
  async function (this: WebWorld, manager: string, name: string) {
    const answer = await call("POST", "/tournaments/archive", {
      manager,
      id: found(this, name).id,
    });
    if (answer.status !== 200) await refused("archive the tournament", answer);
  },
);

// The website the site is asked for, as something in front of it would say
// (the site trusts the machine the specs run on to say so).
Given(
  "a site served as {string}",
  async function (this: WebWorld, host: string) {
    await telling(this, "x-forwarded-host", host);
  },
);

// A tournament in each of a run of years, each called "Open" and the year, for
// a scenario that wants many years to be there and cares about none of them.
Given(
  "{string} manages a tournament in each year from {int} to {int}",
  async function (this: WebWorld, manager: string, from: number, to: number) {
    for (let year = from; year <= to; year++) {
      const name = `Open ${String(year)}`;
      await create(this, manager, name);
      const at = `${String(year)}-06-06T00:00:00Z`;
      await change(this, name, { starts: at, finishes: at });
    }
  },
);

// Said of the next tournaments the scenario creates, until it says otherwise.
Given(
  "the tournament is to start at {string}",
  function (this: WebWorld, moment: string) {
    this.ofTheNext = { ...this.ofTheNext, starts: moment, finishes: moment };
  },
);

// Each called "Tournament 1", "Tournament 2" and so on, for a scenario that
// wants many and cares about none of them.
Given(
  "{string} has created {int} tournaments",
  async function (this: WebWorld, manager: string, count: number) {
    for (let each = 1; each <= count; each++) {
      await create(this, manager, `Tournament ${String(each)}`);
    }
  },
);
