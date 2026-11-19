import { useEffect, useState } from "react";

import { idInAddress } from "../../api.js";
import { Field, type Refusal } from "../../Field.js";
import { knows, say } from "../../words.js";
import "./apiKeys.css";

// The page where an administrator sees the keys that work, of every account,
// and changes how many requests one may make a minute and a day
// (apiKeys.feature). The keys are grouped by the name of their account, each
// group a table with a row for each key: what it is called, the two limits as
// fields, and Save. Raising a limit for one partner needs no code to change,
// which is what the page is for.

/** What the API says of a key that works. */
interface Key {
  readonly id: string;
  readonly owner: string;
  readonly label: string;
  readonly mayWrite: boolean;
  readonly perMinute: number;
  readonly perDay: number;
  readonly madeAt: string;
}

// A refusal in its own words, or in the words for any.
const refusal = (code: string): Refusal => ({
  code,
  words: say(knows(code) ? code : "admin.apiKeys.otherwise"),
});

// The rules the limits broke, as the API names them, or the one code it
// refused with where it named none.
const refusalsOf = async (response: Response): Promise<readonly Refusal[]> => {
  try {
    const answer = (await response.json()) as {
      error?: string;
      broken?: readonly { code?: string }[];
    };
    const broken = (answer.broken ?? []).flatMap(({ code }) =>
      code === undefined ? [] : [code],
    );
    return (broken.length > 0 ? broken : [answer.error ?? "Unknown"]).map(
      refusal,
    );
  } catch {
    return [refusal("Unknown")];
  }
};

// One key's row. Its fields and Save belong to a form of the row's own, which
// is tied to them by id, since a form cannot stand between a table's cells.
const KeyRow = ({
  made,
  saved,
}: {
  readonly made: Key;
  readonly saved: () => void;
}): React.JSX.Element => {
  const [perMinute, setPerMinute] = useState(String(made.perMinute));
  const [perDay, setPerDay] = useState(String(made.perDay));
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const form = `limits-${idInAddress(made.id)}`;

  const save = async (): Promise<void> => {
    setRefused([]);
    try {
      const response = await fetch("/api/site/api-keys/limits", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          keyId: made.id,
          // A number that is not whole, or none, is sent as it is typed so
          // that the site's own rules refuse it, in their own words.
          perMinute: Number(perMinute),
          perDay: Number(perDay),
        }),
      });
      if (response.ok) saved();
      else setRefused(await refusalsOf(response));
    } catch {
      setRefused([refusal("Unknown")]);
    }
  };

  // A limit's refusal is said beneath its field. Any other, such as the
  // reader no longer being an administrator, is not about either.
  const aboutMinute = refused.filter(
    ({ code }) => code === "ApiKeyLimits.NoneAMinute",
  );
  const aboutDay = refused.filter(
    ({ code }) => code === "ApiKeyLimits.NoneADay",
  );
  const aboutNeither = refused.filter(
    ({ code }) =>
      code !== "ApiKeyLimits.NoneAMinute" && code !== "ApiKeyLimits.NoneADay",
  );

  return (
    <tr data-key={made.id}>
      <th scope="row">
        <span data-label>{made.label}</span>
        <span
          className="api-key-limits-scope"
          data-scope={made.mayWrite ? "write" : "read"}
        >
          {say(
            made.mayWrite
              ? "admin.apiKeys.mayReadAndWrite"
              : "admin.apiKeys.mayRead",
          )}
        </span>
        <form
          id={form}
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        />
        {aboutNeither.length === 0 ? null : (
          <span
            className="people-refused"
            data-refused={aboutNeither.map(({ code }) => code).join(" ")}
          >
            {aboutNeither.map(({ words }) => words).join(" ")}
          </span>
        )}
      </th>
      <td>
        <Field
          name={`${form}-perMinute`}
          label={say("admin.apiKeys.perMinute")}
          refused={aboutMinute}
          unlabelled
        >
          {(tied) => (
            <input
              {...tied}
              form={form}
              type="text"
              inputMode="numeric"
              name="perMinute"
              placeholder=" "
              autoComplete="off"
              value={perMinute}
              onChange={(event) => {
                setPerMinute(event.target.value);
                setRefused([]);
              }}
            />
          )}
        </Field>
      </td>
      <td>
        <Field
          name={`${form}-perDay`}
          label={say("admin.apiKeys.perDay")}
          refused={aboutDay}
          unlabelled
        >
          {(tied) => (
            <input
              {...tied}
              form={form}
              type="text"
              inputMode="numeric"
              name="perDay"
              placeholder=" "
              autoComplete="off"
              value={perDay}
              onChange={(event) => {
                setPerDay(event.target.value);
                setRefused([]);
              }}
            />
          )}
        </Field>
      </td>
      <td>
        <button className="button button-submit" type="submit" form={form}>
          {say("admin.apiKeys.save")}
        </button>
      </td>
    </tr>
  );
};

// The keys grouped by the name of their account, the names in alphabetical
// order and each account's keys in the order they were made.
const byOwner = (
  keys: readonly Key[],
): readonly (readonly [string, Key[]])[] => {
  const groups = new Map<string, Key[]>();
  for (const made of keys) {
    groups.set(made.owner, [...(groups.get(made.owner) ?? []), made]);
  }
  return [...groups.entries()].sort(([one], [other]) =>
    one.localeCompare(other),
  );
};

export const ApiKeys = (): React.JSX.Element => {
  const [keys, setKeys] = useState<readonly Key[] | undefined>(undefined);
  const [problem, setProblem] = useState<Refusal | undefined>(undefined);
  // Counted, so that asking again after a save fetches the keys afresh.
  const [asked, setAsked] = useState(0);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/site/api-keys", {
          headers: { accept: "application/json" },
        });
        if (response.ok) {
          setKeys(((await response.json()) as { keys: Key[] }).keys);
        } else {
          setProblem((await refusalsOf(response))[0]);
        }
      } catch {
        setProblem(refusal("Unknown"));
      }
    })();
  }, [asked]);

  return (
    <div className="stack">
      <h1>{say("admin.apiKeys.title")}</h1>
      {problem === undefined ? null : (
        <p className="people-refused" data-refused={problem.code}>
          {problem.words}
        </p>
      )}
      {keys === undefined ? null : keys.length === 0 ? (
        <p data-none>{say("admin.apiKeys.none")}</p>
      ) : (
        byOwner(keys).map(([owner, theirs]) => (
          <section className="stack" key={owner} data-owner={owner}>
            <h2 className="people-heading">{owner}</h2>
            <table className="api-key-limits">
              <thead>
                <tr>
                  <th scope="col">{say("admin.apiKeys.keyName")}</th>
                  <th scope="col">{say("admin.apiKeys.perMinute")}</th>
                  <th scope="col">{say("admin.apiKeys.perDay")}</th>
                  <td />
                </tr>
              </thead>
              <tbody>
                {theirs.map((made) => (
                  // Keyed by the limits it holds as well as the key, so that
                  // a row is drawn afresh with what the site now says once a
                  // save has changed them, and not with what was typed.
                  <KeyRow
                    key={`${made.id}-${String(made.perMinute)}-${String(made.perDay)}`}
                    made={made}
                    saved={() => setAsked(asked + 1)}
                  />
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}
    </div>
  );
};
