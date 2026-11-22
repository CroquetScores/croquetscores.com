@postgres
Feature: The tournaments at some addresses

  The home page lists the tournaments a reader has visited lately
  (`visitedTournaments.feature`), and the device remembers each only by its
  address, as "2026/ac/spring-open", since that is what the reader was sent
  to. So the home page asks what the tournaments at those addresses are now,
  to draw each as a row of its list. Each is answered as the other lists of
  tournaments answer one, in the order the addresses were given, since that is
  the order the reader visited them in.

  It is for anybody, since tournaments are public. An address that is no
  tournament's, or is a tournament archived or on another website, is left out
  of the answer and not refused: a device may remember a tournament that has
  since gone, and the list is still to be drawn. So is an address a tournament
  has moved on from, which is no longer its address.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-10T00:00:00Z"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has created the tournament "Autumn Open"

  Rule: A tournament is answered for the address it is at

    Scenario: A tournament is answered
      Given the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then "Spring Open" is answered

    Scenario: A tournament at no address asked about is not answered
      Given the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then "Autumn Open" is not answered

    Scenario: A tournament is answered as the other lists answer one
      Given the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then "Spring Open" is answered at the address "2026/ac/spring-open"

  Rule: The tournaments are answered in the order the addresses were given

    Scenario: The first address asked about is answered first
      Given the address "2026/ac/spring-open" is asked about
      And the address "2026/ac/autumn-open" is asked about
      When the tournaments at the addresses are asked for
      Then the first tournament answered is "Spring Open"

    Scenario: The second address asked about is answered second
      Given the address "2026/ac/spring-open" is asked about
      And the address "2026/ac/autumn-open" is asked about
      When the tournaments at the addresses are asked for
      Then the second tournament answered is "Autumn Open"

    Scenario: The order is the addresses' and not the tournaments'
      Given the address "2026/ac/autumn-open" is asked about
      And the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then the first tournament answered is "Autumn Open"

    Scenario: An address given twice answers its tournament once
      Given the address "2026/ac/spring-open" is asked about
      And the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then 1 tournament is answered

  Rule: What is no tournament here is left out

    Scenario: An address that is no tournament's is left out
      Given the address "2026/ac/no-such-open" is asked about
      When the tournaments at the addresses are asked for
      Then 0 tournaments are answered

    Scenario: Something that is not an address is left out
      Given the address "not an address" is asked about
      When the tournaments at the addresses are asked for
      Then 0 tournaments are answered

    Scenario: An address that is left out leaves the others answered
      Given the address "2026/ac/no-such-open" is asked about
      And the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then "Spring Open" is answered

    Scenario: A tournament on another website is left out
      Given the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses on "gateballscores.com" are asked for
      Then 0 tournaments are answered

    Scenario: An archived tournament is left out
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the address "2026/ac/spring-open" is asked about
      When the tournaments at the addresses are asked for
      Then 0 tournaments are answered

    Scenario: An address a tournament has moved on from is left out
      Given the address "2026/ac/spring-open" is asked about
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the tournaments at the addresses are asked for
      Then 0 tournaments are answered

  Rule: Only text can be asked about

    Scenario: An address that is not text is refused
      Given the address is not text
      When the tournaments at the addresses are asked for
      Then it is refused with "TournamentsAtAddresses.NotText"
