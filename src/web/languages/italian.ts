// The site's words in Italian. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as tu rather than Lei: the site talks to people
// scoring and following croquet, and the English it is written from is plain
// and direct rather than formal. Items in menus and on buttons are written in
// sentence case, as Italian writes them, where the English capitalises each
// word. An email address is an "indirizzo email", and "email" alone is left to
// the message that is sent. Hoops are "archetti", as Italian croquet players
// call them, and a bye stays "Bye" because that is the word a draw is read by.
import type { Language } from "../common/language.js";

export const italian: Language = {
  tag: "it",
  name: "Italiano",
  words: {
    "site.skipToContent": "Vai al contenuto",
    "navigation.menu": "Menu",
    "navigation.label": "Principale",
    "navigation.home": "Home",
    "navigation.help": "Aiuto",
    "navigation.admin": "Amministrazione",
    "sections.label": "Sezioni",
    "theme.label": "Tema",
    "theme.light": "Chiaro",
    "theme.dark": "Scuro",
    "theme.system": "Sistema",
    "footer.donate": "Dona",
    "footer.plea":
      "Ti piace {siteName}? Fai una donazione per aiutarci a continuare a svilupparlo.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacy",
    "beta.banner":
      "Questo è un sito beta. I dati possono essere azzerati in qualsiasi momento.",
    "privacy.contact":
      "Domande su questa pagina, o su ciò che viene conservato su di te: {emailAddress}",
    "tryWebsite.banner":
      "Questo è uno spazio sicuro per imparare a usare {siteName}. Tutto ciò che inserisci qui può essere cancellato in qualsiasi momento.",

    "language.label": "Lingua",
    "language.choose": "Cambia",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "C'è una novità da leggere.",
    "whatsNew.admin.message": "C'è una novità per chi gestisce i tornei.",
    "whatsNew.view": "Vedi le novità",
    "whatsNew.later": "Ricordamelo la prossima volta",
    "whatsNew.never": "Non mostrarmi più questo avviso",

    "form.otherwise":
      "Qualcosa non va. Controlla quello che hai inserito e riprova.",

    "account.menu": "Account",
    "account.register": "Registrati",
    "account.signIn": "Accedi",
    "account.forgotPassword": "Password dimenticata",
    "account.signOut": "Esci",
    "account.profile": "Profilo",
    "account.changePassword": "Cambia password",
    "account.changeEmailAddress": "Cambia indirizzo email",
    "account.changeName": "Cambia nome",
    "account.setPassword": "Imposta password",
    "account.forgetAccount": "Dimentica account",

    "register.title": "Registrati",
    "register.emailAddress": "Indirizzo email",
    "register.submit": "Registrati",
    "register.withGoogle": "Registrati con Google",
    "register.or": "oppure",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google non ha confermato che quell'indirizzo email sia tuo, quindi qui non può essere usato con Google. Usa invece il tuo indirizzo email qui sotto.",
    "SignInWithGoogle.LinkedToAnother":
      "Quell'indirizzo email ha già un account, collegato a un altro account Google. Accedi con quell'account Google, oppure con il tuo indirizzo email e la tua password.",
    "SignInWithGoogle.NameMissing":
      "Google non ci ha detto il tuo nome, e un account ne ha bisogno. Usa invece il tuo indirizzo email qui sotto.",
    "Google.Unreachable":
      "In questo momento non è stato possibile raggiungere Google. Riprova tra qualche minuto, oppure usa il tuo indirizzo email qui sotto.",
    "Registration.NotAPerson":
      "Non sembrava che la richiesta arrivasse da una persona. Riprova e, se continua a succedere, aspetta qualche minuto e torna.",

    "EmailAddress.Missing": "Inserisci un indirizzo email.",
    "EmailAddress.NoAt": "Un indirizzo email contiene una @.",
    "EmailAddress.MoreThanOneAt": "Un indirizzo email contiene una sola @.",
    "EmailAddress.NoDomain":
      "Un indirizzo email ha un dominio dopo la @, come example.com.",

    "welcome.title": "Controlla la tua posta",
    "welcome.checkEmail":
      "Ti stiamo inviando un'email all'indirizzo che ci hai dato. Segui il link che contiene per continuare.",
    "welcome.nothingArrived":
      "Se tra qualche minuto non arriva nulla, guarda nella cartella della posta indesiderata o dello spam.",
    "welcome.home": "Torna a {siteName}",
    "newConfirmationLink.title": "Richiedi un nuovo link",
    "newConfirmationLink.explanation":
      "Il link per confermare il tuo indirizzo email è scaduto. Richiedine uno nuovo e verrà inviato all'indirizzo con cui ti sei registrato.",
    "newConfirmationLink.send": "Inviami un nuovo link",
    "newConfirmationLink.home": "Torna a {siteName}",
    "newConfirmationLink.signIn": "Accedi",
    "newConfirmationLink.sent.title": "Controlla la tua posta",
    "newConfirmationLink.sent.explanation":
      "Un nuovo link è in arrivo. Seguilo per confermare il tuo indirizzo email. Se tra qualche minuto non arriva nulla, guarda nella cartella della posta indesiderata o dello spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Quell'indirizzo email è già confermato",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Non c'è altro da confermare. Accedi con la password che hai scelto quando l'hai confermato.",
    "newConfirmationLink.noLongerWorks.title": "Quel link non funziona più",
    "newConfirmationLink.noLongerWorks.explanation":
      "Controlla di aver seguito il link intero dell'email, senza che manchi niente alla fine. Se ancora non funziona, registrati di nuovo e ti sarà inviato un nuovo link.",
    "newConfirmationLink.tooMany.title": "Riprova più tardi",
    "newConfirmationLink.tooMany.explanation":
      "Di recente sono stati inviati diversi link a questo indirizzo. Aspetta un'ora e richiedine un altro, e nel frattempo guarda nella cartella della posta indesiderata o dello spam.",

    "forgotPassword.title": "Hai dimenticato la password?",
    "forgotPassword.emailAddress": "Indirizzo email",
    "forgotPassword.submit": "Inviami un modo per rientrare",
    "forgotPassword.home": "Torna a {siteName}",
    "forgotPassword.sent.title": "Controlla la tua posta",
    "forgotPassword.sent.explanation":
      "Se quell'indirizzo ha un account, ti stiamo inviando un link per impostare una nuova password. Seguilo entro un'ora. Se tra qualche minuto non arriva nulla, guarda nella cartella della posta indesiderata o dello spam.",
    "forgotPassword.tryAgainLater":
      "Di recente da qui sono state fatte troppe richieste per rientrare. Aspetta un'ora e riprova.",

    "setNewPassword.title": "Imposta una nuova password",
    "setNewPassword.password": "Password",
    "setNewPassword.confirmPassword": "Conferma la password",
    "setNewPassword.submit": "Imposta la mia nuova password",
    "setNewPassword.home": "Torna a {siteName}",
    "setNewPassword.signIn": "Accedi",
    "setNewPassword.askAgain": "Richiedi un nuovo link",
    "setNewPassword.changed.title": "La tua password è stata cambiata",
    "setNewPassword.changed.explanation":
      "Sei uscito da ogni posto in cui avevi effettuato l'accesso. Accedi con la tua nuova password.",
    "setNewPassword.expired.title": "Quel link è scaduto",
    "setNewPassword.expired.explanation":
      "Un link per impostare una nuova password funziona per un'ora. Richiedine un altro e sarà inviato allo stesso indirizzo.",
    "setNewPassword.noLongerWorks.title": "Quel link non funziona più",
    "setNewPassword.noLongerWorks.explanation":
      "Potrebbe essere già stato usato, oppure potrebbe mancare qualcosa alla fine. Richiedine un altro se ti serve ancora.",

    "BreachedPasswords.Unreachable":
      "In questo momento non è possibile controllare la tua password, quindi non è stata cambiata. Riprova tra qualche minuto; il tuo link funziona finché non scade.",

    "forgetAccount.title": "Dimentica il tuo account",
    "forgetAccount.explanation":
      "Il tuo nome e il tuo indirizzo email possono essere resi illeggibili per sempre e il tuo account chiuso. Per essere sicuri che sei tu, prima ti invieremo un'email con un link all'indirizzo del tuo account, e non verrà dimenticato nulla finché non lo segui.",
    "forgetAccount.submit": "Inviami il link per email",
    "forgetAccount.sent.title": "Controlla la tua posta",
    "forgetAccount.sent.explanation":
      "Abbiamo inviato un link per email all'indirizzo del tuo account. Funziona per 15 minuti, e solo mentre hai effettuato l'accesso a questo account.",
    "forgetAccount.confirm.title": "Dimenticare il tuo account per sempre?",
    "forgetAccount.confirm.explanation":
      "Una volta dimenticati, il tuo nome e il tuo indirizzo email non potranno mai più essere letti da nessuno, e non sarà più possibile accedere al tuo account. Non si può annullare.",
    "forgetAccount.confirm.submit": "Dimentica il mio account",
    "forgetAccount.forgotten.title": "Il tuo account è stato dimenticato",
    "forgetAccount.forgotten.explanation":
      "Il tuo nome e il tuo indirizzo email non possono più essere letti, e sei uscito da ogni posto in cui avevi effettuato l'accesso.",
    "forgetAccount.noLongerWorks.title": "Quel link non funziona più",
    "forgetAccount.noLongerWorks.explanation":
      "Potrebbe essere scaduto, essere già stato usato, o riguardare un account a cui non hai effettuato l'accesso. Se vuoi ancora che venga dimenticato, richiedilo di nuovo dal tuo account.",
    "forgetAccount.lastAdministrator.title":
      "Il tuo account non può essere dimenticato",
    "forgetAccount.lastAdministrator.explanation":
      "Sei l'unico amministratore di questo sito. Assegna il ruolo di amministratore a qualcun altro, e poi il tuo account potrà essere dimenticato.",
    "forgetAccount.askAgain": "Richiedi di nuovo",
    "forgetAccount.home": "Torna a {siteName}",

    "registrationsSuspended.title": "Le registrazioni sono sospese per ora",
    "registrationsSuspended.explanation":
      "In questo momento non è possibile raggiungere un servizio necessario per la registrazione, quindi nessuno può registrarsi finché non risponde di nuovo. Non è stato conservato nulla di ciò che hai scritto.",
    "registrationsSuspended.tryAgainLater":
      "Riprova tra un po'. L'amministratore del sito è stato avvisato.",
    "registrationsSuspended.home": "Torna a {siteName}",

    "signIn.title": "Accedi",
    "signIn.emailAddress": "Indirizzo email",
    "signIn.password": "Password",
    "signIn.submit": "Accedi",
    "signIn.forgotPassword": "Password dimenticata?",
    "signIn.register": "Registrati",
    "signIn.withGoogle": "Accedi con Google",
    "signIn.or": "oppure",
    "signIn.tryAgainLater":
      "Di recente sono stati fatti troppi tentativi. Aspetta un'ora e riprova.",

    "SignIn.Failed":
      "L'indirizzo email o la password non sono corretti. Riprova.",

    "profile.title": "Profilo",
    "profile.name": "Nome:",
    "profile.emailAddress": "Indirizzo email:",

    "changeName.title": "Cambia nome",
    "changeName.name": "Nome",
    "changeName.submit": "Cambia nome",

    "setPassword.title": "Imposta una password",
    "setPassword.explanation":
      "Il tuo account non ha una password: accedi con Google. Per poter accedere anche con una password, invieremo a {emailAddress} un'email con un link per impostarne una.",
    "setPassword.submit": "Inviami un link per email",
    "setPassword.sent.title": "Controlla la tua posta",
    "setPassword.sent.explanation":
      "Ti abbiamo inviato un'email con un link per impostare una password. Funziona per un'ora.",
    "setPassword.profile": "Torna al tuo profilo",

    "changePassword.title": "Cambia password",
    "changePassword.currentPassword": "Password attuale",
    "changePassword.password": "Nuova password",
    "changePassword.passwordConfirmation": "Conferma la password",
    "changePassword.forgotPassword": "Password dimenticata?",
    "changePassword.submit": "Cambia password",
    "ChangePassword.WrongPassword": "Quella non è la tua password.",

    "changeEmailAddress.title": "Cambia indirizzo email",
    "changeEmailAddress.emailAddress": "Nuovo indirizzo email",
    "changeEmailAddress.currentPassword": "Password attuale",
    "changeEmailAddress.submit": "Invia un link di conferma",
    "changeEmailAddress.sent.title": "Controlla la tua posta",
    "changeEmailAddress.sent.explanation":
      "Un link per confermare il trasferimento è stato inviato al nuovo indirizzo email. Seguilo, dopo aver effettuato l'accesso, per spostare lì il tuo account.",
    "changeEmailAddress.confirm.title": "Sposta il tuo account",
    "changeEmailAddress.confirm.explanation":
      "Il tuo account verrà spostato a {emailAddress}. D'ora in poi accederai con quell'indirizzo.",
    "changeEmailAddress.confirm.submit": "Sposta il mio account",
    "changeEmailAddress.noLongerWorks.title": "Questo link non funziona più",
    "changeEmailAddress.noLongerWorks.explanation":
      "È scaduto, è già stato usato, oppure non è stato inviato per l'account a cui hai effettuato l'accesso. Richiedilo di nuovo dal tuo profilo.",
    "changeEmailAddress.taken.title": "Il tuo account non è stato spostato",
    "changeEmailAddress.profile": "Torna al tuo profilo",
    "ChangeEmailAddress.WrongPassword": "Quella non è la tua password.",
    "ChangeEmailAddress.Unchanged": "Il tuo account ha già questo indirizzo.",
    "ChangeEmailAddress.Taken":
      "Quell'indirizzo email ha ormai un account suo, quindi il tuo non può essere spostato lì.",

    "confirmEmailAddress.title": "Conferma il tuo indirizzo email",
    "confirmEmailAddress.name": "Nome",
    "confirmEmailAddress.password": "Password",
    "confirmEmailAddress.confirmPassword": "Conferma la password",
    "confirmEmailAddress.submit": "Conferma il mio indirizzo email",
    "confirmEmailAddress.signIn": "Accedi",
    "confirmEmailAddress.home": "Torna a {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Il tuo indirizzo email è confermato",
    "confirmEmailAddress.confirmed.explanation":
      "Il tuo account è pronto. Accedi con l'indirizzo email e la password che hai appena inserito.",
    "confirmEmailAddress.expired.title": "Quel link è scaduto",
    "confirmEmailAddress.expired.explanation":
      "Un link per confermare un indirizzo email funziona per 24 ore. Richiedine uno nuovo e sarà inviato allo stesso indirizzo.",
    "confirmEmailAddress.expired.newLink": "Inviami un nuovo link",
    "confirmEmailAddress.noLongerWorks.title": "Quel link non funziona più",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Controlla di aver seguito il link intero dell'email, senza che manchi niente alla fine. Se ancora non funziona, registrati di nuovo e ti sarà inviato un nuovo link.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Quell'indirizzo email è già confermato",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Non c'è altro da fare. Accedi con la password che hai scelto quando l'hai confermato.",

    "PersonName.Missing": "Inserisci un nome.",
    "PersonName.TooShort": "Un nome deve avere almeno 3 caratteri.",
    "PersonName.TooLong": "Un nome può avere al massimo 254 caratteri.",
    "WorldRankingName.TooShort":
      "Un nome della classifica mondiale deve avere almeno 3 caratteri.",
    "WorldRankingName.TooLong":
      "Un nome della classifica mondiale può avere al massimo 254 caratteri.",
    "Password.Missing": "Inserisci una password.",
    "Password.TooShort": "Una password deve avere almeno 12 caratteri.",
    "Password.ConfirmationDiffers":
      "Non è uguale alla password qui sopra. Scrivila di nuovo.",
    "Password.Breached":
      "Questa password è comparsa in una violazione di dati da qualche altra parte, quindi non è sicura da usare qui. Scegline un'altra.",

    "javaScriptRequired.title": "Serve JavaScript",
    "javaScriptRequired.explanation":
      "Per registrarsi bisogna attivare JavaScript per questo sito, così che possa verificare che chi si registra sia una persona. Attivalo, poi registrati di nuovo.",
    "javaScriptRequired.register": "Torna alla registrazione",
    "javaScriptRequired.home": "Torna a {siteName}",

    "errors.backHome": "Torna a {siteName}",
    "errors.notFound": "Non trovato",
    "errors.refused": "Non è stato possibile farlo",
    "errors.refusedDetail": "Qualcosa in ciò che è stato inviato non va.",
    "errors.sorry": "Spiacenti",
    "errors.sorryDetail": "Non è stato possibile gestire quella richiesta.",
    "errors.failed": "Qualcosa è andato storto",
    "errors.reference": "Riferimento {reference}.",
    "errors.unavailable": "Il sito non è disponibile",
    "errors.unavailableDetail":
      "Il sito non riesce a raggiungere ciò che gli serve in questo momento. Riprova più tardi.",
    "errors.maintenance": "Il sito è in manutenzione.",
    "errors.maintenanceMinutes": "Dovrebbe tornare tra {minutes} minuti.",
    "errors.maintenanceMinute": "Dovrebbe tornare tra 1 minuto.",
    "errors.maintenanceLonger":
      "Ci vuole più tempo del previsto; il sito tornerà presto.",

    "home.recentResults": "Risultati recenti",
    "home.recentResults.none":
      "Negli ultimi sette giorni non è stata aggiunta nessuna partita.",
    "home.upcomingTournaments": "Prossimi tornei",
    "home.upcomingTournaments.none":
      "Nessun torneo inizia nei prossimi sessanta giorni.",
    "home.allTournaments": "Tutti i tornei del {year}",
    "year.heading": "Tornei del {year}",
    "year.none": "Nessun torneo inizia nel {year}.",
    "yearSport.heading": "Tornei di {sport} del {year}",
    "yearSport.none": "Nessun torneo di {sport} inizia nel {year}.",
    "tournament.recent": "Recenti",
    "tournament.summary": "Riepilogo",
    "test.bestOf": "Ogni incontro è al meglio di {count}.",
    "test.vs": "contro",
    "test.matches": "Incontri",
    "test.games": "Partite",
    "test.hoops": "Archetti",
    "teamSummary.tests": "Test",
    "teamSummary.matches": "Incontri",
    "teamSummary.games": "Partite",
    "teamSummary.hoops": "Archetti",
    "teamSummary.wins": "Vittorie",
    "teamSummary.losses": "Sconfitte",
    "teamSummary.draws": "Pareggi",
    "teamSummary.for": "Fatte",
    "teamSummary.against": "Subite",
    "teamSummary.net": "Differenza",
    "tournament.players": "Giocatori",
    "search.label": "Cerca",
    "search.tournaments": "Tornei",
    "search.competitions": "Competizioni",
    "search.nothingFound": "Non è stato trovato nulla.",
    "players.search.label": "Cerca giocatori",
    "players.search.prompt": "Digita il nome di un giocatore per trovarlo.",
    "players.search.none": "Nessun giocatore trovato.",
    "search.more":
      "Sono mostrati solo i primi {count}. Aggiungi altro del nome per restringere la ricerca.",
    "websitePlayer.tournament": "Torneo",
    "tournament.test": "{first} contro {second}",
    "tournament.notes": "Note",
    "tournament.commentary": "Cronaca",
    "tournament.beat": "ha battuto",
    "tournament.drewWith": "ha pareggiato con",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 ora",
    "tournament.ago.hours": "{count} ore",
    "tournament.none": "Non è ancora stata giocata nessuna partita.",
    "players.none": "Non è ancora stato aggiunto nessun giocatore.",
    "commentaries.by": "di",
    "commentaries.start": "Inizia una nuova cronaca",
    "commentaries.disclaimer.heading": "Avvertenza",
    "commentaries.disclaimer":
      "Le opinioni espresse in questi commenti sono quelle degli autori e non riflettono necessariamente quelle di Tim Murphy o di {site}.",
    "commentaries.guidelines.heading": "Linee guida",
    "commentaries.guidelines.responsible":
      "Sei responsabile della tua cronaca.",
    "commentaries.guidelines.purpose":
      "La cronaca serve a far sapere che cosa sta succedendo al torneo. Non è pensata come uno spazio da «social media» per mandare auguri e simili.",
    "commentaries.guidelines.hatred":
      "Non pubblicare materiale che possa incitare alla violenza o all'odio. Non tolleriamo commenti che umiliano gli altri per razza, religione, origine etnica, genere, età, disabilità mentale o fisica o orientamento sessuale.",
    "commentaries.guidelines.abuse":
      "Gli insulti gratuiti non saranno tollerati. La regola generale è che i commenti devono parlare dell'argomento e non attaccare la persona, cioè non attaccare qualcuno personalmente ma riguardare la questione in discussione.",
    "commentaries.guidelines.unlawful":
      "Qualsiasi commento legalmente discutibile, come possibili violazioni del diritto d'autore o materiale potenzialmente diffamatorio, sarà rimosso.",
    "commentaries.guidelines.shouting":
      "Per favore, nei commenti non usare parolacce e non scrivere tutto in maiuscolo.",
    "commentaries.guidelines.selling":
      "Non usare la sezione dei commenti per scopi commerciali o per lo spam. I commenti che pubblicizzano, promuovono o sollecitano beni o servizi saranno rimossi.",
    "commentaries.guidelines.links":
      "Per favore, limita l'uso di link nei commenti. I commenti che contengono link a materiale inadatto saranno rimossi.",
    "commentaries.guidelines.impersonating":
      "Non spacciarti per altre persone nella sezione dei commenti e non pubblicare dati personali – numeri di telefono, indirizzi postali o indirizzi email – che potrebbero mettere qualcuno in pericolo senza volerlo.",
    "commentaries.reporting.heading": "Segnalare un commento",
    "commentaries.reporting.before":
      "Per favore, segnala i commenti che non rispettano queste linee guida a",
    "commentaries.reporting.after":
      ". Indica l'indirizzo web e il commento discutibile, ad esempio:",
    "commentaries.reporting.exampleComment":
      "«un commento che dovrebbe essere rimosso»",
    "commentaries.reporting.exampleReason":
      "Questo commento dovrebbe essere rimosso perché...",
    "commentaries.reporting.reviewed":
      "Segnalare un problema non significa rimozione automatica, ma tutte le segnalazioni saranno esaminate.",
    "commentaries.reporting.reserved":
      "{site} si riserva il diritto di rimuovere i commenti.",
    "commentaries.reporting.subject": "Segnalazione di un commento su {site}",
    "commentaries.reporting.body":
      "Indica l'indirizzo web, il commento discutibile e perché dovrebbe essere rimosso.",
    "startCommentary.title": "Inizia una nuova cronaca",
    "startCommentary.titleField": "Titolo",
    "startCommentary.submit": "Inizia la cronaca",
    "marks.new": "nuovo",
    "notes.none": "Gli organizzatori non hanno ancora scritto nessuna nota.",
    "note.edited": "modificata",
    "commentary.none": "Non è ancora stato scritto nessun commento.",
    "commentary.edited": "modificato",
    "commentary.edit": "Modifica",
    "commentary.delete": "Elimina",
    "commentary.comment": "Commento",
    "commentary.add": "Aggiungi commento",
    "commentary.notSent":
      "Non è stato possibile inviare il commento. Ricarica la pagina per vedere se è stato conservato.",
    "changeCommentaryTitle.title": "Cambia titolo",
    "changeCommentaryTitle.submit": "Salva",
    "editComment.title": "Modifica commento",
    "editComment.save": "Salva",
    "deleteComment.title": "Elimina commento",
    "deleteComment.question":
      "Eliminare questo commento? Non si può annullare.",
    "deleteComment.confirm": "Elimina commento",
    "deleteComment.keep": "Conservalo",
    "player.games": "Partite",
    "player.competitions": "Competizioni",
    "player.beat": "ha battuto",
    "player.lostTo": "ha perso contro",
    "player.drewWith": "ha pareggiato con",
    "player.score": "{score} a {opponent}",
    "player.noGames": "Non è ancora stata giocata nessuna partita.",
    "player.noCompetitions": "Non è ancora iscritto a nessuna competizione.",
    "block.wins": "Vittorie",
    "block.matches": "Incontri",
    "block.netGames": "Differenza partite",
    "block.games": "Partite",
    "block.netHoops": "Differenza archetti",
    "block.won": "vinta",
    "block.lost": "persa",
    "block.drawn": "pareggiata",
    "block.withdrawn": "ritirato",
    "block.gameWithdrawn": "ritirata",
    "block.losses": "Sconfitte",
    "competition.views": "Viste",
    "competition.view.grid": "Griglia",
    "competition.view.summary": "Riepilogo",
    "competition.view.orderOfPlay": "Ordine di gioco",
    "blockSummary.ranking":
      "In ordine di quota di incontri vinti, poi di differenza archetti. Il regolamento di un torneo può collocare i giocatori in modo diverso.",
    "orderOfPlay.none": "Non è ancora stata giocata nessuna partita.",
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Semifinali",
    "knockout.round.quarters": "Quarti di finale",
    "knockout.round.number": "Turno {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Partite",
    "swiss.wins": "Vittorie",
    "swiss.winShare": "% vittorie",
    "swiss.results": "Risultati",
    "knockout.onward": "Turni successivi",
    "knockout.back": "Turni precedenti",
    "tournamentList.column.date": "Data",
    "tournamentList.column.name": "Nome",
    "tournamentList.onlyIn": "Solo tornei in {country}",
    "tournamentList.filter.country": "Paese",
    "tournamentList.filter.anyCountry": "Qualsiasi paese",
    "tournamentList.filter.region": "Regione",
    "tournamentList.filter.anyRegion": "Qualsiasi regione",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Qualsiasi sport",
    "tournamentList.filter.submit": "Filtra",
    "years.label": "Anni",
    "years.earlier": "Anni precedenti",

    "admin.newerBuild.message":
      "È disponibile una versione più recente di questo sito.",
    "admin.newerBuild.reload": "Ricarica",
    "admin.title": "Amministrazione",
    "admin.tournaments.new": "Nuovo torneo",
    "admin.tournaments.none": "Nessun torneo",
    "admin.tournaments.archived": "Archiviato",
    "admin.tournaments.manage": "Gestisci",
    "admin.tournaments.edit": "Modifica",
    "admin.tournaments.archive": "Archivia",
    "admin.tournaments.restore": "Ripristina",
    "admin.tournaments.scores": "Punteggi",
    "admin.tournaments.players": "Giocatori",
    "admin.years.label": "Anni",
    "admin.years.earlier": "Anni precedenti",
    "admin.tournament.name": "Nome",
    "admin.tournament.starts": "Inizia",
    "admin.tournament.finishes": "Finisce",
    "admin.tournament.format": "Formato",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Paese",
    "admin.tournament.region": "Regione",
    "admin.tournament.subtitle": "Sottotitolo",
    "admin.tournament.handicap": "Si gioca con handicap",
    "admin.tournament.drawsAllowed": "Ammette i pareggi",
    "admin.tournament.levelTestsDrawn": "I test in parità sono pareggiati",
    "admin.tournament.worldRankings": "Vale per le classifiche mondiali",
    "admin.tournament.national": "Evento di livello nazionale",
    "admin.tournament.international": "Evento di livello internazionale",
    "admin.tournament.otherwise": "Così com'è non può essere accettato.",
    "admin.newTournament.title": "Nuovo torneo",
    "admin.newTournament.submit": "Crea torneo",
    "admin.editTournament.title": "Modifica torneo",
    "admin.editTournament.submit": "Aggiorna torneo",
    "admin.editTournament.otherwise":
      "Questo torneo non può essere modificato.",
    "admin.view.tabs": "Torneo",
    "admin.view.players": "Giocatori",
    "admin.view.competitions": "Competizioni",
    "admin.view.managers": "Organizzatori",
    "admin.view.notes": "Note",
    "admin.view.scorers": "Segnapunti",
    "admin.view.rankings": "Classifiche",
    "admin.rankings.textFile":
      "I risultati del torneo vengono inviati alle classifiche mondiali come file di testo, che il sito scrive a partire dalle partite inserite.",
    "admin.rankings.spreadsheet":
      "I risultati del torneo vengono inviati alle classifiche mondiali come foglio di calcolo, che il sito scrive a partire dalle partite inserite.",
    "admin.rankings.fillInWinners":
      "Il sito può solo indovinare chi ha vinto ogni competizione, quindi controlla la riga Winner di ciascuna prima di inviare il file.",
    "admin.rankings.fillInWinner":
      "Il sito non può sapere chi ha vinto il torneo, quindi inseriscilo in fondo al foglio di calcolo prima di inviarlo.",
    "admin.rankings.sendIt":
      "Poi invia il file ai responsabili delle classifiche mondiali.",
    "admin.rankings.download": "Scarica le classifiche",
    "rankings.notAvailable": "Le classifiche non sono disponibili",
    "rankings.notAvailable.sport":
      "Lo sport di questo torneo non ha classifiche mondiali, quindi non ci sono classifiche da inviare.",
    "rankings.notAvailable.handicap":
      "Questo torneo si gioca con handicap, quindi non vale per le classifiche mondiali.",
    "rankings.notAvailable.drawnGames":
      "Questo torneo ammette le partite pari, quindi non vale per le classifiche mondiali.",
    "rankings.notAvailable.notCounted":
      "L'organizzatore di questo torneo ha stabilito che non vale per le classifiche mondiali.",
    "admin.view.otherwise": "Questo torneo non può essere gestito da qui.",
    "admin.competitionView.tabs": "Competizione",
    "admin.competitionView.players": "Giocatori",
    "admin.competitionView.scores": "Punteggi",
    "admin.sections.label": "Il torneo e le sue competizioni",
    "admin.sections.tournament": "Torneo",
    "admin.administrator.sections.label": "Le pagine dell'amministratore",
    "admin.administrator.sections.tournaments": "Tornei",
    "admin.administrator.sections.accounts": "Account",
    "admin.administrator.sections.worldRankings": "Classifiche mondiali",
    "admin.administrator.sections.importErrors": "Errori di importazione",
    "admin.administrator.sections.logs": "Registri",
    "admin.administrator.title": "Amministratore",
    "admin.accounts.title": "Account",
    "admin.roles.add": "Aggiungi",
    "admin.roles.administrator.heading": "Amministratori",
    "admin.roles.administrator.none": "Nessun altro amministratore",
    "admin.roles.administrator.removeTitle": "Rimuovi amministratore",
    "admin.roles.administrator.removeExplanation":
      "{name} non sarà più un amministratore di questo sito.",
    "admin.roles.world-ranking-officer.heading":
      "Responsabili delle classifiche mondiali",
    "admin.roles.world-ranking-officer.none":
      "Nessun responsabile delle classifiche mondiali",
    "admin.roles.world-ranking-officer.removeTitle":
      "Rimuovi responsabile delle classifiche mondiali",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} non sarà più un responsabile delle classifiche mondiali.",
    "admin.worldRankings.title":
      "Importa i giocatori della classifica mondiale",
    "admin.worldRankings.import": "Importa",
    "admin.worldRankings.log": "Come è andata l'importazione",
    "admin.worldRankings.ac.reading":
      "Lettura dell'elenco dell'Association Croquet",
    "admin.worldRankings.ac.read":
      "Giocatori di Association Croquet letti: {players}",
    "admin.worldRankings.ac.kept":
      "Giocatori di Association Croquet conservati: {players}",
    "admin.worldRankings.ac.refused":
      "Non è stato possibile leggere l'elenco dell'Association Croquet, quindi i suoi giocatori sono rimasti come erano.",
    "admin.worldRankings.gc.reading": "Lettura dell'elenco del Golf Croquet",
    "admin.worldRankings.gc.read": "Giocatori di Golf Croquet letti: {players}",
    "admin.worldRankings.gc.kept":
      "Giocatori di Golf Croquet conservati: {players}",
    "admin.worldRankings.gc.refused":
      "Non è stato possibile leggere l'elenco del Golf Croquet, quindi i suoi giocatori sono rimasti come erano.",
    "admin.worldRankings.finished": "Terminata",
    "admin.worldRankings.failed": "L'importazione non è terminata.",
    "admin.worldRankings.otherwise": "Qualcosa è andato storto sul sito.",
    "WorldRankingLists.Unreachable":
      "Non è stato possibile raggiungere il sito delle classifiche mondiali.",
    "WorldRankingLists.Unreadable":
      "L'elenco non è organizzato come lo organizzano le classifiche mondiali: una sua riga non si è potuta leggere, non contiene nessuno, oppure non è scritto in UTF-8.",
    "admin.importErrors.title": "Errori di importazione",
    "admin.importErrors.none": "Nessun errore di importazione",
    "admin.importErrors.otherwise": "Qualcosa è andato storto sul sito.",
    "admin.logs.title": "Registri",
    "admin.logs.severity": "Gravità",
    "admin.logs.text": "Cerca",
    "admin.logs.show": "Mostra",
    "admin.logs.prune": "Ripulisci",
    "admin.logs.pruneAsk":
      "Rimuovere il registro precedente all'ultima ora? Nulla lo ripristina.",
    "admin.logs.removed": "{count} voci sono state rimosse",
    "admin.logs.none": "Nessuna voce nel registro",
    "admin.logs.otherwise": "Qualcosa è andato storto sul sito.",
    "admin.hover.logs.show": "Mostra le voci corrispondenti",
    "admin.hover.logs.prune": "Rimuovi il registro precedente all'ultima ora",
    "admin.hover.logs.pruneAgree":
      "Rimuovi il registro precedente all'ultima ora",
    "admin.importError.title": "Errore di importazione",
    "admin.importError.documentId": "ID del documento",
    "admin.importError.tournament": "Torneo",
    "admin.importError.competition": "Competizione",
    "admin.importError.newSite": "Sito nuovo",
    "admin.importError.oldSite": "Sito vecchio",
    "ImportErrorKept.NotFound":
      "L'importazione non ha conservato nessun errore per quel documento.",
    "admin.competitionView.otherwise":
      "Questa competizione non può essere gestita da qui.",
    "admin.competitions.block": "Girone",
    "admin.competitions.knockout": "Eliminazione diretta",
    "admin.competitions.swiss": "Sistema svizzero",
    "admin.competitions.view": "Vedi",
    "admin.competitions.edit": "Modifica",
    "admin.competitions.up": "Su",
    "admin.competitions.down": "Giù",
    "admin.competitions.archive": "Archivia",
    "admin.competitions.restore": "Ripristina",
    "admin.competitions.archived": "Competizioni archiviate",
    "admin.competitions.none": "Nessuna competizione",
    "admin.competitions.add": "Aggiungi competizione",
    "admin.competition.addTitle": "Aggiungi competizione",
    "admin.competition.editTitle": "Modifica competizione",
    "admin.competition.name": "Nome",
    "admin.competition.kind": "Tipo",
    "admin.competition.bestOf": "Al meglio di",
    "admin.competition.rounds": "Turni",
    "admin.competition.places": "Posti",
    "admin.competition.round": "Turno {number}",
    "admin.competition.bestOfs": "Al meglio di, per turno",
    "admin.competition.quarters": "Quarti",
    "admin.competition.semis": "Semifinali",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Aggiungi",
    "admin.competition.save": "Salva",
    "admin.competition.added": "{name} è stata aggiunta.",
    "admin.competition.otherwise":
      "Questa competizione non può essere conservata così com'è.",
    "CompetitionName.Missing": "Inserisci un nome.",
    "CompetitionName.TooLong": "Un nome può avere al massimo 254 caratteri.",
    "CompetitionName.NoLetterOrDigit":
      "Un nome deve contenere una lettera o una cifra.",
    "Tournament.KnockoutPlayerHasGames":
      "I giocatori di questo tabellone hanno delle partite, quindi i suoi posti non possono cambiare.",
    "Tournament.CompetitionNameTaken":
      "Un'altra competizione di questo torneo ha già quel nome.",
    "BestOf.NotWhole": "Inserisci un numero intero di partite.",
    "BestOf.TooSmall": "Un incontro deve essere al meglio di almeno 1 partita.",
    "Rounds.NotWhole": "Inserisci un numero intero di turni.",
    "Rounds.TooSmall": "Un blocco deve essere giocato in almeno 1 turno.",
    "KnockoutDraw.EvenBestOf":
      "Un incontro a eliminazione diretta deve avere un vincitore, quindi è al meglio di un numero dispari di partite.",
    "admin.hover.tournaments.new": "Crea un nuovo torneo",
    "admin.hover.tournaments.manage":
      "Gestisci i giocatori, le squadre, le competizioni e i punteggi di questo torneo",
    "admin.hover.tournaments.edit": "Modifica i dati di questo torneo",
    "admin.hover.tournaments.scores": "Inserisci i punteggi di questo torneo",
    "admin.hover.tournaments.players":
      "Occupati dei giocatori di questo torneo",
    "admin.hover.competitions.view":
      "Apri questa competizione per vedere e inserire i suoi giocatori e punteggi",
    "admin.hover.tests.view":
      "Apri questo test per vedere e inserire i suoi punteggi",
    "admin.hover.teams.view":
      "Apri questa squadra per vedere e gestire i suoi giocatori",
    "admin.hover.dialog.player.add": "Aggiungi questo giocatore al torneo",
    "admin.hover.dialog.player.save":
      "Conserva le modifiche a questo giocatore",
    "admin.hover.dialog.team.add": "Aggiungi questa squadra al torneo",
    "admin.hover.dialog.team.save": "Conserva le modifiche a questa squadra",
    "admin.hover.dialog.test.add": "Aggiungi questo test al torneo",
    "admin.hover.dialog.test.save": "Conserva le modifiche a questo test",
    "admin.hover.dialog.competition.add":
      "Aggiungi questa competizione al torneo",
    "admin.hover.dialog.competition.save":
      "Conserva le modifiche a questa competizione",
    "admin.hover.dialog.score.add":
      "Aggiungi questo punteggio alla competizione",
    "admin.hover.dialog.score.save":
      "Conserva la correzione a questo punteggio",
    "admin.hover.dialog.carryForward.save":
      "Riporta avanti i risultati di questo giocatore",
    "admin.hover.dialog.tournament.new": "Crea questo torneo",
    "admin.hover.dialog.tournament.edit":
      "Conserva le modifiche a questo torneo",
    "admin.hover.modal.cancel": "Chiudi senza conservare nulla",
    "admin.hover.modal.ok": "Chiudi questo messaggio",
    "admin.hover.tab": "Mostra la scheda {name}",
    "admin.hover.tournaments.archive":
      "Archivia questo torneo; può essere ripristinato",
    "admin.hover.tournaments.restore": "Riporta qui questo torneo archiviato",
    "admin.hover.players.add": "Aggiungi un giocatore a questo torneo",
    "admin.hover.players.edit": "Modifica i dati di questo giocatore",
    "admin.hover.players.up": "Sposta questo giocatore su nell'elenco",
    "admin.hover.players.down": "Sposta questo giocatore giù nell'elenco",
    "admin.hover.players.archive":
      "Archivia questo giocatore; può essere ripristinato",
    "admin.hover.players.restore": "Riporta qui questo giocatore archiviato",
    "admin.hover.teams.add": "Aggiungi una squadra a questo torneo",
    "admin.hover.teams.edit": "Modifica i dati di questa squadra",
    "admin.hover.teams.up": "Sposta questa squadra su nell'elenco",
    "admin.hover.teams.down": "Sposta questa squadra giù nell'elenco",
    "admin.hover.teams.archive":
      "Archivia questa squadra; può essere ripristinata",
    "admin.hover.teams.restore": "Riporta qui questa squadra archiviata",
    "admin.hover.competitions.add": "Aggiungi una competizione a questo torneo",
    "admin.hover.competitions.edit": "Modifica i dati di questa competizione",
    "admin.hover.competitions.up": "Sposta questa competizione su nell'elenco",
    "admin.hover.competitions.down":
      "Sposta questa competizione giù nell'elenco",
    "admin.hover.competitions.archive":
      "Archivia questa competizione; può essere ripristinata",
    "admin.hover.competitions.restore":
      "Riporta qui questa competizione archiviata",
    "admin.hover.tests.add": "Aggiungi un test tra due squadre",
    "admin.hover.tests.edit": "Modifica i dati di questo test",
    "admin.hover.tests.up": "Sposta questo test su nell'elenco",
    "admin.hover.tests.down": "Sposta questo test giù nell'elenco",
    "admin.hover.tests.archive":
      "Archivia questo test; può essere ripristinato",
    "admin.hover.tests.restore": "Riporta qui questo test archiviato",
    "admin.hover.tests.toTeams":
      "Vai alla scheda Squadre per aggiungere le squadre che servono a un test",
    "admin.hover.scores.add":
      "Aggiungi il punteggio di una partita a questa competizione",
    "admin.hover.scores.edit": "Correggi questo punteggio",
    "admin.hover.scores.archive":
      "Archivia questo punteggio perché smetta di contare; può essere ripristinato",
    "admin.hover.scores.restore":
      "Riporta qui questo punteggio archiviato, così che torni a contare",
    "admin.hover.scores.withdraw":
      "Tieni questo punteggio nell'elenco ma fallo smettere di contare",
    "admin.hover.scores.unwithdraw":
      "Fai tornare a contare questo punteggio ritirato",
    "admin.hover.scores.up": "Anticipa questo punteggio nell'elenco",
    "admin.hover.scores.down": "Posticipa questo punteggio nell'elenco",
    "admin.hover.competitionPlayers.add":
      "Inserisci il giocatore scelto in questa competizione",
    "admin.hover.competitionPlayers.up":
      "Sposta questo giocatore su nell'elenco",
    "admin.hover.competitionPlayers.down":
      "Sposta questo giocatore giù nell'elenco",
    "admin.hover.competitionPlayers.remove":
      "Togli questo giocatore dalla competizione",
    "admin.hover.competitionPlayers.withdraw":
      "Ritira questo giocatore dalla competizione",
    "admin.hover.competitionPlayers.unwithdraw":
      "Rimetti nella competizione questo giocatore ritirato",
    "admin.hover.competitionPlayers.carryForward":
      "Riporta avanti i risultati di questo giocatore da un'altra competizione",
    "admin.hover.notes.add": "Scrivi una nuova nota per questo torneo",
    "admin.hover.notes.edit": "Modifica questa nota",
    "admin.hover.notes.delete": "Elimina questa nota",
    "admin.hover.note.add": "Conserva questa nota e aggiungila al torneo",
    "admin.hover.note.save": "Conserva le modifiche a questa nota",
    "admin.hover.people.add": "Assegna il ruolo a questa persona",
    "admin.hover.people.remove": "Togli il ruolo a questa persona",
    "admin.hover.worldRankings.import":
      "Preleva le classifiche mondiali e aggiungi i loro giocatori",
    "admin.modal.cancel": "Annulla",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "Indirizzo email",
    "admin.people.remove": "Rimuovi",
    "admin.people.otherwise": "Non è stato possibile farlo.",
    "admin.managers.you": "Tu",
    "admin.managers.add": "Aggiungi organizzatore",
    "admin.managers.none": "Nessun organizzatore",
    "admin.managers.removeTitle": "Rimuovi organizzatore",
    "admin.managers.removeExplanation":
      "{name} non potrà più gestire questo torneo.",
    "admin.managers.removeYourself.explanation":
      "Non potrai più gestire questo torneo, e qui nessuno può annullarlo per te. Un altro organizzatore può farti tornare organizzatore.",
    "admin.managers.otherwise":
      "Quell'indirizzo non può essere reso organizzatore.",
    "admin.competitionPlayers.add": "Aggiungi giocatore",
    "admin.competitionPlayers.otherwise":
      "Questo giocatore non può essere aggiunto.",
    "admin.competitionPlayers.choose": "Giocatore da aggiungere",
    "admin.competitionPlayers.nobody": "Scegli un giocatore",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Tutti i giocatori sono nella competizione",
    "admin.competitionPlayers.none": "Nessun giocatore",
    "admin.competitionPlayers.up": "Su",
    "admin.competitionPlayers.down": "Giù",
    "admin.competitionPlayers.remove": "Rimuovi",
    "admin.competitionPlayers.withdraw": "Ritira",
    "admin.competitionPlayers.unwithdraw": "Annulla il ritiro",
    "admin.competitionPlayers.withdrawn": "Giocatori ritirati",
    "admin.competitionPlayers.removeTitle": "Rimuovi giocatore",
    "admin.competitionPlayers.removeQuestion":
      "{name} sarà tolto dalla competizione. Non si può annullare.",
    "admin.competitionPlayers.withdrawTitle": "Ritira giocatore",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} non giocherà più nessuna partita della competizione, e le partite che non ha giocato saranno decise senza di lui.",
    "admin.competitionPlayers.carryForward": "Riporto",
    "admin.carryForward.title": "Riporto - {name}",
    "admin.carryForward.save": "Salva",
    "admin.carryForward.otherwise": "Questo riporto non può essere conservato.",
    "admin.carryForward.matchWins": "Incontri vinti",
    "admin.carryForward.matchLosses": "Incontri persi",
    "admin.carryForward.gameWins": "Partite vinte",
    "admin.carryForward.gameLosses": "Partite perse",
    "admin.carryForward.hoopsFor": "Archetti fatti",
    "admin.carryForward.hoopsAgainst": "Archetti subiti",
    "CarryForward.MatchWinsNotWhole":
      "Inserisci un numero intero di incontri vinti.",
    "CarryForward.MatchWinsBelowZero": "Inserisci 0 o più incontri vinti.",
    "CarryForward.MatchLossesNotWhole":
      "Inserisci un numero intero di incontri persi.",
    "CarryForward.MatchLossesBelowZero": "Inserisci 0 o più incontri persi.",
    "CarryForward.GameWinsNotWhole":
      "Inserisci un numero intero di partite vinte.",
    "CarryForward.GameWinsBelowZero": "Inserisci 0 o più partite vinte.",
    "CarryForward.GameLossesNotWhole":
      "Inserisci un numero intero di partite perse.",
    "CarryForward.GameLossesBelowZero": "Inserisci 0 o più partite perse.",
    "CarryForward.HoopsForNotWhole":
      "Inserisci un numero intero di archetti fatti.",
    "CarryForward.HoopsForBelowZero": "Inserisci 0 o più archetti fatti.",
    "CarryForward.HoopsAgainstNotWhole":
      "Inserisci un numero intero di archetti subiti.",
    "CarryForward.HoopsAgainstBelowZero": "Inserisci 0 o più archetti subiti.",
    "admin.scores.add": "Aggiungi punteggio",
    "admin.scores.none": "Nessun punteggio",
    "admin.scores.edit": "Modifica",
    "admin.scores.drawNotFilledTitle": "Tabellone non completo",
    "admin.scores.archive": "Archivia",
    "admin.scores.up": "Su",
    "admin.scores.down": "Giù",
    "admin.scores.restore": "Ripristina",
    "admin.scores.archived": "Punteggi archiviati",
    "admin.scores.archivedSaid": "Archiviato",
    "admin.scores.withdraw": "Ritira",
    "admin.scores.unwithdraw": "Annulla il ritiro",
    "admin.scores.withdrawnSaid": "Ritirato",
    "admin.scores.otherwise": "Non è stato possibile farlo.",
    "admin.score.title": "Aggiungi punteggio",
    "admin.score.add": "Aggiungi partita",
    "admin.score.winner": "Vincitore",
    "admin.score.winnerScore": "Punteggio del vincitore",
    "admin.score.loser": "Sconfitto",
    "admin.score.loserScore": "Punteggio dello sconfitto",
    "admin.score.beat": "ha battuto",
    "admin.score.added":
      "La partita vinta da {winner} contro {loser} è stata aggiunta.",
    "admin.score.otherwise": "Non è stato possibile aggiungere la partita.",
    "admin.score.correctTitle": "Modifica punteggio",
    "admin.score.save": "Salva",
    "admin.score.notCorrected":
      "Non è stato possibile correggere il punteggio.",
    "Game.WinnerMissing": "Scegli il vincitore.",
    "Game.WinnerScoreMissing": "Scrivi il punteggio del vincitore.",
    "Game.LoserMissing": "Scegli lo sconfitto.",
    "Game.LoserScoreMissing": "Scrivi il punteggio dello sconfitto.",
    "Score.NoPoints": "Un punteggio comincia con il suo numero di punti.",
    "Game.SamePlayer": "Nessuno gioca contro se stesso.",
    "Game.WinnerNotAhead":
      "Il punteggio del vincitore deve essere maggiore di quello dello sconfitto, oppure segnato come vinto.",
    "Game.LoserMarked":
      "Il punteggio dello sconfitto non può essere segnato come vinto.",
    "Game.ResultChanged":
      "Una correzione mantiene il risultato: una partita vinta resta vinta, e una partita pareggiata resta pareggiata.",
    "Competition.MatchDecided": "Il loro incontro è già deciso.",
    "Competition.DrawFull":
      "Non è possibile aggiungere il giocatore perché il tabellone è pieno.",
    "Competition.DrawNotFilled":
      "Non è possibile aggiungere punteggi finché ogni posto del tabellone non è occupato da un giocatore o da un bye.",
    "Competition.ByeOutsideKnockout":
      "Solo un'eliminazione diretta può avere un bye.",
    "Competition.NotDrawnToMeet":
      "Questi giocatori al momento non sono sorteggiati per giocare l'uno contro l'altro nel tabellone.",
    "Competition.WinnerHasPlayedOn":
      "Il vincitore di questo incontro ha già giocato la partita successiva, quindi chi lo ha vinto non può cambiare.",
    "CompetitionPlayer.Withdrawn": "Un giocatore ritirato non gioca più.",
    "admin.players.add": "Aggiungi giocatore",
    "admin.players.none": "Nessun giocatore",
    "admin.players.edit": "Modifica",
    "admin.players.archive": "Archivia",
    "admin.players.restore": "Ripristina",
    "admin.players.up": "Su",
    "admin.players.down": "Giù",
    "admin.players.archiveTitle": "Archivia giocatore",
    "admin.players.archiveQuestion":
      "{name} sarà rimosso da queste competizioni:",
    "admin.players.archive.explanation":
      "Ripristinarlo non lo rimetterà in queste competizioni.",
    "admin.players.archived": "Giocatori archiviati",
    "admin.players.archivedSaid": "Archiviato",
    "admin.player.addTitle": "Aggiungi giocatore",
    "admin.player.editTitle": "Modifica giocatore",
    "admin.player.name": "Nome",
    "admin.player.representing": "Rappresenta",
    "admin.player.worldRankingName":
      "Nome del giocatore nella classifica mondiale",
    "admin.player.worldRankingKnown":
      "Le classifiche mondiali conoscono questo nome.",
    "admin.player.worldRankingQuestioned":
      "Le classifiche mondiali non hanno nessun giocatore con questo nome. Potrebbe essere scritto male, oppure il giocatore potrebbe essere nuovo nelle classifiche.",
    "admin.player.flag": "Bandiera",
    "admin.player.add": "Aggiungi",
    "admin.player.save": "Salva",
    "admin.player.added": "{name} è stato aggiunto.",
    "admin.player.otherwise":
      "Questo giocatore non può essere conservato così com'è.",
    "Tournament.PlayerNameTaken":
      "Un altro giocatore di questo torneo ha già quel nome.",
    "TournamentPlayer.NoSuchFlag": "Scegli una delle bandiere disponibili.",
    "TournamentPlayer.NamedBye": "Un giocatore non può chiamarsi Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Un nome deve contenere una lettera o una cifra.",
    "admin.player.byesTitle": "I bye non vanno aggiunti",
    "admin.player.byes":
      "Un bye non è uno dei giocatori del torneo. Un'eliminazione diretta offre Bye ogni volta che si aggiungono i suoi giocatori, tante volte quante ne richiede il suo tabellone.",
    "admin.view.teams": "Squadre",
    "admin.view.tests": "Test",
    "admin.teams.add": "Aggiungi squadra",
    "admin.teams.none": "Nessuna squadra",
    "admin.teams.edit": "Modifica",
    "admin.teams.view": "Vedi",
    "admin.teams.archive": "Archivia",
    "admin.teams.restore": "Ripristina",
    "admin.teams.up": "Su",
    "admin.teams.down": "Giù",
    "admin.teams.archived": "Squadre archiviate",
    "admin.teams.archivedSaid": "Archiviata",
    "admin.team.addTitle": "Aggiungi squadra",
    "admin.team.editTitle": "Modifica squadra",
    "admin.team.name": "Nome",
    "admin.team.shortName": "Nome breve",
    "admin.team.shortName.explanation":
      "Con quale nome si chiamano i test della squadra, come AUS v ENG.",
    "admin.team.flag": "Bandiera",
    "admin.team.add": "Aggiungi",
    "admin.team.save": "Salva",
    "admin.team.added": "{name} è stata aggiunta.",
    "admin.team.otherwise":
      "Questa squadra non può essere conservata così com'è.",
    "admin.teamView.otherwise": "Questa squadra non può essere vista da qui.",
    "admin.teamView.players": "Giocatori",
    "TeamName.Missing": "Scrivi come si chiama la squadra.",
    "TeamName.TooLong": "Quel nome è troppo lungo.",
    "admin.notes.add": "Aggiungi nota",
    "admin.notes.none": "Nessuna nota",
    "admin.notes.edit": "Modifica",
    "admin.notes.delete": "Elimina",
    "admin.notes.deleteTitle": "Elimina nota",
    "admin.notes.deleteQuestion": "Eliminare la nota «{title}»?",
    "admin.notes.delete.explanation":
      "Una nota eliminata è persa per sempre e non può essere recuperata.",
    "admin.notes.otherwise": "Non è stato possibile farlo.",
    "admin.note.addTitle": "Aggiungi nota",
    "admin.note.editTitle": "Modifica nota",
    "admin.note.title": "Titolo",
    "admin.note.description": "Descrizione",
    "admin.note.write": "Scrivi",
    "admin.note.preview": "Anteprima",
    "admin.note.toolbar": "Formattazione",
    "admin.note.tool.heading": "Titolo",
    "admin.note.tool.bold": "Grassetto",
    "admin.note.tool.italic": "Corsivo",
    "admin.note.tool.quote": "Citazione",
    "admin.note.tool.code": "Codice",
    "admin.note.tool.link": "Link",
    "admin.note.tool.numberedList": "Elenco numerato",
    "admin.note.tool.bulletedList": "Elenco puntato",
    "admin.note.tool.taskList": "Elenco di attività",
    "admin.note.add": "Aggiungi",
    "admin.note.save": "Salva",
    "admin.note.otherwise": "Questa nota non può essere conservata così com'è.",
    "ManagerNoteTitle.Missing": "Dai un titolo alla nota.",
    "ManagerNoteTitle.TooLong": "Quel titolo è troppo lungo.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Un titolo deve contenere una lettera o una cifra.",
    "ManagerNoteDescription.TooLong": "Quella descrizione è troppo lunga.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Quella nota non c'è più. Potrebbe averla eliminata un altro organizzatore.",
    "EditManagerNote.NoSuchManagerNote":
      "Quella nota non c'è più. Potrebbe averla eliminata un altro organizzatore.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Quella nota non c'è più. Potrebbe averla eliminata un altro organizzatore.",
    "ManagerNote.Deleted":
      "Quella nota è stata eliminata. Potrebbe averla eliminata un altro organizzatore.",
    "CommentaryTitle.Missing": "Dai un titolo alla cronaca.",
    "CommentaryTitle.TooLong": "Quel titolo è troppo lungo.",
    "CommentaryTitle.NoLetterOrDigit":
      "Un titolo deve contenere una lettera o una cifra.",
    "Commentary.TitleTaken": "Un'altra cronaca ha già quel titolo.",
    "CommentText.Missing": "Scrivi qualcosa nel commento.",
    "CommentText.TooLong": "Quel commento è troppo lungo.",
    "TeamShortName.Missing": "Dai un nome breve alla squadra.",
    "TeamShortName.TooLong": "Un nome breve può avere al massimo 10 caratteri.",
    "TeamShortName.NoLetterOrDigit":
      "Un nome breve deve contenere una lettera o una cifra.",
    "Team.ShortNameLongerThanName":
      "Un nome breve non può essere più lungo del nome della squadra.",
    "Team.NoSuchFlag": "Scegli una delle bandiere disponibili.",
    "Team.Archived": "Quella squadra è archiviata, e va prima ripristinata.",
    "Team.InATest":
      "Quella squadra gioca in un test e non può essere archiviata.",
    "Team.PlayerNameTaken":
      "Un altro giocatore di questa squadra ha già quel nome.",
    "TeamPlayer.NamedBye": "Un giocatore non può chiamarsi Bye.",
    "TeamPlayer.Archived":
      "Quel giocatore è archiviato, e va prima ripristinato.",
    "TeamPlayer.HasGames":
      "Quel giocatore ha giocato e non può essere archiviato.",
    "Tournament.TeamNameTaken":
      "Un'altra squadra di questo torneo ha già quel nome.",
    "Tournament.TeamShortNameTaken":
      "Un'altra squadra di questo torneo ha già quel nome breve.",
    "Tournament.NoSuchTeam":
      "Questo torneo non ha nessuna squadra a questo indirizzo.",
    "Tournament.TeamArchived":
      "Questa squadra è archiviata, e può essere ripristinata solo dalla scheda Squadre.",
    "admin.tests.add": "Aggiungi test",
    "admin.tests.none": "Nessun test",
    "admin.tests.edit": "Modifica",
    "admin.tests.view": "Vedi",
    "admin.tests.archive": "Archivia",
    "admin.tests.restore": "Ripristina",
    "admin.tests.up": "Su",
    "admin.tests.down": "Giù",
    "admin.tests.archived": "Test archiviati",
    "admin.tests.twoTeamsNeeded":
      "Un test si gioca tra due squadre, quindi prima servono due squadre.",
    "admin.tests.toTeams": "Vai a Squadre",
    "admin.tests.matches.one": "{count} incontro",
    "admin.tests.matches.other": "{count} incontri",
    "admin.tests.bestOf": "al meglio di {games}",
    "admin.tests.otherwise": "Non è stato possibile farlo.",
    "admin.test.addTitle": "Aggiungi test",
    "admin.test.editTitle": "Modifica test",
    "admin.test.firstTeam": "Squadra A",
    "admin.test.secondTeam": "Squadra B",
    "admin.test.versus": "v",
    "admin.test.starts": "Inizia",
    "admin.test.finishes": "Finisce",
    "admin.test.expectedMatches": "Incontri previsti",
    "admin.test.bestOf": "Al meglio di",
    "admin.test.group": "Gruppo",
    "admin.test.add": "Aggiungi",
    "admin.test.save": "Salva",
    "admin.test.added": "{name} è stato aggiunto.",
    "admin.test.otherwise": "Questo test non può essere conservato così com'è.",
    "admin.testView.otherwise": "Questo test non può essere visto da qui.",
    "AddTest.FirstTeamMissing": "Scegli la prima squadra.",
    "AddTest.SecondTeamMissing": "Scegli la seconda squadra.",
    "UpdateTest.FirstTeamMissing": "Scegli la prima squadra.",
    "UpdateTest.SecondTeamMissing": "Scegli la seconda squadra.",
    "ExpectedMatches.NotWhole": "Inserisci un numero intero di incontri.",
    "ExpectedMatches.TooSmall":
      "Un test deve avere almeno 1 incontro previsto.",
    "TestGroup.TooLong": "Quel gruppo è troppo lungo.",
    "Tournament.TestAgainstItself":
      "Una squadra non gioca un test contro se stessa.",
    "Tournament.TestFinishesBeforeStarts":
      "Un test non può finire prima di cominciare.",
    "Tournament.TestStartsBeforeTournament":
      "Un test non può cominciare prima del suo torneo.",
    "Tournament.TestFinishesAfterTournament":
      "Un test non può finire dopo il suo torneo.",
    "Tournament.TestHasGamesInUse":
      "Questo test ha delle partite, quindi non può essere archiviato finché non lo sono anch'esse.",
    "Tournament.TestHasGames":
      "Questo test ha ormai delle partite, quindi le sue squadre non possono più essere cambiate.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Sono già iniziati più incontri di così.",
    "Tournament.BestOfBelowGamesPlayed":
      "Due giocatori hanno già giocato più partite di così.",
    "Competition.ExpectedMatchesReached":
      "Questo test ha già fatto iniziare tutti gli incontri che deve avere.",
    "Competition.SameTeam":
      "Due giocatori della stessa squadra non giocano l'uno contro l'altro.",
    "AddManager.NoSuchAccount":
      "Quell'indirizzo non ha nessun account che possa essere reso organizzatore.",
    "admin.scorers.add": "Aggiungi segnapunti",
    "admin.scorers.none": "Nessun segnapunti",
    "admin.scorers.removeTitle": "Rimuovi segnapunti",
    "admin.scorers.removeExplanation":
      "{name} non potrà più inserire i punteggi di questo torneo.",
    "admin.scorers.otherwise":
      "Quell'indirizzo non può essere reso segnapunti.",
    "AddScorer.NoSuchAccount":
      "Quell'indirizzo non ha nessun account che possa essere reso segnapunti.",
    "Account.NotAnAdministrator": "Solo un amministratore può farlo.",
    "AddRole.NoSuchAccount":
      "Quell'indirizzo non ha nessun account a cui si possa dare il ruolo.",
    "AddRole.NoSuchRole": "Questo ruolo non esiste.",
    "RemoveRole.NoSuchAccount": "Questo account non esiste.",
    "RemoveRole.NoSuchRole": "Questo ruolo non esiste.",
    "RemoveRole.Yourself":
      "Non puoi toglierti il ruolo di amministratore da solo.",
    "AccountsWithRole.NoSuchRole": "Questo ruolo non esiste.",
    "Tournament.AlreadyAManager":
      "Quell'account gestisce già il torneo e può fare tutto ciò che può fare un segnapunti.",

    "TournamentName.Missing": "Scrivi come si chiama il torneo.",
    "TournamentName.TooShort": "Quel nome è troppo corto.",
    "TournamentName.TooLong": "Quel nome è troppo lungo.",
    "TournamentName.AllLowerCase": "Un nome non si scrive tutto in minuscolo.",
    "TournamentName.AllCapitals": "Un nome non si scrive tutto in maiuscolo.",
    "TournamentName.NoLetterOrDigit":
      "Un nome deve contenere una lettera o una cifra.",
    "ReadOnlyDate.Unreadable": "Indica il giorno.",
    "Tournament.FinishesBeforeStarts":
      "Un torneo non può finire prima di cominciare.",
    "Tournament.StartsAfterNextYear":
      "Un torneo non può cominciare dopo l'anno prossimo.",
    "Tournament.FinishesAfterNextYear":
      "Un torneo non può finire dopo l'anno prossimo.",
    "CreateTournament.NoSuchCountry": "Scegli il paese.",
    "TournamentSubtitle.TooLong":
      "Un sottotitolo non può superare i 2000 caratteri.",
    "Tournament.NotAManager":
      "Solo un organizzatore di questo torneo può modificarlo.",
    "Tournament.NotAManagerOrScorer":
      "Solo un organizzatore o un segnapunti di questo torneo può vederlo.",
    "Tournament.Archived":
      "Questo torneo è archiviato, e va ripristinato prima di poter essere modificato.",
    "UpdateTournament.NoSuchTournament":
      "Non c'è nessun torneo a questo indirizzo.",

    // The sports keep the names their players use in Italian, and the formats
    // named for a competition keep its name, as a name is not translated.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "Croquet americano a 6 archetti",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "A squadre",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Emirati Arabi Uniti",
    "country.af": "Afghanistan",
    "country.ag": "Antigua e Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Samoa Americane",
    "country.at": "Austria",
    "country.au": "Australia",
    "country.aw": "Aruba",
    "country.ax": "Isole Åland",
    "country.az": "Azerbaigian",
    "country.ba": "Bosnia ed Erzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Belgio",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgaria",
    "country.bh": "Bahrein",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brunei",
    "country.bo": "Bolivia",
    "country.br": "Brasile",
    "country.bs": "Bahamas",
    "country.bt": "Bhutan",
    "country.bv": "Isola Bouvet",
    "country.bw": "Botswana",
    "country.by": "Bielorussia",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalogna",
    "country.cc": "Isole Cocos (Keeling)",
    "country.cd": "Repubblica Democratica del Congo",
    "country.cf": "Repubblica Centrafricana",
    "country.cg": "Repubblica del Congo",
    "country.ch": "Svizzera",
    "country.ci": "Costa d'Avorio",
    "country.ck": "Isole Cook",
    "country.cl": "Cile",
    "country.cm": "Camerun",
    "country.cn": "Cina",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Capo Verde",
    "country.cx": "Isola di Natale",
    "country.cy": "Cipro",
    "country.cz": "Cechia",
    "country.de": "Germania",
    "country.dj": "Gibuti",
    "country.dk": "Danimarca",
    "country.dm": "Dominica",
    "country.do": "Repubblica Dominicana",
    "country.dz": "Algeria",
    "country.ec": "Ecuador",
    "country.ee": "Estonia",
    "country.eg": "Egitto",
    "country.eh": "Sahara Occidentale",
    "country.england": "Inghilterra",
    "country.er": "Eritrea",
    "country.es": "Spagna",
    "country.et": "Etiopia",
    "country.fi": "Finlandia",
    "country.fj": "Figi",
    "country.fk": "Isole Falkland",
    "country.fm": "Micronesia",
    "country.fo": "Isole Fær Øer",
    "country.fr": "Francia",
    "country.ga": "Gabon",
    "country.gb": "Regno Unito",
    "country.gd": "Grenada",
    "country.ge": "Georgia",
    "country.gf": "Guyana francese",
    "country.gh": "Ghana",
    "country.gi": "Gibilterra",
    "country.gl": "Groenlandia",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadalupa",
    "country.gq": "Guinea Equatoriale",
    "country.gr": "Grecia",
    "country.gs": "Georgia del Sud e Isole Sandwich Australi",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Isole Heard e McDonald",
    "country.hn": "Honduras",
    "country.hr": "Croazia",
    "country.ht": "Haiti",
    "country.hu": "Ungheria",
    "country.id": "Indonesia",
    "country.ie": "Irlanda",
    "country.il": "Israele",
    "country.im": "Isola di Man",
    "country.in": "India",
    "country.io": "Territorio britannico dell'Oceano Indiano",
    "country.iq": "Iraq",
    "country.ir": "Iran",
    "country.is": "Islanda",
    "country.it": "Italia",
    "country.je": "Jersey",
    "country.jm": "Giamaica",
    "country.jo": "Giordania",
    "country.jp": "Giappone",
    "country.ke": "Kenya",
    "country.kg": "Kirghizistan",
    "country.kh": "Cambogia",
    "country.ki": "Kiribati",
    "country.km": "Comore",
    "country.kn": "Saint Kitts e Nevis",
    "country.kp": "Corea del Nord",
    "country.kr": "Corea del Sud",
    "country.kw": "Kuwait",
    "country.ky": "Isole Cayman",
    "country.kz": "Kazakistan",
    "country.la": "Laos",
    "country.lb": "Libano",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Lituania",
    "country.lu": "Lussemburgo",
    "country.lv": "Lettonia",
    "country.ly": "Libia",
    "country.ma": "Marocco",
    "country.mc": "Monaco",
    "country.md": "Moldavia",
    "country.me": "Montenegro",
    "country.mg": "Madagascar",
    "country.mh": "Isole Marshall",
    "country.mk": "Macedonia del Nord",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolia",
    "country.mo": "Macao",
    "country.mp": "Isole Marianne Settentrionali",
    "country.mq": "Martinica",
    "country.mr": "Mauritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maldive",
    "country.mw": "Malawi",
    "country.mx": "Messico",
    "country.my": "Malaysia",
    "country.mz": "Mozambico",
    "country.na": "Namibia",
    "country.nc": "Nuova Caledonia",
    "country.ne": "Niger",
    "country.nf": "Isola Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Paesi Bassi",
    "country.no": "Norvegia",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nuova Zelanda",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Perù",
    "country.pf": "Polinesia francese",
    "country.pg": "Papua Nuova Guinea",
    "country.ph": "Filippine",
    "country.pk": "Pakistan",
    "country.pl": "Polonia",
    "country.pm": "Saint-Pierre e Miquelon",
    "country.pn": "Isole Pitcairn",
    "country.pr": "Porto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portogallo",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "Riunione",
    "country.ro": "Romania",
    "country.rs": "Serbia",
    "country.ru": "Russia",
    "country.rw": "Ruanda",
    "country.sa": "Arabia Saudita",
    "country.sb": "Isole Salomone",
    "country.sc": "Seychelles",
    "country.scotland": "Scozia",
    "country.sd": "Sudan",
    "country.se": "Svezia",
    "country.sg": "Singapore",
    "country.sh": "Sant'Elena",
    "country.si": "Slovenia",
    "country.sj": "Svalbard e Jan Mayen",
    "country.sk": "Slovacchia",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Suriname",
    "country.st": "São Tomé e Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Siria",
    "country.sz": "Eswatini",
    "country.tc": "Isole Turks e Caicos",
    "country.td": "Ciad",
    "country.tf": "Terre Australi Francesi",
    "country.tg": "Togo",
    "country.th": "Thailandia",
    "country.tj": "Tagikistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor Est",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunisia",
    "country.to": "Tonga",
    "country.tr": "Turchia",
    "country.tt": "Trinidad e Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzania",
    "country.ua": "Ucraina",
    "country.ug": "Uganda",
    "country.um": "Isole Minori Esterne degli Stati Uniti",
    "country.us": "Stati Uniti",
    "country.uy": "Uruguay",
    "country.uz": "Uzbekistan",
    "country.va": "Città del Vaticano",
    "country.vc": "Saint Vincent e Grenadine",
    "country.ve": "Venezuela",
    "country.vg": "Isole Vergini Britanniche",
    "country.vi": "Isole Vergini Americane",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Galles",
    "country.wf": "Wallis e Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yemen",
    "country.yt": "Mayotte",
    "country.za": "Sudafrica",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    // As in English, each email's body is its own markup, with every button
    // painted where it stands because a mail program reads no stylesheet.
    "Email.ConfirmAddress.subject":
      "Conferma il tuo indirizzo email per {siteName}",
    "Email.ConfirmAddress.body": `
<p>Ciao,</p>

<p>
    Grazie per aver creato un account su <strong>{siteName}</strong>.<br />
    Prima di poter iniziare a usare il tuo account, conferma il tuo indirizzo email
    cliccando il pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Conferma il mio indirizzo email
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi confermare il tuo indirizzo email anche aprendo questo link nel tuo browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se non hai creato tu questo account, puoi tranquillamente ignorare questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Un nuovo link per confermare il tuo indirizzo email per {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Ciao,</p>

<p>
    Hai richiesto da poco una nuova email per confermare il tuo indirizzo email per <strong>{siteName}</strong>.<br />
    Conferma il tuo indirizzo email cliccando il pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Conferma il mio indirizzo email
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi confermare il tuo indirizzo email anche aprendo questo link nel tuo browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una volta confermato, potrai continuare a usare il tuo account senza interruzioni.
</p>

<p>
    Se non hai richiesto tu questa email, puoi tranquillamente ignorarla.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Qualcuno ha provato a registrarsi con il tuo indirizzo email",
    "Email.AlreadyRegistered.body": `
