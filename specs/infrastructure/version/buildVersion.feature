Feature: Which version of the website a build is

  A reader who reports a problem, and an operator who wants to know that a
  deploy landed, both need to be able to say which build of the website they
  are looking at, in a word that means the same to each of them.

  The version is a number, and it goes up by one every time a pull request is
  squash-merged to `main`. It is worked out from the history of `main` and not
  written in a file somebody has to remember to change: a squash merge is one
  commit, so the number of commits on `main` is the number of merges. Nothing
  can be forgotten, no commit is made only to change a number, and two merges
  cannot be given the same one.

  It is worked out when the site is built, where the whole of the history is,
  and written down beside the build for the site to read as it starts. The
  site never runs git: the server that serves it has no business asking a
  repository questions on a reader's behalf, and a copy of the build put
  somewhere with no repository still knows what it is.

  Rule: The version is the number of commits on main

    Scenario: A history of three commits is version 3
      Given a history of 3 commits on main
      When the version is worked out
      Then the version is 3

    Scenario: A merge that brought in several commits counts once
      Given a history of 3 commits on main
      And a merge that brought in 4 commits of a branch
      When the version is worked out
      Then the version is 4

    Scenario: Work on a branch that has not been merged is not counted
      Given a history of 3 commits on main
      And 2 commits on a branch that has not been merged
      When the version is worked out
      Then the version is 3

  Rule: A build that cannot count the history says it has no version

    A history cut short, as a build in CI has it to be quick, would give a
    number that is small and wrong, and a wrong number is worse than none: it
    would be taken for the real one. So where the history is not whole, or is
    not there at all, no version is known and none is written down.

    Scenario: A history that has been cut short has no version
      Given a history of 3 commits on main
      And the history has been cut short
      When the version is worked out
      Then no version is known

    Scenario: A folder with no history has no version
      Given a folder with no history
      When the version is worked out
      Then no version is known

  Rule: The site reads the version its build wrote down

    Scenario: A build that wrote down a version
      Given a build that wrote down version 276
      When the site reads its version
      Then the site's version is 276

    Scenario: A build that wrote down no version
      Given a build that wrote down no version
      When the site reads its version
      Then the site has no version

    Scenario: Development, where nothing was built
      Given nothing was built
      When the site reads its version
      Then the site has no version

    Scenario: A record that is not a version is not trusted
      Given a build that wrote down "banana" as its version
      When the site reads its version
      Then the site has no version
