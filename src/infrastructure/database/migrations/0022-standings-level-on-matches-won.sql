-- Whether a block's places are told apart by matches won is a fact of its
-- standings, and is kept with them.
--
-- It was a column of `competitions`, written by the standings and read by
-- nothing else, in a table of what a competition is. A row here says a
-- competition's standings are kept, and that fact is what the page reads it
-- by. A read model, made again from the events.

create table competition_standings_kept (
    competition_id       text    primary key,
    level_on_matches_won boolean not null,
    changed_at           timestamptz
);

insert into competition_standings_kept
       (competition_id, level_on_matches_won, changed_at)
select c.competition_id, c.level_on_matches_won, c.changed_at
  from competitions c
 where c.kind in ('block', 'swiss')
   and exists (select 1
                 from competition_standings s
                 join competition_entries e on e.entry_id = s.entry_id
                where e.competition_id = c.competition_id);

alter table competitions drop column level_on_matches_won;
