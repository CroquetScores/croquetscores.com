import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Response } from "playwright";

import { call } from "../../support/control.js";
import { loggedSince, markTheLog, siteTold } from "../../support/site.js";
import { passes } from "../../support/time.js";
import {
  boxOf,
  callback,
  lineIsBeneathTheOffer,
  lineSaying,
  linesSaying,
  messageIsAboveTheOffer,
  offerCarriesGooglesIcon,
  offerCount,
  offerIsAboveTheEmailAddressField,
  offerIsAButton,
  offerIsAsWideAsTheEmailAddressField,
  offerIsBeneathTheTitleBar,
  offerIsInTheDialog,
  offerLooksLikeAButton,
  pressTheOffer,
  waysBackFollowed,
} from "../../support/googleOffer.js";
import {
  aCodeNobodyWasSentFor,
  googleCredentialsForScenarios,
  misbehave,
} from "../../support/googleStandIn.js";
import { wordsFor } from "../../support/words.js";

// What the site keeps the way back for, as it says so itself (src/web/auth/google.ts).
const PENDING_SECONDS = 10 * 60;
// The numbers the log writes information and a warning as.
const INFORMATION = 30;
const WARNING = 40;
import type { WebWorld } from "../../support/world.js";

const offer = 'a[href="/auth/google"]';

// Not the form's own box, which agrees to the terms for registering by email
// address; this one belongs to the offer (google.feature).
const boxBeneathTheOffer =
  'section.dialog input[type="checkbox"][name="termsOfUseForGoogle"]';
const formsBox = 'section.dialog input[type="checkbox"][name="termsOfUse"]';

const dialog = "section.dialog";
const emailAddressField = `${dialog} label.field-box[for="field-emailAddress"]`;

Given(
  "a site that has not been given Google's credentials",
  async function (this: WebWorld) {
    this.baseUrl = (
      await siteTold({ GOOGLE_CLIENT_ID: "", GOOGLE_CLIENT_SECRET: "" })
    ).baseUrl;
  },
);

Then(
  "the page offers registering with Google",
  async function (this: WebWorld) {
    assert.equal(await offerCount(this, offer), 1);
  },
);

Then(
  "the page does not offer registering with Google",
  async function (this: WebWorld) {
    assert.equal(await offerCount(this, offer), 0);
  },
);

Then(
  "the offer to register with Google is a button",
  async function (this: WebWorld) {
    await offerIsAButton(this, offer);
  },
);

Then(
  "the offer to register with Google looks like a button other than the submit button",
  async function (this: WebWorld) {
    await offerLooksLikeAButton(this, offer);
  },
);

Then(
  "the offer to register with Google carries Google's icon",
  async function (this: WebWorld) {
    await offerCarriesGooglesIcon(this, offer);
  },
);

Then(
  "the offer to register with Google is in the dialog",
  async function (this: WebWorld) {
    await offerIsInTheDialog(this, offer);
  },
);

Then(
  "the offer to register with Google is beneath the dialog's title bar",
  async function (this: WebWorld) {
    await offerIsBeneathTheTitleBar(this, offer);
  },
);

