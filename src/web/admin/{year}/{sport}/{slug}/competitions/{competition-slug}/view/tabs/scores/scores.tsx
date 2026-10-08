import { useEffect, useState } from "react";

import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../../../words.js";
import { noOption, optionFace } from "../../../../../../../../optionFace.js";
import { ScoreDialog } from "../../modal-dialogs/score/score.js";
import { idInAddress, refusalOf } from "../../../../../../../../api.js";
import "../../../../../../../../listed.css";
import "./scores.css";

// A competition's Scores tab (scores-tab.feature): Add Score above the games
// in use, in the order they were entered, each saying the winner and their
// score, then the loser and theirs, and offering Edit, and Archive where it
// can be archived; after them the archived, struck through, offering Restore.
// Whatever is pressed, and whenever the dialog adds or corrects a game, the
// list is asked for again. In a knockout whose draw is not filled, Add Score
// says why scores cannot be added rather than opening the dialog.
//
// A test's page lists its scores here too, set out by team rather than by who
// won (view.feature beneath the test): a table headed by the first team's
// short name, "v" and the second's, each score a row with the first team's
// player, both scores the first team's player's first, then the second team's
// player, and Up and Down after what else it offers, to list them as they
// were played.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  /**
   * A knockout's draw has to be filled before any game can be added, and a
   * test's players are its teams'.
   */
  readonly kind: "block" | "knockout" | "swiss" | "test";
  /** A test's two teams, which its scores are set out by. */
  readonly teams?: readonly [TeamSide, TeamSide] | undefined;
}

