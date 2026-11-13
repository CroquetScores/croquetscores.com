Feature: The page for asking to take over the site

  Somebody who has come to take over the site, because Tim cannot run it, asks
  the two people who hold its passwords from a page in the admin. It is the
  one thing in the admin that is for somebody who has no part in any
  tournament, so any signed-in account may open it. It says who the person is
  and why they are taking this on, and what they say is emailed to the two
  people (`AskForEmergencyAccess.feature`).

  Pressing Send does not send. It asks again, because the message goes to two
  people who may be grieving and cannot be taken back, and a slip of a thumb
  should cost nothing.

  The page and its dialog are drawn in a browser, since whether a dialog
  stands between the button and the sending is not something that can be read
  from the page's source. The admin draws the page itself, so every scenario
  here runs scripts.

  Background:
    Given the emergency contacts are at "first@example.com" and "second@example.com"
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "sam@example.com" has an account, confirmed, called "Sam Jones", with the password "another horse battery staple"
    And the reader has signed in as "sam@example.com" with the password "another horse battery staple"

  Rule: The page is for any signed-in account

    @browser @postgres
    Scenario: A signed-in account sees the page
      When the page "in case of emergency" is opened
      Then the question "Say who you are, who asked you or why you are taking this on" is on the page

    @browser @postgres
    Scenario: The page has a button to send
      When the page "in case of emergency" is opened
      Then the button "Send" is on the page

    @browser @postgres
    Scenario: Somebody not signed in is asked to sign in
      Given the reader has signed out
      When the page "in case of emergency" is opened
      Then the sign in page is shown

  Rule: Pressing Send asks again before anything is sent

    @browser @postgres
    Scenario: Pressing Send opens a dialog
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      When the button "Send" is pressed
      Then a dialog asks whether to send

    @browser @postgres
    Scenario: Nothing is sent while the dialog is open
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      When the button "Send" is pressed
      Then no email is queued

    @browser @postgres
    Scenario: Cancelling the dialog sends nothing
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is cancelled
      Then no email is queued

    @browser @postgres
    Scenario: Cancelling the dialog keeps what was typed
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is cancelled
      Then the answer typed is "Tim asked me to look after the site"

    @browser @postgres
    Scenario: Confirming the dialog sends
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the email "Email.EmergencyAccessAsked" is queued for each emergency contact

    @browser @postgres
    Scenario: The page says it was sent
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the page says the message was sent

  Rule: Once it is sent the page says so and asks nothing more

    The person has done what the page is for. Leaving the question and the
    button where they were invites a second, which is refused for two days.

    @browser @postgres
    Scenario: The question is gone once the message is sent
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the question is no longer on the page

    @browser @postgres
    Scenario: The button to send is gone once the message is sent
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the button to send is no longer on the page

  Rule: A refusal is shown on the page

    @browser @postgres
    Scenario: An empty answer is refused where it was typed
      Given the page "in case of emergency" is open
      And the answer "" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the answer is refused with "EmergencyAccess.MessageMissing"

    @browser @postgres
    Scenario: An empty answer is refused in words
      Given the page "in case of emergency" is open
      And the answer "" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the refusal of the answer reads "Say who you are, who asked you or why you are taking this on."

    @browser @postgres
    Scenario: Asking again within 48 hours is refused on the page
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      And the dialog is confirmed
      And the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the page is refused with "EmergencyAccess.TooSoon"

    @browser @postgres
    Scenario: Asking again within 48 hours is refused in words
      Given the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      And the dialog is confirmed
      And the page "in case of emergency" is open
      And the answer "Tim asked me to look after the site" is typed
      And the button "Send" is pressed
      When the dialog is confirmed
      Then the refusal of the page reads "You have asked already. The people asked may be slow to answer, so you can ask again in two days."
