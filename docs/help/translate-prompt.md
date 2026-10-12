# Translate the help

Translate every page under `docs/help/english` into every language the site speaks, so that a reader who uses the site in their own language can read its help in that language too.

## Which languages

The languages are the files in `src/web/languages`, one per language, named by the language's English name: `french.ts`, `maori.ts`, `egyptian.ts` and so on. `english.ts` is the one the help is already written in. Every other file is a language to translate into.

Each translation goes in a folder beside `docs/help/english`, named as its file is named: `docs/help/french`, `docs/help/maori`, `docs/help/egyptian`. Inside, the folders and files have the same names as the English ones, so that `docs/help/french/tournament-managers/standard-tournament/players.md` is the French `players.md`. File names stay in English because the pages link to each other by them, and a translated name would break every link into it.

## Use the catalogue's words

The help names what the reader sees on the screen, in bold: **Add Player**, **Name**, **Representing**, **Archive**, the **Players** tab. The screen says those words in the reader's language from the catalogue in `src/web/languages/<language>.ts`, so the help must say them the same way, or the reader looks for a button the page does not have. Before translating a page, find each bolded word in `english.ts`, take its key, and use the word that key has in the language's catalogue. A word the catalogue has not got falls back to English on the screen, so the help keeps it in English too.

The same goes for a value the site offers, such as the formats Standard, Teams, Eire Cup, Interstate Shield and GC World Team Championship, and the sports: say them as the catalogue does.

Read the comment at the top of the language's catalogue first. It says how the language addresses the reader (French as vous, for instance), what case menus and buttons use, and whichever other decisions were made when the site was put into that language. The help is read by the same person as the site, so it keeps to the same decisions.

## What stays as it is

- **Markdown structure.** Headings, bold, lists, links, image lines and the `Next:` line at the foot of a page stay where they are and as they are. Only the words change.
- **Links.** The target of a link stays as written, since the file it points at has the same name in every language. The text of the link is translated.
- **Images.** The screenshots are of the English site, and there is one set of them. Do not copy them. Point each image at the English one with a relative path, so `images/players-tab.png` becomes `../../../english/tournament-managers/standard-tournament/images/players-tab.png` from a page that deep. Translate the alt text, since a reader who cannot see the picture reads that.
- **Examples.** Names used as examples, such as "Andrew Hobbs (2)" and "Canterbury Croquet Club", stay as they are. They are examples of a name, not words of a language.
- **Quoted words the site checks.** Where the help quotes a word the site itself tests for, such as a player name beginning "bye", keep the English word in the quotation, because that is the word the site refuses. Say in the sentence that it is the English word if the language needs that said.

## How to work

Do one language at a time and finish it before starting the next, so that a language is either whole or absent, never half done. Within a language, start with the two index pages, then the standard tournament guide, then the teams guide. Each guide stands on its own, so a translator need not hold both in mind.

Translate meaning, not words. The English is plain and direct, in short sentences, and says why as well as what. Write the translation the way a native writer would write such a page, in the same register, rather than following the English word order. Where English has one word for two things the language tells apart, choose by what the page is describing, not by the English.

## Done when

- Every `.md` under `docs/help/english` has a counterpart at the same path under every other language's folder.
- Every link in every translated page resolves to a file that exists, and every image path resolves to a screenshot under `docs/help/english`.
- Every bolded word on a translated page is the word the language's catalogue shows for it, or English where the catalogue has none.
- No English prose is left on a translated page other than the examples, the quoted words the site checks, and the names the catalogue keeps in English.
