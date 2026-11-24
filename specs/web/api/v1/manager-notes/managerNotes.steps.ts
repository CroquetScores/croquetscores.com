// A manager note added through the API (managerNotes.feature), asked as the
// website's page or an app asks: a plain request, signed in by a session, a key
// or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const notesAt = (world: WebWorld, tournament: string, api: string): string =>
  `${api}/tournaments/${bare(world, tournament)}/notes`;

When(
  "the note {string} is added to {string}",
  async function (this: WebWorld, title: string, tournament: string) {
    await told(this, "POST", notesAt(this, tournament, "/api/v1"), {
      title,
      description: "",
    });
  },
);

When(
  "the note {string} is added to {string} at the address it was at",
  async function (this: WebWorld, title: string, tournament: string) {
    await told(this, "POST", notesAt(this, tournament, "/api/site"), {
      title,
      description: "",
    });
  },
);

When(
  "a note with a description of {int} accented letters is added to {string}",
  async function (this: WebWorld, letters: number, tournament: string) {
    await told(this, "POST", notesAt(this, tournament, "/api/v1"), {
      title: "Long",
      description: "é".repeat(letters),
    });
  },
);

// What the website's own page lists, which is how a manager sees them.
When(
  "the notes of {string} are listed to the caller",
  async function (this: WebWorld, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}${notesAt(this, tournament, "/api/site")}`,
      { headers: { cookie: `session=${session!}` } },
    );
    assert.equal(answer.status, 200, "The site would not list the notes.");
    sceneOf(this).answer = {
      status: answer.status,
      headers: answer.headers,
      body: (await answer.json()) as Record<string, unknown>,
    };
  },
);

Then("the API says the id of the note", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^manager-note\//);
});

Then(
  "the site lists the note {string}",
  function (this: WebWorld, title: string) {
    const notes = answered(this).body["notes"] as { title: string }[];
    assert.ok(
      notes.some((each) => each.title === title),
      `${title} is not listed.`,
    );
  },
);
