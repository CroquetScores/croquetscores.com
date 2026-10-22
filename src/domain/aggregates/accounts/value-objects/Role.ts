/**
 * Every role an account can hold, as it is kept in an event. Once kept, a
 * role is spelled this way for good, since a stream written years ago has to
 * be read back as it was written. The one exception is "world-ranking-officer",
 * split into a role for each sport before any site held it, and so not kept
 * readable.
 */
export const roles = [
  "administrator",
  "ac-world-ranking-officer",
  "gc-world-ranking-officer",
] as const;

/** Something an account can be given to let it do what others cannot. */
export type Role = (typeof roles)[number];

/** Whether `written` is a role, as one is kept. */
export const isRole = (written: string): written is Role =>
  (roles as readonly string[]).includes(written);

/**
 * The code of the sport whose rankings a world ranking officer's role looks
 * after. The roles are split by sport because the people who look after
 * Association Croquet's rankings are not those who look after Golf Croquet's,
 * and neither has any business with the other's tournaments.
 */
export const sportOfWorldRankingOfficer: Readonly<
  Partial<Record<Role, string>>
> = {
  "ac-world-ranking-officer": "ac",
  "gc-world-ranking-officer": "gc",
};
