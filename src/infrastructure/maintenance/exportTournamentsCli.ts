import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import type { Query } from "../../application/common/Query.js";
import { PublicBlockOfTournament } from "../../application/operations/tournaments/PublicBlockOfTournament.js";
import { PublicKnockoutOfTournament } from "../../application/operations/tournaments/PublicKnockoutOfTournament.js";
import { PublicPlayersOfTournament } from "../../application/operations/tournaments/PublicPlayersOfTournament.js";
import { PublicSwissOfTournament } from "../../application/operations/tournaments/PublicSwissOfTournament.js";
import { PublicTeamSummaryOfTournament } from "../../application/operations/tournaments/PublicTeamSummaryOfTournament.js";
import { PublicTestOfTournament } from "../../application/operations/tournaments/PublicTestOfTournament.js";
import type { TournamentOfWebsite } from "../../application/operations/tournaments/tournamentsOfWebsite.js";
import { TournamentFingerprints } from "../../application/operations/tournaments/TournamentFingerprints.js";
import { TournamentYears } from "../../application/operations/tournaments/TournamentYears.js";
import { TournamentsInYear } from "../../application/operations/tournaments/TournamentsInYear.js";

export interface ExportOutcome {
  readonly exitCode: 0 | 1;
}

/**
 * The websites whose tournaments are exported, and no other: a try website is
 * left out because everything entered on it may be removed at any time
 * (exportTournamentsCli.feature).
 */
export const WEBSITES_EXPORTED: readonly string[] = [
  "croquetscores.com",
  "gateballscores.com",
];

/** How many tournaments are read at once. */
const READ_AT_ONCE = 6;

/**
 * Which layout of a file this is. A reader of the files is told by it that the
 * layout has changed, and so does not have to notice.
 */
export const LAYOUT = 1;

/** How a run of Git ended, and what it said as it did. */
export interface GitEnded {
  readonly code: number;
  /** What it wrote as its answer, which is what is read. */
  readonly said: string;
  /** What it wrote as its complaint, which is only for saying why it failed. */
  readonly complaint?: string;
}

/** What the script is given of the world it runs in. */
export interface ExportWorld {
  /** Who is told of a failure. */
  readonly administrator: string;
  /** Where `--folder` is read from where it is not a whole path. */
  readonly workingFolder: string;
  /** Asks the application a query, as the public pages do. */
  readonly ask: <TResult>(query: Query<TResult>) => Promise<TResult>;
  /**
   * Runs Git in `folder` with `args`, giving it `input` to read where there is
   * some. Throws where Git could not be run at all; Git running and failing is
   * a {@link GitEnded}.
   */
  readonly git: (
    folder: string,
    args: readonly string[],
    input?: string,
  ) => Promise<GitEnded>;
  /** Writes `text` to `path`, which is a name of the file's own. Throws where it cannot. */
  readonly write: (path: string, text: string) => Promise<void>;
  /** Sends the email. Throws where it cannot. */
  readonly send: (email: {
    to: string;
    subject: string;
    body: string;
  }) => Promise<void>;
  readonly say: (line: string) => void;
}

// What a file is called, as the address of its tournament: the year, the sport
// and the name, which is what a reader's page is found at.
const TOURNAMENTS_FILE = /^\d{4}\/[^/]+\/[^/]+\.json$/;

const messageOf = (failure: unknown): string =>
  failure instanceof Error ? failure.message : String(failure);

const isAFolder = async (path: string): Promise<boolean> => {
  try {
    return (await stat(path)).isDirectory();
  } catch {
    return false;
  }
};

const exists = async (path: string): Promise<boolean> => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

// Text in an element needs only what would be read as markup escaped.
const escaped = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * `text` with the remote's address, and any password in any address, left
 * out: Git says where it could not reach, and an address may hold a password.
 * Each part of `address` is hidden on its own as well as the whole, the
 * longest first, since a failure may say the host without the rest.
 */
const withoutRemote = (text: string, address: string | undefined): string => {
  let said = text;
  if (address !== undefined && address !== "") {
    const hidden = new Set<string>([address]);
    try {
      const url = new URL(address);
      for (const part of [url.password, url.host]) {
        if (part !== "") hidden.add(decodeURIComponent(part));
      }
    } catch {
      // Not an address of the kind with parts, and so hidden whole.
    }
    for (const part of [...hidden].sort((a, b) => b.length - a.length)) {
      said = said.split(part).join("(the remote)");
    }
  }
  // Whatever an address said that this was not told of.
  return said
    .replace(/\/\/[^/\s@]*@/g, "//(hidden)@")
    .replace(/[^\s@/:']+@[^\s:/']+:/g, "(hidden):");
};

