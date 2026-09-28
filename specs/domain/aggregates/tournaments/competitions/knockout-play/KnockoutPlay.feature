Feature: How a knockout has been played so far

  A knockout's matches are worked out afresh from its draw, its players in
  the competition's order and the games that count, rather than kept
  (`addGame.feature`). The players fill the draw's places in order, and the
  winner of each match goes through to meet the winner of the match drawn
  next to theirs, until one player is left, who wins the knockout.

  A player whose opponent's place is empty, or whose opponent is nobody
  because both players of the match before withdrew, has a bye, and goes
  through without playing. A withdrawn player loses every match of theirs not
  already decided (`withdrawPlayer.feature`), and a bye is one of those
  unless they have played on past it: a bye they had used when they withdrew
  sends them through, so that the games they played after it still count,
  and one they had not used sends nobody through. So a withdrawn player never
  wins a knockout they had not already won by the time they withdrew.

  The scenarios here are about a knockout of four places, each round the best
  of 1, with three players, so that Sam Someone meets Alex Another in the
  first round and Chris Third has a bye.

  Background:
    Given a knockout draw of 4 places, each round the best of 1
    And "Sam Someone" is drawn in the next place
    And "Alex Another" is drawn in the next place
    And "Chris Third" is drawn in the next place

  Rule: A player with a bye goes through without playing

    Scenario: A player with a bye wins once both players drawn next to them withdraw
      Given the drawn player "Sam Someone" has withdrawn
      And the drawn player "Alex Another" has withdrawn
      When the knockout is played out
      Then the knockout is won by "Chris Third"

    Scenario: A player with a bye has not yet won while the match drawn next to them is undecided
      When the knockout is played out
      Then the knockout's winner is not yet known

  Rule: A bye sends a withdrawn player through only once they have played on past it

    Scenario: A withdrawn player with a bye does not win once both players drawn next to them withdraw
      Given the drawn player "Sam Someone" has withdrawn
      And the drawn player "Alex Another" has withdrawn
      And the drawn player "Chris Third" has withdrawn
      When the knockout is played out
      Then nobody wins the knockout

    Scenario: A withdrawn player with a bye loses to the winner of the match drawn next to them
      Given "Sam Someone" beat "Alex Another" in the knockout
      And the drawn player "Chris Third" has withdrawn
      When the knockout is played out
      Then the knockout is won by "Sam Someone"

    Scenario: A player who used their bye and won the final before withdrawing still wins
      Given "Sam Someone" beat "Alex Another" in the knockout
      And "Chris Third" beat "Sam Someone" in the knockout
      And the drawn player "Chris Third" has withdrawn
      When the knockout is played out
      Then the knockout is won by "Chris Third"

    Scenario: The game a withdrawn player played after their bye still counts
      Given "Sam Someone" beat "Alex Another" in the knockout
      And "Chris Third" beat "Sam Someone" in the knockout
      And the drawn player "Chris Third" has withdrawn
      When the knockout is played out
      Then the game of "Chris Third" beating "Sam Someone" counts
