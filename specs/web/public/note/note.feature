@browser @postgres
Feature: Each of a tournament's managers' notes has a page of its own

  A note the tournament's managers write is read on a page of its own, which
  the Notes page leads to (`notes.feature`), at the Notes page's address
  followed by the part of the note's id after "manager-note/", as
  "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
  (`PublicManagerNotesOfTournament.feature`). A note has no slug, since its
  title can be changed, and its address must not change with it.

  The page is headed by the tournament's name, as a commentary's is, with
  the note's title beneath it as a heading of the second level, and its
  description beneath that, drawn from its Markdown: a word made bold is bold
  and a link is a link. This is what the admin's Preview shows a manager as
  they write it (`notePanel.feature`), so that what they see is what
  a reader will. A web address written out is a link too, a line break is a
  line break, and a link is one the site does not vouch for, as in a comment
  (`commentary.feature`). A note is drawn with HTML turned off, so HTML
  typed in one is shown as the characters it is and runs nothing
  (`ManagerNoteDescription.feature`). Beneath it, the page says how long ago
  it was written, and how long ago it was edited where it has been, since a
  reader acting on a note wants to know how fresh it is.

  Opening the page is reading the note: the reader's browser remembers that
  they have read it as it is now, and the note is no longer marked as new
  (`notes.feature`). The Notes section is not marked on the page itself
  unless another note is still to be read.

  The page needs no scripting. A note the tournament does not have, one
  deleted among them, has no page, and nor does an address naming nothing
  that could be a note. An archived tournament has no note pages. An address
  the tournament has moved on from leads to the note's page where it is
  found now.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The page is headed by the tournament's name, with the note's title beneath it

    Background:
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: The page is headed by the tournament's name
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the page is headed "Spring Open"

    Scenario: The note's title is a heading of the second level
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the second-level heading is "Lunch is at noon"

    Scenario: A reader not signed in is shown the note
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the second-level heading is "Lunch is at noon"

  Rule: The description is drawn from its Markdown, with no HTML of its own

    Scenario: A word made bold in the description is drawn bold
      Given the manager note is to say "In the **clubhouse**"
      And "organiser@example.com" has added the manager note "Lunch" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened
      Then the note draws "clubhouse" bold

    Scenario: A link in the description leads where it says
      Given the manager note is to say "See [the draw](https://example.com/draw)"
      And "organiser@example.com" has added the manager note "Draw" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened
      Then the note's link "the draw" leads to "https://example.com/draw"

    Scenario: A link in the description is one the site does not vouch for
      Given the manager note is to say "See [the draw](https://example.com/draw)"
      And "organiser@example.com" has added the manager note "Draw" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened
      Then the note's link "the draw" is marked as not vouched for

    Scenario: A web address written out in the description is a link
      Given the manager note is to say "Results at https://example.com/results"
      And "organiser@example.com" has added the manager note "Results" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened
      Then the note's link "https://example.com/results" leads to "https://example.com/results"

    Scenario: HTML in the description is shown as the characters it is
      Given the manager note is to say "Lunch is at <b>noon</b>"
      And "organiser@example.com" has added the manager note "Lunch" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened
      Then the note says "Lunch is at <b>noon</b>"

    Scenario: A script in the description does not run
      Given the manager note is to say "<script>document.title = 'ran'</script>"
      And "organiser@example.com" has added the manager note "Lunch" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened with scripting on
      Then nothing the note says has run

    Scenario: Markdown in the title is not drawn
      Given "organiser@example.com" has added the manager note "**Lunch**" to "Spring Open" as "manager-note/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b"
      When the page at "/2026/ac/spring-open/notes/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b" is opened
      Then the second-level heading is "**Lunch**"

  Rule: The page says how long ago the note was written, and edited where it has been

    Background:
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: The page says how long ago the note was written
      Given the server's clock reads "2026-10-03T10:05:00Z"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the note was written "5 min" ago

    Scenario: The page says how long ago an edited note was edited
      Given the server's clock reads "2026-10-03T11:00:00Z"
      And "organiser@example.com" has edited the manager note "Lunch is at noon" of "Spring Open" to "Lunch is at one"
      And the server's clock reads "2026-10-03T11:02:00Z"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the note was edited "2 min" ago

    Scenario: A note never edited does not say it was edited
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the note does not say it was edited

  Rule: Opening the page is reading the note

    Background:
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A note whose page was opened is no longer marked as new
      Given the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is open
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" is not marked as new

    Scenario: The page of the only note to read does not mark the Notes section
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the section "Notes" is not marked as new

    Scenario: The page of one note marks the Notes section while another is still to be read
      Given "organiser@example.com" has added the manager note "Play starts at 9:30" to "Spring Open"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the section "Notes" is marked as new

    Scenario: A note is read with scripting off
      Given the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is open with scripting off
      When the page at "/2026/ac/spring-open/notes" is opened
      Then the note "Lunch is at noon" is not marked as new

  Rule: Notes is marked as the section being read

    Scenario: Notes is marked as the section being read
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the section "Notes" is marked as current

  Rule: Only a note the tournament has, of a tournament a reader is sent to, has a page

    Scenario: An address the tournament has moved on from leads to where the note is now
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the address is "/2026/gc/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"

    Scenario: A deleted note has no page
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      And "organiser@example.com" has deleted the manager note "Lunch is at noon" of "Spring Open"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An address naming nothing that could be a note is not a page
      When the page at "/2026/ac/spring-open/notes/lunch" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An archived tournament has no note pages
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open" as "manager-note/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/notes/0d1e2f3a-4b5c-4d6e-8f7a-9b0c1d2e3f4a" is opened
      Then the page says the words for "errors.notFound"
