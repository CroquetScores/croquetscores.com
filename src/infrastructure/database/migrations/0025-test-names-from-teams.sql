-- A test is called what its two teams are, and is not given a name of its own.
--
-- The name was written when the test was added and again for every test a team
-- is in whenever the team's short name changed, which is a name kept in step by
-- hand with what it is made of. `competition_names` gives a competition its
-- name, and a test its teams' short names as they are now. A read model, made
-- again from the events.

update competitions set name = null where kind = 'test';

create view competition_names as
select c.competition_id,
       coalesce(c.name, f.short_name || ' v ' || s.short_name) as name
  from competitions c
  left join tournament_teams f on f.team_id = c.first_team_id
  left join tournament_teams s on s.team_id = c.second_team_id;
