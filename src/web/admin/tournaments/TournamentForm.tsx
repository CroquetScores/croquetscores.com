import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { inCountryGroups } from "../../common/countryOrder.js";
import { Field, type Refusal } from "../Field.js";
import { GroupedOptions } from "../GroupedOptions.js";
import { HelpLink } from "../HelpLink.js";
import { standardHelp, teamsHelp } from "../helpAddress.js";
import { go } from "../navigation.js";
import { knows, say } from "../words.js";
import "./tournamentForm.css";
import { Tick } from "../RulesTicks.js";

// The form a tournament is created with (new.feature) and changed with
// (edit.feature): one form, so that the two cannot come to ask different
// things. It asks for what the website offers, which it asks the API for
// rather than knowing, so that it offers exactly what creating or changing a
// tournament accepts, and names each choice in the reader's language as it
// offers it.

interface Offered {
  readonly sports: readonly { readonly code: string; readonly name: string }[];
  readonly formats: readonly {
    readonly code: string;
    readonly name: string;
    /** Whether it is played by teams, and so has tests to draw. */
    readonly teams: boolean;
    /** Whether a tournament in it draws a level test unless said not to. */
    readonly drawsLevelTests: boolean;
  }[];
  readonly countries: readonly {
    readonly code: string;
    readonly name: string;
    readonly regions: readonly {
      readonly code: string;
      readonly name: string;
    }[];
  }[];
}

// The field each of the tournament's own refusals is about, since it names a
// rule of the values together rather than a field. One not here is said above
// the fields.
const fieldOfRefusal: Readonly<Record<string, string>> = {
  "Tournament.FinishesBeforeStarts": "finishes",
  "Tournament.StartsAfterNextYear": "starts",
  "Tournament.FinishesAfterNextYear": "finishes",
  "Tournament.RegionNotInCountry": "region",
  "Tournament.SportNotOffered": "sport",
  "Tournament.FormatNotOffered": "format",
  "Tournament.NationalAndInternational": "international",
};

// What a refusal says to the reader: its words, by its code, or the words for
// any where it has none. The code is the contract; the words are only what it
// says.
const wordsFor = (code: string): string =>
  say(knows(code) ? code : "admin.tournament.otherwise");

