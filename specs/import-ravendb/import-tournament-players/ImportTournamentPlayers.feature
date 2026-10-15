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
  their name as it, as one added with none is (`addPlayer.feature`), less
  the brackets that end it (see below). That is so in a sport without world
  rankings as well, where a world ranking name given is kept as it is anywhere.

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

    Scenario: A player with no world ranking name is brought over with their name as it
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A player of an American 6 Wicket tournament is brought over with their name as their world ranking name
      Given a tournament "tournaments/14" on "croquetscores.com" of the sport "a6w" is imported
      And the players "tournamentplayers/43" of "tournaments/14" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/14" on "croquetscores.com" has the world ranking name "Sam Someone"

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
    for the whole tournament, standing in every place a bye was, and some
    managers entered more than one, as "Bye 1" and "Bye 2". The site enters a
    bye as a bye (`enterPlayer.feature`) and refuses a player named as one,
    as it says a player is (`TournamentPlayer.feature`): a name that begins
    with "bye", in any case, where no letter follows it. So every such player
    is left out of the tournament's players, and kept as the bye, so that a
    competition that names them puts a bye where they were
    (`ImportKnockouts.feature`). A name that only begins with the letters of
    "bye", as "Byers" does, is a player's like any other.

    Scenario Outline: A player named as a bye is not added
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "<name>"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no players

      Examples:
        | name  |
        | Bye   |
        | bye   |
        | BYE   |
        | Bye 1 |
        | Bye-2 |

    Scenario: A player named as a bye is kept as the bye
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Bye 1"
      When the players are imported
      Then player 1 of "tournaments/12" on "croquetscores.com" is kept as the bye

    Scenario: Leaving a player named as a bye out is not refused
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Bye 1"
      When the players are imported
      Then no error is kept for "croquetscores.com/tournamentplayers/40"

    Scenario: A name that only begins with the letters of "bye" is a player's
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Byers"
      When the players are imported
      Then player 1 of "tournaments/12" on "croquetscores.com" is kept as "Byers"

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

  Rule: A player's world ranking name is their name without the brackets that end it

    The old sites let a name end in brackets, as "Sam Someone (NZ)" or
    "Sam Someone (2)", which is not part of the name the world rankings know
    a person by. So a player's world ranking name is their name with what is
    in brackets at the end of it taken off, each group of them, and the space
    before. Their name is left as it was. What is in brackets elsewhere in
    the name is part of it, a name that is nothing but brackets is left, and
    one that is too short without them says it was imported, as a name does.

    Scenario: A country in brackets is not part of the world ranking name
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ)"
      When the players are imported
      Then "Sam Someone (NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A number in brackets is not part of the world ranking name
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (2)"
      When the players are imported
      Then "Sam Someone (2)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: Every group of brackets that ends the name is taken off
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ) (2)"
      When the players are imported
      Then "Sam Someone (NZ) (2)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: Brackets in the middle of a name are part of it
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam (Sammy) Someone"
      When the players are imported
      Then "Sam (Sammy) Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam (Sammy) Someone"

    Scenario: A name that is only brackets is left
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "(NZ)"
      When the players are imported
      Then "(NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "(NZ)"

    Scenario: A name too short without its brackets says it was imported
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Al (NZ)"
      When the players are imported
      Then "Al (NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Al - Imported"

    Scenario: A sport with no world rankings has the name without the brackets as the world ranking name
      Given a tournament "tournaments/14" on "croquetscores.com" of the sport "a6w" is imported
      And the players "tournamentplayers/43" of "tournaments/14" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ)"
      When the players are imported
      Then "Sam Someone (NZ)" in the tournament kept for "tournaments/14" on "croquetscores.com" has the world ranking name "Sam Someone"

  Rule: Players of exactly one name are one player

    The old sites told players apart by their name and what they
    represented together, and a tournament's list could hold one person
    more than once: the same name entered again, often for another club. The
    site tells players apart by name alone, and a tournament played by teams
    already takes a name a team has again as the player it was
    (`ImportTeamMatches.feature`). So players whose names are exactly the same
    are one player, the first of them, and every number the old site gave
    them is kept as that one player. What the first represented is what the
    player represents.

    A name in another case, or with a number in brackets after it, is not
    exactly the same name. The site refuses a name another player has in any
    case, so the second player of a name in another case is given the name
    followed by "(2)", the third by "(3)", and so on, and a manager can name
    them better.

    Scenario: Two players of one name are one player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 1 player

    Scenario: The first number is kept as the player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      When the players are imported
      Then player 1 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone"

    Scenario: The second number is kept as the same player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      When the players are imported
      Then player 2 of "tournaments/12" on "croquetscores.com" is kept as "Sam Someone"

    Scenario: Players of one name representing different clubs are one player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury"
      And player 2 is called "Sam Someone"
      And player 2 represents "Otago"
      When the players are imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" represents "Canterbury"

    Scenario: Three players of one name are one player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      And player 3 is called "Sam Someone"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 1 player

    Scenario: A player between two of one name is another player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Alex Another"
      And player 3 is called "Sam Someone"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 2 players

    Scenario: A name with a number after it is another player
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone (2)"
      When the players are imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 2 players

    Scenario: A name in another case is another player, numbered
      Given the players "tournamentplayers/40" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "sam someone"
      When the players are imported
      Then player 2 of "tournaments/12" on "croquetscores.com" is kept as "sam someone (2)"

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
