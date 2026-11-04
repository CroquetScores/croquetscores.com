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
