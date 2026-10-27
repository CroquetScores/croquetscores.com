import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { inCountryGroups } from "../../../../src/web/common/countryOrder.js";
import type { SpecWorld } from "../../../support/world.js";

const places = ["first", "second", "third", "fourth", "fifth"];
const groupNamed = ["first", "second", "third"];

Given(
  "the country {string} named {string}",
  function (this: SpecWorld, code: string, name: string) {
    this.countriesToOrder.push({ code, name });
  },
);

When(
  "the countries are put in groups for {string}",
  function (this: SpecWorld, language: string) {
    this.countryGroups = inCountryGroups(this.countriesToOrder, language).map(
      (group) => [...group],
    );
  },
);

Then(
  /^the (first|second|third|fourth|fifth) country of the (first|second|third) group is "(.*)"$/,
  function (this: SpecWorld, place: string, group: string, name: string) {
    assert.equal(
      this.countryGroups[groupNamed.indexOf(group)]?.[places.indexOf(place)]
        ?.name,
      name,
    );
  },
);

Then(
  /^the (first|second|third) group has (\d+) countr(?:y|ies)$/,
  function (this: SpecWorld, group: string, count: string) {
    assert.equal(
      this.countryGroups[groupNamed.indexOf(group)]?.length,
      Number(count),
    );
  },
);

Then(
  /^there (?:is|are) (\d+) groups?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(this.countryGroups.length, Number(count));
  },
);
