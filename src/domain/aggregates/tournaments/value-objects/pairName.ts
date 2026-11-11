// What a doubles pair is called (pairName.feature).

// The small words that belong to a last name when they come before it, as in
// "van der Berg" and "de la Cruz", so that what is left is the first names.
const particles = new Set([
  "van",
  "von",
  "der",
  "den",
  "de",
  "del",
  "della",
  "di",
  "da",
  "du",
  "la",
  "le",
  "ter",
  "ten",
]);

// A generation said after a last name, which is part of it: "Smith Jr" is not
// "Smith", and two people who are both "Jr" do not share a last name by it.
const generations = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv"]);

const isGeneration = (word: string | undefined): boolean =>
  generations.has(word?.toLowerCase() ?? "");

// Where the last name begins in the words of a name: the last word, with a
// generation after it and the small words before it, and always after the first
// word, which is a first name however small a word it is.
const lastNameStart = (words: readonly string[]): number => {
  let at = words.length - 1;
  if (at > 1 && isGeneration(words[at])) at -= 1;
  while (at > 1 && particles.has(words[at - 1]?.toLowerCase() ?? "")) at -= 1;
  return at;
};

// A name is split into its first names and its last name. A name of one word
// has no last name, which is not the same as an empty one, so that two such
// names are never taken to share it.
const parts = (
  written: string,
): {
  readonly name: string;
  readonly first: string;
  readonly last?: string;
} => {
  const name = written.trim();
  const words = name.split(/\s+/);
  if (words.length === 1) return { name, first: name };
  const at = lastNameStart(words);
  // A generation alone is no last name: it says whose son, and not whose family.
  if (at === words.length - 1 && isGeneration(words[at])) {
    return { name, first: name };
  }
  return {
    name,
    first: words.slice(0, at).join(" "),
    last: words.slice(at).join(" "),
  };
};

// Lowered without regard to the host's locale, which would make one name two in
// Turkish, and composed so that an accent typed either way is the same letter.
const comparable = (name: string): string =>
  name.toLowerCase().normalize("NFC");

const sameLastName = (one: string, other: string): boolean =>
  comparable(one) === comparable(other);

/**
 * The two players a pair's name was made from, as {@link pairName} made it, or
 * nothing where the name is not a pair's: no "&", or more than one, or nothing
 * on a side of it.
 *
 * A first of one word is given the last name of the second, since that is what
 * `pairName` leaves off when both have the same one. A first of several words is
 * left as it is: "Mary Jane & Tom Smith" might be Mary Jane Smith and Tom
 * Smith, or Mary Jane and Tom Smith, and nothing in the name says which, where
 * guessing wrong would join two pairs that are not one.
 */
export const pairMembers = (
  name: string,
): readonly [string, string] | undefined => {
  const sides = name.split("&").map((side) => side.trim().replace(/\s+/g, " "));
  const [first, second] = sides;
  if (sides.length !== 2 || !first || !second) return undefined;
  const last = parts(second).last;
  return !first.includes(" ") && last !== undefined
    ? [`${first} ${last}`, second]
    : [first, second];
};

/**
 * The name of the pair made of the players called `first` and `second`, in
 * that order: "Sam Someone & Alex Another", or where both have the same last
 * name, "Peter & Rosie Landrebe", with the last name of the second, as it was
 * written there.
 */
export const pairName = (first: string, second: string): string => {
  const one = parts(first);
  const other = parts(second);
  return one.last !== undefined &&
    other.last !== undefined &&
    sameLastName(one.last, other.last)
    ? `${one.first} & ${other.first} ${other.last}`
    : `${one.name} & ${other.name}`;
};
