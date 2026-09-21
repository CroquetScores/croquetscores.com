Feature: The formats a site offers

  Croquet Scores and Gateball Scores are built from the one code, and a
  tournament is set up on one site or the other. They do not offer the same
  formats. Croquet has team events of its own, and Croquet Scores offers every
  format there is. Gateball Scores offers Standard alone: none of the team
  formats is a gateball event.

  The formats a site offers are in the order a reader is offered them.
  Standard comes first, since it is the format most tournaments are played
  in. Teams comes next, as the general format for an event between teams, and
  then the particular team events: Eire Cup, Interstate Shield and GC World
  Team Championship.

  Which site a tournament is set up on is told to the formats rather than
  known by them. What becomes of a tournament set up in a format its site does
  not offer is the tournament's to say, and is specified with it; this says
  only which formats each site offers.

  Rule: Croquet Scores offers every format

    Scenario Outline: A format is offered on Croquet Scores
      Given the site "Croquet Scores"
      When the formats it offers are found
      Then "<name>" is one of them

      Examples:
        | name                       |
        | Standard                   |
        | Teams                      |
        | Eire Cup                   |
        | Interstate Shield          |
        | GC World Team Championship |

  Rule: Gateball Scores offers Standard alone

    Scenario: Standard is offered on Gateball Scores
      Given the site "Gateball Scores"
      When the formats it offers are found
      Then "Standard" is one of them

    Scenario Outline: A format played by teams is not offered on Gateball Scores
      Given the site "Gateball Scores"
      When the formats it offers are found
      Then "<name>" is not one of them

      Examples:
        | name                       |
        | Teams                      |
        | Eire Cup                   |
        | Interstate Shield          |
        | GC World Team Championship |

  Rule: The formats are in the order a reader is offered them

    Scenario: Croquet Scores offers Standard first, then Teams, then the particular team events
      Given the site "Croquet Scores"
      When the formats it offers are found
      Then the first format is "Standard"
      And the second format is "Teams"
      And the third format is "Eire Cup"
      And the fourth format is "Interstate Shield"
      And the fifth format is "GC World Team Championship"
      And there are no more formats

    Scenario: Gateball Scores offers Standard and nothing after it
      Given the site "Gateball Scores"
      When the formats it offers are found
      Then the first format is "Standard"
      And there are no more formats
