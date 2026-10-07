import { useEffect, useRef, useState } from "react";

import { Field, type Refusal } from "../../Field.js";
import { ModalDialog } from "../../ModalDialog.js";
import { knows, say } from "../../words.js";
import "../../{year}/{sport}/{slug}/view/tabs/listed.css";
import "./accounts.css";

// The accounts page (accounts.feature): a section for each role, laid out and
// behaving the same way, so written once for both. Each lists the accounts
// holding its role with Remove beside each, which asks first, since what it
// does is gone rather than set aside; and beneath the list, a field for an
// email address and Add, in the order the page was asked for.

type Role = "administrator" | "world-ranking-officer";

/** An account holding a role, as the API lists them. */
interface Holder {
  readonly id: string;
  readonly name: string;
}

// The part of an id after its kind, which is how the API names an account, so
// that it is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

// The code a refusal was answered with, or "Unknown" where it was answered
// with none, as a failure of the site's is, so that something is always said.
const refusalOf = async (response: Response): Promise<string> => {
  try {
    return ((await response.json()) as { error?: string }).error ?? "Unknown";
  } catch {
    return "Unknown";
  }
};

const RoleSection = ({ role }: { readonly role: Role }): React.JSX.Element => {
  const [listed, setListed] = useState<readonly Holder[] | undefined>();
  // Counted up to ask again, once the role is given or taken.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [sending, setSending] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [removing, setRemoving] = useState<Holder | undefined>();
  // What the section as a whole was refused, by its code: a Remove, or the
  // list, whether the reader is no longer allowed it or the site failed.
  const [refusedHere, setRefusedHere] = useState<string | undefined>();
  // Its own flag rather than `sending`, which a Remove sets too: an Add sent
  // while a Remove is under way is sent, not dropped without a word.
  const adding = useRef(false);
  const field = useRef<HTMLInputElement>(null);
  const at = `/api/v1/roles/${role}/accounts`;
  const heading = `role-${role}`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) => {
        if (response.ok) {
          return ((await response.json()) as { accounts: Holder[] }).accounts;
        }
        const code = await refusalOf(response);
        if (current) setRefusedHere(code);
        return undefined;
      })
      .catch(() => {
        if (current) setRefusedHere("Unknown");
        return undefined;
      })
      .then((accounts) => {
        if (!current) return;
        setListed(accounts);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, asking]);

  // A refusal by its code, in its own words or in the words for any.
  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.roles.otherwise"),
  });

  const add = async (): Promise<void> => {
    if (adding.current) return;
    adding.current = true;
    setRefusedHere(undefined);
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
    adding.current = false;
    setSending(false);
  };

  const remove = async (holder: Holder): Promise<void> => {
    setRemoving(undefined);
    setRefusedHere(undefined);
    setSending(true);
    try {
      const response = await fetch(`${at}/${idInAddress(holder.id)}/remove`, {
        method: "POST",
        headers: { accept: "application/json" },
      });
      if (!response.ok) setRefusedHere(await refusalOf(response));
    } catch {
      // A request that never arrived is said by the list asked for again.
    }
    setAsking((count) => count + 1);
    setSending(false);
  };

  return (
    <section
      className="role-section"
      data-role={role}
      aria-labelledby={heading}
      aria-busy={sending || answered !== asking}
    >
      <h2 id={heading} className="role-heading">
        {say(`admin.roles.${role}.heading`)}
      </h2>
      <div className="role-body stack">
        {refusedHere === undefined ? null : (
          <p className="role-refused" data-refused={refusedHere}>
            {refusal(refusedHere).words}
          </p>
        )}
        {listed === undefined ? null : listed.length === 0 ? (
          <p className="listed-none">{say(`admin.roles.${role}.none`)}</p>
        ) : (
          <ul className="listed" data-listed={role}>
            {listed.map((holder) => (
              <li key={holder.id} className="listed-item">
                <span className="listed-name">{holder.name}</span>
                <span className="listed-options">
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      setRemoving(holder);
                    }}
                  >
                    {say("admin.people.remove")}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
        <form
          className="role-form stack"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void add();
          }}
        >
          <Field
            name={`${role}-emailAddress`}
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
            {say("admin.roles.add")}
          </button>
        </form>
      </div>
      {removing === undefined ? null : (
        <ModalDialog
          title={say(`admin.roles.${role}.removeTitle`)}
          action={say("admin.people.remove")}
          act={() => void remove(removing)}
          cancel={() => {
            setRemoving(undefined);
          }}
        >
          <p>
            {say(`admin.roles.${role}.removeExplanation`, {
              name: removing.name,
            })}
          </p>
        </ModalDialog>
      )}
    </section>
  );
};

export const Accounts = (): React.JSX.Element => (
  <div className="stack">
    <h1>{say("admin.accounts.title")}</h1>
    <RoleSection role="administrator" />
    <RoleSection role="world-ranking-officer" />
  </div>
);
