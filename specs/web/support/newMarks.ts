// What the steps that read the red asterisk marking something new share,
// whichever page it is on: the notes' (notes.feature) and the commentaries'
// (commentaries.feature).
import type { Locator } from "playwright";

import type { WebWorld } from "./world.js";

// What reads a mark for what it is reads the page's own idea of red: an
// element coloured with the palette's --danger, put on the page and asked its
// colour, so that the step does not have to know the palette.
export const dangerOn = (world: WebWorld): Promise<string> =>
  world.browserPage.evaluate(`(() => {
    const probe = document.createElement("span");
    probe.style.color = "var(--danger)";
    document.body.append(probe);
    const colour = getComputedStyle(probe).color;
    probe.remove();
    return colour;
  })()`);

export const colourOf = (mark: Locator): Promise<string> =>
  mark.evaluate(
    (element: unknown) =>
      (
        globalThis as unknown as {
          getComputedStyle(element: unknown): { color: string };
        }
      ).getComputedStyle(element).color,
  );
