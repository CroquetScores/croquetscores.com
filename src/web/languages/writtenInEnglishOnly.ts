/**
 * The emails the site writes in English alone, and in no other catalogue.
 *
 * They go to the site's administrator, or are written in the administrator's
 * own voice to a tournament's managers, and the administrator's language is
 * English whichever language the reader who set one off was using. Every
 * language falls back to English for a kind it has no words for, so each is
 * still written; what they are exempt from is the rule that every other
 * catalogue holds all that English does (`german.feature` and the rest).
 *
 * A kind is named here and not just left out of the other catalogues, so that
 * an email somebody forgot to translate is still a failure.
 */
export const writtenInEnglishOnly: readonly string[] = [
  "Email.NotableTournament",
  "Email.NationalStatusRemoved",
  "Email.InternationalStatusRemoved",
];

/**
 * The words of the page where an administrator judges a national or an
 * international tournament, which only an administrator reads. Written in
 * English alone for the same reason, and a language without them says them in
 * English.
 */
const administratorsPages: readonly string[] = [
  "admin.notableTournament.",
  "admin.hover.notableTournament.",
];

/** Whether the catalogue entry `key` is one written in English only. */
export const isWrittenInEnglishOnly = (key: string): boolean =>
  writtenInEnglishOnly.some((kind) => key.startsWith(`${kind}.`)) ||
  administratorsPages.some((prefix) => key.startsWith(prefix));
