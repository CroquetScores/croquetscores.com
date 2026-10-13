-- Whether each tournament counts towards the world rankings, for a world
-- ranking officer's list, which is every tournament that does of the sports
-- whose players it looks after, and not every tournament of them.
--
-- A tournament already listed is taken to count, as one does unless it is said
-- not to (create.feature), until it is projected again and says. No site keeps
-- real events yet, and a database is imported again from the old sites, which
-- empties it first.
alter table tournaments_by_account_details
    add column counts_towards_world_rankings boolean not null default true;
