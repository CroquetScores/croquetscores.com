// A reader at the sign in page, in a real browser.
//
// Signing in is done by filling the form in and pressing its button, as a
// reader does, so that what these scenarios prove is that the page works and
// not that the operation behind it does — which is proved with the operation.
// Having signed in, as what a scenario about something else starts from, is
// the exception, and says why where it is done.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { telling } from "../../support/headers.js";
import { drawnBesideAButton } from "../../support/buttons.js";
import { unmarked } from "../../support/languages.js";

const signIn = "/account/sign-in";
const dialog = "section.dialog";

const open = async (world: WebWorld, goBack?: string): Promise<void> => {
  const where =
    goBack === undefined
      ? `${world.baseUrl!}${signIn}`
      : `${world.baseUrl!}${signIn}?return=${encodeURIComponent(goBack)}`;
  await world.browserPage.goto(where);
};

// Opening the page ---------------------------------------------------------------

// The scenarios' browser has scripting switched off unless a step asks for it
// back, so this is the same opening; it is said all the same, because what the
// scenario is about is that the page works without it.
When(
  "the sign in page is opened with scripting off",
  async function (this: WebWorld) {
    await open(this);
  },
);

Given(
  "the sign in page is open, to go back to {string}",
  async function (this: WebWorld, goBack: string) {
    await open(this, goBack);
  },
);

// A control character cannot be written in a scenario's words, so the scenario
// says what it is and the step puts it in: browsers strip them from an address
// before reading it, which is the whole of why they are refused.
Given(
  "the sign in page is open, to go back to a slash, a tab, and {string}",
  async function (this: WebWorld, rest: string) {
    await open(this, `/\t${rest}`);
  },
);

Given(
  "the sign in page is open, to go back to a slash, a line break, and {string}",
  async function (this: WebWorld, rest: string) {
    await open(this, `/\n${rest}`);
  },
);

Given(
  "the sign in page is open, to go back to {string}, a tab, and {string}",
  async function (this: WebWorld, path: string, rest: string) {
    await open(this, `${path}\t${rest}`);
  },
);

// Another browser context, with a header saying the request was forwarded from
// somewhere else, which the scenarios' application is told to believe.
Given(
  "the sign in page is open from another IP address",
  async function (this: WebWorld) {
    await telling(this, "x-forwarded-for", "198.51.100.7");
    await open(this);
  },
);

// Where the reader ended up -----------------------------------------------------------

Then(
  "the reader is taken to {string}",
  function (this: WebWorld, path: string) {
    assert.equal(new URL(this.browserPage.url()).pathname, path);
  },
);

const forgotPasswordPage = 'a[href="/account/forgot-password"]';
const forgotPasswordButton = `${dialog} .dialog-buttons ${forgotPasswordPage}`;
const submitButton = `${dialog} .dialog-buttons button[type="submit"]`;

Then(
  "the dialog's buttons include one to the forgot password page",
  async function (this: WebWorld) {
    const classes = await this.browserPage
      .locator(forgotPasswordButton)
      .getAttribute("class");
    assert.match(classes ?? "", /\bbutton\b/, "It is not drawn as a button.");
  },
);

Then(
  "the forgot password button says {string}",
  async function (this: WebWorld, said: string) {
    const shown = await this.browserPage
      .locator(forgotPasswordButton)
      .innerText();
    assert.equal(unmarked(shown).trim(), said);
  },
);

Then(
  "the forgot password button looks like a button other than the submit button",
  async function (this: WebWorld) {
    const drawn = await drawnBesideAButton(this, forgotPasswordButton);
    assert.ok(drawn !== null, "There is no forgot password button.");
    assert.deepEqual(drawn.it, drawn.aButton);
  },
);

When("the forgot password button is pressed", async function (this: WebWorld) {
  const arrived = this.browserPage.waitForEvent("load");
  await this.browserPage.click(forgotPasswordButton);
  await arrived;
});

