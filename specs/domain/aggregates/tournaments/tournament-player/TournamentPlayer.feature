Feature: A player in a tournament

  A tournament has players, and a player in a tournament belongs to that
  tournament alone. The same person playing in two tournaments is a player in
  each, with an id in each, because what they are called, what they play for
  and which flag they fly can differ from one tournament to the next.

  A player has a name, and it is a person's name, asked what an account's name
  is asked: between 3 and 254 characters, counted as a reader counts them,
  with the whitespace at either end taken off. What a person's name must be is
  specified with it, and a player's name is refused wherever a person's would
  be.

  A player is a person, and never a bye. A knockout's byes are entered in it
  as byes (`enterPlayer.feature`), offered wherever players are entered in a
  knockout, so a tournament player standing in for one would be a bye the
  knockout could not tell was one: it would be drawn, and played, as a
  person. So a name that is "bye", in capitals or not, once the whitespace at
  either end is taken off, is refused with `TournamentPlayer.NamedBye`,
  whether the player is made with it or updated to it. So is "bye" numbered,
  as the old sites' managers numbered theirs: "Bye 2", "Bye-2" and "Bye (2)",
  with a whole number of one digit or more. Nothing else is a bye. A name
  that only begins with the word, as "Bye / Bassett" does, is the name of a
  person, and there is one: Bob Bye.

  A player is found at an address made from their name (`addPlayer.feature`),
  and an address is made of letters and digits (`Slug.feature`), so a name
  with neither in it, in any script, such as "— ! —", would leave the player
  nowhere to be found. It is refused with `TournamentPlayer.NoLetterOrDigit`,
  whether the player is made with it or updated to it. A person's name is not
  asked this, since an account is not found at an address made from it.

  A player may represent something: the club, the region or the country they
  play for, written as a reader would say it, such as "Canterbury Croquet
  Club". It is optional, since many players represent nothing but themselves.
  Whitespace at either end is taken off, and what is nothing but whitespace
  represents nothing.

  A player may fly a flag, shown beside their name. It is optional too, and
  when there is one it is one of the flags there are, found by its name as a
  flag is, so "NZ" is New Zealand's. A name that is no flag there is is
  refused: it would be a flag nobody could see. What a player represents and
  which flag they fly are told apart, since a player can play for a club in one
  country and fly the flag of another.

  A player may have a world ranking name, the name the world rankings know
  them by (`WorldRankingName.feature`). It is optional, and a player given
  none, or one left blank, has none. It is kept as it was made: a player whose
  name is corrected keeps the world ranking name they had, since the rankings
  still know them by it.

  A player has an order, which is where they come when the tournament lists
  its players, lowest first. How the orders are given is the tournament's to
  say (`addPlayer.feature`), since it is the one that knows every player's; a
  player only asks that theirs is a whole number from 1 up. Moving a player
  gives them a new order and archiving one puts them last, and the player is
  the same player afterwards. An archived player is out of the way and can
  only be restored, so the tournament asks whether a player can be moved
  before it moves them, and an archived one cannot.

  A player can be archived: kept, with everything they are, but set aside, so
  that a player entered by mistake or who withdrew is out of the way. A player
  who has any games in the tournament cannot be archived, since the games
  would then be against somebody who is no longer there. The games are the
  tournament's to know, not the player's, so the tournament says whether the
  player has any when it asks for them to be archived. An archived player can
  be restored, and that is all that can be done to them until they are.

  A player can be updated: their name, what they represent, the flag they
  fly and their world ranking name said again, each asked what it is asked of a new player. The player
  updated is the same player, with the same id, since a player whose name is
  corrected is still the player who played. Updating leaves their order as it
  was.

  A player is never altered: updating, giving a new order, archiving and
  restoring each give the player as they are afterwards. Asking for what a
  player already is — archiving one who is archived, restoring one who is not
  — gives them back as they are, since a form sent twice is not a mistake
  worth refusing.

  Two players are the same player when their ids are, whatever they are
  called.

  Rule: A player has a person's name

    Scenario: A player's name is kept as it was given
      When a player named "Sam Someone" is made
      Then the player's name is "Sam Someone"

    Scenario: A player's name with spaces around it is kept without them
      When a player named "  Sam Someone  " is made
      Then the player's name is "Sam Someone"

    Scenario: A name that could not be a person's is refused as a person's is
      When a player named "Sa" is made
      Then it is refused for breaking "PersonName.TooShort"

  Rule: A player is not named as a bye

    Scenario Outline: A name that is a bye, or a bye numbered, is refused
      When a player named "<name>" is made
      Then it is refused for breaking "TournamentPlayer.NamedBye"

      Examples:
        | name      |
        | Bye       |
        | bye       |
        | BYE       |
        | Bye 2     |
        | Bye-1     |
        | Bye (2)   |
        | bye 13    |
        | BYE-104   |
        | BYE (10)  |

    Scenario: A name that is a bye after spaces is refused
      When a player named "  Bye" is made
      Then it is refused for breaking "TournamentPlayer.NamedBye"

    Scenario Outline: A name with "bye" in it that is not a bye, or a bye numbered, is kept
      When a player named "<name>" is made
      Then the player's name is "<name>"

      Examples:
        | name        |
        | Byers Kim   |
        | Sam Goodbye |
        | Sam Bye     |
        | Bye / Bassett |
        | Bob Bye |
        | Bye Someone |
        | Bye-Bassett |
        | Bye Bassett (2) |
        | Bye # |
        | Bye 2a |
        | Bye () |
        | Bye (2 |
        | Bye2 |

    Scenario: A player updated to a name that is a bye is refused
      Given a player named "Sam Someone"
      When the player is updated to be called "Bye"
      Then it is refused for breaking "TournamentPlayer.NamedBye"

  Rule: A player's name has a letter or a digit in it

    Scenario Outline: A name with neither a letter nor a digit is refused
      When a player named "<name>" is made
      Then it is refused for breaking "TournamentPlayer.NoLetterOrDigit"

      Examples:
        | name  |
        | — ! — |
        | ***   |

    Scenario Outline: A name with a letter or a digit in any script is kept
      When a player named "<name>" is made
      Then the player's name is "<name>"

      Examples:
        | name   |
        | 李小龍 |
        | 007    |

    Scenario: A player updated to a name with neither a letter nor a digit is refused
      Given a player named "Sam Someone"
      When the player is updated to be called "— ! —"
      Then it is refused for breaking "TournamentPlayer.NoLetterOrDigit"

  Rule: A player may represent something

    Scenario: What a player represents is kept as it was given
      When a player representing "Canterbury Croquet Club" is made
      Then the player represents "Canterbury Croquet Club"

    Scenario: What a player represents is kept without the spaces around it
      When a player representing "  Canterbury Croquet Club  " is made
      Then the player represents "Canterbury Croquet Club"

    Scenario: A player need not represent anything
      When a player representing nothing is made
      Then the player represents nothing

    Scenario: A player representing only whitespace represents nothing
      When a player representing "   " is made
      Then the player represents nothing

  Rule: A player may fly one of the flags there are

    Scenario: A player flies the flag they were given
      When a player flying the flag "nz" is made
      Then the player flies the flag "nz"

    Scenario: A flag given in capitals is the flag in lower case
      When a player flying the flag "NZ" is made
      Then the player flies the flag "nz"

    Scenario: A player need not fly a flag
      When a player flying no flag is made
      Then the player flies no flag

    Scenario: A name that is no flag there is is refused
      When a player flying the flag "zz" is made
      Then it is refused for breaking "TournamentPlayer.NoSuchFlag"

  Rule: A player may have a world ranking name

    Scenario: A player's world ranking name is kept as it was given
      When a player with the world ranking name "Samuel Someone" is made
      Then the player's world ranking name is "Samuel Someone"

    Scenario: A player given no world ranking name has none
      When a player named "Bob Jackson" is made
      Then the player has no world ranking name

    Scenario: A player given a blank world ranking name has none
      When a player with the world ranking name "   " is made
      Then the player has no world ranking name

    Scenario: A world ranking name that could not be one is refused
      When a player with a world ranking name of 255 characters is made
      Then it is refused for breaking "WorldRankingName.TooLong"

  Rule: A player's order is a whole number from 1 up

    Scenario Outline: An order that is a whole number from 1 up is accepted
      When a player in the order <order> is made
      Then the player's order is <order>

      Examples:
        | order |
        | 1     |
        | 10000 |

    Scenario: An order of 0 is refused
      When a player in the order 0 is made
      Then it is refused for breaking "TournamentPlayer.OrderTooSmall"

    Scenario: An order that is not a whole number is refused
      When a player in the order 1.5 is made
      Then it is refused for breaking "TournamentPlayer.OrderNotWhole"

  Rule: A player can be given a new order, and is the same player afterwards

    Scenario: A player given a new order has it
      Given a player named "Sam Someone" in the order 10000
      When the player is given the order 5000
      Then the player's order is 5000

    Scenario: A player given a new order is the same player they were
      Given a player named "Sam Someone" in the order 10000
      When the player is given the order 5000
      Then the player is the same player they were

    Scenario: A player given a new order keeps who they are
      Given a player named "Sam Someone" in the order 10000
      When the player is given the order 5000
      Then the player's name is "Sam Someone"

    Scenario: A new order that is not a whole number from 1 up is refused
      Given a player named "Sam Someone" in the order 10000
      When the player is given the order 0
      Then it is refused for breaking "TournamentPlayer.OrderTooSmall"

  Rule: A player can be updated, and is the same player afterwards

    Scenario: An updated player has the name they were updated to
      Given a player named "Sam Someone"
      When the player is updated to be called "Samantha Someone"
      Then the player's name is "Samantha Someone"

    Scenario: An updated player is the same player they were
      Given a player named "Sam Someone"
      When the player is updated to be called "Samantha Someone"
      Then the player is the same player they were

    Scenario: An updated player represents what they were updated to
      Given a player named "Sam Someone"
      When the player is updated to represent "Canterbury Croquet Club"
      Then the player represents "Canterbury Croquet Club"

    Scenario: An updated player flies the flag they were updated to
      Given a player named "Sam Someone"
      When the player is updated to fly the flag "nz"
      Then the player flies the flag "nz"

    Scenario: An updated player has the world ranking name they were updated to
      Given a player named "Bob Jackson"
      When the player is updated to have the world ranking name "Robert Jackson"
      Then the player's world ranking name is "Robert Jackson"

    Scenario: An updated player keeps their world ranking name when their name is corrected
      Given a player named "Bob Jackson" with the world ranking name "Robert Jackson"
      When the player is updated to be called "Bob Jackston"
      Then the player's world ranking name is "Robert Jackson"

    Scenario: A player updated with a blank world ranking name has none
      Given a player named "Bob Jackson" with the world ranking name "Robert Jackson"
      When the player is updated to have the world ranking name "   "
      Then the player has no world ranking name

    Scenario: An updated player keeps their order
      Given a player named "Sam Someone" in the order 20000
      When the player is updated to be called "Samantha Someone"
      Then the player's order is 20000

    Scenario: An updated player keeps what the update did not change
      Given a player named "Sam Someone" representing "Canterbury Croquet Club"
      When the player is updated to be called "Samantha Someone"
      Then the player represents "Canterbury Croquet Club"

    Scenario: A name that could not be a person's is refused as a person's is
      Given a player named "Sam Someone"
      When the player is updated to be called "Sa"
      Then it is refused for breaking "PersonName.TooShort"

    Scenario: A flag there is not is refused as it is for a new player
      Given a player named "Sam Someone"
      When the player is updated to fly the flag "zz"
      Then it is refused for breaking "TournamentPlayer.NoSuchFlag"

  Rule: A new player is not archived

    Scenario: A new player is not archived
      When a player named "Sam Someone" is made
      Then the tournament player is not archived

  Rule: A player with no games can be archived, and restored

    Scenario: A player with no games who is archived is archived
      Given a player named "Sam Someone"
      And the tournament says the player has no games
      When the tournament archives the player
      Then the tournament player is archived

    Scenario: A player with games cannot be archived
      Given a player named "Sam Someone"
      And the tournament says the player has games
      When the tournament archives the player
      Then it is refused for breaking "TournamentPlayer.HasGames"

    Scenario: An archived player keeps who they are
      Given a player named "Sam Someone"
      And the tournament says the player has no games
      When the tournament archives the player
      Then the player's name is "Sam Someone"

    Scenario: An archived player who is restored is not archived
      Given a player named "Sam Someone" who is archived
      When the tournament restores the player
      Then the tournament player is not archived

    Scenario: An archived player who is archived again is still archived
      Given a player named "Sam Someone" who is archived
      And the tournament says the player has no games
      When the tournament archives the player
      Then it is not refused
      And the tournament player is archived

    Scenario: Restoring a player who is not archived leaves them not archived
      Given a player named "Sam Someone"
      When the tournament restores the player
      Then it is not refused
      And the tournament player is not archived

  Rule: An archived player can only be restored

    Scenario: An archived player cannot be updated
      Given a player named "Sam Someone" who is archived
      When the player is updated to be called "Samantha Someone"
      Then it is refused for breaking "TournamentPlayer.Archived"

    Scenario: An archived player cannot be moved
      Given a player named "Sam Someone" who is archived
      When the tournament asks whether the player can be moved
      Then it is refused for breaking "TournamentPlayer.Archived"

    Scenario: A player who is not archived can be moved
      Given a player named "Sam Someone"
      When the tournament asks whether the player can be moved
      Then it is not refused

  Rule: Two players are the same when their ids are

    Scenario: Players with the same id and different names are the same player
      Given a player named "Sam Someone"
      And another player with the same id named "Samuel Someone"
      When the players are compared
      Then they are the same player

    Scenario: Players with different ids and the same name are different players
      Given a player named "Sam Someone"
      And another player named "Sam Someone"
      When the players are compared
      Then they are different players
