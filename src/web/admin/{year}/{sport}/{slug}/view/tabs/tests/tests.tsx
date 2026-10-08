import { useEffect, useState } from "react";

import { dayWritten } from "../../../../../../../common/dates.js";
import { knows, say } from "../../../../../../words.js";
import { TestDialog, type TestAsItIs } from "../../modal-dialogs/test/test.js";
import { noOption, optionFace } from "../../../../../../optionFace.js";
import { idInAddress, refusalOf } from "../../../../../../api.js";
import "../../../../../../listed.css";

// The Tests tab (tests-tab.feature) of a tournament played by teams, which
// does for its tests what the Competitions tab does for a Standard
// tournament's competitions: the tests in use in the tournament's order, each
// with its days, how it is played and its group, offering Edit, View,
// Archive where it has not been played, Up and Down, and after them the
// archived ones, offering Restore alone. Add Test and Edit open the test dialog. A test is between two teams,
// so where the tournament has fewer than two in use the tab says so where Add
// Test would be, and leads to the Teams tab. What the tournament refuses of
// what was pressed is said above the list, by its code. Whatever is pressed,
// and whenever the dialog keeps a test, the list is asked for again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Where the tournament is found, as "2026/ac/spring-tests". */
  readonly address: string;
  /**
   * The reader's part in the tournament. A scorer is shown the tests in use
   * alone, as the API answers them, and can only view them.
   */
  readonly part: "manager" | "scorer";
  /** Goes to the Teams tab, where the teams a test needs are added. */
  readonly toTeams: () => void;
}

/** A test as the API lists it. */
type Listed = TestAsItIs & {
  readonly kind: "test";
  readonly name: string;
  readonly slug: string;
  readonly archived: boolean;
};

type Action = "up" | "down" | "archive" | "restore";

/**
 * The days a test is played, each in a <time> that says the day it is: the
 * one where it starts and finishes on it, and the first and the last where it
 * does not. Each is written as the reader's language writes a day.
 */
const TestDays = ({
  starts,
  finishes,
}: {
  readonly starts: string;
  readonly finishes: string;
}): React.JSX.Element => {
  const language = document.documentElement.lang || "en";
  return (
    <span className="test-days">
      <time dateTime={starts}>{dayWritten(starts, language)}</time>
      {starts === finishes ? null : (
        <>
          {"–"}
          <time dateTime={finishes}>{dayWritten(finishes, language)}</time>
        </>
      )}
    </span>
  );
};

/** How a test is played: the matches it is expected to have, each's best-of. */
export const TestPlayed = ({
  expectedMatches,
  bestOf,
}: {
  readonly expectedMatches: number;
  readonly bestOf: number;
}): React.JSX.Element => (
  <span className="test-played">
    <span className="test-matches" data-matches={expectedMatches}>
      {say(
        expectedMatches === 1
          ? "admin.tests.matches.one"
          : "admin.tests.matches.other",
        { count: String(expectedMatches) },
      )}
    </span>
    {", "}
    <span className="test-best-of" data-best-of={bestOf}>
      {say("admin.tests.bestOf", { games: String(bestOf) })}
    </span>
  </span>
);

