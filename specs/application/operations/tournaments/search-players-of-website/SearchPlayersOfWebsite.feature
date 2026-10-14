@postgres
Feature: Searching the players of the website, for anybody

  The public site has a page at "/players" that is a search for players, each
  found leading to a page of their own at "/players/sam-someone"
  (`websitePlayers.feature`). It does not list the players: a page of every
  player the website has, on a website that has had tens of thousands of them,
  is a page nobody reads, and so it shows its search box and what a text typed
  in it finds, and nothing before one is typed. The application answers it:
  the players whose names a text is found in, each once, with the name they are
  known by and where their page is found, which is everything a row of that
  page shows or leads to.

  The search is of players by name and nothing else. The site's search in the
  header is there as it is on every page, and finds tournaments and
  competitions as well (`Search.feature`); this one is for a reader who is
  looking for a player and has come to where the players are.

  A player is the person, and not the player a tournament has: a person who has
  played in a dozen tournaments is one player here, as they are one result of
  a search (`Search.feature`). Two of a tournament's players are the same
  person when their world ranking names make the same address, which is when
  they differ only in case, accents and what separates their words. It is the
  world ranking name that makes them so, and not the name a tournament typed,
  since every player has one (`addPlayer.feature`) and it is the name they are
  known by from one tournament to the next. The name shown is the world
  ranking name as the tournament that started most recently wrote it.

  A player's page is at "players" followed by their slug, which is made from
  their world ranking name as the slug of anything is (`Slug.feature`): the
  letters and digits of it, in lower case and without accents, with a hyphen
  between the words, so that "Sam Someone" is found at "players/sam-someone".

  The text is words, and a name is found when every word is somewhere in it, as
  the site's search finds one (`Search.feature`): in any order, in any case and
  with or without accents, and as part of a word. It is the player's world
  ranking name that is looked in, and not the name of a tournament or of a
  competition they are in. Nothing typed, or nothing but what separates words,
  is answered with nothing rather than with everybody. At most 100 are found, and it is said when there are more, so that a hundred
  is not taken for all there is,
  so that a single letter typed is answered with a page and not with the whole
  of the website.

  The players whose names begin with the text typed come first, as "Tim
  Murphy" is before "Alison & Tim Murphy" for "tim": a name begins with the
  text when, with the accents off and in lower case, it begins with the words
  as they were typed, in the order they were typed and one space apart
  (`Search.feature`). Each of those two groups is in alphabetical order of
  the names, by their letters with case and accents set aside. Players whose names read the same that way keep
  the order of their names as written.

  A player is listed for as long as one of their tournaments has them in use:
  not one in an archived tournament, nor one archived on its own, nor one of
  an archived team, as they are nowhere on the public site
  (`Search.feature`). A player archived in one
  tournament is still listed for another that has them, and one restored is
  listed again. A player of a team is listed as a player of a Standard
  tournament is.

  The players are of the website asked about. They are for anybody, so nobody
  need be signed in to ask, and every scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-09-20T00:00:00Z"
    And the tournament is to finish at "2026-10-04T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The players whose names a text is found in are listed

    Scenario: A player is found by a word of their name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A player is found by words in another order
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "someone sam" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A player is found by part of a word
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "omeo" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A player is found in any case
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "SOMEONE" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A player with an accent in their name is found without it
      Given "organiser@example.com" has added the player "José García" to "Spring Open"
      When the players of the website matching "jose garcia" are asked for
      Then the search finds the player "José García"

    Scenario: A player is not found where a word is not in their name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "sam other" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: The players are found whatever their names begin with
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Tom Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone"
      And the search finds the player "Tom Someone"

    Scenario: A player is not found by the name of a tournament they are in
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "spring" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: A player is not found by the name of a competition they are in
      Given the block is to be the best of 3
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      When the players of the website matching "block" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: A player is found by their world ranking name and not by the name they were added with
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the players of the website matching "rankings" are asked for
      Then the search finds the player "Samuel Rankings"

    Scenario: A player is not found by the name they were added with where their world ranking name is another
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the players of the website matching "someone" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: A player in two tournaments is found once
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the players of the website matching "someone" are asked for
      Then the search finds 1 player

    Scenario: A player found is listed with where their page is
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone" at the address "players/sam-someone"

    Scenario: A player that begins with the text is before one that only has it
      Given "organiser@example.com" has added the player "Alison & Tim Murphy" to "Spring Open"
      And "organiser@example.com" has added the player "Tim Murphy" to "Spring Open"
      When the players of the website matching "tim" are asked for
      Then the first player the search finds is "Tim Murphy"
      And the second player the search finds is "Alison & Tim Murphy"

    Scenario: Each group is in alphabetical order
      Given "organiser@example.com" has added the player "Tim Zed" to "Spring Open"
      And "organiser@example.com" has added the player "Zed Tim" to "Spring Open"
      And "organiser@example.com" has added the player "Tim Alpha" to "Spring Open"
      And "organiser@example.com" has added the player "Alpha Tim" to "Spring Open"
      When the players of the website matching "tim" are asked for
      Then the first player the search finds is "Tim Alpha"
      And the second player the search finds is "Tim Zed"
      And the third player the search finds is "Alpha Tim"

    Scenario: A name must begin with the whole of the text and not its first word
      Given "organiser@example.com" has added the player "Murphy Tim" to "Spring Open"
      And "organiser@example.com" has added the player "Tim Murphy" to "Spring Open"
      When the players of the website matching "tim murphy" are asked for
      Then the first player the search finds is "Tim Murphy"

    Scenario: The players found are in alphabetical order of their names
      Given "organiser@example.com" has added the player "Tom Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the first player the search finds is "Alex Someone"
      And the second player the search finds is "Sam Someone"
      And the third player the search finds is "Tom Someone"

    Scenario: An archived player is not found
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: A player of an archived tournament is not found
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: A player on another website is not found
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website "gateballscores.com" matching "someone" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: A player of a team is found
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the players of the website matching "player" are asked for
      Then the search finds the player "Pat Player"

    Scenario: A player of a sport that is not ranked is found
      Given the tournament is to be for the sport "rc"
      And "organiser@example.com" has created the tournament "Spring Croquet"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Croquet"
      When the players of the website matching "player" are asked for
      Then the search finds the player "Pat Player"

    Scenario: A player of another tournament is found
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Alex Someone" to "Autumn Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Alex Someone"

    Scenario: A player whose name is in another script is found by it
      Given "organiser@example.com" has added the player "Лев Толстой" to "Spring Open"
      When the players of the website matching "толстой" are asked for
      Then the search finds the player "Лев Толстой"

    Scenario: More than 100 players is said
      Given 101 players are called "Pat" followed by a number in "Spring Open"
      When the players of the website matching "pat" are asked for
      Then the search of players said there are more

    Scenario: Exactly 100 players is not said to be more
      Given 100 players are called "Pat" followed by a number in "Spring Open"
      When the players of the website matching "pat" are asked for
      Then the search of players did not say there are more

    Scenario: No more than 100 players are found
      Given 101 players are called "Pat" followed by a number in "Spring Open"
      When the players of the website matching "pat" are asked for
      Then the search finds 100 players

  Rule: Nothing typed is answered with nothing

    Scenario: No text finds nobody
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "" are asked for
      Then the search finds 0 players

    Scenario: Only spaces finds nobody
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "   " are asked for
      Then the search finds 0 players

    Scenario: A search that finds nobody lists none
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "zzzz" are asked for
      Then the search finds 0 players

  Rule: A player is listed once, whatever tournaments they are in

    Scenario: A player in two tournaments is listed once
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the players of the website matching "someone" are asked for
      Then the search finds 1 player

    Scenario: World ranking names that differ only in case and accents are one player
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "SAM SOMÉONE" to "Autumn Open"
      When the players of the website matching "someone" are asked for
      Then the search finds 1 player

    Scenario: Players of different names with one world ranking name are one player
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Sammy Someone" to "Autumn Open"
      And "organiser@example.com" has changed the world ranking name of the player "Sammy Someone" in "Autumn Open" to "Sam Someone"
      When the players of the website matching "someone" are asked for
      Then the search finds 1 player

    Scenario: Players of one name with different world ranking names are two players
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Autumn Open" to "Samuel Someone"
      When the players of the website matching "someone" are asked for
      Then the search finds 2 players

    Scenario: A player is listed by the world ranking name the tournament that started most recently wrote
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-04-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "SAM SOMEONE" to "Autumn Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "SAM SOMEONE"
      And the search does not find the player "Sam Someone"

  Rule: A player is listed by their world ranking name

    Scenario: A player is listed by the world ranking name they have and not the name they were added with
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the players of the website matching "sam" are asked for
      Then the search finds the player "Samuel Rankings"
      And the search does not find the player "Sam Someone"

    Scenario: A player added with no world ranking name is listed by their name
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A player whose name is corrected is listed by the name now
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Samantha Someone"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Samantha Someone"
      And the search does not find the player "Sam Someone"

  Rule: A player leads to a page at players followed by the slug of their world ranking name

    Scenario: A player is listed with where their page is
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone" at the address "players/sam-someone"

    Scenario: An accent is not in the address
      Given "organiser@example.com" has added the player "José García" to "Spring Open"
      When the players of the website matching "garcia" are asked for
      Then the search finds the player "José García" at the address "players/jose-garcia"

    Scenario: A name in another script is in the address in it
      Given "organiser@example.com" has added the player "Лев Петров" to "Spring Open"
      When the players of the website matching "петров" are asked for
      Then the search finds the player "Лев Петров" at the address "players/лев-петров"

    Scenario: A player in two tournaments is listed at the one address
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-04-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "SAM SOMEONE" to "Autumn Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "SAM SOMEONE" at the address "players/sam-someone"

  Rule: The players are in alphabetical order of their names

    Scenario: Players are in alphabetical order
      Given "organiser@example.com" has added the player "Zed Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Mia Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the first player the search finds is "Alex Someone"
      And the second player the search finds is "Mia Someone"
      And the third player the search finds is "Zed Someone"

    Scenario: Case does not decide the order
      Given "organiser@example.com" has added the player "zed Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Someone" to "Spring Open"
      And "organiser@example.com" has added the player "mia Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the first player the search finds is "Alex Someone"
      And the second player the search finds is "mia Someone"
      And the third player the search finds is "zed Someone"

    Scenario: Accents do not decide the order
      Given "organiser@example.com" has added the player "Zed Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Émile Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Frank Someone" to "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the first player the search finds is "Émile Someone"
      And the second player the search finds is "Frank Someone"
      And the third player the search finds is "Zed Someone"

    Scenario: A player is placed by their world ranking name
      Given "organiser@example.com" has added the player "Alex Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Zed Someone" to "Spring Open"
      And "organiser@example.com" has changed the world ranking name of the player "Zed Someone" in "Spring Open" to "Aaron Someone"
      When the players of the website matching "someone" are asked for
      Then the first player the search finds is "Aaron Someone"
      And the second player the search finds is "Alex Someone"

  Rule: A player whose tournaments have them archived is not listed

    Scenario: A player of an archived tournament is not listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: An archived player is not listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search does not find the player "Sam Someone"

    Scenario: An archived player of a team is not listed
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Pat Player" of the team "Australia" of "Spring Tests"
      When the players of the website matching "player" are asked for
      Then the search does not find the player "Pat Player"

    Scenario: The players of an archived team are not found
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the players of the website matching "player" are asked for
      Then the search does not find the player "Pat Player"

    Scenario: The players of a team restored are found again
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      And "organiser@example.com" has restored the team "Australia" in "Spring Tests"
      When the players of the website matching "player" are asked for
      Then the search finds the player "Pat Player"

    Scenario: A player archived in one tournament is listed for another
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A player restored is listed again
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has restored the player "Sam Someone" in "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone"

    Scenario: A tournament restored lists its players again
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has restored the tournament "Spring Open"
      When the players of the website matching "someone" are asked for
      Then the search finds the player "Sam Someone"

  Rule: The players are of the website asked about

    Scenario: A player on another website is not listed
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the players of the website "gateballscores.com" matching "someone" are asked for
      Then the search does not find the player "Sam Someone"
