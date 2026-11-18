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
  (`Game.WinnerNotAhead`). Whether drawn results are allowed is the
  competition's (`competitionRules.feature`), and in a knockout they never are.

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

  A test is a competition too (`addTest.feature`), and has no players entered
  in it: its players are its teams', named by their ids in their teams
  (`TeamPlayer.feature`). Which team each plays for, and whether either is
  archived, is the tournament's, so the application asks the tournament for
  them and says them to the test, which refuses a game between two players of
  one team, or with a player of neither (`gamesInATest.feature`). The
  tournament is asked whether the test is archived as any competition is.

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

    Scenario: A game on equal points with no mark is kept where the competition allows drawn results
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6 to 6 in "Block B" of "Spring Open"
      Then "Block B" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 6 to 6

    Scenario: A game on equal points with no mark is refused in a competition that does not allow drawn results though another does
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 6 to 6 in "Block A" of "Spring Open"
      Then it is refused with "Game.WinnerNotAhead"

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

    Scenario: A second game between two players of a block the best of 1 is kept
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Alex Another" beating "Sam Someone" 26 to 20 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has the score of "Alex Another" beating "Sam Someone" 26 to 20

    Scenario: A game of a match the block says is the best of 3, already decided, is refused as the competition refuses it
      Given the block is to be the best of 3
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block B" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 10 in "Block B" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Alex Another" beating "Sam Someone" 26 to 20 in "Block B" of "Spring Open"
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
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Chris Third" 26 to 17 in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.NotDrawnToMeet"

  Rule: A knockout's game waits until its draw is filled

    The knockout's draw is four places, each round the best of 1. Players and
    byes fill its places, the withdrawn among them, and a tournament player
    archived is removed from it (`ArchivePlayer.feature`), so fills none.

    Background:
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"

    Scenario: A game in a knockout with a place left empty is refused
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.DrawNotFilled"

    Scenario: A game in a knockout whose last place a bye fills is kept
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then "Final Stage" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: A withdrawn player still fills their place
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Pat Fourth" from "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then "Final Stage" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: An archived tournament player fills no place
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the player "Pat Fourth" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then it is refused with "Competition.DrawNotFilled"

  Rule: The loser of a knockout's match goes on to the knockout that takes its losers

    A knockout added to take the losers of a round of another
    (`AddLosersKnockout.feature`) is filled as the matches of that round are
    decided: the loser of each is entered in the place of the match they lost,
    wherever the matches are decided in. The knockout here is four places, so
    its first round has two matches, and the losers knockout two places.

    Background:
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has added the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Final Stage"

    Scenario: The loser of a match decided is entered in the losers knockout
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then the competition "Plate" of "Spring Open" has the player "Alex Another"

    Scenario: The winner of a match decided is not
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then the competition "Plate" of "Spring Open" does not have the player "Sam Someone"

    Scenario: A loser is entered in the place of the match they lost
      Given "Chris Third" has beaten "Pat Fourth" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      Then the first player of "Plate" of "Spring Open" is "Alex Another"
      And the second player of "Plate" of "Spring Open" is "Pat Fourth"

    Scenario: The loser of a match in the final is not entered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 17 in "Final Stage" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Chris Third" 26 to 17 in "Final Stage" of "Spring Open"
      Then the competition "Plate" of "Spring Open" does not have the player "Sam Someone"
      And the competition "Plate" of "Spring Open" does not have the player "Chris Third"

    Scenario: The players of a losers knockout cannot be entered by hand
      When the reader signed in to the account for "organiser@example.com" enters the player "Sam Someone" in "Plate" of "Spring Open"
      Then it is refused with "Competition.PlayersSetAutomatically"

  Rule: A change to a losers knockout is carried on to the one that takes its losers

    A match with a bye is decided without a game, so the player who goes
    through it sends a bye on to the knockout that takes the losers of its
    round, without a game of its own to say so.

    Background:
      Given the knockout is to have a draw of 8 places
      And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And "organiser@example.com" has added the player "Dana Fifth" to "Spring Open"
      And "organiser@example.com" has added the player "Eli Sixth" to "Spring Open"
      And "organiser@example.com" has added the player "Fay Seventh" to "Spring Open"
      And "organiser@example.com" has added the knockout "Big Draw" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered the player "Dana Fifth" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered the player "Eli Sixth" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered the player "Fay Seventh" in "Big Draw" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Big Draw" of "Spring Open"
      And "organiser@example.com" has added the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Big Draw"
      And "organiser@example.com" has added the losers knockout "Shield" to "Spring Open" for the losers of the first round of "Plate"

    Scenario: A bye in the first losers knockout is carried on to the second
      When the reader signed in to the account for "organiser@example.com" adds the game of "Dana Fifth" beating "Eli Sixth" 26 to 17 in "Big Draw" of "Spring Open"
      Then the competition "Shield" of "Spring Open" has 1 bye

  Rule: Only a competition there is, and one not archived, in a tournament there is and not archived, has a game added

    Scenario: A competition the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in a competition "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchCompetition"

    Scenario: An archived competition is refused
      Given "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A (1)" of "Spring Open"
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

  Rule: In a test, a game is between a player of each of its teams

    Scenario: A game in a test is kept as one of the test's
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Pat Player" beating "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      Then the competition "AUS v ENG" of "Spring Tests" has the game of "Pat Player" beating "Kim Keeper" 26 to 17

    Scenario: A game in a test is added by a scorer
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" adds the game of "Pat Player" beating "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      Then the competition "AUS v ENG" of "Spring Tests" has the game of "Pat Player" beating "Kim Keeper" 26 to 17

    Scenario: A game between two players of one team is refused as the test refuses it
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Jo Jones" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Pat Player" beating "Jo Jones" 26 to 17 in "AUS v ENG" of "Spring Tests"
      Then it is refused with "Competition.SameTeam"

    Scenario: A game with a player of a team not in the test is refused as the test refuses it
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the team "Scotland" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Jo Jones" to the team "Scotland" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Pat Player" beating "Jo Jones" 26 to 17 in "AUS v ENG" of "Spring Tests"
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: A game with an archived player is refused as the player refuses it
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has archived the player "Kim Keeper" of the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Pat Player" beating "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: A game in an archived test is refused as the tournament refuses it
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has archived the competition "AUS v ENG" in "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the game of "Pat Player" beating "Kim Keeper" 26 to 17 in "AUS v ENG (1)" of "Spring Tests"
      Then it is refused with "Tournament.CompetitionArchived"

  Rule: A game in an Advantage competition is added from hoops and targets

    The two players of an Advantage game have different targets, so a scorer
    types the hoops each side made and each side's target, and the site works
    out the scoring fractions (`ScoringFraction.feature`). The game is kept as
    the text of them, as "83% (5/6)", so that every score is a percentage to
    everything that reads one, and the winner is whoever made the higher
    fraction, which is not always the one with more hoops. A game stopped by the
    clock is entered the same way, with the hoops made when play stopped.

    The competition says which it is (`advantage.feature`). In one that is
    Advantage a score typed as points is refused by `Game.AdvantageScoreTyped`,
    and in one that is not, hoops and targets are refused by
    `Game.HoopsAndTargetsNotAdvantage`, rather than one being taken for the
    other. Each of the four that make a game is asked for, and a request that
    names any of them is a request for an Advantage game.

    Background:
      Given the tournament is to be for the sport "gc"
      And "organiser@example.com" has created the tournament "Spring Golf"
      And the competition is said to be Advantage
      And "organiser@example.com" has added the block "Block A" to "Spring Golf"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Golf"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Golf"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Golf"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Golf"

    Scenario: The game is kept as the scoring fractions it makes
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A" of "Spring Golf"
      Then "Block A" of "Spring Golf" has the score of "Sam Someone" beating "Alex Another" kept as "83% (5/6)" to "63% (5/8)"

    Scenario: The winner can have made fewer hoops than the loser
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 4 of 5 to 5 of 8 in "Block A" of "Spring Golf"
      Then "Block A" of "Spring Golf" has the score of "Sam Someone" beating "Alex Another" kept as "80% (4/5)" to "63% (5/8)"

    Scenario: The answer is the game's id
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A" of "Spring Golf"
      Then it is answered with the id of the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Golf"

    Scenario Outline: A game whose winner did not make the higher fraction is refused
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" <winner> to <loser> in "Block A" of "Spring Golf"
      Then it is refused with "Game.WinnerNotAhead"

      Examples:
        | winner | loser  |
        | 3 of 6 | 5 of 6 |
        | 3 of 6 | 4 of 8 |
        | 5 of 8 | 5 of 6 |

    Scenario: A game on equal fractions is kept where the competition allows drawn results
      Given the competition is to allow drawn results
      And "organiser@example.com" has added the block "Block B" to "Spring Golf"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block B" of "Spring Golf"
      And "organiser@example.com" has entered the player "Alex Another" in "Block B" of "Spring Golf"
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 3 of 6 to 4 of 8 in "Block B" of "Spring Golf"
      Then "Block B" of "Spring Golf" has the score of "Sam Someone" beating "Alex Another" kept as "50% (3/6)" to "50% (4/8)"

    Scenario Outline: Hoops and a target that cannot make a fraction are refused as a scoring fraction refuses them
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" <winner> to <loser> in "Block A" of "Spring Golf"
      Then it is refused with "<code>"

      Examples:
        | winner   | loser  | code                             |
        | 2.5 of 6 | 3 of 6 | ScoringFraction.HoopsNotWhole    |
        | -1 of 6  | 3 of 6 | ScoringFraction.HoopsNegative    |
        | 3 of 6.5 | 3 of 6 | ScoringFraction.TargetNotWhole   |
        | 3 of 0   | 3 of 6 | ScoringFraction.TargetTooSmall   |
        | 7 of 6   | 3 of 6 | ScoringFraction.HoopsAboveTarget |
        | 5 of 6   | 7 of 6 | ScoringFraction.HoopsAboveTarget |
        | 5 of 6   | 3 of 0 | ScoringFraction.TargetTooSmall   |

    Scenario Outline: A game without one of its four parts is refused for it
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A" of "Spring Golf" without its <part>
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"
      And it reads the field "<field>"

      Examples:
        | part            | code                      | field        |
        | winner's hoops  | Game.WinnerHoopsMissing   | winnerHoops  |
        | winner's target | Game.WinnerTargetMissing  | winnerTarget |
        | loser's hoops   | Game.LoserHoopsMissing    | loserHoops   |
        | loser's target  | Game.LoserTargetMissing   | loserTarget  |

    Scenario: A score typed as points is refused
      When the reader signed in to the account for "organiser@example.com" adds the game of "Sam Someone" beating "Alex Another" 26 to 17 in "Block A" of "Spring Golf"
      Then it is refused with "Game.AdvantageScoreTyped"

    Scenario: A refused game is not kept
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 7 of 6 to 3 of 6 in "Block A" of "Spring Golf"
      Then "Block A" of "Spring Golf" has no scores

  Rule: A game in a competition that is not Advantage is added from points as it always was

    Scenario: Hoops and targets are refused
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A" of "Spring Open"
      Then it is refused with "Game.HoopsAndTargetsNotAdvantage"

    Scenario: Hoops and targets are not kept
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5 of 6 to 5 of 8 in "Block A" of "Spring Open"
      Then "Block A" of "Spring Open" has no scores

  Rule: A "w" typed after a side's hoops or its target declares that side the winner

    An Advantage game stopped by the clock can leave both sides on the same
    scoring fraction, which is refused where drawn games are not allowed
    (`Game.WinnerNotAhead`), as is any game on equal points with no mark
    (`Game.feature`). Whoever organises the game says who won it by a "w" after
    the winner's hoops or after the winner's target, as the winner's score is
    marked "6w" in any other competition (`Score.feature`): "3w of 6" and "3 of
    6w" say the same. The request carries the four as they were typed, so the
    hoops and the target are read from them, and a "w" after either is the mark.

    The game is then kept as the scoring fractions its sides made with the
    winner's written with a "w" after it, as "50% (3/6) w" (`ScoringFraction.feature`).
    The mark can only be used where the two scoring fractions are equal, since
    it is there that somebody has to say who won. A winner who is ahead has no
    need of it and is refused by `Game.WinnerMarkedNotLevel`, rather than kept
    with a mark that says nothing, and a winner who is behind is refused as ever
    by `Game.WinnerNotAhead` (`Game.feature`). A loser is never marked, as in
    any other game, and is refused by `Game.LoserMarked`.

    Background:
      Given the tournament is to be for the sport "gc"
      And "organiser@example.com" has created the tournament "Spring Golf"
      And the competition is said to be Advantage
      And "organiser@example.com" has added the block "Block A" to "Spring Golf"
      And "organiser@example.com" has added the player "Sam Someone" to "Spring Golf"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Golf"
      And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Golf"
      And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Golf"

    Scenario Outline: A game on equal fractions is kept as the winner's where a w is typed
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" <winner> to <loser> in "Block A" of "Spring Golf"
      Then "Block A" of "Spring Golf" has the score of "Sam Someone" beating "Alex Another" kept as "50% (3/6) w" to "50% (4/8)"

      Examples:
        | winner  | loser  |
        | 3w of 6 | 4 of 8 |
        | 3 of 6w | 4 of 8 |
        | 3w of 6w | 4 of 8 |

    Scenario: A game on equal fractions is still refused with no w
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 3 of 6 to 4 of 8 in "Block A" of "Spring Golf"
      Then it is refused with "Game.WinnerNotAhead"

    Scenario Outline: A winner who is ahead is refused for a w
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" <winner> to 5 of 8 in "Block A" of "Spring Golf"
      Then it is refused with "Game.WinnerMarkedNotLevel"

      Examples:
        | winner  |
        | 5w of 6 |
        | 5 of 6w |

    Scenario: A winner who is ahead and refused for a w is not kept
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5w of 6 to 5 of 8 in "Block A" of "Spring Golf"
      Then "Block A" of "Spring Golf" has no scores

    Scenario: A winner who is behind is refused whatever is typed
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 3w of 6 to 5 of 6 in "Block A" of "Spring Golf"
      Then it is refused with "Game.WinnerNotAhead"

    Scenario Outline: A loser marked is refused as a loser marked is in any other game
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" 5 of 6 to <loser> in "Block A" of "Spring Golf"
      Then it is refused with "Game.LoserMarked"

      Examples:
        | loser   |
        | 4w of 8 |
        | 4 of 8w |

    Scenario Outline: A w typed any other way is hoops or a target that is not a whole number
      When the reader signed in to the account for "organiser@example.com" adds the Advantage game of "Sam Someone" beating "Alex Another" <winner> to 4 of 8 in "Block A" of "Spring Golf"
      Then it is refused with "ScoringFraction.HoopsNotWhole"

      Examples:
        | winner    |
        | 3ww of 6  |
        | 3x of 6   |
        | w3 of 6   |
