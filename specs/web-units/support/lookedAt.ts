// Pages read without a browser, as the help's pages with addresses of their
// own are: the privacy statement and the terms of use. Here rather than beside
// one feature, because the page at an address is looked at in the words of
// either, and what is asked of it afterwards may be asked by the other's
// steps.
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { answeredWith } from "./answered.js";
import { anApplicationOfferingItsOwnLanguages } from "./browser.js";

// What the scenario's reader was last answered, kept apart from the help's
// own, which is private to its steps.
const answers = new WeakMap<SpecWorld, string>();
const sites = new WeakMap<SpecWorld, string>();

/** The site the scenario's pages are looked at on, where it is not the usual. */
export const lookOn = (world: SpecWorld, site: string): void => {
  sites.set(world, site);
};

/**
 * Looks at the page at `address`, as a reader not signed in. A redirect is
 * not followed, so that a page that sends the reader elsewhere, to sign in
 * say, is not taken for the page it sent them to.
 */
export const look = async (
  world: SpecWorld,
  address: string,
): Promise<void> => {
  let site = sites.get(world);
  if (site === undefined) {
    site = await anApplicationOfferingItsOwnLanguages(world);
    sites.set(world, site);
  }
  const response = await fetch(`${site}${address}`, {
    headers:
      world.acceptLanguage === undefined
        ? {}
        : { "accept-language": world.acceptLanguage },
    redirect: "manual",
  });
  answers.set(world, await response.text());
  answeredWith(world, response.status);
};

/** What the page last looked at says. */
export const lookedAt = (world: SpecWorld): string => {
  const found = answers.get(world);
  assert.ok(found !== undefined, "No page was opened.");
  return found;
};
