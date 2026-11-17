// Waiting for the browser to take the reader where a page's autofocus says.
//
// A browser does not move focus as the page loads: it gathers what asks for
// autofocus and moves focus when it next draws the page, which can come after
// the load event a step waits for. A step that asked straight away found the
// reader still on the page's body now and then, when the whole suite was
// running and the browser was slow to draw, though focus always arrived.
//
// So a step asks from here, and waits only until focus has left the body. It
// does not wait for focus to reach whatever the step expects: focus that lands
// somewhere else is answered at once, and the step says where it went.
//
// Asked again and again from here rather than by a timer in the page, because
// a scenario's browser has scripting switched off unless a step asks for it.
import type { SpecWorld } from "../../support/world.js";

/** How long a browser is given to draw the page and move focus. */
const PATIENCE_MS = 2000;
const BETWEEN_MS = 25;

const focusHasMoved = `(() => {
  const active = document.activeElement;
  return active !== null && active !== document.body && active !== document.documentElement;
})()`;

/**
 * Returns once the browser has moved focus off the page's body, or once it has
 * been given long enough to, whichever comes first. Either way the step then
 * asks where focus is, and fails if it is not where it should be.
 */
export const autofocusSettled = async (world: SpecWorld): Promise<void> => {
  const giveUpAt = Date.now() + PATIENCE_MS;
  while (Date.now() < giveUpAt) {
    if (await world.browserPage.evaluate<boolean>(focusHasMoved)) return;
    await new Promise((resolve) => setTimeout(resolve, BETWEEN_MS));
  }
};
