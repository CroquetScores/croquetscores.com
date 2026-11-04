import { useEffect, useRef, useState } from "react";

import { DialogProblems } from "../../../../../../DialogProblems.js";
import { DialogStatus } from "../../../../../../DialogStatus.js";
import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { standardHelp } from "../../../../../../helpAddress.js";
import { knows, say } from "../../../../../../words.js";
import { idInAddress } from "../../../../../../api.js";

// The pair dialog (pair.feature), over a tournament's Players tab: a first
// player and a second player, each chosen from the tournament's players in use,
// the second from those but the first, and Add Pair makes a doubles pair of
// them. The pair's name is made by the site from the two names
// (pairName.feature), so it is not asked for here.
//
// Adding keeps it open, says which pair was added and empties both choices for
// the next, as adding a player does. Nothing is sent until both are chosen, as
// nothing is where no player is chosen to add on a competition's tab. What was
// chosen stays chosen when it is refused, so that it can be put right. A
// refusal about one of the two is said beneath it; one about the pair as a
// whole, such as a name the tournament already has, is said above them.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The players to choose from, in the tournament's order. */
  readonly players: readonly { readonly id: string; readonly name: string }[];
  /** Once the pair is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

type Place = "first" | "second";

// A refusal as the API says it: its code, and the player it is about.
interface Broken {
  readonly code: string;
  readonly fields?: readonly string[];
}

export const PairDialog = ({
  tournament,
  players,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [chosen, setChosen] = useState<Readonly<Record<Place, string>>>({
    first: "",
    second: "",
  });
  const [refused, setRefused] = useState<
    readonly (Refusal & { readonly place: Place | undefined })[]
  >([]);
  const [sending, setSending] = useState(false);
  // Which pair was last added, said until another player is chosen: the dialog
  // stays open for the next, as the player dialog does.
  const [added, setAdded] = useState<string | undefined>();
  const fields = useRef<Partial<Record<Place, HTMLSelectElement | null>>>({});

  const refusal = (code: string, place: Place | undefined) => ({
    code,
    place,
    words: say(knows(code) ? code : "admin.pair.otherwise"),
  });

  const send = async (): Promise<void> => {
    if (sending || chosen.first === "" || chosen.second === "") return;
    setSending(true);
    try {
      const response = await fetch(
        `/api/site/tournaments/${idInAddress(tournament)}/pairs`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            first: idInAddress(chosen.first),
            second: idInAddress(chosen.second),
          }),
        },
      );
      if (response.ok) {
        // The pair is made whether or not the answer can be read, and saying it
        // was refused would have the manager make it again: only what is said of
        // it is lost.
        const { name } = (await response.json().catch(() => ({}))) as {
          name?: string;
        };
        setRefused([]);
        kept();
        // Emptied for the next, with the reader back in the first player.
        setAdded(name);
        setChosen({ first: "", second: "" });
        fields.current.first?.focus();
        setSending(false);
        return;
      }
      setAdded(undefined);
      const answer = (await response.json().catch(() => ({}))) as {
        error?: string;
        broken?: Broken[];
      };
      setRefused(
        answer.broken?.map(({ code, fields: about }) =>
          refusal(
            code,
            about?.[0] === "first" || about?.[0] === "second"
              ? about[0]
              : undefined,
          ),
        ) ?? [refusal(answer.error ?? "Unknown", undefined)],
      );
    } catch {
      setRefused([refusal("Unknown", undefined)]);
    }
    setSending(false);
  };

  // The reader is taken to the first player refused, as every refused form
  // takes them.
  useEffect(() => {
    const first = (["first", "second"] as const).find((place) =>
      refused.some((each) => each.place === place),
    );
    if (first !== undefined) fields.current[first]?.focus();
  }, [refused]);

  const choose = (place: Place) => (
    <Field
      name={place}
      label={say(`admin.pair.${place}`)}
      refused={refused.filter((each) => each.place === place)}
      lifted
    >
      {(tied) => (
        <select
          {...tied}
          ref={(element) => {
            fields.current[place] = element;
          }}
          value={chosen[place]}
          onChange={(event) => {
            const value = event.target.value;
            // Who was added is no longer the news once the next is chosen.
            setAdded(undefined);
            setChosen((was) => ({
              ...was,
              [place]: value,
              // The second is chosen from the players but the first, so one
              // already chosen as the second who is now the first is no longer
              // a choice, and is left to be chosen again.
              ...(place === "first" && was.second === value
                ? { second: "" }
                : {}),
            }));
          }}
        >
          <option value="">{say("admin.pair.choose")}</option>
          {players
            .filter(({ id }) => place === "first" || id !== chosen.first)
            .map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
      )}
    </Field>
  );

  return (
    <ModalDialog
      help={standardHelp("players", "adding-a-pair")}
      title={say("admin.pair.title")}
      action={say("admin.players.addPair")}
      hover={say("admin.hover.dialog.pair.add")}
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      <DialogStatus>
        {added === undefined
          ? null
          : say("admin.player.added", { name: added })}
      </DialogStatus>
      <DialogProblems
        refused={refused.filter(({ place }) => place === undefined)}
      />
      {choose("first")}
      {choose("second")}
    </ModalDialog>
  );
};
