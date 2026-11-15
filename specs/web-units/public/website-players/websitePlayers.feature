@browser @postgres
Feature: A reader searches the website's players by name

  The page of players, at "/players", is a search for players by name and
  nothing else. It does not list the players: a website that has had tens of
  thousands of them has a list nobody reads, so the page has a search box and
  what a search finds, and nothing under it before one is made
  (`SearchPlayersOfWebsite.feature`).

  The box is called "Search players", and its button likewise. It is a form of
  the page's own, sent as any is, and so needs no scripting, and makes the
  address "/players?search=sam", which a reader can keep or send. The site's
  own search in the header is on the page as it is on every other
  (`search.feature`); it finds tournaments and competitions as well, and this
  one finds players alone, and finds them where the players are.

  Each player found is shown by their world ranking name and leads to their
  page at "/players/sam-someone" (`websitePlayer.feature`), once however many
  tournaments they have played in, in alphabetical order, at most 100. Nothing
  found says so. What was typed is put back in the box. Nothing typed, or
  nothing but spaces, is no search, and the page says what it is for, in one
  line where the players would be, rather than listing everybody.

  The page is reached from the site's navigation, where it is called
  "Players", so that a reader who comes for a player is not made to find a
  tournament first.

  Where there are more than a hundred players found the hundred are shown,
  and after the end of them the page says there are more and to refine the
  search, so that a hundred is not taken for everybody there is.

  Where a scenario says nothing else, a tournament is for the sport "ac" and
  its players represent nothing and fly no flag.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"

  Rule: The page is a search for players, and lists nobody before one is made

    Scenario: The page is headed Players
      When the page at "/players" is opened
      Then the content has the heading "Players"

    Scenario: The page has a search box
      When the page at "/players" is opened
      Then the players' search box is called "Search players"

    Scenario: The page has a button
      When the page at "/players" is opened
      Then the players' search button is called "Search players"

    Scenario: The page lists nobody before a search
      When the page at "/players" is opened
      Then the page lists no players

    Scenario: The page says what it is for before a search
      When the page at "/players" is opened
      Then the players' search says what it is for

    Scenario: A search is made without scripting
      Given the page at "/players" is opened with scripting off
      And "sam" is typed as the players' search box
      When the players' search button is pressed
      Then the address is "/players"
      And the address searches players for "sam"

    Scenario: A page is for anybody
      Given nobody is signed in
      When the page at "/players" is opened
      Then the content has the heading "Players"

  Rule: The page names itself in the header, beneath the site's name

    Scenario: The header names the page
      When the page at "/players" is opened
      Then the header names the page "Players"

  Rule: The players whose names the words are found in are listed

    Scenario: A player is found
      When the page at "/players?search=someone" is opened
      Then "Sam Someone" is among the players the page found

    Scenario: A player is not found where a word is not in their name
      When the page at "/players?search=someone other" is opened
      Then "Sam Someone" is not among the players the page found

    Scenario: A player is found by words in another order
      Given "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      When the page at "/players?search=player pat" is opened
      Then "Pat Player" is among the players the page found

    Scenario: A player is found by part of a word
      When the page at "/players?search=omeo" is opened
      Then "Sam Someone" is among the players the page found

    Scenario: A player is found without the accents of their name
      Given "organiser@example.com" has added the player "José García" to "Spring Open"
      When the page at "/players?search=jose garcia" is opened
      Then "José García" is among the players the page found

    Scenario: A search is made from the page
      Given the page at "/players" is opened
      And "someone" is typed as the players' search box
      When the players' search button is pressed
      Then "Sam Someone" is among the players the page found

    Scenario: What was typed is put back in the box
      When the page at "/players?search=some" is opened
      Then the players' search box says "some"

    Scenario: A tournament is not found by this search
      When the page at "/players?search=spring" is opened
      Then the page lists no players

    Scenario: Nothing found says so
      When the page at "/players?search=zzzz" is opened
      Then the players' search says nobody was found

    Scenario: Something found does not say nobody was
      When the page at "/players?search=someone" is opened
      Then the players' search does not say nobody was found

    Scenario: Nothing but spaces is no search
      When the page at "/players?search=   " is opened
      Then the page lists no players

    Scenario: Nothing but spaces says what the page is for
      When the page at "/players?search=   " is opened
      Then the players' search says what it is for

  Rule: The players found are in alphabetical order, once each

    Scenario: The players found are in alphabetical order of their names
      Given "organiser@example.com" has added the player "Sam Another" to "Spring Open"
      When the page at "/players?search=sam" is opened
      Then the first player the page found is "Sam Another"
      And the second player the page found is "Sam Someone"

    Scenario: A player in two tournaments is found once
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the page at "/players?search=someone" is opened
      Then the page found 1 player

    Scenario: An archived player is not found
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the page at "/players?search=someone" is opened
      Then "Sam Someone" is not among the players the page found

    Scenario: A player is found by the world ranking name they have
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the page at "/players?search=rankings" is opened
      Then "Samuel Rankings" is among the players the page found

  Rule: More than a hundred says so, after the end of the players

    Scenario: More than 100 players says there are more
      Given 101 players are called "Pat" followed by a number in "Spring Open"
      When the page at "/players?search=pat" is opened
      Then the page says there are more players than it shows

    Scenario: The blurb is after the last player
      Given 101 players are called "Pat" followed by a number in "Spring Open"
      When the page at "/players?search=pat" is opened
      Then the blurb to refine the search is after the last player shown

    Scenario: Exactly 100 players says nothing
      Given 100 players are called "Pat" followed by a number in "Spring Open"
      When the page at "/players?search=pat" is opened
      Then the page does not say there are more players than it shows

    Scenario: The blurb is in the reader's language
      Given a browser that asks for "en-XA"
      And 101 players are called "Pat" followed by a number in "Spring Open"
      When the page at "/players?search=pat" is opened
      Then every word in the page's content but the players' names is in the test locale

  Rule: Each player found leads to their page

    Scenario: A player leads to their page
      Given the page at "/players?search=someone" is opened
      When the found player "Sam Someone" is pressed
      Then the address is "/players/sam-someone"

  Rule: The site's search is on the page as on every other

    Scenario: The header has the site's search box
      When the page at "/players" is opened
      Then the header has a search box

    Scenario: The site's search finds more than players
      Given a browser that runs scripts
      And the page at "/players" is opened
      And "spring" is typed as the header's search box
      When the header's magnifying glass is pressed
      Then "Spring Open" is among the tournaments in the results

  Rule: The navigation leads to the page

    Scenario: The navigation has Players
      When the page at "/" is opened
      Then the navigation has "Players"

    Scenario: Players leads to the page of players
      Given the page at "/" is opened
      When "Players" is pressed in the navigation
      Then the address is "/players"

  Rule: The page fits a phone

    Scenario: On a phone the page is no wider than the window
      Given a viewport 375 pixels wide
      And "organiser@example.com" has added the player "Bartholomew Montgomery-Fitzwilliam" to "Spring Open"
      When the page at "/players?search=bartholomew" is opened
      Then the page is no wider than the window

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the players' names, which are what their managers called them.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/players" is opened
      Then every word in the page's content is in the test locale

    Scenario: A search with players found is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/players?search=someone" is opened
      Then every word in the page's content but the players' names is in the test locale

    Scenario: A search that finds nobody says so in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/players?search=zzzz" is opened
      Then every word in the page's content is in the test locale
