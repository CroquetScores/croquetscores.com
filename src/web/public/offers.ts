// Which ways of coming in with another service a page offers, as the site has
// been given the credentials for them (config.ts).
import type { Alternative, Field } from "../common/dialog.js";

export interface Offered {
  readonly google: boolean;
  readonly facebook: boolean;
}

/**
 * The offers a page makes, each made with what it ends with if it is the last
 * and with nothing if it is not, so that the word between the offers and the
 * fields, and the box, are drawn once and beneath them all.
 */
export const endingTheLast = (
  offers: readonly ((ending?: Ending) => Alternative)[],
  ending: Ending,
): Alternative[] =>
  offers.map((offer, at) =>
    offer(at === offers.length - 1 ? ending : undefined),
  );

/**
 * What the last of a page's offers ends with: the word that stands between the
 * offers and the fields, and the box to tick where the page needs one ticked
 * first.
 */
export interface Ending {
  readonly or: string;
  readonly agreeing?: Extract<Field, { type: "checkbox" }> | undefined;
}
