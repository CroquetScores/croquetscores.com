@browser @postgres
Feature: A player's page lists the tournaments they have played in

  A player has a page at "/players" followed by their slug, as
  "/players/sam-someone", which a search leads to (`search.feature`,
  `websitePlayers.feature`). It is the person's and not a tournament's: a
  player who has played in a dozen tournaments has one page, at the address
  their world ranking name makes, and a tournament's own page for them stays
  where it was, at the tournament's address followed by "players" and their
  slug (`player.feature`).

  The page is headed by the player's name, as the tournament that started most
  recently wrote their world ranking name, and has a table of the tournaments
  they have played in (`PlayerOfWebsite.feature`): two columns, "Date" and
  "Tournament", with a row for each tournament, once, however many of its
  competitions they are in. The date is the days the tournament runs, written
  as the home page's lists write them with the year after, as "03-05 Oct 2026",
  since a player's tournaments are of several years. The tournament's name
  leads to the player's own page in that tournament, at the tournament's
  address followed by "players" and the player's slug there, as
  "/2026/ac/spring-open/players/sam-someone".

  The rows begin with the tournament that started most recently first, which
  is the table sorted by its dates from the newest to the oldest, and says so.
  The headings are links that sort the table, as
  "/players/sam-someone?sort=tournament&order=asc&keep=tournaments" and
  "/players/sam-someone?sort=date&order=asc&keep=tournaments": forms of the
  page's own, so that they need no scripting. What the address says beside the
  sorting is how the page knows the heading was pressed and the sorting is
  to be remembered on the device (`rememberedSorting.feature`); the address a
  reader is left at has the sorting and not that, and can be kept or sent. A heading the table is not
  sorted by sorts it its way first: Tournament from A to Z, and Date from the
  newest to the oldest. The heading the table is sorted by sorts it the other
  way. Names are put in order by their letters with case and accents set
  aside; tournaments are put in order by the day they start and then by the
  day they finish. The headings say which way the table is sorted, to a reader
  who cannot see it, and show an arrow beside the one it is sorted by. The
  order the page begins with is the page's own address, with no sort. A sort
  the page does not have is that order, and is not a page that is not there. An
  order that is not one is ascending.

  A slug is the same in any case, since a link that is typed or shared is not
  always written as the slug is.

  What is archived is not there, as it is nowhere on the public site: an
  archived tournament, a player archived in it. A slug nobody has on this
  website is a page that is not there.

  The tournament's name is not in the header, since this is no one tournament's
  page (`layout.feature`).

  Where a scenario says nothing else, a tournament is for the sport "ac",
  starts on 3 October 2026, and its players represent nothing and fly no flag.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"

  Rule: The page is the player's, for anybody

    Scenario: The page is headed by the player's name
      When the page at "/players/sam-someone" is opened
      Then the page is headed "Sam Someone"

    Scenario: A reader not signed in is shown the page
      Given nobody is signed in
      When the page at "/players/sam-someone" is opened
      Then the page is headed "Sam Someone"

    Scenario: The header names no tournament
      When the page at "/players/sam-someone" is opened
      Then the header names no tournament

    Scenario: A slug in capitals is the same page
      When the page at "/players/SAM-SOMEONE" is opened
      Then the page is headed "Sam Someone"

    Scenario: The heading leads to the slug in lower case
      When the page at "/players/Sam-Someone" is opened
      Then the heading "Tournament" leads to "/players/sam-someone?sort=tournament&order=asc&keep=tournaments"

    Scenario: The page is headed by the world ranking name
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the page at "/players/samuel-rankings" is opened
      Then the page is headed "Samuel Rankings"

  Rule: The table has a row for each tournament, once

    Scenario: The columns are the date and the tournament
      When the page at "/players/sam-someone" is opened
      Then the table's headings are "Date" and "Tournament"

    Scenario: A tournament is a row
      When the page at "/players/sam-someone" is opened
      Then the first row is "Spring Open"

    Scenario: A tournament is a row once however many of its competitions the player is in
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then the table has 1 row

    Scenario: A tournament the player is in none of the competitions of is a row
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then there is a row of "Autumn Open"

    Scenario: A player in two tournaments has a row for each
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then the table has 2 rows

    Scenario: A tournament the player is not in is not a row
      Given "organiser@example.com" has created the tournament "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then there is not a row of "Autumn Open"

    Scenario: Nothing but the dates and the tournament's name is in a row
      When the page at "/players/sam-someone" is opened
      Then the first row says nothing but its dates and "Spring Open"

  Rule: A national or international tournament is bold along its whole row

    The tournaments a player has played in are read as the other lists of
    tournaments are (`home.feature`), so the row of a national or an
    international one is set in bold, and an ordinary one's is not.

    Scenario: A national tournament's row is bold
      Given the tournament "Spring Open" is national
      When the page at "/players/sam-someone" is opened
      Then the row of "Spring Open" is bold

    Scenario: An international tournament's row is bold
      Given the tournament "Spring Open" is international
      When the page at "/players/sam-someone" is opened
      Then the row of "Spring Open" is bold

    Scenario: A tournament that is neither is not bold
      When the page at "/players/sam-someone" is opened
      Then the row of "Spring Open" is not bold

  Rule: Each tournament is dated by the days it runs

    Scenario: A tournament is dated by its days and the year
      When the page at "/players/sam-someone" is opened
      Then the first row is dated "03-05 Oct 2026"

    Scenario: A tournament of one day is dated by that day
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-03-20T00:00:00Z"
      And "organiser@example.com" has created the tournament "One Day Open"
      And "organiser@example.com" has added the player "Sam Someone" to "One Day Open"
      When the page at "/players/sam-someone" is opened
      Then the first row is dated "20 Mar 2027"

    Scenario: A tournament over a new year is dated by both years
      Given the tournament is to start at "2026-12-30T00:00:00Z"
      And the tournament is to finish at "2027-01-02T00:00:00Z"
      And "organiser@example.com" has created the tournament "New Year Open"
      And "organiser@example.com" has added the player "Sam Someone" to "New Year Open"
      When the page at "/players/sam-someone" is opened
      Then the first row is dated "30 Dec 2026-02 Jan 2027"

  Rule: The tournament leads to the player's page in it

    Scenario: The tournament leads to the player's page in that tournament
      When the page at "/players/sam-someone" is opened
      Then the first row's tournament leads to "/2026/ac/spring-open/players/sam-someone"

    Scenario: Pressing the tournament goes there
      Given the page at "/players/sam-someone" is opened
      When the tournament of the first row is pressed
      Then the address is "/2026/ac/spring-open/players/sam-someone"

    Scenario: A tournament of another year and sport leads to its own address
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to be for the sport "gc"
      And "organiser@example.com" has created the tournament "Gateball Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Gateball Open"
      When the page at "/players/sam-someone" is opened
      Then the first row's tournament leads to "/2027/gc/gateball-open/players/sam-someone"

  Rule: The rows begin in order, the tournament that started most recently first

    Scenario: The tournament that started most recently is first
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then the first row is "Autumn Open"
      And the second row is "Spring Open"

    Scenario: The order the page begins with is said to be the dates, newest first
      When the page at "/players/sam-someone" is opened
      Then the table is sorted by "Date", from newest to oldest

    Scenario: The heading of the dates leads to oldest first
      When the page at "/players/sam-someone" is opened
      Then the heading "Date" leads to "/players/sam-someone?sort=date&order=asc&keep=tournaments"

  Rule: The headings sort the table

    Background:
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And "organiser@example.com" has created the tournament "Zed Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Zed Open"

    Scenario: Pressing Tournament sorts from A to Z
      Given the page at "/players/sam-someone" is opened
      When the heading "Tournament" is pressed
      Then the first row is "Spring Open"
      And the second row is "Zed Open"

    Scenario: Pressing Tournament says it is sorted from A to Z
      Given the page at "/players/sam-someone" is opened
      When the heading "Tournament" is pressed
      Then the table is sorted by "Tournament", from A to Z

    Scenario: Pressing Tournament again sorts from Z to A
      Given the page at "/players/sam-someone" is opened
      And the heading "Tournament" is pressed
      When the heading "Tournament" is pressed
      Then the first row is "Zed Open"
      And the second row is "Spring Open"

    Scenario: Pressing Tournament again says it is sorted from Z to A
      Given the page at "/players/sam-someone" is opened
      And the heading "Tournament" is pressed
      When the heading "Tournament" is pressed
      Then the table is sorted by "Tournament", from Z to A

    Scenario: Pressing Date, which it begins sorted by, sorts it oldest first
      Given the page at "/players/sam-someone" is opened
      When the heading "Date" is pressed
      Then the first row is "Spring Open"
      And the second row is "Zed Open"

    Scenario: Pressing Date says it is sorted from oldest to newest
      Given the page at "/players/sam-someone" is opened
      When the heading "Date" is pressed
      Then the table is sorted by "Date", from oldest to newest

    Scenario: Pressing Date again sorts it newest first
      Given the page at "/players/sam-someone" is opened
      And the heading "Date" is pressed
      When the heading "Date" is pressed
      Then the first row is "Zed Open"
      And the second row is "Spring Open"

    Scenario: Pressing Date after Tournament sorts it newest first
      Given the page at "/players/sam-someone?sort=tournament&order=asc" is opened
      When the heading "Date" is pressed
      Then the table is sorted by "Date", from newest to oldest

    Scenario: Names are put in order without their case
      Given "organiser@example.com" has created the tournament "alpha Open"
      And "organiser@example.com" has added the player "Sam Someone" to "alpha Open"
      And the page at "/players/sam-someone" is opened
      When the heading "Tournament" is pressed
      Then the first row is "alpha Open"

    Scenario: Tournaments that start alike are put in order by when they finish
      Given the tournament is to finish at "2027-03-25T00:00:00Z"
      And "organiser@example.com" has created the tournament "Long Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Long Open"
      And the tournament is to finish at "2027-03-21T00:00:00Z"
      And "organiser@example.com" has created the tournament "Short Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Short Open"
      When the page at "/players/sam-someone?sort=date&order=asc" is opened
      Then the third row is "Short Open"
      And the fourth row is "Long Open"

    Scenario: The heading is a link of the page's own
      When the page at "/players/sam-someone" is opened
      Then the heading "Tournament" leads to "/players/sam-someone?sort=tournament&order=asc&keep=tournaments"

    Scenario: The heading the table is sorted by leads to the other way
      When the page at "/players/sam-someone?sort=tournament&order=asc" is opened
      Then the heading "Tournament" leads to "/players/sam-someone?sort=tournament&order=desc&keep=tournaments"

    Scenario: A heading the table is not sorted by leads to the way it is sorted first
      When the page at "/players/sam-someone?sort=tournament&order=asc" is opened
      Then the heading "Date" leads to "/players/sam-someone?sort=date&order=desc&keep=tournaments"

    Scenario: A sort is kept in the address
      When the page at "/players/sam-someone?sort=tournament&order=desc" is opened
      Then the table is sorted by "Tournament", from Z to A

    Scenario: A sort with no order is ascending
      When the page at "/players/sam-someone?sort=tournament" is opened
      Then the table is sorted by "Tournament", from A to Z

    Scenario: A sort the page does not have is the order it begins with
      When the page at "/players/sam-someone?sort=nonsense&order=asc" is opened
      Then the first row is "Zed Open"

    Scenario: An order the page does not have is ascending
      When the page at "/players/sam-someone?sort=tournament&order=sideways" is opened
      Then the table is sorted by "Tournament", from A to Z

    Scenario: A sort without scripting
      Given the page at "/players/sam-someone" is opened with scripting off
      When the heading "Tournament" is pressed
      Then the table is sorted by "Tournament", from A to Z

  Rule: What is archived is not there

    Scenario: A competition archived leaves the tournament a row
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then there is a row of "Spring Open"

    Scenario: The page of an archived player is not there
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then the page says the words for "errors.notFound"

    Scenario: The page of a player of an archived tournament is not there
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then the page says the words for "errors.notFound"

  Rule: A player nobody has is not a page

    Scenario: A slug nobody has is not found
      When the page at "/players/nobody-here" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A player of another website is not found
      Given a site served as "gateballscores.com"
      When the page at "/players/sam-someone" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A slug the player was added under is not a page where their world ranking name is another
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the page at "/players/sam-someone" is opened
      Then the page says the words for "errors.notFound"

  Rule: The page fits a phone

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "Bartholomew Montgomery-Fitzwilliam Memorial Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Bartholomew Montgomery-Fitzwilliam Memorial Open"
      When the page at "/players/sam-someone" is opened
      Then the page is no wider than the window

    Scenario: On a phone the dates of a tournament stay on one line
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "Bartholomew Montgomery-Fitzwilliam Memorial Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Bartholomew Montgomery-Fitzwilliam Memorial Open"
      When the page at "/players/sam-someone" is opened
      Then the dates of the first row are on one line

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the player's name and the names of the tournaments, which are
    what their managers called them.

    Scenario: The heading is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/players/sam-someone" is opened
      Then every word in the page's content but the names is in the test locale
