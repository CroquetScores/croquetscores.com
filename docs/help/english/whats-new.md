# What's new

## Released 2026-10-30

### iPad

The pressing a list and pressing whitespace on the home page now works correctly. I tested every page with an iPad 6 without an issues, fingers crossed this holds true for all iPads and iMacs. Please let me know one way either way.

### Finding things

- **Country, state or province, and sport are lists again.** The fields that narrow the tournaments, on the home page and on a year's page, go back to the lists of the browser, which you press to see every name and choose from. Typing in them was not working well enough.

### Managing a tournament

- **Lists again for the country, state or province, and sport.** The form that creates or changes a tournament asks for them in lists too, and a player's or a team's flag is chosen from a list.
- **The flags are in the order of the countries.** Australia, Egypt, England, New Zealand, Spain and the United States come first, then the other countries tournaments have been played in since 2025, then all the rest. A line is drawn after the United States and after Wales to show where one group ends and the next begins.

### Tournament Country

Chris Williams has been at it again and helped me improve tournament countries during importing from the old database.

## Released 2026-10-29

### Finding things

- **Type a country, state or province, or sport.** The fields that narrow the tournaments, on the home page and on a year's page, are now boxes you type into, not lists to scroll. Type part of a name, such as Zeal, and the names that have it are suggested. Press the arrow at the end of the box, or the down arrow key, to see every name, five at a time with the rest to scroll to. Press a suggestion, or move with the arrow keys and press Enter, to choose it. A box left empty means any. Words that are not the name of a country or a sport cannot be left in the box: you are asked to choose one, and Escape puts back the one you had.
- **A player's page keeps each tournament's dates on one line.** On a phone, the dates of the tournaments on a player's page used to break across two lines. They now stay on one, and it is the tournament's name that wraps.

### Managing a tournament

- **Choose the country, state or province, and sport by typing.** The form that creates or changes a tournament asks for them in the same boxes. A tournament needs a country and a sport, so you are asked to choose one before you can leave either box or send the form. Correcting the words of the country no longer loses the state or province you had chosen. Choosing another country does clear it.
- **Flags are typed too.** A player's or a team's flag is chosen in the same way. Leave the box empty for no flag.
- **What a player represents is suggested.** As you type what a player represents, the clubs and countries that players have been added representing, in any tournament and in any sport, are suggested. Type two letters to begin. At most ten are suggested, in alphabetical order, and a name that differs only in its capitals is suggested once, as it was first written. Archived players and the players of a team are not looked at.
- **The help explains a block's rounds.** Rounds is how many times each pair of players in a block meet, with a match in each round. It begins on 1, which is what a block almost always wants. Raise it only for a block in which they meet again, as in a double round robin. The page for competitions says so, and a block and a Swiss now have a section each.

### Tournaments brought over from the old sites

- **More handicaps are taken off a world ranking name.** The number after a player's last space on the old sites, whole or with a decimal such as 5.5 or 5,5, with a plus or a minus sign or without, is no longer taken for part of their name when looking up their world ranking. So is a handicap after a semicolon, as in Tim Murphy; 5.5. Two numbers at the end, as in Tim Murphy 3 5, are left, since there is no telling which was meant, and so is a name that is only a number.

## Released 2026-10-28

### Finding things

- **Search results are tables.** The tournaments and competitions a search finds are now laid out like the lists on the home page: the days each was played, the sport type, the flag of its country, and the name. A competition shows its tournament's days, sport type and flag, and the tournament it is in. The dates and the names can be sorted, each table on its own, and the sorting is kept in the page's address beside what you typed. Sorting reorders only the hundred results shown, which are the best matches for your words, not every match.
- **The busiest countries come first.** Wherever you choose a country, the list now begins with Australia, Egypt, England, New Zealand, Spain and the United States, then the other countries tournaments have been played in since 2025, then all the rest, with a line between the three groups.
- **Each tournament shows its sport.** On a tablet or wider, the tournament lists on the home page and on a year's page show the tournament's sport as a short code, such as GC or AC, in a colour of its own for each sport, after the dates. On a phone the code is left out to leave room for names.
- **Home page.** The home page's upcoming tournaments are now beneath the recent results at every width.
- **Flags no longer crowd a phone.** On a phone, the column of flags is left out of every list of tournaments, so the names have more room.
- **The country list stays open in Chrome on Linux.** Pressing the country field on the home page used to open the list and shut it again straight away. It now stays open, and scrolls.

