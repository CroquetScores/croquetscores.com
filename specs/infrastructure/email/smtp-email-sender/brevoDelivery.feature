# 16 Oct 2026 - Test run and email received.
#
# Commented out: each run sends a real email to a real inbox. Uncomment it to
# try the Brevo settings by hand, and comment it out again.
#
# Feature: Sending a real email through Brevo
#
#   Every other scenario of the SMTP sender (`SmtpEmailSender.feature`) sends to
#   a mail server of its own making. This one sends a real email through the mail
#   server the site is set up with, to a real inbox, so that somebody who has
#   just filled in the SMTP settings can find out that they work. It is for
#   running by hand, and it is commented out to keep it out of the runs that happen on
#   their own: each run is an email in somebody's inbox.
#
#   It stops at the mail server taking the email. That the email then arrives,
#   and is not taken for junk, is for whoever owns the inbox to see.
#
#   Scenario: A test email is taken by the mail server
#     Given the SMTP settings in the .env file
#     When a test email is sent to "croquetscores@gmail.com" through the mail server
#     Then the mail server takes the test email
