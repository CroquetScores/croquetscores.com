Feature: What a doubles pair is called

  A pair in a doubles tournament is a player of its own, so it needs a name
  (`TournamentPlayer.feature`), and typing it for every pair is the slow part of
  setting a tournament up. It is made from the names of the two players the
  pair is made of, in the order they were given: "Sam Someone & Alex Another".

  Where both have the same last name, the pair is called by the two first names
  and the one last name, as "Peter & Rosie Landrebe", which is how a doubles
  pair of a family is written and said. A last name is the last word of a
  name, with the small words that belong to it before it ("van der Berg",
  "de la Cruz") and a generation after it ("Smith Jr", "Smith III"), so that
  what is left is the first names. A generation alone is no last name, so two
  people called "John Jr" and "Sam Jr" do not share one. It is the same name however it is
  capitalised, as a reader would take it to be (`addPlayer.feature`). A name of one word has no last name, so it is
  never the same as another's, and a pair of two such names is called as any
  other is.

  A pair is a player and nothing links it to the two it was made of
  (`AddPair.feature`), so where the site needs to know that "Peter & Rosie
  Landrebe" and "Rosie & Peter Landrebe" are the same pair, as the search of
  players does (`SearchPlayersOfWebsite.feature`), it reads the two players back
  out of the name. A name is a pair's when it has a delimiter in it once,
  between two names, the delimiter being "&", "/" or "and", the last of them
  as a word of its own, so that "Sam Anderson" is no pair. People write a pair
  all three ways, and a pair is the same pair whichever they used. Where the first of them is a single word and the second has a last
  name, the first has that last name too, since that is what the pair was
  called by. A first of more than one word is a name of its own, as "Mary Jane"
  might be a first name or a whole one, and is taken as written.

  Whether the name is one the tournament already has, and whether the two
  players are players the tournament has, is the tournament's and the
  application's to say (`AddPair.feature`).

  Rule: A pair is called by the two names, in the order given

    Scenario: Two names with different last names
      Given the first name "Sam Someone"
      And the second name "Alex Another"
      When the pair is named
      Then the pair is called "Sam Someone & Alex Another"

    Scenario: The order given is the order written
      Given the first name "Alex Another"
      And the second name "Sam Someone"
      When the pair is named
      Then the pair is called "Alex Another & Sam Someone"

    Scenario: Spaces around a name are not part of it
      Given the first name "  Sam Someone "
      And the second name " Alex Another  "
      When the pair is named
      Then the pair is called "Sam Someone & Alex Another"

    Scenario: Names of one word each
      Given the first name "Madonna"
      And the second name "Cher"
      When the pair is named
      Then the pair is called "Madonna & Cher"

  Rule: Where both have the same last name, it is said once, after both first names

    Scenario: Two names with the same last name
      Given the first name "Peter Landrebe"
      And the second name "Rosie Landrebe"
      When the pair is named
      Then the pair is called "Peter & Rosie Landrebe"

    Scenario: A last name is the same however it is capitalised
      Given the first name "Peter Landrebe"
      And the second name "Rosie LANDREBE"
      When the pair is named
      Then the pair is called "Peter & Rosie LANDREBE"

    Scenario: A last name is the same however its accents were typed
      Given the first name "Peter Müller"
      And the second name "Rosie Müller"
      When the pair is named
      Then the pair is called "Peter & Rosie Müller"

    Scenario: The last name is the last word, and whatever comes before it is a first name
      Given the first name "Mary Jane Smith"
      And the second name "Tom Smith"
      When the pair is named
      Then the pair is called "Mary Jane & Tom Smith"

    Scenario: The small words before a last name belong to it
      Given the first name "Jan van der Berg"
      And the second name "Piet van der Berg"
      When the pair is named
      Then the pair is called "Jan & Piet van der Berg"

    Scenario: A generation after a last name belongs to it
      Given the first name "Jo Smith Jr"
      And the second name "Al Smith Jr"
      When the pair is named
      Then the pair is called "Jo & Al Smith Jr"

    Scenario: A generation is not the last name of the people who have it
      Given the first name "Jo Smith Jr"
      And the second name "Al Jones Jr"
      When the pair is named
      Then the pair is called "Jo Smith Jr & Al Jones Jr"

    Scenario: A generation alone is no last name
      Given the first name "John Jr"
      And the second name "Sam Jr"
      When the pair is named
      Then the pair is called "John Jr & Sam Jr"

    Scenario: A last name with a generation is not the same as one without
      Given the first name "Jo Smith"
      And the second name "Al Smith Jr"
      When the pair is named
      Then the pair is called "Jo Smith & Al Smith Jr"

    Scenario: A first name alone is not a last name
      Given the first name "Landrebe"
      And the second name "Rosie Landrebe"
      When the pair is named
      Then the pair is called "Landrebe & Rosie Landrebe"

  Rule: A pair's name is read back as the two players it was made from

    Scenario: Two names with different last names
      Given the pair called "Sam Someone & Alex Another"
      When the pair is read back
      Then the first player of the pair is "Sam Someone"
      And the second player of the pair is "Alex Another"

    Scenario: A last name said once is the last name of both
      Given the pair called "Peter & Rosie Landrebe"
      When the pair is read back
      Then the first player of the pair is "Peter Landrebe"
      And the second player of the pair is "Rosie Landrebe"

    Scenario: Names of one word each
      Given the pair called "Madonna & Cher"
      When the pair is read back
      Then the first player of the pair is "Madonna"
      And the second player of the pair is "Cher"

    Scenario: A first name of more than one word is taken as written
      Given the pair called "Mary Jane & Tom Smith"
      When the pair is read back
      Then the first player of the pair is "Mary Jane"
      And the second player of the pair is "Tom Smith"

    Scenario: Spaces around the names are not part of them
      Given the pair called "  Sam Someone   &  Alex Another "
      When the pair is read back
      Then the first player of the pair is "Sam Someone"
      And the second player of the pair is "Alex Another"

    Scenario: A slash parts the two names
      Given the pair called "Sam Someone / Alex Another"
      When the pair is read back
      Then the first player of the pair is "Sam Someone"
      And the second player of the pair is "Alex Another"

    Scenario: A slash needs no spaces around it
      Given the pair called "Sam Someone/Alex Another"
      When the pair is read back
      Then the first player of the pair is "Sam Someone"
      And the second player of the pair is "Alex Another"

    Scenario: "and" parts the two names
      Given the pair called "Sam Someone and Alex Another"
      When the pair is read back
      Then the first player of the pair is "Sam Someone"
      And the second player of the pair is "Alex Another"

    Scenario: "and" is the same however it is capitalised
      Given the pair called "Sam Someone AND Alex Another"
      When the pair is read back
      Then the first player of the pair is "Sam Someone"
      And the second player of the pair is "Alex Another"

    Scenario: A last name said once is the last name of both, whatever parts them
      Given the pair called "Peter and Rosie Landrebe"
      When the pair is read back
      Then the first player of the pair is "Peter Landrebe"
      And the second player of the pair is "Rosie Landrebe"

    Scenario: "and" inside a name is not a delimiter
      Given the pair called "Sam Anderson"
      When the pair is read back
      Then the name is not a pair's

    Scenario: A name with no delimiter is no pair
      Given the pair called "Sam Someone"
      When the pair is read back
      Then the name is not a pair's

    Scenario: A name with two delimiters is no pair
      Given the pair called "Sam & Alex & Pat"
      When the pair is read back
      Then the name is not a pair's

    Scenario: A name with two different delimiters is no pair
      Given the pair called "Sam and Alex / Pat"
      When the pair is read back
      Then the name is not a pair's

    Scenario Outline: A delimiter with nothing on one side is no pair
      Given the pair called "<called>"
      When the pair is read back
      Then the name is not a pair's

      Examples:
        | called          |
        | Sam Someone &   |
        | Sam Someone /   |
        | / Sam Someone   |
        | Sam Someone and |
