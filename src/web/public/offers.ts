// Which ways of coming in with another service a page offers, as the site has
// been given the credentials for them (config.ts).
import type { Field } from "../common/dialog.js";

export interface Offered {
  readonly google: boolean;
  readonly facebook: boolean;
}

/**
 * What the last of a page's offers ends with: the word that stands between the
 * offers and the fields, and the box to tick where the page needs one ticked
 * first.
 */
export interface Ending {
  readonly or: string;
  readonly agreeing?: Extract<Field, { type: "checkbox" }> | undefined;
}
