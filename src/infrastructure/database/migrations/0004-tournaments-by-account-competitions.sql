-- Whether each competition counts towards the world rankings, and whether it
-- is archived, so that a world ranking officer can narrow its list of
-- tournaments by whether one counts without asking each tournament's events.
-- Kept apart from the tournament's own row because a competition changes
-- without the tournament doing so. Empty until the read models are rebuilt
-- (`npm run db:rebuild-read-models`), which fills it in from the events; until
-- then every tournament is listed as one that does not count.
create table tournaments_by_account_competitions (
    competition_id text    primary key,
    tournament_id  text    not null,
    world_rankings boolean not null,
    archived       boolean not null default false
);

create index tournaments_by_account_competitions_tournament
    on tournaments_by_account_competitions (tournament_id);
