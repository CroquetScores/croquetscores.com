// The players' lists as the world rankings keep them on their own site
// (WorldRankingWebsite.feature): a file for each sport, a line to a player,
// the player's details separated by commas. Only each player's full name is
// read.
import {
  ListRefused,
  type WorldRankingLists,
  type WorldRankingSport,
} from "../../application/services/WorldRankingLists.js";

/**
 * Each sport as what is written for whoever runs the site names it: what a
 * list not read is refused with, and what the import says as it goes. Not a
 * reader's words, which are the catalogues'.
 */
export const worldRankingSportNames: Readonly<
  Record<WorldRankingSport, string>
> = { ac: "association croquet", gc: "golf croquet" };

/** Where the world rankings keep each sport's list. */
export const worldRankingAddresses: Readonly<
  Record<WorldRankingSport, string>
> = {
  ac: "http://rank.worldcroquet.org/cgs/data_dir/names.dat",
  gc: "http://rank.worldcroquet.org/gctest/data_source/players.txt",
};

// Half a minute: each list is most of a megabyte, and the rankings' site is
// not quick. The import is waited on by an administrator who asked for it,
// not by a reader on their way somewhere else.
export const defaultWaitMilliseconds = 30_000;

// How each sport's lines are laid out: how many details a line has, and which
// make up the full name, counted from nought. Association croquet's first
// name is its seventh detail; golf croquet's is the name the player is known
// by, its fourth, rather than the name they were given, its third.
const LAYOUTS: Readonly<
  Record<
    WorldRankingSport,
    { details: number; firstName: number; surname: number }
  >
> = {
  ac: { details: 25, firstName: 6, surname: 1 },
  gc: { details: 17, firstName: 3, surname: 1 },
};

const unreachable = (
  sport: WorldRankingSport,
  what: string,
  cause?: unknown,
): ListRefused =>
  new ListRefused(
    "WorldRankingLists.Unreachable",
    `The world rankings' ${worldRankingSportNames[sport]} list ${what}.`,
    cause,
  );

const unreadable = (sport: WorldRankingSport, what: string): ListRefused =>
  new ListRefused(
    "WorldRankingLists.Unreadable",
    `The world rankings' ${worldRankingSportNames[sport]} list ${what}, so none of it was read.`,
  );

export class WorldRankingWebsite implements WorldRankingLists {
  constructor(
    private readonly addresses: Readonly<
      Record<WorldRankingSport, string>
    > = worldRankingAddresses,
    private readonly waitMilliseconds: number = defaultWaitMilliseconds,
  ) {}

  async playersOf(sport: WorldRankingSport): Promise<readonly string[]> {
    return this.namesIn(sport, await this.fetched(sport));
  }

  // The whole of the list, as it was sent. The time allowed covers reading
  // the body as well as being answered, since a site that answers and then
  // stalls is as unreachable as one that never answers.
  private async fetched(sport: WorldRankingSport): Promise<Uint8Array> {
    try {
      const response = await fetch(this.addresses[sport], {
        signal: AbortSignal.timeout(this.waitMilliseconds),
      });
      if (!response.ok) {
        throw unreachable(sport, `was answered ${response.status}`);
      }
      return new Uint8Array(await response.arrayBuffer());
    } catch (cause) {
      if (cause instanceof ListRefused) throw cause;
      throw unreachable(
        sport,
        "could not be asked for, or was not answered in time",
        cause,
      );
    }
  }

  private namesIn(sport: WorldRankingSport, body: Uint8Array): string[] {
    let text: string;
    try {
      // Refused rather than read with a stand-in for what is not UTF-8,
      // which would keep names spelled wrong.
      text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    } catch {
      throw unreadable(sport, "is not UTF-8");
    }

    const { details, firstName, surname } = LAYOUTS[sport];
    // A Set keeps each name once, in the order the list first names it.
    const names = new Set<string>();
    for (const [index, line] of text.split(/\r?\n/).entries()) {
      if (line.trim() === "") continue;
      const said = line.split(",").map((detail) => detail.trim());
      const first = said[firstName] ?? "";
      const last = said[surname] ?? "";
      if (said.length !== details || first === "" || last === "") {
        throw unreadable(sport, `could not be read at line ${index + 1}`);
      }
      names.add(`${first} ${last}`);
    }
    if (names.size === 0) throw unreadable(sport, "has nobody on it");
    return [...names];
  }
}
