// A reader at the sign in page, in a real browser.
//
// Signing in is done by filling the form in and pressing its button, as a
// reader does, so that what these scenarios prove is that the page works and
// not that the operation behind it does — which is proved with the operation.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";

import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import { applicationFor } from "../../support/browser.js";
import { clockFor } from "../../support/clock.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const signIn = "/account/sign-in";
const dialog = "section.dialog";

const nowIn = (world: SpecWorld): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(clockFor(world).now.getTime()));

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const open = async (world: SpecWorld, goBack?: string): Promise<void> => {
  const where =
    goBack === undefined
      ? `${world.baseUrl!}${signIn}`
      : `${world.baseUrl!}${signIn}?return=${encodeURIComponent(goBack)}`;
  await world.browserPage.goto(where);
};

// Opening the page ---------------------------------------------------------------

Given("the sign in page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the sign in page is opened", async function (this: SpecWorld) {
  await open(this);
});

// The scenarios' browser has scripting switched off unless a step asks for it
// back, so this is the same opening; it is said all the same, because what the
// scenario is about is that the page works without it.
When(
  "the sign in page is opened with scripting off",
  async function (this: SpecWorld) {
    await open(this);
  },
);

Given(
  "the sign in page is open, to go back to {string}",
  async function (this: SpecWorld, goBack: string) {
    await open(this, goBack);
  },
);

// A control character cannot be written in a scenario's words, so the scenario
// says what it is and the step puts it in: browsers strip them from an address
// before reading it, which is the whole of why they are refused.
Given(
  "the sign in page is open, to go back to a slash, a tab, and {string}",
  async function (this: SpecWorld, rest: string) {
    await open(this, `/\t${rest}`);
  },
);

Given(
  "the sign in page is open, to go back to a slash, a line break, and {string}",
  async function (this: SpecWorld, rest: string) {
    await open(this, `/\n${rest}`);
  },
);

Given(
  "the sign in page is open, to go back to {string}, a tab, and {string}",
  async function (this: SpecWorld, path: string, rest: string) {
    await open(this, `${path}\t${rest}`);
  },
);

// Another browser context, with a header saying the request was forwarded from
// somewhere else, which the scenarios' application is told to believe.
Given(
  "the sign in page is open from another IP address",
  async function (this: SpecWorld) {
    const context = this.browserContext;
    assert.ok(context !== undefined, "This scenario has no browser.");
    await context.setExtraHTTPHeaders({ "x-forwarded-for": "198.51.100.7" });
    await open(this);
  },
);

// Signing in ---------------------------------------------------------------------

const fillIn = async (
  world: SpecWorld,
  address: string,
  password: string,
): Promise<void> => {
  // A scenario that says nothing about opening the page is signing in from it
  // all the same: there is nowhere else to sign in from.
  if (new URL(world.browserPage.url()).pathname !== signIn) await open(world);
  await world.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  await world.browserPage.fill(`${dialog} input[name="password"]`, password);
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When(
  "the reader signs in as {string} with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    await fillIn(this, address, password);
  },
);

Given(
  "the reader has signed in as {string} with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    await open(this);
    await fillIn(this, address, password);
  },
);

// What has failed before ------------------------------------------------------------

// Written where the page counts them, at a few minutes ago so that they are
// inside the hour whatever moment the scenario is at.
const failuresFor = async (
  world: SpecWorld,
  emailAddress: string,
  ipAddress: string,
  times: number,
): Promise<void> => {
  const at = new Date(nowIn(world).toDate().getTime() - 5 * 60 * 1000);
  for (let each = 0; each < times; each++) {
    await world.database.query(
      `insert into failed_sign_ins (email_address, ip_address, failed_at)
       values ($1, $2, $3)`,
      [emailAddress, ipAddress, at],
    );
  }
};

Given(
  "signing in as {string} has failed {int} times in the last hour",
  async function (this: SpecWorld, address: string, times: number) {
    await failuresFor(this, EmailAddress.from(address).comparable, "", times);
  },
);

Given(
  "this IP address has failed to sign in {int} times in the last hour",
  async function (this: SpecWorld, times: number) {
    await failuresFor(this, "", "127.0.0.1", times);
  },
);

