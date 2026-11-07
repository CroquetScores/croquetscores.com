-- Each tournament and each competition held once, where the home page's list,
-- the admin's and the search had each kept a copy. A tournament changed was
-- written three times, and a fault in one projection left the pages
-- disagreeing about the same tournament.
--
-- Nothing is lost by moving: the home page's table held every column a
-- tournament has, so the new table is made from it, and the competitions from
-- its competitions, with whether each counts towards the world rankings
-- taken from the admin's where that has been filled in, and false where it
-- has not (rebuilding the read models, `npm run db:rebuild-read-models`,
-- fills it in from the events). So a database migrated is read the same
-- without a rebuild.
--
-- The website is kept as the tournament was created, since a tournament keeps
-- the one it was created on.
create table tournaments (
    tournament_id text    primary key,
    website       text    not null,
    name          text    not null,
    starts        date    not null,
    finishes      date    not null,
    address       text    not null,
    country       text    not null,
    region        text,
    sport         text    not null,
    archived      boolean not null default false,
    national      boolean not null default false,
    international boolean not null default false
);

create index tournaments_by_website_and_start on tournaments (website, starts);

-- The tournament each competition is in, whether it is archived and whether it
-- counts towards the world rankings. A competition's own events do not say
-- which tournament it is in, and its tournament's do, so this is written from
-- the tournament's stream and a competition's games, kept by the home page,
-- are put together with it when asked.
create table competitions (
    competition_id text    primary key,
    tournament_id  text    not null,
    world_rankings boolean not null default false,
    archived       boolean not null default false
);

create index competitions_by_tournament on competitions (tournament_id);

insert into tournaments
    (tournament_id, website, name, starts, finishes, address, country, region,
     sport, archived, national, international)
select tournament_id, website, name, starts, finishes, address, country,
       region, sport, archived, national, international
  from tournaments_by_website;

insert into competitions
    (competition_id, tournament_id, world_rankings, archived)
select c.competition_id, c.tournament_id,
       coalesce(a.world_rankings, false), c.archived
  from tournaments_by_website_competitions c
  left join tournaments_by_account_competitions a using (competition_id);

drop table tournaments_by_website;
drop table tournaments_by_website_competitions;
drop table tournaments_by_account_details;
drop table tournaments_by_account_competitions;

-- What the search keeps of a tournament beside it: its name folded as a search
-- folds what is typed. The folded name is kept rather than worked out as
-- names are compared, so that finding one is a comparison and not a
-- transformation of every name there is.
create table search_by_website_tournament_names (
    tournament_id text primary key,
    folded_name   text not null
);

insert into search_by_website_tournament_names (tournament_id, folded_name)
select tournament_id, folded_name from search_by_website_tournaments;

drop table search_by_website_tournaments;

-- A competition is told apart in the search by its name and its slug. Which
-- tournament it is in, and whether it is archived, are the competition's, held
-- once. A test is not searched for, so it has no row here.
alter table search_by_website_competitions
    drop column tournament_id,
    drop column archived;
