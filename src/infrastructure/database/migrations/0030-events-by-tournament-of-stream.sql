-- Finding a tournament's commentaries and manager notes among the events.
--
-- A commentary or a manager note has a stream of its own, and only its first
-- event names the tournament it is of, in `tournamentId`. The administrator's
-- page of a tournament's events (events.feature) asks for the streams by that,
-- from the events themselves and not from a read model, since a manager note
-- that was deleted is gone from its read model and is still among the events.
-- Without an index every such page read every event there is.
--
-- Partial, to the two kinds of stream that carry the field, so that it holds a
-- row for each of the first events of those and none for the rest. The query
-- says the same condition as this does, which is how the planner knows it may
-- use it.
--
-- Nothing in an event is changed: an index is read from them.
--
-- It is built over the whole of events, which holds back appends for as long
-- as that takes, since the runner applies a migration in a transaction and an
-- index cannot then be made concurrently. To avoid that on a large table, make
-- it first by hand, outside one, with the same name, and this finds it there:
--
--   create index concurrently events_by_tournament_of_stream
--       on events ((data ->> 'tournamentId'))
--    where stream_id like 'commentary/%' or stream_id like 'manager-note/%';

create index if not exists events_by_tournament_of_stream
    on events ((data ->> 'tournamentId'))
 where stream_id like 'commentary/%' or stream_id like 'manager-note/%';
