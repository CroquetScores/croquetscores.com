// What a scenario says to hold the API to the read models: that it may not read
// the events, told to the site through its control (src/web/testControlEventStore.ts).
// What the API is then asked is said by the steps of each endpoint's own feature.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call } from "../../../support/control.js";

Given("the API may not read the events", async function () {
  const answer = await call("POST", "/event-store/api-reads", {
    refused: true,
  });
  assert.equal(answer.status, 200, await answer.text());
});
