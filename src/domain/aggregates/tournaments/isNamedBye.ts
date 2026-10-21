/**
 * Whether `name` names a bye rather than a person, which a player is refused
 * for, in a tournament of teams as in any other: "bye", in any case, or "bye"
 * numbered the ways the old sites' managers numbered theirs, as "Bye 2",
 * "Bye-2" and "Bye (2)". Nothing else is, however it begins: Bob Bye is a
 * person, and so is "Bye / Bassett", the pair he plays with.
 */
export const isNamedBye = (name: string): boolean =>
  /^bye(?:[ -]\d+| \(\d+\))?$/i.test(name.trim());
