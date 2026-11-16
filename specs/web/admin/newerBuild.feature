@browser @postgres
Feature: The admin offers to reload when the site has been deployed again

  The admin is one page that draws whichever screen its address names
  (`App.feature`), so moving between its pages happens in place and the page
  is not loaded again. A tab left open across a deploy therefore goes on
  running the build it loaded, talking to an API that is a newer one, and can
  draw the wrong screens until it is reloaded: a team tournament was once
  shown a Standard one's tabs.

  Every answer the API gives names the build the site is serving, and the
  admin knows the build it loaded. When the two differ, the admin says that a
  newer version is available and offers to reload. It only offers: a reload
  would lose what the reader has typed into a dialog, and they know whether
  that matters better than the admin does. It says so once, on the next thing
  the admin asks of the API after the deploy, which is when it learns of it.

  The build is named by what the admin was built to, so that it changes
  whenever the admin does and not when only the server does.

  Background:
    Given a viewport 1200 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"

  Rule: A reader on the build the site is serving is not told anything

    Scenario: No offer is made while the build is the one that was loaded
      Given the page of "Spring Open" is open
      When the section "Block A" is pressed
      Then the page comes to be headed "Block A"
      And the page does not offer to reload

  Rule: A reader on an older build is offered a reload

    Scenario: An offer is made once the site has been deployed again
      Given the page of "Spring Open" is open
      And the site is deployed again
      When the section "Block A" is pressed
      Then the page comes to be headed "Block A"
      And the page offers to reload

    Scenario: The offer is in the reader's language
      Given the page of "Spring Open" is open
      And the site is deployed again
      When the section "Block A" is pressed
      Then the offer to reload says the words for "admin.newerBuild.message"

    Scenario: The page is not loaded again until the reader accepts
      Given the page of "Spring Open" is open
      And something is left on the page
      And the site is deployed again
      When the section "Block A" is pressed
      Then the page offers to reload
      And what was left on the page is still there

    Scenario: Accepting the offer loads the page again
      Given the page of "Spring Open" is open
      And something is left on the page
      And the site is deployed again
      And the section "Block A" is pressed
      When the offer to reload is accepted
      Then what was left on the page is gone
      And the page does not offer to reload
