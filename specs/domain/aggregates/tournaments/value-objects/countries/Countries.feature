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
