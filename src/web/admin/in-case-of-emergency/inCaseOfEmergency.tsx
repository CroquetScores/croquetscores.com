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

// The sentence with the administrator's name where the language put it, drawn
// as a link to email them: where in a sentence a name falls is for the
// language to say.
const emailedWords = (): React.ReactNode => {
  const [before = "", ...rest] = say("admin.emergency.emailed").split(
    "{administrator}",
  );
  return (
    <>
      {before}
      <a href={`mailto:${say("admin.administrator.emailAddress")}`}>
        {say("admin.administrator.name")}
      </a>
      {rest.join("{administrator}")}
    </>
  );
};

// The words for having to wait, with the moment where the language put it.
const waitWords = (until: string): React.ReactNode => {
  const [before = "", ...rest] = say("admin.emergency.wait").split("{when}");
  return (
    <>
      {before}
      <time dateTime={until}>
        {new Date(until).toLocaleString(undefined, {
          dateStyle: "full",
          // The long time style names the zone, since a time with no zone
          // means something else to a reader in another one.
          timeStyle: "long",
        })}
      </time>
      {rest.join("{when}")}
    </>
  );
};

export const InCaseOfEmergency = (): React.JSX.Element => {
  const [message, setMessage] = useState("");
  // Pressing Send only asks again: nothing is sent until the dialog is
  // confirmed, because what is sent cannot be taken back.
  const [asking, setAsking] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [refused, setRefused] = useState<string | undefined>();
  // Said by whoever asks, and not by the site: the box is ticked to say they
  // have emailed the administrator and waited.
  // When the account may ask again: undefined until the site has said, then
  // null where it may ask now.
  const [waitUntil, setWaitUntil] = useState<string | null | undefined>();
  useEffect(() => {
    // Not set once the page has gone, which it can before the site answers.
    let leaving = false;
    void fetch("/api/site/emergency-access", {
      headers: { accept: "application/json" },
    })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { waitUntil: string | null }).waitUntil
          : null,
      )
      // Where it cannot be said, the form is shown and the site refuses what
      // it must when it is sent.
      .catch(() => null)
      .then((until) => {
        if (!leaving) setWaitUntil(until);
      });
    return () => {
      leaving = true;
    };
  }, []);
  const [emailed, setEmailed] = useState(false);
  const [unticked, setUnticked] = useState(false);

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
      <p className="emergency-warning" role="alert">
        {say("admin.emergency.warning")}
      </p>
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
      {unticked && !sent ? (
        <p className="page-refused" data-refused="NotEmailed">
          {say("admin.emergency.notEmailed")}
        </p>
      ) : null}
      {aboutPage === undefined ? null : (
        <p className="page-refused" data-refused={aboutPage}>
          {refusalWords(aboutPage).words}
        </p>
      )}
      {!sent && typeof waitUntil === "string" ? (
        <p className="emergency-warning" role="alert" data-wait={waitUntil}>
          {waitWords(waitUntil)}
        </p>
      ) : null}
      {sent || waitUntil !== null ? null : (
        <form
          className="stack"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            setRefused(undefined);
            if (!emailed) {
              setUnticked(true);
              return;
            }
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
          <label className="emergency-emailed">
            <input
              type="checkbox"
              checked={emailed}
              onChange={(event) => {
                setEmailed(event.target.checked);
                setUnticked(false);
              }}
            />
            <span>{emailedWords()}</span>
          </label>
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
