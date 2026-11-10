// What the features of the public pages' markup share: a site with tournaments
// kept in it, a page asked for at a website in a language, and what was
// answered. Asked with a plain request rather than the browser, since what is
// read is the markup the site sends, and a browser would show the page instead.
//
// Here rather than beside one feature, because the sitemap, the canonical link
// and the page descriptions all say the same of the tournaments and of asking.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  created,
  inHandOf,
  load,
  momentOf,
  accountFor,
  tournamentNamed,
} from "../../application/operations/tournaments/aRequest.js";
import { CreateTournament } from "../../../src/application/operations/tournaments/CreateTournament.js";
import type { CreatedTournament } from "../../../src/application/operations/tournaments/CreateTournament.js";
import { Countries } from "../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import { Sport } from "../../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import type { SpecWorld } from "../../support/world.js";
import {
  anApplicationToldAboutSearchEngines,
  addressingOf,
} from "./browser.js";
import { changeTournament } from "./tournaments.js";

const organiser = "organiser@example.com";

/** What a page was answered with, and how it was asked for. */
export interface PageAsked {
  readonly status: number;
  readonly headers: Headers;
  readonly body: string;
}

interface Scenario {
  page: PageAsked | undefined;
  /** The name of the tournament made last, which a scenario goes on to change. */
  lastName: string | undefined;
  organiserGiven: boolean;
  /** What the home page's description was, where a scenario kept it. */
  homeDescription: string | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = {
      page: undefined,
      lastName: undefined,
      organiserGiven: false,
      homeDescription: undefined,
    };
    scenarios.set(world, found);
  }
  return found;
};

/** The page last asked for. */
export const pageAsked = (world: SpecWorld): PageAsked => {
  const { page } = scenarioOf(world);
  assert.ok(page !== undefined, "No page was asked for.");
  return page;
};

/**
 * The scenario's site, made when it is first needed: told search engines are
 * welcome where the scenario said so, since what a sitemap or a robots file
 * says is for the setting.
 */
export const theSite = async (
  world: SpecWorld,
  addresses?: readonly string[],
): Promise<string> => {
  world.baseUrl ??= await anApplicationToldAboutSearchEngines(
    world,
    world.searchEnginesSetting === "true",
    addresses,
  );
  return world.baseUrl;
};

const attribute = (text: string): string =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

/** Asks for `path` at `address`, in `language` where one is given. */
export const askFor = async (
  world: SpecWorld,
  path: string,
  address: string,
  language?: string,
): Promise<PageAsked> => {
  const base = await theSite(world);
  const response = await fetch(`${base}${path}`, {
    headers: {
      ...addressingOf(world),
      "x-forwarded-host": address,
      ...(language === undefined ? {} : { "accept-language": language }),
    },
    redirect: "manual",
  });
  const asked: PageAsked = {
    status: response.status,
    headers: response.headers,
    body: await response.text(),
  };
  scenarioOf(world).page = asked;
  // Kept where the steps of the search engines' feature look, so that what is
  // said of an answer there is said of this one in the same words.
  world.answeredWith = {
    headers: Object.fromEntries(response.headers.entries()),
    body: asked.body,
  };
  return asked;
};

/** The content of the `<meta>` named `name`, or of the Open Graph `property`. */
export const metaContent = (
  world: SpecWorld,
  by: "name" | "property",
  name: string,
): string | undefined => {
  const found = new RegExp(`<meta ${by}="${name}" content="([^"]*)"`).exec(
    pageAsked(world).body,
  );
  return found?.[1] === undefined ? undefined : attribute(found[1]);
};

/** The title of the page last asked for. */
export const titleOf = (world: SpecWorld): string => {
  const found = /<title>([^<]*)<\/title>/.exec(pageAsked(world).body);
  assert.ok(found?.[1] !== undefined, "The page has no title.");
  return attribute(found[1]);
};

// Making tournaments ------------------------------------------------------------

const givenTheOrganiser = async (world: SpecWorld): Promise<void> => {
  const scenario = scenarioOf(world);
  if (scenario.organiserGiven) return;
  assert.ok(
    world.accountsInHand !== undefined,
    "This scenario has nothing to make an account with.",
  );
  await world.accountsInHand.give(organiser, { confirmed: true });
  scenario.organiserGiven = true;
};