Then(
  "the offer to register with Google is above the email address field",
  async function (this: WebWorld) {
    await offerIsAboveTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to register with Google is as wide as the email address field",
  async function (this: WebWorld) {
    await offerIsAsWideAsTheEmailAddressField(this, offer);
  },
);

Then(
  "the message for {string} is above the offer to register with Google",
  async function (this: WebWorld, code: string) {
    await messageIsAboveTheOffer(this, code, offer);
  },
);

Then(
  "the line saying {string} is beneath the offer to register with Google",
  async function (this: WebWorld, said: string) {
    await lineIsBeneathTheOffer(this, said, offer);
  },
);

// Said of whichever offer the page makes, since what the line is measured
// against is the field and the dialog, and not the offer.

Then(
  "the line saying {string} is above the email address field",
  async function (this: WebWorld, said: string) {
    const line = await lineSaying(this, said);
    const field = await boxOf(this, emailAddressField);
    assert.ok(
      line.y + line.height <= field.y + 0.5,
      `${said} does not end above the email address field.`,
    );
  },
);

Then(
  "the line saying {string} is centred in the dialog",
  async function (this: WebWorld, said: string) {
    const line = await lineSaying(this, said);
    const shape = await boxOf(this, dialog);
    const left = line.x - shape.x;
    const right = shape.x + shape.width - (line.x + line.width);
    assert.ok(
      Math.abs(left - right) <= 1,
      `${said} has ${Math.round(left)} pixels to its left and ${Math.round(right)} to its right.`,
    );
  },
);

Then(
  "the dialog has no line saying {string}",
  async function (this: WebWorld, said: string) {
    assert.deepEqual(await linesSaying(this, said), []);
  },
);

// The scenario's own stand-in, which its application was pointed at when the
// scenario began.
Given("Google will take a code more than once", function (this: WebWorld) {
  misbehave({ takesCodesAgain: true });
});

// Pressed as a reader who means to register presses it, having agreed to the
// terms of use first (google.feature).
const registerWithGoogle = async function (this: WebWorld): Promise<void> {
  await this.browserPage.check(boxBeneathTheOffer);
  await pressTheOffer(this, offer);
};

When("the reader registers with Google", registerWithGoogle);
Given("the reader has registered with Google", registerWithGoogle);

When(
  "the reader registers with Google having agreed to the terms of use only beneath the email address field",
  async function (this: WebWorld) {
    await this.browserPage.check(formsBox);
    await pressTheOffer(this, offer);
  },
);

Then(
  "the dialog asks the reader to agree to the terms of use beneath the offer to register with Google",
  async function (this: WebWorld) {
    const found = await this.browserPage.evaluate<{
      label: string;
      href: string | null;
      below: boolean;
    } | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(boxBeneathTheOffer)});
      const offer = document.querySelector(${JSON.stringify(offer)});
      const label = box?.labels?.[0];
      if (!box || !offer || !label) return null;
      return {
        label: label.textContent.trim(),
        href: label.querySelector("a")?.getAttribute("href") ?? null,
        below: box.getBoundingClientRect().top >= offer.getBoundingClientRect().bottom - 0.5,
      };
    })()`);
    assert.ok(found !== null, "The offer has no box beneath it.");
    assert.equal(found.label, wordsFor("termsOfUse.agree"));
    assert.ok(found.below, "The box is not beneath the offer.");
  },
);

Then(
  "the box beneath the offer to register with Google links to the terms of use for those who write",
  async function (this: WebWorld) {
    const href = await this.browserPage.evaluate<string | null>(`(() =>
      document
        .querySelector(${JSON.stringify(boxBeneathTheOffer)})
        ?.labels?.[0]?.querySelector("a")
        ?.getAttribute("href") ?? null)()`);
    assert.equal(href, "/admin/terms-of-use");
  },
);

Then(
  "the box beneath the offer to register with Google is above the line saying {string}",
  async function (this: WebWorld, said: string) {
    const line = await lineSaying(this, said);
    const box = await boxOf(this, boxBeneathTheOffer);
    assert.ok(
      box.y + box.height <= line.y + 0.5,
      `The box does not end above ${said}.`,
    );
  },
);

Then(
  "the dialog has one box agreeing to the terms of use",
  async function (this: WebWorld) {
    assert.equal(
      await this.browserPage
        .locator(`${dialog} input[type="checkbox"]`)
        .count(),
      1,
    );
  },
);

Then(
  "the box beneath the offer to register with Google says {string}",
  async function (this: WebWorld, words: string) {
    const said = await this.browserPage.evaluate<string | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(boxBeneathTheOffer)});
      const id = box?.getAttribute("aria-describedby");
      const message = id ? document.getElementById(id) : null;
      return message ? message.textContent.trim() : null;
    })()`);
    assert.equal(said, words);
  },
);

When(
  "the reader registers with Google without agreeing to the terms of use",
  async function (this: WebWorld) {
    await pressTheOffer(this, offer);
  },
);

When(
  "the reader follows the same way back from Google again",
  async function (this: WebWorld) {
    const followed = waysBackFollowed(this).at(-1);
    assert.ok(followed !== undefined, "No way back from Google was followed.");
    await this.browserPage.goto(followed);
  },
);

// What the reader last came back with, so that a scenario can say the log does
// not hold it, and what the site answered.
const cameBackWith = new WeakMap<
  WebWorld,
  { state: string; code: string; answer: Response | null }
>();

