# BETA.md — The beta testing plan

How the beta is run, for whoever runs it and for the testers. It can be handed to somebody who has never seen the site.

The beta runs for two weeks: a week for half a dozen people the operator chose, then a week for anybody who wants to try. It is a try of the whole site by people playing the parts it is for, not a hunt for typing mistakes. A tester who does what a tournament manager or a reader would do on a Saturday, and says where it got in their way, has done the job.

---

## 1. Before the first tester starts

The operator fills these in below and sends the plan only then.

| What                                     | Fill in              |
| ---------------------------------------- | -------------------- |
| The address of the beta site             | `__________________` |
| Where a tester reports a problem         | `__________________` |
| Who looks at the logs, and how often     | `__________________` |
| What the testers are told about the data | Entries may be lost. |

The last row is not a blank: whatever is entered during the beta may not be kept (TODO.md says why), and every tester is told so before they begin.

---

## 2. What a tester is asked to do

In this order, because each step needs the one before. A tester who cannot finish a step stops there and says so, rather than finding another way round.

1. **Register with an email address and a password.** Confirm the email address from the email that arrives. Say how long the email took.
2. **Sign out, and sign in again.**
3. **Forget the password and set a new one** from the link that is emailed.
4. **Sign in with Google**, with an account that has not been used on the site, if Google is offered.
5. **Change the name** the site shows, and look at the profile.
6. **Create a tournament**, following _Running a standard tournament_ in the help (`/help`), or _Running a tournament played by teams_ for a team event. Enter its players, make a block, and enter the scores of some games.
7. **Look at what the public sees**: the tournament's pages, the block's table, a player's page, the rankings, signed out and on a phone.
8. **Start a commentary** on the tournament, add a comment, and edit it.
9. **Make somebody else a manager** and have them change something, where two testers are working together.
10. **Search** for a player and a tournament.
11. **Forget the account**, last, if the tester is willing.

Each tester does these on a phone as well as a computer, at least once: most people reading a score will be on one.

---

## 3. How a problem is reported

A report says four things: what was being tried, what was expected, what happened, and the address of the page. A screenshot where there is one. A report need not say why.

A problem is reported when it happens, not at the end of the week.

---

## 4. What counts as a problem

| Kind                                                             | What is done                                                                    |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| A tester cannot register, sign in, or get back in                | Stops the beta until it is understood                                           |
| A score or an entry is lost, or somebody sees what is not theirs | Stops the beta until it is understood                                           |
| An email does not arrive in a quarter of an hour                 | Looked at the same day; the mail provider's records are the first place to look |
| A page is wrong, slow, or broken on a phone                      | Written down, and mended in the order it hurt                                   |
| Something is awkward but works                                   | Written down, and weighed against the others at the end                         |

---

## 5. Looking at the logs

Whoever is named in section 1 reads the log once each morning for the first week, looking for `500` answers (each carries a correlation id, which a tester's report can be matched to), emails that failed to send, and emails to the administrator saying the database could not be reached. Each is a problem to be reported by the operator as a tester's would be.

---

## 6. Before the second week opens to anybody

All of these, and the second week is not opened until they are:

- Nothing under "stops the beta" in section 4 is open.
- Every email the first week sent arrived.
- A backup has been restored into an empty database, and the site read from it.
- Every tester has been asked whether anything stopped them that they did not report.
- The operator has said, in writing here, what changed because of the first week.

---

## 7. What the two weeks are judged by

The beta has done its job when a tournament manager who had never seen the site ran a tournament from creating it to its results being public, with nobody beside them, and a reader found the results on a phone. Where that did not happen, the report says where it stopped, and production waits for it.
