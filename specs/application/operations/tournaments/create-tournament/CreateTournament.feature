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

  Rule: The administrator is told of a national or an international tournament

    A national or an international tournament is the more notable, and the
    administrator is the one who would want to know of it. They are told by
    email, in English only: it is the one language the administrator is held to
    read, whichever language the reader who created the tournament was using.
    The email is queued in the transaction that keeps the tournament, so that
    it is queued if and only if the tournament is kept.

    These scenarios have the administrator at "administrator@example.com".

    Scenario: A national tournament is told to the administrator
      Given the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is queued for "administrator@example.com"

    Scenario: An international tournament is told to the administrator
      Given the tournament is to be international
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is queued for "administrator@example.com"

    Scenario: A tournament that is neither is not told to the administrator
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

    Scenario: The email names the tournament
      Given the tournament name "Spring Open"
      And the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email queued for "administrator@example.com" names the tournament "Spring Open"

    Scenario: The email links to the administrator's page for the tournament
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email queued for "administrator@example.com" links to the tournament at "2026/ac/spring-open"

    Scenario: The email says the tournament was added
      Given the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email queued for "administrator@example.com" says the tournament was added

    Scenario: The email says the tournament is national
      Given the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email queued for "administrator@example.com" says the tournament is national

    Scenario: The email says the tournament is international
      Given the tournament is to be international
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email queued for "administrator@example.com" says the tournament is international

    Scenario: A tournament that is refused is not told to the administrator
      Given the tournament is to be national
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And the tournament is to finish at "2026-10-02T00:00:00Z"
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

  Rule: The administrator is not told of a tournament on a try website

    A try website is where a reader learns the system, and what is entered
    there may be removed at any time. A national or an international
    tournament made there is practice rather than something the
    administrator would want to know of, and the emails would only bury the
    ones that are real.

    These scenarios have the administrator at "administrator@example.com".

    Scenario Outline: A national tournament on a try website is not told to the administrator
      Given the request came to "<website>"
      And the sport "<sport>"
      And the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

      Examples:
        | website                | sport |
        | try.croquetscores.com  | ac    |
        | try.gateballscores.com | gb    |

    Scenario: An international tournament on a try website is not told to the administrator
      Given the request came to "try.croquetscores.com"
      And the tournament is to be international
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is not queued for "administrator@example.com"

    Scenario: A national tournament on a website that is not a try website is still told to the administrator
      Given the request came to "gateballscores.com"
      And the sport "gb"
      And the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is queued for "administrator@example.com"

    Scenario: A national tournament on the development website is still told to the administrator
      Given the request came to "localhost:3000"
      And the tournament is to be national
      When the reader signed in to the account for "organiser@example.com" creates the tournament
      Then the email "Email.NotableTournament" is queued for "administrator@example.com"

  Rule: A forgotten account creates nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account creates the tournament
      Then it is refused with "Account.Forgotten"
