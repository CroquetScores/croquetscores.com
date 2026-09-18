// The site's words in English, and the language every other falls back to for
// a word it has not got. Keyed by what each word is for; a rule broken is keyed
// by its code, so that every form saying it says it the same way.
import type { Language } from "../common/language.js";

export const english: Language = {
  tag: "en",
  name: "English",
  words: {
    "language.label": "Language",
    "language.choose": "Change",

    "form.otherwise":
      "Something here is not right. Check what was entered and try again.",

    "register.title": "Register",
    "register.emailAddress": "Email address",
    "register.password": "Password",
    "register.cancel": "Cancel",
    "register.submit": "Register",
    "register.notOpen": "Registering is not open yet.",

    "errors.backHome": "Back to Croquet Scores",
    "errors.notFound": "Not found",
    "errors.refused": "That could not be done",
    "errors.refusedDetail": "Something in what was sent was not right.",
    "errors.sorry": "Sorry",
    "errors.sorryDetail": "That request could not be dealt with.",
    "errors.failed": "Something went wrong",
    "errors.reference": "Reference {reference}.",
  },
};
