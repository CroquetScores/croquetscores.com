@postgres
Feature: The API takes a game in an Advantage competition as hoops and targets

  A game in a competition played as Advantage Golf Croquet is entered as the
  hoops and the target of each side, and kept as the scoring fractions they
  make (`AddGame.feature`), so a request to add or correct one carries
  `winnerHoops`, `winnerTarget`, `loserHoops` and `loserTarget`, and one for
  any other competition carries the scores as it always did. The competition
  says which it is, and a request that is the other kind is refused, with
  `Game.AdvantageScoreTyped` or `Game.HoopsAndTargetsNotAdvantage`, rather than
  one being taken for the other.

  What a scoring fraction refuses is told to the caller by its code, as any
  refusal is, so that the dialog can say it beside the field it is about
  (`ScoringFraction.feature`). A competition's games are listed with the hoops
  and targets each was entered as, which the dialog that corrects one begins
  on. Nobody but the tournament's managers and scorers can do any of this,
  as for any other game.

  These scenarios talk to the API as the admin does and say nothing of the
  dialog. Advantage is a rule of golf croquet and is offered where the site
  says it is (`advantage.feature`), so the site is told it is offered, and the
  tournament is a golf croquet one whose manager is signed in.

  Background:
    Given a manager of a golf croquet tournament "Spring Open", signed in
    And the site is told Advantage Golf Croquet is offered
    And the block "Block A" has been added to the tournament as Advantage
    And the players "Sam Someone" and "Alex Another" have been entered in "Block A"

  Rule: A game is added from hoops and targets

    Scenario: A game is added
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A"
      Then the request is answered as done
      And the competition "Block A" holds the score of "Sam Someone" beating "Alex Another" kept as "83% (5/6)" to "63% (5/8)"

    Scenario Outline: A game that cannot be kept is refused with its code, and is not kept
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" <winner> to <loser> in "Block A"
      Then the request is refused with "<code>"
      And the competition "Block A" holds no scores

      Examples:
        | winner | loser  | code                             |
        | 7 of 6 | 3 of 6 | ScoringFraction.HoopsAboveTarget |
        | 3 of 0 | 3 of 6 | ScoringFraction.TargetTooSmall   |
        | 3 of 6 | 4 of 8 | Game.WinnerNotAhead              |

    Scenario: A score typed as points is refused
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" typing 26 to 17 in "Block A"
      Then the request is refused with "Game.AdvantageScoreTyped"

    Scenario: A game without a hoops is refused for it
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A" without the winner's hoops
      Then the request is refused with "Request.Invalid"

  Rule: A game is corrected from hoops and targets

    Scenario: A game is corrected
      Given the game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 has been added to "Block A"
      When a request as "croquetscores.com" corrects the game of "Sam Someone" beating "Alex Another" in "Block A" to 6 of 6 to 5 of 8
      Then the request is answered as done
      And the competition "Block A" holds the score of "Sam Someone" beating "Alex Another" kept as "100% (6/6)" to "63% (5/8)"

    Scenario: A correction that cannot be kept is refused with its code
      Given the game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 has been added to "Block A"
      When a request as "croquetscores.com" corrects the game of "Sam Someone" beating "Alex Another" in "Block A" to 7 of 6 to 5 of 8
      Then the request is refused with "ScoringFraction.HoopsAboveTarget"

  Rule: A competition's games are listed with the hoops and targets they were entered as

    Scenario: A game is listed with its scores and its hoops and targets
      Given the game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 has been added to "Block A"
      When a request as "croquetscores.com" lists the games of "Block A"
      Then the list says the first game is kept as "83% (5/6)" to "63% (5/8)"
      And the list says the first game was entered as 5 of 6 to 5 of 8

  Rule: A game in a competition that is not Advantage is not changed

    Scenario: A game is added from points
      Given the block "Block B" has been added to the tournament
      And the players "Sam Someone" and "Alex Another" have been entered in "Block B"
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" typing 26 to 17 in "Block B"
      Then the request is answered as done
      And the competition "Block B" holds the score of "Sam Someone" beating "Alex Another" kept as "26" to "17"

    Scenario: Hoops and targets are refused
      Given the block "Block B" has been added to the tournament
      And the players "Sam Someone" and "Alex Another" have been entered in "Block B"
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block B"
      Then the request is refused with "Game.HoopsAndTargetsNotAdvantage"

  Rule: A w typed after a side's hoops or its target declares that side the winner

    The four are sent as they were typed, and the site reads the hoops and the
    target from them (`AddGame.feature`).

    Scenario Outline: A game on equal fractions is kept as the winner's where a w is typed
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" <winner> to 4 of 8 in "Block A"
      Then the request is answered as done
      And the competition "Block A" holds the score of "Sam Someone" beating "Alex Another" kept as "50% (3/6) w" to "50% (4/8)"

      Examples:
        | winner   |
        | 3w of 6  |
        | 3 of 6w  |

    Scenario: A game on equal fractions with no w is refused
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" 3 of 6 to 4 of 8 in "Block A"
      Then the request is refused with "Game.WinnerNotAhead"

    Scenario: A winner who is ahead is refused for a w
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" 5w of 6 to 5 of 8 in "Block A"
      Then the request is refused with "Game.WinnerMarkedNotLevel"

    Scenario: A loser marked is refused
      When a request as "croquetscores.com" adds the game of "Sam Someone" beating "Alex Another" 5 of 6 to 4w of 8 in "Block A"
      Then the request is refused with "Game.LoserMarked"

    Scenario: A game is listed as its winner declared
      Given the game of "Sam Someone" beating "Alex Another" 3w of 6 to 4 of 8 has been added to "Block A"
      When a request as "croquetscores.com" lists the games of "Block A"
      Then the list says the first game was entered as 3 of 6 to 4 of 8
      And the list says the first game had its winner declared
