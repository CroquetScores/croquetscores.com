-- A tournament's commentaries, as every page of the tournament lists them and
-- finds them, now that a commentary's start is kept in its own stream rather
-- than its tournament's: its tournament, its title, its slug, its writer,
-- when it was started and when it last changed. It holds no comment. Made
-- again rather than altered, since what the table held before was heard of
-- from the tournament's stream, which no longer says it; the read model is
-- rebuilt from the commentaries' events, which do.
--
-- No two commentaries on a tournament have the same slug, or the same title
-- however it is capitalised, which the keys hold to should two be started at
-- once.
drop table commentaries_by_tournament;

create table commentaries_by_tournament (
    commentary_id text primary key,
    tournament_id text not null,
    title         text not null,
    slug          text not null,
    writer_id     text not null,
    started_at    timestamptz not null,
    changed_at    timestamptz not null
);

create unique index commentaries_by_tournament_slug
    on commentaries_by_tournament (tournament_id, slug);

create unique index commentaries_by_tournament_title
    on commentaries_by_tournament (tournament_id, lower(title));
