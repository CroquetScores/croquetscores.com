import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../../../Field.js";
import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../../../words.js";
import {
  Mark,
  Offers,
  useMatching,
} from "../../../../../WorldRankingPlayers.js";

// The team player dialog (team-player.feature), over a team's page: the player
// dialog of a Standard tournament without its Representing and its Flag, since
// a player in a team represents their team and the team flies the flag. It
// asks for a name the same way, so that a manager who has used one has used
// the other: Add keeps it open and empties it for the next, Save closes it. A
// name as a bye is refused beneath the name as any other broken rule is, since
// a test has no byes to point the reader to. It asks for the world ranking
// name as the player dialog does, in a tournament of a sport with world
// rankings alone: following the name while a player is added, following
// nothing while one is changed, and sent as the name when left empty; and it
// offers the world ranking players and marks the world ranking name as that
// does (WorldRankingPlayers.tsx). Opened by a world ranking officer who does
// not manage the tournament, only the world ranking name can be changed, and
// Save changes that alone.

/** A player as they are, when one is being changed. */
export interface TeamPlayerAsTheyAre {
  readonly id: string;
  readonly name: string;
  readonly worldRankingName: string | undefined;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The team's id, which the player is added to and no other. */
  readonly team: string;
  /** Nothing when adding, and the player when changing one. */
  readonly player?: TeamPlayerAsTheyAre | undefined;
  /**
   * The tournament's sport, by its code, where it has world rankings, for
   * which it asks. Nothing where it has none.
   */
  readonly worldRankingSport: string | undefined;
  /** Whether only the world ranking name may be changed, as a world ranking officer's. */
  readonly onlyWorldRankingName?: boolean | undefined;
  /** Once a player is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

// The part of an id after its kind, which is how the API names a thing.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// Whether a refusal is about the name, or the world ranking name. One about
// neither is said above them.
const aboutTheName = (code: string): boolean =>
  code.startsWith("PersonName.") ||
  code === "Team.PlayerNameTaken" ||
  code === "TeamPlayer.NamedBye";

const aboutTheWorldRankingName = (code: string): boolean =>
  code.startsWith("WorldRankingName.");

export const TeamPlayerDialog = ({
  tournament,
  team,
  player,
  worldRankingSport,
  onlyWorldRankingName = false,
  kept,
  close,
}: Props): React.JSX.Element => {
  const asksWorldRankingName = worldRankingSport !== undefined;
  const [name, setName] = useState(player?.name ?? "");
  const [worldRankingName, setWorldRankingName] = useState(
    player?.worldRankingName ?? "",
  );
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // Who was last added, said until the next name is typed.
  const [added, setAdded] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const worldRankingNameField = useRef<HTMLInputElement>(null);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/teams/${idInAddress(team)}/players`;
  const offeredForName = useMatching(worldRankingSport, name);
  const offeredForWorldRankingName = useMatching(
    worldRankingSport,
    worldRankingName,
  );
  // What will be kept as the world ranking name, which is what is marked.
  const markedFor = useMatching(
    worldRankingSport,
    worldRankingName.trim() === "" ? name : worldRankingName,
  );

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.player.otherwise"),
  });

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const worldRankingNameSent =
        worldRankingName.trim() === "" ? name : worldRankingName;
      const response = await fetch(
        player === undefined
          ? at
          : `${at}/${idInAddress(player.id)}${onlyWorldRankingName ? "/world-ranking-name" : ""}`,
        {
          method: player === undefined ? "POST" : "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify(
            onlyWorldRankingName
              ? { worldRankingName: worldRankingNameSent }
              : {
                  name,
                  // Asked for only where the sport has world rankings;
                  // elsewhere a player keeps whatever they had, as none was
                  // asked of them.
                  worldRankingName: asksWorldRankingName
                    ? worldRankingNameSent
                    : (player?.worldRankingName ?? ""),
                },
          ),
        },
      );
      if (response.ok) {
        setRefused([]);
        kept();
        if (player !== undefined) {
          close();
          return;
        }
        // Emptied for the next, with the reader back in the name.
        setAdded(name.trim());
        setName("");
        setWorldRankingName("");
        nameField.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string }[];
        };
        setAdded(undefined);
        setRefused(
          answer.broken?.map(({ code }) => refusal(code)) ?? [
            refusal(answer.error ?? "Unknown"),
          ],
        );
      }
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  // The reader is taken to the name where it was refused, as every refused
  // form takes them.
  useEffect(() => {
    if (refused.some(({ code }) => aboutTheName(code))) {
      nameField.current?.focus();
    } else if (refused.some(({ code }) => aboutTheWorldRankingName(code))) {
      worldRankingNameField.current?.focus();
    }
  }, [refused]);

  const above = refused.filter(
    ({ code }) => !aboutTheName(code) && !aboutTheWorldRankingName(code),
  );

  return (
    <ModalDialog
      title={say(
        player === undefined
          ? "admin.player.addTitle"
          : "admin.player.editTitle",
      )}
      action={say(
        player === undefined ? "admin.player.add" : "admin.player.save",
      )}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      {/* Told to a screen reader as it changes, since nothing else on the
          dialog changes where the reader is. */}
      <p className="dialog-status" role="status">
        {added === undefined
          ? null
          : say("admin.player.added", { name: added })}
      </p>
      {above.length > 0 ? (
        <div
          className="dialog-problems"
          data-refused={above.map(({ code }) => code).join(" ")}
        >
          {above.map(({ code, words }) => (
            <p key={code}>{words}</p>
          ))}
        </div>
      ) : null}
      <Field
        name="name"
        label={say("admin.player.name")}
        refused={refused.filter(({ code }) => aboutTheName(code))}
      >
        {(tied) => (
          <>
            <input
              {...tied}
              ref={nameField}
              disabled={onlyWorldRankingName}
              type="text"
              placeholder=" "
              autoComplete="off"
              list={asksWorldRankingName ? "name-offers" : undefined}
              value={name}
              onChange={(event) => {
                // Followed while a player is added, until it says something of
                // its own.
                if (
                  player === undefined &&
                  (worldRankingName === "" || worldRankingName === name)
                ) {
                  setWorldRankingName(event.target.value);
                }
                setName(event.target.value);
                // Who was added is no longer the news once the next is typed.
                setAdded(undefined);
              }}
            />
            {asksWorldRankingName ? (
              <Offers id="name-offers" matching={offeredForName} />
            ) : null}
          </>
        )}
      </Field>
      {asksWorldRankingName ? (
        <Field
          name="worldRankingName"
          label={say("admin.player.worldRankingName")}
          refused={refused.filter(({ code }) => aboutTheWorldRankingName(code))}
          mark={<Mark matching={markedFor} />}
        >
          {(tied) => (
            <>
              <input
                {...tied}
                ref={worldRankingNameField}
                type="text"
                placeholder=" "
                autoComplete="off"
                list="worldRankingName-offers"
                value={worldRankingName}
                onChange={(event) => {
                  setWorldRankingName(event.target.value);
                }}
              />
              <Offers
                id="worldRankingName-offers"
                matching={offeredForWorldRankingName}
              />
            </>
          )}
        </Field>
      ) : null}
    </ModalDialog>
  );
};
