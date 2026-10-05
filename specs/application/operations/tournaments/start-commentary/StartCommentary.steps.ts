import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { StartCommentary } from "../../../../../src/application/operations/tournaments/StartCommentary.js";
import { CommentaryId } from "../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  commentaryTitled,
  tournamentOf,
} from "../../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  accountFor,
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../aRequest.js";
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

Then(
  "it is answered with the id of the tournament's commentary {string}",
  function (this: SpecWorld, title: string) {
    assert.ok(
      this.answer instanceof CommentaryId,
      `It was answered with ${inspect(this.answer)}: ${inspect(this.failure)}`,
    );
    assert.ok(
      this.answer.equals(commentaryTitled(tournamentOf(this), title).id),
    );
  },
);

Then(
  "the tournament's commentary {string} was started by the account for {string}",
  async function (this: SpecWorld, title: string, address: string) {
    assert.ok(
      commentaryTitled(tournamentOf(this), title).writer.equals(
        await accountFor(this, address),
      ),
    );
  },
);
