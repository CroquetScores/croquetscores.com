@browser @postgres
Feature: The notes tab of a tournament's page

  The Notes tab is where a manager writes the notes a tournament's readers
  find on its Notes page (`notes.feature`): the format, a change to the order
  of play, the time of lunch. A manager adds them, edits them as the day
  goes on, and deletes the ones that no longer apply (`view.feature`). Only
  the tournament's managers are offered it (`AddManagerNote.feature`).

  Add Note, above the list, shows the note panel in place of the list to add
  a note, and a note's title or its Edit shows it to edit the note
  (`notePanel.feature`). Edit
  says in a button what the title does, for a reader who does not think to
  press a title, and comes before Delete, so that putting a note right is
  offered ahead of doing away with it. Whenever the panel adds a note or
  saves one, the list is asked for again, so that it says what the notes are
  now.

  The notes are listed by their titles, the most recently written first, as
  readers see them (`ManagerNotesOfTournament.feature`). A title is plain
  text, and is listed as the words it is, with any Markdown in it not drawn.

  A note deleted is gone for good (`deleteManagerNote.feature`), so Delete
  asks first, in a modal dialog (`STYLE.md`) titled Delete Note, that names
  the note, says that it cannot be undone, and offers Delete and Cancel.
  Cancel deletes nothing.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page and chooses the tab, which is what opening the notes of a
  tournament does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: The notes are listed by their titles, the most recently written first

    Scenario: A note added is listed
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the notes of "Spring Open" are opened
      Then the note "Lunch is at noon" is listed

    Scenario: The most recently written note is first
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the notes of "Spring Open" are opened
      Then the first note listed is "Play starts at 9:30"

    Scenario: Markdown in a title is not drawn
      Given "organiser@example.com" has added the manager note "**Lunch**" to "Spring Open"
      When the notes of "Spring Open" are opened
      Then the note "**Lunch**" is listed

    Scenario: A tournament with no notes says so
      When the notes of "Spring Open" are opened
      Then the tab says there are no notes

  Rule: Add Note shows the panel to add a note, and a note's title or Edit shows it to edit the note

    Scenario: Add Note shows the panel to add a note
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the note panel is headed "Add Note"

    Scenario: A note's title shows the panel to edit it
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      When the title of the note "Lunch is at noon" is pressed
      Then the note panel is headed "Edit Note"

    Scenario: A note's Edit shows the panel to edit it
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      When Edit is pressed for the note "Lunch is at noon"
      Then the note panel is headed "Edit Note"

    Scenario: Edit comes before Delete
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the notes of "Spring Open" are opened
      Then the note "Lunch is at noon" offers Edit before Delete

    Scenario: A note added in the panel is listed
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When "Add" is pressed
      Then the note "Lunch is at noon" is listed

    Scenario: A note edited in the panel is listed as it was edited
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And the title of the note "Lunch is at noon" is pressed
      And "Lunch is at one" is typed as the "Title"
      When "Save" is pressed
      Then the note "Lunch is at one" is listed

  Rule: Delete asks first, and only a delete confirmed takes the note away

    Scenario: Delete asks first
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      When Delete is pressed for the note "Lunch is at noon"
      Then the modal dialog titled "Delete Note" is open

    Scenario: The question names the note
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      When Delete is pressed for the note "Lunch is at noon"
      Then the modal dialog names "Lunch is at noon"

    Scenario: The question says a delete cannot be undone
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      When Delete is pressed for the note "Lunch is at noon"
      Then the modal dialog says the words for "admin.notes.delete.explanation"

    Scenario: A delete confirmed takes the note away
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And Delete is pressed for the note "Lunch is at noon"
      When "Delete" is pressed in the modal dialog
      Then "Spring Open" has no manager notes

    Scenario: A note deleted is no longer listed
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And Delete is pressed for the note "Lunch is at noon"
      When "Delete" is pressed in the modal dialog
      Then the tab says there are no notes

    Scenario: Cancel deletes nothing
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And Delete is pressed for the note "Lunch is at noon"
      When "Cancel" is pressed in the modal dialog
      Then "Spring Open" has the manager note "Lunch is at noon"

  Rule: A delete refused says why above the list

    A delete can be refused after it is asked: the tournament archived, or the
    reader no longer one of its managers, since the list was opened. What was
    refused is said above the list, by its code, as a test's Archive refused
    is said (`tests-tab.feature`), and the list is asked for again, so that it
    says what the notes are now.

    Scenario: A delete refused is said above the list
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And Delete is pressed for the note "Lunch is at noon"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When "Delete" is pressed in the modal dialog
      Then the tab is refused with "Tournament.Archived"

    Scenario: What a delete was refused is not said once something else is done
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And Delete is pressed for the note "Lunch is at noon"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And "Delete" is pressed in the modal dialog
      And the tab is refused with "Tournament.Archived"
      And "Add Note" is pressed
      When "Cancel" is pressed
      Then nothing is said above the list of notes

    Scenario: A note whose delete was refused is still kept
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And Delete is pressed for the note "Lunch is at noon"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When "Delete" is pressed in the modal dialog
      Then "Spring Open" has the manager note "Lunch is at noon"

  Rule: Every word the tab says is in the reader's language

    Scenario: The tab is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the notes of "Spring Open" are opened
      Then every word in the tab but the notes' titles is in the test locale
