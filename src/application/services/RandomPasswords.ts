/**
 * What the application wants of whatever makes a password nobody chose: one
 * `length` characters long, made so that nobody can guess it. It is given to an
 * account that must have a password and whose owner came in another way, and
 * it is told to nobody.
 */
export interface RandomPasswords {
  make(length: number): string;
}
