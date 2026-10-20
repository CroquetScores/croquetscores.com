import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { knows, say } from "../../../../../../words.js";
import { idInAddress } from "../../../../../../api.js";
import { DialogProblems } from "../../../../../../DialogProblems.js";
import { DialogStatus } from "../../../../../../DialogStatus.js";
import { useFocusFirstRefused } from "../../../../../../useFocusFirstRefused.js";

// The team dialog (team.feature), over a tournament's Teams tab: opened by Add
// Team to add teams a few at a time, and by a team's name or Edit to change
// one. Adding and changing are the one dialog, so that the two cannot come to
// ask different things. Adding keeps it open, says which team was added and
// empties it for the next; saving closes it.

/** A flag as the API offers it: its code, its name as the reader reads it. */
interface Flag {
  readonly code: string;
  readonly name: string;
}

/** A team as it is, when one is being changed. */
export interface TeamAsItIs {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly flag: { readonly code: string } | undefined;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Nothing when adding, and the team when changing one. */
  readonly team?: TeamAsItIs | undefined;
  /** Once a team is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

type Part = "name" | "shortName" | "flag";

// The field each refusal is about. A short name longer than the name is said
// beneath the short name, since that is the one most likely wrong. One about
// no one field is said above them.
const fieldOf = (code: string): Part | undefined =>
  code.startsWith("TeamName.") || code === "Tournament.TeamNameTaken"
    ? "name"
    : code.startsWith("TeamShortName.") ||
        code === "Team.ShortNameLongerThanName" ||
        code === "Tournament.TeamShortNameTaken"
      ? "shortName"
      : code === "Team.NoSuchFlag"
        ? "flag"
        : undefined;

export const TeamDialog = ({
  tournament,
  team,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [flags, setFlags] = useState<readonly Flag[]>([]);
  const [name, setName] = useState(team?.name ?? "");
  const [shortName, setShortName] = useState(team?.shortName ?? "");
  const [flag, setFlag] = useState(team?.flag?.code ?? "");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  // Which team was last added, said until the next name is typed.
  const [added, setAdded] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const nameField = useRef<HTMLInputElement>(null);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/teams`;

  useEffect(() => {
    void fetch("/api/v1/flags", { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok ? ((await response.json()) as { flags: Flag[] }).flags : [],
      )
      .catch(() => [])
      .then(setFlags);
  }, []);

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.team.otherwise"),
  });
  const refusedFor = (part: Part | undefined): Refusal[] =>
    refused.filter(({ code }) => fieldOf(code) === part);

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(
        team === undefined ? at : `${at}/${idInAddress(team.id)}`,
        {
          method: team === undefined ? "POST" : "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ name, shortName, flag }),
        },
      );
      if (response.ok) {
        setRefused([]);
        kept();
        if (team !== undefined) {
          close();
          return;
        }
        // Emptied for the next, with the reader back in the name.
        setAdded(name.trim());
        setName("");
        setShortName("");
        setFlag("");
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

  useFocusFirstRefused(refused);

  const above = refusedFor(undefined);

  return (
    <ModalDialog
      title={say(
        team === undefined ? "admin.team.addTitle" : "admin.team.editTitle",
      )}
      action={say(team === undefined ? "admin.team.add" : "admin.team.save")}
      hover={
        team === undefined
          ? say("admin.hover.dialog.team.add")
          : say("admin.hover.dialog.team.save")
      }
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      <DialogStatus>
        {added === undefined ? null : say("admin.team.added", { name: added })}
      </DialogStatus>
      <DialogProblems refused={above} />
      <Field
        name="name"
        label={say("admin.team.name")}
        refused={refusedFor("name")}
      >
        {(tied) => (
          <input
            {...tied}
            ref={nameField}
            type="text"
            placeholder=" "
            autoComplete="off"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              // Which team was added is no longer the news once the next is
              // typed.
              setAdded(undefined);
            }}
          />
        )}
      </Field>
      {/* Said what it is for, since a reader asked for two names would
          otherwise wonder why. */}
      <Field
        name="short-name"
        label={say("admin.team.shortName")}
        refused={refusedFor("shortName")}
        explanation={say("admin.team.shortName.explanation")}
      >
        {(tied) => (
          <input
            {...tied}
            type="text"
            placeholder=" "
            autoComplete="off"
            value={shortName}
            onChange={(event) => {
              setShortName(event.target.value);
            }}
          />
        )}
      </Field>
      <Field
        name="flag"
        label={say("admin.team.flag")}
        refused={refusedFor("flag")}
        lifted
      >
        {(tied) => (
          <select
            {...tied}
            value={flag}
            onChange={(event) => {
              setFlag(event.target.value);
            }}
          >
            {/* None first, since a team need fly none. */}
            <option value="" />
            {flags.map(({ code, name: called }) => (
              <option key={code} value={code}>
                {called}
              </option>
            ))}
          </select>
        )}
      </Field>
    </ModalDialog>
  );
};
