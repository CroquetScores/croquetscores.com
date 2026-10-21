import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { DatabaseAccessState } from "../../../src/application/common/DatabaseAccess.js";
import type { SpecWorld } from "../../support/world.js";
import { addressingOf, applicationFor } from "../../web/support/browser.js";
import { englishForScenarios } from "../../web/support/languages.js";
import {
  accessInHand,
  aFileThatIsNotThere,
  holding,
  momentIn,
} from "./databaseAccessInHand.js";

// The switch the site reads and the script writes (`FileDatabaseAccess.feature`
// and `databaseAccess.feature`). What a step is refused with is left on the
// world, as every request's is.

Given("a database access file that does not exist", function (this: SpecWorld) {
  aFileThatIsNotThere(this);
});

Given(
  "a database access file holding {string}",
  function (this: SpecWorld, text: string) {
    aFileThatIsNotThere(this);
    holding(this, text);
  },
);

Given("a database access file holding no minutes", function (this: SpecWorld) {
  aFileThatIsNotThere(this);
  holding(this, JSON.stringify({ turnedOffAt: "2026-10-13T10:00:00.000Z" }));
});

// Turning it off, moving the return and turning it on are said in
// maintenance.steps.ts, which does them to the application's own switch where
// the scenario built the application and to this file's where it did not: the
// same words, since they are the same thing done.

Given(
  "the database access file is made to hold {string}",
  function (this: SpecWorld, text: string) {
    holding(this, text);
  },
);

Given(
  "a reading of the file is held after it has read it",
  async function (this: SpecWorld) {
    accessInHand(this).hold();
    // Long enough for it to have read the file, and no longer.
    await new Promise((resolve) => setTimeout(resolve, 50));
  },
);

When(
  "database access is turned on through the switch that is reading",
  async function (this: SpecWorld) {
    await accessInHand(this).reader.turnOn();
  },
);

When(
  "database access is turned off through the switch that is reading",
  async function (this: SpecWorld) {
    await accessInHand(this).reader.turnOff(30, momentIn(this));
  },
);

When("the held reading is let go", async function (this: SpecWorld) {
  await accessInHand(this).release();
});

When(
  /^database access is turned off for (-?[\d.]+) minutes unless it is off already$/,
  async function (this: SpecWorld, minutes: string) {
    this.failure = undefined;
    try {
      await accessInHand(this).writer.turnOffIfOn(
        Number(minutes),
        momentIn(this),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

// Both asked of the file at once, as two people begin at the same moment, and
// what each was refused with kept.
const bothRefusals = new WeakMap<SpecWorld, unknown[]>();

When(
  /^database access is turned off for (\d+) and for (\d+) minutes at once unless it is off already$/,
  async function (this: SpecWorld, first: string, second: string) {
    const { writer } = accessInHand(this);
    const results = await Promise.allSettled([
      writer.turnOffIfOn(Number(first), momentIn(this)),
      writer.turnOffIfOn(Number(second), momentIn(this)),
    ]);
    bothRefusals.set(
      this,
      results.map((each): unknown =>
        each.status === "rejected" ? (each.reason as unknown) : undefined,
      ),
    );
  },
);

Then(
  "one of the two is refused with {string}",
  function (this: SpecWorld, code: string) {
    const refusals = (bothRefusals.get(this) ?? []).filter(
      (each) => each !== undefined,
    );
    assert.equal(refusals.length, 1, "Not exactly one was refused.");
    assert.equal((refusals[0] as { code?: string }).code, code);
  },
);

When("database access is read", async function (this: SpecWorld) {
  const held = accessInHand(this);
  held.state = await held.reader.current();
});

// What was read -----------------------------------------------------------------

// What the scenario read of its own file, or, where it has none because it is
// about a site, what the site's switch says now.
const stateOf = async (world: SpecWorld): Promise<DatabaseAccessState> => {
  let held: ReturnType<typeof accessInHand> | undefined;
  try {
    held = accessInHand(world);
  } catch {
    held = undefined;
  }
  if (held === undefined) return applicationFor(world).databaseAccess.current();
  assert.ok(held.state !== undefined, "Database access has not been read.");
  return held.state;
};

const read = stateOf;

// A site is changed by a browser pressing a button, which returns before the
// site has done what it was asked, so a scenario about a site is given a
// moment to be right. One about a file is not: it is already as it will be.
const eventually = async (check: () => Promise<void>): Promise<void> => {
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

Then("database access is on", async function (this: SpecWorld) {
  await eventually(async () => {
    assert.equal((await read(this)).off, false);
  });
});

Then("database access is off", async function (this: SpecWorld) {
  await eventually(async () => {
    assert.equal((await read(this)).off, true);
  });
});

Then(
  "access is expected back at {string}",
  async function (this: SpecWorld, moment: string) {
    const state = await read(this);
    assert.ok(state.off, "Database access is on.");
    assert.equal(
      state.expectedBackAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "access was turned off at {string}",
  async function (this: SpecWorld, moment: string) {
    const state = await read(this);
    assert.ok(state.off, "Database access is on.");
    assert.equal(
      state.turnedOffAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then("a fault is logged", function (this: SpecWorld) {
  assert.ok(accessInHand(this).faults.length > 0, "No fault was logged.");
});

Then("the file was read once", function (this: SpecWorld) {
  assert.equal(accessInHand(this).reads(), 1);
});

Then(
  /^(\d+) faults? (?:is|are) logged$/,
  function (this: SpecWorld, count: string) {
    assert.equal(accessInHand(this).faults.length, Number(count));
  },
);

// What a reader is told while access is off. Of the file where the scenario is
// about the file, and of the site itself where it is about a site, by asking it
// for a page as a reader would and reading what comes back.
const toldOnTheSite = async (world: SpecWorld): Promise<string> => {
  assert.ok(world.baseUrl !== undefined, "The scenario has no site.");
  const answer = await fetch(`${world.baseUrl}/`, {
    headers: addressingOf(world),
  });
  return answer.text();
};

const hasFile = (world: SpecWorld): boolean => {
  try {
    accessInHand(world);
    return true;
  } catch {
    return false;
  }
};

Then(
  "readers are told {string}",
  async function (this: SpecWorld, words: string) {
    if (hasFile(this)) {
      const state = await read(this);
      assert.ok(state.off, "Database access is on.");
      assert.equal(state.words, words);
      return;
    }
    await eventually(async () => {
      assert.ok(
        (await toldOnTheSite(this)).includes(words),
        `The site does not tell readers "${words}".`,
      );
    });
  },
);

Then("readers are told the usual sentence", async function (this: SpecWorld) {
  if (hasFile(this)) {
    const state = await read(this);
    assert.ok(state.off, "Database access is on.");
    assert.equal(state.words, undefined);
    return;
  }
  const usual = englishForScenarios.words["errors.maintenance"];
  assert.ok(usual !== undefined, "English has no usual sentence.");
  await eventually(async () => {
    assert.ok(
      (await toldOnTheSite(this)).includes(usual),
      "The site does not tell readers the usual sentence.",
    );
  });
});

Given(
  "a database access file holding words that are not text",
  function (this: SpecWorld) {
    aFileThatIsNotThere(this);
    holding(
      this,
      JSON.stringify({
        turnedOffAt: "2026-10-13T10:00:00.000Z",
        expectedBackAt: "2026-10-13T10:30:00.000Z",
        words: 7,
      }),
    );
  },
);
