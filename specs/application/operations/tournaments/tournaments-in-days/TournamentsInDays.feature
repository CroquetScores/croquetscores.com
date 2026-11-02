@postgres
Feature: The tournaments starting from one day to another, a page at a time

  A reader can ask a list of tournaments for those starting from a day they
  choose to another (`TournamentFilter.feature`), and the list is answered a
  page at a time, a hundred to a page, so that a website with many years of
  tournaments never sends a reader every one at once. The pages are the
  application's to cut, since the web pages and the admin list ask the same
  and must agree on where one page ends.

  Both days are included, and it is a tournament's start that is compared. The
  tournaments are answered the soonest first, and those starting on the same
  day by name, as a year's are (`TournamentsInYear.feature`), so that a
  tournament is on the same page from one visit to the next and is never on
  two.

  Pages are counted from the first. A page asked for beyond the last is not a
  mistake, since a reader whose list shrank under them is not at fault: it is
  answered with no tournaments, and with the number of the last page so that
  the page can send the reader there. A page that is not a whole number of at
  least one is refused as `TournamentsInDays.NoSuchPage`.

  An archived tournament is not answered, and the list is of the website asked
  about (`TournamentsByWebsite.feature`).

  Where a scenario says nothing else, the days asked for are "2026-03-01" to
  "2026-03-31", and a tournament starts on "2026-03-10".

  Rule: Only tournaments starting from the first day to the last are answered

    Scenario: A tournament starting on the first day is answered
    Scenario: A tournament starting on the last day is answered
    Scenario: A tournament starting the day before the first day is not answered
    Scenario: A tournament starting the day after the last day is not answered
    Scenario: A tournament starting before and finishing inside the days is not answered

  Rule: A hundred tournaments are answered to a page

    Scenario: A hundred tournaments are answered on the first page
    Scenario: A hundred and one tournaments are answered a hundred on the first page
    Scenario: A hundred and one tournaments are answered one on the second page
    Scenario: The soonest hundred are on the first page
    Scenario: Tournaments starting on the same day are cut by name
    Scenario: The number of tournaments in all is answered with a page
    Scenario: The number of the last page is answered with a page
    Scenario: No tournaments is answered as one page with nothing on it

  Rule: A page there is not is refused or is empty

    Scenario: A page beyond the last is answered with no tournaments
    Scenario: A page beyond the last is answered with the number of the last page
    Scenario: Page 0 is refused
    Scenario: A page that is not a whole number is refused
