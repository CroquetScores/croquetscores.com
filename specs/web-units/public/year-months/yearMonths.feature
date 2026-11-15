@browser @postgres
Feature: A year's page is its months, and a month's tournaments are loaded when it is pressed

  A year's page used to list every tournament starting in the year
  (`year.feature`). A year holds hundreds, and a reader is after a month's, so
  the page at "/2026", and a sport's at "/2026/ac", lists the twelve months of
  the year, each closed, and loads nothing else.

  Pressing a month asks the server for that month's tournaments alone and
  puts them beneath the month, in the table the year's page was
  (`year.feature`). The page is not loaded again, and nothing is asked for a
  month nobody has pressed. That is the point: the page is an address anybody
  can follow, and loading a year's tournaments whole on every visit would
  ask the server for a great deal that is never read, which a page of results
  at a time would only have spread out. Pressing a month again closes it, and
  pressing it once more shows it without asking again. Months open
  independently, so a reader can open as many as they like, up to all twelve,
  and read them down the one page.

  This needs scripting, as registering does (`java-script-required.feature`):
  without it the page says so in place of the months.

  The country, region and sport the reader chose still narrow the
  tournaments (`year.feature`), and are in the page's address as they are
  there. Each month's tournaments begin sorted by date, earliest first.
  Pressing a column heading sorts every open month's table the same way, and
  a month opened afterwards begins sorted so too, since a reader sorting by
  name wants all of them by name and not one. The sorting is remembered by the
  reader's device, as every other list's is (`rememberedSorting.feature`), so
  that a year's page and a sport's are next opened sorted the way it was left.
  Putting the usual order back is done in the same way: in place, for every
  open month, and it makes the device forget what it remembered.

  A month is marked "+" while it is closed and "-" while it is open. Open, it
  has no heading of its own beyond its name, which is not said again over its
  table, and its name is joined to the table's column headings in the one
  green, so that the two read as a single heading.

  A month is drawn as a bar of its own colour, with no border round it and
  square corners, so that a closed month and an open one differ by colour and
  not by a line.

  Beneath the page's heading is a way to open every month at once, which says
  "+ Show all" until every month is open and then "- Hide all", which closes
  them all, marked as a month is. It opens the months a reader has not, and leaves alone those already
  open.

  Where a scenario says nothing else, a tournament is for the sport "ac".

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed

  Rule: A year's page lists its twelve months, all closed

    Background:
      Given scripting is on

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

    Scenario: Nothing is asked of the server for a month nobody pressed
      When the page for 2026 is opened
      Then no month's tournaments have been asked for

  Rule: Pressing a month loads its tournaments beneath it

    Background:
      Given scripting is on

    Scenario: Pressing a month opens it
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" is open
      And "Spring Open" is in the year's tournaments

    Scenario: Only the month's tournaments are asked for
      Given the page for 2026 is open
      When the month "October" is pressed
      Then 1 month's tournaments have been asked for

    Scenario: The page is not loaded again
      Given the page for 2026 is open
      And the page has been marked
      When the month "October" is pressed
      Then the page is the one that was marked

    Scenario: The address is still the year's
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

    Scenario: A tournament over the new year is shown only in the month it starts
      Given "organiser@example.com" has created the tournament "New Year Open"
      And the tournament "New Year Open" starts on "2025-12-30"
      And the tournament "New Year Open" finishes on "2026-01-02"
      And the page for 2026 is open
      When the month "January" is pressed
      Then "New Year Open" is not in the year's tournaments

    Scenario: An archived tournament is not shown
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the page for 2026 is open
      When the month "October" is pressed
      Then "Spring Open" is not in the year's tournaments

    Scenario: A tournament on another website is not shown
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2026-10-10"
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
      Then the first of the year's tournaments is "Early Open"
      And the second of the year's tournaments is "Late Open"

  Rule: Pressing an open month closes it, and pressing it again shows it without asking

    Background:
      Given scripting is on

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

    Scenario: A month pressed again is not asked for again
      Given the page for 2026 is open
      And the month "October" is pressed
      And the month "October" is pressed
      When the month "October" is pressed
      Then 1 month's tournaments have been asked for

  Rule: Any number of months can be open at once

    Background:
      Given scripting is on

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

  Rule: A month is marked by whether it is open

    Background:
      Given scripting is on

    Scenario: A closed month is marked with a plus
      When the page for 2026 is opened
      Then the month "October" is marked "+"

    Scenario: An open month is marked with a minus
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" is marked "-"

    Scenario: A month closed again is marked with a plus
      Given the page for 2026 is open
      And the month "October" is pressed
      When the month "October" is pressed
      Then the month "October" is marked "+"

  Rule: A month has no border and no rounded corners

    Background:
      Given scripting is on

    Scenario: A closed month has no border
      When the page for 2026 is opened
      Then the month "October" has no border

    Scenario: An open month has no border
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" has no border

    Scenario: A closed month has square corners
      When the page for 2026 is opened
      Then the month "October" has square corners

    Scenario: An open month has square corners
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" has square corners

  Rule: One control under the heading shows or hides every month

    Background:
      Given scripting is on

    Scenario: The control is beneath the heading and above the months
      When the page for 2026 is opened
      Then the way to show all the months is beneath the heading
      And the way to show all the months is above the first month

    Scenario: The control begins by saying "Show all"
      When the page for 2026 is opened
      Then the way to show or hide all the months says "Show all"

    Scenario: The control begins marked with a plus
      When the page for 2026 is opened
      Then the way to show or hide all the months is marked "+"

    Scenario: Pressing it opens every month
      Given the page for 2026 is open
      When the way to show or hide all the months is pressed
      Then 12 months are open

    Scenario: Once every month is open it says "Hide all"
      Given the page for 2026 is open
      When the way to show or hide all the months is pressed
      Then the way to show or hide all the months says "Hide all"

    Scenario: Once every month is open it is marked with a minus
      Given the page for 2026 is open
      When the way to show or hide all the months is pressed
      Then the way to show or hide all the months is marked "-"

    Scenario: Pressing it again closes every month
      Given the page for 2026 is open
      And the way to show or hide all the months is pressed
      When the way to show or hide all the months is pressed
      Then 0 months are open

    Scenario: Once every month is closed it says "Show all" again
      Given the page for 2026 is open
      And the way to show or hide all the months is pressed
      When the way to show or hide all the months is pressed
      Then the way to show or hide all the months says "Show all"

    Scenario: With some months open it says "Show all"
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the way to show or hide all the months says "Show all"

    Scenario: Pressing it with a month open leaves that month open and opens the rest
      Given the page for 2026 is open
      And the month "October" is pressed
      When the way to show or hide all the months is pressed
      Then 12 months are open

    Scenario: A month open already is not asked for again
      Given the page for 2026 is open
      And the month "October" is pressed
      When the way to show or hide all the months is pressed
      Then 12 month's tournaments have been asked for

    Scenario: Closing a month by hand after showing all says "Show all"
      Given the page for 2026 is open
      And the way to show or hide all the months is pressed
      When the month "October" is pressed
      Then the way to show or hide all the months says "Show all"

    Scenario: A month that could not be loaded again leaves it saying "Show all"
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-03-07"
      And the page for 2026 is open
      And the way to show or hide all the months is pressed
      And the next asking for December is answered with a server error
      When the column "Name" of the month "March" is pressed
      Then the way to show or hide all the months says "Show all"

    Scenario: A sport's page has it too
      When the page for "ac" in 2026 is opened
      Then the way to show or hide all the months says "Show all"

  Rule: An open month is one heading with its column headings

    Background:
      Given scripting is on

    Scenario: An open month has no heading over its table
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" has no other heading

    Scenario: An open month's name is joined to its column headings
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" touches its column headings

    Scenario: An open month's name is the colour of its column headings
      Given the page for 2026 is open
      When the month "October" is pressed
      Then the month "October" is the colour of its column headings

  Rule: The columns are as wide in every month as in the others

    Months open one beneath another, and a table sized by what is in it is
    wider in the dates of one month than another's, so that the names begin at
    a different place in each. Read down the page, they should line up.

    Background:
      Given scripting is on
      And "organiser@example.com" has created the tournament "Long Dates Open"
      And the tournament "Long Dates Open" starts on "2026-03-28"
      And the tournament "Long Dates Open" finishes on "2026-04-03"
      And "organiser@example.com" has created the tournament "Short Dates Open"
      And the tournament "Short Dates Open" starts on "2026-10-03"
      And the page for 2026 is open
      And the month "March" is pressed
      And the month "October" is pressed

    Scenario: The dates are as wide in each month
      Then the column "Date" of the month "March" is as wide as that of the month "October"

    Scenario: The names are as wide in each month
      Then the column "Name" of the month "March" is as wide as that of the month "October"

    Scenario: The longest dates fit their column
      Then the dates of the month "March" fit their column

    Scenario: The longest dates fit their column on a phone
      Given a viewport 360 pixels wide and 700 pixels tall
      Then the dates of the month "March" fit their column

    Scenario: A month with none is not wider than another
      Given the month "July" is pressed
      Then the month "July" is as wide as the month "October"

  Rule: Sorting one month sorts every open month the same way

    Background:
      Given scripting is on
      And "organiser@example.com" has created the tournament "Beta Open"
      And the tournament "Beta Open" starts on "2026-10-03"
      And "organiser@example.com" has created the tournament "Alpha Open"
      And the tournament "Alpha Open" starts on "2026-10-24"
      And "organiser@example.com" has created the tournament "Delta Open"
      And the tournament "Delta Open" starts on "2026-03-02"
      And "organiser@example.com" has created the tournament "Charlie Open"
      And the tournament "Charlie Open" starts on "2026-03-20"

    Scenario: The month pressed is sorted by the column
      Given the page for 2026 is open
      And the month "October" is pressed
      When the column "Name" of the year's tournaments is pressed
      Then the first tournament of the month "October" is "Alpha Open"
      And the second tournament of the month "October" is "Beta Open"

    Scenario: Another open month is sorted the same way
      Given the page for 2026 is open
      And the month "March" is pressed
      And the month "October" is pressed
      When the column "Name" of the month "October" is pressed
      Then the first tournament of the month "March" is "Charlie Open"
      And the second tournament of the month "March" is "Delta Open"

    Scenario: A month opened afterwards is sorted the same way
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Name" of the year's tournaments is pressed
      When the month "March" is pressed
      Then the first tournament of the month "March" is "Charlie Open"

    Scenario: A closed month is sorted the same way when it is opened again
      Given the page for 2026 is open
      And the month "March" is pressed
      And the month "March" is pressed
      And the month "October" is pressed
      And the column "Name" of the month "October" is pressed
      When the month "March" is pressed
      Then the first tournament of the month "March" is "Charlie Open"

    Scenario: A sorting is remembered when a year's page is next opened
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Name" of the year's tournaments is pressed
      When the page for 2026 is opened
      And the month "October" is pressed
      Then the column "Name" of the year's tournaments is marked as sorted from the smallest

    Scenario: A sorting is remembered when a sport's page is next opened
      Given the page for "ac" in 2026 is open
      And the month "October" is pressed
      And the column "Name" of the sport's tournaments is pressed
      When the page for "ac" in 2026 is opened
      And the month "October" is pressed
      Then the column "Name" of the sport's tournaments is marked as sorted from the smallest

    Scenario: A month opened with a sorting remembered begins sorted by it
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Name" of the year's tournaments is pressed
      And the page for 2026 is open
      When the month "March" is pressed
      Then the first tournament of the month "March" is "Charlie Open"

    Scenario: The usual order is put back in every open month
      Given the page for 2026 is open
      And the month "March" is pressed
      And the month "October" is pressed
      And the column "Name" of the month "October" is pressed
      When the usual order of the month "October" is pressed
      Then the first tournament of the month "March" is "Delta Open"
      And the first tournament of the month "October" is "Beta Open"

    Scenario: The usual order is forgotten when the page is next opened
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Name" of the year's tournaments is pressed
      And the usual order of the month "October" is pressed
      When the page for 2026 is opened
      And the month "October" is pressed
      Then the column "Date" of the year's tournaments is marked as sorted from the smallest

    Scenario: The page is not loaded again to put the usual order back
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Name" of the year's tournaments is pressed
      And the page has been marked
      When the usual order of the month "October" is pressed
      Then the page is the one that was marked

    Scenario: The page is not loaded again to sort
      Given the page for 2026 is open
      And the month "October" is pressed
      And the page has been marked
      When the column "Name" of the year's tournaments is pressed
      Then the page is the one that was marked

  Rule: The months are in the order the tournaments' start dates are

    A month is a stretch of start dates, so the months follow the date column:
    January first while the tournaments are earliest first, and December first
    once they are latest first. Sorting by any other column says nothing about
    dates, and the months stay in the order of the year.

    Background:
      Given scripting is on
      And "organiser@example.com" has created the tournament "Beta Open"
      And the tournament "Beta Open" starts on "2026-10-03"

    Scenario: Earliest first, the months begin with January
      When the page for 2026 is opened
      Then the first month of the year is "January"

    Scenario: Latest first, the months begin with December
      Given the page for 2026 is open
      And the month "October" is pressed
      When the column "Date" of the year's tournaments is pressed
      Then the first month of the year is "December"

    Scenario: Latest first, the months end with January
      Given the page for 2026 is open
      And the month "October" is pressed
      When the column "Date" of the year's tournaments is pressed
      Then the twelfth month of the year is "January"

    Scenario: Sorted by another column, the months begin with January
      Given the page for 2026 is open
      And the month "October" is pressed
      When the column "Name" of the year's tournaments is pressed
      Then the first month of the year is "January"

    Scenario: Putting the usual order back puts January first
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Date" of the year's tournaments is pressed
      When the usual order of the month "October" is pressed
      Then the first month of the year is "January"

    Scenario: A month open stays open when the months are turned round
      Given the page for 2026 is open
      And the month "October" is pressed
      When the column "Date" of the year's tournaments is pressed
      Then the month "October" is open

    Scenario: Latest first is remembered when a year's page is next opened
      Given the page for 2026 is open
      And the month "October" is pressed
      And the column "Date" of the year's tournaments is pressed
      When the page for 2026 is opened
      Then the first month of the year is "December"

    # Turning the months round moves the one the reader pressed from the
    # bottom of the page to the top, or the other way, and it would leave them
    # looking at a different month than the one they sorted.
    Scenario: The month the date sorting was pressed in is at the top of the page
      Given a viewport 1200 pixels wide and 300 pixels tall
      And the page for 2026 is open
      And every month of the year is pressed
      When the column "Date" of the month "October" is pressed
      Then the month "October" is at the top of the page

    Scenario: The month the usual order was pressed in is at the top of the page
      Given a viewport 1200 pixels wide and 300 pixels tall
      And the page for 2026 is open
      And every month of the year is pressed
      And the column "Date" of the month "October" is pressed
      When the usual order of the month "March" is pressed
      Then the month "March" is at the top of the page

    Scenario: A sport's page has its months in the same order
      Given the page for "ac" in 2026 is open
      And the month "October" is pressed
      When the column "Date" of the sport's tournaments is pressed
      Then the first month of the year is "December"

  Rule: A sport's page loads its months in the same way

    Background:
      Given scripting is on

    Scenario: The sport's page lists the twelve months
      When the page for "ac" in 2026 is opened
      Then the year has 12 months

    Scenario: An open month shows only the sport's tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Gate Open"
      And the tournament "Gate Open" starts on "2026-10-11"
      And the tournament "Gate Open" is for the sport "gc"
      And the page for "ac" in 2026 is open
      When the month "October" is pressed
      Then "Spring Open" is in the year's tournaments
      And "Gate Open" is not in the year's tournaments

  Rule: What the reader chose narrows the months

    Background:
      Given scripting is on

    Scenario: An open month shows only the country chosen
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      And the page at "/2026?country=au" is open
      When the month "October" is pressed
      Then "Spring Open" is not in the year's tournaments

  Rule: A reader without scripting is told it is needed

    Scenario: The page says it needs scripting
      When the page for 2026 is opened
      Then the page says the words for "year.needsScripting"

    Scenario: No month is listed without scripting
      When the page for 2026 is opened
      Then the year has 0 months

    Scenario: No way to show every month is there without scripting
      When the page for 2026 is opened
      Then there is no way to show or hide all the months
