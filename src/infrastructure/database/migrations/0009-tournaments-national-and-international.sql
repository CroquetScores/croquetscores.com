-- Whether each tournament is national or international, so that the lists can
-- set the row of one that is in bold. Kept as the two things the organiser
-- ticks rather than as one level, as the tournament's events keep them. Not
-- null and false, so that the rows already there are listed as ordinary
-- tournaments: rebuilding the read models (`npm run db:rebuild-read-models`)
-- fills them in from the events.
alter table tournaments_by_website
    add column national      boolean not null default false,
    add column international boolean not null default false;

alter table tournaments_by_account_details
    add column national      boolean not null default false,
    add column international boolean not null default false;
