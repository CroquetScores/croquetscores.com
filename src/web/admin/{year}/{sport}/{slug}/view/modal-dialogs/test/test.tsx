import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../../Field.js";
import { ModalDialog } from "../../../../../../ModalDialog.js";
import { teamsHelp } from "../../../../../../helpAddress.js";
import { knows, say } from "../../../../../../words.js";
import { idInAddress } from "../../../../../../api.js";
import "./test.css";
import { useRules } from "../../../../../../RulesTicks.js";
import { DialogProblems } from "../../../../../../DialogProblems.js";
import { DialogStatus } from "../../../../../../DialogStatus.js";
import { useFocusFirstRefused } from "../../../../../../useFocusFirstRefused.js";

// The test dialog (test.feature), over a tournament's Tests tab: opened by Add
// Test to add tests a round at a time, and by Edit to change one. It reads in
// the order a test is said aloud: Team A, Team B, then its days and how it is
// played. Team B offers every team but Team A's, since a team does not play
// itself. Adding keeps it open, says which test was added and empties the
// teams alone, since the tests of a round are alike but for who plays them;
// saving closes it. A test with games keeps its teams, so they are shown as
// they are rather than offered.

/** A test as it is, as the Tests tab lists it, when one is being changed. */
export interface TestAsItIs {
  readonly id: string;
  readonly teams: readonly {
    readonly id: string;
    readonly name: string;
    readonly shortName: string;
  }[];
  readonly starts: string;
  readonly finishes: string;
  readonly expectedMatches: number;
  readonly bestOf: number;
  readonly group: string | undefined;
  readonly hasGames: boolean;
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  readonly worldRankings: boolean;
}

/** A team as the API lists the tournament's. */
interface Team {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  readonly archived: boolean;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Where the tournament is found, for the days it is played. */
  readonly address: string;
  /** Whether the tournament's sport has world rankings, which a test may count towards. */
  readonly ranked: boolean;
  /** Nothing when adding, and the test when changing one. */
  readonly test?: TestAsItIs | undefined;
  /** Once a test is kept, so that the list says so. */
  readonly kept: () => void;
  readonly close: () => void;
}

type Part =
  | "firstTeam"
  | "secondTeam"
  | "starts"
  | "finishes"
  | "expectedMatches"
  | "bestOf"
  | "group";

const parts: readonly Part[] = [
  "firstTeam",
  "secondTeam",
  "starts",
  "finishes",
  "expectedMatches",
  "bestOf",
  "group",
];

// A number as it was typed, or one that is no number where nothing was: the
// API refuses either as not whole or not enough.
const typedNumber = (typed: string): number =>
  typed.trim() === "" ? 0 : Number(typed);

// The part each refusal is about, where its code says. The same team chosen
// twice is said beneath Team B, and a test that finishes before it starts
// beneath Finishes, since the second is the one most likely wrong. One about
// no one part is said above them all.
const partOf: Readonly<Record<string, Part>> = {
  "AddTest.FirstTeamMissing": "firstTeam",
  "UpdateTest.FirstTeamMissing": "firstTeam",
  "AddTest.SecondTeamMissing": "secondTeam",
  "UpdateTest.SecondTeamMissing": "secondTeam",
  "Tournament.TestAgainstItself": "secondTeam",
  "Tournament.TestStartsBeforeTournament": "starts",
  "Tournament.TestFinishesBeforeStarts": "finishes",
  "Tournament.TestFinishesAfterTournament": "finishes",
  "Tournament.ExpectedMatchesBelowStarted": "expectedMatches",
  "Tournament.BestOfBelowGamesPlayed": "bestOf",
};

// The earlier and the later of two days written as "2026-10-03", which sort
// as they are written. Either may be unknown.
const earliest = (
  one: string | undefined,
  other: string | undefined,
): string | undefined =>
  one === undefined || (other !== undefined && other < one) ? other : one;
const latest = (
  one: string | undefined,
  other: string | undefined,
): string | undefined =>
  one === undefined || (other !== undefined && other > one) ? other : one;

const isPart = (field: string | undefined): field is Part =>
  parts.includes(field as Part);

