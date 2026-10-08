import { useEffect, useState } from "react";

import { say } from "../../../../../../words.js";
import { TeamDialog, type TeamAsItIs } from "../../modal-dialogs/team/team.js";
import { noOption, optionFace } from "../../../../../../optionFace.js";
import { idInAddress } from "../../../../../../api.js";
import "../../../../../../listed.css";

// The Teams tab (teams-tab.feature) of a tournament played by teams: the teams
// in use in the tournament's order, each with its short name and the flag it
// flies, offering Edit, View, Archive, Up and Down, and after them the
// archived ones, struck through, offering Restore alone. Add Team and Edit
// open the team dialog, and a team's name and View lead to the team's page,
// where its players are. A team playing in a test in use is not offered Archive,
// since the test would be left a team short. Nothing asks first: archiving a
// team loses nothing, its players coming back with it. Whatever is pressed,
// and whenever the dialog keeps a team, the list is asked for again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Where the tournament is found, as "2026/ac/spring-tests". */
  readonly address: string;
  /**
   * Whether the reader manages the tournament. A world ranking officer who
   * does not is shown the teams to reach their players, and offered nothing
   * but each team's page.
   */
  readonly manages: boolean;
}

/** A team as the API lists it, its flag as it is seen. */
interface Listed extends TeamAsItIs {
  readonly flag:
    | { readonly code: string; readonly name: string; readonly image: string }
    | undefined;
  readonly slug: string;
  readonly archived: boolean;
  readonly inATest: boolean;
}

type Action = "up" | "down" | "archive" | "restore";

export const TeamsTab = ({
  tournament,
  address,
  manages,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Listed[] | undefined>();
  // Counted up to ask again, once something has been pressed or kept.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  // Which dialog is open: to add, or to change a team, or none.
  const [dialog, setDialog] = useState<"adding" | Listed | undefined>();
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/teams`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { teams: Listed[] }).teams
          : undefined,
      )
      .catch(() => undefined)
      .then((teams) => {
        if (!current) return;
        setListed(teams);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, asking]);

  const askAgain = (): void => {
    setAsking((count) => count + 1);
  };

  const act = async (team: Listed, action: Action): Promise<void> => {
    setActing(true);
    try {
      await fetch(`${at}/${idInAddress(team.id)}/${action}`, {
        method: "POST",
      });
    } catch {
      // A request that never arrived is said by the list asked for again.
    } finally {
      askAgain();
      setActing(false);
    }
  };

  const inUse = listed?.filter(({ archived }) => !archived) ?? [];
  const archived = listed?.filter((team) => team.archived) ?? [];
  const pageOf = (team: Listed): string =>
    `/admin/${address}/teams/${team.slug}`;

  const button = (team: Listed, action: Action | "edit"): React.JSX.Element => (
    <button
      key={action}
      type="button"
      className="button"
      data-action={action}
      onClick={() => {
        if (action === "edit") setDialog(team);
        else void act(team, action);
      }}
      {...optionFace(
        action,
        say(`admin.teams.${action}`),
        say(`admin.hover.teams.${action}`),
      )}
    />
  );

  // A button where `offered`, and its room where not, so that what comes after
  // it lines up with the rows that do offer it (optionFace.tsx).
  const buttonOrRoom = (
    offered: boolean,
    team: Listed,
    action: "up" | "down" | "archive",
  ): React.JSX.Element =>
    offered
      ? button(team, action)
      : noOption(action, say(`admin.teams.${action}`));
  // Room is kept only for what some row offers.
  const anyArchive = manages && inUse.some(({ inATest }) => !inATest);
  const anyMove = manages && inUse.length > 1;

  const row = (team: Listed, place: number): React.JSX.Element => (
    <li
      key={team.id}
      className="listed-item"
      data-archived={team.archived ? "" : undefined}
    >
      <span className="listed-who">
        {/* To the team's page, where its players are, which is what a team
            is mostly pressed for. An archived team's page refuses to open,
            so its name leads nowhere. */}
        {team.archived ? (
          <span className="listed-name">{team.name}</span>
        ) : (
          <a className="listed-name" href={pageOf(team)}>
            {team.name}
          </a>
        )}
        <span className="listed-about">{team.shortName}</span>
        {/* Named for a reader who cannot see it by the place it is the flag
            of. */}
        {team.flag === undefined ? null : (
          <img
            className="listed-flag"
            src={team.flag.image}
            alt={team.flag.name}
            data-flag={team.flag.code}
          />
        )}
      </span>
      {team.archived ? (
        <span className="visually-hidden">
          {say("admin.teams.archivedSaid")}
        </span>
      ) : null}
      <span className="listed-options">
        {team.archived
          ? manages
            ? button(team, "restore")
            : null
          : [
              // Edit before View, as a competition's is, so that what is done
              // to a team is offered ahead of going to it.
              ...(manages ? [button(team, "edit")] : []),
              <a
                key="view"
                className="button"
                href={pageOf(team)}
                title={say("admin.hover.teams.view")}
              >
                {say("admin.teams.view")}
              </a>,
              ...(anyArchive
                ? [buttonOrRoom(!team.inATest, team, "archive")]
                : []),
              // Last, where they are in the same place on every row.
              ...(anyMove
                ? [
                    buttonOrRoom(place > 0, team, "up"),
                    buttonOrRoom(place < inUse.length - 1, team, "down"),
                  ]
                : []),
            ]}
      </span>
    </li>
  );

  return (
    <section
      className="stack teams-tab"
      aria-busy={acting || answered !== asking}
    >
      {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
      {manages ? (
        <p>
          <button
            type="button"
            className="button"
            title={say("admin.hover.teams.add")}
            onClick={() => {
              setDialog("adding");
            }}
          >
            {say("admin.teams.add")}
          </button>
        </p>
      ) : null}
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say("admin.teams.none")}</p>
      ) : (
        <>
          {inUse.length > 0 ? (
            <ul className="listed" data-listed="in-use">
              {inUse.map(row)}
            </ul>
          ) : null}
          {archived.length > 0 ? (
            <>
              <h2 className="listed-archived-heading">
                {say("admin.teams.archived")}
              </h2>
              <ul className="listed" data-listed="archived">
                {archived.map(row)}
              </ul>
            </>
          ) : null}
        </>
      )}
      {dialog === undefined ? null : (
        <TeamDialog
          tournament={tournament}
          team={dialog === "adding" ? undefined : dialog}
          kept={askAgain}
          close={() => {
            setDialog(undefined);
          }}
        />
      )}
    </section>
  );
};
