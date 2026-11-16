import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { closes, opens } from "../../support/languages.js";
import { pressOutside } from "../../support/pressOutside.js";

// Where the account menu's way out leads.
const signOutPath = "/account/sign-out";

const MENU = "details.account-menu";
const SUMMARY = `${MENU} > summary`;

const menuOf = (world: WebWorld) => world.browserPage.locator(MENU);

// What the menu offers, by what each item says: a link's words, or the
// sign-out button's.
const offered = async (world: WebWorld): Promise<string[]> => {
  const words = await menuOf(world)
    .locator(".account-menu-links a, .account-menu-links button")
    .allTextContents();
  return words.map((each) => each.trim());
};

// The menu, pressed ------------------------------------------------------------

When("the account menu is pressed", async function (this: WebWorld) {
  await this.browserPage.locator(SUMMARY).click();
});

When(
  "the page outside the account menu is pressed",
  async function (this: WebWorld) {
    await pressOutside(this);
  },
);

// The corner of the panel, since its middle is an item and pressing one
// follows it.
When("the account menu's panel is pressed", async function (this: WebWorld) {
  await this.browserPage
    .locator(`${MENU} .account-menu-links`)
    .click({ position: { x: 1, y: 1 } });
});

// A details element carries open as an attribute, which is "" when it is there
// and nothing when it is not: read as an attribute rather than through the DOM,
// since these steps have no DOM to name.
const isOpen = async (world: WebWorld): Promise<boolean> =>
  (await menuOf(world).getAttribute("open")) !== null;

Then("the account menu is open", async function (this: WebWorld) {
  assert.equal(await isOpen(this), true);
});

Then("the account menu is closed", async function (this: WebWorld) {
  assert.equal(await isOpen(this), false);
});

// Where it is, and what it shows -----------------------------------------------

// The bar carries one item for an account, the menu, so nothing of an
// account's is in the navigation beside it.
Then(
  "the primary navigation does not offer {string}",
  async function (this: WebWorld, item: string) {
    const words = await this.browserPage
      .locator(".menu-links a")
      .allTextContents();
    const offers = words.map((each) => each.trim());
    assert.ok(
      !offers.includes(item),
      `The navigation offers ${offers.join(", ")}.`,
    );
  },
);

Then("the account menu shows a person", async function (this: WebWorld) {
  assert.equal(await menuOf(this).locator("summary svg.person").count(), 1);
});

// What it offers ---------------------------------------------------------------

// The one item whose words are these, so that a step naming an item by what it
// says lands on it rather than on whatever comes first.
const itemFor = (world: WebWorld, item: string) =>
  menuOf(world).locator(".account-menu-links a", {
    hasText: new RegExp(`^${item}$`),
  });

Then(
  "the menu offers {string} at {string}",
  async function (this: WebWorld, item: string, path: string) {
    const link = itemFor(this, item);
    assert.equal(await link.count(), 1, `The menu does not offer ${item}.`);
    assert.equal(await link.getAttribute("href"), path);
  },
);

Then(
  "the menu does not offer {string}",
  async function (this: WebWorld, item: string) {
    const items = await offered(this);
    assert.ok(!items.includes(item), `The menu offers ${items.join(", ")}.`);
  },
);

// Which of the menu's pages is being read -------------------------------------

Then(
  "the menu marks {string} as the page being read",
  async function (this: WebWorld, item: string) {
    assert.equal(
      await itemFor(this, item).getAttribute("aria-current"),
      "page",
    );
  },
);

Then(
  "the menu does not mark {string} as the page being read",
  async function (this: WebWorld, item: string) {
    assert.equal(await itemFor(this, item).getAttribute("aria-current"), null);
  },
);

Then(
  "the menu marks nothing as the page being read",
  async function (this: WebWorld) {
    const marked = menuOf(this).locator(".account-menu-links [aria-current]");
    assert.equal(
      await marked.count(),
      0,
      `The menu marks ${(await marked.allTextContents()).join(", ")}.`,
    );
  },
);

// Signing out ------------------------------------------------------------------

const signOutButton = (world: WebWorld) =>
  menuOf(world).locator(".account-menu-links form button");

Then("the menu offers a button to sign out", async function (this: WebWorld) {
  assert.equal(await signOutButton(this).count(), 1);
});

Then("the menu offers no link to sign out", async function (this: WebWorld) {
  const all = await menuOf(this).locator(".account-menu-links a").all();
  const links = await Promise.all(all.map((each) => each.getAttribute("href")));
  assert.ok(
    !links.includes(signOutPath),
    `The menu links to ${signOutPath}: ${links.join(", ")}`,
  );
});

Then("the form the button is in asks to post", async function (this: WebWorld) {
  const method = await menuOf(this)
    .locator(".account-menu-links form")
    .getAttribute("method");
  assert.equal(method?.toLowerCase(), "post");
});

Then(
  "the form the button is in posts to {string}",
  async function (this: WebWorld, path: string) {
    const action = await menuOf(this)
      .locator(".account-menu-links form")
      .getAttribute("action");
    assert.equal(action, path);
  },
);

// Who is reading ---------------------------------------------------------------

// Its words --------------------------------------------------------------------

Then(
  "every word in the account menu is in the test locale",
  async function (this: WebWorld) {
    const words = [
      ...(await offered(this)),
      (await menuOf(this).locator("summary .visually-hidden").textContent()) ??
        "",
    ];
    const stray = words.filter(
      (each) => !(each.startsWith(opens) && each.endsWith(closes)),
    );
    assert.deepEqual(stray, [], "Words in the menu came from elsewhere.");
  },
);

Then(
  "the account menu is named in the test locale for a reader who cannot see it",
  async function (this: WebWorld) {
    const named =
      (await menuOf(this).locator("summary .visually-hidden").textContent()) ??
      "";
    assert.ok(
      named.startsWith(opens) && named.endsWith(closes),
      `The menu is named ${named}.`,
    );
  },
);

// What the stylesheet draws the item `item` with, found by its place among the
// menu's links and read as an expression, as the other steps read what they
// run in the page, since the specs are typed without the browser's own types.
const drawnItem = async (
  world: WebWorld,
  item: string,
  property: string,
): Promise<string> => {
  const items = ".account-menu-links a";
  const at = (await menuOf(world).locator(items).allTextContents()).indexOf(
    item,
  );
  assert.ok(at >= 0, `The menu has no item ${item}.`);
  return world.browserPage.evaluate<string>(
    `getComputedStyle(document.querySelectorAll(".account-menu ${items}")[${String(at)}]).${property}`,
  );
};

Then(
  "the menu shows {string} on black",
  async function (this: WebWorld, item: string) {
    assert.equal(
      await drawnItem(this, item, "backgroundColor"),
      "rgb(0, 0, 0)",
    );
  },
);

Then(
  "the menu does not underline {string}",
  async function (this: WebWorld, item: string) {
    assert.ok(
      !(await drawnItem(this, item, "textDecorationLine")).includes(
        "underline",
      ),
      `${item} is underlined.`,
    );
  },
);
