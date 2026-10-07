@postgres
Feature: Keeping the world ranking players in Postgres

  The players the world rankings know are kept by their full names
  (`WorldRankingWebsite.feature`), each name once, in two tables, one for
  each sport, since the two lists are not the same players. They are kept
  rather than projected: nothing on the site records them as events, since
  they are the rankings' and not the site's, and an import replaces them whole
  (`ImportWorldRankingPlayers.feature`).

  Replacing a sport's players lets go of every player kept for it and keeps
  the players given. It is done inside the import's transaction, so a reader
  asking for the players while it is under way still finds the ones kept
  before, until it is committed. Two imports at once replace one after the
  other rather than together, so that what is kept afterwards is one list
  whole rather than the two mixed, or neither.

  Background:
    Given the application's world ranking players

  Rule: Replacing a sport's players keeps the players given

    Scenario: A player given is kept
      When the association croquet players are replaced with "Keith Aiton"
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: A player kept before and not given is let go
      Given the association croquet players have been replaced with "Bill Aldridge"
      When the association croquet players are replaced with "Keith Aiton"
      Then "Bill Aldridge" is not kept among the association croquet players

    Scenario: A name given twice is kept once
      When the golf croquet players are replaced with "Ivor Brand" twice
      Then 1 golf croquet player is kept

  Rule: Replacing one sport's players leaves the other's

    Scenario: Replacing association croquet's leaves golf croquet's
      Given the golf croquet players have been replaced with "Bill Arliss"
      When the association croquet players are replaced with "Keith Aiton"
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: Replacing golf croquet's leaves association croquet's
      Given the association croquet players have been replaced with "Keith Aiton"
      When the golf croquet players are replaced with "Bill Arliss"
      Then "Keith Aiton" is kept among the association croquet players

  Rule: Two replacings at once leave one list whole

    Scenario: Two replacings at once keep one list
      Given the association croquet players have been replaced with "Keith Aiton"
      When the association croquet players are replaced with "Bill Aldridge" and with "Raouf Allim" at once
      Then 1 association croquet player is kept

    Scenario: Two replacings at once are both carried out
      When the association croquet players are replaced with "Bill Aldridge" and with "Raouf Allim" at once
      Then neither replacing was refused

  Rule: A replacing not yet committed is not read

    Scenario: The players kept before are read while a replacing is under way
      Given the association croquet players have been replaced with "Keith Aiton"
      And the association croquet players are being replaced with "Bill Aldridge"
      When the association croquet players are read on another connection
      Then "Keith Aiton" is among the association croquet players read
