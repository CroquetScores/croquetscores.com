import { useEffect, useState } from "react";

import { say } from "../../../../../../words.js";
import {
  PlayerDialog,
  type PlayerAsTheyAre,
} from "../../modal-dialogs/player/player.js";
import "../listed.css";

// The Players tab (players-tab.feature): the players in use in order of their
// names, each with what they represent and the flag they fly, and after them
// the archived ones, struck through. Add Player and a player's name open the
// player dialog. A player who has played is not offered Archive, since the
// games would then be against somebody who is no longer there. Whatever is
// pressed, and whenever the dialog keeps a player, the list is asked for
// again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
}

/** A player as the API lists them, their flag as it is seen. */
interface Listed extends PlayerAsTheyAre {
  readonly flag:
    | { readonly code: string; readonly name: string; readonly image: string }
    | undefined;
  readonly archived: boolean;
  readonly hasPlayed: boolean;
}

// The part of an id after its kind, which is how the API names a tournament
// or a player, so that each is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

export const PlayersTab = ({ tournament }: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  // Counted up to ask again, once something has been pressed or kept.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  // Which dialog is open: to add, or to change a player, or none.
  const [dialog, setDialog] = useState<"adding" | Listed | undefined>();
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/players`;

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

  // Neither asks first: each is undone by the other, and nothing is lost.
  const act = async (
    player: Listed,
    action: "archive" | "restore",
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

  const row = (player: Listed): React.JSX.Element => (
    <li
      key={player.id}
      className="listed-item"
      data-archived={player.archived ? "" : undefined}
    >
      <span className="listed-who">
        {/* Beside the name, named for a reader who cannot see it by the place
            it is the flag of. */}
        {player.flag === undefined ? null : (
          <img
            className="listed-flag"
            src={player.flag.image}
            alt={player.flag.name}
            data-flag={player.flag.code}
          />
        )}
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
      </span>
      {player.archived ? (
        <span className="visually-hidden">
          {say("admin.players.archivedSaid")}
        </span>
      ) : null}
      <span className="listed-about">{player.representing ?? ""}</span>
      <span className="listed-options">
        {player.archived ? (
          <button
            type="button"
            className="button"
            onClick={() => void act(player, "restore")}
          >
            {say("admin.players.restore")}
          </button>
        ) : player.hasPlayed ? null : (
          <button
            type="button"
            className="button"
            onClick={() => void act(player, "archive")}
          >
            {say("admin.players.archive")}
          </button>
        )}
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
        <PlayerDialog
          tournament={tournament}
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
