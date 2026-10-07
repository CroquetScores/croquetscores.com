@postgres
Feature: Finding the world ranking players a name typed may be

  A player's name and their world ranking name are typed into the player
  dialogs (`player.feature`, `team-player.feature`), and in a tournament of
  association or golf croquet each offers the players the world rankings know
  as it is typed, from the names imported for the tournament's sport
  (`ImportWorldRankingPlayers.feature`). Beside the world ranking name, a
  tick or a question mark says whether the world rankings know it.

  This is what is asked for both: the players whose names the typing may be
  the start of, and whether what was typed is a name the world rankings know.
  It is asked of one sport's players, by the sport's code, and a code that is
  not a sport with world rankings is refused as
  `WorldRankingPlayersMatching.NoSuchSport`. Whoever is signed in may ask,
  since every manager adds players, and the names are the world rankings'
  own, which they publish.

  A player is found where what was typed begins any word of their name,
  whatever its case, since a manager may start with either name: "kei" and
  "ait" both find "Keith Aiton". A hyphen parts the words of a name as a space
  does, so "thomas" finds "Pat Asa-Thomas". What was typed is taken as it was
  typed, with the spaces at either end left off, and no character in it
  stands for any other. Fewer than two characters find nobody, since one
  letter begins the names of thousands of players. At most ten are found, in
  alphabetical order, since a list is for choosing from at a glance, and a
  manager who has not found their player types more.

  A name is known where the world rankings have it exactly, spelled and
  capitalised as they spell it, with the spaces at either end left off:
  the world rankings know a player only by their name as they write it.

  These scenarios run against Postgres, with the players kept in the tables
  the import keeps them in.

  Background:
    Given the application's finding of world ranking players
    And the association croquet players include "Keith Aiton"
    And the association croquet players include "Bill Aldridge"
    And the association croquet players include "Pat Asa-Thomas"
    And the golf croquet players include "Bill Arliss"

  Rule: A player is found by the start of any word of their name, whatever its case

    Scenario: The start of a first name finds the player
      When the association croquet players matching "kei" are found
      Then "Keith Aiton" is found

    Scenario: The start of a surname finds the player
      When the association croquet players matching "ait" are found
      Then "Keith Aiton" is found

    Scenario: The start of a word after a hyphen finds the player
      When the association croquet players matching "thomas" are found
      Then "Pat Asa-Thomas" is found

    Scenario: Capitals find the player
      When the association croquet players matching "KEI" are found
      Then "Keith Aiton" is found

    Scenario: The whole name finds the player
      When the association croquet players matching "Keith Aiton" are found
      Then "Keith Aiton" is found

    Scenario: The middle of a word finds nobody
      When the association croquet players matching "eith" are found
      Then "Keith Aiton" is not found

    Scenario: A name the typing does not begin is not found
      When the association croquet players matching "kei" are found
      Then "Bill Aldridge" is not found

    Scenario: The spaces around what was typed do not count
      When the association croquet players matching "  kei  " are found
      Then "Keith Aiton" is found

    Scenario: A character that stands for any other elsewhere stands for itself
      When the association croquet players matching "k_ith" are found
      Then nobody is found

    Scenario: A character that stands for any number elsewhere stands for itself
      When the association croquet players matching "%ton" are found
      Then nobody is found

  Rule: A sport's players are found among its own

    Scenario: Golf croquet's players are found among golf croquet's
      When the golf croquet players matching "bil" are found
      Then "Bill Arliss" is found

    Scenario: Association croquet's players are not found among golf croquet's
      When the golf croquet players matching "bil" are found
      Then "Bill Aldridge" is not found

    Scenario: A sport without world rankings is refused
      When the players matching "kei" are found for the sport "rc"
      Then finding them is refused with "WorldRankingPlayersMatching.NoSuchSport"

  Rule: Fewer than two characters find nobody

    Scenario: One character finds nobody
      When the association croquet players matching "k" are found
      Then nobody is found

    Scenario: Two characters find a player
      When the association croquet players matching "ke" are found
      Then "Keith Aiton" is found

    Scenario: One character with spaces around it finds nobody
      When the association croquet players matching " k " are found
      Then nobody is found

  Rule: At most ten are found, in alphabetical order

    Scenario: The players found are in alphabetical order
      When the association croquet players matching "bi" are found
      Then the first found is "Bill Aldridge"

    Scenario: No more than ten are found
      Given the association croquet players include 12 players with the surname "Smith"
      When the association croquet players matching "smith" are found
      Then 10 are found

  Rule: A name the world rankings have exactly is known

    Scenario: A name the world rankings have is known
      When the association croquet players matching "Keith Aiton" are found
      Then the name is known

    Scenario: A name with spaces around it is known
      When the association croquet players matching " Keith Aiton " are found
      Then the name is known

    Scenario: A name capitalised otherwise is not known
      When the association croquet players matching "keith aiton" are found
      Then the name is not known

    Scenario: The start of a name is not known
      When the association croquet players matching "Keith" are found
      Then the name is not known

    Scenario: A name only another sport has is not known
      When the golf croquet players matching "Keith Aiton" are found
      Then the name is not known
