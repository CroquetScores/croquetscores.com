-- When a tournament was archived, so that an app can be told which have been
-- (GET /api/v1/tournaments/archived). Nothing for one that is not archived,
-- and nothing again for one restored.
--
-- A read model, made again from the events. A tournament already archived is
-- given the moment it last changed (or now, where none was kept), which is the moment it was archived unless
-- something was kept of it since; the moment itself is had by making the read
-- models again.
alter table tournaments add column archived_at timestamptz;

update tournaments set archived_at = coalesce(changed_at, now()) where archived;
