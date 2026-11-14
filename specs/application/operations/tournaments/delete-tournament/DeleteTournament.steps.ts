// Telling a tournament's managers it was deleted, and archiving it where that
// is asked (DeleteTournament.feature), through the mediator "the application's
// tournaments" stands up. What the managers were emailed is read as the email
// is written, since what it says is the writer's.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { DeleteTournament } from "../../../../../src/application/operations/tournaments/DeleteTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  momentOf,
  noTournament,
  scenarioOf,
  send,
  tournamentNamed,
} from "../aRequest.js";

// What the administrator said, which a scenario that does not care what it was
// leaves as this.
const SAID_NOTHING_IN_PARTICULAR = "The tournament has been deleted.";

// A feature writes a line break as \n, since a step's text is one line.
Given(
  "the message to the managers is {string}",
  function (this: SpecWorld, message: string) {
    scenarioOf(this).says["message"] = message.replaceAll("\\n", "\n");
  },
);

const messageOf = (world: SpecWorld): string =>
  scenarioOf(world).says["message"] ?? SAID_NOTHING_IN_PARTICULAR;

const deleting = async (
  world: SpecWorld,
  address: string,
  name: string,
  archive: boolean,
): Promise<void> => {
  const id = tournamentNamed(world, name);
  await send(
    world,
    new DeleteTournament(
      (await accountFor(world, address)).value,
      id.value,
      messageOf(world),
      archive,
      momentOf(world),
    ),
    id,
  );
};

When(
  "the reader signed in to the account for {string} emails the managers of the tournament {string} that it is deleted",
  function (this: SpecWorld, address: string, name: string) {
    return deleting(this, address, name, false);
  },
);

When(
  "the reader signed in to the account for {string} emails the managers of the tournament {string} that it is deleted, and archives it",
  function (this: SpecWorld, address: string, name: string) {
    return deleting(this, address, name, true);
  },
);

When(
  "the reader signed in to the account for {string} emails the managers of a tournament there is not that it is deleted",
  async function (this: SpecWorld, address: string) {
    await send(
      this,
      new DeleteTournament(
        (await accountFor(this, address)).value,
        noTournament().value,
        messageOf(this),
        false,
        momentOf(this),
      ),
      undefined,
    );
  },
);

const writtenTo = (world: SpecWorld, address: string): Promise<string> => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering.writtenFor(address);
};

Then(
  "the email queued for {string} does not say {string}",
  async function (this: SpecWorld, address: string, said: string) {
    const written = await writtenTo(this, address);
    assert.ok(!written.includes(said), `The email says "${said}".`);
  },
);

// A line break in HTML is a space unless the element holding it says
// otherwise, so the lines are kept apart where the paragraph they are in asks
// for its white space to be kept, as the emergency email's do.
Then(
  "the email queued for {string} keeps the lines of the message apart",
  async function (this: SpecWorld, address: string) {
    const written = await writtenTo(this, address);
    assert.match(
      written,
      /white-space: pre-wrap[^>]*>Hi,\n\nRegards</,
      "The email runs the lines of the message together.",
    );
  },
);
