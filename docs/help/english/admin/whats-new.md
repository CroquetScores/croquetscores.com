# What's new for Tournament Managers

## Released 2026-11-22

### The tournament

- **The croquet regions of New Zealand can be chosen.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury and the other regions New Zealand's national tournaments are split into are listed as the region of a tournament, beside the provinces.

- **The email about a national or international status that has been removed says so.** When the administrator takes the status away from a tournament, the email to its managers now says that it has been removed, and asks you to say why you disagree if you do. It gives the Australian Open as an example of a national event, and the WCF Association Croquet Singles as an international one.

### Players

- **A world ranking name the world rankings do not know follows a corrected name.** Correcting a name used to leave the **World Ranking Player Name** as it was, so a player added as "aaa" and corrected to "Tim Murphy" was still known to the rankings as "aaa". Where the rankings do not know the name the player was opened with, it now becomes the corrected name as you type it, until you type in the world ranking name yourself. One the rankings know, shown by the tick beside it, is kept.

- **A handicap is shown as the number it is.** The list of players shows "4" for a handicap you typed as "4.0" and "4" for "+4". A handicap with a fraction, such as "-1.5", is shown as it is. You may still type it with a sign or a point.

### Apps

- **An app can read your tournaments from the site's API.** The site has a public API (see **Help for app developers**), which only reads for now. You can make a key under **API Keys** in your account to give an app an allowance of its own: it may be made to read only, or to read and write, it may be limited to one tournament, and you can revoke it at any time. Keep a key as secret as a password.

### What the public sees

- **The upcoming tournaments on the home page include a tournament that started in the last two days.** A tournament is listed from sixty days before it starts until the day it finishes, but one that started more than two days ago is left out. So on the days it is played it can be found before anybody has scored a game in it, and after the first two days it appears in the recent results once a game is added.

- **A knockout says what each round's matches are the best of.** Above each round of a knockout's grid, and beneath each round's name in its summary, it now says "Best of 3", or whatever you chose for that round, so that nobody has to count the score cells to learn it. See [What the public sees](../tournament-managers/standard-tournament/what-the-public-sees.md).

## Released 2026-11-15

### The tournament

- **The two ticks for a national or an international event are boxed under "Optional".** On the page that creates or changes a tournament, **National-level event** and **International-level event** were the only things asked below the subtitle, and some people took them for a choice that had to be made. A tournament need be neither, and the box now says so. The word is added in every language of the site, and the translations other than English want a native reader's eye.

- **A tournament made only as a test may be archived by the administrator, who tells you.** Somebody learning the site sometimes makes a tournament on the real website that was only ever a test. The administrator can now archive it and email its managers, naming a try website to practise on. Nothing is deleted, so an archived tournament can be restored. Managers who have forgotten their accounts, and scorers, are not emailed.

### Players

- **A doubles pair can be written with a slash, a plus or the word "and", as well as an ampersand.** "Sam Someone / Alex Another" is the same pair as "Sam Someone & Alex Another". The word "and" counts only on its own, so a name such as "Sam Anderson" is not taken for a pair. Where a pair is played in a Swiss or a block, it is said as "T. Murphy & A. Sharpe" in a Swiss result, and as "TM&AS" at the head of a block grid.

## Released 2026-11-11

### The tournament

- **The name of a tournament suggests the names the website already has.** A tournament is often one of a series, played again each year under nearly the same name, so as you type in **Name** on the page that creates or changes a tournament, the names of the website's tournaments are suggested. A name is suggested where it has every word you have typed, in any order and any case, so "CNSW Bronze" finds "CNSW AC Bronze Medal". Choose one with a click, or with the arrow keys and Enter, and change it as you like. Escape puts the suggestions away. A name is suggested once however many tournaments have it, and a tournament you are changing is not offered its own name.

### Competitions

- **A competition opens on its Scores tab once a game has been entered.** Coming back to a competition to enter more scores no longer means pressing **Scores** each time. A competition with no game in use, including one whose only game has been archived, still opens on **Players**. A scorer is shown **Scores** alone, as before.

- **Archiving a competition or a test gives it a number after its name, so that its name can be used again.** A competition made as the wrong kind has to be archived and added again, and the new one can now be given the name the old one had. Archiving "Block A" renames it "Block A (1)", using the first number that no other competition's name ends in. Its address stays as it was, and a competition that is restored keeps the new name. A test archived is numbered in the same way, and is left as it was when a team's short name is changed. See [Competitions](../tournament-managers/standard-tournament/competitions.md).

## Released 2026-11-10

These are the major changes for people who run tournaments. The [help for tournament managers](../tournament-managers/index.md) has all the details.

### Players

