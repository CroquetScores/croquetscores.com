// Where a list of countries to choose from puts each, in the public filter,
// the admin's filter and the form that makes a tournament, so that the three
// agree. Most tournaments are played in a few countries, and a list that began
// at Afghanistan made nearly every reader scroll past a hundred to find theirs.

// In this order and not alphabetically, as the countries were asked for.
const mostPlayedIn = ["au", "eg", "england", "nz", "es", "us"];

// The other countries tournaments had been played in as of 2025. Fixed rather
// than found from the tournaments there are: a list that moved as tournaments
// were added would put a country in a different place from one visit to the
// next, and a reader finds a place by remembering where it was.
const playedInSince2025 = [
  "at",
  "ca",
  "ch",
  "cz",
  "de",
  "gr",
  "gt",
  "ie",
  "lv",
  "mu",
  "mx",
  "nf",
  "no",
  "pt",
  "scotland",
  "se",
  "wales",
  "za",
];

/**
 * `countries` in up to three groups: the most played in, in their own order;
 * the others played in since 2025; and the rest, the last two in alphabetical
 * order of their names as `language` has it. A group with no country is left
 * out. Whoever draws the list draws a line between the groups.
 */
export const inCountryGroups = <
  T extends { readonly code: string; readonly name: string },
>(
  countries: readonly T[],
  language: string,
): T[][] => {
  const byName = new Intl.Collator(language);
  const alphabetical = (group: T[]): T[] =>
    group.sort((one, other) => byName.compare(one.name, other.name));
  const first = mostPlayedIn.flatMap((code) =>
    countries.filter((country) => country.code === code),
  );
  const second = alphabetical(
    countries.filter((country) => playedInSince2025.includes(country.code)),
  );
  const third = alphabetical(
    countries.filter(
      (country) =>
        !mostPlayedIn.includes(country.code) &&
        !playedInSince2025.includes(country.code),
    ),
  );
  return [first, second, third].filter((group) => group.length > 0);
};
