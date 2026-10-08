import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../Field.js";
import { ModalDialog } from "../../../../../ModalDialog.js";
import { knows, say } from "../../../../../words.js";
import { noOption } from "./optionFace.js";
import "./listed.css";
import "./people.css";

// Somebody given a part by their email address, in a field beside the list,
// and the part taken by Remove, which asks first, since what it does is gone
// rather than set aside. A tournament's Managers and Scorers tabs
// (managers-tab.feature, scorers-tab.feature) and each role's section of the
// accounts page (accounts.feature) are all this, so it is written once for the
// four, and they cannot come to differ except where one part differs from
// another.

/** Somebody with the part, as the API lists them. */
export interface Person {
  readonly id: string;
  readonly name: string;
  /** Whether it is the reader, which only a manager can be. */
  readonly isReader?: boolean;
}

/** What a part's words are, by the key each is under. */
interface Words {
  readonly add: string;
  readonly none: string;
  readonly removeTitle: string;
  /** For a refusal beneath the field with no words of its own. */
  readonly otherwise: string;
}

interface Props {
  /** Where they are listed, and where somebody is given the part or has it taken. */
  readonly at: string;
  /** What the API lists them under. */
  readonly listedUnder: string;
  /**
   * What the list and its field are known by, which tells two apart where a
   * page has more than one.
   */
  readonly name: string;
  /** Its heading, where it is one of a page's sections rather than a tab. */
  readonly heading?: string;
  /**
   * Whether the field is above the list. A tab's is, where a long list would
   * otherwise push it off a phone's screen; the accounts page's is beneath,
   * in the order that page was asked for.
   */
  readonly fieldAbove: boolean;
  readonly words: Words;
  /** Whether `person`, of `everybody`, is offered Remove. Everybody is, unless said. */
  readonly removable?: (
    person: Person,
    everybody: readonly Person[],
  ) => boolean;
  /** What the dialog asking first says about taking the part from `person`. */
  readonly explanation: (person: Person) => string;
  /** Once `person` no longer has the part, what happens next. */
  readonly removed?: (person: Person) => void;
}

/**
 * The part of an id after its kind, which is how the API names a tournament
 * or an account, so that each is one segment of an address.
 */
export const idInAddress = (id: string): string =>
  id.slice(id.indexOf("/") + 1);

// The code a refusal was answered with, or "Unknown" where it was answered
// with none, as a failure of the site's is, so that something is always said.
const refusalOf = async (response: Response): Promise<string> => {
  try {
    return ((await response.json()) as { error?: string }).error ?? "Unknown";
  } catch {
    return "Unknown";
  }
};

