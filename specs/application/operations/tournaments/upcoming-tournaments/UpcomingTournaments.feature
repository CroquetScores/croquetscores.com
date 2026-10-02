@postgres
Feature: The tournaments about to start

  The home page lists the tournaments that start from today to sixty days
  from today, the soonest first (`home.feature`). The application answers
  them: each with its name, its dates, the country it is played in, and where
  it is found, as recent results are (`RecentResults.feature`).

  A tournament's days are kept as days, with no time of day and no time zone
  of their own, so today is the day of the moment the reader asked, in UTC,
  as the days themselves are. Sixty days from today is the last day a
  tournament may start on and be answered, so both ends are answered. The
  moment is handed down from the edge with the question, since nothing below
  the web layer reads a clock.

  A tournament that started yesterday and is still being played is not
  about to start. A reader following it finds it among the recent results
  once a game is added to it.

  Tournaments starting on the same day are answered by name, so that the
  order does not change from one visit to the next. An archived tournament is
  not answered (`TournamentsByWebsite.feature`).

  The list is of the website asked about, and can be narrowed to a country, a
  region of it and a sport (`TournamentFilter.feature`). A country is named by
  its code, and one there is not is refused as
  `UpcomingTournaments.NoSuchCountry`. Anything else a filter cannot be is the
  filter's to refuse.

  Upcoming tournaments are for anybody, so nobody need be signed in to ask,
  and every scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be for the sport "ac"
    And the tournament is to be played in the country "nz"
    And the tournament is to be played in the region "can"

  Rule: A tournament starting from today to sixty days from today is answered

    Scenario: A tournament starting today is answered
      Given the tournament is to start at "2026-10-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament starting in a month is answered
      Given the tournament is to start at "2026-11-07T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament starting sixty days from today is answered
      Given the tournament is to start at "2026-12-01T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament starting sixty-one days from today is not answered
      Given the tournament is to start at "2026-12-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament that started yesterday is not answered
      Given the tournament is to start at "2026-10-01T00:00:00Z"
      And the tournament is to finish at "2026-10-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

  Rule: Today is the day in UTC

    Scenario: Just before midnight in UTC, a tournament starting that day is answered
      Given the tournament is to start at "2026-10-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T23:59:00Z"
      Then "Spring Open" is answered

    Scenario: Just after midnight in UTC, a tournament that started the day before is not answered
      Given the tournament is to start at "2026-10-01T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T00:01:00Z"
      Then "Spring Open" is not answered

  Rule: An archived tournament is not answered

    Scenario: An archived tournament starting soon is not answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament restored is answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has restored the tournament "Spring Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

  Rule: The tournament starting soonest comes first

    Scenario: The tournament starting soonest is first
      Given the tournament is to start at "2026-11-07T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then the first tournament answered is "Autumn Open"
      And the second tournament answered is "Spring Open"

    Scenario: Tournaments starting on the same day are answered by name
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then the first tournament answered is "Autumn Open"
      And the second tournament answered is "Spring Open"

  Rule: What is answered of a tournament is what a row shows and where it leads

    Background:
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And the tournament is to finish at "2026-10-12T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"

    Scenario: The tournament's start is answered
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered as starting on "2026-10-10"

    Scenario: The tournament's finish is answered
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered as finishing on "2026-10-12"

    Scenario: The tournament's country is answered
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered as played in the country "nz"

    Scenario: The tournament's address is answered
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered at the address "2026/ac/spring-open"

  Rule: The tournaments are of the website asked about

    Scenario: A tournament on another website is not answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the upcoming tournaments on "gateballscores.com" are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

  Rule: The tournaments are narrowed by the filter

    Background:
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"

    Scenario: A tournament in the country filtered by is answered
      Given a filter of the country "nz"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament in another country is not answered
      Given a filter of the country "au"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament in the region filtered by is answered
      Given a filter of the country "nz"
      And a filter of the region "can"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament in another region is not answered
      Given a filter of the country "nz"
      And a filter of the region "auc"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

    Scenario: A tournament for the sport filtered by is answered
      Given a filter of the sport "ac"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is answered

    Scenario: A tournament for another sport is not answered
      Given a filter of the sport "gc"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then "Spring Open" is not answered

  Rule: A filter there cannot be is refused

    Scenario: A country there is not is refused
      Given a filter of the country "xx"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "UpcomingTournaments.NoSuchCountry"

    Scenario: A region the country does not have is refused
      Given a filter of the country "au"
      And a filter of the region "can"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "TournamentFilter.RegionNotInCountry"

    Scenario: A region without a country is refused
      Given a filter of the region "can"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "TournamentFilter.RegionWithoutCountry"

    Scenario: A sport the website does not offer is refused
      Given a filter of the sport "gb"
      When the upcoming tournaments are asked for at "2026-10-02T10:00:00Z"
      Then it is refused with "TournamentFilter.SportNotOffered"
