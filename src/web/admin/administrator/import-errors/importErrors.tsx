import { useEffect, useState } from "react";

import { refusalOf } from "../../api.js";
import { knows, say } from "../../words.js";
import "./importErrors.css";

// The documents the import refused (importErrors.feature): a row for each
// document, its id, what went wrong said for a person where the import said
// it so, and the first line of what the import said first, in the order the
// API sends them, which is by the documents' ids. A row is one link, to the page of its document
// (importError.tsx).

interface KeptImportError {
  readonly documentId: string;
  readonly firstLine: string;
  readonly summary?: string;
}

export const ImportErrors = (): React.JSX.Element => {
  const [errors, setErrors] = useState<
    readonly KeptImportError[] | undefined
  >();
  const [refused, setRefused] = useState<string | undefined>();

  useEffect(() => {
    let current = true;
    void fetch("/api/v1/import-errors", {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (response.ok) {
          const body = (await response.json()) as {
            errors: KeptImportError[];
          };
          if (current) setErrors(body.errors);
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
  }, []);

  return (
    <div className="stack" aria-busy={errors === undefined && !refused}>
      <h1>{say("admin.importErrors.title")}</h1>
      {refused !== undefined ? (
        <p className="refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.importErrors.otherwise")}
        </p>
      ) : errors === undefined ? null : errors.length === 0 ? (
        <p data-none="">{say("admin.importErrors.none")}</p>
      ) : (
        <ul className="import-errors">
          {errors.map((error, index) => (
            <li key={index}>
              {/* A slash in an id is written as %2F, so that the id stays one
                  segment of the address. */}
              <a
                className="import-error"
                href={`/admin/administrator/import-errors/${encodeURIComponent(error.documentId)}`}
              >
                <span className="import-error-document">
                  {error.documentId}
                </span>
                <span className="import-error-said">
                  {error.summary === undefined ? null : (
                    <span className="import-error-summary">
                      {error.summary}
                    </span>
                  )}
                  <span className="import-error-first-line">
                    {error.firstLine}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
