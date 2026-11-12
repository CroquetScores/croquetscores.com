import { useEffect, useState } from "react";

import { idInAddress, refusalOf } from "../../api.js";
import { ModalDialog } from "../../ModalDialog.js";
import { knows, say } from "../../words.js";

// The page where an administrator judges a national or an international
// tournament (notableTournament.feature), which the email telling them of it
// links to. The tournament is named in the address as it is anywhere, by its
// year, its sport and its slug, after `url=`.

interface Judged {
  readonly id: string;
  readonly address: string;
  readonly name: string;
  readonly national: boolean;
  readonly international: boolean;
}

// A tournament's address as the site writes one: the year, the sport and the
// slug, each of which is one part. Anything else names nothing, and is refused
// as an address nothing was found at is, without asking the API.
const addressIn = (search: string): string | undefined => {
  const written = new URLSearchParams(search).get("url");
  return written !== null && /^[1-9]\d{3}\/[^/]+\/[^/]+$/.test(written)
    ? written
    : undefined;
};

export const NotableTournament = (): React.JSX.Element => {
  const address = addressIn(window.location.search);
  const [tournament, setTournament] = useState<Judged | undefined>();
  const [refused, setRefused] = useState<string | undefined>(
    address === undefined ? "UpdateTournament.NoSuchTournament" : undefined,
  );
  const [asking, setAsking] = useState(false);
  const [acting, setActing] = useState(false);
  // Counted up to read the tournament again once its status has been taken.
  const [reading, setReading] = useState(0);

  useEffect(() => {
    if (address === undefined) return;
    let current = true;
    void fetch(`/api/site/tournaments/at/${address}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (response.ok) {
          const body = (await response.json()) as Judged;
          if (current) setTournament(body);
        } else {
          const code = await refusalOf(response);
          if (current) setRefused(code);
        }
      })
      .catch(() => {
        if (current) setRefused("Unknown");
      });
    return () => {
      current = false;
    };
  }, [address, reading]);

  // Whichever it is, never both: the tournament refuses both (create.feature).
  const level =
    tournament === undefined
      ? undefined
      : tournament.international
        ? "International"
        : tournament.national
          ? "National"
          : undefined;

  const remove = async (judged: Judged): Promise<void> => {
    setActing(true);
    try {
      const response = await fetch(
        `/api/site/tournaments/${idInAddress(judged.id)}/remove-notable-status`,
        { method: "POST" },
      );
      if (!response.ok) setRefused(await refusalOf(response));
    } catch {
      setRefused("Unknown");
    } finally {
      setAsking(false);
      setActing(false);
      setReading((count) => count + 1);
    }
  };

  return (
    <div className="stack" aria-busy={tournament === undefined && !refused}>
      <h1>{say("admin.notableTournament.title")}</h1>
      {refused !== undefined ? (
        <p className="refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.notableTournament.otherwise")}
        </p>
      ) : tournament === undefined ? null : (
        <>
          <p className="notable-tournament-name">{tournament.name}</p>
          <p>
            <a data-link="tournament" href={`/${tournament.address}`}>
              {say("admin.notableTournament.tournament")}
            </a>
          </p>
          <p>
            <a
              data-link="admin-tournament"
              href={`/admin/${tournament.address}`}
            >
              {say("admin.notableTournament.adminTournament")}
            </a>
          </p>
          {level === undefined ? (
            <p data-none="">{say("admin.notableTournament.neither")}</p>
          ) : (
            <p>
              <button
                type="button"
                className="button"
                title={say("admin.hover.notableTournament.remove")}
                onClick={() => {
                  setAsking(true);
                }}
              >
                {say(`admin.notableTournament.remove${level}`)}
              </button>
            </p>
          )}
          {asking && level !== undefined ? (
            <ModalDialog
              title={say(`admin.notableTournament.remove${level}`)}
              action={say("admin.notableTournament.yes")}
              hover={say("admin.hover.notableTournament.yes")}
              busy={acting}
              act={() => void remove(tournament)}
              cancel={() => {
                setAsking(false);
              }}
            >
              <p>
                {say(`admin.notableTournament.confirm${level}`, {
                  name: tournament.name,
                })}
              </p>
            </ModalDialog>
          ) : null}
        </>
      )}
    </div>
  );
};
