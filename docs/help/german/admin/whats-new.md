# Was ist neu für Verantwortliche

## Veröffentlicht am 2026-10-23

Das sind die wichtigsten Änderungen seit der letzten Veröffentlichung. Jede verweist auf den Pull Request, der sie gebracht hat.

- **Vorgaben, Unentschieden und die Weltranglisten werden bei jedem Wettbewerb festgelegt.** Sie waren früher Sache des Turniers, sodass ein Turnier keinen Block mit Vorgabe neben einem ohne Vorgabe haben konnte und keinen Test, in dem ein Unentschieden möglich ist, neben einer K.-o.-Runde, in der keines möglich ist. Jeder Wettbewerb und jeder Test fragt jetzt beim Hinzufügen oder Bearbeiten nach allen dreien, das Turnierformular nicht mehr. Das Letzte wird nur gefragt, wo die Sportart Weltranglisten hat, und ein Wettbewerb, der nicht zählt, bleibt aus der Ranglistendatei heraus. Siehe [Wettbewerbe](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **Die Turnierliste der Verwaltung lässt sich nach Land, Region und Sportart eingrenzen.** Die Auswahl steht in der Adresse, sodass auf eine gefilterte Liste verlinkt werden kann, und angeboten wird nur, was Ihre Liste enthält. Eine Region wird angeboten, sobald ein Land gewählt ist. Turniere vor November 2026 haben keine Region, deshalb blendet die Wahl einer Region sie aus, und die öffentlichen Listen sagen das. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Weltranglistenbeauftragte sind jetzt eine Rolle je Sportart.** Ein Beauftragter für Association Croquet sieht Turniere im Association Croquet und kümmert sich um sie, ein Beauftragter für Golf Croquet die im Golf Croquet. Ein Turnier, das Sie leiten oder bei dem Sie die Ergebnisse erfassen, steht weiterhin in Ihrer Liste, gleich welche Sportart es ist. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **Der Reiter Ranglisten erklärt die Datei in einem Absatz, gleich welche Sportart,** mit dem Download-Link darunter. Siehe [Ranglisten](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **Der Name eines Turniers darf nicht ganz in Kleinbuchstaben oder ganz in Großbuchstaben stehen,** und die Meldung sagt das jetzt als Regel. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Entfernen ist ein Papierkorb** in den Reitern der Verantwortlichen und der Ergebniserfasser, bei den Spielern eines Wettbewerbs und auf der Kontenseite der Administration, wie es Archivieren und Löschen schon waren. Beim Daraufzeigen heißt er weiterhin Entfernen, und ein Screenreader liest ihn weiterhin als Entfernen vor. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Jede Sprache hat neue Wörter.** Die Wörter der Website in allen sechzehn anderen Sprachen sind neu geschrieben, und die Hilfe ist daran angepasst. Die Hilfe für Leser und für Konten sowie die Nutzungsbedingungen gibt es jetzt auch in jeder Sprache. Keine ist bisher von Muttersprachlern gelesen worden, sagen Sie uns also, was schlecht klingt. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Hinter den Kulissen.** Der Import der alten Seiten gibt einigen Zeitzonen und einem Turnier ein anderes Land ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), und er lädt einen Abzug in den Server und erzeugt die Lesemodelle mit einem Skript ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). Die Website wird mit einem Skript bereitgestellt, von einem Computer oder von GitHub aus, und nicht mehr bei jedem Merge ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Veröffentlicht am 2026-10-19

Das sind die wichtigsten Änderungen für alle, die Turniere leiten. Die [Hilfe für Verantwortliche](../tournament-managers/index.md) hat alle Einzelheiten.

- **Spieler werden einmal eingetragen, im Turnier.** Auf der alten Seite wurden Spieler in jedem Wettbewerb hinzugefügt. Jetzt ist der Reiter **Spieler** des Turniers der Ort, an dem Sie sie hinzufügen, korrigieren, ordnen und archivieren, und ein Spieler, der dort korrigiert wird, ist in jedem Wettbewerb, in dem er spielt, und auf jeder öffentlichen Seite korrigiert. Siehe [Spieler](../tournament-managers/standard-tournament/players.md).

- **Spieler kommen aus einer Liste in einen Wettbewerb.** Wählen Sie auf der Seite eines Wettbewerbs einen Spieler des Turniers aus der Auswahlliste und drücken Sie auf **Spieler hinzufügen**. Die Auswahlliste bietet nur Spieler an, die noch nicht im Wettbewerb sind. In einer K.-o.-Runde bietet sie für die übrigen Plätze auch **Freilos** an. Siehe [Spieler in einen Wettbewerb eintragen](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Eine Schaltfläche fügt einen Wettbewerb hinzu.** Statt der getrennten Schaltflächen für eine neue Gruppe, ein neues Schweizer System und eine neue K.-o.-Runde drücken Sie auf **Wettbewerb hinzufügen**. Der Dialog fragt nach dem Namen und der Art (Gruppe, K.-o.-Runde oder Schweizer System) und dann danach, was diese Art braucht: auf wie viele Gewinnspiele jedes Match gespielt wird (Best of) und bei einer K.-o.-Runde die Plätze im Tableau. Er bleibt offen, damit Sie mehrere auf einmal hinzufügen können. Die Art eines Wettbewerbs lässt sich danach nicht mehr ändern: Archivieren Sie ihn und fügen Sie ihn neu hinzu. Siehe [Wettbewerbe](../tournament-managers/standard-tournament/competitions.md).

- **Notizen der Verantwortlichen: Nutzen Sie sie statt eines Kommentars, um Spielern zu sagen, was sie wissen müssen.** Das Format, eine Änderung der Spielreihenfolge, die Uhrzeit des Mittagessens. Eine Notiz wird auf dem Reiter **Notizen** des Turniers geschrieben, mit einem Titel und einer Beschreibung in Markdown, und Sie können sie vor dem Hinzufügen in der Vorschau ansehen. Spieler finden Notizen auf der öffentlichen Seite Notizen des Turniers. Eine Notiz, die sie nicht gelesen haben, ist mit einem Sternchen markiert, und der Bereich Notizen auf jeder Seite des Turniers ebenfalls, bis sie sie öffnen. Eine Notiz, die Sie bearbeiten, wird für alle, die sie gelesen hatten, erneut markiert. Siehe [Notizen](../tournament-managers/standard-tournament/notes.md).

- **Die Turnier-Notizen der alten Seite sind jetzt der Untertitel.** Was Sie dort geschrieben haben, bleibt als Untertitel des Turniers erhalten und steht weiterhin unter dem Namen des Turniers auf jeder öffentlichen Seite. Er wird in Markdown geschrieben und darf bis zu 2000 Zeichen lang sein. Er ist für das, was Leser wissen sollten, auf welcher Seite sie auch sind. Nutzen Sie eine Notiz für Neuigkeiten, die sich im Lauf des Turniers ändern.
