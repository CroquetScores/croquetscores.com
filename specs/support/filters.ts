// The words for narrowing a website's tournaments, which the read model that
// keeps them and the questions that ask it both say. Each only names what is
// chosen, by its code: whoever asks makes a filter of it, so that a filter that
// cannot be is refused where the scenario asks rather than here.
//
// Here rather than beside one feature's steps because two layers' features say
// it, and two definitions of the same words leave Cucumber unable to choose.
import { Given } from "@cucumber/cucumber";

import type { SpecWorld } from "./world.js";

Given(
  "a filter of the country {string}",
  function (this: SpecWorld, code: string) {
    this.filterChosen.country = code;
  },
);

Given(
  "a filter of the region {string}",
  function (this: SpecWorld, code: string) {
    this.filterChosen.region = code;
  },
);

Given(
  "a filter of the sport {string}",
  function (this: SpecWorld, code: string) {
    this.filterChosen.sport = code;
  },
);
