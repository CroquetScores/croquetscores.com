-- Each note's slug, where it is found among its tournament's notes, and
-- whether it has been deleted. A deleted note keeps its row, marked, so that
-- its slug stays taken and a note added after it is never found where it was;
-- it is found nowhere else. No two notes of a tournament have the same slug.
--
-- A row kept before slugs were is given the characters of its note's id as
-- its slug, which no other note has, until the read model is rebuilt from the
-- notes' events, which say each note's slug.
alter table manager_notes_by_tournament
    add column slug    text,
    add column deleted boolean not null default false;

update manager_notes_by_tournament
   set slug = substring(note_id from position('/' in note_id) + 1);

alter table manager_notes_by_tournament alter column slug set not null;

create unique index manager_notes_by_tournament_slug
    on manager_notes_by_tournament (tournament_id, slug);
