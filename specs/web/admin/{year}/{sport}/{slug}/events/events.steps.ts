// The page where an administrator reads the events kept of a tournament
// (events.feature), in a real browser. The page draws once the API has
// answered, so every step waits for what it looks at.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { keptOf } from "../../../../../support/kept.js";
import type { WebWorld } from "../../../../../support/world.js";

// Retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
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

const events = (world: WebWorld): Locator =>
  world.browserPage.locator("main ul.events > li > details.event");

const which = (world: WebWorld, place: string): Locator =>
  place === "first" ? events(world).first() : events(world).last();

When(
  "the events of {string} are opened",
  async function (this: WebWorld, name: string) {
    const tournament = await keptOf(this, name);
    await this.browserPage.goto(
      `${this.baseUrl!}/admin/${tournament.address}/events`,
    );
    // The heading is drawn with the events, or with what is said in their place.
    await this.browserPage.locator("main h1").first().waitFor();
    await this.browserPage
      .locator("main ul.events, main [data-none]")
      .first()
      .waitFor();
  },
);

Then(
  "the page is the events of {string}",
  async function (this: WebWorld, name: string) {
    const tournament = await keptOf(this, name);
    await this.browserPage.waitForURL(
      (url) => url.pathname === `/admin/${tournament.address}/events`,
    );
    await events(this).first().waitFor();
  },
);

Then(
  /^the (first|last) event says "([^"]*)"$/,
  async function (this: WebWorld, place: string, kind: string) {
    await eventually(async () => {
      assert.equal(
        await which(this, place)
          .locator(".event-kind")
          .innerText({ timeout: 100 }),
        kind,
      );
    });
  },
);

Then("an event says {string}", async function (this: WebWorld, kind: string) {
  await eventually(async () => {
    const kinds = await events(this).locator(".event-kind").allInnerTexts();
    assert.ok(kinds.includes(kind), `The events say ${JSON.stringify(kinds)}.`);
  });
});

Then(
  "the first event happened at {string}",
  async function (this: WebWorld, moment: string) {
    await eventually(async () => {
      assert.equal(
        await events(this)
          .first()
          .locator("time.event-happened")
          .getAttribute("datetime", { timeout: 100 }),
        new Date(moment).toISOString(),
      );
    });
  },
);

Then(
  "the first event was kept in the stream of the tournament {string}",
  async function (this: WebWorld, name: string) {
    const tournament = await keptOf(this, name);
    await eventually(async () => {
      assert.equal(
        await events(this)
          .first()
          .locator(".event-stream")
          .innerText({ timeout: 100 }),
        tournament.id,
      );
    });
  },
);

When("the first event is pressed", async function (this: WebWorld) {
  await events(this).first().locator("summary").click();
});

// What an event carried is in the details beneath its line, which is shown
// only once the line has been pressed: a closed one is not visible.
Then(
  "the first event does not show what it carried",
  async function (this: WebWorld) {
    await events(this).first().waitFor();
    await eventually(async () => {
      assert.equal(
        await events(this)
          .first()
          .locator(".event-carried")
          .isVisible({ timeout: 100 }),
        false,
      );
    });
  },
);

Then(
  "the first event shows the name {string}",
  async function (this: WebWorld, name: string) {
    await eventually(async () => {
      const shown = await events(this)
        .first()
        .locator(".event-carried")
        .innerText({ timeout: 100 });
      assert.equal((JSON.parse(shown) as { name?: string }).name, name);
    });
  },
);

Then("the page links back to the tournaments", async function (this: WebWorld) {
  await eventually(async () => {
    assert.equal(
      await this.browserPage
        .locator("main a.events-back")
        .getAttribute("href", { timeout: 100 }),
      "/admin/",
    );
  });
});

// Where each is drawn and not where it comes in the page's source, which is
// what a reader's eye follows only as far as the layout lets it.
const drawn = async (world: WebWorld) => {
  const row = events(world).first();
  const boxes = await Promise.all(
    ["time.event-happened", ".event-kind", ".event-stream"].map((selector) =>
      row.locator(selector).boundingBox({ timeout: 100 }),
    ),
  );
  const present = <T>(found: T | null | undefined): T => {
    assert.ok(found !== null && found !== undefined, "Not drawn.");
    return found;
  };
  return {
    moment: present(boxes[0]),
    kind: present(boxes[1]),
    stream: present(boxes[2]),
  };
};

// One claim to a step, so that a failure says which of them was wrong.
Then(
  "the first event's moment is before its kind",
  async function (this: WebWorld) {
    await eventually(async () => {
      const { moment, kind } = await drawn(this);
      assert.ok(moment.x < kind.x, "The moment is not before the kind.");
    });
  },
);

Then(
  "the first event's kind is before its stream",
  async function (this: WebWorld) {
    await eventually(async () => {
      const { kind, stream } = await drawn(this);
      assert.ok(kind.x < stream.x, "The kind is not before the stream.");
    });
  },
);

Then(
  "the first event's moment, kind and stream are on one row",
  async function (this: WebWorld) {
    await eventually(async () => {
      const { moment, kind, stream } = await drawn(this);
      assert.ok(
        Math.abs(moment.y - kind.y) < moment.height &&
          Math.abs(kind.y - stream.y) < kind.height,
        "They are not on one row.",
      );
    });
  },
);

Then(
  "the first event's moment is above its kind",
  async function (this: WebWorld) {
    await eventually(async () => {
      const { moment, kind } = await drawn(this);
      assert.ok(moment.y < kind.y, "The moment is not above the kind.");
    });
  },
);

Then(
  "the first event's kind is above its stream",
  async function (this: WebWorld) {
    await eventually(async () => {
      const { kind, stream } = await drawn(this);
      assert.ok(kind.y < stream.y, "The kind is not above the stream.");
    });
  },
);
