-- The year each tournament is in, and the year it was in before it came into
-- that one, so that an app can be told which tournaments have changed year
-- (GET /api/v0/tournaments/changed-year).
--
-- A read model, made again from the events: it is empty until the read models
-- are made again, and lists nothing till then. It cannot be had from the
-- addresses a tournament has been found at, which keep the moment each was
-- first held and so say nothing of the order a tournament moved between them
-- when it moved back to one.
--
-- `changed_at` is the moment it came into the year it is in, or the moment it
-- was created where it has not moved.
create table tournament_years (
    tournament_id text        primary key,
    year          integer     not null,
    previous_year integer,
    changed_at    timestamptz not null
);
