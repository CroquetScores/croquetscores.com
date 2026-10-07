@postgres
Feature: Importing the players of the old sites' tournaments

  The old sites kept every player in a tournament in one document of its own,
  which names the tournament it belongs to. Each player in it is added to the
  tournament that document became (`ImportTournaments.feature`), in the order
  the document lists them, so the tournament lists them as the old site did.
  They are brought over with the tournament, before its competitions
  (`ImportWholeTournaments.feature`).

  The document is brought over a player at a time. A player the site refuses
  is kept as an error against the document, naming the player, and the
  players after them are added all the same: one player the site cannot take
  would otherwise leave every other player in the tournament behind.

  Which tournament player each of the old site's players became is kept, by
  the website, the tournament and the number the old site gave the player,
  since that number is how the old site's competitions name their players.
  The record goes when importing is finished.

  A tournament played by teams has no players of its own on the site: its
  players are its teams' (`ImportTeamMatches.feature`). So the players of
  such a tournament are left here for its team matches to bring over.

  The old sites kept no world ranking name, so a player is brought over with
  none (`WorldRankingName.feature`).

  Background:
    Given the users are imported
    And the tournaments are imported
    And the tournament players are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported

  Rule: Each of the tournament's players is added to it

    Scenario: A player becomes a player in the tournament
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Sam Someone"

    Scenario: A player represents what they represented
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury Croquet Club"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" represents "Canterbury Croquet Club"

    Scenario: A player who represented nothing represents nothing
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents nothing
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" represents nothing

    Scenario: A player is brought over with no world ranking name
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" has no world ranking name

    Scenario: The players are listed in the order the old site listed them
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 7 is called "Sam Someone"
      And player 3 is called "Alex Other"
      When the players are imported
      Then the first player of the tournament kept for "tournaments/12" on "croquetscores.com" is "Sam Someone"

    Scenario: Which tournament player the old site's player became is kept
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 7 is called "Sam Someone"
      When the players are imported
      Then player 7 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone"

  Rule: A player flies the flag of the country they represent, where it is one

    The old sites showed a flag beside a player who represented a country,
    found from what they represented: the country's name, or its code of two
    or three letters, in any case. England, Scotland and Wales had flags of
    their own. The same flag is flown here, and a player who represented a
    club, a region or nothing flies none.

    Scenario Outline: A player representing a country flies its flag
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "<representing>"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" flies the flag "<flag>"

      Examples:
        | representing | flag     |
        | NZ           | nz       |
        | nzl          | nz       |
        | Australia    | au       |
        | USA          | us       |
        | England      | england  |
        | SCO          | scotland |
        | Wales        | wales    |

    Scenario: A player representing a club flies no flag
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury Croquet Club"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" flies no flag

  Rule: A bye is no player

    The old sites entered a bye in a knockout as a player called "Bye", one
    for the whole tournament, standing in every place a bye was. The site
    enters a bye as a bye (`enterPlayer.feature`) and refuses a player called
    one, so the old site's bye is left out of the tournament's players, and a
    knockout brings its byes over as byes (`ImportKnockouts.feature`).

    Scenario: A player called "Bye" is not added
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Bye"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no players

    Scenario: Leaving a bye out is not refused
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "bye"
      When the players are imported
      Then no error is kept for "croquetscores.com/tournamentplayers/40"

  Rule: A name too short to be accepted says it was imported, and is otherwise left as it was

    A player's name is a person's name, as a user's is, and is brought over
    as a user's is (`ImportUsers.feature`).

    Scenario: A name shorter than 3 characters says it was imported
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Al"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Al - Imported"

    Scenario: A name of 3 characters is left as it was
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Sam"

  Rule: Two players with the same name are told apart by a number

    The old sites told players apart by their name and what they
    represented together, so two players of one name representing different
    clubs were two players. The site tells them apart by name alone, in any
    case. So the second player of a name is given the name followed by "(2)",
    the third by "(3)", and so on, and a manager can name them better.

    Scenario: The first player of a name keeps it
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury"
      And player 2 is called "Sam Someone"
      And player 2 represents "Otago"
      When the players are imported
      Then player 1 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone"

    Scenario: The second player of a name is numbered
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury"
      And player 2 is called "Sam Someone"
      And player 2 represents "Otago"
      When the players are imported
      Then player 2 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone (2)"

    Scenario: A player of a name in another case is numbered
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "sam someone"
      When the players are imported
      Then player 2 of "tournaments/12" on "croquetscores.com" is kept as "sam someone (2)"

    Scenario: The third player of a name is numbered after the second
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      And player 3 is called "Sam Someone"
      When the players are imported
      Then player 3 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone (3)"

  Rule: A player the site refuses is kept as an error, and the other players are added

    Scenario: A player with no name is kept as an error
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      When the players are imported
      Then the error kept for "croquetscores.com/tournamentplayers/40" says "PersonName.Missing"

    Scenario: The error kept names the player refused
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      When the players are imported
      Then the error kept for "croquetscores.com/tournamentplayers/40" says "player 1"

    Scenario: The players after one refused are added
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      And player 2 is called "Sam Someone"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Sam Someone"

    Scenario: A player refused is not kept as any tournament player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      When the players are imported
      Then player 1 of "tournaments/12" on "croquetscores.com" is not kept as any player

  Rule: The players of a tournament played by teams are left for its team matches

    Scenario: A tournament played by teams is given no players
      Given a tournament "tournaments/13" on "croquetscores.com" of the type "teams" is imported
      And the players "tournamentplayers/42" of "tournaments/13" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the players are imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has no players

    Scenario: Leaving the players of a tournament played by teams is not refused
      Given a tournament "tournaments/13" on "croquetscores.com" of the type "teams" is imported
      And the players "tournamentplayers/42" of "tournaments/13" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the players are imported
      Then no error is kept for "croquetscores.com/tournamentplayers/42"
