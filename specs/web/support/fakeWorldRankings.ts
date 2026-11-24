// What stands in for the world rankings' site in a scenario: a server of the
// scenario's own that serves each sport's list as the scenario says, and
// remembers what it was asked for. The site is told where it is, as a
// deployment is told where the real lists are, and reads from it over the wire.
import { After, Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { site, siteTold } from "./site.js";
import type { WebWorld } from "./world.js";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

/** The two sports the rankings keep lists of. */
type WorldRankingSport = "ac" | "gc";

/** How the fake answers a sport's list. */
export type ListAnswer =
  // The list, as the scenario has written it.
  | "list"
  // A failure, with nothing in its body.
  | "failure"
  // The list, once the reading has stopped waiting for it.
  | "late"
  // Nothing, until the fake is stopped.
  | "held";

// Where the real site keeps each list, so that the paths are the real ones.
const PATHS: Readonly<Record<WorldRankingSport, string>> = {
  ac: "/cgs/data_dir/names.dat",
  gc: "/gctest/data_source/players.txt",
};

// A line for a player the scenario names by their full name, laid out as the
// real lists lay theirs out: the first word is the player's first name, and
// the rest their surname.
const lineNaming = (
  sport: WorldRankingSport,
  number: number,
  fullName: string,
): string => {
  const space = fullName.indexOf(" ");
  const first = fullName.slice(0, space);
  const surname = fullName.slice(space + 1);
  return sport === "ac"
    ? `${String(number).padStart(6)},${surname},X,     ,England,   100,${first}${", ".repeat(18)}`
    : `${number},${surname},${first},${first},m,ENG,ENG,,2000,2000,,,,,1,0,0`;
};

export class FakeWorldRankings {
  /** The path of every request made of it, in order. */
  readonly asked: string[] = [];

  private readonly lines: Record<WorldRankingSport, Buffer[]> = {
    ac: [],
    gc: [],
  };
  private readonly answers: Record<WorldRankingSport, ListAnswer> = {
    ac: "list",
    gc: "list",
  };
  private numbered = 0;
  private lateBy = 0;
  private readonly timers = new Set<NodeJS.Timeout>();
  private stopped = false;

  private constructor(private readonly server: Server) {}

  static async start(): Promise<FakeWorldRankings> {
    const server = createServer();
    const fake = new FakeWorldRankings(server);
    server.on("request", (request, response) => {
      fake.serve(request, response);
    });
    await new Promise<void>((resolve) => {
      server.listen(0, "127.0.0.1", resolve);
    });
    return fake;
  }

  /** Where the reading is told to find each sport's list. */
  get addresses(): Record<WorldRankingSport, string> {
    const { port } = this.server.address() as AddressInfo;
    const at = `http://127.0.0.1:${port}`;
    return { ac: `${at}${PATHS.ac}`, gc: `${at}${PATHS.gc}` };
  }

  /** Adds a line naming `fullName` to `sport`'s list. */
  names(sport: WorldRankingSport, fullName: string): void {
    this.numbered += 1;
    this.has(sport, lineNaming(sport, this.numbered, fullName));
  }

  /** Takes every line naming `fullName` off `sport`'s list. */
  noLongerNames(sport: WorldRankingSport, fullName: string): void {
    const space = fullName.indexOf(" ");
    const first = fullName.slice(0, space);
    const surname = fullName.slice(space + 1);
    this.lines[sport] = this.lines[sport].filter((line) => {
      const said = line
        .toString("utf8")
        .split(",")
        .map((detail) => detail.trim());
      return !said.includes(first) || !said.includes(surname);
    });
  }

  /** Adds `line` to `sport`'s list exactly as it is written. */
  has(sport: WorldRankingSport, line: string | Buffer): void {
    this.lines[sport].push(
      typeof line === "string" ? Buffer.from(line, "utf8") : line,
    );
  }

  /** Empties `sport`'s list. */
  empties(sport: WorldRankingSport): void {
    this.lines[sport] = [];
  }

  /**
   * Answers `sport`'s list as `answer` says. A late answer comes
   * `byMilliseconds` after it is asked for.
   */
  answer(sport: WorldRankingSport, how: ListAnswer, byMilliseconds = 0): void {
    this.answers[sport] = how;
    this.lateBy = byMilliseconds;
  }

  /** Stops answering, and drops every connection, so nothing reaches it. */
  async stop(): Promise<void> {
    if (this.stopped) return;
    this.stopped = true;
    for (const timer of this.timers) clearTimeout(timer);
    this.server.closeAllConnections();
    await new Promise<void>((resolve) => {
      this.server.close(() => resolve());
    });
  }

  private serve(request: IncomingMessage, response: ServerResponse): void {
    const path = request.url ?? "";
    this.asked.push(path);
    const sport = (Object.keys(PATHS) as WorldRankingSport[]).find(
      (each) => PATHS[each] === path,
    );
    if (sport === undefined) {
      response.writeHead(404);
      response.end();
      return;
    }
    switch (this.answers[sport]) {
      case "failure":
        response.writeHead(500);
        response.end();
        return;
      case "held":
        // Answered by nothing: stopping the fake drops the connection.
        return;
      case "late": {
        const timer = setTimeout(() => {
          this.timers.delete(timer);
          this.list(sport, response);
        }, this.lateBy);
        // A timer left running would hold the process open after the
        // scenario has finished with it.
        timer.unref();
        this.timers.add(timer);
        return;
      }
      case "list":
        this.list(sport, response);
        return;
    }
  }

  // Each line ended the way the real lists end theirs, with nothing but a
  // line feed, and nothing at all where there are no lines.
  private list(sport: WorldRankingSport, response: ServerResponse): void {
    const newLine = Buffer.from("\n");
    response.writeHead(200, { "content-type": "text/plain" });
    response.end(
      Buffer.concat(this.lines[sport].flatMap((line) => [line, newLine])),
    );
  }
}

const SPORT = "(association croquet|golf croquet)";
const sportCalled = (name: string): WorldRankingSport => {
  if (name === "association croquet") return "ac";
  if (name === "golf croquet") return "gc";
  throw new Error(`There is no world ranking list for ${name}.`);
};

/** How long the site waits for a list, which the scenarios keep short. */
const WAIT_MILLISECONDS = 1000;

const fakes = new WeakMap<WebWorld, FakeWorldRankings>();

const fakeOf = (world: WebWorld): FakeWorldRankings => {
  const found = fakes.get(world);
  assert.ok(found !== undefined, "There is no fake of the world rankings.");
  return found;
};

// The site is told where the lists are, as a deployment is, and how long to
// wait for them.
const pointedAt = async (
  world: WebWorld,
  fake: FakeWorldRankings,
  wait: number,
): Promise<void> => {
  const { ac, gc } = fake.addresses;
  world.baseUrl = (
    await siteTold({
      WORLD_RANKING_AC_ADDRESS: ac,
      WORLD_RANKING_GC_ADDRESS: gc,
      WORLD_RANKING_WAIT_MILLISECONDS: String(wait),
    })
  ).baseUrl;
};

Given("a fake of the world rankings", async function (this: WebWorld) {
  const fake = await FakeWorldRankings.start();
  fakes.set(this, fake);
  await pointedAt(this, fake, WAIT_MILLISECONDS);
});

After(async function (this: WebWorld) {
  await fakes.get(this)?.stop();
});

Given(
  new RegExp(`^the ${SPORT} list names "([^"]*)"$`),
  function (this: WebWorld, sport: string, fullName: string) {
    fakeOf(this).names(sportCalled(sport), fullName);
  },
);

Given(
  new RegExp(`^the ${SPORT} list no longer names "([^"]*)"$`),
  function (this: WebWorld, sport: string, fullName: string) {
    fakeOf(this).noLongerNames(sportCalled(sport), fullName);
  },
);

Given(
  new RegExp(`^the ${SPORT} list has the line "([^"]*)"$`),
  function (this: WebWorld, sport: string, line: string) {
    fakeOf(this).has(sportCalled(sport), line);
  },
);

Given(
  new RegExp(`^the ${SPORT} list has an empty line$`),
  function (this: WebWorld, sport: string) {
    fakeOf(this).has(sportCalled(sport), "");
  },
);

// Nothing like either sport's lines, so that it is refused whichever list it
// is on.
Given(
  new RegExp(`^the ${SPORT} list has a line that cannot be read$`),
  function (this: WebWorld, sport: string) {
    fakeOf(this).has(sportCalled(sport), "not a line of the list");
  },
);

// A whole golf croquet line, with its surname spelled in Latin-1, as a list
// saved in the wrong encoding would spell it: "Méndez", whose é is one byte
// that UTF-8 never begins a character with.
Given(
  new RegExp(`^the ${SPORT} list has a line that is not UTF-8$`),
  function (this: WebWorld, sport: string) {
    fakeOf(this).has(
      sportCalled(sport),
      Buffer.from("1,Méndez,Ana,Ana,f,ESP,ESP,,1300,1300,,,,,0,0,0", "latin1"),
    );
  },
);

Given(
  new RegExp(`^the ${SPORT} list is empty$`),
  function (this: WebWorld, sport: string) {
    fakeOf(this).empties(sportCalled(sport));
  },
);

Given(
  new RegExp(`^the world rankings answer the ${SPORT} list with a failure$`),
  function (this: WebWorld, sport: string) {
    fakeOf(this).answer(sportCalled(sport), "failure");
  },
);

Given(
  new RegExp(`^the world rankings answer the ${SPORT} list with the list$`),
  function (this: WebWorld, sport: string) {
    fakeOf(this).answer(sportCalled(sport), "list");
  },
);

Given(
  new RegExp(
    `^the world rankings answer the ${SPORT} list only after the reading has stopped waiting$`,
  ),
  function (this: WebWorld, sport: string) {
    fakeOf(this).answer(sportCalled(sport), "late", WAIT_MILLISECONDS * 2);
  },
);

// Held back for as long as the scenario lasts, with the site told to wait
// longer than that, so that what is under way stays under way while the
// scenario looks at it. Stopping the fake lets go of it.
Given(
  new RegExp(`^the world rankings hold back the ${SPORT} list$`),
  async function (this: WebWorld, sport: string) {
    const fake = fakeOf(this);
    fake.answer(sportCalled(sport), "held");
    await pointedAt(this, fake, 60_000);
  },
);

// Nothing listening is as unreachable as a site gets.
Given("the world rankings cannot be reached", async function (this: WebWorld) {
  await fakeOf(this).stop();
});

Then(
  new RegExp(`^the ${SPORT} list was not asked for$`),
  function (this: WebWorld, sport: string) {
    assert.ok(
      !fakeOf(this).asked.includes(PATHS[sportCalled(sport)]),
      `Asked for ${JSON.stringify(fakeOf(this).asked)}.`,
    );
  },
);

// Read from the fake rather than from the page, because what is asked is
// whether the site was asked anything at all.
Then("nothing was asked of the world rankings", function (this: WebWorld) {
  assert.deepEqual(fakeOf(this).asked, []);
});

// The players kept ----------------------------------------------------------

// What the site holds, read from it as anybody would read them.
const kept = async (sport: WorldRankingSport): Promise<string[]> => {
  const { baseUrl, token } = await site();
  const answer = await fetch(
    `${baseUrl}/__test/world-ranking-players?sport=${sport}`,
    { headers: { "x-test-control": token } },
  );
  return ((await answer.json()) as { names: string[] }).names;
};

Then(
  new RegExp(`^"([^"]*)" is kept among the ${SPORT} players$`),
  async function (this: WebWorld, fullName: string, sport: string) {
    const names = await kept(sportCalled(sport));
    assert.ok(names.includes(fullName), `Kept ${JSON.stringify(names)}.`);
  },
);

Then(
  new RegExp(`^"([^"]*)" is not kept among the ${SPORT} players$`),
  async function (this: WebWorld, fullName: string, sport: string) {
    const names = await kept(sportCalled(sport));
    assert.ok(!names.includes(fullName), `Kept ${JSON.stringify(names)}.`);
  },
);

Then(
  new RegExp(`^(\\d+) ${SPORT} players? (?:is|are) kept$`),
  async function (this: WebWorld, count: string, sport: string) {
    const names = await kept(sportCalled(sport));
    assert.equal(names.length, Number(count), `Kept ${JSON.stringify(names)}.`);
  },
);
