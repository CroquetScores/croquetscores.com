Feature: A player's score in a game

  Each player in a game has a score: the number of points they made, typed
  as digits. There is no most a score can be: a game is played to 26 in
  association croquet and to 7 in golf croquet, but a game can be played to
  any number, or stopped by time, so the sport does not settle it.

  What a scorer writes down is often more than the number, as "26tp" for 26
  hoops and a triple peel. A score is typed as it was written down, and the
  number of points is the digits it begins with, up to the first thing that
  is not a digit. Whatever follows means nothing to the site, but it is the
  scorer's, so it is kept, and a score is written exactly as it was typed,
  without the whitespace at either end. A score that does not begin with a
  digit has no number of points, and is refused: "-1", "w" and nothing at all
  are not scores.

  A game can be won on equal points, where it is stopped by time and settled
  some other way, so what follows the number can mark the score as the
  winner's, as "6w" for six points and the game. What follows is a mark when
  it is one of the website's marks and nothing else, with or without a space
  before it, however it is capitalised, since each sport writes its own: on
  Croquet Scores a mark is "w", "won" or "winner", and on Gateball Scores
  "cb" as well. Anything else that follows marks nothing.

  Background:
    Given the website "croquetscores.com"

  Rule: A score's points are the digits it begins with

    Scenario Outline: A score's points are the digits it begins with
      When the score "<typed>" is read
      Then the score's points are <points>

      Examples:
        | typed | points |
        | 0     | 0      |
        | 26    | 26     |
        | 100   | 100    |
        | 26tp  | 26     |
        | 26 tp | 26     |
        | 1.5   | 1      |
        | 07    | 7      |

    Scenario Outline: A score that does not begin with a digit is refused
      When the score "<typed>" is read
      Then it is refused for breaking "Score.NoPoints"

      Examples:
        | typed |
        | -1    |
        | w     |
        | tp26  |
        |       |

    Scenario: A score with spaces around it has the points it begins with
      When the score " 26tp " is read
      Then the score's points are 26

  Rule: A score is written exactly as it was typed

    Scenario Outline: A score is written as it was typed
      When the score "<typed>" is read
      Then the score is written "<typed>"

      Examples:
        | typed    |
        | 26       |
        | 26tp     |
        | 26 TP!   |
        | 6w       |
        | 6 Winner |

    Scenario: A score is written without the spaces around it
      When the score " 26tp " is read
      Then the score is written "26tp"

  Rule: One score is more than another when it has more points

    Scenario: A score with more points is more
      Given the score "26tp"
      When it is compared with the score "17"
      Then it is more

    Scenario: A score with the same points is not more, whatever follows
      Given the score "17tp"
      When it is compared with the score "17"
      Then it is not more

    Scenario: A score with fewer points is not more
      Given the score "17"
      When it is compared with the score "26"
      Then it is not more

  Rule: A score whose ending is one of the website's marks is marked as the winner's

    Scenario: A score that is only its number is not marked
      When the score "26" is read
      Then the score is not marked as the winner's

    Scenario Outline: A score ending in a mark on Croquet Scores is marked as the winner's
      When the score "<typed>" is read
      Then the score is marked as the winner's

      Examples:
        | typed    |
        | 6w       |
        | 6won     |
        | 6winner  |
        | 6 w      |
        | 6 Won    |
        | 6W       |
        | 6 WINNER |

    Scenario Outline: A score ending in a mark on Gateball Scores is marked as the winner's
      Given the website "gateballscores.com"
      When the score "<typed>" is read
      Then the score is marked as the winner's

      Examples:
        | typed |
        | 6w    |
        | 6won  |
        | 6cb   |
        | 6 CB  |

    Scenario Outline: A score ending in anything else is not marked
      When the score "<typed>" is read
      Then the score is not marked as the winner's

      Examples:
        | typed |
        | 26tp  |
        | 6cb   |
        | 6wtp  |
        | 6 w!  |
