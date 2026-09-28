@postgres
Feature: The scores of a competition, as its tournament's managers and scorers list them

  A manager or a scorer lists a competition's games to see what has been
  played, and to archive a score entered by mistake and restore it
  (`scores-tab.feature`), so both are answered. The application answers with
  every game in the competition, archived ones among them, in the order they
  were added, which is the order they were played in (`addGame.feature`).

  Each is answered with its id, the winner and their score, the loser and
  their score, and whether it is archived. Each player is answered by what the
  tournament calls them now, so that a player whose name is corrected is
  corrected in every score of theirs. And each game not archived is answered
  with whether it can be archived, as the competition would say if asked
  (`archiveGame.feature`), so that a list offering to archive a score offers
  it only where archiving would be done.

  It answers the account the reader is signed in to, and never one the reader
  chose. Only the tournament's managers and scorers can ask: anybody else is
  refused with `Tournament.NotAManagerOrScorer`. A competition the tournament
  does not have is refused with `Tournament.NoSuchCompetition`, a tournament
  there is not as `GamesOfCompetition.NoSuchTournament`, and a forgotten
  account with `Account.Forgotten`.

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
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: Every game is answered, in the order it was added

    Scenario: A competition with no games is answered with none
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then no scores are answered

    Scenario: A game added is answered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 is answered

    Scenario: The games are answered in the order they were added
      Given "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the first score answered is of "Chris Third" beating "Sam Someone"

    Scenario: An archived game is answered in the place it was added in
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the first score answered is of "Sam Someone" beating "Alex Another"

    Scenario: A game of another competition is not answered
      Given "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then no scores are answered

  Rule: Each game is answered with what it is

    Scenario: A game is answered with its winner's score and its loser's
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the first score answered is 26 to 17

    Scenario: A game's player is answered by what the tournament calls them now
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" of "Spring Open" to "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the score of "Samantha Someone" beating "Alex Another" 26 to 17 is answered

    Scenario: An archived game is answered as archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 is answered as archived

    Scenario: A game not archived is answered as not archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 is answered as not archived

  Rule: Each game not archived is answered with whether it can be archived

    Scenario: A game in a block is answered as one that can be archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 is answered as one that can be archived

    Scenario: A game of a knockout's match whose winner has played on is answered as one that cannot be archived
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Final Stage" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 is answered as one that cannot be archived

    Scenario: The game in a knockout's next round is answered as one that can be archived
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Final Stage" of "Spring Open"
      Then the score of "Sam Someone" beating "Chris Third" 26 to 3 is answered as one that can be archived

  Rule: Only a manager or a scorer of a tournament there is can list them

    Scenario: A scorer of the tournament is answered
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" lists the scores of "Block A" of "Spring Open"
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 is answered

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" lists the scores of "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManagerOrScorer"

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" lists the scores of a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" lists the scores of "Block A" of a tournament there is not
      Then it is refused with "GamesOfCompetition.NoSuchTournament"

  Rule: A forgotten account lists nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account lists the scores of "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
