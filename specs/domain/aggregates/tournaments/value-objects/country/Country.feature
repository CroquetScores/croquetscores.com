Feature: The country a tournament is played in

  A tournament is played in a country, or for one, and a player plays for
  one. A country is known by its code and shown by its name and its flag.

  Every country has a flag, and a country's code is its flag's name: "au"
  for Australia, and "england" for a country that has no two-letter code of
  its own. So a country is made from its flag rather than from a code, and
  its code is whatever its flag is named. There is then no code for a country
  to have that its flag does not, and nothing to keep the two in step; what a
  code must be is what a flag's name must be, and is specified with the flag.

  A country's name is what a reader calls it, in English: "Australia",
  "Isle of Man". Whitespace at either end is taken off, as it is from every
  name here, and a name that is nothing but whitespace is missing. Nothing
  else is asked of it: the names of countries are not a shape that rules can
  be written for.

  Two countries are the same country when their codes are, so a country
  whose name is written another way is still the same country.

  A country is divided into regions, and every country has at least one. A
  country that is not divided, or whose regions nobody has listed, has one
  region, which is the whole country, coded and named as the country is: so
  there is always a region to put a tournament in. A country's regions are in
  order of their names as a reader would look for them in a list, and a region
  is found by its code, taken as a region's code is, so "VIC" finds Victoria.
  Two regions with one code are refused: a region is known by its code within
  its country, and there is no saying which of the two a tournament was in.

  Rule: A country is made from its flag

    Scenario: A country's code is its flag's name
      Given the flag "au"
      When the country named "Australia" is made
      Then the country's code is "au"

    Scenario: A country has its flag
      Given the flag "au"
      When the country named "Australia" is made
      Then the country's flag is "au"

    Scenario: A country without a two-letter code is coded by its flag's name
      Given the flag "england"
      When the country named "England" is made
      Then the country's code is "england"

  Rule: A country has a name

    Scenario: A country's name is kept as it was given
      Given the flag "im"
      When the country named "Isle of Man" is made
      Then the country's name is "Isle of Man"

    Scenario: A name with spaces around it is kept without them
      Given the flag "au"
      When the country named "  Australia  " is made
      Then the country's name is "Australia"

    Scenario: No name at all is refused
      Given the flag "au"
      When the country named "" is made
      Then it is refused for breaking "Country.NameMissing"

    Scenario: A name that is nothing but whitespace is missing
      Given the flag "au"
      When the country named "   " is made
      Then it is refused for breaking "Country.NameMissing"

  Rule: Two countries are the same when their codes are

    Scenario: Countries with the same code and different names are the same country
      Given the flag "au"
      And the country named "Australia"
      And another flag "au"
      And the other country named "Commonwealth of Australia"
      When the countries are compared
      Then they are the same country

    Scenario: Countries with different codes are different countries
      Given the flag "au"
      And the country named "Australia"
      And another flag "nz"
      And the other country named "Australia"
      When the countries are compared
      Then they are different countries

  Rule: Every country has at least one region

    Scenario: A region given to a country is one of its regions
      Given the flag "au"
      And the region "vic" called "Victoria"
      When the country named "Australia" is made
      Then the country has a region "vic"

    Scenario: A country's region has its name
      Given the flag "au"
      And the region "vic" called "Victoria"
      When the country named "Australia" is made
      And the region "vic" is found
      Then the region's name is "Victoria"

    Scenario: A code that is none of the country's regions finds nothing
      Given the flag "au"
      And the region "vic" called "Victoria"
      When the country named "Australia" is made
      Then the country has no region "tas"

    Scenario: A region is found by a code in capitals
      Given the flag "au"
      And the region "vic" called "Victoria"
      When the country named "Australia" is made
      Then the country has a region "VIC"

    Scenario: A country's regions come in order of their names, whatever order they were given in
      Given the flag "au"
      And the region "vic" called "Victoria"
      And the region "act" called "Australian Capital Territory"
      And the region "nsw" called "New South Wales"
      When the country named "Australia" is made
      Then the first region is "act"
      And the second region is "nsw"
      And the third region is "vic"
      And there are no more regions

    Scenario: A country given no regions has one, which is the whole country
      Given the flag "fj"
      When the country named "Fiji" is made
      Then the first region is "fj"
      And there are no more regions

    Scenario: The one region of a country given none is named as the country is
      Given the flag "fj"
      When the country named "Fiji" is made
      And the region "fj" is found
      Then the region's name is "Fiji"

    Scenario: Two regions with one code are refused
      Given the flag "au"
      And the region "vic" called "Victoria"
      And the region "vic" called "Victoria State"
      When the country named "Australia" is made
      Then it is refused for breaking "Country.SameRegionTwice"

    Scenario: Two regions whose codes differ only in case are refused
      Given the flag "au"
      And the region "vic" called "Victoria"
      And the region "VIC" called "Victoria State"
      When the country named "Australia" is made
      Then it is refused for breaking "Country.SameRegionTwice"

    Scenario: A region that could not be a region is refused as a region is
      Given the flag "au"
      And the region "v-c" called "Victoria"
      When the country named "Australia" is made
      Then it is refused for breaking "Region.NotLettersOrDigits"
