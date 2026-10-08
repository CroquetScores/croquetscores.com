-- The players the world rankings know, by their full names, imported from the
-- rankings' own lists and replaced whole each time. A table for each sport,
-- since the two lists are not the same players. Not projected: nothing on the
-- site records them as events, since they are the rankings' and not the
-- site's.
create table ac_world_ranking_players (
    name text primary key
);

create table gc_world_ranking_players (
    name text primary key
);
