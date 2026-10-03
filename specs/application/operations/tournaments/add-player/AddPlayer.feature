@postgres
Feature: Adding a player to a tournament

  A manager of the tournament can add a player to it, and the account they are
  signed in to is who added them. The tournament is named by its id; one there
  is not is refused as `AddPlayer.NoSuchTournament`. The player is given a new
  id, and the answer is that id. Only the tournament's managers can: anybody
  else, a scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  The player's name, what they represent and the flag they fly are asked their
  own rules on the way in, and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. What the tournament asks of a
  player — that no other has their name, archived or not, however it is
  capitalised — is the tournament's to refuse (`addPlayer.feature`).

  A forgotten account adds nobody, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A sound player is added and kept

    Scenario: The player is one of the tournament's players
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Open"
      Then the tournament has the player "Sam Someone"

    Scenario: The answer is the player's id
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Open"
      Then it is answered with the id of the tournament's player "Sam Someone"

    Scenario: The player represents what they were added representing
      Given the player is to represent "Canterbury Croquet Club"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Open"
      Then the tournament's player "Sam Someone" represents "Canterbury Croquet Club"

    Scenario: The player flies the flag they were added flying
      Given the player is to fly the flag "nz"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Open"
      Then the tournament's player "Sam Someone" flies the flag "nz"

    Scenario: Adding the player is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: Each value must break none of its own rules

    Scenario Outline: A value that breaks a rule is refused for it
      Given the player is to fly the flag "<flag>"
      When the reader signed in to the account for "organiser@example.com" adds the player "<name>" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | name        | flag | code                             |
        |             | nz   | PersonName.Missing               |
        | Sa          | nz   | PersonName.TooShort              |
        | Sam Someone | zz   | TournamentPlayer.NoSuchFlag      |
        | Bye         | nz   | TournamentPlayer.NamedBye        |
        | — ! —       | nz   | TournamentPlayer.NoLetterOrDigit |

    Scenario: A player who breaks a rule is not added
      When the reader signed in to the account for "organiser@example.com" adds the player "Sa" to "Spring Open"
      Then the tournament has no players

  Rule: What the tournament asks of its players is the tournament's to refuse

    Scenario: A name another player has is refused as the tournament refuses it
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the player "SAM SOMEONE" to "Spring Open"
      Then it is refused with "Tournament.PlayerNameTaken"

    Scenario: Adding a player to a tournament played by teams is refused as the tournament refuses it
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Tests"
      Then it is refused with "Tournament.PlayedByTeams"

    Scenario: Adding a player to an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a player added

    Scenario: Adding a player to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the player "Sam Someone" to a tournament there is not
      Then it is refused with "AddPlayer.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the player "Sam Someone" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the player "Sam Someone" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account adds nobody

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the player "Sam Someone" to "Spring Open"
      Then it is refused with "Account.Forgotten"
