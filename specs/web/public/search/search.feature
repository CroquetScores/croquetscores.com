@browser @postgres
Feature: A reader searches the website for tournaments, players and competitions

  Every page of the public site has a search in its header, a magnifying glass
  that opens a text field, so that a reader who knows a name need
  not find where it is kept. Pressing the glass again asks the site for what the
  words typed are found in (`Search.feature`) and opens the results at
  "/search", with what was typed in the address, as "/search?q=spring open". It
  is a form of the page's own that is sent as any is, and needs no scripting,
  as the rest of the public site does not.

  The results are three lists, each under a heading of its own: "Tournaments",
  "Competitions" and "Players", in that order, since a tournament and what is
  in it are what a reader is most often after, and there are most players. A list with nothing in it is left out, with
  its heading, so that a reader is not shown headings with nothing under them.
  A tournament is shown by its name and leads to its page. A player is shown
  by their world ranking name and leads to their page at
  "/players/sam-someone" (`websitePlayer.feature`), once, however many
  tournaments they have played in. A competition is shown by its name with the
  name of its tournament beside it, and leads to the competition's page. Each
  list is in alphabetical order and has at most 100. The tournaments and the
  competitions are then shown oldest first.

  The tournaments and the competitions are tables, as the lists on the home
  page are (`home.feature`): the days they run, the sport, the flag of the country they
  are played in, and the name, which a reader can sort by. A competition has no
  days or country of its own, and is shown with its tournament's.

  Between the days and the flag is the tournament's sport, as the home page
  shows it: the sport's code in capitals on a colour of its own, left out on a
  phone, with no heading, since it is not sorted by. A competition is shown
  with its tournament's sport.

  Nothing found says so, in one line where the lists would be. Nothing typed,
  or nothing but spaces, is not a search: the page shows its box and nothing
  else, and says nothing was found of nothing. What was typed is put back in
  the box, so that a reader who found too much can add a word.

  A reader who is on the page of players has a search of players alone beside
  the players, which finds players and nothing else (`websitePlayers.feature`);
  this one is the site's and finds all three.

  Where there are more than a hundred of a kind the hundred are shown, and
  beneath them, after the end of that list, the page says there are more and
  to refine the search, so that a reader is not left to take a hundred for
  everything there is. It is said of the list that was cut and not of the
  others, and not where there are exactly a hundred.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  its players represent nothing and fly no flag.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: Every page has a search box in its header

    Scenario Outline: A page of the site has a search box
      When the page at "<address>" is opened
      Then the header has a search box

      Examples:
        | address                                  |
        | /                                        |
        | /2026/ac/spring-open                     |
        | /2026/ac/spring-open/players             |
        | /players                                 |
        | /search                                  |
        | /account/sign-in                         |

    Scenario: The search box is called Search
      When the page at "/" is opened
      Then the header's search box is called "Search"

  Rule: The header shows a magnifying glass, which opens the search box

    The header carries a magnifying glass where it carried a text field and
    a button called "Search". Pressing it opens the field, with the cursor in
    it. Pressing it again searches for what was typed. A reader who opened the
    field and typed nothing, then pressed it again, has changed their mind,
    and the field closes rather than asking for a search of nothing. The
    glass is called "Search" for a reader who cannot see it.

    The glass is the first thing in the navigation's menu: before the links, on
    their line, where they are inline in the header, and at the top of what the
    menu button opens, where they are behind it.

    Without scripting there is nothing to open the field, so the field is
    shown beside the glass and pressing the glass searches, as the button did.
    A page that is the answer to a search shows its field open, holding what
    was typed, so that a reader who found too much can add a word.

    Scenario: The header shows a magnifying glass and no search box
      Given a browser that runs scripts
      When the page at "/" is opened
      Then the header shows a magnifying glass
      And the header's search box is not shown

    Scenario: On a wide screen the magnifying glass is before the navigation, on its line
      Given a viewport 1200 pixels wide
      When the page at "/" is opened
      Then the header's magnifying glass is before the link "Home" on the same line

    Scenario: On a phone the magnifying glass is behind the menu button
      Given a viewport 375 pixels wide
      When the page at "/" is opened
      Then the header shows no magnifying glass

    Scenario: On a phone pressing the menu button shows the magnifying glass
      Given a viewport 375 pixels wide
      And the page at "/" is open
      When the menu button is pressed
      Then the header shows a magnifying glass

    Scenario: The magnifying glass is called Search
      When the page at "/" is opened
      Then the header's magnifying glass is called "Search"

    Scenario: Pressing the magnifying glass shows the search box
      Given a browser that runs scripts
      And the page at "/" is opened
      When the header's magnifying glass is pressed
      Then the header's search box is shown

    Scenario: The cursor is in the search box when it is shown
      Given a browser that runs scripts
      And the page at "/" is opened
      When the header's magnifying glass is pressed
      Then the cursor is in the header's search box

    Scenario: Pressing the magnifying glass with something typed searches
      Given a browser that runs scripts
      And the page at "/" is opened
      And the header's magnifying glass is pressed
      And "spring" is typed as the header's search box
      When the header's magnifying glass is pressed
      Then the address is "/search"
      And the address asks for "spring"

    Scenario: Pressing Enter in the search box searches
      Given a browser that runs scripts
      And the page at "/" is opened
      And the header's magnifying glass is pressed
      And "spring" is typed as the header's search box
      When Enter is pressed in the header's search box
      Then the address is "/search"
      And the address asks for "spring"

    Scenario: Pressing the magnifying glass with nothing typed closes the search box
      Given a browser that runs scripts
      And the page at "/" is opened
      And the header's magnifying glass is pressed
      When the header's magnifying glass is pressed
      Then the header's search box is not shown

    Scenario: Pressing the magnifying glass with nothing typed does not leave the page
      Given a browser that runs scripts
      And the page at "/" is opened
      And the header's magnifying glass is pressed
      When the header's magnifying glass is pressed
      Then the address is "/"

    Scenario: Pressing the magnifying glass with only spaces typed closes the search box and empties it
      Given a browser that runs scripts
      And the page at "/" is opened
      And the header's magnifying glass is pressed
      And "   " is typed as the header's search box
      When the header's magnifying glass is pressed
      Then the header's search box is not shown
      And the header's search box is empty

    Scenario: Pressing Enter with nothing typed leaves the search box open
      Given a browser that runs scripts
      And the page at "/" is opened
      And the header's magnifying glass is pressed
      When Enter is pressed in the header's search box
      Then the header's search box is shown

    Scenario: Without scripting the search box is shown beside the magnifying glass
      When the page at "/" is opened with scripting off
      Then the header's search box is shown

    Scenario: A search is made without scripting
      Given the page at "/" is opened with scripting off
      And "spring" is typed as the header's search box
      When the header's magnifying glass is pressed
      Then the address is "/search"
      And the address asks for "spring"

    Scenario: The results page shows the search box open
      When the page at "/search?q=spring" is opened
      Then the header's search box is shown

  Rule: The page names itself in the header, beneath the site's name

    As a tournament's pages name it there (`layout.feature`), and not in the
    content, which begins with what was found.

    Scenario: The header names the page
      When the page at "/search" is opened
      Then the header names the page "Search"

    Scenario: The content does not begin with the page's name
      When the page at "/search?q=spring" is opened
      Then the page's content has no main heading

  Rule: What was typed is found, in three lists

    Scenario: A tournament is found
      When the page at "/search?q=spring" is opened
      Then "Spring Open" is among the tournaments in the results

    Scenario: A player is found
      When the page at "/search?q=someone" is opened
      Then "Sam Someone" is among the players in the results

    Scenario: A competition is found
      When the page at "/search?q=block" is opened
      Then "Block A" is among the competitions in the results

    Scenario: A competition is shown with its tournament beside it
      When the page at "/search?q=block" is opened
      Then the competition "Block A" is shown with the tournament "Spring Open"

    Scenario: A search is made from the header
      Given a browser that runs scripts
      And the page at "/" is opened
      And "spring" is typed as the header's search box
      When the header's magnifying glass is pressed
      Then "Spring Open" is among the tournaments in the results

    Scenario: A search is made from the results page
      Given a browser that runs scripts
      And the page at "/search" is opened
      And "someone" is typed as the header's search box
      When the header's magnifying glass is pressed
      Then "Sam Someone" is among the players in the results

    Scenario: A search is made by words in another order
      When the page at "/search?q=open spring" is opened
      Then "Spring Open" is among the tournaments in the results

    Scenario: A search is made without the accents
      Given "organiser@example.com" has added the player "José García" to "Spring Open"
      When the page at "/search?q=jose garcia" is opened
      Then "José García" is among the players in the results

  Rule: The tournaments and the competitions say when and where they are

    Scenario Outline: The columns are the dates, the sport, the country and the name
      When the page at "/search?q=spring" is opened
      Then the <place> column of the found tournaments is "<column>"

      Examples:
        | place  | column |
        | first  | Date   |
        | fourth | Name   |

    Scenario: The sport's column has no heading
      When the page at "/search?q=spring" is opened
      Then the second column of the found tournaments has no heading

    Scenario: The country's column has no heading
      When the page at "/search?q=spring" is opened
      Then the third column of the found tournaments has no heading

    Scenario: A tournament is dated from its start to its finish
      Given the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" is dated "10-12 Oct 2026" in the found tournaments

    Scenario: The dates are as wide as they need to be and no wider
      When the page at "/search?q=spring" is opened
      Then the dates of the found tournaments are on one line

    Scenario: On a phone the country's column is left out
      Given a viewport 375 pixels wide
      When the page at "/search?q=spring" is opened
      Then the country's column of the found tournaments is not shown

    Scenario: On a wide screen the country's column is shown
      When the page at "/search?q=spring" is opened
      Then the country's column of the found tournaments is shown

    Scenario: A tournament shows the flag of its country
      Given the tournament "Spring Open" is played in the country "nz"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" shows the flag of "nz" in the found tournaments

    Scenario: The flag is named for a screen reader by its country
      Given the tournament "Spring Open" is played in the country "nz"
      When the page at "/search?q=spring" is opened
      Then the flag of "Spring Open" in the found tournaments says "New Zealand"

    Scenario: The competitions have the same columns
      When the page at "/search?q=block" is opened
      Then the fourth column of the found competitions is "Name"

    Scenario: A competition is dated as its tournament is
      Given the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      When the page at "/search?q=block" is opened
      Then "Block A" is dated "10-12 Oct 2026" in the found competitions

    Scenario: A competition shows the flag of its tournament's country
      Given the tournament "Spring Open" is played in the country "nz"
      When the page at "/search?q=block" is opened
      Then "Block A" shows the flag of "nz" in the found competitions

    Scenario: The month is named in the reader's language
      Given a site offering the languages it is served with
      And a browser that asks for "es"
      And the tournament "Spring Open" starts on "2026-10-10"
      And the tournament "Spring Open" finishes on "2026-10-12"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" is dated "10-12 oct 2026" in the found tournaments

  Rule: The tournaments and the competitions show their sport

    Scenario: A tournament shows its sport as its code in capitals
      Given a viewport 768 pixels wide
      And the tournament "Spring Open" is for the sport "gc"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" shows the sport "GC" in the found tournaments

    Scenario: A competition shows the sport of its tournament
      Given a viewport 768 pixels wide
      And the tournament "Spring Open" is for the sport "gc"
      When the page at "/search?q=block" is opened
      Then "Block A" shows the sport "GC" in the found competitions

    Scenario: The sport is on a colour of its own
      Given a viewport 768 pixels wide
      And the tournament "Spring Open" is for the sport "gc"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" shows its sport on blue in the found tournaments

    Scenario: The sport is left out on a phone
      Given a viewport 375 pixels wide
      When the page at "/search?q=spring" is opened
      Then "Spring Open" does not show its sport in the found tournaments

  Rule: Pressing the date or the name sorts a table by it

    Each table is sorted apart from the other, by the column pressed, from the
    smallest first, and the other way when it is pressed again, as the lists on
    the home page are. A competition is sorted by the days of its tournament.
    How a table is sorted is in the address beside what was typed, so that a
    sorted page can be linked to. Until a column is pressed both tables are
    sorted by their dates from the oldest to the newest, which a reader looking
    for a tournament by when it was reads in.

    Background:
      Given the tournament "Spring Open" starts on "2026-10-10"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the tournament "Autumn Open" starts on "2026-11-07"
      And "organiser@example.com" has added the block "Alpha Block" to "Autumn Open"

    Scenario: The tournaments begin with the oldest
      When the page at "/search?q=open" is opened
      Then the first of the found tournaments is "Spring Open"
      And the second of the found tournaments is "Autumn Open"

    Scenario: The tournaments begin marked as sorted by date from the smallest
      When the page at "/search?q=open" is opened
      Then the column "Date" of the found tournaments is marked as sorted from the smallest

    Scenario: The tournaments begin sorted by nothing else
      When the page at "/search?q=open" is opened
      Then the column "Name" of the found tournaments is not marked as sorted

    Scenario: The competitions begin with the oldest
      When the page at "/search?q=block" is opened
      Then the first of the found competitions is "Block A"
      And the second of the found competitions is "Alpha Block"

    Scenario: The competitions begin marked as sorted by date from the smallest
      When the page at "/search?q=block" is opened
      Then the column "Date" of the found competitions is marked as sorted from the smallest

    Scenario: Pressing the date turns it round, to the newest first
      Given the page at "/search?q=open" is open
      When the column "Date" of the found tournaments is pressed
      Then the first of the found tournaments is "Autumn Open"
      And the column "Date" of the found tournaments is marked as sorted from the largest

    Scenario: Pressing the date twice turns it back
      Given the page at "/search?q=open" is open
      And the column "Date" of the found tournaments is pressed
      When the column "Date" of the found tournaments is pressed
      Then the first of the found tournaments is "Spring Open"

    Scenario: Pressing the name sorts the tournaments from A
      Given the page at "/search?q=open" is open
      When the column "Name" of the found tournaments is pressed
      Then the first of the found tournaments is "Autumn Open"
      And the column "Name" of the found tournaments is marked as sorted from the smallest

    Scenario: Pressing the name twice sorts the tournaments from Z
      Given the page at "/search?q=open" is open
      And the column "Name" of the found tournaments is pressed
      When the column "Name" of the found tournaments is pressed
      Then the first of the found tournaments is "Spring Open"

    Scenario: The column sorted by before is no longer marked
      Given the page at "/search?q=open" is open
      When the column "Name" of the found tournaments is pressed
      Then the column "Date" of the found tournaments is not marked as sorted

    Scenario: The sport's column cannot be pressed
      When the page at "/search?q=open" is opened
      Then the second column of the found tournaments cannot be pressed

    Scenario: The country's column cannot be pressed
      When the page at "/search?q=open" is opened
      Then the third column of the found tournaments cannot be pressed

    Scenario: Sorting is shown by an arrow
      Given the page at "/search?q=open" is open
      When the column "Name" of the found tournaments is pressed
      Then the heading "Name" of the found tournaments begins with an arrow pointing up

    Scenario: Pressing a column keeps what was typed in the address
      Given the page at "/search?q=open" is open
      When the column "Name" of the found tournaments is pressed
      Then the address asks for "open"

    Scenario: Pressing a column keeps what was typed in the box
      Given the page at "/search?q=open" is open
      When the column "Name" of the found tournaments is pressed
      Then the header's search box says "open"

    Scenario: A table sorted stays sorted when the page is opened again at its address
      Given the page at "/search?q=open" is open
      And the column "Name" of the found tournaments is pressed
      When the page is opened again at its address
      Then the first of the found tournaments is "Autumn Open"

    Scenario: A sorting that is not one is the sorting it begins with
      When the page at "/search?q=open&tournaments=sideways" is opened
      Then the first of the found tournaments is "Spring Open"

    Scenario: Competitions of one tournament are in alphabetical order by date
      Given "organiser@example.com" has added the block "Zulu Block" to "Spring Open"
      And "organiser@example.com" has added the block "Beta Block" to "Spring Open"
      When the page at "/search?q=block" is opened
      Then the first of the found competitions is "Beta Block"
      And the second of the found competitions is "Block A"
      And the third of the found competitions is "Zulu Block"

    Scenario: Pressing the name sorts the competitions by their names
      Given the page at "/search?q=block" is open
      When the column "Name" of the found competitions is pressed
      Then the first of the found competitions is "Alpha Block"

    Scenario: Pressing the date sorts the competitions from the newest
      Given the page at "/search?q=block" is open
      When the column "Date" of the found competitions is pressed
      Then the first of the found competitions is "Alpha Block"

    Scenario: Sorting the competitions leaves the tournaments as they were
      Given the page at "/search?q=o" is open
      When the column "Name" of the found competitions is pressed
      Then the column "Date" of the found tournaments is marked as sorted from the smallest

    Scenario: Sorting the tournaments leaves the competitions as they were
      Given the page at "/search?q=o" is open
      When the column "Name" of the found tournaments is pressed
      Then the column "Date" of the found competitions is marked as sorted from the smallest

    Scenario: Sorting the tournaments keeps the competitions sorted
      Given the page at "/search?q=o" is open
      And the column "Name" of the found competitions is pressed
      When the column "Name" of the found tournaments is pressed
      Then the column "Name" of the found competitions is marked as sorted from the smallest

  Rule: The players are listed in alphabetical order

    Scenario: A name that begins with what was typed is not put first
      Given "organiser@example.com" has added the player "Someone Else" to "Spring Open"
      And "organiser@example.com" has added the player "Alan Someone" to "Spring Open"
      When the page at "/search?q=someone" is opened
      Then the first player found is "Alan Someone"
      And the second player found is "Sam Someone"
      And the third player found is "Someone Else"

  Rule: Each list has a heading, and is left out when it has nothing in it

    Scenario: The competitions are before the players
      When the page at "/search?q=o" is opened
      Then the competitions found are before the players found

    Scenario: The tournaments have a heading of their own
      When the page at "/search?q=spring" is opened
      Then the content has the heading "Tournaments"

    Scenario: The players have a heading of their own
      When the page at "/search?q=someone" is opened
      Then the content has the heading "Players"

    Scenario: The competitions have a heading of their own
      When the page at "/search?q=block" is opened
      Then the content has the heading "Competitions"

    Scenario: A list with nothing in it has no heading
      When the page at "/search?q=spring" is opened
      Then the content has no heading "Players"

    Scenario: Nothing found says so
      When the page at "/search?q=zzzz" is opened
      Then the search page says nothing was found

    Scenario: Something found does not say nothing was found
      When the page at "/search?q=spring" is opened
      Then the search page does not say nothing was found

    Scenario: Nothing found has no headings
      When the page at "/search?q=zzzz" is opened
      Then the content has no heading "Tournaments"

  Rule: A list of more than a hundred says so, after its end

    Scenario: More than 100 tournaments says there are more
      Given 101 tournaments are called "Big Cup" followed by a number
      When the page at "/search?q=cup" is opened
      Then the tournaments found say there are more

    Scenario: The blurb is after the last tournament
      Given 101 tournaments are called "Big Cup" followed by a number
      When the page at "/search?q=cup" is opened
      Then the blurb to refine the search is after the last tournament found

    Scenario: Exactly 100 tournaments says nothing
      Given 100 tournaments are called "Big Cup" followed by a number
      When the page at "/search?q=cup" is opened
      Then the tournaments found do not say there are more

    Scenario: Fewer says nothing
      When the page at "/search?q=spring" is opened
      Then the tournaments found do not say there are more

    Scenario: A list that was not cut does not say so when another was
      Given 101 tournaments are called "Big Cup" followed by a number
      When the page at "/search?q=cup" is opened
      Then the players found do not say there are more

    Scenario: The blurb is in the reader's language
      Given a browser that asks for "en-XA"
      And 101 tournaments are called "Big Cup" followed by a number
      When the page at "/search?q=cup" is opened
      Then every word in the page's content but the names found is in the test locale

  Rule: Each thing found leads to its page

    Scenario: A tournament leads to its page
      Given the page at "/search?q=spring" is opened
      When the found tournament "Spring Open" is pressed
      Then the address is "/2026/ac/spring-open"

    Scenario: A player leads to their page
      Given the page at "/search?q=someone" is opened
      When the found player "Sam Someone" is pressed
      Then the address is "/players/sam-someone"

    Scenario: A competition leads to its page
      Given the page at "/search?q=block" is opened
      When the found competition "Block A" is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a"

  Rule: A player is found once, however many tournaments they have played in

    Scenario: A player in two tournaments is found once
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the page at "/search?q=someone" is opened
      Then 1 player is in the results

  Rule: Nothing archived is found

    Scenario: An archived tournament is not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" is not among the tournaments in the results

    Scenario: An archived player is not found
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the page at "/search?q=someone" is opened
      Then "Sam Someone" is not among the players in the results

    Scenario: An archived competition is not found
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the page at "/search?q=block" is opened
      Then "Block A" is not among the competitions in the results

  Rule: Nothing typed is not a search

    Scenario: A page with no search shows only its box
      When the page at "/search" is opened
      Then the search page lists nothing

    Scenario: A page with nothing but spaces is no search
      When the page at "/search?q=   " is opened
      Then the search page lists nothing

    Scenario: What was typed is put back in the box
      When the page at "/search?q=spring open" is opened
      Then the header's search box says "spring open"

    Scenario: No search leaves the box empty
      When the page at "/search" is opened
      Then the header's search box is empty

  Rule: The page is for anybody, on the website asked about

    Scenario: A reader not signed in can search
      Given nobody is signed in
      When the page at "/search?q=spring" is opened
      Then "Spring Open" is among the tournaments in the results

    Scenario: A tournament of another website is not found
      Given a site served as "gateballscores.com"
      When the page at "/search?q=spring" is opened
      Then "Spring Open" is not among the tournaments in the results

  Rule: The page fits a phone

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "organiser@example.com" has created the tournament "Bartholomew Montgomery-Fitzwilliam Memorial Open"
      When the page at "/search?q=memorial" is opened
      Then the page is no wider than the window

    Scenario: On a phone the header still has the search box
      Given a viewport 375 pixels wide
      When the page at "/" is opened
      Then the header has a search box

    Scenario: On a phone the header is no wider than the window
      Given a viewport 375 pixels wide
      When the page at "/" is opened
      Then the page is no wider than the window

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the names of the tournaments, players and competitions found,
    which are what their managers called them.

    Scenario: The results are in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/search?q=spring" is opened
      Then every word in the page's content but the names found is in the test locale

    Scenario: Nothing found says so in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/search?q=zzzz" is opened
      Then every word in the page's content but the names found is in the test locale

    Scenario: The search box is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/" is opened
      Then every word in the header's search box is in the test locale
