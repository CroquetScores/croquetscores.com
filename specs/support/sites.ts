// The sites a scenario can name, and the step that names one.
//
// Nothing in the domain knows which site it is serving: each thing that differs
// by site keeps a list for each, such as the formats and the sports it offers.
// So a scenario's site is only a name, as a reader would give it, and each
// feature's steps turn it into that feature's list. One step names the site for
// all of them, because two definitions of the same words leave Cucumber unable
// to choose between them.
//
// Here rather than beside one feature's steps because two features say it.
// Application and domain types only, for the reason at the top of world.ts.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "./world.js";

const sites = ["Croquet Scores", "Gateball Scores"] as const;

/**
 * A site as a reader names it. A feature that keeps something for each site
 * keeps it in a record over this, so that a site added here is refused by the
 * typecheck until every such feature says what it has there.
 */
export type Site = (typeof sites)[number];

const isSite = (name: string): name is Site =>
  (sites as readonly string[]).includes(name);

/** The site the scenario has named. */
export const siteOfWorld = (world: SpecWorld): Site => {
  assert.ok(world.site !== undefined, "No site has been named.");
  return world.site;
};

Given("the site {string}", function (this: SpecWorld, name: string) {
  assert.ok(isSite(name), `There is no site "${name}".`);
  this.site = name;
});
