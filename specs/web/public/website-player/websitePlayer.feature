@browser @postgres
Feature: A player's page lists what they have played in

  A player has a page at "/players" followed by their slug, as
  "/players/sam-someone", which a search leads to (`search.feature`,
  `websitePlayers.feature`). It is the person's and not a tournament's: a
  player who has played in a dozen tournaments has one page, at the address
  their world ranking name makes, and a tournament's own page for them stays
  where it was, at the tournament's address followed by "players" and their
  slug (`player.feature`).

  The page is headed by the player's name, as the tournament that started most
  recently wrote their world ranking name, and lists what they have played in,
  one line to each competition, as "Spring Open - Block A": the tournament's
  name, a hyphen and the competition's name (`PlayerOfWebsite.feature`). The
  line leads to the competition's page. A player in a tournament but in none of
  its competitions has a line of the tournament's name alone, which leads to
  the tournament's page. The lines are in the order of their tournaments, the
  one that started most recently first, and in a tournament in the order of its
  competitions.

  What is archived is not there, as it is nowhere on the public site. A slug
  nobody has on this website is a page that is not there.

  The tournament's name is not in the header, since this is no one tournament's
  page (`layout.feature`).

  Where a scenario says nothing else, a tournament is for the sport "ac", and
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

    Scenario: The page is headed by the world ranking name
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the page at "/players/samuel-rankings" is opened
      Then the page is headed "Samuel Rankings"

  Rule: Each competition the player is in is a line, with its tournament

    Scenario: A competition is a line of the tournament and the competition
      When the page at "/players/sam-someone" is opened
      Then the first line is "Spring Open - Block A"

    Scenario: A competition's line leads to its page
      Given the page at "/players/sam-someone" is opened
      When the line "Spring Open - Block A" is pressed
      Then the address is "/2026/ac/spring-open/competitions/block-a"

    Scenario: A player in a tournament and in none of its competitions has the tournament alone
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then there is a line "Autumn Open"

    Scenario: A tournament's line leads to its page
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And the page at "/players/sam-someone" is opened
      When the line "Autumn Open" is pressed
      Then the address is "/2026/ac/autumn-open"

    Scenario: A player in two tournaments has the competitions of both
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then there are 2 lines

    Scenario: A competition the player is not in is not a line
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then there is not a line "Spring Open - Block B"

  Rule: The lines are in order, the tournament that started most recently first

    Scenario: The tournament that started most recently is first
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-04-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      When the page at "/players/sam-someone" is opened
      Then the first line is "Autumn Open - Block A"
      And the second line is "Spring Open - Block A"

    Scenario: The competitions of a tournament are in its order
      Given "organiser@example.com" has added the block "Block 0" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block 0" of "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then the first line is "Spring Open - Block A"
      And the second line is "Spring Open - Block 0"

  Rule: What is archived is not there

    Scenario: A line of an archived competition is not there
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the page at "/players/sam-someone" is opened
      Then there is not a line "Spring Open - Block A"

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

  Rule: Every word the page says is in the reader's language

    The test locale shows it (`language.feature`). What is nobody's language
    is left out: the player's name and the names of the tournaments and
    competitions, which are what their managers called them.

    Scenario: The page is in the reader's language
      Given a browser that asks for "en-XA"
      When the page at "/players/sam-someone" is opened
      Then every word in the page's content but the names is in the test locale
