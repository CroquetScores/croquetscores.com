import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  PublicManagerNoteOfTournament,
  type TournamentManagerNoteToRead,
} from "../../../../../src/application/operations/tournaments/PublicManagerNoteOfTournament.js";
import type { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";
import { ask } from "../aRequest.js";

// The note answered: a reader's note's page answers it beside its tournament,
// and the note a manager edits is answered by itself (ManagerNoteToEdit.feature),
// with the title and the description both answer.
const noteAnswered = (
  world: SpecWorld,
): Partial<TournamentManagerNoteToRead["managerNote"]> &
  Pick<TournamentManagerNoteToRead["managerNote"], "title" | "description"> => {
  assert.ok(
    world.answer !== undefined && world.failure === undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  const answer = world.answer as Partial<TournamentManagerNoteToRead> &
    TournamentManagerNoteToRead["managerNote"];
  return answer.managerNote ?? answer;
};

const isAt = (date: ReadOnlyDate | undefined, moment: string): void => {
  assert.equal(date?.toISOString(), new Date(moment).toISOString());
};

// Asked with nobody signed in, since a tournament's notes are for anybody.
When(
  "the public manager note {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, note: string, address: string) {
    await ask(
      this,
      new PublicManagerNoteOfTournament("croquetscores.com", address, note),
    );
  },
);

Then(
  "the manager note answered is called {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(noteAnswered(this).title, title);
  },
);

Then(
  "the manager note answered says {string}",
  function (this: SpecWorld, description: string) {
    assert.equal(noteAnswered(this).description, description);
  },
);

Then("the manager note answered says nothing more", function (this: SpecWorld) {
  assert.equal(noteAnswered(this).description, undefined);
});

Then(
  "the manager note answered was written at {string}",
  function (this: SpecWorld, moment: string) {
    isAt(noteAnswered(this).writtenAt, moment);
  },
);

Then(
  "the manager note answered has never been edited",
  function (this: SpecWorld) {
    assert.equal(noteAnswered(this).lastEditedAt, undefined);
  },
);

Then(
  "the manager note answered was last edited at {string}",
  function (this: SpecWorld, moment: string) {
    isAt(noteAnswered(this).lastEditedAt, moment);
  },
);

Then(
  "the manager note answered last changed at {string}",
  function (this: SpecWorld, moment: string) {
    isAt(noteAnswered(this).changedAt, moment);
  },
);
