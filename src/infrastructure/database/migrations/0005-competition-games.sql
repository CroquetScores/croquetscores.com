-- The games of a competition, and what has to be known of its players to say
-- who played them and which round of a knockout a game was in, kept so that
-- the API asks the events nothing. What a competition is called, and which
-- kind it is, is in `competitions` (0004). The table of games here is every
-- read model's, and the home page's list of those played lately asks it, so
-- that a game is held once: `tournaments_by_website_games` kept the same games
-- by their competition, and is dropped.
--
-- Written event by event from a competition's own stream, which says what
-- the competition's players and games are and not which tournament it is in.
-- So no stream has to come before another when the read models are made
-- again. A game's round, and the matches of a test, are worked out when they
-- are asked for, from what is kept here, since each depends on what the
-- others were.
--
-- Nothing here is filled in by the migration: it can only be made from the
-- events, so the read models are made again once it has run.

-- A knockout's draw, which its tournament's events say: how many places it
-- has, the games each round is the best of, and whether its players are put in
-- their places by the matches of another knockout, as a losers knockout's are.
alter table competitions
    add column draw_places    integer,
    add column draw_rounds    integer[],
    add column placed_by_order boolean;

-- The players of a competition, by the id the competition gives them, which
-- is what its games name. `position` is their order in it, lowest first. A
-- player who withdraws is put after every other, so the order the withdrawn
-- are in is the order they withdrew in.
create table competition_entries (
    entry_id             text    primary key,
    competition_id       text    not null,
    tournament_player_id text    not null,
    position             integer not null,
    withdrawn            boolean not null default false
);

create index competition_entries_by_competition on competition_entries (competition_id);

-- Where a knockout's byes are in its order. Every bye has the same id, so a
-- bye is its place.
create table competition_byes (
    competition_id text    not null,
    position       integer not null,
    primary key (competition_id, position)
);

-- Each game of a competition, in the order they are shown, archived ones
-- among them. Who won and lost is named by the id the competition gives its
-- players, or by a team player's id in a test. The scores are as they were
-- typed.
create table competition_games (
    game_id        text    primary key,
    competition_id text    not null,
    position       integer not null,
    winner_id      text    not null,
    winner_score   text    not null,
    loser_id       text    not null,
    loser_score    text    not null,
    drawn          boolean not null,
    archived       boolean not null default false,
    withdrawn      boolean not null default false,
    changed_at     timestamptz not null
);

create index competition_games_by_competition on competition_games (competition_id, position);

-- Every game, as the table above holds it, is every game the table of the home
-- page held, so what it held of them is not kept twice. Its rows come back
-- when the read models are made again, which the migration needs anyway.
drop table tournaments_by_website_games;
