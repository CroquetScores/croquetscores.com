// What a listed row's option shows. Up and Down are arrows, which say which
// way they move a row in less room than their words, so that a row's options
// fit a phone. Edit is a pencil, and Archive and Delete are a trash can, as
// they are wherever else they are offered. Each is named by its words for a
// reader who cannot see it. Every option says what it does to one who points
// at it, in `hover`.

import { Pencil } from "./Pencil.js";
import { TrashCan } from "./TrashCan.js";

const arrows = { up: "↑", down: "↓" } as const;

// The picture an action is drawn as, or nothing where it is drawn as its words.
const pictureOf = (action: string): React.JSX.Element | undefined =>
  action === "up" || action === "down" ? (
    <span className="option-arrow" aria-hidden="true">
      {arrows[action]}
    </span>
  ) : action === "edit" ? (
    <Pencil />
  ) : action === "archive" || action === "delete" ? (
    <TrashCan />
  ) : undefined;

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
    } => {
  const picture = pictureOf(action);
  return picture === undefined
    ? { title: hover, children: words }
    : { "aria-label": words, title: hover, children: picture };
};

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
    {pictureOf(action) ?? words}
  </span>
);
