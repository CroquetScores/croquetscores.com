@postgres
Feature: Adding a doubles pair to a tournament from two of its players

  A manager of the tournament can make a doubles pair from two players it
  already has, and the account they are signed in to is who made it. The
  tournament and the two players are each named by their id. A pair is a player
  of the tournament as any other is, so it is added as `AddPlayer` adds one
  (`AddPlayer.feature`), with a name made from the two players' names
  (`pairName.feature`), and what it represents made from what the two do
  (`pairRepresenting.feature`), and the answer is its id and the name it was given, so
  that whoever asked can say which pair was made without making the name
  again. The two players it is made
  of are left as they are: they may play singles in the same tournament, and
  the tournament does not know that one is made of the others.

  The tournament knows its players, and which are set aside, so the two are
  asked of it. Only a player the tournament has is paired, and one set aside,
  who is in no competition until restored, is refused with
  `TournamentPlayer.Archived`. A player the tournament does not have is refused
  with `Tournament.NoSuchPlayer`. The same player twice is no pair, and is
  refused with `Request.Invalid` and the rule `AddPair.SamePlayerTwice`. What
  the tournament asks of any player's name, that no other has it, is the
  tournament's to refuse, so making the same pair twice is refused with
  `Tournament.PlayerNameTaken`. The other way round is another name, and
  another pair.

  A pair is a player, and is kept no differently: nothing links it to the two
  it was made of, so correcting or archiving one of them later does not change
  the pair, which is a name and what it represents, as they were when it was
  made. No format of tournament is played in pairs, so any tournament can have
  one, and a pair can be paired as any player can. An id that is no player's id
  names no player the tournament has, and is refused as one is that is not
  there.

  Only a manager of the tournament can ask, and a tournament there is not is
  refused as `AddPair.NoSuchTournament`. A forgotten account makes no pair, and
  is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"

  Rule: A pair is added as a player named from the two

    Scenario: The pair is one of the tournament's players
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the tournament has the player "Sam Someone & Alex Another"

    Scenario: Two players with the same last name are called by their first names and the last name
      Given "organiser@example.com" has added the player "Peter Landrebe" to "Spring Open"
      And "organiser@example.com" has added the player "Rosie Landrebe" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Peter Landrebe" and "Rosie Landrebe" in "Spring Open"
      Then the tournament has the player "Peter & Rosie Landrebe"

    Scenario: The answer is the pair's id
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the pair answered is the tournament's player "Sam Someone & Alex Another"

    Scenario: The answer is the pair's name
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the pair answered is called "Sam Someone & Alex Another"

    Scenario: The first player is still a player
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the tournament has the player "Sam Someone"

    Scenario: The second player is still a player
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the tournament has the player "Alex Another"

    Scenario: The pair is known in the rankings by its own name, as any player added without another is
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the tournament's player "Sam Someone & Alex Another" has the world ranking name "Sam Someone & Alex Another"

    Scenario: Making the pair is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: A pair represents what its players represent

    Scenario: A pair of players who represent nothing represents nothing
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then the tournament's player "Sam Someone & Alex Another" represents nothing

    Scenario: Where one represents something, the pair does
      Given the player is to represent "Melbourne"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Pat Player" and "Sam Someone" in "Spring Open"
      Then the tournament's player "Pat Player & Sam Someone" represents "Melbourne"

    Scenario: Where both represent the same thing, the pair represents it once
      Given the player is to represent "Melbourne"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And "organiser@example.com" has added the player "Kim Keeper" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Pat Player" and "Kim Keeper" in "Spring Open"
      Then the tournament's player "Pat Player & Kim Keeper" represents "Melbourne"

    Scenario: Where they represent different things, the pair represents both, the first then the second
      Given the player is to represent "Canterbury Croquet Club"
      And "organiser@example.com" has added the player "Pat Player" to "Spring Open"
      And the player is to represent "Melbourne"
      And "organiser@example.com" has added the player "Kim Keeper" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Pat Player" and "Kim Keeper" in "Spring Open"
      Then the tournament's player "Pat Player & Kim Keeper" represents "Canterbury Croquet Club / Melbourne"

  Rule: Only two players the tournament has, and has not set aside, are paired

    Scenario: A first player the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" pairs the players "Nobody Known" and "Alex Another" in "Spring Open"
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: A second player the tournament does not have is refused
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Nobody Known" in "Spring Open"
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: A first player set aside is refused
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "TournamentPlayer.Archived"

    Scenario: A second player set aside is refused
      Given "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "TournamentPlayer.Archived"

    Scenario: A first player written as no id is refused as a player the tournament does not have
      When the reader signed in to the account for "organiser@example.com" pairs a player written as no id with the player "Alex Another" in "Spring Open"
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: A second player written as no id is refused as a player the tournament does not have
      When the reader signed in to the account for "organiser@example.com" pairs the player "Sam Someone" with a player written as no id in "Spring Open"
      Then it is refused with "Tournament.NoSuchPlayer"

    Scenario: A refused pair adds nobody
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Nobody Known" in "Spring Open"
      Then the tournament does not have the player "Sam Someone & Nobody Known"

  Rule: A player is not paired with themselves

    Scenario: The same player twice is refused
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Sam Someone" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "AddPair.SamePlayerTwice"
      And no other rule is broken

  Rule: A pair's name is held to what any player's is

    Scenario: The same pair made twice is refused the second time
      Given "organiser@example.com" has paired the players "Sam Someone" and "Alex Another" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: The same two the other way round is another pair
      Given "organiser@example.com" has paired the players "Sam Someone" and "Alex Another" in "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Alex Another" and "Sam Someone" in "Spring Open"
      Then the tournament has the player "Alex Another & Sam Someone"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Pat Person"
      When the reader signed in to the account for "someone@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: Only a tournament there is, and one not archived, has a pair made

    Scenario: An archived tournament is refused
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "Tournament.Archived"

    Scenario: A tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" pairs the players "Sam Someone" and "Alex Another" in a tournament there is not
      Then it is refused with "AddPair.NoSuchTournament"

  Rule: A forgotten account makes no pair

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account pairs the players "Sam Someone" and "Alex Another" in "Spring Open"
      Then it is refused with "Account.Forgotten"
