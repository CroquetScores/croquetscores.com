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
// A message is tied to its field by aria-describedby, so it is read out with
// the field rather than left for someone to find by looking beneath it.
const field = ({ name, label, type, autocomplete, message }: Field): string => {
  const id = `field-${name}`;
  const messageId = `${id}-message`;
  const described =
    message === undefined
      ? ""
      : ` aria-describedby="${messageId}" aria-invalid="true"`;
  const beneath =
    message === undefined
      ? ""
      : `\n                <p class="field-message" id="${messageId}">${escape(message)}</p>`;

  return `              <div class="field">
                <div class="field-box">
                  <label for="${id}">${escape(label)}</label>
                  <input id="${id}" name="${escape(name)}" type="${type}" autocomplete="${escape(autocomplete)}"${described} />
                </div>${beneath}
              </div>`;
};

// role="status" so that a notice arriving with the page is read out, not merely
// shown to those who can see it.
const notice = (text: string | undefined): string =>
  text === undefined
    ? ""
    : `              <p class="notice" role="status">${escape(text)}</p>\n`;

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
