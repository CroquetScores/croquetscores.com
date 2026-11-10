import { evaluateWith } from "../../support/evaluateWith.js";
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { join } from "node:path";

import {
  helpLibraryIn,
  type HelpLibrary,
} from "../../../../src/web/common/helpLibrary.js";
import type { SpecWorld } from "../../../support/world.js";
import { anApplicationWithHelpInTheScenariosLanguages } from "../../support/browser.js";
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

const title = "h1";

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

// Hidden and shown ------------------------------------------------------------------

Then(
  "the heading of the subjects is not shown",
  async function (this: SpecWorld) {
    const box = await this.browserPage.locator("#subjects").boundingBox();
    assert.ok(
      box !== null,
      "The subjects have no heading for a screen reader.",
    );
    assert.ok(box.width <= 1 && box.height <= 1, "The heading is shown.");
  },
);

Then(
  "the page has a heading for the subjects",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator("h2#subjects").count(), 1);
  },
);

// The card ---------------------------------------------------------------------------

const styleOf = async (
  world: SpecWorld,
  selector: string,
  property: string,
): Promise<string> => {
  const value = await world.browserPage.evaluate(
    `getComputedStyle(document.querySelector(${JSON.stringify(selector)}))[${JSON.stringify(property)}]`,
  );
  assert.equal(typeof value, "string", `${selector} has no ${property}.`);
  return value as string;
};

const aSubjectCard = `${cards} li`;

Then(
  "the popular questions are the colour of a subject card",
  async function (this: SpecWorld) {
    const card = await styleOf(this, aSubjectCard, "backgroundColor");
    assert.equal(
      await styleOf(this, "#popular-questions", "backgroundColor"),
      card,
    );
    assert.equal(await styleOf(this, `${popular}`, "backgroundColor"), card);
  },
);

// What a list's alternate rows are painted with, found by painting something with
// it, so that the theme it is read in is the one the page is in.
Then(
  "a subject card is the colour of the alternating rows of a list",
  async function (this: SpecWorld) {
    const rows = await this.browserPage.evaluate(
      "(() => { const row = document.createElement('div'); row.style.background = 'var(--surface)'; document.body.appendChild(row); const colour = getComputedStyle(row).backgroundColor; row.remove(); return colour; })()",
    );
    assert.equal(typeof rows, "string");
    assert.equal(await styleOf(this, aSubjectCard, "backgroundColor"), rows);
  },
);

Then(
  "the popular questions have the corners of a subject card",
  async function (this: SpecWorld) {
    const corner = await styleOf(this, aSubjectCard, "borderTopLeftRadius");
    assert.notEqual(corner, "0px");
    // Whole at the top in its heading and at the bottom in its list, which are
    // one card drawn in two parts.
    assert.equal(
      await styleOf(this, "#popular-questions", "borderTopLeftRadius"),
      corner,
    );
    assert.equal(
      await styleOf(this, "#popular-questions", "borderTopRightRadius"),
      corner,
    );
    assert.equal(
      await styleOf(this, popular, "borderBottomLeftRadius"),
      corner,
    );
    assert.equal(
      await styleOf(this, popular, "borderBottomRightRadius"),
      corner,
    );
  },
);

// The spacing ----------------------------------------------------------------------

// What the page's own letters measure, which is what a rem is.
const remOf = async (world: SpecWorld): Promise<number> =>
  Number(
    await world.browserPage.evaluate(
      "parseFloat(getComputedStyle(document.documentElement).fontSize)",
    ),
  );

const edgesOf = async (world: SpecWorld, selector: string) => {
  const box = await world.browserPage.locator(selector).first().boundingBox();
  assert.ok(box !== null, `${selector} is not on the page.`);
  return { top: box.y, bottom: box.y + box.height };
};

const assertOneRemApart = async (
  world: SpecWorld,
  below: string,
  above: string,
): Promise<void> => {
  const apart =
    (await edgesOf(world, below)).top - (await edgesOf(world, above)).bottom;
  const rem = await remOf(world);
  assert.ok(rem > 0, "The page's letters have no size.");
  // A pixel either way is how a box is rounded to the screen.
  assert.ok(
    Math.abs(apart - rem) <= 1,
    `It is ${apart}px below, and 1rem is ${rem}px.`,
  );
};

Then(
  "the popular questions are 1rem below the search box",
  async function (this: SpecWorld) {
    await assertOneRemApart(this, "#popular-questions", ".help-search");
  },
);

Then(
  "the subject cards are 1rem below the popular questions",
  async function (this: SpecWorld) {
    await assertOneRemApart(this, cards, popular);
  },
);

// The search box's card ---------------------------------------------------------------

const searchCard = ".help-search";

Then(
  "the search box is the colour of a subject card",
  async function (this: SpecWorld) {
    assert.equal(
      await styleOf(this, searchCard, "backgroundColor"),
      await styleOf(this, aSubjectCard, "backgroundColor"),
    );
  },
);

