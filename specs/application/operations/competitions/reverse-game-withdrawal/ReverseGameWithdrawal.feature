@postgres
Feature: Reversing the withdrawal of a score

  A manager or a scorer of the tournament reverses the withdrawal of a score,
  whoever withdrew it, and the account they are signed in to is who reversed
  it. The tournament, the competition and the game are each named by their
  id. The game then counts again, where it could be added now
  (`withdrawGame.feature`). Reversing the withdrawal of one that is not
  withdrawn records nothing. What the competition refuses — a game it does not
  have, a game whose players have played their match again without it, or one
  of whose players has withdrawn — is the competition's to refuse.

  It is asked of the tournament first, as withdrawing the score is
  (`WithdrawGame.feature`), a tournament there is not being refused as
  `ReverseGameWithdrawal.NoSuchTournament`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the block is to be the best of 3
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
    And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"

  Rule: A score whose withdrawal is reversed counts again

    Scenario: The score is no longer withdrawn
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" is not withdrawn

    Scenario: Reversing a withdrawal another made is recorded as done by whoever asked
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "scorer@example.com"

    Scenario: Reversing the withdrawal of a score not withdrawn records nothing
      Given "organiser@example.com" has reversed the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A score the competition does not have is refused as the competition refuses it
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of a score "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchGame"

    Scenario: A score whose players have played their match again is refused as the competition refuses it
      Given "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 5 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Competition.MatchDecided"

    Scenario: A score with a player who has withdrawn is refused as the competition refuses it
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "CompetitionPlayer.Withdrawn"

  Rule: Only a tournament there is has a score's withdrawal reversed

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of a tournament there is not
      Then it is refused with "ReverseGameWithdrawal.NoSuchTournament"

  Rule: Only a manager or a scorer of the tournament can ask for this

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" reverses the withdrawal of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManagerOrScorer"
