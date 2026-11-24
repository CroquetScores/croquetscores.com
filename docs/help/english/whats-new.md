# What's new

## Released 2026-11-24

- **A block's summary gives net games as well as net hoops.** Where a block's matches are the best of more than one game, its summary gives wins, losses, net games and net hoops, since net games decide a tie before hoops do. A block of single games gives wins, losses and net hoops as it did. The summary no longer says how its players are ranked.

- **A competition's tile in the section bar is as wide as its name.** A short name such as "Block A" had a tile as wide as a long one, so the bar ran out of room sooner than it had to.

- **On a phone the home page's dates take less room.** The dates' column is as wide as a weekend's dates, such as "19-21 Nov", and the names have the rest. Dates that run from one month into another break before the hyphen, so the second line begins with it. In **Your Recent Tournaments** a tournament of this year says no year, and one of another year says it beneath its dates.

### For app developers

- **An app can change things, with a key made to write.** What the website's own pages change is changed by the same addresses at `/api/v0`: making a tournament, its competitions, players, teams and games, and who may manage and score it. A key may do what the account it was made for may do, and a scorer's key may do what is done with scores and nothing else. **The API's POST endpoints** in the help say what each address takes and answers. They are still being settled, and some will be taken away.

- **An app can ask what a tournament can be.** The sports, the formats and the countries with their regions are at `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` and `/api/v0/countries`, in the language the app asks for, so that what it makes a tournament with is what the website offers.

- **An app can read the world ranking players and their games.** The Association Croquet players the world rankings know are at `/api/v0/ac/world-ranking-players`, and each player's games, in the order they were added, are at the address the player says. The names are brought up to date from the rankings when the list is asked for from its start, at most once an hour.

- **The API's endpoints are two pages in the help, one for the GET endpoints and one for the POST endpoints,** in every language.

- **A player of the Association Croquet rankings is kept by the number the rankings give them.** A player the rankings rename is the same player, one that drops off the list is archived and not forgotten, and one listed again is no longer archived. A list that gives one name to two players, or one number to two names, is refused whole and nothing is changed, and the administrator is told by email.

## Released 2026-11-22

- **The home page keeps the tournaments you looked at lately.** Opening a tournament puts it first in **Your Recent Tournaments**, between the filter and the recent results, up to five of them, so that you can go back to the ones you follow without finding them in the lists. It is kept on your own device, in a cookie that holds the addresses of the tournaments and nothing else, and the list is not shown at all until you have opened one. The help says what the cookie is.

- **The upcoming tournaments include the ones that started in the last two days.** A tournament that has started and not finished is listed until the day it finishes, as long as it started no more than two days ago, so on the days it is played it can be found before anybody has scored a game in it. The ones that started longer ago are in the recent results once a game is added.

- **A knockout says what each round's matches are the best of.** Above each round of a knockout's grid, and beneath each round's name in its summary, it says "Best of 3", or whatever the tournament manager chose for that round.

- **A score fits in its box in a knockout's summary, and a name stays together in a block's summary.** On a narrow screen an Advantage score written as "83% (5/6)" ran out of its box over the names, and a name in a block's summary could break after its first name. A pair is kept together on each side of its ampersand.

- **You can put the site on your phone's home screen.** A button in the footer offers it when your browser can, and **Add the site to your home screen** in the help says how, for an iPhone and for an Android phone. Croquet Scores and Gateball Scores have an icon each, so that you can tell them apart.

- **The croquet regions of New Zealand are listed.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury and the others New Zealand's national tournaments are split into can be chosen as the region of a tournament.

### For app developers

- **There is a public API.** An app can read a year's tournaments, a tournament with its competitions and players, a competition's games and standings, the tournaments that have changed year and the tournaments that have been archived, as JSON, at `/api/v0`. It is `v0` while it is in development. Anybody may read, and an app that sends a key made under **API Keys** in your account has an allowance of its own, 60 requests a minute and 10,000 a day to begin with. An app with no key shares an allowance by its address, 10 a minute and 500 a day.

