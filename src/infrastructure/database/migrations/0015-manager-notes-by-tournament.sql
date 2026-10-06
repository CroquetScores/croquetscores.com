-- What every page of a tournament says of the notes its managers wrote: each
-- note's title, when it was written and when it last changed, and which
-- tournament it is of. No description: a note's description may be 750,000
-- characters, and is read from the note's own stream, only when that note is
-- read. A deleted note has no row. Each row's place in the order rows were
-- made tells apart two notes written at the same moment, the later first.
create table manager_notes_by_tournament (
    note_id       text primary key,
    tournament_id text not null,
    title         text not null,
    written_at    timestamptz not null,
    changed_at    timestamptz not null,
    made          bigint generated always as identity
);

create index manager_notes_by_tournament_tournament
    on manager_notes_by_tournament (tournament_id);
