import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { StartCommentary } from "../../../../../src/application/operations/tournaments/StartCommentary.js";
import { CommentaryId } from "../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  commentaryIn,
  loadCommentary,
} from "../../commentaries/commentaryRequests.js";
import { momentOf, noTournament, send, tournamentNamed } from "../aRequest.js";
import { readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

const start = async (
  world: SpecWorld,
  address: string | undefined,
  tournament: TournamentId,
  title: string,
): Promise<void> => {
  const account = await readerOf(world, address ?? undefined);
  await send(
    world,
    new StartCommentary(account, tournament.value, title, momentOf(world)),
    tournament,
  );
};

When(
  new RegExp(`${READER} starts the commentary "([^"]*)" on "([^"]*)"$`),
  async function (
    this: SpecWorld,
    address: string | undefined,
    title: string,
    name: string,
  ) {
    await start(this, address, tournamentNamed(this, name), title);
  },
);

When(
  new RegExp(
    `${READER} starts a commentary with a title of (\\d+) characters on "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    length: string,
    name: string,
  ) {
    await start(
      this,
      address,
      tournamentNamed(this, name),
      "a".repeat(Number(length)),
    );
  },
);

When(
  new RegExp(
    `${READER} starts the commentary "([^"]*)" on a tournament there is not$`,
  ),
  async function (this: SpecWorld, address: string | undefined, title: string) {
    await start(this, address, noTournament(), title);
  },
);

// Found among the commentaries of the tournament the scenario is looking at,
// which is the one it was started on.
Then(
  "it is answered with the id of the tournament's commentary {string}",
  async function (this: SpecWorld, title: string) {
    assert.ok(
      this.answer instanceof CommentaryId,
      `It was answered with ${inspect(this.answer)}: ${inspect(this.failure)}`,
    );
    const looking = this.aggregate as { id: TournamentId } | undefined;
    assert.ok(looking !== undefined, "No tournament is being looked at.");
    assert.ok(this.answer.equals(await commentaryIn(this, looking.id, title)));
  },
);

Then(
  "the commentary {string} of {string} is found at {string}",
  async function (this: SpecWorld, title: string, name: string, slug: string) {
    const id = await commentaryIn(this, tournamentNamed(this, name), title);
    assert.equal((await loadCommentary(this, id)).slug.toString(), slug);
  },
);
