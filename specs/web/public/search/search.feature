@browser @postgres
Feature: A reader searches the website for tournaments, players and competitions

  Every page of the public site has a search box in its header, a text field
  and a button, both called "Search", so that a reader who knows a name need
  not find where it is kept. Pressing the button asks the site for what the
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
  list is in alphabetical order and has at most 100.

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

    Scenario: The button is called Search
      When the page at "/" is opened
      Then the header's search button is called "Search"

    Scenario: A search is made without scripting
      Given the page at "/" is opened with scripting off
      And "spring" is typed as the header's search box
      When the header's search button is pressed
      Then the address is "/search"
      And the address asks for "spring"

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
      Given the page at "/" is opened
      And "spring" is typed as the header's search box
      When the header's search button is pressed
      Then "Spring Open" is among the tournaments in the results

    Scenario: A search is made from the results page
      Given the page at "/search" is opened
      And "someone" is typed as the header's search box
      When the header's search button is pressed
      Then "Sam Someone" is among the players in the results

    Scenario: A search is made by words in another order
      When the page at "/search?q=open spring" is opened
      Then "Spring Open" is among the tournaments in the results

    Scenario: A search is made without the accents
      Given "organiser@example.com" has added the player "José García" to "Spring Open"
      When the page at "/search?q=jose garcia" is opened
      Then "José García" is among the players in the results

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
