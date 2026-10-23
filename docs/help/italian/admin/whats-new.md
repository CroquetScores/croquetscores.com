# Novità per i direttori di torneo

## Pubblicato il 2026-10-23

Questi sono i cambiamenti principali dall'ultima versione. Ognuno rimanda alla pull request che l'ha fatto.

- **Handicap, pareggi e classifiche mondiali si impostano in ogni competizione.** Prima toccava al torneo deciderli, così un torneo non poteva avere un girone con handicap accanto a uno senza, né un test in cui il pareggio è ammesso accanto a un'eliminazione diretta in cui non lo è. Ogni competizione, e ogni test, ora chiede tutti e tre quando viene aggiunta o modificata, e il modulo del torneo non li chiede più. L'ultimo si chiede solo dove lo sport ha classifiche mondiali, e una competizione che non conta resta fuori dal file delle classifiche. Vedi [Competizioni](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **L'elenco dei tornei dell'amministrazione si può restringere per paese, regione e sport.** Le scelte sono nell'indirizzo, così si può condividere il link a un elenco filtrato, e viene proposto solo ciò che contiene il tuo elenco. Una regione viene proposta dopo aver scelto un paese. I tornei prima di novembre 2026 non hanno regione, quindi sceglierne una li nasconde, e gli elenchi pubblici lo dicono. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **I responsabili della classifica mondiale ora sono un ruolo per ogni sport.** Un responsabile di Association Croquet vede e cura i tornei di Association Croquet, e uno di Golf Croquet quelli di Golf Croquet. Un torneo che organizzi o di cui segni i punteggi resta nel tuo elenco, qualunque sia il suo sport. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **La scheda Classifiche spiega il file in un solo paragrafo, qualunque sia lo sport,** con il link per scaricarlo sotto. Vedi [Classifiche](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **Il nome di un torneo non può essere tutto in minuscolo o tutto in maiuscolo,** e il messaggio ora lo dice come regola. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Rimuovi è un cestino** nelle schede degli organizzatori e dei segnapunti, nei giocatori della competizione e nella pagina degli account dell'amministratore, come lo erano già Archivia ed Elimina. Si chiama ancora Rimuovi quando ci passi sopra, e un lettore di schermo lo legge ancora come Rimuovi. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Ogni lingua ha parole nuove.** Le parole del sito in tutte le altre sedici lingue sono scritte da capo, e l'aiuto è allineato a esse. L'aiuto per i lettori e per gli account, e le condizioni d'uso, ora sono anch'essi in ogni lingua. Nessuno è stato ancora letto da un madrelingua, quindi dicci cosa suona male. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Dietro le quinte.** L'importazione dei vecchi siti dà ad alcuni fusi orari e a un torneo un altro paese ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), e carica un dump nel server e crea i modelli di lettura con uno script ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). Il sito viene pubblicato con uno script, da un computer o da GitHub, e non più a ogni merge ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Rilasciato il 2026-10-19

Questi sono i cambiamenti principali per chi organizza tornei. L'[aiuto per i direttori di torneo](../tournament-managers/index.md) ha tutti i dettagli.

- **I giocatori si inseriscono una sola volta, nel torneo.** Nel vecchio sito i giocatori si aggiungevano dentro ogni competizione. Ora è la scheda **Giocatori** del torneo il posto dove aggiungerli, correggerli, ordinarli e archiviarli, e un giocatore corretto lì è corretto in ogni competizione in cui si trova e in ogni pagina pubblica. Vedi [Giocatori](../tournament-managers/standard-tournament/players.md).

- **I giocatori si inseriscono in una competizione da un elenco.** Nella pagina di una competizione, scegli un giocatore del torneo dal menu a discesa e premi **Aggiungi giocatore**. Il menu offre solo i giocatori che non sono già nella competizione. In un'eliminazione diretta offre anche **Bye** per i posti che avanzano. Vedi [Inserire i giocatori in una competizione](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Un solo pulsante aggiunge una competizione.** Al posto dei pulsanti separati per un nuovo girone, un nuovo sistema svizzero e una nuova eliminazione diretta, premi **Aggiungi competizione**. La finestra chiede il nome e il tipo (un girone, un'eliminazione diretta o un sistema svizzero), poi ciò che serve a quel tipo: al meglio di quante partite è ogni incontro e, per un'eliminazione diretta, i posti del suo tabellone. Resta aperta, così puoi aggiungerne più d'una alla volta. Il tipo di una competizione non si può cambiare dopo: archiviala e aggiungila di nuovo. Vedi [Competizioni](../tournament-managers/standard-tournament/competitions.md).

- **Note dei direttori: usale al posto della cronaca per dire ai giocatori ciò che devono sapere.** Il formato, un cambio nell'ordine di gioco, l'ora del pranzo. Una nota si scrive nella scheda **Note** del torneo, con un titolo e una descrizione in Markdown, e puoi vederne l'anteprima prima di aggiungerla. I giocatori trovano le note nella pagina pubblica Note del torneo. Una nota che non hanno letto è segnata da un asterisco, e lo è anche la sezione Note in ogni pagina del torneo, finché non la aprono. Una nota che modifichi viene segnata di nuovo per tutti quelli che l'avevano letta. Vedi [Note](../tournament-managers/standard-tournament/notes.md).

- **Le note del torneo del vecchio sito ora sono il Sottotitolo.** Ciò che vi avevi scritto è conservato come sottotitolo del torneo, ed è ancora mostrato sotto il nome del torneo in ogni pagina pubblica. Si scrive in Markdown e può arrivare a 2000 caratteri. Serve per ciò che i lettori devono sapere in qualunque pagina si trovino. Usa una nota per le novità che cambiano mentre il torneo prosegue.
