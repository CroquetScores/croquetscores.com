@browser @postgres
Feature: Finding your way around the public site

  The public pages are required to work with JavaScript switched off, so the
  navigation has to as well. Every scenario here runs in a browser that has
  been given no scripting at all, which is what makes the claim a test rather
  than an intention.

  The primary navigation holds the way home and the way to help, and for a
  reader who is signed in, the way to the admin, which shows nothing to
  anybody else (`tournaments.feature`): offering it to a reader who is not
  signed in would only send them to sign in. Everything to do with an account
  is in the account menu beside it, whoever is reading (`accountMenu.feature`).
  So the scenarios about how the navigation is shown watch "Help", which every
  reader is offered, rather than anything of an account's.

  The secondary navigation is not here. The home page's is the years there are
  tournaments in, which are fitted to the window rather than wrapped, since
  they grow by one every season, and are specified with it (`home.feature`).

  Rule: The primary navigation suits the width it is shown at

    Scenario: On a wide screen the links are in the open
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Help" is visible
      And the menu button is not visible

    Scenario: On a narrow screen the links are behind a button
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the menu button is visible
      And the link "Help" is not visible

  Rule: The navigation offers what the reader can use

    Scenario: A reader not signed in is offered the way home first
      Given a viewport 1200 pixels wide
      And nobody is signed in
      When the home page is opened
      Then the first link in the navigation is "Home"

    Scenario: A reader not signed in is offered help second
      Given a viewport 1200 pixels wide
      And nobody is signed in
      When the home page is opened
      Then the second link in the navigation is "Help"

    Scenario: A reader not signed in is offered nothing else
      Given a viewport 1200 pixels wide
      And nobody is signed in
      When the home page is opened
      Then the navigation holds 2 links

    Scenario: A reader signed in is offered the way home first
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the home page is opened
      Then the first link in the navigation is "Home"

    Scenario: A reader signed in is offered help second
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the home page is opened
      Then the second link in the navigation is "Help"

    Scenario: A reader signed in is offered the admin third
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the home page is opened
      Then the third link in the navigation is "Admin"

    Scenario: A reader signed in is offered nothing else
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the home page is opened
      Then the navigation holds 3 links

    Scenario Outline: Each link leads where it says
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the home page is opened
      Then the link "<link>" leads to "<address>"

      Examples:
        | link  | address |
        | Home  | /       |
        | Help  | /help   |
        | Admin | /admin/ |

    Scenario: The account menu still ends the header for a reader not signed in
      Given a viewport 1200 pixels wide
      And nobody is signed in
      When the home page is opened
      Then the last item in the header navigation is the account menu

    Scenario: The account menu still ends the header for a reader signed in
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      When the home page is opened
      Then the last item in the header navigation is the account menu

    Scenario: The links are in the reader's language
      Given a viewport 1200 pixels wide
      And a reader signed in as "someone@example.com"
      And a browser that asks for "en-XA"
      When the home page is opened
      Then every word in the navigation is in the test locale

  Rule: The page being read is marked as the current section is

    The navigation marks the page being read the way the section bar marks the
    section being read: a tile of its own, black in light and pale in dark,
    with no line under the words. An underline read as a link like any other
    rather than as where the reader is, and one mark for being here, wherever
    it is on the page, is one thing to learn rather than two (`LAYOUT.md`).

    Scenario: The page being read is marked
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Home" is marked as the page being read

    Scenario: A page not being read is not marked
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Help" is not marked as the page being read

    Scenario: The page being read is on black in light
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the home page is opened
      Then the link "Home" is on black

    Scenario: The page being read is on the current section's colour in dark
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the home page is opened
      Then the link "Home" is on the colour the current section is on

    Scenario: The page being read is not underlined
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the link "Home" is not underlined

    Scenario: The page being read is on black in the menu on a phone
      Given a viewport 375 pixels wide
      And a machine that prefers light
      And the home page is open
      When the menu button is pressed
      Then the link "Home" is on black

  Rule: The menu needs no scripting

    Scenario: Pressing the button reveals the links
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the link "Help" is visible

    Scenario: The links can be pressed by a thumb
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the link "Help" is at least 44 pixels tall

  Rule: Where the navigation is behind a button, so is the account

    The account menu is a person beside the navigation when the navigation is
    in the open, and there is room for both. On a narrow screen the header
    has room for the site's name and one button, so the person goes and the
    account is the last group in what the button opens, headed "Account", with
    the same pages in it that the person would have opened on, in the same
    order (`accountMenu.feature`). It is drawn by the same code for both, so a
    page added to one is in the other.

    Scenario: On a narrow screen the person is not in the header
      Given a viewport 375 pixels wide
      When the home page is opened
      Then the account menu is not visible

    Scenario: On a wide screen the person is in the header
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the account menu is visible

    Scenario: On a wide screen the account is not among the links
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the account group is not visible

    Scenario: Pressing the button reveals the account group
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the account group is visible

    Scenario: The account group is headed "Account"
      Given a viewport 375 pixels wide
      And the home page is open
      When the menu button is pressed
      Then the account group is headed "Account"

    Scenario Outline: A reader not signed in is offered each way in
      Given a viewport 375 pixels wide
      And nobody is signed in
      And the home page is open
      When the menu button is pressed
      Then the account group offers "<item>" at "<path>"

      Examples:
        | item            | path                     |
        | Register        | /account/register        |
        | Sign In         | /account/sign-in         |
        | Forgot Password | /account/forgot-password |

    # Changing the password and the email address are not here: a reader signed
    # in against the database has signed in with Google and has no password, so
    # is not offered them. The menu beside the navigation is held to them with
    # no database (`accountMenu.feature`), and both are drawn by one function.
    Scenario Outline: A reader signed in is offered each of the account's pages
      Given a viewport 375 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the menu button is pressed
      Then the account group offers "<item>" at "<path>"

      Examples:
        | item        | path                 |
        | Profile     | /account/profile     |
        | Change Name | /account/change-name |

    Scenario: A reader signed in is offered a button to sign out
      Given a viewport 375 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the menu button is pressed
      Then the account group offers a button to sign out

    Scenario: The button's form posts to the sign out path
      Given a viewport 375 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the menu button is pressed
      Then the account group's form posts to "/account/sign-out"

    Scenario: A reader with no password is offered setting one
      Given a viewport 375 pixels wide
      And an account for "someone@example.com", confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the menu button is pressed
      Then the account group offers "Set Password" at "/account/set-password"

    Scenario: A reader with no password is not offered changing it
      Given a viewport 375 pixels wide
      And an account for "someone@example.com", confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the menu button is pressed
      Then the account group does not offer "Change Password"

    Scenario: The account's links can be pressed by a thumb
      Given a viewport 375 pixels wide
      And nobody is signed in
      And the home page is open
      When the menu button is pressed
      Then the account group's "Sign In" is at least 44 pixels tall
