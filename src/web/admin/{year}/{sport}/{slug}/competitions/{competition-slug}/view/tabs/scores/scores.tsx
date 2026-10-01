import { useEffect, useState } from "react";

import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { say } from "../../../../../../../../words.js";
import { noOption } from "../../../../../view/tabs/optionFace.js";
import { ScoreDialog } from "../../modal-dialogs/score/score.js";
import "../../../../../view/tabs/listed.css";
import "./scores.css";

// A competition's Scores tab (scores-tab.feature): Add Score above the games
// in use, in the order they were entered, each saying the winner and their
// score, then the loser and theirs, and offering Edit, and Archive where it
// can be archived; after them the archived, struck through, offering Restore.
// Whatever is pressed, and whenever the dialog adds or corrects a game, the
// list is asked for again. In a knockout whose draw is not filled, Add Score
// says why scores cannot be added rather than opening the dialog.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  /** A knockout's draw has to be filled before any game can be added. */
  readonly kind: "block" | "knockout" | "swiss";
}

/** A game as the API lists it. */
interface Listed {
  readonly id: string;
  readonly winner: string;
  readonly winnerId: string;
  readonly winnerScore: string;
  readonly loser: string;
  readonly loserId: string;
  readonly loserScore: string;
  readonly archived: boolean;
  readonly archivable: boolean;
}

// The part of an id after its kind, which is how the API names a thing.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// Whether the knockout `competition` has as many players and byes as its draw
// has places, counted as the knockout counts them: a withdrawn player keeps
// their place, so they count, and a bye fills one. Asked when Add Score is
// pressed, so that a place filled since the tab was opened is counted. Where
// either answer does not come, it is left to the knockout to refuse.
const drawFilled = async (
  tournament: string,
  competition: string,
): Promise<boolean> => {
  const ofTournament = `/api/v1/tournaments/${idInAddress(tournament)}`;
  const asked = async <T,>(path: string): Promise<T | undefined> =>
    fetch(path, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok ? ((await response.json()) as T) : undefined,
      )
      .catch(() => undefined);
  const [competitions, players] = await Promise.all([
    asked<{
      competitions: { readonly id: string; readonly places?: number }[];
    }>(`${ofTournament}/competitions`),
    asked<{ players: unknown[] }>(
      `${ofTournament}/competitions/${idInAddress(competition)}/players`,
    ),
  ]);
  const places = competitions?.competitions.find(
    ({ id }) => id === competition,
  )?.places;
  if (places === undefined || players === undefined) return true;
  return players.players.length === places;
};

export const ScoresTab = ({
  tournament,
  competition,
  kind,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  const [adding, setAdding] = useState(false);
  // Why Add Score did not open the dialog, said until OK is pressed.
  const [unfilled, setUnfilled] = useState(false);
  // The game Edit was pressed on, which the dialog corrects.
  const [correcting, setCorrecting] = useState<Listed | undefined>();
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
        {/* Every game in use, first, as Edit is on every list in the admin:
            its scores can always be corrected, and its players where it could
            be archived, which the dialog is told. An archived game is
            restored before it is corrected. */}
        {game.archived ? null : (
          <button
            type="button"
            className="button"
            data-action="edit"
            onClick={() => {
              setCorrecting(game);
            }}
          >
            {say("admin.scores.edit")}
          </button>
        )}
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
        ) : inUse.some(({ archivable }) => archivable) ? (
          // Its room, where other games offer Archive, so that what is beside
          // it lines up with theirs (optionFace.tsx).
          noOption("archive", say("admin.scores.archive"))
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
            if (kind !== "knockout") {
              setAdding(true);
              return;
            }
            setActing(true);
            void drawFilled(tournament, competition).then((filled) => {
              setActing(false);
              if (filled) setAdding(true);
              else setUnfilled(true);
            });
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
      {unfilled ? (
        // The knockout's own words for refusing a game, since this is that
        // refusal said before anything is typed that it would throw away.
        <ModalDialog
          title={say("admin.scores.drawNotFilledTitle")}
          action={say("admin.modal.ok")}
          act={() => {
            setUnfilled(false);
          }}
          cancel={() => {
            setUnfilled(false);
          }}
          alone
        >
          <p>{say("Competition.DrawNotFilled")}</p>
        </ModalDialog>
      ) : null}
      {adding || correcting !== undefined ? (
        <ScoreDialog
          tournament={tournament}
          competition={competition}
          correcting={correcting}
          kept={askAgain}
          close={() => {
            setAdding(false);
            setCorrecting(undefined);
          }}
        />
      ) : null}
    </section>
  );
};
