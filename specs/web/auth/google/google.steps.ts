import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { anApplicationWithoutGoogle } from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";
import { standInGoogleFor } from "../../../infrastructure/support/google.js";
import type { SpecWorld } from "../../../support/world.js";

const offer = 'a[href="/auth/google"]';
const callback = "/auth/google/callback";

// Every way back from Google the reader's browser was sent along, so that a
// scenario can follow one again.
const waysBack = new WeakMap<SpecWorld, string[]>();

Given(
  "a site that has not been given Google's credentials",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationWithoutGoogle(this);
  },
);

Then(
  "the page offers registering with Google",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(offer).count(), 1);
  },
);

Then(
  "the page does not offer registering with Google",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(offer).count(), 0);
  },
);

const dialog = "section.dialog";
const titleBar = `${dialog} .dialog-title`;
const emailAddressField = `${dialog} label.field-box[for="field-emailAddress"]`;
const cancelButton = `${dialog} .dialog-buttons .button:not(.button-submit)`;
const problems = `${dialog} .dialog-problems`;

interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

const boxOf = async (world: SpecWorld, selector: string): Promise<Box> => {
  const found = await world.browserPage.locator(selector).boundingBox();
  assert.ok(found !== null, `Nothing on the page matches ${selector}.`);
  return found;
};

// The words themselves, rather than the element around them: a paragraph runs
// the width of the dialog wherever its words sit in it, so only the words' own
// box can say whether they are centred. Found by what the reader sees, capitals
// and all, so a line whose words are drawn in capitals is found by them.
const linesSaying = (world: SpecWorld, said: string): Promise<Box[]> =>
  world.browserPage.evaluate<Box[]>(`(() => {
    const said = ${JSON.stringify(said)};
    return [...document.querySelectorAll(${JSON.stringify(`${dialog} *`)})]
      .filter((each) => each instanceof HTMLElement && each.children.length === 0 && each.innerText.trim() === said)
      .map((each) => {
        const words = document.createRange();
        words.selectNodeContents(each);
        const { x, y, width, height } = words.getBoundingClientRect();
        return { x, y, width, height };
      });
  })()`);

const lineSaying = async (world: SpecWorld, said: string): Promise<Box> => {
  const found = await linesSaying(world, said);
  assert.equal(
    found.length,
    1,
    `${found.length} lines in the dialog say ${said}.`,
  );
  return found[0]!;
};

Then(
  "the offer to register with Google is a button",
  async function (this: SpecWorld) {
    const classes = await this.browserPage.locator(offer).getAttribute("class");
    assert.match(classes ?? "", /\bbutton\b/, "The offer is not a button.");
  },
);

// Every part of how a button is drawn, read from what the browser drew rather
// than from the classes, so that a rule written for one and not the other shows.
const drawn = [
  "background-color",
  "color",
  "border-top-width",
  "border-top-style",
  "border-top-color",
  "border-radius",
  "font-family",
  "font-size",
  "font-weight",
  "min-height",
];

Then(
  "the offer to register with Google looks like the cancel button",
  async function (this: SpecWorld) {
    const styleOf = (selector: string) =>
      this.browserPage.evaluate<Record<string, string> | null>(`(() => {
        const element = document.querySelector(${JSON.stringify(selector)});
        if (!element) return null;
        const style = getComputedStyle(element);
        return Object.fromEntries(
          ${JSON.stringify(drawn)}.map((name) => [name, style.getPropertyValue(name)]),
        );
      })()`);
    assert.deepEqual(await styleOf(offer), await styleOf(cancelButton));
  },
);

// Google's mark is the G in its four colours, so it is known by them.
Then(
  "the offer to register with Google carries Google's icon",
  async function (this: SpecWorld) {
    const fills: string[] = [];
    for (const path of await this.browserPage
      .locator(`${offer} svg path`)
      .all()) {
      fills.push(((await path.getAttribute("fill")) ?? "").toUpperCase());
    }
    assert.deepEqual(fills.sort(), [
      "#34A853",
      "#4285F4",
      "#EA4335",
      "#FBBC05",
    ]);
  },
);

Then(
  "the offer to register with Google is in the dialog",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator(`${dialog} ${offer}`).count(),
      1,
    );
  },
);

Then(
  "the offer to register with Google is beneath the dialog's title bar",
  async function (this: SpecWorld) {
    const bar = await boxOf(this, titleBar);
    const button = await boxOf(this, offer);
    assert.ok(
      button.y >= bar.y + bar.height - 0.5,
      "The offer does not start beneath the title bar.",
    );
  },
);

