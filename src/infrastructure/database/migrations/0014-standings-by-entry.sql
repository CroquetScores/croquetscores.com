-- A line of a competition's standings is found by its entry, and says nothing
-- of the competition or of withdrawing that the entry does not already say.
--
-- `competition_id` was kept beside `entry_id` although an entry is in one
-- competition, and `withdrawn` beside the entry's own, so that each could be
-- changed in one place and left as it was in the other. Both are now read from
-- the entry. A line whose entry is taken away goes with it, by the key,
-- instead of by a delete somebody remembered to write.
--
-- A read model, made again from the events, so a line with no entry (which no
-- projection leaves) is dropped rather than refusing the key.

delete from competition_standings s
 where not exists (
   select 1 from competition_entries e where e.entry_id = s.entry_id);

alter table competition_standings
    drop column competition_id,
    drop column withdrawn,
    add constraint competition_standings_entry
        foreign key (entry_id) references competition_entries (entry_id)
        on delete cascade;
