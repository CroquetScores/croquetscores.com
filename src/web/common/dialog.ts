// Every form that is a page's purpose is shown the same way: a title bar saying
// what it is for, the fields beneath it, and a row of buttons with the one that
// does it furthest right. A reader who has filled in one knows where to look on
// the next.
//
// It is a page region rather than an ARIA dialog. It does not sit over the page,
// take focus or need dismissing: it is the page. So it is a section named by its
// title, which is what a screen reader should announce, and "dialog" is what the
// shape looks like rather than a role it claims.
import { escape } from "./layout.js";

export interface Field {
  readonly name: string;
  readonly label: string;
  readonly type: "email" | "password" | "text";
  /** What a browser or password manager should offer to fill in. */
  readonly autocomplete: string;
  /** What needs the reader's attention about this field, if anything. */
  readonly message?: string | undefined;
  /**
   * Whether what is in the field is wrong. Separate from the message, because a
   * message can say what is wanted before anyone has got it wrong, and a field
   * nobody has touched yet is not invalid.
   */
  readonly invalid?: boolean | undefined;
}

export interface Dialog {
  readonly title: string;
  /** Where the form posts. */
  readonly action: string;
  readonly fields: readonly Field[];
  /** The label on the button that does what the form is for. */
  readonly submit: string;
  /** A way out that changes nothing, when there is one. */
  readonly cancel?:
    { readonly label: string; readonly href: string } | undefined;
  /** Something the reader needs telling before anything else, if anything. */
  readonly notice?: string | undefined;
}

// The label sits inside the field's border and is still a <label>: what a
// screen reader announces for the field, and what a click on it focuses. It is
// not a placeholder, which would vanish the moment anyone typed.
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
const field = ({
  name,
  label,
  type,
  autocomplete,
  message,
  invalid,
}: Field): string => {
  // Escaped, because these are attribute values like any other and a field name
  // is the caller's string. The same escaping on both ends of a reference keeps
  // the two spellings identical, which is what makes the reference hold.
  const id = `field-${escape(name)}`;
  const messageId = `${id}-message`;
  const described =
    message === undefined ? "" : ` aria-describedby="${messageId}"`;
  const wrong = invalid === true ? ` aria-invalid="true"` : "";
  const beneath =
    message === undefined
      ? ""
      : `\n                <p class="field-message" id="${messageId}">${escape(message)}</p>`;

  return `              <div class="field">
                <label class="field-box" for="${id}">
                  <span class="field-label">${escape(label)}</span>
                  <input id="${id}" name="${escape(name)}" type="${type}" autocomplete="${escape(autocomplete)}"${described}${wrong} />
                </label>${beneath}
              </div>`;
};

// A notice arrives with the page rather than appearing on one already being
// read, and a live region only announces what changes after it exists — so
// role="status" here would say nothing to anyone. It is given an id and made
// focusable instead, and whatever redirects here sends the reader to that id:
// the browser moves focus to it, and a screen reader reads it out on arrival.
export const noticeId = "dialog-notice";

const notice = (text: string | undefined): string =>
  text === undefined
    ? ""
    : `              <p class="notice" id="${noticeId}" tabindex="-1">${escape(text)}</p>\n`;

// Cancel comes first in the markup so that it comes first in reading order and
// in tab order, and the submit button is last in both — which is also what puts
// it furthest right.
const cancel = (link: Dialog["cancel"]): string =>
  link === undefined
    ? ""
    : `              <a class="button" href="${escape(link.href)}">${escape(link.label)}</a>\n`;

export const renderDialog = (
  dialog: Dialog,
): string => `        <section class="dialog" aria-labelledby="dialog-title">
          <h1 class="dialog-title" id="dialog-title">${escape(dialog.title)}</h1>
          <form class="dialog-form" method="post" action="${escape(dialog.action)}">
            <div class="dialog-content stack">
${notice(dialog.notice)}${dialog.fields.map(field).join("\n")}
            </div>
            <div class="dialog-buttons">
${cancel(dialog.cancel)}              <button class="button button-submit" type="submit">${escape(dialog.submit)}</button>
            </div>
          </form>
        </section>`;
