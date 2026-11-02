// Association Croquet's rankings as a text file of who beat whom, in the
// format the world rankings' software reads, as the old site wrote it
// (rankingsTextFile.feature). It is in English whatever language the reader
// chose, and plain ASCII, since that is all the software reads.
import type {
  CompetitionOfRanking,
  RankingsToRead,
  ResultOfRanking,
} from "../../application/operations/tournaments/PublicRankingsOfTournament.js";

// "3.10.26", "3-5.10.26", "30.9-2.10.26" or "30.12.26-2.1.27": the days, said as
// short as is clear. A tournament of one day is dated by that day, as the
// world rankings' own lists date one, and not as a range of "3-3".
const whenOf = (starts: string, finishes: string): string => {
  const [startYear, startMonth, startDay] = starts.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  const [year, month, day] = finishes.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  const short = (value: number): string => String(value % 100).padStart(2, "0");
  const finish = `${String(day)}.${String(month)}.${short(year)}`;
  if (starts === finishes) return finish;
  if (startYear === year && startMonth === month) {
    return `${String(startDay)}-${finish}`;
  }
  if (startYear === year) {
    return `${String(startDay)}.${String(startMonth)}-${finish}`;
  }
  return `${String(startDay)}.${String(startMonth)}.${short(startYear)}-${finish}`;
};

// A score's hoops are the number it begins with, and its peeling is whatever
// follows, as "tp" in "26tp".
const partsOf = (score: string): { hoops: number; peeling: string } => {
  const matched = /^\s*(\d+)/.exec(score);
  const digits = matched?.[1] ?? "0";
  return {
    hoops: Number(digits),
    peeling: score.slice(matched?.[0].length ?? 0).trim(),
  };
};

// The winner's hoops less the loser's, with a plus where the winner scored
// more, then the winner's peeling and the loser's.
const scoreOf = (winnerScore: string, loserScore: string): string => {
  const winner = partsOf(winnerScore);
  const loser = partsOf(loserScore);
  const plus = winner.hoops > loser.hoops ? "+" : "";
  return `${plus}${String(winner.hoops - loser.hoops)}${winner.peeling}${loser.peeling}`;
};

// Matches where any of its results is of more than one game, which only a
// knockout's are, and single games otherwise.
const typeOf = (results: readonly ResultOfRanking[]): "match" | "single" =>
  results.some(({ games }) => games.length > 1) ? "match" : "single";

// A guess, as the old site's own code said, which the manager corrects: in a
// competition of matches the winner of the last, in a block the player it
// places first, which its competition says, and in any other of single games
// whoever has won strictly more than anybody else. Nobody in a tournament
// played by teams, where a test is won by a team and the best of its players
// is no winner of it (rankingsTextFile.feature).
const winnerOf = (
  competition: CompetitionOfRanking,
  type: "match" | "single",
  playedByTeams: boolean,
): string => {
  const { results, winner } = competition;
  if (playedByTeams) return "";
  if (winner !== undefined) return winner;
  if (type === "match") return results[results.length - 1]?.winner ?? "";
  const wins = new Map<string, number>();
  for (const { winner } of results) {
    wins.set(winner, (wins.get(winner) ?? 0) + 1);
  }
  const ranked = [...wins.entries()].sort((one, other) => other[1] - one[1]);
  const [first, second] = ranked;
  if (first === undefined) return "";
  return second === undefined || first[1] > second[1] ? first[0] : "";
};

const blockOf = (
  rankings: RankingsToRead,
  competition: CompetitionOfRanking,
  several: boolean,
): string[] => {
  const { results } = competition;
  const type = typeOf(results);
  const winners = Math.max(...results.map(({ winner }) => winner.length));
  const losers = Math.max(...results.map(({ loser }) => loser.length));
  return [
    `Event ${rankings.name}${several ? ` ${competition.name}` : ""}`,
    `Date ${whenOf(rankings.starts, rankings.finishes)}`,
    `Winner ${winnerOf(competition, type, rankings.playedByTeams)}`,
    `Type ${type}`,
    `Country ${rankings.country}`,
    "Order firstname",
    "",
    ...results.map(
      (result, at) =>
        `${String(at + 1).padStart(2, " ")} ${result.winner.padEnd(winners)} beat ${result.loser.padEnd(losers)} ${result.games
          .map(({ winnerScore, loserScore }) =>
            scoreOf(winnerScore, loserScore),
          )
          .join(", ")}`,
    ),
    "End",
  ];
};

// What the software cannot read is written as the plain letter where there is
// one, as "é" is "e", and as "?" where there is not.
const asciiOf = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7f]/g, "?");

/** The text file of `rankings`, which must be available. */
export const rankingsTextFile = (rankings: RankingsToRead): string => {
  const { rankings: said } = rankings;
  if (said.is !== "available") {
    throw new Error("There are no rankings to write.");
  }
  const several = said.competitionCount > 1;
  const blocks = said.competitions.map((competition) =>
    blockOf(rankings, competition, several),
  );
  const lines = blocks.flatMap((block, at) =>
    at === 0 ? block : ["", ...block],
  );
  return asciiOf(lines.map((line) => `${line}\r\n`).join(""));
};
