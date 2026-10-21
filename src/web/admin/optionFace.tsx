// What a listed row's option shows. Up and Down are arrows, which say which
// way they move a row in less room than their words, so that a row's options
// fit a phone, and Edit is a pencil, as it is wherever else it is offered;
// they are named by their words for a reader who cannot see them. Every
// option says what it does to one who points at it, in `hover`.

import { Pencil } from "./Pencil.js";

const arrows = { up: "↑", down: "↓" } as const;

const faceOf = (action: string, words: string): React.JSX.Element | string =>
  action === "up" || action === "down" ? (
    <span className="option-arrow" aria-hidden="true">
      {arrows[action]}
    </span>
  ) : (
    words
  );

/**
 * What the button for `action` shows, given the `words` it is named by and
 * what it says when pointed at, in `hover`.
 */
export const optionFace = (
  action: string,
  words: string,
  hover: string,
):
  | { readonly title: string; readonly children: string }
  | {
      readonly "aria-label": string;
      readonly title: string;
      readonly children: React.JSX.Element;
    } =>
  action === "up" || action === "down"
    ? {
        "aria-label": words,
        title: hover,
        children: (
          <span className="option-arrow" aria-hidden="true">
            {arrows[action]}
          </span>
        ),
      }
    : action === "edit"
      ? { "aria-label": words, title: hover, children: <Pencil /> }
      : { title: hover, children: words };

/**
 * The room the button for `action` would take, on a row that does not offer
 * it where others in the same list do: the first row has no Up, a player who
 * has played no Archive. Taken up rather than left, so that the rest of what
 * a row offers lines up with the rows above and below it. Drawn as the button
 * would be, with its words or its arrow, so that it is exactly as wide, and
 * never seen, pressed or read out.
 */
export const noOption = (action: string, words: string): React.JSX.Element => (
  <span key={`no-${action}`} className="button option-space" aria-hidden="true">
    {faceOf(action, words)}
  </span>
);