// Why a run of Git failed, in its own words: what it complained of, and only
// failing that what it answered.
const whyOf = (ended: GitEnded): string =>
  (ended.complaint ?? "").trim() || ended.said.trim();

// A number as a reader of English is used to, so that 12345 is not squinted at.
const withCommas = (count: number): string => count.toLocaleString("en-US");

// What a count is said as: "1 tournament was", "2 tournaments were".
const counted = (count: number, one: string, many: string): string =>
  count === 1 ? `1 ${one} was` : `${withCommas(count)} ${many} were`;

const tournamentsWritten = (count: number): string =>
  counted(count, "tournament", "tournaments");

// ---------------------------------------------------------------------------
// What a file says
// ---------------------------------------------------------------------------

interface PlayedGame {
  readonly players: readonly [
    { readonly name: string; readonly score: string },
    { readonly name: string; readonly score: string },
  ];
  readonly drawn: boolean;
  readonly withdrawn: boolean;
}

interface Played {
  readonly players: readonly [string, string];
  readonly games: readonly PlayedGame[];
}

const gameOf = (
  first: { name: string; score: string },
  second: { name: string; score: string },
  drawn: boolean,
  withdrawn: boolean,
): PlayedGame => ({ players: [first, second], drawn, withdrawn });

// A knockout's games are said under the two who met, in the order they were
// played, so that a match is its games. The page's rounds are not used: a
// match of a draw not yet played has no games to say.
const matchesOf = (games: readonly PlayedGame[]): readonly Played[] => {
  const matches = new Map<
    string,
    { players: [string, string]; games: PlayedGame[] }
  >();
  for (const game of games) {
    const [first, second] = game.players;
    const key = JSON.stringify([first.name, second.name].sort());
    const found = matches.get(key) ?? {
      players: [first.name, second.name] as [string, string],
      games: [],
    };
    found.games.push(game);
    matches.set(key, found);
  }
  return [...matches.values()];
};

// A refusal that says a competition is of another kind than the one asked for.
const isNotOfKind = (failure: unknown, code: string): boolean =>
  typeof failure === "object" &&
  failure !== null &&
  (failure as { code?: unknown }).code === code;

const competitionOf = async (
  world: ExportWorld,
  website: string,
  address: string,
  name: string,
  slug: string,
): Promise<Record<string, unknown>> => {
  try {
    const { block, players, games } = await world.ask(
      new PublicBlockOfTournament(website, address, slug),
    );
    const names = new Map(players.map((each) => [each.id, each.name]));
    return {
      name,
      kind: "block",
      games: games.flatMap((game) => {
        const winner = names.get(game.winner);
        const loser = names.get(game.loser);
        // A game the page shows is not left out of the file: the folder keeps
        // its history, so a loss here would be permanent.
        if (winner === undefined || loser === undefined) {
          throw new Error(`A game of ${name} names a player it does not list.`);
        }
        return [
          gameOf(
            { name: winner, score: game.winnerScore },
            { name: loser, score: game.loserScore },
            game.drawn,
            game.withdrawn,
          ),
        ];
      }),
      bestOf: block.bestOf,
    };
  } catch (failure) {
    if (!isNotOfKind(failure, "PublicBlockOfTournament.NotABlock")) {
      throw failure;
    }
  }
  try {
    const { games } = await world.ask(
      new PublicKnockoutOfTournament(website, address, slug),
    );
    return {
      name,
      kind: "knockout",
      // A knockout's game cannot be withdrawn, and so none is said to be.
      matches: matchesOf(
        games.map((game) =>
          gameOf(
            { name: game.winner.name, score: game.winnerScore },
            { name: game.loser.name, score: game.loserScore },
            game.drawn,
            false,
          ),
        ),
      ),
    };
  } catch (failure) {
    if (!isNotOfKind(failure, "PublicKnockoutOfTournament.NotAKnockout")) {
      throw failure;
    }
  }
  const { games } = await world.ask(
    new PublicSwissOfTournament(website, address, slug),
  );
  return {
    name,
    kind: "swiss",
    games: games.map((game) =>
      gameOf(
        { name: game.winner.name, score: game.winnerScore },
        { name: game.loser.name, score: game.loserScore },
        game.drawn,
        game.withdrawn,
      ),
    ),
  };
};

