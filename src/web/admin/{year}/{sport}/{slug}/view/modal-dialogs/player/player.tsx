import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { NameChoice } from "../../../../../../NameChoice.js";
import { knows, say } from "../../../../../../words.js";
import { Mark, Offers, useMatching } from "../../../WorldRankingPlayers.js";
import { idInAddress } from "../../../../../../api.js";
import { DialogStatus } from "../../../../../../DialogStatus.js";

// The player dialog (player.feature), over a tournament's page: opened by Add
// Player to add players one after another, and by a player's name to change
// them. Adding and changing are the one dialog, so that the two cannot come to
// ask different things. Adding keeps it open, says who was added and empties
// it for the next; saving closes it.
//
// In a tournament of a sport with world rankings it asks for the player's
// world ranking name as well. While a player is added it follows the name as
// it is typed, as long as it is empty or still says what the name said, so
// that a reader who types in it has a name of their own there; while one is
// changed it follows nothing, since the rankings still know a player by it
// when their name is corrected. Left empty, it is sent as the name. Both
// offer the world ranking players as they are typed, and the world ranking
// name is marked as known to the rankings or not (WorldRankingPlayers.tsx).
//
// Opened by a world ranking officer who does not manage the tournament, it
// shows everything the player is, but only the world ranking name can be
// changed, and Save changes that alone.

/** A flag as the API offers it: its code, its name as the reader reads it. */
interface Flag {
  readonly code: string;
  readonly name: string;
}

/** A player as they are, when one is being changed. */
export interface PlayerAsTheyAre {
  readonly id: string;
  readonly name: string;
  readonly representing: string | undefined;
  readonly handicap: string | undefined;
  readonly flag: { readonly code: string } | undefined;
  readonly worldRankingName: string | undefined;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Nothing when adding, and the player when changing one. */
  readonly player?: PlayerAsTheyAre | undefined;
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

// What a name that makes a player a bye is refused with.
const BYE = "TournamentPlayer.NamedBye";

// The field each refusal is about. One about no one field is said above them.
type FieldName = "name" | "handicap" | "flag" | "worldRankingName";

const fieldOf = (code: string): FieldName | undefined =>
  code.startsWith("PersonName.") ||
  code === "TournamentPlayer.NoLetterOrDigit" ||
  code === "Tournament.PlayerNameTaken"
    ? "name"
    : code === "TournamentPlayer.HandicapMalformed"
      ? "handicap"
      : code === "TournamentPlayer.NoSuchFlag"
        ? "flag"
        : code.startsWith("WorldRankingName.")
          ? "worldRankingName"
          : undefined;

export const PlayerDialog = ({
  tournament,
  player,
  worldRankingSport,
  onlyWorldRankingName = false,
  kept,
  close,
}: Props): React.JSX.Element => {
  const asksWorldRankingName = worldRankingSport !== undefined;
  const [flags, setFlags] = useState<readonly Flag[]>([]);
  const [name, setName] = useState(player?.name ?? "");
  const [handicap, setHandicap] = useState(player?.handicap ?? "");
  const [representing, setRepresenting] = useState(player?.representing ?? "");
  const [flag, setFlag] = useState(player?.flag?.code ?? "");
  const [worldRankingName, setWorldRankingName] = useState(
    player?.worldRankingName ?? "",
  );
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // Who was last added, said until the next name is typed.
  const [added, setAdded] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  // Whether the reader is being told why a player is never a bye.
  const [explaining, setExplaining] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const worldRankingNameField = useRef<HTMLInputElement>(null);
  const at = `/api/site/tournaments/${idInAddress(tournament)}/players`;
  // Nothing is offered for a name that cannot be changed, as a world ranking
  // officer's cannot, so nothing is asked for it.
  const offeredForName = useMatching(
    onlyWorldRankingName ? undefined : worldRankingSport,
    name,
  );
  const offeredForWorldRankingName = useMatching(
    worldRankingSport,
    worldRankingName,
  );
  // What will be kept as the world ranking name, which is what is marked.
  const markedFor = useMatching(
    worldRankingSport,
    worldRankingName.trim() === "" ? name : worldRankingName,
  );

  useEffect(() => {
    void fetch("/api/site/flags", { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok ? ((await response.json()) as { flags: Flag[] }).flags : [],
      )
      .catch(() => [])
      .then(setFlags);
  }, []);

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.player.otherwise"),
  });
  // Back in the name, with what was typed still typed, to put it right. After
  // the dialog about byes has given the focus back to what opened it.
  const explained = (): void => {
    setExplaining(false);
    setTimeout(() => nameField.current?.focus());
  };

