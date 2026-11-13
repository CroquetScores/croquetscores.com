import { useEffect, useRef, useState } from "react";

import { refusalOf } from "../api.js";
import { Field, type Refusal } from "../Field.js";
import { ModalDialog } from "../ModalDialog.js";
import { knows, say } from "../words.js";

// The page where somebody who has come to take the site over asks the people
// who hold its passwords for them (inCaseOfEmergency.feature). Any signed-in
// account may use it, so it is not one of the administrator's pages.

// The refusals that are about what was typed, and so are said beside it. Any
// other is about the site or the account, and is said above the form.
const aboutTheMessage: readonly string[] = [
  "EmergencyAccess.MessageMissing",
  "EmergencyAccess.MessageTooLong",
];

const refusalWords = (code: string): Refusal => ({
  code,
  words: say(knows(code) ? code : "admin.emergency.otherwise"),
});

export const InCaseOfEmergency = (): React.JSX.Element => {
  const [message, setMessage] = useState("");
  // Pressing Send only asks again: nothing is sent until the dialog is
  // confirmed, because what is sent cannot be taken back.
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [refused, setRefused] = useState<string | undefined>();

  // The button that was pressed is gone once the message is sent, so focus is
  // given to the notice, and a screen reader is told it by its role.
  const notice = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (sent) notice.current?.focus();
  }, [sent]);

  const send = async (): Promise<void> => {
    setSending(true);
    setRefused(undefined);
    try {
      const response = await fetch("/api/site/emergency-access", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (response.ok) {
        setSent(true);
        setMessage("");
      } else {
        setRefused(await refusalOf(response));
      }
    } catch {
      setRefused("Unknown");
    } finally {
      // Closed either way: a refusal is shown on the page, where what was typed
      // is, and not in a dialog that has to be closed to see it.
      setAsking(false);
      setSending(false);
    }
  };

  const aboutField =
    refused !== undefined && aboutTheMessage.includes(refused)
      ? [refusalWords(refused)]
      : undefined;
  const aboutPage =
    // Not once it is sent: a second asking that got in before the dialog closed
    // is refused, and the page must not say both.
    !sent && refused !== undefined && !aboutTheMessage.includes(refused)
      ? refused
      : undefined;

  return (
    <div className="stack">
      <h1>{say("admin.emergency.title")}</h1>
      <p>{say("admin.emergency.explanation")}</p>
      {sent ? (
        <p
          className="emergency-sent"
          data-sent=""
          role="status"
          tabIndex={-1}
          ref={notice}
        >
          {say("admin.emergency.sent")}
        </p>
      ) : null}
      {aboutPage === undefined ? null : (
        <p className="page-refused" data-refused={aboutPage}>
          {refusalWords(aboutPage).words}
        </p>
      )}
      {sent ? null : (
        <form
          className="stack"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setRefused(undefined);
            setAsking(true);
          }}
        >
          <Field
            name="message"
            label={say("admin.emergency.question")}
            refused={aboutField}
            lifted
          >
            {(tied) => (
              <textarea
                {...tied}
                rows={6}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setRefused(undefined);
                }}
              />
            )}
          </Field>
          <div className="dialog-buttons">
            <button
              className="button button-submit"
              type="submit"
              title={say("admin.hover.emergency.send")}
            >
              {say("admin.emergency.send")}
            </button>
          </div>
        </form>
      )}
      {asking ? (
        <ModalDialog
          title={say("admin.emergency.confirmTitle")}
          action={say("admin.emergency.yes")}
          hover={say("admin.hover.emergency.yes")}
          busy={sending}
          act={() => void send()}
          cancel={() => {
            setAsking(false);
          }}
        >
          <p>{say("admin.emergency.confirm")}</p>
        </ModalDialog>
      ) : null}
    </div>
  );
};
