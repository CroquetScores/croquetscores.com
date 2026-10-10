import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AddComment } from "../../../../src/application/operations/commentaries/AddComment.js";
import { DeleteComment } from "../../../../src/application/operations/commentaries/DeleteComment.js";
import { EditComment } from "../../../../src/application/operations/commentaries/EditComment.js";
import { StartCommentary } from "../../../../src/application/operations/tournaments/StartCommentary.js";
import type { CommentId } from "../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  accountFor,
  inHandOf,
  lookAt,
  momentOf,
  tournamentNamed,
} from "../tournaments/aRequest.js";
import {
  commentaryIn,
  commentSaying,
  commentWritten,
  loadCommentary,
  rememberComment,
} from "./commentaryRequests.js";
import { charactersIn } from "../../../../src/domain/common/charactersIn.js";

// The steps more than one of a commentary's operations uses: what was done
// before the request the scenario is about, and what the commentary is
// afterwards. Each operation's own steps are beside its feature, in the
// folder named for it. Each is done as the account for an address, and not
// refused: a scenario that says it was done is not about whether it could be.

// What was done before ---------------------------------------------------------

Given(
  "{string} has started the commentary {string} on {string}",
  async function (
    this: SpecWorld,
    address: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    await inHandOf(this).send(
      new StartCommentary(account, tournament.value, title, momentOf(this)),
    );
    await lookAt(this, tournament);
  },
);

Given(
  "{string} has added the comment {string} to {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    text: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    const commentary = await commentaryIn(this, tournament, title);
    // A scenario cannot write a line break inside a step's quotes, so it
    // writes "\n", which is sent as the line break it stands for.
    const id: CommentId = await inHandOf(this).send(
      new AddComment(
        account,
        tournament.value,
        commentary.value,
        text.replaceAll("\\n", "\n"),
        momentOf(this),
      ),
    );
    rememberComment(this, text, { id, tournament, commentary });
  },
);

Given(
  "{string} has edited the comment {string} in {string} of {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    text: string,
    title: string,
    name: string,
    edited: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    const written = commentWritten(this, text);
    const { id } = written;
    await inHandOf(this).send(
      new EditComment(
        account,
        tournament.value,
        (await commentaryIn(this, tournament, title)).value,
        id.value,
        edited,
        momentOf(this),
      ),
    );
    rememberComment(this, edited, written);
  },
);

Given(
  "{string} has deleted the comment {string} in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    text: string,
    title: string,
    name: string,
  ) {
    const account = (await accountFor(this, address)).value;
    const tournament = tournamentNamed(this, name);
    await inHandOf(this).send(
      new DeleteComment(
        account,
        tournament.value,
        (await commentaryIn(this, tournament, title)).value,
        commentSaying(this, text).value,
        momentOf(this),
      ),
    );
  },
);

// The commentary ---------------------------------------------------------------

// What the commentary called `title` of the tournament `name` says, each
// comment by what it says, the first written first.
const textsIn = async (
  world: SpecWorld,
  title: string,
  name: string,
): Promise<string[]> => {
  const commentary = await loadCommentary(
    world,
    await commentaryIn(world, tournamentNamed(world, name), title),
  );
  return commentary.comments.map(({ text }) => text.toString());
};

Then(
  "the commentary {string} of {string} has the comment {string}",
  async function (this: SpecWorld, title: string, name: string, text: string) {
    const texts = await textsIn(this, title, name);
    assert.ok(texts.includes(text), `It has ${inspect(texts)}.`);
  },
);

// By its length, counted as a reader counts it, for a comment too long to
// write out.
Then(
  "the commentary {string} of {string} has a comment of {int} characters",
  async function (
    this: SpecWorld,
    title: string,
    name: string,
    length: number,
  ) {
    const texts = await textsIn(this, title, name);
    assert.ok(
      texts.some((text) => charactersIn(text) === length),
      `It has comments of ${inspect(texts.map((text) => charactersIn(text)))} characters.`,
    );
  },
);

// Kept once, and not twice, as a comment sent twice would be.
Then(
  "the commentary {string} of {string} has the comment {string} once",
  async function (this: SpecWorld, title: string, name: string, text: string) {
    const texts = await textsIn(this, title, name);
    assert.equal(
      texts.filter((each) => each === text).length,
      1,
      `It has ${inspect(texts)}.`,
    );
  },
);

Then(
  "the commentary {string} of {string} does not have the comment {string}",
  async function (this: SpecWorld, title: string, name: string, text: string) {
    const texts = await textsIn(this, title, name);
    assert.ok(!texts.includes(text), `It has ${inspect(texts)}.`);
  },
);

Then(
  "the commentary {string} of {string} has no comments",
  async function (this: SpecWorld, title: string, name: string) {
    assert.deepEqual(await textsIn(this, title, name), []);
  },
);

Then(
  "the writer of the commentary {string} of {string} is the account for {string}",
  async function (
    this: SpecWorld,
    title: string,
    name: string,
    address: string,
  ) {
    const commentary = await loadCommentary(
      this,
      await commentaryIn(this, tournamentNamed(this, name), title),
    );
    assert.ok(commentary.writer.equals(await accountFor(this, address)));
  },
);

Then(
  "the last thing the commentary {string} of {string} recorded was caused by the account for {string}",
  async function (
    this: SpecWorld,
    title: string,
    name: string,
    address: string,
  ) {
    const events = await inHandOf(this).eventsOf(
      await commentaryIn(this, tournamentNamed(this, name), title),
    );
    const last = events.at(-1);
    assert.ok(last !== undefined, "The commentary recorded nothing.");
    assert.ok(last.createdBy.equals(await accountFor(this, address)));
  },
);

// What the tournament's commentaries are afterwards ---------------------------------

Then(
  "the tournament {string} has the commentary {string}",
  async function (this: SpecWorld, name: string, title: string) {
    const titles = (
      await inHandOf(this).commentariesOf(tournamentNamed(this, name))
    ).map((commentary) => commentary.title);
    assert.ok(titles.includes(title), `It has ${inspect(titles)}.`);
  },
);

Then(
  "the tournament {string} has no commentaries",
  async function (this: SpecWorld, name: string) {
    assert.deepEqual(
      await inHandOf(this).commentariesOf(tournamentNamed(this, name)),
      [],
    );
  },
);
