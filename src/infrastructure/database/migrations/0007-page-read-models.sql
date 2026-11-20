-- What the public pages of a tournament show that the read models did not yet
-- keep, so that a page asks the events nothing (TournamentPages.feature): the
-- tournament's subtitle, each player's slug and flag, and what a competition
-- is played as, and a test's group.
--
-- Written event by event from the tournament's own stream, as 0004 is, so that
-- no stream has to come before another when the read models are made again.
-- Nothing here is filled in by the migration: it can only be made from the
-- events, so the read models are made again once it has run.

alter table tournaments
    add column subtitle text;

-- A player's slug is what finds them within the tournament, as the tournament
-- gave it when they were added, and a flag is the name of the flag they fly.
alter table tournament_players
    add column slug text,
    add column flag text;

-- What a competition is played as. `maximum_hoops` is the most hoops a game is
-- played to, which is empty for no most; `maximum_hoops_said` is whether the
-- event said so, since an event kept before it could be said leaves it to the
-- usual for the tournament's sport. A test's group is kept by the name it was
-- typed as and the slug its page is found at, which is empty for a group that
-- makes none.
alter table competitions
    add column rounds             integer,
    add column maximum_hoops      integer,
    add column maximum_hoops_said boolean not null default false,
    add column advantage          boolean not null default false,
    add column group_name         text,
    add column group_slug         text;
