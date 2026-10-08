// A stand-in for the world rankings' site, listening on a port of its own,
// which serves each sport's list as a scenario says and remembers what it was
// asked for. A real HTTP server rather than a stubbed fetch, so that what is
// read is what came over the wire.
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { AddressInfo } from "node:net";

import type { WorldRankingSport } from "../../../../src/application/services/WorldRankingLists.js";

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
