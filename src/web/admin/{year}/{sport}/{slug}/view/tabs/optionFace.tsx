// What a listed row's option shows. Up and Down are arrows, which say which
// way they move a row in less room than their words, so that a row's options
// fit a phone; they are named by their words for a reader who cannot see
// them, and for one who points at them.

const arrows = { up: "↑", down: "↓" } as const;

/** What the button for `action` shows, given the `words` it is named by. */
export const optionFace = (
  action: string,
  words: string,
):
  | { readonly children: string }
  | {
      readonly "aria-label": string;
      readonly title: string;
      readonly children: React.JSX.Element;
    } =>
  action === "up" || action === "down"
    ? {
        "aria-label": words,
        title: words,
        children: <span aria-hidden="true">{arrows[action]}</span>,
      }
    : { children: words };
