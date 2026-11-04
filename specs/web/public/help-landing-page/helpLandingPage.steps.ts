import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { unmarked } from "../../support/languages.js";

// Found as the stylesheet finds them, by the bookmark of the heading each list
// follows (helpPages.feature).
const popular = "#popular-questions + ul";
const cards = "#subjects + ul";

// The keyboard is given up on after this many stops, which is far more than
// the page has before its cards: a page whose cards cannot be reached would
// otherwise be looked for for ever.
const mostStops = 100;

const statuses = new WeakMap<SpecWorld, number | undefined>();

Given(
  "a screen {int} pixels wide",
  async function (this: SpecWorld, width: number) {
    await this.browserPage.setViewportSize({ width, height: 900 });
  },
);

When(
  "the first page of the help is opened in the browser",
  async function (this: SpecWorld) {
    await this.browserPage.goto(`${this.baseUrl!}/help`);
  },
);

When(
  "the help is opened at {string}",
  async function (this: SpecWorld, address: string) {
    const response = await this.browserPage.goto(`${this.baseUrl!}${address}`);
    statuses.set(this, response?.status());
  },
);

Then("that address is answered with a page", function (this: SpecWorld) {
  assert.equal(statuses.get(this), 200);
});

const topOf = async (world: SpecWorld, selector: string): Promise<number> => {
  const box = await world.browserPage.locator(selector).first().boundingBox();
  assert.ok(box !== null, `${selector} is not on the page.`);
  return box.y;
};

// The popular questions ---------------------------------------------------------

Then(
  "the popular questions come after the search box",
  async function (this: SpecWorld) {
    assert.ok(
      (await topOf(this, ".help-search")) < (await topOf(this, popular)),
    );
  },
);

Then(
  "there are {int} popular questions",
  async function (this: SpecWorld, count: number) {
    assert.equal(await this.browserPage.locator(`${popular} a`).count(), count);
  },
);

