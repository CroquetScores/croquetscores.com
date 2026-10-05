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
// once the page has loaded. With scripting, a comment can be added to the page
// in place, after it has loaded, so what reads a comment waits for it to be
// there before reading it.

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const comments = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .comments > .comment");

const commentAt = (world: SpecWorld, which: string): Locator =>
  which === "last"
    ? comments(world).last()
    : comments(world).nth(["first", "second", "third"].indexOf(which));

const box = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .comment-box");

// The words exactly, rather than anything whose words hold them.
const exactly = (words: string): RegExp =>
  new RegExp(`^\\s*${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);

// Waited for a moment to be there, and not refused for being late: the step
// that follows says whether it is there, and says it better.
const settled = async (found: Locator): Promise<void> => {
  try {
    await found.first().waitFor({ timeout: 5000 });
  } catch {
    // Said by the step that waited.
  }
};

// Read once it is there, which a comment added in place is only shortly after
// it was sent.
const textOf = async (found: Locator): Promise<string> => {
  await found.first().waitFor();
  return unmarked((await found.textContent()) ?? "").trim();
};

// What was typed into the box last, kept here rather than on the world, which
// has no business knowing what a comment is.
const typedIn = new WeakMap<SpecWorld, string>();

const typeComment = async (world: SpecWorld, text: string): Promise<void> => {
  await box(world).fill(text);
  typedIn.set(world, text);
};

// Whatever sends the box, then waited on until what it sent is answered and
// the page has settled: a comment added in place is answered without the page
// being loaded again, and one sent as a form is answered by the page that
// follows, so it is the answer to the post that is waited for, either way.
const sent = async (
  world: SpecWorld,
  sending: () => Promise<void>,
): Promise<void> => {
  const page = world.browserPage;
  // The post answered with something other than a way elsewhere — the page
  // loaded again for it, the comment or what is wrong with it to add in place,
  // or an error — or else the page going elsewhere, as a writer signed out
  // since is sent to sign in.
  const answered = Promise.race([
    page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        (response.request().isNavigationRequest() ||
          response.status() < 300 ||
          response.status() >= 400),
    ),
    page.waitForEvent("framenavigated"),
  ]);
  const [answer] = await Promise.all([answered, sending()]);
  // Answered in place, the page has what it needs once the answer is in: a
  // step that reads what it drew waits for it. A page loaded again is waited
  // on until it has settled.
  const inPlace =
    "request" in answer && !answer.request().isNavigationRequest();
  if (!inPlace) {
    await page.waitForLoadState("networkidle");
    return;
  }
  // An answer that is an error leaves the page to decide what to do next, and
  // it is given a moment to have done it, so that a page that sends the
  // comment again is caught sending it rather than missed.
  if (answer.status() >= 400 && answer.status() !== 422) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.waitForLoadState("networkidle");
  }
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
  /^the commentary page (says|does not say) there are no comments$/,
  async function (this: SpecWorld, says: string) {
    if (says === "says") {
      await settled(this.browserPage.locator("main .comments-none"));
    }
    assert.equal(
      await this.browserPage.locator("main .comments-none").count(),
      says === "says" ? 1 : 0,
    );
  },
);

// Something the page holds only while it is not loaded again, so that a page
// drawn again, which would be a new one, is told from the one remembered.
Given("the page as it is now is remembered", async function (this: SpecWorld) {
  await this.browserPage.evaluate("globalThis.rememberedByTheScenario = true");
});

Then("the page is the one remembered", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.evaluate(
      "globalThis.rememberedByTheScenario === true",
    ),
    true,
    "The page has been drawn again.",
  );
});

Then(
  /^the (first|second|third|last) comment says "(.*)"$/,
  async function (this: SpecWorld, which: string, text: string) {
    const said = commentAt(this, which).locator(".comment-text");
    // A comment drawn again since the page loaded, as one asked for again is,
    // says what it says only once it has been drawn, so it is given a moment.
    await settled(said.filter({ hasText: exactly(text) }));
    assert.equal(await textOf(said), text);
  },
);

Then(
  /^the (first|second|third|last) comment draws "(.*)" bold$/,
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
  /^the (first|second|third|last) comment's link "(.*)" leads to "(.*)"$/,
  async function (this: SpecWorld, which: string, name: string, href: string) {
    assert.equal(await linkIn(this, which, name).getAttribute("href"), href);
  },
);

// Marked as somebody else's, which a search engine gives nothing to.
Then(
  /^the (first|second|third|last) comment's link "(.*)" is marked as not vouched for$/,
  async function (this: SpecWorld, which: string, name: string) {
    const rel = (
      (await linkIn(this, which, name).getAttribute("rel")) ?? ""
    ).split(/\s+/);
    assert.ok(rel.includes("nofollow"), `It is marked ${rel.join(" ")}.`);
    assert.ok(rel.includes("ugc"), `It is marked ${rel.join(" ")}.`);
  },
);

Then(
  /^the (first|second|third|last) comment was written "(.*)" ago$/,
  async function (this: SpecWorld, which: string, ago: string) {
    assert.equal(
      await textOf(commentAt(this, which).locator(".comment-ago")),
      ago,
    );
  },
);

Then(
  /^the (first|second|third|last) comment (says|does not say) it has been edited$/,
  async function (this: SpecWorld, which: string, says: string) {
    const edited = commentAt(this, which).locator(".comment-edited");
    assert.equal(await edited.count(), says === "says" ? 1 : 0);
    if (says === "says") {
      assert.equal(await textOf(edited), words("commentary.edited"));
    }
  },
);

Then(
  /^the (first|second|third|last) comment (offers|does not offer) a way to edit it$/,
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
  /^the way to (edit|delete) the (first|second|third|last) comment is pressed$/,
  async function (this: SpecWorld, way: string, which: string) {
    await wayTo(this, way, which).click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  /^the (first|second|third|last) comment (offers|does not offer) a way to delete it$/,
  async function (this: SpecWorld, which: string, offers: string) {
    assert.equal(
      await wayTo(this, "delete", which).count(),
      offers === "offers" ? 1 : 0,
    );
  },
);

// Drawn as the shape, and named for a reader who cannot see it.
Then(
  /^the way to (edit|delete) the (first|second|third|last) comment is a (pencil|trash can) named "(.*)"$/,
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
  /^the way to delete the (first|second|third|last) comment comes after the way to edit it$/,
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
    await sent(this, () => box(this).press(`${key}+Enter`));
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
  await sent(this, () =>
    this.browserPage.locator("main .comment-form button").click(),
  );
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
    await this.browserPage
      .locator("main .comment-box[aria-describedby]")
      .waitFor();
    const id = await box(this).getAttribute("aria-describedby");
    assert.ok(id !== null, "The comment box says nothing.");
    const said = await textOf(this.browserPage.locator(`#${id}`));
    assert.equal(said, words(code));
  },
);

