// The API keys page, in a real browser. A label is typed as a reader types it,
// the box for writing is ticked, and the dialog submitted by its button.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { unmarked } from "../../support/languages.js";
import { wordsFor } from "../../support/words.js";

const apiKeys = "/account/api-keys";
const addKey = "/account/api-keys/new";
// The dialog a label is typed into: the page of its own, or the one laid over
// the list where there is scripting.
const dialog = ":is(section.dialog, #api-key-dialog)";
const over = "dialog.modal-dialog";

const words = (key: string): string => {
  const said = wordsFor(key);
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const open = async (world: WebWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${apiKeys}`);
};

const openAddKey = async (world: WebWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${addKey}`);
};

Given("the Add Key page is open", async function (this: WebWorld) {
  await openAddKey(this);
});

When("the Add Key page is opened", async function (this: WebWorld) {
  await openAddKey(this);
});

When("the Add Key link is followed", async function (this: WebWorld) {
  await this.browserPage.click("#api-keys-add");
  await this.browserPage.waitForLoadState();
});

Then(
  "the page links to Add Key at {string}",
  async function (this: WebWorld, path: string) {
    const link = this.browserPage.locator("#api-keys-add");
    assert.equal(
      unmarked((await link.textContent()) ?? ""),
      words("apiKeys.add"),
    );
    assert.equal(await link.getAttribute("href"), path);
  },
);

Then("Add Key is drawn as a button", async function (this: WebWorld) {
  const classes =
    (await this.browserPage.locator("#api-keys-add").getAttribute("class")) ??
    "";
  assert.ok(classes.split(" ").includes("button"));
});

Then("the page has no dialog", async function (this: WebWorld) {
  assert.equal(await this.browserPage.locator("section.dialog").count(), 0);
});

// A dialog laid over the page is open when the browser says it is modal.
const isOpen = (id: string): string =>
  `document.getElementById("${id}").matches(":modal")`;

Then("no dialog is open", async function (this: WebWorld) {
  assert.equal(await this.browserPage.locator(`${over}[open]`).count(), 0);
});

When("Add Key is pressed", async function (this: WebWorld) {
  await this.browserPage.click("#api-keys-add");
  await this.browserPage.waitForSelector(`${over}[open]`);
});

When(
  "Cancel is pressed in the dialog over the list",
  async function (this: WebWorld) {
    await this.browserPage.click(`${over}[open] .dialog-cancel`);
  },
);

Then(
  "the dialog over the list asks for a label",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage.evaluate<boolean>(isOpen("api-key-dialog")),
      true,
    );
    assert.equal(
      await this.browserPage
        .locator('#api-key-dialog input[name="label"]')
        .isVisible(),
      true,
    );
  },
);

Then(
  "the dialog over the list says {string}",
  async function (this: WebWorld, said: string) {
    assert.equal(
      await this.browserPage.evaluate<boolean>(isOpen("api-key-dialog")),
      true,
    );
    const message = await this.browserPage
      .locator("#api-key-dialog .field-message")
      .textContent();
    assert.equal(unmarked(message ?? "").trim(), said);
  },
);

Then("the dialog asks for a label", async function (this: WebWorld) {
  assert.equal(
    await this.browserPage.locator(`${dialog} input[name="label"]`).count(),
    1,
  );
});

Given("the API keys page is open", async function (this: WebWorld) {
  await open(this);
});

When("the API keys page is opened", async function (this: WebWorld) {
  await open(this);
});

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
When(
  "the API keys page is opened with scripting off",
  async function (this: WebWorld) {
    await open(this);
  },
);

Then("the API keys page is shown", async function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, apiKeys);
  const title = unmarked(
    (await this.browserPage.locator("h1").first().textContent()) ?? "",
  );
  assert.equal(title, words("apiKeys.title"));
});

Given(
  "the label {string} is typed",
  async function (this: WebWorld, label: string) {
    await this.browserPage.fill(`${dialog} input[name="label"]`, label);
  },
);

Given(
  "a label of {int} letters is typed",
  async function (this: WebWorld, letters: number) {
    await this.browserPage.fill(
      `${dialog} input[name="label"]`,
      "k".repeat(letters),
    );
  },
);

Given("the box for writing is ticked", async function (this: WebWorld) {
  await this.browserPage.check(`${dialog} input[name="write"]`);
});

// What the key made is: shown once, as the page that answers the form shows it.
Then("the page shows a new key", async function (this: WebWorld) {
  const key = await this.browserPage.locator("#api-key-new").textContent();
  assert.ok(
    key !== null && key.startsWith("cs_") && key.length > 40,
    `The page shows ${JSON.stringify(key)}.`,
  );
});

Then("the page shows no new key", async function (this: WebWorld) {
  assert.equal(await this.browserPage.locator("#api-key-new").count(), 0);
});

// The list does not hold the key itself, which the site has no copy of.
Then("the list does not carry the new key", async function (this: WebWorld) {
  const key = await this.browserPage.locator("#api-key-new").textContent();
  assert.ok(key !== null, "The page shows no new key.");
  const list =
    (await this.browserPage.locator("#api-keys").textContent()) ?? "";
  assert.ok(!list.includes(key));
});

