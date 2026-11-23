// The players' lists as the world rankings keep them on their own site
// (WorldRankingWebsite.feature): a file for each sport, a line to a player,
// the player's details separated by commas. Only each player's full name is
// read, and for association croquet the number the rankings give them.
import {
  type AssociationCroquetPlayer,
  DuplicateNamesRefused,
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

// The most a number can be and still be kept, which is as large as the
// database's integer goes.
const MOST_ID = 2_147_483_647;

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

  async associationCroquetPlayers(): Promise<
    readonly AssociationCroquetPlayer[]
  > {
    const players: AssociationCroquetPlayer[] = [];
    for (const { details, index } of this.linesOf(
      "ac",
      await this.fetched("ac"),
    )) {
      const worldRankingId = Number(details[0]);
      if (!/^\d+$/.test(details[0] ?? "") || worldRankingId > MOST_ID) {
        throw unreadable("ac", `could not be read at line ${index + 1}`);
      }
      players.push({ worldRankingId, name: this.nameOn("ac", details) });
    }
    this.somebody("ac", players);

    // Refused whole where a name is two players or a number is two names:
    // the site finds a player by either, and could not tell them apart.
    // Names are matched exactly, as the site spells them.
    const numbersOf = new Map<string, number[]>();
    const nameOf = new Map<number, string>();
    let numberGivenTwice: number | undefined;
    for (const { worldRankingId, name } of players) {
      numbersOf.set(name, [...(numbersOf.get(name) ?? []), worldRankingId]);
      const had = nameOf.get(worldRankingId);
      if (had !== undefined && had !== name) numberGivenTwice = worldRankingId;
      nameOf.set(worldRankingId, name);
    }
    const duplicates = [...numbersOf]
      .filter(([, numbers]) => numbers.length > 1)
      .map(([name, worldRankingIds]) => ({ name, worldRankingIds }));
    if (duplicates.length > 0) {
      throw new DuplicateNamesRefused(
        `The world rankings' ${worldRankingSportNames.ac} list gives a full name to more than one player, so none of it was read: ${duplicates
          .map(
            ({ name, worldRankingIds }) =>
              `${name} (${worldRankingIds.join(", ")})`,
          )
          .join("; ")}.`,
        duplicates,
      );
    }
    if (numberGivenTwice !== undefined) {
      throw new ListRefused(
        "WorldRankingLists.DuplicateNumbers",
        `The world rankings' ${worldRankingSportNames.ac} list gives the number ${numberGivenTwice} to more than one name, so none of it was read.`,
      );
    }
    return players;
  }

  async golfCroquetNames(): Promise<readonly string[]> {
    // A Set keeps each name once, in the order the list first names it.
    const names = new Set<string>();
    for (const { details } of this.linesOf("gc", await this.fetched("gc"))) {
      names.add(this.nameOn("gc", details));
    }
    return this.somebody("gc", [...names]);
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

  // Every line that is a player's, with its details, refused where any is not
  // laid out as its sport's are.
  private linesOf(
    sport: WorldRankingSport,
    body: Uint8Array,
  ): { details: string[]; index: number }[] {
    let text: string;
    try {
      // Refused rather than read with a stand-in for what is not UTF-8,
      // which would keep names spelled wrong.
      text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    } catch {
      throw unreadable(sport, "is not UTF-8");
    }

    const { details, firstName, surname } = LAYOUTS[sport];
    const lines: { details: string[]; index: number }[] = [];
    for (const [index, line] of text.split(/\r?\n/).entries()) {
      if (line.trim() === "") continue;
      const said = line.split(",").map((detail) => detail.trim());
      if (
        said.length !== details ||
        (said[firstName] ?? "") === "" ||
        (said[surname] ?? "") === ""
      ) {
        throw unreadable(sport, `could not be read at line ${index + 1}`);
      }
      lines.push({ details: said, index });
    }
    return lines;
  }

  private nameOn(sport: WorldRankingSport, details: string[]): string {
    const { firstName, surname } = LAYOUTS[sport];
    return `${details[firstName] ?? ""} ${details[surname] ?? ""}`;
  }

  private somebody<T>(sport: WorldRankingSport, players: T[]): T[] {
    if (players.length === 0) throw unreadable(sport, "has nobody on it");
    return players;
  }
}
