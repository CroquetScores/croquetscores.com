@postgres
Feature: Changing what a tournament's player is

  A manager of the tournament can correct a tournament's player, and the
  account they are signed in to is who corrected them. The tournament and the
  player are each named by their id. A tournament there is not is refused as
  `UpdatePlayer.NoSuchTournament`, and a player the tournament does not have
  is the tournament's to refuse (`updatePlayer.feature`). Only the
  tournament's managers can: anybody else, a scorer among them, is refused
  with `Tournament.NotAManager` (`onlyManagers.feature`).

  An update says the player's name, what they represent and the flag they fly
  again, each asked its own rules on the way in. What the tournament and the
  player ask of it — that no other player has the name, and that an archived
  player is only restored — is theirs to refuse. An update that changes
  nothing records nothing.

  A forgotten account changes nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"

  Rule: A sound update is kept

    Scenario: The player is kept as they were updated
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then the tournament has the player "Samantha Someone"

    Scenario: The player updated flies the flag they were updated to
      Given the update has the player fly the flag "au"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then the tournament's player "Sam Someone" flies the flag "au"

    Scenario: Updating the player is recorded as done by whoever asked
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

    Scenario: An update that changes nothing records nothing
      Given the update calls the player "Sam Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: Each value must break none of its own rules

    Scenario: A name that could not be a person's is refused for it
      Given the update calls the player "Sa"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "PersonName.TooShort"

    Scenario: A player whose update breaks a rule is left as they were
      Given the update calls the player "Sa"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then the tournament has the player "Sam Someone"

  Rule: What the tournament and the player ask are theirs to refuse

    Scenario: A name another player has is refused as the tournament refuses it
      Given "organiser@example.com" has added the player "Alex Another" to "Spring Open"
      And the update calls the player "Alex Another"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: Updating an archived player is refused as the player refuses it
      Given "organiser@example.com" has archived the player "Sam Someone" in "Spring Open"
      And the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in "Spring Open"
      Then it is refused for breaking "TournamentPlayer.Archived"

    Scenario: Updating a player the tournament does not have is refused as the tournament refuses it
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates a player "Spring Open" does not have
      Then it is refused with "Tournament.NoSuchPlayer"

  Rule: Only a tournament there is can have a player updated

    Scenario: Updating a player in a tournament there is not is refused
      Given the update calls the player "Samantha Someone"
      When the reader signed in to the account for "organiser@example.com" updates the player "Sam Someone" in a tournament there is not
      Then it is refused with "UpdatePlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the update calls the player "Samantha Someone"
      When the reader signed in to the account for "someone@example.com" updates the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the update calls the player "Samantha Someone"
      When the reader signed in to the account for "scorer@example.com" updates the player "Sam Someone" in "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account changes nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      And the update calls the player "Samantha Someone"
      When the reader signed in to that account updates the player "Sam Someone" in "Spring Open"
      Then it is refused with "Account.Forgotten"
