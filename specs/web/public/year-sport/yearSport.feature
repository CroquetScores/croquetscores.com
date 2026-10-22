@browser @postgres
Feature: A sport's page in a year lists every tournament of it starting then

  A year's page lists every tournament starting in the year (`year.feature`).
  A reader who plays one sport wants that sport's tournaments alone, and goes
  to its page in the year instead: at the year and the sport's code, as
  "/2026/ac", which is where the tournament's own address begins. It lists
  every tournament of the sport starting in the year that is not archived,
  played or not (`TournamentsInYear.feature`).

  It looks and behaves as a year's page does: a table of the tournament's
  dates, the flag of the country it is played in, and its name, the flags'
  column with no heading; a row that leads to the tournament wherever it is
  pressed but its flag; a flag that narrows the list to its country; a column
  heading that sorts the table by that column, and turns it round where it is
  sorted by it already; and a filter of a country and a region of it. It
  begins sorted by date, earliest first. All of it needs no scripting, and
  what was chosen is in the page's address.

  The sport is the page's, so the filter offers no sport to choose: a reader
  after another sport goes to its page. Narrowing and sorting stay on the
  sport's page.

  The secondary navigation is the years there are tournaments of the sport
  in, newest first (`TournamentYears.feature`), each leading to the sport's
  page in that year, fitted to the window as the home page's are, and the year
  being read is marked. A year with none of the sport's tournaments in it
  still has a page, saying there are none, and is not among the years, so no
  year is marked.

  An address whose sport is no sport, or is one the website does not offer,
  is not a page, any more than one whose year is not a year: no tournament of
  this website could be found at it.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  is played in the region "vic" of the country "au".

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed

  Rule: A sport's page in a year is its tournaments, for anybody

    Scenario: The page is headed by its sport and its year
      When the page for "ac" in 2026 is opened
      Then the content has the heading "Association Croquet Tournaments in 2026"

    Scenario: A reader not signed in is shown the tournaments
      Given nobody is signed in
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for "ac" in 2026 is opened
      Then "Spring Open" is in the sport's tournaments

  Rule: The tournaments are every one of the sport starting in the year

    Scenario: A tournament of the sport is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is for the sport "gc"
      When the page for "gc" in 2026 is opened
      Then "Spring Open" is in the sport's tournaments

    Scenario: A tournament of another sport is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is for the sport "ac"
      When the page for "gc" in 2026 is opened
      Then "Spring Open" is not in the sport's tournaments

    Scenario: A tournament already played is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      When the page for "ac" in 2026 is opened
      Then "Spring Open" is in the sport's tournaments

    Scenario: A tournament starting in another year is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-04"
      When the page for "ac" in 2026 is opened
      Then "Spring Open" is not in the sport's tournaments

    Scenario: An archived tournament is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page for "ac" in 2026 is opened
      Then "Spring Open" is not in the sport's tournaments

    Scenario: A tournament on another website is not listed
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for "ac" in 2026 is opened
      Then "Spring Open" is not in the sport's tournaments

  Rule: A sport with no tournaments in the year says so

    Scenario: A sport with no tournaments in the year says there are none
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is for the sport "ac"
      When the page for "gc" in 2026 is opened
      Then the sport's tournaments say there are none

    Scenario: A sport with tournaments in the year does not say there are none
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for "ac" in 2026 is opened
      Then the sport's tournaments do not say there are none

  Rule: An address that is not a year and a sport of the website is not a page

    Scenario Outline: An address that is not a sport's page is not found
      When the page at "<address>" is opened
      Then the page says the words for "errors.notFound"

      Examples:
        | address  |
        | /2026/xx |
        | /2026/AC |
        | /2026/gb |
        | /0999/ac |

    Scenario: A sport the website offers is a page
      When the page at "/2026/a6w" is opened
      Then the content has the heading "American 6 Wicket Tournaments in 2026"

    Scenario: Gateball has a page on Gateball Scores
      Given a site served as "gateballscores.com"
      When the page at "/2026/gb" is opened
      Then the content has the heading "Gateball Tournaments in 2026"

  Rule: Each row says when, what and where

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"

    Scenario Outline: The columns are the dates, the country and the name
      When the page for "ac" in 2026 is opened
      Then the <place> column of the sport's tournaments is "<column>"

      Examples:
        | place | column |
        | first | Date   |
        | third | Name   |

    Scenario: The country's column has no heading
      When the page for "ac" in 2026 is opened
      Then the second column of the sport's tournaments has no heading

    Scenario: A tournament is dated from its start to its finish
      When the page for "ac" in 2026 is opened
      Then "Spring Open" is dated "10-12 Oct" in the sport's tournaments

    Scenario: The country is shown as its flag
      When the page for "ac" in 2026 is opened
      Then "Spring Open" shows the flag of "nz" in the sport's tournaments

    Scenario: The flag is named for a screen reader by what pressing it does
      When the page for "ac" in 2026 is opened
      Then the flag of "Spring Open" in the sport's tournaments is named "Only tournaments in New Zealand"

  Rule: The tournaments begin sorted by date, earliest first, and sort by a column pressed

    Background:
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-11-07"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"

    Scenario: The earliest is first
      When the page for "ac" in 2026 is opened
      Then the first of the sport's tournaments is "Spring Open"
      And the second of the sport's tournaments is "Autumn Open"

    Scenario: The dates begin marked as sorted from the earliest
      When the page for "ac" in 2026 is opened
      Then the column "Date" of the sport's tournaments is marked as sorted from the smallest

    Scenario: A column not sorted by sorts from the smallest
      Given the page for "ac" in 2026 is open
      When the column "Name" of the sport's tournaments is pressed
      Then the first of the sport's tournaments is "Autumn Open"

    Scenario: The column sorted by is turned round when pressed
      Given the page for "ac" in 2026 is open
      When the column "Date" of the sport's tournaments is pressed
      Then the first of the sport's tournaments is "Autumn Open"

    Scenario: Sorting stays on the sport's page
      Given the page for "ac" in 2026 is open
      When the column "Name" of the sport's tournaments is pressed
      Then the address is "/2026/ac"

  Rule: Pressing anywhere on a row but its flag leads to the tournament

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is for the sport "gc"

    Scenario Outline: Each part of a row leads to the tournament
      Given the page for "gc" in 2026 is open
      When the <part> of "Spring Open" in the sport's tournaments is pressed
      Then the address is "/2026/gc/spring-open"

      Examples:
        | part |
        | date |
        | name |

    Scenario: The row offers a link to the tournament and one to its country
      When the page for "gc" in 2026 is opened
      Then the row of "Spring Open" in the sport's tournaments holds 2 links

  Rule: The tournaments are narrowed by country and region, and not by sport

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "nz"
      And the tournament "Autumn Open" is played in the region "auc"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-12-05"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"

    Scenario: Nothing is filtered by to begin with
      When the page for "ac" in 2026 is opened
      Then 3 of the sport's tournaments are listed

    Scenario: A country chosen does not list another country's tournaments
      Given the page for "ac" in 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Summer Open" is not in the sport's tournaments

    Scenario: A region chosen does not list another region's tournaments
      Given the page for "ac" in 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then "Autumn Open" is not in the sport's tournaments

    Scenario: Filtering stays on the sport's page
      Given the page for "ac" in 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the address is "/2026/ac"

    Scenario: No sport is offered to choose
      When the page for "ac" in 2026 is opened
      Then no sport is offered

    Scenario: A flag pressed lists its country's tournaments
      Given the page for "ac" in 2026 is open
      When the flag of "Spring Open" in the sport's tournaments is pressed
      Then "Summer Open" is not in the sport's tournaments

    Scenario: A flag pressed stays on the sport's page
      Given the page for "ac" in 2026 is open
      When the flag of "Spring Open" in the sport's tournaments is pressed
      Then the address is "/2026/ac"

  Rule: A region chosen with few tournaments to show says why

    Tournaments from before November 2026 have no region, so a region narrows
    a list to far fewer than the reader may expect, and the page says so rather
    than leaving them to think tournaments are missing.

    Scenario: A region chosen with fewer than 20 tournaments shows the notice
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And the tournament "Spring Open" is for the sport "ac"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the page for "ac" in 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is shown

    Scenario: A country chosen without a region shows no notice
      Given the page for "ac" in 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is not shown

  Rule: A filter that cannot be is the reader's mistake

    Scenario: A country there is not is refused
      When the page for "ac" in 2026 is opened for the country "xx"
      Then the page is refused with "TournamentsInYear.NoSuchCountry"

  Rule: The years are those with tournaments of the sport, the year being read marked

    Scenario: A year with a tournament of the sport is offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And the tournament "Spring Open" is for the sport "gc"
      When the page for "gc" in 2024 is opened
      Then the year 2024 is offered

    Scenario: A year with only another sport's tournaments is not offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And the tournament "Spring Open" is for the sport "gc"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2025-10-03"
      And the tournament "Autumn Open" is for the sport "ac"
      When the page for "gc" in 2024 is opened
      Then the year 2025 is not offered

    Scenario: The year being read is marked as the year chosen
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      When the page for "ac" in 2024 is opened
      Then the tab for 2024 is marked as the year chosen

    Scenario: Another year leads to the sport's page in that year
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the page for "ac" in 2024 is open
      When the year 2026 is pressed
      Then the address is "/2026/ac"

    Scenario: A year with none of the sport's tournaments marks no year
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the page for "ac" in 2025 is opened
      Then no year is marked as chosen

    Scenario: A year in the drop-down list leads to the sport's page in that year
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      And the page for "ac" in 2026 is open
      And the drop-down list of years is pressed
      When the year 2015 is pressed
      Then the address is "/2015/ac"

  Rule: The page fits a phone

    Background:
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "The Northern Counties Invitation Golf Croquet Championship"
      And the tournament "The Northern Counties Invitation Golf Croquet Championship" starts on "2026-10-10"

    Scenario: On a phone the page is no wider than the window
      When the page for "ac" in 2026 is opened
      Then the page is no wider than the window

    Scenario: On a phone a long name is not cut short
      When the page for "ac" in 2026 is opened
      Then the name "The Northern Counties Invitation Golf Croquet Championship" is shown whole

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out, as on a year's page: a tournament's name, its dates, the
    years, and a region's name.

    Scenario: The list is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for "ac" in 2026 is opened
      Then every word in the page's content but the tournaments' own is in the test locale

    Scenario: The heading names the sport in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the page for "ac" in 2026 is opened
      Then the content has the heading "Torneos de Croquet Asociación en 2026"
