import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  type CreatedTournament,
  CreateTournament,
} from "../../../../src/application/operations/tournaments/CreateTournament.js";
import { AddBlock } from "../../../../src/application/operations/tournaments/AddBlock.js";
import { Website } from "../../../../src/domain/common/Website.js";
import { signOutPath } from "../../../../src/web/common/accountMenu.js";
import { signInPath } from "../../../../src/web/public/signIn.js";
import {
  accountFor,
  created,
  inHandOf,
  load,
  momentOf,
  tournamentNamed,
} from "../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../support/world.js";
import { announcedAs, isMarked, unmarkedWithin } from "../../support/marks.js";
import { ordinal } from "../../support/ordinals.js";
import { changeTournament } from "../../support/tournaments.js";

// The admin draws the list itself, after asking the API for it, so nothing
// here is read until the list says it is the answer to what was last asked
// (Tournaments.tsx). What is read is then asked again for a while before it is
// taken as failing, since a list redrawn once something is pressed is redrawn
// a moment after the press.

// On the list's own pages, /admin/ and /admin/2025, which are the ones that
// say when they are busy; every other page of the admin is settled once it has
// loaded.
const settled = async (world: SpecWorld): Promise<void> => {
  const path = new URL(world.browserPage.url()).pathname;
  if (!/^\/admin\/(\d{4})?$/.test(path)) return;
  await world.browserPage.locator('main .panel[aria-busy="false"]').waitFor();
};

const eventually = async (
  world: SpecWorld,
  check: () => Promise<void>,
): Promise<void> => {
  await settled(world);
  // Three seconds, which leaves the step time to fail with what it found
  // rather than with Cucumber's word that it took too long.
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

// The words exactly, rather than any row whose name holds them: "Open" is in
// every tournament's name in some of these scenarios.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const rows = (world: SpecWorld): Locator =>
  world.browserPage.locator(".tournaments > .tournament");

const rowOf = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".tournament-name", {
      hasText: exactly(name),
    }),
  });

const nameOf = (world: SpecWorld, name: string): Locator =>
  rowOf(world, name).locator(".tournament-name");

// What `expression` makes of the name of the tournament `name`, called
// element there. Written as an expression, as the other steps write what they
// run in the page, since the specs are typed without the browser's own types.
// The public lists' among them, the home page's and a year's, which are tables.
const names =
  ":is(.tournaments > .tournament, .tournament-list tbody tr) .tournament-name";
const inNameOf = async <T>(
  world: SpecWorld,
  name: string,
  expression: string,
): Promise<T> => {
  const at = (await world.browserPage.locator(names).allTextContents()).indexOf(
    name,
  );
  assert.ok(at >= 0, `${name} is not listed.`);
  return world.browserPage.evaluate<T>(
    `(() => { const element = document.querySelectorAll(${JSON.stringify(names)})[${String(at)}]; return ${expression}; })()`,
  );
};

// By the name it is given, which is its words or, where it is drawn as a
// picture, its label.
const optionOf = (world: SpecWorld, name: string, option: string): Locator => {
  const options = rowOf(world, name).locator(".tournament-options");
  return options
    .getByRole("button", { name: option, exact: true })
    .or(options.getByRole("link", { name: option, exact: true }));
};

// The years bar, the one seen rather than the copy it measures with. The
// admin's and the home page's: the admin fits the years to the window by
// measuring them, and draws the drop-down list as a list to choose from; the
// home page fits them with no scripting, drawing every year both as a tab and
// in the drop-down list and showing each in one of them, and its drop-down list
// is a disclosure of links. So a tab or a drop-down list is only one the
// reader can see.
const shownYears = "nav.years .years-row > ul:not(.years-measuring)";
const tabs = (world: SpecWorld): Locator =>
  world.browserPage.locator(`${shownYears} > li > a`).filter({ visible: true });
const dropDown = (world: SpecWorld): Locator =>
  world.browserPage
    .locator(`${shownYears} :is(select, details)`)
    .filter({ visible: true });

const tabYears = async (world: SpecWorld): Promise<number[]> =>
  (await tabs(world).allTextContents()).map(Number);

// What the browser has of its own that these ask of it, since the specs are
// typed without the browser's own types.
interface Shown {
  readonly localName: string;
  readonly textContent: string | null;
  getAttribute(name: string): string | null;
  querySelector(selector: string): Shown | null;
  querySelectorAll(selector: string): ArrayLike<Shown>;
}

interface InThePage {
  getComputedStyle(element: Shown): { readonly display: string };
}