export const TestDialog = ({
  tournament,
  address,
  ranked,
  test,
  kept,
  close,
}: Props): React.JSX.Element => {
  const rules = useRules(test, ranked);
  const [teams, setTeams] = useState<readonly Team[]>([]);
  // The days the tournament is played, which a test is played within.
  const [days, setDays] = useState<
    { readonly starts: string; readonly finishes: string } | undefined
  >();
  const keepsTeams = test?.hasGames === true;
  const [said, setSaid] = useState<Record<Part, string>>({
    firstTeam: test?.teams[0]?.id ?? "",
    secondTeam: test?.teams[1]?.id ?? "",
    starts: test?.starts ?? "",
    finishes: test?.finishes ?? "",
    expectedMatches: String(test?.expectedMatches ?? 1),
    bestOf: String(test?.bestOf ?? 1),
    group: test?.group ?? "",
  });
  const [refused, setRefused] = useState<
    readonly (Refusal & { readonly part: Part | undefined })[]
  >([]);
  // The test last added, by its name, said until the next team is chosen.
  const [added, setAdded] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const firstTeamField = useRef<HTMLSelectElement>(null);
  const startsField = useRef<HTMLInputElement>(null);
  const ofTournament = `/api/site/tournaments/${idInAddress(tournament)}`;

  useEffect(() => {
    const asked = async <T,>(path: string): Promise<T | undefined> =>
      fetch(path, { headers: { accept: "application/json" } })
        .then(async (response) =>
          response.ok ? ((await response.json()) as T) : undefined,
        )
        .catch(() => undefined);
    void asked<{ teams: Team[] }>(`${ofTournament}/teams`).then((answer) => {
      setTeams(answer?.teams ?? []);
    });
    void asked<{ starts: string; finishes: string }>(
      `/api/site/tournaments/at/${address}`,
    ).then((answer) => {
      if (answer === undefined) return;
      setDays({ starts: answer.starts, finishes: answer.finishes });
      // A test added begins on the tournament's first day, which is where
      // most are played.
      if (test === undefined) {
        setSaid((now) => ({
          ...now,
          starts: now.starts === "" ? answer.starts : now.starts,
          finishes: now.finishes === "" ? answer.starts : now.finishes,
        }));
      }
    });
    // A test that keeps its teams begins on what can be changed.
    if (keepsTeams) startsField.current?.focus();
    else firstTeamField.current?.focus();
  }, [ofTournament, address, test, keepsTeams]);

  // The teams in use, since a test with an archived one would be refused.
  const offered = teams.filter(({ archived }) => !archived);

  const refusal = (code: string, part: Part | undefined) => ({
    code,
    part,
    words: say(knows(code) ? code : "admin.test.otherwise"),
  });

  const send = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
    try {
      const response = await fetch(
        test === undefined
          ? `${ofTournament}/tests`
          : `${ofTournament}/tests/${idInAddress(test.id)}`,
        {
          method: test === undefined ? "POST" : "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            firstTeam: idInAddress(said.firstTeam),
            secondTeam: idInAddress(said.secondTeam),
            starts: said.starts,
            finishes: said.finishes,
            expectedMatches: typedNumber(said.expectedMatches),
            bestOf: typedNumber(said.bestOf),
            group: said.group,
            ...rules.said,
          }),
        },
      );
      if (response.ok) {
        setRefused([]);
        kept();
        if (test !== undefined) {
          close();
          return;
        }
        // Called by its teams' short names, as the test is.
        const shortNameOf = (id: string): string =>
          teams.find((team) => team.id === id)?.shortName ?? "";
        setAdded(
          `${shortNameOf(said.firstTeam)} v ${shortNameOf(said.secondTeam)}`,
        );
        // The teams emptied for the next test of the round, and the rest left
        // as the round has it, with the reader back on Team A.
        setSaid({ ...said, firstTeam: "", secondTeam: "" });
        firstTeamField.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string; fields?: string[] }[];
        };
        setAdded(undefined);
        setRefused(
          answer.broken?.map(({ code, fields }) =>
            refusal(code, isPart(fields?.[0]) ? fields[0] : partOf[code]),
          ) ?? [
            refusal(
              answer.error ?? "Unknown",
              partOf[answer.error ?? "Unknown"],
            ),
          ],
        );
      }
    } catch {
      setRefused([refusal("Unknown", undefined)]);
    }
    setSending(false);
  };

  useFocusFirstRefused(refused);

  const refusedFor = (part: Part | undefined): Refusal[] =>
    refused.filter((each) => each.part === part);

  const team = (
    part: "firstTeam" | "secondTeam",
    label: string,
    place: 0 | 1,
  ): React.JSX.Element => (
    <Field name={part} label={say(label)} refused={refusedFor(part)} lifted>
      {(tied) =>
        keepsTeams ? (
          // Shown as the drop-down it is when adding, so that the dialog
          // reads the same either way, with the one team it has.
          <select {...tied} disabled value="kept">
            <option value="kept">{test?.teams[place]?.name}</option>
          </select>
        ) : (
          <select
            {...tied}
            ref={part === "firstTeam" ? firstTeamField : undefined}
            value={said[part]}
            onChange={(event) => {
              const chosen = event.target.value;
              setSaid({
                ...said,
                [part]: chosen,
                // Team A's team is not Team B's to offer, so a Team B that
                // is now Team A's is no longer chosen.
                ...(part === "firstTeam" && chosen === said.secondTeam
                  ? { secondTeam: "" }
                  : {}),
              });
              // Which test was added is no longer the news once the next
              // team is chosen.
              setAdded(undefined);
            }}
          >
            {/* Nobody to begin with, so that a test is never added between
                teams the reader did not choose. */}
            <option value="" />
            {offered
              .filter(({ id }) => part === "firstTeam" || id !== said.firstTeam)
              .map((each) => (
                <option key={each.id} value={each.id}>
                  {each.name}
                </option>
              ))}
          </select>
        )
      }
    </Field>
  );

  const day = (part: "starts" | "finishes", label: string) => (
    <Field name={part} label={say(label)} refused={refusedFor(part)} lifted>
      {(tied) => (
        <input
          {...tied}
          ref={part === "starts" ? startsField : undefined}
          type="date"
          // Only the tournament's days, where the browser's picker can be
          // told which: any other would only be refused. A test being
          // changed keeps its own days besides, which are not refused for
          // what the tournament became after it was added.
          min={earliest(days?.starts, test?.starts)}
          max={latest(days?.finishes, test?.finishes)}
          value={said[part]}
          onChange={(event) => {
            setSaid({ ...said, [part]: event.target.value });
          }}
        />
      )}
    </Field>
  );

  const typed = (
    part: "expectedMatches" | "bestOf" | "group",
    label: string,
  ) => (
    <Field name={part} label={say(label)} refused={refusedFor(part)}>
      {(tied) => (
        <input
          {...tied}
          type="text"
          {...(part === "group" ? {} : { inputMode: "numeric" as const })}
          placeholder=" "
          autoComplete="off"
          value={said[part]}
          onChange={(event) => {
            setSaid({ ...said, [part]: event.target.value });
          }}
        />
      )}
    </Field>
  );

  const above = refusedFor(undefined);

  return (
    <ModalDialog
      help={teamsHelp(
        "tests",
        test === undefined ? "adding-a-test" : "changing-a-test",
      )}
      title={say(
        test === undefined ? "admin.test.addTitle" : "admin.test.editTitle",
      )}
      action={say(test === undefined ? "admin.test.add" : "admin.test.save")}
      hover={
        test === undefined
          ? say("admin.hover.dialog.test.add")
          : say("admin.hover.dialog.test.save")
      }
      act={() => void send()}
      cancel={close}
      busy={sending}
    >
      <DialogStatus>
        {added === undefined ? null : say("admin.test.added", { name: added })}
      </DialogStatus>
      <DialogProblems refused={above} />
      {team("firstTeam", "admin.test.firstTeam", 0)}
      {team("secondTeam", "admin.test.secondTeam", 1)}
      {day("starts", "admin.test.starts")}
      {day("finishes", "admin.test.finishes")}
      {typed("expectedMatches", "admin.test.expectedMatches")}
      {typed("bestOf", "admin.test.bestOf")}
      {typed("group", "admin.test.group")}
      {rules.ticks}
    </ModalDialog>
  );
};