export const TestsTab = ({
  tournament,
  address,
  part,
  toTeams,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  // How many teams are in use, which is whether a test can be added. A
  // scorer adds none, so is not asked about.
  const [teamsInUse, setTeamsInUse] = useState<number | undefined>();
  // Counted up to ask again, once something has been pressed.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Listed | undefined>();
  // What the tournament refused of what was last pressed, by its code.
  const [refused, setRefused] = useState<string | undefined>();
  const ofTournament = `/api/v1/tournaments/${idInAddress(tournament)}`;
  const at = `${ofTournament}/competitions`;

  useEffect(() => {
    let current = true;
    const asked = async <T,>(path: string): Promise<T | undefined> =>
      fetch(path, { headers: { accept: "application/json" } })
        .then(async (response) =>
          response.ok ? ((await response.json()) as T) : undefined,
        )
        .catch(() => undefined);
    void Promise.all([
      asked<{ competitions: Listed[] }>(at),
      part === "manager"
        ? asked<{ teams: { archived: boolean }[] }>(`${ofTournament}/teams`)
        : Promise.resolve(undefined),
    ]).then(([tests, teams]) => {
      if (!current) return;
      setListed(tests?.competitions.filter(({ kind }) => kind === "test"));
      setTeamsInUse(teams?.teams.filter(({ archived }) => !archived).length);
      setAnswered(asking);
    });
    return () => {
      current = false;
    };
  }, [at, ofTournament, part, asking]);

  const act = async (test: Listed, action: Action): Promise<void> => {
    setActing(true);
    setRefused(undefined);
    // Asked again whether or not it was done, since the list is to say what
    // the tests are now.
    try {
      const response = await fetch(`${at}/${idInAddress(test.id)}/${action}`, {
        method: "POST",
      });
      if (!response.ok) {
        setRefused(await refusalOf(response));
      }
    } catch {
      setRefused("Unknown");
    } finally {
      setAsking((count) => count + 1);
      setActing(false);
    }
  };

  const inUse = listed?.filter(({ archived }) => !archived) ?? [];
  const archived = listed?.filter((test) => test.archived) ?? [];
  const pageOf = (test: Listed): string =>
    `/admin/${address}/tests/${test.slug}`;

  const button = (test: Listed, action: Action): React.JSX.Element => (
    <button
      key={action}
      type="button"
      className="button"
      data-action={action}
      onClick={() => void act(test, action)}
      {...optionFace(action, say(`admin.tests.${action}`))}
    />
  );

  const row = (
    test: Listed,
    options: React.JSX.Element[],
  ): React.JSX.Element => (
    <li
      key={test.id}
      className="listed-item"
      data-archived={test.archived ? "" : undefined}
    >
      <span className="listed-who">
        <a className="listed-name" href={pageOf(test)}>
          {test.name}
        </a>
      </span>
      <span className="listed-about-test">
        <TestDays starts={test.starts} finishes={test.finishes} />{" "}
        <TestPlayed
          expectedMatches={test.expectedMatches}
          bestOf={test.bestOf}
        />
        {test.group === undefined ? null : (
          <>
            {" "}
            <span className="test-group">{test.group}</span>
          </>
        )}
      </span>
      <span className="listed-options">{options}</span>
    </li>
  );

  // Two teams in use are what a test needs, so Add Test is offered once
  // there are, and until then what is needed is said in its place.
  const canAdd = teamsInUse === undefined || teamsInUse >= 2;

  return (
    <section
      className="stack tests-tab"
      aria-busy={acting || answered !== asking}
    >
      {part === "manager" ? (
        canAdd ? (
          <p>
            <button
              type="button"
              className="button"
              onClick={() => {
                setAdding(true);
              }}
            >
              {say("admin.tests.add")}
            </button>
          </p>
        ) : (
          <p className="tests-need-teams">
            {say("admin.tests.twoTeamsNeeded")}{" "}
            <button
              type="button"
              className="button"
              data-action="teams"
              onClick={toTeams}
            >
              {say("admin.tests.toTeams")}
            </button>
          </p>
        )
      ) : null}
      {refused === undefined ? null : (
        <p className="listed-refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.tests.otherwise")}
        </p>
      )}
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.tests.none")}</p>
      ) : (
        <>
          <ul className="listed" data-listed="in-use">
            {inUse.map((test, place) =>
              row(test, [
                // Before View, so that what is done to a test is offered
                // ahead of going to it.
                ...(part === "manager"
                  ? [
                      <button
                        key="edit"
                        type="button"
                        className="button"
                        data-action="edit"
                        onClick={() => {
                          setEditing(test);
                        }}
                      >
                        {say("admin.tests.edit")}
                      </button>,
                    ]
                  : []),
                <a key="view" className="button" href={pageOf(test)}>
                  {say("admin.tests.view")}
                </a>,
                ...(part === "manager"
                  ? [
                      // Not a test that has been played (archiveCompetition
                      // .feature); its room is kept where another offers it,
                      // so that what comes after lines up.
                      ...(test.hasGames
                        ? inUse.some(({ hasGames }) => !hasGames)
                          ? [noOption("archive", say("admin.tests.archive"))]
                          : []
                        : [button(test, "archive")]),
                      // Last, where they are in the same place on every row.
                      ...(inUse.length < 2
                        ? []
                        : [
                            place > 0
                              ? button(test, "up")
                              : noOption("up", say("admin.tests.up")),
                            place < inUse.length - 1
                              ? button(test, "down")
                              : noOption("down", say("admin.tests.down")),
                          ]),
                    ]
                  : []),
              ]),
            )}
          </ul>
          {archived.length > 0 ? (
            <>
              <h2 className="listed-archived-heading">
                {say("admin.tests.archived")}
              </h2>
              <ul className="listed" data-listed="archived">
                {archived.map((test) => row(test, [button(test, "restore")]))}
              </ul>
            </>
          ) : null}
        </>
      )}
      {adding || editing !== undefined ? (
        <TestDialog
          tournament={tournament}
          address={address}
          test={editing}
          kept={() => {
            setAsking((count) => count + 1);
          }}
          close={() => {
            setAdding(false);
            setEditing(undefined);
          }}
        />
      ) : null}
    </section>
  );
};
