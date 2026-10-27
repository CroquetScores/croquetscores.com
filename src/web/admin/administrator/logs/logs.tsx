import { useCallback, useEffect, useState } from "react";

import { ModalDialog } from "../../ModalDialog.js";
import { refusalOf } from "../../api.js";
import { knows, say } from "../../words.js";
import "./logs.css";

// The server's log (logs.feature): the newest entries, each one line that is
// pressed to open the rest of what it carried, narrowed by a severity and a
// box to look text up in, and the log from before the last hour removed by
// Prune, which asks first.
//
// The narrowing is a form sent by GET, so the address carries it and the page
// is the same one however it is reached: opened from a link an administrator
// was sent, or returned to.

const severities = ["Trace", "Debug", "Info", "Warn", "Error", "Fatal"];

interface Entry {
  readonly id: string;
  readonly writtenAt: string;
  readonly severity: string;
  readonly message: string;
  readonly details: unknown;
}

// What the address narrows to. A severity the log does not write in is taken
// as none, as a hand-written address may carry one.
const narrowedBy = (): { severity: string; text: string } => {
  const asked = new URLSearchParams(window.location.search);
  const severity = asked.get("severity") ?? "";
  return {
    severity: severities.includes(severity) ? severity : "Trace",
    text: asked.get("text") ?? "",
  };
};

export const Logs = (): React.JSX.Element => {
  const [narrowed] = useState(narrowedBy);
  const [entries, setEntries] = useState<readonly Entry[] | undefined>();
  const [refused, setRefused] = useState<string | undefined>();
  const [pruning, setPruning] = useState(false);
  const [removed, setRemoved] = useState<number | undefined>();
  const [readAgain, setReadAgain] = useState(0);

  useEffect(() => {
    let current = true;
    const asking = new URLSearchParams({
      severity: narrowed.severity,
      text: narrowed.text,
    });
    void fetch(`/api/site/logs?${asking.toString()}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (response.ok) {
          const body = (await response.json()) as { entries: Entry[] };
          if (current) setEntries(body.entries);
        } else {
          const code = await refusalOf(response);
          if (current) setRefused(code);
        }
      })
      .catch(() => {
        if (current) setRefused("Unknown");
      });
    return () => {
      current = false;
    };
  }, [narrowed, readAgain]);

  const prune = useCallback(async () => {
    setPruning(false);
    setRemoved(undefined);
    try {
      const response = await fetch("/api/site/logs/prune", {
        method: "POST",
        headers: { accept: "application/json" },
      });
      if (response.ok) {
        const body = (await response.json()) as { removed: number };
        setRefused(undefined);
        setRemoved(body.removed);
        setReadAgain((times) => times + 1);
      } else {
        setRefused(await refusalOf(response));
      }
    } catch {
      setRefused("Unknown");
    }
  }, []);

  return (
    <div className="stack" aria-busy={entries === undefined && !refused}>
      <h1>{say("admin.logs.title")}</h1>
      <form className="log-narrowing" method="get">
        <label>
          {say("admin.logs.severity")}
          <select name="severity" defaultValue={narrowed.severity}>
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
        </label>
        <label>
          {say("admin.logs.text")}
          <input
            type="search"
            name="text"
            defaultValue={narrowed.text}
            autoComplete="off"
          />
        </label>
        <button
          className="button button-submit"
          type="submit"
          title={say("admin.hover.logs.show")}
        >
          {say("admin.logs.show")}
        </button>
      </form>
      <button
        className="button log-prune"
        type="button"
        title={say("admin.hover.logs.prune")}
        onClick={() => {
          setPruning(true);
        }}
      >
        {say("admin.logs.prune")}
      </button>
      {removed === undefined ? null : (
        <p role="status" data-removed={removed}>
          {say("admin.logs.removed", { count: String(removed) })}
        </p>
      )}
      {refused !== undefined ? (
        <p className="refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.logs.otherwise")}
        </p>
      ) : entries === undefined ? null : entries.length === 0 ? (
        <p data-none="">{say("admin.logs.none")}</p>
      ) : (
        <ul className="log-entries">
          {entries.map((entry) => (
            <li key={entry.id}>
              <details className="log-entry">
                <summary>
                  <span
                    className="log-entry-severity"
                    data-severity={entry.severity}
                  >
                    {entry.severity}
                  </span>
                  <time
                    className="log-entry-written"
                    dateTime={entry.writtenAt}
                  >
                    {entry.writtenAt}
                  </time>
                  <span className="log-entry-message">{entry.message}</span>
                </summary>
                <pre className="log-entry-details">
                  {JSON.stringify(entry.details, null, 2)}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      )}
      {pruning ? (
        <ModalDialog
          title={say("admin.logs.prune")}
          action={say("admin.logs.prune")}
          hover={say("admin.hover.logs.pruneAgree")}
          act={() => void prune()}
          cancel={() => {
            setPruning(false);
          }}
        >
          <p>{say("admin.logs.pruneAsk")}</p>
        </ModalDialog>
      ) : null}
    </div>
  );
};
