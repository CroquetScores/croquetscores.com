-- What finding who a key is needs, kept beside the hash of the key, so that
-- every request under the API asks the read model and nothing else
-- (AccountsByApiKey.feature): whether the key may read and whether it may
-- write, the one tournament it is limited to, and the requests it may make a
-- minute and a day.
--
-- Whether the account is confirmed is not kept. An account that is not
-- confirmed cannot make a key, and one that is confirmed never becomes
-- unconfirmed, so every row is already one of a confirmed account. A key that
-- is revoked, or whose account is forgotten, has no row, as before.
--
-- The rows kept before this are given what the events say, so that the API
-- works as soon as this has run, without the read models being made again
-- first. Making them again gives the same values: the scope and the tournament
-- are the key's as it was made, and the limits are the last that were set,
-- which is what the projection keeps. `changed_at` is the moment of the last
-- event that changed the row, so it moves to the last limits change where
-- there was one.
alter table accounts_by_api_key
    add column may_read   boolean,
    add column may_write  boolean,
    add column tournament text,
    add column per_minute integer,
    add column per_day    integer;

update accounts_by_api_key k
   set may_read   = true,
       may_write  = (e.data ->> 'scope') = 'read-and-write',
       tournament = e.data ->> 'tournament',
       per_minute = (e.data ->> 'perMinute')::integer,
       per_day    = (e.data ->> 'perDay')::integer
  from events e
 where e.name = 'account-api-key-created'
   and e.stream_id = k.account_id
   and e.data ->> 'keyId' = k.key_id;

-- The last change of limits of each key, which is the one in force.
update accounts_by_api_key k
   set per_minute = (l.data ->> 'perMinute')::integer,
       per_day    = (l.data ->> 'perDay')::integer,
       changed_at = greatest(k.changed_at,
                             (l.data ->> 'occurredAt')::timestamptz)
  from (select distinct on (stream_id, data ->> 'keyId') stream_id, data
          from events
         where name = 'account-api-key-limits-changed'
         order by stream_id, data ->> 'keyId', id desc) l
 where l.stream_id = k.account_id
   and l.data ->> 'keyId' = k.key_id;

-- A row no making event can be found for is one the events cannot account for,
-- and which could not be told what its key may do. The projection makes none,
-- so there should be none; were there one, a key that cannot be known is
-- better refused than let in, and making the read models again restores
-- whatever the events do say.
delete from accounts_by_api_key where may_read is null;

alter table accounts_by_api_key
    alter column may_read   set not null,
    alter column may_write  set not null,
    alter column per_minute set not null,
    alter column per_day    set not null;
