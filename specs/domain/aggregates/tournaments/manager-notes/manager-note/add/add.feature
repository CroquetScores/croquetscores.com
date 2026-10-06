Feature: Adding a manager's note

  A tournament's managers write notes to tell its players what they need to
  know as it is played: the format, a change to the order of play, the time
  of lunch. Each note has a title, and a description in Markdown if the title
  does not say it all (`ManagerNoteTitle.feature`,
  `ManagerNoteDescription.feature`), as an issue on GitHub has.

  A note is kept by itself, under its own id, rather than as a part of its
  tournament, as a commentary is (`start.feature`). A tournament is read on
  every one of its pages, and a note's description may be 750,000 characters
  long: kept in the tournament, every description would be read every time
  any page of the tournament was, where it need only be read by a reader
  reading that note. What every page says of the notes, their titles and
  when each last changed, is kept for it by a read model
  (`ManagerNotesByTournament.feature`).

  Who may write a note is the tournament's to say, since it knows its
  managers and whether it is archived (`writeManagerNotes.feature`), and
  whatever adds a note has asked it first. The note knows only which
  tournament it is of, what it says, and when it was written.

  The note's id is given it by whatever adds it, and names its stream.
  Adding it is its first event.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Adding a note is recorded, and the note is as it was added

    Scenario: Adding a note records it
      When the manager note "Lunch is at noon" is added
      Then it has recorded 1 event
      And the first thing it recorded is a manager's note being added

    Scenario: A note is known by the id it was added with
      Given the manager note id "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the manager note "Lunch is at noon" is added
      Then the manager note is known by "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note is of the tournament it was added to
      Given the manager note is to be added to the tournament "tournament/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the manager note "Lunch is at noon" is added
      Then the manager note is of the tournament "tournament/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"

    Scenario: A note has the title it was added with
      When the manager note "Lunch is at noon" is added
      Then the manager note is called "Lunch is at noon"

    Scenario: A note has the description it was added with
      When the manager note "Lunch" is added saying "In the **clubhouse**"
      Then the manager note says "In the **clubhouse**"

    Scenario: A note added with no description has none
      When the manager note "Lunch is at noon" is added
      Then the manager note says nothing more

    Scenario: A note was written at the moment it was added
      When the manager note "Lunch is at noon" is added
      Then the manager note was written at "2026-09-26T10:00:00Z"

    Scenario: A note just added has never been edited
      When the manager note "Lunch is at noon" is added
      Then the manager note has never been edited

    Scenario: A note just added is not deleted
      When the manager note "Lunch is at noon" is added
      Then the manager note has not been deleted

    Scenario: A note rebuilt from its stream is as it was added
      Given a stream where the manager note "Lunch" was added saying "In the **clubhouse**"
      When the manager note is rebuilt from its stream
      Then the manager note says "In the **clubhouse**"

  Rule: A note's title and description are asked what any are asked

    Scenario: A title that could not be a note's is refused as a note's title is
      When the manager note "" is added
      Then it is refused for breaking "ManagerNoteTitle.Missing"
