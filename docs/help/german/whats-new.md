# Was ist neu

## Veröffentlicht am 25.11.2026

- **Auf dem Handy hat die Seite mehr Platz.** Die weiße Fläche, die eine Seite trägt, reicht von einem Rand des Bildschirms zum anderen, und der Text sowie die Leisten darüber und darunter sitzen 10 statt 41 Pixel vom Rand entfernt. Ein Formular auf der grünen Seite behält seinen Rand. Breitere Bildschirme sind wie zuvor.

- **Ein Name in der Übersicht eines K.-o.-Turniers wird nie mitten im Wort getrennt.** Er bricht nur an seinen Leerzeichen um. Ist ein Wort breiter als der Platz neben den Ergebnissen, lässt sich die Übersicht innerhalb der Seite seitlich verschieben, statt die Seite aufzuweiten.

## Veröffentlicht am 24.11.2026

- **Die Übersicht eines Blocks nennt auch die Spieldifferenz.** Wo die Begegnungen eines Blocks auf mehr als ein Spiel gehen, nennt seine Übersicht Siege, Niederlagen, Spieldifferenz und Tordifferenz, da die Spieldifferenz bei Gleichstand vor der Tordifferenz entscheidet. Ein Block aus Einzelspielen nennt wie bisher Siege, Niederlagen und Tordifferenz. Die Übersicht sagt nicht mehr, wie ihre Spieler eingestuft werden.

- **Die Kachel eines Wettbewerbs in der Leiste der Bereiche ist so breit wie sein Name.** Ein kurzer Name wie „Block A“ hatte eine Kachel so breit wie ein langer, sodass der Leiste früher der Platz ausging, als nötig.

- **Auf einem Smartphone brauchen die Daten der Startseite weniger Platz.** Die Spalte der Daten ist so breit wie die Daten eines Wochenendes, etwa „19-21 Nov“, und die Namen haben den Rest. Daten, die von einem Monat in den nächsten reichen, brechen vor dem Bindestrich um, sodass die zweite Zeile mit ihm beginnt. Unter **Zuletzt besuchte Turniere** nennt ein Turnier dieses Jahres kein Jahr, und eines aus einem anderen Jahr nennt es unter seinen Daten.

### Für App-Entwickler

- **Eine App kann mit einem Schlüssel, der zum Schreiben gemacht wurde, etwas ändern.** Was die eigenen Seiten der Website ändern, ändern dieselben Adressen unter `/api/v0`: ein Turnier, seine Wettbewerbe, Spieler, Teams und Spiele anlegen und festlegen, wer es leiten und Ergebnisse erfassen darf. Ein Schlüssel darf tun, was das Konto tun darf, für das er gemacht wurde, und der Schlüssel eines Ergebniserfassers darf tun, was mit Ergebnissen getan wird, und sonst nichts. **Die POST-Endpunkte der API** in der Hilfe sagen, was jede Adresse nimmt und beantwortet. Sie werden noch festgelegt, und einige werden wieder entfernt.

- **Eine App kann fragen, was ein Turnier sein kann.** Die Sportarten, die Formate und die Länder mit ihren Regionen stehen unter `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` und `/api/v0/countries`, in der Sprache, die die App verlangt, sodass das, womit sie ein Turnier anlegt, das ist, was die Website anbietet.

- **Eine App kann die Weltranglistenspieler und ihre Spiele lesen.** Die Association-Croquet-Spieler, die die Weltranglisten kennen, stehen unter `/api/v0/ac/world-ranking-players`, und die Spiele jedes Spielers, in der Reihenfolge, in der sie hinzugefügt wurden, unter der Adresse, die der Spieler nennt. Die Namen werden nach den Ranglisten aktualisiert, wenn die Liste von Anfang an erfragt wird, höchstens einmal in der Stunde.

- **Die Endpunkte der API sind zwei Seiten in der Hilfe, eine für die GET-Endpunkte und eine für die POST-Endpunkte,** in jeder Sprache.

### Weltranglistenbeauftragte

- **Ein Spieler der Association-Croquet-Ranglisten wird unter der Nummer geführt, die die Ranglisten ihm geben.** Ein Spieler, den die Ranglisten umbenennen, ist derselbe Spieler, einer, der von der Liste fällt, wird archiviert und nicht vergessen, und einer, der wieder aufgeführt wird, ist nicht mehr archiviert. Eine Liste, die zwei Spielern einen Namen oder einem Namen zwei Nummern gibt, wird ganz abgewiesen und nichts wird geändert, und der Administrator wird per E-Mail benachrichtigt.