// A disclosure's years are those it would show opened, which is every one not
// left out of it, open or not.
const dropDownYears = async (world: SpecWorld): Promise<number[]> => {
  if ((await dropDown(world).count()) === 0) return [];
  const values = await dropDown(world).evaluate((element) => {
    const list = element as unknown as Shown;
    const page = globalThis as unknown as InThePage;
    return list.localName === "select"
      ? Array.from(list.querySelectorAll("option"), (option) =>
          option.getAttribute("value"),
        )
      : Array.from(list.querySelectorAll("li"))
          .filter((item) => page.getComputedStyle(item).display !== "none")
          .map((item) => (item.textContent ?? "").trim());
  });
  return values
    .filter((value): value is string => value !== null && value !== "")
    .map(Number);
};

// What the drop-down list is called for a reader who is listening rather than
// looking: a list to choose from by its label, and a disclosure by its summary.
const dropDownNamed = (world: SpecWorld): Promise<string | null> =>
  dropDown(world).evaluate((element) => {
    const list = element as unknown as Shown;
    return list.localName === "select"
      ? list.getAttribute("aria-label")
      : (list.querySelector("summary")?.textContent?.trim() ?? null);
  });

const yearsOffered = async (world: SpecWorld): Promise<number[]> => [
  ...(await tabYears(world)),
  ...(await dropDownYears(world)),
];

// The reader and their clock ----------------------------------------------------

// The browser's clock rather than the site's: this year is the reader's year.
// At noon, so that the day is the day named wherever the browser thinks it is.
Given(
  "the reader's clock says {string}",
  async function (this: SpecWorld, day: string) {
    await this.browserPage.clock.setFixedTime(new Date(`${day}T12:00:00`));
  },
);

// Signed out as the account menu signs a reader out, so that the session is
// ended rather than only forgotten by the browser.
Given("the reader has signed out", async function (this: SpecWorld) {
  // Once signing in has finished, which it has not until the browser has left
  // the sign in page: pressing the button returns before the answer that
  // keeps the session comes back, and signing out before it would be undone
  // by it.
  await this.browserPage.waitForURL((url) => url.pathname !== signInPath);
  // Posted from the page, so that it goes with the browser's own cookie. It
  // was posted with Playwright's request instead, which does not send a secure
  // cookie to a site served over plain http, as the scenarios' is: the server
  // was asked to end no session, ended none, and took the cookie away all the
  // same. The reader looked signed out only until an answer the admin had
  // asked for before then came back and renewed the cookie, which a run with
  // scenarios in parallel was slow enough to show.
  const status = await this.browserPage.evaluate(
    async (path) =>
      (await fetch(path, { method: "POST", redirect: "manual" })).status,
    signOutPath,
  );
  // A redirect not followed is answered to a script as status 0, and the
  // redirect is what signing out answers with.
  assert.equal(status, 0, `Signing out answered ${String(status)}.`);
});

// Opening the admin at a year --------------------------------------------------

