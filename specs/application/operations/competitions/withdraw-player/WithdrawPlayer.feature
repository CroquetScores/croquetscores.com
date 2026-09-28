@postgres
Feature: Withdrawing a competition's player, and reversing it

  A manager of the tournament withdraws a player who will play no more of a
  competition, and reverses the withdrawal of one who will, and the account
  they are signed in to is who did. The tournament, the competition and the
  player are each named by their id. A player withdrawn is put last, and keeps
  that place when their withdrawal is reversed (`withdrawPlayer.feature`),
  but for a knockout, where they keep their place in the draw, as the
  tournament says it is one.
  Withdrawing one who has withdrawn, or reversing the withdrawal of one who
  has not, records nothing. A player the competition does not have is the
  competition's to refuse.

  It is asked of the tournament first, as entering a player is
  (`EnterPlayer.feature`): only a manager can, anybody else, a scorer among
  them, being refused with `Tournament.NotAManager`; an archived tournament is
  refused with `Tournament.Archived`, a competition the tournament does not
  have with `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `WithdrawPlayer.NoSuchTournament` or `ReverseWithdrawal.NoSuchTournament`;
  and a forgotten account with `Account.Forgotten`.

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

  Rule: A player withdrawn is kept withdrawn, and last

    Scenario: The player withdrawn has withdrawn
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then the player "Sam Someone" in "Block A" of "Spring Open" has withdrawn

    Scenario: The player withdrawn comes after the players still playing
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then the first player of "Block A" of "Spring Open" is "Alex Another"

    Scenario: A player withdrawn from a knockout keeps their place in the draw
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Final Stage" of "Spring Open"
      Then the first player of "Final Stage" of "Spring Open" is "Sam Someone"

    Scenario: Withdrawing the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

    Scenario: Withdrawing a withdrawn player records nothing
      Given "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

  Rule: A withdrawal reversed is kept reversed

    Scenario: The player whose withdrawal is reversed has not withdrawn
      Given "organiser@example.com" has withdrawn the player "Sam Someone" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the player "Sam Someone" in "Block A" of "Spring Open"
      Then the player "Sam Someone" in "Block A" of "Spring Open" has not withdrawn

    Scenario: Reversing the withdrawal of a player who has not withdrawn records nothing
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the player "Sam Someone" in "Block A" of "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A player the competition does not have is refused as the competition refuses them
      When the reader signed in to the account for "organiser@example.com" withdraws a player "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: Reversing the withdrawal of a player the competition does not have is refused
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of a player "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, can have this done

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" withdraws the player "Sam Someone" in "Block A" of a tournament there is not
      Then it is refused with "WithdrawPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account does nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account withdraws the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"

  Rule: Only a manager of the tournament can reverse a withdrawal

    Scenario: A reader who does not manage the tournament is refused a reversal
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" reverses the withdrawal of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused a reversal
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" reverses the withdrawal of the player "Sam Someone" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"