When(
  "the popular question {string} is followed",
  async function (this: SpecWorld, question: string) {
    await this.browserPage
      .locator(`${popular} a`, { hasText: question })
      .click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the article is called {string}",
  async function (this: SpecWorld, title: string) {
    assert.equal(
      (await this.browserPage.locator("article.help h1").innerText()).trim(),
      title,
    );
  },
);

Then(
  "the address ends with {string}",
  function (this: SpecWorld, ending: string) {
    assert.ok(this.browserPage.url().endsWith(ending), this.browserPage.url());
  },
);

// The cards ----------------------------------------------------------------------

Then(
  "there are {int} subject cards",
  async function (this: SpecWorld, count: number) {
    assert.equal(await this.browserPage.locator(`${cards} li`).count(), count);
  },
);

const cardCalled = (world: SpecWorld, subject: string) =>
  world.browserPage.locator(`${cards} li`, {
    has: world.browserPage.getByRole("link", { name: subject, exact: true }),
  });

When(
  "the card {string} is followed",
  async function (this: SpecWorld, subject: string) {
    await this.browserPage
      .getByRole("link", { name: subject, exact: true })
      .click();
    await this.browserPage.waitForLoadState();
  },
);

// By the mouse at the middle of the words and not by a click on them, which
// refuses to press what something lies over: the link is spread over the whole
// card, and that is what is being found out.
When(
  "the words under the title of the card {string} are pressed",
  async function (this: SpecWorld, subject: string) {
    const words = cardCalled(this, subject).locator("p").nth(1);
    // Brought into view first: the mouse goes to a place on the screen, and the
    // cards are below the first screenful.
    await words.scrollIntoViewIfNeeded();
    const box = await words.boundingBox();
    assert.ok(box !== null, "The card has no words under its title.");
    await this.browserPage.mouse.click(
      box.x + box.width / 2,
      box.y + box.height / 2,
    );
    // A click that is not on a link has no navigation to wait for, so the wait
    // is for leaving the first page and fails there if it was not left.
    await this.browserPage.waitForURL((url) => url.pathname !== "/help", {
      timeout: 5000,
    });
  },
);

Then(
  "the card {string} has words under its title",
  async function (this: SpecWorld, subject: string) {
    const words = await cardCalled(this, subject)
      .locator("p")
      .nth(1)
      .innerText();
    assert.ok(words.trim().length > 0);
  },
);

// The keyboard ---------------------------------------------------------------------

const onACard = (world: SpecWorld) =>
  world.browserPage.locator(`${cards} li:focus-within`);

const stopsOnCards = new WeakMap<SpecWorld, number>();

When("the keyboard goes through the cards", async function (this: SpecWorld) {
  let stops = 0;
  let reached = false;
  for (let pressed = 0; pressed < mostStops; pressed++) {
    await this.browserPage.keyboard.press("Tab");
    if ((await onACard(this).count()) === 1) {
      stops++;
      reached = true;
    } else if (reached) {
      break;
    }
  }
  stopsOnCards.set(this, stops);
});

Then("it stops {int} times", function (this: SpecWorld, times: number) {
  assert.equal(stopsOnCards.get(this), times);
});

When("the keyboard goes to the first card", async function (this: SpecWorld) {
  for (let pressed = 0; pressed < mostStops; pressed++) {
    await this.browserPage.keyboard.press("Tab");
    if ((await onACard(this).count()) === 1) return;
  }
  assert.fail("The keyboard never reached a card.");
});

// Marked by an outline, which is what the stylesheet gives the card that has the
// keyboard in it, and which the page's own controls give theirs.
Then(
  "one card is marked as the one the keyboard is on",
  async function (this: SpecWorld) {
    assert.equal(await onACard(this).count(), 1);
    // An expression and not a function of the element, which the page does not
    // hand a string it is given: that read as nothing, and so as not "none".
    const outline = await this.browserPage.evaluate(
      `getComputedStyle(document.querySelector(${JSON.stringify(`${cards} li:focus-within`)})).outlineStyle`,
    );
    assert.equal(typeof outline, "string");
    assert.notEqual(outline, "none");
  },
);

// The screen -----------------------------------------------------------------------

const firstTwo = async (
  world: SpecWorld,
): Promise<
  readonly [
    { x: number; y: number; height: number },
    { x: number; y: number; height: number },
  ]
> => {
  const boxOf = async (at: number) => {
    const box = await world.browserPage
      .locator(`${cards} li`)
      .nth(at)
      .boundingBox();
    assert.ok(box !== null, `Card ${at + 1} is not on the page.`);
    return box;
  };
  return [await boxOf(0), await boxOf(1)];
};

Then("the first two cards are side by side", async function (this: SpecWorld) {
  const [first, second] = await firstTwo(this);
  assert.ok(first !== undefined && second !== undefined);
  assert.ok(Math.abs(first.y - second.y) < 2, "They are not on one row.");
  assert.ok(second.x > first.x, "The second is not beside the first.");
});

Then(
  "the first two cards are one above the other",
  async function (this: SpecWorld) {
    const [first, second] = await firstTwo(this);
    assert.ok(Math.abs(first.x - second.x) < 2, "They are not in one column.");
    assert.ok(
      second.y >= first.y + first.height - 1,
      "The second is not below.",
    );
  },
);

Then("the page does not scroll sideways", async function (this: SpecWorld) {
  const fits = await this.browserPage.evaluate(
    "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
  );
  assert.ok(fits, "The page is wider than the screen.");
});

// What is not shown but is there ---------------------------------------------------

const title = "article.help h1";

// Hidden by being made one pixel, which a screen reader still reaches, and not
// by being taken out of the page, which it would not: the next scenario finds
// the title still there.
Then("the title of the page is not shown", async function (this: SpecWorld) {
  const box = await this.browserPage.locator(title).boundingBox();
  assert.ok(box !== null, "The page has no title for a screen reader.");
  assert.ok(box.width <= 1 && box.height <= 1, "The title is shown.");
});

Then(
  "the page is titled {string}",
  async function (this: SpecWorld, words: string) {
    assert.equal(
      (await this.browserPage.locator(title).textContent())?.trim(),
      words,
    );
  },
);

Then(
  "the article does not say {string}",
  async function (this: SpecWorld, words: string) {
    // What can be seen of it: a screen reader's own words are not a reader's.
    const said = await this.browserPage.locator("article.help").innerText();
    assert.ok(!said.includes(words), said);
  },
);

Then("the search box shows no label", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator("label[for='help-search-field']").count(),
    0,
  );
});

Then(
  "the search box is called {string}",
  async function (this: SpecWorld, name: string) {
    const called = await this.browserPage
      .locator("#help-search-field")
      .getAttribute("aria-label");
    assert.equal(unmarked(called ?? ""), name);
  },
);

// The headings --------------------------------------------------------------------

const panelTitle = ".help-search-title";

Then(
  "the panel's title is a second level heading",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(`h2${panelTitle}`).count(), 1);
  },
);

const sizeOf = (world: SpecWorld, selector: string): Promise<unknown> =>
  world.browserPage.evaluate(
    `getComputedStyle(document.querySelector(${JSON.stringify(selector)})).fontSize`,
  );

const sections: Readonly<Record<string, string>> = {
  "Popular questions": "#popular-questions",
  "Help by subject": "#subjects",
};

Then(
  "the heading {string} is as large as the panel's title",
  async function (this: SpecWorld, heading: string) {
    const selector = sections[heading];
    assert.ok(selector !== undefined, `There is no heading ${heading}.`);
    const size = await sizeOf(this, selector);
    assert.equal(typeof size, "string");
    assert.equal(size, await sizeOf(this, panelTitle));
  },
);
