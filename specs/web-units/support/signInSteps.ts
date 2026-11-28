// A reader at the sign in page, in a real browser.
//
// Signing in is done by filling the form in and pressing its button, as a
// reader does, so that what these scenarios prove is that the page works and
// not that the operation behind it does — which is proved with the operation.
// Having signed in, as what a scenario about something else starts from, is
// the exception, and says why where it is done.
import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";

import { SignIn } from "../../../src/application/operations/accounts/SignIn.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "./browser.js";
import { clockFor } from "./clock.js";
import { holdSessionOf } from "./reader.js";

const signIn = "/account/sign-in";

const nowIn = (world: SpecWorld): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(clockFor(world).now.getTime()));

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

// Not through the form. Over a thousand scenarios start signed in, and going
// through the form cost each of them two pages and a post — 666 milliseconds
// on average, and a sixth of all the time the suite spent in its steps — to
// prove again what the scenarios above already prove. The rest of signing in
// is done as the form's own handler does it: the same command, so the password
// is checked, the signing in recorded on the account, and an old site's hash
// made again today's way; then a session, kept in the same place, with its id
// in the same cookie.
//
// The reader is not taken to where the form would have sent them. That was
// done at first, so that a step acting on the page in front of it found the
// same page, and it was about 410 milliseconds in each scenario, for a page the
// next step nearly always left at once by opening one of its own. A scenario
// that wants a page opens it: the browser is left on a blank page, so a step
// that acts on the page in front of it, or posts from it, has to open one first,
// as the step that signs out does.
Given(
  "the reader has signed in as {string} with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    const application = applicationFor(this);
    const at = nowIn(this);
    const account = await application.mediator.send(
      new SignIn(address, password, at),
    );
    await holdSessionOf(this, account);
  },
);

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
