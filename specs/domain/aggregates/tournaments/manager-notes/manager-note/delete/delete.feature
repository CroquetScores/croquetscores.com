Feature: Deleting a manager's note

  A note that no longer applies, or was never right, can be deleted, and is
  then gone for good: nobody reads it again, and it is not set aside to be
  restored, as an archived player is, since a note out of date is worth
  nothing kept. Its stream is kept, as every stream is, and says it was
  deleted, so that nothing is ever done to it again.

  Who may delete a note is the tournament's to say, as who may add one is
  (`writeManagerNotes.feature`). Deleting a note already deleted is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where the manager note "Lunch is at noon" was added

  Rule: Deleting a note is recorded, and the note has been deleted

    Scenario: Deleting a note records it
      Given the manager note is rebuilt from its stream
      When the manager note is deleted
      Then it has recorded 1 event
      And the first thing it recorded is a manager's note being deleted

    Scenario: A note deleted has been deleted
      Given the manager note is rebuilt from its stream
      When the manager note is deleted
      Then the manager note has been deleted

    Scenario: A note rebuilt after it was deleted has been deleted
      Given the manager note was deleted
      When the manager note is rebuilt from its stream
      Then the manager note has been deleted

  Rule: A note is deleted once

    Scenario: Deleting a note already deleted is refused
      Given the manager note was deleted
      And the manager note is rebuilt from its stream
      When the manager note is deleted
      Then it is refused with "ManagerNote.Deleted"
