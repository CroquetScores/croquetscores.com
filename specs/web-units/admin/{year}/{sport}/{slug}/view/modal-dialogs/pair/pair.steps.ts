import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../support/world.js";
import {
  eventually,
  settled,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// The pair dialog (pair.feature), open over a tournament's Players tab. What
// opens the tab and reads its list is the tab's (players-tab.steps.ts); these
// are what this dialog adds.

const dialogOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("dialog[open]");

// Whatever the button is called in the reader's language, by what it does.
const addPair = (world: SpecWorld): Locator =>
  tabPanel(world).locator('button[data-action="addPair"]');

When("the way to add a pair is pressed", async function (this: SpecWorld) {
  await settled(this);
  await addPair(this).click();
});

Then("the way to add a pair is offered", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await addPair(this).count(), 1);
  });
});

Then("the way to add a pair is not offered", async function (this: SpecWorld) {
  await settled(this);
  await eventually(this, async () => {
    assert.equal(await addPair(this).count(), 0);
  });
});

Then("the pair dialog is open", async function (this: SpecWorld) {
  await dialogOf(this).waitFor();
  assert.equal(await dialogOf(this).locator("#field-first").count(), 1);
});

Then("the pair dialog is closed", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await dialogOf(this).count(), 0);
  });
});

Then(
  "the pair dialog is titled {string}",
  async function (this: SpecWorld, title: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      (await dialogOf(this).locator(".dialog-title").innerText()).trim(),
      title,
    );
  },
);

Then(
  "the pair dialog's first button is {string}",
  async function (this: SpecWorld, words: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      (
        await dialogOf(this)
          .locator(".dialog-buttons button")
          .first()
          .innerText()
      ).trim(),
      words,
    );
  },
);

Then(
  "the pair dialog asks for {string}",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    const labels = (
      await dialogOf(this).locator(".field-label").allInnerTexts()
    ).map((each) => each.trim());
    assert.ok(labels.includes(label), `It asks for ${JSON.stringify(labels)}.`);
  },
);

const offered = async (world: SpecWorld): Promise<string[]> =>
  (
    await dialogOf(world)
      .locator('#field-first option:not([value=""])')
      .allInnerTexts()
  ).map((name) => name.trim());

Then(
  "the pair dialog offers the player {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok((await offered(this)).includes(name));
  },
);

Then(
  "the pair dialog does not offer the player {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok(!(await offered(this)).includes(name));
  },
);

const offeredAsSecond = async (world: SpecWorld): Promise<string[]> =>
  (
    await dialogOf(world)
      .locator('#field-second option:not([value=""])')
      .allInnerTexts()
  ).map((name) => name.trim());

Then(
  "the pair dialog offers {string} as the second player",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok((await offeredAsSecond(this)).includes(name));
  },
);

Then(
  "the pair dialog does not offer {string} as the second player",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok(!(await offeredAsSecond(this)).includes(name));
  },
);

Then("no second player is chosen", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(
      await dialogOf(this).locator("#field-second").inputValue(),
      "",
    );
  });
});

for (const [place, field] of [
  ["first", "#field-first"],
  ["second", "#field-second"],
] as const) {
  Given(
    `{string} is chosen as the ${place} player`,
    async function (this: SpecWorld, name: string) {
      await dialogOf(this).locator(field).selectOption({ label: name });
    },
  );
}

Then(
  "{string} is still the first player",
  async function (this: SpecWorld, name: string) {
    const chosen = await dialogOf(this)
      .locator("#field-first option:checked")
      .innerText();
    assert.equal(chosen.trim(), name);
  },
);

// The first button, which does what the dialog is for, whatever it is called.
// Waited for until the site has answered, since the tournament is read
// straight after and the answer is what says the pair was made.
When("Add Pair is pressed", async function (this: SpecWorld) {
  const answered = this.browserPage.waitForResponse(
    (response) =>
      response.url().endsWith("/pairs") &&
      response.request().method() === "POST",
  );
  await dialogOf(this).locator(".dialog-buttons button").first().click();
  await answered;
  await settled(this);
});

// Nothing is sent where either player is not chosen, so there is no answer to
// wait for, and what is asked is whether a request was made at all.
const asked = new WeakMap<SpecWorld, string[]>();

When(
  "Add Pair is pressed with a player not chosen",
  async function (this: SpecWorld) {
    const requests: string[] = [];
    asked.set(this, requests);
    this.browserPage.on("request", (request) => {
      if (request.url().endsWith("/pairs")) requests.push(request.method());
    });
    await dialogOf(this).locator(".dialog-buttons button").first().click();
    await settled(this);
    // A request a click makes is made before it returns, but the page's own
    // answer to it is not, so a moment is given before saying there was none.
    await this.browserPage.waitForTimeout(300);
  },
);

Then("no pair was asked for", function (this: SpecWorld) {
  assert.deepEqual(asked.get(this), []);
});

When("the pair dialog is cancelled", async function (this: SpecWorld) {
  await dialogOf(this).locator(".dialog-buttons button").last().click();
  await settled(this);
});

// By the code it carries rather than the words, which are the reader's
// language's to choose.
Then(
  "the pair dialog says above its fields that it was refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      const refused =
        (await dialogOf(this)
          .locator(".dialog-problems")
          .getAttribute("data-refused", { timeout: 500 })) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `It says it was refused with ${refused || "nothing"}.`,
      );
    });
  },
);

// What it says -----------------------------------------------------------------

const status = (world: SpecWorld): Locator =>
  dialogOf(world).locator('[role="status"]');

Then(
  "the pair dialog says {string} was added",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(
        (await status(this).innerText()).includes(name),
        `The dialog says ${await status(this).innerText()}.`,
      );
    });
  },
);

Then("the pair dialog says nobody was added", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal((await status(this).innerText()).trim(), "");
  });
});

// A status is read out when what it says changes, without the reader being
// taken to it.
Then(
  "what the pair dialog says about which pair was added is announced",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
  },
);

Then("no first player is chosen", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await dialogOf(this).locator("#field-first").inputValue(), "");
  });
});

Then("the first player has the focus", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.ok(
      await dialogOf(this)
        .locator("#field-first")
        .evaluate(
          (element) =>
            element ===
            (globalThis as unknown as { document: { activeElement: unknown } })
              .document.activeElement,
        ),
      "Something other than the first player has the focus.",
    );
  });
});

// The pair is made, and what the site answers is emptied, as a proxy might
// empty it: the request goes through and the page is given nothing to read.
Given(
  "the answer to making a pair cannot be read",
  async function (this: SpecWorld) {
    await this.browserPage.route("**/pairs", async (route) => {
      const response = await route.fetch();
      await route.fulfill({ response, body: "" });
    });
  },
);

Then(
  "the pair dialog says nothing was refused",
  async function (this: SpecWorld) {
    await settled(this);
    assert.equal(await dialogOf(this).locator(".dialog-problems").count(), 0);
  },
);
