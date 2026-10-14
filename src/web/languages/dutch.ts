// The site's words in Dutch. Keyed as the English catalogue is, which is what
// a word missing here falls back to.
//
// Written to the reader as je rather than u: the site talks to people scoring
// and following croquet, many of them in clubs where everyone is on first-name
// terms, and the English it is written from is plain and direct rather than
// formal. Items in menus and on buttons are written in sentence case, as Dutch
// writes them, where the English capitalises each word. An email address is a
// "e-mailadres" and a message sent is an "e-mail", as the two are told apart in
// Dutch as they are in English.
import type { Language } from "../common/language.js";

export const dutch: Language = {
  tag: "nl",
  name: "Nederlands",
  words: {
    "site.skipToContent": "Naar de inhoud springen",
    "navigation.menu": "Menu",
    "navigation.label": "Hoofdmenu",
    "navigation.home": "Home",
    "navigation.help": "Help",
    "navigation.admin": "Beheer",
    "sections.label": "Onderdelen",
    "theme.label": "Thema",
    "theme.light": "Licht",
    "theme.dark": "Donker",
    "theme.system": "Systeem",
    "footer.donate": "Doneren",
    "footer.plea":
      "Bevalt {siteName} je? Doneer dan om de verdere ontwikkeling te helpen betalen.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "tryWebsite.banner":
      "Dit is een veilige plek om {siteName} te leren kennen. Alles wat je hier invoert, kan op elk moment worden verwijderd.",

    "language.label": "Taal",
    "language.choose": "Wijzigen",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Er is iets nieuws om te lezen.",
    "whatsNew.admin.message": "Er is iets nieuws voor wie toernooien beheert.",
    "whatsNew.view": "Bekijk wat er nieuw is",
    "whatsNew.later": "Herinner me de volgende keer",
    "whatsNew.never": "Toon me deze melding nooit meer",

    "form.otherwise":
      "Er klopt hier iets niet. Controleer wat je hebt ingevoerd en probeer het opnieuw.",

    "account.menu": "Account",
    "account.register": "Registreren",
    "account.signIn": "Inloggen",
    "account.forgotPassword": "Wachtwoord vergeten",
    "account.signOut": "Uitloggen",
    "account.profile": "Profiel",
    "account.changePassword": "Wachtwoord wijzigen",
    "account.changeEmailAddress": "E-mailadres wijzigen",
    "account.changeName": "Naam wijzigen",
    "account.setPassword": "Wachtwoord instellen",
    "account.forgetAccount": "Account vergeten",

    "register.title": "Registreren",
    "register.emailAddress": "E-mailadres",
    "register.submit": "Registreren",
    "register.withGoogle": "Registreren met Google",
    "register.or": "of",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google heeft niet bevestigd dat dat e-mailadres van jou is, dus het kan hier niet met Google worden gebruikt. Gebruik hieronder je e-mailadres.",
    "SignInWithGoogle.LinkedToAnother":
      "Dat e-mailadres heeft al een account, dat aan een ander Google-account is gekoppeld. Log in met dat Google-account, of met je e-mailadres en wachtwoord.",
    "SignInWithGoogle.NameMissing":
      "Google heeft ons je naam niet doorgegeven, en een account heeft er een nodig. Gebruik hieronder je e-mailadres.",
    "Google.Unreachable":
      "Google is nu niet bereikbaar. Probeer het over een paar minuten opnieuw, of gebruik hieronder je e-mailadres.",
    "Registration.NotAPerson":
      "Dit leek niet van een mens te komen. Probeer het opnieuw en wacht een paar minuten voordat je terugkomt als het blijft gebeuren.",

    "EmailAddress.Missing": "Voer een e-mailadres in.",
    "EmailAddress.NoAt": "Een e-mailadres bevat een @.",
    "EmailAddress.MoreThanOneAt": "Een e-mailadres bevat precies één @.",
    "EmailAddress.NoDomain":
      "Een e-mailadres heeft na de @ een domein, zoals example.com.",

    "welcome.title": "Controleer je e-mail",
    "welcome.checkEmail":
      "Er is een e-mail onderweg naar het adres dat je hebt opgegeven. Volg de link erin om verder te gaan.",
    "welcome.nothingArrived":
      "Komt er over een paar minuten niets binnen, kijk dan in je map met ongewenste e-mail of spam.",
    "welcome.home": "Terug naar {siteName}",
    "newConfirmationLink.title": "Een nieuwe link opvragen",
    "newConfirmationLink.explanation":
      "De link om je e-mailadres te bevestigen is verlopen. Vraag een nieuwe aan en die wordt gestuurd naar het adres waarmee je je hebt geregistreerd.",
    "newConfirmationLink.send": "Stuur me een nieuwe link",
    "newConfirmationLink.home": "Terug naar {siteName}",
    "newConfirmationLink.signIn": "Inloggen",
    "newConfirmationLink.sent.title": "Controleer je e-mail",
    "newConfirmationLink.sent.explanation":
      "Er is een nieuwe link onderweg. Volg die om je e-mailadres te bevestigen. Komt er over een paar minuten niets binnen, kijk dan in je map met ongewenste e-mail of spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Dat e-mailadres is al bevestigd",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Er valt niets meer te bevestigen. Log in met het wachtwoord dat je hebt opgegeven toen je het bevestigde.",
    "newConfirmationLink.noLongerWorks.title": "Die link werkt niet meer",
    "newConfirmationLink.noLongerWorks.explanation":
      "Controleer of je de hele link uit de e-mail hebt gevolgd, zonder dat er iets aan het eind ontbreekt. Werkt hij nog steeds niet, registreer je dan opnieuw, dan wordt er een nieuwe link gestuurd.",
    "newConfirmationLink.tooMany.title": "Probeer het later opnieuw",
    "newConfirmationLink.tooMany.explanation":
      "Er zijn de laatste tijd meerdere links naar dit adres gestuurd. Wacht een uur en vraag het dan opnieuw aan, en kijk intussen in je map met ongewenste e-mail of spam.",

    "forgotPassword.title": "Wachtwoord vergeten?",
    "forgotPassword.emailAddress": "E-mailadres",
    "forgotPassword.submit": "Stuur me een weg terug naar binnen",
    "forgotPassword.home": "Terug naar {siteName}",
    "forgotPassword.sent.title": "Controleer je e-mail",
    "forgotPassword.sent.explanation":
      "Als dat adres een account heeft, is er een link onderweg om een nieuw wachtwoord in te stellen. Volg die binnen een uur. Komt er over een paar minuten niets binnen, kijk dan in je map met ongewenste e-mail of spam.",
    "forgotPassword.tryAgainLater":
      "Er zijn de laatste tijd te veel wegen terug naar binnen aangevraagd vanaf deze plek. Wacht een uur en probeer het opnieuw.",

    "setNewPassword.title": "Een nieuw wachtwoord instellen",
    "setNewPassword.password": "Wachtwoord",
    "setNewPassword.confirmPassword": "Wachtwoord bevestigen",
    "setNewPassword.submit": "Mijn nieuwe wachtwoord instellen",
    "setNewPassword.home": "Terug naar {siteName}",
    "setNewPassword.signIn": "Inloggen",
    "setNewPassword.askAgain": "Een nieuwe link opvragen",
    "setNewPassword.changed.title": "Je wachtwoord is gewijzigd",
    "setNewPassword.changed.explanation":
      "Je bent overal uitgelogd waar je was ingelogd. Log in met je nieuwe wachtwoord.",
    "setNewPassword.expired.title": "Die link is verlopen",
    "setNewPassword.expired.explanation":
      "Een link om een nieuw wachtwoord in te stellen werkt een uur. Vraag een andere aan, dan wordt die naar hetzelfde adres gestuurd.",
    "setNewPassword.noLongerWorks.title": "Die link werkt niet meer",
    "setNewPassword.noLongerWorks.explanation":
      "Hij is misschien al gebruikt, of er ontbreekt iets aan het eind. Vraag een andere aan als je er nog een nodig hebt.",

    "BreachedPasswords.Unreachable":
      "Je wachtwoord kan nu niet worden gecontroleerd, dus het is niet gewijzigd. Probeer het over een paar minuten opnieuw; je link werkt nog tot hij verloopt.",

    "forgetAccount.title": "Je account vergeten",
    "forgetAccount.explanation":
      "Je naam en e-mailadres kunnen voorgoed onleesbaar worden gemaakt, en je account kan worden gesloten. Om zeker te weten dat jij het bent, sturen we eerst een e-mail met een link naar het adres van je account, en er wordt niets vergeten voordat je die link volgt.",
    "forgetAccount.submit": "Mail me de link",
    "forgetAccount.sent.title": "Controleer je e-mail",
    "forgetAccount.sent.explanation":
      "We hebben een e-mail met een link gestuurd naar het adres van je account. Hij werkt 15 minuten, en alleen zolang je bent ingelogd op dit account.",
    "forgetAccount.confirm.title": "Je account voorgoed vergeten?",
    "forgetAccount.confirm.explanation":
      "Zodra je account is vergeten, kunnen je naam en e-mailadres door niemand meer worden gelezen, en kan er niet meer op je account worden ingelogd. Dit kan niet ongedaan worden gemaakt.",
    "forgetAccount.confirm.submit": "Mijn account vergeten",
    "forgetAccount.forgotten.title": "Je account is vergeten",
    "forgetAccount.forgotten.explanation":
      "Je naam en e-mailadres kunnen niet meer worden gelezen, en je bent overal uitgelogd waar je was ingelogd.",
    "forgetAccount.noLongerWorks.title": "Die link werkt niet meer",
    "forgetAccount.noLongerWorks.explanation":
      "Hij is misschien verlopen, al gebruikt, of hoort bij een account waarop je niet bent ingelogd. Vraag het opnieuw aan vanuit je account als je het nog vergeten wilt hebben.",
    "forgetAccount.lastAdministrator.title":
      "Je account kan niet worden vergeten",
    "forgetAccount.lastAdministrator.explanation":
      "Je bent de enige beheerder van deze site. Geef de rol van beheerder aan iemand anders, dan kan je account worden vergeten.",
    "forgetAccount.askAgain": "Opnieuw aanvragen",
    "forgetAccount.home": "Terug naar {siteName}",

    "registrationsSuspended.title": "Registreren is voorlopig opgeschort",
    "registrationsSuspended.explanation":
      "Een dienst die nodig is om je te registreren is nu niet bereikbaar, dus niemand kan zich registreren tot hij weer antwoordt. Er is niets bewaard van wat je hebt getypt.",
    "registrationsSuspended.tryAgainLater":
      "Probeer het over een poosje opnieuw. De beheerder van de site is op de hoogte gebracht.",
    "registrationsSuspended.home": "Terug naar {siteName}",

    "signIn.title": "Inloggen",
    "signIn.emailAddress": "E-mailadres",
    "signIn.password": "Wachtwoord",
    "signIn.submit": "Inloggen",
    "signIn.forgotPassword": "Wachtwoord vergeten?",
    "signIn.register": "Registreren",
    "signIn.withGoogle": "Inloggen met Google",
    "signIn.or": "of",
    "signIn.tryAgainLater":
      "Er zijn de laatste tijd te veel pogingen gedaan. Wacht een uur en probeer het opnieuw.",

    "SignIn.Failed":
      "Het e-mailadres of wachtwoord is onjuist. Probeer het opnieuw.",

    "profile.title": "Profiel",
    "profile.name": "Naam:",
    "profile.emailAddress": "E-mailadres:",

    "changeName.title": "Naam wijzigen",
    "changeName.name": "Naam",
    "changeName.submit": "Naam wijzigen",

    "setPassword.title": "Een wachtwoord instellen",
    "setPassword.explanation":
      "Je account heeft geen wachtwoord: je logt in met Google. Om ook met een wachtwoord in te kunnen loggen, sturen we een e-mail met een link om er een in te stellen naar {emailAddress}.",
    "setPassword.submit": "Mail me een link",
    "setPassword.sent.title": "Controleer je e-mail",
    "setPassword.sent.explanation":
      "We hebben je een e-mail gestuurd met een link om een wachtwoord in te stellen. Hij werkt een uur.",
    "setPassword.profile": "Terug naar je profiel",

    "changePassword.title": "Wachtwoord wijzigen",
    "changePassword.currentPassword": "Huidig wachtwoord",
    "changePassword.password": "Nieuw wachtwoord",
    "changePassword.passwordConfirmation": "Wachtwoord bevestigen",
    "changePassword.forgotPassword": "Wachtwoord vergeten?",
    "changePassword.submit": "Wachtwoord wijzigen",
    "ChangePassword.WrongPassword": "Dat is je wachtwoord niet.",

    "changeEmailAddress.title": "E-mailadres wijzigen",
    "changeEmailAddress.emailAddress": "Nieuw e-mailadres",
    "changeEmailAddress.currentPassword": "Huidig wachtwoord",
    "changeEmailAddress.submit": "Stuur een link ter bevestiging",
    "changeEmailAddress.sent.title": "Controleer je e-mail",
    "changeEmailAddress.sent.explanation":
      "Er is een link om de verhuizing te bevestigen gestuurd naar het nieuwe e-mailadres. Volg die, ingelogd, om je account daarheen te verplaatsen.",
    "changeEmailAddress.confirm.title": "Je account verplaatsen",
    "changeEmailAddress.confirm.explanation":
      "Je account wordt verplaatst naar {emailAddress}. Je logt vanaf nu in met dat adres.",
    "changeEmailAddress.confirm.submit": "Mijn account verplaatsen",
    "changeEmailAddress.noLongerWorks.title": "Deze link werkt niet meer",
    "changeEmailAddress.noLongerWorks.explanation":
      "Hij is verlopen, al gebruikt, of niet gestuurd voor het account waarop je bent ingelogd. Vraag het opnieuw aan vanuit je profiel.",
    "changeEmailAddress.taken.title": "Je account is niet verplaatst",
    "changeEmailAddress.profile": "Terug naar je profiel",
    "ChangeEmailAddress.WrongPassword": "Dat is je wachtwoord niet.",
    "ChangeEmailAddress.Unchanged": "Je account staat al op dit adres.",
    "ChangeEmailAddress.Taken":
      "Dat e-mailadres heeft nu een eigen account, dus het jouwe kan er niet naartoe verhuizen.",

    "confirmEmailAddress.title": "Bevestig je e-mailadres",
    "confirmEmailAddress.name": "Naam",
    "confirmEmailAddress.password": "Wachtwoord",
    "confirmEmailAddress.confirmPassword": "Wachtwoord bevestigen",
    "confirmEmailAddress.submit": "Mijn e-mailadres bevestigen",
    "confirmEmailAddress.signIn": "Inloggen",
    "confirmEmailAddress.home": "Terug naar {siteName}",
    "confirmEmailAddress.confirmed.title": "Je e-mailadres is bevestigd",
    "confirmEmailAddress.confirmed.explanation":
      "Je account is klaar. Log in met het e-mailadres en wachtwoord die je zojuist hebt opgegeven.",
    "confirmEmailAddress.expired.title": "Die link is verlopen",
    "confirmEmailAddress.expired.explanation":
      "Een link om een e-mailadres te bevestigen werkt 24 uur. Vraag een nieuwe aan, dan wordt die naar hetzelfde adres gestuurd.",
    "confirmEmailAddress.expired.newLink": "Stuur me een nieuwe link",
    "confirmEmailAddress.noLongerWorks.title": "Die link werkt niet meer",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Controleer of je de hele link uit de e-mail hebt gevolgd, zonder dat er iets aan het eind ontbreekt. Werkt hij nog steeds niet, registreer je dan opnieuw, dan wordt er een nieuwe link gestuurd.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Dat e-mailadres is al bevestigd",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Er hoeft niets meer te gebeuren. Log in met het wachtwoord dat je hebt opgegeven toen je het bevestigde.",

    "PersonName.Missing": "Voer een naam in.",
    "PersonName.TooShort": "Een naam moet minstens 3 tekens lang zijn.",
    "PersonName.TooLong": "Een naam mag hoogstens 254 tekens lang zijn.",
    "WorldRankingName.TooShort":
      "Een naam voor de wereldranglijst moet minstens 3 tekens lang zijn.",
    "WorldRankingName.TooLong":
      "Een naam voor de wereldranglijst mag hoogstens 254 tekens lang zijn.",
    "Password.Missing": "Voer een wachtwoord in.",
    "Password.TooShort": "Een wachtwoord moet minstens 12 tekens lang zijn.",
    "Password.ConfirmationDiffers":
      "Dit is niet hetzelfde als het wachtwoord hierboven. Typ het opnieuw.",
    "Password.Breached":
      "Dit wachtwoord is ergens anders in een datalek opgedoken, dus het is niet veilig om hier te gebruiken. Kies een ander.",

    "javaScriptRequired.title": "Scripts zijn nodig",
    "javaScriptRequired.explanation":
      "Voor het registreren moeten scripts voor deze site zijn ingeschakeld, zodat kan worden gecontroleerd dat wie zich registreert een mens is. Schakel ze in en registreer je dan opnieuw.",
    "javaScriptRequired.register": "Terug naar registreren",
    "javaScriptRequired.home": "Terug naar {siteName}",

    "errors.backHome": "Terug naar {siteName}",
    "errors.notFound": "Niet gevonden",
    "errors.refused": "Dat kon niet worden gedaan",
    "errors.refusedDetail": "Er klopte iets niet in wat is verstuurd.",
    "errors.sorry": "Sorry",
    "errors.sorryDetail": "Dat verzoek kon niet worden afgehandeld.",
    "errors.failed": "Er is iets misgegaan",
    "errors.reference": "Referentie {reference}.",
    "errors.unavailable": "De site is niet beschikbaar",
    "errors.unavailableDetail":
      "De site kan op dit moment niet bij wat hij nodig heeft. Probeer het later opnieuw.",

    "home.recentResults": "Recente uitslagen",
    "home.recentResults.none":
      "In de afgelopen zeven dagen zijn er geen partijen toegevoegd.",
    "home.upcomingTournaments": "Komende toernooien",
    "home.upcomingTournaments.none":
      "Er begint geen toernooi in de komende zestig dagen.",
    "home.allTournaments": "Alle toernooien in {year}",
    "year.heading": "Toernooien in {year}",
    "year.none": "Er begint geen toernooi in {year}.",
    "yearSport.heading": "{sport}-toernooien in {year}",
    "yearSport.none": "Er begint geen {sport}-toernooi in {year}.",
    "tournament.recent": "Recent",
    "tournament.summary": "Overzicht",
    "test.bestOf": "Elke wedstrijd is de beste van {count}.",
    "test.vs": "tegen",
    "test.matches": "Wedstrijden",
    "test.games": "Partijen",
    "test.hoops": "Poortjes",
    "teamSummary.tests": "Testmatches",
    "teamSummary.matches": "Wedstrijden",
    "teamSummary.games": "Partijen",
    "teamSummary.hoops": "Poortjes",
    "teamSummary.wins": "Gewonnen",
    "teamSummary.losses": "Verloren",
    "teamSummary.draws": "Gelijk",
    "teamSummary.for": "Voor",
    "teamSummary.against": "Tegen",
    "teamSummary.net": "Saldo",
    "tournament.players": "Spelers",
    "search.label": "Zoeken",
    "search.tournaments": "Toernooien",
    "search.competitions": "Competities",
    "search.nothingFound": "Er is niets gevonden.",
    "players.search.label": "Spelers zoeken",
    "players.search.prompt": "Typ de naam van een speler om die te vinden.",
    "players.search.none": "Er zijn geen spelers gevonden.",
    "search.more":
      "Alleen de eerste {count} worden getoond. Voeg meer van de naam toe om de zoekopdracht te verfijnen.",
    "websitePlayer.tournament": "Toernooi",
    "tournament.test": "{first} tegen {second}",
    "tournament.notes": "Notities",
    "tournament.commentary": "Commentaar",
    "tournament.beat": "versloeg",
    "tournament.drewWith": "speelde gelijk met",
    "tournament.ago.seconds": "{count} sec",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 uur",
    "tournament.ago.hours": "{count} uur",
    "tournament.none": "Er zijn nog geen partijen gespeeld.",
    "players.none": "Er zijn nog geen spelers toegevoegd.",
    "commentaries.by": "door",
    "commentaries.start": "Nieuw commentaar starten",
    "commentaries.disclaimer.heading": "Disclaimer",
    "commentaries.disclaimer":
      "De standpunten en meningen in dit commentaar zijn die van de schrijvers en komen niet noodzakelijk overeen met die van Tim Murphy of {site}.",
    "commentaries.guidelines.heading": "Richtlijnen",
    "commentaries.guidelines.responsible":
      "Je bent zelf verantwoordelijk voor je commentaar.",
    "commentaries.guidelines.purpose":
      'Het commentaar is bedoeld om door te geven wat er op het toernooi gebeurt. Het is niet bedoeld als "sociale media"-plek om goede wensen en dergelijke door te geven.',
    "commentaries.guidelines.hatred":
      "Plaats geen materiaal dat kan aanzetten tot geweld of haat. We tolereren geen opmerkingen die anderen vernederen op grond van ras, geloof, etniciteit, geslacht, leeftijd, een verstandelijke of lichamelijke beperking of seksuele geaardheid.",
    "commentaries.guidelines.abuse":
      "Nodeloze scheldpartijen worden niet getolereerd. De algemene regel is dat opmerkingen de bal moeten spelen en niet de man, dus niemand persoonlijk aanvallen maar het over de zaak zelf hebben.",
    "commentaries.guidelines.unlawful":
      "Opmerkingen die juridisch twijfelachtig zijn, zoals mogelijke schendingen van het auteursrecht of mogelijk smadelijk materiaal, worden verwijderd.",
    "commentaries.guidelines.shouting":
      "Vloek niet en schrijf geen commentaar in hoofdletters.",
    "commentaries.guidelines.selling":
      "Gebruik het opmerkingengedeelte niet voor commerciële doeleinden of spam. Opmerkingen die reclame maken voor goederen of diensten, ze aanprijzen of erom vragen, worden verwijderd.",
    "commentaries.guidelines.links":
      "Beperk het gebruik van links in opmerkingen. Opmerkingen met links naar ongepast materiaal worden verwijderd.",
    "commentaries.guidelines.impersonating":
      "Geef je in de opmerkingen niet uit voor een ander en plaats geen persoonlijke gegevens – telefoonnummers, post- of e-mailadressen – waarmee iemand onbedoeld in gevaar kan komen.",
    "commentaries.reporting.heading": "Commentaar melden",
    "commentaries.reporting.before":
      "Meld commentaar dat niet aan deze richtlijnen voldoet aan",
    "commentaries.reporting.after":
      ". Vermeld het webadres en het twijfelachtige commentaar, bijvoorbeeld:",
    "commentaries.reporting.exampleComment":
      '"een opmerking die verwijderd moet worden"',
    "commentaries.reporting.exampleReason":
      "Deze opmerking moet worden verwijderd omdat...",
    "commentaries.reporting.reviewed":
      "Een melding betekent niet dat het commentaar automatisch wordt verwijderd, maar alle meldingen worden beoordeeld.",
    "commentaries.reporting.reserved":
      "{site} behoudt zich het recht voor commentaar te verwijderen.",
    "commentaries.reporting.subject": "Melding van commentaar op {site}",
    "commentaries.reporting.body":
      "Vermeld het webadres, de twijfelachtige opmerking en waarom die verwijderd moet worden.",
    "startCommentary.title": "Nieuw commentaar starten",
    "startCommentary.titleField": "Titel",
    "startCommentary.submit": "Commentaar starten",
    "marks.new": "nieuw",
    "notes.none": "De beheerders hebben nog geen notities geschreven.",
    "note.edited": "bewerkt",
    "commentary.none": "Er zijn nog geen opmerkingen geschreven.",
    "commentary.edited": "bewerkt",
    "commentary.edit": "Bewerken",
    "commentary.delete": "Verwijderen",
    "commentary.comment": "Opmerking",
    "commentary.add": "Opmerking toevoegen",
    "commentary.notSent":
      "De opmerking kon niet worden verstuurd. Laad de pagina opnieuw om te zien of hij is bewaard.",
    "changeCommentaryTitle.title": "Titel wijzigen",
    "changeCommentaryTitle.submit": "Opslaan",
    "editComment.title": "Opmerking bewerken",
    "editComment.save": "Opslaan",
    "deleteComment.title": "Opmerking verwijderen",
    "deleteComment.question":
      "Deze opmerking verwijderen? Dit kan niet ongedaan worden gemaakt.",
    "deleteComment.confirm": "Opmerking verwijderen",
    "deleteComment.keep": "Behouden",
    "player.games": "Partijen",
    "player.competitions": "Competities",
    "player.beat": "versloeg",
    "player.lostTo": "verloor van",
    "player.drewWith": "speelde gelijk met",
    "player.score": "{score} tegen {opponent}",
    "player.noGames": "Er zijn nog geen partijen gespeeld.",
    "player.noCompetitions": "Nog aan geen enkele competitie deelgenomen.",
    "block.wins": "Gewonnen",
    "block.matches": "Wedstrijden",
    "block.netGames": "Saldo partijen",
    "block.games": "Partijen",
    "block.netHoops": "Saldo poortjes",
    "block.won": "gewonnen",
    "block.lost": "verloren",
    "block.drawn": "gelijkgespeeld",
    "block.withdrawn": "teruggetrokken",
    "block.gameWithdrawn": "teruggetrokken",
    "block.losses": "Verloren",
    "competition.views": "Weergaven",
    "competition.view.grid": "Rooster",
    "competition.view.summary": "Overzicht",
    "competition.view.orderOfPlay": "Speelschema",
    "blockSummary.ranking":
      "Gerangschikt naar het aandeel gewonnen wedstrijden, daarna naar saldo poortjes. Het eigen reglement van een toernooi kan de spelers anders plaatsen.",
    "orderOfPlay.none": "Er zijn nog geen partijen gespeeld.",
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Halve finales",
    "knockout.round.quarters": "Kwartfinales",
    "knockout.round.number": "Ronde {number}",
    "knockout.bye": "Vrij",
    "swiss.games": "Partijen",
    "swiss.wins": "Gewonnen",
    "swiss.winShare": "Winst %",
    "swiss.results": "Uitslagen",
    "knockout.onward": "Latere rondes",
    "knockout.back": "Eerdere rondes",
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Naam",
    "tournamentList.onlyIn": "Alleen toernooien in {country}",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Elk land",
    "tournamentList.filter.region": "Regio",
    "tournamentList.filter.anyRegion": "Elke regio",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Elke sport",
    "tournamentList.filter.submit": "Filteren",
    "years.label": "Jaren",
    "years.earlier": "Eerdere jaren",

    "admin.newerBuild.message":
      "Er is een nieuwere versie van deze site beschikbaar.",
    "admin.newerBuild.reload": "Herladen",
    "admin.title": "Beheer",
    "admin.tournaments.new": "Nieuw toernooi",
    "admin.tournaments.none": "Geen toernooien",
    "admin.tournaments.archived": "Gearchiveerd",
    "admin.tournaments.manage": "Beheren",
    "admin.tournaments.edit": "Bewerken",
    "admin.tournaments.archive": "Archiveren",
    "admin.tournaments.restore": "Herstellen",
    "admin.tournaments.scores": "Scores",
    "admin.tournaments.players": "Spelers",
    "admin.years.label": "Jaren",
    "admin.years.earlier": "Eerdere jaren",
    "admin.tournament.name": "Naam",
    "admin.tournament.starts": "Begint",
    "admin.tournament.finishes": "Eindigt",
    "admin.tournament.format": "Toernooivorm",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Regio",
    "admin.tournament.subtitle": "Ondertitel",
    "admin.tournament.handicap": "Gespeeld met handicaps",
    "admin.tournament.drawsAllowed": "Gelijkspel toegestaan",
    "admin.tournament.levelTestsDrawn": "Gelijke testmatches zijn gelijkspel",
    "admin.tournament.worldRankings": "Telt mee voor de wereldranglijst",
    "admin.tournament.national": "Evenement op nationaal niveau",
    "admin.tournament.international": "Evenement op internationaal niveau",
    "admin.tournament.otherwise":
      "Dit kan niet worden geaccepteerd zoals het is.",
    "admin.newTournament.title": "Nieuw toernooi",
    "admin.newTournament.submit": "Toernooi aanmaken",
    "admin.editTournament.title": "Toernooi bewerken",
    "admin.editTournament.submit": "Toernooi bijwerken",
    "admin.editTournament.otherwise": "Dit toernooi kan niet worden gewijzigd.",
    "admin.view.tabs": "Toernooi",
    "admin.view.players": "Spelers",
    "admin.view.competitions": "Competities",
    "admin.view.managers": "Beheerders",
    "admin.view.notes": "Notities",
    "admin.view.scorers": "Scorers",
    "admin.view.rankings": "Ranglijsten",
    "admin.rankings.textFile":
      "De uitslagen van het toernooi worden als tekstbestand naar de wereldranglijst gestuurd, dat de site schrijft uit de ingevoerde partijen.",
    "admin.rankings.spreadsheet":
      "De uitslagen van het toernooi worden als spreadsheet naar de wereldranglijst gestuurd, die de site schrijft uit de ingevoerde partijen.",
    "admin.rankings.fillInWinners":
      "De site kan alleen raden wie elke competitie won, dus controleer de regel Winner van elk voordat je het bestand verstuurt.",
    "admin.rankings.fillInWinner":
      "De site kan niet weten wie het toernooi won, dus vul dat onderaan de spreadsheet in voordat je die verstuurt.",
    "admin.rankings.sendIt":
      "Stuur het bestand daarna naar de functionarissen van de wereldranglijst.",
    "admin.rankings.download": "Ranglijsten downloaden",
    "rankings.notAvailable": "Ranglijsten zijn niet beschikbaar",
    "rankings.notAvailable.sport":
      "De sport van dit toernooi heeft geen wereldranglijst, dus er zijn geen ranglijsten om te versturen.",
    "rankings.notAvailable.handicap":
      "Dit toernooi wordt met handicap gespeeld, dus het telt niet mee voor de wereldranglijst.",
    "rankings.notAvailable.drawnGames":
      "Dit toernooi staat gelijkspel toe, dus het telt niet mee voor de wereldranglijst.",
    "rankings.notAvailable.notCounted":
      "De beheerder van dit toernooi heeft aangegeven dat het niet meetelt voor de wereldranglijst.",
    "admin.view.otherwise": "Dit toernooi kan van hieruit niet worden beheerd.",
    "admin.competitionView.tabs": "Competitie",
    "admin.competitionView.players": "Spelers",
    "admin.competitionView.scores": "Scores",
    "admin.sections.label": "Het toernooi en zijn competities",
    "admin.sections.tournament": "Toernooi",
    "admin.administrator.sections.label": "De pagina's van de beheerder",
    "admin.administrator.sections.tournaments": "Toernooien",
    "admin.administrator.sections.accounts": "Accounts",
    "admin.administrator.sections.worldRankings": "Wereldranglijsten",
    "admin.administrator.sections.importErrors": "Importfouten",
    "admin.administrator.title": "Beheerder",
    "admin.accounts.title": "Accounts",
    "admin.roles.add": "Toevoegen",
    "admin.roles.administrator.heading": "Beheerders",
    "admin.roles.administrator.none": "Geen andere beheerders",
    "admin.roles.administrator.removeTitle": "Beheerder verwijderen",
    "admin.roles.administrator.removeExplanation":
      "{name} is niet langer beheerder van deze site.",
    "admin.roles.world-ranking-officer.heading":
      "Functionarissen wereldranglijst",
    "admin.roles.world-ranking-officer.none":
      "Geen functionarissen wereldranglijst",
    "admin.roles.world-ranking-officer.removeTitle":
      "Functionaris wereldranglijst verwijderen",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} is niet langer functionaris wereldranglijst.",
    "admin.worldRankings.title": "Spelers van de wereldranglijst importeren",
    "admin.worldRankings.import": "Importeren",
    "admin.worldRankings.log": "Hoe de import is verlopen",
    "admin.worldRankings.ac.reading": "De lijst voor associatiecroquet lezen",
    "admin.worldRankings.ac.read":
      "Gelezen spelers van associatiecroquet: {players}",
    "admin.worldRankings.ac.kept":
      "Bewaarde spelers van associatiecroquet: {players}",
    "admin.worldRankings.ac.refused":
      "De lijst voor associatiecroquet kon niet worden gelezen, dus de spelers zijn gelaten zoals ze waren.",
    "admin.worldRankings.gc.reading": "De lijst voor golfcroquet lezen",
    "admin.worldRankings.gc.read": "Gelezen spelers van golfcroquet: {players}",
    "admin.worldRankings.gc.kept":
      "Bewaarde spelers van golfcroquet: {players}",
    "admin.worldRankings.gc.refused":
      "De lijst voor golfcroquet kon niet worden gelezen, dus de spelers zijn gelaten zoals ze waren.",
    "admin.worldRankings.finished": "Klaar",
    "admin.worldRankings.failed": "De import is niet voltooid.",
    "admin.worldRankings.otherwise": "Er is iets misgegaan op de site.",
    "WorldRankingLists.Unreachable":
      "De site van de wereldranglijsten kon niet worden bereikt.",
    "WorldRankingLists.Unreadable":
      "De lijst is niet ingedeeld zoals de wereldranglijsten hun lijst indelen: een regel erin kon niet worden gelezen, er staat niemand op, of hij is niet in UTF-8 geschreven.",
    "admin.importErrors.title": "Importfouten",
    "admin.importErrors.none": "Geen importfouten",
    "admin.importErrors.otherwise": "Er is iets misgegaan op de site.",
    "admin.importError.title": "Importfout",
    "admin.importError.documentId": "Document-id",
    "admin.importError.tournament": "Toernooi",
    "admin.importError.competition": "Competitie",
    "admin.importError.newSite": "Nieuwe site",
    "admin.importError.oldSite": "Oude site",
    "ImportErrorKept.NotFound":
      "De import heeft bij dat document geen fout bewaard.",
    "admin.competitionView.otherwise":
      "Deze competitie kan van hieruit niet worden beheerd.",
    "admin.competitions.block": "Poule",
    "admin.competitions.knockout": "Knock-out",
    "admin.competitions.swiss": "Zwitsers",
    "admin.competitions.view": "Bekijken",
    "admin.competitions.edit": "Bewerken",
    "admin.competitions.up": "Omhoog",
    "admin.competitions.down": "Omlaag",
    "admin.competitions.archive": "Archiveren",
    "admin.competitions.restore": "Herstellen",
    "admin.competitions.archived": "Gearchiveerde competities",
    "admin.competitions.none": "Geen competities",
    "admin.competitions.add": "Competitie toevoegen",
    "admin.competition.addTitle": "Competitie toevoegen",
    "admin.competition.editTitle": "Competitie bewerken",
    "admin.competition.name": "Naam",
    "admin.competition.kind": "Soort",
    "admin.competition.bestOf": "Beste van",
    "admin.competition.rounds": "Rondes",
    "admin.competition.places": "Plaatsen",
    "admin.competition.round": "Ronde {number}",
    "admin.competition.bestOfs": "Beste van per ronde",
    "admin.competition.quarters": "Kwartfinales",
    "admin.competition.semis": "Halve finales",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Toevoegen",
    "admin.competition.save": "Opslaan",
    "admin.competition.added": "{name} is toegevoegd.",
    "admin.competition.otherwise":
      "Deze competitie kan niet worden bewaard zoals ze is.",
    "CompetitionName.Missing": "Voer een naam in.",
    "CompetitionName.TooLong": "Een naam mag hoogstens 254 tekens lang zijn.",
    "CompetitionName.NoLetterOrDigit":
      "Een naam moet een letter of een cijfer bevatten.",
    "Tournament.KnockoutPlayerHasGames":
      "Spelers in deze loting hebben partijen, dus de plaatsen kunnen niet veranderen.",
    "Tournament.CompetitionNameTaken":
      "Een andere competitie in dit toernooi heeft die naam al.",
    "BestOf.NotWhole": "Voer een geheel aantal partijen in.",
    "BestOf.TooSmall":
      "Een wedstrijd moet de beste van minstens 1 partij zijn.",
    "Rounds.NotWhole": "Voer een geheel aantal rondes in.",
    "Rounds.TooSmall": "Een blok moet in minstens 1 ronde worden gespeeld.",
    "KnockoutDraw.EvenBestOf":
      "Een wedstrijd in een knock-out moet een winnaar hebben, dus hij is de beste van een oneven aantal partijen.",
    "admin.hover.tournaments.new": "Een nieuw toernooi aanmaken",
    "admin.hover.tournaments.manage":
      "De spelers, teams, competities en scores van dit toernooi beheren",
    "admin.hover.tournaments.edit": "De gegevens van dit toernooi wijzigen",
    "admin.hover.tournaments.scores": "De scores van dit toernooi invoeren",
    "admin.hover.tournaments.players": "De spelers van dit toernooi beheren",
    "admin.hover.competitions.view":
      "Deze competitie openen om de spelers en scores te zien en in te voeren",
    "admin.hover.tests.view":
      "Deze testmatch openen om de scores te zien en in te voeren",
    "admin.hover.teams.view":
      "Dit team openen om de spelers te zien en te beheren",
    "admin.hover.dialog.player.add": "Deze speler aan het toernooi toevoegen",
    "admin.hover.dialog.player.save": "De wijzigingen in deze speler bewaren",
    "admin.hover.dialog.team.add": "Dit team aan het toernooi toevoegen",
    "admin.hover.dialog.team.save": "De wijzigingen in dit team bewaren",
    "admin.hover.dialog.test.add": "Deze testmatch aan het toernooi toevoegen",
    "admin.hover.dialog.test.save": "De wijzigingen in deze testmatch bewaren",
    "admin.hover.dialog.competition.add":
      "Deze competitie aan het toernooi toevoegen",
    "admin.hover.dialog.competition.save":
      "De wijzigingen in deze competitie bewaren",
    "admin.hover.dialog.score.add": "Deze score aan de competitie toevoegen",
    "admin.hover.dialog.score.save": "De correctie van deze score bewaren",
    "admin.hover.dialog.carryForward.save":
      "De resultaten van deze speler doorschuiven",
    "admin.hover.dialog.tournament.new": "Dit toernooi aanmaken",
    "admin.hover.dialog.tournament.edit":
      "De wijzigingen in dit toernooi bewaren",
    "admin.hover.modal.cancel": "Dit sluiten zonder iets te bewaren",
    "admin.hover.modal.ok": "Dit bericht sluiten",
    "admin.hover.tab": "Het tabblad {name} tonen",
    "admin.hover.tournaments.archive":
      "Dit toernooi archiveren; het kan worden hersteld",
    "admin.hover.tournaments.restore":
      "Dit gearchiveerde toernooi terugbrengen",
    "admin.hover.players.add": "Een speler aan dit toernooi toevoegen",
    "admin.hover.players.edit": "De gegevens van deze speler wijzigen",
    "admin.hover.players.up": "Deze speler in de lijst omhoog verplaatsen",
    "admin.hover.players.down": "Deze speler in de lijst omlaag verplaatsen",
    "admin.hover.players.archive":
      "Deze speler archiveren; de speler kan worden hersteld",
    "admin.hover.players.restore": "Deze gearchiveerde speler terugbrengen",
    "admin.hover.teams.add": "Een team aan dit toernooi toevoegen",
    "admin.hover.teams.edit": "De gegevens van dit team wijzigen",
    "admin.hover.teams.up": "Dit team in de lijst omhoog verplaatsen",
    "admin.hover.teams.down": "Dit team in de lijst omlaag verplaatsen",
    "admin.hover.teams.archive": "Dit team archiveren; het kan worden hersteld",
    "admin.hover.teams.restore": "Dit gearchiveerde team terugbrengen",
    "admin.hover.competitions.add": "Een competitie aan dit toernooi toevoegen",
    "admin.hover.competitions.edit": "De gegevens van deze competitie wijzigen",
    "admin.hover.competitions.up":
      "Deze competitie in de lijst omhoog verplaatsen",
    "admin.hover.competitions.down":
      "Deze competitie in de lijst omlaag verplaatsen",
    "admin.hover.competitions.archive":
      "Deze competitie archiveren; ze kan worden hersteld",
    "admin.hover.competitions.restore":
      "Deze gearchiveerde competitie terugbrengen",
    "admin.hover.tests.add": "Een testmatch tussen twee teams toevoegen",
    "admin.hover.tests.edit": "De gegevens van deze testmatch wijzigen",
    "admin.hover.tests.up": "Deze testmatch in de lijst omhoog verplaatsen",
    "admin.hover.tests.down": "Deze testmatch in de lijst omlaag verplaatsen",
    "admin.hover.tests.archive":
      "Deze testmatch archiveren; hij kan worden hersteld",
    "admin.hover.tests.restore": "Deze gearchiveerde testmatch terugbrengen",
    "admin.hover.tests.toTeams":
      "Naar het tabblad Teams gaan om de teams toe te voegen die een testmatch nodig heeft",
    "admin.hover.scores.add":
      "De score van een partij aan deze competitie toevoegen",
    "admin.hover.scores.edit": "Deze score corrigeren",
    "admin.hover.scores.archive":
      "Deze score archiveren zodat hij niet meer meetelt; hij kan worden hersteld",
    "admin.hover.scores.restore":
      "Deze gearchiveerde score terugbrengen, zodat hij weer meetelt",
    "admin.hover.scores.withdraw":
      "Deze score in de lijst laten staan maar niet meer laten meetellen",
    "admin.hover.scores.unwithdraw":
      "Deze teruggetrokken score weer laten meetellen",
    "admin.hover.scores.up": "Deze score eerder in de lijst zetten",
    "admin.hover.scores.down": "Deze score later in de lijst zetten",
    "admin.hover.competitionPlayers.add":
      "De gekozen speler in deze competitie zetten",
    "admin.hover.competitionPlayers.up":
      "Deze speler in de lijst omhoog verplaatsen",
    "admin.hover.competitionPlayers.down":
      "Deze speler in de lijst omlaag verplaatsen",
    "admin.hover.competitionPlayers.remove":
      "Deze speler uit de competitie halen",
    "admin.hover.competitionPlayers.withdraw":
      "Deze speler uit de competitie terugtrekken",
    "admin.hover.competitionPlayers.unwithdraw":
      "Deze teruggetrokken speler weer in de competitie zetten",
    "admin.hover.competitionPlayers.carryForward":
      "De resultaten van deze speler uit een andere competitie doorschuiven",
    "admin.hover.notes.add": "Een nieuwe notitie voor dit toernooi schrijven",
    "admin.hover.notes.edit": "Deze notitie wijzigen",
    "admin.hover.notes.delete": "Deze notitie verwijderen",
    "admin.hover.note.add":
      "Deze notitie bewaren en aan het toernooi toevoegen",
    "admin.hover.note.save": "De wijzigingen in deze notitie bewaren",
    "admin.hover.people.add": "Deze persoon de rol geven",
    "admin.hover.people.remove": "De rol van deze persoon afnemen",
    "admin.hover.worldRankings.import":
      "De wereldranglijsten ophalen en hun spelers toevoegen",
    "admin.modal.cancel": "Annuleren",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "E-mailadres",
    "admin.people.remove": "Verwijderen",
    "admin.people.otherwise": "Dat kon niet worden gedaan.",
    "admin.managers.you": "Jij",
    "admin.managers.add": "Beheerder toevoegen",
    "admin.managers.none": "Geen beheerders",
    "admin.managers.removeTitle": "Beheerder verwijderen",
    "admin.managers.removeExplanation":
      "{name} kan dit toernooi niet langer beheren.",
    "admin.managers.removeYourself.explanation":
      "Je kunt dit toernooi niet langer beheren, en niemand hier kan dat voor je ongedaan maken. Een andere beheerder kan je weer beheerder maken.",
    "admin.managers.otherwise":
      "Van dat adres kan geen beheerder worden gemaakt.",
    "admin.competitionPlayers.add": "Speler toevoegen",
    "admin.competitionPlayers.otherwise":
      "Deze speler kan niet worden toegevoegd.",
    "admin.competitionPlayers.choose": "Toe te voegen speler",
    "admin.competitionPlayers.nobody": "Kies een speler",
    "admin.competitionPlayers.bye": "Vrij",
    "admin.competitionPlayers.all": "Elke speler zit in de competitie",
    "admin.competitionPlayers.none": "Geen spelers",
    "admin.competitionPlayers.up": "Omhoog",
    "admin.competitionPlayers.down": "Omlaag",
    "admin.competitionPlayers.remove": "Verwijderen",
    "admin.competitionPlayers.withdraw": "Terugtrekken",
    "admin.competitionPlayers.unwithdraw": "Weer toelaten",
    "admin.competitionPlayers.withdrawn": "Teruggetrokken spelers",
    "admin.competitionPlayers.removeTitle": "Speler verwijderen",
    "admin.competitionPlayers.removeQuestion":
      "{name} wordt uit de competitie gehaald. Dit kan niet ongedaan worden gemaakt.",
    "admin.competitionPlayers.withdrawTitle": "Speler terugtrekken",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} speelt de rest van de competitie niet meer mee, en de partijen die nog niet zijn gespeeld worden zonder die speler beslist.",
    "admin.competitionPlayers.carryForward": "Doorschuiven",
    "admin.carryForward.title": "Doorschuiven - {name}",
    "admin.carryForward.save": "Opslaan",
    "admin.carryForward.otherwise": "Dit doorschuiven kan niet worden bewaard.",
    "admin.carryForward.matchWins": "Gewonnen wedstrijden",
    "admin.carryForward.matchLosses": "Verloren wedstrijden",
    "admin.carryForward.gameWins": "Gewonnen partijen",
    "admin.carryForward.gameLosses": "Verloren partijen",
    "admin.carryForward.hoopsFor": "Poortjes voor",
    "admin.carryForward.hoopsAgainst": "Poortjes tegen",
    "CarryForward.MatchWinsNotWhole":
      "Voer een geheel aantal gewonnen wedstrijden in.",
    "CarryForward.MatchWinsBelowZero":
      "Voer 0 of meer gewonnen wedstrijden in.",
    "CarryForward.MatchLossesNotWhole":
      "Voer een geheel aantal verloren wedstrijden in.",
    "CarryForward.MatchLossesBelowZero":
      "Voer 0 of meer verloren wedstrijden in.",
    "CarryForward.GameWinsNotWhole":
      "Voer een geheel aantal gewonnen partijen in.",
    "CarryForward.GameWinsBelowZero": "Voer 0 of meer gewonnen partijen in.",
    "CarryForward.GameLossesNotWhole":
      "Voer een geheel aantal verloren partijen in.",
    "CarryForward.GameLossesBelowZero": "Voer 0 of meer verloren partijen in.",
    "CarryForward.HoopsForNotWhole": "Voer een geheel aantal poortjes voor in.",
    "CarryForward.HoopsForBelowZero": "Voer 0 of meer poortjes voor in.",
    "CarryForward.HoopsAgainstNotWhole":
      "Voer een geheel aantal poortjes tegen in.",
    "CarryForward.HoopsAgainstBelowZero": "Voer 0 of meer poortjes tegen in.",
    "admin.scores.add": "Score toevoegen",
    "admin.scores.none": "Geen scores",
    "admin.scores.edit": "Bewerken",
    "admin.scores.drawNotFilledTitle": "Loting niet gevuld",
    "admin.scores.archive": "Archiveren",
    "admin.scores.up": "Omhoog",
    "admin.scores.down": "Omlaag",
    "admin.scores.restore": "Herstellen",
    "admin.scores.archived": "Gearchiveerde scores",
    "admin.scores.archivedSaid": "Gearchiveerd",
    "admin.scores.withdraw": "Terugtrekken",
    "admin.scores.unwithdraw": "Weer laten meetellen",
    "admin.scores.withdrawnSaid": "Teruggetrokken",
    "admin.scores.otherwise": "Dat kon niet worden gedaan.",
    "admin.score.title": "Score toevoegen",
    "admin.score.add": "Partij toevoegen",
    "admin.score.winner": "Winnaar",
    "admin.score.winnerScore": "Score van de winnaar",
    "admin.score.loser": "Verliezer",
    "admin.score.loserScore": "Score van de verliezer",
    "admin.score.beat": "versloeg",
    "admin.score.added":
      "De partij die {winner} van {loser} won, is toegevoegd.",
    "admin.score.otherwise": "De partij kon niet worden toegevoegd.",
    "admin.score.correctTitle": "Score bewerken",
    "admin.score.save": "Opslaan",
    "admin.score.notCorrected": "De score kon niet worden gecorrigeerd.",
    "Game.WinnerMissing": "Kies de winnaar.",
    "Game.WinnerScoreMissing": "Typ de score van de winnaar.",
    "Game.LoserMissing": "Kies de verliezer.",
    "Game.LoserScoreMissing": "Typ de score van de verliezer.",
    "Score.NoPoints": "Een score begint met zijn aantal punten.",
    "Game.SamePlayer": "Niemand speelt tegen zichzelf.",
    "Game.WinnerNotAhead":
      "De score van de winnaar moet hoger zijn dan die van de verliezer, of als gewonnen zijn aangemerkt.",
    "Game.LoserMarked":
      "De score van de verliezer kan niet als gewonnen worden aangemerkt.",
    "Game.ResultChanged":
      "Een correctie behoudt de uitslag: een gewonnen partij blijft gewonnen en een gelijkgespeelde partij blijft gelijk.",
    "Competition.MatchDecided": "Hun wedstrijd is al beslist.",
    "Competition.DrawFull":
      "De speler kan niet worden toegevoegd omdat de knock-out vol is.",
    "Competition.DrawNotFilled":
      "Er kunnen geen scores worden toegevoegd zolang niet elke plaats in de knock-out is gevuld met een speler of een vrije ronde.",
    "Competition.ByeOutsideKnockout":
      "Alleen een knock-out kan een vrije ronde hebben.",
    "Competition.NotDrawnToMeet":
      "Deze spelers zijn op dit moment niet geloot om in de knock-out tegen elkaar te spelen.",
    "Competition.WinnerHasPlayedOn":
      "De winnaar van deze wedstrijd heeft zijn volgende partij al gespeeld, dus wie hem won kan niet meer veranderen.",
    "CompetitionPlayer.Withdrawn":
      "Een teruggetrokken speler speelt niet meer.",
    "admin.players.add": "Speler toevoegen",
    "admin.players.none": "Geen spelers",
    "admin.players.edit": "Bewerken",
    "admin.players.archive": "Archiveren",
    "admin.players.restore": "Herstellen",
    "admin.players.up": "Omhoog",
    "admin.players.down": "Omlaag",
    "admin.players.archiveTitle": "Speler archiveren",
    "admin.players.archiveQuestion":
      "{name} wordt uit deze competities verwijderd:",
    "admin.players.archive.explanation":
      "Door de speler te herstellen komt hij niet terug in deze competities.",
    "admin.players.archived": "Gearchiveerde spelers",
    "admin.players.archivedSaid": "Gearchiveerd",
    "admin.player.addTitle": "Speler toevoegen",
    "admin.player.editTitle": "Speler bewerken",
    "admin.player.name": "Naam",
    "admin.player.representing": "Vertegenwoordigt",
    "admin.player.worldRankingName": "Naam van de speler op de wereldranglijst",
    "admin.player.worldRankingKnown": "De wereldranglijsten kennen deze naam.",
    "admin.player.worldRankingQuestioned":
      "De wereldranglijsten hebben geen speler met deze naam. Hij kan verkeerd gespeld zijn, of de speler is nieuw op de ranglijsten.",
    "admin.player.flag": "Vlag",
    "admin.player.add": "Toevoegen",
    "admin.player.save": "Opslaan",
    "admin.player.added": "{name} is toegevoegd.",
    "admin.player.otherwise":
      "Deze speler kan niet worden bewaard zoals hij is.",
    "Tournament.PlayerNameTaken":
      "Een andere speler in dit toernooi heeft die naam al.",
    "TournamentPlayer.NoSuchFlag": "Kies een van de bestaande vlaggen.",
    "TournamentPlayer.NamedBye": "Een speler kan niet Vrij heten.",
    "TournamentPlayer.NoLetterOrDigit":
      "Een naam moet een letter of een cijfer bevatten.",
    "admin.player.byesTitle": "Een vrije ronde hoeft niet te worden toegevoegd",
    "admin.player.byes":
      "Een vrije ronde is geen speler van het toernooi. Een knock-out biedt Vrij aan telkens wanneer de spelers worden toegevoegd, zo vaak als de loting nodig heeft.",
    "admin.view.teams": "Teams",
    "admin.view.tests": "Testmatches",
    "admin.teams.add": "Team toevoegen",
    "admin.teams.none": "Geen teams",
    "admin.teams.edit": "Bewerken",
    "admin.teams.view": "Bekijken",
    "admin.teams.archive": "Archiveren",
    "admin.teams.restore": "Herstellen",
    "admin.teams.up": "Omhoog",
    "admin.teams.down": "Omlaag",
    "admin.teams.archived": "Gearchiveerde teams",
    "admin.teams.archivedSaid": "Gearchiveerd",
    "admin.team.addTitle": "Team toevoegen",
    "admin.team.editTitle": "Team bewerken",
    "admin.team.name": "Naam",
    "admin.team.shortName": "Korte naam",
    "admin.team.shortName.explanation":
      "Waaronder de testmatches van het team bekend staan, zoals AUS v ENG.",
    "admin.team.flag": "Vlag",
    "admin.team.add": "Toevoegen",
    "admin.team.save": "Opslaan",
    "admin.team.added": "{name} is toegevoegd.",
    "admin.team.otherwise": "Dit team kan niet worden bewaard zoals het is.",
    "admin.teamView.otherwise": "Dit team kan van hieruit niet worden bekeken.",
    "admin.teamView.players": "Spelers",
    "TeamName.Missing": "Geef aan hoe het team heet.",
    "TeamName.TooLong": "Die naam is te lang.",
    "admin.notes.add": "Notitie toevoegen",
    "admin.notes.none": "Geen notities",
    "admin.notes.edit": "Bewerken",
    "admin.notes.delete": "Verwijderen",
    "admin.notes.deleteTitle": "Notitie verwijderen",
    "admin.notes.deleteQuestion": "De notitie “{title}” verwijderen?",
    "admin.notes.delete.explanation":
      "Een verwijderde notitie is voorgoed weg en kan niet worden teruggehaald.",
    "admin.notes.otherwise": "Dat kon niet worden gedaan.",
    "admin.note.addTitle": "Notitie toevoegen",
    "admin.note.editTitle": "Notitie bewerken",
    "admin.note.title": "Titel",
    "admin.note.description": "Beschrijving",
    "admin.note.write": "Schrijven",
    "admin.note.preview": "Voorbeeld",
    "admin.note.toolbar": "Opmaak",
    "admin.note.tool.heading": "Kop",
    "admin.note.tool.bold": "Vet",
    "admin.note.tool.italic": "Cursief",
    "admin.note.tool.quote": "Citaat",
    "admin.note.tool.code": "Code",
    "admin.note.tool.link": "Link",
    "admin.note.tool.numberedList": "Genummerde lijst",
    "admin.note.tool.bulletedList": "Lijst met opsommingstekens",
    "admin.note.tool.taskList": "Takenlijst",
    "admin.note.add": "Toevoegen",
    "admin.note.save": "Opslaan",
    "admin.note.otherwise": "Deze notitie kan niet worden bewaard zoals ze is.",
    "ManagerNoteTitle.Missing": "Geef de notitie een titel.",
    "ManagerNoteTitle.TooLong": "Die titel is te lang.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Een titel moet een letter of een cijfer bevatten.",
    "ManagerNoteDescription.TooLong": "Die beschrijving is te lang.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Die notitie is er niet meer. Misschien heeft een andere beheerder hem verwijderd.",
    "EditManagerNote.NoSuchManagerNote":
      "Die notitie is er niet meer. Misschien heeft een andere beheerder hem verwijderd.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Die notitie is er niet meer. Misschien heeft een andere beheerder hem verwijderd.",
    "ManagerNote.Deleted":
      "Die notitie is verwijderd. Misschien heeft een andere beheerder hem verwijderd.",
    "CommentaryTitle.Missing": "Geef het commentaar een titel.",
    "CommentaryTitle.TooLong": "Die titel is te lang.",
    "CommentaryTitle.NoLetterOrDigit":
      "Een titel moet een letter of een cijfer bevatten.",
    "Commentary.TitleTaken": "Een ander commentaar heeft die titel al.",
    "CommentText.Missing": "Schrijf iets in de opmerking.",
    "CommentText.TooLong": "Die opmerking is te lang.",
    "TeamShortName.Missing": "Geef het team een korte naam.",
    "TeamShortName.TooLong":
      "Een korte naam mag hoogstens 10 tekens lang zijn.",
    "TeamShortName.NoLetterOrDigit":
      "Een korte naam moet een letter of een cijfer bevatten.",
    "Team.ShortNameLongerThanName":
      "Een korte naam kan niet langer zijn dan de naam van het team.",
    "Team.NoSuchFlag": "Kies een van de bestaande vlaggen.",
    "Team.Archived": "Dat team is gearchiveerd en moet eerst worden hersteld.",
    "Team.InATest":
      "Dat team speelt in een testmatch en kan niet worden gearchiveerd.",
    "Team.PlayerNameTaken": "Een andere speler in dit team heeft die naam al.",
    "TeamPlayer.NamedBye": "Een speler kan niet Vrij heten.",
    "TeamPlayer.Archived":
      "Die speler is gearchiveerd en moet eerst worden hersteld.",
    "TeamPlayer.HasGames":
      "Die speler heeft gespeeld en kan niet worden gearchiveerd.",
    "Tournament.TeamNameTaken":
      "Een ander team in dit toernooi heeft die naam al.",
    "Tournament.TeamShortNameTaken":
      "Een ander team in dit toernooi heeft die korte naam al.",
    "Tournament.NoSuchTeam": "Dit toernooi heeft geen team op dit adres.",
    "Tournament.TeamArchived":
      "Dit team is gearchiveerd en kan alleen worden hersteld via het tabblad Teams.",
    "admin.tests.add": "Testmatch toevoegen",
    "admin.tests.none": "Geen testmatches",
    "admin.tests.edit": "Bewerken",
    "admin.tests.view": "Bekijken",
    "admin.tests.archive": "Archiveren",
    "admin.tests.restore": "Herstellen",
    "admin.tests.up": "Omhoog",
    "admin.tests.down": "Omlaag",
    "admin.tests.archived": "Gearchiveerde testmatches",
    "admin.tests.twoTeamsNeeded":
      "Een testmatch is tussen twee teams, dus er zijn eerst twee teams nodig.",
    "admin.tests.toTeams": "Naar Teams gaan",
    "admin.tests.matches.one": "{count} wedstrijd",
    "admin.tests.matches.other": "{count} wedstrijden",
    "admin.tests.bestOf": "beste van {games}",
    "admin.tests.otherwise": "Dat kon niet worden gedaan.",
    "admin.test.addTitle": "Testmatch toevoegen",
    "admin.test.editTitle": "Testmatch bewerken",
    "admin.test.firstTeam": "Team A",
    "admin.test.secondTeam": "Team B",
    "admin.test.versus": "v",
    "admin.test.starts": "Begint",
    "admin.test.finishes": "Eindigt",
    "admin.test.expectedMatches": "Verwachte wedstrijden",
    "admin.test.bestOf": "Beste van",
    "admin.test.group": "Groep",
    "admin.test.add": "Toevoegen",
    "admin.test.save": "Opslaan",
    "admin.test.added": "{name} is toegevoegd.",
    "admin.test.otherwise":
      "Deze testmatch kan niet worden bewaard zoals hij is.",
    "admin.testView.otherwise":
      "Deze testmatch kan van hieruit niet worden bekeken.",
    "AddTest.FirstTeamMissing": "Kies het eerste team.",
    "AddTest.SecondTeamMissing": "Kies het tweede team.",
    "UpdateTest.FirstTeamMissing": "Kies het eerste team.",
    "UpdateTest.SecondTeamMissing": "Kies het tweede team.",
    "ExpectedMatches.NotWhole": "Voer een geheel aantal wedstrijden in.",
    "ExpectedMatches.TooSmall":
      "Van een testmatch moet minstens 1 wedstrijd worden verwacht.",
    "TestGroup.TooLong": "Die groep is te lang.",
    "Tournament.TestAgainstItself":
      "Een team speelt geen testmatch tegen zichzelf.",
    "Tournament.TestFinishesBeforeStarts":
      "Een testmatch kan niet eindigen voordat hij begint.",
    "Tournament.TestStartsBeforeTournament":
      "Een testmatch kan niet beginnen voordat zijn toernooi begint.",
    "Tournament.TestFinishesAfterTournament":
      "Een testmatch kan niet eindigen nadat zijn toernooi is geëindigd.",
    "Tournament.TestHasGamesInUse":
      "Deze testmatch heeft partijen, dus hij kan pas worden gearchiveerd als die zijn gearchiveerd.",
    "Tournament.TestHasGames":
      "Deze testmatch heeft nu partijen, dus de teams kunnen niet meer worden gewijzigd.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Er zijn al meer wedstrijden begonnen dan dat.",
    "Tournament.BestOfBelowGamesPlayed":
      "Twee spelers hebben al meer partijen gespeeld dan dat.",
    "Competition.ExpectedMatchesReached":
      "Deze testmatch heeft al zoveel wedstrijden gestart als erin worden verwacht.",
    "Competition.SameTeam":
      "Twee spelers van hetzelfde team spelen niet tegen elkaar.",
    "AddManager.NoSuchAccount":
      "Dat adres heeft geen account waarvan een beheerder kan worden gemaakt.",
    "admin.scorers.add": "Scorer toevoegen",
    "admin.scorers.none": "Geen scorers",
    "admin.scorers.removeTitle": "Scorer verwijderen",
    "admin.scorers.removeExplanation":
      "{name} kan de scores van dit toernooi niet langer invoeren.",
    "admin.scorers.otherwise": "Van dat adres kan geen scorer worden gemaakt.",
    "AddScorer.NoSuchAccount":
      "Dat adres heeft geen account waarvan een scorer kan worden gemaakt.",
    "Account.NotAnAdministrator": "Alleen een beheerder kan dat doen.",
    "AddRole.NoSuchAccount":
      "Dat adres heeft geen account waaraan de rol kan worden gegeven.",
    "AddRole.NoSuchRole": "Die rol bestaat niet.",
    "RemoveRole.NoSuchAccount": "Dat account bestaat niet.",
    "RemoveRole.NoSuchRole": "Die rol bestaat niet.",
    "RemoveRole.Yourself":
      "Je kunt de rol van beheerder niet van jezelf afnemen.",
    "AccountsWithRole.NoSuchRole": "Die rol bestaat niet.",
    "Tournament.AlreadyAManager":
      "Dat account beheert het toernooi al en kan alles wat een scorer kan.",

    "TournamentName.Missing": "Geef aan hoe het toernooi heet.",
    "TournamentName.TooShort": "Die naam is te kort.",
    "TournamentName.TooLong": "Die naam is te lang.",
    "TournamentName.AllLowerCase":
      "Een naam wordt niet helemaal in kleine letters geschreven.",
    "TournamentName.AllCapitals":
      "Een naam wordt niet helemaal in hoofdletters geschreven.",
    "TournamentName.NoLetterOrDigit":
      "Een naam moet een letter of een cijfer bevatten.",
    "ReadOnlyDate.Unreadable": "Geef de dag.",
    "Tournament.FinishesBeforeStarts":
      "Een toernooi kan niet eindigen voordat het begint.",
    "Tournament.StartsAfterNextYear":
      "Een toernooi kan niet na volgend jaar beginnen.",
    "Tournament.FinishesAfterNextYear":
      "Een toernooi kan niet na volgend jaar eindigen.",
    "CreateTournament.NoSuchCountry": "Kies het land.",
    "TournamentSubtitle.TooLong":
      "Een ondertitel mag niet langer zijn dan 2000 tekens.",
    "Tournament.NotAManager":
      "Alleen een beheerder van dit toernooi kan het wijzigen.",
    "Tournament.NotAManagerOrScorer":
      "Alleen een beheerder of scorer van dit toernooi kan het zien.",
    "Tournament.Archived":
      "Dit toernooi is gearchiveerd en wordt hersteld voordat het kan worden gewijzigd.",
    "UpdateTournament.NoSuchTournament": "Er is geen toernooi op dit adres.",

    "sport.ac": "Associatiecroquet",
    "sport.gc": "Golfcroquet",
    "sport.a6w": "Amerikaans croquet met 6 poortjes",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standaard",
    "format.teams": "Teams",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Verenigde Arabische Emiraten",
    "country.af": "Afghanistan",
    "country.ag": "Antigua en Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanië",
    "country.am": "Armenië",
    "country.ao": "Angola",
    "country.ar": "Argentinië",
    "country.as": "Amerikaans-Samoa",
    "country.at": "Oostenrijk",
    "country.au": "Australië",
    "country.aw": "Aruba",
    "country.ax": "Åland",
    "country.az": "Azerbeidzjan",
    "country.ba": "Bosnië en Herzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "België",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarije",
    "country.bh": "Bahrein",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brunei",
    "country.bo": "Bolivia",
    "country.br": "Brazilië",
    "country.bs": "Bahama's",
    "country.bt": "Bhutan",
    "country.bv": "Bouvet",
    "country.bw": "Botswana",
    "country.by": "Wit-Rusland",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalonië",
    "country.cc": "Cocoseilanden",
    "country.cd": "Democratische Republiek Congo",
    "country.cf": "Centraal-Afrikaanse Republiek",
    "country.cg": "Republiek Congo",
    "country.ch": "Zwitserland",
    "country.ci": "Ivoorkust",
    "country.ck": "Cookeilanden",
    "country.cl": "Chili",
    "country.cm": "Kameroen",
    "country.cn": "China",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Kaapverdië",
    "country.cx": "Christmaseiland",
    "country.cy": "Cyprus",
    "country.cz": "Tsjechië",
    "country.de": "Duitsland",
    "country.dj": "Djibouti",
    "country.dk": "Denemarken",
    "country.dm": "Dominica",
    "country.do": "Dominicaanse Republiek",
    "country.dz": "Algerije",
    "country.ec": "Ecuador",
    "country.ee": "Estland",
    "country.eg": "Egypte",
    "country.eh": "Westelijke Sahara",
    "country.england": "Engeland",
    "country.er": "Eritrea",
    "country.es": "Spanje",
    "country.et": "Ethiopië",
    "country.fi": "Finland",
    "country.fj": "Fiji",
    "country.fk": "Falklandeilanden",
    "country.fm": "Micronesia",
    "country.fo": "Faeröer",
    "country.fr": "Frankrijk",
    "country.ga": "Gabon",
    "country.gb": "Verenigd Koninkrijk",
    "country.gd": "Grenada",
    "country.ge": "Georgië",
    "country.gf": "Frans-Guyana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenland",
    "country.gm": "Gambia",
    "country.gn": "Guinee",
    "country.gp": "Guadeloupe",
    "country.gq": "Equatoriaal-Guinea",
    "country.gr": "Griekenland",
    "country.gs": "Zuid-Georgia en de Zuidelijke Sandwicheilanden",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinee-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heard en McDonaldeilanden",
    "country.hn": "Honduras",
    "country.hr": "Kroatië",
    "country.ht": "Haïti",
    "country.hu": "Hongarije",
    "country.id": "Indonesië",
    "country.ie": "Ierland",
    "country.il": "Israël",
    "country.im": "Man",
    "country.in": "India",
    "country.io": "Brits Indische Oceaanterritorium",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "IJsland",
    "country.it": "Italië",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Jordanië",
    "country.jp": "Japan",
    "country.ke": "Kenia",
    "country.kg": "Kirgizië",
    "country.kh": "Cambodja",
    "country.ki": "Kiribati",
    "country.km": "Comoren",
    "country.kn": "Saint Kitts en Nevis",
    "country.kp": "Noord-Korea",
    "country.kr": "Zuid-Korea",
    "country.kw": "Koeweit",
    "country.ky": "Kaaimaneilanden",
    "country.kz": "Kazachstan",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Litouwen",
    "country.lu": "Luxemburg",
    "country.lv": "Letland",
    "country.ly": "Libië",
    "country.ma": "Marokko",
    "country.mc": "Monaco",
    "country.md": "Moldavië",
    "country.me": "Montenegro",
    "country.mg": "Madagaskar",
    "country.mh": "Marshalleilanden",
    "country.mk": "Noord-Macedonië",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolië",
    "country.mo": "Macau",
    "country.mp": "Noordelijke Marianen",
    "country.mq": "Martinique",
    "country.mr": "Mauritanië",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maldiven",
    "country.mw": "Malawi",
    "country.mx": "Mexico",
    "country.my": "Maleisië",
    "country.mz": "Mozambique",
    "country.na": "Namibië",
    "country.nc": "Nieuw-Caledonië",
    "country.ne": "Niger",
    "country.nf": "Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Nederland",
    "country.no": "Noorwegen",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nieuw-Zeeland",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Frans-Polynesië",
    "country.pg": "Papoea-Nieuw-Guinea",
    "country.ph": "Filipijnen",
    "country.pk": "Pakistan",
    "country.pl": "Polen",
    "country.pm": "Saint-Pierre en Miquelon",
    "country.pn": "Pitcairneilanden",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "Réunion",
    "country.ro": "Roemenië",
    "country.rs": "Servië",
    "country.ru": "Rusland",
    "country.rw": "Rwanda",
    "country.sa": "Saoedi-Arabië",
    "country.sb": "Salomonseilanden",
    "country.sc": "Seychellen",
    "country.scotland": "Schotland",
    "country.sd": "Soedan",
    "country.se": "Zweden",
    "country.sg": "Singapore",
    "country.sh": "Sint-Helena",
    "country.si": "Slovenië",
    "country.sj": "Spitsbergen en Jan Mayen",
    "country.sk": "Slowakije",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalië",
    "country.sr": "Suriname",
    "country.st": "Sao Tomé en Principe",
    "country.sv": "El Salvador",
    "country.sy": "Syrië",
    "country.sz": "Eswatini",
    "country.tc": "Turks- en Caicoseilanden",
    "country.td": "Tsjaad",
    "country.tf": "Franse Zuidelijke en Antarctische Gebieden",
    "country.tg": "Togo",
    "country.th": "Thailand",
    "country.tj": "Tadzjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Oost-Timor",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunesië",
    "country.to": "Tonga",
    "country.tr": "Turkije",
    "country.tt": "Trinidad en Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzania",
    "country.ua": "Oekraïne",
    "country.ug": "Oeganda",
    "country.um": "Kleine afgelegen eilanden van de Verenigde Staten",
    "country.us": "Verenigde Staten",
    "country.uy": "Uruguay",
    "country.uz": "Oezbekistan",
    "country.va": "Vaticaanstad",
    "country.vc": "Saint Vincent en de Grenadines",
    "country.ve": "Venezuela",
    "country.vg": "Britse Maagdeneilanden",
    "country.vi": "Amerikaanse Maagdeneilanden",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wales",
    "country.wf": "Wallis en Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Zuid-Afrika",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    "Email.ConfirmAddress.subject": "Bevestig je e-mailadres voor {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hallo,</p>

