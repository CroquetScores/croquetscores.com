// The offer to come in with Facebook, made by the register page and the sign in
// page alike, and what either may be told when Facebook did not let the reader
// in (auth/facebook.ts). It stands as Google's does (googleOffer.ts), beneath
// it where a page offers both.
import type { Alternative } from "../common/dialog.js";
import type { Ending } from "./offers.js";

export const facebookPath = "/auth/facebook";

/**
 * The codes the way back from Facebook sends a reader back with. A page says
 * only these, so that its address cannot be made to put anything else on it.
 */
export const refusalsFromFacebook: readonly string[] = [
  "SignInWithFacebook.EmailAddressMissing",
  "SignInWithFacebook.LinkedToAnother",
  "Facebook.Unreachable",
];

// Facebook's own mark, as its sign-in buttons carry it, drawn inline for the
// reasons Google's is (googleOffer.ts). Hidden from a screen reader, which has
// the words beside it.
const facebookIcon = `<svg class="dialog-alternative-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;

/**
 * The offer, going to Facebook by `href`, which says which page made it. The
 * last of a page's offers ends with the word that stands between them and the
 * fields, and the box to tick where the page needs one ticked first.
 */
export const withFacebook = (
  label: string,
  href: string,
  ending?: Ending,
): Alternative => ({ label, href, icon: facebookIcon, ...ending });