<p>Ciao,</p>

<p>
    Qualcuno ha provato a registrarsi su <strong>{siteName}</strong> usando questo
    indirizzo email, che ha già un account. Nulla del tuo account è
    cambiato.<br />
    Se eri tu, hai già un account e puoi accedervi:
</p>

<p>
    <a href="{site}/account/sign-in" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Accedi
    </a>
</p>

<p>
    Se hai dimenticato la password, puoi reimpostarla qui:
</p>

<p>
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Password dimenticata
    </a>
</p>

<p>
    Se non eri tu, non devi fare nulla. A nessuno è stato dato un modo per entrare
    nel tuo account.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Conferma lo spostamento del tuo account {siteName} a questo indirizzo",
    "Email.ConfirmNewEmailAddress.body": `
<p>Ciao,</p>

<p>
    Qualcuno che ha effettuato l'accesso a un account <strong>{siteName}</strong> ha chiesto di spostarlo
    a questo indirizzo email. Se eri tu, confermalo qui, dopo aver effettuato l'accesso a quell'account. Il link funziona per 24 ore.
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Sposta il mio account
    </a>
</p>

<p>
    Oppure copia questo indirizzo nel tuo browser:<br />
    {link}
</p>

<p>
    Se non eri tu, non devi fare nulla. Nessun account verrà spostato qui.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Qualcuno ha chiesto di spostare un account al tuo indirizzo email",
    "Email.AlreadyHasAnAccount.body": `
