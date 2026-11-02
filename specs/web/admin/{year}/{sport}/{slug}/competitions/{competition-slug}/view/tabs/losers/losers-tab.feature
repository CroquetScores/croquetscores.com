@browser @postgres
Feature: The losers tab of a knockout's page

  Many knockouts are run in three parts: the main knockout, a second for those
  who lost in its first round, and a third for those who lost in its second.
  A knockout's page offers its manager a third tab, Losers, after Players and
  Scores, where those knockouts are listed and added (`view.feature`). No
  other kind of competition has one, since only a knockout has losers to play
  on, and a scorer is not offered it, since adding a knockout is the
  manager's.

  Add Losers Knockout opens a dialog over the page. It asks for the round
  whose losers play on, from every round but the final, whose loser has come
  second and has nowhere to go, and for the new knockout's name. Each round is
  offered by how it is spoken of in the competition dialog, with how many
  losers it sends on. Add creates the knockout, with as many places as the
  round has matches, and it is listed on the tab as a link to its page.
  Cancel adds nothing. A knockout of two places has only a final, so offers
  nothing to add and says so.

  The players of a losers knockout are put there as the matches they lost are
  decided, in the order the matches were drawn in (`enterLoser.feature`), so
  its Players tab only shows them: nobody is added, moved, withdrawn or
  removed there, and it says why.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"
    And the knockout is to have a draw of 8 places
    And "organiser@example.com" has added the knockout "Main Event" to "Spring Open"

  Rule: A manager of a knockout is offered Losers, after Scores

    Scenario: A knockout has a Losers tab
      When the page of the competition "Main Event" in "Spring Open" is opened
      Then the tab "Losers" is offered

    Scenario: Losers is the third tab
      When the page of the competition "Main Event" in "Spring Open" is opened
      Then the tab "Losers" is the third tab

    Scenario: A block has no Losers tab
      Given "organiser@example.com" has added the block "Block A" to "Spring Open"
      When the page of the competition "Block A" in "Spring Open" is opened
      Then the tab "Losers" is not offered

    Scenario: A scorer is not offered Losers
      Given "other@example.com" has an account, confirmed, with the password "another horse battery staple"
      And "organiser@example.com" has made "other@example.com" a scorer of "Spring Open"
      And the reader has signed in as "other@example.com" with the password "another horse battery staple"
      When the page of the competition "Main Event" in "Spring Open" is opened
      Then the tab "Losers" is not offered

  Rule: Add Losers Knockout opens a dialog asking for the round and the name

    Scenario: The tab offers Add Losers Knockout
      Given the page of the competition "Main Event" in "Spring Open" is open
      When the tab "Losers" is chosen
      Then the losers tab offers "Add Losers Knockout"

    Scenario: Add Losers Knockout opens the dialog
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      When "Add Losers Knockout" is pressed in the losers tab
      Then the modal dialog titled "Add Losers Knockout" is open

    Scenario Outline: The dialog offers each round but the final
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      When "Add Losers Knockout" is pressed in the losers tab
      Then the losers dialog offers the round "<round>"

      Examples:
        | round               |
        | Quarters (4 losers) |
        | Semis (2 losers)    |

    Scenario: The dialog does not offer the final
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      When "Add Losers Knockout" is pressed in the losers tab
      Then the losers dialog does not offer the round "Final (1 losers)"

    Scenario: The dialog names its buttons
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      When "Add Losers Knockout" is pressed in the losers tab
      Then the modal dialog's first button is "Add"

  Rule: Add creates the knockout, and Cancel does not

    Scenario: A losers knockout added is listed
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      And "Add Losers Knockout" is pressed in the losers tab
      And "Plate" is typed as the "Losers knockout name"
      When "Add" is pressed in the modal dialog
      Then the losers knockout "Plate" is listed

    Scenario: A losers knockout added closes the dialog
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      And "Add Losers Knockout" is pressed in the losers tab
      And "Plate" is typed as the "Losers knockout name"
      When "Add" is pressed in the modal dialog
      Then no modal dialog is open

    Scenario: A losers knockout added is a knockout of the tournament
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      And "Add Losers Knockout" is pressed in the losers tab
      And "Plate" is typed as the "Losers knockout name"
      When "Add" is pressed in the modal dialog
      Then the losers knockout "Plate" is listed
      And the losers knockout "Plate" has a draw of 4 places

    Scenario: A losers knockout added for a later round has fewer places
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      And "Add Losers Knockout" is pressed in the losers tab
      And "Semis (2 losers)" is chosen as the losers dialog's round
      And "Shield" is typed as the "Losers knockout name"
      When "Add" is pressed in the modal dialog
      Then the losers knockout "Shield" is listed
      And the losers knockout "Shield" has a draw of 2 places

    Scenario: A name another competition has is refused
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      And "Add Losers Knockout" is pressed in the losers tab
      And "Main Event" is typed as the "Losers knockout name"
      When "Add" is pressed in the modal dialog
      Then the losers dialog says "Another competition in this tournament already has that name."

    Scenario: Cancel adds nothing
      Given the page of the competition "Main Event" in "Spring Open" is open
      And the tab "Losers" is chosen
      And "Add Losers Knockout" is pressed in the losers tab
      And "Plate" is typed as the "Losers knockout name"
      When "Cancel" is pressed in the modal dialog
      Then the losers tab says there are no losers knockouts

    Scenario: A losers knockout already added is listed when the tab opens
      Given "organiser@example.com" has added the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"
      When the page of the competition "Main Event" in "Spring Open" is opened
      And the tab "Losers" is chosen
      Then the losers knockout "Plate" is listed

  Rule: A knockout with only a final has no losers to play on

    Scenario: The tab says there is no round to take losers from
      Given the knockout is to have a draw of 2 places
      And "organiser@example.com" has added the knockout "Final Only" to "Spring Open"
      And the page of the competition "Final Only" in "Spring Open" is open
      When the tab "Losers" is chosen
      Then the losers tab says there is no round whose losers could play on

    Scenario: It offers no Add Losers Knockout
      Given the knockout is to have a draw of 2 places
      And "organiser@example.com" has added the knockout "Final Only" to "Spring Open"
      And the page of the competition "Final Only" in "Spring Open" is open
      When the tab "Losers" is chosen
      Then the losers tab does not offer "Add Losers Knockout"

  Rule: The Players tab of a losers knockout is read only

    Background:
      Given "organiser@example.com" has added the losers knockout "Plate" to "Spring Open" for the losers of the first round of "Main Event"

    Scenario: The tab says the players are the losers of another knockout
      When the players of "Plate" in "Spring Open" are opened
      Then the players tab says the players are the losers of another knockout

    Scenario: The tab offers no drop-down of players to add
      When the players of "Plate" in "Spring Open" are opened
      Then the players tab offers no way to change the players

    Scenario: A knockout whose players are set by hand does not say so
      When the players of "Main Event" in "Spring Open" are opened
      Then the players tab does not say the players are the losers of another knockout

  Rule: The tab's help icon leads to the section on a losers knockout

    Scenario: Losers leads to the section of the help on a losers knockout
      Given the page of the competition "Main Event" in "Spring Open" is open
      When the tab "Losers" is chosen
      Then the tab row's help icon leads to "/help/tournament-managers/standard-tournament/competitions#losers-knockout"
