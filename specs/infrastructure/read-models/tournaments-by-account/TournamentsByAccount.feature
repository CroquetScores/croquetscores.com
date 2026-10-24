@postgres
Feature: Finding the tournaments an account has a part in

  The admin lists the tournaments a reader manages or scores, one year at a
  time, and offers the years they have tournaments in (`tournaments.feature`).
  Neither can replay every tournament's events to find out, so a read model
  keeps the answer: a table of tournaments by account, kept by a projection
  as tournaments are created and changed, and asked by a query.

  A tournament has a row for each account with a part in it, saying whether
  that account manages it or scores it, and holding what the list shows of it:
  its name, its dates, where it is found, and whether it is archived. The row
  follows the tournament: a name, a start, a sport or a website changed is
  changed in every row of it. It follows the part as well: an account taken
  off the tournament's managers or scorers loses its row, and one made a
  manager while it was a scorer keeps one row, as a manager, since that is
  what the tournament does (`addManager.feature`).

  A tournament's year is the year it starts, which is the year in its address.
  The years an account is asked for are those it has a row in, on the website
  asked about, archived tournaments included, newest first, each once. This
  year is not among them unless there is a tournament in it: offering it
  anyway is the admin's to decide, not the read model's.

  A world ranking officer is listed the tournaments it manages or scores, and
  every tournament of the sports asked about besides, as one whose rankings it
  looks after, so they can be asked for together, in the same order and by the
  same year, a tournament's sport being the one its address says. Whether any
  of a tournament's competitions counts towards the world rankings is each
  competition's to say (`competitionRules.feature`). Every list says whether
  the tournament counts, so that the officer can narrow theirs by it and is
  not left to find out on each tournament's page.

  An account that administers the site is listed every tournament on the
  website, as a manager of each, since it may do to every one what a manager
  may (`administrators.feature`). What the list shows of a tournament is held
  once for it whoever has a part in it, so every tournament is asked for from
  that, in the same order and by the same year as an account's own, and its
  years are those any tournament on the website starts in.

  The projection is safe to run twice, as rebuilding the read model does.
  Each tournament is one stream and nothing in one tournament's row depends on
  another's, so a rebuild can take the streams in any order.

  Where a scenario names no website, the tournament is on croquetscores.com
  and is looked for there.

  Background:
    Given the tournaments by account read model

  Rule: A tournament is found for whoever created it, as one they manage

    Scenario: A tournament created is found for its creator
      Given a tournament "Spring Open" to start on "2026-10-03"
      When "Spring Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A tournament created is found as one its creator manages
      Given a tournament "Spring Open" to start on "2026-10-03"
      When "Spring Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as one it manages

    Scenario: A tournament is not found for an account with no part in it
      Given a tournament "Spring Open" to start on "2026-10-03"
      When "Spring Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "other@example.com" in 2026 are looked for
      Then "Spring Open" is not found

  Rule: A tournament is found for its managers and scorers, and for nobody once they stop

    Scenario: A manager added finds the tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the account for "other@example.com" is made a manager of "Spring Open"
      And the tournaments of the account for "other@example.com" in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A manager added finds it as one they manage
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the account for "other@example.com" is made a manager of "Spring Open"
      And the tournaments of the account for "other@example.com" in 2026 are looked for
      Then "Spring Open" is held as one it manages

    Scenario: A manager removed no longer finds the tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "other@example.com" is made a manager of "Spring Open"
      When the account for "other@example.com" is taken off the managers of "Spring Open"
      And the tournaments of the account for "other@example.com" in 2026 are looked for
      Then "Spring Open" is not found

    Scenario: A scorer added finds the tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the account for "scorer@example.com" is made a scorer of "Spring Open"
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A scorer added finds it as one they score
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the account for "scorer@example.com" is made a scorer of "Spring Open"
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then "Spring Open" is held as one it scores

    Scenario: A scorer removed no longer finds the tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When the account for "scorer@example.com" is taken off the scorers of "Spring Open"
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then "Spring Open" is not found

    Scenario: A scorer made a manager finds it as one they manage
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When the account for "scorer@example.com" is made a manager of "Spring Open"
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then "Spring Open" is held as one it manages

    Scenario: A scorer made a manager finds it once
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When the account for "scorer@example.com" is made a manager of "Spring Open"
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then 1 tournament is found

  Rule: A tournament is found in the year it starts, on its own website

    Scenario: A tournament is found in the year it starts
      Given a tournament "New Year Open" to start on "2025-12-30"
      And "New Year Open" to finish on "2026-01-02"
      When "New Year Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "organiser@example.com" in 2025 are looked for
      Then "New Year Open" is found

    Scenario: A tournament is not found in the year it finishes
      Given a tournament "New Year Open" to start on "2025-12-30"
      And "New Year Open" to finish on "2026-01-02"
      When "New Year Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "New Year Open" is not found

    Scenario: A tournament is found on its own website
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      When "Spring Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "organiser@example.com" on "gateballscores.com" in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A tournament is not found on another website
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      When "Spring Open" is created by the account for "organiser@example.com"
      And the tournaments of the account for "organiser@example.com" on "croquetscores.com" in 2026 are looked for
      Then "Spring Open" is not found

  Rule: What is held of a tournament is what it is now

    Scenario: The tournament's dates are held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as starting on "2026-10-03"
      And "Spring Open" is held as finishing on "2026-10-05"

    Scenario: The tournament's address is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held at the address "2026/ac/spring-open"

    Scenario: A tournament renamed is held under its new name
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is renamed "Autumn Open"
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Autumn Open" is found

    Scenario: A tournament renamed is not held under its old name
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is renamed "Autumn Open"
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is not found

    Scenario: A tournament moved to another year is found in it
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is updated to start on "2025-10-03"
      And the tournaments of the account for "organiser@example.com" in 2025 are looked for
      Then "Spring Open" is found

    Scenario: A tournament moved to another year is not found in the one it left
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is updated to start on "2025-10-03"
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is not found

    Scenario: A tournament moved to another year is held at its new address
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is updated to start on "2025-10-03"
      And the tournaments of the account for "organiser@example.com" in 2025 are looked for
      Then "Spring Open" is held at the address "2025/ac/spring-open"

    Scenario: A change is held for every account with a part in the tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When "Spring Open" is renamed "Autumn Open"
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then "Autumn Open" is found

    Scenario: A tournament archived is held as archived
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is archived
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as archived

    Scenario: A tournament archived is still found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      When "Spring Open" is archived
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A tournament restored is held as not archived
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When "Spring Open" is restored
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as not archived

  Rule: The country, the region and the sport of a tournament are held, for the admin to narrow its list by

    The admin narrows a reader's list by country, region and sport, and
    offers only those the list holds (`tournaments.feature`). So what is held
    of a tournament includes the country it is played in and the region of it,
    where it has one. Its sport is the one its address says, as it is for a
    world ranking officer's list, and is not held a second time.

    Scenario: The tournament's country is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as played in the country "nz"

    Scenario: The tournament's region is held
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as played in the region "can"

    Scenario: A tournament in no region is held with no region
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in no region
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as played in no region

    Scenario: A tournament moved to another country is held in it
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      When "Spring Open" is updated to be as it is to be
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as played in the country "nz"

    Scenario: A tournament's country is held for an administrator's list too
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      And "Spring Open" is created by the account for "organiser@example.com"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is held as played in the country "nz"

    Scenario: A tournament's country is held for a world ranking officer's list too
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to finish on "2026-10-05"
      And "Spring Open" to be for the sport "ac"
      And "Spring Open" to be played in the country "nz"
      And "Spring Open" to be played in the region "can"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is held as played in the country "nz"

  Rule: An account's years are those it has tournaments in, newest first

    Scenario: The year of a tournament is one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of the account for "organiser@example.com" are looked for
      Then the first year is 2024

    Scenario: The years are newest first
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2027-03-06"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the years of the account for "organiser@example.com" are looked for
      Then the first year is 2027
      And the second year is 2024

    Scenario: A year is found once however many tournaments are in it
      Given a tournament "Spring Open" to start on "2026-03-07"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-10-03"
      And "Autumn Open" is created by the account for "organiser@example.com"
      When the years of the account for "organiser@example.com" are looked for
      Then 1 year is found

    Scenario: The year of an archived tournament is one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When the years of the account for "organiser@example.com" are looked for
      Then the first year is 2024

    Scenario: The year of a tournament it scores is one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When the years of the account for "scorer@example.com" are looked for
      Then the first year is 2024

    Scenario: The year of a tournament it has been taken off is not one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      And the account for "scorer@example.com" is taken off the scorers of "Spring Open"
      When the years of the account for "scorer@example.com" are looked for
      Then no year is found

    Scenario: The year a tournament has moved away from is not one of its years
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is updated to start on "2025-10-03"
      When the years of the account for "organiser@example.com" are looked for
      Then 1 year is found

    Scenario: The years of another website's tournaments are not among them
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of the account for "organiser@example.com" on "croquetscores.com" are looked for
      Then no year is found

    Scenario: An account with no tournaments has no years
      When the years of the account for "organiser@example.com" are looked for
      Then no year is found

  Rule: Every tournament on a website is found, as one managed, for an administrator's list

    Scenario: A tournament is found whoever created it
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is found

    Scenario: Tournaments created by different accounts are all found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2026-03-06"
      And "Autumn Open" is created by the account for "other@example.com"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then 2 tournaments are found

    Scenario: A tournament is found once however many accounts have a part in it
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then 1 tournament is found

    Scenario: Every tournament is found as one managed
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is held as one it manages

    Scenario: An archived tournament is found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is archived
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is found

    Scenario: A tournament is not found in another year
      Given a tournament "Spring Open" to start on "2025-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is not found

    Scenario: A tournament is not found on another website
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" is created by the account for "organiser@example.com"
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is not found

    Scenario: The years are those any tournament on the website starts in, newest first
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And a tournament "Autumn Open" to start on "2027-03-06"
      And "Autumn Open" is created by the account for "other@example.com"
      When the years of every tournament on "croquetscores.com" are looked for
      Then the first year is 2027
      And the second year is 2024

    Scenario: The years of another website's tournaments are not among every tournament's
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be on the website "gateballscores.com"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of every tournament on "croquetscores.com" are looked for
      Then no year is found

  Rule: A world ranking officer's list is its own tournaments and every one of the sports asked about

    Scenario: A tournament of a sport asked about that it has no part in is found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A tournament it has no part in is held as one whose rankings it looks after
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is held as one whose rankings it looks after

    Scenario: A tournament it manages is held as one it manages
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "ranker@example.com"
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is held as one it manages

    Scenario: A tournament of another sport it manages is found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be for the sport "rc"
      And "Spring Open" is created by the account for "ranker@example.com"
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is found

    Scenario: A tournament of another sport it has no part in is not found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" to be for the sport "rc"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is not found

    Scenario: The years of a sport asked about are among a world ranking officer's
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of the account for "ranker@example.com" as a world ranking officer of association and golf croquet are looked for
      Then the first year is 2024

    Scenario: The years of another sport's tournaments it has no part in are not among them
      Given a tournament "Spring Open" to start on "2024-10-03"
      And "Spring Open" to be for the sport "rc"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the years of the account for "ranker@example.com" as a world ranking officer of association and golf croquet are looked for
      Then no year is found

  Rule: A tournament is held as counting towards the world rankings when a competition in use does

    A world ranking officer narrows its list by whether a tournament counts
    towards the world rankings (`tournaments.feature`), and the list cannot
    ask each tournament's competitions, so the read model keeps the answer.
    Each competition says for itself, so one that counts makes the
    tournament count, and one that is archived is out of use, so it does not
    count for it until it is restored.

    Scenario: A tournament with no competition does not count
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as not counting towards the world rankings

    Scenario: A tournament with a competition that counts does
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as counting towards the world rankings

    Scenario: A tournament whose only competition does not count does not
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that does not count towards the world rankings
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as not counting towards the world rankings

    Scenario: One competition that counts is enough
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that does not count towards the world rankings
      And "Spring Open" has a block "Block B" that counts towards the world rankings
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as counting towards the world rankings

    Scenario: A competition changed to count makes the tournament count
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that does not count towards the world rankings
      And the block "Block A" of "Spring Open" is changed to count towards the world rankings
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as counting towards the world rankings

    Scenario: A competition changed not to count stops the tournament counting
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      And the block "Block A" of "Spring Open" is changed not to count towards the world rankings
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as not counting towards the world rankings

    Scenario: A competition archived stops the tournament counting
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      And the block "Block A" of "Spring Open" is archived
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as not counting towards the world rankings

    Scenario: A competition restored makes the tournament count again
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      And the block "Block A" of "Spring Open" is archived
      And the block "Block A" of "Spring Open" is restored
      When the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then "Spring Open" is held as counting towards the world rankings

    Scenario: It is held for a world ranking officer's list too
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      When the tournaments of the account for "ranker@example.com" as a world ranking officer of association and golf croquet in 2026 are looked for
      Then "Spring Open" is held as counting towards the world rankings

    Scenario: It is held for an administrator's list too
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      When every tournament on "croquetscores.com" in 2026 is looked for
      Then "Spring Open" is held as counting towards the world rankings

    Scenario: It is held once the read model is rebuilt
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" has a block "Block A" that counts towards the world rankings
      When the read model is rebuilt from the events
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then it is rebuilt without failing
      And "Spring Open" is held as counting towards the world rankings

  Rule: Projecting the same events again changes nothing

    Scenario: A tournament's creation projected twice is one tournament
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When its events are projected again
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then 1 tournament is found

    Scenario: A scorer's removal projected twice leaves it not found
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      And the account for "scorer@example.com" is taken off the scorers of "Spring Open"
      When its events are projected again
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then "Spring Open" is not found

  Rule: The read model is rebuilt from the events alone

    Every scenario here says the rebuild did not fail as well as what the
    table holds afterwards, because a rebuild that fails is rolled back with
    the transaction it ran in, which leaves the table exactly as it was.

    Scenario: A tournament rebuilt is found for its manager
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      When the read model is rebuilt from the events
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then it is rebuilt without failing
      And "Spring Open" is found

    Scenario: A tournament rebuilt keeps what it is now
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And "Spring Open" is renamed "Autumn Open"
      And "Autumn Open" is archived
      When the read model is rebuilt from the events
      And the tournaments of the account for "organiser@example.com" in 2026 are looked for
      Then it is rebuilt without failing
      And "Autumn Open" is held as archived

    Scenario: A scorer taken off is not found once rebuilt
      Given a tournament "Spring Open" to start on "2026-10-03"
      And "Spring Open" is created by the account for "organiser@example.com"
      And the account for "scorer@example.com" is made a scorer of "Spring Open"
      And the account for "scorer@example.com" is taken off the scorers of "Spring Open"
      When the read model is rebuilt from the events
      And the tournaments of the account for "scorer@example.com" in 2026 are looked for
      Then it is rebuilt without failing
      And "Spring Open" is not found