## Veröffentlicht am 22.11.2026

- **Die Startseite merkt sich die Turniere, die Sie zuletzt angesehen haben.** Wenn Sie ein Turnier öffnen, steht es unter **Zuletzt besuchte Turniere** an erster Stelle, zwischen dem Filter und den neuesten Ergebnissen, bis zu fünf, damit Sie zu denen zurückkehren können, die Sie verfolgen, ohne sie in den Listen zu suchen. Sie werden auf Ihrem eigenen Gerät gespeichert, in einem Cookie, das nur die Adressen der Turniere enthält, und die Liste wird gar nicht angezeigt, bis Sie eines geöffnet haben. Die Hilfe sagt, was das Cookie ist.

- **Die kommenden Turniere enthalten auch die, die in den letzten zwei Tagen begonnen haben.** Ein Turnier, das begonnen hat und noch nicht zu Ende ist, wird bis zu dem Tag aufgeführt, an dem es endet, sofern es vor höchstens zwei Tagen begonnen hat, sodass es an den Tagen, an denen gespielt wird, zu finden ist, bevor jemand ein Spiel eingetragen hat. Die, die früher begonnen haben, stehen unter den neuesten Ergebnissen, sobald ein Spiel hinzugefügt wurde.

- **Ein K.-o.-Turnier sagt, über wie viele Spiele die Matches jeder Runde gehen.** Über jeder Runde im Raster eines K.-o.-Turniers und in der Übersicht unter dem Namen jeder Runde steht „Maximal 3 Spiele“ (oder was die Turnierleitung für die Runde gewählt hat).

- **Ein Ergebnis passt in der Übersicht eines K.-o.-Turniers in sein Feld, und ein Name bleibt in der Übersicht eines Blocks zusammen.** Auf einem schmalen Bildschirm lief ein Advantage-Ergebnis, das als „83% (5/6)“ geschrieben wird, aus seinem Feld über die Namen hinaus, und ein Name in der Übersicht eines Blocks konnte nach dem Vornamen umbrechen. Ein Paar bleibt auf jeder Seite des Und-Zeichens zusammen.

- **Sie können die Website auf den Home-Bildschirm Ihres Telefons legen.** Eine Schaltfläche in der Fußzeile bietet es an, wenn Ihr Browser es kann, und **Die Website zum Home-Bildschirm hinzufügen** in der Hilfe sagt, wie, für ein iPhone und für ein Android-Telefon. Croquet Scores und Gateball Scores haben je ein Symbol, damit Sie sie unterscheiden können.

- **Die Croquet-Regionen Neuseelands sind aufgeführt.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury und die anderen Regionen, in die Neuseelands nationale Turniere aufgeteilt sind, können als Region eines Turniers gewählt werden.

### Für App-Entwickler

- **Es gibt eine öffentliche API.** Eine App kann die Turniere eines Jahres lesen, ein Turnier mit seinen Wettbewerben und Spielern, die Spiele und den Stand eines Wettbewerbs, die Turniere, die das Jahr gewechselt haben, und die Turniere, die archiviert wurden, als JSON unter `/api/v0`. Sie ist `v0`, solange sie in Entwicklung ist. Alle dürfen lesen, und eine App, die einen unter **API-Schlüssel** in Ihrem Konto erstellten Schlüssel sendet, hat ein eigenes Kontingent, zunächst 60 Anfragen pro Minute und 10.000 pro Tag. Eine App ohne Schlüssel teilt sich ein Kontingent nach ihrer Adresse, 10 pro Minute und 500 pro Tag.

- **Ein Schlüssel lässt eine App für Sie handeln, ohne Ihr Passwort.** Erstellen Sie in Ihrem Konto einen Schlüssel, sagen Sie, wofür er ist, und widerrufen Sie ihn, wenn er nicht mehr verwendet werden soll. Ein Schlüssel kann nur zum Lesen oder zum Lesen und Schreiben erstellt werden und kann auf ein Turnier beschränkt werden. Die API liest vorerst nur. Nur ein Hash des Schlüssels wird gespeichert, sodass der Schlüssel einmal angezeigt wird, wenn Sie ihn erstellen.

- **Einer Antwort können Felder ohne neue Version hinzugefügt werden.** Eine App muss ein Feld ignorieren, das sie nicht kennt. Eine Änderung, die eine App zerbrechen würde, wird als neue Version neben der alten gemacht, sodass eine App, die für `v1` geschrieben wurde, weiterläuft, wenn `v2` erscheint. **Hilfe für App-Entwickler** und **Die Endpunkte der API** in der Hilfe sagen, was jede Adresse annimmt und antwortet, in jeder Sprache.

