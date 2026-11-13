# In case of emergency

What to do if Tim Murphy, who runs the website, cannot: because he is ill, away for long time, or has died. Written for the technical person who has been asked to take it over, or who has found this and means to. Nothing in it is secret, because this repository is public. Everything that is secret is in one LastPass note, and §1 says how to get a copy of it.

Nobody is expected to run the website but you. Nicole and Peter, named below, are only the people who can open the note.

## 1. Getting in

Every password, key and sign-in the website needs is in one LastPass secure note titled `Croquet Scores`. It is not in the repository and never will be. Two people, Nicole Murphy and Peter Murphy, can open Tim's LastPass and give you a copy of that note.

Their email addresses are not written here, because this repository is public. Ask for them on the website instead:

1. Sign in to the website, registering first if you have no account: https://croquetscores.com. Only somebody with an account can ask, so that they are told who is asking.
2. Open https://croquetscores.com/admin/in-case-of-emergency.
3. Say who you are, who asked you or why you are taking this on, and press Send. You are asked to confirm before anything is sent.

What you say is emailed to Nicole and Peter, with the name and email address of your account, and their replies come to that address. You may ask once in 48 hours, so say enough the first time.

They are not responsible for the website, may know little about it, and may be grieving or worried. Expect them to want to be sure of you before they hand over what is the whole of the website, and give them what they need to be: a way to reach you, and somebody who can speak for you. Ask them for a copy of the `Croquet Scores` note, and for nothing else from Tim's LastPass.

**If the website is down,** the page is too. Then Nicole and Peter have to be found some other way, through whoever knew Tim: his family, or the executor of his estate.

What the note holds: the server's root password, the website's settings file with its two account keys, and the sign-in for each company it depends on. Those are Kamatera (the server), Cloudflare (the names), the company the two domain names were bought from, Brevo (the emails the site sends), Anthropic (the morning summary), GitHub (the code) and Google (the `croquetscores@gmail.com` mailbox). If Tim wrote down what he wants done with the website, it is at the top.

## 2. What the website is

A website for keeping the scores of croquet and gateball tournaments, so that people can enter results and everybody else can watch them. It answers to four names: croquetscores.com, gateballscores.com, and a `try` version of each. It is one program on one rented server in London, with its own database on the same server. People other than Tim use it to run real tournaments, and have accounts with their names and email addresses on it.

It is built to look after itself, so there is no hurry in the first days. The rest of this is about what it cannot do alone. The documents beside this one, in `docs/website/`, were written for somebody who has never seen the repository: start with [README.md](README.md). The code is at https://github.com/CroquetScores/croquetscores.com.

## 3. What happens if nobody does anything

**Keeps going, by itself:**

- The program starts again if it crashes.
- The padlock on the website (its certificate) renews itself.
- The server installs its own security updates.
- The tournaments are copied to a public page on GitHub every hour.
- The hosting company keeps a daily copy of the whole server.

**Stops, or goes out of date:**

- **Payments.** The server, the two domain names and the other services are paid for, mostly by Tim's cards. When a card expires or is cancelled they lapse. A lapsed domain name is the worst: somebody else can buy it, and the website cannot be got back under that name.
- **The copy kept away from the server.** Every day Tim's own computer copies the website's data to a folder on it. When that computer is off or gone, those copies stop, and what is left is the hosting company's daily copy.
- **Anybody reading what the website says.** It emails `croquetscores@gmail.com` each morning with what went wrong, and about each backup. If nobody reads those, a fault can sit for a long time.
- **The monthly look.** Once a month Tim checks the server's disk space and updates (operations.md §5).

A short time with nobody doing anything is not a danger. A long time is, because of payments and the unread mailbox.

## 4. Your first days

In this order, once you have the note.

1. **Check it is up.** Open croquetscores.com and gateballscores.com, and a tournament on each. For whether the program is answering, open `https://croquetscores.com/api/site/health`, which should show `{"status":"ok"}`.
2. **Keep the payments going.** Find each company in the list in §1, and see that its card or account will not lapse before a decision is made. The domain names matter most. If Tim's card is about to be cancelled, put the payment on one of yours, and keep a note of what you took over.
3. **Read the `croquetscores@gmail.com` mailbox** and keep it open. A subject beginning `WARNING:` is a fault. People may also write for help: answer those who can be answered, and be honest that Tim is not there.
4. **Do not wipe, sell or reset Tim's computer or phone** until you have copied what is on it. The usual way into the server, the folder of daily copies of the data and the schedule that makes them are there (recovery.md §1). Ask whoever has the computer to keep it.
5. **Get into the server without Tim's computer.** Passwords for the server are off and the usual key is on his computer, but Kamatera's own console and the root password from the note are another way, and [recovery.md](recovery.md) §3, step 4, says how, and how to make a key of your own.
6. **Make a copy of the data now,** while everything is working: [backup-and-restore.md](backup-and-restore.md). You can then do what follows without hurry.

