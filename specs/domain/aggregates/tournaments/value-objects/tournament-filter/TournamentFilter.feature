Feature: Which tournaments a reader asks to see

  The home page lists recent results and upcoming tournaments, and a reader
  can narrow both to a country, to a region of it, and to a sport
  (`home.feature`). What they ask for is a filter: each of the three is chosen
  or left out, and whatever is left out is not narrowed by, so a filter of
  nothing at all is every tournament on the website.

  A filter is held to what a tournament is held to when it is created
  (`create.feature`), since a filter no tournament could ever match is a
  mistake in what asked for it rather than a question with no answer. A
  region is a region of a country, so one is chosen only with its country,
  and only one that country has. A sport is one the website offers.

  Which country is meant is found by the application from its code, as it is
  for creating a tournament, so a country there is not is the application's
  to refuse. The filter is given the country itself.

  Where a scenario names no website, the filter is made on croquetscores.com.

  Rule: Whatever is left out is not narrowed by

    Scenario: A filter of nothing filters by no country
      When the filter is made
      Then it filters by no country

    Scenario: A filter of nothing filters by no region
      When the filter is made
      Then it filters by no region

    Scenario: A filter of nothing filters by no sport
      When the filter is made
      Then it filters by no sport

    Scenario: A country alone filters by no region
      Given the country "nz"
      When the filter is made
      Then it filters by no region

    Scenario: A sport alone filters by no country
      Given the sport "gc"
      When the filter is made
      Then it filters by no country

  Rule: What is chosen is filtered by

    Scenario: A country chosen is filtered by
      Given the country "nz"
      When the filter is made
      Then it filters by the country "nz"

    Scenario: A region chosen is filtered by
      Given the country "nz"
      And the region "can"
      When the filter is made
      Then it filters by the region "can"

    Scenario: A sport chosen is filtered by
      Given the sport "gc"
      When the filter is made
      Then it filters by the sport "gc"

    Scenario: A region given in capitals is its country's region
      Given the country "nz"
      And the region "CAN"
      When the filter is made
      Then it filters by the region "can"

  Rule: A region is chosen only with its country

    Scenario: A region without a country is refused
      Given the region "can"
      When the filter is made
      Then it is refused with "TournamentFilter.RegionWithoutCountry"

    Scenario: A region the country does not have is refused
      Given the country "au"
      And the region "can"
      When the filter is made
      Then it is refused with "TournamentFilter.RegionNotInCountry"

    Scenario: A country not divided into regions has its own one region
      Given the country "mt"
      And the region "mt"
      When the filter is made
      Then it filters by the region "mt"

  Rule: A sport is one the website offers

    Scenario Outline: A sport the website offers is filtered by
      Given the website "<website>"
      And the sport "<sport>"
      When the filter is made
      Then it filters by the sport "<sport>"

      Examples:
        | website                | sport |
        | croquetscores.com      | ac    |
        | croquetscores.com      | gc    |
        | croquetscores.com      | a6w   |
        | croquetscores.com      | rc    |
        | gateballscores.com     | gb    |
        | try.croquetscores.com  | ac    |
        | try.gateballscores.com | gb    |

    Scenario: Gateball is refused on Croquet Scores
      Given the website "croquetscores.com"
      And the sport "gb"
      When the filter is made
      Then it is refused with "TournamentFilter.SportNotOffered"

    Scenario: A croquet sport is refused on Gateball Scores
      Given the website "gateballscores.com"
      And the sport "ac"
      When the filter is made
      Then it is refused with "TournamentFilter.SportNotOffered"

    Scenario: A sport there is not is refused
      Given the sport "xx"
      When the filter is made
      Then it is refused with "Sport.Unknown"
