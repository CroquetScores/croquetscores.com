import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { isMarked, unmarkedWithin } from "../../support/marks.js";
import { menuLink } from "../../support/menuLink.js";

// The site's search and the page of its results, drawn by the server with no
// scripting (`search.feature`).

const box = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-search input[name='q']");

const button = (world: SpecWorld): Locator =>
  world.browserPage.locator("header.site-bar .site-search button");

const results = (world: SpecWorld, kind: string): Locator =>
  world.browserPage.locator(`main .search-${kind}`);

const settled = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.waitForLoadState();
};

// A name is what a manager typed, so any character in it that a pattern
// would read as more than itself is escaped.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const named = (world: SpecWorld, kind: string, name: string): Locator =>
  results(world, kind).locator("a.search-name", { hasText: exactly(name) });

// The header's box ---------------------------------------------------------

Then("the header has a search box", async function (this: SpecWorld) {
  assert.equal(await box(this).count(), 1);
  assert.equal(await button(this).count(), 1);
});

Then(
  "the header names the page {string}",
  async function (this: SpecWorld, name: string) {
    const named = this.browserPage.locator("header.site-bar .site-page");
    assert.equal((await named.innerText()).trim(), name);
  },
);

Then(
  "the header's search box is called {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(await box(this).getAttribute("aria-label"), name);
  },
);

Then(
  "the header's magnifying glass is called {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(await button(this).getAttribute("aria-label"), name);
  },
);

// A picture and no words, so what makes it a magnifying glass is a drawing
// inside the button.
Then("the header shows a magnifying glass", async function (this: SpecWorld) {
  assert.equal(await button(this).locator("svg").count(), 1);
  assert.ok(await button(this).isVisible(), "The glass is not shown.");
});

Then("the header shows no magnifying glass", async function (this: SpecWorld) {
  assert.ok(!(await button(this).isVisible()), "The glass is shown.");
});

Then(
  "the header's magnifying glass is before the link {string} on the same line",
  async function (this: SpecWorld, label: string) {
    const glass = await button(this).boundingBox();
    const link = await this.browserPage.locator(menuLink(label)).boundingBox();
    assert.ok(glass !== null && link !== null, "Nothing to measure.");
    assert.ok(
      glass.x + glass.width <= link.x + 0.5,
      "The glass is not before.",
    );
    assert.ok(
      glass.y < link.y + link.height && link.y < glass.y + glass.height,
      "The glass and the link are not on one line.",
    );
  },
);

Then("the header's search box is shown", async function (this: SpecWorld) {
  assert.ok(await box(this).isVisible(), "The search box is not shown.");
});

Then("the header's search box is not shown", async function (this: SpecWorld) {
  assert.ok(!(await box(this).isVisible()), "The search box is shown.");
});

Then(
  "the cursor is in the header's search box",
  async function (this: SpecWorld) {
    assert.ok(
      await this.browserPage.evaluate<boolean>(
        `document.activeElement?.getAttribute("name") === "q"`,
      ),
      "The cursor is not in the search box.",
    );
  },
);

Then(
  "the header's search box says {string}",
  async function (this: SpecWorld, text: string) {
    assert.equal(await box(this).inputValue(), text);
  },
);

Then("the header's search box is empty", async function (this: SpecWorld) {
  assert.equal(await box(this).inputValue(), "");
});

Given(
  "{string} is typed as the header's search box",
  async function (this: SpecWorld, text: string) {
    // A reader opens the box before typing in it, where it is closed.
    if (!(await box(this).isVisible())) await button(this).click();
    await box(this).fill(text);
  },
);

// Pressed with something typed, the glass asks for a search and the page
// changes; pressed with nothing, it only opens or closes the box.
const pressed = async (world: SpecWorld): Promise<void> => {
  const searching = (await box(world).inputValue()).trim() !== "";
  if (!searching) {
    await button(world).click();
    return;
  }
  await Promise.all([
    world.browserPage.waitForNavigation(),
    button(world).click(),
  ]);
  await settled(world);
};

When(
  "the header's magnifying glass is pressed",
  async function (this: SpecWorld) {
    await pressed(this);
  },
);

// Like the glass, it searches only with something typed; with nothing it does
// nothing, and there is no page to wait for.
When(
  "Enter is pressed in the header's search box",
  async function (this: SpecWorld) {
    if ((await box(this).inputValue()).trim() === "") {
      await box(this).press("Enter");
      return;
    }
    await Promise.all([
      this.browserPage.waitForNavigation(),
      box(this).press("Enter"),
    ]);
    await settled(this);
  },
);

Then("the address asks for {string}", function (this: SpecWorld, text: string) {
  const url = new URL(this.browserPage.url());
  assert.equal(url.searchParams.get("q"), text);
});

// What was found ---------------------------------------------------------------

const kinds: Record<string, string> = {
  tournaments: "tournament",
  players: "player",
  competitions: "competition",
};

Then(
  /^"(.*)" is (not )?among the (tournaments|players|competitions) in the results$/,
  async function (
    this: SpecWorld,
    name: string,
    not: string | null,
    kind: string,
  ) {
    assert.equal(
      await named(this, kinds[kind]!, name).count(),
      not === null ? 1 : 0,
    );
  },
);

