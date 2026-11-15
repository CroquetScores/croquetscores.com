// How a button on a page is drawn, set against the style every button but the
// submit button is drawn in (STYLE.md §5b). Here rather than beside one
// feature, because more than one page says something is drawn that way.
//
// The style is read from a plain button made for the purpose in the dialog's
// own row of buttons, and taken away again, rather than from a button already
// on the page: a dialog need not have one, and the rule is about the style
// rather than about any one button drawn in it. Everything is read from what
// the browser drew rather than from the classes, so that a rule written for
// one and not the other shows.
import type { SpecWorld } from "../../support/world.js";

const drawn = [
  "background-color",
  "color",
  "border-top-width",
  "border-top-style",
  "border-top-color",
  "border-radius",
  "font-family",
  "font-size",
  "font-weight",
  "min-height",
];

export interface AsDrawn {
  /** How the element asked about was drawn. */
  readonly it: Readonly<Record<string, string>>;
  /** How a button other than the submit button is drawn beside it. */
  readonly aButton: Readonly<Record<string, string>>;
}

/**
 * How `selector` is drawn, and how a button other than the submit button is
 * drawn in the same dialog; nothing where either is not on the page.
 */
export const drawnBesideAButton = (
  world: SpecWorld,
  selector: string,
): Promise<AsDrawn | null> =>
  world.browserPage.evaluate<AsDrawn | null>(`(() => {
    const it = document.querySelector(${JSON.stringify(selector)});
    const row = document.querySelector("section.dialog .dialog-buttons");
    if (!it || !row) return null;
    const probe = document.createElement("a");
    probe.className = "button";
    probe.href = "#";
    probe.textContent = "A button";
    row.prepend(probe);
    const read = (element) => {
      const style = getComputedStyle(element);
      return Object.fromEntries(
        ${JSON.stringify(drawn)}.map((name) => [name, style.getPropertyValue(name)]),
      );
    };
    const found = { it: read(it), aButton: read(probe) };
    probe.remove();
    return found;
  })()`);
