-- A tournament's players are kept with the id the site gave the world ranking
-- player of the name they are known by (TournamentContents.feature), so that
-- an app can follow a player by it where a name could be written two ways.
-- A column for each sport's id, since a player is of one sport and the other is
-- left empty: `ac_world_ranking_id` and `gc_world_ranking_id`, as the rankings'
-- players are kept by.
--
-- Nothing is filled in here, because what an id is looked for by is not all in
-- the tables: who a player represents is told to a country by what the site
-- knows of countries, and two players of one name are told apart by it. These
-- are read models, made again from the events, which looks every id up as it
-- goes, so they are to be rebuilt once this is deployed, after the world
-- ranking players have been imported (0033, 0034): until then no player has an
-- id. A player added or changed from now on is looked for as it is, and so is
-- every player of a sport when the rankings' players are kept.
alter table tournament_players
  add column ac_world_ranking_id text,
  add column gc_world_ranking_id text;

alter table tournament_team_players
  add column ac_world_ranking_id text,
  add column gc_world_ranking_id text;
