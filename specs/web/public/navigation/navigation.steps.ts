import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

// Named rather than left as "header summary" and "header a": the header also
// holds the account menu, which has a summary and links of its own, and a step
// about the primary navigation that lands on the first match in the page is one
// the order of the markup decides.
const menuButton = "header details.menu > summary";
const link = (label: string): string => `.menu-links a:text-is("${label}")`;
const section = (label: string): string =>
  `.site-sections a:text-is("${label}")`;

Given(
  "a viewport {int} pixels wide",
  async function (this: SpecWorld, width: number) {
    // The height is not what any of these scenarios are about, so it is the same
    // for all of them and says nothing.
    await this.browserPage.setViewportSize({ width, height: 800 });
  },
);

const openHomePage = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/`);
};

Given("the home page is open", openHomePage);
When("the home page is opened", openHomePage);

When("the menu button is pressed", async function (this: SpecWorld) {
  await this.browserPage.click(menuButton);
});

Then(
  "the link {string} is visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(link(label)), true);
  },
);

Then(
  "the link {string} is not visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(link(label)), false);
  },
);

Then("the menu button is visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible(menuButton), true);
});

Then("the menu button is not visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible(menuButton), false);
});

Then(
  "the link {string} is at least {int} pixels tall",
  async function (this: SpecWorld, label: string, height: number) {
    const box = await this.browserPage.locator(link(label)).boundingBox();
    assert.ok(box !== null, `The link ${label} has no box to measure.`);
    assert.ok(
      box.height >= height,
      `The link ${label} is ${Math.round(box.height)} pixels tall, and wanted ${height}.`,
    );
  },
);

Then(
  "the section {string} is visible",
  async function (this: SpecWorld, label: string) {
    assert.equal(await this.browserPage.isVisible(section(label)), true);
  },
);

Then(
  "the section {string} is marked as current",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(section(label), "aria-current"),
      "page",
    );
  },
);

Then(
  "the section {string} is not marked as current",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(section(label), "aria-current"),
      null,
    );
  },
);

Then(
  /^(\d+) sections? (?:is|are) marked as current$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(
      await this.browserPage
        .locator('.site-sections a[aria-current="page"]')
        .count(),
      Number(count),
    );
  },
);

// What the navigation offers ------------------------------------------------------

// Every link in it, in the order it offers them, whether or not the menu is
// open: what is offered is the same either way.
const offered = (world: SpecWorld): Promise<string[]> =>
  world.browserPage.locator(".menu-links a").allTextContents();

Then(
  /^the (first|second|third) link in the navigation is "([^"]*)"$/,
  async function (this: SpecWorld, which: string, label: string) {
    const at = ["first", "second", "third"].indexOf(which);
    assert.equal((await offered(this))[at], label);
  },
);

Then(
  "the navigation holds {int} links",
  async function (this: SpecWorld, count: number) {
    assert.equal((await offered(this)).length, count);
  },
);

Then(
  "the link {string} leads to {string}",
  async function (this: SpecWorld, label: string, address: string) {
    assert.equal(
      await this.browserPage.getAttribute(link(label), "href"),
      address,
    );
  },
);

// How the page being read is marked -----------------------------------------------

Then(
  "the link {string} is marked as the page being read",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(link(label), "aria-current"),
      "page",
    );
  },
);

Then(
  "the link {string} is not marked as the page being read",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(link(label), "aria-current"),
      null,
    );
  },
);

// What the stylesheet draws the link `label` with, found by its place among
// the navigation's links and read as an expression, as the other steps read
// what they run in the page, since the specs are typed without the browser's
// own types.
const drawn = async (
  world: SpecWorld,
  label: string,
  property: string,
): Promise<string> => {
  const at = (
    await world.browserPage.locator(".menu-links a").allTextContents()
  ).indexOf(label);
  assert.ok(at >= 0, `The navigation has no link ${label}.`);
  return world.browserPage.evaluate<string>(
    `getComputedStyle(document.querySelectorAll(".menu-links a")[${String(at)}]).${property}`,
  );
};

Then(
  "the link {string} is on black",
  async function (this: SpecWorld, label: string) {
    assert.equal(await drawn(this, label, "backgroundColor"), "rgb(0, 0, 0)");
  },
);

// The colour a current section is drawn on, read off one drawn for the purpose
// as the section bar draws it, since the page being read need have no sections
// of its own: the home page's are years, and none of them is current.
Then(
  "the link {string} is on the colour the current section is on",
  async function (this: SpecWorld, label: string) {
    const section = await this.browserPage.evaluate<string>(
      `(() => {
        const bar = document.createElement("nav");
        bar.className = "site-sections";
        const current = bar.appendChild(document.createElement("a"));
        current.setAttribute("aria-current", "page");
        document.body.appendChild(bar);
        const colour = getComputedStyle(current).backgroundColor;
        bar.remove();
        return colour;
      })()`,
    );
    assert.equal(await drawn(this, label, "backgroundColor"), section);
  },
);

Then(
  "the link {string} is not underlined",
  async function (this: SpecWorld, label: string) {
    assert.ok(
      !(await drawn(this, label, "textDecorationLine")).includes("underline"),
      `${label} is underlined.`,
    );
  },
);

// The account, behind the button ---------------------------------------------------

// The group is found by its own class and not by "nav" or "ul", which the
// navigation beside it is also made of.
const group = ".menu-account";

Then("the account menu is visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible("details.account-menu"), true);
});

Then("the account menu is not visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible("details.account-menu"), false);
});

Then("the account group is visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible(group), true);
});

Then("the account group is not visible", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.isVisible(group), false);
});

Then(
  "the account group is headed {string}",
  async function (this: SpecWorld, heading: string) {
    assert.equal(
      (
        await this.browserPage
          .locator(`${group} .menu-account-heading`)
          .textContent()
      )?.trim(),
      heading,
    );
  },
);

const accountItem = (world: SpecWorld, item: string) =>
  world.browserPage.locator(`${group} a`, {
    hasText: new RegExp(`^${item}$`),
  });

Then(
  "the account group offers {string} at {string}",
  async function (this: SpecWorld, item: string, path: string) {
    const found = accountItem(this, item);
    assert.equal(await found.count(), 1, `The group does not offer ${item}.`);
    assert.equal(await found.getAttribute("href"), path);
  },
);

Then(
  "the account group does not offer {string}",
  async function (this: SpecWorld, item: string) {
    assert.equal(await accountItem(this, item).count(), 0);
  },
);

Then(
  "the account group offers a button to sign out",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator(`${group} form button`).count(),
      1,
    );
  },
);

Then(
  "the account group's form posts to {string}",
  async function (this: SpecWorld, path: string) {
    assert.equal(
      await this.browserPage.locator(`${group} form`).getAttribute("action"),
      path,
    );
  },
);

Then(
  "the account group's {string} is at least {int} pixels tall",
  async function (this: SpecWorld, item: string, height: number) {
    const box = await accountItem(this, item).boundingBox();
    assert.ok(box !== null, `${item} has no box to measure.`);
    assert.ok(
      box.height >= height,
      `${item} is ${Math.round(box.height)} pixels tall, and wanted ${height}.`,
    );
  },
);
