@postgres
Feature: The commentaries on a tournament, for anybody to read

  A tournament's commentaries page lists its commentaries, each leading to
  its own page (`commentaries.feature`). The application answers them: every
  commentary on the tournament, the most recently started first, so that the
  one being written today is at the top of the list rather than under every
  day before it. Each is answered with its title, the name its writer is
  called now, since a commentary is one writer's account and a reader chooses
  whose to read, and where its page is found, which is the tournament's
  address followed by "commentaries" and the commentary's slug
  (`startCommentary.feature`).

  A commentary whose writer's account has since been forgotten is not
  answered. Every word of it is that account's, under that account's name,
  and a forgotten account is not one a reader is shown anything of. It is
  set aside rather than done away with, and keeps its title and its slug,
  as an archived team keeps its own (`addTeam.feature`), so that a link
  kept to it never leads to somebody else's words (`StartCommentary.feature`).

  The page is a section of the tournament's, so the tournament is answered
  with it as its players are (`PublicPlayersOfTournament.feature`): its name,
  where it is found now, and its competitions in use with where each is
  found, which is what the page's section bar leads to.

  An address no tournament of the website has been found at, or whose
  tournament is archived, is refused as
  `PublicCommentariesOfTournament.NoSuchTournament`. An address the
  tournament has moved on from still finds it, and it is answered with where
  it is found now.

  A tournament's commentaries are for anybody, so nobody need be signed in to
  ask, and every scenario here asks with nobody signed in. They are asked for
  by the tournament's address on the website being read, as a reader's
  browser names it.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer"

  Rule: Every commentary is answered, the most recently started first

    Scenario: A commentary is answered
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the first commentary answered is "Day one"

    Scenario: The commentaries are answered the most recently started first
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the moment "2026-09-27T10:00:00Z"
      And "writer@example.com" has started the commentary "Day two" on "Spring Open"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the first commentary answered is "Day two"
      And the second commentary answered is "Day one"

    Scenario: A tournament with no commentaries answers none
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then 0 commentaries are answered

  Rule: A commentary whose writer has been forgotten is not answered

    Scenario: A commentary started by an account since forgotten is not answered
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the account for "writer@example.com" is taken hold of
      And the account for "writer@example.com" has been forgotten
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then 0 commentaries are answered

    Scenario: Another writer's commentary is answered beside a forgotten account's
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "someone@example.com" has started the commentary "Day two" on "Spring Open"
      And the account for "someone@example.com" is taken hold of
      And the account for "someone@example.com" has been forgotten
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the first commentary answered is "Day one"

  Rule: Each commentary is answered with its writer and where its page is found

    Scenario: A commentary is answered with its writer's name
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the commentary "Day one" is answered as written by "Wren Writer"

    Scenario: A commentary is answered with the name its writer is called now
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the reader signed in to the account for "writer@example.com" changes its name to "Wren Wright"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the commentary "Day one" is answered as written by "Wren Wright"

    Scenario: A commentary is answered with where its page is found
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the commentary "Day one" is answered as found at "2026/ac/spring-open/commentaries/day-one"

    Scenario: A commentary of a tournament found at its old address is found at its address now
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the commentary "Day one" is answered as found at "2026/gc/spring-open/commentaries/day-one"

  Rule: The tournament is answered as its page's section bar shows it

    Scenario: The tournament's name is answered
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: A competition is answered with where it is found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the competition "Block A" is answered as found at "2026/ac/spring-open/competitions/block-a"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: An address with no tournament a reader is sent to is refused

    Scenario: An address no tournament has been found at is refused
      When the public commentaries of the tournament at "2026/ac/autumn-open" are asked for
      Then it is refused with "PublicCommentariesOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the public commentaries of the tournament at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicCommentariesOfTournament.NoSuchTournament"

    Scenario: A tournament on another website is refused
      When the public commentaries of the tournament on "gateballscores.com" at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicCommentariesOfTournament.NoSuchTournament"
