-- Golf croquet's world ranking players are kept by the number the rankings
-- give each player, as association croquet's were (0033), so that a player
-- whose name the rankings change is the same player with a new name, and an
-- app can follow them at /api/v1/gc/.
--
-- The number is the first column of the rankings' golf croquet list, which
-- was read past until now, since only the names were wanted. Every row is
-- deleted first, because the rows kept before have no number, and the next
-- import, or the next time the list of the players is asked for from the
-- start, reads every player on the list again and keeps each with its number,
-- so nothing is lost that the rankings cannot give back. Not a table of the
-- import from the old sites, and not made from events: the rankings' list is
-- the only thing it is made from.
--
-- Run the import of the world ranking players as soon as this is deployed:
-- until it is, nobody is offered by the golf croquet player dialogs and no
-- name is known as a golf croquet world ranking player.
--
-- The golf croquet list has players of one name in different countries, so a
-- player is told apart by their name and their country together, and that is
-- what the site finds a player by. A list that would give one name and
-- country to two players is refused before anything is kept.
--
-- A player the rankings stop listing is archived rather than deleted, since
-- the site has met them. `archived_at` is empty for a player on the list.
delete from gc_world_ranking_players;

alter table gc_world_ranking_players drop constraint gc_world_ranking_players_pkey;

alter table gc_world_ranking_players
  add column gc_world_ranking_id text not null primary key,
  add column world_ranking_id    integer not null unique,
  add column changed_at          timestamptz not null,
  add column archived_at         timestamptz,
  add column country             text not null,
  add constraint gc_world_ranking_players_name_country_key
    unique (name, country);
