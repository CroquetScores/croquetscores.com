import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { markdownWithoutHtml } from "../../../../../../../common/markdown.js";
import { Field, type Refusal } from "../../../../../../Field.js";
import { TabControl } from "../../../../../../TabControl.js";
import { knows, say } from "../../../../../../words.js";
import { type Tool, tools, written } from "./markdownTools.js";
import { idInAddress } from "../../../../../../api.js";
import "./notePanel.css";

// The note panel (notePanel.feature), in a tournament's Notes tab in place of
// its list: shown by Add Note to add a note, and by a note's title to edit it.
// A panel on the page rather than a dialog over it, since a note is written at
// length and a dialog is for a few fields and a decision. Adding and editing
// are the one panel, so that the two cannot come to ask different things, and
// either puts the list back once the note is kept.
//
// It asks for a note as an issue on GitHub is written: a title, and a
// description in two tabs, Write, with GitHub's toolbar above the box, and
// Preview, which draws the note as its page does, by the same drawing
// (markdown.ts), so that what the manager sees is what a reader will, and
// only what there is of it.

/**
 * A note as the API lists it: everything but what it says, which a list has
 * no use for, and which the panel asks for by itself when it edits the note.
 */
export interface NoteListed {
  readonly id: string;
  readonly title: string;
}

interface Props {
  /** The tournament's id. */
  readonly tournament: string;
  /** Nothing when adding, and the note when editing one. */
  readonly note?: NoteListed | undefined;
  /** Once a note is kept, so that the list says so. */
  readonly kept: () => void;
  /** Putting the list back, by Cancel or once the note is kept. */
  readonly close: () => void;
}

// A note is kept as it was typed, HTML and all, and drawn with HTML turned
// off, so what Preview puts on the page is Markdown's drawing alone.
const markdown = markdownWithoutHtml();

// The field each refusal is about. One about no one field is said above them.
const fieldOf = (code: string): "title" | "description" | undefined =>
  code.startsWith("ManagerNoteTitle.")
    ? "title"
    : code.startsWith("ManagerNoteDescription.")
      ? "description"
      : undefined;

const descriptionTabs = ["write", "preview"] as const;
type DescriptionTab = (typeof descriptionTabs)[number];

// Each tool's icon, drawn here rather than fetched or set in a font, as the
// account menu's is: they cost no request, and they take the colour of the
// button they are on.
const icons: Record<Tool, string> = {
  heading: "M3 2h2v5h6V2h2v12h-2V9H5v5H3z",
  bold: "M4 2h5a3 3 0 0 1 2.1 5.1A3.2 3.2 0 0 1 9.5 14H4zm2 2v3h3a1.5 1.5 0 0 0 0-3zm0 5v3h3.5a1.5 1.5 0 0 0 0-3z",
  italic: "M6 2h6v2H9.8l-2.6 8H9v2H3v-2h2.2l2.6-8H6z",
  quote: "M2 3h2v10H2zm4 1h8v2H6zm0 4h8v2H6z",
  code: "M5.5 4 1.5 8l4 4 1.4-1.4L4.3 8l2.6-2.6zm5 0-1.4 1.4L11.7 8l-2.6 2.6 1.4 1.4 4-4z",
  link: "M7 4H5a4 4 0 0 0 0 8h2v-2H5a2 2 0 0 1 0-4h2zm2 0v2h2a2 2 0 0 1 0 4H9v2h2a4 4 0 0 0 0-8zM5 7h6v2H5z",
  numberedList:
    "M6 3h8v2H6zm0 4h8v2H6zm0 4h8v2H6zM2 2h2v4H3V3H2zm0 6h2v1l-1 1h1v1H2v-1l1-1H2z",
  bulletedList:
    "M6 3h8v2H6zm0 4h8v2H6zm0 4h8v2H6zM2 3h2v2H2zm0 4h2v2H2zm0 4h2v2H2z",
  taskList:
    "M2 2h4v4H2zm1 1v2h2V3zm5 0h6v2H8zM2 10h4v4H2zm1 1v2h2v-2zm5 0h6v2H8z",
};

