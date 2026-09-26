Feature: Where a tournament is found

  A tournament is found at an address a reader can read, such as
  "2026/ac/spring-open": the year it starts, the code of the sport it is
  played in, and a slug made from its name, each separated from the next by a
  slash. The year and the sport come first because the same tournament is
  played every year, and often in more than one sport, and each of those is a
  tournament of its own that a reader would look for by them.

  A tournament's address is made from those three, and is also read back from
  where it was kept, since a tournament keeps every address it has been found
  at so that an old link still leads to it. Only a writing that making an
  address would have given is read as one. What each part must be is the
  year's, the sport's and the slug's to say, and a part that is not one is
  refused as it would be on its own.

  Whether an address is taken already is not the address's to know, and is
  asked by the tournament.

  Two addresses are the same when they are written the same.

  Rule: An address is the year, the sport and the slug

    Scenario: An address is written as its year, its sport and its slug
      Given the year 2026
      And the sport "ac"
      And the slug "spring-open"
      When a tournament address is made from them
      Then the tournament address is written "2026/ac/spring-open"

    Scenario: An address says the year it was made with
      Given the year 2026
      And the sport "ac"
      And the slug "spring-open"
      When a tournament address is made from them
      Then the tournament address's year is 2026

    Scenario: An address says the sport it was made with
      Given the year 2026
      And the sport "ac"
      And the slug "spring-open"
      When a tournament address is made from them
      Then the tournament address's sport is "ac"

    Scenario: An address says the slug it was made with
      Given the year 2026
      And the sport "ac"
      And the slug "spring-open"
      When a tournament address is made from them
      Then the tournament address's slug is "spring-open"

  Rule: A year is written in four digits

    A year before 1000 or after 9999 would be written in more or fewer than
    four digits, and an address could then be read more than one way. Croquet
    was not played in either.

    Scenario Outline: A year of four digits is accepted
      Given the year <year>
      And the sport "ac"
      And the slug "spring-open"
      When a tournament address is made from them
      Then it is not refused

      Examples:
        | year |
        | 1000 |
        | 9999 |

    Scenario Outline: A year of other than four digits is refused
      Given the year <year>
      And the sport "ac"
      And the slug "spring-open"
      When a tournament address is made from them
      Then it is refused for breaking "TournamentAddress.YearOutOfRange"

      Examples:
        | year  |
        | 999   |
        | 10000 |

  Rule: Only what making an address would give is read as one

    Scenario: An address read from its writing is written the same way
      When a tournament address is read from "2026/ac/spring-open"
      Then the tournament address is written "2026/ac/spring-open"

    Scenario Outline: A writing without three parts is refused
      When a tournament address is read from "<written>"
      Then it is refused for breaking "TournamentAddress.Malformed"

      Examples:
        | written                  |
        | 2026/ac                  |
        | 2026/ac/spring-open/more |
        | /2026/ac/spring-open     |

    Scenario: A writing whose year is not four digits is refused
      When a tournament address is read from "26/ac/spring-open"
      Then it is refused for breaking "TournamentAddress.Malformed"

    Scenario: A writing whose sport is no sport's is refused as a sport is
      When a tournament address is read from "2026/xx/spring-open"
      Then it is refused for breaking "Sport.Unknown"

    Scenario: A writing whose slug is not a slug is refused as a slug is
      When a tournament address is read from "2026/ac/Spring-Open"
      Then it is refused for breaking "Slug.Malformed"

    Scenario: An empty writing is refused
      When a tournament address is read from ""
      Then it is refused for breaking "TournamentAddress.Missing"

  Rule: Two addresses are the same when they are written the same

    Scenario: Addresses written the same are the same
      Given the tournament address "2026/ac/spring-open"
      When it is compared with the tournament address "2026/ac/spring-open"
      Then they are the same tournament address

    Scenario: Addresses in different years are different
      Given the tournament address "2026/ac/spring-open"
      When it is compared with the tournament address "2027/ac/spring-open"
      Then they are different tournament addresses
