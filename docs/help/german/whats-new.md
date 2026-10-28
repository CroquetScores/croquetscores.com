# Was ist neu

## Veröffentlicht am 2026-10-28

### Dinge finden

- **Suchergebnisse sind Tabellen.** Die Turniere und Wettbewerbe, die eine Suche findet, sind jetzt wie die Listen auf der Startseite aufgebaut: die Tage, an denen sie gespielt wurden, die Sportart, die Flagge des Landes und der Name. Bei einem Wettbewerb stehen die Tage, die Sportart und die Flagge seines Turniers sowie das Turnier, zu dem er gehört. Die Daten und die Namen lassen sich sortieren, jede Tabelle für sich, und die Sortierung steht in der Adresse der Seite neben dem, was Sie eingegeben haben. Das Sortieren ordnet nur die hundert angezeigten Ergebnisse neu, die am besten zu Ihren Wörtern passen, nicht alle Treffer.
- **Die Länder mit den meisten Turnieren stehen zuerst.** Überall, wo Sie ein Land wählen, beginnt die Liste jetzt mit Australien, Ägypten, England, Neuseeland, Spanien und den Vereinigten Staaten, dann folgen die übrigen Länder, in denen seit 2025 Turniere gespielt wurden, dann alle anderen, mit einer Linie zwischen den drei Gruppen.
- **Jedes Turnier zeigt seine Sportart.** Auf einem Tablet oder breiter zeigen die Turnierlisten auf der Startseite und auf der Seite eines Jahres die Sportart des Turniers nach den Daten als kurzen Code, etwa GC oder AC, in einer eigenen Farbe für jede Sportart. Auf dem Handy fehlt der Code, damit mehr Platz für die Namen bleibt.
- **Startseite.** Die kommenden Turniere der Startseite stehen jetzt bei jeder Breite unter den letzten Ergebnissen.
- **Flaggen drängen sich auf dem Handy nicht mehr auf.** Auf dem Handy fehlt die Spalte mit den Flaggen in jeder Turnierliste, damit die Namen mehr Platz haben.
- **Die Länderliste bleibt in Chrome unter Linux offen.** Wenn man auf der Startseite auf das Länderfeld drückte, öffnete sich die Liste und schloss sich sofort wieder. Jetzt bleibt sie offen und lässt sich scrollen.

### Einem Turnier folgen

- **Vorgaben.** Die Verantwortlichen eines Turniers können einem Spieler jetzt eine Vorgabe geben, etwa 4, +4 oder -1.5. Sie steht nach dem Namen des Spielers, zusammen mit dem, was er vertritt, falls es etwas gibt, wie in Tim Murphy (4, Australien).
- **Peeling im Schweizer Raster.** Ein Ergebnis im Schweizer Raster endet jetzt mit dem Peeling des Spiels, wie es die Rangliste als Textdatei schon tut. Ein Spiel, das 26tp zu 17 gewonnen wurde, lautet +9tp für den Sieger und -9tp für den Verlierer. Ein Spiel ohne Peeling lautet wie bisher.

### Von den alten Seiten übernommene Turniere

- **Mehr davon stehen im richtigen Land.** Viele Turniere kamen im falschen Land herüber, weil die alten Seiten nur die Zeitzone kannten. Die Website liest das Land jetzt, wo es geht, aus dem Namen eines Turniers, etwa Irish, Welsh, Bayfield oder CroqCan, und ordnet jedes Spiel England gegen Schottland dem Land zu, das in jenem Jahr Gastgeber war. Danke an Chris Williams für seine Hilfe dabei.
- **Turniere, die noch gespielt werden,** werden auch übernommen, wenn ihre Verantwortlichen noch keinen Wettbewerb hinzugefügt haben, damit Sie sehen, wann und wo sie stattfinden.
- **Eine Vorgabe nach dem Namen eines Spielers** auf den alten Seiten, wie in Tim Murphy 1, wird bei der Suche nach seiner Weltrangliste nicht mehr für einen Teil des Namens gehalten.

## Veröffentlicht am 2026-10-27

Croquet Scores wurde mit KI komplett neu geschrieben, in TypeScript. Hier steht, was Ihnen auffallen wird.

### Dinge finden

