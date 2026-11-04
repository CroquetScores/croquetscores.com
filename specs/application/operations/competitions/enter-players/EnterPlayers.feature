@postgres
Feature: Entering several of a tournament's players in one of its competitions at once

  A manager of the tournament can enter a list of its players in one of its
  competitions in one go, and the account they are signed in to is who entered
  them. The players are named by their ids in the tournament, and the answer is
  the ids they are given in the competition, in the order they were listed,
  and the players who were not entered, each with why.
  Every player is entered as `EnterPlayer` enters one (`EnterPlayer.feature`),
  so each is given their place in the tournament's order, whatever order they
  were listed in.

  A list is entered whole or not at all, unless whoever asked has said that
  what can be entered is to be. It is asked about before anything is kept, and
  every fault in it is reported, not only the first, since a list that had to
  be sent once for each fault would be a poor way to be told. A fault is
  refused with `Request.Invalid` and the rules broken, each saying which
  listed player it is about, by their place in the list. A fault is the code
  `EnterPlayer` would have refused that player with: a player already in the
  competition, one the tournament does not have or has set aside, or one a
  knockout has no place left for. A person is asked which they want when some
  players cannot be entered, so that the choice is theirs rather than the
  application's, and the same list is sent again with what can be entered
  asked for. Where nobody in the list can be entered, there is nothing to
  enter, and it is refused as it is whole or nothing.

  A list is also held to a most of 500 players. Byes are not listed: a
  knockout's byes are entered one at a time as `EnterPlayer` enters them.

  Who may ask, that the tournament and the competition exist and are not
  archived, and that the account is not forgotten, are `EnterPlayer`'s and are
  not described again here, apart from the first, which is shown to hold.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And "organiser@example.com" has added the player "Pat Player" to "Spring Open"

  Rule: Every player of a sound list is entered

    Scenario: Each player listed is one of the competition's players
      Given the player "Sam Someone" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Sam Someone"
      And the competition "Block A" of "Spring Open" has the player "Alex Another"

    Scenario: A player not listed is not entered
      Given the player "Sam Someone" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Pat Player"

    Scenario: The answer has an id for each player
      Given the player "Sam Someone" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the answer names 2 entered players

    Scenario: The players are given their places in the tournament's order, whatever order they were listed in
      Given the player "Pat Player" is to be entered
      And the player "Sam Someone" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first player of "Block A" of "Spring Open" is "Sam Someone"
      And the second player of "Block A" of "Spring Open" is "Pat Player"

    Scenario: Entering the players is recorded as done by whoever asked
      Given the player "Sam Someone" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the last thing the competition "Block A" of "Spring Open" recorded was caused by the account for "organiser@example.com"

    Scenario: Players are entered after those already in the competition
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the player "Pat Player" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first player of "Block A" of "Spring Open" is "Sam Someone"
      And the second player of "Block A" of "Spring Open" is "Alex Another"
      And the third player of "Block A" of "Spring Open" is "Pat Player"

  Rule: A list with a player who cannot be entered enters nobody, and every such player is told of

    Scenario: A player already in the competition is refused as the competition refuses them
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the player "Alex Another" is to be entered
      And the player "Sam Someone" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Competition.PlayerAlreadyEntered"
      And that rule is about the player to be entered 2
      And no other rule is broken

    Scenario: A player listed twice is refused for the second time
      Given the player "Sam Someone" is to be entered
      And the player "Sam Someone" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first rule broken is "Competition.PlayerAlreadyEntered"
      And that rule is about the player to be entered 2

    Scenario: A player the tournament does not have is refused
      Given the player "Sam Someone" is to be entered
      And a player the tournament does not have is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first rule broken is "Tournament.NoSuchPlayer"
      And that rule is about the player to be entered 2

    Scenario: A player whose id is written wrongly is refused for that player
      Given the player "Sam Someone" is to be entered
      And a player written as no id is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first rule broken is "Id.Malformed"
      And that rule is about the player to be entered 2
      And no other rule is broken

    Scenario: An archived tournament player is refused
      Given "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first rule broken is "TournamentPlayer.Archived"
      And that rule is about the player to be entered 1

    Scenario: Every player who cannot be entered is told of
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      And the player "Sam Someone" is to be entered
      And the player "Pat Player" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the first rule broken is "Competition.PlayerAlreadyEntered"
      And that rule is about the player to be entered 1
      And the next rule broken is "TournamentPlayer.Archived"
      And that rule is about the player to be entered 3
      And no other rule is broken

    Scenario: The players who could have been entered are not
      Given the player "Sam Someone" is to be entered
      And a player the tournament does not have is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"

    Scenario: A knockout with a place left for fewer than are listed refuses those who do not fit
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And the player "Alex Another" is to be entered
      And the player "Pat Player" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Final Stage" of "Spring Open"
      Then the first rule broken is "Competition.DrawFull"
      And that rule is about the player to be entered 2
      And no other rule is broken

    Scenario: A knockout with a game refuses every player listed
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Final Stage" of "Spring Open"
      And the player "Pat Player" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Final Stage" of "Spring Open"
      Then the first rule broken is "Competition.DrawFixed"
      And that rule is about the player to be entered 1

  Rule: Where what can be entered is asked for, those who can be entered are

    The person was told which players cannot be entered and chose to enter the
    rest, so the same list is sent again, asking for that.

    Scenario: The players who can be entered are
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the player "Sam Someone" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters what can be entered of the players to be entered in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" has the player "Alex Another"

    Scenario: The answer names each player entered, and not the rest
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the player "Sam Someone" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters what can be entered of the players to be entered in "Block A" of "Spring Open"
      Then the answer names 1 entered players

    Scenario: The answer says which player was not entered, and why
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the player "Sam Someone" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters what can be entered of the players to be entered in "Block A" of "Spring Open"
      Then the answer names 1 refused players
      And the answer says the player to be entered 1 was refused with "Competition.PlayerAlreadyEntered"

    Scenario: A knockout is filled as far as its draw goes
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And "organiser@example.com" has entered a bye in "Final Stage" of "Spring Open"
      And the player "Alex Another" is to be entered
      And the player "Pat Player" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters what can be entered of the players to be entered in "Final Stage" of "Spring Open"
      Then the competition "Final Stage" of "Spring Open" has the player "Alex Another"
      And the competition "Final Stage" of "Spring Open" does not have the player "Pat Player"

    Scenario: Where nobody can be entered, it is refused as it is whole or nothing
      Given "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
      And the player "Sam Someone" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters what can be entered of the players to be entered in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "Competition.PlayerAlreadyEntered"

    Scenario: A list that is sound is entered whole as it would be anyway
      Given the player "Sam Someone" is to be entered
      And the player "Alex Another" is to be entered
      When the reader signed in to the account for "organiser@example.com" enters what can be entered of the players to be entered in "Block A" of "Spring Open"
      Then the answer names 2 entered players

  Rule: A list has players, and not too many

    Scenario: A list with nobody in it is refused
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "EnterPlayers.PlayersMissing"
      And no other rule is broken

    Scenario: A list of more than 500 players is refused
      Given 501 players are to be entered
      When the reader signed in to the account for "organiser@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "EnterPlayers.TooManyPlayers"
      And no other rule is broken

  Rule: Only a manager of the tournament can ask for this

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the player "Sam Someone" is to be entered
      When the reader signed in to the account for "scorer@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A refused list enters nobody
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the player "Sam Someone" is to be entered
      When the reader signed in to the account for "scorer@example.com" enters the players to be entered in "Block A" of "Spring Open"
      Then the competition "Block A" of "Spring Open" does not have the player "Sam Someone"
