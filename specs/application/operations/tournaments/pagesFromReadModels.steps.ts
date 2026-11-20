import { Given } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../support/world.js";
import { inHandOf } from "./aRequest.js";

// What the public pages of a tournament are shown to ask of the events, which
// is nothing: the events are taken away and the page is asked for again. It is
// said once here, since every page says it in the same words.
Given(
  "the events of the tournaments and the competitions are no longer kept",
  async function (this: SpecWorld) {
    await inHandOf(this).withoutEvents();
  },
);
