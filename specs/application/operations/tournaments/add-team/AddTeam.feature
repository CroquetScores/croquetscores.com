@postgres
Feature: Adding a team to a tournament

  A manager of a tournament played by teams can add a team to it, and the
  account they are signed in to is who added it. The tournament is named by
  its id; one there is not is refused as `AddTeam.NoSuchTournament`. The team
  is given a new id, and the answer is that id. Only the tournament's
  managers can: anybody else, a scorer among them, is refused with
  `Tournament.NotAManager` (`onlyManagers.feature`).

  The team's name, its short name and the flag it flies are asked their own
  rules on the way in, and so is what the team asks of them together — a
  short name no longer than the name (`Team.feature`) — and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks. What the tournament asks of
  a team — that it is played by teams, and that no other team has the name or
  the short name, archived or not, however capitalised — is the tournament's
  to refuse (`addTeam.feature`).

  A forgotten account adds nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And the tournament is to be played in the format "Teams"
    And "organiser@example.com" has created the tournament "Spring Tests"

  Rule: A sound team is added and kept

    Scenario: The team is one of the tournament's teams
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then the tournament has the team "Australia"

    Scenario: The answer is the team's id
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then it is answered with the id of the tournament's team "Australia"

    Scenario: The team has the short name it was added with
      Given the team is to be known for short as "Oz"
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then the tournament's team "Australia" is known for short as "Oz"

    Scenario: The team flies the flag it was added flying
      Given the team is to fly the flag "au"
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then the tournament's team "Australia" flies the flag "au"

    Scenario: The team is given its slug by the tournament
      Given the team is to be known for short as "AUS"
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then the tournament's team "Australia" has the slug "aus"

    Scenario: Adding the team is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then the last thing the tournament recorded was caused by the account for "organiser@example.com"

  Rule: Each value must break none of its own rules

    Scenario Outline: A value that breaks a rule is refused for it
      Given the team is to be known for short as "<short name>"
      And the team is to fly the flag "<flag>"
      When the reader signed in to the account for "organiser@example.com" adds the team "<name>" to "Spring Tests"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | name      | short name  | flag | code                         |
        |           | AUS         | au   | TeamName.Missing             |
        | Australia |             | au   | TeamShortName.Missing        |
        | Australia | Australasia | au   | TeamShortName.TooLong        |
        | Australia | AUS         | zz   | Team.NoSuchFlag              |
        | Oz        | AUS         | au   | Team.ShortNameLongerThanName |

    Scenario: A team that breaks a rule is not added
      Given the team is to be known for short as ""
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then the tournament has no teams

  Rule: What the tournament asks of its teams is the tournament's to refuse

    Scenario: A name another team has is refused as the tournament refuses it
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "OZ"
      When the reader signed in to the account for "organiser@example.com" adds the team "AUSTRALIA" to "Spring Tests"
      Then it is refused with "Tournament.TeamNameTaken"

    Scenario: A short name another team has is refused as the tournament refuses it
      Given "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "aus"
      When the reader signed in to the account for "organiser@example.com" adds the team "Austria" to "Spring Tests"
      Then it is refused with "Tournament.TeamShortNameTaken"

    Scenario: Adding a team to a Standard tournament is refused as the tournament refuses it
      Given the tournament is to be played in the format "Standard"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Open"
      Then it is refused with "Tournament.NotPlayedByTeams"

    Scenario: Adding a team to an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to "Spring Tests"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a team added

    Scenario: Adding a team to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the team "Australia" to a tournament there is not
      Then it is refused with "AddTeam.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the team "Australia" to "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Tests"
      When the reader signed in to the account for "scorer@example.com" adds the team "Australia" to "Spring Tests"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account adds nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the team "Australia" to "Spring Tests"
      Then it is refused with "Account.Forgotten"
