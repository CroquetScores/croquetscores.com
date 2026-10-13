@postgres
Feature: A player of the website, with what they have played in

  The public site has a page for each player at "/players/sam-someone"
  (`websitePlayer.feature`), which a search finds them at
  (`SearchPlayersOfWebsite.feature`). The application answers it: the player's
  name, and each competition they are entered in, with the tournament it is
  in, so that a reader sees where a person has played.

  A player is found by their slug, which is the address their world ranking
  name makes (`SearchPlayersOfWebsite.feature`): a player in a dozen
  tournaments is one player, and is answered with the competitions of all of
  them. The name is the world ranking name as the tournament that started most
  recently wrote it.

  Each competition is answered with its name, where it is found, and the name
  and address of its tournament. They are in the order of their tournaments,
  the one that started most recently first, and in a tournament in the order
  of its competitions. A player who is in a tournament but in none of its
  competitions is answered with the tournament alone, since they are there
  still.

  What is archived is left out as it is from every list of players: an
  archived tournament, a player archived in it, a player of an archived team,
  and an archived competition, which a player is no longer in. A player with
  nothing left is no player of the website. A slug nobody has, on this
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

  Rule: Each competition the player is in is answered, with its tournament

    Scenario: A competition is answered
      When the player "sam-someone" of the website is asked for
      Then the player is in the competition "Block A" of the tournament "Spring Open"

    Scenario: A competition is answered with where it is found
      When the player "sam-someone" of the website is asked for
      Then the player's competition "Block A" is found at the address "2026/ac/spring-open/competitions/block-a"

    Scenario: A tournament is answered with where it is found
      When the player "sam-someone" of the website is asked for
      Then the player's tournament "Spring Open" is found at the address "2026/ac/spring-open"

    Scenario: A competition the player is not entered in is not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is not in the competition "Block B" of the tournament "Spring Open"

    Scenario: A player in two tournaments is answered with both
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in 2 competitions

    Scenario: A player in a tournament and in none of its competitions is answered with the tournament
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in the tournament "Autumn Open" and in none of its competitions

    Scenario: A player of a team is answered
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the player "pat-player" of the website is asked for
      Then the player is in the tournament "Spring Tests" and in none of its competitions

  Rule: The tournaments are in the order they started, the most recent first

    Scenario: The tournament that started most recently is first
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-04-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has added the block "Block A" to "Autumn Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Autumn Open"
      When the player "sam-someone" of the website is asked for
      Then the first competition answered is "Block A" of the tournament "Autumn Open"
      And the second competition answered is "Block A" of the tournament "Spring Open"

    Scenario: The competitions of a tournament are in its order
      Given "organiser@example.com" has added the block "Block 0" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block 0" of "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the first competition answered is "Block A" of the tournament "Spring Open"
      And the second competition answered is "Block 0" of the tournament "Spring Open"

  Rule: What is archived is left out

    Scenario: An archived tournament is left out
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: An archived player is left out
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then it is refused with "PlayerOfWebsite.NoSuchPlayer"

    Scenario: An archived competition is left out
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is not in the competition "Block A" of the tournament "Spring Open"

    Scenario: A player archived in one tournament is answered with another
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is in the tournament "Autumn Open" and in none of its competitions

    Scenario: A player restored is answered again
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has restored the player "Sam Someone" in "Spring Open"
      When the player "sam-someone" of the website is asked for
      Then the player is called "Sam Someone"
