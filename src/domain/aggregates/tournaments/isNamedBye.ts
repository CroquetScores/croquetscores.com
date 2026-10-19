/**
 * Whether `name` names a bye rather than a person, which a player is refused
 * for, in a tournament of teams as in any other: a name that begins with
 * "bye", in any case, where no letter follows it, since the word ends where
 * anything but a letter comes. So "Bye 2" is a bye and "Byers" is a name.
 */
export const isNamedBye = (name: string): boolean =>
  /^bye(?!\p{L})/iu.test(name.trim());
