@browser @postgres
Feature: A manager's note is added to a tournament, or edited, in a panel on its Notes tab

  A manager adds a note to a tournament from its Notes tab, by pressing "Add
  Note", and edits one by pressing its title (`notes-tab.feature`). Either
  shows the note panel in the tab, in place of the list of notes. It asks
  for what a note is, as an issue on GitHub does: a title
  (`ManagerNoteTitle.feature`), and a description in Markdown
  (`ManagerNoteDescription.feature`), which is not required, since a title
  may say all a note has to.

  It is a panel on the page rather than a modal dialog over it. A note is
  written at length, with a look at Preview now and again, and a dialog over
  the page is for a few fields and a decision: a panel has the room of the
  tab, and leaves the rest of the page where it was, the section bar and the
  other tabs among it. Like the tabs, it has no address, so showing it leaves
  the address as it was. It has a Cancel button, which keeps nothing that
  was not already kept and puts the list back.

  Adding and editing are the one panel, so that the two cannot come to ask
  different things. Shown by "Add Note", it is headed "Add Note", begins
  empty and its button is Add. Shown for a note, it is headed "Edit Note",
  begins as the note is and its button is Save. The list the note is chosen
  from holds no description (`ManagerNotesOfTournament.feature`), so the
  panel asks for the note when it is shown (`ManagerNoteToEdit.feature`),
  and offers nothing to type in or save until it has it: a Save pressed
  before then would keep an empty description over the note's own, and
  that cannot be undone. Where the note cannot be had, as when another
  manager has deleted it since the list was shown, the panel says so, and
  offers Cancel alone. A note is written one at a
  time, and is read as soon as it is kept, so Add puts the list back once
  the note is added, as Save does once the edit is kept, and the list says
  what the notes are now.

  The description is written as an issue's is on GitHub, in two tabs, Write
  and Preview, and the panel opens on Write. Write holds a box to type the
  description in, beneath a toolbar of GitHub's own: Heading, Bold, Italic,
  Quote, Code, Link, Numbered list, Bulleted list and Task list, in that
  order, each an icon, named by its words for a reader who cannot see it
  and for one who points at it. Each writes its Markdown for the reader, as
  GitHub's does: around what is selected in the box, or at the start of each
  line selected; with nothing selected, it writes the Markdown and puts the
  reader where the words go. GitHub's toolbar also mentions people, refers to
  issues and attaches files, and a note has none of those to offer, so this
  one does not.

  Preview shows the note as a reader will see it on its page (`note.feature`
  on the public site): its title as a heading of the second level, and its
  description drawn from its Markdown, by the same drawing, so that what the
  manager sees is what the reader will. It shows what there is and nothing
  else: a note with no title yet has no heading, and one with no
  description shows its title alone, since a page says nothing of what a
  note does not have either.

  A description may be up to 750,000 characters
  (`ManagerNoteDescription.feature`), and a character can take more than one
  byte to send: an accented letter, as "ö", takes two. So a description is
  sent whole and kept even where it is more than a mebibyte, the most
  anything else sent to the site may be. 525,000 such letters are 1,050,000
  bytes, and show it.

  What is refused is said beneath the field it is about, by the refusal's
  code, and what was typed stays typed so that it can be put right. Nothing
  refused is kept, and the panel stays, on Write, where the description is,
  if it is the description that was refused.

  The admin draws the panel itself, so every scenario here runs scripts, and
  it is read on a phone's width, as the rest of the admin is.

  Background:
    Given a viewport 375 pixels wide
    And a browser that runs scripts
    And a site served as "croquetscores.com"
    And "organiser@example.com" has an account, confirmed, with the password "correct horse battery staple"
    And the reader has signed in as "organiser@example.com" with the password "correct horse battery staple"
    And "organiser@example.com" has created the tournament "Spring Open"
    And the tournament "Spring Open" starts on "2026-10-03"
    And the tournament "Spring Open" is for the sport "ac"

  Rule: Add Note shows the panel empty, to add a note

    Scenario: The panel is headed Add Note
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the note panel is headed "Add Note"

    Scenario: The panel begins with no title
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then "Title" says ""

    Scenario: The reader is put in the title when the panel is shown
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then "Title" has the focus

    Scenario: The panel's first button is Add
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the note panel's first button is "Add"

    Scenario: The panel is not a modal dialog
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then no modal dialog is open

    Scenario: The panel is in place of the list of notes
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the note "Lunch is at noon" is not listed

    Scenario: Showing the panel leaves the address as it was
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the address is "/admin/2026/ac/spring-open"

  Rule: A note's title shows the panel as the note is, to edit it

    Background:
      Given the manager note is to say "In the **clubhouse**"
      And "organiser@example.com" has added the manager note "Lunch" to "Spring Open"

    Scenario: The panel is headed Edit Note
      Given the notes of "Spring Open" are open
      When the title of the note "Lunch" is pressed
      Then the note panel is headed "Edit Note"

    Scenario: The panel begins with the note's title
      Given the notes of "Spring Open" are open
      When the title of the note "Lunch" is pressed
      Then "Title" says "Lunch"

    Scenario: The panel begins with the note's description
      Given the notes of "Spring Open" are open
      When the title of the note "Lunch" is pressed
      Then the description says "In the **clubhouse**"

    Scenario: The panel's first button is Save
      Given the notes of "Spring Open" are open
      When the title of the note "Lunch" is pressed
      Then the note panel's first button is "Save"

  Rule: A note that cannot be had to edit offers nothing to save

    Background:
      Given "organiser@example.com" has added the manager note "Lunch" to "Spring Open"
      And the notes of "Spring Open" are open
      And "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"

    Scenario: A note deleted since the list was shown is said to be gone
      When the title of the note "Lunch" is pressed
      Then the note panel is refused with "ManagerNoteToEdit.NoSuchManagerNote"

    Scenario: A note deleted since the list was shown offers nothing to save
      When the title of the note "Lunch" is pressed
      Then the note panel does not offer "Save"

    Scenario: A note deleted since the list was shown offers nothing to type in
      When the title of the note "Lunch" is pressed
      Then the note panel does not offer the field "Title"

    Scenario: A note deleted since the list was shown can still be cancelled
      Given the title of the note "Lunch" is pressed
      When "Cancel" is pressed
      Then the note panel is not shown

  Rule: Add adds the note and puts the list back

    Scenario: The note is added
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When "Add" is pressed
      Then "Spring Open" has the manager note "Lunch is at noon"

    Scenario: The note says what was written in the description
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch" is typed as the "Title"
      And "In the **clubhouse**" is typed in the description
      When "Add" is pressed
      Then the manager note "Lunch" of "Spring Open" says "In the **clubhouse**"

    Scenario: A note with no description is added
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When "Add" is pressed
      Then the manager note "Lunch is at noon" of "Spring Open" says nothing more

    Scenario: The list is back once the note is added
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When "Add" is pressed
      Then the note panel is not shown

    Scenario: A description more than a mebibyte long to send is added
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Rules" is typed as the "Title"
      And a description of 525000 letters of two bytes each is typed
      When "Add" is pressed
      Then the manager note "Rules" of "Spring Open" says 525000 letters of two bytes each

  Rule: Save keeps the edit and puts the list back

    Background:
      Given the manager note is to say "At noon"
      And "organiser@example.com" has added the manager note "Lunch" to "Spring Open"

    Scenario: The note has the title it was edited to
      Given the notes of "Spring Open" are open
      And the title of the note "Lunch" is pressed
      And "Lunch moved" is typed as the "Title"
      When "Save" is pressed
      Then "Spring Open" has the manager note "Lunch moved"

    Scenario: The note says what the description was edited to
      Given the notes of "Spring Open" are open
      And the title of the note "Lunch" is pressed
      And "At one" is typed in the description
      When "Save" is pressed
      Then the manager note "Lunch" of "Spring Open" says "At one"

    Scenario: A note deleted while it was edited is refused when it is saved
      Given the notes of "Spring Open" are open
      And the title of the note "Lunch" is pressed
      And "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When "Save" is pressed
      Then the note panel is refused with "ManagerNote.Deleted"

    Scenario: A note deleted while it was edited is refused in words that say so
      Given the notes of "Spring Open" are open
      And the title of the note "Lunch" is pressed
      And "organiser@example.com" has deleted the manager note "Lunch" of "Spring Open"
      When "Save" is pressed
      Then the note panel is refused in the words for "ManagerNote.Deleted"

    Scenario: The list is back once the edit is kept
      Given the notes of "Spring Open" are open
      And the title of the note "Lunch" is pressed
      And "Lunch moved" is typed as the "Title"
      When "Save" is pressed
      Then the note panel is not shown

  Rule: Cancel puts the list back and keeps nothing

    Scenario: Cancel puts the list back
      Given "organiser@example.com" has added the manager note "Lunch is at noon" to "Spring Open"
      And the notes of "Spring Open" are open
      And "Add Note" is pressed
      When "Cancel" is pressed
      Then the note "Lunch is at noon" is listed

    Scenario: Cancelling adds nothing
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When "Cancel" is pressed
      Then "Spring Open" has no manager notes

    Scenario: Cancelling changes nothing
      Given "organiser@example.com" has added the manager note "Lunch" to "Spring Open"
      And the notes of "Spring Open" are open
      And the title of the note "Lunch" is pressed
      And "Lunch moved" is typed as the "Title"
      When "Cancel" is pressed
      Then "Spring Open" has the manager note "Lunch"

  Rule: The description is written on Write and seen on Preview, and the panel opens on Write

    Scenario Outline: The description has each tab
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the description's tab "<tab>" is offered

      Examples:
        | tab     |
        | Write   |
        | Preview |

    Scenario: Write comes before Preview
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the description's first tab is "Write"

    Scenario: The panel opens on Write
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the description's tab "Write" is the one being read

    Scenario: What was written is still there after a look at Preview
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "In the **clubhouse**" is typed in the description
      And the description's tab "Preview" is chosen
      When the description's tab "Write" is chosen
      Then the description says "In the **clubhouse**"

  Rule: Write has GitHub's toolbar above the box, in GitHub's order

    Scenario Outline: The toolbar has each of GitHub's tools
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the toolbar's <place> tool is named "<tool>"

      Examples:
        | place   | tool          |
        | first   | Heading       |
        | second  | Bold          |
        | third   | Italic        |
        | fourth  | Quote         |
        | fifth   | Code          |
        | sixth   | Link          |
        | seventh | Numbered list |
        | eighth  | Bulleted list |
        | ninth   | Task list     |

    Scenario: A tool is an icon rather than its words
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the tool "Bold" shows no words

    Scenario: A tool says its name to a reader who points at it
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the tool "Bold" is titled "Bold"

    Scenario: The toolbar is above the box
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the toolbar is above the description

  Rule: Each tool writes its Markdown around what is selected, or at the start of each line selected

    Scenario Outline: A tool writes its Markdown for the words selected
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "lunch" is typed in the description
      And the description's words are all selected
      When the tool "<tool>" is pressed
      Then the description says "<written>"

      Examples:
        | tool          | written        |
        | Heading       | ### lunch      |
        | Bold          | **lunch**      |
        | Italic        | _lunch_        |
        | Quote         | > lunch        |
        | Code          | `lunch`        |
        | Link          | [lunch](url)   |
        | Numbered list | 1. lunch       |
        | Bulleted list | - lunch        |
        | Task list     | - [ ] lunch    |

    Scenario Outline: A tool for lines writes its Markdown at the start of each line selected
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "lunch\ntea" is typed in the description
      And the description's words are all selected
      When the tool "<tool>" is pressed
      Then the description says "<written>"

      Examples:
        | tool          | written              |
        | Quote         | > lunch\n> tea       |
        | Numbered list | 1. lunch\n2. tea     |
        | Bulleted list | - lunch\n- tea       |
        | Task list     | - [ ] lunch\n- [ ] tea |

    Scenario Outline: A selection ending at a line break leaves the line after it alone
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "lunch\ntea" is typed in the description
      And the description's first line is selected with its line break
      When the tool "<tool>" is pressed
      Then the description says "<written>"

      Examples:
        | tool          | written        |
        | Heading       | ### lunch\ntea |
        | Quote         | > lunch\ntea   |
        | Bulleted list | - lunch\ntea   |

    Scenario: A selection from the first of lines that begin empty marks every one of them
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "\n\nlunch" is typed in the description
      And the description's words are all selected
      When the tool "Numbered list" is pressed
      Then the description says "1. \n2. \n3. lunch"

    Scenario: Code around more than one line is a block of code
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "lunch\ntea" is typed in the description
      And the description's words are all selected
      When the tool "Code" is pressed
      Then the description says "```\nlunch\ntea\n```"

    Scenario: A tool with nothing selected puts the reader where the words go
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And the tool "Bold" is pressed
      When "lunch" is typed in the description as it stands
      Then the description says "**lunch**"

    Scenario: Link puts the reader in the link's address, selected
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "lunch" is typed in the description
      And the description's words are all selected
      And the tool "Link" is pressed
      When "https://example.com" is typed in the description as it stands
      Then the description says "[lunch](https://example.com)"

    Scenario: A tool written after words on a line begins a line of its own
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "lunch" is typed in the description
      And the tool "Bulleted list" is pressed
      When "tea" is typed in the description as it stands
      Then the description says "lunch\n- tea"

    Scenario: The reader is back in the box after a tool is pressed
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      When the tool "Bold" is pressed
      Then the description has the focus

  Rule: Preview shows the note as a reader will see it, and only what there is of it

    Scenario: Preview shows the title as a heading of the second level
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When the description's tab "Preview" is chosen
      Then the preview's heading is "Lunch is at noon"

    Scenario: Preview draws the description from its Markdown
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "In the **clubhouse**" is typed in the description
      When the description's tab "Preview" is chosen
      Then the preview draws "clubhouse" bold

    Scenario: Preview shows HTML as the characters it is
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "At <b>noon</b>" is typed in the description
      When the description's tab "Preview" is chosen
      Then the preview says "At <b>noon</b>"

    Scenario: A link in the preview is one the site does not vouch for
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "See [the draw](https://example.com/draw)" is typed in the description
      When the description's tab "Preview" is chosen
      Then the preview's link "the draw" is marked as not vouched for

    Scenario: A note with no title yet has no heading in the preview
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "In the **clubhouse**" is typed in the description
      When the description's tab "Preview" is chosen
      Then the preview has no heading

    Scenario: A note with no description shows its title alone in the preview
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch is at noon" is typed as the "Title"
      When the description's tab "Preview" is chosen
      Then the preview shows no description

    Scenario: The preview of a note with neither says nothing
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      When the description's tab "Preview" is chosen
      Then the preview says nothing

  Rule: What is refused is said beneath the field it is about

    Scenario: A missing title is refused beneath the title
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      When "Add" is pressed
      Then "Title" is refused with "ManagerNoteTitle.Missing"

    Scenario: A title with no letter or digit is refused beneath the title
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "???" is typed as the "Title"
      When "Add" is pressed
      Then "Title" is refused with "ManagerNoteTitle.NoLetterOrDigit"

    Scenario: A title with no letter or digit is refused in words that say why
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "???" is typed as the "Title"
      When "Add" is pressed
      Then the title is refused in the words for "ManagerNoteTitle.NoLetterOrDigit"

    Scenario: A description too long is refused beneath the description
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch" is typed as the "Title"
      And a description of 750001 characters is typed
      When "Add" is pressed
      Then the description is refused with "ManagerNoteDescription.TooLong"

    Scenario: A description refused from Preview is shown on Write
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "Lunch" is typed as the "Title"
      And a description of 750001 characters is typed
      And the description's tab "Preview" is chosen
      When "Add" is pressed
      Then the description's tab "Write" is the one being read

    Scenario: A refused note is not added
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      When "Add" is pressed
      Then "Spring Open" has no manager notes

    Scenario: A refused panel stays
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      When "Add" is pressed
      Then the note panel is shown

    Scenario: A refused panel keeps what was typed
      Given the notes of "Spring Open" are open
      And "Add Note" is pressed
      And "In the **clubhouse**" is typed in the description
      When "Add" is pressed
      Then the description says "In the **clubhouse**"

  Rule: Every word the panel says is in the reader's language

    Scenario: The panel to add a note is in the reader's language
      Given a browser that asks for "en-XA"
      And the notes of "Spring Open" are open
      When the way to add a note is pressed
      Then every word in the note panel is in the test locale

    Scenario: The toolbar's names are in the reader's language
      Given a browser that asks for "en-XA"
      And the notes of "Spring Open" are open
      When the way to add a note is pressed
      Then every tool's name is in the test locale

  Rule: The panel is laid out for a phone first

    Scenario: The panel is no wider than the window
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the note panel is no wider than the window

    Scenario: The toolbar is no wider than the dialog
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the toolbar is no wider than the note panel

    Scenario: A tool can be pressed with a thumb
      Given the notes of "Spring Open" are open
      When "Add Note" is pressed
      Then the tool "Bold" is at least 44 pixels tall
