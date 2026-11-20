-- What the pages of a test, a group and a tournament's team summary show that
-- the read models did not yet keep, so that they ask the events nothing
-- (TournamentPages.feature): the tournament's format and whether a test level
-- on matches is drawn, a team's flag, and what a test is played as.
--
-- Written event by event from the tournament's own stream, as 0004 and 0007
-- are, so that no stream has to come before another when the read models are
-- made again. Nothing here is filled in by the migration: it can only be made
-- from the events, so the read models are made again once it has run.

-- The format by its name, which says whether the tournament is played by teams
-- and whether it ranks them by net matches, and whether a test level on
-- matches is drawn, which the event says as it was settled when it was written.
alter table tournaments
    add column format            text,
    add column level_tests_drawn boolean not null default false;

-- The flag a team flies, which a game of its players is shown with.
alter table tournament_teams
    add column flag text;

-- A test is played as the best of `best_of` games, as a block is, and is
-- expected to have `expected_matches` matches, which decide when it is won,
-- lost or drawn.
alter table competitions
    add column expected_matches integer;

-- When a game was added, which `changed_at` is not once the game is changed.
-- Empty for a game kept before this, until the read models are made again.
alter table competition_games
    add column added_at timestamptz;