const registerPage = 'a[href="/account/register"]';
const registerButton = `${dialog} .dialog-buttons ${registerPage}`;
const dialogButtons = `${dialog} .dialog-buttons :is(a, button)`;

// Once, so that a link left beneath the form beside the button would show.
Then(
  "the page links to the register page once",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage.locator(`main ${registerPage}`).count(),
      1,
    );
  },
);

Then(
  "the dialog's buttons include one to the register page",
  async function (this: WebWorld) {
    const classes = await this.browserPage
      .locator(registerButton)
      .getAttribute("class");
    assert.match(classes ?? "", /\bbutton\b/, "It is not drawn as a button.");
  },
);

Then(
  "the register button says {string}",
  async function (this: WebWorld, said: string) {
    const shown = await this.browserPage.locator(registerButton).innerText();
    assert.equal(unmarked(shown).trim(), said);
  },
);

Then(
  "the register button looks like a button other than the submit button",
  async function (this: WebWorld) {
    const drawn = await drawnBesideAButton(this, registerButton);
    assert.ok(drawn !== null, "There is no register button.");
    assert.deepEqual(drawn.it, drawn.aButton);
  },
);

// The register page asks for scripting, and sends a reader without it away to
// be told so; a scenario that goes on to it from here has it switched on.
Given(
  "the sign in page is open with scripting on",
  async function (this: WebWorld) {
    await withScripting(this);
    await open(this);
  },
);

When("the register button is pressed", async function (this: WebWorld) {
  const arrived = this.browserPage.waitForEvent("load");
  await this.browserPage.click(registerButton);
  await arrived;
});

// Stacked: read from the top, in the order the markup gives them, which is the
// order they are read out and tabbed through in.

const inOrder = async (world: WebWorld): Promise<string[]> => {
  const found: string[] = [];
  for (const button of await world.browserPage.locator(dialogButtons).all()) {
    found.push(
      (await button.getAttribute("type")) === "submit"
        ? "submit"
        : ((await button.getAttribute("href")) ?? ""),
    );
  }
  return found;
};

const boxOf = async (world: WebWorld, selector: string) => {
  const box = await world.browserPage.locator(selector).boundingBox();
  assert.ok(box !== null, `Nothing on the page matches ${selector}.`);
  return box;
};

Then(
  "the forgot password button comes after the submit button",
  async function (this: WebWorld) {
    const order = await inOrder(this);
    const submit = order.indexOf("submit");
    const forgot = order.indexOf("/account/forgot-password");
    assert.ok(
      submit >= 0 && forgot >= 0,
      `The buttons are ${order.join(", ")}.`,
    );
    assert.ok(forgot > submit, `The buttons are ${order.join(", ")}.`);
  },
);

Then(
  "the register button is the last of the dialog's buttons",
  async function (this: WebWorld) {
    assert.equal((await inOrder(this)).at(-1), "/account/register");
  },
);

Then(
  "the forgot password button is beneath the submit button",
  async function (this: WebWorld) {
    const submit = await boxOf(this, submitButton);
    const forgot = await boxOf(this, forgotPasswordButton);
    assert.ok(
      forgot.y >= submit.y + submit.height - 0.5,
      "The forgot password button does not start beneath the submit button.",
    );
  },
);

Then(
  "the register button is beneath the forgot password button",
  async function (this: WebWorld) {
    const forgot = await boxOf(this, forgotPasswordButton);
    const register = await boxOf(this, registerButton);
    assert.ok(
      register.y >= forgot.y + forgot.height - 0.5,
      "The register button does not start beneath the forgot password button.",
    );
  },
);

Then(
  "the dialog says {string}",
  async function (this: WebWorld, words: string) {
    const said = await this.browserPage
      .locator(".dialog-problems")
      .textContent();
    assert.equal(unmarked(said ?? "").trim(), words);
  },
);