// The window ----------------------------------------------------------------------

Given("the page is scrolled to its top", async function (this: SpecWorld) {
  await this.browserPage.evaluate("globalThis.scrollTo(0, 0)");
});

const windowHeight = (world: SpecWorld): number => {
  const size = world.browserPage.viewportSize();
  assert.ok(size !== null, "The browser has no window size.");
  return size.height;
};

// Its foot on the window's, to the pixel a browser rounds to.
Then(
  "the Add comment button is at the bottom of the window",
  async function (this: SpecWorld) {
    const button = await this.browserPage
      .locator("main .comment-form-add button")
      .boundingBox();
    assert.ok(button !== null, "The Add comment button is not drawn.");
    const foot = button.y + button.height;
    assert.ok(
      Math.abs(foot - windowHeight(this)) <= 1,
      `The button's foot is at ${String(foot)}, and the window's at ${String(windowHeight(this))}.`,
    );
  },
);

// Time --------------------------------------------------------------------------------

Given("the browser has scripting on", async function (this: SpecWorld) {
  await withScripting(this);
});

// The browser's clock moves only when the scenario says time passes, so that a
// quarter of a minute is a quarter of a minute without waiting one.
Given(
  "the browser's clock is held by the scenario",
  async function (this: SpecWorld) {
    await this.browserPage.clock.install();
  },
);

// Long enough for the page to ask for the comments again, and waited on until
// it has been answered.
When("a quarter of a minute passes", async function (this: SpecWorld) {
  await Promise.all([
    this.browserPage.waitForResponse(
      (response) =>
        response.request().method() === "GET" &&
        new URL(response.url()).pathname.endsWith("/comments"),
    ),
    this.browserPage.clock.runFor(15_000),
  ]);
});

When(
  "{int} seconds pass on the browser's clock",
  async function (this: SpecWorld, seconds: number) {
    await this.browserPage.clock.runFor(seconds * 1000);
  },
);

// What the server answers, held back or spoilt --------------------------------------

// The next comment sent is kept by the server, as any is, and its answer then
// lost to an error, as one would be by a failure after it was kept.
Given(
  "the next comment sent is kept and answered with a server error",
  async function (this: SpecWorld) {
    await this.browserPage.route(
      (url) => url.pathname.endsWith("/comments"),
      async (route) => {
        if (route.request().method() !== "POST") return route.fallback();
        await route.fetch();
        await route.fulfill({
          status: 500,
          contentType: "text/html",
          body: "Something went wrong.",
        });
      },
      { times: 1 },
    );
  },
);

// What the server answers about the comments as they are when the page asks,
// kept back until the scenario lets it through.
const heldBack = new WeakMap<SpecWorld, () => Promise<void>>();

Given(
  "the next answer about the comments is held back",
  async function (this: SpecWorld) {
    await this.browserPage.route(
      (url) => url.pathname.endsWith("/comments"),
      async (route) => {
        if (route.request().method() !== "GET") return route.fallback();
        const answer = await route.fetch();
        heldBack.set(this, () => route.fulfill({ response: answer }));
      },
      { times: 1 },
    );
  },
);

