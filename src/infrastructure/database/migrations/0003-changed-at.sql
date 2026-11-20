-- When each tournament, competition and game last changed, kept by the read
-- models that hold them, so that nothing has to ask the events for it. The
-- value is the `occurredAt` of the last event that changed the row, and never
-- the moment the row was written, so that reading the events again gives the
-- same value as the projection did.
--
-- A tournament has changed when anything was kept of its own stream, or of any
-- of its competitions'. A competition has changed when anything was kept of
-- its own stream, or when its tournament's events said something that changes
-- what is told of it. A game has changed when an event about it was kept.
--
-- A competition's own events do not say which tournament it is in, and the
-- tournament's do, so a competition's events may be projected before its
-- tournament's. Its row then has no tournament until the tournament's events
-- say which, and `tournament_id` can be empty for that long.

alter table tournaments add column changed_at timestamptz;
alter table competitions add column changed_at timestamptz;
alter table competitions alter column tournament_id drop not null;
alter table tournaments_by_website_games add column changed_at timestamptz;

-- The rows kept before this are given what the events say, so that the API
-- is right before the read models are made again. Making them again gives the
-- exact value; what is given here is never earlier than it, since a
-- competition is taken to have changed with any event of its tournament's.
update tournaments t
   set changed_at = s.at
  from (select stream_id, max((data ->> 'occurredAt')::timestamptz) as at
          from events group by stream_id) s
 where s.stream_id = t.tournament_id;

update competitions c
   set changed_at = greatest(
         (select max((e.data ->> 'occurredAt')::timestamptz)
            from events e where e.stream_id = c.competition_id),
         t.changed_at)
  from tournaments t
 where t.tournament_id = c.tournament_id;

update tournaments t
   set changed_at = greatest(t.changed_at, c.at)
  from (select tournament_id, max(changed_at) as at
          from competitions group by tournament_id) c
 where c.tournament_id = t.tournament_id;

update tournaments_by_website_games g
   set changed_at = e.at
  from (select stream_id, data ->> 'gameId' as game_id,
               max((data ->> 'occurredAt')::timestamptz) as at
          from events where data ? 'gameId' group by 1, 2) e
 where e.stream_id = g.competition_id and e.game_id = g.game_id;

update tournaments_by_website_games set changed_at = added_at
 where changed_at is null;
update tournaments set changed_at = now() where changed_at is null;
update competitions set changed_at = now() where changed_at is null;

alter table tournaments alter column changed_at set not null;
alter table competitions alter column changed_at set not null;
alter table tournaments_by_website_games alter column changed_at set not null;

-- When a game was added is no longer kept apart: a game was last changed when
-- the last event about it happened, and a tournament was last played when a
-- game in use was last changed.
alter table tournaments_by_website_games drop column added_at;
