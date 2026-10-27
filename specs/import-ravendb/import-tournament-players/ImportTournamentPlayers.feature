@postgres
Feature: Bringing a competition's players over to its tournament

  The old sites kept a tournament's players in a document of its own, and
  copied each into every competition they were entered in, under the same
  number. The copies were not kept in step: a manager could rename a player
  in a competition, or enter a pair there as one player, and the tournament's
  list went on saying who the number had been. The import does not read that
  document at all. Every competition brings over the players of its own list,
  and a number is the competition's own: the same number in another
  competition says nothing of who the player is there.

  A player of a competition is a player of the tournament that competition
  became (`ImportTournaments.feature`), found by name. Where the tournament
  already has a player named exactly as they are, they are that player and are
  not added again; where it has none, they are added, in the order the
  competitions are brought over and the competition lists them. What they
  represented is what the first competition to say anything of it said, as
  the second rule below says. Which competition player each became is kept
  with the competition (`importCompetition.feature`).

  A player the site refuses is kept as an error against the competition,
  naming the player, and the players after them are added all the same: one
  player the site cannot take would otherwise leave every other player in the
  competition behind.

  A tournament played by teams has no players of its own on the site: its
  players are its teams' (`ImportTeamMatches.feature`). So the players of
  such a tournament are left for its team matches to bring over.

  The old sites kept no world ranking name, so a player is brought over with
  their name as it, as one added with none is (`addPlayer.feature`), less
  the brackets that end it (see below). That is so in a sport without world
  rankings as well, where a world ranking name given is kept as it is anywhere.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the blocks are imported
    And a tournament "tournaments/12" on "croquetscores.com" is imported

  Rule: Each player of a competition is added to the tournament

    Scenario: A player becomes a player in the tournament
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Sam Someone"

    Scenario: A player represents what they represented
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury Croquet Club"
      When the competition is imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" represents "Canterbury Croquet Club"

    Scenario: A player who represented nothing represents nothing
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents nothing
      When the competition is imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" represents nothing

    Scenario: A player with no world ranking name is brought over with their name as it
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the competition is imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A player of an American 6 Wicket tournament is brought over with their name as their world ranking name
      Given a tournament "tournaments/14" on "croquetscores.com" of the sport "a6w" is imported
      And the block "blocks/30" of "tournaments/14" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the competition is imported
      Then "Sam Someone" in the tournament kept for "tournaments/14" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: The players are listed in the order the old site listed them
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 7 is called "Sam Someone"
      And player 3 is called "Alex Other"
      When the competition is imported
      Then the first player of the tournament kept for "tournaments/12" on "croquetscores.com" is "Sam Someone"

  Rule: A player flies the flag of the country they represent, where it is one

    The old sites showed a flag beside a player who represented a country,
    found from what they represented: the country's name, or its code of two
    or three letters, in any case. England, Scotland and Wales had flags of
    their own. The same flag is flown here, and a player who represented a
    club, a region or nothing flies none.

    Scenario Outline: A player representing a country flies its flag
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "<representing>"
      When the competition is imported
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
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury Croquet Club"
      When the competition is imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" flies no flag

  Rule: A bye is no player

    The old sites entered a bye in a knockout as a player called "Bye", one
    for the whole tournament, standing in every place a bye was, and some
    managers entered more than one, as "Bye 1" and "Bye 2". The site enters a
    bye as a bye (`enterPlayer.feature`) and refuses a player named as one,
    as it says a player is (`TournamentPlayer.feature`): "bye", in any case, or
    "bye" numbered as "Bye 2", "Bye-2" and "Bye (2)" are. So every such player
    is left out of the tournament's players, and kept as the bye, so that a
    competition that names them puts a bye where they were
    (`ImportKnockouts.feature`). A name that only begins with the word, as
    "Byers" or "Bye / Bassett" does, is a player's like any other: there is a
    player called Bob Bye.

    Scenario Outline: A player named as a bye is not added
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "<name>"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no players

      Examples:
        | name  |
        | Bye   |
        | bye   |
        | BYE   |
        | Bye 1 |
        | Bye-2 |
        | Bye (3) |
        | Bye 10 |

    Scenario: Leaving a player named as a bye out is not refused
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Bye 1"
      When the competition is imported
      Then no error is kept for "croquetscores.com/blocks/30"

    Scenario: A name that only begins with the letters of "bye" is a player's
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Byers"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Byers"

    Scenario: A name that begins with the word "bye" is a player's
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Bye / Bassett"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Bye / Bassett"

    Scenario: Leaving a bye out is not refused
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "bye"
      When the competition is imported
      Then no error is kept for "croquetscores.com/blocks/30"

  Rule: A name too short to be accepted says it was imported, and is otherwise left as it was

    A player's name is a person's name, as a user's is, and is brought over
    as a user's is (`ImportUsers.feature`).

    Scenario: A name shorter than 3 characters says it was imported
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Al"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Al - Imported"

    Scenario: A name of 3 characters is left as it was
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Sam"

  Rule: A player's world ranking name is their name without the brackets and handicap that end it

    The old sites let a name end in brackets, as "Sam Someone (NZ)" or
    "Sam Someone (2)", or in a handicap, as "Tim Murphy 1" or "Tim Murphy -1",
    none of which is part of the name the world rankings know a person by. So
    a player's world ranking name is their name with what is in brackets at
    the end of it taken off, each group of them, and a handicap, and the
    space before. A handicap is a whole number, with a minus sign or without,
    set apart from the name by a space: a number joined to the last word is
    part of it. Their name is left as it was. What is in brackets elsewhere in
    the name is part of it, a name that is nothing but brackets or a handicap
    is left, and one that is too short without them says it was imported, as
    a name does.

    Scenario: A country in brackets is not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ)"
      When the competition is imported
      Then "Sam Someone (NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A number in brackets is not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (2)"
      When the competition is imported
      Then "Sam Someone (2)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A handicap in brackets is not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Tim Murphy (-1)"
      When the competition is imported
      Then "Tim Murphy (-1)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Tim Murphy"

    Scenario: A handicap after the name is not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Tim Murphy 1"
      When the competition is imported
      Then "Tim Murphy 1" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Tim Murphy"

    Scenario: A negative handicap after the name is not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Tim Murphy -1"
      When the competition is imported
      Then "Tim Murphy -1" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Tim Murphy"

    Scenario: A number joined to the last word is part of the name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Tim Murphy2"
      When the competition is imported
      Then "Tim Murphy2" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Tim Murphy2"

    Scenario: A name that is only a handicap is left
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "-12"
      When the competition is imported
      Then "-12" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "-12"

    Scenario: Every group of brackets that ends the name is taken off
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ) (2)"
      When the competition is imported
      Then "Sam Someone (NZ) (2)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A handicap after brackets is not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ) 2"
      When the competition is imported
      Then "Sam Someone (NZ) 2" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: Brackets after a handicap are not part of the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone 2 (NZ)"
      When the competition is imported
      Then "Sam Someone 2 (NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam Someone"

    Scenario: A plus sign before a number keeps the number in the world ranking name
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Tim Murphy +1"
      When the competition is imported
      Then "Tim Murphy +1" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Tim Murphy +1"

    Scenario: Brackets in the middle of a name are part of it
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam (Sammy) Someone"
      When the competition is imported
      Then "Sam (Sammy) Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Sam (Sammy) Someone"

    Scenario: A name that is only brackets is left
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "(NZ)"
      When the competition is imported
      Then "(NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "(NZ)"

    Scenario: A name too short without its brackets says it was imported
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Al (NZ)"
      When the competition is imported
      Then "Al (NZ)" in the tournament kept for "tournaments/12" on "croquetscores.com" has the world ranking name "Al - Imported"

    Scenario: A sport with no world rankings has the name without the brackets as the world ranking name
      Given a tournament "tournaments/14" on "croquetscores.com" of the sport "a6w" is imported
      And the block "blocks/30" of "tournaments/14" on "croquetscores.com"
      And player 1 is called "Sam Someone (NZ)"
      When the competition is imported
      Then "Sam Someone (NZ)" in the tournament kept for "tournaments/14" on "croquetscores.com" has the world ranking name "Sam Someone"

  Rule: Players of exactly one name are one player

    The old sites told players apart by their name and what they
    represented together, and a competition's list could hold one person
    more than once: the same name entered again, often for another club. The
    site tells players apart by name alone, and a tournament played by teams
    already takes a name a team has again as the player it was
    (`ImportTeamMatches.feature`). So players whose names are exactly the same,
    in one competition or in several, are one player, the first of them.

    A name in another case, or with a number in brackets after it, is not
    exactly the same name. The site refuses a name another player has in any
    case, so the second player of a name in another case is given the name
    followed by "(2)", the third by "(3)", and so on, and a manager can name
    them better.

    Scenario: Two players of one name are one player
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 1 player

    Scenario: Players of one name representing different clubs are one player
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 1 represents "Canterbury"
      And player 2 is called "Sam Someone"
      And player 2 represents "Otago"
      When the competition is imported
      Then "Sam Someone" in the tournament kept for "tournaments/12" on "croquetscores.com" represents "Canterbury"

    Scenario: Three players of one name are one player
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone"
      And player 3 is called "Sam Someone"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 1 player

    Scenario: A player between two of one name is another player
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Alex Another"
      And player 3 is called "Sam Someone"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 2 players

    Scenario: A name with a number after it is another player
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "Sam Someone (2)"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has 2 players

    Scenario: A name in another case is another player, numbered
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      And player 2 is called "sam someone"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "sam someone (2)"

  Rule: A player the site refuses is kept as an error, and the other players are added

    Scenario: A player with no name is kept as an error
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      When the competition is imported
      Then the error kept for "croquetscores.com/blocks/30" says "PersonName.Missing"

    Scenario: The error kept names the player refused
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      When the competition is imported
      Then the error kept for "croquetscores.com/blocks/30" says "player 1"

    Scenario: The players after one refused are added
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      And player 2 is called "Sam Someone"
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has the player "Sam Someone"

    Scenario: A player refused is not kept as any tournament player
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com"
      And player 1 is called ""
      When the competition is imported
      Then the tournament kept for "tournaments/12" on "croquetscores.com" has no players

  Rule: The players of a tournament played by teams are left for its team matches

    Scenario: A tournament played by teams is given no players
      Given a tournament "tournaments/13" on "croquetscores.com" of the type "teams" is imported
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the competition is imported
      Then the tournament kept for "tournaments/13" on "croquetscores.com" has no players

    Scenario: Leaving the players of a tournament played by teams is not refused
      Given a tournament "tournaments/13" on "croquetscores.com" of the type "teams" is imported
      And the block "blocks/30" of "tournaments/13" on "croquetscores.com"
      And player 1 is called "Sam Someone"
      When the competition is imported
      Then no error is kept for "croquetscores.com/blocks/30"
