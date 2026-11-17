// What a dialog's fields hold and say, and pressing it to send, as a reader does:
// a field is found by the label a reader sees, spelled as the dialog spells it,
// as assistive technology finds one, and what is said beneath it is what it is
// announced with.
import { When, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { closes, opens, unmarked } from "./languages.js";
import { unmarkedWithin } from "./marks.js";
import type { WebWorld } from "./world.js";

When("the dialog is submitted", async function (this: WebWorld) {
  await this.browserPage.click('.dialog-buttons button[type="submit"]');
  await this.browserPage.waitForLoadState();
});

When("Escape is pressed", async function (this: WebWorld) {
  await this.browserPage.keyboard.press("Escape");
});

// The input whose label reads as `field` does, with the test locale's marks taken
// off and the case ignored, as a reader would find it.
const inputByLabel = (field: string): string => `(() => {
  const unmark = (text) => text.split(${JSON.stringify(opens)}).join("").split(${JSON.stringify(closes)}).join("");
  const wanted = ${JSON.stringify(field.toLowerCase())};
  return [...document.querySelectorAll("section.dialog input:not([type=hidden])")].find(
    (candidate) => unmark(candidate.labels?.[0]?.textContent ?? "").trim().toLowerCase() === wanted,
  );
})()`;

Then(
  /^the (.+) field holds "([^"]*)"$/,
  async function (this: WebWorld, field: string, text: string) {
    const value = await this.browserPage.evaluate<string | null>(`(() => {
      const input = ${inputByLabel(field)};
      return input ? input.value : null;
    })()`);
    assert.ok(value !== null, `The dialog has no ${field} field.`);
    assert.equal(value, text);
  },
);

// The words announced with the field and shown beneath it, a line for each.
const messagesBeneath = (
  world: WebWorld,
  field: string,
): Promise<string[] | null> =>
  world.browserPage.evaluate<string[] | null>(`(() => {
    const input = ${inputByLabel(field)};
    const id = input?.getAttribute("aria-describedby");
    const message = id ? document.getElementById(id) : null;
    if (!message) return null;
    const spans = [...message.querySelectorAll("span")];
    return (spans.length > 0 ? spans : [message]).map((line) => line.textContent.trim());
  })()`);

Then(
  /^the (.+) field says "([^"]*)"$/,
  async function (this: WebWorld, field: string, words: string) {
    const lines = await messagesBeneath(this, field);
    assert.ok(lines !== null, `The ${field} field says nothing.`);
    assert.ok(
      lines.includes(words),
      `The ${field} field says ${JSON.stringify(lines)}.`,
    );
  },
);

Then("the dialog asks for an email address", async function (this: WebWorld) {
  const input = this.browserPage
    .locator("section.dialog")
    .getByLabel("Email address", { exact: true });
  assert.equal(
    await input.count(),
    1,
    "The dialog has no field labelled Email address.",
  );
  assert.equal(await input.getAttribute("type"), "email");
});

Then("the dialog asks for a password", async function (this: WebWorld) {
  const input = this.browserPage
    .locator("section.dialog")
    .getByLabel("Password", { exact: true });
  assert.equal(
    await input.count(),
    1,
    "The dialog has no field labelled Password.",
  );
  assert.equal(await input.getAttribute("type"), "password");
});

// Above the fields: said in what is above them, and ending before the first.
Then(
  "the message {string} is above the fields",
  async function (this: WebWorld, words: string) {
    const above = await this.browserPage.evaluate<{
      said: string[];
      bottom: number;
      firstField: number;
    } | null>(`(() => {
      const problems = document.querySelector("section.dialog #dialog-problems");
      const first = document.querySelector("section.dialog .field");
      if (!problems || !first) return null;
      return {
        said: [...problems.querySelectorAll("p")].map((p) => p.textContent.trim()),
        bottom: problems.getBoundingClientRect().bottom,
        firstField: first.getBoundingClientRect().top,
      };
    })()`);
    assert.ok(above !== null, "Nothing is said above the fields.");
    assert.ok(
      above.said.includes(words),
      `Above the fields says ${JSON.stringify(above.said)}.`,
    );
    assert.ok(
      above.bottom <= above.firstField + 0.5,
      "What is said is not above the fields.",
    );
  },
);

