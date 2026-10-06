@browser @postgres
Feature: A tournament's Notes page lists its managers' notes

  A tournament's managers write notes to tell its players what they need to
  know as it is played: the format, a change to the order of play, the time
  of lunch (`addManagerNote.feature`). The tournament's page has a section of
  them, Notes, at its address followed by "notes", as
  "/2026/ac/spring-open/notes" (`tournament.feature`). The page lists every
  note by its title, the most recently written first, so that today's news is
  at the top, each leading to its own page, where it is read (`note.feature`),
  and each saying how long ago it was written. A title is plain text, and is
  listed as the words it is, with any Markdown in it not drawn
  (`ManagerNoteTitle.feature`). A tournament with no notes says it has none.

  A reader needs to know when there is something new to read without opening
  every note to find out. So a note the reader has not read is marked with a
  red asterisk in the list, until they open it. A note edited since the
  reader read it is marked again, since what they read is no longer what it
  says. And while there is any such note, the Notes section itself is marked
  with a red asterisk on every page of the tournament, so that a reader on
  the tournament's page, or a block's, sees that there is news without
  going to look. The asterisk is a colour and a shape, which a screen reader
  does not tell; it is said to one as the word "new".

  What a reader has read is remembered by their browser, in a cookie, rather
  than by their account: most readers never sign in, and a player at the
  side of a lawn wants to know what is new to them on the phone in their
  hand. Another browser has read nothing.

  The page needs no scripting. The tournament is named in the bar beneath the
  site's name, as on any of its pages, and its sections are the
  tournament's, with Notes marked as the section being read. An archived
  tournament has no Notes page, nor one the website has never had. An
  address the tournament has moved on from leads to its Notes page where it
  is found now, so that a link kept from before still works.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  starts on 3 October 2026.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The page is headed Notes, for anybody

    Scenario: The page is headed Notes
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the page is headed "Notes"

    Scenario: A reader not signed in is shown the notes
      Given nobody is signed in
      And "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then "Lunch is at noon" is among the notes

    Scenario: A tournament with no notes says it has none
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the page says the words for "notes.none"

  Rule: Every note is listed by its title, the most recently written first

    Scenario: The notes are listed the most recently written first
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the first note is "Play starts at 9:30"
      And the second note is "Lunch is at noon"

    Scenario: A note leads to its own page
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then "Lunch is at noon" leads to "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note is listed with how long ago it was written
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the server's clock reads "2026-10-03T10:05:00Z"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" was written "5 min" ago

    Scenario: Markdown in a title is not drawn
      Given "organiser@example.com" has added the manager note "**Lunch**" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then "**Lunch**" is among the notes

  Rule: A note the reader has not read as it is now is marked with a red asterisk

    Scenario: A note the reader has not read is marked
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" is marked as new

    Scenario: The mark is red
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" is marked in red

    Scenario: The mark is said to a screen reader as the word new
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the mark on the note "Lunch is at noon" is said as the words for "notes.new"

    Scenario: A note the reader has read is not marked
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the reader has read the note "Lunch is at noon"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" is not marked as new

    Scenario: Reading one note leaves another marked
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      And the reader has read the note "Lunch is at noon"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Play starts at 9:30" is marked as new

    Scenario: A note edited since the reader read it is marked again
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the reader has read the note "Lunch is at noon"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at one" is marked as new

    Scenario: A note read in another browser is still marked
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the reader has read the note "Lunch is at noon"
      And the reader opens another browser
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" is marked as new

  Rule: While any note is not read as it is now, the Notes section is marked with a red asterisk on every page of the tournament

    Scenario Outline: Every page of the tournament marks the Notes section
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "<address>" is opened
      Then the section "Notes" is marked as new

      Examples:
        | address                                   |
        | /2026/ac/spring-open                      |
        | /2026/ac/spring-open/players              |
        | /2026/ac/spring-open/players/sam-someone  |
        | /2026/ac/spring-open/competitions/block-a |
        | /2026/ac/spring-open/notes                |
        | /2026/ac/spring-open/commentaries         |

    Scenario: The section's mark is red
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Notes" is marked in red

    Scenario: The section's mark is said to a screen reader as the word new
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the mark on the section "Notes" is said as the words for "notes.new"

    Scenario: A tournament with no notes does not mark the section
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Notes" is not marked as new

    Scenario: Once every note is read the section is not marked
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the reader has read the note "Lunch is at noon"
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Notes" is not marked as new

    Scenario: A note edited since every note was read marks the section again
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the reader has read the note "Lunch is at noon"
      And the server's clock reads "2026-10-03T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Notes" is marked as new

    Scenario: A note deleted before it was read no longer marks the section
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And "organiser@example.com" has deleted the manager note "Lunch is at noon" of "Spring Open"
      When the page at "/2026/ac/spring-open" is opened
      Then the section "Notes" is not marked as new

  Rule: The page needs no scripting

    Scenario: The notes are listed with scripting off
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened with scripting off
      Then "Lunch is at noon" is among the notes

  Rule: Notes is marked as the section being read

    Scenario: Notes is marked as the section being read
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the section "Notes" is marked as current

    Scenario: Recent is not marked
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the section "Recent" is not marked as current

  Rule: Only a tournament a reader is sent to has a Notes page

    Scenario: An address the tournament has moved on from leads to where it is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the address is "/2026/gc/spring-open/notes"

    Scenario: An archived tournament has no Notes page
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An address no tournament has been found at is not a page
      When the page at "/2026/ac/autumn-open/notes" is opened
      Then the page says the words for "errors.notFound"
