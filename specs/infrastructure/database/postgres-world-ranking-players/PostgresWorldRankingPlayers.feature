@postgres
Feature: Keeping the world ranking players in Postgres

  The players the world rankings know are kept in two tables, one for each
  sport, since the two lists are not the same players (`WorldRankingWebsite.feature`).
  They are kept rather than projected: nothing on the site records them as
  events, since they are the rankings' and not the site's. Both sports' are
  kept by world ranking number, as below, and an import brings them up to
  date. Both are imported by `ImportWorldRankingPlayers.feature`.

  A player is kept by their world ranking number, which the rankings keep for
  a player for good, so that a player whose name the rankings change is the
  same player with a new name rather than a new player. Each is given an
  identifier of the site's own. They are not replaced whole: a player the
  rankings no longer list is still a player the site has met, so is kept,
  archived, with the moment it was found missing. A player already archived
  is not archived again, so that the moment says when they were first missed.
  A player who is listed again is no longer archived.

  Golf croquet's are kept the same way as association croquet's, and held to
  the same scenarios, so the rules below are written for association croquet
  and again for golf croquet, with the sport's name the only difference. One
  difference remains: the rankings' golf croquet list has players of one name
  in different countries, so a golf croquet player is told apart by their name
  and their country together, where an association croquet player is told
  apart by name alone. Both are kept with the country they are from, and a
  player whose country the rankings change has changed. A golf croquet player given with no country is from
  England, which the scenarios do not mind.

  A tournament's players are kept with the id the site gave the rankings'
  player of the name they are known by (`TournamentContents.feature`), so
  keeping a sport's players looks for the id again of every player of a
  tournament of that sport. A player the rankings did not know when the tournament was told of
  them is found once the rankings do, one the rankings go on listing keeps
  their number, and a name that comes to be two players is looked for again by
  who the player represents and where the tournament is played.

  Keeping is done inside the import's transaction, so a reader asking for the
  players while it is under way still finds the ones kept before, until it is
  committed. Two imports at once keep one after the other rather than
  together, so that what is kept afterwards is one list whole rather than the
  two mixed, or neither.

  Background:
    Given the application's world ranking players

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

  Rule: An association croquet list with nobody on it changes nothing

    An empty list is no list the rankings would send, and archiving everybody
    for it would be the worst way to find out. The reading refuses one
    (`WorldRankingWebsite.feature`); this holds it to the same where the store
    is asked directly.

    Scenario: Nobody given archives nobody
      Given the association croquet player 3 called "Keith Aiton" has been given
      When no association croquet players are given
      Then the association croquet player 3 is not archived

  Rule: Golf croquet's players are kept by world ranking number

    Scenario: A player not kept before is kept
      When the golf croquet player 3 called "Keith Aiton" is given
      Then "Keith Aiton" is kept among the golf croquet players

    Scenario: A new player is given an identifier of the site's own
      When the golf croquet player 3 called "Keith Aiton" is given
      Then the golf croquet player 3 has an identifier that begins "gc-world-ranking-id/"

    Scenario: A new player's change is dated
      Given the moment "2026-10-08T10:00:00Z"
      When the golf croquet player 3 called "Keith Aiton" is given
      Then the golf croquet player 3 changed at "2026-10-08T10:00:00Z"

    Scenario: A player given again under the same name is not changed
      Given the moment "2026-10-08T10:00:00Z"
      And the golf croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the golf croquet player 3 called "Keith Aiton" is given
      Then the golf croquet player 3 changed at "2026-10-08T10:00:00Z"

    Scenario: A player given again keeps their identifier
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 3 called "Keith Aiton" is given
      Then the golf croquet player 3 has the identifier they had

    Scenario: A player given under another name is renamed
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 3 called "Keith Aitken" is given
      Then "Keith Aitken" is kept among the golf croquet players

    Scenario: A player given under another name is no longer kept under the old
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 3 called "Keith Aitken" is given
      Then "Keith Aiton" is not kept among the golf croquet players

    Scenario: A player given under another name has the change dated
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the golf croquet player 3 called "Keith Aitken" is given
      Then the golf croquet player 3 changed at "2026-10-09T10:00:00Z"

    Scenario: A player no longer given is still kept
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 4 called "Bill Aldridge" is given
      Then "Keith Aiton" is kept among the golf croquet players

    Scenario: A player no longer given is archived
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the golf croquet player 4 called "Bill Aldridge" is given
      Then the golf croquet player 3 archived at "2026-10-09T10:00:00Z"

    Scenario: A player no longer given has the change dated
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the golf croquet player 4 called "Bill Aldridge" is given
      Then the golf croquet player 3 changed at "2026-10-09T10:00:00Z"

    Scenario: A player given is not archived
      When the golf croquet player 3 called "Keith Aiton" is given
      Then the golf croquet player 3 is not archived

    Scenario: A player already archived is not archived again
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the moment "2026-10-09T10:00:00Z"
      And the golf croquet player 4 called "Bill Aldridge" has been given
      And the moment "2026-10-10T10:00:00Z"
      When the golf croquet player 4 called "Bill Aldridge" is given
      Then the golf croquet player 3 archived at "2026-10-09T10:00:00Z"

    Scenario: A player listed again is no longer archived
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the golf croquet player 4 called "Bill Aldridge" has been given
      When the golf croquet players 3 and 4 are given
      Then the golf croquet player 3 is not archived

    Scenario: A player listed again has the change dated
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the golf croquet player 4 called "Bill Aldridge" has been given
      And the moment "2026-10-11T10:00:00Z"
      When the golf croquet players 3 and 4 are given
      Then the golf croquet player 3 changed at "2026-10-11T10:00:00Z"

  Rule: A name is kept for one golf croquet player only

    A name another player already holds, archived or not, is refused as
    `WorldRankingLists.NameTaken` and nothing of the list is kept, since the
    site finds a player by name. It is refused even where the player holding
    it is renamed in the same list, which is rare and is told to the
    administrator to sort out rather than guessed at.

    Scenario: A name another player holds is refused
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 4 called "Keith Aiton" is given
      Then giving them is refused with "WorldRankingLists.NameTaken"

    Scenario: A name an archived player holds is refused
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the golf croquet player 4 called "Bill Aldridge" has been given
      When the golf croquet player 5 called "Keith Aiton" is given
      Then giving them is refused with "WorldRankingLists.NameTaken"

    Scenario: A refused list keeps nothing of it
      Given the golf croquet player 3 called "Keith Aiton" has been given
      And the golf croquet player 4 called "Keith Aiton" is to be given
      And the golf croquet player 5 called "Bill Aldridge" is to be given
      When those to be given are given
      Then "Bill Aldridge" is not kept among the golf croquet players

    Scenario: The refusal names the name taken
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 4 called "Keith Aiton" is given
      Then the refusal names the name taken "Keith Aiton"

  Rule: A golf croquet list with nobody on it changes nothing

    An empty list is no list the rankings would send, and archiving everybody
    for it would be the worst way to find out. The reading refuses one
    (`WorldRankingWebsite.feature`); this holds it to the same where the store
    is asked directly.

    Scenario: Nobody given archives nobody
      Given the golf croquet player 3 called "Keith Aiton" has been given
      When no golf croquet players are given
      Then the golf croquet player 3 is not archived

  Rule: An association croquet player is kept with their country

    Scenario: A player's country is kept
      When the association croquet player 3 called "Keith Aiton" from "nz" is given
      Then the association croquet player 3 is from "nz"

    Scenario: A player given again from another country is changed
      Given the moment "2026-10-08T10:00:00Z"
      And the association croquet player 3 called "Keith Aiton" from "england" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the association croquet player 3 called "Keith Aiton" from "wales" is given
      Then the association croquet player 3 changed at "2026-10-09T10:00:00Z"

    Scenario: A player given again from the same country is not changed
      Given the moment "2026-10-08T10:00:00Z"
      And the association croquet player 3 called "Keith Aiton" from "england" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the association croquet player 3 called "Keith Aiton" from "england" is given
      Then the association croquet player 3 changed at "2026-10-08T10:00:00Z"

  Rule: A name and country is kept for one golf croquet player only

    A name another player holds in the same country, archived or not, is
    refused as `WorldRankingLists.NameTaken`, as for association croquet. The
    same name in another country is another player.

    Scenario: A name another player holds in another country is kept
      Given the golf croquet player 3 called "Ivor Brand" from "england" is to be given
      And the golf croquet player 4 called "Ivor Brand" from "wales" is to be given
      When those to be given are given
      Then 2 golf croquet players are not archived

    Scenario: A name another player holds in the same country is refused
      Given the golf croquet player 3 called "Ivor Brand" from "england" has been given
      When the golf croquet player 4 called "Ivor Brand" from "england" is given
      Then giving them is refused with "WorldRankingLists.NameTaken"

    Scenario: A player's country is kept
      When the golf croquet player 3 called "Ivor Brand" from "wales" is given
      Then the golf croquet player 3 is from "wales"

    Scenario: A player given again from another country is changed
      Given the moment "2026-10-08T10:00:00Z"
      And the golf croquet player 3 called "Ivor Brand" from "england" has been given
      And the moment "2026-10-09T10:00:00Z"
      When the golf croquet player 3 called "Ivor Brand" from "wales" is given
      Then the golf croquet player 3 changed at "2026-10-09T10:00:00Z"

  Rule: Keeping a sport's players looks for the id of its tournaments' players again

    Scenario: An association croquet player the rankings did not know is given their number
      Given a player "Keith Aiton" of a tournament of the sport "ac" played in "au"
      When the association croquet player 3 called "Keith Aiton" is given
      Then the tournament player "Keith Aiton" is kept with the id of the association croquet player 3

    Scenario: A golf croquet player the rankings did not know is given their number
      Given a player "Ivor Brand" of a tournament of the sport "gc" played in "england"
      When the golf croquet player 4 called "Ivor Brand" from "england" is given
      Then the tournament player "Ivor Brand" is kept with the id of the golf croquet player 4

    Scenario: A player the rankings stop listing keeps their number
      Given a player "Keith Aiton" of a tournament of the sport "ac" played in "au"
      And the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet player 4 called "Bill Aldridge" is given
      Then the tournament player "Keith Aiton" is kept with the id of the association croquet player 3

    Scenario: A name that comes to be two players is told apart by who the player represents
      Given a player "Ivor Brand" representing "Wales" of a tournament of the sport "gc" played in "england"
      And the golf croquet player 4 called "Ivor Brand" from "england" has been given
      And the golf croquet player 4 called "Ivor Brand" from "england" is to be given
      And the golf croquet player 5 called "Ivor Brand" from "wales" is to be given
      When those to be given are given
      Then the tournament player "Ivor Brand" is kept with the id of the golf croquet player 5

    Scenario: A name that comes to be two players is told apart by where the tournament is played
      Given a player "Ivor Brand" of a tournament of the sport "gc" played in "england"
      And the golf croquet player 4 called "Ivor Brand" from "england" has been given
      And the golf croquet player 4 called "Ivor Brand" from "england" is to be given
      And the golf croquet player 5 called "Ivor Brand" from "wales" is to be given
      When those to be given are given
      Then the tournament player "Ivor Brand" is kept with the id of the golf croquet player 4

    Scenario: A name that comes to be two players with nothing to tell them apart has no number
      Given a player "Ivor Brand" of a tournament of the sport "gc" played in "au"
      And the golf croquet player 4 called "Ivor Brand" from "england" has been given
      And the golf croquet player 4 called "Ivor Brand" from "england" is to be given
      And the golf croquet player 5 called "Ivor Brand" from "wales" is to be given
      When those to be given are given
      Then the tournament player "Ivor Brand" is kept with no world ranking id

    Scenario: A tournament of the other sport is left as it was
      Given a player "Keith Aiton" of a tournament of the sport "ac" played in "au"
      When the golf croquet player 3 called "Keith Aiton" is given
      Then the tournament player "Keith Aiton" is kept with no world ranking id

  Rule: Keeping one sport's players leaves the other's

    Scenario: Giving association croquet's leaves golf croquet's
      Given the golf croquet player 3 called "Bill Arliss" has been given
      When the association croquet player 3 called "Keith Aiton" is given
      Then "Bill Arliss" is kept among the golf croquet players

    Scenario: Giving golf croquet's leaves association croquet's
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 3 called "Bill Arliss" is given
      Then "Keith Aiton" is kept among the association croquet players

    Scenario: A name the other sport holds is no reason to refuse
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the golf croquet player 4 called "Keith Aiton" is given
      Then "Keith Aiton" is kept among the golf croquet players

  Rule: Two keepings at once leave one list whole

    Scenario: Two keepings at once keep one list
      Given the association croquet player 3 called "Keith Aiton" has been given
      When the association croquet players 4 called "Bill Aldridge" and 5 called "Ian Brand" are given at once
      Then 1 association croquet player is not archived

    Scenario: Two keepings at once are both carried out
      When the golf croquet players 4 called "Bill Arliss" and 5 called "Ivor Brand" are given at once
      Then neither keeping was refused

    Scenario: Two keepings of golf croquet's at once keep one list
      Given the golf croquet player 3 called "Bill Arliss" has been given
      When the golf croquet players 4 called "Ivor Brand" and 5 called "Richard Brand" are given at once
      Then 1 golf croquet player is not archived

  Rule: A keeping not yet committed is not read

    Scenario: The players kept before are read while an association croquet keeping is under way
      Given the association croquet player 3 called "Keith Aiton" has been given
      And the association croquet player 4 called "Bill Aldridge" is being given
      When the association croquet players are read on another connection
      Then "Keith Aiton" is among the association croquet players read

    Scenario: The players kept before are read while a golf croquet keeping is under way
      Given the golf croquet player 3 called "Bill Arliss" has been given
      And the golf croquet player 4 called "Ivor Brand" is being given
      When the golf croquet players are read on another connection
      Then "Bill Arliss" is among the golf croquet players read
