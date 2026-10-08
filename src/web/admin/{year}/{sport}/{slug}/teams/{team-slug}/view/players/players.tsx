import { useEffect, useState } from "react";

import { say } from "../../../../../../../words.js";
import { noOption, optionFace } from "../../../../../../../optionFace.js";
import {
  TeamPlayerDialog,
  type TeamPlayerAsTheyAre,
} from "../modal-dialogs/team-player/team-player.js";
import { idInAddress } from "../../../../../../../api.js";
import "../../../../../../../listed.css";

// A team's players (team-players.feature), which are its page: those in use in
// the team's order, each by their name alone, offering Edit, Archive, Up and
// Down, and after them the archived ones, struck through, offering Restore
// alone. It is listed as a Standard tournament's Players tab is, in the same
// words. A player who has played a game in use is not offered Archive. A
// player in a team is in no competition, so nothing asks first. Whatever is
// pressed, and whenever the dialog keeps a player, the list is asked for
// again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The team's id. */
  readonly team: string;
  /**
   * The tournament's sport, by its code, where it has world rankings, for
   * the dialog. Nothing where it has none.
   */
  readonly worldRankingSport: string | undefined;
  /**
   * Whether the reader manages the tournament. A world ranking officer who
   * does not is shown the players to change their world ranking names alone,
   * and offered nothing else.
   */
  readonly manages: boolean;
}

/** A player as the API lists a team's. */
interface Listed extends TeamPlayerAsTheyAre {
  readonly archived: boolean;
  readonly hasPlayed: boolean;
}

type Action = "up" | "down" | "archive" | "restore";

export const TeamPlayers = ({
  tournament,
  team,
  worldRankingSport,
  manages,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  // Counted up to ask again, once something has been pressed or kept.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  // Which dialog is open: to add, or to change a player, or none.
  const [dialog, setDialog] = useState<"adding" | Listed | undefined>();
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/teams/${idInAddress(team)}/players`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { players: Listed[] }).players
          : undefined,
      )
      .catch(() => undefined)
      .then((players) => {
        if (!current) return;
        setListed(players);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, asking]);

  const askAgain = (): void => {
    setAsking((count) => count + 1);
  };

  const act = async (player: Listed, action: Action): Promise<void> => {
    setActing(true);
    try {
      await fetch(`${at}/${idInAddress(player.id)}/${action}`, {
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
  const archived = listed?.filter((player) => player.archived) ?? [];

  const button = (
    player: Listed,
    action: Action | "edit",
  ): React.JSX.Element => (
    <button
      key={action}
      type="button"
      className="button"
      data-action={action}
      onClick={() => {
        if (action === "edit") setDialog(player);
        else void act(player, action);
      }}
      {...optionFace(action, say(`admin.players.${action}`))}
    />
  );

  // A button where `offered`, and its room where not, so that what comes after
  // it lines up with the rows that do offer it (optionFace.tsx).
  const buttonOrRoom = (
    offered: boolean,
    player: Listed,
    action: "up" | "down" | "archive",
  ): React.JSX.Element =>
    offered
      ? button(player, action)
      : noOption(action, say(`admin.players.${action}`));
  const anyArchive = manages && inUse.some(({ hasPlayed }) => !hasPlayed);
  const anyMove = manages && inUse.length > 1;

  const row = (player: Listed, place: number): React.JSX.Element => (
    <li
      key={player.id}
      className="listed-item"
      data-archived={player.archived ? "" : undefined}
    >
      <span className="listed-who">
        {/* An archived player can only be restored, so their name opens
            nothing. */}
        {player.archived ? (
          <span className="listed-name">{player.name}</span>
        ) : (
          <button
            type="button"
            className="listed-name"
            onClick={() => {
              setDialog(player);
            }}
          >
            {player.name}
          </button>
        )}
        {/* What a Standard tournament's player represents, which a player in
            a team never has: their team is who they represent. Kept empty,
            so that the list reads as the Players tab's does. */}
        <span className="listed-about" />
      </span>
      {player.archived ? (
        <span className="visually-hidden">
          {say("admin.players.archivedSaid")}
        </span>
      ) : null}
      <span className="listed-options">
        {player.archived
          ? manages
            ? button(player, "restore")
            : null
          : [
              button(player, "edit"),
              ...(anyArchive
                ? [buttonOrRoom(!player.hasPlayed, player, "archive")]
                : []),
              ...(anyMove
                ? [
                    buttonOrRoom(place > 0, player, "up"),
                    buttonOrRoom(place < inUse.length - 1, player, "down"),
                  ]
                : []),
            ]}
      </span>
    </li>
  );

  return (
    <section
      className="stack team-players"
      aria-busy={acting || answered !== asking}
    >
      {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
      {manages ? (
        <p>
          <button
            type="button"
            className="button"
            onClick={() => {
              setDialog("adding");
            }}
          >
            {say("admin.players.add")}
          </button>
        </p>
      ) : null}
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.players.none")}</p>
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
                {say("admin.players.archived")}
              </h2>
              <ul className="listed" data-listed="archived">
                {archived.map(row)}
              </ul>
            </>
          ) : null}
        </>
      )}
      {dialog === undefined ? null : (
        <TeamPlayerDialog
          tournament={tournament}
          worldRankingSport={worldRankingSport}
          onlyWorldRankingName={!manages}
          team={team}
          player={dialog === "adding" ? undefined : dialog}
          kept={askAgain}
          close={() => {
            setDialog(undefined);
          }}
        />
      )}
    </section>
  );
};
