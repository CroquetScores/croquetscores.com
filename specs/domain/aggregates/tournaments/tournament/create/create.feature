Feature: Creating a tournament

  A tournament begins when it is created, on the website it is to be run on.
  Creating it says everything it begins with: its name, when it starts and
  finishes, the format and the sport it is played in, the country and the
  region of that country it is played in, and any subtitle. It also says whether
  it is played under handicap rules, whether its results count towards the
  world rankings, whether it is a national or an international event, and
  whether drawn games are allowed.

  The tournament's own id is given it by whatever creates it, and names its
  stream. Creating it is its first event. What it is given is refused as each
  value would be on its own, and this says only what the tournament asks of
  them together.

  A tournament is run on one website, and keeps it: the sports and formats it
  may be played in are the ones that website's site offers, and a tournament
  that was not one of them would be played by rules its site has not written.
  It finishes no earlier than it starts, and starts before the year after
  next begins. Its region, where it has one, is one of its country's. It need
  have none: a tournament brought over from the old sites
  (`ImportTournaments.feature`) is known to be in a country, from the time
  zone it was kept in, but not in which of its regions.

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
  rankings are kept for Association Croquet, Golf Croquet and American 6
  Wicket alone, so a tournament in any of them counts towards them unless it is said not to, it is
  played under handicap, or it allows drawn games: a handicap result says
  nothing about who is better, and neither does a drawn one.
  A tournament in any other sport never counts towards them. Saying one does
  when it cannot is refused rather than quietly undone, as is saying it is
  both national and international.

  A game is won by one of its players, on more points or on equal points
  marked as won (`Game.feature`), so a tournament does not allow drawn games
  unless it is said to: few do. Where one does, a game on equal points is
  kept as it was entered, without saying who won.

  A test between two teams is won by the team that wins more of its matches.
  One level on matches is decided by net games, then by net hoops, unless the
  tournament says a test level on matches is drawn, as some team events have
  it. That is a thing only a tournament played by teams can say, so saying it
  of a Standard tournament is refused. The GC World Team Championship has
  always drawn a level test, so one in that format draws them unless it is
  said not to.

  A new tournament is not archived, and has no players and no competitions.

  Whoever creates a tournament is its first manager, and nobody else is: a
  tournament is run by its managers, and until the one who created it says
  who else is to, there is nobody else. It has no scorers
  (`addManager.feature`, `addScorer.feature`).

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

    Scenario: A new tournament has the subtitle it was created with
      Given the subtitle "Lunch is at noon."
      When a tournament is created
      Then the tournament's subtitle is "Lunch is at noon."

    Scenario: A new tournament need have no subtitle
      Given no subtitle
      When a tournament is created
      Then the tournament has no subtitle

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

  Rule: A tournament starts before the year after next begins

    Next year is as far ahead as anybody plans a tournament. One that starts
    further ahead than that is a year typed wrongly, and would be found at
    that year's address, where nobody would look for it. The years are
    counted from the one the tournament is created in, as it is written in
    UTC, as the year of its address is.

    Scenario: A tournament that starts on the last day of next year is accepted
      Given the tournament is to start at "2027-12-31T00:00:00Z"
      And the tournament is to finish at "2027-12-31T00:00:00Z"
      When a tournament is created
      Then it is not refused

    Scenario: A tournament that starts on the first day of the year after next is refused
      Given the tournament is to start at "2028-01-01T00:00:00Z"
      And the tournament is to finish at "2028-01-01T00:00:00Z"
      When a tournament is created
      Then it is refused with "Tournament.StartsAfterNextYear"

    Scenario: The years are counted from the year it is created in as it is written in UTC
      Given the moment "2026-12-31T23:30:00-05:00"
      And the tournament is to start at "2028-06-01T00:00:00Z"
      And the tournament is to finish at "2028-06-01T00:00:00Z"
      When a tournament is created
      Then it is not refused

  Rule: A tournament finishes before the year after next begins

    For the same reason, held to the same year: a finish after next year is
    most often a year typed wrongly. So is a tournament over New Year at the
    end of next year refused until the year turns, since nothing here tells
    it from a slip of the year, and it is entered once the year it starts in
    is next year. Since a tournament finishes no earlier than it starts, one
    that starts too far ahead is refused for its start, which is asked
    first. The years are counted as they are for its start.

    Scenario: A tournament that finishes on the last day of next year is accepted
      Given the tournament is to start at "2027-12-30T00:00:00Z"
      And the tournament is to finish at "2027-12-31T00:00:00Z"
      When a tournament is created
      Then it is not refused

    Scenario: A tournament that finishes on the first day of the year after next is refused
      Given the tournament is to start at "2027-12-31T00:00:00Z"
      And the tournament is to finish at "2028-01-01T00:00:00Z"
      When a tournament is created
      Then it is refused with "Tournament.FinishesAfterNextYear"

    Scenario: A tournament that starts and finishes in the year after next is refused for its start
      Given the tournament is to start at "2028-01-01T00:00:00Z"
      And the tournament is to finish at "2028-01-02T00:00:00Z"
      When a tournament is created
      Then it is refused with "Tournament.StartsAfterNextYear"

    Scenario: The years are counted for its finish from the year it is created in as it is written in UTC
      Given the moment "2026-12-31T23:30:00-05:00"
      And the tournament is to start at "2028-06-01T00:00:00Z"
      And the tournament is to finish at "2028-12-31T00:00:00Z"
      When a tournament is created
      Then it is not refused

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

  Rule: A tournament need be in no region

    Scenario: A tournament created in no region is in none
      Given the country "au"
      And no region
      When a tournament is created
      Then the tournament is played in no region

    Scenario: A tournament created in no region is in its country
      Given the country "au"
      And no region
      When a tournament is created
      Then the tournament is played in the country "au"

    Scenario: A tournament rebuilt from its creation in no region is in none
      Given a stream where a tournament was created in no region of "au"
      When the tournament is rebuilt from the stream
      Then the tournament is played in no region

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

    Scenario: A name that makes no slug is refused as a name, before the tournament is asked
      Given the tournament name "— ! —"
      When a tournament is created
      Then it is refused for breaking "TournamentName.NoLetterOrDigit"

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

  Rule: A tournament allows drawn games only when it is said to

    Scenario: A tournament created without saying does not allow drawn games
      Given nothing is said of drawn games
      When a tournament is created
      Then the tournament does not allow drawn games

    Scenario: A tournament said to allow drawn games does
      Given the tournament is said to allow drawn games
      When a tournament is created
      Then the tournament allows drawn games

  Rule: A tournament is played under handicap only when it is said to be

    Scenario: A tournament created without saying is not played under handicap
      Given nothing is said of handicap
      When a tournament is created
      Then the tournament is not played under handicap

    Scenario: A tournament said to be played under handicap is
      Given the tournament is said to be played under handicap
      When a tournament is created
      Then the tournament is played under handicap

  Rule: Only an Association Croquet or Golf Croquet tournament not under handicap and not allowing drawn games counts towards the world rankings

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

    Scenario: A tournament allowing drawn games created without saying does not count towards the world rankings
      Given the sport "ac"
      And the tournament is said to allow drawn games
      And nothing is said of the world rankings
      When a tournament is created
      Then the tournament does not count towards the world rankings

    Scenario: A tournament allowing drawn games said to count towards the world rankings is refused
      Given the sport "ac"
      And the tournament is said to allow drawn games
      And the tournament is said to count towards the world rankings
      When a tournament is created
      Then it is refused with "Tournament.DrawsInWorldRankings"

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
        | rc    |

    Scenario: A tournament in a sport without world rankings said to count towards them is refused
      Given the sport "rc"
      And the tournament is said to count towards the world rankings
      When a tournament is created
      Then it is refused with "Tournament.NoWorldRankings"

  Rule: A test level on matches is drawn only when a tournament played by teams says so

    Scenario: A tournament played by teams created without saying decides a level test on net games and hoops
      Given the format "Teams"
      And nothing is said of level tests
      When a tournament is created
      Then the tournament decides a level test on net games and hoops

    Scenario: A tournament played by teams said to draw a level test does
      Given the format "Teams"
      And the tournament is said to draw a level test
      When a tournament is created
      Then the tournament draws a level test

    Scenario: A GC World Team Championship created without saying draws a level test
      Given the format "GC World Team Championship"
      And nothing is said of level tests
      When a tournament is created
      Then the tournament draws a level test

    Scenario: A GC World Team Championship said not to draw a level test does not
      Given the format "GC World Team Championship"
      And the tournament is said not to draw a level test
      When a tournament is created
      Then the tournament decides a level test on net games and hoops

    Scenario: A Standard tournament created without saying decides a level test on net games and hoops
      Given the format "Standard"
      And nothing is said of level tests
      When a tournament is created
      Then the tournament decides a level test on net games and hoops

    Scenario: A Standard tournament said to draw a level test is refused
      Given the format "Standard"
      And the tournament is said to draw a level test
      When a tournament is created
      Then it is refused with "Tournament.DrawnTestsWithoutTeams"

    Scenario: A tournament rebuilt from its creation draws a level test as it was created to
      Given a stream where a tournament was created in the format "Teams" drawing a level test
      When the tournament is rebuilt from the stream
      Then the tournament draws a level test

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

  Rule: Whoever creates a tournament is its first manager

    Scenario: The account that creates a tournament manages it
      When a tournament is created
      Then the account "account/123e4567-e89b-42d3-a456-426614174000" manages the tournament

    Scenario: A new tournament has one manager
      When a tournament is created
      Then the tournament has 1 manager

    Scenario: A new tournament has no scorers
      When a tournament is created
      Then the tournament has no scorers

    Scenario: A tournament rebuilt from its creation is managed by whoever created it
      Given a stream where a tournament was created as "Spring Open"
      When the tournament is rebuilt from the stream
      Then the account "account/123e4567-e89b-42d3-a456-426614174000" manages the tournament

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