const refusal = (code: string): Refusal => ({
  code,
  words: wordsFor(code),
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

// The first day of the month it is by the reader's own clock, as a date:
// `2026-11-01`. Theirs rather than the server's, which reads in UTC: a reader
// early on the first of a month, ahead of UTC, would otherwise be offered the
// month before.
const thisMonthBegins = (): string => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${String(now.getFullYear())}-${month}-01`;
};

// How many names are suggested at most: more than a phone's screen holds is a
// list to scroll rather than one to glance at, and the reader who has not found
// theirs types another word.
const mostSuggested = 6;

// The names that have every word typed somewhere in them, in any order and
// any case, so that "CNSW Bronze" finds "CNSW AC Bronze Medal". A name that
// begins with what was typed would not, which is what a reader who remembers
// some of the words and not the rest is after. A name that is what was typed
// has nothing left to suggest.
const suggestionsFor = (
  typed: string,
  names: readonly string[],
  own: string | undefined,
): string[] => {
  const words = typed.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return names
    .filter((each) => {
      const lower = each.toLowerCase();
      return (
        each !== typed.trim() &&
        each !== own &&
        words.every((word) => lower.includes(word))
      );
    })
    .slice(0, mostSuggested);
};

/** What the form begins as: a tournament as it is, when one is being changed. */
export interface Begins {
  readonly name: string;
  readonly starts: string;
  readonly finishes: string;
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  /** Nothing where the tournament is in no region. */
  readonly region: string | undefined;
  readonly subtitle: string | undefined;
  readonly levelTestsDrawn: boolean;
  readonly national: boolean;
  readonly international: boolean;
}

interface Props {
  readonly title: string;
  /**
   * The page of the help for what the form does, which the title bar's help
   * icon leads to: the guide for the kind of tournament chosen.
   */
  readonly helpPage: "creating-a-tournament" | "changing-and-archiving";
  /** The words on the one button, which says what the form does. */
  readonly button: string;
  /** What that button says, when it is pointed at. */
  readonly hover: string;
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
  helpPage,
  button,
  hover,
  begins,
  send,
}: Props): React.JSX.Element => {
  const [offered, setOffered] = useState<Offered | undefined>();
  const [name, setName] = useState(begins?.name ?? "");
  const [starts, setStarts] = useState(begins?.starts ?? "");
  const [finishes, setFinishes] = useState(begins?.finishes ?? "");
  // Whether the reader has chosen a finish. Until they have, a new tournament's
  // finish is its start, and moves with it; a tournament being changed has
  // chosen already.
  const [finishChosen, setFinishChosen] = useState(begins !== undefined);
  const [sport, setSport] = useState(begins?.sport ?? "");
  const [format, setFormat] = useState(begins?.format ?? "");
  const [country, setCountry] = useState(begins?.country ?? "");
  const [region, setRegion] = useState(begins?.region ?? "");
  const [subtitle, setSubtitle] = useState(begins?.subtitle ?? "");
  // Unsaid until the reader ticks or unticks it, when it is whatever the
  // format draws to begin with; a tournament being changed has said already.
  const [levelTestsSaid, setLevelTestsSaid] = useState<boolean | undefined>(
    begins?.levelTestsDrawn,
  );
  const [national, setNational] = useState(begins?.national ?? false);
  const [international, setInternational] = useState(
    begins?.international ?? false,
  );
  const [refused, setRefused] = useState<{
    byField: Record<string, Refusal[]>;
    above: Refusal[];
  }>({ byField: {}, above: [] });
  // What the website's tournaments are called, to suggest from, and whether the
  // suggestions are shown and which the keys are on. They are shown as the
  // reader types and put away by choosing one, leaving the field or Escape.
  const [names, setNames] = useState<readonly string[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const [active, setActive] = useState(-1);
  const [namesKnown, setNamesKnown] = useState<"unasked" | "asking" | "known">(
    "unasked",
  );
  const suggestionsId = useId();
  const [sending, setSending] = useState(false);
  // What stops a second send, where `sending` only says one is under way. A
  // double click or a second Enter can arrive before the form has drawn itself
  // again, and so before `sending` has changed for it; a ref is changed at once.
  const inFlight = useRef(false);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    void fetch("/api/site/tournaments/new", {
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
        // Read once, so that a clock that crosses into the next month between
        // two reads cannot give a start and a finish in different ones.
        const monthBegins = thisMonthBegins();
        setStarts(monthBegins);
        setFinishes(monthBegins);
        setSport(answer.sports[0]?.code ?? "");
        setFormat(answer.formats[0]?.code ?? "");
      })
      .catch(() => {
        // Nothing to offer, and so no form: there is nothing it could create.
      });
  }, [begins]);

  // Asked when the reader first types in the name and not when the form opens:
  // a website has thousands of names, and a reader who never types there has
  // no use for them.
  useEffect(() => {
    if (!suggesting || namesKnown !== "unasked") return;
    setNamesKnown("asking");
    void fetch("/api/site/tournaments/names", {
      headers: { accept: "application/json" },
    })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { names: string[] })
          : undefined,
      )
      .then((answer) => {
        if (answer !== undefined) setNames(answer.names);
      })
      .catch(() => {
        // Nothing to suggest, which leaves the field as any other is.
      })
      // Said once it has finished whichever way it went, which is what a
      // scenario that a name is not suggested waits for (new.feature).
      .finally(() => {
        setNamesKnown("known");
      });
  }, [suggesting, namesKnown]);

  // The reader is taken to the first field that needs attention, as every
  // refused form takes them (STYLE.md §5b).
  useLayoutEffect(() => {
    form.current
      ?.querySelector<HTMLElement>('[aria-invalid="true"], .dialog-problems')
      ?.focus();
  }, [refused]);

  // The name the keys are on stays in view, as a list that scrolls is for.
  useEffect(() => {
    if (active >= 0) {
      document
        .getElementById(`${suggestionsId}-${String(active)}`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [active, suggestionsId]);
  if (offered === undefined) return <main id="content" />;

  const regions =
    offered.countries.find(({ code }) => code === country)?.regions ?? [];
  // A country that is not divided is its own one region, and there is
  // nothing to ask.
  const asksForRegion = regions.length > 1;
  // Only a tournament played by teams has tests, and saying one that is not
  // draws them is refused (create.feature), so the form does not ask.
  const formatChosen = offered.formats.find(({ code }) => code === format);
  const playedByTeams = (
    begins === undefined
      ? formatChosen
      : offered.formats.find(({ code }) => code === begins.format)
  )?.teams;
  const asksAboutLevelTests = formatChosen?.teams ?? false;
  const levelTestsDrawn =
    levelTestsSaid ?? formatChosen?.drawsLevelTests ?? false;

  // A tournament being changed is not offered its own name, which is the one
  // it has.
  const suggestions = suggesting
    ? suggestionsFor(name, names, begins?.name)
    : [];
  const choose = (chosen: string): void => {
    setName(chosen);
    setSuggesting(false);
    setActive(-1);
  };

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
        subtitle,
        ...(asksAboutLevelTests ? { levelTestsDrawn } : {}),
        national,
        international,
      });
      const answer: unknown = await response.json();
      if (response.ok) {
        // Left sending, and refusing a second send, since the form is gone
        // once the admin has moved to the tournament.
        go(`/admin/${(answer as { address: string }).address}`);
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
          <h1 className="dialog-title dialog-title-with-help" id="dialog-title">
            {title}
          </h1>
          {/* A tournament played by teams has a guide of its own, so which is
              led to follows the format chosen; until one is chosen, the guide
              for the ordinary kind. A tournament being changed is of the kind
              it was saved as and not the one a draft would make it, so the
              link does not move under the reader. */}
          <HelpLink to={(playedByTeams ? teamsHelp : standardHelp)(helpPage)} />
          <form
            className="dialog-form"
            data-names={namesKnown}
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
              <Field
                name="name"
                label={say("admin.tournament.name")}
                refused={said("name")}
              >
                {(tied) => (
                  <>
                    <input
                      {...tied}
                      type="text"
                      placeholder=" "
                      autoComplete="off"
                      // The first field, where the reader is taken when the
                      // form arrives, as every form that is a page's purpose
                      // takes them (form.feature).
                      autoFocus
                      role="combobox"
                      aria-expanded={suggestions.length > 0}
                      aria-controls={
                        suggestions.length > 0 ? suggestionsId : undefined
                      }
                      aria-autocomplete="list"
                      aria-activedescendant={
                        active >= 0 && suggestions.length > 0
                          ? `${suggestionsId}-${String(active)}`
                          : undefined
                      }
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setSuggesting(true);
                        setActive(-1);
                      }}
                      onBlur={() => {
                        setSuggesting(false);
                        setActive(-1);
                      }}
                      onKeyDown={(event) => {
                        // Not the Enter that ends a composition in an input method, which
                        // confirms what was composed and is not a choice.
                        if (
                          suggestions.length === 0 ||
                          event.nativeEvent.isComposing
                        )
                          return;
                        const chosen = suggestions[active];
                        if (event.key === "ArrowDown") {
                          event.preventDefault();
                          setActive((now) =>
                            Math.min(now + 1, suggestions.length - 1),
                          );
                        } else if (event.key === "ArrowUp") {
                          event.preventDefault();
                          setActive((now) => Math.max(now - 1, -1));
                        } else if (
                          event.key === "Enter" &&
                          chosen !== undefined
                        ) {
                          // Choosing is not sending the form: only where the
                          // keys are on a name to choose.
                          event.preventDefault();
                          choose(chosen);
                        } else if (event.key === "Escape") {
                          // Put the list away and no more: Escape is also what closes a
                          // dialog the form may be in.
                          event.preventDefault();
                          event.stopPropagation();
                          setSuggesting(false);
                          setActive(-1);
                        }
                      }}
                    />
                    {/* Drawn beneath the field, in the page's own words and not
                      the list a browser draws, which narrows itself to names
                      that begin with what is typed. The mouse press does not
                      take the focus from the field, which would put the list
                      away before the click that chooses reached it. */}
                    {suggestions.length > 0 ? (
                      <ul
                        id={suggestionsId}
                        role="listbox"
                        className="name-suggestions"
                      >
                        {suggestions.map((each, at) => (
                          <li
                            key={each}
                            id={`${suggestionsId}-${String(at)}`}
                            role="option"
                            aria-selected={at === active}
                            onMouseDown={(event) => {
                              event.preventDefault();
                            }}
                            onClick={() => {
                              choose(each);
                            }}
                          >
                            {each}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )}
              </Field>
              {/* Side by side, on a phone as much as anywhere: when a
                  tournament starts and when it finishes are read together. */}
              <div className="field-row">
                <Field
                  name="starts"
                  label={say("admin.tournament.starts")}
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
                        // Not an emptied start: the reader is about to type
                        // another, and the finish would be lost with it.
                        if (!finishChosen && event.target.value !== "") {
                          setFinishes(event.target.value);
                        }
                      }}
                    />
                  )}
                </Field>
                <Field
                  name="finishes"
                  label={say("admin.tournament.finishes")}
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
                        // An emptied finish is one the reader has not chosen, on
                        // a new tournament, so it follows the start again. A
                        // tournament being changed has chosen its own.
                        setFinishChosen(
                          begins !== undefined || event.target.value !== "",
                        );
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
                      label={say("admin.tournament.format")}
                      refused={said("format")}
                      lifted
                    >
                      {(tied) => (
                        <select
                          {...tied}
                          value={format}
                          onChange={(event) => {
                            setFormat(event.target.value);
                            // Each format draws level tests as it does until
                            // the reader says otherwise for the one chosen.
                            setLevelTestsSaid(undefined);
                          }}
                        >
                          {offered.formats.map(({ code, name: called }) => (
                            <option key={code} value={code}>
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
                      label={say("admin.tournament.sport")}
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
                  label={say("admin.tournament.country")}
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
                      <GroupedOptions
                        groups={inCountryGroups(
                          offered.countries,
                          document.documentElement.lang || "en",
                        )}
                      />
                    </select>
                  )}
                </Field>
                {asksForRegion ? (
                  <Field
                    name="region"
                    label={say("admin.tournament.region")}
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
              <Field
                name="subtitle"
                label={say("admin.tournament.subtitle")}
                refused={said("subtitle")}
                lifted
              >
                {(tied) => (
                  <textarea
                    {...tied}
                    rows={4}
                    value={subtitle}
                    onChange={(event) => {
                      setSubtitle(event.target.value);
                    }}
                  />
                )}
              </Field>
              {asksAboutLevelTests ? (
                <Tick
                  name="levelTestsDrawn"
                  label={say("admin.tournament.levelTestsDrawn")}
                  ticked={levelTestsDrawn}
                  tick={setLevelTestsSaid}
                />
              ) : null}
              {/* Never both: a tournament said to be both is refused, so
                  ticking one unticks the other rather than letting the reader
                  tick both and then be told it cannot be done. */}
              <Tick
                name="national"
                label={say("admin.tournament.national")}
                ticked={national}
                tick={(ticked) => {
                  setNational(ticked);
                  if (ticked) setInternational(false);
                }}
              />
              <Tick
                name="international"
                label={say("admin.tournament.international")}
                ticked={international}
                tick={(ticked) => {
                  setInternational(ticked);
                  if (ticked) setNational(false);
                }}
              />
            </div>
            <div className="dialog-buttons">
              <button
                className="button button-submit"
                type="submit"
                title={hover}
              >
                {button}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
};
