@postgres
Feature: One of a tournament's notes, as a manager edits it

  A manager edits a note in the admin's note panel, which begins as the
  note is (`notePanel.feature`). The list it is chosen from holds no
  description (`ManagerNotesOfTournament.feature`), so the note is asked for
  by itself once it is chosen, and the application answers it from the
  note's own stream: its title, and its description if it has one.

  The tournament is named by its id, and the note by its id. A tournament
  there is not is refused as `ManagerNoteToEdit.NoSuchTournament`, and a
  note it does not have, one of another tournament's or one deleted among
  them, as `ManagerNoteToEdit.NoSuchManagerNote`.

  It answers the account the reader is signed in to, and never one the
  reader chose. Only the tournament's managers can ask, since only they can
  edit a note: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager`. A forgotten account is refused with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the manager note is to say "In the **clubhouse**"
    And "organiser@example.com" has added the manager note "Lunch" to "Spring Open"

  Rule: The note is answered as it is now

    Scenario: The note's title is answered
      When the reader signed in to the account for "organiser@example.com" asks for the manager note "Lunch" of "Spring Open" to edit
      Then the manager note answered is called "Lunch"

    Scenario: The note's description is answered
      When the reader signed in to the account for "organiser@example.com" asks for the manager note "Lunch" of "Spring Open" to edit
      Then the manager note answered says "In the **clubhouse**"

    Scenario: A note with no description is answered saying nothing more
      Given the manager note is to say ""
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" asks for the manager note "Play starts at 9:30" of "Spring Open" to edit
      Then the manager note answered says nothing more

    Scenario: An edited note is answered as it was edited
      Given the manager note is to say "At one"
      And "organiser@example.com" has edited the manager note "Lunch" of "Spring Open" to "Lunch moved"
      When the reader signed in to the account for "organiser@example.com" asks for the manager note "Lunch moved" of "Spring Open" to edit
      Then the manager note answered says "At one"

  Rule: Only a note of the tournament, not deleted, is answered

    Scenario: A note the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" asks for a manager note "Spring Open" does not have to edit
      Then it is refused with "ManagerNoteToEdit.NoSuchManagerNote"

    Scenario: A deleted note is refused
      Given "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" asks for the manager note "Lunch" of "Spring Open" to edit
      Then it is refused with "ManagerNoteToEdit.NoSuchManagerNote"

    Scenario: Another tournament's note is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the manager note "Tea" to "Autumn Open"
      When the reader signed in to the account for "organiser@example.com" asks for the manager note "Tea" of "Autumn Open" as a note of "Spring Open" to edit
      Then it is refused with "ManagerNoteToEdit.NoSuchManagerNote"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" asks for a manager note of a tournament there is not to edit
      Then it is refused with "ManagerNoteToEdit.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" asks for the manager note "Lunch" of "Spring Open" to edit
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" asks for the manager note "Lunch" of "Spring Open" to edit
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account is refused

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account asks for the manager note "Lunch" of "Spring Open" to edit
      Then it is refused with "Account.Forgotten"
