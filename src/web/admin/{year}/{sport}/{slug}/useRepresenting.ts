import { useEffect, useState } from "react";

import type { Matching } from "./WorldRankingPlayers.js";

// How long typing must pause before what was typed is asked, as it is for the
// world ranking players, so that a club typed at speed is asked once or twice
// rather than once a letter.
const PAUSE_MILLISECONDS = 150;

// What the server finds nothing for is not asked of it: one letter begins too
// many to choose from (RepresentingMatching.feature).
const FEWEST_CHARACTERS = 2;

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
    // What was offered for what was typed before is no answer for what is
    // typed after the field has been emptied or left, so it is not kept to be
    // shown for the next.
    if (!asking || [...typed.trim()].length < FEWEST_CHARACTERS) {
      setOffered(undefined);
      return;
    }
    let current = true;
    // What is asked of a text that has been typed past is not waited for: a
    // request left running for each pause in the typing is a query that runs
    // for nobody.
    const request = new AbortController();
    const paused = setTimeout(() => {
      void fetch(`/api/site/representing?typed=${encodeURIComponent(typed)}`, {
        headers: { accept: "application/json" },
        signal: request.signal,
      })
        .then(async (response) =>
          response.ok
            ? ((await response.json()) as { representing: string[] })
                .representing
            : undefined,
        )
        // Nothing is offered where nothing could be asked: the field takes
        // whatever is typed, and what was offered for the text before is not
        // left standing as though it were for this.
        .catch(() => undefined)
        .then((representing) => {
          if (current) {
            setOffered(
              representing === undefined
                ? undefined
                : { players: representing, known: false },
            );
          }
        });
    }, PAUSE_MILLISECONDS);
    return () => {
      current = false;
      request.abort();
      clearTimeout(paused);
    };
  }, [typed, asking]);
  return asking && [...typed.trim()].length >= FEWEST_CHARACTERS
    ? offered
    : undefined;
};

/**
 * The rest of the first of `offered` that `typed` is the start of, in any
 * case, or nothing where none is: what is shown after the typing in a lighter
 * colour, and made the typing by the tab key (player.feature). Only a name the
 * typing begins has a rest, as an offer that merely has a word beginning with
 * the typing does not: typing more would not make it. The typing is compared
 * as it is, spaces and all, so that a space typed after a word is one the
 * name has.
 */
export const restOf = (
  typed: string,
  offered: Matching | undefined,
): { readonly name: string; readonly rest: string } | undefined => {
  if (typed.trim() === "") return undefined;
  const wanted = typed.toLowerCase();
  const name = offered?.players.find(
    (each) =>
      each.length > typed.length &&
      each.slice(0, typed.length).toLowerCase() === wanted,
  );
  return name === undefined
    ? undefined
    : { name, rest: name.slice(typed.length) };
};