// A code Google would take, for the reader the scenario has Google say. The
// state is the one the site gave on the way to Google where it was sent there,
// and one made up elsewhere where it was not.
const arriveBack = async (world: WebWorld, state: string): Promise<void> => {
  const code = aCodeNobodyWasSentFor();
  cameBackAt.set(world, markTheLog());
  const answer = await world.browserPage.goto(
    `${world.baseUrl!}${callback}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
  );
  cameBackWith.set(world, { state, code, answer });
};

// Sent back here by a browser this site never sent to Google: what a page
// elsewhere would send a reader's browser along.
When(
  "the reader arrives back from Google without having been sent there",
  async function (this: WebWorld) {
    await arriveBack(this, "made-up-elsewhere");
  },
);

When(
  "the reader arrives back from Google with a cookie the site did not make",
  async function (this: WebWorld) {
    // Where the site's own is kept, and named as it names it, but not signed
    // by it: what comes of a cookie made by somebody else, or by the site
    // before its secret changed.
    const address = new URL(this.baseUrl!);
    await this.browserPage.context().addCookies([
      {
        name: "google-sign-in",
        value: "not-signed-by-the-site",
        domain: address.hostname,
        path: "/auth/google",
        secure: true,
      },
    ]);
    await arriveBack(this, "made-up-elsewhere");
  },
);

When("the reader arrives back from Google", async function (this: WebWorld) {
  await arriveBack(this, stateGiven(this));
});

When(
  "the reader arrives back from Google carrying another state",
  async function (this: WebWorld) {
    await arriveBack(this, "somebody-elses");
  },
);

// Longer than the cookie is kept for, which the site judges by its own clock
// and not the browser's, so that a scenario need not wait for it.
Given(
  "the reader takes longer than the site allows",
  async function (this: WebWorld) {
    // A minute past what the site allows, whatever that is.
    await passes((PENDING_SECONDS + 60) * 1000);
  },
);

// Where the site sent the reader to ask Google, kept to be read: the address it
// told Google to send them back to is in it. Followed no further than the site's
// own answer, because the address it names is not one the scenarios' browser
// can reach. Followed as the register page sends a reader along it once they
// have ticked the box agreeing to the terms of use, since one who has not is
// sent back rather than to Google.
const sentTo = new WeakMap<WebWorld, URL>();

const followTheWayToGoogle = async function (this: WebWorld): Promise<void> {
  const answer = await this.browserPage.request.get(
    `${this.baseUrl!}/auth/google?termsOfUse=on`,
    { headers: this.extraHeaders, maxRedirects: 0, failOnStatusCode: false },
  );
  const location = answer.headers()["location"];
  assert.ok(location !== undefined, `The site answered ${answer.status()}.`);
  sentTo.set(this, new URL(location));
};

When("the way to Google is followed", followTheWayToGoogle);
Given("the site has sent the reader to Google", followTheWayToGoogle);

// The cookie for the way back, as the browser has it, or nothing.
const cookieKept = async (world: WebWorld) =>
  (await world.browserPage.context().cookies()).find(
    (each) => each.name === "google-sign-in",
  );

// How many seconds from now the browser keeps the cookie for.
const secondsKept = async (world: WebWorld): Promise<number> => {
  const cookie = await cookieKept(world);
  assert.ok(
    cookie !== undefined,
    "The browser has no cookie for the way back.",
  );
  return cookie.expires - Date.now() / 1000;
};

Then(
  "the browser keeps the cookie for the way back for no longer than an hour",
  async function (this: WebWorld) {
    const kept = await secondsKept(this);
    assert.ok(
      kept <= 60 * 60,
      `The browser keeps it for ${String(Math.round(kept))} seconds.`,
    );
  },
);

Then(
  "the browser no longer has the cookie for the way back",
  async function (this: WebWorld) {
    assert.equal(await cookieKept(this), undefined);
  },
);

// Read from the browser, whose clock is the real one, because it is the browser
// that lets the cookie go: moving the site's clock on, as a scenario of a
// reader taking too long does, leaves the cookie where it was.
Then(
  "the browser keeps the cookie for the way back for longer than the site allows",
  async function (this: WebWorld) {
    const kept = await secondsKept(this);
    assert.ok(
      kept > PENDING_SECONDS,
      `The browser keeps it for ${String(Math.round(kept))} seconds.`,
    );
  },
);

// The state the site gave to be brought back.
const stateGiven = (world: WebWorld): string => {
  const state = sentTo.get(world)?.searchParams.get("state");
  assert.ok(state, "The reader was not sent to Google.");
  return state;
};

Then(
  "Google is told to send the reader back to {string}",
  function (this: WebWorld, address: string) {
    const url = sentTo.get(this);
    assert.ok(url !== undefined, "The reader was not sent to Google.");
    assert.equal(url.searchParams.get("redirect_uri"), address);
  },
);

// What the log says about a way back that was refused ---------------------------

interface LoggedLine {
  readonly level?: number;
  readonly err?: { code?: string; reason?: string };
  readonly req?: { url?: string };
}

const linesLogged = (world: WebWorld): LoggedLine[] =>
  loggedSince(cameBackAt.get(world) ?? 0).map(
    (line) => JSON.parse(line) as LoggedLine,
  );

// The lines that are a way back refused, as the site wrote them, at whatever
// level it wrote them.
const refusalsLogged = (world: WebWorld): LoggedLine[] =>
  linesLogged(world).filter(
    (line) => line.err?.code === "Google.NotSentFromHere",
  );

// The one refusal a scenario expects, which a step about it reads.
const theRefusal = (world: WebWorld): LoggedLine => {
  const refusals = refusalsLogged(world);
  assert.equal(refusals.length, 1, `${refusals.length} refusals are logged.`);
  return refusals[0]!;
};

Then(
  "the log says the way back was refused for {string}",
  function (this: WebWorld, reason: string) {
    assert.equal(theRefusal(this).err?.reason, reason);
  },
);

Then(
  "the refusal is written in the log as information",
  function (this: WebWorld) {
    assert.equal(theRefusal(this).level, INFORMATION);
  },
);

Then(
  "the refusal is written in the log as a warning",
  function (this: WebWorld) {
    assert.equal(theRefusal(this).level, WARNING);
  },
);

// Searched for in every line from information up, the line each request is
// logged with among them, which is where the address the reader came back to
// is written.
Then(
  "the log does not hold the state the reader came back with",
  function (this: WebWorld) {
    const back = cameBackWith.get(this);
    assert.ok(back !== undefined, "The reader did not come back.");
    assert.ok(
      !loggedSince(cameBackAt.get(this) ?? 0)
        .join("")
        .includes(back.state),
    );
  },
);

Then("the log does not hold the code Google gave", function (this: WebWorld) {
  const back = cameBackWith.get(this);
  assert.ok(back !== undefined, "The reader did not come back.");
  assert.ok(
    !loggedSince(cameBackAt.get(this) ?? 0)
      .join("")
      .includes(back.code),
  );
});

// So that taking the state and the code out is not done by taking out the
// whole address, which would pass the two steps above.
Then(
  "the log says the way back from Google was asked for",
  function (this: WebWorld) {
    assert.ok(
      linesLogged(this).some((line) =>
        line.req?.url?.startsWith("/auth/google/callback"),
      ),
      "No request for the way back is logged.",
    );
  },
);

Then(
  "the way back is answered as a request that could not be dealt with",
  function (this: WebWorld) {
    assert.equal(cameBackWith.get(this)?.answer?.status(), 400);
  },
);

Then(
  "the answer to the way back does not name {string}",
  async function (this: WebWorld, code: string) {
    const body = await cameBackWith.get(this)?.answer?.text();
    assert.ok(body !== undefined, "The reader did not come back.");
    assert.ok(!body.includes(code), `The answer names ${code}.`);
  },
);

// Where the log stood when the reader came back, so that what is read of it is
// what came of that.
const cameBackAt = new WeakMap<WebWorld, number>();

Given(
  "a site that has been given Google's credentials",
  async function (this: WebWorld) {
    this.baseUrl = (
      await siteTold({
        GOOGLE_CLIENT_ID: googleCredentialsForScenarios.clientId,
        GOOGLE_CLIENT_SECRET: googleCredentialsForScenarios.clientSecret,
      })
    ).baseUrl;
  },
);

// An account that signing in with Google has linked, as it would have left it.
Given(
  "the account for {string} was linked to the Google account {string}",
  async function (this: WebWorld, address: string, subject: string) {
    const answer = await call("POST", "/accounts/google", {
      emailAddress: address,
      subject,
    });
    assert.equal(answer.status, 200, await answer.text());
  },
);
