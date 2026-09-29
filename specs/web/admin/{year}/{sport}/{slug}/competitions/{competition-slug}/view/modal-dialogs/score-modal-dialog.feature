@browser @postgres
Feature: A game's score is added to a competition in a modal dialog

  A manager or a scorer adds the scores of a competition's games from its
  Scores tab, by pressing "Add Score" (`scores-tab.feature`). That opens the
  score dialog over the page. It asks for what a game is: who won and their
  score, and who lost and theirs.

  It is a modal dialog, as the player dialog is (`player.feature`): it sits
  over the page it was opened from, nothing outside it can be pressed or
  reached by the keyboard while it is open, and it has no address. It offers
  its own way out, Cancel, and Escape does what Cancel does. Cancelling keeps
  nothing that was not already kept, and the reader is back on Add Score.

  The dialog reads as the result is said aloud, a row at a time: the winner
  and their score, then "beat", then the loser and their score, then Add
  Game, then Cancel. The winner and the loser are each chosen from the
  competition's players who are playing, in the competition's order, with no
  one chosen to begin with, so that a game is never put down against a
  player the reader did not choose. A withdrawn player is not offered, since
  they play no more of the competition. A score is typed as the scorer wrote
  it down: its number of points, and whatever follows, which is kept, as
  "26tp" (`Score.feature`). A game won on equal points says who won it by a
  mark after the winner's score, as "6w". So each score is typed on a
  phone's keyboard of letters rather than a keypad of numbers.

  Scores come in a batch, read off a board or a card at the end of a round,
  so Add Game does not close the dialog. It adds the game, says in words which
  game was added, and empties the fields for the next, with the reader back
  on the winner. A screen reader is told as well, since nothing else on the
  dialog changes where the reader is. Whenever a game is added, the Scores
  tab beneath asks for its list again.

  Everything is required. What is refused is said beneath the field it is
  about, by the refusal's code, and what was chosen and typed stays so that
  it can be put right: a winner or a loser not chosen, a score not typed, a
  score that does not begin with a digit, the same player chosen as both, a 
  loser's score marked as the winner's, and a winner's score that is fewer 
  than the loser's, or equal to it with no mark where the tournament does 
  not allow drawn games (`Game.feature`). A refusal about no one field, such 
  as a knockout refusing two players who are not drawn to meet, is said above 
  the fields. Nothing refused is kept, and the dialog stays open.

  The admin draws the dialog itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

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
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Chris Third" in "Block A" of "Spring Open"

  Rule: Add Score opens the dialog

    Scenario: Add Score opens the score dialog
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is open

    Scenario: The dialog is titled for what it does
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is titled "Add Score"

    Scenario: A scorer can open the dialog
      Given "scorer@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the reader has signed in as "scorer@example.com" with the password "another horse battery staple"
      And the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is open

    Scenario Outline: The dialog asks for what a game is
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog asks for "<field>"

      Examples:
        | field          |
        | Winner         |
        | Winner's score |
        | Loser          |
        | Loser's score  |

    Scenario Outline: The dialog begins with nothing chosen or typed
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "<field>" is empty

      Examples:
        | field          |
        | Winner         |
        | Winner's score |
        | Loser          |
        | Loser's score  |

    Scenario: The dialog adds with Add Game
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog's first button is "Add Game"

  Rule: The dialog reads as the result is said aloud

    Scenario: The winner is above the loser
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Winner" is above "Loser"

    Scenario: The dialog says "beat" between the winner and the loser
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog says "beat" between "Winner" and "Loser"

    Scenario: The winner's score is on the winner's row
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Winner's score" is beside "Winner"

    Scenario: The loser's score is on the loser's row
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Loser's score" is beside "Loser"

    Scenario: Add Game is below the loser
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Loser" is above "Add Game"

    Scenario: Cancel is below Add Game
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Add Game" is above "Cancel"

  Rule: The players offered are those playing, in the competition's order

    Scenario Outline: A player playing is offered as each of winner and loser
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Sam Someone" is offered as the "<field>"

      Examples:
        | field  |
        | Winner |
        | Loser  |

    Scenario: The players are offered in the competition's order
      Given "organiser@example.com" has moved the player "Chris Third" in "Block A" of "Spring Open" up
      And the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Chris Third" is offered before "Alex Another" as the "Winner"

    Scenario: A withdrawn player is not offered
      Given "organiser@example.com" has withdrawn the player "Chris Third" from "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Chris Third" is not offered as the "Winner"

    Scenario: A player of the tournament not in the competition is not offered
      Given "organiser@example.com" has added the player "Pat Fourth" to "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Pat Fourth" is not offered as the "Winner"

    Scenario: No player is the first choice
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the first choice offered as the "Winner" is nobody

  Rule: A score can be typed with what follows its number

    Scenario Outline: A score does not bring up a keypad of numbers
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "<field>" does not bring up a keypad of numbers

      Examples:
        | field          |
        | Winner's score |
        | Loser's score  |

  Rule: The dialog sits over the page, and nothing outside it can be reached

    Scenario: Opening the dialog leaves the address as it was
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: The dialog is announced as a modal dialog
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is announced as a modal dialog

    Scenario: The dialog is named by its title
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is named "Add Score"

    Scenario: The reader is put on the winner when the dialog opens
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "Winner" has the focus

    Scenario: The keyboard does not leave the dialog going forward
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      When Tab is pressed until the focus comes round again
      Then the focus never left the score dialog

    Scenario: The keyboard does not leave the dialog going back
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      When Shift and Tab are pressed until the focus comes round again
      Then the focus never left the score dialog

  Rule: Cancel closes the dialog and keeps nothing

    Scenario: The dialog has a Cancel button
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog's second button is "Cancel"

    Scenario: Cancel closes the dialog
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      When "Cancel" is pressed
      Then the score dialog is not open

    Scenario: Escape closes the dialog
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      When Escape is pressed
      Then the score dialog is not open

    Scenario: Cancelling adds no game
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Cancel" is pressed
      Then "Block A" of "Spring Open" has no scores

    Scenario: Cancelling keeps the games already added
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      And "Add Game" is pressed
      When "Cancel" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: The reader is back on Add Score once the dialog is cancelled
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      When "Cancel" is pressed
      Then "Add Score" has the focus

  Rule: Add Game adds the game and empties the dialog for the next

    Background:
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"

    Scenario: The game added is one of the competition's
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 17

    Scenario: The game added is listed on the Scores tab beneath
      When "Add Game" is pressed
      Then the score of "Sam Someone" beating "Alex Another" is listed

    Scenario: Adding leaves the dialog open
      When "Add Game" is pressed
      Then the score dialog is open

    Scenario: Adding says which game was added
      When "Add Game" is pressed
      Then the score dialog says the game "Sam Someone" won against "Alex Another" was added

    Scenario: Which game was added is told to a screen reader
      When "Add Game" is pressed
      Then what the score dialog says about the game added is announced

    Scenario Outline: Adding empties each field
      When "Add Game" is pressed
      Then "<field>" is empty

      Examples:
        | field          |
        | Winner         |
        | Winner's score |
        | Loser          |
        | Loser's score  |

    Scenario: Adding puts the reader back on the winner
      When "Add Game" is pressed
      Then "Winner" has the focus

    Scenario: A second game is added after the first
      Given "Add Game" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "3" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Chris Third" beating "Sam Someone" 26 to 3

    Scenario: The second game added is the one said to be added
      Given "Add Game" is pressed
      And "Chris Third" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "3" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog says the game "Chris Third" won against "Sam Someone" was added

    Scenario: Which game was added is no longer said once the next winner is chosen
      Given "Add Game" is pressed
      When "Chris Third" is chosen as the "Winner"
      Then the score dialog says no game was added

  Rule: What is refused is said beside the field it is about

    Each refusal is said in its own words as well as by its code. The admin
    is sent the words it says rather than every word the site has
    (`admin.feature`), and a refusal whose words it was not sent is said in
    its words for any, which are in the reader's language too, so only its
    own words show that it was sent them.

    The knockout's draw is four places, each round the best of 1, so Sam
    Someone plays Alex Another in the first round and Chris Third has a bye:
    Sam Someone and Chris Third are not drawn to meet.

    Scenario Outline: A game with a field left empty is refused beside that field
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      And "<field>" is emptied
      When "Add Game" is pressed
      Then "<field>" is refused with "<code>"
      And the modal dialog says the words for "<code>"

      Examples:
        | field          | code                    |
        | Winner         | Game.WinnerMissing      |
        | Winner's score | Game.WinnerScoreMissing |
        | Loser          | Game.LoserMissing       |
        | Loser's score  | Game.LoserScoreMissing  |

    Scenario Outline: A score that does not begin with a digit is refused beside it
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "<score>" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Loser's score" is refused with "<code>"
      And the modal dialog says the words for "<code>"

      Examples:
        | score | code           |
        | -1    | Score.NoPoints |
        | w     | Score.NoPoints |

    Scenario: The same player as winner and loser is refused beside the loser
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Loser" is refused with "Game.SamePlayer"
      And the modal dialog says the words for "Game.SamePlayer"

    Scenario Outline: A winner's score not more than the loser's is refused beside the winner's score
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "<winner>" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "<loser>" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Winner's score" is refused with "Game.WinnerNotAhead"
      And the modal dialog says the words for "Game.WinnerNotAhead"

      Examples:
        | winner | loser |
        | 17     | 26    |
        | 17     | 17    |

    Scenario: A winner's score marked, equal to the loser's, is added
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "6w" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "6" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 6w to 6

    Scenario: What follows a score's number is kept
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26tp" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26tp to 17

    Scenario: A loser's score marked is refused beside the loser's score
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17w" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Loser's score" is refused with "Game.LoserMarked"
      And the modal dialog says the words for "Game.LoserMarked"

    Scenario: Two players of a knockout who are not drawn to meet are refused above the fields
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Chris Third" in "Final Stage" of "Spring Open"
      And the scores of "Final Stage" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Chris Third" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog says "Competition.NotDrawnToMeet" above the fields
      And the modal dialog says the words for "Competition.NotDrawnToMeet"

    Scenario: A winner's score equal to the loser's with no mark is added where the tournament allows drawn games
      Given the tournament "Spring Open" allows drawn games
      And the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "6" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "6" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 6 to 6

    Scenario: A winner's score one more than the loser's is added
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "18" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 18 to 17

    Scenario: A loser's score of 0 is added
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Alex Another" is chosen as the "Loser"
      And "0" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has the score of "Sam Someone" beating "Alex Another" 26 to 0

    Scenario: A refused game is not added
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Block A" of "Spring Open" has no scores

    Scenario: A refused dialog stays open
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog is open

    Scenario: A refused dialog keeps what was typed
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Winner's score" says "26"

    Scenario: A refused dialog says no game was added
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then the score dialog says no game was added

    Scenario: The reader is taken to the field refused
      Given the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      And "Sam Someone" is chosen as the "Winner"
      And "26" is typed as the "Winner's score"
      And "Sam Someone" is chosen as the "Loser"
      And "17" is typed as the "Loser's score"
      When "Add Game" is pressed
      Then "Loser" has the focus

  Rule: Every word the dialog says is in the reader's language

    The test locale shows it (`language.feature`). The players' names are
    what the manager typed, and nobody's language, and a score is a number.

    Scenario: The dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the scores of "Block A" in "Spring Open" are open
      When the way to add a score is pressed
      Then every word in the score dialog but the players' names is in the test locale

    Scenario: A refused dialog is in the reader's language
      Given a browser that asks for "en-XA"
      And the scores of "Block A" in "Spring Open" are open
      And the way to add a score is pressed
      When the score dialog is sent as it is
      Then the score dialog says what it refused

    Scenario: What a refused dialog says is in the reader's language
      Given a browser that asks for "en-XA"
      And the scores of "Block A" in "Spring Open" are open
      And the way to add a score is pressed
      When the score dialog is sent as it is
      Then every word in the score dialog but the players' names is in the test locale

    Scenario: What the dialog says once a game is added is in the reader's language
      Given a browser that asks for "en-XA"
      And the scores of "Block A" in "Spring Open" are open
      And the way to add a score is pressed
      And "Sam Someone" is chosen as the winner in the score dialog
      And "26" is typed as the winner's score in the score dialog
      And "Alex Another" is chosen as the loser in the score dialog
      And "17" is typed as the loser's score in the score dialog
      When the score dialog is sent as it is
      Then every word in the score dialog but the players' names is in the test locale

  Rule: The dialog is laid out for a phone first

    Scenario: The dialog is no wider than the window
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the score dialog is no wider than the window

    Scenario Outline: Each field can be pressed with a thumb
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then "<field>" is at least 44 pixels tall

      Examples:
        | field          |
        | Winner         |
        | Winner's score |
        | Loser          |
        | Loser's score  |

    Scenario Outline: Each button can be pressed with a thumb
      Given the scores of "Block A" in "Spring Open" are open
      When "Add Score" is pressed
      Then the button "<button>" is at least 44 pixels tall

      Examples:
        | button   |
        | Add Game |
        | Cancel   |

    Scenario: A long name does not push the score off the window
      Given "organiser@example.com" has added the player "Maximilian Alexander Fitzwilliam-Worthington" to "Spring Open"
      And "organiser@example.com" has entered the player "Maximilian Alexander Fitzwilliam-Worthington" in "Block A" of "Spring Open"
      And the scores of "Block A" in "Spring Open" are open
      And "Add Score" is pressed
      When "Maximilian Alexander Fitzwilliam-Worthington" is chosen as the "Winner"
      Then the score dialog is no wider than the window
