-- When each of a tournament's commentaries last changed, for every page of
-- the tournament to mark its Commentary section by, without reading any
-- comment. A commentary is heard of from its tournament's stream, which says
-- which tournament it is on and who writes it, and from its own, which says
-- when comments were added and edited, in whichever order a rebuild takes
-- them, so a row may for a while know only one of the two.
create table commentaries_by_tournament (
    commentary_id text primary key,
    tournament_id text,
    writer_id     text,
    changed_at    timestamptz
);

create index commentaries_by_tournament_tournament
    on commentaries_by_tournament (tournament_id);

-- The accounts forgotten, heard of from their own streams, whose commentaries
-- are not found, since a forgotten account is not one a reader is shown
-- anything of. Kept apart from the commentaries, so that a forgetting heard of
-- before the commentary's start still counts once the start is.
create table commentaries_by_tournament_forgotten (
    account_id text primary key
);
