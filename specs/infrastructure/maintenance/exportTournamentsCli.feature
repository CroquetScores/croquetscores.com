@postgres
Feature: Exporting the tournaments of croquet and gateball to a folder of files

  The tournaments of the croquet website and of the gateball website are
  written to one folder as files, one for each tournament, so that anybody can
  read the results, or build something from them, without the websites being
  asked for them. The folder is a Git repository of its own, which is how the
  files are published and how a correction shows as a change with a date on
  it. The script writes the files and then stages, commits and pushes them,
  so that a run is the whole of publishing and nothing is left for somebody to
  remember to do. Staging, committing and pushing are the script's here
  because the author has asked for them to be, once and for this script; they
  are not the agent's, which stays as `AI.md` has it.

      npm run export:tournaments -- --folder ../croquet-scores-data

  `--folder` is where the files are written, and it is the only thing the
  script is told. Both websites are exported to it, "croquetscores.com" and
  "gateballscores.com", and the sport in each file's address is what keeps
  them apart. A folder that is not there is refused and not made: one made for
  a mistyped name would be a second place the files were quietly kept, and the
  one that was meant would go on being out of date. A folder that is not a Git
  repository, or that has no remote to push to, is refused for the same
  reason, before anything is written.

  The folder is pulled before anything is written, so that what the run
  writes is laid over what is published and not over what was last seen,
  which is what lets a push be a push and not a refusal for being behind.
  The pull may only move the folder forward. A merge made by a script, with
  nobody looking, is somebody's files quietly changed, so where the folder and
  its remote have each gone their own way the run is refused, and writes
  nothing, for somebody to put right.

  A file is read from the same queries the tournament's public pages are
  drawn from, and says what a reader of those pages can see and no more, so
  that nothing is published that was not already public. A tournament that is
  archived is not public, and is not exported. A try website is not exported
  (`Website.feature`), since everything entered on it may be removed at any
  time, and a folder of files about it would be files about things that may
  not have happened.

  Each tournament is written to a file named by its address on its website, as
  "2026/ac/spring-open.json" for "/2026/ac/spring-open", so that the file is
  found by whoever knows the page, and the page by whoever has the file. The
  file is JSON, laid out the same way each run, with the same things in the
  same order, so that the only reason a file changes between runs is that
  what it says has changed.

  A file says the tournament's name, its sport, the days it was played, where
  it was played, who played in it and what each represents, and each of its
  competitions (a tournament played by teams has teams and tests in place of
  these, below): its name, whether it is a block, a knockout or a Swiss, and
  every game played in it, with who played, what each scored, and whether it
  was withdrawn. A withdrawn game is kept, as it is on the pages, since it was
  played, and is said to be withdrawn so that nobody counts it. A knockout's
  match is its games, in the order they were played, under the two players
  who met. A file also says which version of this layout it is, which is 1,
  so that a reader of the files is told when the layout changes and does not
  have to notice.

  What is left out is as much of the decision as what is put in. No account
  is named: not who manages a tournament, not who added a player or a game,
  and no email address or Google account at all. The tournament's notes and
  its commentary are not exported, being what a person wrote rather than what
  happened, and what a person wrote may be theirs to take back. A player who is
  archived is left out, with the games they were in, as the pages leave them
  out, and so is a competition that is archived.

  The files are the tournaments as they are now and not a log of what has
  happened to them. A tournament's file is written again only where what it
  would say has changed, so that the file's date in a folder, and the changes
  Git shows, are those of the tournament and not of the run. A file whose
  tournament is no longer public, because it was archived or has moved to
  another address, is removed, so that the folder says what the website says.
  Git keeps the file as it was, and that has a cost, which is why it is said
  here: a name that was once exported is in the folder's history for as long
  as the folder is kept, whatever the website has done since, so a person who
  asks to be taken out can be taken out of what is exported next and not out
  of what was.

  A file is written to a name of its own and given its name only once it is
  whole, so that a folder never holds half a file under the name of a whole
  one. A run that fails writes what it had written and removes nothing: a
  file taken away is one that cannot be told from a tournament that was
  archived, so removal waits until every file has been written and is not done
  by a run that could not finish.

  Only what the run changed is staged: the files it wrote and the files it
  removed, by name, and never everything in the folder, so that a README or
  anything else somebody has put there and not finished with is not swept into
  a commit, and what somebody else had already staged is not committed with
  them. The commit says what changed and why it was made, in words, with how
  many tournaments were written and removed. A run that changed nothing makes
  no commit, since an empty commit is a change with nothing in it, and pushes
  only what an earlier run committed and could not push. A run that failed commits and pushes nothing, so that what
  is published is only ever what a whole run wrote. Where the commit is made
  and the push fails, the commit is kept and the failure is said, so that the
  next run pushes it with its own.

  It says what it did, in words an administrator can read, and exits with
  success where everything worked, the push included, and with failure where
  anything did not.

  An error is emailed to the administrator (`ADMINISTRATOR_EMAIL_ADDRESS`), as
  the backup's is (`backupCli.feature`), because the script is meant to be run
  by a scheduler that nobody is watching, and an export that stopped is
  otherwise only found out when somebody notices the files are old. Every
  failure once the run has begun is emailed: a folder that is not there or is
  not a repository, a remote that cannot be pulled from or has gone its own
  way, a file that could not be written, and a push that failed. It says which
  step failed and why. A run that worked sends nothing, since a message every
  run is one that stops being read. A mistake in what the script is told, which
  is a flag missing or not known, is said on the screen to whoever typed it and
  not emailed, since it is theirs to see and not the administrator's. The email
  names no account and no address of the folder's remote, which may hold a
  password. An email that cannot be sent does not undo what was done, and is
  said on the screen and makes the run a failure.

  A tournament played by teams is exported as well, to a file of its own at
  the same kind of address. It has no players of its own, only its teams', so
  its file says each team, by its name and its short name, and the players it
  has; and, in place of competitions, each test: the two teams that met, the
  first team's first, the group the test is in where it is in one, and each
  match played, the first team's player and the second team's, with the games
  between them, each said not to be withdrawn, since a test's game cannot be
  (`withdrawGame.feature`). How the teams stand is not in the file. It is worked out from the
  tests by whoever reads them, and a standing written beside the tests that
  make it is a second thing that could disagree with them, as well as one more
  decision about how teams are ranked, which an organisation is free to make
  as it sees fit (`teamSummary.feature`). An archived team or a player of a
  team who is archived is left out, with the games they were in, and so is an
  archived test, as the pages leave them out.

  A run reads only the tournaments that have changed since the last run
  exported them, since reading them all takes long and nearly none of them has
  changed. What changed is told by a mark of each tournament, made of the
  newest version kept of the tournament and of each of its competitions, and
  not by when anything was kept: a moment is no proof of what came before it,
  as two things kept at once, or one kept late by a slow transaction after one
  kept earlier, would leave a change that a moment missed. The marks are read
  before any tournament is, so that what is kept while the tournaments are
  read is newer than the mark and is read again next time. What is exported is
  recorded in the folder's own Git directory, which is never committed, once
  every file is as it should be and not before, so that a run that stopped
  part way has recorded nothing. Where there is doubt the tournament is read:
  with no record, with a record of another layout, with a file that is not
  there, or at another address. `--all` reads every tournament whatever the
  record says, for where the script itself has changed what it would write.

  `--test` does everything but call Git: the folder is checked to be there,
  the tournaments are read and the files are written and removed, and nothing
  more, and keeps no record, so that it reads every tournament. The folder
  need not be a repository, or have a remote, since Git is
  not asked, and nothing is pulled, staged, committed or pushed, so that the
  files can be looked at before anything is published. It says that it was a
  test.

  Flags are not exported. A flag is a picture the pages draw, and nothing in
  a file would say what the picture was.

  These scenarios run the script's own function, over a folder of the
  scenario's own, with a remote of the scenario's own that is a repository on
  the same machine, and websites of the scenario's own, a mail sender the
  scenario can read and take down, and a clock the scenario sets.

  Where a scenario says nothing else, the tournament "Spring Open" is for the
  sport "ac" and starts and finishes on 3 October 2026, and has a block
  "Block A", the best of 1, with "Sam Someone" and "Alex Another" entered in
  it, and the folder is a Git repository that is there, has a remote, and has
  nothing in it. Where a scenario is of a
  tournament played by teams, it is "Spring Tests", with its teams
  "Australia", "AUS", with "Pat Player" and "Pam Partner", and "England",
  "ENG", with "Kim Keeper" and "Ken Kicker", and its test between them is
  expected to have 2 matches, each the best of 1, as the pages' features have
  it.

  Background:
    Given a site served as "croquetscores.com"
    And a site served as "gateballscores.com"
    And the server's clock reads "2026-10-03T10:00:00Z"
    And a folder for the export that is a Git repository, there and empty
    And the folder has a remote of its own
    And the administrator is "administrator@example.com"
    And "organiser@example.com" has an account, confirmed
    And "organiser@example.com" has created the tournament "Spring Open"
    And "organiser@example.com" has set the days of the tournament "Spring Open" to start on "2026-10-03" and finish on "2026-10-03"
    And "organiser@example.com" has added the player "Sam Someone" to "Spring Open"
    And "organiser@example.com" has added the player "Alex Another" to "Spring Open"
    And the block is to be the best of 1
    And "organiser@example.com" has added the block "Block A" to "Spring Open"
    And "organiser@example.com" has entered the player "Sam Someone" in "Block A" of "Spring Open"
    And "organiser@example.com" has entered the player "Alex Another" in "Block A" of "Spring Open"

  Rule: The folder is needed and is a repository

    Scenario: Without the folder the script is refused
      When the export script is run with ""
      Then the export script exits with failure

    Scenario: Without the folder it says it is needed
      When the export script is run with ""
      Then the export script says the folder is needed

    Scenario: A refused run writes nothing
      When the export script is run with ""
      Then the folder has no files in it

    Scenario: A refused run commits nothing
      When the export script is run with ""
      Then the folder has no commits

    Scenario: A folder that is not there is refused
      Given the folder for the export is not there
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: A folder that is not there is not made
      Given the folder for the export is not there
      When the export script is run with "--folder export"
      Then the folder is still not there

    Scenario: A folder that is not a repository is refused
      Given the folder for the export is not a Git repository
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: A folder that is not a repository says why
      Given the folder for the export is not a Git repository
      When the export script is run with "--folder export"
      Then the export script says the folder is not a Git repository

    Scenario: A folder that is not a repository is written nothing
      Given the folder for the export is not a Git repository
      When the export script is run with "--folder export"
      Then the folder has no files in it

    Scenario: A repository with no remote is refused
      Given the folder has no remote
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: A repository with no remote says why
      Given the folder has no remote
      When the export script is run with "--folder export"
      Then the export script says the folder has no remote

    Scenario: A repository with no remote is written nothing
      Given the folder has no remote
      When the export script is run with "--folder export"
      Then the folder has no files in it

    Scenario: An unknown flag is refused
      When the export script is run with "--folder export --force"
      Then the export script exits with failure

    Scenario: A website is not asked for
      When the export script is run with "--website croquetscores.com --folder export"
      Then the export script exits with failure

  Rule: Both websites are exported, and a try website is not

    Scenario: A croquet tournament is exported
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A gateball tournament is exported
      Given a site served as "gateballscores.com"
      And the tournament is to be for the sport "gb"
      And "organiser@example.com" has created the tournament "Gate Open" on "gateballscores.com"
      When the export script is run with "--folder export"
      Then the folder has the file "2026/gb/gate-open.json"

    Scenario: A gateball tournament is exported beside a croquet one
      Given the tournament is to be for the sport "gb"
      And "organiser@example.com" has created the tournament "Gate Open" on "gateballscores.com"
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A tournament of a try website is not exported
      Given a site served as "try.croquetscores.com"
      And "organiser@example.com" has created the tournament "Try Open" on "try.croquetscores.com"
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/try-open.json"

    Scenario: A try website is not a failure
      Given a site served as "try.croquetscores.com"
      When the export script is run with "--folder export"
      Then the export script exits with success

  Rule: A tournament is a file at its address

    Scenario: The file is at the tournament's year, sport and name
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A tournament of another sport is under that sport
      Given the tournament is to be for the sport "gc"
      And "organiser@example.com" has created the tournament "Winter Cup"
      When the export script is run with "--folder export"
      Then the folder has the file "2026/gc/winter-cup.json"

    Scenario: A tournament of another year is under that year
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has set the days of the tournament "Autumn Open" to start on "2027-02-01" and finish on "2027-02-01"
      When the export script is run with "--folder export"
      Then the folder has the file "2027/ac/autumn-open.json"

    Scenario: A tournament that has moved is at the address it has now
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the export script is run with "--folder export"
      Then the folder has the file "2026/gc/spring-open.json"

    Scenario: A tournament that has moved is not also at the address it left
      Given "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/spring-open.json"

  Rule: A file says what the tournament is

    Scenario: The file says the tournament's name
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the tournament's name is "Spring Open"

    Scenario: The file says the sport
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the sport is "ac"

    Scenario: The file says the day the tournament started
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the first day is "2026-10-03"

    Scenario: The file says the day the tournament finished
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the last day is "2026-10-03"

    Scenario: The file says where it was played
      Given the tournament is played in the region "vic" of the country "au"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the country is "au"

    Scenario: The file says the region
      Given the tournament is played in the region "vic" of the country "au"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the region is "vic"

    Scenario: The file says which version of the layout it is
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the layout is version 1

    Scenario: The file is JSON
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" is JSON

  Rule: A file says who played and what they represent

    Scenario: A player is named
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file names the player "Sam Someone"

    Scenario: Every player is named
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file names the player "Alex Another"

    Scenario: A player says what they represent
      Given "organiser@example.com" has set "Sam Someone" to represent "Melbourne"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says "Sam Someone" represents "Melbourne"

    Scenario: A player who represents nothing says nothing
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says "Sam Someone" represents nothing

    Scenario: A player who is archived is left out
      Given "organiser@example.com" has archived the player "Alex Another" in "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file does not name the player "Alex Another"

  Rule: A file says what was played

    Scenario: A competition is named
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file names the competition "Block A"

    Scenario: A competition says it is a block
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says "Block A" is a block

    Scenario: A competition says it is a knockout
      Given "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says "Finals" is a knockout

    Scenario: A competition says it is a Swiss
      Given "organiser@example.com" has added the Swiss "Open Swiss" to "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says "Open Swiss" is a Swiss

    Scenario: A game says who won
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the first game of "Block A" is between "Sam Someone" and "Alex Another"

    Scenario: A game says what the first player scored
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then in the first game of "Block A" "Sam Someone" scored 26

    Scenario: A game says what the second player scored
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then in the first game of "Block A" "Alex Another" scored 17

    Scenario: A game is not said to be withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the first game of "Block A" is not withdrawn

    Scenario: A withdrawn game is kept
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn that game
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then "Block A" has 1 game

    Scenario: A withdrawn game is said to be withdrawn
      Given "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And "organiser@example.com" has withdrawn that game
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the first game of "Block A" is withdrawn

    Scenario: A knockout's match is its games under the two who met
      Given the knockout is to have a draw of 2 places
      And its first round is to be the best of 3
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Finals" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the first match of "Finals" is between "Sam Someone" and "Alex Another"

    Scenario: A knockout's match has each game it was played in
      Given the knockout is to have a draw of 2 places
      And its first round is to be the best of 3
      And "organiser@example.com" has added the knockout "Finals" to "Spring Open"
      And "organiser@example.com" has entered the player "Sam Someone" in "Finals" of "Spring Open"
      And "organiser@example.com" has entered the player "Alex Another" in "Finals" of "Spring Open"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Finals" of "Spring Open"
      And "Alex Another" has beaten "Sam Someone" 26 to 20 in "Finals" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the first match of "Finals" has 2 games

  Rule: A file says nothing that a reader of the pages could not see

    Scenario: No email address is in the file
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" does not contain "organiser@example.com"

    Scenario: The manager is not named
      Given "organiser@example.com" is named "Olive Organiser"
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" does not contain "Olive Organiser"

    Scenario: A note is not exported
      Given "organiser@example.com" has written the note "Bring a hat" to "Spring Open"
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" does not contain "Bring a hat"

    Scenario: A comment is not exported
      Given "organiser@example.com" has started a commentary on "Spring Open"
      And "organiser@example.com" has commented "What a hoop" on it
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" does not contain "What a hoop"

    Scenario: An archived tournament is not exported
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/spring-open.json"

    Scenario: An archived gateball tournament is not exported
      Given the tournament is to be for the sport "gb"
      And "organiser@example.com" has created the tournament "Gate Open" on "gateballscores.com"
      And "organiser@example.com" has archived the tournament "Gate Open"
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/gb/gate-open.json"

  Rule: The files are the same each run unless the tournament has changed

    Scenario: A file is the same when the tournament has not changed
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      And the export script is run again with "--folder export"
      Then the file "2026/ac/spring-open.json" is as it was

    Scenario: A file does not say when it was written
      Given the server's clock reads "2026-10-04T10:00:00Z"
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" does not contain "2026-10-04"

    Scenario: A file that would say the same is not written again
      When the export script is run with "--folder export"
      And the export script is run again with "--folder export"
      Then the file "2026/ac/spring-open.json" was written once

    Scenario: A file is written again when the tournament has changed
      When the export script is run with "--folder export"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And the export script is run again with "--folder export"
      Then the file "2026/ac/spring-open.json" was written twice

    Scenario: The players come in alphabetical order each run
      Given "organiser@example.com" has added the player "Chris Third" to "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the first player named is "Alex Another"

    Scenario: A file that is not a tournament's is left alone
      Given the folder has the file "README.md" containing "About this data"
      When the export script is run with "--folder export"
      Then the file "README.md" is as it was

  Rule: A file of a tournament that is no longer public is removed

    Scenario: An archived tournament's file is removed
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/spring-open.json"

    Scenario: A tournament that is still public keeps its file
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Autumn Open"
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A folder left empty by it is not left behind
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the folder does not have the folder "2026"

    Scenario: A run that fails removes nothing
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Spring Open"
      And "organiser@example.com" has created the tournament "Autumn Open"
      And writing a file fails
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-open.json"

  Rule: A file is whole or not there

    Scenario: A file is written to a name of its own first
      When the export script is run with "--folder export"
      Then "2026/ac/spring-open.json" was written to another name and then renamed

    Scenario: Half a file is never under the name of a whole one
      Given writing a file fails partway
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/spring-open.json"

    Scenario: A file that failed to be written leaves the one before it
      Given the export script has been run with "--folder export"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      And writing a file fails partway
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-open.json" is as it was

  Rule: It says what it did

    Scenario: It says how many it wrote
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was written

    Scenario: It says how many were already as they should be
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was already as it should be

    Scenario: It says how many it removed
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the export script says 1 file was removed

    Scenario: It exits with success
      When the export script is run with "--folder export"
      Then the export script exits with success

    Scenario: A website with no tournaments writes nothing and says so
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the export script says 0 tournaments were written

    Scenario: A website with no tournaments is not a failure
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the export script exits with success

    Scenario: A failure is said, and exits with failure
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the export script says writing a file failed

    Scenario: A failed run exits with failure
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the export script exits with failure

  Rule: The folder is pulled before the run

    Scenario: What the remote has is there to be written over
      Given the remote has the file "NOTES.md" that the folder does not
      When the export script is run with "--folder export"
      Then the folder has the file "NOTES.md"

    Scenario: What the remote has is kept in the push
      Given the remote has the file "NOTES.md" that the folder does not
      When the export script is run with "--folder export"
      Then the remote has the file "NOTES.md"

    Scenario: The pull is made before the first file is written
      Given the remote has the file "NOTES.md" that the folder does not
      When the export script is run with "--folder export"
      Then the folder was pulled before "2026/ac/spring-open.json" was written

    Scenario: A remote that cannot be pulled from is refused
      Given the remote cannot be pulled from
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: A remote that cannot be pulled from says so
      Given the remote cannot be pulled from
      When the export script is run with "--folder export"
      Then the export script says the folder could not be pulled

    Scenario: A remote that cannot be pulled from is written nothing
      Given the remote cannot be pulled from
      When the export script is run with "--folder export"
      Then the folder has no files in it

    Scenario: A folder and a remote that have each gone their own way are refused
      Given the folder has a commit that the remote does not
      And the remote has a commit that the folder does not
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: A folder and a remote that have each gone their own way are not merged
      Given the folder has a commit that the remote does not
      And the remote has a commit that the folder does not
      When the export script is run with "--folder export"
      Then the folder has no merge

    Scenario: A folder and a remote that have each gone their own way are written nothing
      Given the folder has a commit that the remote does not
      And the remote has a commit that the folder does not
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/spring-open.json"

  Rule: An error is emailed to the administrator

    Scenario: A folder that is not there is emailed
      Given the folder for the export is not there
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A folder that is not there is said in the email
      Given the folder for the export is not there
      When the export script is run with "--folder export"
      Then the email says the folder is not there

    Scenario: A folder that is not a repository is emailed
      Given the folder for the export is not a Git repository
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A repository with no remote is emailed
      Given the folder has no remote
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A pull that failed is emailed
      Given the remote cannot be pulled from
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A pull that failed is said in the email
      Given the remote cannot be pulled from
      When the export script is run with "--folder export"
      Then the email says the failure was pulling the folder

    Scenario: A folder that has gone its own way is emailed
      Given the folder has a commit that the remote does not
      And the remote has a commit that the folder does not
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A file that could not be written is emailed
      Given writing a file fails
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A file that could not be written is said in the email
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the email says the failure was writing a file

    Scenario: A push that failed is emailed
      Given pushing to the remote fails
      When the export script is run with "--folder export"
      Then an email was sent to "administrator@example.com"

    Scenario: A push that failed is said in the email
      Given pushing to the remote fails
      When the export script is run with "--folder export"
      Then the email says the failure was pushing the folder

    Scenario: The email says why
      Given pushing to the remote fails because "the remote rejected it"
      When the export script is run with "--folder export"
      Then the email says why: "the remote rejected it"

    Scenario: The email subject warns
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the email subject is "WARNING: Croquet Scores tournament export FAILED"

    Scenario: The email names no account
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the email does not contain "organiser@example.com"

    Scenario: The email does not say the remote's address
      Given the remote's address holds the password "s3cret"
      And pushing to the remote fails
      When the export script is run with "--folder export"
      Then the email does not contain "s3cret"

    Scenario: A run that worked sends no email
      When the export script is run with "--folder export"
      Then no email was sent

    Scenario: A run that changed nothing sends no email
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then no email was sent

    Scenario: A flag that is missing is not emailed
      When the export script is run with ""
      Then no email was sent

    Scenario: A flag that is not known is not emailed
      When the export script is run with "--folder export --force"
      Then no email was sent

    Scenario: An email that cannot be sent is a failure
      Given writing a file fails
      And email cannot be sent
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: An email that cannot be sent is said on the screen
      Given writing a file fails
      And email cannot be sent
      When the export script is run with "--folder export"
      Then the export script says the administrator could not be told

    Scenario: An email that cannot be sent does not undo the run
      Given pushing to the remote fails
      And email cannot be sent
      When the export script is run with "--folder export"
      Then the folder has 1 commit

  Rule: What a run changed is staged, committed and pushed

    Scenario: The files written are committed
      When the export script is run with "--folder export"
      Then the folder's last commit has the file "2026/ac/spring-open.json"

    Scenario: The commit is pushed
      When the export script is run with "--folder export"
      Then the remote has the file "2026/ac/spring-open.json"

    Scenario: A gateball file is pushed with a croquet one
      Given the tournament is to be for the sport "gb"
      And "organiser@example.com" has created the tournament "Gate Open" on "gateballscores.com"
      When the export script is run with "--folder export"
      Then the remote has the file "2026/gb/gate-open.json"

    Scenario: The commit is of both sports in one
      Given the tournament is to be for the sport "gb"
      And "organiser@example.com" has created the tournament "Gate Open" on "gateballscores.com"
      When the export script is run with "--folder export"
      Then the folder has 1 commit

    Scenario: The commit says how many tournaments were written
      When the export script is run with "--folder export"
      Then the folder's last commit message says 1 tournament was written

    Scenario: A file removed is committed as removed
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the folder's last commit has removed the file "2026/ac/spring-open.json"

    Scenario: A file removed is removed from the remote
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export"
      Then the remote does not have the file "2026/ac/spring-open.json"

    Scenario: A run that changed nothing makes no commit
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then the folder has 1 commit

    Scenario: A run that changed nothing says so
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then the export script says there was nothing to commit

    Scenario: A run that changed nothing is not a failure
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then the export script exits with success

    Scenario: A file that is not a tournament's is not committed
      Given the folder has the file "README.md" containing "About this data"
      When the export script is run with "--folder export"
      Then the folder's last commit does not have the file "README.md"

    Scenario: A file that is not a tournament's is left unstaged
      Given the folder has the file "README.md" containing "About this data"
      When the export script is run with "--folder export"
      Then the file "README.md" is not staged

    Scenario: Another change that was staged is not committed
      Given the folder has the file "README.md" containing "About this data"
      And the file "README.md" is staged
      When the export script is run with "--folder export"
      Then the folder's last commit does not have the file "README.md"

    Scenario: A run that failed commits nothing
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the folder has no commits

    Scenario: A run that failed pushes nothing
      Given writing a file fails
      When the export script is run with "--folder export"
      Then the remote has no commits

    Scenario: A commit that cannot be pushed is kept
      Given pushing to the remote fails
      When the export script is run with "--folder export"
      Then the folder has 1 commit

    Scenario: A push that failed is said
      Given pushing to the remote fails
      When the export script is run with "--folder export"
      Then the export script says pushing failed

    Scenario: A push that failed exits with failure
      Given pushing to the remote fails
      When the export script is run with "--folder export"
      Then the export script exits with failure

    Scenario: A commit that was not pushed is pushed by the next run
      Given pushing to the remote fails
      And the export script has been run with "--folder export"
      And pushing to the remote works
      When the export script is run with "--folder export"
      Then the remote has the file "2026/ac/spring-open.json"

    Scenario: It says it pushed
      When the export script is run with "--folder export"
      Then the export script says the files were pushed

  Rule: A competition that is archived is left out

    Scenario: An archived competition is not in the file
      Given "organiser@example.com" has archived the competition "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file does not name the competition "Block A"

  Rule: A test run calls no Git command

    Scenario: A test run writes the files
      When the export script is run with "--folder export --test"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A test run calls no Git command
      When the export script is run with "--folder export --test"
      Then no Git command was run

    Scenario: A test run makes no commit
      When the export script is run with "--folder export --test"
      Then the folder has no commits

    Scenario: A test run pushes nothing
      When the export script is run with "--folder export --test"
      Then the remote has no commits

    Scenario: A test run needs no repository
      Given the folder for the export is not a Git repository
      When the export script is run with "--folder export --test"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A test run needs no remote
      Given the folder has no remote
      When the export script is run with "--folder export --test"
      Then the export script exits with success

    Scenario: A test run removes the file of a tournament that is no longer public
      Given the export script has been run with "--folder export --test"
      And "organiser@example.com" has archived the tournament "Spring Open"
      When the export script is run with "--folder export --test"
      Then the folder does not have the file "2026/ac/spring-open.json"

    Scenario: A test run says it was a test
      When the export script is run with "--folder export --test"
      Then the export script says it was a test run

    Scenario: A test run says how many it wrote
      When the export script is run with "--folder export --test"
      Then the export script says 1 tournament was written

    Scenario: A test run of a folder that is not there is refused
      Given the folder for the export is not there
      When the export script is run with "--folder export --test"
      Then the export script exits with failure

    Scenario: A test run that fails is emailed
      Given writing a file fails
      When the export script is run with "--folder export --test"
      Then an email was sent to "administrator@example.com"

  Rule: Only a tournament that has changed since the last export is read

    Scenario: The first run reads every tournament
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: The export script says how many tournaments are public and how many it will read
      When the export script is run with "--folder export"
      Then the export script says "1 tournament is public, and 1 to read."

    Scenario: A tournament that has not changed is not read again
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then the export script says 0 tournaments were read

    Scenario: A game that was added is read again
      Given the export script has been run with "--folder export"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: A game that was added is in the file
      Given the export script has been run with "--folder export"
      And "Sam Someone" has beaten "Alex Another" 26 to 17 in "Block A" of "Spring Open"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then "Block A" has 1 game

    Scenario: A change to the tournament itself is read again
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has renamed the tournament "Spring Open" to "Spring Classic"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the tournament's name is "Spring Classic"

    Scenario: Only the tournament that changed is read
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the export script has been run with "--folder export"
      And "organiser@example.com" has renamed the tournament "Autumn Open" to "Autumn Classic"
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: A tournament that was not read is still counted as it should be
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And the export script has been run with "--folder export"
      And "organiser@example.com" has renamed the tournament "Autumn Open" to "Autumn Classic"
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was already as it should be

    Scenario: A file that is not there is read again
      Given the export script has been run with "--folder export"
      And the file "2026/ac/spring-open.json" is deleted
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-open.json"

    Scenario: A tournament that moved is read again
      Given the export script has been run with "--folder export"
      And "organiser@example.com" has moved the tournament "Spring Open" to the sport "gc"
      When the export script is run with "--folder export"
      Then the folder has the file "2026/gc/spring-open.json"

    Scenario: Every tournament is read when it is asked
      Given the export script has been run with "--folder export"
      When the export script is run with "--folder export --all"
      Then the export script says 1 tournament was read

    Scenario: A run that stopped part way has recorded nothing
      Given writing a file fails
      And the export script has been run with "--folder export"
      And writing a file works
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: A test run records nothing
      Given the export script has been run with "--folder export --test"
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: A folder that has its record taken away is read whole
      Given the export script has been run with "--folder export"
      And the folder's record of what was exported is deleted
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: A change made while the tournaments are being read is read next time
      Given the tournament "Spring Open" is renamed to "Spring Classic" while it is being read
      And the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      Then the export script says 1 tournament was read

    Scenario: A change made while the tournaments are being read is in the file next time
      Given the tournament "Spring Open" is renamed to "Spring Classic" while it is being read
      And the export script has been run with "--folder export"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-open.json" is read
      Then the file says the tournament's name is "Spring Classic"

    Scenario: The record is not committed
      When the export script is run with "--folder export"
      Then the folder's last commit does not have the file ".git/export-record.json"

  Rule: A tournament played by teams has its teams and its tests

    Background:
      Given the tournament is to be played in the format "Teams"
      And "organiser@example.com" has created the tournament "Spring Tests"
      And the team is to be known for short as "AUS"
      And "organiser@example.com" has added the team "Australia" to "Spring Tests"
      And the team is to be known for short as "ENG"
      And "organiser@example.com" has added the team "England" to "Spring Tests"
      And "organiser@example.com" has added the player "Pat Player" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Pam Partner" to the team "Australia" of "Spring Tests"
      And "organiser@example.com" has added the player "Kim Keeper" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the player "Ken Kicker" to the team "England" of "Spring Tests"
      And "organiser@example.com" has added the test between "Australia" and "England" to "Spring Tests"
      And "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" 2 expected matches

    Scenario: The tournament has a file at its address
      When the export script is run with "--folder export"
      Then the folder has the file "2026/ac/spring-tests.json"

    Scenario: The file says the tournament's name
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file says the tournament's name is "Spring Tests"

    Scenario: A team is named
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file names the team "Australia"

    Scenario: A team says its short name
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file says the team "Australia" is known for short as "AUS"

    Scenario: A team's players are named
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file says the team "Australia" has the player "Pat Player"

    Scenario: A player is under their own team and no other
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file says the team "England" does not have the player "Pat Player"

    Scenario: The tournament has no players of its own
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file does not name a player outside a team

    Scenario: A team that is archived is left out
      Given "organiser@example.com" has archived the test "AUS v ENG" of "Spring Tests"
      And "organiser@example.com" has archived the team "England" in "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file does not name the team "England"

    Scenario: A player of a team who is archived is left out
      Given "organiser@example.com" has archived the player "Ken Kicker" of the team "England" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file says the team "England" does not have the player "Ken Kicker"

    Scenario: A test says which teams met
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first test is between "Australia" and "England"

    Scenario: A test names the first team first
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first team of the first test is "Australia"

    Scenario: A test says what each match is the best of
      Given "organiser@example.com" has given the test "AUS v ENG" of "Spring Tests" matches each the best of 3
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first test says each match is the best of 3

    Scenario: A match says who played, the first team's player first
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first match of the first test is between "Pat Player" and "Kim Keeper"

    Scenario: A match has its game
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first match of the first test has 1 game

    Scenario: A game says what the first team's player scored
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then in the first game of the first match of the first test "Pat Player" scored 17

    Scenario: A game says what the second team's player scored
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then in the first game of the first match of the first test "Kim Keeper" scored 26

    Scenario: The matches are in the order they began
      Given "Ken Kicker" has beaten "Pam Partner" 26 to 17 in "AUS v ENG" of "Spring Tests"
      And "Pat Player" has beaten "Kim Keeper" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first match of the first test is between "Pam Partner" and "Ken Kicker"
      And the second match of the first test is between "Pat Player" and "Kim Keeper"

    Scenario: A game of a test is not said to be withdrawn
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first game of the first match of the first test is not withdrawn

    Scenario: A test in a group says which
      Given "organiser@example.com" has added the test between "England" and "Australia" to the group "Block A" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the second test is in the group "Block A"

    Scenario: A test in no group says nothing of one
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the first test is in no group

    Scenario: A test that is archived is left out
      Given "organiser@example.com" has archived the test "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file has 0 tests

    Scenario: How the teams stand is not in the file
      Given "Kim Keeper" has beaten "Pat Player" 26 to 17 in "AUS v ENG" of "Spring Tests"
      When the export script is run with "--folder export"
      And the file "2026/ac/spring-tests.json" is read
      Then the file does not say how the teams stand

    Scenario: No flag is in the file
      Given "organiser@example.com" has given the team "Australia" of "Spring Tests" the flag "au"
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-tests.json" does not contain "au.svg"

    Scenario: No email address is in the file
      When the export script is run with "--folder export"
      Then the file "2026/ac/spring-tests.json" does not contain "organiser@example.com"

    Scenario: It counts it with the tournament the feature began with
      When the export script is run with "--folder export"
      Then the export script says 2 tournaments were written

    Scenario: An archived tournament played by teams is not exported
      Given "organiser@example.com" has archived the tournament "Spring Tests"
      When the export script is run with "--folder export"
      Then the folder does not have the file "2026/ac/spring-tests.json"
