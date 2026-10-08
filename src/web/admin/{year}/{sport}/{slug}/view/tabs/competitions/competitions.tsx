import { useEffect, useState } from "react";

import { say } from "../../../../../../words.js";
import {
  CompetitionDialog,
  type CompetitionAsItIs,
} from "../../modal-dialogs/competition/competition.js";
import { noOption, optionFace } from "../optionFace.js";
import "../listed.css";
import { idInAddress } from "../../../../../../api.js";

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
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  // Counted up to ask again, once something has been pressed.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Listed | undefined>();
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/competitions`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { competitions: Listed[] }).competitions
          : undefined,
      )
      .catch(() => undefined)
      .then((competitions) => {
        if (!current) return;
        setListed(competitions);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, asking]);

  const act = async (
    competition: Listed,
    action: "up" | "down" | "archive" | "restore",
  ): Promise<void> => {
    setActing(true);
    // Asked again whether or not it was done, since the list is to say what
    // the competitions are now.
    try {
      await fetch(`${at}/${idInAddress(competition.id)}/${action}`, {
        method: "POST",
      });
    } catch {
      // A request that never arrived is said by the list asked for again.
    } finally {
      setAsking((count) => count + 1);
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
      {...optionFace(action, say(`admin.competitions.${action}`))}
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
            onClick={() => {
              setAdding(true);
            }}
          >
            {say("admin.competitions.add")}
          </button>
        </p>
      ) : null}
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
                        onClick={() => {
                          setEditing(competition);
                        }}
                      >
                        {say("admin.competitions.edit")}
                      </button>,
                    ]
                  : []),
                <a key="view" className="button" href={pageOf(competition)}>
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
          competition={editing}
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
