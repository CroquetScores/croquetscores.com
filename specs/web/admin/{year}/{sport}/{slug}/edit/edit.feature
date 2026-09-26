@browser @postgres
Feature: A tournament is changed in the admin

  /admin/{year}/{sport}/{slug}/edit is where a manager changes what a
  tournament is, having pressed Edit on it in their list
  (`tournaments.feature`). It is the form that creates a tournament
  (`new.feature`), asking the same things, offering what the website offers,
  and held to the same rules: a choice with nothing to choose is not asked
  for, the world rankings are asked about only where they can be counted, a
  tournament is never both national and international, and fields read
  together are side by side. The same form draws both, so those rules are
  specified once, there, and this says what changing a tournament adds to
  them.

  It begins as the tournament is, rather than empty, since a change is made
  to what is there. Updating says everything again (`update.feature`), so
  what the reader leaves alone is said again as it was, and is kept.

  Only a manager can change a tournament, and a scorer or anybody else is
  told they cannot rather than shown a form they could not use. An archived
  tournament can only be restored, so it is not offered for changing either,
  and the reader is told why.

  A tournament keeps its address when its name is corrected, so that a link
  somebody has already sent still finds it. It moves only when the year it
  starts or its sport does (`update.feature`), so saving takes the reader to
  the tournament wherever it is found now. Every address a tournament has been
  found at is kept, and changing it at an address it has moved on from is
  changing it where it is now: the reader is sent there.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" finishes on "2026-10-05"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: Only a reader signed in sees the form

    Scenario: A reader not signed in is sent to sign in first
      Given the reader has signed out
      When the page to edit "Spring Open" is opened
      Then the sign in page is shown

    Scenario: A reader who signs in from there is brought back to the form
      Given the reader has signed out
      And the page to edit "Spring Open" is open
      When the reader signs in as "organiser@example.com" with the password "correct horse battery staple"
      Then the address is "/admin/2026/ac/spring-open/edit"

  Rule: It is the form that creates a tournament

    Scenario Outline: The form asks for each thing a tournament is
      When the page to edit "Spring Open" is opened
      Then the form asks for "<field>"

      Examples:
        | field                             |
        | Name                              |
        | Starts                            |
        | Finishes                          |
        | Sport                             |
        | Format                            |
        | Country                           |
        | Notes                             |
        | Played under handicap             |
        | Counts towards the world rankings |
        | Is national                       |
        | Is international                  |

    Scenario: The form is titled for what it does
      When the page to edit "Spring Open" is opened
      Then the dialog is titled "Edit Tournament"

    Scenario: The form's one button updates the tournament
      When the page to edit "Spring Open" is opened
      Then the form's button is "Update Tournament"

    Scenario: The form offers no way to cancel
      When the page to edit "Spring Open" is opened
      Then the form has 1 button

    Scenario: Ticking national unticks international here too
      Given the page to edit "Spring Open" is open
      And the reader ticks "Is international"
      When the reader ticks "Is national"
      Then "Is international" is not ticked

    Scenario: The start and the finish are on one row here too
      When the page to edit "Spring Open" is opened
      Then "Starts" and "Finishes" are on the same row

  Rule: The form begins as the tournament is

    Scenario: The name is the tournament's
      When the page to edit "Spring Open" is opened
      Then "Name" still says "Spring Open"

    Scenario: The start is the tournament's
      When the page to edit "Spring Open" is opened
      Then "Starts" still says "2026-10-03"

    Scenario: The finish is the tournament's
      When the page to edit "Spring Open" is opened
      Then "Finishes" still says "2026-10-05"

    Scenario: The sport is the tournament's
      Given the tournament "Spring Open" is for the sport "gc"
      When the page to edit "Spring Open" is opened
      Then the sport chosen is "Golf Croquet"

    Scenario: The country is the tournament's
      When the page to edit "Spring Open" is opened
      Then the country chosen is "Australia"

    Scenario: The region is the tournament's
      When the page to edit "Spring Open" is opened
      Then the region chosen is "Victoria"

    Scenario: A tournament played under handicap is ticked as one
      Given the tournament "Spring Open" is played under handicap
      When the page to edit "Spring Open" is opened
      Then "Played under handicap" is ticked

    Scenario: A national tournament is ticked as one
      Given the tournament "Spring Open" is national
      When the page to edit "Spring Open" is opened
      Then "Is national" is ticked

    Scenario: A tournament that does not count towards the world rankings is not ticked as counting
      Given the tournament "Spring Open" does not count towards the world rankings
      When the page to edit "Spring Open" is opened
      Then "Counts towards the world rankings" is not ticked

    Scenario: The notes are the tournament's
      Given the tournament "Spring Open" has the notes "Lawns open at nine."
      When the page to edit "Spring Open" is opened
      Then "Notes" still says "Lawns open at nine."

  Rule: Saving keeps the change and takes the reader to the tournament

    Scenario: A renamed tournament keeps its address
      Given the page to edit "Spring Open" is open
      And "Spring Open Championship" is typed as the "Name"
      When "Update Tournament" is pressed
      Then the address is "/admin/2026/ac/spring-open"

    Scenario: A renamed tournament is listed by its new name
      Given the page to edit "Spring Open" is open
      And "Spring Open Championship" is typed as the "Name"
      And "Update Tournament" is pressed
      When the admin is opened
      Then the tournament "Spring Open Championship" is listed

    Scenario: A tournament moved to another sport is found in it
      Given the page to edit "Spring Open" is open
      And the sport "Golf Croquet" is chosen
      When "Update Tournament" is pressed
      Then the address is "/admin/2026/gc/spring-open"

    Scenario: A tournament moved to another year is found in it
      Given the page to edit "Spring Open" is open
      And "2027-03-06" is typed as the "Starts"
      And "2027-03-07" is typed as the "Finishes"
      When "Update Tournament" is pressed
      Then the address is "/admin/2027/ac/spring-open"

    Scenario: What is left alone is kept as it was
      Given the tournament "Spring Open" has the notes "Lawns open at nine."
      And the page to edit "Spring Open" is open
      And "Spring Open Championship" is typed as the "Name"
      When "Update Tournament" is pressed
      Then the tournament "Spring Open Championship" is kept with the notes "Lawns open at nine."

  Rule: What is refused is said beside the field it is about

    Scenario Outline: A value that breaks a rule is refused beside its field
      Given the page to edit "Spring Open" is open
      And "<name>" is typed as the "Name"
      And "<starts>" is typed as the "Starts"
      And "<finishes>" is typed as the "Finishes"
      When "Update Tournament" is pressed
      Then "<field>" is refused with "<code>"

      Examples:
        | name        | starts     | finishes   | field    | code                            |
        |             | 2026-10-03 | 2026-10-05 | Name     | TournamentName.Missing          |
        | spring open | 2026-10-03 | 2026-10-05 | Name     | TournamentName.AllLowerCase     |
        | Spring Open | 2026-10-05 | 2026-10-03 | Finishes | Tournament.FinishesBeforeStarts |

    Scenario: A refused form keeps what was typed
      Given the page to edit "Spring Open" is open
      And "spring open" is typed as the "Name"
      When "Update Tournament" is pressed
      Then "Name" still says "spring open"

    Scenario: A refused change is not kept
      Given the page to edit "Spring Open" is open
      And "spring open" is typed as the "Name"
      And "Update Tournament" is pressed
      When the admin is opened
      Then the tournament "Spring Open" is listed

  Rule: Only a manager changes a tournament

    A scorer enters scores and changes nothing else, and anybody with no part
    in a tournament changes nothing of it (`onlyManagers.feature`). Either is
    told so, by the refusal's code, in place of the form.

    Scenario: A scorer is told they cannot change the tournament
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page to edit "Spring Open" is opened
      Then the page is refused with "Tournament.NotAManager"

    Scenario: A scorer is shown no form
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page to edit "Spring Open" is opened
      Then the form does not ask for "Name"

    Scenario: A reader with no part in the tournament is told they cannot change it
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page to edit "Spring Open" is opened
      Then the page is refused with "Tournament.NotAManager"

    Scenario: A manager other than its creator can change it
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a manager of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page to edit "Spring Open" is opened
      Then "Name" still says "Spring Open"

  Rule: An archived tournament is not offered for changing

    Scenario: An archived tournament says it cannot be changed
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page to edit "Spring Open" is opened
      Then the page is refused with "Tournament.Archived"

    Scenario: An archived tournament is shown no form
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the page to edit "Spring Open" is opened
      Then the form does not ask for "Name"

  Rule: Only a tournament there is can be changed

    Scenario: An address no tournament has been found at says so
      When the page at "/admin/2026/ac/no-such-open/edit" is opened
      Then the page is refused with "UpdateTournament.NoSuchTournament"

  Rule: An address the tournament has moved on from sends the reader to where it is

    Scenario: The old address of a tournament moved to another sport leads to it
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the page at "/admin/2026/ac/spring-open/edit" is opened
      Then the address is "/admin/2026/gc/spring-open/edit"
