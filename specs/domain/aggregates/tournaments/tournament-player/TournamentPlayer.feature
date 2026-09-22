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
  player has any when it asks for them to be archived. Archiving a player who
  is already archived leaves them archived.

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