- **Eine Vorgabe in der API ist eine Zahl.** Sie ist `4.5` und nicht `"4.5"`, und `null`, wo ein Spieler keine hat.

### Weltranglistenbeauftragte

- **Eine zweite Tabelle der Golf-Croquet-Spiele hat den Tag, an dem jedes Spiel eingetragen wurde.** Hängen Sie `rankings2` an die Adresse, wo `rankings` steht, und Spalte I nennt den Tag, an dem jedes Spiel eingetragen wurde, als Excel-Datum, in der Zeit des Ortes, an dem das Turnier gespielt wird. Der Reiter „Ranglisten“ bietet sie als **Spiele für die Weltrangliste mit Spieldatum herunterladen** an. Die erste Tabelle ist, wie sie war, da die Software der Beauftragten sie nach der Position liest.

## Veröffentlicht am 15.11.2026

- **Ein Doppelpaar ist in der Suche ein einziger Spieler, gleich welcher seiner beiden Spieler zuerst genannt wird.** "Sam Someone & Alex Another" und "Alex Another & Sam Someone" waren zwei Einträge auf der Spielerseite, ebenso "Peter & Rosie Landrebe" und "Rosie & Peter Landrebe". Jetzt sind sie einer, unter einer Adresse, aufgeführt mit dem Namen, den das jüngste Turnier geschrieben hat.

- **Ein Doppelpaar kann auch mit einem Schrägstrich, einem Pluszeichen oder dem englischen Wort "and" geschrieben werden, nicht nur mit einem Et-Zeichen.** "Sam Someone / Alex Another", "Sam Someone + Alex Another" und "Sam Someone and Alex Another" werden alle als Paar gelesen. Das Wort "and" zählt nur, wenn es allein steht, ein Name wie "Sam Anderson" wird also nicht für ein Paar gehalten.

- **Ein Paar wird in Schweizer-System-Ergebnissen und Blocktabellen kurz genannt.** Ein Ergebnis im Schweizer System nannte den Anfangsbuchstaben des Vornamens des ersten Spielers und den Nachnamen des zweiten. Jetzt nennt es jeden Spieler, als "T. Murphy & A. Sharpe", und ein Nachname, den beide teilen, wird nur einmal genannt, als "R. & P. Landrebe". Die Spalten einer Blocktabelle tragen als Überschrift die Initialen jedes Spielers, mit einem Et-Zeichen verbunden, etwa "TM&AS", oder "RL&PL" bei gemeinsamem Nachnamen.

- **Guatemala steht bei den Ländern, in denen zuletzt niemand gespielt hat.** Es wurde zuvor bei den Ländern geführt, in denen seit 2025 Turniere gespielt wurden.

- **Die Website zählt, wie viele Leserinnen und Leser kommen und welche Seiten sie lesen.** Dazu verwendet sie die Web-Analyse von Cloudflare, auf jeder Seite, die Leser sehen. Die Seiten, auf denen Verantwortliche arbeiten, werden nicht gezählt. Es werden keine Cookies verwendet, und die Nutzer werden nur an ihrer IP-Adresse erkannt.

- **Die Turniere werden als Dateien veröffentlicht, die jeder verwenden kann.** Jedes öffentliche Turnier, im Croquet und im Gateball, wird als eigene Datei geschrieben, mit seinen Spielern und Wettbewerben, oder mit seinen Mannschaften und Tests, wo es in Mannschaften gespielt wird, einschließlich zurückgezogener Spiele, die als zurückgezogen gekennzeichnet sind. Sie liegen in einem Git-Repository, `CroquetScores/data.croquetscores.com`, das jede Stunde aktualisiert wird, sodass Sie die Ergebnisse in eine Rangfolge bringen oder etwas daraus bauen können und eine Korrektur als Änderung mit Datum erscheint. In einer Datei steht kein Konto, keine E-Mail-Adresse, keine Notiz und kein Kommentar, und auch nichts Archiviertes oder von einer Website zum Ausprobieren.

### Im Notfall

- **Es gibt eine Seite für jemanden, der die Website übernehmen muss.** Wenn die Person, die die Website betreibt, es nicht kann, weil sie krank oder lange abwesend ist, kann jeder Angemeldete im Admin-Bereich **In case of emergency** öffnen, sagen, wer er ist und warum er die Website übernimmt, und **Send** drücken. Nach einer Bestätigung wird, was er gesagt hat, per E-Mail an die Menschen geschickt, die das Passwort zu der Notiz haben, die alles enthält, was die Website braucht, und Antworten gehen an den Absender. Ein Konto kann einmal in 48 Stunden anfragen und erfährt, wann es wieder anfragen darf. Die Seite beginnt mit einer Warnung, sie nicht zu benutzen, wenn der Administrator nicht per E-Mail benachrichtigt wurde und innerhalb von 48 Stunden nicht geantwortet hat, und sie nicht zu testen. Ist die Nachricht gesendet, sagt die Seite das und fragt nichts weiter.

