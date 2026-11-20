-- What the players' pages of a tournament show that the read models did not yet
-- keep, so that they ask the events nothing (TournamentPages.feature): the
-- slug that finds each player of a team within the tournament, as the
-- tournament's own players' are kept by 0007.
--
-- Written event by event from the tournament's own stream, as 0004 and 0007
-- are, so that no stream has to come before another when the read models are
-- made again. Nothing here is filled in by the migration: it can only be made
-- from the events, so the read models are made again once it has run.

alter table tournament_team_players
    add column slug text;
