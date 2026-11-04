// What a doubles pair is called (pairName.feature).

// A name is split at its last space: what comes before is the first names, and
// what comes after is the last name. A name of one word has no last name,
// which is not the same as an empty one, so that two such names are never
// taken to share it.
const parts = (
  written: string,
): {
  readonly name: string;
  readonly first: string;
  readonly last?: string;
} => {
  const name = written.trim();
  const at = name.lastIndexOf(" ");
  return at === -1
    ? { name, first: name }
    : { name, first: name.slice(0, at).trim(), last: name.slice(at + 1) };
};

const sameLastName = (one: string, other: string): boolean =>
  one.toLocaleLowerCase() === other.toLocaleLowerCase();

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