<p>Ciao,</p>

<p>
    Qualcuno che ha effettuato l'accesso a un account <strong>{siteName}</strong> ha chiesto di spostarlo
    a questo indirizzo email, che ha già un account suo. Non è stato
    spostato nulla, e nulla del tuo account è cambiato.
</p>

<p>
    Se eri tu, hai già un account a questo indirizzo e puoi accedervi.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Il tuo account {siteName} è stato spostato",
    "Email.EmailAddressChanged.body": `
<p>Ciao,</p>

<p>
    Il tuo account <strong>{siteName}</strong> è appena stato spostato a un altro indirizzo
    email, {emailAddress}, e da ora in poi si accede con quell'indirizzo.
</p>

<p>
    Se non eri tu, qualcun altro ha il tuo account. Rispondi a questa email e
    faccelo sapere.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "La tua password di {siteName} è stata cambiata",
    "Email.PasswordChanged.body": `
<p>Ciao,</p>

<p>
    La password del tuo account <strong>{siteName}</strong> è appena stata
    cambiata, e ogni altro browser in cui avevi effettuato l'accesso è stato disconnesso.<br />
    Se eri tu, non devi fare nulla.
</p>

<p>
    Se non eri tu, qualcun altro ha la tua password. Impostane una nuova qui, e
    loro verranno disconnessi:
