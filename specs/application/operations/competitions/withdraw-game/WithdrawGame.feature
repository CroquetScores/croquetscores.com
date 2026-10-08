@postgres
Feature: Withdrawing a score that is not to count

  A manager or a scorer of the tournament withdraws the score of a game that
  was played but is not to count, whoever entered it, since a score is the
  tournament's and not the scorer's, and the account they are signed in to is
  who withdrew it. The tournament, the competition and the game are each named
  by their id. A withdrawn game no longer counts, but is still listed as
  played, and its withdrawal can be reversed (`withdrawGame.feature`).
  Withdrawing one that is withdrawn records nothing. What the competition
  refuses — a game it does not have, a game of a knockout or a test, or an
  archived game — is the competition's to refuse.

  It is asked of the tournament first, as archiving a score is
  (`ArchiveGame.feature`): only a manager or a scorer can, since a score left
  out of the standings is part of keeping the scores, anybody else being
  refused with `Tournament.NotAManagerOrScorer`; an archived tournament is
  refused with `Tournament.Archived`, a competition the tournament does not
  have with `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `WithdrawGame.NoSuchTournament`; and a forgotten account with
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
    And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"

  Rule: A score withdrawn is kept withdrawn

    Scenario: The score withdrawn is withdrawn
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" is withdrawn

    Scenario: Withdrawing a score another entered is recorded as done by whoever asked
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "scorer@example.com"

    Scenario: A scorer of the tournament withdraws a score
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" is withdrawn

    Scenario: Withdrawing a withdrawn score records nothing
      Given "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A score the competition does not have is refused as the competition refuses it
      When the reader signed in to the account for "organiser@example.com" withdraws a score "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchGame"

    Scenario: A score of a knockout is refused as the competition refuses it
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.NotABlockOrSwiss"

    Scenario: An archived score is refused as the competition refuses it
      Given "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Game.Archived"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, has a score withdrawn

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of a tournament there is not
      Then it is refused with "WithdrawGame.NoSuchTournament"

  Rule: Only a manager or a scorer of the tournament can ask for this

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManagerOrScorer"

  Rule: A forgotten account withdraws nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account withdraws the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
