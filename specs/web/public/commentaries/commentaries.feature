@browser @postgres
Feature: A tournament's commentaries page lists its commentaries

  A tournament's page has a section of its commentaries, at its address
  followed by "commentaries", as "/2026/ac/spring-open/commentaries", where
  the old site had it (`tournament.feature`). A commentary is one writer's
  account of the tournament as it is played, and the page lists every one
  there is, the most recently started first, each by its title and the name
  of its writer, and each leading to its own page at the commentaries page's
  address followed by its slug, as
  "/2026/ac/spring-open/commentaries/day-one"
  (`PublicCommentariesOfTournament.feature`). A title is plain text, and is
  listed as the words it is, with any Markdown in it not drawn
  (`CommentaryTitle.feature`).

  The page carries what the old site's did: a disclaimer, that the views in
  a commentary are its writer's and not the site's; the guidelines a writer
  is held to; and how to report a commentary that breaks them. They are said
  on the page that leads to every commentary, rather than on each, so that
  they are read before anything is written. It offers to start a new
  commentary, leading to the page that does (`startCommentary.feature`), to
  anybody: a reader not signed in who follows it is asked to sign in there,
  which tells them what writing needs rather than hiding that it can be
  done.

  It is headed by the tournament's name, with the commentaries under a
  heading of their own, and its sections are the tournament's, with
  Commentary marked as the section being read. An archived tournament has no
  commentaries page, nor one the website has never had. An address the
  tournament has moved on from leads to its commentaries page where it is
  found now, so that a link kept from before still works.

  The page is laid out for a phone first, since commentary is read and
  written at the side of a lawn.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  starts on 3 October 2026.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer", with the password "correct horse battery staple"

  Rule: The page is the tournament's commentaries, for anybody

    Scenario: The page is headed by the tournament's name
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the page is headed "Spring Open"

    Scenario: The commentaries are under a heading of their own
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the content has the heading "Commentary"

    Scenario: A reader not signed in is shown the commentaries
      Given nobody is signed in
      And "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Day one" is among the commentaries

    Scenario: A tournament with no commentaries says so
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the commentaries page says there are no commentaries

    Scenario: A tournament with commentaries does not say there are none
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the commentaries page does not say there are no commentaries

  Rule: Every commentary is listed, the most recently started first

    Scenario: The commentaries are listed the most recently started first
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the server's clock reads "2026-10-04T10:00:00Z"
      And "writer@example.com" has started the commentary "Day two" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the first commentary is "Day two"
      And the second commentary is "Day one"

    Scenario: A commentary is listed with its writer's name
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the commentary "Day one" is listed as written by "Wren Writer"

    Scenario: Markdown in a title is not drawn
      Given "writer@example.com" has started the commentary "**Day one**" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "**Day one**" is among the commentaries

    Scenario: A commentary leads to its own page
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the commentary "Day one" leads to "/2026/ac/spring-open/commentaries/day-one"

  Rule: The page says what the old site's did

    Scenario Outline: The page has each of the old site's headings
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the content has the heading "<heading>"

      Examples:
        | heading              |
        | Disclaimer           |
        | Guidelines           |
        | Reporting commentary |

  Rule: Anybody is offered a way to start a commentary

    Scenario: A reader signed in is offered a way to start a commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" leads to "/2026/ac/spring-open/commentaries/create"

    Scenario: A reader not signed in is offered a way to start a commentary
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" leads to "/2026/ac/spring-open/commentaries/create"

  Rule: Commentary is marked as the section being read

    Scenario: Commentary is marked as the section being read
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the section "Commentary" is marked as current

    Scenario: Recent is not marked
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the section "Recent" is not marked as current

  Rule: Only a tournament a reader is sent to has a commentaries page

    Scenario: An address the tournament has moved on from leads to where it is now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the address is "/2026/gc/spring-open/commentaries"

    Scenario: An archived tournament has no commentaries page
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the page says the words for "errors.notFound"

    Scenario: An address no tournament has been found at is not a page
      When the page at "/2026/ac/autumn-open/commentaries" is opened
      Then the page says the words for "errors.notFound"