## Veröffentlicht am 11.11.2026

- **Das Menü auf dem Telefon schließt sich, wenn Sie außerhalb davon tippen.** Das Menü hinter der Schaltfläche oben auf einem schmalen Bildschirm schließt sich, wenn Sie irgendwo anders auf die Seite tippen, ebenso wie wenn Sie die Schaltfläche noch einmal drücken oder einem Link folgen.

- **Das Kontomenü schließt sich, wenn Sie außerhalb davon tippen.** Die Person am Ende der Kopfzeile, hinter der sich Registrieren, Anmelden und das Übrige öffnen, schließt sich, wenn Sie irgendwo anders auf die Seite tippen, ebenso wie wenn Sie sie noch einmal drücken.

- **Mit zwei Fingern die Textgröße ändern.** Auf einem Touchscreen machen Sie den Text kleiner, indem Sie zwei Finger zusammenführen, und größer, indem Sie sie auseinanderziehen, auf eine Größe zwischen der Hälfte und dem Doppelten der üblichen. Anders als der Zoom des Browsers bleibt die Seite so breit wie der Bildschirm, sodass Sie nie seitwärts scrollen müssen, um eine Zeile zu lesen. Die Größe wird gemerkt und ist daher auf jeder Seite und bei jedem Besuch dieselbe. Ein Finger scrollt weiterhin wie bisher.

- **Das Menü auf dem Telefon lässt sich scrollen.** Auf einem niedrigen Bildschirm ist das Menü nicht höher als der Bildschirm und scrollt in sich, sodass sich jeder Eintrag erreichen lässt. Die Seite dahinter bleibt, wo sie war, bis das Menü geschlossen wird.

- **Pedro Echeguren hat das Spanische verbessert.** Pedro hat die spanischen Wörter der Website durchgesehen und korrigiert. Danke, Pedro.

## Veröffentlicht am 10.11.2026

Croquet Scores wurde komplett neu geschrieben. Ich hoffe, die neue Version gefällt Ihnen.

### Dinge finden

- **Suchen.** Oben auf jeder Seite gibt es ein Suchfeld. Geben Sie einen Namen ein und drücken Sie Suchen, um Turniere, Wettbewerbe und Spielerinnen und Spieler zu finden.

- **Turniere nach Land, Bundesstaat oder Provinz und Sportart eingrenzen.** Wählen Sie auf der Startseite ein Land, um nur die Turniere zu sehen, die dort gespielt werden. Haben Sie ein Land gewählt, können Sie zusätzlich einen Bundesstaat oder eine Provinz davon wählen, und auch eine Sportart. Ihr Telefon oder Computer merkt sich, was Sie gewählt haben, und beginnt beim nächsten Mal damit. **Die Wahl eines Bundesstaats oder einer Provinz findet nur neue Turniere.** Älteren Turnieren wurde kein Bundesstaat und keine Provinz zugeordnet, deshalb fallen sie bei dieser Wahl weg.

- **Turniere nach Tagen eingrenzen.** Geben Sie zusammen einen ersten und einen letzten Tag an, und nur die Turniere, die zwischen ihnen beginnen, werden aufgelistet. Beide Tage zählen mit.

- **Die Seite eines Jahres zeigt seine Monate.** Jeder Monat steht zugeklappt da und nennt, wie viele Turniere in ihm beginnen. Drücken Sie einen Monat, um seine Turniere zu öffnen, so viele Monate Sie möchten. **+ Alle anzeigen** öffnet jeden Monat.

- **Lange Listen sind in Seiten aufgeteilt.** Eine Liste von Turnieren zeigt hundert auf einmal, sodass eine weite Suche nicht mehr alle Zeilen auf einmal lädt.

- **Die Hilfe findet eine Antwort nach dem, was Sie meinen.** Stellen Sie im Suchfeld auf der ersten Seite der Hilfe eine Frage, und sie findet den Artikel auch dann, wenn er andere Wörter mit derselben Bedeutung verwendet. Die erste Seite bietet außerdem beliebte Fragen und die Themen als Karten an.

### Ein Turnier verfolgen

