# Running the beta

For whoever runs the beta. What the testers are told and asked to do is in the repository's `BETA.md`, which is written to be pasted into an email. This says the rest: what the operator fills in, what counts as a problem, who reads the logs, and what has to be true before the second week opens.

The beta runs for two weeks: a week for half a dozen people the operator chose, then a week for anybody who wants to try. It is a try of the whole site by people playing the parts it is for, not a hunt for typing mistakes. A tester who does what a tournament manager or a reader would do on a Saturday, and says where it got in their way, has done the job.

## 1. Before the first tester starts

These are filled in. They are also in `BETA.md`, which is what a tester is sent, so a change to one is a change to the other.

- **The address of the beta site:** https://beta.croquetscores.com
- **Where a tester reports a problem:** croquetscores@gmail.com
- **Who looks at the logs, and how often:** Tim Murphy, once every day.
- **What the testers are told about the data:** Entries may be lost.

**The beta's data is a copy, and is thrown away.** The new site's database was filled from a copy of the old site's production data, taken just before the beta opened. Nothing a tester does on the beta site is written to the old site's production data, so a tester who already has an account on croquetscores.com has a copy of it here: what they do to it here, including changing its password or forgetting it, does not touch their real account. Inside the new site, the beta site counts as `croquetscores.com` for what is kept and read (README.md §2), so what is entered on one is seen on the other, and is all in that copy.

**When the beta closes, nothing entered during it is kept.** The new site is made the live one, and the old site's production data is imported into an empty database for it (TODO.md, The cutover from the old sites). That import is also what should be rehearsed and timed before the day. Anyone who made a real change on the old site between the copy and the closing is in that import, and anything done on the beta site is not.

## 2. What counts as a problem

- **A tester cannot register, sign in, or get back in.** Stops the beta until it is understood.
- **A score or an entry is lost, or somebody sees what is not theirs.** Stops the beta until it is understood.
- **An email does not arrive in a quarter of an hour.** Looked at the same day. The mail provider's records are the first place to look (server-setup.md §4).
- **A page is wrong, slow, or broken on a phone.** Written down, and mended in the order it hurt.
- **Something is awkward but works.** Written down, and weighed against the others at the end.

## 3. Looking at the logs

Whoever is named in §1 reads the log once every day of the beta, with the commands in server-setup.md §7, looking for `500` answers (each carries a correlation id, which a tester's report can be matched to), emails that failed to send, and emails to the administrator saying the database could not be reached. Each is a problem to be reported by the operator as a tester's would be.

## 4. Before the second week opens to anybody

All of these, and the second week is not opened until they are:

- Nothing under "stops the beta" in §2 is open.
- Every email the first week sent arrived.
- A backup has been restored into an empty database, and the site read from it (backup-and-restore.md §7).
- Every tester has been asked whether anything stopped them that they did not report.
- The operator has said, in writing here, what changed because of the first week.

## 5. What the two weeks are judged by

The beta has done its job when a tournament manager who had never seen the site ran a tournament from creating it to its results being public, with nobody beside them, and a reader found the results on a phone. Where that did not happen, the report says where it stopped, and production waits for it.
