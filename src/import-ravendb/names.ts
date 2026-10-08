import { charactersIn } from "../domain/common/charactersIn.js";

// The names the old sites accepted and the site refuses, changed only as far
// as they must be to be accepted (ImportUsers.feature, ImportTournaments.feature).

/** Shorter than this, a name is refused, a person's and a tournament's alike. */
const FEWEST_CHARACTERS = 3;

// Added to a name too short, which makes it long enough and tells whoever
// reads it next where it came from, so that they can name it better.
const IMPORTED = " - Imported";

const lengthened = (trimmed: string): string =>
  trimmed !== "" && charactersIn(trimmed) < FEWEST_CHARACTERS
    ? trimmed + IMPORTED
    : trimmed;

/**
 * A person's name the old sites accepted, as the site will take it: one
 * shorter than 3 characters says it was imported. Its case is its owner's,
 * since the site refuses no person's name for that. A name with none is left
 * with none, and refused.
 */
export const nameToImport = (name: string): string => lengthened(name.trim());

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
 * written in title case, and then one too short says it was imported, as a
 * person's does. One with capitals and small letters keeps its case, which was
 * somebody's choice.
 */
export const tournamentNameToImport = (name: string): string => {
  const trimmed = name.trim();
  const cased =
    hasCase(trimmed) &&
    (trimmed === trimmed.toUpperCase() || trimmed === trimmed.toLowerCase())
      ? titleCased(trimmed)
      : trimmed;
  return lengthened(cased);
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
