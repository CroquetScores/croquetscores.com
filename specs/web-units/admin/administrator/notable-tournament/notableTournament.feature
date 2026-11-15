@browser @postgres
Feature: The page where an administrator judges a national or an international tournament

  The administrator is emailed when a tournament is added or edited as a
  national or an international event (`CreateTournament.feature`,
  `UpdateTournament.feature`), and the email links to this page, at
  /admin/administrator/notable-tournament?url=2026/ac/spring-open, where the
  tournament is named as it is anywhere else, by its year, its sport and its
  slug. It is one of the administrator's pages (`administrator.feature`), and
  who may open it is not said again here.

  The page is headed Notable tournament, names the tournament, and links to
  it twice: to the tournament as any reader sees it, and to the tournament in
  the admin, where the administrator can read how it is set up before judging
  it.

  Where the administrator judges it neither national nor international, one
  button takes the status away: "Remove national event status" or "Remove
  international event status", whichever the tournament has. It asks first,
  in a modal dialog, since the tournament's managers are emailed
  (`RemoveNotableStatus.feature`) and that cannot be taken back. Yes takes the
  status away; Cancel leaves everything as it was. Once the status is gone the
  page says the tournament is neither, and offers no button, as it does for a
  tournament that never had one.

  The admin draws the page itself, so every scenario here runs scripts, and it
  is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "admin@example.com" has an account, confirmed, with the password "another horse battery staple"
    And "admin@example.com" has been given the role "Administrator"
    And the reader has signed in as "admin@example.com" with the password "another horse battery staple"
    And "organiser@example.com" has an account, confirmed
    And the tournament is to be for the sport "ac"
    And the tournament is to start at "2026-10-03T00:00:00Z"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: The page names the tournament and links to it

    Scenario: The page is headed by its name
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page's heading is "Notable tournament"

    Scenario: The page names the tournament
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the notable tournament page names the tournament "Spring Open"

    Scenario: The page links to the tournament
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page's link to the tournament leads to "/2026/ac/spring-open"

    Scenario: The page links to the tournament in the admin
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page's link to the admin tournament leads to "/admin/2026/ac/spring-open"

  Rule: A national or an international tournament offers to have its status removed

    Scenario: A national tournament offers to remove its national status
      Given the tournament "Spring Open" is national
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page has the button "Remove national event status"

    Scenario: An international tournament offers to remove its international status
      Given the tournament "Spring Open" is international
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page has the button "Remove international event status"

    Scenario: A tournament that is neither says so
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page says the tournament is neither national nor international

    Scenario: A tournament that is neither offers no button
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page has no button "Remove national event status"
      And the page has no button "Remove international event status"

  Rule: Removing the status asks first

    Scenario: The button asks in a modal dialog
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      When the page's button "Remove national event status" is pressed
      Then the modal dialog titled "Remove national event status" is open

    Scenario: The dialog names the tournament
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      When the page's button "Remove national event status" is pressed
      Then the modal dialog names "Spring Open"

    Scenario: The dialog's first button is Yes
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      When the page's button "Remove national event status" is pressed
      Then the modal dialog's first button is "Yes, remove it"

    Scenario: Cancel closes the dialog
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      And the page's button "Remove national event status" is pressed
      When "Cancel" is pressed in the modal dialog
      Then no modal dialog is open

    Scenario: Cancel leaves the status as it was
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      And the page's button "Remove national event status" is pressed
      When "Cancel" is pressed in the modal dialog
      Then the page has the button "Remove national event status"

    Scenario: Yes closes the dialog
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      And the page's button "Remove national event status" is pressed
      When "Yes, remove it" is pressed in the modal dialog
      Then no modal dialog is open

    Scenario: Yes takes the status away
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      And the page's button "Remove national event status" is pressed
      When "Yes, remove it" is pressed in the modal dialog
      Then the page says the tournament is neither national nor international

    Scenario: Yes takes the international status away too
      Given the tournament "Spring Open" is international
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      And the page's button "Remove international event status" is pressed
      When "Yes, remove it" is pressed in the modal dialog
      Then the page says the tournament is neither national nor international

    Scenario: The status stays away when the page is opened again
      Given the tournament "Spring Open" is national
      And the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is open
      And the page's button "Remove national event status" is pressed
      And "Yes, remove it" is pressed in the modal dialog
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/spring-open" is opened
      Then the page says the tournament is neither national nor international

  Rule: A tournament there is not is refused

    Scenario: A tournament nothing is found at is refused
      When the page at "/admin/administrator/notable-tournament?url=2026/ac/not-there" is opened
      Then the page says it is refused with "UpdateTournament.NoSuchTournament"
