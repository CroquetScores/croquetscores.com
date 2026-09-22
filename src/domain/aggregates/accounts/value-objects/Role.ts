/**
 * Every role an account can hold, as it is kept in an event. Once kept, a
 * role is spelled this way for good, since a stream written years ago has to
 * be read back as it was written.
 */
export const roles = ["administrator", "world-ranking-officer"] as const;

/** Something an account can be given to let it do what others cannot. */
export type Role = (typeof roles)[number];

/** Whether `written` is a role, as one is kept. */
export const isRole = (written: string): written is Role =>
  (roles as readonly string[]).includes(written);
