-- Association croquet's world ranking players are kept by the number the
-- rankings give each player (issue 892), not by their name, so that a player
-- whose name the rankings change is the same player with a new name, and two
-- players of one name are two players.
--
-- Every row is deleted first. The rows kept before have no world ranking
-- number, and the next import reads every player on the list again and keeps
-- each with its number, so nothing is lost that the import cannot give back.
-- Not a table of the import from the old sites, and not made from events:
-- the rankings' list is the only thing it is made from.
--
-- Run the import of the world ranking players as soon as this is deployed:
-- until it is, nobody is offered by the player dialogs and no name is known as
-- a world ranking player.
--
-- A name is one player's, so the site can find a player by it. A list that
-- would give one name to two players is refused before anything is kept.
--
-- A player the rankings stop listing is archived rather than deleted, since
-- the site has met them. `archived_at` is empty for a player on the list.
delete from ac_world_ranking_players;

alter table ac_world_ranking_players drop constraint ac_world_ranking_players_pkey;

alter table ac_world_ranking_players
  add column ac_world_ranking_id text not null primary key,
  add column world_ranking_id    integer not null unique,
  add column changed_at          timestamptz not null,
  add column archived_at         timestamptz,
  add constraint ac_world_ranking_players_name_key unique (name);
