Feature: The countries there are

  The countries there are are the countries of the flags there are, each
  under its name. Every country has a flag, so a country is only ever made
  from a flag there is, and a name given for a code that no flag has is
  refused: it would be a country nobody could see the flag of.

  Not every flag is a country's. The European Union's flag is a flag there
  is, and is no country, so it is given no name and is not among the
  countries. Every other flag is one: England, Scotland and Wales play croquet
  as countries of their own, and are countries here, and so is Catalonia.

  The names are written down once, in the code, one for each flag that is a
  country, worked out from its code: "au" is Australia, "im" is the Isle of
  Man. They are written rather than asked of the system the site runs on,
  which can name a country from its code, because what it answers changes
  with its version, and a country whose name changed under it would no longer
  be where a reader last found it. A list written down can leave a flag out
  by mistake, so the last rule holds the list to the flags: every flag there
  is, but the European Union's, is a country there is.

  Two names given for one code are refused: a country is known by its code,
  and there is no saying which of the two it is called.

  Each country's regions are given with it, by its code, and a country whose
  regions are not given is its own one region, as every country is that is
  not divided. Regions given for a code that no country has are refused, since
  there would be no country to find them in.

  The regions there are are the old site's, written down once in the code
  from its list, so that what the old site recorded still finds its region.
  The old site listed regions for 29 countries, and every other country is
  its own one region. Three of its codes are not the codes here: it called
  England "en", Scotland "sc" and Wales "wa", where their flags are named
  "england", "scotland" and "wales", and "sc" is the Seychelles. Those three
  are given under the codes here, so the Seychelles do not have Scotland's
  regions.

  A country is found by its code as a flag is found by its name, so "AU"
  finds Australia, and a code no country has finds nothing. The countries are
  in order of their names as a reader would look for them in a list, so the
  Åland Islands come among the countries beginning with A, not after Zimbabwe.

  Rule: A country is made for each name, from its flag

    Scenario: A name given for a flag's code is a country
      Given the name "Australia" for "au"
      When the countries are made
      Then there is a country "au"

    Scenario: A country there is has its name
      Given the name "Australia" for "au"
      When the countries are made
      And the country "au" is found
      Then the country's name is "Australia"

    Scenario: A country there is has its flag
      Given the name "Australia" for "au"
      When the countries are made
      And the country "au" is found
      Then the country's flag is "au"

    Scenario: A flag given no name is not a country
      Given the name "Australia" for "au"
      When the countries are made
      Then there is no country "nz"

  Rule: A name that cannot be a country's is refused

    Scenario: A name for a code no flag has is refused
      Given the name "Atlantis" for "zz"
      When the countries are made
      Then it is refused for breaking "Countries.NoFlag"

    Scenario: Two names for one code are refused
      Given the name "Australia" for "au"
      And the name "Commonwealth of Australia" for "au"
      When the countries are made
      Then it is refused for breaking "Countries.SameCodeTwice"

    Scenario: A name that is missing is refused as a country's is
      Given the name "   " for "au"
      When the countries are made
      Then it is refused for breaking "Country.NameMissing"

  Rule: A country is found by its code

    Scenario: A country is found by a code in capitals
      Given the name "Australia" for "au"
      When the countries are made
      Then there is a country "AU"

    Scenario: A code no country has finds nothing
      Given the name "Australia" for "au"
      When the countries are made
      Then there is no country "zz"

  Rule: The countries are in order of their names, as a reader looks for them

    Scenario: The countries come in order of their names, whatever order they were given in
      Given the name "New Zealand" for "nz"
      And the name "Australia" for "au"
      And the name "Jersey" for "je"
      When the countries are made
      Then the first country is "au"
      And the second country is "je"
      And the third country is "nz"
      And there are no more countries

    Scenario: An accented letter comes among the letters it is an accent on
      Given the name "Albania" for "al"
      And the name "Åland Islands" for "ax"
      And the name "Zimbabwe" for "zw"
      When the countries are made
      Then the first country is "ax"
      And the second country is "al"
      And the third country is "zw"
      And there are no more countries

  Rule: A country's regions are given with it, by its code

    Scenario: A region given for a country's code is one of its regions
      Given the name "Australia" for "au"
      And the region "vic" called "Victoria" in "au"
      When the countries are made
      And the country "au" is found
      Then the country has a region "vic"

    Scenario: Every region given for a country's code is one of its regions
      Given the name "Australia" for "au"
      And the region "vic" called "Victoria" in "au"
      And the region "nsw" called "New South Wales" in "au"
      When the countries are made
      And the country "au" is found
      Then the country has a region "vic"
      And the country has a region "nsw"

    Scenario: Regions given for a code in capitals are that country's
      Given the name "Australia" for "au"
      And the region "vic" called "Victoria" in "AU"
      When the countries are made
      And the country "au" is found
      Then the country has a region "vic"

    Scenario: A country whose regions are not given is its own one region
      Given the name "New Zealand" for "nz"
      When the countries are made
      And the country "nz" is found
      Then the first region is "nz"
      And there are no more regions

    Scenario: Regions given for a code no country has are refused
      Given the name "Australia" for "au"
      And the region "auc" called "Auckland" in "nz"
      When the countries are made
      Then it is refused for breaking "Countries.RegionsForNoCountry"

  Rule: The countries there are are the flags there are, but the European Union's

    Scenario: Every flag there is, but the European Union's, is a country there is
      Given the countries there are
      Then every flag there is but "europeanunion" is one of them

    Scenario: The European Union is not a country
      Given the countries there are
      Then there is no country "europeanunion"

    Scenario Outline: A country there is is called by the name worked out from its code
      Given the countries there are
      When the country "<code>" is found
      Then the country's name is "<name>"

      Examples:
        | code    | name           |
        | au      | Australia      |
        | nz      | New Zealand    |
        | gb      | United Kingdom |
        | us      | United States  |
        | england | England        |
        | im      | Isle of Man    |
        | je      | Jersey         |

  Rule: The regions there are are the old site's

    Scenario Outline: A country there is has the region the old site gave it
      Given the countries there are
      When the country "<country>" is found
      And the region "<region>" is found
      Then the region's name is "<name>"

      Examples:
        | country  | region | name                  |
        | au       | vic    | Victoria              |
        | nz       | auc    | Auckland              |
        | ar       | cór    | Córdoba               |
        | cz       | únlr   | Ústí nad Labem Region |
        | im       | iom    | Isle of Man           |
        | england  | ken    | Kent                  |
        | scotland | fif    | Fife                  |
        | wales    | car    | Cardiff               |

    Scenario: A country the old site gave no regions is its own one region
      Given the countries there are
      When the country "fj" is found
      Then the first region is "fj"
      And there are no more regions

    Scenario: The Seychelles do not have Scotland's regions
      Given the countries there are
      When the country "sc" is found
      Then the first region is "sc"
      And there are no more regions

    Scenario: Every country there is has at least one region
      Given the countries there are
      Then every one of them has at least one region