<p>
    Bedankt voor het aanmaken van een account bij <strong>{siteName}</strong>.<br />
    Voordat je je account kunt gebruiken, moet je je e-mailadres bevestigen door
    op de knop hieronder te klikken:
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
        Mijn e-mailadres bevestigen
    </a>
</p>

<p>
    Werkt de knop niet, dan kun je je e-mailadres ook bevestigen door deze link in je browser te openen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Heb je dit account niet aangemaakt, dan kun je deze e-mail gerust negeren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Een nieuwe link om je e-mailadres te bevestigen voor {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hallo,</p>

<p>
    Je hebt onlangs een nieuwe e-mail aangevraagd om je e-mailadres voor <strong>{siteName}</strong> te bevestigen.<br />
    Bevestig je e-mailadres door op de knop hieronder te klikken:
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
        Mijn e-mailadres bevestigen
    </a>
</p>

<p>
    Werkt de knop niet, dan kun je je e-mailadres ook bevestigen door deze link in je browser te openen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Na de bevestiging kun je je account zonder onderbreking blijven gebruiken.
</p>

<p>
    Heb je deze e-mail niet aangevraagd, dan kun je hem gerust negeren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Iemand probeerde zich te registreren met je e-mailadres",
    "Email.AlreadyRegistered.body": `
<p>Hallo,</p>

<p>
    Iemand probeerde zich bij <strong>{siteName}</strong> te registreren met dit
    e-mailadres, dat al een account heeft. Er is niets veranderd aan je account.<br />
    Was jij het, dan heb je al een account en kun je daarop inloggen:
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
        Inloggen
    </a>
</p>

<p>
    Ben je je wachtwoord vergeten, dan kun je het hier opnieuw instellen:
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
        Wachtwoord vergeten
    </a>
</p>

<p>
    Was jij het niet, dan hoef je niets te doen. Niemand heeft toegang gekregen tot
    je account.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bevestig het verplaatsen van je {siteName}-account naar dit adres",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hallo,</p>

<p>
    Iemand die was ingelogd op een <strong>{siteName}</strong>-account heeft gevraagd
    het naar dit e-mailadres te verplaatsen. Was jij het, bevestig het dan hier,
    ingelogd op dat account. De link werkt 24 uur.
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
        Mijn account verplaatsen
    </a>
</p>

<p>
    Of kopieer dit adres naar je browser:<br />
    {link}
</p>

<p>
    Was jij het niet, dan hoef je niets te doen. Er verhuist geen account naar dit
    adres.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Iemand vroeg een account naar je e-mailadres te verplaatsen",
    "Email.AlreadyHasAnAccount.body": `
<p>Hallo,</p>

<p>
    Iemand die was ingelogd op een <strong>{siteName}</strong>-account heeft gevraagd
    het naar dit e-mailadres te verplaatsen, dat al een eigen account heeft. Er is
    niets verplaatst en er is niets veranderd aan je account.
</p>

<p>
    Was jij het, dan heb je al een account op dit adres en kun je daarop inloggen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Je {siteName}-account is verplaatst",
    "Email.EmailAddressChanged.body": `
<p>Hallo,</p>

<p>
    Je <strong>{siteName}</strong>-account is zojuist verplaatst naar een ander
    e-mailadres, {emailAddress}, en logt vanaf nu met dat adres in.
</p>

<p>
    Was jij het niet, dan heeft iemand anders je account. Beantwoord deze e-mail en
    laat het ons weten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Je wachtwoord voor {siteName} is gewijzigd",
    "Email.PasswordChanged.body": `
<p>Hallo,</p>

<p>
    Het wachtwoord van je <strong>{siteName}</strong>-account is zojuist
    gewijzigd, en elke andere browser die was ingelogd is uitgelogd.<br />
    Was jij het, dan hoef je niets te doen.
</p>

<p>
    Was jij het niet, dan heeft iemand anders je wachtwoord. Stel hier een nieuw
    wachtwoord in, dan wordt die persoon uitgelogd:
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
        Wachtwoord vergeten
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Een nieuw wachtwoord instellen voor {siteName}",
    "Email.SetNewPassword.body": `
<p>Hallo,</p>

<p>
    Je hebt onlangs gevraagd je wachtwoord voor <strong>{siteName}</strong> opnieuw in te stellen.<br />
    Dat kun je doen door op de knop hieronder te klikken:
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
        Wachtwoord opnieuw instellen
    </a>
</p>

<p>
    Werkt de knop niet, dan kun je je wachtwoord ook opnieuw instellen door deze link in je browser te openen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Heb je niet gevraagd je wachtwoord opnieuw in te stellen, dan kun je deze e-mail gerust negeren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Een wachtwoord instellen voor {siteName}",
    "Email.SetPassword.body": `
<p>Hallo,</p>

<p>
    Je <strong>{siteName}</strong>-account heeft geen wachtwoord: je logt in met Google.<br />
    Je hebt gevraagd er een in te stellen, zodat je ook met je e-mailadres en een wachtwoord kunt inloggen.
    Dat kun je doen door op de knop hieronder te klikken:
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
        Wachtwoord instellen
    </a>
</p>

<p>
    Werkt de knop niet, dan kun je je wachtwoord ook instellen door deze link in je browser te openen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    De link werkt een uur. Heb je niet gevraagd een wachtwoord in te stellen, dan kun je deze e-mail gerust negeren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Er is geen {siteName}-account voor dit e-mailadres",
    "Email.RegisterInstead.body": `
<p>Hallo,</p>

<p>
    Er is gevraagd het wachtwoord opnieuw in te stellen voor een e-mailadres dat
    niet bij een account op <strong>{siteName}</strong> hoort.
</p>

<p>
    Wil je onze dienst gebruiken, dan kun je een nieuw account aanmaken via:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Heb je dit verzoek niet gedaan, dan kun je deze e-mail gerust negeren.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bevestig dat je {siteName}-account moet worden vergeten",
    "Email.ConfirmForgetting.body": `
<p>Hallo,</p>

<p>
    Je hebt gevraagd je <strong>{siteName}</strong>-account te laten vergeten.<br />
    Volg de knop hieronder om te zien wat dat betekent, en om zeker te zeggen
    dat je het wilt:
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
        Mijn account vergeten
    </a>
</p>

<p>
    Werkt de knop niet, dan kun je ook deze link in je browser openen:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Zodra je account is vergeten, kunnen je naam en e-mailadres door niemand meer
    worden gelezen, en kan er niet meer op je account worden ingelogd. Dit kan niet
    ongedaan worden gemaakt.
</p>

<p>
    De link werkt één keer, tot 15 minuten nadat je erom hebt gevraagd, en alleen
    zolang je bent ingelogd op dit account. Vraag er daarna opnieuw om vanuit je
    account.
</p>

<p>
    Heb je er niet om gevraagd, dan gebeurt er niets tenzij de link wordt gevolgd.
    Iemand die op je account was ingelogd heeft er wel om gevraagd, dus stel via
    de pagina voor vergeten wachtwoorden een nieuw wachtwoord in om zeker te weten
    dat die persoon niet opnieuw kan inloggen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registreren is opgeschort: {service} is niet bereikbaar",
    "Email.RegistrationsSuspended.body": `
<p>Hallo,</p>

<p>
    {siteName} kon {service} niet bereiken om {when}. Zolang die niet antwoordt,
    krijgen lezers die die nodig hebben, om zich te registreren of een nieuw
    wachtwoord in te stellen, te horen dat ze het later opnieuw moeten proberen.
</p>

<p>
    Er hoeft niets te worden opgeheven. Elke poging vraagt {service} opnieuw, en de
    pagina's werken weer zodra die antwoordt.
</p>

<p>
    Zolang {service} onbereikbaar blijft, ontvang je hierover hoogstens eenmaal per
    uur een e-mail.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} kan zijn database niet bereiken",
    "Email.DatabaseUnreachable.body": `
<p>Hallo,</p>

<p>
    {siteName} kon om {when} zijn database niet bereiken. Totdat die antwoordt, zegt elke pagina die hem nodig heeft tegen lezers dat de site niet beschikbaar is en dat ze het later opnieuw moeten proberen.
</p>

<p>
    Er hoeft niets opgeheven te worden. Elk verzoek vraagt opnieuw om een verbinding, en de site werkt weer zodra de database antwoordt.
</p>

<p>
    Zolang de database niet bereikbaar is, krijg je hierover hooguit eens per {minutes} minuten een e-mail.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