  const refusedFor = (field: FieldName | undefined): Refusal[] =>
    refused.filter(({ code }) => fieldOf(code) === field);

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
                  handicap,
                  representing,
                  flag,
                  // Asked for only where the sport has world rankings. Elsewhere
                  // a player is known by their name, so a corrected name is
                  // their new world ranking name too; but one the import gave
                  // them that is not their name is kept, as none was asked of
                  // the reader to change it.
                  worldRankingName: asksWorldRankingName
                    ? worldRankingNameSent
                    : player?.worldRankingName === undefined ||
                        player.worldRankingName === player.name
                      ? name
                      : player.worldRankingName,
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
        setHandicap("");
        setRepresenting("");
        setFlag("");
        setWorldRankingName("");
        nameField.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string }[];
        };
        setAdded(undefined);
        // Told in a dialog of its own rather than beneath the name: what a
        // bye is, and where they are found, is more than a line can say.
        if (answer.broken?.some(({ code }) => code === BYE)) {
          setRefused([]);
          setExplaining(true);
        } else {
          setRefused(
            answer.broken?.map(({ code }) => refusal(code)) ?? [
              refusal(answer.error ?? "Unknown"),
            ],
          );
        }
      }
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  // The reader is taken to the first field refused, as every refused form
  // takes them.
  useEffect(() => {
    if (refused.some(({ code }) => fieldOf(code) === "name")) {
      nameField.current?.focus();
    } else if (
      refused.some(({ code }) => fieldOf(code) === "worldRankingName")
    ) {
      worldRankingNameField.current?.focus();
    }
  }, [refused]);

  const above = refusedFor(undefined);

  return (
    <>
      <ModalDialog
        title={say(
          player === undefined
            ? "admin.player.addTitle"
            : "admin.player.editTitle",
        )}
        action={say(
          player === undefined ? "admin.player.add" : "admin.player.save",
        )}
        hover={
          player === undefined
            ? say("admin.hover.dialog.player.add")
            : say("admin.hover.dialog.player.save")
        }
        act={() => void send()}
        cancel={close}
        busy={sending}
      >
        <DialogStatus>
          {added === undefined
            ? null
            : say("admin.player.added", { name: added })}
        </DialogStatus>
        {above.length > 0 ? (
          <div className="dialog-problems">
            {above.map(({ code, words }) => (
              <p key={code}>{words}</p>
            ))}
          </div>
        ) : null}
        <Field
          name="name"
          label={say("admin.player.name")}
          refused={refusedFor("name")}
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
                  // Followed while a player is added, until it says something
                  // of its own.
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
        <Field
          name="representing"
          label={say("admin.player.representing")}
          refused={undefined}
        >
          {(tied) => (
            <input
              {...tied}
              type="text"
              placeholder=" "
              autoComplete="off"
              disabled={onlyWorldRankingName}
              value={representing}
              onChange={(event) => {
                setRepresenting(event.target.value);
              }}
            />
          )}
        </Field>
        <Field
          name="flag"
          label={say("admin.player.flag")}
          refused={refusedFor("flag")}
          lifted
        >
          {(tied) => (
            // None is the box left empty, since most players fly none; what
            // names none of the flags is not left.
            <NameChoice
              {...tied}
              disabled={onlyWorldRankingName}
              mustChoose={say("TournamentPlayer.NoSuchFlag")}
              choices={flags}
              value={flag}
              onChange={setFlag}
            />
          )}
        </Field>
        {/* Before the world ranking name, as the issue asked for. */}
        <Field
          name="handicap"
          label={say("admin.player.handicap")}
          refused={refusedFor("handicap")}
        >
          {(tied) => (
            <input
              {...tied}
              type="text"
              placeholder=" "
              autoComplete="off"
              disabled={onlyWorldRankingName}
              value={handicap}
              onChange={(event) => {
                setHandicap(event.target.value);
              }}
            />
          )}
        </Field>
        {asksWorldRankingName ? (
          <Field
            name="worldRankingName"
            label={say("admin.player.worldRankingName")}
            refused={refusedFor("worldRankingName")}
            mark={
              markedFor === undefined ? undefined : (
                <Mark matching={markedFor} />
              )
            }
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
      {explaining ? (
        <ModalDialog
          title={say("admin.player.byesTitle")}
          action={say("admin.modal.ok")}
          hover={say("admin.hover.modal.ok")}
          act={explained}
          cancel={explained}
          alone
        >
          <p className="dialog-byes">{say("admin.player.byes")}</p>
        </ModalDialog>
      ) : null}
    </>
  );
};
