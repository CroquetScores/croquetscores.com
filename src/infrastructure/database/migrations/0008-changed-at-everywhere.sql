-- When each row of every read model last changed, so that every read model has
-- the moment (#699), for possible future use: nothing reads it yet. The value is
-- the `occurredAt` of the last event that changed the row, and never the moment
-- the row was written, so a rebuild gives what the live projection did. It moves
-- only when an event changes that row.
--
-- A tournament, a competition and a game have theirs from 0003, and the notes
-- and the commentaries kept it from the beginning.
--
-- Nothing here is filled in by the migration: a moment can only be told from the
-- events, so it is empty until the read models are made again.

alter table accounts_by_email_address         add column changed_at timestamptz;
alter table accounts_by_google_account        add column changed_at timestamptz;
alter table accounts_by_role                  add column changed_at timestamptz;
alter table accounts_by_api_key               add column changed_at timestamptz;
alter table tournaments_by_address            add column changed_at timestamptz;
alter table tournaments_by_account            add column changed_at timestamptz;
alter table search_by_website_tournament_names add column changed_at timestamptz;
alter table search_by_website_competitions    add column changed_at timestamptz;
alter table search_by_website_players         add column changed_at timestamptz;
alter table search_by_website_teams           add column changed_at timestamptz;
alter table tournament_players                add column changed_at timestamptz;
alter table tournament_teams                  add column changed_at timestamptz;
alter table tournament_team_players           add column changed_at timestamptz;
alter table competition_entries               add column changed_at timestamptz;
alter table competition_byes                  add column changed_at timestamptz;
alter table competition_standings             add column changed_at timestamptz;
