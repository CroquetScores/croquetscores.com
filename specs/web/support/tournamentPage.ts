// A tournament's page in the admin, opened on one of its tabs, for the steps
// of each tab. The tabs have no addresses (view.feature), so a tab is opened
// by opening the page and choosing it, as a reader does. Chosen by its id
// rather than its words, which are in whatever language the page is in.
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../support/world.js";

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
export const tabPanel = (world: SpecWorld): Locator =>
  world.browserPage.locator("#tab-panel, #page-list");

/** The page of the tournament the scenario calls `name`, on `tab`. */
export const openTab = async (
  world: SpecWorld,
  name: string,
  tab: Tab,
): Promise<void> => {
  const tournament = await load(world, tournamentNamed(world, name));
  await world.browserPage.goto(
    `${world.baseUrl!}/admin/${tournament.address.toString()}`,
  );
  await world.browserPage.locator(`#tab-${tab}`).click();
  await settled(world);
};

/**
 * Once the tab says its list is the answer to what was last asked: until then
 * it is busy, and what it shows is what it showed before.
 */
export const settled = async (world: SpecWorld): Promise<void> => {
  await tabPanel(world).locator('section[aria-busy="false"]').waitFor();
};

// Three seconds, which leaves a step time to fail with what it found rather
// than with Cucumber's word that it took too long. A list redrawn once
// something is pressed is redrawn a moment after the press.
export const eventually = async (
  world: SpecWorld,
  check: () => Promise<void>,
): Promise<void> => {
  await settled(world);
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
