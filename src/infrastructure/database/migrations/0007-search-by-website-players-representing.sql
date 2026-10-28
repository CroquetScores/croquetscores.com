-- What each player represents, so that the player dialog can offer what
-- players have been added representing (RepresentingMatching.feature).
-- Nullable because the rows already there do not have it: rebuilding the read
-- models (`npm run db:rebuild-read-models`) fills it in from the events.
--
-- `kept` orders the players by when they were first kept, which is how a
-- club written two ways that differ only in capitals is offered as it was
-- first written. Identity rather than a clock, since two players kept in one
-- transaction share a moment and a rebuild keeps them in the order it reads.
alter table search_by_website_players
    add column representing text,
    add column kept bigint generated always as identity;
