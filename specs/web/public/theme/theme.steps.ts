import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";

// What each theme actually looks like, so that "the page is dark" is a claim
// about what was painted rather than about an attribute that is supposed to
// cause it.
const surfaces = {
  light: "rgb(230, 242, 230)",
  dark: "rgb(16, 20, 15)",
};

const themeButton = (label: string): string =>
  `footer form.theme button:text-is("${label}")`;

Given(
  "a machine that prefers {word}",
  async function (this: SpecWorld, scheme: string) {
    assert.ok(
      scheme === "light" || scheme === "dark",
      `Unknown preference ${scheme}.`,
    );
    this.colourScheme = scheme;
    await this.browserPage.emulateMedia({ colorScheme: scheme });
  },
);

When(
  "the theme {string} is chosen",
  async function (this: SpecWorld, label: string) {
    await this.browserPage.click(themeButton(label));
    await this.browserPage.waitForLoadState();
  },
);

When("a page that is not there is opened", async function (this: SpecWorld) {
  await this.browserPage.goto(`${this.baseUrl!}/no-such-page`);
});

Then("the page is {word}", async function (this: SpecWorld, theme: string) {
  const wanted = surfaces[theme as keyof typeof surfaces];
  assert.ok(
    wanted !== undefined,
    `There is no ${theme} theme to check against.`,
  );

  const painted = await this.browserPage.evaluate<string>(
    "getComputedStyle(document.body).backgroundColor",
  );
  assert.equal(painted, wanted, `Expected the ${theme} surface.`);
});

Then(
  "the theme {string} is the one in force",
  async function (this: SpecWorld, label: string) {
    assert.equal(
      await this.browserPage.getAttribute(themeButton(label), "aria-current"),
      "true",
      `Expected ${label} to be shown as the theme in force.`,
    );
  },
);

const themeCookie = async function (this: SpecWorld) {
  const cookies = await this.browserContext!.cookies();
  const cookie = cookies.find((candidate) => candidate.name === "theme");
  assert.ok(cookie !== undefined, "No theme cookie was set.");
  return cookie;
};

Then(
  "the choice is kept in a cookie marked Secure",
  async function (this: SpecWorld) {
    const cookie = await themeCookie.call(this);
    assert.equal(cookie.secure, true);
  },
);

Then(
  "the choice is kept in a cookie marked HttpOnly",
  async function (this: SpecWorld) {
    const cookie = await themeCookie.call(this);
    assert.equal(cookie.httpOnly, true);
  },
);

const measure = async function (this: SpecWorld, label: string) {
  const box = await this.browserPage.locator(themeButton(label)).boundingBox();
  assert.ok(box !== null, `The theme button ${label} has no box to measure.`);
  return box;
};

Then(
  "the theme button {string} is at least {int} pixels tall",
  async function (this: SpecWorld, label: string, pixels: number) {
    const box = await measure.call(this, label);
    assert.ok(
      box.height >= pixels,
      `The theme button ${label} is ${Math.round(box.height)} pixels tall, and wanted ${pixels}.`,
    );
  },
);

Then(
  "the theme button {string} is at least {int} pixels wide",
  async function (this: SpecWorld, label: string, pixels: number) {
    const box = await measure.call(this, label);
    assert.ok(
      box.width >= pixels,
      `The theme button ${label} is ${Math.round(box.width)} pixels wide, and wanted ${pixels}.`,
    );
  },
);

// Served into the browser by the scenario rather than by a second server: the
// address is made up, and the browser treats it as the separate site it names.
const elsewhere = "http://elsewhere.example/";

Given(
  "a page on another site with a button that posts {string} here",
  async function (this: SpecWorld, theme: string) {
    const target = `${this.baseUrl!}/theme`;
    await this.browserPage.route(elsewhere, (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html>
<title>Something else entirely</title>
<form method="post" action="${target}">
  <input type="hidden" name="theme" value="${theme}" />
  <input type="hidden" name="return" value="/" />
  <button type="submit">Claim your prize</button>
</form>`,
      }),
    );
    this.elsewhere = elsewhere;
  },
);

When(
  "the reader presses the button on that page",
  async function (this: SpecWorld) {
    await this.browserPage.goto(this.elsewhere!);
    await this.browserPage.click("button");
    await this.browserPage.waitForLoadState();
  },
);
