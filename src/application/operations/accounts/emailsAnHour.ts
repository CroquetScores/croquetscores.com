/**
 * How many emails an inbox may be filled with, per hour.
 *
 * One limit for every way an email is written to an inbox, because they fill
 * the one inbox: registering, sending a link again, asking to set a password
 * and asking to move to another address are counted together, and a limit per
 * kind would let each be used up in turn.
 */
export const EMAILS_AN_HOUR = 3;
