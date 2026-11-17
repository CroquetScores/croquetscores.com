// What the player dialogs show of the world ranking players as a name is
// typed (player.feature, team-player.feature): the players offered beneath a
// field, and the mark beside the world ranking name. Here rather than beside
// either dialog's steps, since both are held to the same words.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "./world.js";
import { call } from "./control.js";
import { isMarked } from "./marks.js";

// Retried for three seconds, since what is offered and what is marked are
// asked of the site as the name is typed, and arrive after it.
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

// What a field offers is the list it names, read from the page, since the
// browser draws the list itself and nothing in it can be pressed by a script.
const offeredBy = (world: WebWorld, label: string): Promise<string[]> =>
  world.browserPage
    .locator("dialog[open]")
    .getByLabel(label, { exact: true })
    .evaluate((field) => {
      const list = (
        field as unknown as {
          list: { options: ArrayLike<{ value: string }> } | null;
        }
      ).list;
      return list === null ? [] : Array.from(list.options, (o) => o.value);
    });

Then(
  "{string} offers {string}",
  async function (this: WebWorld, label: string, player: string) {
    await eventually(async () => {
      const offered = await offeredBy(this, label);
      assert.ok(
        offered.includes(player),
        `Offered ${JSON.stringify(offered)}.`,
      );
    });
  },
);

// Once what was typed has been answered, which is when the world ranking
// name is marked, so that nothing offered is still on its way.
Then(
  "{string} does not offer {string}",
  async function (this: WebWorld, label: string, player: string) {
    // What is represented is marked by nothing, so there is nothing to wait
    // for: it is given as long again as the site pauses over typing before it
    // asks, and as long as an answer takes, which is more than it needs.
    if (label === "Representing") await this.browserPage.waitForTimeout(1000);
    else await mark(this).waitFor();
    const offered = await offeredBy(this, label);
    assert.ok(!offered.includes(player), `Offered ${JSON.stringify(offered)}.`);
  },
);

const mark = (world: WebWorld): Locator =>
  world.browserPage.locator("dialog[open] .world-ranking-mark");

Then("the world ranking name is not marked", async function (this: WebWorld) {
  await this.browserPage
    .locator("dialog[open]")
    .getByLabel("World Ranking Player Name", { exact: true })
    .waitFor();
  assert.equal(await mark(this).count(), 0);
});

Then("the world ranking name is ticked", async function (this: WebWorld) {
  await eventually(async () => {
    assert.equal(
      await mark(this).getAttribute("data-mark", { timeout: 500 }),
      "ticked",
    );
  });
});

Then("the world ranking name is questioned", async function (this: WebWorld) {
  await eventually(async () => {
    assert.equal(
      await mark(this).getAttribute("data-mark", { timeout: 500 }),
      "questioned",
    );
  });
});

// What hovering shows is the mark's title, which the browser draws itself;
// it is the same words a screen reader is given.
const whyOf = async (world: WebWorld): Promise<string> => {
  const questioned = world.browserPage.locator(
    'dialog[open] .world-ranking-mark[data-mark="questioned"]',
  );
  await questioned.hover();
  const title = (await questioned.getAttribute("title")) ?? "";
  assert.equal(await questioned.getAttribute("aria-label"), title);
  return title;
};

Then(
  "the question mark says why on hovering over it",
  async function (this: WebWorld) {
    assert.notEqual((await whyOf(this)).trim(), "", "It says nothing.");
  },
);

Then(
  "what the question mark says is in the test locale",
  async function (this: WebWorld) {
    const why = await whyOf(this);
    assert.ok(isMarked(why), `It says "${why}".`);
  },
);

// Given the way an import would have left them, so that what is found among
// them is the scenario's subject, not how they came to be there.
Given(
  /^the (association croquet|golf croquet) players include "([^"]*)"$/,
  async function (this: WebWorld, sport: string, name: string) {
    const answer = await call("POST", "/world-ranking-players", {
      sport: sport === "golf croquet" ? "gc" : "ac",
      name,
    });
    assert.equal(answer.status, 201, await answer.text());
  },
);
