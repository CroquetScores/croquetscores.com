import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { reopenedBrowser } from "../../support/browser.js";

// A browser's usual text is 16 pixels, which is what "its usual size" and every
// percentage below are measured against.
const usualPixels = 16;

// What the text measured at the moment a step wanted to compare against it:
// before a gesture, or before the reader went somewhere else.
const remembered = new WeakMap<SpecWorld, number>();

// What the text measured when the last gesture was done, which is the size a
// reader means by "as it was" when they go somewhere else after making it.
const afterGesture = new WeakMap<SpecWorld, number>();

const textPixels = (world: SpecWorld): Promise<number> =>
  world.browserPage.evaluate<number>(
    "parseFloat(getComputedStyle(document.documentElement).fontSize)",
  );

const remembering = (world: SpecWorld): number => {
  const pixels = remembered.get(world);
  assert.ok(pixels !== undefined, "No text size was noted to compare with.");
  return pixels;
};

// Chromium is told to behave as a touch screen, and fingers are then put on the
// page through the protocol, so that what is tried is what a finger does to the
// browser rather than events written for the page to receive. Two fingers are
// put down either side of the middle of the page, moved to the distance wanted
// in steps, and lifted.
const middle = { x: 200, y: 300 };

const pinch = async (
  world: SpecWorld,
  fromHalfGap: number,
  toHalfGap: number,
): Promise<void> => {
  const session = await world.browserContext!.newCDPSession(world.browserPage);
  await session.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 2,
  });
  const fingers = (halfGap: number) => [
    { x: middle.x - halfGap, y: middle.y, id: 1 },
    { x: middle.x + halfGap, y: middle.y, id: 2 },
  ];

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: fingers(fromHalfGap),
  });
  const steps = 10;
  for (let step = 1; step <= steps; step++) {
    const halfGap = fromHalfGap + ((toHalfGap - fromHalfGap) * step) / steps;
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: fingers(halfGap),
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
};

const gesture = (fromHalfGap: number, toHalfGap: number) =>
  async function (this: SpecWorld): Promise<void> {
    remembered.set(this, await textPixels(this));
    await pinch(this, fromHalfGap, toHalfGap);
    afterGesture.set(this, await textPixels(this));
  };

// 40 pixels either side is a comfortable pair of fingers on a 400 pixel screen.
// A long way is far enough to be past either limit, however the page scales.
Given("two fingers are pulled apart", gesture(40, 60));
Given("two fingers are pinched together", gesture(60, 40));
When("two fingers are pulled apart a long way", gesture(10, 190));
When("two fingers are pinched together a long way", gesture(190, 10));

When("one finger is dragged down the page", async function (this: SpecWorld) {
  remembered.set(this, await textPixels(this));
  const session = await this.browserContext!.newCDPSession(this.browserPage);
  await session.send("Emulation.setTouchEmulationEnabled", {
    enabled: true,
    maxTouchPoints: 2,
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: middle.x, y: 200, id: 1 }],
  });
  for (let y = 220; y <= 400; y += 20) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: middle.x, y, id: 1 }],
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await session.detach();
});

Given("the help page is open", async function (this: SpecWorld) {
  await this.browserPage.goto(`${this.baseUrl!}/help`);
});

When("the help page is opened", async function (this: SpecWorld) {
  remembered.set(this, await textPixels(this));
  await this.browserPage.goto(`${this.baseUrl!}/help`);
});

When(
  "the browser is closed and opened again with what pages stored in it",
  async function (this: SpecWorld) {
    remembered.set(this, await textPixels(this));
    await reopenedBrowser(this);
  },
);

Then("the text is larger than it was", async function (this: SpecWorld) {
  assert.ok(
    (await textPixels(this)) > (remembered.get(this) ?? usualPixels),
    "The text did not grow.",
  );
});

Then("the text is smaller than it was", async function (this: SpecWorld) {
  assert.ok(
    (await textPixels(this)) < (remembered.get(this) ?? usualPixels),
    "The text did not shrink.",
  );
});

Then("the text is its usual size", async function (this: SpecWorld) {
  assert.equal(await textPixels(this), usualPixels);
});

Then(
  "the text is {int} percent of its usual size",
  async function (this: SpecWorld, percent: number) {
    assert.equal(await textPixels(this), (usualPixels * percent) / 100);
  },
);

Then(
  "the text is as large as it was on the home page",
  async function (this: SpecWorld) {
    const pixels = afterGesture.get(this);
    assert.ok(pixels !== undefined, "No text size was made on the home page.");
    assert.equal(await textPixels(this), pixels);
  },
);

Then(
  "the text is as large as it was before the browser was closed",
  async function (this: SpecWorld) {
    assert.equal(await textPixels(this), remembering(this));
  },
);

// What the browser itself has done to the page, which is not the same as the
// text being larger: its own zoom would have shown here as a scale.
Then("the page is not zoomed", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.evaluate<number>("window.visualViewport.scale"),
    1,
  );
});

Then("the page is no wider than the screen", async function (this: SpecWorld) {
  const [content, screen] = await this.browserPage.evaluate<[number, number]>(
    "[document.documentElement.scrollWidth, document.documentElement.clientWidth]",
  );
  assert.ok(content <= screen, `The page is ${content} pixels in ${screen}.`);
});
