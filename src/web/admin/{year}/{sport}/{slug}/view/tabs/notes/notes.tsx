import { useEffect, useState } from "react";

import { ModalDialog } from "../../../../../../ModalDialog.js";
import { say } from "../../../../../../words.js";
import { type NoteListed, NotePanel } from "./notePanel.js";
import "../listed.css";

// The Notes tab (notes-tab.feature): the notes a tournament's managers wrote
// for its readers, the most recently written first, each by its title and
// offering Edit and Delete. Add Note, a note's title and Edit show the note
// panel in place of the list. Delete asks first, since a note deleted is gone
// for good. Whenever the panel keeps a note, or one is deleted, the list is
// asked for again.

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
}

// The part of an id after its kind, which is how the API names a tournament
// or a note, so that each is one segment of an address.
const idInAddress = (id: string): string => id.slice(id.indexOf("/") + 1);

export const NotesTab = ({ tournament }: Props): React.JSX.Element => {
  const [listed, setListed] = useState<readonly NoteListed[] | undefined>();
  // Counted up to ask again, once something has been kept or deleted.
  const [asking, setAsking] = useState(0);
  const [answered, setAnswered] = useState<number | undefined>();
  const [acting, setActing] = useState(false);
  // What the panel is shown for: to add, or to edit a note, or nothing, when
  // the list is shown instead.
  const [writing, setWriting] = useState<"adding" | NoteListed | undefined>();
  // The note a manager is asked about before it is deleted.
  const [deleting, setDeleting] = useState<NoteListed | undefined>();
  const at = `/api/v1/tournaments/${idInAddress(tournament)}/notes`;

  useEffect(() => {
    let current = true;
    void fetch(at, { headers: { accept: "application/json" } })
      .then(async (response) =>
        response.ok
          ? ((await response.json()) as { notes: NoteListed[] }).notes
          : undefined,
      )
      .catch(() => undefined)
      .then((notes) => {
        if (!current) return;
        setListed(notes);
        setAnswered(asking);
      });
    return () => {
      current = false;
    };
  }, [at, asking]);

  const askAgain = (): void => {
    setAsking((count) => count + 1);
  };

  const remove = async (note: NoteListed): Promise<void> => {
    setActing(true);
    try {
      await fetch(`${at}/${idInAddress(note.id)}`, { method: "DELETE" });
    } catch {
      // A request that never arrived is said by the list asked for again.
    } finally {
      askAgain();
      setActing(false);
    }
  };

  const row = (note: NoteListed): React.JSX.Element => (
    <li key={note.id} className="listed-item">
      <span className="listed-who">
        {/* A title is the manager's own words, shown as the characters they
            are: React writes it as text, so no Markdown in it is drawn. */}
        <button
          type="button"
          className="listed-name"
          onClick={() => {
            setWriting(note);
          }}
        >
          {note.title}
        </button>
      </span>
      <span className="listed-options">
        {/* Edit before Delete, so that putting a note right is offered ahead
            of doing away with it. */}
        <button
          type="button"
          className="button"
          data-action="edit"
          onClick={() => {
            setWriting(note);
          }}
        >
          {say("admin.notes.edit")}
        </button>
        <button
          type="button"
          className="button"
          data-action="delete"
          onClick={() => {
            setDeleting(note);
          }}
        >
          {say("admin.notes.delete")}
        </button>
      </span>
    </li>
  );

  return (
    <section
      className="stack notes-tab"
      aria-busy={acting || answered !== asking}
    >
      {writing === undefined ? (
        <>
          {/* Above the list rather than beneath it, where a long one would push
          it off a phone's screen. */}
          <p>
            <button
              type="button"
              className="button"
              onClick={() => {
                setWriting("adding");
              }}
            >
              {say("admin.notes.add")}
            </button>
          </p>
          {listed === undefined ? null : listed.length === 0 ? (
            <p className="listed-none">{say("admin.notes.none")}</p>
          ) : (
            <ul className="listed" data-listed="in-use">
              {listed.map(row)}
            </ul>
          )}
        </>
      ) : (
        <NotePanel
          tournament={tournament}
          note={writing === "adding" ? undefined : writing}
          kept={askAgain}
          close={() => {
            setWriting(undefined);
          }}
        />
      )}
      {deleting === undefined ? null : (
        <ModalDialog
          title={say("admin.notes.deleteTitle")}
          action={say("admin.notes.delete")}
          act={() => {
            const note = deleting;
            setDeleting(undefined);
            void remove(note);
          }}
          cancel={() => {
            setDeleting(undefined);
          }}
        >
          <p>{say("admin.notes.deleteQuestion", { title: deleting.title })}</p>
          <p>{say("admin.notes.delete.explanation")}</p>
        </ModalDialog>
      )}
    </section>
  );
};
