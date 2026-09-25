// Every form that is a page's purpose is shown the same way: a title bar saying
// what it is for, the fields beneath it, and its buttons beneath them, stacked,
// with the one that does it first. A reader who has filled in one knows where
// to look on the next.
//
// It is a page region rather than an ARIA dialog. It does not sit over the page,
// take focus or need dismissing: it is the page. So it is a section named by its
// title, which is what a screen reader should announce, and "dialog" is what the
// shape looks like rather than a role it claims.
import { escape } from "./escape.js";

/** What every field has, whatever kind it is. */
interface FieldCommon {
  readonly name: string;
  readonly label: string;
  /** What a browser or password manager should offer to fill in. */
  readonly autocomplete: string;
  /**
   * What needs the reader's attention about this field, if anything: one
   * sentence for each rule it broke, since a field wrong in two ways is told
   * both at once.
   */
  readonly messages?: readonly string[] | undefined;
  /**
   * Whether what is in the field is wrong. Separate from the message, because a
   * message can say what is wanted before anyone has got it wrong, and a field
   * nobody has touched yet is not invalid.
   */
  readonly invalid?: boolean | undefined;
  /** Whether the reader is taken here when the page arrives. */
  readonly autofocus?: boolean | undefined;
}

/**
 * A field of the form.
 *
 * A password field has nowhere to put what was typed. A password is never
 * sent back to the reader in a page, whoever asks, and it is kept from being
 * handed to the form at all, not only from being written: a field that could
 * hold one is a place for it to leak from — into a page, a log, or whatever
 * holds the dialog next — the day something reads the field without asking
 * what kind it is.
 */
export type Field =
  | (FieldCommon & {
      readonly type: "email" | "text";
      /** What is already in the field, such as what was typed before the form was refused. */
      readonly value?: string | undefined;
    })
  | (FieldCommon & {
      readonly type: "password";
      readonly value?: never;
    });

/** What needs saying above the fields, about no one of them. */
export interface Problems {
  readonly messages: readonly string[];
  /** Whether the reader is taken here when the page arrives. */
  readonly autofocus?: boolean | undefined;
}

/**
 * Another way to do what the form is for, offered above its fields: registering
 * with Google rather than by email address, say.
 */
export interface Alternative {
  readonly label: string;
  readonly href: string;
  /**
   * Drawn before the label. Markup, written into the page as it is, so it is
   * only ever the page's own and never anything a reader sent.
   */
  readonly icon: string;
  /** The word that stands between it and the fields. */
  readonly or: string;
}

export interface Dialog {
  readonly title: string;
  /** Where the form posts. */
  readonly action: string;
  readonly fields: readonly Field[];
  /** The label on the button that does what the form is for. */
  readonly submit: string;
  /**
   * Somewhere else to go instead of filling the form in, such as the forgot
   * password page from signing in, drawn beneath the submit button in the
   * order given. There is no way out that goes nowhere: leaving a form changes
   * nothing and goes nowhere the site's own bars do not, so a cancel button
   * did nothing for a reader, and is not offered.
   */
  readonly elsewhere?:
    readonly { readonly label: string; readonly href: string }[] | undefined;
  /**
   * What the form sends that the reader never fills in, by the name it is sent
   * under: the token reCAPTCHA's script hands the register page, say. They
   * travel inside the form, because that is what a browser sends, and nothing
   * outside it would be sent at all.
   */
  readonly hidden?: Readonly<Record<string, string>> | undefined;
  /** Something the reader needs telling before anything else, if anything. */
  readonly notice?: string | undefined;
  /** What is wrong with the form as a whole, when it has been refused. */
  readonly problems?: Problems | undefined;
  /** Another way to do what the form is for, when there is one. */
  readonly alternative?: Alternative | undefined;
}

// The label rests inside the field's border, where the typing will go, and
// lifts to the border's top edge once the field is in use. It is still a
// <label>: what a screen reader announces for the field, and what a click on it
// focuses. It is not a placeholder, which would vanish the moment anyone typed.
//
// The input does carry a placeholder, of a single space, which nobody sees and
// nothing announces. It is there because whether a placeholder is shown is how
// the stylesheet knows the field is empty — the one thing CSS cannot otherwise
// ask of an input — and so when the label comes back down, with no scripting.
//
// The input comes before the label's words, because the stylesheet can only
// ask about an input on behalf of what follows it. Asking on behalf of the box
// around it needs :has(), and a browser without :has() would leave the label
// lying over whatever was typed. The words are placed by the stylesheet, so
// where they come in the markup changes nothing a reader sees or hears.
//
// The box around the label and the input is itself that label, so a press
// anywhere inside the border — the padding included — reaches the input. A div
// with a text cursor drawn on it would promise the same thing and, without
// scripting, do nothing.
//
// A message is tied to its field by aria-describedby, so it is read out with
// the field rather than left for someone to find by looking beneath it. It says
// aria-invalid only when the field is actually wrong: a form that announces
// "invalid entry" on a field nobody has typed in yet has cried wolf before the
// reader has done anything.
//
// What was typed is written back, so a refused form need not be typed twice —
// except a password, which is never written into a page, whoever asks. The
// check is here rather than left to each form, because forgetting it once would
// put somebody's password in a page and in whatever caches it.
//
// Autofocus takes the reader to the field when the page arrives, which works
// with scripting switched off, and is how a refused form starts a screen reader
// at the first thing that needs attention.
const field = ({
  name,
  label,
  type,
  autocomplete,
  messages = [],
  invalid,
  value,
  autofocus,
}: Field): string => {
  // Escaped, because these are attribute values like any other and a field name
  // is the caller's string. The same escaping on both ends of a reference keeps
  // the two spellings identical, which is what makes the reference hold.
  const id = `field-${escape(name)}`;
  const messageId = `${id}-message`;
  const described =
    messages.length === 0 ? "" : ` aria-describedby="${messageId}"`;
  const wrong = invalid === true ? ` aria-invalid="true"` : "";
  // A password field can be given no value, and is asked about here all the
  // same: this is the last place one could be written into a page.
  const kept =
    type === "password" || value === undefined
      ? ""
      : ` value="${escape(value)}"`;
  const focused = autofocus === true ? " autofocus" : "";
  // One element beneath the field, holding a line for each rule, so that the
  // field is described by it once and a screen reader reads every rule with it.
  const beneath =
    messages.length === 0
      ? ""
      : `\n                <p class="field-message" id="${messageId}">${messages
          .map((text) => `<span>${escape(text)}</span>`)
          .join(" ")}</p>`;

  return `              <div class="field">
                <label class="field-box" for="${id}">
                  <input id="${id}" name="${escape(name)}" type="${type}" autocomplete="${escape(autocomplete)}" placeholder=" "${kept}${described}${wrong}${focused} />
                  <span class="field-label">${escape(label)}</span>
                </label>${beneath}
              </div>`;
};

