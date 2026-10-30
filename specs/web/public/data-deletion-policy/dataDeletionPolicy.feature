Feature: A reader can see how to have their data deleted

  Somebody who signed in to this site with Facebook, or with Google, or with a
  password, is owed an answer to how to have what the site keeps about them
  deleted, and Facebook asks for one at an address of its own before an app may
  sign anybody in.

  That answer is a page of its own at `/data-deletion-policy`, written once
  for each language the site is offered in as the help is, and shown in
  English where its language has none (`help.feature`). It does not delete
  anything itself. Deleting is forgetting the account, which only somebody
  signed in to it can ask for, and which asks again by email
  (`forgetAccount.feature`); the page says what that does and links to it, so
  that the one way of deleting is described in one place and done in another.

  Scenarios here read pages and nothing more, so none need a browser or a
  database.

  Rule: The policy is a page of its own

    Scenario: The policy is at its own address
      When the data deletion policy is opened
      Then the page is the data deletion policy

    Scenario: The policy is not also in the help
      When the help page "data-deletion-policy" is looked at
      Then the page is not found

    Scenario: A language without the policy is shown it in English
      Given a browser that asks for Welsh
      And the help has no Welsh data deletion policy
      When the data deletion policy is opened
      Then the policy is in English

  Rule: The policy sends the reader to forget their account

    Scenario: The policy links to the page where an account is forgotten
      When the data deletion policy is opened
      Then the policy links to "/account/forget-account"

  Rule: The policy says who to ask

    Scenario: The administrator is named, as a link to send them email
      Given the site is told its administrator is "administrator@example.com"
      When the data deletion policy is opened
      Then the policy links to send email to the administrator
