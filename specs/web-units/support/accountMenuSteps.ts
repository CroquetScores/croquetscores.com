import { Given } from "@cucumber/cucumber";
import type { SpecWorld } from "../../support/world.js";
import { signInAs } from "./reader.js";

// Said of the scenario's browser rather than of any account: these scenarios
// have no database, and what the menu asks is only whether anybody is signed
// in. Whether a reader really is signed in, to a real account, is asked in the
// words of the features that sign one in.
Given(
  "a reader signed in as {string}",
  async function (this: SpecWorld, address: string) {
    await signInAs(this, address);
  },
);