- **Notizen der Turnierleitung.** Die Leitung eines Turniers kann jetzt Notizen schreiben, damit die Spielenden während des Turniers erfahren, was sie wissen müssen: das Format, eine Änderung der Spielreihenfolge, die Zeit der Mittagspause. Sie stehen im neuen Bereich Notizen des Turniers, die neueste zuerst, jeweils mit der Angabe, wie lange sie her ist.

- **Ein Sternchen (\*) markiert, was Sie noch nicht gelesen haben.** Eine Notiz hat eines, bis Sie sie öffnen, und wieder, wenn sie nach dem Lesen geändert wird. Solange eine Notiz ungelesen ist, hat auch der Bereich Notizen eines, auf jeder Seite des Turniers. So sehen Sie, dass es Neuigkeiten gibt, ohne nachsehen zu müssen. Kommentare werden auf die gleiche Weise markiert. Ihr Browser merkt sich, was Sie gelesen haben, deshalb müssen Sie sich nicht anmelden. Ein anderes Telefon oder ein anderer Computer beginnt mit allem als ungelesen.

- **Kommentare sind leichter zu verfolgen.** Auf der alten Website sprang die Seite bei jedem neuen Kommentar ganz nach unten, sodass man beim Zurücklesen älterer Kommentare die Stelle verlor. Jetzt springt die Seite nur dann zu einem neuen Kommentar, wenn Sie schon ganz unten sind und das Neueste lesen. Haben Sie zurückgescrollt, um ältere Kommentare zu lesen, bleibt die Seite, wo sie ist.

- **Ein Block zeigt, auf welchem Platz jede Spielerin und jeder Spieler steht.** Die letzte Spalte nennt den Platz: 1, oder =2, wo sich Spielende nicht unterscheiden lassen und sich den zweiten Platz teilen. Wo Spielende bei den gewonnenen Spielen gleichauf liegen, sagt eine Zeile darunter, wie sie unterschieden wurden.

- **Die Spielreihenfolge lässt sich sortieren.** Drücken Sie Spiel, um die Spiele nach dem Namen der Siegerin oder des Siegers zu sortieren, oder Datum, um danach zu sortieren, wann sie hinzugefügt wurden. Drücken Sie noch einmal, um die Reihenfolge umzukehren. Die Website merkt sich, wie Sie sortiert haben, für jeden Wettbewerb und auch für die Listen der Turniere, und ein Link unter einer Liste, Zurück zur üblichen Reihenfolge, vergisst es wieder.

- **Vorgaben werden angezeigt.** Hat eine Spielerin oder ein Spieler eine Vorgabe, steht sie hinter dem Namen, zusammen mit dem, was sie oder er vertritt, wie in Tim Murphy (4, Australia).

- **Ein Wettbewerb nennt, bis zu wie vielen Toren seine Spiele gespielt werden,** wenn das nicht dem Üblichen seiner Sportart entspricht, als „Gespielt bis 14 Tore“.

### Die Website

- **Ihre Sprache.** Die Website gibt es jetzt in zwölf Sprachen: Afrikaans, Arabisch (Ägypten), Tschechisch, Englisch, Deutsch, Griechisch, Lettisch, Norwegisch, Portugiesisch, Spanisch, Schwedisch und Walisisch. Sie sehen die erste Sprache, die Ihr Browser anfordert und die die Website hat, sonst Englisch. Um eine andere zu wählen, nutzen Sie die Liste in der Fußzeile am Ende jeder Seite und drücken Sie die Schaltfläche daneben. Wenn Sie sich eine weitere Sprache wünschen, schreiben Sie an <croquetscores@gmail.com>.

- **Hell oder dunkel.** Ebenfalls in der Fußzeile: Wählen Sie Hell, Dunkel oder System. System folgt Ihrem Telefon oder Computer. Die Website merkt sich Ihre Wahl auf jeder Seite und bei jedem Besuch.

- **Welche Version Sie verwenden.** Die Fußzeile zeigt jetzt die Version der Website an, die Sie gerade sehen, zum Beispiel v234. Wenn Sie ein Problem melden, nennen Sie bitte die Version.

- **Ihre Daten.** Die Seite /data-deletion-policy erklärt, wie Sie löschen lassen können, was die Website über Sie speichert, was gelöscht wird und was erhalten bleibt.

### Open Source

Der Code ist jetzt Open Source, unter der GNU Affero General Public License Version 3 (AGPL-3.0). Jeder darf ihn lesen, verwenden und ändern, und wer eine geänderte Version als Website betreibt, muss seine Änderungen unter derselben Lizenz weitergeben.
