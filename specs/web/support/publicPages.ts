// What the features of the public pages' markup share: a site with tournaments
// kept in it, a page asked for at a website in a language, and what was
// answered. Asked with a plain request rather than the browser, since what is
// read is the markup the site sends, and a browser would show the page instead.
//
// Here rather than beside one feature, because the canonical link, the page
// descriptions and the manifest all say the same of the tournaments and of asking.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "./control.js";
import { siteTold } from "./site.js";
import type { WebWorld } from "./world.js";

const organiser = "organiser@example.com";

/** What a page was answered with, and how it was asked for. */
export interface PageAsked {
  readonly status: number;
  readonly headers: Headers;
  readonly body: string;
}

const asked = new WeakMap<WebWorld, PageAsked>();

/** The page last asked for. */
export const pageAsked = (world: WebWorld): PageAsked => {
  const found = asked.get(world);
  assert.ok(found !== undefined, "No page was asked for.");
  return found;
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
  world: WebWorld,
  path: string,
  address: string,
  language?: string,
): Promise<PageAsked> => {
  const response = await fetch(`${world.baseUrl!}${path}`, {
    headers: {
      ...world.extraHeaders,
      "x-forwarded-host": address,
      ...(language === undefined ? {} : { "accept-language": language }),
    },
    redirect: "manual",
  });
  const page: PageAsked = {
    status: response.status,
    headers: response.headers,
    body: await response.text(),
  };
  asked.set(world, page);
  return page;
};

/** The content of the `<meta>` named `name`, or of the Open Graph `property`. */
export const metaContent = (
  world: WebWorld,
  by: "name" | "property",
  name: string,
): string | undefined => {
  const found = new RegExp(`<meta ${by}="${name}" content="([^"]*)"`).exec(
    pageAsked(world).body,
  );
  return found?.[1] === undefined ? undefined : attribute(found[1]);
};

/** The title of the page last asked for. */
export const titleOf = (world: WebWorld): string => {
  const found = /<title>([^<]*)<\/title>/.exec(pageAsked(world).body);
  assert.ok(found?.[1] !== undefined, "The page has no title.");
  return attribute(found[1]);
};

// Making tournaments ------------------------------------------------------------

// The sports a scenario names, by the code the site keeps them by.
const sportCodes: Readonly<Record<string, string>> = {
  "Association Croquet": "ac",
  "Golf Croquet": "gc",
  Gateball: "gb",
};

// The countries a scenario names, by their codes.
const countryCodes: Readonly<Record<string, string>> = {
  "New Zealand": "nz",
  "South Georgia and the South Sandwich Islands": "gs",
};

const lastNames = new WeakMap<WebWorld, string>();
const organiserMade = new WeakSet<WebWorld>();

const makeTournament = async (
  world: WebWorld,
  name: string,
  sportName: string,
  year: number,
  website: string,
): Promise<void> => {
  if (!organiserMade.has(world)) {
    organiserMade.add(world);
    const answer = await call("POST", "/accounts", { emailAddress: organiser });
    if (answer.status !== 201) throw new Error("The organiser was not made.");
  }
  const sport = sportCodes[sportName];
  assert.ok(
    sport !== undefined,
    `The specs do not know the sport ${sportName}.`,
  );
  const day = `${String(year)}-06-06T00:00:00Z`;
  const request = {
    name,
    starts: day,
    finishes: day,
    format: "Standard",
    sport,
    country: "au",
    region: "vic",
  };
  const answer = await call("POST", "/tournaments", {
    manager: organiser,
    website,
    tournament: request,
  });
  if (answer.status !== 201) {
    throw new Error(
      `The site would not make it: ${String(answer.status)} ${await answer.text()}`,
    );
  }
  const { id, address } = (await answer.json()) as {
    id: string;
    address: string;
  };
  world.tournaments.set(name, { id, manager: organiser, request, address });
  lastNames.set(world, name);
};

const lastTournament = (world: WebWorld): string => {
  const found = lastNames.get(world);
  assert.ok(found !== undefined, "No tournament was made.");
  return found;
};

const changeLast = async (
  world: WebWorld,
  changed: Record<string, unknown>,
): Promise<void> => {
  const tournament = world.tournaments.get(lastTournament(world))!;
  const request = { ...tournament.request, ...changed };
  const answer = await call("POST", "/tournaments/update", {
    manager: organiser,
    id: tournament.id,
    tournament: request,
  });
  if (answer.status !== 200) {
    throw new Error(
      `The site would not change it: ${String(answer.status)} ${await answer.text()}`,
    );
  }
  tournament.request = request;
};

Given(
  /^a tournament "([^"]*)" of (.+) in (\d+) on (\S+)$/,
  async function (
    this: WebWorld,
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
    this: WebWorld,
    characters: number,
    year: number,
    website: string,
  ) {
    // Words of different lengths, since a name of one long word has nowhere to be
    // cut, and with capitals and small letters, which a name has to have. No
    // longer than an address can be: the router reads no more than a hundred
    // characters of one, and an address is its name's letters with a hyphen
    // between its words.
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
  async function (this: WebWorld, year: number) {
    const at = `${String(year)}-06-06T00:00:00Z`;
    await changeLast(this, { starts: at, finishes: at });
  },
);

Given(
  "the tournament is renamed {string}",
  async function (this: WebWorld, name: string) {
    const was = lastTournament(this);
    await changeLast(this, { name });
    this.tournaments.set(name, this.tournaments.get(was)!);
    lastNames.set(this, name);
  },
);

Given(
  // Not the steps that say what a tournament was made in, which begin the same:
  // its format, sport, country and region, or no region.
  /^the tournament is played in (?!no region$|the (?:format|sport|country|region) )(.+)$/,
  async function (this: WebWorld, country: string) {
    const code = countryCodes[country];
    assert.ok(
      code !== undefined,
      `The specs do not know the country ${country}.`,
    );
    await changeLast(this, { country: code, region: undefined });
  },
);

const day = (written: string): string => {
  const at = new Date(`${written} UTC`);
  assert.ok(!Number.isNaN(at.getTime()), `${written} is not a day.`);
  return at.toISOString();
};

Given(
  /^the tournament is played from (.+) to (.+)$/,
  async function (this: WebWorld, first: string, last: string) {
    await changeLast(this, { starts: day(first), finishes: day(last) });
  },
);

// Asking --------------------------------------------------------------------------

When(
  "the page {string} is asked for at {string}",
  async function (this: WebWorld, path: string, address: string) {
    await askFor(this, path, address);
  },
);

When(
  "the page {string} is asked for at {string} in the language {string}",
  async function (
    this: WebWorld,
    path: string,
    address: string,
    language: string,
  ) {
    await askFor(this, path, address, language);
  },
);

When(
  "the page of the tournament is asked for at {string}",
  async function (this: WebWorld, address: string) {
    const tournament = this.tournaments.get(lastTournament(this))!;
    await askFor(this, `/${tournament.address}`, address);
  },
);

Then("there is no such page", function (this: WebWorld) {
  assert.equal(pageAsked(this).status, 404);
});

// A site told search engines are welcome, as a deployment is told by its settings:
// another site, over the same database.
Given(
  "the site is told search engines are welcome",
  async function (this: WebWorld) {
    this.baseUrl = (await siteTold({ SEARCH_ENGINES_WELCOME: "true" })).baseUrl;
  },
);

When(
  "the sitemap is asked for at {string}",
  async function (this: WebWorld, address: string) {
    await askFor(this, "/sitemap.xml", address);
  },
);
