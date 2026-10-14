-- A player's page lists the tournaments they have played in, once each, and
-- leads to their own page in each, which is where their slug there says. So
-- each player is kept with the slug the tournament gave them, and the
-- competitions they are entered in, and the order of competitions, which the
-- page no longer lists, are not kept.
alter table search_by_website_players add column slug text not null default '';

drop table search_by_website_entries;

alter table search_by_website_competitions drop column competition_order;
