Feature: Adding a block to a tournament

  A tournament is played as competitions, and a block is one kind: a group of
  players who each play the others, ranked by what they win. A block is added
  with an id of its own, given by whatever adds it, a competition name, and
  how many games each match in it is the best of. A block's best-of may be
  even, as a best-of may (`BestOf.feature`).

  What the tournament holds of each competition is a reference to it
  (`CompetitionReference.feature`), and this says what the tournament gives
  the reference of a competition it adds. What is said here is said of every
  kind of competition, and adding a knockout (`addKnockout.feature`) or a
  Swiss (`addSwiss.feature`) says again only enough of it to show that it
  holds for them too.

  No two competitions in a tournament have the same id. No two have the same
  name either, since a player looking for their games could not tell them
  apart; a name is the same however it is capitalised, and an archived
  competition keeps its name, as an archived player does.

  A competition is found within its tournament by a slug made from its name,
  as "2026/ac/spring-open/competitions/block-a". Two names that are not the
  same can still make the same slug, as "Böck" and "Bock" do, and a slug
  another competition has is followed by "-01", then "-02", up to "-99", the
  first of those nobody has being the new competition's. Should all of them be
  taken, the slug is followed by the competition id's own characters. An
  archived competition keeps its slug, so that its address still finds it.

  A competition is given an order, and the tournament lists its competitions
  lowest first. The first competition added is given 10,000, and each after it
  10,000 more than the highest order there is, so that a competition can later
  be put between two others without either of them moving. An archived
  competition keeps its order and still counts, so no order is given twice.

  An archived tournament can only be restored (`restore.feature`), so adding a
  competition to one is refused.

  Background:
    Given the account "account/123e4567-e89b-42d3-a456-426614174000"
    And the moment "2026-09-26T10:00:00Z"

  Rule: Adding a block is recorded, and the block is one of the tournament's competitions

    Scenario: Adding a block records it
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then it has recorded 1 event
      And the first thing it recorded is a block being added

    Scenario: A block added is one of the tournament's competitions
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament has the competition "Block A"

    Scenario: A block added is known by the id it was added with
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the competition id "competition/123e4567-e89b-42d3-a456-426614174000"
      When the block "Block A" is added
      Then the tournament's competition "Block A" is known by "competition/123e4567-e89b-42d3-a456-426614174000"

    Scenario: A block added is a block
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" is a block

    Scenario Outline: A block added is the best of what it was added as
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      And the block is to be the best of <games>
      When the block "Block A" is added
      Then the tournament's competition "Block A" is the best of <games>

      Examples:
        | games |
        | 1     |
        | 2     |

    Scenario: A block added is not archived
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" is not archived

    Scenario: A tournament rebuilt after a block was added has the block
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament has the competition "Block A"

  Rule: No two competitions in a tournament have the same id

    Scenario: A competition with an id another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it as "competition/123e4567-e89b-42d3-a456-426614174000"
      And the tournament is rebuilt from the stream
      And the competition id "competition/123e4567-e89b-42d3-a456-426614174000"
      When the block "Block B" is added
      Then it is refused with "Tournament.CompetitionAlreadyAdded"

  Rule: No two competitions in a tournament have the same name

    Scenario: A competition with a name another competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: A competition's name is the same however it is capitalised
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the tournament is rebuilt from the stream
      When the block "block a" is added
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: A name an archived competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the competition "Block A" was archived
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then it is refused with "Tournament.CompetitionNameTaken"

    Scenario: A name another kind of competition has is refused
      Given a stream where a tournament was created as "Spring Open"
      And the knockout "Main Event" was added to it
      And the tournament is rebuilt from the stream
      When the block "Main Event" is added
      Then it is refused with "Tournament.CompetitionNameTaken"

  Rule: A competition is found by a slug of its name that no other competition in the tournament has

    Scenario: A competition's slug is made from its name
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" has the slug "block-a"

    Scenario: A slug another competition has is followed by "-01"
      Given a stream where a tournament was created as "Spring Open"
      And the block "Böck" was added to it
      And the tournament is rebuilt from the stream
      When the block "Bock" is added
      Then the tournament's competition "Bock" has the slug "bock-01"

    Scenario: A slug followed by "-01" that is taken too is followed by "-02"
      Given a stream where a tournament was created as "Spring Open"
      And the block "Böck" was added to it
      And the block "Bock!" was added to it
      And the tournament is rebuilt from the stream
      When the block "Bock" is added
      Then the tournament's competition "Bock" has the slug "bock-02"

    Scenario: A slug an archived competition has is taken
      Given a stream where a tournament was created as "Spring Open"
      And the block "Böck" was added to it
      And the competition "Böck" was archived
      And the tournament is rebuilt from the stream
      When the block "Bock" is added
      Then the tournament's competition "Bock" has the slug "bock-01"

    Scenario: With every numbered slug taken the slug is followed by the competition's id
      Given a stream where a tournament was created as "Spring Open"
      And a competition was added to it with every slug from "bock" to "bock-99"
      And the tournament is rebuilt from the stream
      And the competition id "competition/123e4567-e89b-42d3-a456-426614174000"
      When the block "Bock" is added
      Then the tournament's competition "Bock" has the slug "bock-123e4567-e89b-42d3-a456-426614174000"

  Rule: Each competition added is given 10,000 more than the highest order there is

    Scenario: The first competition added is given 10,000
      Given a stream where a tournament was created as "Spring Open"
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then the tournament's competition "Block A" has the order 10000

    Scenario: The next competition is given 10,000 more than the highest order
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the tournament is rebuilt from the stream
      When the block "Block C" is added
      Then the tournament's competition "Block C" has the order 30000

    Scenario: An archived competition's order still counts
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      And the competition "Block B" was archived
      And the tournament is rebuilt from the stream
      When the block "Block C" is added
      Then the tournament's competition "Block C" has the order 40000

    Scenario: Competitions are listed lowest order first
      Given a stream where a tournament was created as "Spring Open"
      And the block "Block A" was added to it
      And the block "Block B" was added to it
      When the tournament is rebuilt from the stream
      Then the tournament's first competition is "Block A"
      And the tournament's second competition is "Block B"

  Rule: A competition cannot be added to an archived tournament

    Scenario: Adding a block to an archived tournament is refused
      Given a stream where a tournament was created as "Spring Open"
      And it was archived
      And the tournament is rebuilt from the stream
      When the block "Block A" is added
      Then it is refused with "Tournament.Archived"