export const People = ({
  at,
  listedUnder,
  name,
  heading,
  fieldAbove,
  words,
  removable = () => true,
  explanation,
  removed,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Person[] | undefined>();
  // Counted up to ask again, once somebody is given the part or has it taken.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  // How many Adds and Removes are under way, counted rather than flagged so
  // that one answered does not say the list is done while another is not.
  const [sending, setSending] = useState(0);
  const [emailAddress, setEmailAddress] = useState("");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [removing, setRemoving] = useState<Person | undefined>();
  // What was refused other than the address, by its code: a Remove, or the
  // list, whether the reader is no longer allowed it or the site failed.
  const [refusedHere, setRefusedHere] = useState<string | undefined>();
  // Its own flag rather than `sending`, which a Remove sets too: an Add sent
  // while a Remove is under way is sent, not dropped without a word.
  const adding = useRef(false);
  const field = useRef<HTMLInputElement>(null);
  const headingId = `${name}-heading`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) => {
        if (response.ok) {
          return ((await response.json()) as Record<string, Person[]>)[
            listedUnder
          ];
        }
        const code = await refusalOf(response);
        if (current) setRefusedHere(code);
        return undefined;
      })
      .catch(() => {
        if (current) setRefusedHere("Unknown");
        return undefined;
      })
      .then((people) => {
        if (!current) return;
        setListed(people);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, listedUnder, asking]);

  // A refusal by its code, in its own words or in `otherwise`'s.
  const refusal = (code: string, otherwise: string): Refusal => ({
    code,
    words: say(knows(code) ? code : otherwise),
  });

  const add = async (): Promise<void> => {
    if (adding.current) return;
    adding.current = true;
    setRefusedHere(undefined);
    setSending((count) => count + 1);
    try {
      const response = await fetch(at, {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({ emailAddress }),
      });
      if (response.ok) {
        // Emptied for the next, with the reader back in it.
        setEmailAddress("");
        setRefused([]);
        setAsking((count) => count + 1);
        field.current?.focus();
      } else {
        const answer = (await response.json()) as {
          error?: string;
          broken?: { code: string }[];
        };
        setRefused(
          answer.broken?.map(({ code }) => refusal(code, words.otherwise)) ?? [
            refusal(answer.error ?? "Unknown", words.otherwise),
          ],
        );
      }
    } catch {
      setRefused([refusal("Unknown", words.otherwise)]);
    }
    adding.current = false;
    setSending((count) => count - 1);
  };

  const remove = async (person: Person): Promise<void> => {
    setRemoving(undefined);
    setRefusedHere(undefined);
    setSending((count) => count + 1);
    try {
      const response = await fetch(`${at}/${idInAddress(person.id)}/remove`, {
        method: "POST",
        headers: { accept: "application/json" },
      });
      if (response.ok) removed?.(person);
      else setRefusedHere(await refusalOf(response));
    } catch {
      // A request that never arrived is said by the list asked for again.
    }
    setAsking((count) => count + 1);
    setSending((count) => count - 1);
  };

  const form = (
    <form
      className="tab-form stack"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void add();
      }}
    >
      <Field
        name={`${name}-emailAddress`}
        label={say("admin.people.emailAddress")}
        refused={refused}
      >
        {(tied) => (
          <input
            {...tied}
            ref={field}
            type="email"
            name="emailAddress"
            placeholder=" "
            autoComplete="off"
            value={emailAddress}
            onChange={(event) => {
              setEmailAddress(event.target.value);
              // What was refused was the address as it was.
              setRefused([]);
            }}
          />
        )}
      </Field>
      <button className="button button-submit" type="submit">
        {say(words.add)}
      </button>
    </form>
  );

  return (
    <section
      className={heading === undefined ? "people" : "people people-headed"}
      aria-labelledby={heading === undefined ? undefined : headingId}
      aria-busy={sending > 0 || answered !== asking}
    >
      {heading === undefined ? null : (
        <h2 id={headingId} className="people-heading">
          {heading}
        </h2>
      )}
      <div className="people-body stack">
        {fieldAbove ? form : null}
        {/* Not the words for a refused address, which this is not. */}
        {refusedHere === undefined ? null : (
          <p className="people-refused" data-refused={refusedHere}>
            {refusal(refusedHere, "admin.people.otherwise").words}
          </p>
        )}
        {listed === undefined ? null : listed.length === 0 ? (
          <p className="listed-none">{say(words.none)}</p>
        ) : (
          <ul className="listed" data-listed={name}>
            {listed.map((person) => (
              <li
                key={person.id}
                className="listed-item"
                data-reader={person.isReader === true ? "" : undefined}
              >
                <span className="listed-name">{person.name}</span>
                {person.isReader === true ? (
                  <span className="listed-about">
                    {say("admin.managers.you")}
                  </span>
                ) : null}
                <span className="listed-options">
                  {removable(person, listed) ? (
                    <button
                      type="button"
                      className="button"
                      onClick={() => {
                        setRemoving(person);
                      }}
                    >
                      {say("admin.people.remove")}
                    </button>
                  ) : listed.some((other) => removable(other, listed)) ? (
                    // Its room, where others offer Remove, so that what is
                    // beside it lines up with theirs (optionFace.tsx).
                    noOption("remove", say("admin.people.remove"))
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
        {fieldAbove ? null : form}
      </div>
      {removing === undefined ? null : (
        <ModalDialog
          title={say(words.removeTitle)}
          action={say("admin.people.remove")}
          act={() => void remove(removing)}
          cancel={() => {
            setRemoving(undefined);
          }}
        >
          <p>{explanation(removing)}</p>
        </ModalDialog>
      )}
    </section>
  );
};
