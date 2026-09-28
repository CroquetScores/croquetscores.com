@postgres
Feature: Changing what a tournament's knockout is

  A knockout is updated as a block is (`UpdateBlock.feature`), by a manager of
  the tournament, and a tournament there is not is refused as
  `UpdateKnockout.NoSuchTournament`. An update says the knockout's name and
  the shape of its draw again, and the draw's rules are asked on the way in.
  Only the tournament's managers can: anybody else, a scorer among them, is
  refused with `Tournament.NotAManager` (`onlyManagers.feature`).

  A draw cannot be changed so as to move a player who has games
  (`updateKnockout.feature`), and whether it does is not the tournament's to
  know. The application asks its games (`Games.feature`). A knockout's draw
  is fixed once it has a game, archived or not (`addGame.feature`), so the
  games say a change to the draw of a knockout that has one moves a player who
  has played.

  This says again only enough of what updating a block says to show that it
  holds for a knockout.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the knockout "Main Event" to "Spring Open"

  Rule: A sound update is kept

    Scenario: The knockout is kept with the draw it was updated to
      Given the update gives the knockout a draw of 8 places
      And its first round is to be the best of 1
      And its second round is to be the best of 1
      And its third round is to be the best of 3
      When the reader signed in to the account for "organiser@example.com" updates the knockout "Main Event" in "Spring Open"
      Then the tournament's competition "Main Event" has a draw of 8 places

  Rule: The draw must break none of its own rules

    Scenario: A draw that breaks a rule is refused for it
      Given the update gives the knockout a draw of 4 places
      And its first round is to be the best of 1
      And its second round is to be the best of 2
      When the reader signed in to the account for "organiser@example.com" updates the knockout "Main Event" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "KnockoutDraw.EvenBestOf"

  Rule: A change to the draw of a knockout that has a game is refused

    Scenario: A change to the draw of a knockout with a game is refused as the tournament refuses it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Main Event" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Main Event" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Main Event" of "Spring Open"
      And the update gives the knockout a draw of 8 places
      When the reader signed in to the account for "organiser@example.com" updates the knockout "Main Event" in "Spring Open"
      Then it is refused with "Tournament.KnockoutPlayerHasGames"

    Scenario: A change to the draw of a knockout with no games is kept
      Given the update gives the knockout a draw of 8 places
      When the reader signed in to the account for "organiser@example.com" updates the knockout "Main Event" in "Spring Open"
      Then the tournament's competition "Main Event" has a draw of 8 places

  Rule: What the tournament asks is the tournament's to refuse

    Scenario: Updating a block as a knockout is refused as the tournament refuses it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the update calls the competition "Block One"
      When the reader signed in to the account for "organiser@example.com" updates the knockout "Block A" in "Spring Open"
      Then it is refused with "Tournament.NotAKnockout"

    Scenario: Updating a knockout in a tournament there is not is refused
      Given the update calls the competition "Main Draw"
      When the reader signed in to the account for "organiser@example.com" updates the knockout "Main Event" in a tournament there is not
      Then it is refused with "UpdateKnockout.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the update gives the knockout a draw of 8 places
      And its first round is to be the best of 1
      And its second round is to be the best of 1
      And its third round is to be the best of 3
      When the reader signed in to the account for "someone@example.com" updates the knockout "Main Event" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the update gives the knockout a draw of 8 places
      And its first round is to be the best of 1
      And its second round is to be the best of 1
      And its third round is to be the best of 3
      When the reader signed in to the account for "scorer@example.com" updates the knockout "Main Event" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"