export const NotePanel = ({
  tournament,
  note,
  kept,
  close,
}: Props): React.JSX.Element => {
  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState("");
  // Whether the note is in hand: at once to add one, and to edit one once it
  // has been had, since the list it was chosen from holds no description.
  // Never where it could not be had: a Save then would keep an empty
  // description over the note's own, which cannot be undone.
  const [ready, setReady] = useState(note === undefined);
  const [tab, setTab] = useState<DescriptionTab>("write");
  const [refused, setRefused] = useState<readonly Refusal[]>([]);
  const [sending, setSending] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);
  const titleField = useRef<HTMLInputElement>(null);
  // Where a tool left the reader in the box, put back once the box holds
  // what the tool wrote: the box is drawn from the description, so a
  // selection set before it is drawn again would be lost.
  const selection = useRef<{ start: number; end: number } | undefined>(
    undefined,
  );
  const at = `/api/site/tournaments/${idInAddress(tournament)}/notes`;

  useEffect(() => {
    if (note === undefined) return;
    let current = true;
    void fetch(`${at}/${idInAddress(note.id)}`, {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        const answer = (await response.json()) as {
          title?: string;
          description?: string;
          error?: string;
        };
        if (!current) return;
        if (response.ok) {
          setTitle(answer.title ?? "");
          setDescription(answer.description ?? "");
          setReady(true);
        } else {
          setRefused([refusal(answer.error ?? "Unknown")]);
        }
      })
      .catch(() => {
        if (current) setRefused([refusal("Unknown")]);
      });
    return () => {
      current = false;
    };
    // Asked once, for the note the panel was shown for.
  }, []);

  // The reader is put in the title, where a note begins, as a dialog would
  // put them in its first field, once there is a title to be put in.
  useEffect(() => {
    if (ready) titleField.current?.focus();
  }, [ready]);

  useLayoutEffect(() => {
    const wanted = selection.current;
    if (wanted === undefined || box.current === null) return;
    selection.current = undefined;
    box.current.focus();
    box.current.setSelectionRange(wanted.start, wanted.end);
  }, [description]);

  const refusal = (code: string): Refusal => ({
    code,
    words: say(knows(code) ? code : "admin.note.otherwise"),
  });

  const refusedFor = (field: "title" | "description" | undefined): Refusal[] =>
    refused.filter(({ code }) => fieldOf(code) === field);

  const use = (tool: Tool): void => {
    const typed = box.current;
    if (typed === null) return;
    const after = written(tool, {
      value: description,
      start: typed.selectionStart,
      end: typed.selectionEnd,
    });
    selection.current = { start: after.start, end: after.end };
    setDescription(after.value);
    // What the tool wrote may be what was there already, as with nothing
    // selected and nothing to write around, and then nothing is drawn again.
    if (after.value === description) {
      typed.focus();
      typed.setSelectionRange(after.start, after.end);
    }
  };

  const send = async (): Promise<void> => {
    if (sending || !ready) return;
    setSending(true);
    try {
      const response = await fetch(
        note === undefined ? at : `${at}/${idInAddress(note.id)}`,
        {
          method: note === undefined ? "POST" : "PUT",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        },
      );
      if (response.ok) {
        kept();
        close();
        return;
      }
      const answer = (await response.json()) as {
        error?: string;
        broken?: { code: string }[];
      };
      const codes = answer.broken?.map(({ code }) => code) ?? [
        answer.error ?? "Unknown",
      ];
      setRefused(codes.map(refusal));
      // The description refused is said beneath its box, which is on Write.
      if (codes.some((code) => fieldOf(code) === "description")) {
        setTab("write");
      }
    } catch {
      setRefused([refusal("Unknown")]);
    }
    setSending(false);
  };

  // Still asking for the note it edits: neither had nor refused yet.
  const asking = !ready && refused.length === 0;
  const above = refusedFor(undefined);
  const descriptionRefused = refusedFor("description");

  const heading = say(
    note === undefined ? "admin.note.addTitle" : "admin.note.editTitle",
  );

  return (
    <form
      className="tab-form note-panel stack"
      aria-label={heading}
      aria-busy={sending || asking}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void send();
      }}
    >
      <h2 className="note-panel-heading">{heading}</h2>
      {above.length > 0 ? (
        <div className="dialog-problems">
          {above.map(({ code, words }) => (
            <p key={code} data-refused={code}>
              {words}
            </p>
          ))}
        </div>
      ) : null}
      {/* Nothing to type in until the note is in hand, so that nothing typed
          is put over by the note as it is. */}
      {ready ? (
        <>
          <Field
            name="title"
            label={say("admin.note.title")}
            refused={refusedFor("title")}
          >
            {(tied) => (
              <input
                {...tied}
                ref={titleField}
                type="text"
                placeholder=" "
                autoComplete="off"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
            )}
          </Field>
          <TabControl
            tabs={descriptionTabs}
            chosen={tab}
            choose={setTab}
            wordsFor={(each) => say(`admin.note.${each}`)}
            label={say("admin.note.description")}
            ids="description-tab"
          >
            {tab === "write" ? (
              <div className="note-write">
                <div
                  className="note-toolbar"
                  role="toolbar"
                  aria-label={say("admin.note.toolbar")}
                >
                  {tools.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      className="note-tool"
                      data-tool={tool}
                      aria-label={say(`admin.note.tool.${tool}`)}
                      title={say(`admin.note.tool.${tool}`)}
                      // Pressing a tool would otherwise take the focus, and the
                      // selection with it, from the box before the tool reads it.
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      onClick={() => {
                        use(tool);
                      }}
                    >
                      <svg
                        className="note-tool-icon"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                      >
                        <path d={icons[tool]} />
                      </svg>
                    </button>
                  ))}
                </div>
                <textarea
                  ref={box}
                  id="note-description"
                  className="note-description"
                  rows={8}
                  aria-label={say("admin.note.description")}
                  aria-invalid={
                    descriptionRefused.length > 0 ? true : undefined
                  }
                  aria-describedby={
                    descriptionRefused.length > 0
                      ? "note-description-message"
                      : undefined
                  }
                  value={description}
                  onChange={(event) => {
                    setDescription(event.target.value);
                  }}
                />
                {descriptionRefused.length > 0 ? (
                  <p
                    className="field-message"
                    id="note-description-message"
                    data-refused={descriptionRefused
                      .map(({ code }) => code)
                      .join(" ")}
                  >
                    {descriptionRefused.map(({ code, words }) => (
                      <span key={code}>{words}</span>
                    ))}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="note-preview">
                {/* What there is of the note and nothing else, as its page shows
                it: no heading for a title not yet typed, and no description
                where there is none. */}
                {title.trim() === "" ? null : (
                  <h2 className="note-title">{title}</h2>
                )}
                {description.trim() === "" ? null : (
                  // Markdown's own drawing, with HTML turned off: what is typed
                  // as HTML is drawn as the characters it is, so nothing typed
                  // can put anything of its own on the page.
                  <div
                    className="note-text"
                    dangerouslySetInnerHTML={{
                      __html: markdown.render(description),
                    }}
                  />
                )}
              </div>
            )}
          </TabControl>
        </>
      ) : null}
      {/* Cancel whatever else is offered, so that a note that could not be
          had can still be left. */}
      <div className="note-panel-buttons">
        {ready ? (
          <button
            className="button button-submit"
            type="submit"
            title={say(
              note === undefined
                ? "admin.hover.note.add"
                : "admin.hover.note.save",
            )}
          >
            {say(note === undefined ? "admin.note.add" : "admin.note.save")}
          </button>
        ) : null}
        <button
          className="button"
          type="button"
          title={say("admin.hover.modal.cancel")}
          onClick={close}
        >
          {say("admin.modal.cancel")}
        </button>
      </div>
    </form>
  );
};
