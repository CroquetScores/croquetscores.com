Feature: Creating a tournament

  A tournament begins when it is created, on the website it is to be run on.
  Creating it says everything it begins with: its name, when it starts and
  finishes, the format and the sport it is played in, the country and the
  region of that country it is played in, and any notes. It also says whether
  it is played under handicap rules, whether its results count towards the
  world rankings, and whether it is a national or an international event.

  The tournament's own id is given it by whatever creates it, and names its
  stream. Creating it is its first event. What it is given is refused as each
  value would be on its own, and this says only what the tournament asks of
  them together.

  A tournament is run on one website, and keeps it: the sports and formats it
  may be played in are the ones that website's site offers, and a tournament
  that was not one of them would be played by rules its site has not written.
  It finishes no earlier than it starts. Its region is one of its country's.

  A tournament is found at an address made from the year it starts, the code
  of its sport and a slug made from its name, as "2026/ac/spring-open". The
  year is the year the tournament starts as it is written in UTC. No two
  tournaments may be found at the same address, and whether an address is
  taken is not the tournament's to know: whatever creates it says, as it says
  its id. An address somebody else has is followed by "-01", then "-02", up
  to "-99", and the first of those not taken is the tournament's. Should all
  of them be taken, the slug is followed by the tournament id's own
  characters, which nobody else can have.

  Handicap, world ranking, national and international are each said or left
  unsaid. A tournament created without saying is not played under handicap,
  and is neither a national event nor an international one. The world
  rankings are kept for Association Croquet and Golf Croquet alone, so a
  tournament in either counts towards them unless it is said not to, or it is
  played under handicap: a handicap result says nothing about who is better.
  A tournament in any other sport never counts towards them. Saying one does
  when it cannot is refused rather than quietly undone, as is saying it is
  both national and international.

  A new tournament is not archived, and has no players and no competitions.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Creating records that the tournament was created

    Scenario: Creating records the tournament's creation
      When a tournament is created
      Then it has recorded 1 event
      And the first thing it recorded is its creation

    Scenario: A new tournament is known by the id it was created with
      Given the tournament id "tournament/7c9e6679-7425-40de-944b-e07fc1f90ae7"
      When a tournament is created
      Then it is known by "tournament/7c9e6679-7425-40de-944b-e07fc1f90ae7"

  Rule: A tournament is what it was created as

    Scenario: A new tournament is on the website it was created on
      Given the website "croquetscores.com"
      When a tournament is created
      Then the tournament is on the website "croquetscores.com"

    Scenario: A new tournament has the name it was created with
      Given the tournament name "Spring Open"
      When a tournament is created
      Then the tournament is called "Spring Open"

    Scenario: A new tournament starts when it was created to
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      When a tournament is created
      Then the tournament starts at "2026-10-03T00:00:00.000Z"

    Scenario: A new tournament finishes when it was created to
      Given the tournament is to finish at "2026-10-05T00:00:00Z"
      When a tournament is created
      Then the tournament finishes at "2026-10-05T00:00:00.000Z"

    Scenario: A new tournament is in the format it was created in
      Given the format "Teams"
      When a tournament is created
      Then the tournament is played in the format "Teams"

    Scenario: A new tournament is in the sport it was created in
      Given the sport "gc"
      When a tournament is created
      Then the tournament is played in the sport "gc"

    Scenario: A new tournament is in the country it was created in
      Given the country "au"
      When a tournament is created
      Then the tournament is played in the country "au"

    Scenario: A new tournament is in the region it was created in
      Given the country "au"
      And the region "vic"
      When a tournament is created
      Then the tournament is played in the region "vic"

    Scenario: A new tournament has the notes it was created with
      Given the notes "Lunch is at noon."
      When a tournament is created
      Then the tournament's notes are "Lunch is at noon."

    Scenario: A new tournament need have no notes
      Given no notes
      When a tournament is created
      Then the tournament has no notes

  Rule: A new tournament is not archived and has nobody and nothing in it

    Scenario: A new tournament is not archived
      When a tournament is created
      Then the tournament is not archived

    Scenario: A new tournament has no players
      When a tournament is created
      Then the tournament has no players

    Scenario: A new tournament has no competitions
      When a tournament is created
      Then the tournament has no competitions

  Rule: A tournament is played in a sport and a format its website's site offers

    Scenario: A croquet sport is accepted on Croquet Scores
      Given the website "croquetscores.com"
      And the sport "ac"
      When a tournament is created
      Then it is not refused

    Scenario: Gateball is accepted on Gateball Scores
      Given the website "gateballscores.com"
      And the sport "gb"
      And the format "Standard"
      When a tournament is created
      Then it is not refused

    Scenario: Gateball is refused on Croquet Scores
      Given the website "croquetscores.com"
      And the sport "gb"
      When a tournament is created
      Then it is refused with "Tournament.SportNotOffered"

    Scenario: A croquet sport is refused on Gateball Scores
      Given the website "gateballscores.com"
      And the sport "ac"
      And the format "Standard"
      When a tournament is created
      Then it is refused with "Tournament.SportNotOffered"

    Scenario: A try website offers the sports its site does
      Given the website "try.gateballscores.com"
      And the sport "ac"
      And the format "Standard"
      When a tournament is created
      Then it is refused with "Tournament.SportNotOffered"

    Scenario: A team format is refused on Gateball Scores
      Given the website "gateballscores.com"
      And the sport "gb"
      And the format "Teams"
      When a tournament is created
      Then it is refused with "Tournament.FormatNotOffered"

  Rule: A tournament finishes no earlier than it starts

    Scenario: A tournament that finishes the moment it starts is accepted
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the tournament is to finish at "2026-10-03T00:00:00Z"
      When a tournament is created
      Then it is not refused

    Scenario: A tournament that finishes before it starts is refused
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the tournament is to finish at "2026-10-02T23:59:59Z"
      When a tournament is created
      Then it is refused with "Tournament.FinishesBeforeStarts"

  Rule: A tournament's region is one of its country's

    Scenario: A region of another country is refused
      Given the country "au"
      And the region "can"
      When a tournament is created
      Then it is refused with "Tournament.RegionNotInCountry"

    Scenario: A region given in capitals is its country's region
      Given the country "au"
      And the region "VIC"
      When a tournament is created
      Then the tournament is played in the region "vic"

  Rule: A tournament is found at its year, its sport and a slug of its name

    Scenario: A tournament is found at the year it starts, its sport and its name's slug
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: The year is the year the tournament starts in UTC
      Given the tournament is to start at "2027-01-01T09:00:00+10:00"
      And the tournament is to finish at "2027-01-02T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: A new tournament has been found nowhere else
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      When a tournament is created
      Then the tournament has been found at 1 address

    Scenario: A name that makes no slug is refused as a slug is
      Given the tournament name "— ! —"
      When a tournament is created
      Then it is refused for breaking "Slug.Empty"

  Rule: A tournament is not found at an address somebody else has

    Scenario: An address taken is followed by "-01"
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2026/ac/spring-open" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open-01"

    Scenario: An address followed by "-01" that is taken too is followed by "-02"
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2026/ac/spring-open" is taken
      And the address "2026/ac/spring-open-01" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open-02"

    Scenario: The first address not taken is the tournament's, whatever is taken after it
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2026/ac/spring-open" is taken
      And the address "2026/ac/spring-open-02" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open-01"

    Scenario: The last address followed by a number is "-99"
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2026/ac/spring-open" is taken
      And every address from "2026/ac/spring-open-01" to "2026/ac/spring-open-98" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open-99"

    Scenario: With every numbered address taken the slug is followed by the tournament's id
      Given the tournament id "tournament/7c9e6679-7425-40de-944b-e07fc1f90ae7"
      And the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2026/ac/spring-open" is taken
      And every address from "2026/ac/spring-open-01" to "2026/ac/spring-open-99" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open-7c9e6679-7425-40de-944b-e07fc1f90ae7"

    Scenario: An address taken in another year does not count
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2025/ac/spring-open" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: An address taken in another sport does not count
      Given the tournament is to start at "2026-10-03T00:00:00Z"
      And the sport "ac"
      And the tournament name "Spring Open"
      And the address "2026/gc/spring-open" is taken
      When a tournament is created
      Then the tournament is found at "2026/ac/spring-open"

  Rule: A tournament is played under handicap only when it is said to be

    Scenario: A tournament created without saying is not played under handicap
      Given nothing is said of handicap
      When a tournament is created
      Then the tournament is not played under handicap

    Scenario: A tournament said to be played under handicap is
      Given the tournament is said to be played under handicap
      When a tournament is created
      Then the tournament is played under handicap

  Rule: Only an Association Croquet or Golf Croquet tournament not under handicap counts towards the world rankings

    Scenario Outline: A tournament in a sport with world rankings counts towards them unless it is said not to
      Given the sport "<sport>"
      And nothing is said of the world rankings
      When a tournament is created
      Then the tournament counts towards the world rankings

      Examples:
        | sport |
        | ac    |
        | gc    |

    Scenario: A tournament said not to count towards the world rankings does not
      Given the sport "ac"
      And the tournament is said not to count towards the world rankings
      When a tournament is created
      Then the tournament does not count towards the world rankings

    Scenario: A handicap tournament created without saying does not count towards the world rankings
      Given the sport "ac"
      And the tournament is said to be played under handicap
      And nothing is said of the world rankings
      When a tournament is created
      Then the tournament does not count towards the world rankings

    Scenario: A handicap tournament said to count towards the world rankings is refused
      Given the sport "ac"
      And the tournament is said to be played under handicap
      And the tournament is said to count towards the world rankings
      When a tournament is created
      Then it is refused with "Tournament.HandicapInWorldRankings"

    Scenario Outline: A tournament in a sport without world rankings created without saying does not count towards them
      Given the sport "<sport>"
      And nothing is said of the world rankings
      When a tournament is created
      Then the tournament does not count towards the world rankings

      Examples:
        | sport |
        | a6w   |
        | rc    |

    Scenario: A tournament in a sport without world rankings said to count towards them is refused
      Given the sport "a6w"
      And the tournament is said to count towards the world rankings
      When a tournament is created
      Then it is refused with "Tournament.NoWorldRankings"

  Rule: A tournament may be national or international, but not both

    Scenario: A tournament created without saying is not a national event
      Given nothing is said of whether the tournament is national
      When a tournament is created
      Then the tournament is not a national event

    Scenario: A tournament created without saying is not an international event
      Given nothing is said of whether the tournament is international
      When a tournament is created
      Then the tournament is not an international event

    Scenario: A tournament said to be national is a national event
      Given the tournament is said to be national
      When a tournament is created
      Then the tournament is a national event

    Scenario: A tournament said to be international is an international event
      Given the tournament is said to be international
      When a tournament is created
      Then the tournament is an international event

    Scenario: A tournament said to be both national and international is refused
      Given the tournament is said to be national
      And the tournament is said to be international
      When a tournament is created
      Then it is refused with "Tournament.NationalAndInternational"

  Rule: A tournament rebuilt from its stream is as creating it left it

    Scenario: A tournament rebuilt from its creation has its name
      Given a stream where a tournament was created as "Spring Open"
      When the tournament is rebuilt from the stream
      Then the tournament is called "Spring Open"

    Scenario: A tournament rebuilt from its creation is found where it was created to be
      Given a stream where a tournament was created at "2026/ac/spring-open"
      When the tournament is rebuilt from the stream
      Then the tournament is found at "2026/ac/spring-open"

    Scenario: A tournament rebuilt from its creation is on the website it was created on
      Given a stream where a tournament was created on the website "gateballscores.com"
      When the tournament is rebuilt from the stream
      Then the tournament is on the website "gateballscores.com"

    Scenario: A tournament rebuilt from its creation counts towards the world rankings as it was created to
      Given a stream where a tournament was created not counting towards the world rankings
      When the tournament is rebuilt from the stream
      Then the tournament does not count towards the world rankings

    Scenario: A tournament rebuilt from its creation is not archived
      Given a stream where a tournament was created as "Spring Open"
      When the tournament is rebuilt from the stream
      Then the tournament is not archived