When("the answer held back is let through", async function (this: SpecWorld) {
  const letThrough = heldBack.get(this);
  assert.ok(letThrough !== undefined, "No answer was held back.");
  await letThrough();
  // Long enough for the page to have read the answer and drawn it, were it
  // going to: nothing on the page says it has decided not to.
  await new Promise((resolve) => setTimeout(resolve, 500));
});

// The focus ----------------------------------------------------------------------------

Given(
  /^the way to (edit|delete) the (first|second|third|last) comment is given the focus$/,
  async function (this: SpecWorld, way: string, which: string) {
    await wayTo(this, way, which).focus();
  },
);

Then(
  /^the way to (edit|delete) the (first|second|third|last) comment has the focus$/,
  async function (this: SpecWorld, way: string, which: string) {
    // Told apart by where it leads and what it is, which no other link on the
    // page has both of.
    const focused = await this.browserPage.evaluate(
      "(() => { const active = document.activeElement; return active ? active.className + ' ' + active.getAttribute('href') : ''; })()",
    );
    const found = wayTo(this, way, which);
    assert.equal(
      focused,
      `${(await found.getAttribute("class")) ?? ""} ${(await found.getAttribute("href")) ?? ""}`,
      "It does not have the focus.",
    );
  },
);

Then(
  "the comment box says the words for {string}",
  async function (this: SpecWorld, key: string) {
    await this.browserPage
      .locator("main .comment-box[aria-describedby]")
      .waitFor();
    const id = await box(this).getAttribute("aria-describedby");
    assert.equal(await textOf(this.browserPage.locator(`#${id!}`)), words(key));
  },
);

// What the server keeps of the next comment sent, as it would, with its
// answer kept back until the scenario lets it through.
Given(
  "the answer to the next comment sent is held back",
  async function (this: SpecWorld) {
    await this.browserPage.route(
      (url) => url.pathname.endsWith("/comments"),
      async (route) => {
        if (route.request().method() !== "POST") return route.fallback();
        const answer = await route.fetch();
        heldBack.set(this, () => route.fulfill({ response: answer }));
      },
      { times: 1 },
    );
  },
);

// Pressed and not waited on, for a scenario that holds the answer back.
Given("the Add comment button is pressed", async function (this: SpecWorld) {
  await this.browserPage.locator("main .comment-form-add button").click();
});

Then(
  "the comment {string} is shown once",
  async function (this: SpecWorld, text: string) {
    assert.equal(
      await comments(this)
        .locator(".comment-text", { hasText: exactly(text) })
        .count(),
      1,
    );
  },
);

// Where the theme and the language a reader chooses on the page send them
// back to once chosen.
Then(
  "the theme and the language chosen return to {string}",
  async function (this: SpecWorld, path: string) {
    const fields = await this.browserPage
      .locator('form input[name="return"]')
      .all();
    assert.ok(
      fields.length > 0,
      "The page offers no choice of theme or language.",
    );
    const returns = await Promise.all(
      fields.map((field) => field.getAttribute("value")),
    );
    for (const each of returns) {
      assert.equal(decodeURI(String(each)), path);
    }
  },
);

// A line of what the comment says as it is laid out, line breaks and all.
Then(
  /^the (first|second|third|last) comment shows the line "(.*)"$/,
  async function (this: SpecWorld, which: string, line: string) {
    const said = commentAt(this, which).locator(".comment-text");
    await said.waitFor();
    const lines = unmarked(await said.innerText())
      .split("\n")
      .map((each) => each.trim());
    assert.ok(lines.includes(line), `It shows ${JSON.stringify(lines)}.`);
  },
);

Then(
  /^the (first|second|third|last) comment draws no numbered list$/,
  async function (this: SpecWorld, which: string) {
    assert.equal(
      await commentAt(this, which).locator(".comment-text ol").count(),
      0,
    );
  },
);

Then(
  /^the (first|second|third|last) comment has no link$/,
  async function (this: SpecWorld, which: string) {
    assert.equal(
      await commentAt(this, which).locator(".comment-text a").count(),
      0,
    );
  },
);

Then(
  /^the (first|second|third|last) comment's code says "(.*)"$/,
  async function (this: SpecWorld, which: string, text: string) {
    assert.equal(
      await textOf(commentAt(this, which).locator(".comment-text code")),
      text,
    );
  },
);

Then(
  /^the (first|second|third|last) comment's code shows the line "(.*)"$/,
  async function (this: SpecWorld, which: string, line: string) {
    const code = commentAt(this, which).locator(".comment-text code");
    await code.first().waitFor();
    const lines = ((await code.first().textContent()) ?? "")
      .split("\n")
      .map((each) => each.trim());
    assert.ok(lines.includes(line), `It shows ${JSON.stringify(lines)}.`);
  },
);
