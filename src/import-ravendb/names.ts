import { canMakeASlug } from "../domain/common/canMakeASlug.js";
import { charactersIn } from "../domain/common/charactersIn.js";

// The names the old sites accepted and the site refuses, changed only as far
// as they must be to be accepted (ImportUsers.feature, ImportTournaments.feature).

/** Shorter than this, a name is refused, a person's and a tournament's alike. */
const FEWEST_CHARACTERS = 3;

// Added to a name too short, which makes it long enough and tells whoever
// reads it next where it came from, so that they can name it better: a
// person's that it was imported, and a tournament's that the import
// corrected it. A competition's is never too short, but one with no letter
// or digit says the import corrected it too.
const IMPORTED = " - Imported";
const IMPORT_CORRECTION = " - Import correction";

const lengthened = (trimmed: string, added = IMPORTED): string =>
  trimmed !== "" && charactersIn(trimmed) < FEWEST_CHARACTERS
    ? trimmed + added
    : trimmed;

/**
 * A person's name the old sites accepted, as the site will take it: one
 * shorter than 3 characters says it was imported. Its case is its owner's,
 * since the site refuses no person's name for that. A name with none is left
 * with none, and refused.
 */
export const nameToImport = (name: string): string => lengthened(name.trim());

// A handicap: a whole number or a decimal, written with a point or a comma,
// with a sign or without.
const NUMBER = String.raw`[+-]?\d+(?:[.,]\d+)?`;

// The number after the last space of a name is a handicap, and needs that
// space, so that a number joined to the last word, as in "Tim Murphy2", stays
// part of the name.
const TRAILING_HANDICAP = new RegExp(String.raw`^(.*\S)\s+${NUMBER}$`, "s");

// Two numbers at the end of a name, as in "Tim Murphy 3 5": there is no
// telling which was meant, so both are left.
const TWO_TRAILING_NUMBERS = new RegExp(
  String.raw`(?:^|\s)${NUMBER}\s+${NUMBER}$`,
);

// Every group of brackets that ends a name, with the space before each.
const TRAILING_BRACKETS = /\s*\([^()]*\)$/;

// A semicolon and the handicap after it, which some old sites wrote in place
// of the space. Brackets may follow it, as in "Tim Murphy; 5.5 (NZ)", as they
// may follow a handicap without one.
const SEMICOLON_AND_HANDICAP = new RegExp(
  String.raw`\s*;\s*${NUMBER}(?:\s*\([^()]*\))*\s*$`,
);

// What the old sites added to a name that is no part of it, brackets and then
// a handicap, in either order, as in "Sam Someone (NZ) 2" and "Sam Someone 2
// (NZ)". Where a handicap has been taken off another is not, since the second
// number is as likely to be part of the name.
const withoutBracketsAndHandicap = (name: string): string => {
  let rest = name;
  let handicapTaken = false;
  for (;;) {
    const withoutBrackets = rest.replace(TRAILING_BRACKETS, "");
    if (withoutBrackets !== rest) {
      rest = withoutBrackets;
      continue;
    }
    if (handicapTaken || TWO_TRAILING_NUMBERS.test(rest)) return rest;
    const handicap = TRAILING_HANDICAP.exec(rest);
    if (handicap === null) return rest;
    rest = handicap[1]!;
    handicapTaken = true;
  }
};

/**
 * The name the world rankings know a person by, of the name the old sites
 * gave them: that name with what is in brackets at the end of it taken off,
 * as "(NZ)" or "(2)", and the number after its last space, as "1", "-1" or
 * "5.5", which is a handicap and no part of it. A semicolon and the handicap
 * after it, as "; -1.0", go too. Brackets elsewhere in the name are part of
 * it, and so are two numbers that end it, and a name that is nothing but
 * brackets or a number is left as it is. One too short without them says it
 * was imported, as a name does.
 */
export const worldRankingNameToImport = (name: string): string => {
  const trimmed = name.trim();
  const without = withoutBracketsAndHandicap(
    trimmed.replace(SEMICOLON_AND_HANDICAP, ""),
  ).trim();
  return nameToImport(without === "" ? trimmed : without);
};

// A letter has a case when its capital and its small form differ.
const hasCase = (text: string): boolean =>
  text.toLowerCase() !== text.toUpperCase();

// Each word with a capital first and small letters after.
const titleCased = (text: string): string =>
  text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

/**
 * A tournament's name the old sites accepted, as the site will take it. The
 * site refuses one all in capitals or all in small letters, so either is
 * written in title case, and then one too short says the import corrected
 * it. One with capitals and small letters keeps its case, which was
 * somebody's choice.
 */
export const tournamentNameToImport = (name: string): string => {
  const trimmed = name.trim();
  const cased =
    hasCase(trimmed) &&
    (trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase())
      ? titleCased(trimmed)
      : trimmed;
  return lengthened(cased, IMPORT_CORRECTION);
};

/**
 * A competition's name the old sites accepted, as the site will take it. The
 * site refuses one with no letter or digit, which makes no slug for its
 * address, as "!", so one says the import corrected it, which gives it some.
 * One with none at all is left with none, and refused.
 */
export const competitionNameToImport = (name: string): string => {
  const trimmed = name.trim();
  return trimmed !== "" && !canMakeASlug(trimmed)
    ? trimmed + IMPORT_CORRECTION
    : trimmed;
};

// Characters as a reader counts them, as charactersIn counts them, so that a
// text is cut between two of them and never within one.
const graphemes = new Intl.Segmenter();

/**
 * `text` cut to its first `most` characters less three, as a reader counts
 * them, and "...", so that it is plain that more was said; or `text` as it is
 * where it holds no more than `most`. Spaces left at the cut are taken off, so
 * that the "..." follows the last word cut.
 */
export const shortenedTo = (text: string, most: number): string => {
  if (charactersIn(text) <= most) return text;
  const kept = [...graphemes.segment(text)]
    .slice(0, most - 3)
    .map(({ segment }) => segment)
    .join("");
  return `${kept.trimEnd()}...`;
};

/**
 * `text` shortened to `most` characters (shortenedTo), or where one of
 * `taken` is that in any case, `text` shortened to leave room for the first
 * number from 2 that makes it one none of `taken` is, followed by it, as
 * "Live from Court 1 ... (2)": numbered apart, and still no more than `most`.
 * A number added after a title shortened to `most` would take it past it.
 */
export const numberedApartWithin = (
  text: string,
  taken: readonly string[],
  most: number,
): string => {
  const lowered = new Set(taken.map((each) => each.toLowerCase()));
  const shortened = shortenedTo(text, most);
  if (!lowered.has(shortened.toLowerCase())) return shortened;
  for (let number = 2; ; number += 1) {
    const after = ` (${String(number)})`;
    const numbered = `${shortenedTo(text, most - charactersIn(after))}${after}`;
    if (!lowered.has(numbered.toLowerCase())) return numbered;
  }
};

/**
 * `name`, or where one of `taken` is the same name in any case, the name
 * followed by the first number from 2 that makes it a name nobody has, as
 * "Sam Someone (2)". The old sites told two players apart by their name and
 * what they represented together; the site tells them apart by name alone.
 */
export const numberedApart = (
  name: string,
  taken: readonly string[],
): string => {
  const lowered = new Set(taken.map((each) => each.toLowerCase()));
  if (!lowered.has(name.toLowerCase())) return name;
  for (let number = 2; ; number += 1) {
    const numbered = `${name} (${String(number)})`;
    if (!lowered.has(numbered.toLowerCase())) return numbered;
  }
};
