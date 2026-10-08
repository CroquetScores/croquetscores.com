// Offering to reload when the site has been deployed again (newerBuild.feature).
//
// The admin is one page that draws whichever screen its address names, so a
// tab left open across a deploy keeps the build it loaded while talking to an
// API that is a newer one. The server says the build the admin was sent as in
// the page, and names the build it is serving in every answer of the API; when
// they differ, a reload is offered. Offered and not forced, since a reload
// loses what the reader has typed into a dialog.
import { useEffect, useState } from "react";

import "./newerBuild.css";
import { say } from "./words.js";

// Written again here rather than imported from adminPage.ts, which the admin's
// bundle cannot take in: it is the server's.
const buildId = "admin-build";
const buildHeader = "x-admin-build";

// The build this page was sent as. The admin's own development server has no
// server behind the page to say it, and there is nothing to compare with.
const loadedAs: string | undefined = (() => {
  const said = document.getElementById(buildId)?.textContent;
  return said === undefined || said === null || said === ""
    ? undefined
    : (JSON.parse(said) as string);
})();

let newer = false;
const listeners = new Set<() => void>();

const noticed = (served: string | null): void => {
  if (newer || served === null || served === loadedAs) return;
  newer = true;
  for (const listener of listeners) listener();
};

/**
 * Begins watching what the API answers for a newer build. Every page of the
 * admin asks the API with fetch, a few dozen places among them, so it is
 * watched there once rather than at each, where the next one added would
 * forget to.
 */
export const watchForANewerBuild = (): void => {
  if (loadedAs === undefined) return;
  const ask = window.fetch.bind(window);
  window.fetch = async (...asking) => {
    const answer = await ask(...asking);
    noticed(answer.headers.get(buildHeader));
    return answer;
  };
};

/** The offer to reload, drawn once a newer build has been seen. */
export const NewerBuild = (): React.JSX.Element | null => {
  const [offered, setOffered] = useState(newer);

  useEffect(() => {
    const learnt = (): void => {
      setOffered(true);
    };
    listeners.add(learnt);
    // A build seen between the first draw and this effect is not missed.
    if (newer) learnt();
    return () => {
      listeners.delete(learnt);
    };
  }, []);

  if (!offered) return null;
  return (
    <div className="newer-build" role="status" data-newer-build>
      <span>{say("admin.newerBuild.message")}</span>
      <button
        type="button"
        onClick={() => {
          window.location.reload();
        }}
      >
        {say("admin.newerBuild.reload")}
      </button>
    </div>
  );
};
