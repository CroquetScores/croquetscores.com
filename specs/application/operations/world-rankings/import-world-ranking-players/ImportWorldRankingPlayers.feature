@postgres
Feature: Importing the players the world rankings know

  The world rankings keep a list of every player they know, one for
  association croquet and one for golf croquet, each a file on the world
  rankings' own site. An administrator imports both from the page for it
  (`importWorldRankingPlayers.feature`), so that the site has the players
  the rankings know without asking the rankings every time it wants one.
  Only an administrator can: anybody else is refused with
  `Account.NotAnAdministrator`, before anything is read. A forgotten account
  holds no role (`asker.feature`), so it is refused the same way.

  A golf croquet player is kept by their full name, which is all that is read
  of them, and each name once. An association croquet player is kept by their
  world ranking number as well as their name (`WorldRankingWebsite.feature`).
  Each sport's players
  are kept apart from the other's, since the two lists are not the same
  players. Association croquet's are read and kept
  first, and golf croquet's after them.

  A list is read in full before anything is done with it. Only a list read
  in full, with every line in it read, is kept. Golf croquet's replaces the
  players kept before, so that what is kept is the list as the rankings have
  it now. Association croquet's is kept by world ranking number
  (`PostgresWorldRankingPlayers.feature`): a player named on it who is new
  is added, one whose name has changed is renamed, and one no longer on it is
  archived rather than let go, with the moment of the import. A list
  that cannot be read, whatever the reason, leaves its sport's players as
  they were, and the other sport's list is still read and kept. Players kept
  as they were are out of date by however long it has been since the last
  import, which is better than being left with half a list or none.

  The import says how it goes as it goes, since reading two lists from
  another site takes as long as that site takes, and the administrator who
  asked is waiting on it. For each sport in turn it says that the list is
  being read, then either how many players were read and then that they were
  kept, or that the list could not be read and why, by its code. Last of all
  it says it has finished.

  An association croquet list that gives one full name to two players,
  whatever their numbers, is not kept, because the site finds a player by
  name and could not tell the two apart (`WorldRankingWebsite.feature`). It is
  refused with `WorldRankingLists.DuplicateNames` like any other list that
  cannot be read, so its sport's players stay as they were, and it is also
  logged as an error and told to the administrator of the site, once for the
  import and naming every name given twice with its numbers, so that
  whoever has to correct the list at the rankings is told what to correct.
  It is told every time an import finds it, not only the first. A list that
  renames a player to a name the site keeps for another is refused the same
  way, with `WorldRankingLists.NameTaken`, and told in the same way. Where the
  administrator cannot be emailed, the refusal is still reported and the other
  sport's list is still kept.

  These scenarios run against Postgres, with the application's event store,
  and with a fake of the world rankings' site in place of the real one.

  Background:
    Given the application's accounts
    And the moment "2026-10-08T10:00:00Z"
    And "admin@example.com" has an account, confirmed, called "Ada Administrator"
    And "admin@example.com" has been given the role "Administrator"
    And "organiser@example.com" has an account, confirmed, called "Olive Organiser"
    And a fake of the world rankings
    And the administrator of the site is at "administrator@example.com"
    And the association croquet list names "Keith Aiton"
    And the association croquet list names "Bill Aldridge"
    And the golf croquet list names "Bill Arliss"

  Rule: Only an administrator can import the players

    Scenario: Anybody else is refused
      When the reader signed in to the account for "organiser@example.com" imports the world ranking players
      Then the import is refused with "Account.NotAnAdministrator"

    Scenario: Anybody else is refused before anything is read
      When the reader signed in to the account for "organiser@example.com" imports the world ranking players
      Then nothing was asked of the world rankings

    Scenario: An administrator whose role has been taken away is refused
      Given "admin@example.com" has had the role "Administrator" taken away
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import is refused with "Account.NotAnAdministrator"

    Scenario: A world ranking officer who is not an administrator is refused
      Given "organiser@example.com" has been given the role "AC World Ranking Officer"
      When the reader signed in to the account for "organiser@example.com" imports the world ranking players
      Then the import is refused with "Account.NotAnAdministrator"

  Rule: A list read in full replaces the players kept for its sport

    Scenario: A player on the association croquet list is kept
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: A player on the golf croquet list is kept
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: A player on one sport's list is not kept among the other's
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Arliss" is not kept among the association croquet players

    Scenario: Every player on a list is kept
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then 2 association croquet players are kept

    Scenario: An association croquet player no longer on the list is archived
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Aldridge" is archived among the association croquet players

    Scenario: A golf croquet player no longer on the list is no longer kept
      Given the world ranking players have been imported
      And the golf croquet list no longer names "Bill Arliss"
      And the golf croquet list names "Richard Brand"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Arliss" is not kept among the golf croquet players

    Scenario: An association croquet player whose name has changed is renamed
      Given the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Keith Aitken"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Keith Aitken" is kept among the association croquet players

    Scenario: A renamed association croquet player is not kept under the old name
      Given the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Keith Aitken"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Keith Aiton" is not kept among the association croquet players

    Scenario: Importing again keeps each player once
      Given the world ranking players have been imported
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then 2 association croquet players are kept

  Rule: A list that cannot be read leaves its sport's players as they were

    Scenario: A list the world rankings do not answer leaves its players as they were
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the world rankings answer the association croquet list with a failure
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Aldridge" is not archived among the association croquet players

    Scenario: A list with a line that cannot be read leaves its players as they were
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the association croquet list has a line that cannot be read
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Aldridge" is not archived among the association croquet players

    Scenario: A list that cannot be read does not stop the other being kept
      Given the world rankings answer the association croquet list with a failure
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: The golf croquet list that cannot be read leaves its players as they were
      Given the world ranking players have been imported
      And the golf croquet list names "Richard Brand"
      And the world rankings answer the golf croquet list with a failure
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Richard Brand" is not kept among the golf croquet players

  Rule: An association croquet list that gives one name to two players is not kept, and is told

    Scenario: The players kept before are left as they were
      Given the world ranking players have been imported
      And the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Aldridge" is not archived among the association croquet players

    Scenario: The list is said to be refused for its duplicate names
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's second report is that the association croquet list was refused with "WorldRankingLists.DuplicateNames"

    Scenario: The golf croquet list is still kept
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: An error is logged
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then an error was logged naming "Keith Aiton"

    Scenario: The administrator of the site is emailed
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the administrator of the site was emailed once about duplicate names

    Scenario: The email names the full name given twice
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the email to the administrator names "Keith Aiton"

    Scenario: The email names both world ranking numbers
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the email to the administrator names the world ranking number 1

    Scenario: The email names the other world ranking number
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the email to the administrator names the world ranking number 4

    Scenario: A list that cannot be told of still lets the other be kept
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      And the administrator cannot be emailed
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: The administrator is emailed again by the next import that finds it
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      And the world ranking players have been imported
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the administrator of the site was emailed twice about duplicate names

    Scenario: A list with no duplicate names is not told
      Given the association croquet list names "Keith Aiton" again with another world ranking number
      And the association croquet list no longer names "Keith Aiton"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the administrator of the site was not emailed about duplicate names

  Rule: An association croquet list that renames a player to a name another holds is not kept

    Scenario: A player renamed to the name an archived player holds is refused
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Bill Aldridge"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's third report is that the association croquet list was refused with "WorldRankingLists.NameTaken"

    Scenario: The players kept before are left as they were
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Bill Aldridge"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then "Keith Aiton" is not archived among the association croquet players

    Scenario: An error is logged naming the name taken
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Bill Aldridge"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then an error was logged naming "Bill Aldridge"

    Scenario: The administrator of the site is emailed
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Bill Aldridge"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the administrator of the site was emailed once about a name taken

    Scenario: The email names the name taken
      Given the world ranking players have been imported
      And the association croquet list no longer names "Bill Aldridge"
      And the world ranking players have been imported
      And the association croquet list names the player who was "Keith Aiton" as "Bill Aldridge"
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the email to the administrator names "Bill Aldridge"

  Rule: The import says how it goes, as it goes

    Scenario: The import first says the association croquet list is being read
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's first report is that the association croquet list is being read

    Scenario: The import then says how many association croquet players were read
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's second report is that 2 association croquet players were read

    Scenario: The import then says the association croquet players were kept
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's third report is that 2 association croquet players were kept

    Scenario: The import then says the golf croquet list is being read
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's fourth report is that the golf croquet list is being read

    Scenario: The import then says how many golf croquet players were read
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's fifth report is that 1 golf croquet player was read

    Scenario: The import then says the golf croquet players were kept
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's sixth report is that 1 golf croquet player was kept

    Scenario: The import says last that it has finished
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's last report is that it has finished

    Scenario: A list that cannot be read is said to be, by its code
      Given the world rankings answer the association croquet list with a failure
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's second report is that the association croquet list was refused with "WorldRankingLists.Unreachable"

    Scenario: A list that cannot be read is followed by the other being read
      Given the world rankings answer the association croquet list with a failure
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's third report is that the golf croquet list is being read

    Scenario: An import with a list that cannot be read still finishes
      Given the world rankings answer the association croquet list with a failure
      When the reader signed in to the account for "admin@example.com" imports the world ranking players
      Then the import's last report is that it has finished

    Scenario: A refused import says nothing
      When the reader signed in to the account for "organiser@example.com" imports the world ranking players
      Then the import made no reports