const makeTournament = async (
  world: SpecWorld,
  name: string,
  sportName: string,
  year: number,
  website: string,
): Promise<void> => {
  await theSite(world);
  await givenTheOrganiser(world);
  const sport = Sport.all.find((known) => known.name === sportName);
  assert.ok(sport !== undefined, `There is no sport ${sportName}.`);
  const account = await accountFor(world, organiser);
  const day = `${String(year)}-06-06T00:00:00Z`;
  const answer: CreatedTournament = await inHandOf(world).send(
    new CreateTournament(
      account.value,
      website,
      {
        name,
        starts: day,
        finishes: day,
        format: "Standard",
        sport: sport.code,
        country: "au",
        region: "vic",
      },
      momentOf(world),
    ),
  );
  created(world, answer.id, name);
  scenarioOf(world).lastName = name;
};

const lastTournament = (world: SpecWorld): string => {
  const { lastName } = scenarioOf(world);
  assert.ok(lastName !== undefined, "No tournament was made.");
  return lastName;
};

Given(
  /^a tournament "([^"]*)" of (.+) in (\d+) on (\S+)$/,
  async function (
    this: SpecWorld,
    name: string,
    sport: string,
    year: string,
    website: string,
  ) {
    await makeTournament(this, name, sport, Number(year), website);
  },
);

Given(
  "a tournament with a name of {int} characters in {int} on {word}",
  async function (
    this: SpecWorld,
    characters: number,
    year: number,
    website: string,
  ) {
    // Words of different lengths, since a name of one long word has nowhere to
    // be cut, and with capitals and small letters, which a name has to have.
    // No longer than an address can be: the router reads no more than a
    // hundred characters of one, and an address is its name's letters with a
    // hyphen between its words.
    const words = ["Tournament", "Open", "Championship", "Classic", "Cup"];
    let name = "";
    for (let at = 0; name.length < characters; at += 1) {
      name += `${at === 0 ? "" : " "}${words[at % words.length]!}`;
    }
    await makeTournament(
      this,
      name.slice(0, characters).trimEnd(),
      "Association Croquet",
      year,
      website,
    );
  },
);

Given(
  "the tournament is moved to {int}",
  async function (this: SpecWorld, year: number) {
    const at = `${String(year)}-06-06T00:00:00Z`;
    await changeTournament(this, lastTournament(this), {
      starts: at,
      finishes: at,
    });
  },
);

Given(
  "the tournament is renamed {string}",
  async function (this: SpecWorld, name: string) {
    await changeTournament(this, lastTournament(this), { name });
    scenarioOf(this).lastName = name;
  },
);

Given(
  // Not the steps that say what a tournament was made in, which begin the same:
  // its format, sport, country and region, or no region.
  /^the tournament is played in (?!no region$|the (?:format|sport|country|region) )(.+)$/,
  async function (this: SpecWorld, country: string) {
    const found = Countries.thereAre.all.find(({ name }) => name === country);
    assert.ok(found !== undefined, `There is no country ${country}.`);
    await changeTournament(this, lastTournament(this), {
      country: found.code,
      region: undefined,
    });
  },
);

const day = (written: string): string => {
  const at = new Date(`${written} UTC`);
  assert.ok(!Number.isNaN(at.getTime()), `${written} is not a day.`);
  return at.toISOString();
};

Given(
  /^the tournament is played from (.+) to (.+)$/,
  async function (this: SpecWorld, first: string, last: string) {
    await changeTournament(this, lastTournament(this), {
      starts: day(first),
      finishes: day(last),
    });
  },
);

// Asking --------------------------------------------------------------------------

When(
  "the page {string} is asked for at {string}",
  async function (this: SpecWorld, path: string, address: string) {
    await askFor(this, path, address);
  },
);

When(
  "the page {string} is asked for at {string} in the language {string}",
  async function (
    this: SpecWorld,
    path: string,
    address: string,
    language: string,
  ) {
    await askFor(this, path, address, language);
  },
);

When(
  "the page of the tournament is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    const tournament = await load(
      this,
      tournamentNamed(this, lastTournament(this)),
    );
    await askFor(this, `/${tournament.address.toString()}`, address);
  },
);

Then("there is no such page", function (this: SpecWorld) {
  assert.equal(pageAsked(this).status, 404);
});
