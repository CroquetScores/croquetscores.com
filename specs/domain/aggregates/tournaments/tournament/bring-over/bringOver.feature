Feature: Bringing a tournament over from the old sites

  A tournament brought over from the old sites (`ImportTournaments.feature`)
  begins as a created one does (`create.feature`), with everything creating
  says and every refusal creating makes, but for one thing: where it is
  found. A created tournament is found at a slug made from its name, and the
  first of its numbered forms that nobody has. A tournament brought over is
  found at the slug the old site gave it, since links to it are all over the
  web, and the old site had often renamed it since.

  The slug is given rather than made, and is not asked whether somebody else
  has it. The old sites never gave two tournaments of one year and one sport
  the same slug, and a tournament is brought over before the site has any
  tournament of its own. The year and the sport are the tournament's, as
  they are for a created one, so that the address still says when and what
  it was.

  Being brought over is recorded as its creation is, since the tournament
  rebuilt from it is a tournament like any other.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2014-03-01T00:00:00Z"

  Rule: A tournament brought over is found at the slug it is given

    Scenario: A tournament brought over is found at its year, its sport and the slug it was given
      Given the tournament is to start at "2014-03-01T00:00:00Z"
      And the sport "ac"
      And the tournament name "Canterbury Open"
      When a tournament is brought over at the slug "canterbury-championships"
      Then the tournament is found at "2014/ac/canterbury-championships"

    Scenario: A tournament brought over at a numbered slug is found at it
      Given the tournament is to start at "2014-03-01T00:00:00Z"
      And the sport "ac"
      And the tournament name "Canterbury Open"
      When a tournament is brought over at the slug "canterbury-open-1"
      Then the tournament is found at "2014/ac/canterbury-open-1"

    Scenario: A tournament brought over has been found nowhere else
      Given the tournament is to start at "2014-03-01T00:00:00Z"
      And the sport "ac"
      And the tournament name "Canterbury Open"
      When a tournament is brought over at the slug "canterbury-championships"
      Then the tournament has been found at 1 address

    Scenario: A slug that is not one is refused as a slug is
      Given the tournament name "Canterbury Open"
      When a tournament is brought over at the slug ""
      Then it is refused for breaking "Slug.Empty"

  Rule: A tournament brought over is otherwise what it would be created as

    Scenario: Bringing a tournament over records its creation
      When a tournament is brought over at the slug "canterbury-open"
      Then it has recorded 1 event
      And the first thing it recorded is its creation

    Scenario: A tournament brought over has the name it was given
      Given the tournament name "Canterbury Open"
      When a tournament is brought over at the slug "canterbury-championships"
      Then the tournament is called "Canterbury Open"

    Scenario: Whoever brings a tournament over manages it
      When a tournament is brought over at the slug "canterbury-open"
      Then the account "account/123e4567-e89b-42d3-a456-426614174000" manages the tournament

    Scenario: A tournament brought over need be in no region
      Given the country "nz"
      And no region
      When a tournament is brought over at the slug "canterbury-open"
      Then the tournament is played in no region

    Scenario: A tournament brought over is refused what a created one is refused
      Given the tournament is to start at "2014-03-03T00:00:00Z"
      And the tournament is to finish at "2014-03-01T00:00:00Z"
      When a tournament is brought over at the slug "canterbury-open"
      Then it is refused with "Tournament.FinishesBeforeStarts"

  Rule: A tournament rebuilt from being brought over is found where it was brought over to

    Scenario: A tournament rebuilt from being brought over is found at the slug it was given
      Given the tournament is to start at "2014-03-01T00:00:00Z"
      And the sport "ac"
      And a stream where a tournament was brought over at the slug "canterbury-championships"
      When the tournament is rebuilt from the stream
      Then the tournament is found at "2014/ac/canterbury-championships"
