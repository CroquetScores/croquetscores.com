# Classifiche

Quando un torneo vale per le classifiche mondiali, i suoi risultati vengono inviati alle classifiche come file, che il sito scrive per te a partire da ciò che hai inserito. La scheda **Classifiche** è dove lo ottieni.

## La scheda

Apri la pagina del torneo e scegli **Classifiche**, l'ultima delle sue schede. Dice che cos'è il file: un file di testo per l'Association Croquet, un foglio di calcolo per il Golf Croquet e il Croquet americano a 6 archetti. Dice che cosa resta da fare a mano, e che il file va poi inviato ai responsabili delle classifiche mondiali. Sotto c'è **Scarica le classifiche**, che salva il file. C'è prima ancora che sia inserito un solo punteggio, e dà un file senza nulla dentro finché non ce n'è uno.

La scheda c'è solo nella pagina di un torneo che vale per le classifiche mondiali, e solo per i suoi organizzatori: a un segnapunti non viene offerta. Il file stesso si trova all'indirizzo del torneo seguito da `/rankings`, come `/2026/ac/spring-open/rankings`, che è l'indirizzo che il sito gli ha sempre dato, e chiunque abbia l'indirizzo può aprirlo.

## Che cosa c'è nel file

Ogni punteggio inserito e non archiviato c'è, nell'ordine in cui è stato inserito, compreso un punteggio che è stato ritirato e quelli di un giocatore che si è ritirato. Un punteggio archiviato non c'è. Una partita vinta per bye o per ritiro dell'avversario non è stata giocata, quindi non ha una riga.

Un giocatore è indicato con il suo nome nella classifica mondiale, che è il suo nome quando non gliene è stato dato un altro.

L'**Association Croquet** ha un blocco per ogni competizione che ha un punteggio: il suo evento, le sue date, il suo vincitore, se erano incontri o partite singole, e una riga numerata per ogni risultato, come "1 Sam Someone beat Alex Another +9". Un punteggio è gli archetti del vincitore meno quelli dello sconfitto, con un più quando il vincitore ne ha fatti di più, e i peel dopo. L'incontro di un'eliminazione diretta è una riga, con il punteggio di ogni partita di seguito. Il sito può solo indovinare chi ha vinto una competizione, quindi controlla la riga **Winner** di ogni blocco (la parola nel file è in inglese) e correggila prima di inviare il file.

Il **Golf Croquet e il Croquet americano a 6 archetti** hanno un foglio di calcolo: il nome del torneo, i suoi giorni e quante partite contiene, poi una riga numerata per ogni partita, con il cognome e il nome del vincitore, "beat", quelli dello sconfitto, e i due punteggi. Ogni partita dell'incontro di un'eliminazione diretta è una riga a sé. Sotto l'ultima, la riga **Tournament winner:** è lasciata vuota, perché la compili tu.

## Quando non c'è un file

Un torneo che non vale per le classifiche mondiali non ha un file. Aprire il suo indirizzo delle classifiche mostra una pagina che lo dice e dice perché: il suo sport non ha classifiche mondiali, si gioca con handicap, ammette i pareggi, oppure è stato tolto il segno di spunta che lo fa valere. Questo si stabilisce quando il torneo viene creato, e si cambia con **Modifica**.

Avanti: [Modificare, archiviare e ripristinare un torneo](changing-and-archiving.md).
