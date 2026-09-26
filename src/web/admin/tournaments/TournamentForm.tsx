import { useEffect, useLayoutEffect, useRef, useState } from "react";

import "./tournamentForm.css";

// The form a tournament is created with (new.feature) and changed with
// (edit.feature): one form, so that the two cannot come to ask different
// things. It asks for what the website offers, which it asks the API for
// rather than knowing, so that it offers exactly what creating or changing a
// tournament accepts. Its words are the admin's own, and in no catalogue yet,
// so they are in English.

interface Offered {
  readonly sports: readonly { readonly code: string; readonly name: string }[];
  readonly formats: readonly string[];
  readonly countries: readonly {
    readonly code: string;
    readonly name: string;
    readonly regions: readonly {
      readonly code: string;
      readonly name: string;
    }[];
  }[];
}

// The world rankings are kept for these alone (create.feature).
const withWorldRankings = ["ac", "gc"];

// The field each of the tournament's own refusals is about, since it names a
// rule of the values together rather than a field. One not here is said above
// the fields.
const fieldOfRefusal: Readonly<Record<string, string>> = {
  "Tournament.FinishesBeforeStarts": "finishes",
  "Tournament.RegionNotInCountry": "region",
  "Tournament.SportNotOffered": "sport",
  "Tournament.FormatNotOffered": "format",
  "Tournament.HandicapInWorldRankings": "worldRankings",
  "Tournament.NoWorldRankings": "worldRankings",
  "Tournament.NationalAndInternational": "international",
};

// What each refusal says to the reader. The code is the contract; these are
// only its words, and a code with none here is said in the words for any.
const wordsFor: Readonly<Record<string, string>> = {
  "TournamentName.Missing": "Say what the tournament is called.",
  "TournamentName.TooShort": "That name is too short.",
  "TournamentName.TooLong": "That name is too long.",
  "TournamentName.AllLowerCase": "A name is not written all in lower case.",
  "TournamentName.AllCapitals": "A name is not written all in capitals.",
  "ReadOnlyDate.Unreadable": "Give the day.",
  "Tournament.FinishesBeforeStarts":
    "A tournament cannot finish before it starts.",
  "CreateTournament.NoSuchCountry": "Choose the country.",
  "TournamentNotes.TooLong": "Notes can be no longer than 2000 characters.",
};
const otherwise = "This cannot be accepted as it is.";

interface Refusal {
  readonly code: string;
  readonly words: string;
}

const refusal = (code: string): Refusal => ({
  code,
  words: wordsFor[code] ?? otherwise,
});

// What the API refused, by the field each refusal is about, and what is about
// no one field. A broken rule names its field; the tournament's own refusals
// are placed by their code.
const placed = (
  answer: unknown,
): { byField: Record<string, Refusal[]>; above: Refusal[] } => {
  const byField: Record<string, Refusal[]> = {};
  const above: Refusal[] = [];
  const put = (field: string | undefined, code: string): void => {
    if (field === undefined) above.push(refusal(code));
    else (byField[field] ??= []).push(refusal(code));
  };
  const said = answer as {
    error?: unknown;
    broken?: { code: string; fields: string[] }[];
  };
  if (Array.isArray(said.broken)) {
    for (const rule of said.broken) put(rule.fields[0], rule.code);
  } else if (typeof said.error === "string") {
    put(fieldOfRefusal[said.error], said.error);
  } else {
    above.push(refusal("Unknown"));
  }
  return { byField, above };
};

interface FieldProps {
  readonly name: string;
  readonly label: string;
  readonly refused: readonly Refusal[] | undefined;
  /** A field whose label is always lifted: one that is never empty to look at. */
  readonly lifted?: boolean;
  readonly children: (said: {
    id: string;
    "aria-labelledby": string;
    "aria-describedby"?: string;
    "aria-invalid"?: true;
  }) => React.JSX.Element;
}

// A field drawn as every dialog's is (STYLE.md §5b): the box is the label, the
// label lies on the line until the field is in use, and what is wrong with it
// is beneath it, tied to it so that it is read out with it.
const Field = ({
  name,
  label,
  refused,
  lifted,
  children,
}: FieldProps): React.JSX.Element => {
  const id = `field-${name}`;
  const labelId = `${id}-label`;
  const messageId = `${id}-message`;
  const wrong = refused !== undefined && refused.length > 0;
  return (
    <div className="field">
      <label
        className={lifted === true ? "field-box field-box-lifted" : "field-box"}
        htmlFor={id}
      >
        {/* Named by the label's words alone: a list inside the label would
            otherwise take the choice it shows into its own name. */}
        {children({
          id,
          "aria-labelledby": labelId,
          ...(wrong
            ? { "aria-describedby": messageId, "aria-invalid": true }
            : {}),
        })}
        <span className="field-label" id={labelId}>
          {label}
        </span>
      </label>
      {wrong ? (
        <p
          className="field-message"
          id={messageId}
          data-refused={refused.map(({ code }) => code).join(" ")}
        >
          {refused.map(({ code, words }) => (
            <span key={code}>{words}</span>
          ))}
        </p>
      ) : null}
    </div>
  );
};

