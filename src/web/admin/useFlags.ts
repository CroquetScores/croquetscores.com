import { useEffect, useRef, useState } from "react";

/** A flag as the API offers it: its code, its name as the reader reads it. */
export interface Flag {
  readonly code: string;
  readonly name: string;
}

type Groups = readonly (readonly Flag[])[];

// The flags once they have arrived, kept for every dialog that opens after, so
// that each does not download them again. A list that could not be had is not
// kept, so that the next dialog asks again.
let arrived: Promise<Groups> | undefined;

const fetched = (): Promise<Groups> => {
  arrived ??= fetch("/api/site/flags", {
    headers: { accept: "application/json" },
  })
    .then(async (response) =>
      response.ok ? ((await response.json()) as { groups: Groups }).groups : [],
    )
    .catch((): Groups => [])
    .then((groups) => {
      if (groups.length === 0) arrived = undefined;
      return groups;
    });
  return arrived;
};

/**
 * Every flag a player can fly, in the groups they are offered in, asked for
 * once when whatever uses it appears. It also offers `whenKnown`, which is
 * what has been asked for once the answer is in, for whoever must not act on
 * a list that has not arrived. A list that cannot be had is no flags at all,
 * since neither dialog can do anything about it but let the server refuse
 * what was chosen.
 */
export const useFlags = (): {
  readonly groups: Groups;
  readonly whenKnown: () => Promise<Groups>;
} => {
  const [groups, setGroups] = useState<Groups>([]);
  const asked = useRef<Promise<Groups> | undefined>(undefined);

  useEffect(() => {
    // Not set once the dialog is gone: nothing is left to draw them.
    let open = true;
    const answer = fetched();
    asked.current = answer;
    void answer.then((flags) => {
      if (open) setGroups(flags);
    });
    return () => {
      open = false;
    };
  }, []);

  return { groups, whenKnown: () => asked.current ?? Promise.resolve(groups) };
};
