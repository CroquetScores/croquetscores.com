@browser @postgres
Feature: A list is sorted the way its reader last sorted it

  A reader who sorts a list is likely to want it sorted that way the next time
  they see it, and should not have to press the heading again on every visit.
  So when a reader sorts a list, the device remembers how, and the list is
  sorted that way when its page is next opened with nothing in its address
  saying otherwise.

  Each list is remembered apart, by the page it is on and the list it is, since
  a reader sorting the upcoming tournaments has said nothing about the recent
  results, nor about a player's tournaments. One size does not fit all.

  What is remembered is kept in a cookie, and so comes back with the next
  request and needs no scripting, as the language and the theme do. The page
  is sorted when it is sent, so a reader is never shown the order the page
  began in and then watches it change. Nothing is kept about who the reader is:
  the same device remembers the same way whether or not anyone is signed in.

  An address that says how to sort a list overrules what is remembered, since a
  link that was sent or kept means the order it says. Pressing a heading
  remembers the order it gives. A list can be put back in the order its page
  begins with, which forgets what was remembered for it.

  Where a scenario says nothing else, the list is the upcoming tournaments on
  the home page (`home.feature`). Every sortable list is remembered the same
  way, and the scenarios of a Rule about one list name a second only to show
  that the two are kept apart.

  Background:
    Given a viewport 1200 pixels wide
    And a site served as "croquetscores.com"
    And the server's clock reads "2026-10-02T10:00:00Z"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Autumn Open"
    And the tournament "Autumn Open" starts on "2026-11-07"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-10"

  Rule: A list is sorted the way it was last sorted on this device

    Scenario: A list sorted by name is sorted by name when next opened
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: The first row is the one the sorting puts first
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened
      Then the first of the upcoming tournaments is "Autumn Open"

    Scenario: The second row is the one the sorting puts second
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened
      Then the second of the upcoming tournaments is "Spring Open"

    Scenario: A list turned round is turned round when next opened
      Given the home page is open
      And the column "Date" of the upcoming tournaments is pressed
      When the home page is opened
      Then the column "Date" of the upcoming tournaments is marked as sorted from the largest

    Scenario: The latest sorting is the one remembered
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      And the column "Date" of the upcoming tournaments is pressed
      When the home page is opened
      Then the column "Date" of the upcoming tournaments is marked as sorted from the largest

    Scenario: A list never sorted begins as its page does
      When the home page is opened
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: The page is sorted when it is sent
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened with scripting off
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

  Rule: Each list is remembered apart

    Scenario: Sorting one list does not sort another on the same page
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened
      Then no column of the recent results is marked as sorted

    Scenario: Sorting a list on one page does not sort the same list on another
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the page for the year 2026 is opened
      Then the column "Date" of the year's tournaments is marked as sorted from the smallest

    Scenario: A player's tournaments are remembered apart from the tournament lists
      Given "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
      And the page at "/players/sam-someone" is open
      And the heading "Tournament" is pressed
      When the home page is opened
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

  Rule: An address that says how to sort overrules what is remembered

    The address is what a link to the page means, and what the reader chose
    when they pressed a heading. Overruling does not forget: a reader who
    follows a link and then opens the page without it is back to the order
    they last chose themselves. Nothing in the address sorts the list however
    it was last sorted, so a reader cannot be locked into an order by a link
    they did not choose.

    Scenario: A sorting in the address is the one shown
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened sorted by date
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: A sorting in the address is not remembered by being followed
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      And the home page is opened sorted by date
      When the home page is opened
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: A sorting the page does not have is taken as no sorting
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened sorted by a column it does not have
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

  Rule: A list can be put back as its page begins it

    Scenario: The way back is offered once a list has been sorted
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the home page is opened
      Then the upcoming tournaments offer the way back to their usual order

    Scenario: The way back is not offered for a list not sorted
      When the home page is opened
      Then the upcoming tournaments offer no way back to their usual order

    Scenario: Going back puts the list as its page begins it
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When the way back to the usual order of the upcoming tournaments is pressed
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: Going back is forgotten for good
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      And the way back to the usual order of the upcoming tournaments is pressed
      When the home page is opened
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: Going back leaves the other lists as they were sorted
      Given the home page is open
      And the column "Name" of the recent results is pressed
      And the column "Name" of the upcoming tournaments is pressed
      When the way back to the usual order of the upcoming tournaments is pressed
      Then the column "Name" of the recent results is marked as sorted from the smallest

  Rule: What is remembered stays on the device

    Scenario: Another device is sorted as its own reader sorted it
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      When another browser opens the home page
      Then the column "Date" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: Signing out does not forget how a list was sorted
      Given the home page is open
      And the column "Name" of the upcoming tournaments is pressed
      And the reader signs out
      When the home page is opened
      Then the column "Name" of the upcoming tournaments is marked as sorted from the smallest

    Scenario: What is remembered does not name the reader
      Given "organiser@example.com" is signed in
      And the column "Name" of the upcoming tournaments is pressed
      Then the cookie that remembers the sorting does not name "organiser@example.com"
