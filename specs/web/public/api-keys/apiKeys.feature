@browser @postgres
Feature: A reader who is signed in can make and revoke the keys an app acts for them with

  The API keys page, /account/api-keys, lists the keys a reader has made, and
  asks for a label and whether the app may also write, so that an app can read
  or write for them without being given their password (`CreateApiKey.feature`,
  `RevokeApiKey.feature`). A reader who signed in with Google has no password
  to give an app, and makes keys here as any other does.

  The key is shown once, in the page that answers the form, and never again:
  the site keeps only a hash of it, so a page opened afterwards has nothing to
  show. A reader who did not write it down makes another. A label that breaks a
  rule is said beneath the field, and what was typed is put back.

  Adding a key is a dialog laid over the list, and revoking one asks first in
  another; where there is no scripting to lay them, the button and the trash
  can lead to pages that ask the same. A key revoked is no longer in the list.
  Only a reader who is signed in can come here; one who is not is sent to sign
  in first. The page needs no scripting, and is in the language the reader's
  browser asks for.

  Each scenario has a database and an application of its own. What one
  scenario registers, and whom it signs in, must not be there for the next to
  find.

  Rule: Only a reader signed in can make keys

    Scenario: A reader not signed in is sent to sign in first
      Given a viewport 1200 pixels wide
      When the API keys page is opened
      Then the sign in page is shown

    Scenario: A reader signed in sees the page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened
      Then the API keys page is shown

    Scenario: A reader with no keys is told so
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened
      Then the page says there are no keys

    Scenario: A reader who signed in with Google can make keys
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with no password
      And a reader signed in as "someone@example.com"
      When the API keys page is opened
      Then the API keys page is shown

  Rule: Adding a key is a dialog over the list, and is gone when the key is made

    Scenario: The page offers a button to add a key
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened
      Then the page links to Add Key at "/account/api-keys/new"
      And Add Key is drawn as a button

    Scenario: Add Key has a blank line above and below it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened
      Then Add Key has a blank line above and below it

    Scenario: The page has no dialog on it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened
      Then the page has no dialog
      And no dialog is open

    Scenario: Without scripting the button leads to a page that asks
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the API keys page is open
      When the Add Key link is followed
      Then the dialog asks for a label

    Scenario: With scripting the button lays the dialog over the list
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the API keys page is open
      When Add Key is pressed
      Then the dialog over the list asks for a label
      And the API keys page is shown

    Scenario: Cancel takes the dialog away and leaves the list
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the API keys page is open
      And Add Key is pressed
      When Cancel is pressed in the dialog over the list
      Then no dialog is open

    Scenario: The dialog over the list is gone when the key is made
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the API keys page is open
      And Add Key is pressed
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then no dialog is open
      And the page shows a new key

    Scenario: A label refused is said in the dialog over the list
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the API keys page is open
      And Add Key is pressed
      When the dialog is submitted
      Then the dialog over the list says "Enter a label for the key."

    Scenario: A reader not signed in is sent to sign in from the dialog
      Given a viewport 1200 pixels wide
      When the Add Key page is opened
      Then the sign in page is shown

    Scenario: The dialog is gone when the key is made
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the page has no dialog

  Rule: A key made is shown once

    Scenario: The new key is shown
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the page shows a new key

    Scenario: The new key is not shown when the page is opened again
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      When the API keys page is opened
      Then the page shows no new key

    Scenario: The list shows the key by its label
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the first key on the page is labelled "CroquetUniverse"

    Scenario: A key that was not ticked to write may only read
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the first key on the page may only read

    Scenario: A key that was ticked to write may read and write
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetTournament" is typed
      And the box for writing is ticked
      When the dialog is submitted
      Then the first key on the page may read and write

    Scenario: The key is not in the list
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the list does not carry the new key

    Scenario: A reader whose account is forgotten while the page is open is sent to sign in
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the account for "someone@example.com" has been forgotten
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the sign in page is shown

  Rule: A label that breaks a rule is said beneath the field, and makes no key

    Scenario: A label of nothing is said beneath the field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      When the dialog is submitted
      Then the label field says "Enter a label for the key."

    Scenario: A label that is too long is said beneath the field
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And a label of 61 letters is typed
      When the dialog is submitted
      Then the label field says "A label can be at most 60 characters."

    Scenario: A refused label makes no key
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the dialog is submitted
      When the API keys page is opened
      Then the page says there are no keys

  Rule: A key is asked about before it is revoked, and is gone from the list when it is

    Scenario: Without scripting the trash can leads to a page that asks
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      When the trash can of the first key is pressed
      Then the page asks whether to revoke the key "CroquetUniverse"

    Scenario: A key is not revoked until it is confirmed
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      And the trash can of the first key is pressed
      When Cancel is followed
      Then the page lists 1 key

    Scenario: A key confirmed is gone from the list
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      And the trash can of the first key is pressed
      When the dialog is submitted
      Then the page says there are no keys

    Scenario: A key not revoked has a trash can
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      Then the first key on the page can be revoked

    Scenario: With scripting the trash can lays a question over the list
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      When the trash can of the first key is pressed
      Then the dialog over the list asks whether to revoke the key "CroquetUniverse"
      And the API keys page is shown

    Scenario: Cancel keeps the key
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      And the trash can of the first key is pressed
      When Cancel is pressed in the dialog over the list
      Then no dialog is open
      And the page lists 1 key

    Scenario: A key confirmed in the dialog over the list is gone from the list
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      And the API keys page is opened
      And the trash can of the first key is pressed
      When the revoke is confirmed in the dialog over the list
      Then the page says there are no keys

    Scenario: A key a reader does not have is not asked about
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the page that asks to revoke a key that is not theirs is opened
      Then the API keys page is shown

  Rule: A key is revoked with a trash can before it

    Scenario: A key has a trash can before its label
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the first key on the page has a trash can before its label

    Scenario: The trash can has no words beside it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the trash can of the first key has no words on it

    Scenario: The trash can is named for anyone who cannot see it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the trash can of the first key is named Revoke

  Rule: A key is for all tournaments or limited to one the site has

    A key is limited to a tournament by its year, its sport and its name, which
    has to be the name of a tournament the site has for that year and sport. Any
    tournament will do, and not only the reader's own, since a key limited to
    one does nothing in any other (`WhatAKeyMayDoInTournament.feature`).

    Scenario: A site with no tournament offers no choice
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      Then the dialog offers no choice of tournament

    Scenario: A site with a tournament offers all tournaments
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the Add Key page is opened
      Then the dialog offers the choice "All tournaments"

    Scenario: A site with a tournament offers to limit a key to one
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the Add Key page is opened
      Then the dialog offers the choice "Limit to one tournament"

    Scenario: All tournaments is chosen at first
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the Add Key page is opened
      Then the choice "All tournaments" is the one made

    Scenario Outline: Which one is not asked until limiting to one is chosen
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the Add Key page is opened
      Then the field "<field>" is not shown

      Examples:
        | field          |
        | year           |
        | sport          |
        | tournamentName |

    Scenario Outline: Which one is asked once limiting to one is chosen
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      When the choice "Limit to one tournament" is made
      Then the field "<field>" is shown

      Examples:
        | field          |
        | year           |
        | sport          |
        | tournamentName |

    Scenario: The years of the site's tournaments are offered
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2025-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the Add Key page is opened
      Then the year "2025" is offered

    Scenario: The newest year is chosen at first
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2025-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      When the Add Key page is opened
      Then the year "2026" is the one chosen

    Scenario Outline: Every sport is offered
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the Add Key page is opened
      Then the sport "<sport>" is offered

      Examples:
        | sport               |
        | Association Croquet |
        | Golf Croquet        |
        | American 6 Wicket   |
        | Ricochet            |
        | Gateball            |

    Scenario: The first sport is chosen at first
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      When the Add Key page is opened
      Then the sport "Association Croquet" is the one chosen

    Scenario: A key is not limited unless one tournament is chosen
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the first key on the page is not limited to a tournament

    Scenario: A key limited to a tournament of the site says so
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "Spring Open" is typed as the tournament name
      When the dialog is submitted
      Then the first key on the page is limited to "Only Spring Open (2026)"

    Scenario: A name is read without regard to capitals
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "spring open" is typed as the tournament name
      When the dialog is submitted
      Then the first key on the page is limited to "Only Spring Open (2026)"

    Scenario: A tournament of another year is found by its year
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2025-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2025"
      And the key is limited to the sport "Association Croquet"
      And "Autumn Open" is typed as the tournament name
      When the dialog is submitted
      Then the first key on the page is limited to "Only Autumn Open (2025)"

    Scenario: A tournament of another sport is found by its sport
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Summer Golf"
      And the tournament "Summer Golf" is for the sport "gc"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Golf Croquet"
      And "Summer Golf" is typed as the tournament name
      When the dialog is submitted
      Then the first key on the page is limited to "Only Summer Golf (2026)"

    Scenario: A name the site has no tournament of is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "Winter Open" is typed as the tournament name
      When the dialog is submitted
      Then the tournament name field says "There is no tournament of that name for that year and sport."

    Scenario: A name of a tournament of another sport is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Summer Golf"
      And the tournament "Summer Golf" is for the sport "gc"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "Summer Golf" is typed as the tournament name
      When the dialog is submitted
      Then the tournament name field says "There is no tournament of that name for that year and sport."

    Scenario: A name of a tournament of another year is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2025-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "Autumn Open" is typed as the tournament name
      When the dialog is submitted
      Then the tournament name field says "There is no tournament of that name for that year and sport."

    Scenario: No name is refused
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      When the dialog is submitted
      Then the tournament name field says "There is no tournament of that name for that year and sport."

    Scenario: A refused name makes no key
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "Winter Open" is typed as the tournament name
      And the dialog is submitted
      When the API keys page is opened
      Then the page says there are no keys

  Rule: The name is finished from the site's tournaments for the year and sport

    As the reader types, the site is asked for the names of its tournaments for
    the year and sport chosen that hold what was typed, so the names come from
    the database as they are wanted and not from a list kept in the page. Where
    there is no scripting there is nothing to ask, and the name is only checked
    when the key is made.

    Scenario: With scripting the names of the year and sport chosen are suggested
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      When the choice "Limit to one tournament" is made
      Then the tournament name "Spring Open" is suggested

    Scenario: With scripting the names of another sport are not suggested
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Summer Golf"
      And the tournament "Summer Golf" is for the sport "gc"
      And the Add Key page is open
      And the choice "Limit to one tournament" is made
      When the key is limited to the sport "Golf Croquet"
      Then the tournament name "Summer Golf" is suggested
      And the tournament name "Spring Open" is not suggested

    Scenario: With scripting the names of another year are not suggested
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the tournament is to start at "2025-10-03T00:00:00Z"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And the Add Key page is open
      And the choice "Limit to one tournament" is made
      When the key is limited to the year "2025"
      Then the tournament name "Autumn Open" is suggested
      And the tournament name "Spring Open" is not suggested

    Scenario: With scripting only the names that hold what was typed are suggested
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Summer Open"
      And the Add Key page is open
      And the choice "Limit to one tournament" is made
      When "Spr" is typed as the tournament name
      Then the tournament name "Spring Open" is suggested
      And the tournament name "Summer Open" is not suggested

    Scenario: With scripting a name is finished without regard to capitals
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      And the choice "Limit to one tournament" is made
      When "SPR" is typed as the tournament name
      Then the tournament name "Spring Open" is suggested

    Scenario: With scripting the names of a tournament the reader has no part in are suggested
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the Add Key page is open
      When the choice "Limit to one tournament" is made
      Then the tournament name "Spring Open" is suggested

    Scenario: With scripting the dialog over the list suggests the names too
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the API keys page is open
      And Add Key is pressed
      When the choice "Limit to one tournament" is made
      Then the tournament name "Spring Open" is suggested

    Scenario: With scripting a key limited in the dialog over the list says so
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the API keys page is open
      And Add Key is pressed
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And the key is limited to the year "2026"
      And the key is limited to the sport "Association Croquet"
      And "Spring Open" is typed as the tournament name
      When the dialog is submitted
      Then the first key on the page is limited to "Only Spring Open (2026)"

    Scenario: With scripting a name the site has none of is refused in the dialog over the list
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
      And "organiser@example.com" has created the tournament "Spring Open"
      And the API keys page is open
      And Add Key is pressed
      And the label "CroquetUniverse" is typed
      And the choice "Limit to one tournament" is made
      And "Winter Open" is typed as the tournament name
      When the dialog is submitted
      Then the tournament name is refused in the dialog over the list

  Rule: A new key can be copied

    Scenario: With scripting a button beside the new key copies it
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the copy button is shown beside the new key

    Scenario: The copy button is green
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the copy button is green

    Scenario: Pressing it puts the key on the clipboard
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the browser allows the clipboard
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      When the copy button is pressed
      Then the clipboard holds the new key

    Scenario: Pressing it says the key was copied
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the browser allows the clipboard
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      And the dialog is submitted
      When the copy button is pressed
      Then the copy button says Copied

    Scenario: Without scripting there is no button that does nothing
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the copy button is not shown

  Rule: A key's date is written in the region the browser is set to

    Scenario: Without scripting the date is the year, month and day
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the first key on the page was made on a date written as year, month and day

    Scenario Outline: With scripting the date is written as the browser's region writes it
      Given a viewport 1200 pixels wide
      And scripting is switched on
      And the browser is set to the region "<region>"
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then the first key on the page was made on a date written for "<region>"

      Examples:
        | region |
        | en-US  |
        | de-DE  |
        | en-AU  |

  Rule: A heading has half a blank line beneath it

    Scenario: The page's heading has half a blank line beneath it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened
      Then every heading on the page has half a blank line beneath it

    Scenario: The heading over a new key has half a blank line beneath it
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And the Add Key page is open
      And the label "CroquetUniverse" is typed
      When the dialog is submitted
      Then every heading on the page has half a blank line beneath it

  Rule: The page is where a reader looks for it

    Scenario: The profile links to the page
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the profile page is opened
      Then the profile links to "API Keys" at "/account/api-keys"

  Rule: The page is in the language the browser asks for

    Scenario Outline: The page is written in the language asked for
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      And a browser that asks for "<language>"
      When the API keys page is opened
      Then the page is in "<language>"
      And the heading of the page says "<heading>"

      Examples:
        | language | heading         |
        | de       | API-Schlüssel   |
        | es       | Claves de API   |
        | cs       | Klíče API       |

  Rule: The page needs no scripting

    Scenario: The page does not send a reader without scripting away
      Given a viewport 1200 pixels wide
      And "someone@example.com" has an account, confirmed, with the password "correct horse battery staple"
      And the reader has signed in as "someone@example.com" with the password "correct horse battery staple"
      When the API keys page is opened with scripting off
      Then the API keys page is shown
