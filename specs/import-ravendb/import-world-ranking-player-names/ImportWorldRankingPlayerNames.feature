@postgres
Feature: Importing the world ranking player names once the old sites are over

  The import empties the site's database before it brings anything over, and
  the players the world rankings know, imported from the administrator's page
  (`ImportWorldRankingPlayers.feature`), are emptied with it. Until an
  administrator pressed Import again, the player dialogs would offer nobody
  and question every world ranking name (`player.feature`). So the import
  imports them itself, last of all, once every old site and the site's roles
  are over.

  It reads the world rankings' two lists as the administrator's page does,
  and keeps them by the same rules (`WorldRankingWebsite.feature`): each list
  read in full, association croquet's first, and only a list with every line
  read kept. Nobody asks for it but the import, so nobody is asked whether
  they are an administrator.

  A list that cannot be read is named, with the code it was refused with,
  and counted among the import's errors, since the import is otherwise done
  and a list that was not read is something whoever ran it has to see to. The
  other sport's list is still read and kept, and the import goes on to finish.

  These scenarios run against Postgres, with a fake of the world rankings'
  site in place of the real one.

  Background:
    Given a fake of the world rankings
    And the association croquet list names "Keith Aiton"
    And the golf croquet list names "Bill Arliss"
    And the world ranking player names are to be imported

  Rule: Both lists are read and kept

    Scenario: The association croquet players are kept
      When the world ranking player names are imported
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: The golf croquet players are kept
      When the world ranking player names are imported
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: Lists read in full are not named
      When the world ranking player names are imported
      Then no list is named as not read

  Rule: A list that cannot be read is named, and the other is kept

    Scenario: A list that cannot be read is named
      Given the world rankings answer the association croquet list with a failure
      When the world ranking player names are imported
      Then the association croquet list is named as not read

    Scenario: A list that cannot be read is named with its code
      Given the world rankings answer the association croquet list with a failure
      When the world ranking player names are imported
      Then the association croquet list is named with "WorldRankingLists.Unreachable"

    Scenario: The list that was read is not named
      Given the world rankings answer the association croquet list with a failure
      When the world ranking player names are imported
      Then the golf croquet list is not named as not read

    Scenario: The other list is kept all the same
      Given the world rankings answer the association croquet list with a failure
      When the world ranking player names are imported
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: A list with a line that cannot be read keeps none of it
      Given the golf croquet list has a line that cannot be read
      When the world ranking player names are imported
      Then "Bill Arliss" is not kept among the golf croquet players

    Scenario: A list with a line that cannot be read is named with its code
      Given the golf croquet list has a line that cannot be read
      When the world ranking player names are imported
      Then the golf croquet list is named with "WorldRankingLists.Unreadable"
