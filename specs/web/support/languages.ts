// The languages the scenarios offer: English, with the example form's words
// and the example range's and passphrase's rules added, and a test locale made
// from that.
//
// The test locale is English with every phrase marked where it begins and
// ends. It is made from the English catalogue rather than written by hand, so
// a word with no English entry cannot be in it either; a word on a page in the
// test locale that is not marked came from somewhere other than a catalogue.
// It exists only here. Nobody else is offered it.
import type { Language } from "../../../src/web/common/language.js";
import { english } from "../../../src/web/languages/english.js";

export const testLocaleTag = "en-XA";

/** How the test locale marks the beginning and the end of every phrase. */
export const opens = "⟦";
export const closes = "⟧";

/** `text` with the test locale's marks taken off, where it has them. */
export const unmarked = (text: string): string =>
  text.split(opens).join("").split(closes).join("");

export const englishForScenarios: Language = {
  ...english,
  words: {
    ...english.words,

    "example.title": "Example",
    "example.start": "Start",
    "example.end": "End",
    "example.step": "Step",
    "example.passphrase": "Passphrase",
    "example.submit": "Send",
    "example.notice": "This is an example notice.",

    "Range.StartMissing": "Enter a start.",
    "Range.StartNegative": "The start cannot be below zero.",
    "Range.EndMissing": "Enter an end.",
    "Range.StepNotPositive": "The step has to be more than zero.",
    "Range.StepNotRound": "The step has to be a multiple of five.",
    "Range.EndBeforeStart": "The end cannot come before the start.",

    "Passphrase.Missing": "Enter a passphrase.",
    "Passphrase.TooShort": "The passphrase has to be at least 12 characters.",
  },
};

// A value the site holds as markup — an email's body, and nothing else — is
// marked inside its tags rather than around them. What a reader sees is then
// marked, as it is on a page, while the markup stays markup: marking the whole
// value would put the marks outside the paragraphs, where no reader sees them,
// and leave every paragraph looking as though it came from somewhere other
// than a catalogue.
// The whitespace either side of the words is kept out of the marks and put
// back around them, rather than cut out of the middle, because replacing one
// string with another would read a `$` in the words as a pattern of its own.
const markedBetweenTags = (markup: string): string =>
  markup.replace(
    />(\s*)([^<]*?)(\s*)</g,
    (whole, before: string, between: string, after: string) =>
      between === "" ? whole : `>${before}${marked(between)}${after}<`,
  );

const marked = (text: string): string =>
  text.includes("<") ? markedBetweenTags(text) : `${opens}${text}${closes}`;

export const testLocale: Language = {
  tag: testLocaleTag,
  name: marked(englishForScenarios.name),
  words: Object.fromEntries(
    Object.entries(englishForScenarios.words).map(([key, text]) => [
      key,
      marked(text),
    ]),
  ),
};

export const scenarioLanguages: readonly Language[] = [
  englishForScenarios,
  testLocale,
];
