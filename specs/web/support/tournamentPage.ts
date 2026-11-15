// A tournament's page in the admin, opened on one of its tabs, for the steps
// of each tab. The tabs have no addresses (view.feature), so a tab is opened
// by opening the page and choosing it, as a reader does. Chosen by its id
// rather than its words, which are in whatever language the page is in.
import type { Locator } from "playwright";

import type { WebWorld } from "./world.js";

export type Tab =
  | "players"
  | "competitions"
  | "teams"
  | "tests"
  | "notes"
  | "managers"
  | "scorers"
  | "rankings";

/**
 * Where a tab lists what it holds, once it has been asked for, or where a page
 * with one list and no tabs does — a team's players, a test's scores — since
 * the list is drawn the same either way.
 */
export const tabPanel = (world: WebWorld): Locator =>
  world.browserPage.locator("#tab-panel, #page-list");

/** The page of the tournament the scenario calls `name`, on `tab`. */
export const openTab = async (
  world: WebWorld,
  name: string,
  tab: Tab,
): Promise<void> => {
  const tournament = world.tournaments.get(name);
  if (tournament === undefined) {
    throw new Error(`No tournament called ${name} was created.`);
  }
  await world.browserPage.goto(`${world.baseUrl!}/admin/${tournament.address}`);
  await world.browserPage.locator(`#tab-${tab}`).click();
  await settled(world);
};

/**
 * Once the tab says its list is the answer to what was last asked: until then
 * it is busy, and what it shows is what it showed before.
 */
export const settled = async (world: WebWorld): Promise<void> => {
  await tabPanel(world).locator('section[aria-busy="false"]').waitFor();
};

// Three seconds, which leaves a step time to fail with what it found rather
// than with Cucumber's word that it took too long. A list redrawn once
// something is pressed is redrawn a moment after the press.
//
// Apart from `eventually` so that a page with no tab panel, as a public page
// has none, can be waited on: `eventually` waits for the panel first, and on
// such a page it waits until Cucumber gives up.
export const eventually = async (
  world: WebWorld,
  check: () => Promise<void>,
): Promise<void> => {
  await settled(world);
  await retried(check);
};

export const retried = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};
