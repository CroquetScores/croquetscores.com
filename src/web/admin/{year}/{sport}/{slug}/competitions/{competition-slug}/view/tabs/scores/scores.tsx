import { useEffect, useState } from "react";

import { say } from "../../../../../../../../words.js";
import { ScoreDialog } from "../../modal-dialogs/score/score.js";
import "../../../../../view/tabs/listed.css";
import "./scores.css";

// A competition's Scores tab (scores-tab.feature): Add Score above the games
// in use, in the order they were entered, each saying the winner and their
// score, then the loser and theirs, and offering Archive where it can be
// archived; after them the archived, struck through, offering Restore.
// Whatever is pressed, and whenever the dialog adds a game, the list is asked
// for again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
}

/** A game as the API lists it. */
interface Listed {
  readonly id: string;
  readonly winner: string;
  readonly winnerScore: string;
  readonly loser: string;
  readonly loserScore: string;
  readonly archived: boolean;
  readonly archivable: boolean;
}

// The part of an id after its kind, which is how the API names a thing.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

export const ScoresTab = ({
  tournament,
  competition,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  const [adding, setAdding] = useState(false);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/competitions/${idInAddress(competition)}/games`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { games: Listed[] }).games
          : undefined,
      )
      .catch(() => undefined)
      .then((games) => {
        if (!current) return;
        setListed(games);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, asking]);

  const askAgain = (): void => {
    setAsking((count) => count + 1);
  };

  // Neither asks first: each is undone by the other, and nothing is lost.
  const act = async (
    game: Listed,
    action: "archive" | "restore",
  ): Promise<void> => {
    setActing(true);
    try {
      await fetch(`${at}/${idInAddress(game.id)}/${action}`, {
        method: "POST",
      });
    } catch {
      // A request that never arrived is said by the list asked for again.
    } finally {
      askAgain();
      setActing(false);
    }
  };

  const inUse = listed?.filter(({ archived }) => !archived) ?? [];
  const archived = listed?.filter((game) => game.archived) ?? [];

  const row = (game: Listed): React.JSX.Element => (
    <li
      key={game.id}
      className="listed-item"
      data-archived={game.archived ? "" : undefined}
    >
      <span className="listed-score">
        <span className="score-winner">{game.winner}</span>{" "}
        <span className="score-winner-score">{game.winnerScore}</span>{" "}
        <span className="score-loser">{game.loser}</span>{" "}
        <span className="score-loser-score">{game.loserScore}</span>
      </span>
      {game.archived ? (
        <span className="visually-hidden">
          {say("admin.scores.archivedSaid")}
        </span>
      ) : null}
      <span className="listed-options">
        {game.archived ? (
          <button
            type="button"
            className="button"
            onClick={() => void act(game, "restore")}
          >
            {say("admin.scores.restore")}
          </button>
        ) : game.archivable ? (
          <button
            type="button"
            className="button"
            onClick={() => void act(game, "archive")}
          >
            {say("admin.scores.archive")}
          </button>
        ) : null}
      </span>
    </li>
  );

  return (
    <section
      className="stack scores-tab"
      aria-busy={acting || answered !== asking}
    >
      {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
      <p>
        <button
          type="button"
          className="button"
          onClick={() => {
            setAdding(true);
          }}
        >
          {say("admin.scores.add")}
        </button>
      </p>
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.scores.none")}</p>
      ) : (
        <>
          {inUse.length > 0 ? (
            <ul className="listed" data-listed="in-use">
              {inUse.map(row)}
            </ul>
          ) : null}
          {archived.length > 0 ? (
            <>
              <h2 className="listed-archived-heading">
                {say("admin.scores.archived")}
              </h2>
              <ul className="listed" data-listed="archived">
                {archived.map(row)}
              </ul>
            </>
          ) : null}
        </>
      )}
      {adding ? (
        <ScoreDialog
          tournament={tournament}
          competition={competition}
          kept={askAgain}
          close={() => {
            setAdding(false);
          }}
        />
      ) : null}
    </section>
  );
};
