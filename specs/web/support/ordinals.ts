const words = ["first", "second", "third", "fourth", "fifth", "sixth"];

/**
 * Where a step's "first", "second" and so on counts from zero. A word not here
 * throws, since an index of -1 would read nothing and fail as though the
 * thing asked about were missing.
 */
export const ordinal = (word: string): number => {
  const at = words.indexOf(word);
  if (at < 0) throw new Error(`There is no place called ${word}.`);
  return at;
};
