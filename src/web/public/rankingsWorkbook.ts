// Golf Croquet's and American 6 Wicket's rankings as a spreadsheet of who beat
// whom, laid out as the old site laid it out, since the rankings officers'
// own software reads it by position (rankingsWorkbook.feature). It is in
// English whatever language the reader chose, since the people who read it
// do not choose it.
import type { RankingsToRead } from "../../application/operations/tournaments/PublicRankingsOfTournament.js";
import { Slug } from "../../domain/common/Slug.js";
import { xlsxOf, type Row } from "../common/xlsx.js";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface Day {
  readonly year: number;
  readonly month: number;
  readonly day: number;
}

const dayOf = (written: string): Day => {
  const [year, month, day] = written.split("-").map(Number) as [
    number,
    number,
    number,
  ];
  return { year, month, day };
};

const monthOf = ({ month }: Day): string => months[month - 1] ?? "";

// "3 October 2026", "3-5 October 2026", "30 September-2 October 2026", or
// "30 December 2026 - 2 January 2027".
const datesOf = (starts: string, finishes: string): string => {
  const start = dayOf(starts);
  const finish = dayOf(finishes);
  const full = (day: Day): string =>
    `${String(day.day)} ${monthOf(day)} ${String(day.year)}`;
  if (
    start.year === finish.year &&
    start.month === finish.month &&
    start.day === finish.day
  ) {
    return full(start);
  }
  if (start.year === finish.year && start.month === finish.month) {
    return `${String(start.day)}-${full(finish)}`;
  }
  if (start.year === finish.year) {
    return `${String(start.day)} ${monthOf(start)}-${full(finish)}`;
  }
  return `${full(start)} - ${full(finish)}`;
};

// A name is cut at its first space: before it the first name, and after it,
// in capitals, the family name, as the old site cut it. A name of one word
// is a family name with no first name to give.
const namesOf = (name: string): { first: string; last: string } => {
  const at = name.indexOf(" ");
  return at < 0
    ? { first: "Unknown", last: name.toUpperCase() }
    : {
        first: name.slice(0, at).trim(),
        last: name
          .slice(at + 1)
          .trim()
          .toUpperCase(),
      };
};

// The sheet is named by a slug of the tournament's name, no longer than a
// sheet may be called.
const sheetNameOf = (name: string): string => {
  try {
    return Slug.fromName(name.slice(0, 31)).toString();
  } catch {
    return "rankings";
  }
};

/** The spreadsheet of `rankings`, which must be available. */
export const rankingsWorkbook = (rankings: RankingsToRead): Buffer => {
  const { rankings: said } = rankings;
  if (said.is !== "available") {
    throw new Error("There are no rankings to write.");
  }
  const gameCount = said.competitions.reduce(
    (count, { results }) =>
      count + results.reduce((sum, { games }) => sum + games.length, 0),
    0,
  );
  const rows: Row[] = [
    [{ value: rankings.name, bold: true }],
    [{ value: datesOf(rankings.starts, rankings.finishes), bold: true }],
    [
      {
        value: `${gameCount.toLocaleString("en-US")} Games`,
        bold: true,
      },
    ],
  ];
  let number = 0;
  for (const competition of said.competitions) {
    // Named only where there is more than one to tell apart.
    if (said.competitionCount > 1) {
      rows.push([{ value: competition.name, bold: true }]);
    }
    for (const result of competition.results) {
      const one = namesOf(result.winner);
      const other = namesOf(result.loser);
      for (const game of result.games) {
        number += 1;
        // A line is the game's own winner and loser, which are not always
        // the match's, and their scores in that order.
        const [winner, loser] = game.wonByWinner ? [one, other] : [other, one];
        const [winnerScore, loserScore] = game.wonByWinner
          ? [game.winnerScore, game.loserScore]
          : [game.loserScore, game.winnerScore];
        rows.push([
          number,
          winner.last,
          winner.first,
          "beat",
          loser.last,
          loser.first,
          winnerScore,
          loserScore,
        ]);
      }
    }
  }
  rows.push([], ["Tournament winner:"]);
  return xlsxOf(sheetNameOf(rankings.name), rows);
};
