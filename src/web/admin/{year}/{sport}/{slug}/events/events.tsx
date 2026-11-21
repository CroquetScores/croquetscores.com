import { useEffect, useState } from "react";

import { refusalOf } from "../../../../api.js";
import { say } from "../../../../words.js";
import { HeldPage } from "../HeldPage.js";
import { RefusedPage } from "../RefusedPage.js";
import "./events.css";

// Every event kept of a tournament (events.feature), oldest first, each a line
// that is pressed to open the rest of what it carried. It is the administrator's
// page, found beneath the tournament it is of: the server refuses anybody else
// the page (server.ts), and the API refuses them the events.

interface Props {
  /** Where the tournament was asked for, as "2026/ac/spring-open". */
  readonly address: string;
}

interface Kept {
  readonly kind: string;
  readonly stream: string;
  readonly happenedAt: string;
  readonly carried: unknown;
}

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | {
      readonly is: "found";
      readonly name: string;
      readonly events: readonly Kept[];
    };

export const Events = ({ address }: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });

  useEffect(() => {
    let current = true;
    void fetch(`/api/site/tournaments/at/${address}/events`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          const code = await refusalOf(response);
          if (current) setAsked({ is: "refused", code });
          return;
        }
        const body = (await response.json()) as {
          name: string;
          events: Kept[];
        };
        if (current) {
          setAsked({ is: "found", name: body.name, events: body.events });
        }
      })
      .catch(() => {
        if (current) setAsked({ is: "refused", code: "Unknown" });
      });
    return () => {
      current = false;
    };
  }, [address]);

  if (asked.is === "asking") return <HeldPage />;
  if (asked.is === "refused") {
    return (
      <RefusedPage
        heading={say("admin.title")}
        code={asked.code}
        otherwise="admin.events.otherwise"
      />
    );
  }

  return (
    <main id="content">
      <div className="page">
        <div className="panel stack">
          <h1>{asked.name}</h1>
          <p>
            <a
              className="events-back"
              href="/admin/"
              title={say("admin.hover.events.back")}
            >
              {say("admin.events.back")}
            </a>
          </p>
          {asked.events.length === 0 ? (
            <p data-none="">{say("admin.events.none")}</p>
          ) : (
            <ul className="events">
              {asked.events.map((event, place) => (
                <li key={place}>
                  <details className="event">
                    <summary>
                      <time
                        className="event-happened"
                        dateTime={event.happenedAt}
                      >
                        {event.happenedAt}
                      </time>
                      <span className="event-kind">{event.kind}</span>
                      <span className="event-stream">{event.stream}</span>
                    </summary>
                    <pre className="event-carried">
                      {JSON.stringify(event.carried, null, 2)}
                    </pre>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
};
