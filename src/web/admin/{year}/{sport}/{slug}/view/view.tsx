import { useEffect, useState } from "react";

import { knows, say } from "../../../../words.js";
import { CompetitionsTab } from "./tabs/competitions/competitions.js";
import { ManagersTab } from "./tabs/managers/managers.js";
import { PlayersTab } from "./tabs/players/players.js";
import { ScorersTab } from "./tabs/scorers/scorers.js";
import "./view.css";

// A tournament's page (view.feature): headed by its name, with what there is
// to run in four tabs in the section bar. The tabs are parts of the one page
// rather than pages of their own, so they have no addresses: the page opens on
// Players, and choosing another leaves the address as it was. Each tab says
// what it holds in a feature of its own.

interface Props {
  /** Where the tournament was asked for, as "2026/ac/spring-open". */
  readonly address: string;
}

/** What the page knows of the tournament, as the API answers it. */
interface Found {
  readonly id: string;
  readonly name: string;
  readonly address: string;
}

type Asked =
  | { readonly is: "asking" }
  | { readonly is: "refused"; readonly code: string }
  | { readonly is: "found"; readonly tournament: Found };

const tabs = ["players", "competitions", "managers", "scorers"] as const;
type Tab = (typeof tabs)[number];

// What a refusal says in place of the tabs: its words, by its code, or the
// words for any where it has none.
const wordsFor = (code: string): string =>
  say(knows(code) ? code : "admin.view.otherwise");

export const ViewTournament = ({ address }: Props): React.JSX.Element => {
  const [asked, setAsked] = useState<Asked>({ is: "asking" });
  const [chosen, setChosen] = useState<Tab>("players");

  useEffect(() => {
    // Asked as the page that edits it asks, and refused the same way: only a
    // manager runs a tournament, and an archived one can only be restored.
    void fetch(`/api/v1/tournaments/at/${address}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        const answer = (await response.json()) as Found & { error?: string };
        if (!response.ok) {
          setAsked({ is: "refused", code: answer.error ?? "Unknown" });
          return;
        }
        // An address the tournament has moved on from sends the reader to
        // where it is now.
        if (answer.address !== address) {
          window.location.replace(`/admin/${answer.address}`);
          return;
        }
        setAsked({ is: "found", tournament: answer });
      })
      .catch(() => {
        setAsked({ is: "refused", code: "Unknown" });
      });
  }, [address]);

  if (asked.is === "asking") return <main id="content" />;

  if (asked.is === "refused") {
    return (
      <main id="content">
        <div className="page">
          <div className="panel stack">
            <h1>{say("admin.title")}</h1>
            <p className="page-refused" data-refused={asked.code}>
              {wordsFor(asked.code)}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <nav
        className="site-sections tournament-tabs"
        aria-label={say("admin.view.tabs")}
      >
        <div className="page">
          <ul role="tablist">
            {tabs.map((tab) => (
              <li key={tab} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`tab-${tab}`}
                  aria-controls="tab-panel"
                  aria-selected={tab === chosen}
                  onClick={() => {
                    setChosen(tab);
                  }}
                >
                  {say(`admin.view.${tab}`)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main id="content">
        <div className="page">
          <div
            className="panel stack"
            id="tab-panel"
            role="tabpanel"
            aria-labelledby={`tab-${chosen}`}
          >
            <h1>{asked.tournament.name}</h1>
            {chosen === "players" ? (
              <PlayersTab tournament={asked.tournament.id} />
            ) : null}
            {chosen === "competitions" ? (
              <CompetitionsTab
                tournament={asked.tournament.id}
                address={asked.tournament.address}
              />
            ) : null}
            {chosen === "managers" ? (
              <ManagersTab tournament={asked.tournament.id} />
            ) : null}
            {chosen === "scorers" ? (
              <ScorersTab tournament={asked.tournament.id} />
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
};
