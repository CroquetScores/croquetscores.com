import { useEffect, useState } from "react";

/**
 * Whether the site offers Advantage Golf Croquet, as the API says it
 * (advantageGolfCroquet.feature): not until it has answered, and not where it
 * could not, so that a choice is never offered that a request making it would
 * be refused.
 *
 * Asked when the page that needs it opens and not when a dialog does, so that
 * the answer is in long before the reader reaches the dialog and the choice
 * does not appear in it a moment after it opens. It is the website's answer
 * and not the sport's: whether the sport is golf croquet is for whoever asks.
 */
export const useAdvantageOffered = (): boolean => {
  const [offered, setOffered] = useState(false);

  useEffect(() => {
    let current = true;
    void fetch("/api/site/advantage-golf-croquet", {
      headers: { accept: "application/json" },
    })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { readonly offered: boolean }).offered
          : false,
      )
      .catch(() => false)
      .then((answer) => {
        if (current) setOffered(answer === true);
      });
    return () => {
      current = false;
    };
  }, []);

  return offered;
};
