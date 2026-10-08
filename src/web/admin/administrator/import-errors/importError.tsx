import { useEffect, useState } from "react";

import { refusalOf } from "../../api.js";
import { knows, say } from "../../words.js";
import "./importErrors.css";

// What the import said of one document it refused (importError.feature): the
// document's id, and every message kept against it, whole. A message is put in
// as text and never as markup, since it was written by the code that failed.

interface ImportErrorOfDocument {
  readonly documentId: string;
  readonly messages: readonly string[];
}

interface Props {
  /** The document's id, as the address writes it. */
  readonly document: string;
}

export const ImportError = ({ document }: Props): React.JSX.Element => {
  const [kept, setKept] = useState<ImportErrorOfDocument | undefined>();
  const [refused, setRefused] = useState<string | undefined>();

  useEffect(() => {
    let current = true;
    void fetch(`/api/v1/import-errors/${encodeURIComponent(document)}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (response.ok) {
          const body = (await response.json()) as ImportErrorOfDocument;
          if (current) setKept(body);
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
  }, [document]);

  return (
    <div className="stack" aria-busy={kept === undefined && !refused}>
      <h1>{say("admin.importError.title")}</h1>
      {refused !== undefined ? (
        <p className="refused" data-refused={refused}>
          {say(knows(refused) ? refused : "admin.importErrors.otherwise")}
        </p>
      ) : kept === undefined ? null : (
        <>
          <p>
            <span>{say("admin.importError.documentId")}: </span>
            <strong className="import-error-document-id">
              {kept.documentId}
            </strong>
          </p>
          {kept.messages.map((message, index) => (
            <pre key={index} className="import-error-message">
              {message}
            </pre>
          ))}
        </>
      )}
    </div>
  );
};
