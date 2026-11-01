import { useState } from "react";

import { say } from "../../../../../../../../words.js";
import { idInAddress } from "../../../../../../../../api.js";
import { useListed } from "../../../../../../../../useListed.js";
import { LosersDialog } from "../../modal-dialogs/losers/losers.js";
import "../../../../../../../../listed.css";

// A knockout's Losers tab (losers-tab.feature): the knockouts that take the
// losers of this one's rounds, each a link to its page, with Add Losers
// Knockout above them. The list is the tournament's competitions as the API
// lists them, of which this one is also the source of how many rounds it has.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
  /** The knockout's id. */
  readonly competition: string;
}

/** A competition as the API lists it, so far as this tab needs. */
interface Listed {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly archived: boolean;
  readonly kind: string;
  readonly rounds?: readonly number[];
  readonly losersOf?: {
    readonly competition: string;
    readonly round: number;
  };
}

export const LosersTab = ({
  tournament,
  address,
  competition,
}: Props): React.JSX.Element => {
  const [adding, setAdding] = useState(false);
  const { listed, asking, answered, askAgain } = useListed<Listed>(
    `/api/site/tournaments/${idInAddress(tournament)}/competitions`,
    "competitions",
  );
  const self = listed?.find(({ id }) => id === competition);
  const taking =
    listed?.filter(
      ({ losersOf, archived }) =>
        !archived && losersOf?.competition === competition,
    ) ?? [];
  // Every round but the final sends its losers on.
  const rounds = (self?.rounds?.length ?? 1) - 1;

  return (
    <section className="stack losers-tab" aria-busy={answered !== asking}>
      {self === undefined ? null : rounds < 1 ? (
        <p className="listed-none">{say("admin.losers.noRounds")}</p>
      ) : (
        <p>
          <button
            type="button"
            className="button"
            title={say("admin.hover.losers.add")}
            onClick={() => {
              setAdding(true);
            }}
          >
            {say("admin.losers.add")}
          </button>
        </p>
      )}
      {listed === undefined ? null : taking.length === 0 ? (
        <p className="listed-none">{say("admin.losers.none")}</p>
      ) : (
        <ul className="listed" data-listed="losers">
          {taking.map((each) => (
            <li key={each.id} className="listed-item">
              <a
                className="listed-name"
                href={`/admin/${address}/competitions/${each.slug}`}
              >
                {each.name}
              </a>
            </li>
          ))}
        </ul>
      )}
      {adding && self !== undefined ? (
        <LosersDialog
          tournament={tournament}
          competition={competition}
          rounds={rounds}
          kept={askAgain}
          close={() => {
            setAdding(false);
          }}
        />
      ) : null}
    </section>
  );
};
