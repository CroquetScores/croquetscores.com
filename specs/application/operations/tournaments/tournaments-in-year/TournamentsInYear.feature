@postgres
Feature: The tournaments starting in a year

  Each year there are tournaments in has a page of its own, listing every one
  of them (`year.feature`), which a reader reaches from the years on the home
  page (`home.feature`). The application answers them: each with its name, its
  dates, the country it is played in, and where it is found, as the recent
  results and the upcoming tournaments are (`RecentResults.feature`,
  `UpcomingTournaments.feature`).

  A tournament is in the year it starts in, which is the year in its address,
  so one over the new year is in the year it started and not in the year it
  finishes. Every tournament starting in the year is answered, played or not
  and past or still to come, since a reader looking at a year is looking for
  any tournament in it. An archived tournament is not answered, since it is
  not one a reader is sent to (`TournamentsByWebsite.feature`).

  They are answered the soonest first, as a year is read, and those starting
  on the same day by name, so that the order does not change from one visit to
  the next.

  The read model already finds a website's tournaments starting from one day
  to another, so a year is asked of it as the days from its first to its last.

  The list is of the website asked about, and can be narrowed to a country, a
  region of it and a sport (`TournamentFilter.feature`). A country is named by
  its code, and one there is not is refused as `TournamentsInYear.NoSuchCountry`.
  Anything else a filter cannot be is the filter's to refuse. A sport's page
  in a year asks the same, narrowed to the sport its address names
  (`yearSport.feature`).

  The tournaments in a year are for anybody, so nobody need be signed in to
  ask, and every scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be for the sport "ac"
    And the tournament is to be played in the country "nz"
    And the tournament is to be played in the region "can"

  Rule: A tournament starting in the year is answered

    Scenario: A tournament starting in the year is answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered

    Scenario: A tournament starting in another year is not answered
      Given the tournament is to start at "2027-03-06T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is not answered

    Scenario: A tournament starting on the first day of the year is answered
      Given the tournament is to start at "2026-01-01T00:00:00Z"
      And "organiser@example.com" has created the tournament "New Year Open"
      When the tournaments in 2026 are asked for
      Then "New Year Open" is answered

    Scenario: A tournament starting on the last day of the year is answered
      Given the tournament is to start at "2026-12-31T00:00:00Z"
      And "organiser@example.com" has created the tournament "Year End Open"
      When the tournaments in 2026 are asked for
      Then "Year End Open" is answered

    Scenario: A tournament already played is answered
      Given the tournament is to start at "2026-03-07T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered

    Scenario: A year with no tournaments in it answers none
      Given the tournament is to start at "2027-03-06T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments in 2026 are asked for
      Then 0 tournaments are answered

  Rule: A tournament over the new year is in the year it starts

    Background:
      Given the tournament is to start at "2025-12-30T00:00:00Z"
      And the tournament is to finish at "2026-01-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "New Year Open"

    Scenario: It is answered in the year it starts
      When the tournaments in 2025 are asked for
      Then "New Year Open" is answered

    Scenario: It is not answered in the year it finishes
      When the tournaments in 2026 are asked for
      Then "New Year Open" is not answered

  Rule: An archived tournament is not answered

    Scenario: An archived tournament is not answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is not answered

    Scenario: A tournament restored is answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has restored the tournament "Spring Open"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered

  Rule: The tournament starting soonest comes first

    Scenario: The tournament starting soonest is first
      Given the tournament is to start at "2026-11-07T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2026-03-07T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the tournaments in 2026 are asked for
      Then the first tournament answered is "Autumn Open"
      And the second tournament answered is "Spring Open"

    Scenario: Tournaments starting on the same day are answered by name
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the tournaments in 2026 are asked for
      Then the first tournament answered is "Autumn Open"
      And the second tournament answered is "Spring Open"

  Rule: What is answered of a tournament is what a row shows and where it leads

    Background:
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And the tournament is to finish at "2026-10-12T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"

    Scenario: The tournament's start is answered
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered as starting on "2026-10-10"

    Scenario: The tournament's finish is answered
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered as finishing on "2026-10-12"

    Scenario: The tournament's country is answered
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered as played in the country "nz"

    Scenario: The tournament's address is answered
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered at the address "2026/ac/spring-open"

  Rule: The tournaments are of the website asked about

    Scenario: A tournament on another website is not answered
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the tournaments on "gateballscores.com" in 2026 are asked for
      Then "Spring Open" is not answered

  Rule: The tournaments are narrowed by the filter

    Background:
      Given the tournament is to start at "2026-10-10T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"

    Scenario: A tournament in the country filtered by is answered
      Given a filter of the country "nz"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered

    Scenario: A tournament in another country is not answered
      Given a filter of the country "au"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is not answered

    Scenario: A tournament in the region filtered by is answered
      Given a filter of the country "nz"
      And a filter of the region "can"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered

    Scenario: A tournament in another region is not answered
      Given a filter of the country "nz"
      And a filter of the region "auc"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is not answered

    Scenario: A tournament for the sport filtered by is answered
      Given a filter of the sport "ac"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is answered

    Scenario: A tournament for another sport is not answered
      Given a filter of the sport "gc"
      When the tournaments in 2026 are asked for
      Then "Spring Open" is not answered

  Rule: A year is one a tournament can start in

    A tournament's address holds the year it starts to four digits, the first
    not a nought (`TournamentAddress.feature`), so no tournament can start in
    any other year. Any other is refused as `TournamentsInYear.YearOutOfRange`
    rather than asked of the read model, which has no day before the year 1
    to ask for, and would fail rather than answer none. The year's page takes
    no other year from its address (`year.feature`), so this is for whatever
    else asks.

    Scenario Outline: A year a tournament cannot start in is refused
      When the tournaments in <year> are asked for
      Then it is refused with "TournamentsInYear.YearOutOfRange"

      Examples:
        | year  |
        | 0     |
        | -5    |
        | 999   |
        | 10000 |

    Scenario Outline: The first and the last year a tournament can start in are asked for
      When the tournaments in <year> are asked for
      Then 0 tournaments are answered

      Examples:
        | year |
        | 1000 |
        | 9999 |

  Rule: A filter there cannot be is refused

    Scenario: A country there is not is refused
      Given a filter of the country "xx"
      When the tournaments in 2026 are asked for
      Then it is refused with "TournamentsInYear.NoSuchCountry"

    Scenario: A region the country does not have is refused
      Given a filter of the country "au"
      And a filter of the region "can"
      When the tournaments in 2026 are asked for
      Then it is refused with "TournamentFilter.RegionNotInCountry"

    Scenario: A region without a country is refused
      Given a filter of the region "can"
      When the tournaments in 2026 are asked for
      Then it is refused with "TournamentFilter.RegionWithoutCountry"

    Scenario: A sport the website does not offer is refused
      Given a filter of the sport "gb"
      When the tournaments in 2026 are asked for
      Then it is refused with "TournamentFilter.SportNotOffered"
