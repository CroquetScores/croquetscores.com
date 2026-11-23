@postgres
Feature: Keeping the world ranking players in Postgres

  The players the world rankings know are kept in two tables, one for each
  sport, since the two lists are not the same players (`WorldRankingWebsite.feature`).
  They are kept rather than projected: nothing on the site records them as
  events, since they are the rankings' and not the site's. Golf croquet's are
  kept by their full names, each once, and an import replaces them whole.
  Association croquet's are kept by world ranking number, as below, and an
  import brings them up to date. Both are imported by
  `ImportWorldRankingPlayers.feature`.

  Association croquet's players are kept by their world ranking number, which
  the rankings keep for a player for good, so that a player whose name the
  rankings change is the same player with a new name rather than a new
  player. Each is given an identifier of the site's own. They are not
  replaced whole: a player the rankings no longer list is still a player the
  site has met, so is kept, archived, with the moment it was found missing. A
  player already archived is not archived again, so that the moment says when
  they were first missed. A player who is listed again is no longer archived.

  Replacing golf croquet's players lets go of every player kept for it and keeps
  the players given. It is done inside the import's transaction, so a reader
  asking for the players while it is under way still finds the ones kept
  before, until it is committed. Two imports at once replace one after the
  other rather than together, so that what is kept afterwards is one list
  whole rather than the two mixed, or neither.

  Background:
    Given the application's world ranking players

  Rule: Replacing golf croquet's players keeps the players given

    Scenario: A player given is kept
      When the golf croquet players are replaced with "Bill Arliss"
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: A player kept before and not given is let go
      Given the golf croquet players have been replaced with "Bill Arliss"
      When the golf croquet players are replaced with "Ivor Brand"
      Then "Bill Arliss" is not kept among the golf croquet players

    Scenario: A name given twice is kept once
      When the golf croquet players are replaced with "Ivor Brand" twice
      Then 1 golf croquet player is kept

  Rule: Association croquet's players are kept by world ranking number

    Scenario: A player not kept before is kept
      When the association croquet player 3 called "Keith Aiton" is given
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: A new player is given an identifier of the site's own
      When the association croquet player 3 called "Keith Aiton" is given
      Then the association croquet player 3 has an identifier that begins "ac-world-ranking-id/"

    Scenario: A new player's change is dated
      Given the moment "2026-10-08T10:00:00Z"
      When the association croquet player 3 called "Keith Aiton" is given
      Then the association croquet player 3 changed at "2026-10-08T10:00:00Z"

    Scenario: A player given again under the same name is not changed
      Given the moment "2026-10-08T10:00:00Z"
      And the association croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the association croquet player 3 called "Keith Aiton" is given
      Then the association croquet player 3 changed at "2026-10-08T10:00:00Z"

    Scenario: A player given again keeps their identifier
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 3 called "Keith Aiton" is given
      Then the association croquet player 3 has the identifier they had

    Scenario: A player given under another name is renamed
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 3 called "Keith Aitken" is given
      Then "Keith Aitken" is kept among the association croquet players

    Scenario: A player given under another name is no longer kept under the old
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 3 called "Keith Aitken" is given
      Then "Keith Aiton" is not kept among the association croquet players

    Scenario: A player given under another name has the change dated
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the association croquet player 3 called "Keith Aitken" is given
      Then the association croquet player 3 changed at "2026-10-09T10:00:00Z"

    Scenario: A player no longer given is still kept
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 4 called "Bill Aldridge" is given
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: A player no longer given is archived
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the association croquet player 4 called "Bill Aldridge" is given
      Then the association croquet player 3 archived at "2026-10-09T10:00:00Z"

    Scenario: A player no longer given has the change dated
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the association croquet player 4 called "Bill Aldridge" is given
      Then the association croquet player 3 changed at "2026-10-09T10:00:00Z"

    Scenario: A player given is not archived
      When the association croquet player 3 called "Keith Aiton" is given
      Then the association croquet player 3 is not archived

    Scenario: A player already archived is not archived again
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      And the association croquet player 4 called "Bill Aldridge" has been given
      And the moment "2026-10-10T10:00:00Z"
      When the association croquet player 4 called "Bill Aldridge" is given
      Then the association croquet player 3 archived at "2026-10-09T10:00:00Z"

    Scenario: A player listed again is no longer archived
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the association croquet player 4 called "Bill Aldridge" has been given
      When the association croquet players 3 and 4 are given
      Then the association croquet player 3 is not archived

    Scenario: A player listed again has the change dated
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the association croquet player 4 called "Bill Aldridge" has been given
      And the moment "2026-10-11T10:00:00Z"
      When the association croquet players 3 and 4 are given
      Then the association croquet player 3 changed at "2026-10-11T10:00:00Z"

  Rule: A name is kept for one association croquet player only

    A name another player already holds, archived or not, is refused as
    `WorldRankingLists.NameTaken` and nothing of the list is kept, since the
    site finds a player by name. It is refused even where the player holding
    it is renamed in the same list, which is rare and is told to the
    administrator to sort out rather than guessed at.

    Scenario: A name another player holds is refused
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 4 called "Keith Aiton" is given
      Then giving them is refused with "WorldRankingLists.NameTaken"

    Scenario: A name an archived player holds is refused
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the association croquet player 4 called "Bill Aldridge" has been given
      When the association croquet player 5 called "Keith Aiton" is given
      Then giving them is refused with "WorldRankingLists.NameTaken"

    Scenario: A refused list keeps nothing of it
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the association croquet player 4 called "Keith Aiton" is to be given
      And the association croquet player 5 called "Bill Aldridge" is to be given
      When those to be given are given
      Then "Bill Aldridge" is not kept among the association croquet players

    Scenario: The refusal names the name taken
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 4 called "Keith Aiton" is given
      Then the refusal names the name taken "Keith Aiton"

  Rule: A list with nobody on it changes nothing

    An empty list is no list the rankings would send, and archiving everybody
    for it would be the worst way to find out. The reading refuses one
    (`WorldRankingWebsite.feature`); this holds it to the same where the store
    is asked directly.

    Scenario: Nobody given archives nobody
      Given the association croquet player 3 called "Keith Aiton" has been given
      When no association croquet players are given
      Then the association croquet player 3 is not archived

  Rule: Keeping one sport's players leaves the other's

    Scenario: Giving association croquet's leaves golf croquet's
      Given the golf croquet players have been replaced with "Bill Arliss"
      When the association croquet player 3 called "Keith Aiton" is given
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: Replacing golf croquet's leaves association croquet's
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the golf croquet players are replaced with "Bill Arliss"
      Then "Keith Aiton" is kept among the association croquet players

  Rule: Two replacings at once leave one list whole

    Scenario: Two replacings at once keep one list
      Given the golf croquet players have been replaced with "Bill Arliss"
      When the golf croquet players are replaced with "Ivor Brand" and with "Richard Brand" at once
      Then 1 golf croquet player is kept

    Scenario: Two replacings at once are both carried out
      When the golf croquet players are replaced with "Ivor Brand" and with "Richard Brand" at once
      Then neither replacing was refused

  Rule: A replacing not yet committed is not read

    Scenario: The players kept before are read while a replacing is under way
      Given the golf croquet players have been replaced with "Bill Arliss"
      And the golf croquet players are being replaced with "Ivor Brand"
      When the golf croquet players are read on another connection
      Then "Bill Arliss" is among the golf croquet players read
