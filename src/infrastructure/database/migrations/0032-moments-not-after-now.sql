-- No moment a read model keeps of a row is after the moment this is run.
--
-- The events imported from the old sites say they happened on the day a
-- tournament starts, so 135 tournaments, and what is in them, were kept as
-- changed in the future, and every answer of what has changed since told of
-- them, whenever it was asked (issue 751). Projecting an event now holds its
-- moment back to the moment it is written (`writtenMoment.ts`); this does the
-- same for what is kept already, without making the read models again.
--
-- A read model, so the events are not touched. A moment that is not after now
-- is left as it is, and one that is, is given now. Making the read models
-- again gives each such row the moment of that rebuild instead, which is also
-- not after the moment it is run. The tables of the import are not touched,
-- nor are sessions, which are not made from events.
update account_names set changed_at = now() where changed_at > now();
update accounts_by_api_key set changed_at = now() where changed_at > now();
update accounts_by_email_address set changed_at = now() where changed_at > now();
update accounts_by_google_account set changed_at = now() where changed_at > now();
update accounts_by_role set changed_at = now() where changed_at > now();
update commentaries_by_tournament set changed_at = now() where changed_at > now();
update commentaries_by_tournament set started_at = now() where started_at > now();
update commentary_comments set changed_at = now() where changed_at > now();
update commentary_comments set created_at = now() where created_at > now();
update competition_byes set changed_at = now() where changed_at > now();
update competition_entries set changed_at = now() where changed_at > now();
update competition_games set added_at = now() where added_at > now();
update competition_games set changed_at = now() where changed_at > now();
update competition_standings set changed_at = now() where changed_at > now();
update competition_standings_kept set changed_at = now() where changed_at > now();
update competitions set changed_at = now() where changed_at > now();
update manager_notes_by_tournament set changed_at = now() where changed_at > now();
update manager_notes_by_tournament set created_at = now() where created_at > now();
update search_by_website_competitions set changed_at = now() where changed_at > now();
update search_by_website_players set changed_at = now() where changed_at > now();
update search_by_website_tournament_names set changed_at = now() where changed_at > now();
update tournament_players set changed_at = now() where changed_at > now();
update tournament_team_players set changed_at = now() where changed_at > now();
update tournament_teams set changed_at = now() where changed_at > now();
update tournament_years set changed_at = now() where changed_at > now();
update tournaments set archived_at = now() where archived_at > now();
update tournaments set changed_at = now() where changed_at > now();
update tournaments_by_account set changed_at = now() where changed_at > now();
update tournaments_by_address set changed_at = now() where changed_at > now();
