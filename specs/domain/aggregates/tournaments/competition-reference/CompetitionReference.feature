Feature: What a tournament knows of each of its competitions

  A tournament is played as competitions — blocks, knockouts, Swiss, and in a
  tournament played by teams, tests (`addTest.feature`) — and each
  competition is a thing of its own, with its players and its games. The
  tournament does not hold all of that. It holds a reference to each: enough
  to list its competitions, in order, and to link to each one, without reading
  any of them.

  A reference names its competition by the competition's id, and carries the
  competition's name, as a competition name is, and its slug, the part of the
  tournament's address that finds it. The slug is given rather than made from
  the name here, because it is kept when the name is corrected, and because
  making it unlike the slug of every other competition in the tournament is
  the tournament's to do: a reference knows only its own.

  A reference has an order, a whole number from 1 up, and the tournament lists
  its competitions from the lowest order to the highest. How the orders are
  spaced, and which one a new competition is given, is the tournament's to
  decide, since it is the one that knows the others.

  A competition can be archived: kept, with everything it is, but set aside,
  so that one added by mistake is out of the way. A reference says whether its
  competition is archived, and one made without saying is not. What may be
  done to an archived competition is the tournament's to say.

  Two references are to the same competition when their ids are, whatever the
  competition is called.

  Rule: A reference carries its competition's name

    Scenario: A reference's name is kept as it was given
      When a reference to a competition named "Block A" is made
      Then the reference's name is "Block A"

    Scenario: A reference's name with spaces around it is kept without them
      When a reference to a competition named "  Block A  " is made
      Then the reference's name is "Block A"

    Scenario: A name that could not be a competition's is refused as a competition's is
      When a reference to a competition named "" is made
      Then it is refused for breaking "CompetitionName.Missing"

  Rule: A reference carries its competition's slug

    Scenario: A reference's slug is kept as it was given
      When a reference to a competition with the slug "block-a" is made
      Then the reference's slug is "block-a"

    Scenario: A slug that making a slug would not give is refused as a slug is
      When a reference to a competition with the slug "Block A" is made
      Then it is refused for breaking "Slug.Malformed"

  Rule: A reference's order is a whole number from 1 up

    Scenario Outline: An order that is a whole number from 1 up is accepted
      When a reference to a competition with the order <order> is made
      Then the reference's order is <order>

      Examples:
        | order |
        | 1     |
        | 10000 |

    Scenario: An order of 0 is refused
      When a reference to a competition with the order 0 is made
      Then it is refused for breaking "CompetitionReference.OrderTooSmall"

    Scenario: An order that is not a whole number is refused
      When a reference to a competition with the order 1.5 is made
      Then it is refused for breaking "CompetitionReference.OrderNotWhole"

  Rule: A reference says whether its competition is archived

    Scenario: A reference to an archived competition says it is archived
      When a reference to an archived competition is made
      Then the reference's competition is archived

    Scenario: A reference to a competition that is not archived says it is not
      When a reference to a competition that is not archived is made
      Then the reference's competition is not archived

    Scenario: A reference made without saying is to a competition that is not archived
      When a reference to a competition is made without saying whether it is archived
      Then the reference's competition is not archived

  Rule: Two references are the same when their ids are

    Scenario: References with the same id and different names are the same
      Given a reference to a competition named "Block A"
      And another reference with the same id to a competition named "Block B"
      When the references are compared
      Then they are the same reference

    Scenario: References with different ids and the same name are different
      Given a reference to a competition named "Block A"
      And another reference to a competition named "Block A"
      When the references are compared
      Then they are different references
