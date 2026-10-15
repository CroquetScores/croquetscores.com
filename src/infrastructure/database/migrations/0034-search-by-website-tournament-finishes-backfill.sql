-- The tournaments the search kept before it kept the day each finishes were
-- given the first day of the calendar for it (0033), which a player's page
-- would write as the day the tournament finishes until the read models are
-- rebuilt. Each runs for its first day until they are, which is a day that
-- is true of it and reads as one.
update search_by_website_tournaments
   set finishes = starts
 where finishes = '0001-01-01';
