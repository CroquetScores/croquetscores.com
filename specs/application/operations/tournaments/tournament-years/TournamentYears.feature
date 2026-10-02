@postgres
Feature: The years a website has tournaments in

  The home page's secondary navigation offers the years there are
  tournaments in, newest first, each leading to that year's tournaments
  (`home.feature`). The application answers them for the website asked
  about: each year once, however many tournaments start in it.

  A tournament's year is the year it starts, which is the year in its
  address, so one over the new year is in the year it started. A year is
  answered for any tournament in it that is not archived, played or not and
  past or still to come, since a tournament set up for next year is one a
  reader may be looking for. A year whose only tournaments are archived is
  not answered, since there is nothing in it to send a reader to
  (`TournamentsByWebsite.feature`).

  This year is not answered unless there is a tournament in it: the home page
  offers the years there are tournaments in, and no others.

  The years are for anybody, so nobody need be signed in to ask, and every
  scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"

  Rule: The years answered are those with a tournament in them

    Scenario: The year a tournament starts in is answered
      Given the tournament is to start at "2024-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the years of tournaments are asked for
      Then the year 2024 is answered

    Scenario: A year with no tournament in it is not answered
      Given the tournament is to start at "2024-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the years of tournaments are asked for
      Then the year 2026 is not answered

    Scenario: A year still to come is answered
      Given the tournament is to start at "2027-03-06T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the years of tournaments are asked for
      Then the year 2027 is answered

    Scenario: A tournament over the new year is answered in the year it starts
      Given the tournament is to start at "2025-12-30T00:00:00Z"
      And the tournament is to finish at "2026-01-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "New Year Open"
      When the years of tournaments are asked for
      Then the year 2025 is answered

    Scenario: A tournament over the new year is not answered in the year it finishes
      Given the tournament is to start at "2025-12-30T00:00:00Z"
      And the tournament is to finish at "2026-01-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "New Year Open"
      When the years of tournaments are asked for
      Then the year 2026 is not answered

    Scenario: A website with no tournaments has no years
      When the years of tournaments are asked for
      Then no year is answered

  Rule: A year of archived tournaments alone is not answered

    Scenario: A year whose only tournament is archived is not answered
      Given the tournament is to start at "2024-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the years of tournaments are asked for
      Then the year 2024 is not answered

    Scenario: A year with an archived tournament and one in use is answered
      Given the tournament is to start at "2024-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the years of tournaments are asked for
      Then the year 2024 is answered

  Rule: The years are newest first, each once

    Scenario: The years are newest first
      Given the tournament is to start at "2024-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2027-03-06T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament is to start at "2025-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Summer Open"
      When the years of tournaments are asked for
      Then the first year answered is 2027
      And the second year answered is 2025
      And the third year answered is 2024

    Scenario: A year is answered once however many tournaments are in it
      Given the tournament is to start at "2026-03-07T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the years of tournaments are asked for
      Then 1 year is answered

  Rule: The years are of the website asked about

    Scenario: A year of another website's tournaments alone is not answered
      Given the tournament is to start at "2024-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the years of tournaments on "gateballscores.com" are asked for
      Then no year is answered
