@postgres
Feature: The manager's notes of a tournament, for anybody to read

  A tournament's Notes page lists the notes its managers have written, each
  leading to its own page (`notes.feature`). The application answers them:
  every note of the tournament, the most recently written first, so that
  today's news is at the top of the list rather than under every day before
  it. An edited note keeps its place, since it is still the note it was.

  Each is answered with its title, where its page is found, which is the
  tournament's address followed by "notes" and the part of the note's id
  after "manager-note/", since a note has no slug and its title can be
  changed; when it was written; and when it last changed, which is when it
  was last edited, or when it was written if it never has been. A reader is
  shown which notes they have not read since they last changed
  (`notes.feature`), and the time is what that is told by.

  A list is not where a note is read, so the notes are answered from the
  read model of the tournament's notes (`ManagerNotesByTournament.feature`),
  which holds no description, rather than from each note's own stream.

  The page is a section of the tournament's, so the tournament is answered
  with it as its players are (`PublicPlayersOfTournament.feature`): its name,
  where it is found now, its notes for the header, and its competitions in
  use with where each is found, which is what the page's section bar leads
  to.

  An address no tournament of the website has been found at, or whose
  tournament is archived, is refused as
  `PublicManagerNotesOfTournament.NoSuchTournament`. An address the
  tournament has moved on from still finds it, and it is answered with where
  it is found now.

  A tournament's notes are for anybody, so nobody need be signed in to ask,
  and every scenario here asks with nobody signed in. They are asked for by
  the tournament's address on the website being read, as a reader's browser
  names it.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every note is answered, the most recently written first

    Scenario: A note is answered
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered is "Lunch is at noon"

    Scenario: The notes are answered the most recently written first
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered is "Play starts at 9:30"
      And the second manager note answered is "Lunch is at noon"

    Scenario: An edited note keeps its place
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      And the moment "2026-09-26T12:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered is "Play starts at 9:30"

    Scenario: A deleted note is not answered
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And "organiser@example.com" has deleted the manager note "Lunch is at noon" of "Spring Open"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then no manager notes are answered

    Scenario: A tournament with no notes answers none
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then no manager notes are answered

  Rule: Each note is answered with where its page is found, and when it was written and last changed

    Background:
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note is answered with where its page is found
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered is found at "2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note of a tournament found at its old address is found at its address now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered is found at "2026/gc/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note is answered with when it was written
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered was written at "2026-09-26T10:00:00Z"

    Scenario: A note never edited last changed when it was written
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered last changed at "2026-09-26T10:00:00Z"

    Scenario: An edited note last changed when it was last edited
      Given the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the first manager note answered last changed at "2026-09-26T11:00:00Z"

  Rule: The tournament is answered as its page's section bar shows it

    Scenario: The tournament's name is answered
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The tournament's notes are answered
      Given the tournament "Spring Open" has the notes "Lunch is at **noon**"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered has the notes "Lunch is at **noon**"

    Scenario: A competition is answered with where it is found
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the competition "Block A" is answered as found at "2026/ac/spring-open/competitions/block-a"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: An address with no tournament a reader is sent to is refused

    Scenario: An address no tournament has been found at is refused
      When the public manager notes of the tournament at "2026/ac/autumn-open" are asked for
      Then it is refused with "PublicManagerNotesOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the public manager notes of the tournament at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicManagerNotesOfTournament.NoSuchTournament"

    Scenario: A tournament on another website is refused
      When the public manager notes of the tournament on "gateballscores.com" at "2026/ac/spring-open" are asked for
      Then it is refused with "PublicManagerNotesOfTournament.NoSuchTournament"
