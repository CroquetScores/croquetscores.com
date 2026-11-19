import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CreateApiKey } from "../../../../../src/application/operations/accounts/CreateApiKey.js";
import {
  WhatAKeyMayDoInTournament,
  type WhatAKeyMayDo,
} from "../../../../../src/application/operations/tournaments/WhatAKeyMayDoInTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  apiKeysOf,
  keepingWhatCameOf,
  lastKeyMade,
} from "../../accounts/apiKeyRequests.js";
import {
  accountAt,
  momentOf,
  registeringOf,
} from "../../accounts/roleRequests.js";
import { ask, noTournament, tournamentNamed } from "../aRequest.js";

// A key limited to a tournament the scenario made, which it names by what the
// tournament is called, as it names every other.
When(
  "the reader signed in to the account for {string} makes a key labelled {string} that may read and write, for the tournament called {string}",
  async function (
    this: SpecWorld,
    address: string,
    label: string,
    tournament: string,
  ) {
    const account = await accountAt(this, address);
    await keepingWhatCameOf(this, async () =>
      registeringOf(this).createApiKey(
        new CreateApiKey(
          account.id.value,
          label,
          "read-and-write",
          tournamentNamed(this, tournament).value,
          momentOf(this),
        ),
      ),
    );
    const made = this.answer as { id: string; key: string } | undefined;
    if (made !== undefined) apiKeysOf(this).made.push({ address, key: made });
  },
);

When(
  "that key is asked what it may do in {string}",
  async function (this: SpecWorld, tournament: string) {
    await ask(
      this,
      new WhatAKeyMayDoInTournament(
        lastKeyMade(this).key,
        tournamentNamed(this, tournament).value,
      ),
    );
  },
);

When(
  "that key is asked what it may do in a tournament there is not",
  async function (this: SpecWorld) {
    await ask(
      this,
      new WhatAKeyMayDoInTournament(
        lastKeyMade(this).key,
        noTournament().value,
      ),
    );
  },
);

When(
  "that key is asked what it may do in the tournament {string}",
  async function (this: SpecWorld, id: string) {
    await ask(this, new WhatAKeyMayDoInTournament(lastKeyMade(this).key, id));
  },
);

When(
  "the key {string} is asked what it may do in {string}",
  async function (this: SpecWorld, key: string, tournament: string) {
    await ask(
      this,
      new WhatAKeyMayDoInTournament(
        key,
        tournamentNamed(this, tournament).value,
      ),
    );
  },
);

When(
  "the key {string} is asked what it may do in a tournament there is not",
  async function (this: SpecWorld, key: string) {
    await ask(this, new WhatAKeyMayDoInTournament(key, noTournament().value));
  },
);

const answered = (world: SpecWorld): WhatAKeyMayDo => {
  assert.equal(
    world.failure,
    undefined,
    `Asking failed: ${String(world.failure)}`,
  );
  const found = world.answer as WhatAKeyMayDo | undefined;
  assert.ok(found !== undefined, "Nothing was answered.");
  return found;
};

Then("nothing is answered", function (this: SpecWorld) {
  assert.equal(this.failure, undefined);
  assert.equal(this.answer, undefined);
});

Then(
  "the part of the key's account is {string}",
  function (this: SpecWorld, part: string) {
    assert.equal(answered(this).part, part);
  },
);

Then("the key may read the tournament", function (this: SpecWorld) {
  assert.equal(answered(this).mayRead, true);
});

Then("the key may not read the tournament", function (this: SpecWorld) {
  assert.equal(answered(this).mayRead, false);
});

Then("the key may write to the tournament", function (this: SpecWorld) {
  assert.equal(answered(this).mayWrite, true);
});

Then("the key may not write to the tournament", function (this: SpecWorld) {
  assert.equal(answered(this).mayWrite, false);
});