**Do not do any of these,** because each cannot be undone:

- Delete, rebuild or "reinstall" the server in Kamatera's console. The database is on it.
- Change or "refresh" any key in the settings file. Two of them can never be changed, and if they are lost every person's name and email address on the website is unreadable for good (backup-and-restore.md §4).
- Restore a backup onto the running website. That is for when the server is lost (backup-and-restore.md §7).

## 5. Where things are written

- **The website is down or showing errors** — [operations.md](operations.md) §1 and §4
- **The server is lost** — [backup-and-restore.md](backup-and-restore.md) §7. It needs a copy of the data and the two account keys from the note
- **Putting up a change** — [deploying.md](deploying.md)
- **A key or password is lost** — [recovery.md](recovery.md) §4
- **Every setting, and what each is for** — [configuration.md](configuration.md)
- **Setting a server up again from nothing** — [server-setup.md](server-setup.md)

## 6. If Tim is ill or away

He may come back, so take over only what the time needs: the first-days list in §4, the daily watching (operations.md §2), and the payments. Do not change how the website is run. Tell Nicole or Peter what you have done, so that Tim can be told.

## 7. If Tim has died

The decisions here belong to Tim's family and to the executor of his estate, and you should take them with them. The code is Tim's own work, published for anybody to use under an open licence. The domain names and the accounts with each company were his, and the companies will deal with the executor. This is not legal advice.

Tim's wishes are at the top of the note if he wrote any. Otherwise there are three ways, and no deadline. The worst outcome is the quiet middle, where it is paid for, unwatched and left for years.

- **Keep it going under somebody else.** That may be you. Move the accounts and the domain names to the new owner's name, make them an owner of the project on GitHub, and change every password in the note, since it has been seen by others.
- **Hand it to somebody who wants it,** such as an association that uses it, with the domain names. This is the same as above, with a different owner.
- **Close it in an orderly way.** Tell the people who run tournaments, with enough notice that none is left half done. The tournaments are already published as files at `CroquetScores/data.croquetscores.com` on GitHub, so their results are not lost. Keep one copy of the data until nobody could still need it. Then cancel the server, and the domain names last, since a domain name given up can be taken by anybody. The website holds the names and email addresses of people with accounts, under a promise on its privacy page (`/privacy`): whoever closes it should delete what it holds, backup files and the hosting company's copies included, as that page says.

## 8. Telling people

The people who rely on the website are the organisers of tournaments and the players. If it is going to be down for some time, or to close, a short plain message is kinder than silence: what has happened to the website, what happens next, and when they will hear again. Do not promise more than is known. The places they look are the website itself and the `croquetscores@gmail.com` mailbox.

## 9. Tim's part: keeping this true

This is only as good as the note and the people it names. Tim goes through this once a year, and whenever something below changes:

- Nicole and Peter know they are named here, are willing to be, and know that what is asked of them is only to give a copy of the note to somebody who comes for it.
- Nicole and Peter can sign in to LastPass, including its second code: the recovery codes are somewhere they know about, and not only on Tim's phone.
- `EMERGENCY_CONTACT_EMAIL_ADDRESSES` is set to their two addresses in `/etc/croquetscores/environment` on the server, and in the note with the rest of the settings. Without it the page says the site has nobody to ask (configuration.md §3).
- Their addresses still work, and each can be reached other than through this page, since this page is no help while the site is down.
- The note `Croquet Scores` has the whole of the production settings file, with both account keys matching what the server is using (configuration.md §4), the server's root password, the sign-in for each company in §1 (the domain names' company especially), and the password for the `croquetscores@gmail.com` mailbox.
- The folder of daily copies is also somewhere other than Tim's computer (recovery.md §2), so that a lost computer does not take the only off-server copy.
- Somebody other than Tim can own the project on GitHub.
- Tim's wishes for the website are at the top of the note, in his own words.
- Tim's will, or the person who holds his affairs, says who has the domain names and the website.
