@browser @postgres
Feature: A year's page is its months, and a month opens in place to show its tournaments

  A year's page used to list every tournament starting in the year
  (`year.feature`). A year holds hundreds, and a reader is after a month's.
  So the page at "/2026", and a sport's at "/2026/ac", lists the twelve months
  of the year, each closed. Pressing a month opens it on the same page: the
  month's tournaments appear beneath it, in the table the year's page was
  (`year.feature`). Pressing it again closes it. Months open independently, so
  a reader can open as many as they like, up to all twelve, and read them
  down the one page.

  The public side works without scripting (`SETUP.md`), so a month is a link
  to the same page with that month added to, or taken from, the months open,
  which are in the address as "/2026?open=3,10". That is also what lets a
  reader keep or share a page with the months they were reading open. A
  tournament is not fetched until its month is open, so a closed month costs
  the page nothing.

  A closed month says how many tournaments start in it, so that the reader
  sees where the year's tournaments are without opening them.

  Each open month's tournaments are narrowed by the country, region and sport
  the reader chose, as the year's were (`year.feature`), and are sorted by
  date, earliest first. The table's own column sorting is the page's, and
  applies to every open month alike.

  Where a scenario says nothing else, a tournament is for the sport "ac".

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed

  Rule: A year's page lists its twelve months, all closed

    Scenario: The page lists the twelve months
      When the page for 2026 is opened
      Then the year has 12 months

    Scenario: The first month is January
      When the page for 2026 is opened
      Then the first month of the year is "January"

    Scenario: The last month is December
      When the page for 2026 is opened
      Then the twelfth month of the year is "December"

    Scenario: The months are named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the page for 2026 is opened
      Then the first month of the year is "enero"

    Scenario: No month begins open
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for 2026 is opened
      Then the month "October" is closed
      And "Spring Open" is not in the year's tournaments

  Rule: A closed month says how many tournaments start in it

    Scenario: A month counts the tournaments starting in it
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-24"
      When the page for 2026 is opened
      Then the month "October" has 2 tournaments

    Scenario: A month with none says none
      When the page for 2026 is opened
      Then the month "October" has 0 tournaments

    Scenario: A tournament is counted in the month it starts
      Given "organiser@example.com" has created the tournament "New Year Open"
      And the tournament "New Year Open" starts on "2025-12-30"
      And the tournament "New Year Open" finishes on "2026-01-02"
      When the page for 2026 is opened
      Then the month "January" has 0 tournaments

    Scenario: An archived tournament is not counted
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the page for 2026 is opened
      Then the month "October" has 0 tournaments

    Scenario: A tournament on another website is not counted
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the page for 2026 is opened
      Then the month "October" has 0 tournaments

  Rule: Pressing a month opens it on the same page

    Scenario: Pressing a month opens it
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" is open
      And "Spring Open" is in the year's tournaments

    Scenario: The page stays the year's
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the page is the year 2026's

    Scenario: A tournament starting in another month is not shown
      Given "organiser@example.com" has created the tournament "Winter Open"
      And the tournament "Winter Open" starts on "2026-07-04"
      And the page for 2026 is open
      When the month "October" is pressed
      Then "Winter Open" is not in the year's tournaments

    Scenario: A tournament starting in the same month of another year is not shown
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-10"
      And the page for 2026 is open
      When the month "October" is pressed
      Then "Spring Open" is not in the year's tournaments

    Scenario: An open month with none says so
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" says there are none

    Scenario: An open month's tournaments are earliest first
      Given "organiser@example.com" has created the tournament "Late Open"
      And the tournament "Late Open" starts on "2026-10-24"
      And "organiser@example.com" has created the tournament "Early Open"
      And the tournament "Early Open" starts on "2026-10-03"
      And the page for 2026 is open
      When the month "October" is pressed
      Then the first of the month's tournaments is "Early Open"
      And the second of the month's tournaments is "Late Open"

  Rule: Pressing an open month closes it

    Scenario: Pressing an open month closes it
      Given the page for 2026 is open
      And the month "October" is pressed
      When the month "October" is pressed
      Then the month "October" is closed

    Scenario: Closing a month leaves the others open
      Given the page for 2026 is open
      And the month "March" is pressed
      And the month "October" is pressed
      When the month "October" is pressed
      Then the month "March" is open

  Rule: Any number of months can be open at once

    Scenario: A second month opens beside the first
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-10"
      And the page for 2026 is open
      And the month "March" is pressed
      When the month "October" is pressed
      Then "Spring Open" is in the year's tournaments
      And "Autumn Open" is in the year's tournaments

    Scenario: All twelve months can be open
      Given the page for 2026 is open
      When every month of the year is pressed
      Then 12 months are open

  Rule: The months open are in the address

    Scenario: The address names the months open
      Given the page for 2026 is open
      And the month "October" is pressed
      When the month "March" is pressed
      Then the page's address asks for the months "3,10" open

    Scenario: A page opened at such an address has those months open
      When the page at "/2026?open=3,10" is opened
      Then the month "March" is open
      And the month "October" is open
      And the month "June" is closed

    Scenario: Closing the last month leaves the address as the year's
      Given the page for 2026 is open
      And the month "October" is pressed
      When the month "October" is pressed
      Then the page's address asks for no months open

    Scenario Outline: A month that is no month is left closed
      When the page at "<address>" is opened
      Then 0 months are open

      Examples:
        | address                |
        | /2026?open=0           |
        | /2026?open=13          |
        | /2026?open=october     |
        | /2026?open=            |

  Rule: A sport's page opens its months in the same way

    Scenario: The sport's page lists the twelve months
      When the page for 2026 in the sport "ac" is opened
      Then the year has 12 months

    Scenario: A month counts only the sport's tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Gate Open"
      And the tournament "Gate Open" starts on "2026-10-11"
      And the tournament "Gate Open" is for the sport "gc"
      When the page for 2026 in the sport "ac" is opened
      Then the month "October" has 1 tournaments

    Scenario: An open month shows only the sport's tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Gate Open"
      And the tournament "Gate Open" starts on "2026-10-11"
      And the tournament "Gate Open" is for the sport "gc"
      And the page for 2026 in the sport "ac" is open
      When the month "October" is pressed
      Then "Spring Open" is in the year's tournaments
      And "Gate Open" is not in the year's tournaments

  Rule: What the reader chose narrows the months

    The country and region a reader narrowed to are in the address
    (`year.feature`), and are kept as months are opened and closed.

    Scenario: A month counts only the country chosen
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      When the page at "/2026?country=au" is opened
      Then the month "October" has 0 tournaments

    Scenario: Opening a month keeps the country chosen
      Given the page at "/2026?country=nz" is open
      When the month "October" is pressed
      Then the page's address asks for the country "nz"
