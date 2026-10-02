import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import {
  aCompetition,
  competitionKeptFor,
  competitionWritten,
  imported,
  startWriting,
} from "../importingTournaments.js";

Given(
  "the block {string} of {string} on {string}",
  function (this: SpecWorld, id: string, tournament: string, website: string) {
    startWriting(this, {
      kind: "block",
      website,
      id,
      document: aCompetition("block", tournament),
    });
  },
);

Given(
  "the block {string} of {string} on {string} is imported as {string}",
  async function (
    this: SpecWorld,
    id: string,
    tournament: string,
    website: string,
    name: string,
  ) {
    await imported(this, {
      kind: "block",
      website,
      id,
      document: { ...aCompetition("block", tournament), Name: name },
    });
  },
);

Given(
  "the block's matches are the best of {int}",
  function (this: SpecWorld, games: number) {
    competitionWritten(this).BestOf = games;
  },
);

// What kind each competition is, by the word the feature uses for it.
const KINDS: Readonly<Record<string, string>> = {
  block: "block",
  knockout: "knockout",
  Swiss: "swiss",
};

Then(
  /^the competition kept for "(.*)" on "(.*)" is an? (block|knockout|Swiss)$/,
  async function (this: SpecWorld, id: string, website: string, kind: string) {
    const { inTournament } = await competitionKeptFor(this, id, website);
    assert.equal(inTournament.shape.kind, KINDS[kind]);
  },
);

Then(
  "the competition kept for {string} on {string} is the best of {int}",
  async function (this: SpecWorld, id: string, website: string, games: number) {
    const { inTournament } = await competitionKeptFor(this, id, website);
    const { shape } = inTournament;
    assert.ok(
      shape.kind === "block" || shape.kind === "swiss",
      `It is a ${shape.kind}, which has no one best-of.`,
    );
    assert.equal(shape.bestOf.games, games);
  },
);
