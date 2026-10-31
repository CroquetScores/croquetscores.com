import { useState } from "react";

import { ModalDialog } from "../../../../../../ModalDialog.js";
import { say } from "../../../../../../words.js";
import { aboutPlayer } from "../../../../../../aboutPlayer.js";
import { PlayersDialog } from "../../modal-dialogs/players/players.js";
import {
  PlayerDialog,
  type PlayerAsTheyAre,
} from "../../modal-dialogs/player/player.js";
import { noOption, optionFace } from "../../../../../../optionFace.js";
import { idInAddress } from "../../../../../../api.js";
import "../../../../../../listed.css";
import { useListed } from "../../../../../../useListed.js";

// The Players tab (players-tab.feature): the players in use in the
// tournament's order, each with what they represent and the flag they fly,
// offering Edit, Archive, Up and Down, and after them the archived ones, struck
// through. Add Players opens the dialog to add a list of them at once
// (players.feature). Add Player, a player's name and Edit open the player dialog. A player who
// has played is not offered Archive, since the games would then be against
// somebody who is no longer there, and archiving one who is in competitions
// asks first, since it removes them from each. Whatever is pressed, and
// whenever the dialog keeps a player, the list is asked for again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
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

/** A player as the API lists them, their flag as it is seen. */
interface Listed extends PlayerAsTheyAre {
  readonly flag:
    | { readonly code: string; readonly name: string; readonly image: string }
    | undefined;
  readonly archived: boolean;
  readonly hasPlayed: boolean;
  /** The names of the competitions they are in, in the tournament's order. */
  readonly competitions: readonly string[];
}

export const PlayersTab = ({
  tournament,
  worldRankingSport,
  manages,
}: Props): React.JSX.Element => {
  const [acting, setActing] = useState(false);
  // Which dialog is open: to add, or to change a player, or none.
  const [dialog, setDialog] = useState<
    "adding" | "addingMany" | Listed | undefined
  >();
  // The player a manager is asked about before they are archived.
  const [archiving, setArchiving] = useState<Listed | undefined>();
  const at = `/api/site/tournaments/${idInAddress(tournament)}/players`;

  const { listed, asking, answered, askAgain } = useListed<Listed>(
    at,
    "players",
  );

  // None asks first: each is undone by pressing the other way, and nothing is
  // lost, but for archiving one who is in competitions, which asks.
  const act = async (
    player: Listed,
    action: "up" | "down" | "archive" | "restore",
  ): Promise<void> => {
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
    action: "edit" | "up" | "down" | "archive" | "restore",
  ): React.JSX.Element => (
    <button
      key={action}
      type="button"
      className="button"
      data-action={action}
      onClick={() => {
        // What the name does, said in a button for a reader who does not
        // think to press a name.
        if (action === "edit") {
          setDialog(player);
        } else if (action === "archive" && player.competitions.length > 0) {
          setArchiving(player);
        } else {
          void act(player, action);
        }
      }}
      {...optionFace(
        action,
        say(`admin.players.${action}`),
        say(`admin.hover.players.${action}`),
      )}
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
  // Room is kept only for what some row offers: a gap no row fills would be
  // space and nothing else. A lone player moves nowhere, and a list where
  // everybody has played archives nobody.
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
            title={say("admin.hover.players.edit")}
            onClick={() => {
              setDialog(player);
            }}
          >
            {player.name}
          </button>
        )}
        <span className="listed-about">{aboutPlayer(player)}</span>
        {/* After the name and what they represent, named for a reader who
            cannot see it by the place it is the flag of. */}
        {player.flag === undefined ? null : (
          <img
            className="listed-flag"
            src={player.flag.image}
            alt={player.flag.name}
            data-flag={player.flag.code}
          />
        )}
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
              // Before Archive, as a competition's Edit is, so that changing
              // a player is offered ahead of setting them aside.
              button(player, "edit"),
              ...(anyArchive
                ? [buttonOrRoom(!player.hasPlayed, player, "archive")]
                : []),
              // Last, where they are in the same place on every row. Nowhere
              // to go is nothing to press.
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
      className="stack players-tab"
      aria-busy={acting || answered !== asking}
    >
      {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
      {manages ? (
        <p>
          <button
            type="button"
            className="button"
            title={say("admin.hover.players.add")}
            onClick={() => {
              setDialog("adding");
            }}
          >
            {say("admin.players.add")}
          </button>{" "}
          {/* Beside Add Player, for a manager with a list of them. */}
          <button
            type="button"
            className="button"
            title={say("admin.hover.players.addMany")}
            onClick={() => {
              setDialog("addingMany");
            }}
          >
            {say("admin.players.addMany")}
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
      {archiving === undefined ? null : (
        <ModalDialog
          title={say("admin.players.archiveTitle")}
          action={say("admin.players.archive")}
          hover={say("admin.hover.players.archive")}
          act={() => {
            const player = archiving;
            setArchiving(undefined);
            void act(player, "archive");
          }}
          cancel={() => {
            setArchiving(undefined);
          }}
        >
          <p>
            {say("admin.players.archiveQuestion", { name: archiving.name })}
          </p>
          {/* Their managers' names for them, and nobody's language. */}
          <ul data-names="">
            {archiving.competitions.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p>{say("admin.players.archive.explanation")}</p>
        </ModalDialog>
      )}
      {dialog === "addingMany" ? (
        <PlayersDialog
          tournament={tournament}
          kept={askAgain}
          close={() => {
            setDialog(undefined);
          }}
        />
      ) : dialog === undefined ? null : (
        <PlayerDialog
          tournament={tournament}
          worldRankingSport={worldRankingSport}
          onlyWorldRankingName={!manages}
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