Then("the page says there are no keys", async function (this: WebWorld) {
  const said = unmarked(
    (await this.browserPage.locator("#api-keys-none").textContent()) ?? "",
  );
  assert.equal(said, words("apiKeys.none"));
});

Then(
  "the page lists {int} key",
  async function (this: WebWorld, count: number) {
    assert.equal(await this.browserPage.locator("#api-keys li").count(), count);
  },
);

const ORDINALS = ["first", "second", "third"];

const keyOnPage = (world: WebWorld, place: string) => {
  const at = ORDINALS.indexOf(place);
  assert.ok(at >= 0, `${place} is not a place in the list.`);
  return world.browserPage.locator(`#api-key-${String(at + 1)}`);
};

const saidOf = async (
  world: WebWorld,
  place: string,
  part: string,
): Promise<string> =>
  unmarked((await keyOnPage(world, place).locator(part).textContent()) ?? "");

Then(
  "the {word} key on the page is labelled {string}",
  async function (this: WebWorld, place: string, label: string) {
    assert.equal(await saidOf(this, place, ".api-key-label"), label);
  },
);

Then(
  "the {word} key on the page may only read",
  async function (this: WebWorld, place: string) {
    assert.equal(
      await saidOf(this, place, ".api-key-scope"),
      words("apiKeys.mayRead"),
    );
  },
);

Then(
  "the {word} key on the page may read and write",
  async function (this: WebWorld, place: string) {
    assert.equal(
      await saidOf(this, place, ".api-key-scope"),
      words("apiKeys.mayReadAndWrite"),
    );
  },
);

const trashCan = (world: WebWorld, place: string) =>
  keyOnPage(world, place).locator("a.api-key-revoke");

Then(
  "the {word} key on the page can be revoked",
  async function (this: WebWorld, place: string) {
    assert.equal(await trashCan(this, place).count(), 1);
  },
);

When(
  "the trash can of the {word} key is pressed",
  async function (this: WebWorld, place: string) {
    await trashCan(this, place).click();
    await this.browserPage.waitForLoadState();
  },
);

// Without scripting the trash can is a link to a page that asks.
Then(
  "the page asks whether to revoke the key {string}",
  async function (this: WebWorld, label: string) {
    const asked = unmarked(
      (await this.browserPage.locator(".notice").textContent()) ?? "",
    );
    assert.ok(asked.includes(label), `The page asks "${asked}".`);
  },
);

When("Cancel is followed", async function (this: WebWorld) {
  await this.browserPage.click(".dialog-buttons a.button");
  await this.browserPage.waitForLoadState();
});

Then(
  "the dialog over the list asks whether to revoke the key {string}",
  async function (this: WebWorld, label: string) {
    assert.equal(
      await this.browserPage.evaluate<boolean>(isOpen("api-key-revoke-dialog")),
      true,
    );
    assert.equal(
      unmarked(
        (await this.browserPage
          .locator("#api-key-revoke-dialog .api-key-revoking")
          .textContent()) ?? "",
      ),
      label,
    );
  },
);

When(
  "the revoke is confirmed in the dialog over the list",
  async function (this: WebWorld) {
    await this.browserPage.click(
      '#api-key-revoke-dialog button[type="submit"]',
    );
    await this.browserPage.waitForLoadState();
  },
);

When(
  "the page that asks to revoke a key that is not theirs is opened",
  async function (this: WebWorld) {
    await this.browserPage.goto(
      `${this.baseUrl!}${apiKeys}/revoke?keyId=not-a-key`,
    );
  },
);

// The trash can is the first thing in the key's row, before its label, and has
// no words beside it: what it does is said to whoever cannot see it.
Then(
  "the {word} key on the page has a trash can before its label",
  async function (this: WebWorld, place: string) {
    const at = ORDINALS.indexOf(place) + 1;
    const order = await this.browserPage.evaluate<{
      firstHasTrashCan: boolean;
      beforeLabel: boolean;
    }>(`(() => {
      const row = document.getElementById("api-key-${String(at)}");
      const first = row.firstElementChild;
      const label = row.querySelector(".api-key-label");
      return {
        firstHasTrashCan: first.querySelector("svg.icon-trash-can") !== null,
        beforeLabel: (first.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
      };
    })()`);
    assert.deepEqual(order, { firstHasTrashCan: true, beforeLabel: true });
  },
);

Then(
  "the trash can of the {word} key has no words on it",
  async function (this: WebWorld, place: string) {
    const button = trashCan(this, place);
    assert.equal(((await button.textContent()) ?? "").trim(), "");
  },
);

Then(
  "the trash can of the {word} key is named Revoke",
  async function (this: WebWorld, place: string) {
    const button = trashCan(this, place);
    assert.equal(
      unmarked((await button.getAttribute("aria-label")) ?? ""),
      words("apiKeys.revoke"),
    );
  },
);

