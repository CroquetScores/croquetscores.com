@postgres
Feature: One of a tournament's manager's notes, for anybody to read

  Each of the notes a tournament's managers write has a page of its own,
  where a reader reads it (`note.feature`). The application answers it: its
  title, its description if it has one, when it was written, when it was
  last edited if it has been, and when it last changed, which is what tells
  the page that the reader has now read it as it is (`notes.feature`).

  This is where a note is read, so it is answered from the note's own
  stream, which holds its description (`add.feature`). The tournament's other
  notes, which the section bar marks Notes by, are answered from the read
  model of the tournament's notes, which holds none
  (`ManagerNotesByTournament.feature`).

  The note is asked for by the part of its id after "manager-note/", which
  is where its page is found (`PublicManagerNotesOfTournament.feature`). A
  note the tournament does not have, one deleted among them, is refused as
  `PublicManagerNoteOfTournament.NoSuchManagerNote`, and so is anything
  asked for that is no note's id at all, since a reader's browser can name
  anything.

  The page is a section of the tournament's, so the tournament is answered
  with it as its notes are (`PublicManagerNotesOfTournament.feature`),
  each of its notes among it by its id with when it last changed, for the
  section bar to mark its Notes section by (`notes.feature`). An
  address no tournament of the website has been found at, or whose
  tournament is archived, is refused as
  `PublicManagerNoteOfTournament.NoSuchTournament`.

  A tournament's notes are for anybody, so nobody need be signed in to ask,
  and every scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the manager note is to say "In the **clubhouse**"
    And "organiser@example.com" has added the manager note "Lunch" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

  Rule: The note is answered by the part of its id after "manager-note/"

    Scenario: The note's title is answered
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered is called "Lunch"

    Scenario: The note's description is answered
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered says "In the **clubhouse**"

    Scenario: A note with no description is answered saying nothing more
      Given the manager note is to say ""
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the public manager note "9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered says nothing more

    Scenario: The note is answered with when it was written
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered was written at "2026-09-26T10:00:00Z"

    Scenario: A note never edited is answered as never edited
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered has never been edited

    Scenario: An edited note is answered with when it was last edited
      Given the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch" of "Spring Open" to "Lunch moved"
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered was last edited at "2026-09-26T11:00:00Z"

    Scenario: An edited note last changed when it was last edited
      Given the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch" of "Spring Open" to "Lunch moved"
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the manager note answered last changed at "2026-09-26T11:00:00Z"

  Rule: Only a note the tournament has is answered

    Scenario: A deleted note is refused
      Given "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicManagerNoteOfTournament.NoSuchManagerNote"

    Scenario: A note the tournament never had is refused
      When the public manager note "9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicManagerNoteOfTournament.NoSuchManagerNote"

    Scenario: What is no note's id at all is refused
      When the public manager note "lunch" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicManagerNoteOfTournament.NoSuchManagerNote"

  Rule: The tournament is answered as its page's section bar shows it

    Scenario: The tournament's name is answered
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is called "Spring Open"

    Scenario: The tournament's manager notes are answered with when each last changed
      Given the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the first manager note of the tournament answered last changed at "2026-09-26T11:00:00Z"

    Scenario: A tournament found at its old address is answered with where it is found now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then the tournament answered is found at "2026/gc/spring-open"

  Rule: An address with no tournament a reader is sent to is refused

    Scenario: An address no tournament has been found at is refused
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/autumn-open" is asked for
      Then it is refused with "PublicManagerNoteOfTournament.NoSuchTournament"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the public manager note "0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" of the tournament at "2026/ac/spring-open" is asked for
      Then it is refused with "PublicManagerNoteOfTournament.NoSuchTournament"
