// Characters as a reader counts them (charactersIn.feature). A letter with its
// accent typed after it is two code points and one character, and what
// somebody typed is not refused, or let through, for how their keyboard
// spelled it.
const graphemes = new Intl.Segmenter();

/** How many characters `text` holds, as whoever typed it sees them. */
export const charactersIn = (text: string): number =>
  [...graphemes.segment(text)].length;
