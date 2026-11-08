Feature: A script signs in to the server from the administrator's own computer

  An administrator who has to look at the server by hand, such as to run a
  step in the release notes, signs in to it with a script:

      npm run ssh

  It is the same sign-in the deploy script makes, to the same address in the
  same setting, so the address is written once and the two cannot come to name
  different servers. It is a shortcut and nothing more: it uses the
  administrator's own key, as signing in by hand does, and does not choose or
  change anything on the server.

  These scenarios run the script's own function, with the settings and the
  connection to the server standing in for the real ones.

  Rule: The administrator is signed in to the server whose address is set

    Scenario: The sign-in is to the server address
      Given a server to sign in to
      When the sign-in script is run
      Then the sign-in is to the server address

    Scenario: The sign-in is as the deploy account
      Given a server to sign in to
      When the sign-in script is run
      Then the sign-in is as the account "deploy"

  Rule: Nothing is tried unless it is clear where

    Scenario: No server address is refused
      Given no server to sign in to
      When the sign-in script is run
      Then the sign-in script exits with failure
      And the sign-in script says "DEPLOY_SSH_HOST"

    Scenario: A refused sign-in is not made
      Given no server to sign in to
      When the sign-in script is run
      Then no sign-in is made

  Rule: The script ends the way the session did

    What the administrator ran on the server may have failed, and a script
    that always ended well would hide it from whatever called the script.

    Scenario: A session that ends well ends the script well
      Given a server to sign in to
      And the session ends with status 0
      When the sign-in script is run
      Then the sign-in script exits with status 0

    Scenario: A session that ends badly ends the script the same way
      Given a server to sign in to
      And the session ends with status 7
      When the sign-in script is run
      Then the sign-in script exits with status 7