- **Suchen.** Jede Seite hat oben ein Suchfeld. Geben Sie einen Namen ein und drücken Sie auf Suchen, um Turniere, Wettbewerbe und Spieler zu finden. Die Ergebnisse stehen in drei Listen, und eine leere Liste wird weggelassen. Gibt es von einer Art mehr als hundert, sagt die Seite das, und mit einem zusätzlichen Wort in Ihrer Suche wird das Ergebnis enger.
- **Turniere nach Land, Region und Sportart eingrenzen.** Wählen Sie auf der Startseite ein Land, um nur die Turniere zu sehen, die dort gespielt werden. Haben Sie ein Land gewählt, können Sie einen Bundesstaat oder eine Provinz davon wählen, und Sie können auch eine Sportart wählen. Was Sie gewählt haben, steht in der Adresse der Seite, also können Sie es als Lesezeichen speichern oder jemandem schicken, und mit der Zurück-Taste machen Sie es rückgängig. **Wer einen Bundesstaat oder eine Provinz wählt, findet nur neue Turniere.** Ältere Turniere haben keinen Bundesstaat und keine Provinz bekommen, also fallen sie weg, wenn Sie einen wählen.

### Einem Turnier folgen

- **Notizen der Verantwortlichen.** Die Verantwortlichen eines Turniers können jetzt Notizen schreiben, um den Spielern zu sagen, was sie während des Turniers wissen müssen: das Format, eine Änderung der Spielreihenfolge, die Uhrzeit des Mittagessens. Sie stehen im neuen Bereich Notizen des Turniers, die neuesten zuerst, mit der Angabe, wie lange jede Notiz her ist.
- **Ein Sternchen (\*) markiert, was Sie noch nicht gelesen haben.** Eine Notiz hat eines, bis Sie ihn öffnen, und wieder, wenn er geändert wird, nachdem Sie ihn gelesen haben. Solange eine Notiz ungelesen ist, hat auch der Bereich Notizen eines, auf jeder Seite des Turniers, sodass Sie sehen, dass es Neuigkeiten gibt, ohne nachzusehen. Kommentare werden auf dieselbe Weise markiert. Ihr Browser merkt sich, was Sie gelesen haben, also müssen Sie sich nicht anmelden. Ein anderes Handy oder ein anderer Computer beginnt mit nichts als gelesen.
- **Kommentare sind leichter zu verfolgen.** Auf der alten Seite warf jeder neue Kommentar die Seite ganz nach unten, sodass man beim Zurücklesen früherer Kommentare die Stelle verlor. Jetzt springt die Seite nur dann zu einem neuen Kommentar, wenn Sie schon ganz unten sind und den neuesten lesen. Wenn Sie zurückgescrollt haben, um frühere Kommentare zu lesen, bleiben Sie, wo Sie sind.

### Die Website

- **Ihre Sprache.** Die Website gibt es jetzt in siebzehn Sprachen: Afrikaans, العربية (مصر), 中文, Nederlands, English, Français, Deutsch, Italiano, 日本語, 한국어, Te Reo Māori, Polski, Português, Русский, Español, Svenska und Cymraeg. Sie sehen die erste Sprache, die Ihr Browser anfordert und die die Website hat, oder Englisch, wenn sie keine hat. Um eine andere zu wählen, nutzen Sie die Liste in der Fußzeile am Ende jeder Seite und drücken Sie auf die Schaltfläche daneben. Wenn Sie sich eine weitere Sprache wünschen, schreiben Sie eine E-Mail an <croquetscores@gmail.com>.
- **Hell oder dunkel.** Ebenfalls in der Fußzeile: Wählen Sie Hell, Dunkel oder System. System folgt Ihrem Handy oder Computer. Die Website merkt sich Ihre Wahl auf jeder Seite und bei jedem Besuch.
- **Welche Version Sie sehen.** Die Fußzeile zeigt jetzt die Version der Website, die Sie gerade ansiehen, etwa v234. Wenn Sie ein Problem melden, sagen Sie bitte dazu, welche Version es war.

### Open Source

Der Code ist jetzt Open Source, unter der GNU Affero General Public License Version 3 (AGPL-3.0). Jeder darf ihn lesen, nutzen und verändern, und wer eine veränderte Version als Website betreibt, muss seine Änderungen unter derselben Lizenz weitergeben.
