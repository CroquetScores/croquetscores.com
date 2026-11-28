-- Association croquet's world ranking players are told with the country they
-- are from, as golf croquet's are (0034), in the site's own code for it.
--
-- The players kept before have none, since the import read past it. Their
-- rows are left as they are and their country empty, and the next import, or
-- the next time the list of the players is asked for from the start, reads it
-- and keeps it, which is a change to the player and is told as one. Not a
-- table of the import from the old sites, and not made from events: the
-- rankings' list is the only thing it is made from.
alter table ac_world_ranking_players add column country text;
