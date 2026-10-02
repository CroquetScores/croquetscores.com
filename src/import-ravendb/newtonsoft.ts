import { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";

// Newtonsoft wrote a DateTime with no zone, and a moment written with none is
// read as the machine's local time. The old sites kept their moments in UTC,
// so one without a zone is read as UTC, wherever the import runs.
const hasAZone = /(?:Z|[+-]\d\d:\d\d)$/;

/** The moment `written` says, as Newtonsoft wrote a `DateTime`. */
export const momentOf = (written: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(hasAZone.test(written) ? written : `${written}Z`));

/**
 * The start of the day `written` falls on, read from the text, so that no
 * time zone has a say in which day it was: the old sites kept a day as
 * midnight.
 */
export const dayOf = (written: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(`${written.slice(0, 10)}T00:00:00Z`));
