@postgres
Feature: A player of the website, with the tournaments they have played in

  The public site has a page for each player at "/players/sam-someone"
  (`websitePlayer.feature`), which a search finds them at
  (`SearchPlayersOfWebsite.feature`). The application answers it: the player's
  name, and each tournament they are in, once, so that a reader sees where a
  person has played.

  A player is found by their slug, which is the address their world ranking
  name makes (`SearchPlayersOfWebsite.feature`): a player in a dozen
  tournaments is one player, and is answered with all of them. The name is the
  world ranking name as the tournament that started most recently wrote it.

  Each tournament is answered once, with its name, where it is found, and
  where the player's own page in it is found, which is the
  tournament's address followed by "players" and their slug there
  (`addPlayer.feature`), so that the page can lead to it. How many of its
  competitions the player is in does not matter and is not answered: a
  tournament they are in none of is no different from one they are in six of.
  The tournaments are in the order they started, the most recent first.

  What is archived is left out as it is from every list of players: an
  archived tournament, a player archived in it, and a player of an archived
  team. An archived competition leaves the player in the tournament. A player
  with nothing left is no player of the website. A slug nobody has, on this
  website, is refused as `PlayerOfWebsite.NoSuchPlayer`.

  A player's page is for anybody, so nobody need be signed in to ask, and every
  scenario here asks with nobody signed in.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to start at "2026-09-20T00:00:00Z"
    And the tournament is to finish at "2026-10-04T00:00:00Z"
    And the tournament is to be for the sport "ac"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"

  Rule: A player is answered by their slug, with their name

    Scenario: A player is answered
      When the player "sam-someone" of the website is asked for
      Then the player is called "Sam Someone"

    Scenario: A player is answered by the slug of their world ranking name
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the player "samuel-rankings" of the website is asked for
      Then the player is called "Samuel Rankings"

    Scenario: A player is not answered by the slug of the name they were added with where their world ranking name is another
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the player "sam-someone" of the website is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: A player nobody has is refused
      When the player "nobody-here" of the website is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: A player on another website is refused
      When the player "sam-someone" of the website "gateballscores.com" is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: A slug that is not text is refused
      When the player of the website is asked for by something that is not text
      Then it is refused with "PlayerOfWebsite.NotText"

  Rule: Each tournament the player is in is answered once

    Scenario: A tournament is answered
      When the player "sam-someone" of the website is asked for
      Then the player is in the tournament "Spring Open"

    Scenario: A tournament is answered with where it is found
      When the player "sam-someone" of the website is asked for
      Then the player's tournament "Spring Open" is found at the address "2026/ac/spring-open"

    Scenario: A tournament is answered with where the player's page in it is
      When the player "sam-someone" of the website is asked for
      Then the player's page in the tournament "Spring Open" is found at the address "2026/ac/spring-open/players/sam-someone"

    Scenario: A tournament is answered once however many of its competitions the player is in
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in 1 tournament

    Scenario: A tournament the player is in none of the competitions of is answered
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in the tournament "Autumn Open"

    Scenario: A player in two tournaments is answered with both
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in 2 tournaments

    Scenario: A tournament the player is not in is not answered
      Given "organiser@example.com" has created the tournament "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the player is not in the tournament "Autumn Open"

    Scenario: A player of a team is answered with the tournament
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the player "pat-player" of the website is asked for
      Then the player is in the tournament "Spring Tests"

    Scenario: A player of a team has their page in the tournament too
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the player "pat-player" of the website is asked for
      Then the player's page in the tournament "Spring Tests" is found at the address "2026/ac/spring-tests/players/pat-player"

  Rule: The tournaments are in the order they started, the most recent first

    Scenario: The tournament that started most recently is first
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-04-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the first tournament of the player is "Autumn Open"
      And the second tournament of the player is "Spring Open"

  Rule: What is archived is left out

    Scenario: An archived tournament is left out
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: An archived player is left out
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: An archived competition leaves the player in the tournament
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in the tournament "Spring Open"

    Scenario: A player archived in one tournament is answered with another
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is not in the tournament "Spring Open"

    Scenario: A player restored is answered again
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has restored the player "Sam Someone" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is called "Sam Someone"