### Following a tournament

- **Handicaps.** A tournament's managers can now give a player a handicap, such as 4, +4 or -1.5. It is shown after the player's name, with what they represent if there is something, as in Tim Murphy (4, Australia).
- **Peeling in the Swiss grid.** A result in the Swiss grid now ends with the game's peeling, as the rankings text file already does. A game won 26tp to 17 reads +9tp for the winner and -9tp for the loser. A game with no peeling reads as it did.

### Tournaments brought over from the old sites

- **More of them are in the right country.** Many tournaments came over in the wrong country, because the old sites only knew the time zone. The site now reads the country from a tournament's name where it can, such as Irish, Welsh, Bayfield or CroqCan, and puts each England v Scotland match in the country that played host that year. Thank you Chris Williams for his help with this.
- **Tournaments still to be played are brought over** even if their managers have yet to add a competition, so you can find when and where they are.
- **A handicap after a player's name** on the old sites, as in Tim Murphy 1, is no longer taken for part of the name when looking up their world ranking.

## Released 2026-10-27

Croquet Scores has been completely rewritten with AI, in TypeScript. What follows is what you will notice.

### Finding things

- **Search.** Every page has a search box at the top. Type a name and press Search to find tournaments, competitions and players. The results are in three lists, and a list with nothing in it is left out. If there are more than a hundred of one kind, the page says so, and adding a word to your search narrows it.
- **Narrow the tournaments by country, region and sport.** On the home page, choose a country to see only the tournaments played in it. Once you have chosen a country you can choose a state or province of it, and you can choose a sport as well. What you chose is in the page's address, so you can bookmark it or send it to someone, and the back button undoes it. **Choosing a state or province only finds new tournaments.** Older ones were not given a state or province, so choosing one leaves them out.

### Following a tournament

- **Notes from the managers.** A tournament's managers can now write notes to tell its players what they need to know as it is played: the format, a change to the order of play, the time of lunch. They are in the tournament's new Notes section, with the newest first and how long ago each was written.
- **An asterisk (\*) marks what you have not read.** A note has one until you open it, and again if it is changed after you read it. While any note is unread, the Notes section has one too, on every page of the tournament, so you can see there is news without going to look. Commentaries are marked in the same way. Your browser remembers what you have read, so you do not need to sign in. Another phone or computer starts with nothing read.
- **Commentary is easier to follow.** On the old site, every new comment threw the page down to the bottom, so anyone looking back through earlier comments lost their place. Now the page only moves down to a new comment if you are already at the bottom, reading the latest. If you have scrolled back to read earlier comments, it leaves you where you are.

### The site

- **Your language.** The site is now in seventeen languages: Afrikaans, Arabic (Egypt), Chinese, Dutch, English, French, German, Italian, Japanese, Korean, Māori, Polish, Portuguese, Russian, Spanish, Swedish and Welsh. You are shown the first language your browser asks for that the site has, or English if it has none. To choose another, use the list in the footer at the bottom of any page and press the button beside it. If you would like a language added, email <croquetscores@gmail.com>.
- **Light or dark.** Also in the footer: choose Light, Dark or System. System follows your phone or computer. The site remembers your choice on every page and every visit.
- **Which version you are on.** The footer now shows the version of the site you are looking at, such as v234. If you report a problem, please say which version it was.

### Open Source

The code is now open source, under the GNU Affero General Public License version 3 (AGPL-3.0). Anyone may read it, use it and change it, and anyone who runs a changed version as a website must share their changes under the same license.
