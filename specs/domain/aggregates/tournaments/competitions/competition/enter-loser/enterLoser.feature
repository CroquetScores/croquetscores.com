Feature: Entering the loser of a match in a losers knockout

  A losers knockout takes the players who lost a round of another knockout,
  and they are put there as each match is decided, not by hand. Whatever
  asks has worked out who lost which match of that round
  (`KnockoutPlay.feature`) and asks the losers knockout to enter them, with
  the place of the match they lost, the first match being the first place.

  The place, and not when they are entered, is where a loser is drawn: the
  loser of the second match is in the second place whether or not the first
  match has been decided. So a place whose match is not yet decided is
  somebody not yet known, and not a bye, and a match can be played as soon as
  both its places are filled. Where a match of the round was a bye, nobody
  lost it, and a bye is entered in its place.

  Asking again after every game is how this is kept in step, so a place that
  is filled with the loser asked for is left as it is, and records nothing.

  A game set aside or corrected can change who lost a match, so the place is
  asked for again and the loser who was put there is taken out for the one who
  lost it, or for nobody. That is only done while nothing has been built on the
  place: once a game has been played by either of the two places that meet in
  the first round of the losers knockout, they are left as they are.

  The players of a losers knockout are the losers of the round it takes them
  from and nobody else, so entering, moving or removing one by hand is refused
  with `Competition.PlayersSetAutomatically`, and a place the draw does not
  have is refused with `Competition.NoSuchPlace`. Only a losers knockout takes
  losers, and anything else is refused with `Competition.NotALosersKnockout`.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And the competition is a losers knockout of 4 places, each round the best of 1

  Rule: A loser is entered in the place of the match they lost

    Scenario: Entering a loser records a player being entered
      Given the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the first place
      Then it has recorded 1 event
      And the first thing it recorded is a player being entered

    Scenario: A loser entered is a player in the competition
      Given the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the first place
      Then the competition has the tournament player "Sam Someone"

    Scenario: A loser is drawn in the place of the match they lost
      Given the loser "Alex Another" was entered in the second place
      And the competition is rebuilt from its stream
      When the competition's matches are worked out
      Then the first side of the first match is not yet known
      And the second side of the first match is "Alex Another"

    Scenario: The losers meet in the order of the matches they lost
      Given the loser "Alex Another" was entered in the second place
      And the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When the competition's matches are worked out
      Then the first side of the first match is "Sam Someone"
      And the second side of the first match is "Alex Another"

    Scenario: A bye is entered where nobody lost the match
      Given the competition is rebuilt from its stream
      When a bye is entered as the loser in the first place
      Then it has recorded 1 event
      And the first thing it recorded is a player being entered

    Scenario: A bye is drawn as nobody
      Given a bye was entered as the loser in the first place
      And the competition is rebuilt from its stream
      When the competition's matches are worked out
      Then the first side of the first match is nobody

    Scenario: A place already filled with the same loser is left as it is
      Given the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the first place
      Then it has recorded 0 events

    Scenario: A bye already in the place is left as it is
      Given a bye was entered as the loser in the first place
      And the competition is rebuilt from its stream
      When a bye is entered as the loser in the first place
      Then it has recorded 0 events

  Rule: A place is changed when the match was decided otherwise, until it is played on

    Scenario: A different loser replaces the one who was there
      Given the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When the loser "Alex Another" is entered in the first place
      Then it has recorded 2 events
      And the competition has the tournament player "Alex Another"

    Scenario: The loser who was there is taken out
      Given the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When the loser "Alex Another" is entered in the first place
      Then the competition does not have the tournament player "Sam Someone"

    Scenario: A loser replaces a bye
      Given a bye was entered as the loser in the first place
      And the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the first place
      Then it has recorded 2 events

    Scenario: A bye replaces a loser
      Given the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When a bye is entered as the loser in the first place
      Then it has recorded 2 events

    Scenario: A place whose player has played is left as it is
      Given the loser "Sam Someone" was entered in the first place
      And the loser "Alex Another" was entered in the second place
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the loser "Chris Third" is entered in the first place
      Then it has recorded 0 events

    Scenario: A place drawn against one who has played is left as it is
      Given the loser "Sam Someone" was entered in the first place
      And the loser "Alex Another" was entered in the second place
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When a bye is entered as the loser in the second place
      Then it has recorded 0 events

    Scenario: A loser who has played in another place is not entered again
      Given the loser "Sam Someone" was entered in the first place
      And the loser "Alex Another" was entered in the second place
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the third place
      Then it has recorded 0 events

    Scenario: A place is cleared when nobody has lost its match any more
      Given the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When the first place is cleared
      Then it has recorded 1 event
      And the competition does not have the tournament player "Sam Someone"

    Scenario: A bye is cleared
      Given a bye was entered as the loser in the first place
      And the competition is rebuilt from its stream
      When the first place is cleared
      Then it has recorded 1 event

    Scenario: A place with nobody in it is cleared of nothing
      Given the competition is rebuilt from its stream
      When the first place is cleared
      Then it has recorded 0 events

    Scenario: A place whose player has played is not cleared
      Given the loser "Sam Someone" was entered in the first place
      And the loser "Alex Another" was entered in the second place
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the first place is cleared
      Then it has recorded 0 events

    Scenario: A place beyond the draw is not cleared
      Given the competition is rebuilt from its stream
      When the fifth place is cleared
      Then it is refused with "Competition.NoSuchPlace"

    Scenario: A knockout that takes no losers has no place to clear
      Given the competition is a knockout of 4 places, each round the best of 1
      And the competition is rebuilt from its stream
      When the first place is cleared
      Then it is refused with "Competition.NotALosersKnockout"

  Rule: A loser is entered only in a place the draw has

    Scenario: Entering a loser in a place beyond the draw is refused
      Given the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the fifth place
      Then it is refused with "Competition.NoSuchPlace"

  Rule: Two losers who are drawn to meet can play once both are in

    Scenario: Two losers drawn to meet can have a game added
      Given the loser "Sam Someone" was entered in the first place
      And the loser "Alex Another" was entered in the second place
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then it has recorded 1 event

    Scenario: A game is not added while the other place of the match is empty
      Given the loser "Sam Someone" was entered in the first place
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is added
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: Nobody changes the players of a losers knockout by hand

    Scenario: Entering a player is refused
      Given the competition is rebuilt from its stream
      When the tournament player "Sam Someone" is entered
      Then it is refused with "Competition.PlayersSetAutomatically"

    Scenario: Entering a bye is refused
      Given the competition is rebuilt from its stream
      When a bye is entered
      Then it is refused with "Competition.PlayersSetAutomatically"

  Rule: Only a losers knockout takes losers

    Scenario: Entering a loser in a knockout that takes none is refused
      Given the competition is a knockout of 4 places, each round the best of 1
      And the competition is rebuilt from its stream
      When the loser "Sam Someone" is entered in the first place
      Then it is refused with "Competition.NotALosersKnockout"
