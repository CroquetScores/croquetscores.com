-- The search keeps what is the search's, and reads the rest of a player from the
-- tournament's own players.
--
-- A player's name, world ranking name, slug, what they represent, whether they
-- are archived and the team they are in were kept three times: by the
-- tournament's players, by the team's players, and again by the search. A
-- change to one of them was a change in two places, and the places could come
-- to disagree. What is the search's own stays: the name folded the way a search
-- folds what is typed, the person it makes of the world ranking name, and the
-- order the players were first kept in (which is what `beginning` goes by).
--
-- A team's search row said only whether the team is archived, which the team's
-- row already says, so it goes.
--
-- `every_player` is the players of a tournament and the players of its teams as
-- one list, since a player is one or the other and the search is of both. A
-- team's players are not represented by anything.
--
-- Read models, made again from the events, so nothing is lost: what is dropped
-- is kept by the tournament's players.

create view every_player as
select player_id, tournament_id, null::text as team_id,
       world_ranking_name, slug, representing, archived
  from tournament_players
union all
select player_id, tournament_id, team_id,
       world_ranking_name, slug, null::text as representing, archived
  from tournament_team_players;

alter table search_by_website_players
    drop column tournament_id,
    drop column name,
    drop column world_ranking_name,
    drop column archived,
    drop column team_id,
    drop column slug,
    drop column representing;

drop table search_by_website_teams;
