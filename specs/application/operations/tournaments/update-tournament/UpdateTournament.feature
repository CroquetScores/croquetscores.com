@postgres
Feature: Changing what a tournament is

  A manager of the tournament can change what it is, and the account they are
  signed in to is who changed it. The tournament is named by its id, which is
  the web layer's to say from the address it was asked at; one there is not is
  refused as `UpdateTournament.NoSuchTournament`, rather than taken as a new
  one. Only the tournament's managers can: anybody else, a scorer among them,
  is refused with `Tournament.NotAManager` (`onlyManagers.feature`).

  An update says everything again: the name, when it starts and finishes, the
  format, the sport, the country, the region, the notes, and whether it is
  played under handicap, counts towards the world rankings, and is national
  or international. Each is asked its own rules on the way in, as creating
  asks them, and what the tournament asks of them together is the
  tournament's to refuse (`update.feature`). The website is not among them:
  a tournament keeps the one it was created on.

  A tournament keeps its address unless the year it starts or its sport
  changes, and is then found at an address no other tournament has ever had.
  An address the tournament itself was found at before is its own to go back
  to, and is not counted as taken: it still leads to this tournament and no
  other.

  An update that changes nothing records nothing. A forgotten account changes
  nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open" starting at "2026-10-03T00:00:00Z" in the sport "ac"

  Rule: A sound update is kept

    Scenario: The tournament is kept as it was updated
      Given the update calls it "Spring Open Championship"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the tournament is called "Spring Open Championship"

    Scenario: Updating the tournament is recorded as done by whichever manager asked
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And "organiser@example.com" has made "someone@example.com" a manager of "Spring Open"
      And the update calls it "Spring Open Championship"
      When the reader signed in to the account for "someone@example.com" updates the tournament "Spring Open"
      Then the last thing the tournament recorded was caused by the account for "someone@example.com"

    Scenario: An update that changes nothing records nothing
      Given the update calls it "Spring Open"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then nothing more is recorded of the tournament

  Rule: Each value must break none of its own rules

    Scenario Outline: A value that breaks a rule is refused for it
      Given the request says the <field> is "<value>"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | field   | value       | code                           |
        | name    | SPRING OPEN | TournamentName.AllCapitals     |
        | sport   | xx          | Sport.Unknown                  |
        | country | zz          | UpdateTournament.NoSuchCountry |

    Scenario: A request that breaks a rule changes nothing
      Given the request says the name is "SPRING OPEN"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the tournament is called "Spring Open"

  Rule: What the tournament asks of the values together is the tournament's to refuse

    Scenario: A finish before the start is refused as the tournament refuses it
      Given the update finishes it at "2026-10-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then it is refused with "Tournament.FinishesBeforeStarts"

  Rule: A tournament moved is not found at an address any other tournament has had

    Scenario: A tournament moved keeps its address when nobody else has the new one
      Given the update plays it in the sport "gc"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the tournament is found at "2026/gc/spring-open"

    Scenario: A tournament moved to where another tournament is found is followed by "-01"
      Given "organiser@example.com" has created the tournament "Spring Open" starting at "2026-11-07T00:00:00Z" in the sport "gc"
      And the update plays it in the sport "gc"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open" found at "2026/ac/spring-open"
      Then the tournament is found at "2026/gc/spring-open-01"

    Scenario: A tournament moved back is found where it was found before
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      And the update plays it in the sport "ac"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the tournament is found at "2026/ac/spring-open"

  Rule: Only a tournament there is can be updated

    Scenario: Updating a tournament there is not is refused
      Given the update calls it "Spring Open Championship"
      When the reader signed in to the account for "organiser@example.com" updates a tournament there is not
      Then it is refused with "UpdateTournament.NoSuchTournament"

    Scenario: Updating an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      And the update calls it "Spring Open Championship"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      And the update calls it "Spring Open Championship"
      When the reader signed in to the account for "someone@example.com" updates the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      And the update calls it "Spring Open Championship"
      When the reader signed in to the account for "scorer@example.com" updates the tournament "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account changes nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      And the update calls it "Spring Open Championship"
      When the reader signed in to that account updates the tournament "Spring Open"
      Then it is refused with "Account.Forgotten"
