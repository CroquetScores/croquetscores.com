import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { join } from "node:path";

import {
  helpLibraryIn,
  type HelpLibrary,
} from "../../../../src/web/common/helpLibrary.js";
import {
  alertKindOfPage,
  parseAlertKind,
  type AlertKind,
} from "../../../../src/web/common/whatsNew.js";
import { english } from "../../../../src/web/languages/english.js";
import type { SpecWorld } from "../../../support/world.js";
import { anApplicationWithHelpInTheScenariosLanguages } from "../../support/browser.js";
import { unmarked } from "../../support/languages.js";
import { unmarkedWithin } from "../../support/marks.js";

const dist = join(import.meta.dirname, "..", "..", "..", "..", "dist", "help");

// What each scenario's what's new pages say they were released on, which is
// read afresh with every request so that a scenario can release again
// part-way through, as a deploy does. Left out of the record where a page says
// nothing.
const released = new WeakMap<SpecWorld, Map<AlertKind, string>>();

// Whether the scenario's site has been made with these pages yet: it is made
// when the first release is said, and not before, since a site's help is
// given to it as it is built.
const given = new WeakSet<SpecWorld>();

const releasesOf = (world: SpecWorld): Map<AlertKind, string> => {
  let held = released.get(world);
  if (held === undefined) {
    held = new Map();
    released.set(world, held);
  }
  return held;
};

// The help the build wrote, but for the two pages of what's new, which are
// whatever the scenario has said. They are the English ones only: a language
// that has not written its page has none, as in the real help.
const helpOf = (world: SpecWorld): HelpLibrary => {
  const built = helpLibraryIn(dist);
  return {
    image: built.image,
    page: (tag, name) => {
      const kind = alertKindOfPage(name);
      if (kind === undefined) return built.page(tag, name);
      if (tag !== english.tag) return Promise.resolve(undefined);
      return Promise.resolve({
        title: "What's new",
        html: "<h1>What's new</h1>",
        released: releasesOf(world).get(kind),
      });
    },
  };
};

const siteOf = async (world: SpecWorld): Promise<void> => {
  if (given.has(world)) return;
  given.add(world);
  world.baseUrl = await anApplicationWithHelpInTheScenariosLanguages(
    world,
    helpOf(world),
  );
};

const kindOf = (word: string): AlertKind => {
  const kind = parseAlertKind(word);
  assert.ok(kind !== undefined, `There is no ${word} what's new.`);
  return kind;
};

Given(
  "the {word} what's new was released on {string}",
  async function (this: SpecWorld, word: string, date: string) {
    releasesOf(this).set(kindOf(word), date);
    await siteOf(this);
  },
);

Given(
  "the {word} what's new does not say when it was released",
  async function (this: SpecWorld, word: string) {
    releasesOf(this).delete(kindOf(word));
    await siteOf(this);
  },
);

// A visit ends when the browser is closed, and what a browser forgets then is
// the cookies given no lifetime. Only those of the alert are looked at, so
// that the reader stays who they were.
Given("the reader's visit has ended", async function (this: SpecWorld) {
  const context = this.browserContext;
  assert.ok(context !== undefined, "This scenario has no browser.");
  const held = await context.cookies();
  await context.clearCookies();
  await context.addCookies(
    held.filter(
      (cookie) => !(cookie.name.startsWith("whats-new") && cookie.expires < 0),
    ),
  );
});

// The alert --------------------------------------------------------------------

const alert = ".whats-new";
const choicesOf = `${alert} a, ${alert} button`;

Then(
  "the page has the alert about what's new",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(alert).count(), 1);
  },
);

Then(
  "the page has no alert about what's new",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(alert).count(), 0);
  },
);

Then(
  "the alert offers {string}",
  async function (this: SpecWorld, offer: string) {
    const offered = (
      await this.browserPage.locator(choicesOf).allTextContents()
    ).map((text) => unmarked(text).trim());
    assert.ok(
      offered.includes(offer),
      `The alert offers ${offered.join(", ")}.`,
    );
  },
);

Then(
  "the alert's {string} leads to {string}",
  async function (this: SpecWorld, offer: string, address: string) {
    const link = this.browserPage.locator(`${alert} a`, { hasText: offer });
    assert.equal(await link.getAttribute("href"), address);
  },
);

