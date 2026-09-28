@postgres
Feature: Moving a competition's player up or down

  A manager of the tournament moves one of a competition's players up or down
  a place, and the account they are signed in to is who moved them. The
  tournament, the competition and the player are each named by their id, and
  the way to move is up or down. A way that is neither is refused with
  `Request.Invalid` and `MoveCompetitionPlayer.NoSuchDirection`. What the
  competition refuses — a player it does not have, one who has withdrawn, or
  anybody in a knockout that has a game — is the competition's to refuse
  (`movePlayer.feature`). The tournament says what kind of competition it 
  is. Moving the first up or the last down records nothing, since there is 
  nowhere for them to go.

  It is called moving a competition's player, rather than moving a player, so
  that it is not taken for moving a tournament's player
  (`MovePlayer.feature`), which puts the player in the tournament's order and
  not in a competition's.

  It is asked of the tournament first, as entering a player is
  (`EnterPlayer.feature`): only a manager can, anybody else, a scorer among
  them, being refused with `Tournament.NotAManager`; an archived tournament is
  refused with `Tournament.Archived`, a competition the tournament does not
  have with `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `MoveCompetitionPlayer.NoSuchTournament`; and a forgotten account with
  `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: A player moved is kept in their new place

    Scenario: A player moved up is kept first
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Block A" of "Spring Open" up
      Then the first player of "Block A" of "Spring Open" is "Alex Another"

    Scenario: A player moved down is kept second
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in "Block A" of "Spring Open" down
      Then the first player of "Block A" of "Spring Open" is "Alex Another"

    Scenario: Moving the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Block A" of "Spring Open" up
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

  Rule: The way to move is up or down

    Scenario: A way that is neither is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Block A" of "Spring Open" "sideways"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "MoveCompetitionPlayer.NoSuchDirection"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A player in a knockout with a game is refused as the competition refuses them
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Chris Third" in "Final Stage" of "Spring Open" up
      Then it is refused with "Competition.DrawFixed"

    Scenario: A withdrawn player is refused as the competition refuses them
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Block A" of "Spring Open" up
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A player the competition does not have is refused as the competition refuses them
      When the reader signed in to the account for "organiser@example.com" moves a player "Block A" of "Spring Open" does not have up
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, can have this done

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in a competition "Spring Open" does not have up
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in "Block A" of "Spring Open" up
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in "Block A" of "Spring Open" up
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in "Block A" of a tournament there is not up
      Then it is refused with "MoveCompetitionPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" moves the player "Sam Someone" in "Block A" of "Spring Open" up
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" moves the player "Sam Someone" in "Block A" of "Spring Open" up
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account does nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account moves the player "Sam Someone" in "Block A" of "Spring Open" up
      Then it is refused with "Account.Forgotten"
