-- What the home page shows of each tournament, and what it is found by: its
-- website, its days, where it is played and its sport. The website is kept as
-- it was created, since a tournament keeps the one it was created on, and the
-- region is nothing for a tournament in none.
create table tournaments_by_website (
    tournament_id text primary key,
    website       text not null,
    name          text not null,
    starts        date not null,
    finishes      date not null,
    country       text not null,
    region        text,
    sport         text not null,
    address       text not null,
    archived      boolean not null default false
);

create index tournaments_by_website_starts on tournaments_by_website (website, starts);

-- Which tournament each competition is in. A competition's own events do not
-- say, and its tournament's do, so it is kept apart from the competition's
-- games: either can be projected first, and they are put together when asked.
create table tournaments_by_website_competitions (
    competition_id text primary key,
    tournament_id  text not null,
    archived       boolean not null default false
);

create index tournaments_by_website_competitions_tournament
    on tournaments_by_website_competitions (tournament_id);

-- Each game by its competition, and when it was added, which is when the
-- event adding it happened and is not changed by correcting it or restoring
-- it.
create table tournaments_by_website_games (
    competition_id text not null,
    game_id        text not null,
    added_at       timestamptz not null,
    archived       boolean not null default false,
    primary key (competition_id, game_id)
);
