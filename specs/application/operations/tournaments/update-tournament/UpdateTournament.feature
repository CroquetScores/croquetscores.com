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
  national or international. Each is asked its own rules on
  the way in, as creating asks them, and what the tournament asks of them
  together is the tournament's to refuse (`update.feature`). The website is
  not among them: a tournament keeps the one it was created on.

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
        | name    | ?????       | TournamentName.NoLetterOrDigit |
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

    Scenario: A start in the year after next is refused as the tournament refuses it
      Given the update starts it at "2028-01-01T00:00:00Z"
      And the update finishes it at "2028-01-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then it is refused with "Tournament.StartsAfterNextYear"

    Scenario: A finish in the year after next is refused as the tournament refuses it
      Given the update starts it at "2027-12-31T00:00:00Z"
      And the update finishes it at "2028-01-01T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then it is refused with "Tournament.FinishesAfterNextYear"

  Rule: What the update leaves alone is said again as it was

  Rule: A tournament moved is not found at an address any other tournament has had

    Scenario: A tournament moved keeps its slug when nobody else has the new address
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

  Rule: The administrator is told of a national or an international tournament that is changed

    A national or an international tournament is the more notable, and the
    administrator is the one who would want to know when one is changed. They
    are told by email, in English only, as creating one tells them
    (`CreateTournament.feature`). An update that changes nothing records
    nothing, and so tells nobody: the email is of a change made, not of a form
    sent again.

    These scenarios have the administrator at "administrator@example.com".

    Scenario: A tournament made national is told to the administrator
      Given the update makes it a national event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email "Email.NotableTournament" is queued for "administrator@example.com"

    Scenario: A tournament made international is told to the administrator
      Given the update makes it an international event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email "Email.NotableTournament" is queued for "administrator@example.com"

    Scenario: A national tournament that is renamed is told to the administrator
      Given "organiser@example.com" has made the tournament "Spring Open" national
      And the update calls it "Spring Open Championship"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then 2 emails are queued for "administrator@example.com"

    Scenario: A tournament that is neither is not told to the administrator
      Given the update calls it "Spring Open Championship"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

    Scenario: A tournament made neither again is not told to the administrator
      Given "organiser@example.com" has made the tournament "Spring Open" national
      And the update makes it neither national nor international
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then one email is queued for "administrator@example.com"

    Scenario: An update that changes nothing tells nobody
      Given "organiser@example.com" has made the tournament "Spring Open" national
      And the update calls it "Spring Open"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then one email is queued for "administrator@example.com"

    Scenario: The email names the tournament as it is now called
      Given the update calls it "Spring Open Championship"
      And the update makes it a national event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email queued for "administrator@example.com" names the tournament "Spring Open Championship"

    Scenario: The email says the tournament was edited
      Given the update makes it a national event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email queued for "administrator@example.com" says the tournament was edited

    Scenario: The email says the tournament is national
      Given the update makes it a national event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email queued for "administrator@example.com" says the tournament is national

    Scenario: The email says the tournament is international
      Given the update makes it an international event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email queued for "administrator@example.com" says the tournament is international

    Scenario: An update that is refused is not told to the administrator
      Given the update makes it a national event
      And the update finishes it at "2026-10-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Spring Open"
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

  Rule: The administrator is not told of a tournament on a try website that is changed

    A try website is where a reader learns the system, and what is entered
    there may be removed at any time, so a change there tells the
    administrator nothing (`CreateTournament.feature`). It is the website the
    tournament was created on that counts, since an update cannot change it.

    These scenarios have the administrator at "administrator@example.com".

    Scenario: A tournament on a try website made national is not told to the administrator
      Given "organiser@example.com" has created the tournament "Try Open" on "try.croquetscores.com"
      And the update makes it a national event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Try Open"
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

    Scenario: A tournament on a try website made international is not told to the administrator
      Given "organiser@example.com" has created the tournament "Try Open" on "try.croquetscores.com"
      And the update makes it an international event
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Try Open"
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

    Scenario: A national tournament on a try website that is renamed is not told to the administrator
      Given "organiser@example.com" has created the tournament "Try Open" on "try.croquetscores.com"
      And "organiser@example.com" has made the tournament "Try Open" national
      And the update calls it "Try Open Championship"
      When the reader signed in to the account for "organiser@example.com" updates the tournament "Try Open"
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

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