const testOf = async (
  world: ExportWorld,
  website: string,
  address: string,
  slug: string,
  group: string | undefined,
): Promise<Record<string, unknown>> => {
  const { test, matches } = await world.ask(
    new PublicTestOfTournament(website, address, slug),
  );
  return {
    teams: [test.teams[0].name, test.teams[1].name],
    group: group ?? null,
    bestOf: test.bestOf,
    matches: matches.map((match) => ({
      players: [match.sides[0], match.sides[1]],
      games: match.games.map((game) =>
        gameOf(
          { name: match.sides[0], score: game.scores[0] },
          { name: match.sides[1], score: game.scores[1] },
          game.winner === undefined,
          // A test's game cannot be withdrawn either.
          false,
        ),
      ),
    })),
  };
};

const lastPartOf = (address: string): string =>
  address.slice(address.lastIndexOf("/") + 1);

/**
 * What the file of the tournament found at `address` says, read from the same
 * queries its public pages are drawn from, so that nothing is published that a
 * reader of those pages could not already see.
 */
const fileOf = async (
  world: ExportWorld,
  website: string,
  listed: {
    readonly name: string;
    readonly sport: string;
    readonly starts: string;
    readonly finishes: string;
    readonly country: string;
    readonly region?: string | undefined;
    readonly address: string;
  },
): Promise<string> => {
  const read = await world.ask(
    new PublicPlayersOfTournament(website, listed.address),
  );
  const said: Record<string, unknown> = {
    layout: LAYOUT,
    name: read.name,
    sport: listed.sport,
    firstDay: listed.starts,
    lastDay: listed.finishes,
    country: listed.country,
    region: listed.region ?? null,
  };
  if (read.playedByTeams) {
    const { teams } = await world.ask(
      new PublicTeamSummaryOfTournament(website, listed.address),
    );
    const shortNames = new Map(
      teams.map((each) => [each.name, each.shortName]),
    );
    said["teams"] = read.teams.map((team) => ({
      name: team.name,
      shortName: shortNames.get(team.name) ?? null,
      players: team.players.map((player) => player.name),
    }));
    const tests: Record<string, unknown>[] = [];
    for (const competition of read.competitions) {
      tests.push(
        await testOf(
          world,
          website,
          listed.address,
          lastPartOf(competition.address),
          competition.group?.name,
        ),
      );
    }
    said["tests"] = tests;
  } else {
    said["players"] = read.players.map((player) => ({
      name: player.name,
      representing: player.representing ?? null,
    }));
    const competitions: Record<string, unknown>[] = [];
    for (const competition of read.competitions) {
      competitions.push(
        await competitionOf(
          world,
          website,
          listed.address,
          competition.name,
          lastPartOf(competition.address),
        ),
      );
    }
    said["competitions"] = competitions;
  }
  // The same things in the same order each run, so that a file changes only
  // where what it says has changed.
  return `${JSON.stringify(said, undefined, 2)}\n`;
};

// ---------------------------------------------------------------------------
// The run
// ---------------------------------------------------------------------------

interface Parsed {
  readonly folder: string | undefined;
  /** Whether Git is left alone, so that the files are written and no more. */
  readonly test: boolean;
  /** Whether every tournament is read, and not only those that have changed. */
  readonly all: boolean;
  readonly mistake: string | undefined;
}

const parse = (args: readonly string[]): Parsed => {
  let folder: string | undefined;
  let test = false;
  let all = false;
  for (let at = 0; at < args.length; at += 1) {
    const arg = args[at]!;
    if (arg === "--test") {
      test = true;
      continue;
    }
    if (arg === "--all") {
      all = true;
      continue;
    }
    if (arg !== "--folder") {
      return { folder: undefined, test, all, mistake: `${arg} is not known.` };
    }
    const value = args[at + 1];
    if (value === undefined || value.startsWith("--")) {
      return { folder: undefined, test, all, mistake: undefined };
    }
    folder = value;
    at += 1;
  }
  return { folder, test, all, mistake: undefined };
};

/** What was exported of a tournament, as the last run left it. */
interface Recorded {
  readonly address: string;
  readonly fingerprint: string;
}

