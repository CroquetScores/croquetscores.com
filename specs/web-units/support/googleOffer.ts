// The offer to come in with Google, as a reader sees it and presses it. Here
// rather than beside one feature, because the register page and the sign in
// page both make it, drawn the same way and followed the same way, and what
// differs between them is only which offer is asked about.
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { drawnBesideAButton } from "./buttons.js";
import { englishForScenarios, unmarked } from "./languages.js";

export const callback = "/auth/google/callback";

const dialog = "section.dialog";
const titleBar = `${dialog} .dialog-title`;
const emailAddressField = `${dialog} label.field-box[for="field-emailAddress"]`;
const problems = `${dialog} .dialog-problems`;

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export const boxOf = async (
  world: SpecWorld,
  selector: string,
): Promise<Box> => {
  const found = await world.browserPage.locator(selector).boundingBox();
  assert.ok(found !== null, `Nothing on the page matches ${selector}.`);
  return found;
};

// The words themselves, rather than the element around them: a paragraph runs
// the width of the dialog wherever its words sit in it, so only the words' own
// box can say whether they are centred. Found by what the reader sees, capitals
// and all, so a line whose words are drawn in capitals is found by them.
export const linesSaying = (world: SpecWorld, said: string): Promise<Box[]> =>
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

export const lineSaying = async (
  world: SpecWorld,
  said: string,
): Promise<Box> => {
  const found = await linesSaying(world, said);
  assert.equal(
    found.length,
    1,
    `${found.length} lines in the dialog say ${said}.`,
  );
  return found[0]!;
};

export const offerCount = (world: SpecWorld, offer: string): Promise<number> =>
  world.browserPage.locator(offer).count();

export const offerIsAButton = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const classes = await world.browserPage.locator(offer).getAttribute("class");
  assert.match(classes ?? "", /\bbutton\b/, "The offer is not a button.");
};

export const offerLooksLikeAButton = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const drawn = await drawnBesideAButton(world, offer);
  assert.ok(drawn !== null, "There is no offer, or no row of buttons.");
  assert.deepEqual(drawn.it, drawn.aButton);
};

// Google's mark is the G in its four colours, so it is known by them.
export const offerCarriesGooglesIcon = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const fills: string[] = [];
  for (const path of await world.browserPage
    .locator(`${offer} svg path`)
    .all()) {
    fills.push(((await path.getAttribute("fill")) ?? "").toUpperCase());
  }
  assert.deepEqual(fills.sort(), ["#34A853", "#4285F4", "#EA4335", "#FBBC05"]);
};

export const offerIsInTheDialog = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  assert.equal(
    await world.browserPage.locator(`${dialog} ${offer}`).count(),
    1,
  );
};

export const offerIsBeneathTheTitleBar = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const bar = await boxOf(world, titleBar);
  const button = await boxOf(world, offer);
  assert.ok(
    button.y >= bar.y + bar.height - 0.5,
    "The offer does not start beneath the title bar.",
  );
};

export const offerIsAboveTheEmailAddressField = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const button = await boxOf(world, offer);
  const field = await boxOf(world, emailAddressField);
  assert.ok(
    button.y + button.height <= field.y + 0.5,
    "The offer does not end above the email address field.",
  );
};

export const offerIsAsWideAsTheEmailAddressField = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const button = await boxOf(world, offer);
  const field = await boxOf(world, emailAddressField);
  assert.ok(
    Math.abs(button.width - field.width) <= 0.5,
    `The offer is ${button.width} pixels wide and the field ${field.width}.`,
  );
};

export const messageIsAboveTheOffer = async (
  world: SpecWorld,
  code: string,
  offer: string,
): Promise<void> => {
  const words = englishForScenarios.words[code];
  assert.ok(words !== undefined, `English has no words for ${code}.`);
  const said = await world.browserPage.locator(problems).textContent();
  assert.ok(
    unmarked(said ?? "").includes(words),
    `Above the fields says ${JSON.stringify(said)}.`,
  );
  const message = await boxOf(world, problems);
  const button = await boxOf(world, offer);
  assert.ok(
    message.y + message.height <= button.y + 0.5,
    "The message does not end above the offer.",
  );
};

export const lineIsBeneathTheOffer = async (
  world: SpecWorld,
  said: string,
  offer: string,
): Promise<void> => {
  const button = await boxOf(world, offer);
  const line = await lineSaying(world, said);
  assert.ok(
    line.y >= button.y + button.height - 0.5,
    `${said} does not start beneath the offer.`,
  );
};

// Every way back from Google the reader's browser was sent along, so that a
// scenario can follow one again.
const waysBack = new WeakMap<SpecWorld, string[]>();

export const waysBackFollowed = (world: SpecWorld): readonly string[] =>
  waysBack.get(world) ?? [];

// Pressed as a reader presses it, and followed wherever it leads: to the
// stand-in, back here, and on to wherever the site sends the reader then.
export const pressTheOffer = async (
  world: SpecWorld,
  offer: string,
): Promise<void> => {
  const followed: string[] = [];
  waysBack.set(world, followed);
  world.browserPage.on("request", (request) => {
    if (new URL(request.url()).pathname === callback) {
      followed.push(request.url());
    }
  });
  // The page loaded at the end of the redirects, which is the only one of them
  // a browser commits: waiting for an address instead would be satisfied by
  // the page the offer is on before anything had happened, and the scenario
  // would go on while the way back was still arriving.
  const arrived = world.browserPage.waitForEvent("load");
  await world.browserPage.click(offer);
  await arrived;
  // And what the page it landed on asks for itself, which the admin does as it
  // starts. Each of those requests carries the session cookie and brings it
  // back renewed, so one still on its way when a scenario then signs the
  // reader out would sign them back in again when it arrived.
  await world.browserPage.waitForLoadState("networkidle");
};
