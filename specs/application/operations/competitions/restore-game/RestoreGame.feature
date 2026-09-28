@postgres
Feature: Restoring an archived score

  A manager or a scorer of the tournament restores the score of an archived
  game, and the account they are signed in to is who restored it. The
  tournament, the competition and the game are each named by their id. A game
  restored counts again, in the place it was added in (`restoreGame.feature`).
  Restoring one that is not archived records nothing. What the competition
  refuses — a game it does not have, or one that could not be added now, such
  as a game of a match decided without it since — is the competition's to
  refuse.

  It is asked of the tournament first, as adding a game is (`AddGame.feature`):
  only a manager or a scorer can, anybody else being refused with
  `Tournament.NotAManagerOrScorer`; an archived tournament is refused with
  `Tournament.Archived`, a competition the tournament does not have with
  `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `RestoreGame.NoSuchTournament`; and a forgotten account with
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
    And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"

  Rule: A score restored is kept not archived

    Scenario: The score restored is not archived
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" is not archived

    Scenario: Restoring the score is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

    Scenario: A scorer of the tournament restores a score
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" is not archived

    Scenario: Restoring a score not archived records nothing
      Given "organiser@example.com" has restored the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A score the competition does not have is refused as the competition refuses it
      When the reader signed in to the account for "organiser@example.com" restores a score "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchGame"

    Scenario: A score of a match decided without it since is refused as the competition refuses it
      Given "Alex Another" has beaten "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Competition.MatchDecided"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, has a score restored

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of a tournament there is not
      Then it is refused with "RestoreGame.NoSuchTournament"

  Rule: Only a manager or a scorer of the tournament can ask for this

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManagerOrScorer"

  Rule: A forgotten account restores nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account restores the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
