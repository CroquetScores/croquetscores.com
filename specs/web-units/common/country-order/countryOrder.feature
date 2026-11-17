Feature: Countries are listed where a reader looks for them first

  Most tournaments are played in a few countries, so a drop-down list of
  countries that began with Afghanistan would make most readers scroll past
  a hundred and more to reach the one they want. The list is in three groups,
  with a line between each. The first is the six countries most
  tournaments are played in, in a fixed order: Australia, Egypt, England,
  New Zealand, Spain and the United States. The second is the other countries
  tournaments have been played in since 2025, in alphabetical order. The
  third is every other country, in alphabetical order.

  A group is found by a country's code and not by its name, so that the
  groups are the same in every language. The alphabetical order is that of
  the reader's language, since that is the order a reader looks for a name
  in. A group with no country in it is left out, so that no line is drawn
  with nothing on one side of it. The list that has the groups is made
  wherever countries are chosen from, and each draws the line itself.

  Scenario Outline: The six countries most played in come first, in their own order
    Given the country "us" named "United States"
    And the country "es" named "Spain"
    And the country "england" named "England"
    And the country "eg" named "Egypt"
    And the country "au" named "Australia"
    And the country "nz" named "New Zealand"
    When the countries are put in groups for "en"
    Then the <place> country of the first group is "<name>"

    Examples:
      | place  | name          |
      | first  | Australia     |
      | second | Egypt         |
      | third  | England       |
      | fourth | New Zealand   |
      | fifth  | Spain         |
      | sixth  | United States |

  Scenario: The first group holds no other country
    Given the country "au" named "Australia"
    And the country "jp" named "Japan"
    When the countries are put in groups for "en"
    Then the first group has 1 country

  Scenario Outline: The other countries played in since 2025 are the second group, in alphabetical order
    Given the country "wales" named "Wales"
    And the country "se" named "Sweden"
    And the country "ie" named "Ireland"
    And the country "lv" named "Latvia"
    And the country "au" named "Australia"
    When the countries are put in groups for "en"
    Then the <place> country of the second group is "<name>"

    Examples:
      | place  | name        |
      | first  | Ireland     |
      | second | Latvia      |
      | third  | Sweden      |
      | fourth | Wales       |

  Scenario Outline: Every other country is the third group, in alphabetical order
    Given the country "jp" named "Japan"
    And the country "br" named "Brazil"
    And the country "fr" named "France"
    And the country "nz" named "New Zealand"
    And the country "ie" named "Ireland"
    When the countries are put in groups for "en"
    Then the <place> country of the third group is "<name>"

    Examples:
      | place  | name   |
      | first  | Brazil |
      | second | France |
      | third  | Japan  |

  Scenario: There are three groups where each has a country
    Given the country "au" named "Australia"
    And the country "ie" named "Ireland"
    And the country "jp" named "Japan"
    When the countries are put in groups for "en"
    Then there are 3 groups

  Scenario: A group with no country is left out
    Given the country "jp" named "Japan"
    When the countries are put in groups for "en"
    Then there is 1 group

  Scenario: Nothing in the list is nothing in the groups
    When the countries are put in groups for "en"
    Then there are 0 groups

  Scenario: The groups are the same whatever language names the countries
    Given the country "eg" named "Ägypten"
    And the country "au" named "Australien"
    When the countries are put in groups for "de"
    Then the first country of the first group is "Australien"
    And the second country of the first group is "Ägypten"

  Scenario: The alphabetical order is the reader's language's
    Given the country "ax" named "Åland"
    And the country "zw" named "Zimbabwe"
    And the country "au" named "Australia"
    And the country "ie" named "Ireland"
    When the countries are put in groups for "sv"
    Then the first country of the third group is "Zimbabwe"
    And the second country of the third group is "Åland"

  Scenario: Åland comes among the A countries in English
    Given the country "zw" named "Zimbabwe"
    And the country "ax" named "Åland Islands"
    And the country "au" named "Australia"
    And the country "ie" named "Ireland"
    When the countries are put in groups for "en"
    Then the first country of the third group is "Åland Islands"
