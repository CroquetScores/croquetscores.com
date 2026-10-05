@browser @postgres
Feature: A tournament's commentaries page is the old site's

  A tournament's page has a section of its commentaries, at its address
  followed by "commentaries", as "/2026/ac/spring-open/commentaries", where
  the old site had it (`tournament.feature`). The page is the old site's, as
  it was, so that a reader who knew that page knows this one: headed
  "Commentary", the commentaries listed beneath, then the old site's
  Disclaimer, Guidelines and Reporting Commentary in its own words. The one
  change is the way to start a new commentary, which the old site left as a
  link at the foot of the page: here it is a button, between the list and
  the Disclaimer, where a reader who has looked down the list for a
  commentary and not found it is looking next.

  A commentary is one writer's account of the tournament as it is played.
  Each is listed as the old site listed it, by its title and its writer's
  name with "by" between, as "Day one by Wren Writer", leading to its own
  page at the commentaries page's address followed by its slug, as
  "/2026/ac/spring-open/commentaries/day-one"
  (`PublicCommentariesOfTournament.feature`). The most recently started is
  listed first, so that the one being written today is at the top. A title
  is plain text, and is listed as the words it is, with any Markdown in it
  not drawn (`CommentaryTitle.feature`). A tournament with no commentaries
  lists none, and says nothing of it, as the old site did not.

  Where the old site's words name croquetscores.com, they name the website
  being read, so that another website served from here names itself. A
  commentary is reported to Tim Murphy by email, at the address the old site
  gave, croquetscores@gmail.com, with the subject and the body the old site
  filled in. The example of a report gives an address as this site makes
  them, with https and a commentary's slug, where the old site's gave
  "http://www." and a commentary's number.

  The button to start a new commentary is a link drawn as a button, so that
  it needs no scripting, and leads to the page that does
  (`startCommentary.feature`). It is offered to anybody: a reader not signed
  in who follows it is asked to sign in there, which tells them what writing
  needs rather than hiding that it can be done.

  The tournament is named in the bar beneath the site's name, as on any of
  its pages, and its sections are the tournament's, with Commentary marked as
  the section being read. An archived tournament has no commentaries page,
  nor one the website has never had. An address the tournament has moved on
  from leads to its commentaries page where it is found now, so that a link
  kept from before still works.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  starts on 3 October 2026.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "writer@example.com" has an account, confirmed, called "Wren Writer", with the password "correct horse battery staple"

  Rule: The page is headed Commentary, for anybody

    Scenario: The page is headed Commentary
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the page is headed "Commentary"

    Scenario: A reader not signed in is shown the commentaries
      Given nobody is signed in
      And "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Day one" is among the commentaries

    Scenario: A tournament with no commentaries lists none
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then no commentaries are listed

  Rule: Every commentary is listed by its title and its writer, the most recently started first

    Scenario: The commentaries are listed the most recently started first
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      And the server's clock reads "2026-10-04T10:00:00Z"
      And "writer@example.com" has started the commentary "Day two" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the first commentary is "Day two"
      And the second commentary is "Day one"

    Scenario: A commentary is listed as its title by its writer
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Day one by Wren Writer" leads to "/2026/ac/spring-open/commentaries/day-one"

    Scenario: A commentary is listed with its writer's name
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the commentary "Day one" is listed as written by "Wren Writer"

    Scenario: Markdown in a title is not drawn
      Given "writer@example.com" has started the commentary "**Day one**" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "**Day one**" is among the commentaries

  Rule: The page says what the old site's did, in its words

    Scenario Outline: The page has each of the old site's headings
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the content has the heading "<heading>"

      Examples:
        | heading              |
        | Disclaimer           |
        | Guidelines           |
        | Reporting Commentary |

    Scenario: The old site's headings come in its order
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the content's headings are "Disclaimer", "Guidelines" and "Reporting Commentary", in that order

    Scenario: The disclaimer names the website being read
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the page says "The views and opinions expressed in these commentaries are those of the authors and do not necessarily reflect those of Tim Murphy or croquetscores.com."

    Scenario: The guidelines begin by saying who is responsible
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the page says "You are responsible for your commentary." in bold

    Scenario: A commentary is reported to Tim Murphy by email
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Tim Murphy" leads to "mailto:croquetscores@gmail.com?subject=croquetscores.com%20Commentary%20Report&body=Please%20quote%20web%20address%2C%20questionable%20comment%20and%20why%20it%20should%20be%20removed."

    Scenario: The example of a report gives an address as this site makes them
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then the page says "https://croquetscores.com/2015/gc/tournament-name/commentaries/day-one"

  Rule: Anybody is offered a button to start a new commentary, between the list and the Disclaimer

    Scenario: A reader signed in is offered a way to start a commentary
      Given the reader has signed in as "writer@example.com" with the password "correct horse battery staple"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" leads to "/2026/ac/spring-open/commentaries/create"

    Scenario: A reader not signed in is offered a way to start a commentary
      Given nobody is signed in
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" leads to "/2026/ac/spring-open/commentaries/create"

    Scenario: Start new commentary is drawn as a button
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" is drawn as a button

    Scenario: Start new commentary comes after the list of commentaries
      Given "writer@example.com" has started the commentary "Day one" on "Spring Open"
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" comes after the list of commentaries

    Scenario: Start new commentary comes before the Disclaimer
      When the page at "/2026/ac/spring-open/commentaries" is opened
      Then "Start new commentary" comes before the heading "Disclaimer"

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