// A notice arrives with the page rather than appearing on one already being
// read, and a live region only announces what changes after it exists — so
// role="status" here would say nothing to anyone. It is made focusable instead,
// and autofocus takes the reader to it on arrival, so a screen reader reads it
// out; it is what the reader needs telling before anything else — unless
// something on the form needs attention, which is what the reader is taken to
// instead. A browser honours only the first autofocus on a page, and the notice
// comes first, so it does not ask when something further down does.
export const noticeId = "dialog-notice";

const notice = (
  text: string | undefined,
  attentionElsewhere: boolean,
): string =>
  text === undefined
    ? ""
    : `              <p class="notice" id="${noticeId}" tabindex="-1"${
        attentionElsewhere ? "" : " autofocus"
      }>${escape(text)}</p>\n`;

// Above the fields, because it is about more than one of them. Like the
// notice, it arrives with the page, so it is made focusable and the reader is
// taken to it by autofocus rather than announced by a live region that would
// say nothing.
export const problemsId = "dialog-problems";

const problems = (said: Problems | undefined): string =>
  said === undefined || said.messages.length === 0
    ? ""
    : `              <div class="dialog-problems" id="${problemsId}" tabindex="-1"${
        said.autofocus === true ? " autofocus" : ""
      }>
${said.messages.map((text) => `                <p>${escape(text)}</p>`).join("\n")}
              </div>
`;

// Beneath whatever the reader needs telling, which comes first in every dialog,
// and above the fields, so that it is seen before any typing starts. A link
// that looks like a button, since what it does is go somewhere else. The word
// beneath it is written in lower case and drawn in capitals by the stylesheet,
// because a screen reader can spell out a word written in capitals letter by
// letter.
const alternative = (other: Alternative | undefined): string =>
  other === undefined
    ? ""
    : `              <a class="button dialog-alternative" href="${escape(other.href)}">${other.icon}<span>${escape(other.label)}</span></a>
              <p class="dialog-or">${escape(other.or)}</p>
`;

// Links drawn as buttons, so that they work with scripting off.
const elsewhere = (links: Dialog["elsewhere"]): string =>
  (links ?? [])
    .map(
      (link) =>
        `\n              <a class="button" href="${escape(link.href)}">${escape(link.label)}</a>`,
    )
    .join("");

// Stacked, each as wide as the fields, so that however many buttons a form has
// and however long their words, none is pushed onto a line of its own. The
// submit button is first, at the top where the eye starts, and first in
// reading and tab order too.
const buttons = (dialog: Dialog): string =>
  `              <button class="button button-submit" type="submit">${escape(dialog.submit)}</button>${elsewhere(dialog.elsewhere)}`;

// Whether the reader is being taken to something that needs attention.
const attentionAskedFor = (dialog: Dialog): boolean =>
  dialog.problems?.autofocus === true ||
  dialog.fields.some((field) => field.autofocus === true);

// Written last, inside the form and after everything a reader sees: a hidden
// field has no label, no message and no place in the reading order, and
// nothing looking for the form's first field should find one nobody can see.
const hidden = (values: Dialog["hidden"]): string =>
  values === undefined
    ? ""
    : Object.entries(values)
        .map(
          ([name, value]) =>
            `\n            <input type="hidden" name="${escape(name)}" value="${escape(value)}" />`,
        )
        .join("");

export const renderDialog = (
  dialog: Dialog,
): string => `        <section class="dialog" aria-labelledby="dialog-title">
          <h1 class="dialog-title" id="dialog-title">${escape(dialog.title)}</h1>
          <form class="dialog-form" method="post" action="${escape(dialog.action)}">
            <div class="dialog-content stack">
${notice(dialog.notice, attentionAskedFor(dialog))}${problems(dialog.problems)}${alternative(dialog.alternative)}${dialog.fields.map(field).join("\n")}
            </div>
            <div class="dialog-buttons">
${buttons(dialog)}
            </div>${hidden(dialog.hidden)}
          </form>
        </section>`;
