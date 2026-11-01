import { useState } from "react";

import { knows, say } from "../../../../../../words.js";
import { DialogProblems } from "../../../../../../DialogProblems.js";
import {
  CompetitionDialog,
  type CompetitionAsItIs,
} from "../../modal-dialogs/competition/competition.js";
import { noOption, optionFace } from "../../../../../../optionFace.js";
import { idInAddress } from "../../../../../../api.js";
import "../../../../../../listed.css";
import { sectionsChanged } from "../../../sectionsChanged.js";
import { useListed } from "../../../../../../useListed.js";
import { Pencil } from "../../../../../../Pencil.js";

// The Competitions tab (competitions-tab.feature): the competitions in use in
// the tournament's order, each offering Edit, View, Archive, Up and Down, and
// after them the archived ones, offering Restore alone. Add Competition and
// Edit open the competition dialog. Whatever is pressed, and whenever the
// dialog keeps a competition, the list is asked for again, so that it says
// what the competitions are now rather than what was pressed.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Where the tournament is found, as "2026/ac/spring-open". */
  readonly address: string;
  /** Whether its sport has world rankings, which a competition may count towards. */
  readonly ranked: boolean;
  /** The most hoops a game of the sport is played to unless one says otherwise. */
  readonly usualMaximumHoops: number;
  /**
   * The reader's part in the tournament. A scorer is shown the competitions in
   * use alone, as the API answers them, and can only view them: adding them,
   * putting them in order, archiving and restoring them are the managers' to
   * do.
   */
  readonly part: "manager" | "scorer";
}

/** A competition as the API lists it, with its shape. */
type Listed = CompetitionAsItIs & {
  readonly slug: string;
  readonly archived: boolean;
};

export const CompetitionsTab = ({
  tournament,
  address,
  part,
  ranked,
  usualMaximumHoops,
}: Props): React.JSX.Element => {
  const [acting, setActing] = useState(false);
  // What was refused of the last thing pressed, said above the list until the
  // next is, since the list asked for again would otherwise look as though
  // nothing was pressed.
  const [refusedCode, setRefusedCode] = useState<string | undefined>();
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Listed | undefined>();
  const at = `/api/site/tournaments/${idInAddress(tournament)}/competitions`;

  const { listed, asking, answered, askAgain } = useListed<Listed>(
    at,
    "competitions",
  );

  const act = async (
    competition: Listed,
    action: "up" | "down" | "archive" | "restore",
  ): Promise<void> => {
    setActing(true);
    // Asked again whether or not it was done, since the list is to say what
    // the competitions are now.
    setRefusedCode(undefined);
    try {
      const response = await fetch(
        `${at}/${idInAddress(competition.id)}/${action}`,
        { method: "POST" },
      );
      if (!response.ok) {
        const answer = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setRefusedCode(answer.error ?? "Unknown");
      }
    } catch {
      // A request that never arrived is said by the list asked for again.
    } finally {
      askAgain();
      sectionsChanged();
      setActing(false);
    }
  };

  const inUse = listed?.filter(({ archived }) => !archived) ?? [];
  const archived = listed?.filter((competition) => competition.archived) ?? [];
  const pageOf = (competition: Listed): string =>
    `/admin/${address}/competitions/${competition.slug}`;

  const row = (
    competition: Listed,
    options: React.JSX.Element[],
  ): React.JSX.Element => (
    <li
      key={competition.id}
      className="listed-item"
      data-archived={competition.archived ? "" : undefined}
    >
      <a className="listed-name" href={pageOf(competition)}>
        {competition.name}
      </a>
      <span className="listed-about">
        {say(`admin.competitions.${competition.kind}`)}
      </span>
      <span className="listed-options">{options}</span>
    </li>
  );

  const button = (
    competition: Listed,
    action: "up" | "down" | "archive" | "restore",
  ): React.JSX.Element => (
    <button
      key={action}
      type="button"
      className="button"
      onClick={() => void act(competition, action)}
      {...optionFace(
        action,
        say(`admin.competitions.${action}`),
        say(`admin.hover.competitions.${action}`),
      )}
    />
  );

  return (
    <section
      className="stack competitions-tab"
      aria-busy={acting || answered !== asking}
    >
      {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
      {part === "manager" ? (
        <p>
          <button
            type="button"
            className="button"
            title={say("admin.hover.competitions.add")}
            onClick={() => {
              setAdding(true);
            }}
          >
            {say("admin.competitions.add")}
          </button>
        </p>
      ) : null}
      <DialogProblems
        refused={
          refusedCode === undefined
            ? []
            : [
                {
                  code: refusedCode,
                  words: say(
                    knows(refusedCode)
                      ? refusedCode
                      : "admin.competition.otherwise",
                  ),
                },
              ]
        }
      />
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.competitions.none")}</p>
      ) : (
        <>
          <ul className="listed" data-listed="in-use">
            {inUse.map((competition, place) =>
              row(competition, [
                // Before View, so that what is done to a competition is
                // offered ahead of going to it.
                ...(part === "manager"
                  ? [
                      <button
                        key="edit"
                        type="button"
                        className="button"
                        title={say("admin.hover.competitions.edit")}
                        aria-label={say("admin.competitions.edit")}
                        onClick={() => {
                          setEditing(competition);
                        }}
                      >
                        <Pencil />
                      </button>,
                    ]
                  : []),
                <a
                  key="view"
                  className="button"
                  href={pageOf(competition)}
                  title={say("admin.hover.competitions.view")}
                >
                  {say("admin.competitions.view")}
                </a>,
                ...(part === "manager"
                  ? [
                      button(competition, "archive"),
                      // Last, where they are in the same place on every row.
                      // Nowhere to go is nothing to press, but its room is
                      // kept, so the rest lines up (optionFace.tsx); a lone
                      // competition has nothing to line up with.
                      ...(inUse.length < 2
                        ? []
                        : [
                            place > 0
                              ? button(competition, "up")
                              : noOption("up", say("admin.competitions.up")),
                            place < inUse.length - 1
                              ? button(competition, "down")
                              : noOption(
                                  "down",
                                  say("admin.competitions.down"),
                                ),
                          ]),
                    ]
                  : []),
              ]),
            )}
          </ul>
          {archived.length > 0 ? (
            <>
              <h2 className="listed-archived-heading">
                {say("admin.competitions.archived")}
              </h2>
              <ul className="listed" data-listed="archived">
                {archived.map((competition) =>
                  row(competition, [button(competition, "restore")]),
                )}
              </ul>
            </>
          ) : null}
        </>
      )}
      {adding || editing !== undefined ? (
        <CompetitionDialog
          tournament={tournament}
          ranked={ranked}
          usualMaximumHoops={usualMaximumHoops}
          competition={editing}
          kept={() => {
            askAgain();
            sectionsChanged();
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
