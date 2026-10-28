# Novità

## Rilasciato il 2026-10-28

### Trovare le cose

- **I risultati della ricerca sono tabelle.** I tornei e le competizioni che una ricerca trova sono ora disposti come gli elenchi della home: i giorni in cui si è giocato ciascuno, il tipo di sport, la bandiera del suo paese e il nome. Una competizione mostra i giorni, il tipo di sport e la bandiera del suo torneo, e il torneo di cui fa parte. Le date e i nomi si possono ordinare, ogni tabella per conto suo, e l'ordinamento resta nell'indirizzo della pagina accanto a ciò che hai scritto. L'ordinamento riordina solo i cento risultati mostrati, che sono i migliori per le tue parole, non tutti quelli trovati.
- **I paesi più frequentati vengono per primi.** Ovunque tu scelga un paese, l'elenco ora comincia con Australia, Egitto, Inghilterra, Nuova Zelanda, Spagna e Stati Uniti, poi gli altri paesi in cui si sono giocati tornei dal 2025, poi tutti gli altri, con una linea tra i tre gruppi.
- **Ogni torneo mostra il suo sport.** Su un tablet o uno schermo più largo, gli elenchi dei tornei nella home e nella pagina di un anno mostrano lo sport del torneo come codice breve, per esempio GC o AC, di un colore diverso per ogni sport, dopo le date. Su un telefono il codice viene omesso per lasciare spazio ai nomi.
- **Home.** I tornei in programma della home sono ora sotto i risultati recenti a qualsiasi larghezza.
- **Le bandiere non affollano più il telefono.** Su un telefono, la colonna delle bandiere è omessa da ogni elenco di tornei, così i nomi hanno più spazio.
- **L'elenco dei paesi resta aperto in Chrome su Linux.** Premendo il campo del paese nella home, l'elenco si apriva e si richiudeva subito. Ora resta aperto, e scorre.

### Seguire un torneo

- **Handicap.** I direttori di un torneo ora possono dare un handicap a un giocatore, come 4, +4 o -1.5. Viene mostrato dopo il nome del giocatore, con ciò che rappresenta se c'è qualcosa, come in Tim Murphy (4, Australia).
- **Peeling nella griglia svizzera.** Un risultato nella griglia svizzera ora termina con il peeling della partita, come già fa il file di testo delle classifiche. Una partita vinta 26tp a 17 si legge +9tp per il vincitore e -9tp per lo sconfitto. Una partita senza peeling si legge come prima.

### Tornei portati dai vecchi siti

- **Più tornei sono nel paese giusto.** Molti tornei erano arrivati nel paese sbagliato, perché i vecchi siti conoscevano solo il fuso orario. Ora il sito legge il paese dal nome di un torneo dove può, come Irish, Welsh, Bayfield o CroqCan, e mette ogni incontro Inghilterra contro Scozia nel paese che ha ospitato quell'anno. Grazie a Chris Williams per il suo aiuto.
- **I tornei ancora da giocare vengono portati** anche se i loro direttori non hanno ancora aggiunto una competizione, così puoi trovare quando e dove si giocano.
- **Un handicap dopo il nome di un giocatore** nei vecchi siti, come in Tim Murphy 1, non è più scambiato per parte del nome quando si cerca il suo ranking mondiale.

## Rilasciato il 2026-10-27

Croquet Scores è stato riscritto da zero con l'IA, in TypeScript. Ecco che cosa noterai.

### Trovare le cose

- **Cerca.** Ogni pagina ha una casella di ricerca in alto. Scrivi un nome e premi Cerca per trovare tornei, competizioni e giocatori. I risultati sono in tre elenchi, e un elenco vuoto viene omesso. Se di un tipo ce ne sono più di cento, la pagina lo dice, e aggiungere una parola alla ricerca la restringe.
- **Restringi i tornei per paese, regione e sport.** Nella home, scegli un paese per vedere solo i tornei che vi si giocano. Una volta scelto un paese puoi scegliere uno stato o una provincia di quel paese, e puoi scegliere anche uno sport. Ciò che hai scelto è nell'indirizzo della pagina, quindi puoi aggiungerlo ai preferiti o mandarlo a qualcuno, e il pulsante Indietro lo annulla. **Scegliere uno stato o una provincia trova solo i tornei nuovi.** Quelli più vecchi non hanno uno stato o una provincia, quindi scegliendone uno vengono esclusi.

### Seguire un torneo

- **Note dei direttori.** I direttori di un torneo ora possono scrivere note per dire ai giocatori ciò che devono sapere mentre si gioca: il formato, un cambio nell'ordine di gioco, l'ora del pranzo. Si trovano nella nuova sezione Note del torneo, le più recenti per prime, con il tempo trascorso da quando ciascuna è stata scritta.
- **Un asterisco (\*) segna ciò che non hai letto.** Una nota ne ha uno finché non la apri, e di nuovo se viene modificata dopo che l'hai letta. Finché una nota non è letta, anche la sezione Note ne ha uno, in ogni pagina del torneo, così vedi che ci sono novità senza andare a controllare. Anche la cronaca è segnata allo stesso modo. Il tuo browser ricorda ciò che hai letto, quindi non serve accedere. Un altro telefono o computer parte senza nulla di letto.
- **La cronaca è più facile da seguire.** Nel vecchio sito, ogni nuovo commento spingeva la pagina in fondo, e chi rileggeva i commenti precedenti perdeva il segno. Ora la pagina scende a un nuovo commento solo se sei già in fondo, a leggere l'ultimo. Se sei tornato indietro a leggere commenti precedenti, ti lascia dove sei.

### Il sito

- **La tua lingua.** Il sito è ora in diciassette lingue: Afrikaans, العربية (مصر), 中文, Nederlands, English, Français, Deutsch, Italiano, 日本語, 한국어, Te Reo Māori, Polski, Português, Русский, Español, Svenska e Cymraeg. Ti viene mostrata la prima lingua richiesta dal tuo browser che il sito ha, oppure l'inglese se non ne ha nessuna. Per sceglierne un'altra, usa l'elenco nel piè di pagina in fondo a qualsiasi pagina e premi il pulsante accanto. Se vuoi che venga aggiunta una lingua, scrivi a <croquetscores@gmail.com>.
- **Chiaro o scuro.** Sempre nel piè di pagina: scegli Chiaro, Scuro o Sistema. Sistema segue il tuo telefono o computer. Il sito ricorda la tua scelta in ogni pagina e a ogni visita.
- **Quale versione stai usando.** Il piè di pagina ora mostra la versione del sito che stai guardando, come v234. Se segnali un problema, per favore indica di quale versione si trattava.

### Open source

Il codice è ora open source, con la GNU Affero General Public License versione 3 (AGPL-3.0). Chiunque può leggerlo, usarlo e modificarlo, e chiunque pubblichi come sito web una versione modificata deve condividere le sue modifiche con la stessa licenza.