const openAdminFor = async function (
  this: SpecWorld,
  year: number,
): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/admin/${String(year)}`);
};

Given("the admin for {int} is open", openAdminFor);
When("the admin for {int} is opened", openAdminFor);

// The tournaments there are -----------------------------------------------------

// A tournament of one day unless the scenario goes on to say when it
// finishes, so that a start moved into another year leaves a tournament that
// makes sense rather than one running for a year and more.
Given(
  "the tournament {string} starts on {string}",
  async function (this: SpecWorld, name: string, day: string) {
    const at = `${day}T00:00:00Z`;
    await changeTournament(this, name, { starts: at, finishes: at });
  },
);

Given(
  "the tournament {string} finishes on {string}",
  async function (this: SpecWorld, name: string, day: string) {
    await changeTournament(this, name, { finishes: `${day}T00:00:00Z` });
  },
);

Given(
  "the tournament {string} is for the sport {string}",
  async function (this: SpecWorld, name: string, sport: string) {
    await changeTournament(this, name, { sport });
  },
);

// Before anything is added to it, since a tournament's teams and tests, or its
// players and competitions, fix whether it is played by teams.
Given(
  "the tournament {string} is played in the format {string}",
  async function (this: SpecWorld, name: string, format: string) {
    await changeTournament(this, name, { format });
  },
);

// Created on a website in the first sport it offers, since a tournament on
// Gateball Scores is a game of gateball whatever else it is.
const createdAs = async (
  world: SpecWorld,
  address: string,
  name: string,
  website: string,
  starts = "2026-10-03T00:00:00Z",
  finishes = "2026-10-05T00:00:00Z",
): Promise<void> => {
  const account = await accountFor(world, address);
  const answer: CreatedTournament = await inHandOf(world).send(
    new CreateTournament(
      account.value,
      website,
      {
        name,
        starts,
        finishes,
        format: "Standard",
        sport: Website.from(website).site === "gateballScores" ? "gb" : "ac",
        country: "au",
        region: "vic",
      },
      momentOf(world),
    ),
  );
  created(world, answer.id, name);
};

Given(
  "{string} has created the tournament {string} on the website {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    website: string,
  ) {
    await createdAs(this, address, name, website);
  },
);

Given(
  "{string} manages a tournament in each year from {int} to {int}",
  async function (this: SpecWorld, address: string, from: number, to: number) {
    for (let year = from; year <= to; year++) {
      const at = `${String(year)}-06-06T00:00:00Z`;
      await createdAs(
        this,
        address,
        `Open ${String(year)}`,
        "croquetscores.com",
        at,
        at,
      );
    }
  },
);

// What the reader does ----------------------------------------------------------

// Whichever way the year is offered, as a tab or in the drop-down list, since
// what the scenario is saying is that the reader chose it.
When(
  "the year {int} is chosen",
  async function (this: SpecWorld, year: number) {
    await settled(this);
    if ((await tabYears(this)).includes(year)) {
      await tabs(this)
        .filter({ hasText: exactly(String(year)) })
        .click();
    } else {
      await dropDown(this).selectOption(String(year));
    }
  },
);

When(
  "{int} is chosen from the drop-down list",
  async function (this: SpecWorld, year: number) {
    await settled(this);
    await dropDown(this).selectOption(String(year));
  },
);

When("the browser goes back", async function (this: SpecWorld) {
  await this.browserPage.goBack();
});

When(
  /^the window is (?:narrowed|widened) to (\d+) pixels$/,
  async function (this: SpecWorld, width: string) {
    await settled(this);
    await this.browserPage.setViewportSize({
      width: Number(width),
      height: 800,
    });
  },
);

When(
  "the name {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await settled(this);
    await nameOf(this, name).click();
    await this.browserPage.waitForLoadState();
  },
);

// Pressed, and then waited on until the list has been asked for again, so
// that the next step reads what pressing it did.
Given(
  "{string} is pressed for the tournament {string}",
  async function (this: SpecWorld, option: string, name: string) {
    await settled(this);
    await optionOf(this, name, option).click();
    await this.browserPage.waitForLoadState();
    // Still on the list, where what was pressed changed the tournament rather
    // than leading away from it, so the list is waited on to be asked again.
    if (/^\/admin\/(\d{4})?$/.test(new URL(this.browserPage.url()).pathname)) {
      await settled(this);
    }
  },
);

// Where the reader is ------------------------------------------------------------

// The choices after the question mark too where the address names any, since
// the list keeps what was chosen there.
Then("the address is {string}", async function (this: SpecWorld, path: string) {
  await this.browserPage.waitForURL(
    (url) =>
      (path.includes("?") ? `${url.pathname}${url.search}` : url.pathname) ===
      path,
  );
});

// The list ------------------------------------------------------------------------

Then(
  "the tournament {string} is listed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
    });
  },
);

Then(
  "the tournament {string} is not listed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 0);
    });
  },
);

Then(
  "the list says there are no tournaments",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(
        await this.browserPage.locator(".tournaments-none").count(),
        1,
      );
    });
  },
);

Then(
  /^the (first|second) tournament is "([^"]*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    const at = ["first", "second"].indexOf(which);
    await eventually(this, async () => {
      assert.equal(
        await rows(this).nth(at).locator(".tournament-name").textContent(),
        name,
      );
    });
  },
);

Then(
  "the tournament {string} is dated {string}",
  async function (this: SpecWorld, name: string, dated: string) {
    await eventually(this, async () => {
      assert.equal(
        await rowOf(this, name).locator(".tournament-dates").textContent(),
        dated,
      );
    });
  },
);

Then(
  "the tournament {string} offers {string}",
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
  },
);

Then(
  "the tournament {string} does not offer {string}",
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await optionOf(this, name, option).count(), 0);
    });
  },
);

// Read off what is drawn, rather than off whether the row says it is
// archived, since the line through it is what the reader sees.
const struckThrough = (world: SpecWorld, name: string): Promise<boolean> =>
  inNameOf<boolean>(
    world,
    name,
    `getComputedStyle(element).textDecorationLine.includes("line-through")`,
  );

Then(
  "the tournament {string} is struck through",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await struckThrough(this, name), true);
    });
  },
);

Then(
  "the tournament {string} is not struck through",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await struckThrough(this, name), false);
    });
  },
);

// What a screen reader is given of the row, which is not what is drawn.
const announced = (world: SpecWorld, name: string): Promise<string> =>
  rowOf(world, name).ariaSnapshot();

Then(
  "the tournament {string} is announced as archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.match(await announced(this, name), /\bArchived\b/);
    });
  },
);

Then(
  "the tournament {string} is not announced as archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.doesNotMatch(await announced(this, name), /\bArchived\b/);
    });
  },
);

// The years ---------------------------------------------------------------------

Then(
  "the year {int} is offered",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        (await yearsOffered(this)).includes(year),
        `${String(year)} is not offered.`,
      );
    });
  },
);

Then(
  "the year {int} is not offered",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        !(await yearsOffered(this)).includes(year),
        `${String(year)} is offered.`,
      );
    });
  },
);

Then(
  /^the (first|second|third) year offered is (\d+)$/,
  async function (this: SpecWorld, which: string, year: string) {
    const at = ["first", "second", "third"].indexOf(which);
    await eventually(this, async () => {
      assert.equal((await yearsOffered(this))[at], Number(year));
    });
  },
);

Then(
  /^(\d+) years? (?:is|are) offered$/,
  async function (this: SpecWorld, count: string) {
    await eventually(this, async () => {
      assert.equal((await yearsOffered(this)).length, Number(count));
    });
  },
);

// Marked as a tab is, or chosen in the drop-down list, whichever it is in: in
// a list to choose from, the year it selects, and in a disclosure of links,
// the one it marks as a tab is marked among those it holds.
const chosenInDropDown = (world: SpecWorld): Promise<string | null> =>
  dropDown(world).evaluate((element) => {
    const list = element as unknown as Shown & { value: string };
    return list.localName === "select"
      ? list.value
      : (list.querySelector('a[aria-current="page"]')?.textContent ?? null);
  });

Then(
  "the year chosen is {int}",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      const marked = tabs(this).and(
        this.browserPage.locator('[aria-current="page"]'),
      );
      const chosen =
        (await marked.count()) === 1
          ? Number(await marked.textContent())
          : Number(await chosenInDropDown(this));
      assert.equal(chosen, year);
    });
  },
);

Then("every year offered is a tab", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await dropDown(this).count(), 0);
    assert.ok((await tabYears(this)).length > 0, "No year is a tab.");
  });
});

Then("no drop-down list of years is offered", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await dropDown(this).count(), 0);
  });
});

Then("the year {int} is a tab", async function (this: SpecWorld, year: number) {
  await eventually(this, async () => {
    assert.ok(
      (await tabYears(this)).includes(year),
      `${String(year)} is not a tab.`,
    );
  });
});

Then(
  "the year {int} is in the drop-down list",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        (await dropDownYears(this)).includes(year),
        `${String(year)} is not in the drop-down list.`,
      );
    });
  },
);

Then(
  "the year {int} is not in the drop-down list",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.equal(await dropDown(this).count(), 1);
      assert.ok(
        !(await dropDownYears(this)).includes(year),
        `${String(year)} is in the drop-down list.`,
      );
    });
  },
);

Then("the years take one row of the bar", async function (this: SpecWorld) {
  await eventually(this, async () => {
    const tops: number[] = [];
    for (const item of await this.browserPage
      .locator(`${shownYears} > li`)
      .filter({ visible: true })
      .all()) {
      const box = await item.boundingBox();
      assert.ok(box !== null, "A year in the bar is not on the page.");
      tops.push(Math.round(box.y));
    }
    assert.ok(tops.length > 1, "There is nothing in the bar to be in a row.");
    assert.equal(
      new Set(tops).size,
      1,
      `The years start at ${tops.join(", ")}.`,
    );
  });
});

// Marked as the bar marks the section being read, which the stylesheet draws
// on black.
const markedTab = (world: SpecWorld, year: number): Locator =>
  tabs(world)
    .filter({ hasText: exactly(String(year)) })
    .and(world.browserPage.locator('[aria-current="page"]'));

Then(
  "the tab for {int} is marked as the year chosen",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.equal(await markedTab(this, year).count(), 1);
    });
  },
);

Then(
  "the tab for {int} is not marked as the year chosen",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.ok(
        (await tabYears(this)).includes(year),
        `${String(year)} is not a tab.`,
      );
      assert.equal(await markedTab(this, year).count(), 0);
    });
  },
);

Then("no tab is marked as the year chosen", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.ok((await tabYears(this)).length > 0, "No year is a tab.");
    assert.equal(
      await tabs(this).and(this.browserPage.locator("[aria-current]")).count(),
      0,
    );
  });
});

Then("the drop-down list selects no year", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await dropDown(this).inputValue(), "");
  });
});

Then(
  "the year selected in the drop-down list is {int}",
  async function (this: SpecWorld, year: number) {
    await eventually(this, async () => {
      assert.equal(await dropDown(this).inputValue(), String(year));
    });
  },
);

Then(
  "the drop-down list is named {string}",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await dropDownNamed(this), name);
    });
  },
);

// Sizes ----------------------------------------------------------------------------

const sizeOf = async (
  world: SpecWorld,
  found: Locator,
): Promise<{ width: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

Then(
  "the drop-down list is at least {int} pixels tall",
  async function (this: SpecWorld, least: number) {
    await eventually(this, async () => {
      const { height } = await sizeOf(this, dropDown(this));
      assert.ok(height >= least, `It is ${String(height)} pixels tall.`);
    });
  },
);

Then(
  /^"([^"]*)" for the tournament "([^"]*)" is at least (\d+) pixels (tall|wide)$/,
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    least: string,
    which: string,
  ) {
    await eventually(this, async () => {
      const size = await sizeOf(this, optionOf(this, name, option));
      const measured = which === "tall" ? size.height : size.width;
      assert.ok(
        measured >= Number(least),
        `It is ${String(measured)} pixels ${which}.`,
      );
    });
  },
);

Then(
  "the name {string} is at least {int} pixels tall",
  async function (this: SpecWorld, name: string, least: number) {
    await eventually(this, async () => {
      const { height } = await sizeOf(this, nameOf(this, name));
      assert.ok(height >= least, `It is ${String(height)} pixels tall.`);
    });
  },
);

Then("the page is no wider than the window", async function (this: SpecWorld) {
  await eventually(this, async () => {
    const [page, window] = await this.browserPage.evaluate<[number, number]>(
      "[document.documentElement.scrollWidth, window.innerWidth]",
    );
    assert.ok(page <= window, `The page is ${String(page)} pixels wide.`);
  });
});

// The whole of it laid out and none of it hidden: nothing cut off at the edge,
// and no ellipsis standing in for the rest.
Then(
  "the name {string} is shown whole",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const shown = await inNameOf<{ words: string; cut: boolean }>(
        this,
        name,
        "({ words: element.innerText, cut: element.scrollWidth > element.clientWidth })",
      );
      assert.equal(shown.words, name);
      assert.equal(shown.cut, false);
    });
  },
);

// Starting a new tournament ---------------------------------------------------------

// What the list offers above its tournaments, rather than what any one of them
// offers, and what a tab's form offers above what it lists. What a modal
// dialog offers where one is open, since nothing beneath it can be pressed.
const listOffers = (world: SpecWorld, option: string): Locator =>
  world.browserPage
    .locator(
      "dialog[open] :is(a, button), body:not(:has(dialog[open])) main :is(a, button):not(.tournaments *):not(.listed *)",
    )
    .filter({ hasText: exactly(option) });

Then(
  "the list offers {string}",
  async function (this: SpecWorld, option: string) {
    await eventually(this, async () => {
      assert.equal(await listOffers(this, option).count(), 1);
    });
  },
);

Then(
  "{string} is above the tournaments",
  async function (this: SpecWorld, option: string) {
    await eventually(this, async () => {
      const offer = await sizeAndPlaceOf(listOffers(this, option));
      const list = await sizeAndPlaceOf(
        this.browserPage.locator(".tournaments"),
      );
      assert.ok(
        offer.y + offer.height <= list.y,
        `It ends ${String(offer.y + offer.height)} pixels down, and the tournaments start ${String(list.y)} down.`,
      );
    });
  },
);

// A competition's Players tab adds the player chosen in its drop-down with a
// button of its own rather than a form's, and sends nothing when nobody is
// chosen, as the tab does. Waited on like a form's, since a step that opened
// the page again before the add was answered would find nobody added: a
// scenario lost that race under the whole suite, and not on its own.
const addsWhatIsChosen = async (
  page: SpecWorld["browserPage"],
  pressing: Locator,
): Promise<boolean> =>
  (await pressing.and(page.locator(".listed-adding button")).count()) === 1 &&
  (await page.locator(".listed-adding .listed-choice").inputValue()) !== "";

// Pressed, and waited on until what it does is done: a link followed, or a
// form's answer come back and acted on, so that the next step reads what
// pressing it did rather than the page as it was before.
When("{string} is pressed", async function (this: SpecWorld, option: string) {
  await settled(this);
  const page = this.browserPage;
  const from = new URL(page.url()).pathname;
  // What a form's button sends, where the page is one: creating a tournament
  // from the new tournament page, and changing one from its edit page.
  const sends = (response: {
    url(): string;
    request(): { method(): string };
  }) => {
    const to = new URL(response.url()).pathname;
    const method = response.request().method();
    return from === "/admin/tournaments/new"
      ? to === "/api/site/tournaments" && method === "POST"
      : from.endsWith("/edit") &&
          to.startsWith("/api/site/tournaments/at/") &&
          method === "PUT";
  };
  const answered =
    from === "/admin/tournaments/new" || from.endsWith("/edit")
      ? page.waitForResponse(sends)
      : undefined;
  // What a tab's form sends, on a tournament's page, which stays where it is
  // and says what it made of the answer: waited on until it has, so that the
  // next step does not type into a form still waiting to be told.
  const pressing = listOffers(this, option);
  // A tab's form, or a modal dialog's form, which each stay where they are.
  const sendsATabsForm =
    (await pressing
      .and(
        page.locator(
          'form.tab-form button[type="submit"], dialog[open] form button[type="submit"]',
        ),
      )
      .count()) === 1 || (await addsWhatIsChosen(page, pressing));
  const sentFromATab = sendsATabsForm
    ? page.waitForResponse(
        (response) =>
          ["POST", "PUT"].includes(response.request().method()) &&
          new URL(response.url()).pathname.startsWith("/api/site/tournaments/"),
      )
    : undefined;
  await pressing.click();
  if (sentFromATab !== undefined) {
    await sentFromATab;
    // Once the form has made what it will of the answer: a dialog says it is
    // no longer busy, or has closed.
    await page
      .locator(
        'dialog[open] form[aria-busy="false"], body:not(:has(dialog[open]))',
      )
      .first()
      .waitFor();
    await page
      .locator(':is(#tab-panel, #page-list) section[aria-busy="false"]')
      .waitFor();
  }
  if (answered !== undefined) {
    const answer = await answered;
    if (answer.ok()) {
      await page.waitForURL((url) => url.pathname !== from);
    } else {
      await page.locator('form[aria-busy="false"]').waitFor();
    }
  }
  await page.waitForLoadState();
});

Then(
  "{string} is at least {int} pixels tall",
  async function (this: SpecWorld, option: string, least: number) {
    await eventually(this, async () => {
      // A button or a link by its words, or a field of an open dialog by its
      // label, which is drawn as the box around it and pressed anywhere in it.
      const field = this.browserPage
        .locator("dialog[open] label.field-box")
        .filter({
          has: this.browserPage.getByLabel(option, { exact: true }),
        });
      const { height } = await sizeAndPlaceOf(
        (await field.count()) > 0 ? field : listOffers(this, option),
      );
      assert.ok(height >= least, `It is ${String(height)} pixels tall.`);
    });
  },
);

const sizeAndPlaceOf = async (
  found: Locator,
): Promise<{ y: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

// Where a row's parts are ------------------------------------------------------------

const placeOf = async (
  found: Locator,
): Promise<{ x: number; y: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

// On the same row where each is level with the other, the top of each within
// the height of the other: a name that wraps onto two lines is still beside
// the dates it starts level with.
Then(
  "the dates of {string} are on the same row as its name",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const dates = await placeOf(
        rowOf(this, name).locator(".tournament-dates"),
      );
      const called = await placeOf(nameOf(this, name));
      assert.ok(
        dates.y < called.y + called.height && called.y < dates.y + dates.height,
        `The dates are ${String(Math.round(dates.y))} pixels down and the name ${String(Math.round(called.y))}.`,
      );
    });
  },
);

Then(
  "the dates of {string} are to the left of its name",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const dates = await placeOf(
        rowOf(this, name).locator(".tournament-dates"),
      );
      const called = await placeOf(nameOf(this, name));
      assert.ok(
        dates.x < called.x,
        `The dates start ${String(Math.round(dates.x))} pixels across and the name ${String(Math.round(called.x))}.`,
      );
    });
  },
);

// The list in the reader's language -------------------------------------------

// A tournament's name is what its manager called it, and its dates are numbers
// and the months the browser names, so neither is in a catalogue to be marked.
Then(
  "every word in the list but the tournaments' own is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "main", [
        ".tournament-name",
        ".tournament-dates",
      ]);
      assert.deepEqual(stray, [], "Words in the list came from elsewhere.");
    });
  },
);

Then(
  "the years are named in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const named = await announcedAs(this, "nav.years");
      assert.ok(named !== null, "The years are not named.");
      assert.ok(
        isMarked(named),
        `The years are named ${JSON.stringify(named)}.`,
      );
    });
  },
);

Then(
  "the drop-down list of years is named in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(
        await dropDown(this).count(),
        1,
        "No drop-down list of years is offered.",
      );
      const named = await dropDownNamed(this);
      assert.ok(named !== null, "No drop-down list of years is named.");
      assert.ok(
        isMarked(named),
        `The drop-down list is named ${JSON.stringify(named)}.`,
      );
    });
  },
);

// Each year is a number, whether it is a tab or a choice in the drop-down
// list, so the years are left out; what is left is what the list says while
// it selects none of them. Looked for in the list shown, which is only there
// once there are more years than fit, so that a bar with no list in it fails
// rather than passing on the copy it measures with.
Then(
  "every word in the years but the years themselves is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(
        await dropDown(this).count(),
        1,
        "No drop-down list of years is offered.",
      );
      const stray = await unmarkedWithin(this, "nav.years", [
        "a",
        'option:not([value=""])',
      ]);
      assert.deepEqual(stray, [], "Words in the years came from elsewhere.");
    });
  },
);

// The filter ---------------------------------------------------------------------

When(
  "the admin is opened at {string}",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

// By what each narrows by, whatever language its label is in, as the home
// page's filter is found.
const filterField = (world: SpecWorld, field: string): Locator =>
  world.browserPage.locator(`form.tournament-filter select[name="${field}"]`);

// The words of what a list offers to choose, without the choice that is no
// choice at all.
const offeredIn = async (world: SpecWorld, field: string): Promise<string[]> =>
  (
    await filterField(world, field)
      .locator("option:not([value=''])")
      .allTextContents()
  ).map((words) => words.trim());

Then(
  /^the filter (offers|does not offer) "(.*)" as a (country|region|sport)$/,
  async function (
    this: SpecWorld,
    does: string,
    choice: string,
    field: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        (await offeredIn(this, field)).includes(choice),
        does === "offers",
        `The filter ${does} ${choice}.`,
      );
    });
  },
);

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh) country in the filter is "(.*)"$/,
  async function (this: SpecWorld, which: string, country: string) {
    await eventually(this, async () => {
      assert.equal((await offeredIn(this, "country"))[ordinal(which)], country);
    });
  },
);

Then(
  /^the filter's country list has (\d+) lines? drawn in it$/,
  async function (this: SpecWorld, count: string) {
    await eventually(this, async () => {
      assert.equal(
        await filterField(this, "country").locator("hr").count(),
        Number(count),
      );
    });
  },
);

Then("the filter offers no region", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await filterField(this, "region").count(), 0);
  });
});

Then("no filter is offered", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(
      await this.browserPage.locator("form.tournament-filter").count(),
      0,
    );
  });
});

Then("the list says no tournament matches", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(
      await this.browserPage
        .locator(".tournaments-none[data-unmatched]")
        .count(),
      1,
    );
  });
});

// The names of countries and sports are marked, and so are the filter's own
// words. A region is named as it was recorded and is in no catalogue, so none
// is left chosen for the filter to offer.
Then(
  "every word in the filter is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "form.tournament-filter", []);
      assert.deepEqual(stray, [], "Words in the filter came from elsewhere.");
    });
  },
);

// Its competitions -------------------------------------------------------------

const addBlockTo = async (
  world: SpecWorld,
  name: string,
  worldRankings: boolean,
): Promise<void> => {
  const id = tournamentNamed(world, name);
  const manager = (await load(world, id)).managers[0];
  assert.ok(manager !== undefined, `${name} has no manager.`);
  await inHandOf(world).send(
    new AddBlock(manager.value, id.value, "Block A", 1, 1, momentOf(world), {
      worldRankings,
    }),
  );
};

Given(
  "the tournament {string} has a block that counts towards the world rankings",
  async function (this: SpecWorld, name: string) {
    await addBlockTo(this, name, true);
  },
);

Given(
  "the tournament {string} has a block that does not count towards the world rankings",
  async function (this: SpecWorld, name: string) {
    await addBlockTo(this, name, false);
  },
);

// The world ranking toggles ------------------------------------------------------

const toggleNamed = (world: SpecWorld, name: string): Locator =>
  world.browserPage.getByRole("button", { name, exact: true });

const pressToggle = async function (
  this: SpecWorld,
  name: string,
): Promise<void> {
  await settled(this);
  await toggleNamed(this, name).click();
  await settled(this);
};

When("the toggle {string} is pressed", pressToggle);

When("the page is loaded again", async function (this: SpecWorld) {
  await this.browserPage.reload();
});

Then(
  /^the toggle "([^"]*)" is (on|off)$/,
  async function (this: SpecWorld, name: string, state: string) {
    await eventually(this, async () => {
      assert.equal(
        await toggleNamed(this, name).getAttribute("aria-pressed"),
        state === "on" ? "true" : "false",
      );
    });
  },
);

// The tick is drawn for a toggle that is off too, and hidden, so that it is
// whether it can be seen that says.
Then(
  /^the toggle "([^"]*)" shows (a tick|no tick)$/,
  async function (this: SpecWorld, name: string, which: string) {
    const tick = toggleNamed(this, name).locator(".tournament-toggle-tick");
    await eventually(this, async () => {
      assert.equal(await tick.isVisible(), which === "a tick");
    });
  },
);

// What the specs are not compiled to know of the page itself.
interface ButtonStylesInThePage {
  getComputedStyle(element: unknown): {
    readonly color: string;
    readonly backgroundColor: string;
    readonly borderTopColor: string;
    readonly borderTopWidth: string;
    readonly borderTopLeftRadius: string;
    readonly fontWeight: string;
    readonly minHeight: string;
    readonly paddingTop: string;
    readonly paddingRight: string;
    readonly paddingBottom: string;
    readonly paddingLeft: string;
  };
}

// What a button looks like, as the browser works it out: the colours, the
// border, the weight and the room inside it, which is what makes two buttons
// look alike.
const lookOf = (element: Locator): Promise<Record<string, string>> =>
  element.evaluate((found) => {
    const style = (
      globalThis as unknown as ButtonStylesInThePage
    ).getComputedStyle(found);
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderTopColor,
      borderWidth: style.borderTopWidth,
      borderRadius: style.borderTopLeftRadius,
      fontWeight: style.fontWeight,
      minHeight: style.minHeight,
      paddingTop: style.paddingTop,
      paddingRight: style.paddingRight,
      paddingBottom: style.paddingBottom,
      paddingLeft: style.paddingLeft,
    };
  });

Then(
  "the toggle {string} looks as {string} does",
  async function (this: SpecWorld, name: string, link: string) {
    assert.deepEqual(
      await lookOf(toggleNamed(this, name)),
      await lookOf(
        this.browserPage.getByRole("link", { name: link, exact: true }),
      ),
    );
  },
);

// On one row where their middles are within a toggle's own height of each
// other, which a toggle wrapped beneath the button is not, and beside it:
// after it, and not overlapping it, which one drawn before it or across it
// would not be. Waited for, since the layout settles as the list arrives.
Then(
  "the toggle {string} is on the row of {string}",
  async function (this: SpecWorld, name: string, link: string) {
    await eventually(this, async () => {
      const toggle = await toggleNamed(this, name).boundingBox();
      const button = await this.browserPage
        .getByRole("link", { name: link, exact: true })
        .boundingBox();
      assert.ok(toggle !== null, `The toggle ${name} is not drawn.`);
      assert.ok(button !== null, `${link} is not drawn.`);
      const middle = (box: { y: number; height: number }): number =>
        box.y + box.height / 2;
      assert.ok(
        Math.abs(middle(toggle) - middle(button)) < toggle.height / 2,
        `${name} is at ${String(middle(toggle))} and ${link} at ${String(middle(button))}.`,
      );
      assert.ok(
        toggle.x >= button.x + button.width,
        `${name} at ${String(toggle.x)} is not after ${link}, which ends at ${String(button.x + button.width)}.`,
      );
    });
  },
);

Then(
  /^the toggle "([^"]*)" is (offered|not offered)$/,
  async function (this: SpecWorld, name: string, offered: string) {
    await eventually(this, async () => {
      assert.equal(
        await toggleNamed(this, name).count(),
        offered === "offered" ? 1 : 0,
      );
    });
  },
);