Given(
  "the alert's {string} is followed",
  async function (this: SpecWorld, offer: string) {
    await this.browserPage.locator(`${alert} a`, { hasText: offer }).click();
    await this.browserPage.waitForLoadState();
  },
);

When(
  "the alert's {string} is chosen",
  async function (this: SpecWorld, offer: string) {
    await this.browserPage
      .locator(`${alert} button`, { hasText: offer })
      .click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "every word in the alert is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, alert);
    assert.deepEqual(stray, [], "Words in the alert came from elsewhere.");
  },
);

// How it is kept ---------------------------------------------------------------

const kept = async (world: SpecWorld) => {
  const cookies = (await world.browserContext!.cookies()).filter((cookie) =>
    cookie.name.startsWith("whats-new"),
  );
  assert.ok(cookies.length > 0, "Nothing was kept for the alert.");
  return cookies;
};

for (const said of ["chose", "has read"]) {
  Then(
    `what the reader ${said} is kept in a cookie marked Secure`,
    async function (this: SpecWorld) {
      for (const cookie of await kept(this)) {
        assert.equal(cookie.secure, true, `${cookie.name} is not Secure.`);
      }
    },
  );

  Then(
    `what the reader ${said} is kept in a cookie marked HttpOnly`,
    async function (this: SpecWorld) {
      for (const cookie of await kept(this)) {
        assert.equal(cookie.httpOnly, true, `${cookie.name} is not HttpOnly.`);
      }
    },
  );
}

// Another site ---------------------------------------------------------------

// Served into the browser by the scenario rather than by a second server: the
// address is made up, and the browser treats it as the separate site it names.
const elsewhere = "http://elsewhere.example/";

Given(
  "a page on another site with a button that posts {string} to the alert here",
  async function (this: SpecWorld, choice: string) {
    const target = `${this.baseUrl!}/whats-new`;
    await this.browserPage.route(elsewhere, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html>
<title>Something else entirely</title>
<form method="post" action="${target}">
  <input type="hidden" name="alert" value="public" />
  <input type="hidden" name="choice" value="${choice}" />
  <input type="hidden" name="return" value="/" />
  <button type="submit">Claim your prize</button>
</form>`,
      }),
    );
    this.elsewhere = elsewhere;
  },
);

// Where the reader is sent back to is read from the answer to the post, rather
// than worked out again here, so that what is held to the rule is the route.
const choiceValues: Readonly<Record<string, string>> = {
  "Remind me next time": "later",
  "Never show me this alert": "never",
};

When(
  "a return to {string} is asked for with the choice {string}",
  async function (this: SpecWorld, asked: string, offer: string) {
    const value = choiceValues[offer];
    assert.ok(value !== undefined, `There is no choice called ${offer}.`);
    const response = await fetch(`${this.baseUrl!}/whats-new`, {
      method: "POST",
      redirect: "manual",
      body: new URLSearchParams({
        alert: "public",
        choice: value,
        return: asked,
      }),
    });
    assert.equal(response.status, 303);
    this.returnPath = response.headers.get("location") ?? undefined;
  },
);

// Where it sits, by where it is drawn: the years the admin draws, the alert
// the server said, and the panel of what the page is for.
const boxOf = async (world: SpecWorld, selector: string) => {
  const locator = world.browserPage.locator(selector).first();
  await locator.waitFor();
  const box = await locator.boundingBox();
  assert.ok(box !== null, `${selector} has no box.`);
  return box;
};

Then("the alert is beneath the years", async function (this: SpecWorld) {
  const years = await boxOf(this, "nav.years");
  const found = await boxOf(this, alert);
  assert.ok(
    found.y >= years.y + years.height - 1,
    `The alert is at ${found.y} and the years end at ${years.y + years.height}.`,
  );
});

Then(
  "the alert is above the admin's content",
  async function (this: SpecWorld) {
    const found = await boxOf(this, alert);
    const content = await boxOf(this, "main .panel");
    assert.ok(
      found.y + found.height <= content.y + 1,
      `The alert ends at ${found.y + found.height} and the content begins at ${content.y}.`,
    );
  },
);
