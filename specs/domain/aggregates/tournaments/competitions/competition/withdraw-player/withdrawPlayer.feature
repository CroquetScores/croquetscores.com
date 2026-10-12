Feature: Withdrawing a competition's player, and reversing it

  A player who will play no more of a competition is withdrawn: they stay in
  it, with their games, but play no more of it (`CompetitionPlayer.feature`).
  They are out of the way, so they are put last: given 10,000 more than the
  highest order in the competition, so that they come after every player still
  playing. A withdrawn player can have their withdrawal reversed, and plays
  again. They keep the order they were given when they withdrew, so they come
  back after the players who stayed, rather than in the place they had, which
  somebody else may have been moved into since.

  A knockout is drawn in the competition's order (`addGame.feature`), so a
  player who withdraws from one keeps their order, and with it their place in
  the draw: they lose every match of theirs not already decided when they
  withdraw, and their opponent goes through without playing. A match decided
  before then stays decided, so a player who went through because their
  opponent withdrew, and withdraws themselves later, keeps it
  (`KnockoutPlay.feature`). Their withdrawal can be reversed
  until whoever went through because of it has played on, in whichever later
  round, the player drawn next to two players who both withdrew among them;
  after that, it is refused, as archiving a game whose winner has played on
  is, since reversing it would leave that game played by somebody who had not
  got there. Whatever asks says what kind of competition it is; the scenarios
  here are about a block unless they say otherwise.

  Withdrawing a player who has withdrawn, or reversing the withdrawal of one
  who has not, records nothing, because nothing happened: two people doing the
  same thing at once, or a form sent twice, is not a mistake worth refusing.

  A scenario that does not say what order a tournament player has gives the
  tournament players it names orders 10,000 apart, in the order it first
  names them (`enterPlayer.feature`).

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"
    And a competition with no players
    And the tournament player "Sam Someone" was entered in it

  Rule: A player withdrawn has withdrawn

    Scenario: Withdrawing a player records it
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then it has recorded 1 event
      And the first thing it recorded is a player withdrawing

    Scenario: A player withdrawn has withdrawn
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then the competition's player "Sam Someone" has withdrawn

    Scenario: A player withdrawn is still in the competition
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then the competition has the tournament player "Sam Someone"

    Scenario: A competition rebuilt after a player withdrew has them withdrawn
      Given the player "Sam Someone" withdrew from it
      When the competition is rebuilt from its stream
      Then the competition's player "Sam Someone" has withdrawn

    Scenario: Withdrawing a withdrawn player records nothing
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then it has recorded 0 events

  Rule: In a block or a Swiss, a withdrawn player's games count for nothing

    Wherever games are counted or shown, a withdrawn player's count for
    nothing in a block or a Swiss, on both sides, as an archived or a
    withdrawn game does: a player who left partway met some of the others
    and not the rest, and what they played must not rank those they met
    above those they did not. In a knockout they count, since each decided a
    match that stands (`KnockoutPlay.feature`), and a knockout ranks nobody
    by what they played.

    Scenario: A withdrawn player's game counts for nothing
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the player "Sam Someone" withdrew from it
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts for nothing

    Scenario: A game against a withdrawn player counts for nothing
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the player "Alex Another" withdrew from it
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts for nothing

    Scenario: A game between players who have not withdrawn counts
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts

    Scenario: A game of a player whose withdrawal was reversed counts again
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts

    Scenario: A withdrawn game counts for nothing
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is withdrawn
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts for nothing

    Scenario: An archived game counts for nothing
      Given the tournament player "Alex Another" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the competition is rebuilt from its stream
      When the game of "Sam Someone" beating "Alex Another" 26 to 17 is archived
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts for nothing

    Scenario: In a knockout, a withdrawn player's game counts
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the tournament player "Kim Keeper" was entered in it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the player "Sam Someone" withdrew from it
      When the competition is rebuilt from its stream
      Then the competition's game of "Sam Someone" beating "Alex Another" 26 to 17 counts

  Rule: A player withdrawn is put last

    Scenario: A player withdrawn is given 10,000 more than the highest order
      Given the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then the competition's player "Sam Someone" has the order 30000

    Scenario: A player withdrawn comes after the players still playing
      Given the tournament player "Alex Another" was entered in it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then the competition's first player is "Alex Another"

    Scenario: A competition rebuilt after a player withdrew has them last
      Given the tournament player "Alex Another" was entered in it
      And the player "Sam Someone" withdrew from it
      When the competition is rebuilt from its stream
      Then the competition's player "Sam Someone" has the order 30000

    Scenario: A withdrawn player withdrawn again keeps their order
      Given the tournament player "Alex Another" was entered in it
      And the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then the competition's player "Sam Someone" has the order 30000

  Rule: A withdrawn player's withdrawal can be reversed

    Scenario: Reversing a withdrawal records it
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then it has recorded 1 event
      And the first thing it recorded is a player's withdrawal being reversed

    Scenario: A player whose withdrawal is reversed has not withdrawn
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then the competition's player "Sam Someone" has not withdrawn

    Scenario: A player whose withdrawal is reversed keeps the order they were given
      Given the tournament player "Alex Another" was entered in it
      And the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then the competition's player "Sam Someone" has the order 30000

    Scenario: A player whose withdrawal is reversed comes after the players who stayed
      Given the tournament player "Alex Another" was entered in it
      And the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then the competition's first player is "Alex Another"

    Scenario: A competition rebuilt after a withdrawal was reversed has the player playing
      Given the player "Sam Someone" withdrew from it
      And the withdrawal of the player "Sam Someone" was reversed
      When the competition is rebuilt from its stream
      Then the competition's player "Sam Someone" has not withdrawn

    Scenario: Reversing the withdrawal of a player who has not withdrawn records nothing
      Given the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then it has recorded 0 events

  Rule: Only a player there is can be withdrawn

    Scenario: Withdrawing a player the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the player "competition-player/123e4567-e89b-42d3-a456-426614174000" is withdrawn by their id
      Then it is refused with "Competition.NoSuchPlayer"

    Scenario: Reversing the withdrawal of a player the competition does not have is refused
      Given the competition is rebuilt from its stream
      When the withdrawal of the player "competition-player/123e4567-e89b-42d3-a456-426614174000" is reversed by their id
      Then it is refused with "Competition.NoSuchPlayer"

  Rule: In a knockout, a player withdrawn keeps their place in the draw

    The knockout has four places, each round the best of 1, so Sam Someone
    meets Alex Another and Pat Player meets Kim Keeper in the first round.

    Background:
      Given the competition is a knockout of 4 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the tournament player "Kim Keeper" was entered in it

    Scenario: A player withdrawn from a knockout keeps their order
      Given the competition is rebuilt from its stream
      When the player "Sam Someone" is withdrawn
      Then the competition's player "Sam Someone" has the order 10000

    Scenario: A player whose withdrawal is reversed before their opponent plays on plays again
      Given the player "Sam Someone" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then the competition's player "Sam Someone" has not withdrawn

    Scenario: Reversing a withdrawal once the opponent who went through has played on is refused
      Given the player "Sam Someone" withdrew from it
      And the game of "Pat Player" beating "Kim Keeper" 26 to 3 was added to it
      And the game of "Alex Another" beating "Pat Player" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then it is refused with "Competition.WinnerHasPlayedOn"

    Scenario: Reversing a withdrawal once the opponent's next game is archived is not refused
      Given the player "Sam Someone" withdrew from it
      And the game of "Pat Player" beating "Kim Keeper" 26 to 3 was added to it
      And the game of "Alex Another" beating "Pat Player" 26 to 20 was added to it
      And the game of "Alex Another" beating "Pat Player" 26 to 20 was archived
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Sam Someone" is reversed
      Then the competition's player "Sam Someone" has not withdrawn

  Rule: In a knockout, a withdrawal is not reversed where a later game would be left played by somebody who had not got there

    The knockout has eight places, each round the best of 1, and six players,
    so Sam Someone meets Alex Another, Pat Player meets Kim Keeper and Lee
    Fifth meets Jo Sixth in the first round, and the last two places are
    byes, so the winner of Lee Fifth and Jo Sixth has a bye in the second
    round.

    Background:
      Given the competition is a knockout of 8 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the tournament player "Kim Keeper" was entered in it
      And the tournament player "Lee Fifth" was entered in it
      And the tournament player "Jo Sixth" was entered in it
      And a bye was entered in it
      And a bye was entered in it

    Scenario: Reversing a withdrawal once the opponent who went through has played in a later round is refused
      Given the player "Alex Another" withdrew from it
      And the game of "Pat Player" beating "Kim Keeper" 26 to 3 was added to it
      And the player "Pat Player" withdrew from it
      And the game of "Lee Fifth" beating "Jo Sixth" 26 to 5 was added to it
      And the game of "Sam Someone" beating "Lee Fifth" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Alex Another" is reversed
      Then it is refused with "Competition.WinnerHasPlayedOn"

    Scenario: Reversing the withdrawal of one of two withdrawn opponents, once the player drawn next to them has played on, is refused
      Given the player "Pat Player" withdrew from it
      And the player "Kim Keeper" withdrew from it
      And the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Lee Fifth" beating "Jo Sixth" 26 to 5 was added to it
      And the game of "Sam Someone" beating "Lee Fifth" 26 to 20 was added to it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Pat Player" is reversed
      Then it is refused with "Competition.WinnerHasPlayedOn"

    Scenario: Reversing the withdrawal of a player who had a bye and played on is not refused
      Given the game of "Sam Someone" beating "Alex Another" 26 to 17 was added to it
      And the game of "Pat Player" beating "Kim Keeper" 26 to 3 was added to it
      And the game of "Sam Someone" beating "Pat Player" 26 to 10 was added to it
      And the game of "Lee Fifth" beating "Jo Sixth" 26 to 5 was added to it
      And the game of "Lee Fifth" beating "Sam Someone" 26 to 20 was added to it
      And the player "Lee Fifth" withdrew from it
      And the competition is rebuilt from its stream
      When the withdrawal of the player "Lee Fifth" is reversed
      Then the competition's player "Lee Fifth" has not withdrawn

  Rule: In a knockout, a player who withdraws keeps the matches decided before they did

    The knockout has eight places, each round the best of 1, and six players,
    as in the rule before.

    Background:
      Given the competition is a knockout of 8 places, each round the best of 1
      And the tournament player "Alex Another" was entered in it
      And the tournament player "Pat Player" was entered in it
      And the tournament player "Kim Keeper" was entered in it
      And the tournament player "Lee Fifth" was entered in it
      And the tournament player "Jo Sixth" was entered in it
      And a bye was entered in it
      And a bye was entered in it

    Scenario: A player beaten by an opponent who went through by a withdrawal, and withdrew since, plays no more
      Given the player "Sam Someone" withdrew from it
      And the game of "Pat Player" beating "Kim Keeper" 26 to 3 was added to it
      And the game of "Alex Another" beating "Pat Player" 26 to 20 was added to it
      And the player "Alex Another" withdrew from it
      And the game of "Lee Fifth" beating "Jo Sixth" 26 to 5 was added to it
      And the competition is rebuilt from its stream
      When the game of "Pat Player" beating "Lee Fifth" 26 to 20 is added
      Then it is refused with "Competition.NotDrawnToMeet"
