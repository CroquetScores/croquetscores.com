import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { APIResponse, Response } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import {
  anApplicationBelievingNoProxy,
  anApplicationServedAs,
} from "../../support/browser.js";

// What the site last answered the scenario, as the page was opened or as a
// request was made without one.
interface Answered {
  readonly status: number;
  readonly contentType: string;
  readonly body: string;
}

const answers = new WeakMap<SpecWorld, Answered>();

const answeredOf = (world: SpecWorld): Answered => {
  const answered = answers.get(world);
  assert.ok(answered !== undefined, "Nothing has been asked of the site.");
  return answered;
};

const readFrom = async (
  response: Response | APIResponse,
): Promise<Answered> => ({
  status: response.status(),
  contentType: response.headers()["content-type"] ?? "",
  body: await response.text(),
});

// Said to come from the site itself, as a form posted from its own page is, so
// that what the scenario is about is the host and not the guard that turns away
// other sites.
const fromTheSite = { "sec-fetch-site": "same-origin" };

// As something in front of the site asks: the host the reader typed is
// forwarded by the proxy the site trusts, which the browser's address is.
const forwardedFor = (host: string): Record<string, string> => ({
  "x-forwarded-host": host,
});

const opened = async (
  world: SpecWorld,
  host: string,
  path: string,
): Promise<void> => {
  await anApplicationServedAs(world, host);
  const response = await world.browserPage.goto(`${world.baseUrl!}${path}`);
  assert.ok(response !== null, "The page gave no answer.");
  answers.set(world, await readFrom(response));
};

Given("a site", function (this: SpecWorld) {
  assert.ok(this.baseUrl !== undefined, "The scenario has no application.");
});

Given(
  "a site told that no proxy forwards requests to it",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationBelievingNoProxy(this);
  },
);

When(
  "the sign in page is asked for as {string}",
  async function (this: SpecWorld, host: string) {
    await opened(this, host, "/account/sign-in");
  },
);

When(
  "the home page is asked for as {string}",
  async function (this: SpecWorld, host: string) {
    await opened(this, host, "/");
  },
);

When(
  "the API is asked for as {string}",
  async function (this: SpecWorld, host: string) {
    const response = await this.browserPage.request.get(
      `${this.baseUrl!}/api/v1/tournaments`,
      { headers: forwardedFor(host), failOnStatusCode: false },
    );
    answers.set(this, await readFrom(response));
  },
);

When(
  "the health check is asked for as {string}",
  async function (this: SpecWorld, host: string) {
    const response = await this.browserPage.request.get(
      `${this.baseUrl!}/api/v1/health`,
      { headers: forwardedFor(host), failOnStatusCode: false },
    );
    answers.set(this, await readFrom(response));
  },
);

When(
  "the health check is asked for with a query as {string}",
  async function (this: SpecWorld, host: string) {
    const response = await this.browserPage.request.get(
      `${this.baseUrl!}/api/v1/health?probe=1`,
      { headers: forwardedFor(host), failOnStatusCode: false },
    );
    answers.set(this, await readFrom(response));
  },
);

When(
  "a form is posted as {string}",
  async function (this: SpecWorld, host: string) {
    const response = await this.browserPage.request.post(
      `${this.baseUrl!}/account/sign-in`,
      {
        headers: { ...forwardedFor(host), ...fromTheSite },
        form: { emailAddress: "someone@example.com", password: "nothing" },
        failOnStatusCode: false,
      },
    );
    answers.set(this, await readFrom(response));
  },
);

Then("the site answers {string}", function (this: SpecWorld, status: string) {
  assert.equal(answeredOf(this).status, Number(status));
});

Then("the answer is a page", function (this: SpecWorld) {
  const { contentType, body } = answeredOf(this);
  assert.match(contentType, /^text\/html/);
  assert.match(body, /<h1>/);
});

Then("the answer carries no beta banner", function (this: SpecWorld) {
  assert.ok(!answeredOf(this).body.includes("beta-banner"));
});

Then(
  "the answer carries the code {string}",
  function (this: SpecWorld, code: string) {
    const said = JSON.parse(answeredOf(this).body) as { error?: unknown };
    assert.equal(said.error, code);
  },
);
