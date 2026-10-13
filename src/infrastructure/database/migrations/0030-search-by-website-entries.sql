-- Each competition a tournament's player is entered in, so that a player's
-- page lists where they have played. A competition's own events say which
-- tournament player is entered, and its tournament's say the rest, so the two
-- are put together when asked.
create table search_by_website_entries (
    competition_player_id text primary key,
    competition_id        text not null,
    player_id             text not null
);

create index search_by_website_entries_player
    on search_by_website_entries (player_id);

-- The order the tournament gave each competition, which a player's page lists
-- a tournament's competitions in.
alter table search_by_website_competitions
    add column competition_order integer not null default 0;
