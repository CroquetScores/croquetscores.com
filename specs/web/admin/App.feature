@browser @postgres
Feature: Moving between the admin's pages

  The admin is one page that draws whichever screen its address names
  (`admin.feature`). Choosing a year changed the address in place, but every
  other link in the admin was a plain one, so following it had the browser
  load the page again: the header and footer said again by the server, the
  admin started again, and what the page it left had already asked for asked
  for again. Going from a tournament to one of its competitions flashed white
  and redrew the section bar the reader had just pressed.

  Now a link from one of the admin's pages to another changes the address in
  place and draws the page it names, as choosing a year does, wherever the
  link is: in the section bar, in a tab, in the list of tournaments, or in
  the header. The address is still the page's own, so it can still be linked
  to, reloaded, and gone back to. What the admin does for itself once a
  tournament is created or has moved is done the same way.

  A link out of the admin, to a public page, loads that page as before: the
  admin draws only its own pages. And a link opened in a new tab is left to
  the browser, so that a reader who wants two pages side by side still gets
  them.

  The header and footer are the server's, said into the page when it was
  first sent. The footer's choice of theme brings the reader back to where
  they made it, so where that is has to follow the reader as they move.

  Whether the page was loaded again is told by something left on it before
  the link is followed: a page loaded afresh has nothing left on it.

  Background:
    Given a viewport 1200 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has added the knockout "Final Stage" to "Spring Open"

  Rule: A link between the admin's pages draws the page without loading it again

    Scenario: The section bar opens a competition in place
      Given the page of "Spring Open" is open
      And something is left on the page
      When the section "Block A" is pressed
      Then the page comes to be headed "Block A"
      And what was left on the page is still there

    Scenario: The section bar goes back to the tournament in place
      Given the page of the competition "Block A" in "Spring Open" is open
      And something is left on the page
      When the section "Tournament" is pressed
      Then the page comes to be headed "Spring Open"
      And what was left on the page is still there

    Scenario: The section bar opens another competition in place
      Given the page of the competition "Block A" in "Spring Open" is open
      And something is left on the page
      When the section "Final Stage" is pressed
      Then the page comes to be headed "Final Stage"
      And what was left on the page is still there

    Scenario: The Competitions tab opens a competition in place
      Given the page of "Spring Open" is open
      And the tab "Competitions" is chosen
      And something is left on the page
      When the name of the competition "Block A" is pressed
      Then the page comes to be headed "Block A"
      And what was left on the page is still there

    Scenario: The list of tournaments opens a tournament in place
      Given the admin for 2026 is open
      And something is left on the page
      When the name "Spring Open" is pressed
      Then the page comes to be headed "Spring Open"
      And what was left on the page is still there

    Scenario: The list's New Tournament opens the form in place
      Given the admin for 2026 is open
      And something is left on the page
      When "New Tournament" is pressed
      Then the address is "/admin/tournaments/new"
      And what was left on the page is still there

    Scenario: The header's Admin goes back to the list in place
      Given the page of "Spring Open" is open
      And something is left on the page
      When the link "Admin" in the header is pressed
      Then the address is "/admin/"
      And what was left on the page is still there

  Rule: The address follows the reader, and the browser's back button with it

    Scenario: A page opened in place puts its address in the browser
      Given the page of "Spring Open" is open
      When the section "Block A" is pressed
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"

    Scenario: Going back returns to the page before
      Given the page of "Spring Open" is open
      And the section "Block A" is pressed
      And the page comes to be headed "Block A"
      When the browser goes back
      Then the page comes to be headed "Spring Open"

    Scenario: Going back does not load the page again
      Given the page of "Spring Open" is open
      And something is left on the page
      And the section "Block A" is pressed
      And the page comes to be headed "Block A"
      When the browser goes back
      Then the page comes to be headed "Spring Open"
      And what was left on the page is still there

  Rule: The admin moves itself in place

    Scenario: Creating a tournament opens it in place
      Given the new tournament page is open
      And something is left on the page
      And "Autumn Open" is typed as the "Name"
      And "2026-10-10" is typed as the "Starts"
      And "2026-10-12" is typed as the "Finishes"
      And the country "Australia" is chosen
      And the region "Victoria" is chosen
      When "Create Tournament" is pressed
      Then the page comes to be headed "Autumn Open"
      And what was left on the page is still there

  Rule: A link out of the admin, or into a new tab, is the browser's to follow

    Whether a tab then opens is the browser's own doing, and a browser with no
    window to show it in does not do it every time it is asked. So what is
    said of a press for a new tab is what the admin does with it: it leaves the
    press to the browser, and the link pressed leads to the page the tab would
    open.

    Scenario: A public page is loaded
      Given the page of "Spring Open" is open
      And something is left on the page
      When the link "Home" in the header is pressed
      Then the address is "/"
      And what was left on the page is gone

    Scenario: A competition opened in a new tab leaves the page where it was
      Given the page of "Spring Open" is open
      When the section "Block A" is pressed to open it in a new tab
      Then the page is headed "Spring Open"

    Scenario: A competition asked for in a new tab is left to the browser
      Given the page of "Spring Open" is open
      When the section "Block A" is pressed to open it in a new tab
      Then the press is left to the browser
      And the section "Block A" leads to "/admin/2026/ac/spring-open/competitions/block-a"

  Rule: The footer's choice of theme brings the reader back to where they have moved to

    Scenario: Choosing a theme after moving returns to the page moved to
      Given the page of "Spring Open" is open
      And the section "Block A" is pressed
      And the page comes to be headed "Block A"
      When the theme "Dark" is chosen
      Then the address is "/admin/2026/ac/spring-open/competitions/block-a"
