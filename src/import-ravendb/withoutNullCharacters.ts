// What the old sites kept, without the null characters some of their text has
// in it (withoutNullCharacters.feature). A null character says nothing, and
// Postgres keeps JSON that cannot hold one, so an event carrying one is
// refused, and the import with it.

/**
 * A copy of `value` with every null character taken out of every text in it,
 * however deep, and everything else as it was. A copy, since the document read
 * is the one RavenDB's session knows it by, and is asked for its id after.
 */
export const withoutNullCharacters = <T>(value: T): T => taken(value) as T;

const taken = (value: unknown): unknown => {
  if (typeof value === "string") return value.replaceAll("\u0000", "");
  if (Array.isArray(value)) return value.map(taken);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([field, inIt]) => [field, taken(inIt)]),
    );
  }
  return value;
};

// A document's fields, as JSON gives them, rather than something made of a
// class, such as a date, which is kept as it is.
const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;
  const prototype: unknown = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};
