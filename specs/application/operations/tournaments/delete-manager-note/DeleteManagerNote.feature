@postgres
Feature: Deleting a manager's note

  A manager of the tournament can delete any of its notes, from the admin's
  Notes tab (`notes-tab.feature`), and it is gone for good
  (`delete.feature`). The tournament is named by its id, and the
  note by its id; a tournament there is not is refused as
  `DeleteManagerNote.NoSuchTournament`, and a note it does not have, one of
  another tournament's among them, as `DeleteManagerNote.NoSuchManagerNote`.
  A note already deleted is the note's to refuse (`delete.feature`). Only
  the tournament's managers can, as the tournament says
  (`writeManagerNotes.feature`): anybody else, a scorer among them, is
  refused with `Tournament.NotAManager`.

  A forgotten account deletes nothing, and is refused with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the manager note "Lunch" to "Spring Open"

  Rule: A note deleted is gone

    Scenario: The tournament no longer has the note
      When the reader signed in to the account for "organiser@example.com" deletes the manager note "Lunch" of "Spring Open"
      Then "Spring Open" has no manager notes

    Scenario: Deleting the note is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" deletes the manager note "Lunch" of "Spring Open"
      Then the manager note "Lunch" of "Spring Open" was deleted by the account for "organiser@example.com"

  Rule: Only a note of the tournament, not deleted, can be deleted

    Scenario: Deleting a note already deleted is refused as the note refuses it
      Given "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" deletes the manager note "Lunch" of "Spring Open"
      Then it is refused with "ManagerNote.Deleted"

    Scenario: Deleting a note the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" deletes a manager note "Spring Open" does not have
      Then it is refused with "DeleteManagerNote.NoSuchManagerNote"

    Scenario: Deleting a note on an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" deletes the manager note "Lunch" of "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a note deleted

    Scenario: Deleting a note of a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" deletes a manager note of a tournament there is not
      Then it is refused with "DeleteManagerNote.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" deletes the manager note "Lunch" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" deletes the manager note "Lunch" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account deletes nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account deletes the manager note "Lunch" of "Spring Open"
      Then it is refused with "Account.Forgotten"
