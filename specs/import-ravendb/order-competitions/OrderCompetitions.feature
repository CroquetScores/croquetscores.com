@postgres
Feature: Putting each tournament's competitions in the order the old sites listed them

  The competitions are brought over a collection at a time, every block
  before any knockout, so they are added to their tournaments in an order
  that is not the old sites'. Each old tournament listed its competitions in
  the order its manager chose, and that order is what a reader of the old
  site saw.

  So the tournaments are read again, last of all, and the competitions of
  each one brought over are put in the order its list gives. A tournament
  left behind, or refused, has nothing to put in order, and is passed over:
  its refusal was kept when it was imported (`ImportTournaments.feature`),
  and passing over it would only keep a second.

  Background:
    Given the users are imported
    And the tournaments are imported
    And the blocks are imported
    And the knockouts are imported
    And the team matches are imported
    And the competitions are put in order
    And a tournament "tournaments/12" on "croquetscores.com" is imported

  Rule: A tournament's competitions are in the order the old site listed them

    Scenario: The first competition listed is the first competition
      Given the knockout "knockouts/31" of "tournaments/12" on "croquetscores.com" is imported as "Final Knockout"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com" is imported as "A Block"
      And the tournament "tournaments/12" on "croquetscores.com" lists "knockouts/31"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/30"
      When the tournament's competitions are put in order
      Then the first competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "Final Knockout"

    Scenario: The last competition listed is the last competition
      Given the knockout "knockouts/31" of "tournaments/12" on "croquetscores.com" is imported as "Final Knockout"
      And the block "blocks/30" of "tournaments/12" on "croquetscores.com" is imported as "A Block"
      And the tournament "tournaments/12" on "croquetscores.com" lists "knockouts/31"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/30"
      When the tournament's competitions are put in order
      Then the last competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "A Block"

    Scenario: A competition listed first is first however far it has to move
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com" is imported as "Block A"
      And the block "blocks/31" of "tournaments/12" on "croquetscores.com" is imported as "Block B"
      And the block "blocks/32" of "tournaments/12" on "croquetscores.com" is imported as "Block C"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/32"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/31"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/30"
      When the tournament's competitions are put in order
      Then the first competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "Block C"

    Scenario: A test is put where its team match was listed
      Given a tournament "tournaments/13" on "croquetscores.com" of the type "teams" is imported
      And the team match "teammatches/50" of "tournaments/13" on "croquetscores.com" is imported between "Australia" and "England"
      And the team match "teammatches/51" of "tournaments/13" on "croquetscores.com" is imported between "England" and "Wales"
      And the tournament "tournaments/13" on "croquetscores.com" lists "teammatches/51"
      And the tournament "tournaments/13" on "croquetscores.com" lists "teammatches/50"
      When the tournament's competitions are put in order
      Then the first competition of the tournament kept for "tournaments/13" on "croquetscores.com" is "ENG v WAL"

    Scenario: A competition listed in another case is the competition
      Given the knockout "knockouts/31" of "tournaments/12" on "croquetscores.com" is imported as "Final Knockout"
      And the block "Blocks/30" of "tournaments/12" on "croquetscores.com" is imported as "A Block"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/30"
      And the tournament "tournaments/12" on "croquetscores.com" lists "knockouts/31"
      When the tournament's competitions are put in order
      Then the first competition of the tournament kept for "tournaments/12" on "croquetscores.com" is "A Block"

    Scenario: A competition listed that was left behind is passed over
      Given the block "blocks/30" of "tournaments/12" on "croquetscores.com" is imported as "A Block"
      And the tournament "tournaments/12" on "croquetscores.com" lists "knockouts/31"
      And the tournament "tournaments/12" on "croquetscores.com" lists "blocks/30"
      When the tournament's competitions are put in order
      Then no error is kept for "croquetscores.com/tournaments/12"

  Rule: A tournament that was not imported is passed over

    Scenario: Putting the competitions of a tournament not imported in order is not refused
      Given a tournament "tournaments/99" on "croquetscores.com" that was not imported
      When the tournament's competitions are put in order
      Then no error is kept for "croquetscores.com/tournaments/99"

    Scenario: Putting the competitions of a tournament left behind in order is not refused
      Given a tournament "tournaments/14" on "croquetscores.com" is left behind as archived
      When the tournament's competitions are put in order
      Then no error is kept for "croquetscores.com/tournaments/14"
