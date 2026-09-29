@postgres
Feature: Removing a competition's player

  A manager of the tournament removes a player entered in a competition by
  mistake, and the account they are signed in to is who removed them. The
  tournament, the competition and the player are each named by their id. A
  player removed is gone, and can be entered again (`removePlayer.feature`).
  What the competition refuses — a player it does not have, one who has
  withdrawn, one who has games, or anybody in a knockout that has a game — is
  the competition's to refuse. The tournament says what kind of competition 
  it is.

  It is asked of the tournament first, as entering a player is
  (`EnterPlayer.feature`): only a manager can, anybody else, a scorer among
  them, being refused with `Tournament.NotAManager`; an archived tournament is
  refused with `Tournament.Archived`, a competition the tournament does not
  have with `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `RemovePlayer.NoSuchTournament`; and a forgotten account with
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

  Rule: A player removed is no longer in the competition

    Scenario: The player removed is not one of the competition's players
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

    Scenario: The player removed can be entered again
      Given "organiser@example.com" has removed the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"

    Scenario: Removing the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A withdrawn player is refused as the competition refuses them
      Given "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A player with games is refused as the competition refuses them
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "CompetitionPlayer.HasGames"

    Scenario: A player in a knockout with a game is refused as the competition refuses them
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" removes the player "Chris Third" in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.DrawFixed"

    Scenario: A player the competition does not have is refused as the competition refuses them
      When the reader signed in to the account for "organiser@example.com" removes a player "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: A bye is removed by its place in the order

    A bye has the id whose every digit is 0, as every bye does, so it is named
    by its order in the competition (`removePlayer.feature`).

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"

    Scenario: A bye removed is no longer in the competition
      When the reader signed in to the account for "organiser@example.com" removes the second player of "Final Stage" of "Spring Open"
      Then the competition "Final Stage" of "Spring Open" has 0 byes

    Scenario: A bye no longer at that place is refused
      When the reader signed in to the account for "organiser@example.com" removes the bye with the order 15000 in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, can have this done

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" removes the player "Sam Someone" in "Block A" of a tournament there is not
      Then it is refused with "RemovePlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account does nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account removes the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
