import { Given, When } from "@cucumber/cucumber";
import type { SpecWorld } from "../../support/world.js";
import { openAndKeepTheAnswer } from "./answered.js";
import { changeTournament } from "./tournaments.js";

// Keeping what it was answered with, for a scenario that says whether it was
// found.
When(
  "the page at {string} is opened",
  async function (this: SpecWorld, path: string) {
    await openAndKeepTheAnswer(this, path);
  },
);

// Only a tournament played by teams draws a level test, so the scenario says
// first that it is played by teams.
Given(
  "the tournament {string} draws a level test",
  async function (this: SpecWorld, name: string) {
    await changeTournament(this, name, { levelTestsDrawn: true });
  },
);

Given(
  "the tournament {string} has the subtitle {string}",
  async function (this: SpecWorld, name: string, subtitle: string) {
    await changeTournament(this, name, { subtitle });
  },
);
