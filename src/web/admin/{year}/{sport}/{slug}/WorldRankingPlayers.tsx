import { useEffect, useState } from "react";

import { say } from "../../../words.js";
import "./worldRankingPlayers.css";

// What the player dialogs show of the world ranking players as a name is
// typed (player.feature, team-player.feature): the players the typing may be
// the start of, offered beneath the field, and beside the world ranking name a
// tick where the world rankings know it and a question mark where they do not.
// Written once for both dialogs, so that the two cannot come to differ.

/** What a name typed may be, as the API answers it. */
export interface Matching {
  readonly players: readonly string[];
  readonly known: boolean;
}

// What each name has been answered with, so that the world ranking name
// following the name asks nothing the name has not already asked. A failure
// is not kept, so that the next keystroke asks again.
const answered = new Map<string, Promise<Matching>>();

const ask = (sport: string, typed: string): Promise<Matching> => {
  const key = `${sport}\n${typed}`;
  const found = answered.get(key);
  if (found !== undefined) return found;
  const asking = fetch(
    `/api/v1/world-rankings/${sport}/players?typed=${encodeURIComponent(typed)}`,
    { headers: { accept: "application/json" } },
  ).then(async (response) => {
    if (!response.ok) throw new Error(`Answered ${response.status}.`);
    return (await response.json()) as Matching;
  });
  answered.set(key, asking);
  asking.catch(() => answered.delete(key));
  return asking;
};

/**
 * What `typed` may be among the world ranking players of `sport`, once it is
 * known: nothing while it is asked, nothing where nothing is typed, and
 * nothing where the sport has no world rankings.
 */
export const useMatching = (
  sport: string | undefined,
  typed: string,
): Matching | undefined => {
  const key = sport === undefined ? undefined : `${sport}\n${typed}`;
  const [answer, setAnswer] = useState<
    { readonly key: string; readonly matching: Matching } | undefined
  >();
  useEffect(() => {
    if (sport === undefined || key === undefined || typed.trim() === "") {
      return;
    }
    let current = true;
    ask(sport, typed).then(
      (matching) => {
        if (current) setAnswer({ key, matching });
      },
      // Nothing is offered, and nothing marked, where nothing could be asked:
      // both are only advice, and the field still takes whatever is typed.
      () => undefined,
    );
    return () => {
      current = false;
    };
  }, [sport, typed, key]);
  if (answer === undefined || answer.key !== key || typed.trim() === "") {
    return undefined;
  }
  return answer.matching;
};

/** The players offered beneath the field whose `list` is `id`. */
export const Offers = ({
  id,
  matching,
}: {
  readonly id: string;
  readonly matching: Matching | undefined;
}): React.JSX.Element => (
  <datalist id={id}>
    {(matching?.players ?? []).map((player) => (
      <option key={player} value={player} />
    ))}
  </datalist>
);

/**
 * A tick where the world rankings know the name, and a question mark that
 * says why where they do not, or nothing before anything is typed. Said in
 * words to whoever cannot see it, and on hovering over it to whoever can.
 */
export const Mark = ({
  matching,
}: {
  readonly matching: Matching | undefined;
}): React.JSX.Element | null => {
  if (matching === undefined) return null;
  const words = say(
    matching.known
      ? "admin.player.worldRankingKnown"
      : "admin.player.worldRankingQuestioned",
  );
  return (
    <span
      className="world-ranking-mark"
      data-mark={matching.known ? "ticked" : "questioned"}
      role="img"
      aria-label={words}
      title={words}
    >
      {matching.known ? "✓" : "?"}
    </span>
  );
};
