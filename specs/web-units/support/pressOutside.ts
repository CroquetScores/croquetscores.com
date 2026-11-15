import type { SpecWorld } from "../../support/world.js";

// The corner of the window, two pixels in: a place no menu's panel reaches and
// where a page has no link, so that the press is the press of "the page" and
// not of anything on it.
export const pressOutside = async (world: SpecWorld): Promise<void> => {
  const size = world.browserPage.viewportSize();
  if (size === null) throw new Error("The page has no viewport.");
  await world.browserPage.mouse.click(size.width - 2, size.height - 2);
};
