@browser @postgres
Feature: The scores tab of a competition's page

  The Scores tab is where a manager or a scorer sees the games played in one
  of a tournament's competitions, adds the score of another, corrects a score
  entered wrongly, archives a score entered by mistake and restores it (`view.feature` beneath the
  competition). A scorer sees this tab alone, and can do on it all that a
  manager can, since putting right a score entered wrongly is part of
  entering scores.

  Add Score, above the list, opens the score dialog to enter a game's score,
  and a score's Edit opens it to correct that score
  (`score-modal-dialog.feature`). Whenever the dialog adds or corrects a
  score, the list is asked for again, so that it says what has been played
  now.

  A knockout is played only once every place in its draw is filled with a
  player or a bye, and no more are in it than it has places
  (`addGame.feature`). So in a knockout, Add Score first counts who is in the
  draw, as the knockout counts them: its players, withdrawn ones among them,
  since a withdrawn player keeps their place, and its byes. Where that is not
  the number of places, Add Score does not open the score dialog, which could
  only have every game refused. It says why in a modal dialog of its own,
  with OK alone, in the words for `Competition.DrawNotFilled`, and OK puts
  the reader back on Add Score. It counts when it is pressed, so a place
  filled since the tab was opened is counted. A block and a Swiss have no
  draw, and Add Score always opens the score dialog in them.

  The scores in use come first, in the order they were entered, oldest first,
  so that the list reads as the competition was played. They are a table,
  a row to each score and no column headings, since what each column holds
  is plain from what is in it. Its columns are the winner's name, the
  winner's score, the loser's name, the loser's score, and the buttons, which
  offer Edit and Archive, Edit first, as it is for a player and a competition, so that
  putting a score right is offered ahead of setting it aside. A
  score is shown exactly as it was typed, whatever follows its number, as
  "26tp" or "6w" (`Score.feature`).

  A score is archived rather than taken away, so that one entered by mistake
  is out of the way but can be put back. In a knockout, the winner of a match
  goes on to the next round, so a score of a match whose winner has a game in
  the next round is not offered Archive: taking it away would leave that game
  played by somebody who had not got there. It is the match that sends its
  winner on, not the game, so where a round is the best of 3 or 5 every game
  of the match is held, the games its loser won among them. The game in the
  next round is archived first, and then the ones before it can be. A block
  and a Swiss have
  no rounds that depend on one another, so every score in them is offered
  Archive. Every score in use is offered Edit, in a knockout as anywhere.
  Where a score could be archived, Edit lets its players be changed as well
  as its scores; where it cannot, it keeps its players, so that nobody who
  went through changes (`score-modal-dialog.feature`).

  The archived scores come after those in use, under a heading of their own,
  in the same order. Each is struck through, and says in words that it is
  archived as well, since a line through a score is not read out. Each offers
  Restore alone: an archived score is restored before it is corrected.

  Archive and Restore do not ask first: each is undone by the other, and
  nothing is lost by either. Whatever is pressed, the list is asked for again.

  In a block or a Swiss, a score that was played but is not to count is
  withdrawn rather than archived (`withdrawGame.feature`), so each score in
  use there is offered Withdraw too, after Archive. A withdrawn score was
  played, so it stays among those in use, in its place, but struck through,
  and says in words that it is withdrawn. It offers Unwithdraw in place of
  Withdraw, and Edit still. Neither asks first, since each is undone by the
  other. Unwithdraw is refused where the score could not be added now, as
  where one of its players has withdrawn since, and the refusal is said above
  the list. A knockout's or a test's score is offered neither, since there a
  score decides more than the standings. Nor is a score of a player who has
  withdrawn offered Withdraw: it counts for nothing already, as every game of
  theirs does, and says so on the public pages.

  The tab has no address of its own, so a scenario opens the competition's
  page and chooses the tab, which is what opening the scores of a competition
  does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Chris Third" to "Spring Open"
    And "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: The scores in use are listed in the order they were entered, oldest first

    Scenario: A score entered is listed
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is listed

    Scenario: The score entered first is listed first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first score listed is of "Sam Someone" beating "Alex Another"

    Scenario: The score entered last is listed last
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the last score listed is of "Chris Third" beating "Sam Someone"

    Scenario: A competition with no scores says so
      When the scores of "Block A" in "Spring Open" are opened
      Then the tab says there are no scores

  Rule: The scores are a table of five columns, without headings

    The same five columns are used in a block, a knockout and a Swiss, so that
    a name, a score and what can be done with it are found in the same place
    from one competition to the next. A column is named for what it holds
    only here, and not on the page.

    Scenario: The scores are listed in a table
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the scores are listed in a table

    Scenario: The table has no column headings
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the table of scores has no column headings

    Scenario: A score has five columns
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first score listed has 5 columns

    Scenario Outline: Each part of a score has a column of its own
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first score listed has its <part> in column <column>

      Examples:
        | column | part           |
        | 1      | winner         |
        | 2      | winner's score |
        | 3      | loser          |
        | 4      | loser's score  |
        | 5      | buttons        |

  Rule: Each score says the winner and their score, then the loser and theirs

    Scenario Outline: A score says each of its parts
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first score listed shows "<shown>" as its <part>

      Examples:
        | part           | shown        |
        | winner         | Sam Someone  |
        | winner's score | 26           |
        | loser          | Alex Another |
        | loser's score  | 17           |

    Scenario: A score is shown as it was typed
      Given "Sam Someone" has beaten "Alex Another" 26tp to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first score listed shows "26tp" as its winner's score

    Scenario: The winner comes before the loser
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then in the first score listed "Sam Someone" is shown before "Alex Another"

    Scenario: A score of a player changed on the tournament's tab shows them as they are now
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has renamed the player "Sam Someone" in "Spring Open" to "Samantha Someone"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first score listed shows "Samantha Someone" as its winner

  Rule: Add Score opens the score dialog

    Scenario: The tab offers Add Score
      When the scores of "Block A" in "Spring Open" are opened
      Then the tab offers "Add Score"

    Scenario: Add Score is above the scores
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then "Add Score" is above the scores

    Scenario: Add Score opens the dialog to add a score
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

  Rule: In a knockout, Add Score says why scores cannot be added until the draw is filled

    The knockout's draw is four places.

    Background:
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"

    Scenario: Add Score in a knockout with a place left empty does not open the score dialog
      Given the scores of "Final Stage" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is not open

    Scenario: Add Score in a knockout with a place left empty says why scores cannot be added
      Given the scores of "Final Stage" in "Spring Open" are open
      When "Add Score" is pressed
      Then the modal dialog says the words for "Competition.DrawNotFilled"

    Scenario: What Add Score says has OK alone
      Given the scores of "Final Stage" in "Spring Open" are open
      When "Add Score" is pressed
      Then the modal dialog's first button is "OK"

    Scenario: OK puts the reader back on Add Score
      Given the scores of "Final Stage" in "Spring Open" are open
      And "Add Score" is pressed
      When "OK" is pressed
      Then "Add Score" has the focus

    Scenario: OK closes what Add Score said
      Given the scores of "Final Stage" in "Spring Open" are open
      And "Add Score" is pressed
      When "OK" is pressed
      Then no modal dialog is open

    Scenario: Add Score in a knockout with every place filled opens the score dialog
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And the scores of "Final Stage" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

    Scenario: A withdrawn player keeps their place in the count
      Given "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Chris Third" from "Final Stage" of "Spring Open"
      And the scores of "Final Stage" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

    Scenario: A place filled after the tab was opened is counted
      Given the scores of "Final Stage" in "Spring Open" are open
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

    Scenario: What Add Score says is in the reader's language
      Given a browser that asks for "en-XA"
      And the scores of "Final Stage" in "Spring Open" are open
      When the way to add a score is pressed
      Then every word in the modal dialog is in the test locale

  Rule: Edit opens the score dialog to correct a score

    Scenario: A score in use offers Edit
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Edit"

    Scenario: Edit comes before Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then "Edit" on the score of "Sam Someone" beating "Alex Another" comes before "Archive"

    Scenario: Edit opens the dialog to correct the score
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Edit" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score dialog is titled "Edit Score"

    Scenario: A score corrected from Edit is listed with its new score
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      And "Edit" is pressed on the score of "Sam Someone" beating "Alex Another"
      And "10" is typed as the "Loser's score"
      When "Save" is pressed
      Then the first score listed shows "10" as its loser's score

  Rule: A score in a block or a Swiss can always be archived

    Scenario: A score in use offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Archive"

    Scenario: A score in use does not offer Restore
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Restore"

    Scenario: A score in a block whose winner has played since offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Archive"

    Scenario: A score in a Swiss whose winner has played since offers Archive
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Swiss A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Swiss A" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Swiss A" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Swiss A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Swiss A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Swiss A" of "Spring Open"
      When the scores of "Swiss A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Archive"

  Rule: In a knockout, a score whose winner has played in the next round cannot be archived

    The knockout is drawn in the competition's order (`addGame.feature`), so
    Sam Someone plays Alex Another and Chris Third plays Pat Fourth in the
    first round, and the winners play each other in the second. Every round is the
    best of 1, so a game is a match.

    Background:
      Given the knockout's first round is to be the best of 1
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 20 in "Final Stage" of "Spring Open"

    Scenario: A score whose winner has not yet played in the next round offers Archive
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Archive"

    Scenario: A score whose winner has played in the next round does not offer Archive
      Given "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Archive"

    Scenario: A score whose winner has lost in the next round does not offer Archive either
      Given "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Chris Third" beating "Pat Fourth" does not offer "Archive"

    Scenario: A score whose winner has played in the next round still offers Edit
      Given "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Edit"

    Scenario: The score in the next round offers Archive
      Given "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Chris Third" offers "Archive"

    Scenario: Archiving the score in the next round lets the one before it be archived
      Given "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      And the scores of "Final Stage" in "Spring Open" are open
      When "Archive" is pressed on the score of "Sam Someone" beating "Chris Third"
      Then the score of "Sam Someone" beating "Alex Another" offers "Archive"

    Scenario: A score whose winner's next game is archived offers Archive
      Given "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Archive"

  Rule: In a knockout played best of 3, no game of a match whose winner has played on can be archived

    Sam Someone and Alex Another meet in the first round, best of 3, as do
    Chris Third and Pat Fourth. The second round is the best of 1. The games
    between the same two players are told apart by their scores.

    Background:
      Given the knockout's first round is to be the best of 3
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"

    Scenario: A game of a match not yet decided offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 offers "Archive"

    Scenario: A game of a match decided whose winner has not played on offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 10 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 offers "Archive"

    Scenario Outline: No game of a match won 2 to 1 whose winner has played on offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 1 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 2 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "<winner>" beating "<loser>" <score> does not offer "Archive"

      Examples:
        | winner       | loser        | score    |
        | Sam Someone  | Alex Another | 26 to 17 |
        | Alex Another | Sam Someone  | 26 to 20 |
        | Sam Someone  | Alex Another | 26 to 5  |

    Scenario: Archiving the game in the next round lets the games of the match before it be archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 1 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 2 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      And the scores of "Final Stage" in "Spring Open" are open
      When "Archive" is pressed on the score of "Sam Someone" beating "Chris Third" 26 to 3
      Then the score of "Alex Another" beating "Sam Someone" 26 to 20 offers "Archive"

  Rule: In a knockout played best of 5, no game of a match whose winner has played on can be archived

    Sam Someone and Alex Another meet in the first round, best of 5, as do
    Chris Third and Pat Fourth, whose match Chris Third has won 3 to 0. The
    second round is the best of 1. The games between the same two players are
    told apart by their scores.

    Background:
      Given the knockout's first round is to be the best of 5
      And the knockout's second round is to be the best of 1
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 1 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 2 in "Final Stage" of "Spring Open"
      And "Chris Third" has beaten "Pat Fourth" 26 to 4 in "Final Stage" of "Spring Open"

    Scenario: A game of a match at 2 all offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 22 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 offers "Archive"

    Scenario: A game of a match won 3 to 0 whose winner has not played on offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 10 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 offers "Archive"

    Scenario Outline: No game of a match won 3 to 0 whose winner has played on offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 10 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" <score> does not offer "Archive"

      Examples:
        | score    |
        | 26 to 17 |
        | 26 to 10 |
        | 26 to 5  |

    Scenario Outline: No game of a match won 3 to 2 whose winner has played on offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 22 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 25 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "<winner>" beating "<loser>" <score> does not offer "Archive"

      Examples:
        | winner       | loser        | score    |
        | Sam Someone  | Alex Another | 26 to 17 |
        | Alex Another | Sam Someone  | 26 to 20 |
        | Sam Someone  | Alex Another | 26 to 5  |
        | Alex Another | Sam Someone  | 26 to 22 |
        | Sam Someone  | Alex Another | 26 to 25 |

    Scenario: A game of a match whose winner's next game is archived offers Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 10 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 5 in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" 26 to 17 offers "Archive"

  Rule: The archived scores are listed after those in use, struck through

    Scenario: An archived score is listed among the archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is listed among the archived

    Scenario: An archived score is not listed among those in use
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is not listed among those in use

    Scenario: The archived scores come after those in use
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Chris Third" beating "Sam Someone" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Chris Third" beating "Sam Someone" is listed after the score of "Sam Someone" beating "Alex Another"

    Scenario: The archived scores are listed in the order they were entered
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Chris Third" beating "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is listed before the score of "Chris Third" beating "Sam Someone"

    Scenario: The archived scores are under a heading of their own
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the archived scores are headed "Archived scores"

    Scenario: No heading for the archived is shown where none is archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then no heading for the archived scores is shown

    Scenario: An archived score is struck through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is struck through

    Scenario: A score in use is not struck through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is not struck through

    Scenario: An archived score is said to be archived to a screen reader
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is announced as archived

    Scenario Outline: An archived score still says each of its parts
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the first archived score shows "<shown>" as its <part>

      Examples:
        | part           | shown        |
        | winner         | Sam Someone  |
        | winner's score | 26           |
        | loser          | Alex Another |
        | loser's score  | 17           |

    Scenario: An archived score offers Restore
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Restore"

    Scenario: An archived score does not offer Archive
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Archive"

    Scenario: An archived score does not offer Edit
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Edit"

  Rule: Archive and Restore move a score between those in use and the archived

    Scenario: Archiving a score lists it among the archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Archive" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" is listed among the archived

    Scenario: Archiving does not ask first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Archive" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then no modal dialog is open

    Scenario: A score archived from the tab is kept archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      And "Archive" is pressed on the score of "Sam Someone" beating "Alex Another"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is listed among the archived

    Scenario: Restoring a score lists it among those in use
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" is not listed among the archived

    Scenario: A restored score is back in the place its entry gives it
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the first score listed is of "Sam Someone" beating "Alex Another"

    Scenario: A score restored from the tab is kept restored
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      And "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is not listed among the archived

  Rule: In a block or a Swiss, a score is withdrawn, and its withdrawal reversed

    Scenario: A score in a block offers Withdraw
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Withdraw"

    Scenario: A score in a Swiss offers Withdraw
      Given "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Swiss A" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Swiss A" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Swiss A" of "Spring Open"
      When the scores of "Swiss A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Withdraw"

    Scenario: A score of a player who has withdrawn does not offer Withdraw
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Withdraw"

    Scenario: A score in a knockout does not offer Withdraw
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Pat Fourth" in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      When the scores of "Final Stage" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Withdraw"

    Scenario: A score in use does not offer Unwithdraw
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Unwithdraw"

    Scenario: Withdrawing a score strikes it through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Withdraw" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" is struck through

    Scenario: Withdrawing does not ask first
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Withdraw" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then no modal dialog is open

    Scenario: A score withdrawn from the tab is kept withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      And "Withdraw" is pressed on the score of "Sam Someone" beating "Alex Another"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is struck through

    Scenario: A withdrawn score is not listed among the archived
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is not listed among the archived

    Scenario: A withdrawn score is said to be withdrawn to a screen reader
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" is announced as withdrawn

    Scenario: A withdrawn score offers Unwithdraw
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Unwithdraw"

    Scenario: A withdrawn score does not offer Withdraw
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" does not offer "Withdraw"

    Scenario: A withdrawn score offers Edit
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the score of "Sam Someone" beating "Alex Another" offers "Edit"

    Scenario: Unwithdrawing a score no longer strikes it through
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Unwithdraw" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" is not struck through

    Scenario: A refused Unwithdraw is said above the list
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Unwithdraw" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the tab is refused with "CompetitionPlayer.Withdrawn"

  Rule: A refused Restore is said beneath the score it was pressed on

    Restore is refused where the score could not be added now: where one of its
    players has withdrawn since, or where the match it was played in has been
    decided by another score. The list may be long, so the refusal is said
    beneath the score, where the reader pressed Restore, and not above the whole
    list, away from it. Any other refusal is still said above the list.

    Scenario: A refused Restore is said beneath the score
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" says it was refused with "CompetitionPlayer.Withdrawn"

    Scenario: A refused Restore is not said above the list
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" says it was refused with "CompetitionPlayer.Withdrawn"
      And nothing is said above the list of scores

    Scenario: A score that was not refused says nothing beneath it
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      And "Sam Someone" has beaten "Chris Third" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Chris Third" in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the player "Alex Another" from "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Chris Third" says nothing was refused

    Scenario: A refused Restore in a knockout is said beneath the score
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Final Stage" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 3 in "Final Stage" of "Spring Open"
      And the scores of "Final Stage" in "Spring Open" are open
      When "Restore" is pressed on the score of "Sam Someone" beating "Alex Another"
      Then the score of "Sam Someone" beating "Alex Another" says it was refused with "Competition.MatchDecided"

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A player's name is what
    the manager typed, and nobody's language, and a score is a number.

    Scenario: The scores in use are in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' names is in the test locale

    Scenario: The archived scores are in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' names is in the test locale

    Scenario: A withdrawn score is in the reader's language
      Given a browser that asks for "en-XA"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn the score of "Sam Someone" beating "Alex Another" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' names is in the test locale

    Scenario: A competition with no scores says so in the reader's language
      Given a browser that asks for "en-XA"
      When the scores of "Block A" in "Spring Open" are opened
      Then every word in the tab but the players' names is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario: Add Score can be pressed with a thumb
      When the scores of "Block A" in "Spring Open" are opened
      Then the button "Add Score" is at least 44 pixels tall

    Scenario Outline: What a score offers can be pressed with a thumb
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "Chris Third" has beaten "Sam Someone" 26 to 3 in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the score of "Chris Third" beating "Sam Someone" in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then "<option>" on the score of "<winner>" beating "<loser>" is at least 44 pixels tall

      Examples:
        | winner      | loser        | option   |
        | Sam Someone | Alex Another | Archive  |
        | Sam Someone | Alex Another | Withdraw |
        | Chris Third | Sam Someone  | Restore  |

    Scenario: Long names wrap rather than widening the page
      Given "organiser@example.com" has added the player "Maximilian Alexander Fitzwilliam-Worthington" to "Spring Open"
      And "organiser@example.com" has added the player "Bartholomew Montgomery Featherstonehaugh" to "Spring Open"
      And "organiser@example.com" has entered the player "Maximilian Alexander Fitzwilliam-Worthington" in "Block A" of "Spring Open"
      And "organiser@example.com" has entered the player "Bartholomew Montgomery Featherstonehaugh" in "Block A" of "Spring Open"
      And "Maximilian Alexander Fitzwilliam-Worthington" has beaten "Bartholomew Montgomery Featherstonehaugh" 26 to 25 in "Block A" of "Spring Open"
      When the scores of "Block A" in "Spring Open" are opened
      Then the page is no wider than the window
