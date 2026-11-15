// The months of a year's page, and what pressing one does. What the tournaments
// beneath a month share with the other lists is said in tournamentLists.ts.
import { When } from "@cucumber/cucumber";
import type { Locator } from "playwright";

import { settled } from "./tournamentLists.js";
import type { WebWorld } from "./world.js";

const months = (world: WebWorld): Locator =>
  world.browserPage.locator("main .year-month");

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const monthNamed = (world: WebWorld, name: string): Locator =>
  months(world).filter({
    has: world.browserPage.locator(".year-month-name", {
      hasText: exactly(name),
    }),
  });

// Said as a Given and as a When in the scenarios, which Cucumber does not tell
// apart, so it is defined once.
When(/^the month "(.*)" is pressed$/, async function (this: WebWorld, name) {
  await monthNamed(this, name as string)
    .locator(".year-month-toggle")
    .click();
  await settled(this);
});
