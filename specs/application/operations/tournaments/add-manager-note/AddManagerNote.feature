@postgres
Feature: Adding a manager's note to a tournament

  A manager of the tournament can add a note to it, from the admin's Notes
  tab (`notes-tab.feature`), and the account they are signed in to is who
  added it. The note is kept in a stream of its own (`add.feature`), and the
  tournament is asked first whether the account may write its notes
  (`writeManagerNotes.feature`). The tournament is named by its id; one there is not is refused
  as `AddManagerNote.NoSuchTournament`. The note is given a new id, and the
  answer is that id. Only the tournament's managers can: anybody else, a
  scorer among them, is refused with `Tournament.NotAManager`
  (`onlyManagers.feature`).

  The note's title and description are asked their own rules on the way in
  (`ManagerNoteTitle.feature`, `ManagerNoteDescription.feature`), and a
  request that breaks one is refused with `Request.Invalid` and the first
  rule it breaks. A description left empty is no description. The note is
  found at a slug of its title that no other note of the tournament has,
  deleted or not (`add.feature`), which the read model of the tournament's
  notes says (`ManagerNotesByTournament.feature`). That the
  tournament is not archived is the tournament's to refuse.

  A forgotten account adds nothing, and is refused with `Account.Forgotten`.

  These scenarios run against Postgres, with the application's event store and
  read models.

  Background:
    Given the application's tournaments
    And the moment "2026-09-26T10:00:00Z"
    And "organiser@example.com" has an account, confirmed, called "Ollie Organiser"
    And "organiser@example.com" has created the tournament "Spring Open"

  Rule: A sound note is added and kept

    Scenario: The note is one of the tournament's notes
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then "Spring Open" has the manager note "Lunch is at noon"

    Scenario: The answer is the note's id
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then it is answered with the id of the tournament's manager note "Lunch is at noon"

    Scenario: The note says what it was added saying
      Given the manager note is to say "In the **clubhouse**"
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch" to "Spring Open"
      Then the manager note "Lunch" of "Spring Open" says "In the **clubhouse**"

    Scenario: A note added with an empty description says nothing more
      Given the manager note is to say ""
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then the manager note "Lunch is at noon" of "Spring Open" says nothing more

    Scenario: Adding the note is recorded as done by whoever asked
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then the manager note "Lunch is at noon" of "Spring Open" was added by the account for "organiser@example.com"

  Rule: A note is found at a slug of its title that no other note of the tournament has

    Scenario: The note is found at a slug of its title
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then the manager note "Lunch is at noon" of "Spring Open" is found at "lunch-is-at-noon"

    Scenario: A slug another note has is followed by "-01"
      Given "organiser@example.com" has added the manager note "Lunch" to "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch!" to "Spring Open"
      Then the manager note "Lunch!" of "Spring Open" is found at "lunch-01"

    Scenario: A deleted note's slug is not given again
      Given "organiser@example.com" has added the manager note "Lunch" to "Spring Open"
      And "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch!" to "Spring Open"
      Then the manager note "Lunch!" of "Spring Open" is found at "lunch-01"

    Scenario: A slug another tournament's note has is not taken
      Given "organiser@example.com" has created the tournament "Autumn Open"
      And "organiser@example.com" has added the manager note "Lunch" to "Autumn Open"
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch" to "Spring Open"
      Then the manager note "Lunch" of "Spring Open" is found at "lunch"

  Rule: Of two notes added at once whose titles make one slug, the second is found after the first

    Which slugs a tournament's notes have taken is read from the read model of
    them, and nothing is written to the tournament as a note is added. So two
    added at the same moment would each read a slug as free, and the second
    would then be refused by the table, as a fault rather than an answer.
    Asking which slugs are taken holds every other asking for the tournament's
    until the first is kept, so that the second reads the slug the first
    took, and is given the next, as it would have been a moment later.

    Scenario: Two notes added at once whose titles make one slug are both added
      Given the reader signed in to the account for "organiser@example.com" is to add the manager note "Lunch" to "Spring Open"
      And the reader signed in to the account for "organiser@example.com" is to add the manager note "Lunch!" to "Spring Open"
      When both are asked for at once
      Then neither is refused

    Scenario: Of two notes added at once whose titles make one slug, one is found at it
      Given the reader signed in to the account for "organiser@example.com" is to add the manager note "Lunch" to "Spring Open"
      And the reader signed in to the account for "organiser@example.com" is to add the manager note "Lunch!" to "Spring Open"
      When both are asked for at once
      Then a manager note of "Spring Open" is found at "lunch"

    Scenario: Of two notes added at once whose titles make one slug, the other is found after it
      Given the reader signed in to the account for "organiser@example.com" is to add the manager note "Lunch" to "Spring Open"
      And the reader signed in to the account for "organiser@example.com" is to add the manager note "Lunch!" to "Spring Open"
      When both are asked for at once
      Then a manager note of "Spring Open" is found at "lunch-01"

  Rule: Each value must break none of its own rules

    Scenario: A missing title is refused
      When the reader signed in to the account for "organiser@example.com" adds the manager note "" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ManagerNoteTitle.Missing"

    Scenario: A title with no letter or digit is refused
      When the reader signed in to the account for "organiser@example.com" adds the manager note "???" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ManagerNoteTitle.NoLetterOrDigit"

    Scenario: A description too long is refused
      Given the manager note is to say 750001 characters
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then it is refused with "Request.Invalid"
      And the first rule broken is "ManagerNoteDescription.TooLong"

    Scenario: A note that breaks a rule is not added
      When the reader signed in to the account for "organiser@example.com" adds the manager note "" to "Spring Open"
      Then "Spring Open" has no manager notes

  Rule: What the tournament asks of its notes is the tournament's to refuse

    Scenario: Adding a note to an archived tournament is refused as the tournament refuses it
      Given "organiser@example.com" has archived the tournament "Spring Open"
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then it is refused with "Tournament.Archived"

  Rule: Only a tournament there is can have a note added

    Scenario: Adding a note to a tournament there is not is refused
      When the reader signed in to the account for "organiser@example.com" adds the manager note "Lunch is at noon" to a tournament there is not
      Then it is refused with "AddManagerNote.NoSuchTournament"

  Rule: Only a manager of the tournament can ask for this

    Scenario: A reader who does not manage the tournament is refused
      Given "someone@example.com" has an account, confirmed, called "Sam Someone"
      When the reader signed in to the account for "someone@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

    Scenario: A scorer of the tournament is refused
      Given "scorer@example.com" has an account, confirmed, called "Sasha Scorer"
      And "organiser@example.com" has made "scorer@example.com" a scorer of "Spring Open"
      When the reader signed in to the account for "scorer@example.com" adds the manager note "Lunch is at noon" to "Spring Open"
      Then it is refused with "Tournament.NotAManager"

  Rule: A forgotten account adds nothing

    Scenario: A forgotten account is refused
      Given the account for "organiser@example.com" is taken hold of
      And the account for "organiser@example.com" has been forgotten
      When the reader signed in to that account adds the manager note "Lunch is at noon" to "Spring Open"
      Then it is refused with "Account.Forgotten"
