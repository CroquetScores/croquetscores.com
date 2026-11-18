@postgres
Feature: The API takes Advantage for a competition only where it is offered

  A manager says a competition is played as Advantage Golf Croquet when they
  add it or change it, as they say its other rules, in the same request
  (`advantage.feature` says what that makes of the competition). Where the
  site offers Advantage Golf Croquet the request is answered like any other.
  Where it does not (`advantageGolfCroquet.feature` says where), a request that
  says a competition is Advantage is refused with `Advantage.NotOffered`, and
  nothing is kept, since the manager who sent it meant something the site is
  not doing, and to quietly drop it would be to keep a competition they did
  not ask for. A request that does not say Advantage is answered as it always
  was, wherever it is sent.

  What is refused is making a competition Advantage, and not leaving one as
  it is. A site that offered Advantage and no longer does still has its
  Advantage competitions, and the dialog that changes one says what it is, as
  it says its other rules (`advantage.feature`), so a request that says an
  Advantage competition is Advantage is answered, and so is one that says it
  is not, which switches it off. Otherwise a manager could not so much as
  rename a competition they had already made.

  A block, a knockout, a Swiss and a test each have it, and a test is added and
  changed by its own routes, as the competition dialog and the test dialog are
  apart.

  Which website a request is for is the host it was addressed to, as a reader
  typed it, so these scenarios address the site as each of them.

  What the admin needs to begin the dialog on is asked of the site, so that it
  offers a choice only where a request that makes it would be answered: whether
  Advantage is offered here, and, of each competition it lists, whether it is
  Advantage. Nobody has to be signed in to ask whether it is offered, since the
  answer is the same for every reader of the website.

  Background:
    Given a manager of a golf croquet tournament "Spring Open", signed in

  Rule: Where Advantage is offered, a request can say a competition is Advantage

    Scenario Outline: A competition is added as Advantage
      Given the site is told Advantage Golf Croquet is offered
      When a request as "croquetscores.com" adds the <kind> "Competition A" saying it is Advantage
      Then the request is answered as done
      And the tournament's competition "Competition A" is Advantage

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

    Scenario: A competition is changed to Advantage
      Given the site is told Advantage Golf Croquet is offered
      And the block "Block A" has been added to the tournament
      When a request as "croquetscores.com" changes the block "Block A" saying it is Advantage
      Then the request is answered as done
      And the tournament's competition "Block A" is Advantage

    Scenario: A try website offers it whatever it is told
      Given the site is told nothing about Advantage Golf Croquet
      When a request as "try.croquetscores.com" adds the block "Block A" saying it is Advantage
      Then the request is answered as done
      And the tournament's competition "Block A" is Advantage

    Scenario: A test is added as Advantage
      Given the site is told Advantage Golf Croquet is offered
      And a golf croquet teams tournament "Spring Tests" with the teams "Australia" and "England", managed by the signed-in reader
      When a request as "croquetscores.com" adds the test between "Australia" and "England" saying it is Advantage
      Then the request is answered as done
      And the competition "AUS v ENG" of "Spring Tests" is Advantage

    Scenario: A test is changed to Advantage
      Given the site is told Advantage Golf Croquet is offered
      And a golf croquet teams tournament "Spring Tests" with the teams "Australia" and "England", managed by the signed-in reader
      And the test between "Australia" and "England" has been added to "Spring Tests"
      When a request as "croquetscores.com" changes the test "AUS v ENG" saying it is Advantage
      Then the request is answered as done
      And the competition "AUS v ENG" of "Spring Tests" is Advantage

  Rule: Where Advantage is not offered, a request that says a competition is Advantage is refused

    Scenario Outline: A competition added as Advantage is refused
      Given the site is told nothing about Advantage Golf Croquet
      When a request as "croquetscores.com" adds the <kind> "Competition A" saying it is Advantage
      Then the request is refused with "Advantage.NotOffered"
      And the tournament has no competition "Competition A"

      Examples:
        | kind     |
        | block    |
        | knockout |
        | Swiss    |

    Scenario: A competition changed to Advantage is refused
      Given the site is told nothing about Advantage Golf Croquet
      And the block "Block A" has been added to the tournament
      When a request as "croquetscores.com" changes the block "Block A" saying it is Advantage
      Then the request is refused with "Advantage.NotOffered"
      And the tournament's competition "Block A" is not Advantage

    Scenario: A test added as Advantage is refused
      Given the site is told nothing about Advantage Golf Croquet
      And a golf croquet teams tournament "Spring Tests" with the teams "Australia" and "England", managed by the signed-in reader
      When a request as "croquetscores.com" adds the test between "Australia" and "England" saying it is Advantage
      Then the request is refused with "Advantage.NotOffered"
      And the tournament "Spring Tests" has no competition "AUS v ENG"

    Scenario: A test changed to Advantage is refused
      Given the site is told nothing about Advantage Golf Croquet
      And a golf croquet teams tournament "Spring Tests" with the teams "Australia" and "England", managed by the signed-in reader
      And the test between "Australia" and "England" has been added to "Spring Tests"
      When a request as "croquetscores.com" changes the test "AUS v ENG" saying it is Advantage
      Then the request is refused with "Advantage.NotOffered"
      And the competition "AUS v ENG" of "Spring Tests" is not Advantage

  Rule: A competition that is already Advantage can still be changed where Advantage is no longer offered

    Scenario: An Advantage block is renamed
      Given the site is told Advantage Golf Croquet is offered
      And the block "Block A" has been added to the tournament as Advantage
      And the site is no longer told Advantage Golf Croquet is offered
      When a request as "croquetscores.com" changes the block "Block A" saying it is Advantage and calling it "Block One"
      Then the request is answered as done
      And the tournament has the competition "Block One"
      And the tournament's competition "Block One" is Advantage

    Scenario: An Advantage block is switched off
      Given the site is told Advantage Golf Croquet is offered
      And the block "Block A" has been added to the tournament as Advantage
      And the site is no longer told Advantage Golf Croquet is offered
      When a request as "croquetscores.com" changes the block "Block A" saying it is not Advantage
      Then the request is answered as done
      And the tournament's competition "Block A" is not Advantage

    Scenario: An Advantage block that has a game is still not switched off
      Given the site is told Advantage Golf Croquet is offered
      And the block "Block A" has been added to the tournament as Advantage
      And the block "Block A" has a game kept
      And the site is no longer told Advantage Golf Croquet is offered
      When a request as "croquetscores.com" changes the block "Block A" saying it is not Advantage
      Then the request is refused with "Tournament.AdvantageHasGames"

  Rule: A request that does not say Advantage is answered wherever it is sent

    Scenario: A block added without saying is answered where Advantage is not offered
      Given the site is told nothing about Advantage Golf Croquet
      When a request as "croquetscores.com" adds the block "Block A" saying nothing of Advantage
      Then the request is answered as done
      And the tournament's competition "Block A" is not Advantage

    Scenario: A block added saying it is not Advantage is answered where Advantage is not offered
      Given the site is told nothing about Advantage Golf Croquet
      When a request as "croquetscores.com" adds the block "Block A" saying it is not Advantage
      Then the request is answered as done
      And the tournament's competition "Block A" is not Advantage

  Rule: The site says whether Advantage is offered

    Scenario Outline: Whether Advantage is offered where it is told nothing
      Given the site is told nothing about Advantage Golf Croquet
      When a request as "<website>" asks whether Advantage is offered
      Then the answer is that it is <answer>

      Examples:
        | website                | answer      |
        | try.croquetscores.com  | offered     |
        | croquetscores.com      | not offered |
        | gateballscores.com     | not offered |

    Scenario: Whether Advantage is offered where it is told it is
      Given the site is told Advantage Golf Croquet is offered
      When a request as "croquetscores.com" asks whether Advantage is offered
      Then the answer is that it is offered

    Scenario: Nobody has to be signed in to ask
      Given the site is told Advantage Golf Croquet is offered
      And nobody is signed in
      When a request as "croquetscores.com" asks whether Advantage is offered
      Then the answer is that it is offered

  Rule: The list of a tournament's competitions says which are Advantage

    Scenario: A competition added as Advantage is listed as Advantage
      Given the site is told Advantage Golf Croquet is offered
      And the block "Block A" has been added to the tournament as Advantage
      When a request as "croquetscores.com" lists the tournament's competitions
      Then the list says the competition "Block A" is Advantage

    Scenario: A competition added without saying is listed as not Advantage
      Given the block "Block A" has been added to the tournament
      When a request as "croquetscores.com" lists the tournament's competitions
      Then the list says the competition "Block A" is not Advantage
