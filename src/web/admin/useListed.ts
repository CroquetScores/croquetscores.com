import { useEffect, useState } from "react";

/**
 * What the API lists at `at` under `key`, which is `undefined` until it has
 * answered and where it could not.
 *
 * Asked again whenever `askAgain` is called, which a page does once something
 * has been pressed or kept, and not before: `answered` is the number of the
 * asking whose answer `listed` is, and a page that has not yet got the answer
 * to the latest asking is busy (`answered !== asking`). An answer to an asking
 * that is no longer the current one is dropped, since a slower earlier one
 * must not replace a later.
 */
export const useListed = <T>(
  at: string,
  key: string,
): {
  readonly listed: readonly T[] | undefined;
  readonly asking: number;
  readonly answered: number | undefined;
  readonly askAgain: () => void;
} => {
  const [listed, setListed] = useState<readonly T[] | undefined>();
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as Record<string, T[]>)[key]
          : undefined,
      )
      .catch(() => undefined)
      .then((answer) => {
        if (!current) return;
        setListed(answer);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, key, asking]);

  const askAgain = (): void => {
    setAsking((count) => count + 1);
  };

  return { listed, asking, answered, askAgain };
};
