-- What the website's search looks in: the names of its tournaments, of their
-- competitions and of their players, each kept beside the same name folded as
-- a search folds what is typed (accents off, lower case, one space between
-- words), so that finding one is a comparison and not a transformation of
-- every name there is. The website is kept as the tournament was created on
-- it.
create table search_by_website_tournaments (
    tournament_id text primary key,
    website       text not null,
    name          text not null,
    folded_name   text not null,
    address       text not null,
    starts        date not null,
    archived      boolean not null default false
);

create index search_by_website_tournaments_website
    on search_by_website_tournaments (website);

-- A competition's own events do not say which tournament it is in, and its
-- tournament's do, so each is kept with the tournament it was added to, and
-- its address is put together when asked, as the tournament's may have moved.
create table search_by_website_competitions (
    competition_id text primary key,
    tournament_id  text not null,
    name           text not null,
    folded_name    text not null,
    slug           text not null,
    archived       boolean not null default false
);

create index search_by_website_competitions_tournament
    on search_by_website_competitions (tournament_id);

-- Every player of every tournament, a team's included, by the world ranking
-- name they are known by. `person` is the slug of that name, which is what
-- makes two players one person and is where the person's page is found.
create table search_by_website_players (
    player_id          text primary key,
    tournament_id      text not null,
    name               text not null,
    world_ranking_name text not null,
    folded_name        text not null,
    person             text not null,
    archived           boolean not null default false
);

create index search_by_website_players_tournament
    on search_by_website_players (tournament_id);