Then(
  "the search box has the corners of a subject card",
  async function (this: SpecWorld) {
    const corner = await styleOf(this, aSubjectCard, "borderTopLeftRadius");
    assert.notEqual(corner, "0px");
    for (const property of [
      "borderTopLeftRadius",
      "borderTopRightRadius",
      "borderBottomLeftRadius",
      "borderBottomRightRadius",
    ]) {
      assert.equal(await styleOf(this, searchCard, property), corner, property);
    }
  },
);

// The words ------------------------------------------------------------------------

const black = "rgb(0, 0, 0)";

// The card is found by its link's name inside the page, since a string handed to
// an element is not given it (the outline's step found that out).
const wordsOfCard = async (world: SpecWorld, subject: string) => {
  const read = await evaluateWith<string | undefined>(
    world.browserPage,
    // The subject reaches the page as data and is never spliced into code.
    `({ selector, subject }) => { const card = [...document.querySelectorAll(selector)].find((each) => each.querySelector("a")?.textContent === subject); return card === undefined ? undefined : getComputedStyle(card.querySelector("p + p")).color; }`,
    { selector: `${cards} li`, subject },
  );
  assert.equal(typeof read, "string", `There is no card called ${subject}.`);
  return read;
};

Then(
  "the words under the title of the card {string} are black",
  async function (this: SpecWorld, subject: string) {
    assert.equal(await wordsOfCard(this, subject), black);
  },
);

Then(
  "the words under the title of the card {string} are not black",
  async function (this: SpecWorld, subject: string) {
    assert.notEqual(await wordsOfCard(this, subject), black);
  },
);

Then(
  "the heading {string} is black",
  async function (this: SpecWorld, heading: string) {
    const selector = sections[heading];
    assert.ok(selector !== undefined, `There is no heading ${heading}.`);
    assert.equal(await styleOf(this, selector, "color"), black);
  },
);

Then("the panel's title is black", async function (this: SpecWorld) {
  assert.equal(await styleOf(this, panelTitle, "color"), black);
});

Then(
  "the words typed in the search box are black",
  async function (this: SpecWorld) {
    assert.equal(await styleOf(this, "#help-search-field", "color"), black);
  },
);

// What a browser says it prefers, which is what the page goes by until the
// reader has chosen a theme of their own.
Given(
  "the reader's browser asks for dark colours",
  async function (this: SpecWorld) {
    await this.browserPage.emulateMedia({ colorScheme: "dark" });
  },
);

// The order of the page --------------------------------------------------------

Then(
  "the title of the page comes before the search box in the order of the page",
  async function (this: SpecWorld) {
    const before = await this.browserPage.evaluate(
      `(() => { const title = document.querySelector("h1"); const box = document.querySelector(".help-search"); return title !== null && box !== null && Boolean(title.compareDocumentPosition(box) & Node.DOCUMENT_POSITION_FOLLOWING); })()`,
    );
    assert.equal(before, true);
  },
);

Then(
  "the page has {int} first level heading",
  async function (this: SpecWorld, count: number) {
    assert.equal(await this.browserPage.locator("h1").count(), count);
  },
);

Given(
  "the reader's browser asks for light colours",
  async function (this: SpecWorld) {
    await this.browserPage.emulateMedia({ colorScheme: "light" });
  },
);

// Another page --------------------------------------------------------------------

const dist = join(import.meta.dirname, "..", "..", "..", "..", "dist", "help");

// The site with one page of the help added to the build's own: a page that gives
// its headings the first page's bookmarks, with a list after one, which is what
// the cards are made of there.
const sites = new WeakMap<SpecWorld, string>();

Given(
  "a page of the help that uses the bookmarks of the first page",
  async function (this: SpecWorld) {
    const built = helpLibraryIn(dist);
    const help: HelpLibrary = {
      image: built.image,
      page: (tag, name) =>
        name === "borrowed"
          ? Promise.resolve({
              title: "Borrowed",
              html: `<h1>Borrowed</h1>\n<h2 id="subjects">Subjects</h2>\n<ul>\n<li>\n<p><a href="/help">One</a></p>\n<p>Words.</p>\n</li>\n</ul>`,
              headings: ["Borrowed", "Subjects"],
              text: "Words.",
            })
          : built.page(tag, name),
    };
    sites.set(
      this,
      await anApplicationWithHelpInTheScenariosLanguages(this, help),
    );
  },
);

When("that page is opened in the browser", async function (this: SpecWorld) {
  const site = sites.get(this);
  assert.ok(site !== undefined, "No site was made.");
  await this.browserPage.goto(`${site}/help/borrowed`);
});

Then(
  "its heading {string} is shown",
  async function (this: SpecWorld, words: string) {
    const box = await this.browserPage
      .locator("h2#subjects", { hasText: words })
      .boundingBox();
    assert.ok(box !== null, "The heading is not on the page.");
    assert.ok(box.width > 1 && box.height > 1, "The heading is clipped away.");
  },
);

Then("its list is not laid out as cards", async function (this: SpecWorld) {
  assert.notEqual(await styleOf(this, "#subjects + ul", "display"), "grid");
});
