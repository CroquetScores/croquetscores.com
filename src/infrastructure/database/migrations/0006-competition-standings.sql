-- The standings of a block and a Swiss, kept so that they are worked out when a
-- competition changes and not each time somebody asks, and so that the site's
-- pages and the API read the same rows (CompetitionStandings.feature).
--
-- They are worked out of what the read models already keep of the competition
-- (0004, 0005) and of the three things they did not: what a block is played as,
-- which only the tournament's events say, and what each player carries forward,
-- which only the competition's do. Worked out again after every event of either
-- kind, so that whichever event comes last, in whichever stream, leaves them as
-- the whole of the events say.
--
-- Nothing here is filled in by the migration: it can only be made from the
-- events, so the read models are made again once it has run.

-- What a block is played as, which its tournament's events say: the games each
-- match is the best of, and how players level on matches won are told apart,
-- by its code. `level_on_matches_won` is whether any two players who have not
-- withdrawn are level on the share of matches they have won, which a page says
-- so that a reader knows why a tie break was needed.
alter table competitions
    add column best_of              integer,
    add column tie_break            text,
    add column level_on_matches_won boolean not null default false;

-- What a player carries forward from play it did not score, as the
-- competition's events say it: nothing where nothing is carried.
alter table competition_entries
    add column carry_match_wins    integer,
    add column carry_match_losses  integer,
    add column carry_game_wins     integer,
    add column carry_game_losses   integer,
    add column carry_hoops_for     integer,
    add column carry_hoops_against integer;

-- Each player's line of the standings of a block or a Swiss, with their carry
-- forward counted in. `rank` is the order they are shown in, the first being 1,
-- those who have withdrawn last. `played` and `won` are matches in a block and
-- games in a Swiss, and `lost`, `games_won` and `net_games` are a block's only.
-- `place` is empty for a player who has withdrawn, which `withdrawn` says, and
-- for every player where nothing has been played.
create table competition_standings (
    entry_id       text    primary key,
    competition_id text    not null,
    rank           integer not null,
    played         integer not null,
    won            integer not null,
    lost           integer,
    games_won      integer,
    net_games      integer,
    net_hoops      integer not null,
    withdrawn      boolean not null,
    place          integer,
    shared         boolean not null default false
);

create index competition_standings_by_competition
    on competition_standings (competition_id, rank);