/** One of a test's teams, as its scores are set out by. */
export interface TeamSide {
  readonly id: string;
  readonly shortName: string;
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
  readonly withdrawn: boolean;
  readonly withdrawable: boolean;
  /** In a test, the team each player plays for, by its id. */
  readonly winnerTeam?: string;
  readonly loserTeam?: string;
}

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
  teams,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  const [adding, setAdding] = useState(false);
  // Why Add Score did not open the dialog, said until OK is pressed.
  const [unfilled, setUnfilled] = useState(false);
  // What was refused of what was last pressed, by its code: a game whose
  // player has been archived since is not restored until they are.
  const [refused, setRefused] = useState<string | undefined>();
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

  // None asks first: each is undone by another, and nothing is lost.
  const act = async (
    game: Listed,
    action: "archive" | "restore" | "withdraw" | "unwithdraw" | "up" | "down",
  ): Promise<void> => {
    setActing(true);
    setRefused(undefined);
    try {
      const response = await fetch(`${at}/${idInAddress(game.id)}/${action}`, {
        method: "POST",
      });
      if (!response.ok) {
        setRefused(await refusalOf(response));
      }
    } catch {
      setRefused("Unknown");
    } finally {
      askAgain();
      setActing(false);
    }
  };

  const inUse = listed?.filter(({ archived }) => !archived) ?? [];
  const archived = listed?.filter((game) => game.archived) ?? [];

  const archivedSaid = (game: Listed): React.JSX.Element | null =>
    game.archived ? (
      <span className="visually-hidden">
        {say("admin.scores.archivedSaid")}
      </span>
    ) : null;

  // Said in words as well, since a line through a score is not read out.
  const withdrawnSaid = (game: Listed): React.JSX.Element | null =>
    game.withdrawn ? (
      <span className="visually-hidden" data-said="withdrawn">
        {say("admin.scores.withdrawnSaid")}
      </span>
    ) : null;

  const row = (game: Listed): React.JSX.Element => (
    <li
      key={game.id}
      className="listed-item"
      data-archived={game.archived ? "" : undefined}
      data-withdrawn={game.withdrawn ? "" : undefined}
    >
      <span className="listed-score">
        <span className="score-winner">{game.winner}</span>{" "}
        <span className="score-winner-score">{game.winnerScore}</span>{" "}
        {say("admin.score.beat")}
        <br />
        <span className="score-loser">{game.loser}</span>{" "}
        <span className="score-loser-score">{game.loserScore}</span>
      </span>
      {archivedSaid(game)}
      {withdrawnSaid(game)}
      {options(game)}
    </li>
  );

  // A test's score from the first team's side, whoever won: the first team's
  // player, both scores theirs first, then the second team's player. Each part
  // keeps its winner's or loser's class, so that it is read as either is.
  const testRow = (game: Listed, first: TeamSide): React.JSX.Element => {
    const firstWon = game.winnerTeam === first.id;
    const [left, right] = firstWon
      ? (["winner", "loser"] as const)
      : (["loser", "winner"] as const);
    return (
      <tr
        key={game.id}
        className="listed-item"
        data-archived={game.archived ? "" : undefined}
      >
        <td className={`score-player score-${left}`}>{game[left]}</td>
        <td className="listed-score">
          <span className={`score-${left}-score`}>{game[`${left}Score`]}</span>
          {" - "}
          <span className={`score-${right}-score`}>
            {game[`${right}Score`]}
          </span>
        </td>
        <td className={`score-player score-${right}`}>{game[right]}</td>
        <td>
          {archivedSaid(game)}
          {options(game)}
        </td>
      </tr>
    );
  };

  const testTable = (
    games: readonly Listed[],
    listing: "in-use" | "archived",
    [first, second]: readonly [TeamSide, TeamSide],
  ): React.JSX.Element => (
    // Within a box of its own, which scrolls across where the table is wider
    // than the screen, since nothing in it wraps.
    <div className="test-scores-box">
      <table className="test-scores">
        <thead>
          <tr>
            <th scope="col" className="test-team">
              {first.shortName}
            </th>
            <th scope="col">{say("admin.test.versus")}</th>
            <th scope="col" className="test-team">
              {second.shortName}
            </th>
            {/* What each score offers, which needs no heading to be read. */}
            <td />
          </tr>
        </thead>
        <tbody data-listed={listing}>
          {games.map((game) => testRow(game, first))}
        </tbody>
      </table>
    </div>
  );

  const options = (game: Listed): React.JSX.Element => (
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
      {/* A block's or a Swiss's score, after Archive, as the Players tab
            offers Withdraw: one played but not to count, which a withdrawn
            score is offered back from. Only a block or a Swiss answers either,
            so every score in use there offers one of the two. */}
      {game.archived ? null : game.withdrawn ? (
        <button
          type="button"
          className="button"
          onClick={() => void act(game, "unwithdraw")}
        >
          {say("admin.scores.unwithdraw")}
        </button>
      ) : game.withdrawable ? (
        <button
          type="button"
          className="button"
          onClick={() => void act(game, "withdraw")}
        >
          {say("admin.scores.withdraw")}
        </button>
      ) : null}
      {/* A test's scores, last and drawn as arrows, as a list's Up and Down
          are, so that the scores can be listed as they were played. Nowhere
          to go is nothing to press, but its room is kept. */}
      {teams === undefined || game.archived || inUse.length < 2
        ? null
        : (["up", "down"] as const).map((direction) => {
            const place = inUse.indexOf(game);
            const offered =
              direction === "up" ? place > 0 : place < inUse.length - 1;
            const words = say(`admin.scores.${direction}`);
            return offered ? (
              <button
                key={direction}
                type="button"
                className="button"
                data-action={direction}
                onClick={() => void act(game, direction)}
                {...optionFace(direction, words)}
              />
            ) : (
              noOption(direction, words)
            );
          })}
    </span>
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
      {refused === undefined ? null : (
        <p className="listed-refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.scores.otherwise")}
        </p>
      )}
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.scores.none")}</p>
      ) : (
        <>
          {inUse.length > 0 ? (
            teams === undefined ? (
              <ul className="listed" data-listed="in-use">
                {inUse.map(row)}
              </ul>
            ) : (
              testTable(inUse, "in-use", teams)
            )
          ) : null}
          {archived.length > 0 ? (
            <>
              <h2 className="listed-archived-heading">
                {say("admin.scores.archived")}
              </h2>
              {teams === undefined ? (
                <ul className="listed" data-listed="archived">
                  {archived.map(row)}
                </ul>
              ) : (
                testTable(archived, "archived", teams)
              )}
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
          inATest={kind === "test"}
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
