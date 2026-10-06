@postgres
Feature: The notes of a tournament, as a manager lists them

  A manager lists a tournament's notes on the admin's Notes tab
  (`notes-tab.feature`) to find one, edit it and delete it, so the
  application answers with every note the tournament has, each with its id,
  its title, when it was written, and when it last changed. They are
  answered the most recently written first, as readers see them
  (`notes.feature`), since the newest note is the one a manager most often
  comes back to put right.

  A list is not where a note is read, so it is answered from the read model
  of the tournament's notes (`ManagerNotesByTournament.feature`), which holds
  no description. The note a manager edits is asked for by itself, with its
  description, once they choose it (`ManagerNoteToEdit.feature`).

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers can ask, since the list is for
  managing its notes: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A tournament there is not is refused as
  `ManagerNotesOfTournament.NoSuchTournament`.

  A forgotten account lists nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: Every note is answered, the most recently written first

    Scenario: A tournament with no notes is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then no manager notes are answered

    Scenario: A note added is listed
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then the first manager note answered is "Lunch is at noon"

    Scenario: The most recently written note is first
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then the first manager note answered is "Play starts at 9:30"
      And the second manager note answered is "Lunch is at noon"

    Scenario: An edited note keeps its place
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      And the moment "2026-09-26T12:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then the first manager note answered is "Play starts at 9:30"

    Scenario: A deleted note is not answered
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And "organiser@example.com" has deleted the manager note "Lunch is at noon" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then no manager notes are answered

  Rule: Each note is answered with when it was written and when it last changed

    Background:
      Given "organiser@example.com" has added the manager note "Lunch" to "Spring Open"

    Scenario: A note is answered with when it was written
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then the first manager note answered was written at "2026-09-26T10:00:00Z"

    Scenario: A note never edited last changed when it was written
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then the first manager note answered last changed at "2026-09-26T10:00:00Z"

    Scenario: An edited note last changed when it was edited
      Given the moment "2026-09-26T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch" of "Spring Open" to "Lunch moved"
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of "Spring Open"
      Then the first manager note answered last changed at "2026-09-26T11:00:00Z"

  Rule: Only a tournament there is can be asked about

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the manager notes of a tournament there is not
      Then it is refused with "ManagerNotesOfTournament.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" lists the manager notes of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the manager notes of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the manager notes of "Spring Open"
      Then it is refused with "Account.Forgotten"
