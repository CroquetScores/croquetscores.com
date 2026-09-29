@browser
Feature: Forms are shown in a dialog

  Every form on the site is shown the same way, so that a reader who has filled
  in one knows where to look on the next: what the form is for across the top,
  what to fill in beneath that, and the buttons beneath that, the one that does
  it first.

  A form is the whole of the page it is on. It takes the place of the white
  panel other content sits in, and stands on the page's own background.

  This covers forms that are a page's purpose — registering, signing in. The
  theme choice in the footer is a control rather than a form of that kind, and
  keeps the shape it has.

  The register page is the first form, and until there are accounts it is a
  stand-in: it has the shape registering will need and does not pretend to
  register anyone. It is here so that the dialog has a real page to be shown on,
  and it is replaced by the real thing when accounts arrive.

  The register page needs scripting, because registering is guarded by
  reCAPTCHA, so the scenarios that open it switch scripting on first. The
  dialog itself does not need it: the example form's scenarios, with scripting
  off, are what hold it to that.

  A form shows a message only when its field needs attention, which is
  specified with the form. How a message looks is specified here, against an
  example form that has been refused, because the stand-in has nothing that
  could refuse it.

  Rule: A form takes the place of the panel

    Scenario: There is no panel on a page with a form
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then there is no panel on the page

    Scenario: The dialog stands on the page's own background
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the sign in page is opened
      Then the page is light

  Rule: A dialog reads from its title, to its content, to its buttons

    Scenario: The title bar comes first
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the dialog's title bar is above its content

    Scenario: The buttons come last
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the dialog's buttons are below its content

    Scenario: The dialog is known by its title
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the dialog is named "Sign in"

  Rule: The dialog is centred across the page

    Scenario: On a wide screen there is as much space either side of it
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the dialog has as much space to its left as to its right

    Scenario: On a narrow screen it takes the width it is given
      Given a viewport 375 pixels wide
      When the sign in page is opened
      Then the dialog reaches from one side of the page's gutter to the other

  Rule: The buttons are stacked, the one that submits first, and unmistakable

    A dialog's buttons are stacked beneath the fields, each as wide as they
    are, so that however many a form has and however long their words, none is
    pushed onto a line of its own. The submit button is first, where the eye
    starts. No form has a cancel button: leaving a form changes nothing and goes
    nowhere the site's own bars do not, so the button did nothing for a reader,
    and took room from buttons that do.

    Scenario: It is the first of the buttons
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the submit button is the first of the dialog's buttons

    Scenario: It is still the first button on a narrow screen
      Given a viewport 375 pixels wide
      When the sign in page is opened
      Then the submit button is the first of the dialog's buttons

    Scenario: Every button is as wide as the fields
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then each of the dialog's buttons is as wide as the email address field

    Scenario: A form has no cancel button
      Given a viewport 1200 pixels wide
      When the register page is opened with scripting on
      Then the dialog has no cancel button

    Scenario: It can be pressed with a thumb
      Given a viewport 375 pixels wide
      When the sign in page is opened
      Then the submit button is at least 44 pixels tall

    Scenario: It is the only button that looks like it
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then no other button in the dialog shares the submit button's colour

  Rule: In light, the dialog wears the section navigation's colour

    Scenario: The title bar is the colour of the section navigation
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the sign in page is opened
      Then the dialog's title bar is the colour of the section navigation

    Scenario: The content is white
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the sign in page is opened
      Then the dialog's content is white

    Scenario: The submit button is the colour of the section navigation
      Given a viewport 1200 pixels wide
      And a machine that prefers light
      When the sign in page is opened
      Then the submit button is the colour of the section navigation

  Rule: In dark, the submit button is the lightest thing in the dialog

    The section navigation's dark green, on a dark dialog, reads as a hole
    rather than as the thing to press — the same reason the current section's
    tile turns pale in dark. So in dark the submit button is pale, and the title
    bar keeps the section navigation's colour.

    Scenario: The title bar is the colour of the section navigation
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the sign in page is opened
      Then the dialog's title bar is the colour of the section navigation

    Scenario: The submit button is lighter than the dialog's content
      Given a viewport 1200 pixels wide
      And a machine that prefers dark
      When the sign in page is opened
      Then the submit button is lighter than the dialog's content

  Rule: In either theme, the dialog can be read and its submit button found

    Scenario Outline: The title can be read on its bar
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the sign in page is opened
      Then the dialog's title reads against its bar at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

    Scenario Outline: The submit button stands out from the content around it
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the sign in page is opened
      Then the submit button stands out from the dialog's content at no less than 3 to 1

      Examples:
        | theme |
        | light |
        | dark  |

    Scenario Outline: The submit button's label can be read
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      When the sign in page is opened
      Then the submit button's label reads against it at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

  Rule: A field holds its label until it is used, then lifts it to its top edge

    A field is one line tall. While nobody is using it, its label rests on that
    line, where the typing will go, so the field needs no second line to name
    itself. Once the field is focused, or has something in it, the label lifts
    to sit on the field's top edge: out of the way of what is typed, and still
    there to say what the field is.

    The label lifts for something typed as well as for focus, so that it does
    not fall back over the text when the reader moves on to the next field. It
    comes back down only when the field is left empty.

    On the top edge the label is smaller than it is at rest, so that it names
    the field without competing with what has been typed. It moves in one step.
    It does not slide or fade between its two places.

    Wherever the label is, it stays between its field's sides. The field no
    longer grows to hold its label, so a label that ran past a side would lie
    over whatever is beside the field.

    A label that moves is still a label: it is what a screen reader announces
    for the field, and what a press on it focuses. It is not placeholder text,
    which disappears the moment anyone types.

    Scenario: A field is no taller than the submit button
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then every field in the dialog is as tall as the submit button

    Scenario: A label rests where the typing will go
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then the password field's label rests where its field is typed in

    Scenario: Focusing a field lifts its label
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the email address field is focused
      Then the email address field's label is on the field's top edge

    Scenario: A lifted label is smaller than a resting one
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the email address field is focused
      Then the email address field's label is smaller than the password field's label

    Scenario: A label lifts without animating
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the email address field is focused
      Then the email address field's label is not animated

    Scenario: Focusing one field leaves the others' labels resting
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the email address field is focused
      Then the password field's label rests where its field is typed in

    Scenario: A label stays lifted over what has been typed
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When something is typed into the email address field
      And the password field is focused
      Then the email address field's label is on the field's top edge

    Scenario: A resting label stays between its field's sides
      Given a viewport 320 pixels wide
      When the sign in page is opened
      Then every label in the dialog is between its field's sides

    Scenario: A lifted label stays between its field's sides
      Given a viewport 320 pixels wide
      And the sign in page is open
      When the email address field is focused
      Then the email address field's label is between its field's sides

    Scenario: A label comes back down when its field is left empty
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the email address field is focused
      And the password field is focused
      Then the email address field's label rests where its field is typed in

    Scenario: Pressing the field's border reaches the field it names
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the field's border is pressed where nothing can be typed
      Then the field it names is focused

    Scenario Outline: A lifted label can be read
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      And the sign in page is open
      When the email address field is focused
      Then the email address field's label reads against what is behind it at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

  Rule: A field that needs attention says so beneath itself

    A message is shown only when its field needs attention. These scenarios
    check where a message sits, how it looks and how it is announced, on the
    example form once it has been sent a start below zero, no end and no
    passphrase, so that several fields have a message to look at.

    A field nobody has typed in is not in error, and a screen reader should not
    be told it is.

    Scenario: Nothing is said to be wrong before anything has been typed
      Given a viewport 1200 pixels wide
      When the sign in page is opened
      Then no field in the dialog is marked as wrong

    Scenario: A message sits beneath its field
      Given a viewport 1200 pixels wide
      And the example form is open
      And "-1" is typed into the start field
      And the dialog is submitted
      Then every message in the dialog sits beneath its field

    Scenario: The messages are bold
      Given a viewport 1200 pixels wide
      And the example form is open
      And "-1" is typed into the start field
      And the dialog is submitted
      Then every message in the dialog is bold

    Scenario: A message is announced with its field
      Given a viewport 1200 pixels wide
      And the example form is open
      And "-1" is typed into the start field
      And the dialog is submitted
      Then every message in the dialog is announced with its field

    Scenario Outline: The messages are red
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      And the example form is open
      And "-1" is typed into the start field
      And the dialog is submitted
      Then every message in the dialog is red

      Examples:
        | theme |
        | light |
        | dark  |

    Scenario Outline: The messages can be read
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      And the example form is open
      And "-1" is typed into the start field
      And the dialog is submitted
      Then every message in the dialog reads against its content at no less than 4.5 to 1

      Examples:
        | theme |
        | light |
        | dark  |

  Rule: A field the browser fills in looks like any other field that has been filled in

    A browser that has an email address and a password saved for the site
    fills them in for the reader, and does two things to the field as it does.
    It paints the field its own tint, which under a label on the panel's colour
    reads as a patch rather than a field. And it can fill the field in before
    anybody has touched the page, when the field may still count as empty to
    the stylesheet, so that a label waiting for something to be typed would
    stay at rest, lying over the address that was filled in. So a field the
    browser fills in has its label lifted, as one that has been typed in does,
    and is the colour of the dialog around it.

    A scenario cannot have a browser fill a field in for itself: it has nothing
    saved, and typing into the field, which a scenario can do, brings neither
    the tint nor the empty-seeming field. Chromium can be told to take a field
    as filled in by it, which brings both, and that is what these scenarios
    do.

    Scenario: A field the browser fills in has its label lifted
      Given a viewport 1200 pixels wide
      And the sign in page is open
      When the browser fills the email address field in
      Then the email address field's label is on the field's top edge

    Scenario Outline: A field the browser fills in is the colour of the dialog
      Given a viewport 1200 pixels wide
      And a machine that prefers <theme>
      And the sign in page is open
      When the browser fills the email address field in
      Then the email address field is painted the colour of the dialog

      Examples:
        | theme |
        | light |
        | dark  |
