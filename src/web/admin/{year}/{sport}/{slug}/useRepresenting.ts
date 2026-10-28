import { useEffect, useState } from "react";

import type { Matching } from "./WorldRankingPlayers.js";

// How long typing must pause before what was typed is asked, as it is for the
// world ranking players, so that a club typed at speed is asked once or twice
// rather than once a letter.
const PAUSE_MILLISECONDS = 150;

/**
 * What players have been added representing that `typed` may be the start of
 * (player.feature): the answer for what was typed last, kept while what is
 * typed now is asked, so that the offers do not blink out with every letter.
 * Shaped as the world ranking players are so that the same `Offers` shows it;
 * `known` says nothing here, since nothing is marked for what is represented.
 */
export const useRepresenting = (
  typed: string,
  asking: boolean,
): Matching | undefined => {
  const [offered, setOffered] = useState<Matching | undefined>();
  useEffect(() => {
    if (!asking || typed.trim() === "") return;
    let current = true;
    const paused = setTimeout(() => {
      void fetch(`/api/site/representing?typed=${encodeURIComponent(typed)}`, {
        headers: { accept: "application/json" },
      })
        .then(async (response) =>
          response.ok
            ? ((await response.json()) as { representing: string[] })
                .representing
            : undefined,
        )
        // Nothing is offered where nothing could be asked: the field takes
        // whatever is typed.
        .catch(() => undefined)
        .then((representing) => {
          if (current && representing !== undefined) {
            setOffered({ players: representing, known: false });
          }
        });
    }, PAUSE_MILLISECONDS);
    return () => {
      current = false;
      clearTimeout(paused);
    };
  }, [typed, asking]);
  return asking && typed.trim() !== "" ? offered : undefined;
};
