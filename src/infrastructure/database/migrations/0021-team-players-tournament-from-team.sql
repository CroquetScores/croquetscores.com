-- A team's player is in the tournament their team is in, and does not say so
-- again.
--
-- `tournament_team_players.tournament_id` repeated the team's own, so a team
-- moved or renamed could leave its players saying another. A read model, made
-- again from the events. `every_player` is made again over the team's, since a
-- view that names the column is a view that stops the column being dropped.

drop view every_player;

alter table tournament_team_players drop column tournament_id;

create view every_player as
select player_id, tournament_id, null::text as team_id,
       world_ranking_name, slug, representing, archived
  from tournament_players
union all
select p.player_id, t.tournament_id, p.team_id,
       p.world_ranking_name, p.slug, null::text as representing, p.archived
  from tournament_team_players p
  join tournament_teams t on t.team_id = p.team_id;
