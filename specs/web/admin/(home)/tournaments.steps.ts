import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  type CreatedTournament,
  CreateTournament,
} from "../../../../src/application/operations/tournaments/CreateTournament.js";
import { Website } from "../../../../src/domain/common/Website.js";
import { signOutPath } from "../../../../src/web/common/accountMenu.js";
import { signInPath } from "../../../../src/web/public/signIn.js";
import {
  accountFor,
  created,
  inHandOf,
  momentOf,
} from "../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../support/world.js";
import { announcedAs, isMarked, unmarkedWithin } from "../../support/marks.js";
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
const names = ".tournaments > .tournament .tournament-name";
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

const optionOf = (world: SpecWorld, name: string, option: string): Locator =>
  rowOf(world, name)
    .locator(".tournament-options")
    .locator("a, button", { hasText: exactly(option) });

// The years bar, the one seen rather than the copy it measures with.
const shownYears = "nav.years .years-row > ul:not(.years-measuring)";
const tabs = (world: SpecWorld): Locator =>
  world.browserPage.locator(`${shownYears} > li > a`);
const dropDown = (world: SpecWorld): Locator =>
  world.browserPage.locator(`${shownYears} select`);

const tabYears = async (world: SpecWorld): Promise<number[]> =>
  (await tabs(world).allTextContents()).map(Number);

const dropDownYears = async (world: SpecWorld): Promise<number[]> => {
  const values = await Promise.all(
    (await dropDown(world).locator("option").all()).map((option) =>
      option.getAttribute("value"),
    ),
  );
  return values.filter((value) => value !== null && value !== "").map(Number);
};

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

Then("the address is {string}", async function (this: SpecWorld, path: string) {
  await this.browserPage.waitForURL((url) => url.pathname === path);
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

// Marked as a tab is, or selected in the drop-down list, whichever it is in.
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
          : Number(await dropDown(this).inputValue());
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
      assert.equal(
        await this.browserPage
          .getByRole("combobox", { name, exact: true })
          .count(),
        1,
      );
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
      ? to === "/api/v1/tournaments" && method === "POST"
      : from.endsWith("/edit") &&
          to.startsWith("/api/v1/tournaments/at/") &&
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
      .count()) === 1;
  const sentFromATab = sendsATabsForm
    ? page.waitForResponse(
        (response) =>
          ["POST", "PUT"].includes(response.request().method()) &&
          new URL(response.url()).pathname.startsWith("/api/v1/tournaments/"),
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
      const named = await announcedAs(this, `${shownYears} select`);
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
