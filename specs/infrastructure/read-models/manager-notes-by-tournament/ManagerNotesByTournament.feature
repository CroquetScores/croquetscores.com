@postgres
Feature: Finding a tournament's notes without reading what they say

  Every page of a tournament marks its Notes section while the reader has a
  note there to read (`notes.feature`), the Notes page lists the notes by
  their titles, and so does the admin's Notes tab (`notes-tab.feature`). None
  of them needs what a note says beneath its title, which may be 750,000
  characters long (`ManagerNoteDescription.feature`), and each note is kept
  in a stream of its own (`add.feature`), so none of them can replay the
  notes' streams without reading every description. A read model keeps what
  they need instead: a table of notes by tournament, kept by a projection as
  notes are added, edited and deleted, holding each note's id, its
  tournament, its title, its slug, when it was written and when it last
  changed. It
  holds no description: a description is read from the note's own stream,
  and only when a reader reads that note (`note.feature`).

  When a note last changed is when it was last edited, or when it was
  written if it never has been. An edit changes its title and when it last
  changed, and not when it was written or its slug. A note deleted is not
  found among the tournament's notes, nor at its slug, as it is gone from
  everywhere a reader looks; but its slug stays taken, so that a note added
  after it is never found where it was (`add.feature`), and so it is kept
  for that.

  The read model is asked for a tournament's notes, and answers them the
  most recently written first, as every page lists them. Two written at the
  same moment are answered in the order of their ids, the greater first,
  which a rebuild cannot change: the order rows were made in can, since a
  rebuild takes the streams in no order but each stream's own. A tournament with
  no notes is answered with none, and another tournament's notes are not
  among them. It is asked which note of a tournament is found at a slug, as
  a note's page is found by its address, and which slugs a tournament's
  notes have taken.

  The projection is safe to run twice, as rebuilding the read model does.

  Background:
    Given the manager notes by tournament read model
    And the moment "2026-09-26T10:00:00Z"

  Rule: A tournament's notes are found, the most recently written first

    Scenario: A note added is found
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found is "Lunch is at noon"

    Scenario: The most recently written note is found first
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And the manager note "Play starts at 9:30" is added to the tournament "Spring Open"
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found is "Play starts at 9:30"
      And the second manager note found is "Lunch is at noon"

    Scenario: A tournament with no notes has none found
      When the manager notes of "Spring Open" are looked for
      Then no manager notes are found

    Scenario: Another tournament's notes are not found
      Given the manager note "Lunch is at noon" is added to the tournament "Autumn Open"
      When the manager notes of "Spring Open" are looked for
      Then no manager notes are found

  Rule: A note is found with its id, its title and when it was written and last changed

    Scenario: A note is found with its id
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found is known by "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note is found with when it was written
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found was written at "2026-09-26T10:00:00Z"

    Scenario: A note never edited last changed when it was written
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found last changed at "2026-09-26T10:00:00Z"

  Rule: A note is found at its slug, and a deleted note's slug stays taken

    Scenario: A note is found with its slug
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found is found at "lunch-is-at-noon"

    Scenario: The note at a slug is found
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the manager note of "Spring Open" at "lunch-is-at-noon" is looked for
      Then the manager note "Lunch is at noon" is found there

    Scenario: No note is found at a slug no note has
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the manager note of "Spring Open" at "tea" is looked for
      Then no manager note is found there

    Scenario: Another tournament's note is not found at its slug
      Given the manager note "Lunch is at noon" is added to the tournament "Autumn Open"
      When the manager note of "Spring Open" at "lunch-is-at-noon" is looked for
      Then no manager note is found there

    Scenario: No note is found at a deleted note's slug
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the manager note "Lunch is at noon" is deleted
      When the manager note of "Spring Open" at "lunch-is-at-noon" is looked for
      Then no manager note is found there

    Scenario: A note's slug is taken
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the slugs taken by the notes of "Spring Open" are looked for
      Then "lunch-is-at-noon" is among the slugs taken

    Scenario: A deleted note's slug is still taken
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the manager note "Lunch is at noon" is deleted
      When the slugs taken by the notes of "Spring Open" are looked for
      Then "lunch-is-at-noon" is among the slugs taken

    Scenario: Another tournament's notes' slugs are not taken
      Given the manager note "Lunch is at noon" is added to the tournament "Autumn Open"
      When the slugs taken by the notes of "Spring Open" are looked for
      Then no slugs are taken

  Rule: An edit changes a note's title and when it last changed

    Background:
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the moment "2026-09-26T11:00:00Z"
      And the manager note "Lunch is at noon" is edited to "Lunch is at one"

    Scenario: An edited note is found with the title it was edited to
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found is "Lunch is at one"

    Scenario: An edited note last changed when it was edited
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found last changed at "2026-09-26T11:00:00Z"

    Scenario: An edited note keeps when it was written
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found was written at "2026-09-26T10:00:00Z"

    Scenario: An edited note keeps its slug
      When the manager notes of "Spring Open" are looked for
      Then the first manager note found is found at "lunch-is-at-noon"

  Rule: A note deleted is not found

    Scenario: A deleted note is not found
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the manager note "Lunch is at noon" is deleted
      When the manager notes of "Spring Open" are looked for
      Then no manager notes are found

  Rule: Projecting the same events again changes nothing

    Scenario: A note's adding projected twice is one note
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      When the note's events are projected again
      And the manager notes of "Spring Open" are looked for
      Then 1 manager note is found

    Scenario: A note's deleting projected twice leaves it not found
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the manager note "Lunch is at noon" is deleted
      When the note's events are projected again
      And the manager notes of "Spring Open" are looked for
      Then no manager notes are found

  Rule: A rebuild finds every note as it is now

    Scenario: Two notes written at the same moment are found in the same order once the read model is rebuilt
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open" as "manager-note/123e4567-e89b-42d3-a456-426614174000"
      And the manager note "Play starts at 9:30" is added to the tournament "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      And the notes' streams are to be rebuilt the latest added first
      When the read model is rebuilt from the events
      And the manager notes of "Spring Open" are looked for
      Then the first manager note found is "Play starts at 9:30"

    Scenario: A note edited is found as it was edited once the read model is rebuilt
      Given the manager note "Lunch is at noon" is added to the tournament "Spring Open"
      And the manager note "Lunch is at noon" is edited to "Lunch is at one"
      When the read model is rebuilt from the events
      And the manager notes of "Spring Open" are looked for
      Then the first manager note found is "Lunch is at one"
