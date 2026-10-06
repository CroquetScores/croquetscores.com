@postgres
Feature: Editing a manager's note

  A manager of the tournament can edit any of its notes, from the admin's
  Notes tab (`notes-tab.feature`), giving it the title and the description it
  is to have now. The tournament is named by its id, and the note by its id;
  a tournament there is not is refused as
  `EditManagerNote.NoSuchTournament`, and a note it does not have, one of
  another tournament's among them, as `EditManagerNote.NoSuchManagerNote`. A
  note deleted is the note's to refuse (`edit.feature`). Only the
  tournament's managers can, as the tournament says
  (`writeManagerNotes.feature`): anybody else, a scorer among them, is
  refused with `Tournament.NotAManager`.

  The title and the description are asked their own rules on the way in, as
  they are when a note is added (`AddManagerNote.feature`), and a request
  that breaks one is refused with `Request.Invalid` and the first rule it
  breaks.

  A forgotten account edits nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the manager note "Lunch" to "Spring Open"

  Rule: A sound edit is kept

    Scenario: The note has the title it was edited to
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then "Spring Open" has the manager note "Lunch moved"

    Scenario: The note says what it was edited to say
      Given the manager note is to say "At **one**"
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch"
      Then the manager note "Lunch" of "Spring Open" says "At **one**"

    Scenario: Editing the note is recorded as done by whoever asked
      Given "manager@example.com" has an account, confirmed, called "Max Manager"
      And "organiser@example.com" has made "manager@example.com" a manager of "Spring Open"
      When the reader signed in to the account for "manager@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then the manager note "Lunch moved" of "Spring Open" was last edited by the account for "manager@example.com"

  Rule: An edited note keeps its slug

    Scenario: A note edited is found where it was before
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then the manager note "Lunch moved" of "Spring Open" is found at "lunch"

  Rule: Each value must break none of its own rules

    Scenario: A missing title is refused
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to ""
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ManagerNoteTitle.Missing"

    Scenario: An edit that breaks a rule changes nothing
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to ""
      Then "Spring Open" has the manager note "Lunch"

  Rule: Only a note of the tournament, not deleted, can be edited

    Scenario: Editing a note the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" edits a manager note "Spring Open" does not have
      Then it is refused with "EditManagerNote.NoSuchManagerNote"

    Scenario: Editing another tournament's note is refused
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the manager note "Tea" to "Autumn Open"
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Tea" of "Autumn Open" as a note of "Spring Open"
      Then it is refused with "EditManagerNote.NoSuchManagerNote"

    Scenario: Editing a deleted note is refused as the note refuses it
      Given "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then it is refused with "ManagerNote.Deleted"

    Scenario: Editing a note on an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a note edited

    Scenario: Editing a note of a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" edits a manager note of a tournament there is not
      Then it is refused with "EditManagerNote.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account edits nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account edits the manager note "Lunch" of "Spring Open" to "Lunch moved"
      Then it is refused with "Account.Forgotten"