Then(
  "the offer to register with Google is above the email address field",
  async function (this: SpecWorld) {
    const button = await boxOf(this, offer);
    const field = await boxOf(this, emailAddressField);
    assert.ok(
      button.y + button.height <= field.y + 0.5,
      "The offer does not end above the email address field.",
    );
  },
);

Then(
  "the offer to register with Google is as wide as the email address field",
  async function (this: SpecWorld) {
    const button = await boxOf(this, offer);
    const field = await boxOf(this, emailAddressField);
    assert.ok(
      Math.abs(button.width - field.width) <= 0.5,
      `The offer is ${button.width} pixels wide and the field ${field.width}.`,
    );
  },
);

Then(
  "the message for {string} is above the offer to register with Google",
  async function (this: SpecWorld, code: string) {
    const words = englishForScenarios.words[code];
    assert.ok(words !== undefined, `English has no words for ${code}.`);
    const said = await this.browserPage.locator(problems).textContent();
    assert.ok(
      unmarked(said ?? "").includes(words),
      `Above the fields says ${JSON.stringify(said)}.`,
    );
    const message = await boxOf(this, problems);
    const button = await boxOf(this, offer);
    assert.ok(
      message.y + message.height <= button.y + 0.5,
      "The message does not end above the offer.",
    );
  },
);

Then(
  "the line saying {string} is beneath the offer to register with Google",
  async function (this: SpecWorld, said: string) {
    const button = await boxOf(this, offer);
    const line = await lineSaying(this, said);
    assert.ok(
      line.y >= button.y + button.height - 0.5,
      `${said} does not start beneath the offer.`,
    );
  },
);

Then(
  "the line saying {string} is above the email address field",
  async function (this: SpecWorld, said: string) {
    const line = await lineSaying(this, said);
    const field = await boxOf(this, emailAddressField);
    assert.ok(
      line.y + line.height <= field.y + 0.5,
      `${said} does not end above the email address field.`,
    );
  },
);

Then(
  "the line saying {string} is centred in the dialog",
  async function (this: SpecWorld, said: string) {
    const line = await lineSaying(this, said);
    const shape = await boxOf(this, dialog);
    const left = line.x - shape.x;
    const right = shape.x + shape.width - (line.x + line.width);
    assert.ok(
      Math.abs(left - right) <= 1,
      `${said} has ${Math.round(left)} pixels to its left and ${Math.round(right)} to its right.`,
    );
  },
);

Then(
  "the dialog has no line saying {string}",
  async function (this: SpecWorld, said: string) {
    assert.deepEqual(await linesSaying(this, said), []);
  },
);

// Pressed as a reader presses it, and followed wherever it leads: to the
// stand-in, back here, and on to wherever the site sends the reader then.
const registerWithGoogle = async function (this: SpecWorld): Promise<void> {
  const followed: string[] = [];
  waysBack.set(this, followed);
  this.browserPage.on("request", (request) => {
    if (new URL(request.url()).pathname === callback) {
      followed.push(request.url());
    }
  });
  // The page loaded at the end of the redirects, which is the only one of them
  // a browser commits: waiting for an address instead would be satisfied by
  // the register page before anything had happened, and the scenario would go
  // on while the way back was still arriving.
  const arrived = this.browserPage.waitForEvent("load");
  await this.browserPage.click(offer);
  await arrived;
  // And what the page it landed on asks for itself, which the admin does as it
  // starts. Each of those requests carries the session cookie and brings it
  // back renewed, so one still on its way when a scenario then signs the
  // reader out would sign them back in again when it arrived.
  await this.browserPage.waitForLoadState("networkidle");
};

// The scenario's own stand-in, which its application was pointed at when the
// scenario began.
Given(
  "Google will take a code more than once",
  async function (this: SpecWorld) {
    const google = await standInGoogleFor(this);
    google.misbehaving = { ...google.misbehaving, takesCodesAgain: true };
  },
);

When("the reader registers with Google", registerWithGoogle);
Given("the reader has registered with Google", registerWithGoogle);

When(
  "the reader follows the same way back from Google again",
  async function (this: SpecWorld) {
    const followed = waysBack.get(this)?.at(-1);
    assert.ok(followed !== undefined, "No way back from Google was followed.");
    await this.browserPage.goto(followed);
  },
);

// A code Google would take, for the reader the scenario has Google say, sent
// back here by a browser this site never sent to Google: what a page
// elsewhere would send a reader's browser along.
When(
  "the reader arrives back from Google without having been sent there",
  async function (this: SpecWorld) {
    const code = (await standInGoogleFor(this)).aCodeNobodyWasSentFor();
    await this.browserPage.goto(
      `${this.baseUrl!}${callback}?code=${encodeURIComponent(code)}&state=made-up-elsewhere`,
    );
  },
);
