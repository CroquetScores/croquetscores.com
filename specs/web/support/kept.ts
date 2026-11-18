// What a tournament holds, as the site says it when asked by the test control,
// for the steps that say what was kept and cannot say so from a page. Plain data:
// names, ids and the few facts about each that a scenario says were kept.
import { strict as assert } from "node:assert";

import { site } from "./site.js";
import type { WebWorld } from "./world.js";

export interface KeptPlayer {
  readonly id: string;
  readonly name: string;
  readonly representing?: string;
  readonly handicap?: string;
  readonly flag?: string;
  readonly worldRankingName?: string;
  readonly slug: string;
  readonly order: number;
  readonly archived: boolean;
}

export interface KeptTeam {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly flag?: string;
  readonly slug: string;
  readonly order: number;
  readonly archived: boolean;
  readonly players: readonly {
    readonly id: string;
    readonly name: string;
    readonly worldRankingName?: string;
  }[];
}

export interface KeptRules {
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  readonly worldRankings: boolean;
  readonly maximumHoops: number | null;
  readonly advantage: boolean;
}

export interface KeptCompetition {
  readonly rules: KeptRules;
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly order: number;
  readonly archived: boolean;
  readonly kind: "block" | "knockout" | "swiss" | "test";
  readonly places?: number;
  readonly firstTeam?: string;
  readonly secondTeam?: string;
  readonly expectedMatches?: number;
  readonly bestOf?: number;
  readonly group?: string;
  readonly rounds?: number;
  readonly tieBreak?: string;
  readonly drawRounds?: readonly number[];
  readonly losersOf?: {
    readonly competitionId: string;
    readonly round: number;
  };
  readonly starts?: string;
  readonly finishes?: string;
}

export interface Kept {
  readonly id: string;
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  readonly region?: string;
  readonly subtitle?: string;
  readonly starts: string;
  readonly finishes: string;
  readonly national: boolean;
  readonly international: boolean;
  readonly levelTestsDrawn: boolean;
  readonly address: string;
  readonly name: string;
  readonly archived: boolean;
  readonly managers: readonly string[];
  readonly scorers: readonly string[];
  readonly players: readonly KeptPlayer[];
  readonly teams: readonly KeptTeam[];
  readonly competitions: readonly KeptCompetition[];
}

/** What the tournament the scenario calls `name` holds now. */
export const keptOf = async (world: WebWorld, name: string): Promise<Kept> => {
  const made = world.tournaments.get(name);
  assert.ok(made !== undefined, `No tournament called ${name} was created.`);
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/tournaments/kept?id=${encodeURIComponent(made.id)}`,
    { headers: { "x-test-control": token } },
  );
  assert.equal(
    answer.status,
    200,
    `The site would not say what ${name} holds.`,
  );
  return (await answer.json()) as Kept;
};

/** The test of the tournament called `test`, the first of them where there are two. */
export const testOf = (kept: Kept, test: string): KeptCompetition => {
  const found = kept.competitions
    .filter((each) => each.kind === "test" && each.name === test)
    .sort((one, other) => one.order - other.order)[0];
  assert.ok(found !== undefined, `The tournament has no test ${test}.`);
  return found;
};

/**
 * What the tournament called `name` holds, which the scenario made through a
 * page and so never knew the id of. Asked again for a while, since the site
 * tells of it by name a moment after it is kept.
 */
export const keptCalled = async (
  world: WebWorld,
  name: string,
): Promise<Kept> => {
  const { baseUrl, token } = await site();
  const until = Date.now() + 5000;
  for (;;) {
    const answer = await fetch(
      `${baseUrl}/__test/tournaments/kept?name=${encodeURIComponent(name)}`,
      { headers: { "x-test-control": token } },
    );
    if (answer.status === 200) return (await answer.json()) as Kept;
    if (Date.now() > until) {
      assert.equal(answer.status, 200, `No tournament is called ${name}.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  void world;
};

export interface KeptGame {
  readonly winner: string;
  readonly loser: string;
  readonly winnerScore: number;
  readonly loserScore: number;
  readonly winnerWritten: string;
  readonly loserWritten: string;
  readonly marked: boolean;
  readonly archived: boolean;
  readonly withdrawn: boolean;
}

export interface KeptCompetitionPlayer {
  readonly id: string;
  readonly tournamentPlayer: string;
  readonly order: number;
  readonly withdrawn: boolean;
  readonly bye: boolean;
  readonly carryForward: Readonly<Record<string, number>>;
}

/** What the competition with this id holds: its players, and its games by their ids. */
export const competitionHeld = async (
  id: string,
): Promise<{
  readonly players: readonly KeptCompetitionPlayer[];
  readonly games: readonly KeptGame[];
}> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/competitions/kept?id=${encodeURIComponent(id)}`,
    { headers: { "x-test-control": token } },
  );
  assert.equal(
    answer.status,
    200,
    "The site would not say what the competition holds.",
  );
  return (await answer.json()) as {
    players: KeptCompetitionPlayer[];
    games: KeptGame[];
  };
};

/** The games the competition with this id holds. */
export const gamesOf = async (id: string): Promise<readonly KeptGame[]> =>
  (await competitionHeld(id)).games;

/** The day, as the date is written to the day, of a moment told as plain data. */
export const dayOf = (moment: string | undefined): string =>
  (moment ?? "").slice(0, 10);

export interface KeptNote {
  readonly title: string;
  readonly description?: string;
  readonly deleted: boolean;
}

/** The notes the tournament called `name` holds. */
export const notesOf = async (
  world: WebWorld,
  name: string,
): Promise<readonly KeptNote[]> => {
  const { id } = await keptOf(world, name);
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/tournaments/notes/kept?id=${encodeURIComponent(id)}`,
    { headers: { "x-test-control": token } },
  );
  assert.equal(
    answer.status,
    200,
    "The site would not say what the notes hold.",
  );
  return (await answer.json()) as KeptNote[];
};