</p>

<p>
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Password dimenticata
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Imposta una nuova password per {siteName}",
    "Email.SetNewPassword.body": `
<p>Ciao,</p>

<p>
    Hai richiesto da poco di reimpostare la tua password per <strong>{siteName}</strong>.<br />
    Puoi reimpostare la password cliccando il pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Reimposta la password
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi reimpostare la password anche aprendo questo link nel tuo browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Se non hai richiesto tu di reimpostare la password, puoi tranquillamente ignorare questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Imposta una password per {siteName}",
    "Email.SetPassword.body": `
<p>Ciao,</p>

<p>
    Il tuo account <strong>{siteName}</strong> non ha una password: accedi con Google.<br />
    Hai chiesto di impostarne una, per poter accedere anche con il tuo indirizzo email e una password.
    Puoi impostarla cliccando il pulsante qui sotto:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Imposta la password
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi impostare la password anche aprendo questo link nel tuo browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Il link funziona per un'ora. Se non hai chiesto tu di impostare una password, puoi tranquillamente ignorare questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Non esiste nessun account {siteName} per questo indirizzo email",
    "Email.RegisterInstead.body": `
<p>Ciao,</p>

<p>
    È stata fatta una richiesta di reimpostare la password per un indirizzo email che
    non è associato a nessun account su <strong>{siteName}</strong>.
</p>

<p>
    Se vuoi usare il nostro servizio, puoi creare un nuovo account visitando:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Se non hai fatto tu questa richiesta, puoi tranquillamente ignorare questa email.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Conferma che il tuo account {siteName} deve essere dimenticato",
    "Email.ConfirmForgetting.body": `
