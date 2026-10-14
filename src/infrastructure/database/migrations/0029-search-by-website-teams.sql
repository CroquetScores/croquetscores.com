-- The players of a team that is archived are not found, and a team's events
-- say it of the team and not of its players, so each player is kept with the
-- team they are in, where they are in one, and each team with whether it is
-- archived.
alter table search_by_website_players add column team_id text;

create table search_by_website_teams (
    team_id  text primary key,
    archived boolean not null default false
);