- **A key lets an app act for you without your password.** Make a key in your account, say what it is for, and revoke it when you no longer want it used. A key may be made to read only or to read and write, and may be limited to one tournament. The API only reads for now. Only a hash of the key is kept, so the key is shown once, when you make it.

- **Fields may be added to an answer without a new version.** An app must ignore a field it does not know. A change that would break an app is made as a new version beside the old, so an app written against `v1` keeps working when `v2` arrives. **Help for app developers** and **The API's endpoints** in the help say what each address takes and answers, in every language.

- **A handicap in the API is a number.** It is `4.5` and not `"4.5"`, and `null` where a player has none.

### World ranking officers

- **A second spreadsheet of Golf Croquet games has the day each was entered.** Add `rankings2` to the address, where `rankings` is, and column I says the day each game was entered, as an Excel date, in the time of the place the tournament is played. The Rankings tab offers it as **Download games for world ranking with game date**. The first spreadsheet is as it was, since the officers' software reads it by position.

## Released 2026-11-15

- **A doubles pair is one player in the search, whichever of its two players is named first.** "Sam Someone & Alex Another" and "Alex Another & Sam Someone" were two entries on the players page, and so were "Peter & Rosie Landrebe" and "Rosie & Peter Landrebe". They are now one, at one address, listed by the name the most recent tournament wrote.

- **A doubles pair can be written with a slash, a plus or the word "and", as well as an ampersand.** "Sam Someone / Alex Another", "Sam Someone + Alex Another" and "Sam Someone and Alex Another" are all read as a pair. The word "and" counts only on its own, so a name such as "Sam Anderson" is not taken for a pair.

- **A pair is said shortly in Swiss results and block grids.** A Swiss result gave the first initial of the first player and the last name of the second. It now says each player, as "T. Murphy & A. Sharpe", and a last name that both share is said once, as "R. & P. Landrebe". The columns of a block grid are headed by each player's initials joined by an ampersand, such as "TM&AS", or "RL&PL" for a shared last name.

- **Guatemala is listed with the countries nobody has played in lately.** It was drawn with the countries tournaments have been played in since 2025.

- **The site counts how many readers come and which pages they read.** It does so with Cloudflare's web analytics, on every page readers see. The pages managers work in are not counted. This is cookie free and does not identify the user in any way other than their IP address.

- **The tournaments are published as files anybody can use.** Every public tournament, of croquet and of gateball, is written as a file of its own, with its players and competitions, or its teams and tests where it is played by teams, withdrawn games included and said to be withdrawn. They are kept in a Git repository, `CroquetScores/data.croquetscores.com`, which is brought up to date every hour, so you can rank the results or build something from them, and a correction shows as a change with a date on it. No account, email address, note or comment is in a file, and nor is anything archived or from a try website.

### In case of an emergency

- **There is a page for somebody who has to take the website over.** If the person who runs the website cannot, because they are ill or away for a long time, anyone signed in can open **In case of emergency** in the admin, say who they are and why they are taking it on, and press Send. After a confirmation, what they said is emailed to the people who hold the password to the note that has everything the website needs, with replies coming to the sender. An account may ask once in 48 hours, and is told when it may ask again. The page opens with a warning not to use it unless the administrator has been emailed and has not answered in 48 hours, and not to test it. Once the message is sent, the page says so and asks nothing more.

## Released 2026-11-11

- **The menu on a phone is put away by pressing outside it.** The menu behind the button at the top of a narrow screen shuts when you press anywhere else on the page, as well as when you press the button again or follow a link.

- **The account menu is put away by pressing outside it.** The person at the end of the header, which opens on registering, signing in and the rest, shuts when you press anywhere else on the page, as well as when you press it again.

- **Pinch and pull to change the size of the text.** On a touch screen, pinch with two fingers to make the text smaller and pull them apart to make it larger, to between half and twice its usual size. Unlike the browser's own zoom, the page stays as wide as the screen, so you are never left scrolling sideways to read a line. The size is kept, so it is the same on every page and on every visit. One finger still scrolls as before.

