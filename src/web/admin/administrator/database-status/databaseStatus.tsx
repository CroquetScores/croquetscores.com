import { useEffect, useState } from "react";

import { refusalOf } from "../../api.js";
import { Field, type Refusal } from "../../Field.js";
import { knows, say } from "../../words.js";

// The page where an administrator sees and sets whether the site may use its
// database (databaseStatus.feature): what it is now, and beneath that a form
// that turns access off with the minutes expected and the words readers are
// told, or, where it is off, moves the return, changes the words, or turns
// access on again.

/** What the API says of database access. */
interface Status {
  readonly off: boolean;
  /** The minutes remaining, rounded up, until the estimate has passed. */
  readonly minutes?: number;
  readonly words?: string;
}

// A refusal in its own words, or in the words for any.
const refusal = (code: string): Refusal => ({
  code,
  words: say(knows(code) ? code : "admin.databaseStatus.otherwise"),
});

export const DatabaseStatus = (): React.JSX.Element => {
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [minutes, setMinutes] = useState("");
  const [words, setWords] = useState("");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [problem, setProblem] = useState<Refusal | undefined>(undefined);

  // What the form starts from is what is there, so that changing the words
  // does not begin with them blank, and changing only the words keeps the
  // minutes that remain rather than asking for them again.
  const shown = (now: Status): void => {
    setStatus(now);
    setWords(now.words ?? "");
    setMinutes(now.minutes === undefined ? "" : String(now.minutes));
  };

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/site/database-access", {
          headers: { accept: "application/json" },
        });
        if (response.ok) shown((await response.json()) as Status);
        else setProblem(refusal(await refusalOf(response)));
      } catch {
        setProblem(refusal("Unknown"));
      }
    })();
  }, []);

  // Sends what the form says to `what`, and shows what the site then says.
  const send = async (
    what: "off" | "change" | "on",
    body: object,
  ): Promise<void> => {
    setRefused([]);
    setProblem(undefined);
    try {
      const response = await fetch(`/api/site/database-access/${what}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        shown((await response.json()) as Status);
        return;
      }
      const code = await refusalOf(response);
      // The minutes and the words are the fields' to be refused; anything
      // else is said above the form.
      if (code.startsWith("DatabaseAccess.Minutes"))
        setRefused([refusal(code)]);
      else setProblem(refusal(code));
    } catch {
      setProblem(refusal("Unknown"));
    }
  };

  const submit = (what: "off" | "change"): void => {
    if (minutes.trim() === "") {
      setRefused([
        {
          code: "DatabaseAccess.MinutesNeeded",
          words: say("admin.databaseStatus.minutesNeeded"),
        },
      ]);
      return;
    }
    void send(what, { minutes: Number(minutes), words });
  };

  const off = status?.off === true;

  return (
    <div className="stack">
      <h1>{say("admin.databaseStatus.title")}</h1>
      {problem === undefined ? null : (
        <p className="people-refused" data-refused={problem.code}>
          {problem.words}
        </p>
      )}
      {status === undefined ? null : (
        <div className="stack" data-access={off ? "off" : "on"}>
          <p>
            {say(off ? "admin.databaseStatus.off" : "admin.databaseStatus.on")}
          </p>
          {off ? (
            <>
              <p data-expected={status.minutes ?? "longer"}>
                {status.minutes === undefined
                  ? say("admin.databaseStatus.longer")
                  : status.minutes === 1
                    ? say("admin.databaseStatus.expectedOne")
                    : say("admin.databaseStatus.expected", {
                        minutes: String(status.minutes),
                      })}
              </p>
              <p data-told={status.words === undefined ? "usual" : "words"}>
                {status.words === undefined
                  ? say("admin.databaseStatus.toldUsual")
                  : say("admin.databaseStatus.told", { words: status.words })}
              </p>
            </>
          ) : null}
          <form
            className="tab-form stack"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              submit(off ? "change" : "off");
            }}
          >
            <Field
              name="minutes"
              label={say("admin.databaseStatus.minutes")}
              refused={refused}
            >
              {(tied) => (
                <input
                  {...tied}
                  type="text"
                  inputMode="numeric"
                  name="minutes"
                  placeholder=" "
                  autoComplete="off"
                  value={minutes}
                  onChange={(event) => {
                    setMinutes(event.target.value);
                    setRefused([]);
                  }}
                />
              )}
            </Field>
            <Field
              name="words"
              label={say("admin.databaseStatus.words")}
              refused={undefined}
            >
              {(tied) => (
                <textarea
                  {...tied}
                  name="words"
                  placeholder=" "
                  rows={3}
                  value={words}
                  onChange={(event) => {
                    setWords(event.target.value);
                  }}
                />
              )}
            </Field>
            <p>
              <button className="button button-submit" type="submit">
                {say(
                  off
                    ? "admin.databaseStatus.change"
                    : "admin.databaseStatus.turnOff",
                )}
              </button>
              {off ? (
                <button
                  className="button"
                  type="button"
                  onClick={() => void send("on", {})}
                >
                  {say("admin.databaseStatus.turnOn")}
                </button>
              ) : null}
            </p>
          </form>
        </div>
      )}
    </div>
  );
};
