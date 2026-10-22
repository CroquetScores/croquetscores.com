@postgres
Feature: Correcting a game's score entered wrongly

  A manager or a scorer of the tournament corrects the score of a game entered
  wrongly, whoever entered it, since a score is the tournament's and not the
  scorer's, and the account they are signed in to is who corrected it. The
  tournament, the competition and the game are each named by their id, and the
  winner's score and the loser's are given as they were typed, as a game's
  are when it is added (`AddGame.feature`). The game keeps its place among
  the games, and its players unless others are given, so a game is corrected
  whatever has been played since, even in a knockout whose next round it
  sent its winner to. Its winner and its loser can be given as well, each by
  their id in the competition, as a game added names them, where the game
  could be archived (`correctGame.feature`): one of a knockout's match whose
  winner has played on keeps its players, and giving it others is refused
  with `Competition.WinnerHasPlayedOn`. Correcting a game to the scores and
  the players it has records nothing.

  What corrected scores must be that needs nothing of the tournament is asked
  on the way in, as it is for a game added, each rule saying the field it is
  about: both scores must be given, and each must begin with a digit. Scores
  that break either are refused with `Request.Invalid`.

  The rest is asked of the game once the tournament has said what it needs to
  (`Game.feature`), and is refused as the game refuses it: a loser's score
  marked as the winner's (`Game.LoserMarked`); a winner's score that is fewer
  than the loser's, or equal to it with no mark where drawn games are not
  allowed (`Game.WinnerNotAhead`); scores that would make a game won into a
  drawn one or a drawn one into a game won (`Game.ResultChanged`); and a game
  that is archived, which is restored first and corrected then
  (`Game.Archived`). A game the competition does not have is refused with
  `Competition.NoSuchGame`.

  It is asked of the tournament first, as adding a game is: only a manager or
  a scorer can, since putting right a score entered wrongly is part of
  entering scores, anybody else being refused with
  `Tournament.NotAManagerOrScorer`; an archived tournament is refused with
  `Tournament.Archived`, a competition the tournament does not have with
  `Tournament.NoSuchCompetition` and an archived one with
  `Tournament.CompetitionArchived`; a tournament there is not as
  `CorrectGame.NoSuchTournament`; and a forgotten account with
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

  Rule: A score corrected is kept corrected

    Scenario: The game has its corrected score
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 10

    Scenario: The game no longer has the score it was entered with
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then "Block A" of "Spring Open" does not have the score of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: A score is corrected to one won on equal points
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 17w to 17
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 17w to 17

    Scenario: Correcting a score another entered is recorded as done by whoever asked
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "scorer@example.com"

    Scenario: A scorer of the tournament corrects a score
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 10

    Scenario: Correcting a score to the score it has records nothing
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 17
      Then nothing more is recorded of the competition "Block A" of "Spring Open"

    Scenario: A score of a knockout's match whose winner has played on is corrected
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open" to 26 to 10
      Then "Final Stage" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 10

  Rule: A score that could be archived can be corrected to other players

    Scenario: A score corrected to another winner has them
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to "Chris Third" beating "Alex Another" 26 to 17
      Then "Block A" of "Spring Open" has the score of "Chris Third" beating "Alex Another" 26 to 17

    Scenario: A score corrected to its players the other way round has them so
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to "Alex Another" beating "Sam Someone" 26 to 17
      Then "Block A" of "Spring Open" has the score of "Alex Another" beating "Sam Someone" 26 to 17

    Scenario: A score of a knockout's match whose winner has played on is not corrected to other players
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open" to "Alex Another" beating "Sam Someone" 26 to 17
      Then it is refused with "Competition.WinnerHasPlayedOn"

  Rule: What corrected scores must be that needs nothing of the tournament is asked on the way in

    Scenario Outline: Corrected scores without one of them are refused for it
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10 without its <part>
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | part         | code                   |
        | winner score | Game.WinnerScoreMissing |
        | loser score  | Game.LoserScoreMissing  |

    Scenario Outline: A corrected score that does not begin with a digit is refused
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to <winner score> to <loser score>
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Score.NoPoints"

      Examples:
        | winner score | loser score |
        | w            | 10          |
        | 26           | tp          |

    Scenario: Corrected scores refused on the way in are not kept
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to w to 10
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

  Rule: What the game and the competition refuse is theirs to refuse

    Scenario Outline: Corrected scores the game refuses are refused as the game refuses them
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to <winner score> to <loser score>
      Then it is refused with "<code>"

      Examples:
        | winner score | loser score | code                |
        | 10           | 26          | Game.WinnerNotAhead |
        | 17           | 17          | Game.WinnerNotAhead |
        | 26           | 17w         | Game.LoserMarked    |

    Scenario: Corrected scores that would draw a game won are refused where drawn results are allowed
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block B" of "Spring Open" to 17 to 17
      Then it is refused with "Game.ResultChanged"

    Scenario: An archived score is refused
      Given "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then it is refused with "Game.Archived"

    Scenario: A score the competition does not have is refused as the competition refuses it
      When the reader signed in to the account for "organiser@example.com" corrects a score "Block A" of "Spring Open" does not have to 26 to 10
      Then it is refused with "Competition.NoSuchGame"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, has a score corrected

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in a competition "Spring Open" does not have to 26 to 10
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of a tournament there is not to 26 to 10
      Then it is refused with "CorrectGame.NoSuchTournament"

  Rule: Only a manager or a scorer of the tournament can ask for this

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then it is refused with "Tournament.NotAManagerOrScorer"

  Rule: A forgotten account corrects nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account corrects the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open" to 26 to 10
      Then it is refused with "Account.Forgotten"
