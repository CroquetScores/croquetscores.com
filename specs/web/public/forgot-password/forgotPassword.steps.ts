// A reader who has forgotten their password, in a real browser: asking for a
// way back in, following the link that arrives, and choosing a new password.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  askForAWayBack,
  checkPasswordOf,
  emailsFor,
  latestLinkTo,
  sayWaysBackWereAsked,
} from "../../support/control.js";
import { telling } from "../../support/headers.js";
import { unmarked } from "../../support/languages.js";
import type { WebWorld } from "../../support/world.js";
import { wordsFor } from "../../support/words.js";

const forgotPassword = "/account/forgot-password";
const setNewPassword = "/account/set-new-password";
const dialog = "section.dialog";

const words = wordsFor;

// Opening it ------------------------------------------------------------------------

const open = async (world: WebWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${forgotPassword}`);
};

Given("the forgot password page is open", async function (this: WebWorld) {
  await open(this);
});

When("the forgot password page is opened", async function (this: WebWorld) {
  await open(this);
});

// Another browser context, with a header saying the request was forwarded from
// somewhere else, which the scenarios' application is told to believe.
Given(
  "the forgot password page is open from another IP address",
  async function (this: WebWorld) {
    await telling(this, "x-forwarded-for", "198.51.100.7");
    await open(this);
  },
);

Then("the forgot password page is shown", async function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, forgotPassword);
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, words("forgotPassword.title"));
});

// Asking ----------------------------------------------------------------------------

// Where each scenario's form was sent from, so that a second asking is the same
// one again.
const drawnWith = new WeakMap<WebWorld, string>();

const ask = async (world: WebWorld, address: string): Promise<void> => {
  if (new URL(world.browserPage.url()).pathname !== forgotPassword) {
    await open(world);
  }
  drawnWith.set(
    world,
    (await world.browserPage
      .locator(`${dialog} form`)
      .getAttribute("action")) ?? forgotPassword,
  );
  await world.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When(
  "the reader asks for a way back in for {string}",
  async function (this: WebWorld, address: string) {
    asked.set(this, address);
    await ask(this, address);
  },
);

const asked = new WeakMap<WebWorld, string>();

// The form the reader filled in sent again as it was drawn, which is what pressing
// it a second time does. Sent from the scenario and not pressed after going back,
// because a browser sent back to the page may draw it again with an id of its own,
// and what is asked is what the site does with the one it was first given.
When("the reader goes back and asks again", async function (this: WebWorld) {
  const address = asked.get(this);
  const action = drawnWith.get(this);
  assert.ok(
    address !== undefined && action !== undefined,
    "Nothing has been asked for.",
  );
  const answer = await this.browserPage.request.post(
    `${this.baseUrl!}${action}`,
    {
      headers: { "sec-fetch-site": "same-origin" },
      form: { emailAddress: address },
      maxRedirects: 0,
      failOnStatusCode: false,
    },
  );
  assert.ok(answer.status() < 500, `It was answered ${answer.status()}.`);
});

// Asked for as something in front of the site asks: the host the reader typed
// is forwarded from the proxy the site trusts, 127.0.0.1. Said to come from the
// site itself, as a form posted from its own page is, so that what the
// scenario is about is the website and not the guard that turns away other
// sites.
const askedWithHost = (world: WebWorld, address: string, host: string) =>
  world.browserPage.request.post(`${world.baseUrl!}${forgotPassword}`, {
    headers: { "x-forwarded-host": host, "sec-fetch-site": "same-origin" },
    form: { emailAddress: address },
    failOnStatusCode: false,
  });

When(
  "the reader asks for a way back in for {string}, on the website {string}",
  async function (this: WebWorld, address: string, host: string) {
    const answer = await askedWithHost(this, address, host);
    assert.ok(answer.ok(), `The asking was answered ${answer.status()}.`);
  },
);

// A host the site does not answer for, as a request can be sent by anybody who
// writes one.
When(
  "the reader asks for a way back in for {string}, with the host {string}",
  async function (this: WebWorld, address: string, host: string) {
    const answer = await askedWithHost(this, address, host);
    assert.equal(answer.status(), 421);
  },
);

// What has been asked already -------------------------------------------------------

Given(
  "this IP address has asked for a way back in {int} times in the last hour",
  async function (this: WebWorld, times: number) {
    // A few minutes ago, so that they are inside the hour whatever moment the
    // scenario is at.
    await sayWaysBackWereAsked("127.0.0.1", times, 5);
  },
);

// A link, asked for the way the page asks and taken out of the email the way a
// reader takes it out of their mail.
Given(
  "a link to set a new password has been sent to {string}",
  async function (this: WebWorld, address: string) {
    await askForAWayBack(address);
    this.linkInHand = await latestLinkTo(address, "Email.SetNewPassword");
    this.addressInHand = address;
  },
);

// A link made for confirming an address, followed as though it were one for
// setting a password: what a reader would do by editing the address.
When(
  "the link to confirm the email address is followed as a link to set a new password",
  async function (this: WebWorld) {
    assert.ok(this.linkInHand !== undefined, "The scenario has no link.");
    const followed = new URL(this.linkInHand);
    await this.browserPage.goto(
      `${this.baseUrl!}${setNewPassword}${followed.search}`,
    );
  },
);

// Setting it ------------------------------------------------------------------------

const typeInto = (world: WebWorld, field: string, typed: string) =>
  world.browserPage.fill(`${dialog} input[name="${field}"]`, typed);

const send = async (world: WebWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

const setThePassword = async (
  world: WebWorld,
  password: string,
): Promise<void> => {
  await typeInto(world, "password", password);
  await typeInto(world, "passwordConfirmation", password);
  await send(world);
};

// The password set, so that what it was kept as can be asked about.
const set = new WeakMap<WebWorld, string>();

When(
  "the new password {string} is set",
  async function (this: WebWorld, password: string) {
    await setThePassword(this, password);
    set.set(this, password);
  },
);

Given(
  "{string} is typed as the new password",
  async function (this: WebWorld, password: string) {
    await typeInto(this, "password", password);
  },
);

Given(
  "{string} is typed as the confirm password",
  async function (this: WebWorld, password: string) {
    await typeInto(this, "passwordConfirmation", password);
  },
);

When("the new password is sent", async function (this: WebWorld) {
  await send(this);
});

// What happened ---------------------------------------------------------------------

Then(
  "the reader is told their password has been changed",
  async function (this: WebWorld) {
    const content = unmarked(
      (await this.browserPage.locator("main").textContent()) ?? "",
    );
    assert.ok(
      content.includes(words("setNewPassword.changed.explanation")),
      "The page does not say the password has been changed.",
    );
  },
);

const queuedFor = async (address: string) =>
  (await emailsFor(address)).filter((email) => !email.givenUp);

const sentOfKind = async (
  world: WebWorld,
  address: string,
  kind: string,
): Promise<void> => {
  const sent = (await queuedFor(address)).filter(
    (email) => email.kind === kind,
  );
  assert.ok(sent.length > 0, `No ${kind} was sent to ${address}.`);
};

Then(
  "{string} is sent a link to set a new password",
  async function (this: WebWorld, address: string) {
    await sentOfKind(this, address, "Email.SetNewPassword");
  },
);

Then(
  "one link to set a new password has been sent to {string}",
  async function (this: WebWorld, address: string) {
    const sent = (await queuedFor(address)).filter(
      (email) => email.kind === "Email.SetNewPassword",
    );
    assert.equal(sent.length, 1, `${sent.length} links were sent.`);
  },
);

Then(
  "{string} is sent a link to register",
  async function (this: WebWorld, address: string) {
    await sentOfKind(this, address, "Email.RegisterInstead");
  },
);

Then(
  "{string} is sent the link to confirm the email address",
  async function (this: WebWorld, address: string) {
    await sentOfKind(this, address, "Email.ConfirmAddressAgain");
  },
);

// On the address of the website, whatever host the request that asked for it
// said it was sent with.
Then(
  "the link sent to {string} is on the address of the website {string}",
  async function (this: WebWorld, address: string, host: string) {
    // The website's address is its host, written the way a browser writes one.
    const own = `https://${host}`;
    // What the asking sent, and not the link registering emailed earlier,
    // which would pass whatever the asking did.
    const sent = (await queuedFor(address)).filter(
      (email) => email.kind !== "Email.ConfirmAddress",
    );
    assert.ok(sent.length > 0, `Nothing was sent to ${address}.`);
    // An email carrying no link of its own — the register-instead one — points
    // at pages by the writer's address, which is the website's by the same
    // rule; one that carries a link carries it on the website's address.
    for (const email of sent.filter((each) => each.link !== undefined)) {
      assert.ok(
        email.link!.startsWith(own),
        `The link is on ${email.link}, not on ${own}.`,
      );
    }
  },
);

Then(
  "nothing is sent to {string} for a way back in",
  async function (this: WebWorld, address: string) {
    const sent = (await queuedFor(address)).filter(
      (email) => email.kind !== "Email.ConfirmAddress",
    );
    assert.equal(sent.length, 0, `${sent.length} emails were sent.`);
  },
);

Then(
  "the account for the email address {string} has a password of today's kind",
  async function (this: WebWorld, address: string) {
    // Asked of the site's own hasher, which knows a hash of today's kind from
    // one brought over by how it checks it: today's needs no making again.
    const password = set.get(this);
    assert.ok(password !== undefined, "No new password has been set.");
    const checked = await checkPasswordOf(address, password);
    assert.ok(checked.matches, "The new password does not sign in.");
    assert.equal(checked.remake, false);
  },
);
