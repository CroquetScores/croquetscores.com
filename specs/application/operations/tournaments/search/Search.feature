@postgres
Feature: Searching the website for tournaments, players and competitions

  The public site has a search box in its header, which leads to a page of
  what was found (`search.feature`). The application answers it: the
  tournaments, the players and the competitions of the website being read
  whose names the text typed is found in, each with where it is found, which
  is everything a row of that page shows or leads to. A competition is
  answered with the tournament it is in, since the same name is typed into a
  great many tournaments.

  A player is found by their world ranking name, which every player has
  (`addPlayer.feature`) and which is the name they are known by from one
  tournament to the next, and not by the name a tournament typed for them. A
  player is answered once, however many tournaments they have played in, and
  leads to a page of their own at "/players/sam-someone"
  (`SearchPlayersOfWebsite.feature`). Two players are the same person when
  their world ranking names make the same address: when they differ only in
  case, accents and what separates their words. The name shown is the world
  ranking name as the tournament that started most recently wrote it.

  The text is words, and a name is found when every word is somewhere in it:
  in any order, in any case and with or without the accents its letters carry,
  and as part of a word as well as the whole of one, so that "spr" finds
  "Spring Open" and "jose" finds "José García". Whatever separates the words
  is only that. Which accents a name carries is the language's, and a reader
  typing on a keyboard that has no way to write one should still find the
  name.

  What is archived is not found, as it is nowhere on the public site: not an
  archived tournament, nor the players and competitions of one, nor a player
  or a competition archived on its own, and not the players of an archived
  team. One restored is found again. A person is found for as long as one of
  their tournaments has them in use. A player of a team is found by their name
  as a player of a Standard tournament is.

  The answer is of the website asked about, in three lists by what was found,
  each with the names that begin with the text typed first, as "Tim Murphy"
  is before "Alison & Tim Murphy" for "tim", and each of those two groups in
  alphabetical order of the names, each list of at most 100, so that a
  single letter typed is answered with a page and not with the whole of the
  website. Nothing typed, or nothing but what separates words, is answered
  with nothing rather than with everything.

  Where there are more than a hundred of a kind, the hundred are answered and
  it is said that there are more, so that a reader who sees a hundred knows
  that it is not all there is, and is not left to take it for the whole. Said
  of each kind apart, since one may be cut and not another, and not said where
  there are exactly a hundred, since then nothing is left out.

  Searching is for anybody, so nobody need be signed in to ask, and every
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

  Rule: A tournament is answered with when and where it is played

    The page of results lists tournaments and competitions by the days they
    run, the sport and the country they are played in as well as by their
    names, so that a reader can tell two of the same name apart and can sort by
    the date. A competition has no days, sport or country of its own: it is
    answered with those of its tournament.

    Background:
      Given the tournament is to be for the sport "gc"
      And the tournament is to be played in the country "nz"
      And the tournament is to be played in the region "can"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the block "Autumn Block" to "Autumn Open"

    Scenario: A tournament is answered with the day it starts
      When the website is searched for "autumn open"
      Then the tournament "Autumn Open" is found starting on "2026-09-20"

    Scenario: A tournament is answered with the day it finishes
      When the website is searched for "autumn open"
      Then the tournament "Autumn Open" is found finishing on "2026-10-04"

    Scenario: A tournament is answered with the country it is played in
      When the website is searched for "autumn open"
      Then the tournament "Autumn Open" is found in the country "nz"

    Scenario: A tournament is answered with the sport it is for
      When the website is searched for "autumn open"
      Then the tournament "Autumn Open" is found for the sport "gc"

    Scenario: A competition is answered with the day its tournament starts
      When the website is searched for "autumn block"
      Then the competition "Autumn Block" is found in a tournament starting on "2026-09-20"

    Scenario: A competition is answered with the day its tournament finishes
      When the website is searched for "autumn block"
      Then the competition "Autumn Block" is found in a tournament finishing on "2026-10-04"

    Scenario: A competition is answered with the country of its tournament
      When the website is searched for "autumn block"
      Then the competition "Autumn Block" is found in a tournament in the country "nz"

    Scenario: A competition is answered with the sport of its tournament
      When the website is searched for "autumn block"
      Then the competition "Autumn Block" is found in a tournament for the sport "gc"

  Rule: A tournament is found by the words of its name

    Scenario: A tournament is found by a word of its name
      When the website is searched for "spring"
      Then the tournament "Spring Open" is found

    Scenario: A tournament is found by all its words in another order
      When the website is searched for "open spring"
      Then the tournament "Spring Open" is found

    Scenario: A tournament is found by the start of a word
      When the website is searched for "spr"
      Then the tournament "Spring Open" is found

    Scenario: A tournament is found by the middle of a word
      When the website is searched for "rin"
      Then the tournament "Spring Open" is found

    Scenario: A tournament is found in any case
      When the website is searched for "SPRING"
      Then the tournament "Spring Open" is found

    Scenario: A tournament is not found where a word is not in its name
      When the website is searched for "spring autumn"
      Then the tournament "Spring Open" is not found

    Scenario: A tournament with an accent in its name is found without it
      Given "organiser@example.com" has created the tournament "Copa José García"
      When the website is searched for "jose garcia"
      Then the tournament "Copa José García" is found

    Scenario: A tournament is found with an accent where its name has none
      When the website is searched for "spríng"
      Then the tournament "Spring Open" is found

    Scenario: A tournament named in another script is found by it
      Given "organiser@example.com" has created the tournament "Кубок"
      When the website is searched for "кубок"
      Then the tournament "Кубок" is found

    Scenario: A tournament renamed is found by its name now and not before
      Given "organiser@example.com" has renamed the tournament "Spring Open" to "Autumn Classic"
      When the website is searched for "autumn"
      Then the tournament "Autumn Classic" is found

    Scenario: A tournament renamed is not found by its name before
      Given "organiser@example.com" has renamed the tournament "Spring Open" to "Autumn Classic"
      When the website is searched for "spring"
      Then the tournament "Autumn Classic" is not found

  Rule: A player is found by their world ranking name, once, whatever tournaments they are in

    Scenario: A player is found by a word of their world ranking name
      When the website is searched for "someone"
      Then the player "Sam Someone" is found

    Scenario: A player is found by their world ranking name and not by the name they were added with
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the website is searched for "rankings"
      Then the player "Samuel Rankings" is found

    Scenario: A player is not found by the name they were added with where their world ranking name is another
      Given "organiser@example.com" has changed the world ranking name of the player "Sam Someone" in "Spring Open" to "Samuel Rankings"
      When the website is searched for "someone"
      Then the player "Sam Someone" is not found

    Scenario: A player of a sport that is not ranked is found by their world ranking name
      Given the tournament is to be for the sport "rc"
      And "organiser@example.com" has created the tournament "Spring Croquet"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Croquet"
      When the website is searched for "pat player"
      Then the player "Pat Player" is found

    Scenario: A player is answered with where their page is
      When the website is searched for "someone"
      Then the player "Sam Someone" is found at the address "players/sam-someone"

    Scenario: A player is found by their world ranking name in any case and without accents
      Given "organiser@example.com" has added the player "José García" to "Spring Open"
      When the website is searched for "JOSE"
      Then the player "José García" is found

    Scenario: A player of a team is found by their world ranking name
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      When the website is searched for "pat player"
      Then the player "Pat Player" is found

    Scenario: A player in two tournaments is found once
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      When the website is searched for "someone"
      Then the search found 1 player

    Scenario: Two names a player is added with are one player when their world ranking name is the same
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sammy Someone" to "Autumn Open"
      And "organiser@example.com" has changed the world ranking name of the player "Sammy Someone" in "Autumn Open" to "Sam Someone"
      When the website is searched for "someone"
      Then the search found 1 player

    Scenario: World ranking names that differ only in case and accents are one player
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "SAM SOMÉONE" to "Autumn Open"
      When the website is searched for "someone"
      Then the search found 1 player

    Scenario: World ranking names with different words are two players
      Given "organiser@example.com" has added the player "Sam Someone Else" to "Spring Open"
      When the website is searched for "someone"
      Then the search found 2 players

    Scenario: A player is shown as the tournament that started most recently wrote their world ranking name
      Given the tournament is to start at "2027-03-20T00:00:00Z"
      And the tournament is to finish at "2027-04-04T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "SAM SOMEONE" to "Autumn Open"
      When the website is searched for "someone"
      Then the player "SAM SOMEONE" is found

  Rule: A competition is found by its name, with the tournament it is in

    Scenario: A competition is found by a word of its name
      When the website is searched for "block"
      Then the competition "Block A" is found

    Scenario: A competition is answered with the tournament it is in
      When the website is searched for "block"
      Then the competition "Block A" is found in the tournament "Spring Open"

    Scenario: A competition is answered with where its page is
      When the website is searched for "block"
      Then the competition "Block A" is found at the address "2026/ac/spring-open/competitions/block-a"

    Scenario: A competition of each kind is found
      Given "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      When the website is searched for "finals"
      Then the competition "Finals" is found

  Rule: What is archived is not found

    Scenario: An archived tournament is not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the website is searched for "spring"
      Then the tournament "Spring Open" is not found

    Scenario: The players of an archived tournament are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the website is searched for "someone"
      Then the player "Sam Someone" is not found

    Scenario: The competitions of an archived tournament are not found
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the website is searched for "block"
      Then the competition "Block A" is not found

    Scenario: An archived player is not found
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the website is searched for "someone"
      Then the player "Sam Someone" is not found

    Scenario: A player archived in one tournament is found by another
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Autumn Open"
      And "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the website is searched for "someone"
      Then the player "Sam Someone" is found

    Scenario: An archived player of a team is not found
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the player "Pat Player" of the team "Australia" of "Spring Tests"
      When the website is searched for "pat"
      Then the player "Pat Player" is not found

    Scenario: The players of an archived team are not found
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      When the website is searched for "pat"
      Then the player "Pat Player" is not found

    Scenario: The players of a team restored are found again
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has archived the team "Australia" in "Spring Tests"
      And "organiser@example.com" has restored the team "Australia" in "Spring Tests"
      When the website is searched for "pat"
      Then the player "Pat Player" is found

    Scenario: An archived competition is not found
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the website is searched for "block"
      Then the competition "Block A" is not found

    Scenario: A tournament restored is found again
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has restored the tournament "Spring Open"
      When the website is searched for "spring"
      Then the tournament "Spring Open" is found

    Scenario: A player restored is found again
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And "organiser@example.com" has restored the player "Sam Someone" in "Spring Open"
      When the website is searched for "someone"
      Then the player "Sam Someone" is found

    Scenario: A competition restored is found again
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And "organiser@example.com" has restored the competition "Block A" in "Spring Open"
      When the website is searched for "block"
      Then the competition "Block A" is found

  Rule: The answer is of the website asked about

    Scenario: A tournament on another website is not found
      When the website "gateballscores.com" is searched for "spring"
      Then the tournament "Spring Open" is not found

    Scenario: A player on another website is not found
      When the website "gateballscores.com" is searched for "someone"
      Then the player "Sam Someone" is not found

    Scenario: A competition on another website is not found
      When the website "gateballscores.com" is searched for "block"
      Then the competition "Block A" is not found

  Rule: Nothing typed is answered with nothing

    Scenario: No text finds no tournament
      When the website is searched for ""
      Then the tournament "Spring Open" is not found

    Scenario: Only spaces find no player
      When the website is searched for "   "
      Then the player "Sam Someone" is not found

    Scenario: Only spaces find no competition
      When the website is searched for "   "
      Then the competition "Block A" is not found

  Rule: Names that begin with the text come first, and each group is in alphabetical order

    A name begins with the text when, with the accents off and in lower case,
    it begins with the words as they were typed, in the order they were typed
    and one space apart. Where there is more than one word it is the whole of
    what was typed that the name must begin with, and not only the first word.
    The names that do not begin with it follow, since they are found all the
    same, and they are the ones a reader is least likely to be looking for.

    Scenario: A tournament that begins with the text is before one that only has it
      Given "organiser@example.com" has created the tournament "Alison & Tim Open"
      And "organiser@example.com" has created the tournament "Tim Open"
      When the website is searched for "tim"
      Then the first tournament the search found is "Tim Open"
      And the second tournament the search found is "Alison & Tim Open"

    Scenario: A player that begins with the text is before one that only has it
      Given "organiser@example.com" has added the player "Alison & Tim Murphy" to "Spring Open"
      And "organiser@example.com" has added the player "Tim Murphy" to "Spring Open"
      When the website is searched for "tim"
      Then the first player the search found is "Tim Murphy"
      And the second player the search found is "Alison & Tim Murphy"

    Scenario: A competition that begins with the text is before one that only has it
      Given "organiser@example.com" has added the block "Alpha Tim Block" to "Spring Open"
      And "organiser@example.com" has added the block "Tim Block" to "Spring Open"
      When the website is searched for "tim"
      Then the first competition the search found is "Tim Block"
      And the second competition the search found is "Alpha Tim Block"

    Scenario: Each group is in alphabetical order
      Given "organiser@example.com" has created the tournament "Tim Zed"
      And "organiser@example.com" has created the tournament "Zed Tim"
      And "organiser@example.com" has created the tournament "Tim Alpha"
      And "organiser@example.com" has created the tournament "Alpha Tim"
      When the website is searched for "tim"
      Then the first tournament the search found is "Tim Alpha"
      And the second tournament the search found is "Tim Zed"
      And the third tournament the search found is "Alpha Tim"
      And the fourth tournament the search found is "Zed Tim"

    Scenario: The text is begun with in any case
      Given "organiser@example.com" has created the tournament "Alison & Tim Open"
      And "organiser@example.com" has created the tournament "Tim Open"
      When the website is searched for "TIM"
      Then the first tournament the search found is "Tim Open"

    Scenario: The text is begun with without its accents
      Given "organiser@example.com" has created the tournament "Alison & José Open"
      And "organiser@example.com" has created the tournament "José Open"
      When the website is searched for "jose"
      Then the first tournament the search found is "José Open"

    Scenario: A name must begin with the whole of the text and not its first word
      Given "organiser@example.com" has created the tournament "Murphy Tim Open"
      And "organiser@example.com" has created the tournament "Tim Murphy Open"
      When the website is searched for "tim murphy"
      Then the first tournament the search found is "Tim Murphy Open"

    Scenario: The words are begun with in the order they were typed
      Given "organiser@example.com" has created the tournament "Murphy Tim Open"
      And "organiser@example.com" has created the tournament "Tim Murphy Open"
      When the website is searched for "murphy tim"
      Then the first tournament the search found is "Murphy Tim Open"

    Scenario: A name that begins with the text is not kept out by the limit
      Given 100 tournaments are called "Big Cup" followed by a number
      And "organiser@example.com" has created the tournament "Cup Zed"
      When the website is searched for "cup"
      Then the first tournament the search found is "Cup Zed"

    Scenario: Tournaments are in alphabetical order of their names
      Given "organiser@example.com" has created the tournament "Open Zed"
      And "organiser@example.com" has created the tournament "Open Alpha"
      When the website is searched for "open"
      Then the first tournament the search found is "Open Alpha"
      And the second tournament the search found is "Open Zed"
      And the third tournament the search found is "Spring Open"

    Scenario: Players are in alphabetical order of their names
      Given "organiser@example.com" has added the player "Sam Alpha" to "Spring Open"
      When the website is searched for "sam"
      Then the first player the search found is "Sam Alpha"
      And the second player the search found is "Sam Someone"

    Scenario: Competitions are in alphabetical order of their names
      Given "organiser@example.com" has added the block "Block 0" to "Spring Open"
      When the website is searched for "block"
      Then the first competition the search found is "Block 0"
      And the second competition the search found is "Block A"

    Scenario: No more than 100 tournaments are found
      Given 101 tournaments are called "Cup" followed by a number
      When the website is searched for "cup"
      Then the search found 100 tournaments

    Scenario: No more than 100 players are found
      Given 101 players are called "Pat" followed by a number in "Spring Open"
      When the website is searched for "pat"
      Then the search found 100 players

    Scenario: More than 100 tournaments is said
      Given 101 tournaments are called "Cup" followed by a number
      When the website is searched for "cup"
      Then the search said there are more tournaments

    Scenario: Exactly 100 tournaments is not said to be more
      Given 100 tournaments are called "Cup" followed by a number
      When the website is searched for "cup"
      Then the search did not say there are more tournaments

    Scenario: More than 100 players is said
      Given 101 players are called "Pat" followed by a number in "Spring Open"
      When the website is searched for "pat"
      Then the search said there are more players

    Scenario: Exactly 100 players is not said to be more
      Given 100 players are called "Pat" followed by a number in "Spring Open"
      When the website is searched for "pat"
      Then the search did not say there are more players

    Scenario: More than 100 competitions is said
      Given 101 blocks are called "Pool" followed by a number in "Spring Open"
      When the website is searched for "pool"
      Then the search said there are more competitions

    Scenario: Exactly 100 competitions is not said to be more
      Given 100 blocks are called "Pool" followed by a number in "Spring Open"
      When the website is searched for "pool"
      Then the search did not say there are more competitions

    Scenario: One kind cut does not say another is
      Given 101 tournaments are called "Cup" followed by a number
      When the website is searched for "cup"
      Then the search did not say there are more players

    Scenario: No more than 100 competitions are found
      Given 101 blocks are called "Pool" followed by a number in "Spring Open"
      When the website is searched for "pool"
      Then the search found 100 competitions

  Rule: The text must be text

    Scenario: Text that is not text is refused
      When the website is searched for something that is not text
      Then the search is refused as "Search.NotText"
