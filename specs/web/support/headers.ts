// What a scenario has its browser, and its page reads, say on every request,
// kept on the world so that a browser made again for scripting or for a reader
// who comes back says the same (browser.ts).
import type { WebWorld } from "./world.js";

/** Has every request from here on carry `name`, in the browser if there is one. */
export const telling = async (
  world: WebWorld,
  name: string,
  value: string,
): Promise<void> => {
  world.extraHeaders = { ...world.extraHeaders, [name]: value };
  await world.page?.setExtraHTTPHeaders(world.extraHeaders);
};
