-- What the notes and commentary pages of a tournament show that the read
-- models did not yet keep, so that those pages ask the events nothing
-- (ManagerNotesByTournament.feature, CommentariesByTournament.feature): what
-- each note says and when it was last edited, and each commentary's comments.
--
-- Written event by event from each stream, as 0004, 0007 and 0009 are. Nothing here
-- is filled in by the migration: it can only be made from the events, so the
-- read models are made again once it has run.

-- What a note says, which may be 750,000 characters, so a list of notes never
-- selects it, and when it was last edited, which is empty where it never has
-- been. `changed_at` stays as it was: the later of the two. A description is
-- empty for a note that says nothing, and null for a note kept before
-- descriptions were, which a page refuses until the read models are made again.
alter table manager_notes_by_tournament
    add column description    text,
    add column last_edited_at timestamptz;

-- A commentary's comments, in the order they were written, which a commentary's
-- page reads and a list of commentaries never does. `position` is made when the
-- comment is first kept, so that projecting the same events again leaves each
-- comment where it was. A comment deleted is taken out, since nothing finds it.
--
-- A commentary kept before its comments were has no row here for any of them,
-- which looks the same as a commentary with none, so `comments_kept` says which
-- commentaries have had their comments kept; a page refuses one that has not.
alter table commentaries_by_tournament
    add column comments_kept boolean not null default false;

create table commentary_comments (
    commentary_id  text        not null,
    comment_id     text        not null,
    position       bigint      generated always as identity,
    text           text        not null,
    written_at     timestamptz not null,
    last_edited_at timestamptz,
    -- The last event that changed the row, as every read model keeps it (0008).
    changed_at     timestamptz not null,
    primary key (commentary_id, comment_id)
);

create index commentary_comments_order
    on commentary_comments (commentary_id, position);
