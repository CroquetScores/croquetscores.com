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

  A player can be archived: kept, with everything they are, but set aside, so
  that a player entered by mistake or who withdrew is out of the way. A player
  who has any games in the tournament cannot be archived, since the games
  would then be against somebody who is no longer there. The games are the
  tournament's to know, not the player's, so the tournament says whether the
  player has any when it asks for them to be archived. An archived player can
  be restored, and that is all that can be done to them until they are.

  A player can be updated: their name, what they represent and the flag they
  fly said again, each asked what it is asked of a new player. The player
  updated is the same player, with the same id, since a player whose name is
  corrected is still the player who played.

  A player is never altered: updating, archiving and restoring each give the
  player as they are afterwards. Asking for what a player already is —
  archiving one who is archived, restoring one who is not — gives them back as
  they are, since a form sent twice is not a mistake worth refusing.

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
