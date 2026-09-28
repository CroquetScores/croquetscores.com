@postgres
Feature: Adding a game's score to a competition

  A manager or a scorer of the tournament adds the score of a game played in
  one of its competitions, and the account they are signed in to is who added
  it. The tournament and the competition are named by their ids, and the
  winner and the loser by their ids in the competition, each with their score
  as it was typed: its number of points, and whatever follows it, which is
  kept, and which may be a mark that the winner won (`Score.feature`), as
  "6w". The answer is the id the game is given
  (`addGame.feature`).

  What a game must be that needs nothing of the tournament is asked on the way
  in, each rule saying the field it is about, so that the score dialog can say
  it beside that field (`score-modal-dialog.feature`): a winner, a loser and
  both scores must be given, each score must begin with a digit, and the
  winner and the loser must be two players (`Game.SamePlayer`,
  about the loser). A game that breaks any is refused with `Request.Invalid`.

  The rest is asked of the game once the tournament has said what it needs to
  (`Game.feature`), and is refused as the game refuses it: which endings are
  marks is the website's the tournament is run on, and a loser's score marked
  as the winner's
  (`Game.LoserMarked`), and a winner's score that is fewer than the loser's,
  or equal to it with no mark where drawn games are not allowed
  (`Game.WinnerNotAhead`). Whether drawn games are allowed is the
  tournament's (`create.feature`), and in a knockout they never are.

  The competition keeps its games, and knows nothing of who may add them, or
  of what kind it is, so the application asks the tournament first. A scorer
  enters scores, so both managers and scorers can: anybody else is refused
  with `Tournament.NotAManagerOrScorer`. An archived tournament can only be
  restored, and is refused with `Tournament.Archived`; a competition the
  tournament does not have with `Tournament.NoSuchCompetition`, and an
  archived one with `Tournament.CompetitionArchived`; a tournament there is
  not as `AddGame.NoSuchTournament`. The tournament says what kind of
  competition it is, and a knockout's draw, and what the competition refuses
  for them — a player it does not have or who has withdrawn, a match already
  decided, two players not drawn to meet — is the competition's to refuse.

  A forgotten account adds nothing, and is refused with `Account.Forgotten`.

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

  Rule: A game added is kept as one of the competition's

    Scenario: The game added is one of the competition's
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: The answer is the game's id
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then it is answered with the id of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"

    Scenario: Adding the game is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

    Scenario: A scorer of the tournament adds a game
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

  Rule: What a game must be that needs nothing of the tournament is asked on the way in

    Scenario Outline: A game without one of its parts is refused for it
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open" without its <part>
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And it reads the field "<field>"

      Examples:
        | part           | code                    | field       |
        | winner         | Game.WinnerMissing      | winner      |
        | winner's score | Game.WinnerScoreMissing | winnerScore |
        | loser          | Game.LoserMissing       | loser       |
        | loser's score  | Game.LoserScoreMissing  | loserScore  |

    Scenario Outline: A score that does not begin with a digit is refused for it
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to <score> in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And it reads the field "loserScore"

      Examples:
        | score | code           |
        | -1    | Score.NoPoints |
        | w     | Score.NoPoints |

    Scenario: The same player as winner and loser is refused, about the loser
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Sam Someone" 26 to 17 in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Game.SamePlayer"
      And it reads the field "loser"

  Rule: What else a game must be is asked of it, once the tournament has said what it needs to

    Scenario: A winner's score fewer than the loser's is refused as the game refuses it
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 17 to 26 in "Block A" of "Spring Open"
      Then it is refused with "Game.WinnerNotAhead"

    Scenario: A game on equal points with no mark is refused as the game refuses it
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6 to 6 in "Block A" of "Spring Open"
      Then it is refused with "Game.WinnerNotAhead"

    Scenario: A game on equal points with the winner's score marked is kept
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6w to 6 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 6w to 6

    Scenario: A game on equal points with no mark is kept where the tournament allows drawn games
      Given the tournament "Spring Open" allows drawn games
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6 to 6 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 6 to 6

    Scenario: A loser's score marked as the winner's is refused as the game refuses it
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17w in "Block A" of "Spring Open"
      Then it is refused with "Game.LoserMarked"

    Scenario: What follows a score's number is kept
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26tp to 17

    Scenario: An ending that is a mark only on another website marks nothing
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6cb to 6 in "Block A" of "Spring Open"
      Then it is refused with "Game.WinnerNotAhead"

    Scenario: A mark a tournament on Gateball Scores has is kept
      Given "organiser@example.com" has created the tournament "Gateball Open" on "gateballscores.com"
      And "organiser@example.com" has added the block "Block A" to "Gateball Open"
      And "organiser@example.com" has added the player "Sam Someone" to "Gateball Open"
      And "organiser@example.com" has added the player "Alex Another" to "Gateball Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Gateball Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Gateball Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6cb to 6 in "Block A" of "Gateball Open"
      Then "Block A" of "Gateball Open" has the score of "Sam Someone" beating "Alex Another" 6cb to 6

    Scenario: A refused game is not kept
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6 to 6 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has no scores

  Rule: What the competition refuses is the competition's to refuse

    Scenario: A withdrawn player is refused as the competition refuses them
      Given "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then it is refused with "CompetitionPlayer.Withdrawn"

    Scenario: A player the competition does not have is refused as the competition refuses them
      When the reader signed in to the account for "organiser@example.com" adds a game of "Sam Someone" beating a player "Block A" of "Spring Open" does not have
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: A second game of a match the block says is the best of 1 is refused
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Alex Another" beating "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      Then it is refused with "Competition.MatchDecided"

    Scenario: A second game of a match the block says is the best of 3 is kept
      Given the block is to be the best of 3
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Alex Another" beating "Sam Someone" 26 to 20 in "Block B" of "Spring Open"
      Then "Block B" of "Spring Open" has the score of "Alex Another" beating "Sam Someone" 26 to 20

    Scenario: A game in a knockout between players the tournament's draw does not pair is refused
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Chris Third" 26 to 17 in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.NotDrawnToMeet"

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, has a game added

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then it is refused with "Tournament.CompetitionArchived"

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of a tournament there is not
      Then it is refused with "AddGame.NoSuchTournament"

  Rule: Only a manager or a scorer of the tournament can ask for this

    Scenario: A reader with no part in the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManagerOrScorer"

  Rule: A forgotten account adds nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      Then it is refused with "Account.Forgotten"
