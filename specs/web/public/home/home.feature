@browser @postgres
Feature: The home page lists recent results and upcoming tournaments

  The home page is where a reader starts, and what they are nearly always
  after is a tournament being played now or about to be. So it lists two
  things: the recent results, which are the tournaments a game has been added
  to in the last seven days, the most recently played first
  (`RecentResults.feature`); and the upcoming tournaments, which are those
  starting from today to sixty days from today, the soonest first
  (`UpcomingTournaments.feature`). Beneath the upcoming tournaments is the way
  to every tournament this year, for a reader after one further off or long
  finished.

  Each list is a table of up to four columns: the tournament's dates, on a
  tablet or wider the code of its sport, the flag of the country it is played
  in, and its name. The dates are said as the admin
  says them (`tournaments.feature`), the month once where both days are in
  it. The flag is named for a reader who cannot see it by what pressing it
  does, "Only tournaments in New Zealand", with the country it is the flag of
  named in the reader's language. The flags' column has no heading, since a
  flag says what it is, and so it is not sorted by. Nor does the sport's, which
  is the sport's code in capitals on a colour of its own, and which a phone
  leaves out because the room there is wanted for the names. A tablet is
  `40rem` wide, as it is for the navigation (`navigation.feature`). The same
  column is in a year's list (`year.feature`) and a sport's in a year
  (`yearSport.feature`).

  A row leads to the tournament's page, at its year, its sport and its
  name, wherever on the row it is pressed but its flag, since a row is read
  as one thing. The name is a link in its own right, so that a reader moving
  by keyboard or listening is offered one way into each tournament rather
  than two. The tournament's public page does not exist yet, so the row leads
  to an address that answers `404` until the feature that provides it lands.

  A flag is a link of its own, to the lists narrowed to its country, which is
  the quickest way for a reader to see what else is being played there. It
  narrows both lists, as choosing the country in the filter does, and keeps
  how each is sorted and the sport chosen. A region chosen is dropped, since
  the flag is the whole country's.

  A column heading sorts its table by that column. A column the table is not
  sorted by sorts from the smallest up — the earliest dates, A to Z — and
  pressing the column the table is sorted by turns it round. An arrow before the heading
  points up or down to say which way the table is sorted, and the column says
  so in words for a reader who is listening rather than looking. The
  upcoming tournaments begin sorted by date, soonest first, so their dates
  begin marked as sorted from the earliest. The recent results begin in the
  order they were played, which no column shows, so none of their columns
  begins marked. Rows alike in the column sorted by keep the order the list
  began in, so that the order does not change from one visit to the next.

  The two tables are sorted apart from one another, since a reader sorting
  one has said nothing about the other.

  Both lists can be narrowed to a country, to a region of it, and to a sport
  (`TournamentFilter.feature`), together, since a reader looking for
  tournaments near them is looking for both kinds. Regions belong to a
  country, so a region is offered once a country has been chosen, and then
  only that country's, and not at all for a country that is not divided into
  regions. The sports offered are the website's.

  The public pages work with no scripting (`navigation.feature`), and so does
  this one. Sorting is by links and narrowing is by a form, so what was
  chosen is in the page's address: it can be linked to, it survives the page
  being opened again, and the browser's back button undoes it. A region left
  chosen when another country is chosen is dropped rather than refused, since
  the regions offered are still the old country's until the form has been
  sent. Anything else that cannot be a filter is the reader's mistake, and is
  refused as one (`errors.feature`).

  The secondary navigation is the years there are tournaments in, newest
  first (`TournamentYears.feature`), each leading to that year's page, which
  lists its tournaments (`year.feature`). They are fitted to the window as
  the admin's years are (`tournaments.feature`):
  as many of the newest as fit on one row are tabs, and the rest are in a
  drop-down list at the end of the row, named "Earlier years". With no
  scripting the drop-down list is a disclosure of links rather than a list
  to choose from. The home page is not a year, so no year is marked.

  The upcoming tournaments are beneath the recent results at every width,
  since each table now has up to four columns and the room across the page
  is wanted for them. The
  column headings are in the colours of the secondary navigation, every other
  row is on a colour of its own so that a row is followed across, and there
  are no lines between cells (`LAYOUT.md`).

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  is played in the region "can" of the country "nz".

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed

  Rule: The home page is two lists, for anybody

    Scenario: The recent results are headed
      When the home page is opened
      Then the content has the heading "Recent Results"

    Scenario: The upcoming tournaments are headed
      When the home page is opened
      Then the content has the heading "Upcoming Tournaments"

    Scenario: The recent results are first
      When the home page is opened
      Then "Recent Results" comes before "Upcoming Tournaments"

    Scenario: A reader not signed in is shown the lists
      Given nobody is signed in
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the home page is opened
      Then "Spring Open" is in the upcoming tournaments

  Rule: The recent results are the tournaments played in the last seven days

    Background:
      Given the server's clock reads "2026-09-19T10:00:00Z"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-09-20"
      And the tournament "Spring Open" finishes on "2026-10-04"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

    Scenario: A tournament played yesterday is in the recent results
      Given the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then "Spring Open" is in the recent results

    Scenario: A tournament last played more than seven days ago is not in the recent results
      Given the server's clock reads "2026-09-24T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then "Spring Open" is not in the recent results

    Scenario: A tournament whose recent game is archived is not in the recent results
      Given the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then "Spring Open" is not in the recent results

    Scenario: An archived tournament is not in the recent results
      Given the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then "Spring Open" is not in the recent results

    Scenario: The tournament played most recently is first
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-09-28"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And the server's clock reads "2026-09-30T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      And the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then the first of the recent results is "Spring Open"
      And the second of the recent results is "Autumn Open"

    Scenario: A tournament on another website is not in the recent results
      Given a site served as "gateballscores.com"
      And the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then "Spring Open" is not in the recent results

  Rule: The upcoming tournaments are those starting from today to sixty days from today

    Scenario: A tournament starting today is in the upcoming tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-02"
      When the home page is opened
      Then "Spring Open" is in the upcoming tournaments

    Scenario: A tournament starting sixty days from today is in the upcoming tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-12-01"
      When the home page is opened
      Then "Spring Open" is in the upcoming tournaments

    Scenario: A tournament starting sixty-one days from today is not in the upcoming tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-12-02"
      When the home page is opened
      Then "Spring Open" is not in the upcoming tournaments

    Scenario: A tournament that started yesterday is not in the upcoming tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-01"
      And the tournament "Spring Open" finishes on "2026-10-04"
      When the home page is opened
      Then "Spring Open" is not in the upcoming tournaments

    Scenario: An archived tournament is not in the upcoming tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the home page is opened
      Then "Spring Open" is not in the upcoming tournaments

    Scenario: The tournament starting soonest is first
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-11-07"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-10"
      When the home page is opened
      Then the first of the upcoming tournaments is "Autumn Open"
      And the second of the upcoming tournaments is "Spring Open"

    Scenario: A tournament on another website is not in the upcoming tournaments
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the home page is opened
      Then "Spring Open" is not in the upcoming tournaments

  Rule: A list with nothing in it says so

    Scenario: No recent results says so
      When the home page is opened
      Then the recent results say there are none

    Scenario: No upcoming tournaments says so
      When the home page is opened
      Then the upcoming tournaments say there are none

    Scenario: A list with something in it does not say there is nothing
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the home page is opened
      Then the upcoming tournaments do not say there are none

  Rule: Each row says when, what and where

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"

    Scenario Outline: The columns are the dates, the sport, the country and the name
      When the home page is opened
      Then the <place> column of the <list> is "<column>"

      Examples:
        | list                 | place | column |
        | recent results       | first | Date   |
        | recent results       | fourth | Name   |
        | upcoming tournaments | first | Date   |
        | upcoming tournaments | fourth | Name   |

    Scenario Outline: The country's column has no heading
      When the home page is opened
      Then the third column of the <list> has no heading

      Examples:
        | list                 |
        | recent results       |
        | upcoming tournaments |

    Scenario Outline: On a phone the country's column is left out
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-09-30"
      And the tournament "Autumn Open" finishes on "2026-10-01"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then the country's column of the <list> is not shown

      Examples:
        | list                 |
        | recent results       |
        | upcoming tournaments |

    Scenario Outline: On a wide screen the country's column is shown
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-09-30"
      And the tournament "Autumn Open" finishes on "2026-10-01"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then the country's column of the <list> is shown

      Examples:
        | list                 |
        | recent results       |
        | upcoming tournaments |

    Scenario: A tournament is dated from its start to its finish
      When the home page is opened
      Then "Spring Open" is dated "10-12 Oct" in the upcoming tournaments

    Scenario: A tournament over the end of a month says both months
      Given the tournament "Spring Open" starts on "2026-10-30"
      And the tournament "Spring Open" finishes on "2026-11-02"
      When the home page is opened
      Then "Spring Open" is dated "30 Oct-02 Nov" in the upcoming tournaments

    Scenario: The country is shown as its flag
      When the home page is opened
      Then "Spring Open" shows the flag of "nz" in the upcoming tournaments

    Scenario: The flag is named for a screen reader by what pressing it does
      When the home page is opened
      Then the flag of "Spring Open" in the upcoming tournaments is named "Only tournaments in New Zealand"

    Scenario: The month is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the home page is opened
      Then "Spring Open" is dated "10-12 oct" in the upcoming tournaments

    Scenario: The flag is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the home page is opened
      Then the flag of "Spring Open" in the upcoming tournaments is named "Solo torneos de Nueva Zelanda"

  Rule: A tablet or wider shows each tournament's sport

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"

    Scenario: The sport is shown as its code in capitals
      Given a viewport 768 pixels wide
      And the tournament "Spring Open" is for the sport "gc"
      When the home page is opened
      Then "Spring Open" shows the sport "GC" in the upcoming tournaments

    Scenario: The sport is shown at the narrowest a tablet is
      Given a viewport 640 pixels wide
      When the home page is opened
      Then "Spring Open" shows the sport "AC" in the upcoming tournaments

    Scenario: The sport is shown in the recent results as well
      Given a viewport 768 pixels wide
      And the tournament "Spring Open" starts on "2026-09-30"
      And the tournament "Spring Open" finishes on "2026-10-01"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      When the home page is opened
      Then "Spring Open" shows the sport "AC" in the recent results

    Scenario Outline: Each sport is on a colour of its own
      Given a viewport 768 pixels wide
      And the tournament "Spring Open" is for the sport "<sport>"
      When the home page is opened
      Then "Spring Open" shows its sport on <colour> in the upcoming tournaments

      Examples:
        | sport | colour |
        | ac    | green  |
        | gc    | blue   |
        | a6w   | orange |
        | rc    | purple |

    Scenario: Gateball is on teal, on the website that offers it
      Given a viewport 768 pixels wide
      And a site served as "gateballscores.com"
      And "organiser@example.com" has created the tournament "Gateball Open" on the website "gateballscores.com"
      And the tournament "Gateball Open" starts on "2026-10-10"
      And the tournament "Gateball Open" finishes on "2026-10-12"
      When the home page is opened
      Then "Gateball Open" shows its sport on teal in the upcoming tournaments

    Scenario: The sport is left out on a phone
      Given a viewport 375 pixels wide
      When the home page is opened
      Then "Spring Open" does not show its sport in the upcoming tournaments

    Scenario: The sport's column has no heading to press
      Given a viewport 768 pixels wide
      When the home page is opened
      Then the second column of the upcoming tournaments is ""

  Rule: Pressing a column heading sorts the table by it

    Background:
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-11-07"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"

    Scenario: The upcoming tournaments begin sorted by date
      When the home page is opened
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: The upcoming tournaments begin sorted by nothing else
      When the home page is opened
      Then the column "Name" of the upcoming tournaments is not marked as sorted

    Scenario: A column not sorted by sorts from the smallest
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the first of the upcoming tournaments is "Autumn Open"
      And the second of the upcoming tournaments is "Spring Open"

    Scenario: A column pressed is marked as sorted from the smallest
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: The country's column cannot be pressed to sort by it
      When the home page is opened
      Then the third column of the upcoming tournaments cannot be pressed

    Scenario: The column sorted by is turned round when pressed
      Given the home page is open
      When the column "Date" of the upcoming tournaments is pressed
      Then the first of the upcoming tournaments is "Autumn Open"
      And the second of the upcoming tournaments is "Spring Open"

    Scenario: A column turned round is marked as sorted from the largest
      Given the home page is open
      When the column "Date" of the upcoming tournaments is pressed
      Then the column "Date" of the upcoming tournaments is marked as sorted from the largest

    Scenario: A column pressed twice is turned round
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the column "Name" of the upcoming tournaments is pressed
      Then the first of the upcoming tournaments is "Spring Open"
      And the second of the upcoming tournaments is "Autumn Open"

    Scenario: A column pressed three times is turned back
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      And the column "Name" of the upcoming tournaments is pressed
      When the column "Name" of the upcoming tournaments is pressed
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: The column sorted by before is no longer marked
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the column "Date" of the upcoming tournaments is not marked as sorted

    Scenario: Sorting from the smallest is shown by an arrow pointing up
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the heading "Name" of the upcoming tournaments begins with an arrow pointing up

    Scenario: Sorting from the largest is shown by an arrow pointing down
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the column "Name" of the upcoming tournaments is pressed
      Then the heading "Name" of the upcoming tournaments begins with an arrow pointing down

    Scenario: A column not sorted by has no arrow
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the heading "Date" of the upcoming tournaments has no arrow

    Scenario: Sorting from the smallest is said to a screen reader
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the column "Name" of the upcoming tournaments is announced as sorted ascending

    Scenario: Sorting from the largest is said to a screen reader
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the column "Name" of the upcoming tournaments is pressed
      Then the column "Name" of the upcoming tournaments is announced as sorted descending

    Scenario: Rows alike in the column sorted by keep the order the list began in
      Given "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-10"
      And the home page is open
      When the column "Date" of the upcoming tournaments is pressed
      Then the second of the upcoming tournaments is "Spring Open"
      And the third of the upcoming tournaments is "Summer Open"

    Scenario: A table sorted stays sorted when the page is opened again at its address
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the page is opened again at its address
      Then the first of the upcoming tournaments is "Autumn Open"

    Scenario: Going back undoes the sorting
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the browser goes back
      Then the first of the upcoming tournaments is "Spring Open"

  Rule: The recent results sort as the upcoming tournaments do, and apart from them

    Background:
      Given the server's clock reads "2026-09-19T10:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-09-28"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the player "Alex Another" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Autumn Open"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-09-26"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And the server's clock reads "2026-09-30T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Autumn Open"
      And the server's clock reads "2026-10-01T10:00:00Z"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the server's clock reads "2026-10-02T10:00:00Z"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-11-07"
      And "organiser@example.com" has created the tournament "Winter Open"
      And the tournament "Winter Open" starts on "2026-10-10"

    Scenario: The recent results begin marked as sorted by no column
      When the home page is opened
      Then no column of the recent results is marked as sorted

    Scenario: A column of the recent results sorts them
      Given the home page is open
      When the column "Name" of the recent results is pressed
      Then the first of the recent results is "Autumn Open"
      And the second of the recent results is "Spring Open"

    Scenario: The dates of the recent results sort from the earliest when first pressed
      Given the home page is open
      When the column "Date" of the recent results is pressed
      Then the column "Date" of the recent results is marked as sorted from the smallest

    Scenario: Sorting the recent results leaves the upcoming tournaments as they were
      Given the home page is open
      When the column "Name" of the recent results is pressed
      Then the first of the upcoming tournaments is "Winter Open"

    Scenario: Sorting the upcoming tournaments leaves the recent results as they were
      Given the home page is open
      When the column "Name" of the upcoming tournaments is pressed
      Then the first of the recent results is "Spring Open"

    Scenario: Each table keeps its own sorting
      Given the home page is open
      And the column "Name" of the recent results is pressed
      When the column "Name" of the upcoming tournaments is pressed
      Then the first of the recent results is "Autumn Open"

  Rule: Pressing anywhere on a row but its flag leads to the tournament

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is for the sport "gc"

    Scenario Outline: Each part of a row leads to the tournament
      Given the home page is open
      When the <part> of "Spring Open" in the upcoming tournaments is pressed
      Then the address is "/2026/gc/spring-open"

      Examples:
        | part |
        | date |
        | name |

    Scenario: The name is a link
      When the home page is opened
      Then the name of "Spring Open" in the upcoming tournaments is a link

    Scenario: The row offers a link to the tournament and one to its country
      When the home page is opened
      Then the row of "Spring Open" in the upcoming tournaments holds 2 links

    Scenario: A row of the recent results leads to the tournament
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the home page is open
      When the date of "Spring Open" in the recent results is pressed
      Then the address is "/2026/gc/spring-open"

    Scenario: A row can be pressed with a thumb
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the row of "Spring Open" in the upcoming tournaments is at least 44 pixels tall

  Rule: Both lists are narrowed by country, region and sport

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the tournament "Spring Open" is for the sport "ac"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "nz"
      And the tournament "Autumn Open" is played in the region "auc"
      And the tournament "Autumn Open" is for the sport "gc"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"
      And the tournament "Summer Open" is for the sport "ac"

    Scenario: Nothing is filtered by to begin with
      When the home page is opened
      Then 3 upcoming tournaments are listed

    Scenario: A country chosen lists its tournaments
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Spring Open" is in the upcoming tournaments

    Scenario: A country's code in capitals is the country as its code is
      When the home page is opened for the country "NZ"
      Then "Spring Open" is in the upcoming tournaments
      And "Summer Open" is not in the upcoming tournaments

    Scenario: A country chosen does not list another country's tournaments
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Summer Open" is not in the upcoming tournaments

    Scenario: A region chosen does not list another region's tournaments
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then "Autumn Open" is not in the upcoming tournaments

    Scenario: A region chosen lists its tournaments
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then "Spring Open" is in the upcoming tournaments

    Scenario: A sport chosen does not list another sport's tournaments
      Given the home page is open
      And "Golf Croquet" is chosen as the sport
      When "Filter" is pressed
      Then "Spring Open" is not in the upcoming tournaments

    Scenario: A sport chosen lists its tournaments
      Given the home page is open
      And "Golf Croquet" is chosen as the sport
      When "Filter" is pressed
      Then "Autumn Open" is in the upcoming tournaments

    Scenario: A country and a sport chosen together narrow by both
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "Association Croquet" is chosen as the sport
      When "Filter" is pressed
      Then 1 upcoming tournament is listed

    Scenario: The recent results are narrowed as well
      Given "organiser@example.com" has added the player "Sam Someone" to "Summer Open"
      And "organiser@example.com" has added the player "Alex Another" to "Summer Open"
      And "organiser@example.com" has added the block "Block A" to "Summer Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Summer Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Summer Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Summer Open"
      And the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Summer Open" is not in the recent results

    Scenario: What was chosen is still chosen
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the country chosen is "New Zealand"

    Scenario: A filter chosen stays chosen when the page is opened again at its address
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      When the page is opened again at its address
      Then "Summer Open" is not in the upcoming tournaments

    Scenario: Sorting keeps the filter
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      When the column "Name" of the upcoming tournaments is pressed
      Then "Summer Open" is not in the upcoming tournaments

    Scenario: Filtering keeps the sorting
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the first of the upcoming tournaments is "Autumn Open"

    Scenario: The countries offered are in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      When the home page is opened
      Then "Nueva Zelanda" is offered as a country

    Scenario: The sports offered are the website's
      When the home page is opened
      Then "Golf Croquet" is offered as a sport

    Scenario: A sport another website plays is not offered
      When the home page is opened
      Then "Gateball" is not offered as a sport

  Rule: The countries are offered the ones most played in first

    The groups and their order are `countryOrder.feature`'s. No line is drawn
    between them, since the suggestions of a field have no place for one.

    Scenario Outline: The countries most played in are offered first
      When the home page is opened
      Then the <which> country offered is "<country>"

      Examples:
        | which  | country       |
        | first  | Australia     |
        | second | Egypt         |
        | third  | England       |
        | fourth | New Zealand   |
        | fifth  | Spain         |
        | sixth  | United States |
        | seventh| Austria       |

  Rule: Pressing a flag narrows the lists to its country

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the tournament "Spring Open" is for the sport "ac"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And the tournament "Autumn Open" is played in the country "nz"
      And the tournament "Autumn Open" is played in the region "auc"
      And the tournament "Autumn Open" is for the sport "gc"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"
      And the tournament "Summer Open" is for the sport "ac"

    Scenario: A flag pressed lists its country's tournaments
      Given the home page is open
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then "Autumn Open" is in the upcoming tournaments

    Scenario: A flag pressed does not list another country's tournaments
      Given the home page is open
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then "Summer Open" is not in the upcoming tournaments

    Scenario: A flag pressed chooses its country in the filter
      Given the home page is open
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then the country chosen is "New Zealand"

    Scenario: A flag pressed stays on the home page
      Given the home page is open
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then the address is "/"

    Scenario: A flag pressed narrows the recent results as well
      Given "organiser@example.com" has added the player "Sam Someone" to "Summer Open"
      And "organiser@example.com" has added the player "Alex Another" to "Summer Open"
      And "organiser@example.com" has added the block "Block A" to "Summer Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Summer Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Summer Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Summer Open"
      And the home page is open
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then "Summer Open" is not in the recent results

    Scenario: A flag pressed keeps the sorting
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then the first of the upcoming tournaments is "Autumn Open"

    Scenario: A flag pressed keeps the sport chosen
      Given the home page is open
      And "Association Croquet" is chosen as the sport
      And "Filter" is pressed
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then "Autumn Open" is not in the upcoming tournaments

    Scenario: A flag pressed drops a region chosen
      Given the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      And "Filter" is pressed
      When the flag of "Spring Open" in the upcoming tournaments is pressed
      Then "Autumn Open" is in the upcoming tournaments

  Rule: A region is offered once a country divided into regions is chosen

    Scenario: No region is offered before a country is chosen
      When the home page is opened
      Then no region is offered

    Scenario: The regions of the country chosen are offered
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Canterbury" is offered as a region

    Scenario: The regions of another country are not offered
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then "Victoria" is not offered as a region

    Scenario: A country not divided into regions offers no region
      Given the home page is open
      And "Malta" is chosen as the country
      When "Filter" is pressed
      Then no region is offered

    Scenario: A region left chosen when another country is chosen is dropped
      Given "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"
      And the tournament "Summer Open" is played in the country "au"
      And the tournament "Summer Open" is played in the region "vic"
      And the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      And "Filter" is pressed
      And "Australia" is chosen as the country
      When "Filter" is pressed
      Then "Summer Open" is in the upcoming tournaments

  Rule: A region chosen with few tournaments to show says why

    Tournaments from before November 2026 have no region, so a region narrows
    a list to far fewer than the reader may expect, and the page says so rather
    than leaving them to think tournaments are missing.

    Scenario: A region chosen with fewer than 20 tournaments shows the notice
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" is played in the country "nz"
      And the tournament "Spring Open" is played in the region "can"
      And the home page is open
      And "New Zealand" is chosen as the country
      And "Filter" is pressed
      And "Canterbury" is chosen as the region
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is shown

    Scenario: A country chosen without a region shows no notice
      Given the home page is open
      And "New Zealand" is chosen as the country
      When "Filter" is pressed
      Then the notice about tournaments before November 2026 is not shown

  Rule: A filter that cannot be is the reader's mistake

    Scenario: A country there is not is refused
      When the home page is opened for the country "xx"
      Then the page is refused with "RecentResults.NoSuchCountry"

    Scenario: A sport the website does not offer is refused
      When the home page is opened for the sport "gb"
      Then the page is refused with "TournamentFilter.SportNotOffered"

  Rule: Every tournament this year is offered beneath the upcoming tournaments

    Scenario: This year's tournaments are offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the home page is opened
      Then the upcoming tournaments are followed by "All tournaments in 2026"

    Scenario: This year's tournaments are at this year's address
      Given the home page is open
      When "All tournaments in 2026" is pressed
      Then the address is "/2026"

    Scenario: This year is the year by the server's clock
      Given the server's clock reads "2027-01-01T00:30:00Z"
      When the home page is opened
      Then the upcoming tournaments are followed by "All tournaments in 2027"

    Scenario: This year's tournaments are offered when nothing is upcoming
      When the home page is opened
      Then the upcoming tournaments are followed by "All tournaments in 2026"

  Rule: The years with tournaments are the secondary navigation, newest first

    Scenario: A year with a tournament in it is offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the home page is opened
      Then the year 2024 is offered

    Scenario: A year with no tournament in it is not offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the home page is opened
      Then the year 2026 is not offered

    Scenario: A year of archived tournaments alone is not offered
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the home page is opened
      Then the year 2024 is not offered

    Scenario: A year of another website's tournaments alone is not offered
      Given "organiser@example.com" has created the tournament "Spring Open" on the website "gateballscores.com"
      And the tournament "Spring Open" starts on "2024-10-03"
      When the home page is opened
      Then the year 2024 is not offered

    Scenario: The years are offered newest first
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2027-03-06"
      When the home page is opened
      Then the first year offered is 2027
      And the second year offered is 2024

    Scenario: A year leads to its tournaments
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2024-10-03"
      And the home page is open
      When the year 2024 is pressed
      Then the address is "/2024"

    Scenario: No year is marked on the home page
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-03"
      When the home page is opened
      Then no year is marked as chosen

    Scenario: A website with no tournaments has no secondary navigation
      When the home page is opened
      Then no section bar is shown

  Rule: The years fit the width of the window

    Scenario: A few years on a phone are all tabs
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the home page is opened
      Then every year offered is a tab

    Scenario: A few years on a phone need no drop-down list
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2025-10-03"
      When the home page is opened
      Then no drop-down list of years is offered

    Scenario: Many years on a phone keep the newest as a tab
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the year 2026 is a tab

    Scenario: Many years on a phone put the oldest in the drop-down list
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the year 2015 is in the drop-down list

    Scenario: A year that is a tab is not in the drop-down list as well
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the year 2026 is not in the drop-down list

    Scenario: The tabs and the drop-down list keep to one row
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the years take one row of the bar

    Scenario: Many years on a wide screen are all tabs
      Given "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then every year offered is a tab

    Scenario: The drop-down list opens with no scripting
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      And the home page is open
      When the drop-down list of years is pressed
      Then the year 2015 is visible

    Scenario: A year in the drop-down list leads to its tournaments
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      And the home page is open
      And the drop-down list of years is pressed
      When the year 2015 is pressed
      Then the address is "/2015"

    Scenario: The drop-down list is named
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the drop-down list is named "Earlier years"

    Scenario: The drop-down list can be pressed with a thumb
      Given a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the drop-down list is at least 44 pixels tall

  Rule: The upcoming tournaments are beneath the recent results at every width

    Background:
      Given "organiser@example.com" has created the tournament "The Northern Counties Invitation Golf Croquet Championship"
      And the tournament "The Northern Counties Invitation Golf Croquet Championship" starts on "2026-10-10"

    Scenario: On a wide screen the upcoming tournaments are beneath the recent results
      Given a viewport 1280 pixels wide
      When the home page is opened
      Then the upcoming tournaments are below the recent results

    Scenario: On a phone the upcoming tournaments are beneath the recent results too
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the upcoming tournaments are below the recent results

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the page is no wider than the window

    Scenario: On a phone a long name is not cut short
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the name "The Northern Counties Invitation Golf Croquet Championship" is shown whole

  Rule: The tables are drawn as the secondary navigation is, with rows told apart by colour

    Background:
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-10-17"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the tournament "Summer Open" starts on "2026-10-24"

    Scenario: The column headings are on the secondary navigation's colour
      When the home page is opened
      Then the column headings of the upcoming tournaments are on the colour the secondary navigation is on

    Scenario: The column headings are in the secondary navigation's words' colour
      When the home page is opened
      Then the column headings of the upcoming tournaments are in the colour the secondary navigation's words are in

    Scenario: The second row is on a colour of its own
      When the home page is opened
      Then the second of the upcoming tournaments is not on the colour the first is on

    Scenario: The third row is on the colour of the first
      When the home page is opened
      Then the third of the upcoming tournaments is on the colour the first is on

    Scenario: There are no lines between the cells
      When the home page is opened
      Then the upcoming tournaments have no lines between their cells

    Scenario: The column headings are on the secondary navigation's colour in dark
      Given a machine that prefers dark
      When the home page is opened
      Then the column headings of the upcoming tournaments are on the colour the secondary navigation is on

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: a tournament's name, which is what its manager called it, its
    dates, whose months are named in the reader's language but whose days are
    numbers, and the years, which are numbers.

    Scenario: The lists are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament "Spring Open" starts on "2026-10-10"
      When the home page is opened
      Then every word in the page's content but the tournaments' own is in the test locale

    Scenario: Lists with nothing in them say so in the reader's language
      Given a browser that asks for "en-XA"
      When the home page is opened
      Then every word in the page's content but the tournaments' own is in the test locale

    Scenario: The filter is in the reader's language once a country is chosen
      Given a browser that asks for "en-XA"
      When the home page is opened for the country "nz"
      Then every word in the page's content but the tournaments' own is in the test locale

    Scenario: The drop-down list of years is named in the reader's language
      Given a browser that asks for "en-XA"
      And a viewport 375 pixels wide
      And "organiser@example.com" manages a tournament in each year from 2015 to 2026
      When the home page is opened
      Then the drop-down list of years is named in the test locale
