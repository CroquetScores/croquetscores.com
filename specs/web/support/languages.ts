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

const marked = (text: string): string => `${opens}${text}${closes}`;

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
