@postgres
Feature: The tournaments and competitions that every read model of tournaments is built on

  Three read models list tournaments: the home page's by website
  (`TournamentsByWebsite.feature`), the admin's by account
  (`TournamentsByAccount.feature`) and the search's (`Search.feature`). Each
  once kept its own copy of what a tournament is, which meant every change to
  a tournament was written three times, and a fault in one copy left the home
  page and the search disagreeing about the same tournament.

  A tournament is now held once, with the facts that are true of it whoever
  asks: its name, its days, its address, the website it was created on, its
  country, its region, its sport, whether it is national or international,
  and whether it is archived. A competition is held once too, with the
  tournament it is in, whether it is archived and whether it counts towards
  the world rankings. What only one read model needs, such as which accounts
  have a part in a tournament, when a game was added, or a name folded for
  searching, stays in that read model, which joins to these when it is asked.

  A competition's tournament is known from the tournament's own events, and
  not from the competition's, so everything here is written from a
  tournament's stream and does not wait for any other.

  The projection is safe to run twice, as rebuilding the read models does.

  Where a scenario names no website, the tournament is on croquetscores.com,
  is for the sport "ac", is played in the region "vic" of the country "au".

  Background:
    Given the tournaments and competitions read model

  Rule: A tournament is held once, as it was created

    Scenario: A tournament created is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then 1 tournament is found
      And "Spring Open" is found

    Scenario: Its days are held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as starting on "2026-10-03"
      And "Spring Open" is held as finishing on "2026-10-05"

    Scenario: Where it is played is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as played in the country "nz"
      And "Spring Open" is held as played in the region "can"

    Scenario: A tournament played in no region is held as played in none
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be played in no region
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as played in no region

    Scenario: Its sport is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as for the sport "gc"

    Scenario: The website it was created on is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as on the website "gateballscores.com"

    Scenario: A tournament that is national is held as national
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be national
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as national
      And "Spring Open" is not held as international

    Scenario: A tournament that is international is held as international
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be international
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then "Spring Open" is held as international
      And "Spring Open" is not held as national

    Scenario: A tournament is held once however many accounts have a part in it
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When the tournaments are read back
      Then 1 tournament is found

  Rule: What is held of a tournament is what it is now

    Scenario: A tournament renamed is held under its new name
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is renamed "Autumn Open"
      When the tournaments are read back
      Then "Autumn Open" is found
      And "Spring Open" is not found

    Scenario: A tournament moved to other days is held on them
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to start on "2026-11-14"
      When the tournaments are read back
      Then "Spring Open" is held as starting on "2026-11-14"

    Scenario: A tournament moved to another sport is held for it
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" to be for the sport "gc"
      And "Spring Open" is updated to be as it is to be
      When the tournaments are read back
      Then "Spring Open" is held as for the sport "gc"

    Scenario: A tournament updated keeps the website it was created on
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to start on "2026-11-14"
      When the tournaments are read back
      Then "Spring Open" is held as on the website "gateballscores.com"

    Scenario: A tournament updated to be national is held as national
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to be national
      When the tournaments are read back
      Then "Spring Open" is held as national

    Scenario: A tournament updated to be international is held as international
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to be international
      When the tournaments are read back
      Then "Spring Open" is held as international

  Rule: An archived tournament is held as archived until it is restored

    Scenario: A tournament is not archived when it is created
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments are read back
      Then the tournament "Spring Open" is held as not archived

    Scenario: A tournament archived is held as archived
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the tournaments are read back
      Then the tournament "Spring Open" is held as archived

    Scenario: A tournament restored is held as not archived
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      And "Spring Open" is restored
      When the tournaments are read back
      Then the tournament "Spring Open" is held as not archived

  Rule: A competition is held with the tournament it is in

    Scenario: A competition added is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      When the competitions are read back
      Then 1 competition is found
      And the competition "Block A" is held as in "Spring Open"

    Scenario: A competition is held in its own tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-11-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And "Autumn Open" has a competition "Block B" that does not count towards the world rankings
      When the competitions are read back
      Then the competition "Block A" is held as in "Spring Open"
      And the competition "Block B" is held as in "Autumn Open"

    Scenario: A competition is not archived when it is added
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      When the competitions are read back
      Then the competition "Block A" is held as not archived

    Scenario: A competition archived is held as archived
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And "Spring Open" has its competition "Block A" archived
      When the competitions are read back
      Then the competition "Block A" is held as archived

    Scenario: A competition restored is held as not archived
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And "Spring Open" has its competition "Block A" archived
      And "Spring Open" has its competition "Block A" restored
      When the competitions are read back
      Then the competition "Block A" is held as not archived

    Scenario: Archiving a tournament leaves its competitions as they are
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And "Spring Open" is archived
      When the competitions are read back
      Then the competition "Block A" is held as not archived

  Rule: A competition is held as counting towards the world rankings when it says so

    Each competition says for itself, and says again whenever it is changed,
    so the answer follows the last thing it said.

    Scenario: A competition that counts is held as counting
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that counts towards the world rankings
      When the competitions are read back
      Then the competition "Block A" is held as counting towards the world rankings

    Scenario: A competition that does not count is held as not counting
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      When the competitions are read back
      Then the competition "Block A" is held as not counting towards the world rankings

    Scenario: A competition changed to count is held as counting
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And the competition "Block A" of "Spring Open" is changed to count towards the world rankings
      When the competitions are read back
      Then the competition "Block A" is held as counting towards the world rankings

    Scenario: A competition changed not to count is held as not counting
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that counts towards the world rankings
      And the competition "Block A" of "Spring Open" is changed not to count towards the world rankings
      When the competitions are read back
      Then the competition "Block A" is held as not counting towards the world rankings

  Rule: Projecting the same events again changes nothing

    Scenario: A tournament's creation projected twice is one tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When its events are projected again
      And the tournaments are read back
      Then 1 tournament is found

    Scenario: A competition's adding projected twice is one competition
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And "Spring Open" has its competition "Block A" archived
      When its events are projected again
      And the competitions are read back
      Then 1 competition is found
      And the competition "Block A" is held as archived

  Rule: The read model is rebuilt from the events alone

    Every scenario here says the rebuild did not fail as well as what the
    tables hold afterwards, because a rebuild that fails is rolled back with
    the transaction it ran in, which leaves the tables exactly as they were.

    Scenario: A tournament rebuilt keeps what it is now
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is renamed "Autumn Open"
      And "Autumn Open" is archived
      When the read model is rebuilt from the events
      And the tournaments are read back
      Then it is rebuilt without failing
      And the tournament "Autumn Open" is held as archived

    Scenario: A competition rebuilt keeps what it is now
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a competition "Block A" that does not count towards the world rankings
      And the competition "Block A" of "Spring Open" is changed to count towards the world rankings
      And "Spring Open" has its competition "Block A" archived
      When the read model is rebuilt from the events
      And the competitions are read back
      Then it is rebuilt without failing
      And the competition "Block A" is held as in "Spring Open"
      And the competition "Block A" is held as counting towards the world rankings
      And the competition "Block A" is held as archived

    Scenario: Nothing is left of what was there before a rebuild
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the read model is rebuilt from the events
      And the tournaments are read back
      Then it is rebuilt without failing
      And 1 tournament is found
