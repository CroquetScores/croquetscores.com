import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

/**
 * That `button` is drawn as a trash can and nothing else: the picture is
 * there, and no words beside it, since the button names itself to a reader who
 * cannot see it.
 */
export const assertDrawnAsTrashCan = async (button: Locator): Promise<void> => {
  assert.equal(await button.locator(".icon-trash-can").count(), 1);
  assert.equal((await button.innerText()).trim(), "");
};
