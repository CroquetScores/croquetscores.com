@postgres
Feature: Moving a tournament's player up or down

  A manager of the tournament can move one of its players up or down a place,
  and the account they are signed in to is who moved them. The tournament and
  the player are each named by their id, and the way to move them is up or
  down. A tournament there is not is refused as `MovePlayer.NoSuchTournament`,
  a way that is neither up nor down is refused with `Request.Invalid` and
  `MovePlayer.NoSuchDirection`, and what the tournament refuses — a player it
  does not have, one who is archived, or any in an archived tournament — is
  the tournament's to refuse (`movePlayer.feature`). Only the tournament's
  managers can: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager` (`onlyManagers.feature`).

  Moving the first player up or the last down records nothing, since there is
  nowhere for them to go.

  A player moved in the tournament is not moved in the competitions they are
  already in: each competition's order is its own once its players are in it
  (`enterPlayer.feature`). The tournament's order is where a competition's
  starts, and a player entered after being moved is entered in the place they
  were moved to (`EnterPlayer.feature`).

  A forgotten account moves nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"

  Rule: A player moved is kept in their new place

    Scenario: A player moved up is kept first
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Spring Open" up
      Then the tournament's first player is "Alex Another"

    Scenario: A player moved down is kept second
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in "Spring Open" down
      Then the tournament's second player is "Sam Someone"

    Scenario: Moving the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Spring Open" up
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: Moving the first player up records nothing
      When the reader signed in to the account for "organiser@example.com" moves the player "Sam Someone" in "Spring Open" up
      Then nothing more is recorded of the tournament

  Rule: A player moved in the tournament keeps their place in a competition they are in

    Scenario: A player moved in the tournament is not moved in a competition
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Spring Open" up
      Then the first player of "Block A" of "Spring Open" is "Sam Someone"

  Rule: The way to move them is up or down

    Scenario: A way that is neither is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Spring Open" "sideways"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "MovePlayer.NoSuchDirection"

  Rule: What the tournament refuses is the tournament's to refuse

    Scenario: Moving an archived player is refused as the tournament refuses it
      Given "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Spring Open" up
      Then it is refused with "TournamentPlayer.Archived"

    Scenario: Moving a player the tournament does not have is refused as the tournament refuses it
      When the reader signed in to the account for "organiser@example.com" moves a player "Spring Open" does not have up
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: Moving a player in an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in "Spring Open" up
      Then it is refused with "Tournament.Archived"

  Rule: Only a player in a tournament there is can be moved

    Scenario: Moving a player in a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" moves the player "Alex Another" in a tournament there is not up
      Then it is refused with "MovePlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" moves the player "Alex Another" in "Spring Open" up
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" moves the player "Alex Another" in "Spring Open" up
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account moves nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account moves the player "Alex Another" in "Spring Open" up
      Then it is refused with "Account.Forgotten"