// Kept inside the folder's own Git directory, which is never committed, so
// that it goes with the clone it is true of: a folder that is cloned again, or
// has its files put back by hand, has no record, and so is exported whole
// rather than believed.
const recordFile = (folder: string): string =>
  join(folder, ".git", "export-record.json");

const recordedIn = async (folder: string): Promise<Map<string, Recorded>> => {
  try {
    const parsed = JSON.parse(await readFile(recordFile(folder), "utf8")) as {
      layout?: unknown;
      tournaments?: Record<string, Recorded>;
    };
    // A record of another layout says nothing of what a file would say now.
    if (parsed.layout !== LAYOUT || parsed.tournaments === undefined) {
      return new Map();
    }
    return new Map(Object.entries(parsed.tournaments));
  } catch {
    return new Map();
  }
};

const recordIn = async (
  folder: string,
  tournaments: ReadonlyMap<string, Recorded>,
): Promise<void> => {
  const text = JSON.stringify({
    layout: LAYOUT,
    tournaments: Object.fromEntries(tournaments),
  });
  // A name of its own until it is whole, as the files are.
  await writeFile(`${recordFile(folder)}.partial`, text);
  await rename(`${recordFile(folder)}.partial`, recordFile(folder));
};

const ofFilesIn = async (folder: string): Promise<string[]> => {
  const found: string[] = [];
  const years = await readdir(folder, { withFileTypes: true });
  for (const year of years) {
    if (!year.isDirectory() || !/^\d{4}$/.test(year.name)) continue;
    for (const sport of await readdir(join(folder, year.name), {
      withFileTypes: true,
    })) {
      if (!sport.isDirectory()) continue;
      for (const file of await readdir(join(folder, year.name, sport.name))) {
        const name = `${year.name}/${sport.name}/${file}`;
        if (TOURNAMENTS_FILE.test(name)) found.push(name);
      }
    }
  }
  return found;
};

// Only a file that says it is a tournament's layout is a tournament's to
// remove: one somebody else put under a year is theirs.
const isOurs = async (folder: string, name: string): Promise<boolean> => {
  try {
    const parsed: unknown = JSON.parse(
      await readFile(join(folder, name), "utf8"),
    );
    return (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as { layout?: unknown }).layout === "number"
    );
  } catch {
    return false;
  }
};

/**
 * The script's work, with the arguments as the command line gives them
 * (exportTournamentsCli.feature): writes each public tournament of both
 * websites to a file of the folder, takes away the files of those that are no
 * longer public, and stages, commits and pushes what it changed.
 */