interface TickProps {
  readonly name: string;
  readonly label: string;
  readonly ticked: boolean;
  readonly tick: (ticked: boolean) => void;
}

const Tick = ({ name, label, ticked, tick }: TickProps): React.JSX.Element => (
  <div className="field-tick">
    <label htmlFor={`field-${name}`}>
      <input
        id={`field-${name}`}
        type="checkbox"
        checked={ticked}
        onChange={(event) => {
          tick(event.target.checked);
        }}
      />
      <span>{label}</span>
    </label>
  </div>
);

/** What the form begins as: a tournament as it is, when one is being changed. */
export interface Begins {
  readonly name: string;
  readonly starts: string;
  readonly finishes: string;
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  readonly region: string;
  readonly notes: string | undefined;
  readonly handicap: boolean;
  readonly worldRankings: boolean;
  readonly national: boolean;
  readonly international: boolean;
}

interface Props {
  readonly title: string;
  /** The words on the one button, which says what the form does. */
  readonly button: string;
  /** Nothing for a new tournament, which begins empty but for what is decided. */
  readonly begins?: Begins | undefined;
  /**
   * Sends what the form says, answered with where the tournament is found
   * when it is done and with what was refused when it is not.
   */
  readonly send: (said: Readonly<Record<string, unknown>>) => Promise<Response>;
}