Then(
  "signing in as {string} has been counted {int} time(s)",
  async function (this: SpecWorld, address: string, times: number) {
    const { rows } = await this.database.query<{ counted: string }>(
      `select count(*) as counted from failed_sign_ins where email_address = $1`,
      [EmailAddress.from(address).comparable],
    );
    assert.equal(Number(rows[0]?.counted ?? 0), times);
  },
);

// Where the reader ended up -----------------------------------------------------------

Then("the sign in page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, signIn);
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, words("signIn.title"));
});

Then(
  "the reader is taken to {string}",
  function (this: SpecWorld, path: string) {
    assert.equal(new URL(this.browserPage.url()).pathname, path);
  },
);

Then(
  "the page links to the forgot password page",
  async function (this: SpecWorld) {
    assert.ok(
      (await this.browserPage
        .locator('main a[href="/account/forgot-password"]')
        .count()) > 0,
      "Nothing points to the forgot password page.",
    );
  },
);

Then("the page links to the register page", async function (this: SpecWorld) {
  assert.ok(
    (await this.browserPage
      .locator('main a[href="/account/register"]')
      .count()) > 0,
    "Nothing points to the register page.",
  );
});

Then(
  "the dialog says the message for {string}",
  async function (this: SpecWorld, code: string) {
    const said = await this.browserPage
      .locator(".dialog-problems")
      .textContent();
    assert.equal(unmarked(said ?? "").trim(), words(code));
  },
);

// Said by more than one page: this one says it above its fields, and the new
// confirmation link page says it as the whole of what it has to say.
Then("the reader is told to try again later", async function (this: SpecWorld) {
  const content = unmarked(
    (await this.browserPage.locator("main").textContent()) ?? "",
  );
  const said = [
    words("signIn.tryAgainLater"),
    words("newConfirmationLink.tooMany.explanation"),
  ];
  assert.ok(
    said.some((each) => content.includes(each)),
    "No page says to try again later.",
  );
});

// Who is signed in ----------------------------------------------------------------------

/** The account the browser's session cookie signs in to, if any. */
export const signedInAccount = async (
  world: SpecWorld,
  context = world.browserContext,
): Promise<string | undefined> => {
  assert.ok(context !== undefined, "This scenario has no browser.");
  const cookie = (await context.cookies()).find(
    (each) => each.name === "session",
  );
  if (cookie === undefined) return undefined;
  const { rows } = await world.database.query<{ account_id: string }>(
    `select account_id from sessions where id_hash = $1`,
    [createHash("sha256").update(cookie.value).digest("base64url")],
  );
  return rows[0]?.account_id;
};

/** The account the read model holds for `address`. */
export const accountIdFor = async (
  world: SpecWorld,
  address: string,
): Promise<string> => {
  const application = applicationFor(world);
  const found = await application.unitOfWork.inTransaction(() =>
    application.accountsByEmailAddress.find(EmailAddress.from(address)),
  );
  assert.ok(found !== undefined, `There is no account for ${address}.`);
  return found.value;
};

/**
 * Whether the page the browser is on was drawn for somebody signed in. It is
 * what the site says rather than what the table holds: a session whose row is
 * still there but too old to use is a reader who is signed out, and the site
 * is the only thing that knows which.
 */
// By what the menu offers: the way out is there for a reader who is signed in,
// and the ways in for one who is not. The person in the summary is drawn for
// everybody, so it says nothing about who is reading.
const theSiteSaysSignedIn = async (world: SpecWorld): Promise<boolean> =>
  (await world.browserPage
    .locator('details.account-menu form[action="/account/sign-out"]')
    .count()) > 0;

Then(
  "the reader is signed in to the account for {string}",
  async function (this: SpecWorld, address: string) {
    assert.ok(await theSiteSaysSignedIn(this), "The site says nobody is.");
    assert.equal(
      await signedInAccount(this),
      await accountIdFor(this, address),
    );
  },
);

Then("the reader is signed out", async function (this: SpecWorld) {
  assert.equal(
    await theSiteSaysSignedIn(this),
    false,
    "The site says somebody is signed in.",
  );
});
