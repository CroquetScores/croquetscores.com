Feature: A script deploys from the administrator's own computer

  An administrator puts a commit up on the server from their own computer,
  with a script:

      npm run deploy
      npm run deploy -- my-branch
      npm run deploy -- origin/my-branch

  The deploy that runs on a merge to main is gone, so this and the Deploy
  workflow in GitHub are the two ways to start one. Both end in the same
  place: the script installed on the server, which is given one commit and
  does the rest (`deploying.md` section 8).

  With nothing after it the script deploys `origin/main`, the commit the
  repository on GitHub has for main, and not whatever main is on the
  computer it is run from. The computer's own main is often behind, or
  ahead with work nobody has merged, and a deploy from it would put up a
  commit the administrator did not mean.

  A branch can be named instead. A name on its own is the computer's own
  branch, since it is the work being tried that is usually not yet on GitHub's
  copy of the branch. A name starting `origin/` is GitHub's copy of it. Either
  way the script goes to GitHub first and asks for what is new there, so that
  `origin/main` is main as it is now and not as it was when last looked at.

  The server fetches the commit from GitHub itself, so a commit that is only
  on this computer cannot be put up, and the script says to push it first.
  Pushing is not done for the administrator: what leaves the computer is
  theirs to send.

  These scenarios run the script's own function, with the world it is given
  (git, the settings and the connection to the server) standing in for the
  real ones.

  Background:
    Given a server address
    And "origin/main" is the commit "1111111111111111111111111111111111111111"

  Rule: With no branch named, origin/main is deployed

    Scenario: The commit of origin/main is given to the server
      When the script is run with no branch
      Then the server is given the commit "1111111111111111111111111111111111111111"

    Scenario: The script says which commit it is deploying
      When the script is run with no branch
      Then the deploy script says "origin/main"

    Scenario: The computer's own main is not what is deployed
      Given the branch "main" is the commit "2222222222222222222222222222222222222222"
      When the script is run with no branch
      Then the server is given the commit "1111111111111111111111111111111111111111"

    Scenario: GitHub is asked for what is new first
      When the script is run with no branch
      Then GitHub was asked for what is new

  Rule: A name on its own is the computer's own branch

    Scenario: A local branch that GitHub has is deployed
      Given the branch "trial" is the commit "3333333333333333333333333333333333333333"
      And the commit "3333333333333333333333333333333333333333" is on GitHub
      When the script is run with the branch "trial"
      Then the server is given the commit "3333333333333333333333333333333333333333"

    Scenario: A local branch is not taken for GitHub's copy of the same name
      Given the branch "trial" is the commit "3333333333333333333333333333333333333333"
      And the commit "3333333333333333333333333333333333333333" is on GitHub
      And "origin/trial" is the commit "4444444444444444444444444444444444444444"
      When the script is run with the branch "trial"
      Then the server is given the commit "3333333333333333333333333333333333333333"

    Scenario: A local branch that is only on this computer is refused
      Given the branch "trial" is the commit "3333333333333333333333333333333333333333"
      When the script is run with the branch "trial"
      Then the deploy script exits with failure
      And the deploy script says "push"

    Scenario: A refused branch is not given to the server
      Given the branch "trial" is the commit "3333333333333333333333333333333333333333"
      When the script is run with the branch "trial"
      Then the server is given no commit

    Scenario: A branch that is not there is refused
      When the script is run with the branch "nothing"
      Then the deploy script exits with failure
      And the deploy script says "nothing"

  Rule: A name starting origin/ is GitHub's copy

    Scenario: GitHub's copy of a branch is deployed
      Given "origin/trial" is the commit "4444444444444444444444444444444444444444"
      When the script is run with the branch "origin/trial"
      Then the server is given the commit "4444444444444444444444444444444444444444"

    Scenario: GitHub's copy is not taken for a local branch of the same name
      Given "origin/trial" is the commit "4444444444444444444444444444444444444444"
      And the branch "trial" is the commit "3333333333333333333333333333333333333333"
      When the script is run with the branch "origin/trial"
      Then the server is given the commit "4444444444444444444444444444444444444444"

    Scenario: A branch GitHub does not have is refused
      When the script is run with the branch "origin/nothing"
      Then the deploy script exits with failure
      And the deploy script says "origin/nothing"

  Rule: Nothing is deployed unless it is clear what and where

    Scenario: More than one branch is refused
      When the script is run with the branches "one" and "two"
      Then the deploy script exits with failure
      And the deploy script says "Usage"

    Scenario: A refused request is not given to the server
      When the script is run with the branches "one" and "two"
      Then the server is given no commit

    Scenario: No server address is refused
      Given no server address
      When the script is run with no branch
      Then the deploy script exits with failure
      And the deploy script says "DEPLOY_SSH_HOST"

    Scenario: GitHub being out of reach is refused
      Given GitHub cannot be reached
      When the script is run with no branch
      Then the deploy script exits with failure
      And the server is given no commit

  Rule: The script ends the way the server's deploy did

    The server's script refuses a commit that does not come after the one
    running, and puts the old build back when it fails before the migration.
    Either way the administrator needs to know, so the script's own exit
    follows it and does not say all is well because the connection was made.

    Scenario: A deploy that worked is a success
      Given the server's deploy ends with success
      When the script is run with no branch
      Then the deploy script exits with success

    Scenario: A deploy that failed is a failure
      Given the server's deploy ends with failure
      When the script is run with no branch
      Then the deploy script exits with failure

  Rule: The database can be left alone

    A deploy ordinarily copies the data before it changes anything and then
    migrates the database, which is why it is slow to start and cannot be
    undone once the migration has run. `--skip-database-update` has the server do
    neither: it puts up the new build and restarts, and nothing is asked of
    the database. It is for a change that has no migration, or for a server
    whose database is being worked on and cannot be reached.

    The flag does not change which commit is deployed. It is said to the
    server beside the commit, and the server's own script does the leaving
    alone, so the installed script has to be installed again before it
    understands it (`deploying.md` section 8).

    Scenario: A deploy leaves the database alone when asked
      When the script is run with no branch and the flag "--skip-database-update"
      Then the server is told to leave the database alone

    Scenario: The commit is the same with the flag
      When the script is run with no branch and the flag "--skip-database-update"
      Then the server is given the commit "1111111111111111111111111111111111111111"

    Scenario: A deploy does not leave the database alone unless asked
      When the script is run with no branch
      Then the server is not told to leave the database alone

    Scenario: The flag can come after a branch
      Given the branch "trial" is the commit "3333333333333333333333333333333333333333"
      And the commit "3333333333333333333333333333333333333333" is on GitHub
      When the script is run with the branch "trial" and the flag "--skip-database-update"
      Then the server is given the commit "3333333333333333333333333333333333333333"
      And the server is told to leave the database alone

    Scenario: The flag can come before a branch
      Given the branch "trial" is the commit "3333333333333333333333333333333333333333"
      And the commit "3333333333333333333333333333333333333333" is on GitHub
      When the script is run with the flag "--skip-database-update" and the branch "trial"
      Then the server is given the commit "3333333333333333333333333333333333333333"
      And the server is told to leave the database alone

    Scenario: A flag the script does not know is refused
      When the script is run with no branch and the flag "--skip-database-updat"
      Then the deploy script exits with failure
      And the deploy script says "Usage"

    Scenario: A refused flag is not given to the server
      When the script is run with no branch and the flag "--skip-database-updat"
      Then the server is given no commit
