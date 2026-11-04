import { useState } from "react";

import { ModalDialog } from "../../../../../../../../ModalDialog.js";
import { DialogProblems } from "../../../../../../../../DialogProblems.js";
import { standardHelp } from "../../../../../../../../helpAddress.js";
import { knows, say } from "../../../../../../../../words.js";
import { idInAddress } from "../../../../../../../../api.js";
import "./add-players.css";

// The add players dialog (add-players.feature), over a competition's Players
// tab: the tournament's players who are not in the competition, each with a
// box to tick, and one to tick them all. Add Selected enters those ticked in
// one go and closes it. Where some cannot be entered, a second dialog says
// which and why, and leaves it to the manager to enter the rest or to go back
// and change what is ticked: it is theirs to decide, and not the page's.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** The competition's id. */
  readonly competition: string;
  /** The players to choose from, in the tournament's order. */
  readonly offered: readonly { readonly id: string; readonly name: string }[];
  /** Once they are entered, so that the list says so. */
  readonly added: () => void;
  readonly close: () => void;
}

// A refusal as the API says it: its code, and the listed player it is about.
interface Broken {
  readonly code: string;
  readonly fields?: readonly string[];
}

// Why a player was not entered, by the words for the refusal's code.
interface NotEntered {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly words: string;
}

export const AddPlayersDialog = ({
  tournament,
  competition,
  offered,
  added,
  close,
}: Props): React.JSX.Element => {
  const [ticked, setTicked] = useState<ReadonlySet<string>>(new Set());
  const [sending, setSending] = useState(false);
  // What was refused about the list as a whole, or about everybody in it.
  const [problems, setProblems] = useState<
    readonly { readonly code: string; readonly words: string }[]
  >([]);
  // Players who could not be entered while others could, which is asked about
  // before the others are entered.
  const [deciding, setDeciding] = useState<readonly NotEntered[] | undefined>();

  const refusal = (code: string) => ({
    code,
    words: say(knows(code) ? code : "admin.addPlayers.otherwise"),
  });

  // Listed in the tournament's order, whatever order they were ticked in.
  const selected = offered.filter(({ id }) => ticked.has(id));

  const send = async (enterWhatCan: boolean): Promise<void> => {
    if (sending || selected.length === 0) return;
    setSending(true);
    setProblems([]);
    try {
      const response = await fetch(
        `/api/site/tournaments/${idInAddress(tournament)}/competitions/${idInAddress(competition)}/players/many`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            players: selected.map(({ id }) => idInAddress(id)),
            enterWhatCan,
          }),
        },
      );
      if (response.ok) {
        added();
        close();
        return;
      }
      const answer = (await response.json().catch(() => ({}))) as {
        error?: string;
        broken?: Broken[];
      };
      const about = (answer.broken ?? []).flatMap(({ code, fields }) => {
        const place = /^players\.(\d+)$/.exec(fields?.[0] ?? "")?.[1];
        const player =
          place === undefined ? undefined : selected[Number(place)];
        return player === undefined
          ? []
          : [{ id: player.id, name: player.name, ...refusal(code) }];
      });
      if (about.length > 0 && about.length < selected.length && !enterWhatCan) {
        setDeciding(about);
      } else if (about.length > 0) {
        // Nobody can be entered, so there is nothing to decide about: each is
        // said with the reason, above the list, and the choice is theirs to
        // change.
        setProblems(
          about.map(({ code, words, name }) => ({
            code,
            words: `${name}: ${words}`,
          })),
        );
      } else {
        setProblems([refusal(answer.error ?? "Unknown")]);
      }
    } catch {
      setProblems([refusal("Unknown")]);
    }
    setSending(false);
  };

  if (deciding !== undefined) {
    return (
      <ModalDialog
        help={standardHelp(
          "entering-players-in-a-competition",
          "adding-several",
        )}
        title={say("admin.addPlayers.someRefusedTitle")}
        action={say("admin.addPlayers.addTheRest")}
        hover={say("admin.hover.dialog.addPlayers.addTheRest")}
        act={() => {
          setDeciding(undefined);
          void send(true);
        }}
        cancel={() => {
          // Back to the ticks, which are as they were, to be changed.
          setDeciding(undefined);
        }}
        busy={sending}
      >
        <p>{say("admin.addPlayers.someRefusedQuestion")}</p>
        <ul className="add-players-not-entered">
          {deciding.map(({ id, name, code, words }) => (
            <li key={id} data-refused={code}>
              {name}: {words}
            </li>
          ))}
        </ul>
      </ModalDialog>
    );
  }

  const every = offered.length > 0 && ticked.size === offered.length;

  return (
    <ModalDialog
      help={standardHelp("entering-players-in-a-competition", "adding-several")}
      title={say("admin.addPlayers.title")}
      action={say("admin.addPlayers.add")}
      hover={say("admin.hover.dialog.addPlayers.add")}
      act={() => void send(false)}
      cancel={close}
      busy={sending}
    >
      <DialogProblems refused={problems} />
      <label className="add-players-all">
        <input
          type="checkbox"
          data-select="all"
          checked={every}
          onChange={() => {
            setTicked(every ? new Set() : new Set(offered.map(({ id }) => id)));
          }}
        />
        {say("admin.addPlayers.selectAll")}
      </label>
      <ul className="add-players-offered">
        {offered.map(({ id, name }) => (
          <li key={id}>
            <label>
              <input
                type="checkbox"
                data-player={id}
                checked={ticked.has(id)}
                onChange={(event) => {
                  const next = new Set(ticked);
                  if (event.target.checked) next.add(id);
                  else next.delete(id);
                  setTicked(next);
                }}
              />
              {name}
            </label>
          </li>
        ))}
      </ul>
    </ModalDialog>
  );
};
