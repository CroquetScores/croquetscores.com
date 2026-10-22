@postgres
Feature: Creating a tournament

  Any reader signed in can create a tournament. They are signed in to a
  confirmed account, since nothing else can be signed in to, and that account
  is who created it: which account that is, is the web layer's to say, from
  the session, and nothing a reader types can name another. Whoever creates a
  tournament is its first manager, and only its managers can do anything to it
  afterwards (`onlyManagers.feature`), so that nobody can change a tournament
  somebody else is running.

  A tournament is created on the website the request came to, which is the
  web layer's to say as well: a reader on Gateball Scores creates a Gateball
  Scores tournament. The tournament is given a new id, and the answer is the
  tournament's id and the address it is found at, so that the reader can be
  taken to it.

  Each value the request carries is asked its own rules on the way in, as
  every command's are, and a request that breaks one is refused with
  `Request.Invalid` and the first rule it breaks, before anything else is
  done. The country is found among the countries there are, and one there is
  not is refused as `CreateTournament.NoSuchCountry`. What the tournament asks
  of the values together — a sport its site offers, a finish no earlier than
  the start, a region of its country, and the rest — is the tournament's to
  refuse, with its own codes, and is specified with it (`create.feature`).

  Whether an address is taken is not the tournament's to know. The
  application knows every address any tournament has been found at, not only
  where each is found now, since an old address still leads to its tournament
  and must not be given to another. An address that is taken is followed by
  "-01" and on, as the tournament says.

  An account that has been forgotten creates nothing, and is refused with
  `Account.Forgotten`: a session is ended when its account is forgotten, so
  this is a request that raced the forgetting.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"

  Rule: A sound request creates a tournament

    Scenario: The tournament is created as it was asked for
      Given the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the tournament is called "Spring Open"

    Scenario: The tournament is kept
      Given the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the tournament it answered with is kept, called "Spring Open"

    Scenario: The answer says where the tournament is found
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is answered with the address "2026/ac/spring-open"

    Scenario: Whoever creates the tournament manages it
      Given the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the account for "organiser@example.com" manages the tournament

    Scenario: Creating the tournament is recorded as done by whoever asked
      Given the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the tournament's creation was caused by the account for "organiser@example.com"

    Scenario: Creating the tournament is recorded as done at the moment it was asked
      Given the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the tournament's creation happened at "2026-09-26T10:00:00.000Z"

    Scenario: Each tournament created is given an id of its own
      Given "organiser@example.com" has created the tournament "Spring Open"
      And the tournament name "Autumn Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the two tournaments have different ids

  Rule: A tournament is created on the website the request came to

    Scenario Outline: The tournament is on the website the request came to
      Given the request came to "<website>"
      And the sport "<sport>"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the tournament is on the website "<website>"

      Examples:
        | website            | sport |
        | croquetscores.com  | ac    |
        | gateballscores.com | gb    |

    Scenario: A sport the website's site does not offer is refused as the tournament refuses it
      Given the request came to "croquetscores.com"
      And the sport "gb"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is refused with "Tournament.SportNotOffered"

  Rule: Each value must break none of its own rules

    Scenario Outline: A value that breaks a rule is refused for it
      Given the request says the <field> is "<value>"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is refused with "Request.Invalid"
      And the first rule broken is "<code>"

      Examples:
        | field    | value       | code                           |
        | name     |             | TournamentName.Missing         |
        | name     | spring open | TournamentName.AllLowerCase    |
        | name     | ?????       | TournamentName.NoLetterOrDigit |
        | starts   | soon        | ReadOnlyDate.Unreadable        |
        | finishes | later       | ReadOnlyDate.Unreadable        |
        | format   | Doubles     | TournamentFormat.Unknown       |
        | sport    | xx          | Sport.Unknown                  |
        | country  | zz          | CreateTournament.NoSuchCountry |

    Scenario: A subtitle longer than a subtitle may be is refused for it
      Given the request says the subtitle is 2001 characters long
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is refused with "Request.Invalid"
      And the first rule broken is "TournamentSubtitle.TooLong"

    Scenario: A request that breaks a rule creates nothing
      Given the request says the name is "spring open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then no tournament is kept

  Rule: What the tournament asks of the values together is the tournament's to refuse

    Scenario: A finish before the start is refused as the tournament refuses it
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the tournament is to finish at "2026-10-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is refused with "Tournament.FinishesBeforeStarts"

    Scenario: A start in the year after next is refused as the tournament refuses it
      Given the tournament is to start at "2028-01-01T00:00:00Z"
      And the tournament is to finish at "2028-01-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is refused with "Tournament.StartsAfterNextYear"

    Scenario: A finish in the year after next is refused as the tournament refuses it
      Given the tournament is to start at "2027-12-31T00:00:00Z"
      And the tournament is to finish at "2028-01-01T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is refused with "Tournament.FinishesAfterNextYear"

    Scenario: A tournament the tournament refuses is not kept
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the tournament is to finish at "2026-10-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then no tournament is kept

  Rule: A tournament is not found at an address any tournament has had

    Scenario: An address another tournament is found at is followed by "-01"
      Given "organiser@example.com" has created the tournament "Spring Open" starting at "2026-10-03T00:00:00Z" in the sport "ac"
      And the tournament is to start at "2026-11-07T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is answered with the address "2026/ac/spring-open-01"

    Scenario: An address another tournament was once found at is taken too
      Given "organiser@example.com" has created the tournament "Spring Open" starting at "2026-10-03T00:00:00Z" in the sport "ac"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      And the tournament is to start at "2026-11-07T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is answered with the address "2026/ac/spring-open-01"

    Scenario: An address another tournament was moved to is taken
      Given "organiser@example.com" has created the tournament "Spring Open" starting at "2026-10-03T00:00:00Z" in the sport "ac"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      And the tournament is to start at "2026-11-07T00:00:00Z"
      And the sport "gc"
      And the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is answered with the address "2026/gc/spring-open-01"

    Scenario: An address taken in another year does not count
      Given "organiser@example.com" has created the tournament "Spring Open" starting at "2025-10-04T00:00:00Z" in the sport "ac"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then it is answered with the address "2026/ac/spring-open"

  Rule: A forgotten account creates nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account creates the tournament
      Then it is refused with "Account.Forgotten"
