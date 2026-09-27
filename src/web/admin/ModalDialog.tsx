import { type ReactNode, useEffect, useRef } from "react";

import { say } from "./words.js";
import "./modalDialog.css";

// A modal dialog (STYLE.md §5c): over the page it was opened from, with
// nothing outside it that can be pressed or reached by the keyboard, a Cancel
// button of its own, and no address. It is a <dialog> opened with showModal(),
// so that the browser makes the page beneath unreachable and closes it on
// Escape, rather than scripting of the admin's own that could get either
// wrong. It is drawn as a dialog is: its title, what it says, and its buttons
// stacked, the one that does what it is for first and Cancel last.

interface Props {
  readonly title: string;
  readonly children: ReactNode;
  /** The words on the button that does what the dialog is for. */
  readonly action: string;
  readonly act: () => void;
  /** Closing it by Cancel or Escape, which keeps nothing. */
  readonly cancel: () => void;
  /** Whether what the first button does is still being done. */
  readonly busy?: boolean;
}

export const ModalDialog = ({
  title,
  children,
  action,
  act,
  cancel,
  busy,
}: Props): React.JSX.Element => {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const opened = dialog.current;
    // Whatever opened it has the focus now, and has it back once it closes,
    // so that the reader is where they were.
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined;
    opened?.showModal();
    return () => {
      opened?.close();
      opener?.focus();
    };
  }, []);

  return (
    <dialog
      className="modal-dialog dialog"
      ref={dialog}
      aria-labelledby="modal-dialog-title"
      onKeyDown={(event) => {
        // The keyboard goes round what the dialog has to press and nowhere
        // else: a browser would otherwise take it from the last out to its own
        // address bar, which is outside the dialog.
        if (event.key !== "Tab") return;
        const pressable = [
          ...(dialog.current?.querySelectorAll<HTMLElement>(
            "input, select, textarea, button, a[href]",
          ) ?? []),
        ].filter((element) => !element.hasAttribute("disabled"));
        const first = pressable[0];
        const last = pressable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        // Escape does what Cancel does, and the page says it is closed rather
        // than the browser alone.
        event.preventDefault();
        cancel();
      }}
    >
      <h2 className="dialog-title" id="modal-dialog-title">
        {title}
      </h2>
      {/* A form, so that Enter in a field does what the first button does. */}
      <form
        className="dialog-form"
        noValidate
        aria-busy={busy === true}
        onSubmit={(event) => {
          event.preventDefault();
          act();
        }}
      >
        <div className="dialog-content stack">{children}</div>
        <div className="dialog-buttons">
          <button className="button button-submit" type="submit">
            {action}
          </button>
          <button className="button" type="button" onClick={cancel}>
            {say("admin.modal.cancel")}
          </button>
        </div>
      </form>
    </dialog>
  );
};
