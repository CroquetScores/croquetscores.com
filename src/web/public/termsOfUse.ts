// The terms of use (termsOfUse.feature): where they are, and the box a reader
// ticks to agree to the terms for those who write, on the forms where writing
// begins. The pages themselves are the help's (help.ts).
//
// Nothing is kept of the agreement. The box is asked about as the form is
// sent, and a form sent without it does nothing, so whatever was written was
// written by somebody who had just agreed.
import type { BrokenRule } from "../../domain/common/validation/Validator.js";
import type { Field } from "../common/dialog.js";
import type { Typed } from "../common/form.js";
import type { Speaking } from "../common/language.js";

/** The terms for readers. */
export const termsOfUsePath = "/terms-of-use";

/**
 * The terms for those who write: tournament managers, scorers and
 * commentators. Beneath the admin, where most of that writing is done.
 */
export const writersTermsOfUsePath = "/admin/terms-of-use";

/** The name the box is sent under. */
export const termsOfUseField = "termsOfUse";

/** The box, ticked again where it was ticked when the form was refused. */
export const agreeingTo = (speaking: Speaking, typed: Typed): Field => ({
  name: termsOfUseField,
  label: speaking.say("termsOfUse.agree"),
  type: "checkbox",
  autocomplete: "off",
  checked: agreed(typed),
  link: {
    words: speaking.say("termsOfUse.link"),
    href: writersTermsOfUsePath,
  },
});

/** Whether the box was ticked: a browser sends a box only when it is. */
export const agreed = (typed: Typed): boolean =>
  typed[termsOfUseField] !== undefined;

/** The box not ticked, said beneath it as a rule the form broke. */
export const notAgreed: BrokenRule = {
  code: "TermsOfUse.NotAgreed",
  fields: [termsOfUseField],
};
