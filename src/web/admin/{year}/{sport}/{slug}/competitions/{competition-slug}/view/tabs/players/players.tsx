import { useEffect, useState } from "react";

import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../../../words.js";
import { noOption, optionFace } from "../../../../../view/tabs/optionFace.js";
import "../../../../../view/tabs/listed.css";

// A competition's Players tab (competition-players-tab.feature): a drop-down
// of the tournament's players not in the competition, with Add Player, above
// the players playing in the competition's order, each offering Up, Down,
// Remove and Withdraw, and after them the withdrawn, offering Unwithdraw.
// Remove and Withdraw ask first. A player Add Player cannot enter is said
// beneath the drop-down, by the refusal's code, until another is chosen. A
// knockout offers Bye first, however many are added, and a bye is listed as
// Bye, offering Up, Down and Remove. Once a knockout has a game its draw is
// fixed, so nobody is added, moved or removed. Whatever is done, the list is
// asked for again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  readonly kind: "block" | "knockout" | "swiss";
}

/** A flag as the API says it is seen. */
interface Seen {
  readonly code: string;
  readonly name: string;
  readonly image: string;
}

/** A competition's player as the API lists them. */
interface Listed {
  readonly id: string;
  readonly name: string;
  readonly representing: string | undefined;
  readonly flag: Seen | undefined;
  readonly tournamentPlayer: string;
  readonly withdrawn: boolean;
  readonly hasPlayed: boolean;
  /** Whether this is a knockout's bye, which is nobody. */
  readonly bye: boolean;
  /** Where they come in the competition, which is what names a bye. */
  readonly order: number;
}

/** One of the tournament's players, as the tournament lists them. */
interface OfTheTournament {
  readonly id: string;
  readonly name: string;
  readonly archived: boolean;
}

type Action = "up" | "down" | "withdraw" | "unwithdraw" | "remove";

// The tournament player a bye is entered as: every digit 0.
const BYE = "tournament-player/00000000-0000-0000-0000-000000000000";

// The part of an id after its kind, which is how the API names a thing, so
// that each is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

const asked = async <T,>(at: string, field: string): Promise<T[] | undefined> =>
  fetch(at, { headers: { accept: "application/json" } })
    .then(async (response) =>
      response.ok
        ? ((await response.json()) as Record<string, T[]>)[field]
        : undefined,
    )
    .catch(() => undefined);

