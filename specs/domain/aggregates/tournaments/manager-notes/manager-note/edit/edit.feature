Feature: Editing a manager's note

  A note can be put right, or brought up to date as the day goes on: the
  order of play changed again, lunch moved. Editing a note gives it the
  title and the description it is to have now, each asked what any is asked
  (`ManagerNoteTitle.feature`, `ManagerNoteDescription.feature`). It keeps
  when it was written, and keeps when it was last edited, since an edited
  note is news to a reader who read it before it was (`notes.feature`).

  Who may edit a note is the tournament's to say, as who may add one is
  (`writeManagerNotes.feature`): any of its managers, whoever wrote it. A
  note deleted is gone for good (`delete.feature`), so editing one is refused.
  An edit that changes nothing records nothing, since nothing happened, and
  so does not make the note news again.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a stream where the manager note "Lunch" was added saying "At noon"

  Rule: Editing a note is recorded, and the note says what it was edited to

    Scenario: Editing a note records it
      Given the manager note is rebuilt from its stream
      When the manager note is edited to "Lunch" saying "At one"
      Then it has recorded 1 event
      And the first thing it recorded is a manager's note being edited

    Scenario: A note has the title it was edited to
      Given the manager note is rebuilt from its stream
      When the manager note is edited to "Lunch moved" saying "At noon"
      Then the manager note is called "Lunch moved"

    Scenario: A note has the description it was edited to
      Given the manager note is rebuilt from its stream
      When the manager note is edited to "Lunch" saying "At one"
      Then the manager note says "At one"

    Scenario: A note's description can be taken away
      Given the manager note is rebuilt from its stream
      When the manager note is edited to "Lunch" saying ""
      Then the manager note says nothing more

    Scenario: A note rebuilt after it was edited is as it was edited
      Given the manager note was edited to "Lunch" saying "At one"
      When the manager note is rebuilt from its stream
      Then the manager note says "At one"

  Rule: An edited note keeps when it was written, and was last edited when it was edited

    Scenario: An edited note keeps when it was written
      Given the manager note is rebuilt from its stream
      And the moment "2026-09-26T11:00:00Z"
      When the manager note is edited to "Lunch" saying "At one"
      Then the manager note was written at "2026-09-26T10:00:00Z"

    Scenario: An edited note was last edited at the moment it was edited
      Given the manager note is rebuilt from its stream
      And the moment "2026-09-26T11:00:00Z"
      When the manager note is edited to "Lunch" saying "At one"
      Then the manager note was last edited at "2026-09-26T11:00:00Z"

  Rule: What a note's title and description must be is refused as it is for any

    Scenario: A title that could not be a note's is refused as a note's title is
      Given the manager note is rebuilt from its stream
      When the manager note is edited to "" saying "At one"
      Then it is refused for breaking "ManagerNoteTitle.Missing"

  Rule: A deleted note cannot be edited

    Scenario: Editing a deleted note is refused
      Given the manager note was deleted
      And the manager note is rebuilt from its stream
      When the manager note is edited to "Lunch" saying "At one"
      Then it is refused with "ManagerNote.Deleted"

  Rule: An edit that changes nothing records nothing

    Scenario: An edit to what the note says already records nothing
      Given the manager note is rebuilt from its stream
      When the manager note is edited to "Lunch" saying "At noon"
      Then it has recorded 0 events
