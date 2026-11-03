// Names as the world rankings' own list writes them, for both of the files
// the site sends the rankings officers (rankingsTextFile.feature,
// rankingsWorkbook.feature). It is shared so that what is fixed for one is
// fixed for the other.
import type { RankingsToRead } from "../../application/operations/tournaments/PublicRankingsOfTournament.js";

// Letters that carry no accent to take off, with the plain letters the world
// rankings' own names for them use.
const PLAIN_LETTERS: Readonly<Record<string, string>> = {
  ø: "o",
  Ø: "O",
  ł: "l",
  Ł: "L",
  đ: "d",
  Đ: "D",
  ð: "d",
  Ð: "D",
  ß: "ss",
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
};

// What the software cannot read is written as the plain letter where there is
// one, as "é" is "e", and as "?" where there is not. Marks people type for an
// apostrophe are one, since a "?" in "O?Byrne" matches nobody in the rankings'
// own list. A picture, as a flag or a ball a manager puts in a name, is left
// out rather than written as "?", with the space beside it where it leaves two,
// since it is no part of the name the rankings would look for.
export const asciiOf = (text: string): string =>
  text
    .replace(/[\u2018\u2019\u02bc\u2032\u00b4`]/g, "'")
    .replace(
      /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u200d|\ufe0f|\u20e3/gu,
      "",
    )
    .replace(/[øØłŁđĐðÐßæÆœŒ]/g, (letter) => PLAIN_LETTERS[letter] ?? "?")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7f]/g, "?")
    .replace(/ {2,}/g, " ")
    .trim();

// Each name is made plain before the lines are laid out, so that the padding
// that lines the results up is of the names as they are written.
export const plainOf = (rankings: RankingsToRead): RankingsToRead => {
  const { rankings: said } = rankings;
  if (said.is !== "available") return rankings;
  return {
    ...rankings,
    name: asciiOf(rankings.name),
    country: asciiOf(rankings.country),
    rankings: {
      ...said,
      competitions: said.competitions.map((competition) => ({
        ...competition,
        name: asciiOf(competition.name),
        winner:
          competition.winner === undefined
            ? undefined
            : asciiOf(competition.winner),
        results: competition.results.map((result) => ({
          ...result,
          winner: asciiOf(result.winner),
          loser: asciiOf(result.loser),
        })),
      })),
    },
  };
};
