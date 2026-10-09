import { useEffect, useState } from "react";

import { refusalOf } from "../../api.js";
import { knows, say } from "../../words.js";
import "./importErrors.css";

// What the import said of one document it refused (importError.feature): the
// document's id, the tournament it is of and the competition it was, where the
// import knew them, with links to the tournament on this site and on the old
// site, which share its address, and every message kept against it, whole. A
// message is put in as text and never as markup, since it was written by the
// code that failed.

interface ImportErrorOfDocument {
  readonly documentId: string;
  readonly messages: readonly string[];
  readonly tournament?: {
    readonly website: string;
    readonly address: string;
    readonly name: string;
    readonly competitionName?: string;
  };
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
          {kept.tournament === undefined ? null : (
            <>
              <p>
                <span>{say("admin.importError.tournament")}: </span>
                <strong className="import-error-tournament">
                  {kept.tournament.name}
                </strong>
              </p>
              {kept.tournament.competitionName === undefined ? null : (
                <p>
                  <span>{say("admin.importError.competition")}: </span>
                  <strong className="import-error-competition">
                    {kept.tournament.competitionName}
                  </strong>
                </p>
              )}
              <p className="import-error-links">
                <a
                  className="import-error-on-this-site"
                  href={`/${kept.tournament.address}`}
                >
                  {say("admin.importError.onThisSite")}
                </a>{" "}
                <a
                  className="import-error-on-the-old-site"
                  href={`https://${kept.tournament.website}/${kept.tournament.address}`}
                >
                  {say("admin.importError.onTheOldSite")}
                </a>
              </p>
            </>
          )}
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
