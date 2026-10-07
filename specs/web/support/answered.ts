// What the site answered a page opened or posted to with, so that a scenario
// can say a page is not there. Here rather than beside one feature, because
// more than one page is not there for somebody, and the words for it are the
// same whichever page it is.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";

const statuses = new WeakMap<SpecWorld, number>();

/** Keeps what the site answered this scenario's last opening or posting with. */
export const answeredWith = (world: SpecWorld, status: number): void => {
  statuses.set(world, status);
};

/** Opens `path` in the scenario's browser, keeping what it was answered with. */
export const openAndKeepTheAnswer = async (
  world: SpecWorld,
  path: string,
): Promise<void> => {
  const response = await world.browserPage.goto(`${world.baseUrl!}${path}`);
  if (response !== null) answeredWith(world, response.status());
};

/**
 * Posts `form` to `path` from the scenario's browser, and keeps what it was
 * answered with. Posted by the page rather than by a form on it, because the
 * page with the form is the one that is not there; and by the page rather
 * than by a request of the test's own, because the session cookie is Secure,
 * which a browser sends to 127.0.0.1 and a plain request over http does not.
 */
export const postAndKeepTheAnswer = async (
  world: SpecWorld,
  path: string,
  form: Readonly<Record<string, string>>,
): Promise<void> => {
  const site = new URL(world.baseUrl!);
  if (new URL(world.browserPage.url()).origin !== site.origin) {
    await world.browserPage.goto(site.href);
  }
  const status = await world.browserPage.evaluate(
    async ({ path, form }) =>
      (
        await fetch(path, {
          method: "POST",
          body: new URLSearchParams(form),
          redirect: "manual",
        })
      ).status,
    { path, form },
  );
  answeredWith(world, status);
};

Then("the page is not found", function (this: SpecWorld) {
  const status = statuses.get(this);
  assert.ok(status !== undefined, "Nothing was opened or posted to.");
  assert.equal(status, 404);
});

Then("the page opens", function (this: SpecWorld) {
  const status = statuses.get(this);
  assert.ok(status !== undefined, "Nothing was opened or posted to.");
  assert.equal(status, 200);
});
