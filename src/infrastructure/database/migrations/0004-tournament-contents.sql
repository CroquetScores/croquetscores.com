-- What is in a tournament, kept so that the API asks the events nothing: its
-- players, its teams and their players, and what each of its competitions is
-- called and is. The tournament's own details are in `tournaments`, who has a
-- part in it in `tournaments_by_account`, and when each row last changed in
-- the `changed_at` columns.
--
-- Written event by event from the tournament's own stream, so that an event
-- changes only the rows it is about, and no stream has to come before another
-- when the read models are made again. A row's `changed_at` is not kept here:
-- a player's change is the tournament's, which its own column says.
--
-- Nothing here is filled in by the migration: it can only be made from the
-- events, so the read models are made again once it has run.

-- What each competition is called, and is. `name` is what a test is called
-- from its two teams' short names, `first_team_id` and `second_team_id` being
-- those of a test, and nothing otherwise. `position` is the competition's
-- place in the tournament's order, lowest first.
alter table competitions
    add column name           text,
    add column kind           text check (kind in ('block', 'swiss', 'knockout', 'test')),
    add column slug           text,
    add column position       integer,
    add column first_team_id  text,
    add column second_team_id text;

-- Every player of a tournament played by its own players, archived or not.
-- `world_ranking_name` is the name the world rankings know them by, which is
-- their name where none was given.
create table tournament_players (
    player_id          text    primary key,
    tournament_id      text    not null,
    name               text    not null,
    world_ranking_name text    not null,
    handicap           text,
    representing       text,
    archived           boolean not null default false
);

create index tournament_players_by_tournament on tournament_players (tournament_id);

-- Every team of a tournament played by teams, archived or not, and the players
-- of each. `position` is the team's place in the tournament's order, and a
-- team player's in its team's, lowest first.
create table tournament_teams (
    team_id       text    primary key,
    tournament_id text    not null,
    name          text    not null,
    short_name    text    not null,
    position      integer not null,
    archived      boolean not null default false
);

create index tournament_teams_by_tournament on tournament_teams (tournament_id);

create table tournament_team_players (
    player_id          text    primary key,
    team_id            text    not null,
    tournament_id      text    not null,
    name               text    not null,
    world_ranking_name text    not null,
    position           integer not null,
    archived           boolean not null default false
);

create index tournament_team_players_by_team on tournament_team_players (team_id);
create index tournament_team_players_by_tournament on tournament_team_players (tournament_id);
