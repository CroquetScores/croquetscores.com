import { strict as assert } from "node:assert";

import { call } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";

// What these scenarios send the API, as the admin's dialogs send it, and what it
// answers: plain requests with the session the manager holds and the website
// they are said to be for, since which website a request is for is the host it
// was addressed to (advantageGolfCroquet.feature). No browser is needed.

export const manager = "manager@example.com";

export interface Answered {
  readonly status: number;
  readonly body: unknown;
}

// What the scenario has made and what the last request was answered with, kept
// here rather than on the world, which every scenario in specs/web shares.
export interface Scene {
  /** The tournaments made, by name, as the API names them: the part of the id after "tournament/". */
  readonly tournaments: Map<string, string>;
  /** The competitions made, by tournament and name: the whole id. */
  readonly competitions: Map<string, string>;
  /** The teams made, by tournament and name: the whole id. */
  readonly teams: Map<string, string>;
  /** The tournament a step means when it says "the tournament". */
  usual: string;
  answered: Answered | undefined;
}

const scenes = new WeakMap<WebWorld, Scene>();

export const sceneOf = (world: WebWorld): Scene => {
  let scene = scenes.get(world);
  if (scene === undefined) {
    scene = {
      tournaments: new Map(),
      competitions: new Map(),
      teams: new Map(),
      usual: "",
      answered: undefined,
    };
    scenes.set(world, scene);
  }
  return scene;
};

export const within = (tournament: string, name: string): string =>
  `${tournament}\u0000${name}`;

export const bare = (id: string, kind: string): string => {
  assert.ok(id.startsWith(`${kind}/`), `${id} is not a ${kind} id.`);
  return id.slice(kind.length + 1);
};

export const tournamentIdOf = (world: WebWorld, name: string): string => {
  const found = world.tournaments.get(name);
  assert.ok(found !== undefined, `No tournament called ${name} was made.`);
  return found.id;
};

// What the control is told, and what it answers with the id of.
export const made = async (
  what: string,
  path: string,
  body: object,
): Promise<string> => {
  const answer = await call("POST", path, body);
  if (answer.status !== 201) {
    throw new Error(
      `The site would not ${what}: ${String(answer.status)} ${await answer.text()}`,
    );
  }
  return ((await answer.json()) as { id: string }).id;
};

// The API, asked as the manager, for the website `host`. The site trusts the
// proxy in front of it for the host a reader typed, which is how a request
// says which website it is for, and says it comes from its own pages, as the
// admin's requests do.
export const asked = async (
  world: WebWorld,
  host: string,
  method: "GET" | "POST" | "PUT",
  path: string,
  body?: object,
): Promise<void> => {
  const session = world.apiSession;
  // An address under /api is already whole, as a route that has moved from
  // /api/site to /api/v0 is asked at where it is now.
  const answer = await fetch(
    `${world.baseUrl!}${path.startsWith("/api/") ? "" : "/api/site"}${path}`,
    {
      method,
      headers: {
        "x-forwarded-host": host,
        "sec-fetch-site": "same-origin",
        ...(session === undefined ? {} : { cookie: `session=${session}` }),
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
  );
  const text = await answer.text();
  sceneOf(world).answered = {
    status: answer.status,
    body: text === "" ? undefined : (JSON.parse(text) as unknown),
  };
};

export const answeredOf = (world: WebWorld): Answered => {
  const { answered } = sceneOf(world);
  assert.ok(answered !== undefined, "Nothing has been asked of the API.");
  return answered;
};
