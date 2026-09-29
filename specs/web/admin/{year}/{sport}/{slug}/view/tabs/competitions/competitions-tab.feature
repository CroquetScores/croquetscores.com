@browser @postgres
Feature: The competitions tab of a tournament's page

  The Competitions tab is where a manager sees a tournament's competitions,
  puts them in order, archives the ones they no longer want and restores the
  ones they do (`view.feature`). It lists them as the tournament orders them
  (`CompetitionsOfTournament.feature`).

  The competitions in use come first, in the tournament's order. Each says its
  name and its kind — a block, a knockout or a Swiss — and offers View, Up,
  Down and Archive. The archived ones come after them, under a heading of
  their own, since they are out of the way rather than gone. Each says its
  name and its kind, and offers Restore alone: an archived competition can
  only be restored (`archiveCompetition.feature`).

  A competition's name and View both lead to its own page, beneath the
  tournament's, at /admin/{year}/{sport}/{slug}/competitions/{competition slug}.
  That page is not written yet, and shows the admin's empty shell until a
  feature says what it is, as New Tournament's did before the form it leads
  to.

  Up and Down are shown as arrows pointing up and down, and are named "Up" and
  "Down" for a reader who cannot see them. They come last of what a row offers,
  so that they are in the same place on every row.

  Up and Down move a competition one place among those in use, putting it just
  before the one above it or just after the one below
  (`moveCompetition.feature`). The first is not offered Up and the last is not
  offered Down, since there is nowhere for it to go, so a single competition
  is offered neither. Archive moves a competition to the archived ones, last,
  and Restore puts it back among those in use, after those that stayed there
  (`archiveCompetition.feature`, `restoreCompetition.feature`). None of the
  three asks first: each is undone by pressing the other way, and a question
  before something that can be put back is a question the reader learns to
  press through. Whatever is pressed, the list is asked for again, so that it
  says what the competitions are now rather than what was pressed.

  A scorer sees the tab too, as the one tab they are offered (`view.feature`),
  to find the competition whose scores they are entering. They are shown the
  competitions in use alone, in the tournament's order, each with its name,
  its kind and View, and nothing else: putting competitions in order,
  archiving and restoring them are the managers' to do, and an archived
  competition has no scores to enter (`CompetitionsOfTournament.feature`). So
  a scorer's tab has no archived competitions and no heading for them.

  Every competition in use is offered Archive, whether or not it has games,
  which are kept with it and come back when it is restored
  (`archiveCompetition.feature`).

  A competition is added in the competition dialog, from Add Competition
  above the list, where a long list does not push it off a phone's screen
  (`competition.feature`). Whenever the dialog adds one, the list is asked for
  again, so that it says what the competitions are now. Changing a
  competition is to be done in the same dialog, from Edit on each competition
  in use, and is not offered until the dialog does it, since a button that did
  nothing would be worse than none. Adding is the managers' to do, as putting
  in order and archiving are, so a scorer is not offered Add Competition.

  The tab has no address of its own (`view.feature`), so a scenario opens the
  tournament's page and chooses the tab, which is what opening the
  competitions of a tournament does.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: The competitions in use are listed in the tournament's order

    Scenario: A competition is listed
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is listed

    Scenario: The competitions are in the tournament's order
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      When the competitions of "Spring Open" are opened
      Then the first competition listed is "Block B"

    Scenario Outline: A competition says its kind
      Given "organiser@example.com" has added the <kind> "Final Stage" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Final Stage" is said to be a "<said>"

      Examples:
        | kind     | said     |
        | block    | Block    |
        | knockout | Knockout |
        | Swiss    | Swiss    |

    Scenario: A tournament with no competitions says so
      When the competitions of "Spring Open" are opened
      Then the tab says there are no competitions

  Rule: Add Competition opens the competition dialog

    Scenario: The tab offers Add Competition
      When the competitions of "Spring Open" are opened
      Then the tab offers "Add Competition"

    Scenario: Add Competition is above the competitions
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then "Add Competition" is above the competitions

    Scenario: Add Competition opens the dialog to add a competition
      Given the competitions of "Spring Open" are open
      When "Add Competition" is pressed
      Then the competition dialog is titled "Add Competition"

    Scenario: A competition added in the dialog is listed
      Given the competitions of "Spring Open" are open
      And "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then the competition "Block A" is listed

    Scenario: A competition added in the dialog no longer leaves the tab saying there are none
      Given the competitions of "Spring Open" are open
      And "Add Competition" is pressed
      And "Block A" is typed as the "Name"
      When "Add" is pressed
      Then the tab does not say there are no competitions

    Scenario: A competition added in the dialog is listed last
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Add Competition" is pressed
      And "Block B" is typed as the "Name"
      When "Add" is pressed
      Then the competition "Block B" is listed after "Block A"

  Rule: The archived competitions are listed after those in use

    Scenario: An archived competition is listed among the archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is listed among the archived

    Scenario: An archived competition is not listed among those in use
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is not listed among those in use

    Scenario: The archived competitions come after those in use
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is listed after "Block B"

    Scenario: The archived competitions are under a heading of their own
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the archived competitions are headed "Archived competitions"

    Scenario: No heading for the archived is shown where none is archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then no heading for the archived competitions is shown

    Scenario: An archived competition says its kind
      Given "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      And "organiser@example.com" has archived the competition "Final Stage" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Final Stage" is said to be a "Knockout"

  Rule: What a competition offers is what it can have done to it

    Scenario Outline: A competition in use offers what can be done to it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has added the block "Block C" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block B" offers "<option>"

      Examples:
        | option  |
        | View    |
        | Up      |
        | Down    |
        | Archive |

    Scenario: A competition in use does not offer to restore it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" does not offer "Restore"

    Scenario: The first competition does not offer Up
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" does not offer "Up"

    Scenario: The last competition does not offer Down
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block B" does not offer "Down"

    Scenario: The last in use does not offer Down though an archived one comes after it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" does not offer "Down"

    Scenario: An archived competition offers to restore it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" offers "Restore"

    Scenario Outline: An archived competition offers nothing else
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has added the block "Block C" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block B" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the competition "Block B" does not offer "<option>"

      Examples:
        | option  |
        | View    |
        | Up      |
        | Down    |
        | Archive |

  Rule: A competition's name and View lead to its page

    Scenario: The name of a competition leads to its page
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the name of the competition "Block A" leads to "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: View leads to the competition's page
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then "View" on the competition "Block A" leads to "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: The name of an archived competition leads to its page
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the name of the competition "Block A" leads to "/admin/2026/ac/spring-open/competitions/block-a"

  Rule: Up and Down move a competition a place

    Scenario: Up moves a competition before the one above it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Up" is pressed on the competition "Block B"
      Then the first competition listed is "Block B"

    Scenario: Down moves a competition after the one below it
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Down" is pressed on the competition "Block A"
      Then the first competition listed is "Block B"

    Scenario: A competition moved is kept in its new place
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Up" is pressed on the competition "Block B"
      When the competitions of "Spring Open" are opened
      Then the first competition listed is "Block B"

    Scenario: A competition moved to the top no longer offers Up
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Up" is pressed on the competition "Block B"
      Then the competition "Block B" does not offer "Up"

  Rule: Archive and Restore move a competition between those in use and the archived

    Scenario: Archiving a competition lists it among the archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      When "Archive" is pressed on the competition "Block A"
      Then the competition "Block A" is listed among the archived

    Scenario: A competition archived from the tab is kept archived
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the competitions of "Spring Open" are open
      And "Archive" is pressed on the competition "Block A"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is listed among the archived

    Scenario: Restoring a competition lists it among those in use
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the competitions of "Spring Open" are open
      When "Restore" is pressed on the competition "Block A"
      Then the competition "Block A" is not listed among the archived

    Scenario: A restored competition comes after those that stayed in use
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the competitions of "Spring Open" are open
      When "Restore" is pressed on the competition "Block A"
      Then the competition "Block A" is listed after "Block B"

    Scenario: A competition restored from the tab is kept restored
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the competitions of "Spring Open" are open
      And "Restore" is pressed on the competition "Block A"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is not listed among the archived

  Rule: A scorer sees the competitions in use, and can only view them

    Scenario: A scorer is shown a competition in use
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is listed

    Scenario: A scorer is shown the competitions in the tournament's order
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has moved the competition "Block B" in "Spring Open" up
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the first competition listed is "Block B"

    Scenario: A scorer is not shown an archived competition
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" is not listed

    Scenario: A scorer is shown no heading for the archived
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then no heading for the archived competitions is shown

    Scenario: A scorer with every competition archived is told there are none
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Block A" in "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the tab says there are no competitions

    Scenario: A scorer is offered View
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the competition "Block A" offers "View"

    Scenario Outline: A scorer is offered nothing a manager does to a competition
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has added the block "Block C" to "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the competition "Block B" does not offer "<option>"

      Examples:
        | option  |
        | Up      |
        | Down    |
        | Archive |

    Scenario: A scorer is not offered Add Competition
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the tab does not offer "Add Competition"

    Scenario: The name of a competition leads a scorer to its page
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then the name of the competition "Block A" leads to "/admin/2026/ac/spring-open/competitions/block-a"

  Rule: Every word the tab says is in the reader's language

    The test locale shows it (`language.feature`). A competition's name is what
    its manager called it, and is nobody's language.

    Scenario: The competitions in use are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then every word in the tab but the competitions' names is in the test locale

    Scenario: The archived competitions are in the reader's language
      Given a browser that asks for "en-XA"
      And "organiser@example.com" has added the Swiss "Swiss A" to "Spring Open"
      And "organiser@example.com" has archived the competition "Swiss A" in "Spring Open"
      When the competitions of "Spring Open" are opened
      Then every word in the tab but the competitions' names is in the test locale

    Scenario: A scorer's tab is in the reader's language
      Given a browser that asks for "en-XA"
      And "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And "organiser@example.com" has added the block "Block A" to "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the competitions of "Spring Open" are opened
      Then every word in the tab but the competitions' names is in the test locale

    Scenario: A tournament with no competitions says so in the reader's language
      Given a browser that asks for "en-XA"
      When the competitions of "Spring Open" are opened
      Then every word in the tab but the competitions' names is in the test locale

  Rule: The tab is laid out for a phone first

    Scenario Outline: What a competition offers can be pressed with a thumb
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      And "organiser@example.com" has added the block "Block B" to "Spring Open"
      And "organiser@example.com" has added the block "Block C" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then "<option>" on the competition "Block B" is at least 44 pixels tall

      Examples:
        | option  |
        | View    |
        | Up      |
        | Down    |
        | Archive |

    Scenario: Add Competition can be pressed with a thumb
      When the competitions of "Spring Open" are opened
      Then the button "Add Competition" is at least 44 pixels tall

    Scenario: The name of a competition can be pressed with a thumb
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the name of the competition "Block A" is at least 44 pixels tall

    Scenario: A long name wraps rather than widening the page
      Given "organiser@example.com" has added the block "The Very Long Named Invitational Block Of The Season" to "Spring Open"
      When the competitions of "Spring Open" are opened
      Then the page is no wider than the window
