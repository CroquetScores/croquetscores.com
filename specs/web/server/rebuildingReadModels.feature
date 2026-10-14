@browser @postgres
Feature: The read models are made again from the events

  Every read model is kept in step with the events as they are appended, and
  none of them holds anything the events do not. So any of them can be thrown
  away and made again, which is how one that has drifted, or one that a change
  to the site has given a new shape, is put right.

  Rebuilding is a deliberate act and a maintenance script's, run by whoever
  looks after the site, and nothing the running site serves can start one: it
  needs every event there is, which no command or query has any business
  reading. The script empties every read model, once, and then reads the
  streams one at a time and hands each, whole, to every read model, in one
  transaction, so that a rebuild that fails leaves the read models as they
  were, and the site goes on being served from them meanwhile. It says how
  many streams there are before it begins and how many are done as each is,
  which is what lets it say how far it has got (`rebuildReadModelsCli.feature`). It changes no event, and it can be run twice without harm.

  The scenarios here empty every read model by hand first, which is the worst
  there is to put right, and ask for the rebuild as the script does.

  Background:
    Given a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has been given the role "Administrator"
    And the account for "organiser@example.com" was linked to the Google account "google-123"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A read model that is empty is made again from the events

    Scenario: A tournament is not found at its address while the read models are empty
      Given every read model is emptied
      When the page at "/2026/ac/spring-open" is opened
      Then the page says the words for "errors.notFound"

    Scenario: A tournament is found at its address again
      Given every read model is emptied
      When the read models are rebuilt from the events
      And the page at "/2026/ac/spring-open" is opened
      Then the header names the tournament "Spring Open"

    Scenario: A tournament is found for the account that manages it again
      Given every read model is emptied
      When the read models are rebuilt from the events
      Then the tournament "Spring Open" is found for the account for "organiser@example.com"

    Scenario: An account is found by its email address again
      Given every read model is emptied
      When the read models are rebuilt from the events
      Then the account for "organiser@example.com" is found by its email address

    Scenario: An account is found holding its role again
      Given every read model is emptied
      When the read models are rebuilt from the events
      Then the account for "organiser@example.com" is found holding the role "Administrator"

    Scenario: An account is found by its Google account again
      Given every read model is emptied
      When the read models are rebuilt from the events
      Then the account for "organiser@example.com" is found by its Google account

  Rule: A rebuild says how many streams there are and how many are done

    Scenario: It is told how many streams there are
      Given the streams kept are counted
      When the read models are rebuilt from the events, watched
      Then the rebuild was told there are as many streams as were counted

    Scenario: It is told each stream was done in turn
      When the read models are rebuilt from the events, watched
      Then the rebuild was told each stream was done in turn

    Scenario: It is told how many streams there are before any is done
      When the read models are rebuilt from the events, watched
      Then the rebuild was told how many streams there are before any was done

  Rule: A rebuild keeps every event

    Scenario: The events kept are the events there were
      Given the events kept are counted
      And every read model is emptied
      When the read models are rebuilt from the events
      Then the events kept are as many as were counted

  Rule: A rebuild can be run twice

    Scenario: A tournament is found at its address after two rebuilds
      Given every read model is emptied
      When the read models are rebuilt from the events
      And the read models are rebuilt from the events
      And the page at "/2026/ac/spring-open" is opened
      Then the header names the tournament "Spring Open"

    Scenario: An account holds its role once after two rebuilds
      Given every read model is emptied
      When the read models are rebuilt from the events
      And the read models are rebuilt from the events
      Then the account for "organiser@example.com" is found holding the role "Administrator" once

  Rule: A read model that holds something wrong is put right

    Scenario: A tournament held at an address it has not is put right
      Given the tournament "Spring Open" is held at the address "2026/ac/autumn-open"
      When the read models are rebuilt from the events
      And the page at "/2026/ac/autumn-open" is opened
      Then the page says the words for "errors.notFound"
