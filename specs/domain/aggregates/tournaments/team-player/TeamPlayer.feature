Feature: A player in a team

  A team keeps its own players (`Team.feature`), and a player in a team
  belongs to that team alone. The same person playing for two teams, or in two
  tournaments, is a player in each, with an id in each. A player in a team is
  not one of the tournament's players (`TournamentPlayer.feature`): a
  tournament played by teams has none of those, and a player in a team is
  never entered in a competition. They play in their team's tests, and a game
  in a test names them by their id (`gamesInATest.feature`).

  A player in a team has a name, and it is a person's name, asked what an
  account's name is asked, as a tournament's player's is
  (`TournamentPlayer.feature`).

  A tournament's player may say what they represent, and fly a flag. A player
  in a team does neither: the team they play for is what they represent, and
  the team may fly a flag (`Team.feature`), so a player in a team is read as
  one of their team, and anything of their own beside it would be a second
  answer to the same question.

  A player in a team is never named as a bye, as a tournament's player is not
  (`TournamentPlayer.feature`), and by the same rule: a name whose first word
  is "bye", in capitals or not, once the whitespace at either end is taken
  off, is refused with `TeamPlayer.NamedBye`, whether the player is made with
  it or updated to it, and the word ends where anything but a letter comes,
  so "Bye 2" and "Bye-1" are byes but "Byers" is a name. A test has no draw
  and no byes, but a score against "Bye" reads as a match nobody played, and
  a manager who has learned that a player is never a bye should not find
  that true in one kind of tournament and not the other.

  A player in a team has an order, which is where they come when the team
  lists its players, lowest first, a whole number from 1 up. How the orders
  are given is the tournament's to say (`addTeamPlayer.feature`).

  A player in a team can be archived: kept, with everything they are, but set
  aside, so that a player entered by mistake is out of the way. A player who
  has any games in use in the team's tests cannot be archived, since the games
  would then be against somebody who is no longer there. The games are not
  the player's to know, so the tournament says whether the player has any
  when it asks for them to be archived. An archived player can be restored,
  and that is all that can be done to them until they are.

  A player can be updated: their name said again, asked what it is asked of a
  new player. The player updated is the same player, with the same id and the
  same order.

  A player is never altered: updating, giving a new order, archiving and
  restoring each give the player as they are afterwards. Asking for what a
  player already is gives them back as they are.

  Two players in a team are the same player when their ids are, whatever they
  are called.

  Rule: A player in a team has a person's name

    Scenario: A player's name is kept as it was given
      When a team player named "Sam Someone" is made
      Then the team player's name is "Sam Someone"

    Scenario: A player's name with spaces around it is kept without them
      When a team player named "  Sam Someone  " is made
      Then the team player's name is "Sam Someone"

    Scenario: A name that could not be a person's is refused as a person's is
      When a team player named "Sa" is made
      Then it is refused for breaking "PersonName.TooShort"

  Rule: A player in a team is not named as a bye

    Scenario Outline: A name whose first word is "bye" is refused
      When a team player named "<name>" is made
      Then it is refused for breaking "TeamPlayer.NamedBye"

      Examples:
        | name        |
        | Bye         |
        | bye         |
        | BYE         |
        | Bye 2       |
        | Bye-1       |
        | Bye Someone |

    Scenario: A name whose first word is "bye" after spaces is refused
      When a team player named "  Bye" is made
      Then it is refused for breaking "TeamPlayer.NamedBye"

    Scenario Outline: A name with "bye" in it but not as its first word is kept
      When a team player named "<name>" is made
      Then the team player's name is "<name>"

      Examples:
        | name        |
        | Byers Kim   |
        | Sam Goodbye |
        | Sam Bye     |

    Scenario: A player updated to a name whose first word is "bye" is refused
      Given a team player named "Sam Someone"
      When the team player is updated to be called "Bye"
      Then it is refused for breaking "TeamPlayer.NamedBye"

  Rule: A player in a team represents their team, and flies no flag of their own

    Scenario: A player in a team flies no flag
      When a team player named "Sam Someone" is made
      Then the team player flies no flag

    Scenario: A player in a team represents nothing of their own
      When a team player named "Sam Someone" is made
      Then the team player represents nothing of their own

  Rule: A player's order is a whole number from 1 up

    Scenario Outline: An order that is a whole number from 1 up is accepted
      When a team player in the order <order> is made
      Then the team player's order is <order>

      Examples:
        | order |
        | 1     |
        | 10000 |

    Scenario: An order of 0 is refused
      When a team player in the order 0 is made
      Then it is refused for breaking "TeamPlayer.OrderTooSmall"

    Scenario: An order that is not a whole number is refused
      When a team player in the order 1.5 is made
      Then it is refused for breaking "TeamPlayer.OrderNotWhole"

    Scenario: A player given a new order has it
      Given a team player named "Sam Someone" in the order 10000
      When the team player is given the order 5000
      Then the team player's order is 5000

    Scenario: A player given a new order is the same player they were
      Given a team player named "Sam Someone" in the order 10000
      When the team player is given the order 5000
      Then the team player is the same player they were

  Rule: A player in a team can be updated, and is the same player afterwards

    Scenario: An updated player has the name they were updated to
      Given a team player named "Sam Someone"
      When the team player is updated to be called "Samantha Someone"
      Then the team player's name is "Samantha Someone"

    Scenario: An updated player is the same player they were
      Given a team player named "Sam Someone"
      When the team player is updated to be called "Samantha Someone"
      Then the team player is the same player they were

    Scenario: An updated player keeps their order
      Given a team player named "Sam Someone" in the order 20000
      When the team player is updated to be called "Samantha Someone"
      Then the team player's order is 20000

    Scenario: A name that could not be a person's is refused as a person's is
      Given a team player named "Sam Someone"
      When the team player is updated to be called "Sa"
      Then it is refused for breaking "PersonName.TooShort"

  Rule: A player with no games can be archived, and restored

    Scenario: A new player is not archived
      When a team player named "Sam Someone" is made
      Then the team player is not archived

    Scenario: A player with no games who is archived is archived
      Given a team player named "Sam Someone"
      And the tournament says the team player has no games
      When the tournament archives the team player
      Then the team player is archived

    Scenario: A player with games cannot be archived
      Given a team player named "Sam Someone"
      And the tournament says the team player has games
      When the tournament archives the team player
      Then it is refused for breaking "TeamPlayer.HasGames"

    Scenario: An archived player who is restored is not archived
      Given a team player named "Sam Someone" who is archived
      When the tournament restores the team player
      Then the team player is not archived

    Scenario: An archived player who is archived again is still archived
      Given a team player named "Sam Someone" who is archived
      And the tournament says the team player has no games
      When the tournament archives the team player
      Then it is not refused
      And the team player is archived

    Scenario: Restoring a player who is not archived leaves them not archived
      Given a team player named "Sam Someone"
      When the tournament restores the team player
      Then it is not refused
      And the team player is not archived

  Rule: An archived player in a team can only be restored

    Scenario: An archived player cannot be updated
      Given a team player named "Sam Someone" who is archived
      When the team player is updated to be called "Samantha Someone"
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: An archived player cannot be moved
      Given a team player named "Sam Someone" who is archived
      When the tournament asks whether the team player can be moved
      Then it is refused for breaking "TeamPlayer.Archived"

    Scenario: A player who is not archived can be moved
      Given a team player named "Sam Someone"
      When the tournament asks whether the team player can be moved
      Then it is not refused

  Rule: Two players in a team are the same when their ids are

    Scenario: Players with the same id and different names are the same player
      Given a team player named "Sam Someone"
      And another team player with the same id named "Samuel Someone"
      When the team players are compared
      Then they are the same player

    Scenario: Players with different ids and the same name are different players
      Given a team player named "Sam Someone"
      And another team player named "Sam Someone"
      When the team players are compared
      Then they are different players