export const TournamentForm = ({
  title,
  button,
  begins,
  send,
}: Props): React.JSX.Element => {
  const [offered, setOffered] = useState<Offered | undefined>();
  const [name, setName] = useState(begins?.name ?? "");
  const [starts, setStarts] = useState(begins?.starts ?? "");
  const [finishes, setFinishes] = useState(begins?.finishes ?? "");
  const [sport, setSport] = useState(begins?.sport ?? "");
  const [format, setFormat] = useState(begins?.format ?? "");
  const [country, setCountry] = useState(begins?.country ?? "");
  const [region, setRegion] = useState(begins?.region ?? "");
  const [notes, setNotes] = useState(begins?.notes ?? "");
  const [handicap, setHandicap] = useState(begins?.handicap ?? false);
  // Counting unless the reader says it does not, as creating one has it.
  const [worldRankings, setWorldRankings] = useState(
    begins?.worldRankings ?? true,
  );
  const [national, setNational] = useState(begins?.national ?? false);
  const [international, setInternational] = useState(
    begins?.international ?? false,
  );
  const [refused, setRefused] = useState<{
    byField: Record<string, Refusal[]>;
    above: Refusal[];
  }>({ byField: {}, above: [] });
  const [sending, setSending] = useState(false);
  // What stops a second send, where `sending` only says one is under way. A
  // double click or a second Enter can arrive before the form has drawn itself
  // again, and so before `sending` has changed for it; a ref is changed at once.
  const inFlight = useRef(false);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    void fetch("/api/v1/tournaments/new", {
      headers: { accept: "application/json" },
    })
      .then(async (response) =>
        response.ok ? ((await response.json()) as Offered) : undefined,
      )
      .then((answer) => {
        if (answer === undefined) return;
        setOffered(answer);
        // A new tournament begins in the first sport the site offers, and the
        // first format, which is Standard on both sites; one being changed
        // begins as it is.
        if (begins !== undefined) return;
        setSport(answer.sports[0]?.code ?? "");
        setFormat(answer.formats[0] ?? "");
      })
      .catch(() => {
        // Nothing to offer, and so no form: there is nothing it could create.
      });
  }, [begins]);

  // The reader is taken to the first field that needs attention, as every
  // refused form takes them (STYLE.md §5b).
  useLayoutEffect(() => {
    form.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], .dialog-problems')
      ?.focus();
  }, [refused]);

  if (offered === undefined) return <main id="content" />;

  const regions =
    offered.countries.find(({ code }) => code === country)?.regions ?? [];
  // A country that is not divided is its own one region, and there is
  // nothing to ask.
  const asksForRegion = regions.length > 1;
  const asksAboutWorldRankings = withWorldRankings.includes(sport) && !handicap;

  const save = async (): Promise<void> => {
    // Each send of a new tournament is given an address of its own, so a
    // second one is not refused as the same tournament: it is a second
    // tournament.
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    try {
      const response = await send({
        name,
        starts,
        finishes,
        sport,
        format,
        country,
        region: asksForRegion ? region : (regions[0]?.code ?? ""),
        notes,
        handicap,
        // Unsaid where it is not asked, which the tournament decides for
        // itself: a sport without world rankings, or a handicap tournament,
        // does not count towards them.
        ...(asksAboutWorldRankings ? { worldRankings } : {}),
        national,
        international,
      });
      const answer: unknown = await response.json();
      if (response.ok) {
        // Still sending as far as the reader can tell, and still refusing a
        // second send, until the browser has left for the tournament.
        window.location.assign(
          `/admin/${(answer as { address: string }).address}`,
        );
        return;
      }
      setRefused(placed(answer));
    } catch {
      setRefused({ byField: {}, above: [refusal("Unknown")] });
    }
    inFlight.current = false;
    setSending(false);
  };

  const said = (field: string): Refusal[] | undefined => refused.byField[field];

  return (
    <main id="content">
      <div className="page">
        <section className="dialog" aria-labelledby="dialog-title">
          <h1 className="dialog-title" id="dialog-title">
            {title}
          </h1>
          <form
            className="dialog-form"
            ref={form}
            noValidate
            aria-busy={sending}
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <div className="dialog-content stack">
              {refused.above.length > 0 ? (
                <div className="dialog-problems" tabIndex={-1}>
                  {refused.above.map(({ code, words }) => (
                    <p key={code}>{words}</p>
                  ))}
                </div>
              ) : null}
              <Field name="name" label="Name" refused={said("name")}>
                {(tied) => (
                  <input
                    {...tied}
                    type="text"
                    placeholder=" "
                    autoComplete="off"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                )}
              </Field>
              {/* Side by side, on a phone as much as anywhere: when a
                  tournament starts and when it finishes are read together. */}
              <div className="field-row">
                <Field
                  name="starts"
                  label="Starts"
                  refused={said("starts")}
                  lifted
                >
                  {(tied) => (
                    <input
                      {...tied}
                      type="date"
                      value={starts}
                      onChange={(event) => {
                        setStarts(event.target.value);
                      }}
                    />
                  )}
                </Field>
                <Field
                  name="finishes"
                  label="Finishes"
                  refused={said("finishes")}
                  lifted
                >
                  {(tied) => (
                    <input
                      {...tied}
                      type="date"
                      value={finishes}
                      onChange={(event) => {
                        setFinishes(event.target.value);
                      }}
                    />
                  )}
                </Field>
              </div>
              {/* Asked only where there is a choice: Gateball Scores offers one
                  sport and one format, and every tournament there is both. */}
              {offered.formats.length > 1 || offered.sports.length > 1 ? (
                <div className="field-row">
                  {offered.formats.length > 1 ? (
                    <Field
                      name="format"
                      label="Format"
                      refused={said("format")}
                      lifted
                    >
                      {(tied) => (
                        <select
                          {...tied}
                          value={format}
                          onChange={(event) => {
                            setFormat(event.target.value);
                          }}
                        >
                          {offered.formats.map((called) => (
                            <option key={called} value={called}>
                              {called}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                  ) : null}
                  {offered.sports.length > 1 ? (
                    <Field
                      name="sport"
                      label="Sport"
                      refused={said("sport")}
                      lifted
                    >
                      {(tied) => (
                        <select
                          {...tied}
                          value={sport}
                          onChange={(event) => {
                            setSport(event.target.value);
                          }}
                        >
                          {offered.sports.map(({ code, name: called }) => (
                            <option key={code} value={code}>
                              {called}
                            </option>
                          ))}
                        </select>
                      )}
                    </Field>
                  ) : null}
                </div>
              ) : null}
              <div className="field-row">
                <Field
                  name="country"
                  label="Country"
                  refused={said("country")}
                  lifted
                >
                  {(tied) => (
                    <select
                      {...tied}
                      value={country}
                      onChange={(event) => {
                        setCountry(event.target.value);
                        setRegion("");
                      }}
                    >
                      <option value="" />
                      {offered.countries.map(({ code, name: called }) => (
                        <option key={code} value={code}>
                          {called}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                {asksForRegion ? (
                  <Field
                    name="region"
                    label="Region"
                    refused={said("region")}
                    lifted
                  >
                    {(tied) => (
                      <select
                        {...tied}
                        value={region}
                        onChange={(event) => {
                          setRegion(event.target.value);
                        }}
                      >
                        <option value="" />
                        {regions.map(({ code, name: called }) => (
                          <option key={code} value={code}>
                            {called}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                ) : null}
              </div>
              <Field name="notes" label="Notes" refused={said("notes")} lifted>
                {(tied) => (
                  <textarea
                    {...tied}
                    rows={4}
                    value={notes}
                    onChange={(event) => {
                      setNotes(event.target.value);
                    }}
                  />
                )}
              </Field>
              <Tick
                name="handicap"
                label="Played under handicap"
                ticked={handicap}
                tick={setHandicap}
              />
              {asksAboutWorldRankings ? (
                <Tick
                  name="worldRankings"
                  label="Counts towards the world rankings"
                  ticked={worldRankings}
                  tick={setWorldRankings}
                />
              ) : null}
              {/* Never both: a tournament said to be both is refused, so
                  ticking one unticks the other rather than letting the reader
                  tick both and then be told it cannot be done. */}
              <Tick
                name="national"
                label="Is national"
                ticked={national}
                tick={(ticked) => {
                  setNational(ticked);
                  if (ticked) setInternational(false);
                }}
              />
              <Tick
                name="international"
                label="Is international"
                ticked={international}
                tick={(ticked) => {
                  setInternational(ticked);
                  if (ticked) setNational(false);
                }}
              />
            </div>
            <div className="dialog-buttons">
              <button className="button button-submit" type="submit">
                {button}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};
