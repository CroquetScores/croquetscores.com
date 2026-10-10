import { useEffect, useState } from "react";

import { refusalOf } from "../../api.js";
import { knows, say } from "../../words.js";
import "./importErrors.css";

// What the import said of one document it refused (importError.feature): the
// document's id, where the import knew the tournament it is of the document's
// whole address on this site and on the old site, each a link, and the
// tournament's and the competition's names, what went wrong said for a
// person where the import said it so, and every message kept against it,
// whole. A message is put in as text and never as markup, since it was
// written by the code that failed.

interface ImportErrorOfDocument {
  readonly documentId: string;
  readonly messages: readonly string[];
  readonly summaries: readonly string[];
  readonly tournament?: {
    readonly website: string;
    readonly address: string;
    readonly name: string;
    readonly competitionName?: string;
    readonly newSitePath: string;
    readonly oldSitePath: string;
  };
}

// The whole address, shown as well as followed, so that it can be read and
// copied as it is.
const AddressLink = ({ href }: { readonly href: string }) => (
  <a href={href}>{href}</a>
);

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
              <p className="import-error-new-site">
                <span>{say("admin.importError.newSite")}: </span>
                <AddressLink
                  href={`${window.location.origin}/${kept.tournament.newSitePath}`}
                />
              </p>
              <p className="import-error-old-site">
                <span>{say("admin.importError.oldSite")}: </span>
                <AddressLink
                  href={`https://${kept.tournament.website}/${kept.tournament.oldSitePath}`}
                />
              </p>
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
            </>
          )}
          {kept.summaries.length === 0 ? null : (
            <ul className="import-error-summaries">
              {kept.summaries.map((summary, index) => (
                <li key={index} className="import-error-summary">
                  {summary}
                </li>
              ))}
            </ul>
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
