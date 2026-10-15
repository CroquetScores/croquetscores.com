// How a tournament is dated in a list, the admin's and the home page's: the
// days it runs, with the month said once where both days are in it, so that
// the dates take as little of a phone's width as they can. A tournament of one
// day is dated by that day. Here rather than in the admin, which drew it
// first, so that both lists say a tournament's dates the same way.

// Each day is written as the year, the month and the day, which is how the API
// sends it, so the day is read off the writing rather than through a moment
// that the reader's time zone could move to the day before.
const dayOf = (day: string): string => day.slice(8, 10);
const monthOf = (day: string): string => day.slice(0, 7);

/**
 * The days from `starts` to `finishes`, as "03-05 Oct", "29 Sep-02 Oct" or
 * "03 Oct", with the months named in `language`.
 */
export const dated = (
  starts: string,
  finishes: string,
  language: string,
): string => {
  // In UTC, since the day is midnight there and nowhere else.
  const months = new Intl.DateTimeFormat(language, {
    month: "short",
    timeZone: "UTC",
  });
  const month = (day: string): string =>
    months.format(new Date(`${day}T00:00:00Z`));

  if (starts === finishes) return `${dayOf(starts)} ${month(starts)}`;
  if (monthOf(starts) === monthOf(finishes)) {
    return `${dayOf(starts)}-${dayOf(finishes)} ${month(finishes)}`;
  }
  return `${dayOf(starts)} ${month(starts)}-${dayOf(finishes)} ${month(finishes)}`;
};

/**
 * The one day `day`, as "04 Oct", with its month named in `language`, as each
 * day in the list is written.
 */
export const dayWritten = (day: string, language: string): string =>
  dated(day, day, language);

/**
 * The days from `starts` to `finishes` with their year, as "03-05 Oct 2026" or
 * "30 Dec 2027-02 Jan 2028", for a list that is of tournaments of more than one
 * year, where the home page's lists are of one.
 */
export const datedWithYear = (
  starts: string,
  finishes: string,
  language: string,
): string => {
  const startYear = starts.slice(0, 4);
  const finishYear = finishes.slice(0, 4);
  if (startYear === finishYear) {
    return `${dated(starts, finishes, language)} ${finishYear}`;
  }
  return `${dayWritten(starts, language)} ${startYear}-${dayWritten(finishes, language)} ${finishYear}`;
};