export const CompetitionPlayersTab = ({
  tournament,
  competition,
  kind,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  const [offered, setOffered] = useState<readonly OfTheTournament[]>([]);
  const [played, setPlayed] = useState(false);
  const [chosen, setChosen] = useState("");
  // Counted up to ask again, once something has been done.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  // Why the player chosen was not entered, in the reader's language, until
  // another is chosen: it was about that one.
  const [refused, setRefused] = useState<
    readonly { readonly code: string; readonly words: string }[]
  >([]);
  // The player a manager is asked about before they are removed or withdrawn.
  const [confirming, setConfirming] = useState<
    | { readonly player: Listed; readonly action: "remove" | "withdraw" }
    | undefined
  >();
  const ofTournament = `/api/v1/tournaments/${idInAddress(tournament)}`;
  const at = `${ofTournament}/competitions/${idInAddress(competition)}`;

  useEffect(() => {
    let current = true;
    void Promise.all([
      asked<Listed>(`${at}/players`, "players"),
      asked<OfTheTournament>(`${ofTournament}/players`, "players"),
      // Only a knockout's draw is fixed by its games.
      kind === "knockout"
        ? asked<unknown>(`${at}/games`, "games")
        : Promise.resolve([]),
    ]).then(([players, ofTheTournament, games]) => {
      if (!current) return;
      setListed(players);
      setOffered(
        (ofTheTournament ?? []).filter(
          (player) =>
            !player.archived &&
            !(players ?? []).some(
              ({ tournamentPlayer }) => tournamentPlayer === player.id,
            ),
        ),
      );
      setPlayed((games ?? []).length > 0);
      setChosen("");
      setAnswered(asking);
    });
    return () => {
      current = false;
    };
  }, [at, ofTournament, kind, asking]);

  const done = async (sending: () => Promise<unknown>): Promise<void> => {
    setActing(true);
    // Asked again whether or not it was done, since the list is to say who
    // the players are now.
    try {
      await sending();
    } catch {
      // A request that never arrived is said by the list asked for again.
    } finally {
      setAsking((count) => count + 1);
      setActing(false);
    }
  };

  // Every bye has the same id, so a bye is named by its order as well.
  const act = (player: Listed, action: Action): Promise<void> =>
    done(() =>
      fetch(
        `${at}/players/${idInAddress(player.id)}/${action}${
          player.bye ? `?order=${String(player.order)}` : ""
        }`,
        { method: "POST" },
      ),
    );

  const nameOf = (player: Listed): string =>
    player.bye ? say("admin.competitionPlayers.bye") : player.name;

  // A refusal by its code, in its own words or in the words for any.
  const refusal = (code: string) => ({
    code,
    words: say(knows(code) ? code : "admin.competitionPlayers.otherwise"),
  });

  const add = (): Promise<void> =>
    done(async () => {
      const response = await fetch(`${at}/players`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ player: idInAddress(chosen) }),
      });
      if (response.ok) {
        setRefused([]);
        return;
      }
      const answer = (await response.json().catch(() => ({}))) as {
        error?: string;
        broken?: { code: string }[];
      };
      setRefused(
        answer.broken?.map(({ code }) => refusal(code)) ?? [
          refusal(answer.error ?? "Unknown"),
        ],
      );
    });

  // A knockout's players are its draw, fixed once it has a game.
  const fixed = kind === "knockout" && played;
  const playing = listed?.filter(({ withdrawn }) => !withdrawn) ?? [];
  const withdrawn = listed?.filter((player) => player.withdrawn) ?? [];

  const button = (player: Listed, action: Action): React.JSX.Element => (
    <button
      key={action}
      type="button"
      className="button"
      data-action={action}
      onClick={() => {
        if (action === "remove" || action === "withdraw") {
          setConfirming({ player, action });
        } else {
          void act(player, action);
        }
      }}
      {...optionFace(action, say(`admin.competitionPlayers.${action}`))}
    />
  );

  // A button where `offered`, and its room where not, so that what comes after
  // it lines up with the rows that do offer it (optionFace.tsx).
  const buttonOrRoom = (
    offered: boolean,
    player: Listed,
    action: Action,
  ): React.JSX.Element =>
    offered
      ? button(player, action)
      : noOption(action, say(`admin.competitionPlayers.${action}`));
  // Room is kept only for what some row offers: a gap no row fills would be
  // space and nothing else. A fixed draw removes and moves nobody, a lone
  // player moves nowhere, and a list of byes withdraws nobody.
  const removable = (player: Listed): boolean => !fixed && !player.hasPlayed;
  const anyRemove = playing.some(removable);
  const anyWithdraw = playing.some(({ bye }) => !bye);
  const anyMove = !fixed && playing.length > 1;

  const row = (player: Listed, options: React.JSX.Element[]) => (
    <li
      // A bye's id is every bye's, so its order tells it apart.
      key={`${player.id}@${String(player.order)}`}
      className="listed-item"
      data-withdrawn={player.withdrawn ? "" : undefined}
      data-bye={player.bye ? "" : undefined}
    >
      <span className="listed-who">
        <span className="listed-name">{nameOf(player)}</span>
        <span className="listed-about">{player.representing ?? ""}</span>
        {player.flag === undefined ? null : (
          <img
            className="listed-flag"
            src={player.flag.image}
            alt={player.flag.name}
            data-flag={player.flag.code}
          />
        )}
      </span>
      <span className="listed-options">{options}</span>
    </li>
  );

  return (
    <section
      className="stack competition-players-tab"
      aria-busy={acting || answered !== asking}
    >
      {listed === undefined || fixed ? null : offered.length > 0 ||
        kind === "knockout" ? (
        // Above the list rather than beneath it, where a long one would push
        // it off a phone's screen.
        <p className="listed-adding">
          <select
            className="listed-choice"
            aria-label={say("admin.competitionPlayers.choose")}
            // Tied to what is said beneath it, so that a screen reader reads
            // why with the drop-down rather than leaving it to be found.
            {...(refused.length > 0
              ? {
                  "aria-describedby": "competition-players-refused",
                  "aria-invalid": true,
                }
              : {})}
            value={chosen}
            onChange={(event) => {
              setChosen(event.target.value);
              setRefused([]);
            }}
          >
            <option value="">{say("admin.competitionPlayers.nobody")}</option>
            {/* First, since a knockout's draw is filled with them, and as
                often as it is wanted. */}
            {kind === "knockout" ? (
              <option value={BYE}>{say("admin.competitionPlayers.bye")}</option>
            ) : null}
            {offered.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="button"
            onClick={() => {
              if (chosen !== "") void add();
            }}
          >
            {say("admin.competitionPlayers.add")}
          </button>
        </p>
      ) : (
        <p className="listed-all">{say("admin.competitionPlayers.all")}</p>
      )}
      {/* Beneath the drop-down it is about, and gone once another is chosen. */}
      {refused.length > 0 && listed !== undefined && !fixed ? (
        <p
          className="field-message"
          id="competition-players-refused"
          data-refused={refused.map(({ code }) => code).join(" ")}
        >
          {refused.map(({ code, words }) => (
            <span key={code}>{words}</span>
          ))}
        </p>
      ) : null}
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.competitionPlayers.none")}</p>
      ) : (
        <>
          {playing.length > 0 ? (
            <ul className="listed" data-listed="playing">
              {playing.map((player, place) =>
                row(player, [
                  ...(anyRemove
                    ? [buttonOrRoom(removable(player), player, "remove")]
                    : []),
                  // A bye plays nothing to withdraw from.
                  ...(anyWithdraw
                    ? [buttonOrRoom(!player.bye, player, "withdraw")]
                    : []),
                  // Last, where they are in the same place on every row.
                  // Nowhere to go is nothing to press.
                  ...(anyMove
                    ? [
                        buttonOrRoom(place > 0, player, "up"),
                        buttonOrRoom(
                          place < playing.length - 1,
                          player,
                          "down",
                        ),
                      ]
                    : []),
                ]),
              )}
            </ul>
          ) : null}
          {withdrawn.length > 0 ? (
            <>
              <h2 className="listed-archived-heading">
                {say("admin.competitionPlayers.withdrawn")}
              </h2>
              <ul className="listed" data-listed="withdrawn">
                {withdrawn.map((player) =>
                  row(player, [button(player, "unwithdraw")]),
                )}
              </ul>
            </>
          ) : null}
        </>
      )}
      {confirming === undefined ? null : (
        <ModalDialog
          title={say(`admin.competitionPlayers.${confirming.action}Title`)}
          action={say(`admin.competitionPlayers.${confirming.action}`)}
          act={() => {
            const { player, action } = confirming;
            setConfirming(undefined);
            void act(player, action);
          }}
          cancel={() => {
            setConfirming(undefined);
          }}
        >
          <p>
            {say(`admin.competitionPlayers.${confirming.action}Question`, {
              name: nameOf(confirming.player),
            })}
          </p>
        </ModalDialog>
      )}
    </section>
  );
};
