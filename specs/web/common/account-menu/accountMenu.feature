@browser
Feature: The way to a reader's account is the last thing in the header

  Every page carries the same way in: the last item in the header navigation is
  a menu, shown as a filled person, which opens on what a reader can do with
  their account. A reader who is not signed in is offered the ways in —
  registering, signing in, and asking for a way back in when they have
  forgotten their password. A reader who is signed in is offered their own
  pages, and the way out. Changing the password and changing the email address
  each ask for the password the account has now, so a reader whose account has
  none, because they have only ever signed in with Google, is offered neither
  (`changePassword.feature`, `changeEmailAddress.feature`).

  The menu opens with no scripting, as every public page works with none: it is
  a summary and the details under it, which a browser opens and closes by
  itself. Its items are not shown until it is opened, so the header stays the
  height LAYOUT.md gives it. Almost every scenario here runs in a browser given
  no scripting at all, which is what makes that a test rather than an
  intention. The exceptions are the ones that open the register page, and they
  say so: that page sends a reader without scripting somewhere else before it
  is drawn, because registering is guarded by reCAPTCHA
  (javaScriptRequired.feature).

  Signing out is a button in a form posted to /account/sign-out, not a link. A
  link can be put in an image on another site and followed by a reader's
  browser without their asking; a post from another site is refused by the
  cross-site guard. It is posted beside the pages the menu links to rather than
  into /api/v1, which is JSON for mobile apps and the admin SPA: a form on a
  public page posting there would be the only one that did. What signing out
  does to the session it ends is specified with sessions.

  Every word in the menu comes from the reader's language's catalogue, as every
  other word the site shows does, and so does the name the person is given for
  a reader who cannot see it: a picture with no name says nothing to a screen
  reader, and nothing to anybody whose images did not load. The pages it points
  at are not all built: until each is, following its item answers 404, which is
  the honest state of a menu written before its pages.

  Rule: The menu is the last thing in the header navigation

    Scenario: The header's last item is the account menu
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the last item in the header navigation is the account menu

    Scenario Outline: The navigation beside it offers nothing of an account's
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the primary navigation does not offer "<item>"

      Examples:
        | item            |
        | Register        |
        | Sign In         |
        | Forgot Password |

    Scenario: The account menu shows a person
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the account menu shows a person

  Rule: The menu opens and closes without scripting

    Scenario: The menu is closed when a page is opened
      Given a viewport 1200 pixels wide
      When the home page is opened
      Then the account menu is closed

    Scenario: The menu opens when it is pressed
      Given a viewport 1200 pixels wide
      And the home page is open
      When the account menu is pressed
      Then the account menu is open

    Scenario: The menu closes when it is pressed again
      Given a viewport 1200 pixels wide
      And the home page is open
      And the account menu is pressed
      When the account menu is pressed
      Then the account menu is closed

  Rule: A reader who is not signed in is offered the ways in

    Scenario Outline: The menu offers each way in
      Given a viewport 1200 pixels wide
      And nobody is signed in
      And the home page is open
      When the account menu is pressed
      Then the menu offers "<item>" at "<path>"

      Examples:
        | item            | path                     |
        | Register        | /account/register        |
        | Sign In         | /account/sign-in         |
        | Forgot Password | /account/forgot-password |

    Scenario Outline: The menu offers nothing that belongs to an account
      Given a viewport 1200 pixels wide
      And nobody is signed in
      And the home page is open
      When the account menu is pressed
      Then the menu does not offer "<item>"

      Examples:
        | item                 |
        | Sign Out             |
        | Profile              |
        | Change Password      |
        | Change Email Address |
        | Change Name          |

  Rule: A reader who is signed in is offered their own pages

    Scenario Outline: The menu offers each of the account's pages
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the menu offers "<item>" at "<path>"

      Examples:
        | item                 | path                          |
        | Profile              | /account/profile              |
        | Change Password      | /account/change-password      |
        | Change Email Address | /account/change-email-address |
        | Change Name          | /account/change-name          |

    Scenario Outline: The menu offers an account with no password nothing that asks for one
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed, with no password
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the menu does not offer "<item>"

      Examples:
        | item                 |
        | Change Password      |
        | Change Email Address |

    Scenario Outline: The menu offers no way in to a reader who is in
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the menu does not offer "<item>"

      Examples:
        | item            |
        | Register        |
        | Sign In         |
        | Forgot Password |

    Scenario: A browser with scripting on is offered the same
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the register page is open with scripting on
      When the account menu is pressed
      Then the menu offers "Profile" at "/account/profile"

  Rule: Signing out is a button that posts, not a link

    Scenario: The menu offers signing out
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the menu offers a button to sign out

    Scenario: Signing out is not a link
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the menu offers no link to sign out

    Scenario: The button's form asks to post
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the form the button is in asks to post

    Scenario: The button's form posts to the sign out path
      Given a viewport 1200 pixels wide
      And an account for "someone@example.com", confirmed
      And a reader signed in as "someone@example.com"
      And the home page is open
      When the account menu is pressed
      Then the form the button is in posts to "/account/sign-out"

  Rule: The menu says which of its pages the reader is on

    A reader can tell where they are from the bar at the top of the page, and
    the pages an account has are in this menu rather than in the navigation
    beside it, so the menu is what has to say it. It says it the way the section
    bar does, with aria-current, which a screen reader announces and the
    stylesheet shades. Signing out is not marked: it is not a page to be on.

    The register page is the one page in the menu that is built, so it is the
    one these scenarios read. It needs scripting, so they are given it.

    Scenario: The item for the page being read is marked as the current page
      Given a viewport 1200 pixels wide
      And nobody is signed in
      And the register page is open with scripting on
      When the account menu is pressed
      Then the menu marks "Register" as the page being read

    Scenario: The items for the other pages are not marked
      Given a viewport 1200 pixels wide
      And nobody is signed in
      And the register page is open with scripting on
      When the account menu is pressed
      Then the menu does not mark "Sign In" as the page being read

    Scenario: Nothing is marked on a page the menu does not offer
      Given a viewport 1200 pixels wide
      And nobody is signed in
      And the home page is open
      When the account menu is pressed
      Then the menu marks nothing as the page being read

  Rule: The menu is in the reader's language

    Scenario: Every word in the menu is in the test locale
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      And nobody is signed in
      And the home page is open
      When the account menu is pressed
      Then every word in the account menu is in the test locale

    Scenario: The menu says in words what the person stands for
      Given a viewport 1200 pixels wide
      And a browser that asks for "en-XA"
      When the home page is opened
      Then the account menu is named in the test locale for a reader who cannot see it
