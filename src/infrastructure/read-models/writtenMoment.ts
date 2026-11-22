import { ReadOnlyDate } from "../../domain/common/ReadOnlyDate.js";

// The moment a row of a read model is given for an event: the moment the event
// says it happened, and no later than now, which is when the row is written.
//
// An event may say it happened after it was written, as those imported from
// the old sites did, with the day a tournament starts. A row given that moment
// would be changed in the future, and would be told of by every answer of
// what has changed since, whenever it was asked. The events themselves are
// never rewritten, so it is the row that is held back. It is held at the
// moment it was written rather than dropped, so that it is told of once and
// then is as old as any other.
//
// The one place a row's moment is then not the event's, and so the one place
// making a read model again gives a different moment: the moment of the
// rebuild, for a row whose event is still to come.
export const writtenMoment = (occurredAt: ReadOnlyDate): ReadOnlyDate => {
  const now = new Date();
  return occurredAt.toDate() > now ? ReadOnlyDate.from(now) : occurredAt;
};