Then(
  "every word in the dialog is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "section.dialog");
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

Then(
  "the page does not contain {string}",
  async function (this: WebWorld, words: string) {
    const content = await this.browserPage.content();
    assert.ok(!content.includes(words), `The page holds ${words}.`);
  },
);

Then(
  "the page's address does not contain {string}",
  function (this: WebWorld, words: string) {
    assert.ok(
      !decodeURIComponent(this.browserPage.url()).includes(words),
      `The address holds ${words}.`,
    );
  },
);

Then("the dialog asks for a name", async function (this: WebWorld) {
  const input = this.browserPage
    .locator("section.dialog")
    .getByLabel("Name", { exact: true });
  assert.equal(await input.count(), 1, "The dialog has no field for a name.");
  assert.equal(await input.getAttribute("type"), "text");
});

// The account's name is the account's own, typed into a field, so it is left out.
Then(
  "every word in the dialog but the account's name is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "section.dialog", ["input"]);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The account's own words are left out of what is read for marks.
Then(
  "every word on the profile page but the account's own is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "main", [".profile-own"]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

const buttons = ".dialog-buttons :is(a, button)";

Then(
  "the submit button is the first of the dialog's buttons",
  async function (this: WebWorld) {
    const all = this.browserPage.locator(buttons);
    const count = await all.count();
    assert.ok(count > 0, "The dialog has no buttons.");
    const first = all.nth(0);
    assert.equal(
      await first.getAttribute("type"),
      "submit",
      "The first button is not the submit button.",
    );
    const pressed = await first.boundingBox();
    assert.ok(pressed !== null);
    for (let index = 1; index < count; index += 1) {
      const other = await all.nth(index).boundingBox();
      assert.ok(other !== null);
      assert.ok(
        pressed.y <= other.y + 0.5,
        "The submit button is shown beneath another button.",
      );
    }
  },
);

Then(
  "each of the dialog's buttons is as wide as the email address field",
  async function (this: WebWorld) {
    const field = await this.browserPage
      .locator('section.dialog label.field-box[for="field-emailAddress"]')
      .first()
      .boundingBox();
    assert.ok(field !== null, "The email address field is not drawn.");
    const all = await this.browserPage
      .locator(`section.dialog ${buttons}`)
      .all();
    assert.ok(all.length > 0, "The dialog has no buttons.");
    for (const button of all) {
      const drawn = await button.boundingBox();
      assert.ok(drawn !== null, "A button in the dialog is not drawn.");
      assert.ok(
        Math.abs(drawn.width - field.width) <= 0.5,
        `A button is ${drawn.width} pixels wide and the field ${field.width}.`,
      );
    }
  },
);

// A cancel button is a way out of the form to the home page, whatever it says, or
// anything among the dialog's buttons that says Cancel, wherever it goes: either
// would be the button the rule says is not there.
Then("the dialog has no cancel button", async function (this: WebWorld) {
  const all = await this.browserPage.locator(`section.dialog ${buttons}`).all();
  assert.ok(all.length > 0, "The dialog has no buttons at all.");
  for (const button of all) {
    const href = await button.getAttribute("href");
    const said = unmarked(await button.innerText()).trim();
    assert.notEqual(href, "/", `"${said}" goes to the home page.`);
    assert.notEqual(said.toLowerCase(), "cancel", "A button says Cancel.");
  }
});

Then(
  /^the (.+) field is empty$/,
  async function (this: WebWorld, field: string) {
    const value = await this.browserPage.evaluate<string | null>(`(() => {
    const input = ${inputByLabel(field)};
    return input ? input.value : null;
  })()`);
    assert.ok(value !== null, `The dialog has no ${field} field.`);
    assert.equal(value, "");
  },
);

Then("the admin is shown", function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, "/admin/");
});

// The account's address is filled into the words that say where a link will go, so
// it is read inside their marks with them, as any word filled in is; the step says
// it is left out, since that is what the scenario is about.
Then(
  "every word in the dialog but the account's own is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "section.dialog");
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);