- **Players are entered once, into the tournament.** On the old site, players were added inside each competition. Now the tournament's **Players** tab is where you add, correct, order and archive them, and a player corrected there is corrected in every competition they are in and on every public page. See [Players](../tournament-managers/standard-tournament/players.md).

- **Many players can be added at once.** On the **Players** tab, press **Add Players**, beside **Add Player**, and paste a list with a line for each player. Every player on the list is added. The first row of the list names the fields.

- **A doubles pair can be made from two players already entered.** On the **Players** tab, press **Add Pair**, choose the first and the second player, and press **Add Pair** again. The pair is named "Sam Someone & Alex Another", or "Peter & Rosie Landrebe" where both have the same last name. The dialog stays open so that the next pair can be made. See [Players](../tournament-managers/standard-tournament/players.md#adding-a-pair).

- **A player can have a handicap**, such as 4, +4 or -1.5. It is shown after the player's name, with what they represent if there is something, as in Tim Murphy (4, Australia).

- **What a player represents is suggested.** As you type it, the clubs and countries that players have been added representing, in any tournament and in any sport, are suggested. Type two letters to begin.

### Competitions

- **One button adds a competition.** In place of the separate new block, new Swiss and new knockout buttons, press **Add Competition**. The dialog asks for the name, and the kind (a block, a knockout or a Swiss), and then what that kind needs: what each match is the best of, and for a knockout the places in its draw. It stays open so that you can add several at once. A competition's kind cannot be changed afterwards: archive it and add it again. See [Competitions](../tournament-managers/standard-tournament/competitions.md).

- **A knockout can take the losers of another knockout's round.** In the dialog of a knockout, press **Add Losers Knockout**, name it, and choose the round whose losers play on in it. Its players are put there as each match is decided, so you do not enter them by hand.

- **A block can be told how players level on matches won are told apart.** In the dialog of a block, choose its **Tie Breaks**: net games then net hoops then who beat who, who beat who alone, or other, which is no known way, so that players stay level and share a place. A new block begins on net games then net hoops then who beat who.

- **A competition can say the most hoops its games are played to.** In a competition's dialog, **Maximum hoops** takes a whole number of at least 1. Leave it empty for no maximum, and the competition has the usual for its sport: 26, or 13 in golf croquet.

### Players in a competition

- **Players are put into a competition from a list.** On a competition's page, choose a player of the tournament from the drop-down and press **Add Player**. The drop-down offers only players not already in the competition. In a knockout it also offers **Bye** for the places left over. See [Entering players in a competition](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Several players can be added to a competition at once.** On a competition's **Players** tab, press **Add Several**, beside **Add Player**, tick the players you want, or the box above the list for all of them, and press **Add Selected**. They are put in the tournament's order. If some cannot be added, a second dialog says which and why, and asks whether to add the rest. See [Entering players in a competition](../tournament-managers/standard-tournament/entering-players-in-a-competition.md#adding-several).

### The tournament

- **A new tournament begins in the month it is now.** Its start is the first of this month and its finish is the same day, and the finish follows the start until you choose one of your own.

- **Choose the country, state or province, and sport from lists.** A tournament needs a country and a sport. Choosing another country clears the state or province. A player's or a team's flag is chosen from a list, with the busiest countries first.

- **The bar of sections keeps up with the competitions.** After you add, change, move, archive or restore a competition or a test, the bar on the tournament's page offers what the tournament now has, without opening the page again.

- **A help icon on more of the admin.** The round question mark is on the pages that create and change a tournament, on the row of tabs of a tournament and of a competition, and beside the list of tournaments. Each leads to the help for what you are looking at, in another tab so that the page is kept.

### Notes

- **Manager notes: use them instead of a commentary to tell players what they need to know.** The format, a change to the order of play, the time of lunch. A note is written on the tournament's **Notes** tab, with a title and a description in Markdown, and you can preview it before you add it. Players find notes on the tournament's public Notes page. A note they have not read is marked with an asterisk, and so is the Notes section on every page of the tournament, until they open it. A note you edit is marked again for everyone who had read it. See [Notes](../tournament-managers/standard-tournament/notes.md).

- **The old site's tournament Notes are now the Subtitle.** What you wrote there is kept as the tournament's subtitle, and is still shown beneath the tournament's name on every public page. It is written in Markdown and can be up to 2000 characters. It is for what readers should know whatever page they are on. Use a note for news that changes as the tournament goes on.

### What the public sees

- **A block shows where each player is placed**, in a last column headed #, with a line beneath saying how players level on matches won were told apart.

- **The Interstate Shield is ranked by net matches.** Teams are ranked by tests, the matches they won less the matches they lost.
