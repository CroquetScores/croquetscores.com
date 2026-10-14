-- A player's page finds its player by the address their world ranking name
-- makes, and the search groups by it, so it is the access path of both.
create index search_by_website_players_person
    on search_by_website_players (person);