export const runExportTournaments = async (
  args: readonly string[],
  world: ExportWorld,
): Promise<ExportOutcome> => {
  const { say } = world;
  const parsed = parse(args);
  if (parsed.mistake !== undefined) {
    say(parsed.mistake);
    say("Usage: export:tournaments --folder <folder> [--test] [--all]");
    return { exitCode: 1 };
  }
  if (parsed.folder === undefined) {
    say("The folder is needed: --folder says where the files are written.");
    say("Usage: export:tournaments --folder <folder> [--test] [--all]");
    return { exitCode: 1 };
  }
  const folder = resolve(world.workingFolder, parsed.folder);

  // What an address in a failure is hidden by, known once the remote is.
  let remoteAddress: string | undefined;
  const safe = (text: string): string => withoutRemote(text, remoteAddress);

  const tellTheAdministrator = async (
    paragraphs: readonly string[],
  ): Promise<void> => {
    try {
      await world.send({
        to: world.administrator,
        // WARNING first, so that it stands out in an inbox.
        subject: "WARNING: Croquet Scores tournament export FAILED",
        body: paragraphs.map((each) => `<p>${escaped(each)}</p>`).join("\n"),
      });
    } catch (failure) {
      say(`The administrator could not be told: ${safe(messageOf(failure))}`);
    }
  };

  const failed = async (
    step: string,
    why: string | undefined,
  ): Promise<ExportOutcome> => {
    const reason = why === undefined ? undefined : safe(why);
    say("The export failed.");
    say(`The failure was ${step}.`);
    if (reason !== undefined) say(`Why: ${reason}`);
    await tellTheAdministrator([
      "The export failed.",
      `The failure was ${step}.`,
      ...(reason === undefined ? [] : [`Why: ${reason}`]),
    ]);
    // A failure, whether or not the administrator could be told of it.
    return { exitCode: 1 };
  };

  const git = async (
    args: readonly string[],
    input?: string,
  ): Promise<GitEnded> => world.git(folder, args, input);

  // Not made where it is not there: files written to a folder made for a
  // mistyped name would be a second place they were quietly kept.
  if (!(await isAFolder(folder))) {
    return failed("that the folder is not there", undefined);
  }
  // Said once and in one place what a test leaves alone: every call of Git,
  // which is the repository, its remote, the pull, and the staging, the commit
  // and the push, so that the files can be looked at without publishing them.
  const test = parsed.test;
  let remote = "";
  let remoteHead = "";
  let branchName = "";
  if (!test) {
    if (!(await exists(join(folder, ".git")))) {
      return failed("that the folder is not a Git repository", undefined);
    }
    let remotes: GitEnded;
    try {
      remotes = await git(["remote"]);
    } catch (failure) {
      return failed("asking the folder for its remote", messageOf(failure));
    }
    const names = remotes.said
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line !== "");
    if (remotes.code !== 0 || names.length === 0) {
      return failed("that the folder has no remote", undefined);
    }
    remote = names.includes("origin") ? "origin" : names[0]!;
    try {
      const address = await git(["remote", "get-url", remote]);
      if (address.code === 0) remoteAddress = address.said.trim();
    } catch {
      // Hidden by what it looks like instead, below.
    }

    // Pulled before anything is written, so that what is written is laid over
    // what is published; and only forward, since a merge made with nobody
    // looking is somebody's files quietly changed.
    try {
      const branch = await git(["symbolic-ref", "--short", "HEAD"]);
      if (branch.code !== 0) {
        return failed("pulling the folder", "The folder is not on a branch.");
      }
      const on = branch.said.trim();
      branchName = on;
      const there = await git([
        "ls-remote",
        "--heads",
        remote,
        `refs/heads/${on}`,
      ]);
      if (there.code !== 0) return failed("pulling the folder", whyOf(there));
      remoteHead = there.said.split(/\s/)[0] ?? "";
      if (remoteHead !== "") {
        const pulled = await git(["pull", "--ff-only", remote, on]);
        if (pulled.code !== 0) {
          return failed(
            "pulling the folder",
            whyOf(pulled) === ""
              ? "The folder and its remote have each gone their own way."
              : whyOf(pulled),
          );
        }
      }
    } catch (failure) {
      return failed("pulling the folder", messageOf(failure));
    }
  }

  // Read before anything is written, so that a tournament that cannot be read
  // fails the run with nothing changed.
  // What of each tournament is to be said, or nothing where its file is as
  // the record says it should be and is not read again.
  const wanted = new Map<string, string | undefined>();
  const toRecord = new Map<string, Recorded>();
  // A test leaves the folder's Git directory alone with the rest of Git, and
  // so keeps no record and reads every tournament.
  const recorded: Map<string, Recorded> =
    test || parsed.all ? new Map<string, Recorded>() : await recordedIn(folder);
  const read = { count: 0 };
  try {
    // What marks each tournament is read before anything of the tournaments is,
    // so that whatever is kept while they are read is newer than the mark and
    // shows as a change the next time. Read after, the mark could be of a
    // change the file was made without, and that change would be missed.
    const marks = new Map<string, string>();
    for (const website of WEBSITES_EXPORTED) {
      for (const each of await world.ask(new TournamentFingerprints(website))) {
        marks.set(each.id, each.fingerprint);
      }
    }
    const listings: {
      readonly website: string;
      readonly listed: TournamentOfWebsite;
    }[] = [];
    const addresses = new Set<string>();
    for (const website of WEBSITES_EXPORTED) {
      for (const year of await world.ask(new TournamentYears(website))) {
        for (const listed of await world.ask(
          new TournamentsInYear(website, year),
        )) {
          // Two tournaments at one address would be one file, with one of
          // them quietly missing.
          if (addresses.has(listed.address)) {
            throw new Error(
              `Two tournaments are at the address ${listed.address}.`,
            );
          }
          addresses.add(listed.address);
          listings.push({ website, listed });
        }
      }
    }
    // Read unless the record says it is as it was: the same mark and the same
    // address, and a file there. Anything that cannot be shown to be
    // unchanged is read, so that a doubt is never settled by leaving it.
    const toRead: number[] = [];
    for (const [at, { listed }] of listings.entries()) {
      const mark = marks.get(listed.id);
      const before = recorded.get(listed.id);
      const unchanged =
        mark !== undefined &&
        before !== undefined &&
        before.fingerprint === mark &&
        before.address === listed.address &&
        (await exists(join(folder, `${listed.address}.json`)));
      if (mark !== undefined) {
        toRecord.set(listed.id, { address: listed.address, fingerprint: mark });
      }
      if (unchanged) wanted.set(`${listed.address}.json`, undefined);
      else toRead.push(at);
    }
    read.count = toRead.length;
    say(
      `${listings.length === 1 ? "1 tournament is" : `${withCommas(listings.length)} tournaments are`} public, and ${withCommas(toRead.length)} to read.`,
    );
    // A few at a time, since each is several questions and the database may be
    // a long way off; said as it goes, so that a long read is seen to be going.
    // Kept in the order they were listed, so that the files are written in the
    // same order whatever order the answers came in.
    const texts = new Map<number, string>();
    let next = 0;
    // Set by the first reader to fail, so that the others stop and nothing is
    // still asking the database when the run has reported and the pool closes.
    let stopped = false;
    const worker = async (): Promise<void> => {
      while (!stopped && next < toRead.length) {
        const at = toRead[next]!;
        next += 1;
        const { website, listed } = listings[at]!;
        try {
          texts.set(at, await fileOf(world, website, listed));
        } catch (failure) {
          stopped = true;
          throw failure;
        }
        if (texts.size % 25 === 0 || texts.size === toRead.length) {
          say(
            `Read ${withCommas(texts.size)} of ${withCommas(toRead.length)}.`,
          );
        }
      }
    };
    // Settled and not raced, so that every reader has ended before the first
    // failure is reported.
    const ended = await Promise.allSettled(
      Array.from({ length: Math.min(READ_AT_ONCE, toRead.length) }, worker),
    );
    for (const each of ended) {
      if (each.status === "rejected") throw each.reason;
    }
    for (const [at, { listed }] of listings.entries()) {
      const name = `${listed.address}.json`;
      if (wanted.has(name)) continue;
      const text = texts.get(at);
      // Never left as nothing, which would say it is unchanged.
      if (text === undefined) throw new Error(`${name} was not read.`);
      wanted.set(name, text);
    }
  } catch (failure) {
    return failed("reading the tournaments", messageOf(failure));
  }

  const written: string[] = [];
  let alreadyAsTheyShouldBe = 0;
  try {
    for (const [name, text] of wanted) {
      if (text === undefined) {
        alreadyAsTheyShouldBe += 1;
        continue;
      }
      const path = join(folder, name);
      let before: string | undefined;
      try {
        before = await readFile(path, "utf8");
      } catch {
        before = undefined;
      }
      if (before === text) {
        alreadyAsTheyShouldBe += 1;
        continue;
      }
      await mkdir(dirname(path), { recursive: true });
      // A name of its own until it is whole, so that the folder never holds
      // half a file under the name of a whole one.
      const partial = `${path}.partial`;
      try {
        await world.write(partial, text);
        await rename(partial, path);
      } catch (failure) {
        await rm(partial, { force: true }).catch(() => undefined);
        throw failure;
      }
      written.push(name);
    }
  } catch (failure) {
    return failed("writing a file", messageOf(failure));
  }

  // Taken away only once every file has been written: a file taken away cannot
  // be told from one whose tournament was archived, and so waits for a run
  // that finished.
  const removed: string[] = [];
  // Only a file Git knows is part of a commit: one it never saw is not a
  // change to commit, and naming it would fail the commit.
  const removedTracked: string[] = [];
  try {
    for (const name of await ofFilesIn(folder)) {
      if (wanted.has(name) || !(await isOurs(folder, name))) continue;
      const tracked = test
        ? undefined
        : await git(["ls-files", "--error-unmatch", "--", name]);
      await rm(join(folder, name));
      removed.push(name);
      if (tracked?.code === 0) removedTracked.push(name);
      for (const empty of [
        dirname(join(folder, name)),
        dirname(dirname(join(folder, name))),
      ]) {
        if ((await readdir(empty)).length === 0)
          await rm(empty, { recursive: true });
      }
    }
  } catch (failure) {
    return failed("removing a file", messageOf(failure));
  }

  // Recorded once every file is as it should be, and not before: a run that
  // stopped part way has recorded nothing, and so the next reads what this
  // one did not reach. Only the files are what is believed, so a record that
  // cannot be kept costs a longer next run and never a missed change.
  if (!test) {
    try {
      await recordIn(folder, toRecord);
    } catch (failure) {
      say(`The record could not be kept: ${messageOf(failure)}`);
    }
  }

  say(`${counted(read.count, "tournament", "tournaments")} read.`);
  say(`${tournamentsWritten(written.length)} written.`);
  say(
    `${counted(alreadyAsTheyShouldBe, "tournament", "tournaments")} already as ${alreadyAsTheyShouldBe === 1 ? "it" : "they"} should be.`,
  );
  say(`${counted(removed.length, "file", "files")} removed.`);
  if (test) {
    say("This was a test run: no Git command was run.");
    return { exitCode: 0 };
  }

  // What a run changed, and what an earlier run wrote and was stopped before
  // committing: both are the run's to commit, and nothing else in the folder.
  let pending: string[];
  // A removal an earlier run made and was stopped before committing.
  let pendingRemoved: string[];
  try {
    const status = await git([
      "status",
      "--porcelain",
      "-z",
      "--untracked-files=all",
    ]);
    if (status.code !== 0)
      return failed("committing the folder", whyOf(status));
    const entries = status.said
      .split("\0")
      .filter((entry) => entry.length > 3)
      .map((entry) => ({ code: entry.slice(0, 2), name: entry.slice(3) }));
    pending = entries
      .filter(({ name }) => wanted.has(name))
      .map(({ name }) => name);
    pendingRemoved = entries
      .filter(
        ({ code, name }) =>
          code.includes("D") &&
          TOURNAMENTS_FILE.test(name) &&
          !wanted.has(name),
      )
      .map(({ name }) => name);
  } catch (failure) {
    return failed("committing the folder", messageOf(failure));
  }
  const toStage = [...new Set([...written, ...pending])];
  const toRemove = [...new Set([...removedTracked, ...pendingRemoved])];
  const paths = [...toStage, ...toRemove];

  try {
    if (paths.length > 0) {
      const input = `${paths.join("\0")}\0`;
      if (toStage.length > 0) {
        const added = await git(
          ["add", "--pathspec-from-file=-", "--pathspec-file-nul"],
          `${toStage.join("\0")}\0`,
        );
        if (added.code !== 0)
          return failed("committing the folder", whyOf(added));
      }
      if (toRemove.length > 0) {
        const taken = await git(
          [
            "rm",
            "--cached",
            "--ignore-unmatch",
            "-q",
            "--pathspec-from-file=-",
            "--pathspec-file-nul",
          ],
          `${toRemove.join("\0")}\0`,
        );
        if (taken.code !== 0)
          return failed("committing the folder", whyOf(taken));
      }
      const message = [
        "Export the tournaments that are public now",
        "",
        `${tournamentsWritten(written.length)} written, ${counted(alreadyAsTheyShouldBe, "tournament", "tournaments")} already as ${alreadyAsTheyShouldBe === 1 ? "it" : "they"} should be, and ${counted(removed.length, "file", "files")} removed, because the tournaments are no longer public.`,
        "",
        "Made by the script that exports the tournaments of both websites, from what their public pages show, and not by hand.",
      ].join("\n");
      // Only these, so that what somebody else had staged is not swept in.
      const committed = await git(
        [
          "commit",
          "--only",
          "-m",
          message,
          "--pathspec-from-file=-",
          "--pathspec-file-nul",
        ],
        input,
      );
      if (committed.code !== 0)
        return failed("committing the folder", whyOf(committed));
      say(`Committed ${withCommas(paths.length)} files.`);
    }
  } catch (failure) {
    return failed("committing the folder", messageOf(failure));
  }

  // Pushed where the folder has a commit the remote does not, which is one
  // an earlier run made and could not push as much as this run's own.
  let head: string | undefined;
  try {
    const parsedHead = await git(["rev-parse", "--verify", "-q", "HEAD"]);
    head = parsedHead.code === 0 ? parsedHead.said.trim() : undefined;
  } catch {
    head = undefined;
  }
  if (head === undefined || head === remoteHead) {
    if (paths.length === 0) say("There was nothing to commit.");
    return { exitCode: 0 };
  }
  try {
    const pushed = await git(["push", remote, branchName]);
    if (pushed.code !== 0) return failed("pushing the folder", whyOf(pushed));
  } catch (failure) {
    return failed("pushing the folder", messageOf(failure));
  }
  say("The files were pushed.");
  return { exitCode: 0 };
};
