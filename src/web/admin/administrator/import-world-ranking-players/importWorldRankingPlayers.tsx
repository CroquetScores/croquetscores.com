import { useRef, useState } from "react";

import { knows, say } from "../../words.js";
import { refusalOf } from "../../api.js";
import "./importWorldRankingPlayers.css";

// The page where an administrator imports the players the world rankings
// know (importWorldRankingPlayers.feature): Import, and beneath it the
// import's log, a line for each thing the import says, shown as it says it.
// Nothing is read until Import is pressed.

/** One thing the import said, as the API sends it, a line of JSON each. */
type Said =
  | { readonly kind: "reading"; readonly sport: string }
  | { readonly kind: "read"; readonly sport: string; readonly players: number }
  | { readonly kind: "kept"; readonly sport: string; readonly players: number }
  | { readonly kind: "refused"; readonly sport: string; readonly code: string }
  | { readonly kind: "finished" }
  // Said here rather than by the import: an import refused before it began,
  // or one the site failed partway through.
  | { readonly kind: "failed"; readonly code: string };

const failed = (code: string): Said => ({ kind: "failed", code });

// A refusal in its own words, or in the words for any.
const sayRefusal = (code: string): string =>
  say(knows(code) ? code : "admin.worldRankings.otherwise");

// The words of a line, each phrase on its own so that a code's words follow
// the sport's rather than being written into them.
const wordsOf = (line: Said): readonly string[] => {
  switch (line.kind) {
    case "reading":
      return [say(`admin.worldRankings.${line.sport}.reading`)];
    case "read":
    case "kept":
      return [
        say(`admin.worldRankings.${line.sport}.${line.kind}`, {
          players: String(line.players),
        }),
      ];
    case "refused":
      return [
        say(`admin.worldRankings.${line.sport}.refused`),
        sayRefusal(line.code),
      ];
    case "finished":
      return [say("admin.worldRankings.finished")];
    case "failed":
      return [say("admin.worldRankings.failed"), sayRefusal(line.code)];
  }
};

// Every whole line of JSON in `received`, and what is left after the last,
// which is the start of a line still coming.
const linesIn = (
  received: string,
): { whole: readonly Said[]; rest: string } => {
  const parts = received.split("\n");
  const rest = parts.pop() ?? "";
  return {
    whole: parts
      .filter((part) => part.trim() !== "")
      .map((part) => JSON.parse(part) as Said),
    rest,
  };
};

export const ImportWorldRankingPlayers = (): React.JSX.Element => {
  const [log, setLog] = useState<readonly Said[]>([]);
  const [importing, setImporting] = useState(false);
  // Its own flag as well as the state, which a second press in the same
  // moment would read before it changed.
  const underway = useRef(false);

  const add = (said: readonly Said[]): void => {
    setLog((before) => [...before, ...said]);
  };

  const run = async (): Promise<void> => {
    if (underway.current) return;
    underway.current = true;
    setImporting(true);
    setLog([]);
    // What was said last, so that an answer cut off before the import
    // finished is said to have been, rather than the log stopping without
    // saying why.
    let last: Said | undefined;
    try {
      const response = await fetch("/api/v1/world-ranking-players/import", {
        method: "POST",
        headers: { accept: "application/x-ndjson, application/json" },
      });
      if (!response.ok || response.body === null) {
        last = failed(await refusalOf(response));
        add([last]);
      } else {
        const reading = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();
        let received = "";
        for (;;) {
          const { done, value } = await reading.read();
          received += value ?? (done ? "\n" : "");
          const { whole, rest } = linesIn(received);
          received = rest;
          if (whole.length > 0) {
            last = whole.at(-1);
            add(whole);
          }
          if (done) break;
        }
      }
    } catch {
      last = undefined;
    }
    if (last?.kind !== "finished" && last?.kind !== "failed") {
      add([failed("Unknown")]);
    }
    underway.current = false;
    setImporting(false);
  };

  return (
    <div className="stack" aria-busy={importing}>
      <h1>{say("admin.worldRankings.title")}</h1>
      <p>
        <button
          type="button"
          className="button button-submit"
          disabled={importing}
          title={say("admin.hover.worldRankings.import")}
          onClick={() => void run()}
        >
          {say("admin.worldRankings.import")}
        </button>
      </p>
      <ol
        className="import-log"
        aria-label={say("admin.worldRankings.log")}
        aria-live="polite"
      >
        {log.map((line, index) => (
          <li
            // A log only ever grows, until it is emptied for the next import.
            key={index}
            className="import-log-line"
            data-kind={line.kind}
            data-sport={"sport" in line ? line.sport : undefined}
            data-players={"players" in line ? line.players : undefined}
            data-refused={"code" in line ? line.code : undefined}
          >
            {wordsOf(line).map((words) => (
              <span key={words}>{words} </span>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
};
