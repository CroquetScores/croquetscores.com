@browser @postgres
Feature: A year's page lists every tournament starting in it

  The home page lists what is being played now and what is about to start
  (`home.feature`). A reader after a tournament further off or long finished
  goes to its year instead: the years are the home page's secondary
  navigation, and beneath the upcoming tournaments is the way to this year's.
  A year's page is at the year's own address, as "/2026", and lists every
  tournament starting in that year that is not archived, played or not
  (`TournamentsInYear.feature`).

  The list looks and behaves as the home page's lists do: a table of the
  tournament's dates, the flag of the country it is played in, and its name,
  the flags' column with no heading; a row that leads to the tournament
  wherever it is pressed but its flag; a flag that narrows the list to its
  country; a column heading that sorts the table by that column, and turns it
  round where it is sorted by it already; and a filter of a country, a region
  of it and a sport. All of it needs no scripting, and what was chosen is in
  the page's address. The tournament's public page does not exist yet, so a
  row leads to an address that answers `404` until the feature that provides
  it lands.

  Where the home page's recent results begin in the order they were played,
  which no column shows, a year begins sorted by date, earliest first, as a
  calendar of the year is read, and so its dates begin marked as sorted from
  the earliest.

  The secondary navigation is the years there are tournaments in, as on the
  home page, fitted to the window as they are there, and the year being read is
  marked: a tab as the section being read is, or, where it is not one of the
  tabs, within the drop-down list. A year with no tournaments in it still has
  a page, saying there are none, since a link to it may have been kept from a
  year that had some; it is not among the years, so no year is marked. An
  address that is not a year is not a page. A year is four digits, the first
  of them not a nought, as it is in a tournament's address, since no
  tournament can start in any other.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  is played in the region "vic" of the country "au".

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed

  Rule: A year's page is its tournaments, for anybody

    Scenario: The page is headed by its year
      When the page for 2026 is opened
      Then the content has the heading "Tournaments in 2026"

    Scenario: A reader not signed in is shown the tournaments
      Given nobody is signed in
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for 2026 is opened
      Then "Spring Open" is in the year's tournaments

  Rule: The tournaments are every one starting in the year

    Scenario: A tournament still to come is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-11-07"
      When the page for 2026 is opened
      Then "Spring Open" is in the year's tournaments

    Scenario: A tournament already played is listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      When the page for 2026 is opened
      Then "Spring Open" is in the year's tournaments

    Scenario: A tournament starting in another year is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-04"
      When the page for 2026 is opened
      Then "Spring Open" is not in the year's tournaments

    Scenario: A tournament over the new year is listed in the year it starts
      Given "organiser@example.com" has created the tournament "New Year Open"
      And the tournament "New Year Open" starts on "2025-12-30"
      And the tournament "New Year Open" finishes on "2026-01-02"
      When the page for 2025 is opened
      Then "New Year Open" is in the year's tournaments

    Scenario: A tournament over the new year is not listed in the year it finishes
      Given "organiser@example.com" has created the tournament "New Year Open"
      And the tournament "New Year Open" starts on "2025-12-30"
      And the tournament "New Year Open" finishes on "2026-01-02"
      When the page for 2026 is opened
      Then "New Year Open" is not in the year's tournaments

    Scenario: An archived tournament is not listed
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page for 2026 is opened
      Then "Spring Open" is not in the year's tournaments

    Scenario: A tournament on another website is not listed
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for 2026 is opened
      Then "Spring Open" is not in the year's tournaments

  Rule: A year with no tournaments says so

    Scenario: A year with no tournaments says there are none
      When the page for 2026 is opened
      Then the year's tournaments say there are none

    Scenario: A year with tournaments does not say there are none
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for 2026 is opened
      Then the year's tournaments do not say there are none

  Rule: An address that is not a year is not a page

    Scenario Outline: An address that is not a year is not found
      When the page at "<address>" is opened
      Then the page says the words for "errors.notFound"

      Examples:
        | address |
        | /twenty |
        | /202    |
        | /20266  |
        | /0000   |
        | /0999   |

  Rule: Each row says when, what and where

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"

    Scenario Outline: The columns are the dates, the country and the name
      When the page for 2026 is opened
      Then the <place> column of the year's tournaments is "<column>"

      Examples:
        | place | column |
        | first | Date   |
        | third | Name   |

    Scenario: The country's column has no heading
      When the page for 2026 is opened
      Then the second column of the year's tournaments has no heading

    Scenario: A tournament is dated from its start to its finish
      When the page for 2026 is opened
      Then "Spring Open" is dated "10-12 Oct" in the year's tournaments

    Scenario: The country is shown as its flag
      When the page for 2026 is opened
      Then "Spring Open" shows the flag of "nz" in the year's tournaments

    Scenario: The flag is named for a screen reader by what pressing it does
      When the page for 2026 is opened
      Then the flag of "Spring Open" in the year's tournaments is named "Only tournaments in New Zealand"

    Scenario: The month is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the page for 2026 is opened
      Then "Spring Open" is dated "10-12 oct" in the year's tournaments

  Rule: The tournaments begin sorted by date, earliest first

    Background:
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-11-07"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"

    Scenario: The earliest is first
      When the page for 2026 is opened
      Then the first of the year's tournaments is "Spring Open"
      And the second of the year's tournaments is "Autumn Open"

    Scenario: The dates begin marked as sorted from the earliest
      When the page for 2026 is opened
      Then the column "Date" of the year's tournaments is marked as sorted from the smallest

    Scenario: Nothing else begins marked as sorted
      When the page for 2026 is opened
      Then the column "Name" of the year's tournaments is not marked as sorted

    Scenario: Tournaments starting on the same day begin in order of their names
      Given "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-03-07"
      When the page for 2026 is opened
      Then the first of the year's tournaments is "Spring Open"
      And the second of the year's tournaments is "Summer Open"

  Rule: Pressing a column heading sorts the table by it

    Background:
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-11-07"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"

    Scenario: A column not sorted by sorts from the smallest
      Given the page for 2026 is open
      When the column "Name" of the year's tournaments is pressed
      Then the first of the year's tournaments is "Autumn Open"
      And the second of the year's tournaments is "Spring Open"

    Scenario: The country's column cannot be pressed to sort by it
      When the page for 2026 is opened
      Then the second column of the year's tournaments cannot be pressed

    Scenario: The column sorted by is turned round when pressed
      Given the page for 2026 is open
      When the column "Date" of the year's tournaments is pressed
      Then the first of the year's tournaments is "Autumn Open"

    Scenario: A column turned round is marked as sorted from the largest
      Given the page for 2026 is open
      When the column "Date" of the year's tournaments is pressed
      Then the column "Date" of the year's tournaments is marked as sorted from the largest

    Scenario: Sorting from the smallest is shown by an arrow pointing up
      Given the page for 2026 is open
      When the column "Name" of the year's tournaments is pressed
      Then the heading "Name" of the year's tournaments begins with an arrow pointing up

    Scenario: Sorting from the largest is said to a screen reader
      Given the page for 2026 is open
      And the column "Name" of the year's tournaments is pressed
      When the column "Name" of the year's tournaments is pressed
      Then the column "Name" of the year's tournaments is announced as sorted descending

    Scenario: The column sorted by before is no longer marked
      Given the page for 2026 is open
      When the column "Name" of the year's tournaments is pressed
      Then the column "Date" of the year's tournaments is not marked as sorted

    Scenario: A table sorted stays sorted when the page is opened again at its address
      Given the page for 2026 is open
      And the column "Name" of the year's tournaments is pressed
      When the page is opened again at its address
      Then the first of the year's tournaments is "Autumn Open"

    Scenario: Going back undoes the sorting
      Given the page for 2026 is open
      And the column "Name" of the year's tournaments is pressed
      When the browser goes back
      Then the first of the year's tournaments is "Spring Open"

    Scenario: Sorting stays on the year's page
      Given the page for 2026 is open
      When the column "Name" of the year's tournaments is pressed
      Then the address is "/2026"

  Rule: Pressing anywhere on a row but its flag leads to the tournament

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is for the sport "gc"

    Scenario Outline: Each part of a row leads to the tournament
      Given the page for 2026 is open
      When the <part> of "Spring Open" in the year's tournaments is pressed
      Then the address is "/2026/gc/spring-open"

      Examples:
        | part |
        | date |
        | name |

    Scenario: The row offers a link to the tournament and one to its country
      When the page for 2026 is opened
      Then the row of "Spring Open" in the year's tournaments holds 2 links

    Scenario: A row can be pressed with a thumb
      Given a viewport 375 pixels wide
      When the page for 2026 is opened
      Then the row of "Spring Open" in the year's tournaments is at least 44 pixels tall

  Rule: The tournaments are narrowed by country, region and sport

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the tournament "Spring Open" is for the sport "ac"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "nz"
      And the tournament "Autumn Open" is played in the region "auc"
      And the tournament "Autumn Open" is for the sport "gc"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-12-05"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"
      And the tournament "Summer Open" is for the sport "ac"

    Scenario: Nothing is filtered by to begin with
      When the page for 2026 is opened
      Then 3 of the year's tournaments are listed

    Scenario: A country chosen does not list another country's tournaments
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Summer Open" is not in the year's tournaments

    Scenario: A region chosen does not list another region's tournaments
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then "Autumn Open" is not in the year's tournaments

    Scenario: A sport chosen does not list another sport's tournaments
      Given the page for 2026 is open
      And "Golf Croquet" is chosen as the sport
      When "Filter" is pressed
      Then "Spring Open" is not in the year's tournaments

    Scenario: A country and a sport chosen together narrow by both
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Association Croquet" is chosen as the sport
      When "Filter" is pressed
      Then 1 of the year's tournaments is listed

    Scenario: Filtering stays on the year's page
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the address is "/2026"

    Scenario: What was chosen is still chosen
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the country chosen is "New Zealand"

    Scenario: Sorting keeps the filter
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      When the column "Name" of the year's tournaments is pressed
      Then "Summer Open" is not in the year's tournaments

    Scenario: Filtering keeps the sorting
      Given the page for 2026 is open
      And the column "Name" of the year's tournaments is pressed
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the first of the year's tournaments is "Autumn Open"

    Scenario: No region is offered before a country is chosen
      When the page for 2026 is opened
      Then no region is offered

    Scenario: The regions of the country chosen are offered
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Canterbury" is offered as a region

    Scenario: A region left chosen when another country is chosen is dropped
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      And "Filter" is pressed
      And "Australia" is chosen as the country
      When "Filter" is pressed
      Then "Summer Open" is in the year's tournaments

    Scenario: The sports offered are the website's
      When the page for 2026 is opened
      Then "Gateball" is not offered as a sport

  Rule: A region chosen with few tournaments to show says why

    Tournaments from before November 2026 have no region, so a region narrows
    a list to far fewer than the reader may expect, and the page says so rather
    than leaving them to think tournaments are missing.

    Scenario: A region chosen with fewer than 20 tournaments shows the notice
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is shown

    Scenario: A region chosen with more than 20 tournaments shows no notice
      Given the tournament is to start at "2026-03-07T00:00:00Z"
      And the tournament is to be played in the country "nz"
      And the tournament is to be played in the region "can"
      And "organiser@example.com" has created 21 tournaments
      And the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is not shown

    Scenario: A region chosen with exactly 20 tournaments shows no notice
      Given the tournament is to start at "2026-03-07T00:00:00Z"
      And the tournament is to be played in the country "nz"
      And the tournament is to be played in the region "can"
      And "organiser@example.com" has created 20 tournaments
      And the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is not shown

    Scenario: A country chosen without a region shows no notice
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is not shown

  Rule: Pressing a flag narrows the list to its country

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the tournament "Spring Open" is for the sport "ac"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "nz"
      And the tournament "Autumn Open" is played in the region "auc"
      And the tournament "Autumn Open" is for the sport "gc"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-12-05"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"
      And the tournament "Summer Open" is for the sport "ac"

    Scenario: A flag pressed lists its country's tournaments
      Given the page for 2026 is open
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then "Autumn Open" is in the year's tournaments

    Scenario: A flag pressed does not list another country's tournaments
      Given the page for 2026 is open
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then "Summer Open" is not in the year's tournaments

    Scenario: A flag pressed chooses its country in the filter
      Given the page for 2026 is open
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then the country chosen is "New Zealand"

    Scenario: A flag pressed stays on the year's page
      Given the page for 2026 is open
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then the address is "/2026"

    Scenario: A flag pressed keeps the sorting
      Given the page for 2026 is open
      And the column "Name" of the year's tournaments is pressed
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then the first of the year's tournaments is "Autumn Open"

    Scenario: A flag pressed keeps the sport chosen
      Given the page for 2026 is open
      And "Association Croquet" is chosen as the sport
      And "Filter" is pressed
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then "Autumn Open" is not in the year's tournaments

    Scenario: A flag pressed drops a region chosen
      Given the page for 2026 is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      And "Filter" is pressed
      When the flag of "Spring Open" in the year's tournaments is pressed
      Then "Autumn Open" is in the year's tournaments

  Rule: A filter that cannot be is the reader's mistake

    Scenario: A country there is not is refused
      When the page for 2026 is opened for the country "xx"
      Then the page is refused with "TournamentsInYear.NoSuchCountry"

    Scenario: A sport the website does not offer is refused
      When the page for 2026 is opened for the sport "gb"
      Then the page is refused with "TournamentFilter.SportNotOffered"

  Rule: The year being read is marked among the years

    Scenario: The year being read is offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the page for 2024 is opened
      Then the year 2024 is offered

    Scenario: The year being read is marked as the year chosen
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      When the page for 2024 is opened
      Then the tab for 2024 is marked as the year chosen

    Scenario: Another year is not marked
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      When the page for 2024 is opened
      Then the tab for 2026 is not marked as the year chosen

    Scenario: Another year leads to its own page
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-03"
      And the page for 2024 is open
      When the year 2026 is pressed
      Then the address is "/2026"

    Scenario: A year with no tournaments marks no year
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the page for 2025 is opened
      Then no year is marked as chosen

    Scenario: A year in the drop-down list is marked there
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the page for 2015 is opened
      Then the year chosen is 2015

    Scenario: A year that is a tab is not in the drop-down list as well
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the page for 2015 is opened
      Then the year 2026 is not in the drop-down list

    Scenario: The years keep to one row of the bar
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the page for 2015 is opened
      Then the years take one row of the bar

  Rule: The page fits a phone

    Background:
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "The Northern Counties Invitation Golf Croquet Championship"
      And the tournament "The Northern Counties Invitation Golf Croquet Championship" starts on "2026-10-10"

    Scenario: On a phone the page is no wider than the window
      When the page for 2026 is opened
      Then the page is no wider than the window

    Scenario: On a phone a long name is not cut short
      When the page for 2026 is opened
      Then the name "The Northern Counties Invitation Golf Croquet Championship" is shown whole

  Rule: The table is drawn as the home page's are

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"

    Scenario: The column headings are on the secondary navigation's colour
      When the page for 2026 is opened
      Then the column headings of the year's tournaments are on the colour the secondary navigation is on

    Scenario: The second row is on a colour of its own
      When the page for 2026 is opened
      Then the second of the year's tournaments is not on the colour the first is on

    Scenario: The third row is on the colour of the first
      When the page for 2026 is opened
      Then the third of the year's tournaments is on the colour the first is on

    Scenario: There are no lines between the cells
      When the page for 2026 is opened
      Then the year's tournaments have no lines between their cells

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: a tournament's name, which is what its manager called it, its
    dates, whose months are named in the reader's language but whose days are
    numbers, the years, which are numbers, and a region's name, which is kept
    as it was recorded.

    Scenario: The list is in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for 2026 is opened
      Then every word in the page's content but the tournaments' own is in the test locale

    Scenario: A list with nothing in it says so in the reader's language
      Given a browser that asks for "en-XA"
      When the page for 2026 is opened
      Then every word in the page's content but the tournaments' own is in the test locale

    Scenario: The filter is in the reader's language once a country is chosen
      Given a browser that asks for "en-XA"
      When the page for 2026 is opened for the country "nz"
      Then every word in the page's content but the tournaments' own is in the test locale