- **The menu on a phone scrolls.** On a short screen the menu is no taller than the screen and scrolls within it, so every item can be reached, and the page behind it stays where it was until the menu is shut.

- **The Spanish has been improved by Pedro Echeguren.** Pedro reviewed the Spanish words of the site and corrected them. Thank you, Pedro.

## Released 2026-11-10

Croquet Scores has been completely rewritten. I hope you like the new version.

### Finding things

- **Search.** Every page has a search box at the top. Type a name and press Search to find tournaments, competitions and players.

- **Narrow the tournaments by country, state or province, and sport.** On the home page, choose a country to see only the tournaments played in it. Once you have chosen a country you can choose a state or province of it, and you can choose a sport as well. Your phone or computer remembers what you chose, and starts from it the next time. **Choosing a state or province only finds new tournaments.** Older ones were not given a state or province, so choosing one leaves them out.

- **Narrow the tournaments by days.** Give a first day and a last day, together, and only the tournaments that start between them are listed. Both days are included.

- **A year's page shows its months.** Each month is listed closed, saying how many tournaments start in it. Press a month to open its tournaments, and open as many as you like. **+ Show all** opens every month.

- **Long lists are in pages.** A list of tournaments shows a hundred at a time, so a wide search no longer loads every row at once.

- **The help finds an answer by what you mean.** Ask a question in the search box on the help's first page, and it finds the article even where the article uses other words that mean the same. The first page also offers popular questions and the subjects as cards.

### Following a tournament

- **Notes from the managers.** A tournament's managers can now write notes to tell its players what they need to know as it is played: the format, a change to the order of play, the time of lunch. They are in the tournament's new Notes section, with the newest first and how long ago each was written.

- **An asterisk (\*) marks what you have not read.** A note has one until you open it, and again if it is changed after you read it. While any note is unread, the Notes section has one too, on every page of the tournament, so you can see there is news without going to look. Commentaries are marked in the same way. Your browser remembers what you have read, so you do not need to sign in. Another phone or computer starts with nothing read.

- **Commentary is easier to follow.** On the old site, every new comment threw the page down to the bottom, so anyone looking back through earlier comments lost their place. Now the page only moves down to a new comment if you are already at the bottom, reading the latest. If you have scrolled back to read earlier comments, it leaves you where you are.

- **A block shows where each player is placed.** The last column gives each player's place: 1, or =2 where players cannot be told apart and share second. Where players are level on the matches they have won, a line beneath says how they were told apart.

- **The order of play can be sorted.** Press Game to sort the games by the winner's name, or Date to sort by when each was added. Press again to turn them round. The site remembers how you sorted, for every competition and for the lists of tournaments too, and a link beneath a list, Back to the usual order, forgets it.

- **Handicaps are shown.** Where a player has a handicap, it is after their name, with what they represent, as in Tim Murphy (4, Australia).

- **A competition says how many hoops its games are played to** where that is not the usual for its sport, as "Played to 14 hoops".

### The site

- **Your language.** The site is now in twelve languages: Afrikaans, Arabic (Egypt), Czech, English, German, Greek, Latvian, Norwegian, Portuguese, Spanish, Swedish and Welsh. You are shown the first language your browser asks for that the site has, or English if it has none. To choose another, use the list in the footer at the bottom of any page and press the button beside it. If you would like a language added, email <croquetscores@gmail.com>.

- **Light or dark.** Also in the footer: choose Light, Dark or System. System follows your phone or computer. The site remembers your choice on every page and every visit.

- **Which version you are on.** The footer now shows the version of the site you are looking at, such as v234. If you report a problem, please say which version it was.

- **Your data.** The page /data-deletion-policy says how to have what the site keeps about you deleted, what is deleted and what is kept.

### Open Source

The code is now open source, under the GNU Affero General Public License version 3 (AGPL-3.0). Anyone may read it, use it and change it, and anyone who runs a changed version as a website must share their changes under the same license.
