// A commentary's page, in a real browser: its comments as they are drawn, and
// the box its writer writes the next one in, typed in as a reader types and
// sent by its button.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { withScripting } from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const comments = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .comments > .comment");

const commentAt = (world: SpecWorld, which: string): Locator =>
  comments(world).nth(["first", "second", "third"].indexOf(which));

const box = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .comment-box");

const textOf = async (found: Locator): Promise<string> =>
  unmarked((await found.textContent()) ?? "").trim();

// What was typed into the box last, kept here rather than on the world, which
// has no business knowing what a comment is.
const typedIn = new WeakMap<SpecWorld, string>();

const typeComment = async (world: SpecWorld, text: string): Promise<void> => {
  await box(world).fill(text);
  typedIn.set(world, text);
};

// The commentary ---------------------------------------------------------------

Then(
  "the commentary is shown as written by {string}",
  async function (this: SpecWorld, writer: string) {
    assert.equal(
      await textOf(this.browserPage.locator("main .commentary-writer")),
      writer,
    );
  },
);

Then(
  "the commentary page says there are no comments",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .comments-none").count(),
      1,
    );
  },
);

Then(
  /^the (first|second|third) comment says "(.*)"$/,
  async function (this: SpecWorld, which: string, text: string) {
    assert.equal(
      await textOf(commentAt(this, which).locator(".comment-text")),
      text,
    );
  },
);

Then(
  /^the (first|second|third) comment draws "(.*)" bold$/,
  async function (this: SpecWorld, which: string, text: string) {
    const bold = commentAt(this, which).locator(".comment-text strong");
    assert.equal(await textOf(bold), text);
  },
);

const linkIn = (world: SpecWorld, which: string, name: string): Locator =>
  commentAt(world, which)
    .locator(".comment-text")
    .getByRole("link", { name, exact: true });

Then(
  /^the (first|second|third) comment's link "(.*)" leads to "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string, href: string) {
    assert.equal(await linkIn(this, which, name).getAttribute("href"), href);
  },
);

// Marked as somebody else's, which a search engine gives nothing to.
Then(
  /^the (first|second|third) comment's link "(.*)" is marked as not vouched for$/,
  async function (this: SpecWorld, which: string, name: string) {
    const rel = (
      (await linkIn(this, which, name).getAttribute("rel")) ?? ""
    ).split(/\s+/);
    assert.ok(rel.includes("nofollow"), `It is marked ${rel.join(" ")}.`);
    assert.ok(rel.includes("ugc"), `It is marked ${rel.join(" ")}.`);
  },
);

Then(
  /^the (first|second|third) comment was written "(.*)" ago$/,
  async function (this: SpecWorld, which: string, ago: string) {
    assert.equal(
      await textOf(commentAt(this, which).locator(".comment-ago")),
      ago,
    );
  },
);

Then(
  /^the (first|second|third) comment (says|does not say) it has been edited$/,
  async function (this: SpecWorld, which: string, says: string) {
    const edited = commentAt(this, which).locator(".comment-edited");
    assert.equal(await edited.count(), says === "says" ? 1 : 0);
    if (says === "says") {
      assert.equal(await textOf(edited), words("commentary.edited"));
    }
  },
);

Then(
  /^the (first|second|third) comment (offers|does not offer) a way to edit it$/,
  async function (this: SpecWorld, which: string, offers: string) {
    assert.equal(
      await commentAt(this, which).locator(".comment-edit").count(),
      offers === "offers" ? 1 : 0,
    );
  },
);

// The pencil and the trash can, each found by what it is for.
const WAYS: Readonly<Record<string, string>> = {
  edit: ".comment-edit",
  delete: ".comment-delete",
};

const SHAPES: Readonly<Record<string, string>> = {
  pencil: ".icon-pencil",
  "trash can": ".icon-trash-can",
};

const wayTo = (world: SpecWorld, way: string, which: string): Locator => {
  const found = WAYS[way];
  assert.ok(found !== undefined, `There is no way to ${way} a comment.`);
  return commentAt(world, which).locator(found);
};