<p>Ciao,</p>

<p>
    Hai chiesto che il tuo account <strong>{siteName}</strong> venga
    dimenticato.<br />
    Segui il pulsante qui sotto per vedere che cosa significa e per dire con
    certezza che lo vuoi:
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Dimentica il mio account
    </a>
</p>

<p>
    Se il pulsante non funziona, puoi anche aprire questo link nel tuo browser:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una volta dimenticati, il tuo nome e il tuo indirizzo email non potranno mai più essere letti
    da nessuno, e non sarà più possibile accedere al tuo account. Non si può annullare.
</p>

<p>
    Il link funziona una sola volta, fino a 15 minuti dopo che lo hai richiesto, e solo
    mentre hai effettuato l'accesso a questo account. Dopo, richiedilo di nuovo dal tuo
    account.
</p>

<p>
    Se non lo hai chiesto tu, non succederà nulla a meno che il link non venga seguito.
    Però qualcuno che ha effettuato l'accesso al tuo account lo ha chiesto, quindi imposta una nuova password
    dalla pagina della password dimenticata per essere sicuro che non possa accedere di nuovo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Le registrazioni sono sospese: {service} non è raggiungibile",
    "Email.RegistrationsSuspended.body": `
<p>Ciao,</p>

<p>
    {siteName} non è riuscito a raggiungere {service} alle {when}. Finché non risponde,
    ai lettori che ne hanno bisogno, per registrarsi o per impostare una nuova password, viene detto di
    riprovare più tardi.
</p>

<p>
    Non c'è nulla da sbloccare. Ogni tentativo interroga {service} da capo, e le pagine
    tornano a funzionare nel momento in cui risponde.
</p>

<p>
    Finché {service} resta fuori uso, riceverai un'email in proposito al massimo una volta
    all'ora.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} non riesce a raggiungere il suo database",
    "Email.DatabaseUnreachable.body": `
<p>Ciao,</p>

<p>
    {siteName} non è riuscito a raggiungere il suo database alle {when}. Finché non risponde, ogni pagina che ne ha bisogno dice ai lettori che il sito non è disponibile e di riprovare più tardi.
</p>

<p>
    Non c’è nulla da sbloccare. Ogni richiesta chiede di nuovo una connessione, e il sito torna a funzionare nel momento in cui il database risponde.
</p>

<p>
    Finché il database resta irraggiungibile, riceverai al massimo un’email al riguardo ogni {minutes} minuti.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