Then(
  "the competition {string} is shown with the tournament {string}",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const row = results(this, "competition").filter({
      has: this.browserPage.locator("a", { hasText: exactly(competition) }),
    });
    assert.equal(
      (await row.locator(".search-of").innerText()).trim(),
      tournament,
    );
  },
);

// The picture names its country by its alt, as a flag on the lists of
// tournaments names it by the link around it, which a search does not have.
Then(
  /^the flag of "(.*)" in the (found tournaments|found competitions) says "(.*)"$/,
  async function (
    this: SpecWorld,
    name: string,
    which: string,
    country: string,
  ) {
    const kind = which === "found tournaments" ? "tournament" : "competition";
    assert.equal(
      await named(this, kind, name)
        .locator("xpath=ancestor::tr")
        .locator(".tournament-flag img")
        .getAttribute("alt"),
      country,
    );
  },
);

Then(
  /^(\d+) players? (?:is|are) in the results$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await results(this, "player").count(), Number(count));
  },
);

Then("the search page lists nothing", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator("main .search-list").count(), 0);
  assert.equal(await this.browserPage.locator("main .search-none").count(), 0);
});

Then(
  /^the search page (does not say|says) nothing was found$/,
  async function (this: SpecWorld, which: string) {
    assert.equal(
      await this.browserPage.locator("main .search-none").count(),
      which === "says" ? 1 : 0,
    );
  },
);

// Going to what was found -------------------------------------------------------

const follow = async (world: SpecWorld, link: Locator): Promise<void> => {
  await Promise.all([world.browserPage.waitForNavigation(), link.click()]);
  await settled(world);
};

When(
  "the found tournament {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await follow(this, named(this, "tournament", name));
  },
);

When(
  "the found player {string} is pressed",
  async function (this: SpecWorld, name: string) {
    const found = this.browserPage
      .locator("main .search-player a, main .players-search-found a")
      .filter({ hasText: exactly(name) });
    await follow(this, found);
  },
);

When(
  "the found competition {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await follow(this, named(this, "competition", name));
  },
);

// The reader's language ----------------------------------------------------------

Then(
  "every word in the page's content but the names found is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [
      ".tournament-name",
      ".tournament-dates",
      ".search-of",
      ".search-player a",
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

Then(
  "every word in the header's search box is in the test locale",
  async function (this: SpecWorld) {
    // The box is a field and a picture, so what it says is in the attributes a
    // reader is told rather than in text. Every one of them is read, so that a
    // placeholder or a title added later is held to the language too, and so
    // is any text that is added.
    const said = await this.browserPage.evaluate<string[]>(`(() => {
      const form = document.querySelector("header.site-bar .site-search");
      const found = [];
      for (const each of [form, ...form.querySelectorAll("*")]) {
        for (const name of ["aria-label", "placeholder", "title", "alt"]) {
          const value = each.getAttribute(name);
          if (value !== null) found.push(value);
        }
      }
      const text = form.textContent.trim();
      if (/\\p{L}/u.test(text)) found.push(text);
      return found;
    })()`);
    assert.ok(said.length > 0, "The search box says nothing.");
    assert.deepEqual(
      said.filter((words) => !isMarked(words)),
      [],
      "Words in the box came from elsewhere.",
    );
  },
);

// The blurb to refine the search, beneath the end of a list that was cut.
const blurbOf = (world: SpecWorld, kind: string): Locator =>
  world.browserPage.locator(
    `main .search-list:has(.search-${kinds[kind]!}) .search-more`,
  );

Then(
  /^the (tournaments|players|competitions) found (say|do not say) there are more$/,
  async function (this: SpecWorld, kind: string, which: string) {
    assert.equal(await blurbOf(this, kind).count(), which === "say" ? 1 : 0);
  },
);

Then(
  /^the blurb to refine the search is after the last (tournament|player|competition) found$/,
  async function (this: SpecWorld, kind: string) {
    const after = this.browserPage.locator(
      `main .search-list:has(.search-${kind}) > :is(ul, table) + .search-more`,
    );
    assert.equal(await after.count(), 1);
  },
);

Then(
  "the competitions found are before the players found",
  async function (this: SpecWorld) {
    const headings = await this.browserPage
      .locator("main .search-list > h2")
      .allInnerTexts();
    const competitions = headings.indexOf("Competitions");
    const players = headings.indexOf("Players");
    assert.ok(competitions >= 0 && players >= 0, headings.join(", "));
    assert.ok(competitions < players, headings.join(", "));
  },
);

Then(
  /^the dates of the (found tournaments|found competitions) are on one line$/,
  async function (this: SpecWorld, which: string) {
    const cell = this.browserPage
      .locator(`main section[data-list="${which.slice(6)}"] .tournament-dates`)
      .first();
    const { lines } = await cell.evaluate((element) => {
      const box = element as unknown as {
        getBoundingClientRect(): { height: number };
        ownerDocument: {
          defaultView: {
            getComputedStyle(e: unknown): { lineHeight: string };
          };
        };
      };
      const line = parseFloat(
        box.ownerDocument.defaultView.getComputedStyle(element).lineHeight,
      );
      return { lines: box.getBoundingClientRect().height / line };
    });
    assert.ok(lines < 2, "The dates are on more than one line.");
  },
);

Then(
  /^the (first|second|third) player found is "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string) {
    const at = ["first", "second", "third"].indexOf(which);
    assert.equal(
      (await results(this, "player").nth(at).innerText()).trim(),
      name,
    );
  },
);
