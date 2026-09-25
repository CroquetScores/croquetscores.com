Feature: A player in a competition

  A tournament's players are entered into its competitions — a block, a
  knockout, a Swiss — and a player in a competition is one of the tournament's
  players given a place in that competition. It has an id of its own, and
  names the tournament player it is, so that everything about the person —
  their name, what they represent, their flag — is said once, by the
  tournament, and not again in every competition they play in.

  A player in a competition has an order, which is where they come when the
  competition lists its players, lowest first. The first player added to a
  competition is given 10,000, and each one added after is given 10,000 more
  than the highest order there is, so that a player can later be put between
  two others without either of them moving. A player who is archived or has
  withdrawn keeps their order and still counts, so that no order is ever given
  twice in the one competition. An order is a whole number from 1 up.

  A player can withdraw: they stay in the competition, with their games, but
  play no more of it. A withdrawn player can have their withdrawal reversed,
  and that is all that can be done to them until it is.

  A player can be archived: kept, but set aside, so that one added by mistake
  is out of the way. A player who has any games in the competition cannot be
  archived, since the games would then be against somebody who is no longer
  there. The games are the competition's to know, not the player's, so the
  competition says whether the player has any when it asks for them to be
  archived. An archived player can be restored, and that is all that can be
  done to them until they are.

  Asking for what a player already is — archiving one who is archived,
  restoring one who is not, withdrawing one who has withdrawn, reversing the
  withdrawal of one who has not — leaves them as they are. Two people doing the
  same thing at once, or a form sent twice, is not a mistake worth refusing.

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

  Rule: Each player added is given 10,000 more than the highest order there is

    Scenario: The first player added to a competition is given 10,000
      Given a competition with no players
      When the order for the next player is found
      Then the order found is 10000

    Scenario: The next player is given 10,000 more than the highest order
      Given a competition with a player in the order 10000
      And a player in the order 30000
      And a player in the order 20000
      When the order for the next player is found
      Then the order found is 40000

    Scenario: An archived player's order still counts
      Given a competition with a player in the order 10000
      And a player in the order 20000 who is archived
      When the order for the next player is found
      Then the order found is 30000

    Scenario: A withdrawn player's order still counts
      Given a competition with a player in the order 10000
      And a player in the order 20000 who has withdrawn
      When the order for the next player is found
      Then the order found is 30000

  Rule: A new player in a competition has neither withdrawn nor been archived

    Scenario: A new player has not withdrawn
      When a player in a competition is made
      Then the player has not withdrawn

    Scenario: A new player is not archived
      When a player in a competition is made
      Then the player is not archived

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

  Rule: A player with no games can be archived, and restored

    Scenario: A player with no games who is archived is archived
      Given a player in a competition who has no games
      When the competition archives the player
      Then the player is archived

    Scenario: A player with games cannot be archived
      Given a player in a competition who has games
      When the competition archives the player
      Then it is refused for breaking "CompetitionPlayer.HasGames"

    Scenario: An archived player who is restored is not archived
      Given a player in a competition who is archived
      When the player is restored
      Then the player is not archived

    Scenario: An archived player who is archived again is still archived
      Given a player in a competition who is archived
      When the competition archives the player
      Then it is not refused
      And the player is archived

    Scenario: Restoring a player who is not archived leaves them not archived
      Given a player in a competition
      When the player is restored
      Then it is not refused
      And the player is not archived

  Rule: A withdrawn player can only have their withdrawal reversed

    Scenario: A withdrawn player cannot be archived
      Given a player in a competition who has withdrawn
      When the competition archives the player
      Then it is refused for breaking "CompetitionPlayer.Withdrawn"

  Rule: An archived player can only be restored

    Scenario: An archived player cannot withdraw
      Given a player in a competition who is archived
      When the player withdraws
      Then it is refused for breaking "CompetitionPlayer.Archived"

    Scenario: An archived player cannot have a withdrawal reversed
      Given a player in a competition who is archived
      When the player's withdrawal is reversed
      Then it is refused for breaking "CompetitionPlayer.Archived"

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
