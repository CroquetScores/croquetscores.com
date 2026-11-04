Feature: What a doubles pair represents

  A player may represent a club, a region or a country (`TournamentPlayer.feature`),
  and a pair made from two players represents what they do, so that the
  pair is listed as its players are and a reader can see who they play for. It
  is made from what each of the two represents, in the order they were given.

  Where only one of them represents anything, the pair represents that. Where
  both represent the same thing, the pair represents it once, however it is
  capitalised, as written for the first of them. Where they represent
  different things, the pair represents both, the first then the second,
  separated by a slash: "Canterbury Croquet Club / Melbourne". Where neither
  represents anything, neither does the pair.

  How the name of the pair is made is `pairName.feature`'s.

  Rule: A pair represents what its players represent

    Scenario: Neither represents anything
      Given the first represents nothing
      And the second represents nothing
      When what the pair represents is made
      Then the pair represents nothing

    Scenario: Only the first represents something
      Given the first represents "Canterbury Croquet Club"
      And the second represents nothing
      When what the pair represents is made
      Then the pair represents "Canterbury Croquet Club"

    Scenario: Only the second represents something
      Given the first represents nothing
      And the second represents "Melbourne"
      When what the pair represents is made
      Then the pair represents "Melbourne"

    Scenario: Both represent the same thing
      Given the first represents "Melbourne"
      And the second represents "Melbourne"
      When what the pair represents is made
      Then the pair represents "Melbourne"

    Scenario: The same thing capitalised differently is the same thing
      Given the first represents "Melbourne"
      And the second represents "MELBOURNE"
      When what the pair represents is made
      Then the pair represents "Melbourne"

    Scenario: Different things are both said, the first then the second
      Given the first represents "Canterbury Croquet Club"
      And the second represents "Melbourne"
      When what the pair represents is made
      Then the pair represents "Canterbury Croquet Club / Melbourne"

    Scenario: The order given is the order written
      Given the first represents "Melbourne"
      And the second represents "Canterbury Croquet Club"
      When what the pair represents is made
      Then the pair represents "Melbourne / Canterbury Croquet Club"
