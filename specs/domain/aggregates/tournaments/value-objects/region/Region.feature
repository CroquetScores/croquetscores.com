Feature: The region of a country a tournament is played in

  A country is divided into regions — states, provinces, counties — and a
  tournament is played in one of them. A region is known by its code within
  its country and shown by its name: "vic" for Victoria in Australia.

  The codes are the ones the old site gave, kept as they were so that what the
  old site recorded still finds its region. They are letters and digits, and
  the letters are any alphabet's, because the old site made them from the
  regions' own names: "cór" for Córdoba, "únlr" for Ústí nad Labem Region,
  "pr01" for the second region whose name began "Pr". A code given in
  capitals, with whitespace at either end, or with an accent typed after its
  letter is the code somebody meant written a little differently, and is
  taken as that code.

  A region's name is what a reader calls it, in English where there is an
  English name. Whitespace at either end is taken off, and a name that is
  nothing but whitespace is missing.

  Which regions a country has is the country's to say, and is specified with
  it. Two countries can each have a region with the same code, as Argentina's
  Salta and Austria's Salzburg are both "sal", so a region says which it is
  only within its country.

  Rule: A region's code is letters and digits

    Scenario Outline: A code of letters and digits is accepted
      When the region "<code>" is made
      Then it is not refused

      Examples:
        | code |
        | vic  |
        | cór  |
        | únlr |
        | pr01 |

    Scenario Outline: A code that is not letters and digits alone is refused
      When the region "<code>" is made
      Then it is refused for breaking "Region.NotLettersOrDigits"

      Examples:
        | code   |
        | v-c    |
        | v c    |
        | pr_01  |
        | ../vic |

    Scenario: No code at all is refused
      When the region "" is made
      Then it is refused for breaking "Region.CodeMissing"

    Scenario: A code that is nothing but whitespace is missing
      When the region "   " is made
      Then it is refused for breaking "Region.CodeMissing"

  Rule: A code written a little differently is the code that was meant

    Scenario: A code given in capitals is kept in lower case
      When the region "VIC" is made
      Then the region's code is "vic"

    Scenario: An accented code given in capitals is kept in lower case
      When the region "CÓR" is made
      Then the region's code is "cór"

    Scenario: A code with spaces around it is kept without them
      When the region "  vic  " is made
      Then the region's code is "vic"

    Scenario: A code with its accent typed after the letter is kept as the code that was meant
      When the region "cór" is made with its accent typed after the letter
      Then the region's code is "cór"

  Rule: A region has a name

    Scenario: A region's name is kept as it was given
      When a region named "Ústí nad Labem Region" is made
      Then the region's name is "Ústí nad Labem Region"

    Scenario: A name with spaces around it is kept without them
      When a region named "  Victoria  " is made
      Then the region's name is "Victoria"

    Scenario: No name at all is refused
      When a region named "" is made
      Then it is refused for breaking "Region.NameMissing"

    Scenario: A name that is nothing but whitespace is missing
      When a region named "   " is made
      Then it is refused for breaking "Region.NameMissing"