// Copying: the button is there only with scripting, beside the key it copies.
Then(
  "the copy button is shown beside the new key",
  async function (this: WebWorld) {
    const button = this.browserPage.locator("#api-key-copy");
    assert.equal(await button.isVisible(), true);
    const together = await this.browserPage.evaluate<boolean>(`(() => {
      const key = document.getElementById("api-key-new");
      const button = document.getElementById("api-key-copy");
      return key.parentElement === button.parentElement;
    })()`);
    assert.equal(together, true);
  },
);

Then("the copy button is not shown", async function (this: WebWorld) {
  assert.equal(
    await this.browserPage.locator("#api-key-copy").isVisible(),
    false,
  );
});

Given("the browser allows the clipboard", async function (this: WebWorld) {
  await this.browserContext!.grantPermissions([
    "clipboard-read",
    "clipboard-write",
  ]);
});

When("the copy button is pressed", async function (this: WebWorld) {
  await this.browserPage.click("#api-key-copy");
});

Then("the clipboard holds the new key", async function (this: WebWorld) {
  const key = await this.browserPage.locator("#api-key-new").textContent();
  assert.ok(key !== null && key.startsWith("cs_"));
  assert.equal(
    await this.browserPage.evaluate<string>("navigator.clipboard.readText()"),
    key,
  );
});

// Waited for, since the clipboard answers after the press and the button then
// says so.
Then("the copy button says Copied", async function (this: WebWorld) {
  await this.browserPage
    .locator("#api-key-copy")
    .filter({ hasText: words("apiKeys.copied") })
    .waitFor({ timeout: 1500 });
});

// The date a key was made: as year, month and day where there is no scripting
// to know the reader's region, and as the region writes it where there is.
const dateOf = (world: WebWorld, place: string) =>
  keyOnPage(world, place).locator(".api-key-made time");

Then(
  "the {word} key on the page was made on a date written as year, month and day",
  async function (this: WebWorld, place: string) {
    const written = ((await dateOf(this, place).textContent()) ?? "").trim();
    assert.match(written, /^\d{4}-\d{2}-\d{2}$/);
  },
);

Then(
  "the {word} key on the page was made on a date written for {string}",
  async function (this: WebWorld, place: string, region: string) {
    const moment = await dateOf(this, place).getAttribute("datetime");
    assert.ok(moment !== null, "The date says no moment.");
    assert.equal(
      ((await dateOf(this, place).textContent()) ?? "").trim(),
      new Date(moment).toLocaleDateString(region),
    );
  },
);

Given(
  "the browser is set to the region {string}",
  async function (this: WebWorld, region: string) {
    await withScripting(this, region);
  },
);

// A heading has half a blank line beneath it: half a line of the page's own text, as
// tall as the lines the page is written in and not as tall as the heading's.
Then(
  "every heading on the page has half a blank line beneath it",
  async function (this: WebWorld) {
    const gaps = await this.browserPage.evaluate<
      { name: string; gap: number; line: number }[]
    >(`[...document.querySelectorAll(".api-keys-page :is(h1, h2, h3)")].map((each) => ({
      name: each.tagName,
      gap: each.nextElementSibling.getBoundingClientRect().top - each.getBoundingClientRect().bottom,
      line: parseFloat(getComputedStyle(document.body).lineHeight),
    }))`);
    assert.ok(gaps.length > 0, "The page has no headings.");
    for (const { name, gap, line } of gaps) {
      assert.ok(
        Math.abs(gap - line / 2) <= 1,
        `A ${name} has ${String(gap)}px beneath it, not half a line of ${String(line / 2)}px.`,
      );
    }
  },
);

// A blank line is a line of the page's own text.
Then(
  "Add Key has a blank line above and below it",
  async function (this: WebWorld) {
    const margins = await this.browserPage.evaluate<{
      above: number;
      below: number;
      line: number;
    }>(`(() => {
      const style = getComputedStyle(document.querySelector(".api-keys-add"));
      return {
        above: parseFloat(style.marginTop),
        below: parseFloat(style.marginBottom),
        line: parseFloat(getComputedStyle(document.body).lineHeight),
      };
    })()`);
    assert.ok(
      Math.abs(margins.above - margins.line) <= 1,
      `${String(margins.above)}px above.`,
    );
    assert.ok(
      Math.abs(margins.below - margins.line) <= 1,
      `${String(margins.below)}px below.`,
    );
  },
);

// The green of the button that does what a form is for.
Then("the copy button is green", async function (this: WebWorld) {
  const same = await this.browserPage.evaluate<boolean>(`(() => {
    const probe = document.createElement("span");
    probe.style.color = getComputedStyle(document.documentElement).getPropertyValue("--action");
    document.body.appendChild(probe);
    const green = getComputedStyle(probe).color;
    probe.remove();
    return getComputedStyle(document.getElementById("api-key-copy")).backgroundColor === green;
  })()`);
  assert.equal(same, true);
});

Then(
  "the heading of the page says {string}",
  async function (this: WebWorld, heading: string) {
    assert.equal(
      (await this.browserPage.locator("main h1").first().textContent())?.trim(),
      heading,
    );
  },
);
