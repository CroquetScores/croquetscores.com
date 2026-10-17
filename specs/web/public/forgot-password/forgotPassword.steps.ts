// A reader who has forgotten their password, in a real browser: asking for a
// way back in, following the link that arrives, and choosing a new password.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";

import { ResetPassword } from "../../../../src/application/operations/accounts/ResetPassword.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { Website } from "../../../../src/domain/common/Website.js";
import type { SpecWorld } from "../../../support/world.js";
import { applicationFor } from "../../support/browser.js";
import { clockFor } from "../../support/clock.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const forgotPassword = "/account/forgot-password";
const setNewPassword = "/account/set-new-password";
const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const nowIn = (world: SpecWorld): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(clockFor(world).now.getTime()));

// Opening it ------------------------------------------------------------------------

const open = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${forgotPassword}`);
};

Given("the forgot password page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the forgot password page is opened", async function (this: SpecWorld) {
  await open(this);
});

// Another browser context, with a header saying the request was forwarded from
// somewhere else, which the scenarios' application is told to believe.
Given(
  "the forgot password page is open from another IP address",
  async function (this: SpecWorld) {
    const context = this.browserContext;
    assert.ok(context !== undefined, "This scenario has no browser.");
    await context.setExtraHTTPHeaders({ "x-forwarded-for": "198.51.100.7" });
    await open(this);
  },
);

Then("the forgot password page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, forgotPassword);
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, words("forgotPassword.title"));
});

// Asking ----------------------------------------------------------------------------

const ask = async (world: SpecWorld, address: string): Promise<void> => {
  if (new URL(world.browserPage.url()).pathname !== forgotPassword) {
    await open(world);
  }
  await world.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When(
  "the reader asks for a way back in for {string}",
  async function (this: SpecWorld, address: string) {
    asked.set(this, address);
    await ask(this, address);
  },
);

const asked = new WeakMap<SpecWorld, string>();

// Back to the form the reader filled in, as the browser kept it, and pressed
// again: the form it sends is the one that was shown, and carries what it did.
When("the reader goes back and asks again", async function (this: SpecWorld) {
  const address = asked.get(this);
  assert.ok(address !== undefined, "Nothing has been asked for.");
  await this.browserPage.goBack();
  await this.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  await this.browserPage.click(`${dialog} button[type="submit"]`);
  await this.browserPage.waitForLoadState();
});

// Asked for as something in front of the site asks: the host the reader typed
// is forwarded from the proxy the site trusts, 127.0.0.1. Said to come from the
// site itself, as a form posted from its own page is, so that what the
// scenario is about is the website and not the guard that turns away other
// sites.
const askedWithHost = (world: SpecWorld, address: string, host: string) =>
  world.browserPage.request.post(`${world.baseUrl!}${forgotPassword}`, {
    headers: { "x-forwarded-host": host, "sec-fetch-site": "same-origin" },
    form: { emailAddress: address },
    failOnStatusCode: false,
  });

When(
  "the reader asks for a way back in for {string}, on the website {string}",
  async function (this: SpecWorld, address: string, host: string) {
    const answer = await askedWithHost(this, address, host);
    assert.ok(answer.ok(), `The asking was answered ${answer.status()}.`);
  },
);

// A host the site does not answer for, as a request can be sent by anybody who
// writes one.
When(
  "the reader asks for a way back in for {string}, with the host {string}",
  async function (this: SpecWorld, address: string, host: string) {
    const answer = await askedWithHost(this, address, host);
    assert.equal(answer.status(), 421);
  },
);

// What has been asked already -------------------------------------------------------

Given(
  "this IP address has asked for a way back in {int} times in the last hour",
  async function (this: SpecWorld, times: number) {
    const at = new Date(clockFor(this).now.getTime() - 5 * 60 * 1000);
    for (let each = 0; each < times; each++) {
      await this.database.query(
        `insert into password_reset_askings (ip_address, asked_at) values ($1, $2)`,
        ["127.0.0.1", at],
      );
    }
  },
);

// A link, asked for the way the page asks and taken out of the email the way a
// reader takes it out of their mail.
Given(
  "a link to set a new password has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    await application.mediator.send(
      new ResetPassword(
        randomUUID(),
        address,
        "en",
        "croquetscores.com",
        nowIn(this),
      ),
    );
    const queued = await application.unitOfWork.inTransaction(() =>
      application.emailQueue.emails(),
    );
    const sent = queued.filter(
      (email) => email.to === address && email.kind === "Email.SetNewPassword",
    );
    const last = sent[sent.length - 1];
    assert.ok(last?.link !== undefined, "No link to set a password was sent.");
    this.linkInHand = last.link;
    this.addressInHand = address;
  },
);

// A link made for confirming an address, followed as though it were one for
// setting a password: what a reader would do by editing the address.
When(
  "the link to confirm the email address is followed as a link to set a new password",
  async function (this: SpecWorld) {
    assert.ok(this.linkInHand !== undefined, "The scenario has no link.");
    const followed = new URL(this.linkInHand);
    await this.browserPage.goto(
      `${this.baseUrl!}${setNewPassword}${followed.search}`,
    );
  },
);

// Setting it ------------------------------------------------------------------------

const typeInto = (world: SpecWorld, field: string, typed: string) =>
  world.browserPage.fill(`${dialog} input[name="${field}"]`, typed);

const send = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

const setThePassword = async (
  world: SpecWorld,
  password: string,
): Promise<void> => {
  await typeInto(world, "password", password);
  await typeInto(world, "passwordConfirmation", password);
  await send(world);
};

// The password set, so that what it was kept as can be asked about.
const set = new WeakMap<SpecWorld, string>();

When(
  "the new password {string} is set",
  async function (this: SpecWorld, password: string) {
    await setThePassword(this, password);
    set.set(this, password);
  },
);

Given(
  "{string} is typed as the new password",
  async function (this: SpecWorld, password: string) {
    await typeInto(this, "password", password);
  },
);

Given(
  "{string} is typed as the confirm password",
  async function (this: SpecWorld, password: string) {
    await typeInto(this, "passwordConfirmation", password);
  },
);

When("the new password is sent", async function (this: SpecWorld) {
  await send(this);
});

// What happened ---------------------------------------------------------------------

Then(
  "the reader is told their password has been changed",
  async function (this: SpecWorld) {
    const content = unmarked(
      (await this.browserPage.locator("main").textContent()) ?? "",
    );
    assert.ok(
      content.includes(words("setNewPassword.changed.explanation")),
      "The page does not say the password has been changed.",
    );
  },
);

const queuedFor = async (world: SpecWorld, address: string) => {
  const application = applicationFor(world);
  const queued = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  return queued.filter((email) => !email.givenUp && email.to === address);
};

const sentOfKind = async (
  world: SpecWorld,
  address: string,
  kind: string,
): Promise<void> => {
  const sent = (await queuedFor(world, address)).filter(
    (email) => email.kind === kind,
  );
  assert.ok(sent.length > 0, `No ${kind} was sent to ${address}.`);
};

Then(
  "{string} is sent a link to set a new password",
  async function (this: SpecWorld, address: string) {
    await sentOfKind(this, address, "Email.SetNewPassword");
  },
);

Then(
  "one link to set a new password has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    const sent = (await queuedFor(this, address)).filter(
      (email) => email.kind === "Email.SetNewPassword",
    );
    assert.equal(sent.length, 1, `${sent.length} links were sent.`);
  },
);

Then(
  "{string} is sent a link to register",
  async function (this: SpecWorld, address: string) {
    await sentOfKind(this, address, "Email.RegisterInstead");
  },
);

Then(
  "{string} is sent the link to confirm the email address",
  async function (this: SpecWorld, address: string) {
    await sentOfKind(this, address, "Email.ConfirmAddressAgain");
  },
);

// On the address of the website, whatever host the request that asked for it
// said it was sent with.
Then(
  "the link sent to {string} is on the address of the website {string}",
  async function (this: SpecWorld, address: string, host: string) {
    const own = Website.addressedTo(host).address;
    // What the asking sent, and not the link registering emailed earlier,
    // which would pass whatever the asking did.
    const sent = (await queuedFor(this, address)).filter(
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
  async function (this: SpecWorld, address: string) {
    const sent = (await queuedFor(this, address)).filter(
      (email) => email.kind !== "Email.ConfirmAddress",
    );
    assert.equal(sent.length, 0, `${sent.length} emails were sent.`);
  },
);

Then(
  "the account for the email address {string} has a password of today's kind",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    const account = await application.unitOfWork.inTransaction(async () => {
      const id = await application.accountsByEmailAddress.find(
        EmailAddress.from(address),
      );
      assert.ok(id !== undefined, `There is no account for ${address}.`);
      return application.accounts.load(id);
    });
    // Asked of the site's own hasher, which knows a hash of today's kind from
    // one brought over by how it checks it: today's needs no making again.
    const password = set.get(this);
    assert.ok(password !== undefined, "No new password has been set.");
    const checked = await application.passwords.check(
      password,
      account?.passwordHash,
    );
    assert.ok(checked.matches, "The new password does not sign in.");
    assert.equal(checked.remake, false);
  },
);
