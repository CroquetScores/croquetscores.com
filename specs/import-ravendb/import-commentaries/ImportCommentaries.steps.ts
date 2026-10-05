import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { Commentary } from "../../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import type { CommentaryInTournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import { accountsOf } from "../../infrastructure/support/accounts.js";
import type { SpecWorld } from "../../support/world.js";
import {
  type WrittenComment,
  commentaryWritten,
  importWritten,
  importingOf,
  startWriting,
  tournamentKeptFor,
} from "../importingTournaments.js";

// The commentary being written ---------------------------------------------------

/**
 * A commentary on `tournament` that is well made, so that what is refused is
 * only ever what the scenario named: called "Live", written by "users/1", with
 * no comments.
 */
Given(
  "the commentary {string} of {string} on {string}",
  function (this: SpecWorld, id: string, tournament: string, website: string) {
    startWriting(this, {
      kind: "commentary",
      website,
      id,
      document: {
        Tournament: { Id: tournament },
        Commentator: { Id: "users/1" },
        Title: "Live",
        Comments: [],
        IsArchived: false,
      },
    });
  },
);

Given(
  "the commentary was called {string}",
  function (this: SpecWorld, title: string) {
    commentaryWritten(this).Title = title;
  },
);

Given(
  "the commentary was written by {string}",
  function (this: SpecWorld, user: string) {
    commentaryWritten(this).Commentator = { Id: user };
  },
);

Given("the commentary was archived", function (this: SpecWorld) {
  commentaryWritten(this).IsArchived = true;
});

// The comment `number`, counting from 1 in the order they were written, added
// where there is none, as one written at nine on the tournament's first day.
const commentWritten = (world: SpecWorld, number: number): WrittenComment => {
  const comments = commentaryWritten(world).Comments;
  while (comments.length < number) {
    comments.push({
      Content: `Comment ${String(comments.length + 1)}`,
      CreatedAt: "2014-03-01T09:00:00.0000000",
      IsArchived: false,
    });
  }
  const found = comments[number - 1];
  assert.ok(found !== undefined, `There is no comment ${String(number)}.`);
  return found;
};

Given(
  "comment {int} says {string}",
  function (this: SpecWorld, number: number, content: string) {
    commentWritten(this, number).Content = content;
  },
);

Given(
  "comment {int} was written at {string}",
  function (this: SpecWorld, number: number, moment: string) {
    commentWritten(this, number).CreatedAt = moment;
  },
);

Given("comment {int} was archived", function (this: SpecWorld, number: number) {
  commentWritten(this, number).IsArchived = true;
});

When("the commentary is imported", async function (this: SpecWorld) {
  await importWritten(this);
});

// What it became -----------------------------------------------------------------

const commentaryCalled = async (
  world: SpecWorld,
  title: string,
  id: string,
  website: string,
): Promise<{
  readonly creator: AccountId | undefined;
  readonly inTournament: CommentaryInTournament;
  readonly commentary: Commentary;
}> => {
  const tournament = await tournamentKeptFor(world, id, website);
  const inTournament = tournament.commentaries.find(
    (each) => each.title.toString() === title,
  );
  assert.ok(
    inTournament !== undefined,
    `It has no commentary ${title}: ${tournament.commentaries.map((each) => each.title.toString()).join(", ")}.`,
  );
  const commentary = await world.asARequest(() =>
    importingOf(world).commentaries.load(inTournament.id),
  );
  assert.ok(commentary !== undefined, `${title} has no events.`);
  return { creator: tournament.managers[0], inTournament, commentary };
};

Then(
  "the tournament kept for {string} on {string} has the commentary {string}",
  async function (this: SpecWorld, id: string, website: string, title: string) {
    await commentaryCalled(this, title, id, website);
  },
);

Then(
  "the tournament kept for {string} on {string} has no commentaries",
  async function (this: SpecWorld, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.deepEqual(tournament.commentaries, []);
  },
);

Then(
  "the commentary {string} of the tournament kept for {string} on {string} is written by {string}",
  async function (
    this: SpecWorld,
    title: string,
    id: string,
    website: string,
    address: string,
  ) {
    const { commentary } = await commentaryCalled(this, title, id, website);
    const account = await this.asARequest(() =>
      accountsOf(this).readModel.find(EmailAddress.from(address)),
    );
    assert.ok(account !== undefined, `No account is reached at ${address}.`);
    assert.equal(commentary.writer.value, account.value);
  },
);

Then(
  "the commentary {string} of the tournament kept for {string} on {string} is written by a forgotten account",
  async function (this: SpecWorld, title: string, id: string, website: string) {
    const { commentary } = await commentaryCalled(this, title, id, website);
    const events = await this.asARequest(() =>
      accountsOf(this).store.getEvents(commentary.writer),
    );
    assert.equal(
      Account.rebuiltFrom(commentary.writer, events).forgotten,
      true,
    );
  },
);

// Whoever created a tournament is its first manager.
Then(
  "the commentary {string} of the tournament kept for {string} on {string} is written by the account that created it",
  async function (this: SpecWorld, title: string, id: string, website: string) {
    const { commentary, creator } = await commentaryCalled(
      this,
      title,
      id,
      website,
    );
    assert.equal(commentary.writer.value, creator?.value);
  },
);

Then(
  "the commentary {string} of the tournament kept for {string} on {string} was started at {string}",
  async function (
    this: SpecWorld,
    title: string,
    id: string,
    website: string,
    moment: string,
  ) {
    const { commentary } = await commentaryCalled(this, title, id, website);
    const [started] = await this.asARequest(() =>
      accountsOf(this).store.getEvents(commentary.id),
    );
    assert.ok(started !== undefined, "The commentary has no events.");
    assert.equal(
      started.occurredAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  /^the commentary "(.*)" of the tournament kept for "(.*)" on "(.*)" has (\d+) comments?$/,
  async function (
    this: SpecWorld,
    title: string,
    id: string,
    website: string,
    count: string,
  ) {
    const { commentary } = await commentaryCalled(this, title, id, website);
    assert.equal(commentary.comments.length, Number(count));
  },
);

const firstCommentOf = async (
  world: SpecWorld,
  title: string,
  id: string,
  website: string,
) => {
  const { commentary } = await commentaryCalled(world, title, id, website);
  const [first] = commentary.comments;
  assert.ok(first !== undefined, "The commentary has no comments.");
  return first;
};

Then(
  "the first comment of the commentary {string} of the tournament kept for {string} on {string} says {string}",
  async function (
    this: SpecWorld,
    title: string,
    id: string,
    website: string,
    says: string,
  ) {
    const first = await firstCommentOf(this, title, id, website);
    assert.equal(first.text.toString(), says);
  },
);

Then(
  /^the (first|last) comment of the commentary "(.*)" of the tournament kept for "(.*)" on "(.*)" was written at "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    title: string,
    id: string,
    website: string,
    moment: string,
  ) {
    const { commentary } = await commentaryCalled(this, title, id, website);
    const comment =
      which === "first" ? commentary.comments[0] : commentary.comments.at(-1);
    assert.ok(comment !== undefined, "The commentary has no comments.");
    assert.equal(
      comment.writtenAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);
