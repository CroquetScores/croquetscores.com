Feature: A player in a competition

  A tournament's players are entered into its competitions — a block, a
  knockout, a Swiss — and a player in a competition is one of the tournament's
  players given a place in that competition. It has an id of its own, and
  names the tournament player it is, so that everything about the person —
  their name, what they represent, their flag — is said once, by the
  tournament, and not again in every competition they play in.

  A player in a competition has an order, which is where they come when the
  competition lists its players, lowest first. A player entered is given the
  order the tournament player has in the tournament, or the order just after
  it where that is taken (`enterPlayer.feature`), so that the competition
  starts with its players in the tournament's order. The orders are spaced
  10,000 apart there, so that a player can later be put between two others
  without either of them moving. A player who withdraws is put last: the
  competition gives them the order after every player there, 10,000 more than
  the highest order there is, so that they come after every player still
  playing (`withdrawPlayer.feature`). Their order still counts, so that no
  order is ever given twice to two players in the one competition. A player
  removed is gone, and their order with them. An order is a whole number from
  1 up.

  A player may carry results forward into the competition: the matches, games
  and hoops they bring from play it did not score (`CarryForward.feature`).
  It is the player's in this competition and no other, since the same person
  can bring something to one competition and nothing to the next. A player
  entered carries nothing forward, and is given a carry forward afterwards,
  which says all six counts again, so a count left out of it is taken away.
  The player given one is the same player, with the same order. Whether a
  competition has any standings for a carry forward to begin is the
  competition's to say (`changeCarryForward.feature`).

  A player can withdraw: they stay in the competition, with their games, but
  play no more of it. A withdrawn player can have their withdrawal reversed,
  and that is all that can be done to them until it is, so a withdrawn player
  cannot be given a carry forward.

  A player entered by mistake is removed: taken out of the competition, and
  not kept, set aside or able to be put back. Nothing is lost by it, since a
  player who has no games in the competition has nothing in it but their
  place, and the tournament's player they are is untouched, so they can be
  entered again as anybody can. A player who has any games in use in the
  competition cannot be removed, since the games would then be against
  somebody who is no longer there; an archived game does not count
  (`removePlayer.feature`). A withdrawn player cannot be removed either, since 
  withdrawing is what is done to somebody who has played, and their withdrawal
  is reversed first. The games are the competition's to know, not the 
  player's, so the competition says whether the player has any when it asks 
  whether they can be removed, and taking them out is the competition's to do.

  A player whose tournament player is archived is removed from the
  competition whether or not they have withdrawn, since an archived
  tournament player is in no competition, and there is nobody to reverse the
  withdrawal first (`removeArchivedPlayer.feature`). One with games still
  cannot be.

  Asking for what a player already is — withdrawing one who has withdrawn,
  reversing the withdrawal of one who has not, giving one the carry forward
  they already have — leaves them as they are. Two
  people doing the same thing at once, or a form sent twice, is not a mistake
  worth refusing.

  Whether the same tournament player is in a competition twice is the
  competition's to refuse, since it is the one that knows who else is in it.

  Two players in a competition are the same player when their ids are.

  Rule: A player in a competition is one of the tournament's players

    Scenario: A player in a competition names the tournament player they are
      Given the tournament player "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      When a player in a competition is made for them
      Then the player in the competition is the tournament player "tournament-player/123e4567-e89b-42d3-a456-426614174000"

  Rule: A player's order is a whole number from 1 up

    Scenario Outline: An order that is a whole number from 1 up is accepted
      When a player in a competition with the order <order> is made
      Then the player's order in the competition is <order>

      Examples:
        | order |
        | 1     |
        | 10000 |

    Scenario: An order of 0 is refused
      When a player in a competition with the order 0 is made
      Then it is refused for breaking "CompetitionPlayer.OrderTooSmall"

    Scenario: An order that is not a whole number is refused
      When a player in a competition with the order 1.5 is made
      Then it is refused for breaking "CompetitionPlayer.OrderNotWhole"

  Rule: The order after every player is 10,000 more than the highest order there is

    Scenario: The order after every player in a competition with none is 10,000
      Given a competition with no players
      When the order after every player is found
      Then the order found is 10000

    Scenario: The order after every player is 10,000 more than the highest order
      Given a competition with a player in the order 10000
      And a player in the order 30000
      And a player in the order 20000
      When the order after every player is found
      Then the order found is 40000

    Scenario: A withdrawn player's order still counts
      Given a competition with a player in the order 10000
      And a player in the order 20000 who has withdrawn
      When the order after every player is found
      Then the order found is 30000

  Rule: A new player in a competition has not withdrawn

    Scenario: A new player has not withdrawn
      When a player in a competition is made
      Then the player has not withdrawn

  Rule: A player can be given a carry forward, and is the same player afterwards

    Scenario: A new player carries nothing forward
      When a player in a competition is made
      Then the player carries nothing forward

    Scenario: A player given a carry forward carries it forward
      Given a player in a competition
      And the carry forward is to have match wins of 3
      When the player is given the carry forward
      Then the player carries forward match wins of 3

    Scenario: A player given a carry forward is the same player they were
      Given a player in a competition
      And the carry forward is to have match wins of 3
      When the player is given the carry forward
      Then the player is the same player in the competition they were

    Scenario: A player given a carry forward keeps their order
      Given a player in a competition with the order 20000
      And the carry forward is to have match wins of 3
      When the player is given the carry forward
      Then the player's order in the competition is 20000

    Scenario: A player given a carry forward of no counts carries nothing forward
      Given a player in a competition who carries forward match wins of 3
      And the carry forward is to have no counts
      When the player is given the carry forward
      Then the player carries nothing forward

    Scenario: A player given a carry forward without a count they had carries nothing forward in it
      Given a player in a competition who carries forward match wins of 3
      And the carry forward is to have game wins of 7
      When the player is given the carry forward
      Then the player carries forward nothing in match wins

    Scenario: A player given the carry forward they have is left as they are
      Given a player in a competition who carries forward match wins of 3
      And the carry forward is to have match wins of 3
      When the player is given the carry forward
      Then it is not refused
      And the player carries forward match wins of 3

    Scenario: A withdrawn player cannot be given a carry forward
      Given a player in a competition who has withdrawn
      And the carry forward is to have match wins of 3
      When the player is given the carry forward
      Then it is refused for breaking "CompetitionPlayer.Withdrawn"

    Scenario: A player keeps their carry forward when they withdraw
      Given a player in a competition who carries forward match wins of 3
      When the player withdraws
      Then the player carries forward match wins of 3

  Rule: A player can withdraw, and have their withdrawal reversed

    Scenario: A player who withdraws has withdrawn
      Given a player in a competition
      When the player withdraws
      Then the player has withdrawn

    Scenario: A withdrawn player whose withdrawal is reversed has not withdrawn
      Given a player in a competition who has withdrawn
      When the player's withdrawal is reversed
      Then the player has not withdrawn

    Scenario: A withdrawn player who withdraws again has still withdrawn
      Given a player in a competition who has withdrawn
      When the player withdraws
      Then it is not refused
      And the player has withdrawn

    Scenario: Reversing the withdrawal of a player who has not withdrawn leaves them playing
      Given a player in a competition
      When the player's withdrawal is reversed
      Then it is not refused
      And the player has not withdrawn

    Scenario: A player who has games can withdraw
      Given a player in a competition who has games
      When the player withdraws
      Then the player has withdrawn

  Rule: A player with no games can be removed

    Scenario: A player with no games can be removed
      Given a player in a competition who has no games
      When the competition asks whether the player can be removed
      Then it is not refused

    Scenario: A player with games cannot be removed
      Given a player in a competition who has games
      When the competition asks whether the player can be removed
      Then it is refused for breaking "CompetitionPlayer.HasGames"

    Scenario: A withdrawn player cannot be removed
      Given a player in a competition who has withdrawn
      And the player has no games
      When the competition asks whether the player can be removed
      Then it is refused for breaking "CompetitionPlayer.Withdrawn"

  Rule: A player whose tournament player is archived can be removed, withdrawn or not

    Scenario: A withdrawn player with no games can be removed as archived
      Given a player in a competition who has withdrawn
      And the player has no games
      When the competition asks whether the player can be removed as archived
      Then it is not refused

    Scenario: A player with no games can be removed as archived
      Given a player in a competition who has no games
      When the competition asks whether the player can be removed as archived
      Then it is not refused

    Scenario: A player with games cannot be removed as archived
      Given a player in a competition who has games
      When the competition asks whether the player can be removed as archived
      Then it is refused for breaking "CompetitionPlayer.HasGames"

  Rule: Two players in a competition are the same when their ids are

    Scenario: Players with the same id and different orders are the same player
      Given a player in a competition with the order 10000
      And another player in the competition with the same id and the order 20000
      When the players in the competition are compared
      Then they are the same player in the competition

    Scenario: Players with different ids for the same tournament player are different players
      Given a player in a competition for the tournament player "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      And another player in the competition for the tournament player "tournament-player/123e4567-e89b-42d3-a456-426614174000"
      When the players in the competition are compared
      Then they are different players in the competition
