// What a key may change (writer.feature), made as its owner makes one.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { sessionFor } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";
import { rememberKeyShownBy } from "../apiOfApps.js";

// Made for one tournament, by the year, the sport and the name of the
// tournament it is for, and able to write there as well as to read.
Given(
  "{string} has made a key limited to the tournament {string} that may write",
  async function (this: WebWorld, address: string, name: string) {
    const kept = this.tournaments.get(name);
    assert.ok(kept !== undefined, `No tournament called ${name} was made.`);
    const answer = await fetch(`${this.baseUrl!}/account/api-keys/new`, {
      method: "POST",
      headers: {
        cookie: `session=${await sessionFor(address)}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        label: "An app",
        write: "on",
        limit: "one",
        year: String(kept.address).slice(0, 4),
        sport: String(kept.request["sport"]),
        tournamentName: name,
      }),
    });
    assert.equal(answer.status, 200, "The site would not make the key.");
    rememberKeyShownBy(this, await answer.text());
  },
);
