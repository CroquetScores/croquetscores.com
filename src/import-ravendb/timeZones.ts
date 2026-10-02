// The country each time zone the old sites' tournaments were kept in means
// (ImportTournaments.feature), by its code here. The old sites kept no country,
// and the time zone is the nearest thing to one. A zone a tournament is refused
// for not being here is added here, once it is known which country its
// tournaments were played in.
//
// "GMT Standard Time" is Great Britain's, Ireland's and Portugal's alike, and
// is taken as England's, where nearly every old tournament kept in it was
// played; a manager can move one played elsewhere.
const countryCodes: Readonly<Record<string, string>> = {
  "AUS Eastern Standard Time": "au",
  "AUS Central Standard Time": "au",
  "Cen. Australia Standard Time": "au",
  "E. Australia Standard Time": "au",
  "Tasmania Standard Time": "au",
  "W. Australia Standard Time": "au",
  "Lord Howe Standard Time": "au",
  "New Zealand Standard Time": "nz",
  "Chatham Islands Standard Time": "nz",
  "GMT Standard Time": "england",
  "Eastern Standard Time": "us",
  "Central Standard Time": "us",
  "Mountain Standard Time": "us",
  "US Mountain Standard Time": "us",
  "Pacific Standard Time": "us",
  "Alaskan Standard Time": "us",
  "Hawaiian Standard Time": "us",
  "South Africa Standard Time": "za",
  "Egypt Standard Time": "eg",
  "Tokyo Standard Time": "jp",
};

/** The code of the country `timeZone` means, or nothing where the import does not know it. */
export const countryOfTimeZone = (timeZone: string): string | undefined =>
  countryCodes[timeZone];