When(
  /^the way to (edit|delete) the (first|second|third) comment is pressed$/,
  async function (this: SpecWorld, way: string, which: string) {
    await wayTo(this, way, which).click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  /^the (first|second|third) comment (offers|does not offer) a way to delete it$/,
  async function (this: SpecWorld, which: string, offers: string) {
    assert.equal(
      await wayTo(this, "delete", which).count(),
      offers === "offers" ? 1 : 0,
    );
  },
);

// Drawn as the shape, and named for a reader who cannot see it.
Then(
  /^the way to (edit|delete) the (first|second|third) comment is a (pencil|trash can) named "(.*)"$/,
  async function (
    this: SpecWorld,
    way: string,
    which: string,
    shape: string,
    name: string,
  ) {
    const found = wayTo(this, way, which);
    assert.equal(await found.locator(SHAPES[shape]!).count(), 1);
    assert.equal(
      await commentAt(this, which)
        .getByRole("link", { name, exact: true })
        .getAttribute("class"),
      await found.getAttribute("class"),
    );
  },
);

// To its right, on the same line, where a reader comes to it after the pencil.
Then(
  /^the way to delete the (first|second|third) comment comes after the way to edit it$/,
  async function (this: SpecWorld, which: string) {
    const pencil = await wayTo(this, "edit", which).boundingBox();
    const trash = await wayTo(this, "delete", which).boundingBox();
    assert.ok(pencil !== null && trash !== null, "One of them is not drawn.");
    assert.ok(
      trash.x >= pencil.x + pencil.width,
      "The trash can is not after the pencil.",
    );
  },
);

Given(
  "the page at {string} is open with scripting on",
  async function (this: SpecWorld, path: string) {
    await withScripting(this);
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

// The page is sent away by the keys, so the next step waits for the page it
// is sent to.
When(
  /^(Control|Meta) and Enter are pressed in the comment box$/,
  async function (this: SpecWorld, key: string) {
    await Promise.all([
      this.browserPage.waitForEvent("framenavigated"),
      box(this).press(`${key}+Enter`),
    ]);
    await this.browserPage.waitForLoadState();
  },
);

When("Enter is pressed in the comment box", async function (this: SpecWorld) {
  await box(this).press("Enter");
});

// The box ------------------------------------------------------------------------

Then(
  /^the page (offers|does not offer) a box to write a comment$/,
  async function (this: SpecWorld, offers: string) {
    assert.equal(await box(this).count(), offers === "offers" ? 1 : 0);
  },
);

Then(
  "the comment box is {int} lines tall",
  async function (this: SpecWorld, lines: number) {
    assert.equal(await box(this).getAttribute("rows"), String(lines));
  },
);

// Later in the page than the last comment, which is where it is read.
Then(
  "the comment box comes after the last comment",
  async function (this: SpecWorld) {
    const last = await comments(this).last().boundingBox();
    const at = await box(this).boundingBox();
    assert.ok(last !== null && at !== null, "One of them is not drawn.");
    assert.ok(
      at.y >= last.y + last.height,
      "The comment box is not beneath the last comment.",
    );
  },
);

Given(
  "the comment {string} is typed",
  async function (this: SpecWorld, text: string) {
    await typeComment(this, text);
  },
);

Given(
  "a comment of {int} characters is typed",
  async function (this: SpecWorld, length: number) {
    await typeComment(this, "a".repeat(length));
  },
);

// Filling a box takes away what it held first, as a reader selecting it all
// and typing over it does.
Given(
  "the comment {string} is typed in place of what it held",
  async function (this: SpecWorld, text: string) {
    await typeComment(this, text);
  },
);

Given(
  "a comment of {int} characters is typed in place of what it held",
  async function (this: SpecWorld, length: number) {
    await typeComment(this, "a".repeat(length));
  },
);

When("the comment is submitted", async function (this: SpecWorld) {
  await this.browserPage.locator("main .comment-form button").click();
  await this.browserPage.waitForLoadState();
});

Then("the comment box is empty", async function (this: SpecWorld) {
  assert.equal(await box(this).inputValue(), "");
});

Then(
  "the comment box holds {string}",
  async function (this: SpecWorld, text: string) {
    assert.equal(await box(this).inputValue(), text);
  },
);

Then("the comment box holds what was typed", async function (this: SpecWorld) {
  const typed = typedIn.get(this);
  assert.ok(typed !== undefined, "Nothing was typed into the comment box.");
  assert.equal(await box(this).inputValue(), typed);
});

// Beneath it, and read out with it.
Then(
  "the comment box says the message for {string}",
  async function (this: SpecWorld, code: string) {
    const id = await box(this).getAttribute("aria-describedby");
    assert.ok(id !== null, "The comment box says nothing.");
    const said = await textOf(this.browserPage.locator(`#${id}`));
    assert.equal(said, words(code));
  },
);
