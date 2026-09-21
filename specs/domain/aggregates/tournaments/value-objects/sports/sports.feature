Feature: The sports a site offers

  Croquet Scores and Gateball Scores are built from the one code, and a
  tournament is set up on one site or the other. Croquet Scores offers the
  four croquet sports: Association Croquet, Golf Croquet, American 6 Wicket
  and Ricochet. Gateball Scores offers Gateball alone, and Croquet Scores
  does not offer Gateball.

  The sports a site offers are in the order a reader is offered them:
  Association Croquet and Golf Croquet first, as the two most tournaments are
  played in, then American 6 Wicket and Ricochet.

  Which site a tournament is set up on is told to the sports rather than
  known by them. What becomes of a tournament set up in a sport its site does
  not offer is the tournament's to say, and is specified with it; this says
  only which sports each site offers.

  Rule: Croquet Scores offers the four croquet sports

    Scenario Outline: A croquet sport is offered on Croquet Scores
      Given the site "Croquet Scores"
      When the sports it offers are found
      Then the sport "<code>" is offered

      Examples:
        | code |
        | ac   |
        | gc   |
        | a6w  |
        | rc   |

    Scenario: Gateball is not offered on Croquet Scores
      Given the site "Croquet Scores"
      When the sports it offers are found
      Then the sport "gb" is not offered

  Rule: Gateball Scores offers Gateball alone

    Scenario: Gateball is offered on Gateball Scores
      Given the site "Gateball Scores"
      When the sports it offers are found
      Then the sport "gb" is offered

    Scenario Outline: A croquet sport is not offered on Gateball Scores
      Given the site "Gateball Scores"
      When the sports it offers are found
      Then the sport "<code>" is not offered

      Examples:
        | code |
        | ac   |
        | gc   |
        | a6w  |
        | rc   |

  Rule: The sports are in the order a reader is offered them

    Scenario: Croquet Scores offers Association Croquet first, then Golf Croquet, American 6 Wicket and Ricochet
      Given the site "Croquet Scores"
      When the sports it offers are found
      Then the first sport is "ac"
      And the second sport is "gc"
      And the third sport is "a6w"
      And the fourth sport is "rc"
      And there are no more sports

    Scenario: Gateball Scores offers Gateball and nothing after it
      Given the site "Gateball Scores"
      When the sports it offers are found
      Then the first sport is "gb"
      And there are no more sports
