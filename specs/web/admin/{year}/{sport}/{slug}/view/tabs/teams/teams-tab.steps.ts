import { When } from "@cucumber/cucumber";

import type { WebWorld } from "../../../../../../../support/world.js";
import { openTab } from "../../../../../../../support/tournamentPage.js";

// A tournament's Teams tab (teams-tab.feature). Its rows are drawn as the
// Players tab's are, so the steps that read them are that tab's
// (players-tab.steps.ts); these are what it adds.

When(
  /^the teams of "([^"]*)" are open(?:ed)?$/,
  async function (this: WebWorld, name: string) {
    await openTab(this, name, "teams");
  },
);
