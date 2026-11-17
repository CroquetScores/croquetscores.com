// The set password page, in a real browser: asking for a link to set a
// password on an account with no password, and following the link that
// arrives.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import {
  openAndKeepTheAnswer,
  postAndKeepTheAnswer,
} from "../../support/answers.js";
import { emailsFor } from "../../support/control.js";
import { loggedSince } from "../../support/site.js";
import { unmarked } from "../../support/languages.js";
import { wordsFor } from "../../support/words.js";

const setPassword = "/account/set-password";
const dialog = "section.dialog";

const words = wordsFor;

// Opening it ------------------------------------------------------------------------

const open = async (world: WebWorld): Promise<void> => {
  await openAndKeepTheAnswer(world, setPassword);
};

Given("the set password page is open", async function (this: WebWorld) {
  await open(this);
});

When("the set password page is opened", async function (this: WebWorld) {
  await open(this);
});

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
When(
  "the set password page is opened with scripting off",
  async function (this: WebWorld) {
    await open(this);
  },
);

// Whatever it is posted, since what is posted is not what is being asked
// about: only whether there is a page there to take it.
When("the set password page is posted to", async function (this: WebWorld) {
  await postAndKeepTheAnswer(this, setPassword, {});
});

Then("the set password page is shown", async function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, setPassword);
  const title = unmarked(
    (await this.browserPage.locator(`${dialog} .dialog-title`).textContent()) ??
      "",
  );
  assert.equal(title.trim(), words("setPassword.title"));
});

Then(
  "the page says a link will be sent to {string}",
  async function (this: WebWorld, address: string) {
    const said = await this.browserPage
      .locator(`${dialog} .notice`)
      .textContent();
    assert.ok(
      (said ?? "").includes(address),
      `The page says ${JSON.stringify(said)}.`,
    );
  },
);

// Asking ----------------------------------------------------------------------------

// Where each scenario's form sends what it holds, so that a second asking is the
// same one again.
const drawnWith = new WeakMap<WebWorld, string>();

const ask = async (world: WebWorld): Promise<void> => {
  drawnWith.set(
    world,
    (await world.browserPage
      .locator(`${dialog} form`)
      .getAttribute("action")) ?? "",
  );
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When(
  "the reader asks for a link to set a password",
  async function (this: WebWorld) {
    await ask(this);
  },
);

Given(
  "the reader has asked for a link to set a password",
  async function (this: WebWorld) {
    await ask(this);
  },
);

// The form as it was shown, sent again: what pressing it a second time does, and
// it carries the request id it did. Sent from the scenario and not pressed after
// going back, because a browser sent back to the page may draw it again with an id
// of its own, and what is asked is what the site does with the one it was given.
When(
  "the reader goes back and asks for a link to set a password again",
  async function (this: WebWorld) {
    const action = drawnWith.get(this);
    assert.ok(action !== undefined, "Nothing has been asked for.");
    const answer = await this.browserPage.request.post(
      `${this.baseUrl!}${action}`,
      {
        headers: { "sec-fetch-site": "same-origin" },
        maxRedirects: 0,
        failOnStatusCode: false,
      },
    );
    assert.ok(answer.status() < 500, `It was answered ${answer.status()}.`);
  },
);

// What was sent ---------------------------------------------------------------------

const setPasswordEmailsTo = async (address: string) =>
  (await emailsFor(address)).filter(
    (email) => !email.givenUp && email.kind === "Email.SetPassword",
  );

Then(
  "{string} is sent a link to set a password",
  async function (this: WebWorld, address: string) {
    const sent = await setPasswordEmailsTo(address);
    assert.ok(sent.length > 0, `No link to set a password went to ${address}.`);
  },
);

Then(
  "one link to set a password has been sent to {string}",
  async function (this: WebWorld, address: string) {
    const sent = await setPasswordEmailsTo(address);
    assert.equal(sent.length, 1, `${sent.length} links were sent.`);
  },
);

// Followed at the scenario's own site, where the email's link names the
// site's address.
Given(
  "the link sent to {string} is followed",
  async function (this: WebWorld, address: string) {
    const sent = await setPasswordEmailsTo(address);
    const last = sent[sent.length - 1];
    assert.ok(last?.link !== undefined, "No link to set a password was sent.");
    this.linkInHand = last.link;
    const followed = new URL(last.link);
    await this.browserPage.goto(
      `${this.baseUrl!}${followed.pathname}${followed.search}`,
    );
  },
);

// What the log holds of a link ------------------------------------------------

// The link that was followed, which a step about it reads.
const linkFollowed = (world: WebWorld): URL => {
  assert.ok(world.linkInHand !== undefined, "No link was followed.");
  return new URL(world.linkInHand);
};

// What the log says of each request: the address it was made to.
const addressesLogged = (world: WebWorld): string[] =>
  loggedSince(world.logFrom).flatMap((line) => {
    const url = (JSON.parse(line) as { req?: { url?: string } }).req?.url;
    return url === undefined ? [] : [url];
  });

// The signature on its own, the part after the last full stop, since that is
// what lets whoever holds the link act, and a log that kept only it would hold
// what matters as much as one that kept the whole link.
Then(
  "the log does not hold the link that was followed",
  function (this: WebWorld) {
    const carried = linkFollowed(this).searchParams.get("link") ?? "";
    const signature = carried.slice(carried.lastIndexOf(".") + 1);
    assert.ok(signature !== "", "The link followed carries no signature.");
    assert.ok(
      !loggedSince(this.logFrom).join("").includes(signature),
      "The log holds the link's signature.",
    );
  },
);

// So that the link is not left out by leaving out the whole address, which
// would pass the step above.
Then(
  "the log says the page the link opens was asked for",
  function (this: WebWorld) {
    const page = linkFollowed(this).pathname;
    assert.ok(
      addressesLogged(this).some((url) => url.startsWith(`${page}?`)),
      `No request for ${page} is logged.`,
    );
  },
);

Then(
  "the page the link opens is logged with the link taken out",
  function (this: WebWorld) {
    const page = linkFollowed(this).pathname;
    assert.ok(
      addressesLogged(this).some(
        (url) => url.startsWith(`${page}?`) && url.includes("link=[removed]"),
      ),
      `${page} is not logged with its link taken out.`,
    );
  },
);
