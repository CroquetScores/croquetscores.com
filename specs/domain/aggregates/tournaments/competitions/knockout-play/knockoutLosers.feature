Feature: Who a knockout's losers are, to be entered in a knockout of their own

  Many knockouts are run as a set: the main knockout, then another for those
  knocked out of its first round, and another for those knocked out of its
  second. The players of those later knockouts are the main knockout's losers
  of a round, and this says who they are and in what order, so that a person
  does not have to type them in again (issue 401). Using it is optional: a
  knockout can still be filled with players one at a time.

  The losers of a round are in the order of the matches they lost, the first
  match's loser first, as the draw is read from the top. So if the second
  player of every first-round match loses, the knockout for them has the
  second, fourth, sixth and eighth players in that order.

  The scenarios here are about a knockout of 8 places, each round the best of 1,
  with eight players, so that the first round is "Player 1" meeting "Player 2",
  "Player 3" meeting "Player 4", and so on.

  Background:
    Given a knockout draw of 8 places, each round the best of 1
    And "Player 1" is drawn in the next place
    And "Player 2" is drawn in the next place
    And "Player 3" is drawn in the next place
    And "Player 4" is drawn in the next place
    And "Player 5" is drawn in the next place
    And "Player 6" is drawn in the next place
    And "Player 7" is drawn in the next place
    And "Player 8" is drawn in the next place

  Rule: The losers of a round are in the order of the matches they lost

    Scenario: The loser of the first match of the round is first
      Given "Player 1" beat "Player 2" in the knockout
      And "Player 4" beat "Player 3" in the knockout
      When the knockout is played out
      And the losers of the first round are read
      Then the first loser is "Player 2"
      And the second loser is "Player 3"

    Scenario: The second player of each match losing gives the second, fourth, sixth and eighth
      Given "Player 1" beat "Player 2" in the knockout
      And "Player 3" beat "Player 4" in the knockout
      And "Player 5" beat "Player 6" in the knockout
      And "Player 7" beat "Player 8" in the knockout
      When the knockout is played out
      And the losers of the first round are read
      Then the first loser is "Player 2"
      And the second loser is "Player 4"
      And the third loser is "Player 6"
      And the fourth loser is "Player 8"

    Scenario: The losers of the second round are those beaten in it, not those beaten before
      Given "Player 1" beat "Player 2" in the knockout
      And "Player 3" beat "Player 4" in the knockout
      And "Player 5" beat "Player 6" in the knockout
      And "Player 7" beat "Player 8" in the knockout
      And "Player 1" beat "Player 3" in the knockout
      And "Player 7" beat "Player 5" in the knockout
      When the knockout is played out
      And the losers of the second round are read
      Then the first loser is "Player 3"
      And the second loser is "Player 5"

  Rule: A match not yet decided has no loser yet

    So a knockout for the losers can be started as the first round is played
    and filled as it goes, and the later losers keep their places in order
    rather than moving up.

    Scenario: A loser is not yet known while their match is undecided
      Given "Player 3" beat "Player 4" in the knockout
      When the knockout is played out
      And the losers of the first round are read
      Then the first loser is not yet known
      And the second loser is "Player 4"

  Rule: A withdrawn player's place in the losers' knockout is a bye

    A withdrawn player loses every match of theirs not already decided, but
    would not turn up to play on. Their place stays, as a bye, so that the
    others keep their order and whoever drew next to it goes through.

    Scenario: A loser who withdrew is a bye
      Given "Player 1" beat "Player 2" in the knockout
      And "Player 3" beat "Player 4" in the knockout
      And the drawn player "Player 4" has withdrawn
      When the knockout is played out
      And the losers of the first round are read
      Then the first loser is "Player 2"
      And the second loser is a bye

    Scenario: A player who withdrew without playing is a bye in the match they would have lost
      Given the drawn player "Player 2" has withdrawn
      When the knockout is played out
      And the losers of the first round are read
      Then the first loser is a bye
