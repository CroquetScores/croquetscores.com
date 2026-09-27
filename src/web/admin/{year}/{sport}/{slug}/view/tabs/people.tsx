import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../../../../Field.js";
import { ModalDialog } from "../../../../../ModalDialog.js";
import { knows, say } from "../../../../../words.js";
import "./listed.css";

// The Managers and Scorers tabs (managers-tab.feature, scorers-tab.feature),
// which are one tab for two parts a reader can have in a tournament: somebody
// is made one by their email address, in the field above the list, and taken
// off by Remove, which asks first, since what it does is gone rather than set
// aside. Written once for both, so that they cannot come to differ except
// where a manager differs from a scorer.

/** Somebody with a part in the tournament, as the API lists them. */
export interface Person {
  readonly id: string;
  readonly name: string;
  /** Whether it is the reader, which only a manager can be. */
  readonly isReader?: boolean;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Which part: what the API calls it, and what its words are under. */
  readonly part: "managers" | "scorers";
  /** Whether `person`, of `everybody`, is offered Remove. */
  readonly removable: (person: Person, everybody: readonly Person[]) => boolean;
  /** What the dialog asking first says about taking `person` off. */
  readonly explanation: (person: Person) => string;
  /** Once `person` is taken off, what happens next. */
  readonly removed?: (person: Person) => void;
}

// The part of an id after its kind, which is how the API names a tournament
// or an account, so that each is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

export const PeopleTab = ({
  tournament,
  part,
  removable,
  explanation,
  removed,
}: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Person[] | undefined>();
  // Counted up to ask again, once somebody is made one or taken off.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [sending, setSending] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [removing, setRemoving] = useState<Person | undefined>();
  const field = useRef<HTMLInputElement>(null);
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/${part}`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as Record<string, Person[]>)[part]
          : undefined,
      )
      .catch(() => undefined)
      .then((people) => {
        if (!current) return;
        setListed(people);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, part, asking]);

  // A refusal by its code, in its own words or in the words for any.
  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : `admin.${part}.otherwise`),
  });

  const add = async (): Promise<void> => {
    if (sending) return;
    setSending(true);
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

  const remove = async (person: Person): Promise<void> => {
    setRemoving(undefined);
    setSending(true);
    try {
      const response = await fetch(`${at}/${idInAddress(person.id)}/remove`, {
        method: "POST",
      });
      if (response.ok) removed?.(person);
    } catch {
      // A request that never arrived is said by the list asked for again.
    }
    setAsking((count) => count + 1);
    setSending(false);
  };

  return (
    <section
      className="stack people-tab"
      aria-busy={sending || answered !== asking}
    >
      {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
      <form
        className="tab-form stack"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          void add();
        }}
      >
        <Field
          name="emailAddress"
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
          {say(`admin.${part}.add`)}
        </button>
      </form>
      {listed === undefined ? null : listed.length === 0 ? (
        <p className="listed-none">{say(`admin.${part}.none`)}</p>
      ) : (
        <ul className="listed" data-listed={part}>
          {listed.map((person) => (
            <li key={person.id} className="listed-item">
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
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      )}
      {removing === undefined ? null : (
        <ModalDialog
          title={say(`admin.${part}.removeTitle`)}
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
