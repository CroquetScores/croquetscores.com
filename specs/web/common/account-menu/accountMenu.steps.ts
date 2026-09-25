import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { signOutPath } from "../../../../src/web/common/accountMenu.js";
import type { SpecWorld } from "../../../support/world.js";
import { closes, opens } from "../../support/languages.js";
import { hasNoPassword, signInAs, signOutOf } from "../../support/reader.js";

const MENU = "details.account-menu";
const SUMMARY = `${MENU} > summary`;

const menuOf = (world: SpecWorld) => world.browserPage.locator(MENU);

// What the menu offers, by what each item says: a link's words, or the
// sign-out button's.
const offered = async (world: SpecWorld): Promise<string[]> => {
  const words = await menuOf(world)
    .locator(".account-menu-links a, .account-menu-links button")
    .allTextContents();
  return words.map((each) => each.trim());
};

// The menu, pressed ------------------------------------------------------------

When("the account menu is pressed", async function (this: SpecWorld) {
  await this.browserPage.locator(SUMMARY).click();
});

// A details element carries open as an attribute, which is "" when it is there
// and nothing when it is not: read as an attribute rather than through the DOM,
// since these steps have no DOM to name.
const isOpen = async (world: SpecWorld): Promise<boolean> =>
  (await menuOf(world).getAttribute("open")) !== null;

Then("the account menu is open", async function (this: SpecWorld) {
  assert.equal(await isOpen(this), true);
});

Then("the account menu is closed", async function (this: SpecWorld) {
  assert.equal(await isOpen(this), false);
});

// Where it is, and what it shows -----------------------------------------------

Then(
  "the last item in the header navigation is the account menu",
  async function (this: SpecWorld) {
    const last =
      (await this.browserPage
        .locator("header .site-bar-inner > *")
        .last()
        .getAttribute("class")) ?? "";
    assert.ok(
      last.includes("account-menu"),
      `The header's last item is ${last}.`,
    );
  },
);

// The bar carries one item for an account, the menu, so nothing of an
// account's is in the navigation beside it.
Then(
  "the primary navigation does not offer {string}",
  async function (this: SpecWorld, item: string) {
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

Then("the account menu shows a person", async function (this: SpecWorld) {
  assert.equal(await menuOf(this).locator("summary svg.person").count(), 1);
});

// What it offers ---------------------------------------------------------------

// The one item whose words are these, so that a step naming an item by what it
// says lands on it rather than on whatever comes first.
const itemFor = (world: SpecWorld, item: string) =>
  menuOf(world).locator(".account-menu-links a", {
    hasText: new RegExp(`^${item}$`),
  });

Then(
  "the menu offers {string} at {string}",
  async function (this: SpecWorld, item: string, path: string) {
    const link = itemFor(this, item);
    assert.equal(await link.count(), 1, `The menu does not offer ${item}.`);
    assert.equal(await link.getAttribute("href"), path);
  },
);

Then(
  "the menu does not offer {string}",
  async function (this: SpecWorld, item: string) {
    const items = await offered(this);
    assert.ok(!items.includes(item), `The menu offers ${items.join(", ")}.`);
  },
);

// Which of the menu's pages is being read -------------------------------------

Then(
  "the menu marks {string} as the page being read",
  async function (this: SpecWorld, item: string) {
    assert.equal(
      await itemFor(this, item).getAttribute("aria-current"),
      "page",
    );
  },
);

Then(
  "the menu does not mark {string} as the page being read",
  async function (this: SpecWorld, item: string) {
    assert.equal(await itemFor(this, item).getAttribute("aria-current"), null);
  },
);

Then(
  "the menu marks nothing as the page being read",
  async function (this: SpecWorld) {
    const marked = menuOf(this).locator(".account-menu-links [aria-current]");
    assert.equal(
      await marked.count(),
      0,
      `The menu marks ${(await marked.allTextContents()).join(", ")}.`,
    );
  },
);

// Signing out ------------------------------------------------------------------

const signOutButton = (world: SpecWorld) =>
  menuOf(world).locator(".account-menu-links form button");

Then("the menu offers a button to sign out", async function (this: SpecWorld) {
  assert.equal(await signOutButton(this).count(), 1);
});

Then("the menu offers no link to sign out", async function (this: SpecWorld) {
  const all = await menuOf(this).locator(".account-menu-links a").all();
  const links = await Promise.all(all.map((each) => each.getAttribute("href")));
  assert.ok(
    !links.includes(signOutPath),
    `The menu links to ${signOutPath}: ${links.join(", ")}`,
  );
});

Then(
  "the form the button is in asks to post",
  async function (this: SpecWorld) {
    const method = await menuOf(this)
      .locator(".account-menu-links form")
      .getAttribute("method");
    assert.equal(method?.toLowerCase(), "post");
  },
);

Then(
  "the form the button is in posts to {string}",
  async function (this: SpecWorld, path: string) {
    const action = await menuOf(this)
      .locator(".account-menu-links form")
      .getAttribute("action");
    assert.equal(action, path);
  },
);

// Who is reading ---------------------------------------------------------------

// Nothing is made: the menu asks only whether somebody is signed in, and what
// it offers is the same whoever that is. What makes an account is specified
// with registering, and what confirms one with confirming.
// Cucumber counts a step's arguments, so the address is taken and set down
// again: taking none would be read as a step that does not match its own words.
Given("an account for {string}, confirmed", function (address: string) {
  // Nothing else to do, and said so rather than left out: a scenario that reads
  // as though it has an account should not pass for want of the step.
  assert.ok(address.includes("@"), `${address} is not an email address.`);
});

// Nothing is made, for the reason above; what is kept is only that signing in
// as the address says its account has no password.
Given(
  "an account for {string}, confirmed, with no password",
  function (this: SpecWorld, address: string) {
    hasNoPassword(this, address);
  },
);

// Said of the scenario's browser rather than of any account: these scenarios
// have no database, and what the menu asks is only whether anybody is signed
// in. Whether a reader really is signed in, to a real account, is asked in the
// words of the features that sign one in.
Given(
  "a reader signed in as {string}",
  async function (this: SpecWorld, address: string) {
    await signInAs(this, address);
  },
);

Given("nobody is signed in", async function (this: SpecWorld) {
  await signOutOf(this);
});

// Its words --------------------------------------------------------------------

Then(
  "every word in the account menu is in the test locale",
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld) {
    const named =
      (await menuOf(this).locator("summary .visually-hidden").textContent()) ??
      "";
    assert.ok(
      named.startsWith(opens) && named.endsWith(closes),
      `The menu is named ${named}.`,
    );
  },
);
