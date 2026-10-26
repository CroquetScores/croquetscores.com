// The site's words in Dutch.
// - The reader is addressed as "je" (informal), as most Dutch sites do now.
// - Buttons, menu items and headings use sentence case ("Wachtwoord wijzigen"),
//   which is how Dutch writes them; only proper names and the sports keep capitals.
// - "email address" is "e-mailadres"; a "tournament" is a "toernooi", a
//   "competition" a "competitie", a "block" a "poule", a "game" a "partij", a
//   "match" a "wedstrijd", "hoops" are "poortjes", a "test" stays "test".
// - The site's administrator is the "beheerder"; a tournament's manager is the
//   "toernooileider", its scorer the "scorebijhouder".
// - "Remove" is "Verwijderen" and "Delete" is "Wissen", so the two stay apart.
// - "Bye" stays "Bye", since the site checks for that word.
import type { Language } from "../common/language.js";

export const dutch: Language = {
  tag: "nl",
  name: "Nederlands",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "Naar de inhoud",
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
      "Vind je {siteName} fijn? Doneer dan om de verdere ontwikkeling te steunen.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacy",
    "footer.termsOfUse": "Gebruiksvoorwaarden",
    "footer.reportBug": "Een fout melden",
    "beta.banner":
      "Dit is een bètasite. Gegevens kunnen op elk moment worden gewist.",
    "privacy.contact":
      "Vragen over deze pagina, of over wat er over jou wordt bewaard: {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write,
    // on the forms where writing begins. The link's words are found in the
    // box's and made the link, so they must be written exactly as they are
    // there.
    "termsOfUse.agree": "Ik ga akkoord met de gebruiksvoorwaarden",
    "termsOfUse.link": "gebruiksvoorwaarden",
    // Beneath the terms for those who write, as privacy.contact is beneath the
    // privacy statement.
    "termsOfUse.report":
      "Meld wat er is geschreven, of stel een vraag over deze voorwaarden: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Vink het vakje aan om akkoord te gaan met de gebruiksvoorwaarden.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Dit is een veilige plek om {siteName} te leren kennen. Alles wat je hier invoert, kan op elk moment worden verwijderd.",

    "language.label": "Taal",
    "language.choose": "Wijzigen",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Er is iets nieuws om te lezen.",
    "whatsNew.admin.message":
      "Er is iets nieuws voor wie toernooien organiseert.",
    "whatsNew.view": "Bekijk wat er nieuw is",
    "whatsNew.later": "Herinner me de volgende keer",
    "whatsNew.never": "Toon deze melding nooit meer",

    "form.otherwise":
      "Er klopt iets niet. Controleer wat je hebt ingevoerd en probeer het opnieuw.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
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
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google heeft niet bevestigd dat dit e-mailadres van jou is, dus het kan hier niet met Google worden gebruikt. Gebruik hieronder je e-mailadres.",
    "SignInWithGoogle.LinkedToAnother":
      "Dit e-mailadres heeft al een account, dat aan een ander Google-account is gekoppeld. Log in met dat Google-account, of met je e-mailadres en wachtwoord.",
    "SignInWithGoogle.NameMissing":
      "Google heeft ons je naam niet doorgegeven, en een account heeft er een nodig. Gebruik hieronder je e-mailadres.",
    "Google.Unreachable":
      "Google was zojuist niet bereikbaar. Probeer het over een paar minuten opnieuw, of gebruik hieronder je e-mailadres.",
    "Registration.NotAPerson":
      "Dit leek niet van een mens te komen. Probeer het opnieuw, en als het blijft gebeuren, wacht dan een paar minuten en kom terug.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Vul een e-mailadres in.",
    "EmailAddress.NoAt": "Een e-mailadres bevat een @.",
    "EmailAddress.MoreThanOneAt": "Een e-mailadres bevat één @.",
    "EmailAddress.NoDomain":
      "Een e-mailadres heeft na de @ een domein, zoals voorbeeld.nl.",

    "welcome.title": "Controleer je e-mail",
    "welcome.checkEmail":
      "Er is een e-mail onderweg naar het adres dat je hebt opgegeven. Volg de link erin om verder te gaan.",
    "welcome.nothingArrived":
      "Komt er na een paar minuten niets binnen, kijk dan in je map met ongewenste e-mail of spam.",
    "welcome.home": "Terug naar {siteName}",
    "newConfirmationLink.title": "Een nieuwe link opvragen",
    "newConfirmationLink.explanation":
      "De link om je e-mailadres te bevestigen is verlopen. Vraag een nieuwe aan en die wordt verstuurd naar het adres waarmee je je hebt geregistreerd.",
    "newConfirmationLink.send": "Stuur me een nieuwe link",
    "newConfirmationLink.home": "Terug naar {siteName}",
    "newConfirmationLink.signIn": "Inloggen",
    "newConfirmationLink.sent.title": "Controleer je e-mail",
    "newConfirmationLink.sent.explanation":
      "Er is een nieuwe link onderweg. Volg die om je e-mailadres te bevestigen. Komt er na een paar minuten niets binnen, kijk dan in je map met ongewenste e-mail of spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Dit e-mailadres is al bevestigd",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Er valt niets meer te bevestigen. Log in met het wachtwoord dat je hebt opgegeven toen je het bevestigde.",
    "newConfirmationLink.noLongerWorks.title": "Deze link werkt niet meer",
    "newConfirmationLink.noLongerWorks.explanation":
      "Controleer of je de hele link uit de e-mail hebt gevolgd, zonder dat er iets aan het einde ontbreekt. Werkt hij dan nog niet, registreer je dan opnieuw en er wordt een nieuwe link verstuurd.",
    "newConfirmationLink.tooMany.title": "Probeer het later opnieuw",
    "newConfirmationLink.tooMany.explanation":
      "Er zijn de laatste tijd meerdere links naar dit adres verstuurd. Wacht een uur en vraag opnieuw, en kijk intussen in je map met ongewenste e-mail of spam.",

    "forgotPassword.title": "Wachtwoord vergeten?",
    "forgotPassword.emailAddress": "E-mailadres",
    "forgotPassword.submit": "Stuur me een weg terug naar binnen",
    "forgotPassword.home": "Terug naar {siteName}",
    "forgotPassword.sent.title": "Controleer je e-mail",
    "forgotPassword.sent.explanation":
      "Als dat adres een account heeft, is er een link onderweg om een nieuw wachtwoord in te stellen. Volg die binnen een uur. Komt er na een paar minuten niets binnen, kijk dan in je map met ongewenste e-mail of spam.",
    "forgotPassword.tryAgainLater":
      "Er zijn de laatste tijd te veel aanvragen vanaf deze plek gedaan. Wacht een uur en probeer het opnieuw.",

    "setNewPassword.title": "Een nieuw wachtwoord instellen",
    "setNewPassword.password": "Wachtwoord",
    "setNewPassword.confirmPassword": "Wachtwoord bevestigen",
    "setNewPassword.submit": "Mijn nieuwe wachtwoord instellen",
    "setNewPassword.home": "Terug naar {siteName}",
    "setNewPassword.signIn": "Inloggen",
    "setNewPassword.askAgain": "Een nieuwe link aanvragen",
    "setNewPassword.changed.title": "Je wachtwoord is gewijzigd",
    "setNewPassword.changed.explanation":
      "Je bent overal uitgelogd waar je was ingelogd. Log in met je nieuwe wachtwoord.",
    "setNewPassword.expired.title": "Deze link is verlopen",
    "setNewPassword.expired.explanation":
      "Een link om een nieuw wachtwoord in te stellen werkt een uur. Vraag een andere aan, die wordt naar hetzelfde adres verstuurd.",
    "setNewPassword.noLongerWorks.title": "Deze link werkt niet meer",
    "setNewPassword.noLongerWorks.explanation":
      "Hij kan al gebruikt zijn, of er ontbreekt iets aan het einde. Vraag een andere aan als je er nog een nodig hebt.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Je wachtwoord kan zojuist niet worden gecontroleerd, dus het is niet gewijzigd. Probeer het over een paar minuten opnieuw; je link blijft werken tot hij verloopt.",

    "forgetAccount.title": "Je account vergeten",
    "forgetAccount.explanation":
      "Je naam en e-mailadres kunnen voorgoed onleesbaar worden gemaakt, en je account wordt gesloten. Om zeker te weten dat jij het bent, e-mailen we eerst een link naar het adres van je account, en er wordt niets vergeten voordat je die volgt.",
    "forgetAccount.submit": "Mail me de link",
    "forgetAccount.sent.title": "Controleer je e-mail",
    "forgetAccount.sent.explanation":
      "We hebben een link gemaild naar het adres van je account. Hij werkt 15 minuten, en alleen zolang je bent ingelogd op dit account.",
    "forgetAccount.confirm.title": "Je account voorgoed vergeten?",
    "forgetAccount.confirm.explanation":
      "Zodra het is vergeten, kunnen je naam en e-mailadres nooit meer door wie dan ook worden gelezen, en kan er niet meer op je account worden ingelogd. Het kan niet ongedaan worden gemaakt.",
    "forgetAccount.confirm.submit": "Mijn account vergeten",
    "forgetAccount.forgotten.title": "Je account is vergeten",
    "forgetAccount.forgotten.explanation":
      "Je naam en e-mailadres kunnen niet meer worden gelezen, en je bent overal uitgelogd waar je was ingelogd.",
    "forgetAccount.noLongerWorks.title": "Deze link werkt niet meer",
    "forgetAccount.noLongerWorks.explanation":
      "Hij kan verlopen zijn, al gebruikt zijn, of bij een account horen waarop je niet bent ingelogd. Vraag het opnieuw aan vanuit je account als je het nog vergeten wilt hebben.",
    "forgetAccount.lastAdministrator.title":
      "Je account kan niet worden vergeten",
    "forgetAccount.lastAdministrator.explanation":
      "Je bent de enige beheerder van deze site. Geef de rol van beheerder aan iemand anders, dan kan je account worden vergeten.",
    "forgetAccount.askAgain": "Opnieuw aanvragen",
    "forgetAccount.home": "Terug naar {siteName}",

    "registrationsSuspended.title": "Registreren is voorlopig opgeschort",
    "registrationsSuspended.explanation":
      "Een dienst die voor registreren nodig is, is zojuist niet bereikbaar, dus niemand kan zich registreren totdat die weer antwoordt. Niets van wat je hebt getypt is bewaard.",
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

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "Het e-mailadres of wachtwoord is onjuist. Probeer het opnieuw.",

    "profile.title": "Profiel",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "Naam:",
    "profile.emailAddress": "E-mailadres:",

    "changeName.title": "Naam wijzigen",
    "changeName.name": "Naam",
    "changeName.submit": "Naam wijzigen",

    "setPassword.title": "Een wachtwoord instellen",
    "setPassword.explanation":
      "Je account heeft geen wachtwoord: je logt in met Google. Om ook met een wachtwoord in te kunnen loggen, mailen we een link om er een in te stellen naar {emailAddress}.",
    "setPassword.submit": "Mail me een link",
    "setPassword.sent.title": "Controleer je e-mail",
    "setPassword.sent.explanation":
      "We hebben je een link gemaild om een wachtwoord in te stellen. Hij werkt een uur.",
    "setPassword.profile": "Terug naar je profiel",

    "changePassword.title": "Wachtwoord wijzigen",
    "changePassword.currentPassword": "Huidig wachtwoord",
    "changePassword.password": "Nieuw wachtwoord",
    "changePassword.passwordConfirmation": "Wachtwoord bevestigen",
    "changePassword.forgotPassword": "Wachtwoord vergeten?",
    "changePassword.submit": "Wachtwoord wijzigen",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Dat is niet je wachtwoord.",

    "changeEmailAddress.title": "E-mailadres wijzigen",
    "changeEmailAddress.emailAddress": "Nieuw e-mailadres",
    "changeEmailAddress.currentPassword": "Huidig wachtwoord",
    "changeEmailAddress.submit": "Stuur een link ter bevestiging",
    "changeEmailAddress.sent.title": "Controleer je e-mail",
    "changeEmailAddress.sent.explanation":
      "Er is een link om de verhuizing te bevestigen naar het nieuwe e-mailadres gestuurd. Volg die, ingelogd, om je account daarheen te verhuizen.",
    "changeEmailAddress.confirm.title": "Je account verhuizen",
    "changeEmailAddress.confirm.explanation":
      "Je account verhuist naar {emailAddress}. Je logt vanaf nu in met dat adres.",
    "changeEmailAddress.confirm.submit": "Mijn account verhuizen",
    "changeEmailAddress.noLongerWorks.title": "Deze link werkt niet meer",
    "changeEmailAddress.noLongerWorks.explanation":
      "Hij is verlopen, al gebruikt, of niet verstuurd voor het account waarop je bent ingelogd. Vraag het opnieuw aan vanuit je profiel.",
    "changeEmailAddress.taken.title": "Je account is niet verhuisd",
    "changeEmailAddress.profile": "Terug naar je profiel",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Dat is niet je wachtwoord.",
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
    "confirmEmailAddress.expired.title": "Deze link is verlopen",
    "confirmEmailAddress.expired.explanation":
      "Een link om een e-mailadres te bevestigen werkt 24 uur. Vraag een nieuwe aan, die wordt naar hetzelfde adres verstuurd.",
    "confirmEmailAddress.expired.newLink": "Stuur me een nieuwe link",
    "confirmEmailAddress.noLongerWorks.title": "Deze link werkt niet meer",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Controleer of je de hele link uit de e-mail hebt gevolgd, zonder dat er iets aan het einde ontbreekt. Werkt hij dan nog niet, registreer je dan opnieuw en er wordt een nieuwe link verstuurd.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Dit e-mailadres is al bevestigd",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Er valt niets meer te doen. Log in met het wachtwoord dat je hebt opgegeven toen je het bevestigde.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "Vul een naam in.",
    "PersonName.TooShort": "Een naam moet minstens 3 tekens bevatten.",
    "PersonName.TooLong": "Een naam mag uit hooguit 254 tekens bestaan.",
    "WorldRankingName.TooShort":
      "Een wereldranglijstnaam moet minstens 3 tekens bevatten.",
    "WorldRankingName.TooLong":
      "Een wereldranglijstnaam mag uit hooguit 254 tekens bestaan.",
    "Password.Missing": "Vul een wachtwoord in.",
    "Password.TooShort": "Een wachtwoord moet minstens 12 tekens bevatten.",
    "Password.ConfirmationDiffers":
      "Dit is niet hetzelfde als het wachtwoord hierboven. Typ het opnieuw.",
    "Password.Breached":
      "Dit wachtwoord komt voor in een datalek elders, dus het is hier niet veilig om te gebruiken. Kies een ander.",

    "javaScriptRequired.title": "Scripts zijn nodig",
    "javaScriptRequired.explanation":
      "Voor registreren moeten scripts voor deze site aanstaan, zodat kan worden gecontroleerd dat wie zich registreert een mens is. Zet ze aan en registreer je dan opnieuw.",
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
    "errors.recorded":
      "De fout is vastgelegd en er is een e-mail naar de beheerder gestuurd. Het helpt als je de beheerder mailt met de referentie en een beschrijving van wat je aan het doen was.",
    "errors.message": "Mail de beheerder",
    "errors.messageSubject": "Fout {reference} op {siteName}",
    "errors.messageBody": "Dit was ik aan het doen toen het gebeurde:\n\n",
    "errors.unavailable": "De site is niet beschikbaar",
    "errors.unavailableDetail":
      "De site kan zojuist niet bij wat hij nodig heeft. Probeer het later opnieuw.",
    "errors.maintenance": "De site is voor onderhoud uit de lucht.",
    "errors.maintenanceMinutes":
      "Hij is naar verwachting over {minutes} minuten terug.",
    "errors.maintenanceMinute": "Hij is naar verwachting over 1 minuut terug.",
    "errors.maintenanceLonger":
      "Het duurt langer dan verwacht en hij is binnenkort terug.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "Recente uitslagen",
    "home.recentResults.none":
      "De afgelopen zeven dagen zijn er geen partijen toegevoegd.",
    "home.upcomingTournaments": "Komende toernooien",
    "home.upcomingTournaments.none":
      "De komende zestig dagen begint er geen toernooi.",
    "home.allTournaments": "Alle toernooien in {year}",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "Toernooien in {year}",
    "year.none": "Er begint in {year} geen toernooi.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "{sport}-toernooien in {year}",
    "yearSport.none": "Er begint in {year} geen {sport}-toernooi.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "Recent",
    "tournament.summary": "Overzicht",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "Elke wedstrijd is een best-of-{count}.",
    "test.vs": "tegen",
    "test.matches": "Wedstrijden",
    "test.games": "Partijen",
    "test.hoops": "Poortjes",
    "teamSummary.tests": "Tests",
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
    "players.search.prompt":
      "Typ de naam van een speler om hem of haar te vinden.",
    "players.search.none": "Er zijn geen spelers gevonden.",
    "search.more":
      "Alleen de eerste {count} worden getoond. Typ meer van de naam om de zoekopdracht te verfijnen.",
    "websitePlayer.tournament": "Toernooi",
    // A test in a tournament's sections: its two teams' short names.
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
    // A tournament's players' page, when it has none.
    "players.none": "Er zijn nog geen spelers toegevoegd.",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "door",
    "commentaries.start": "Nieuw commentaar beginnen",
    // The page that starts a commentary.
    "startCommentary.title": "Nieuw commentaar beginnen",
    "startCommentary.titleField": "Titel",
    "startCommentary.submit": "Commentaar beginnen",
    // "New" is said to a screen reader in place of the red asterisk that marks
    // a note or a commentary not read as it is now.
    "marks.new": "nieuw",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "De toernooileiders hebben nog geen notities geschreven.",
    "note.edited": "bewerkt",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "Er zijn nog geen reacties geschreven.",
    "commentary.edited": "bewerkt",
    "commentary.edit": "Bewerken",
    "commentary.delete": "Wissen",
    "commentary.comment": "Reactie",
    "commentary.add": "Reactie toevoegen",
    "commentary.notSent":
      "De reactie kon niet worden verstuurd. Laad de pagina opnieuw om te zien of hij is bewaard.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Titel wijzigen",
    "changeCommentaryTitle.submit": "Opslaan",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "Reactie bewerken",
    "editComment.save": "Opslaan",
    "deleteComment.title": "Reactie wissen",
    "deleteComment.question":
      "Deze reactie wissen? Dit kan niet ongedaan worden gemaakt.",
    "deleteComment.confirm": "Reactie wissen",
    "deleteComment.keep": "Bewaren",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "Partijen",
    "player.competitions": "Competities",
    "player.beat": "versloeg",
    "player.lostTo": "verloor van",
    "player.drewWith": "speelde gelijk met",
    "player.score": "{score} tegen {opponent}",
    "player.noGames": "Er zijn nog geen partijen gespeeld.",
    "player.noCompetitions": "Nog niet ingeschreven voor een competitie.",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "Gewonnen",
    "block.matches": "Wedstrijden",
    "block.netGames": "Saldo partijen",
    "block.games": "Partijen",
    "block.netHoops": "Saldo poortjes",
    "block.won": "gewonnen",
    "block.lost": "verloren",
    "block.drawn": "gelijk",
    "block.withdrawn": "teruggetrokken",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "teruggetrokken",
    "block.losses": "Verloren",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Weergaven",
    "competition.view.grid": "Schema",
    "competition.view.summary": "Overzicht",
    "competition.view.orderOfPlay": "Speelvolgorde",
    "competition.print": "Afdrukken",
    "blockSummary.ranking":
      "Gerangschikt naar het aandeel gewonnen wedstrijden, daarna naar het saldo poortjes. Het eigen reglement van een toernooi kan de spelers anders plaatsen.",
    "orderOfPlay.none": "Er zijn nog geen partijen gespeeld.",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Halve finales",
    "knockout.round.quarters": "Kwartfinales",
    "knockout.round.number": "Ronde {number}",
    "knockout.bye": "Bye",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "Partijen",
    "swiss.wins": "Gewonnen",
    "swiss.winShare": "Winst %",
    "swiss.results": "Uitslagen",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "Latere rondes",
    "knockout.back": "Eerdere rondes",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Naam",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "Alleen toernooien in {country}",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Elk land",
    "tournamentList.filter.region": "Regio",
    "tournamentList.filter.anyRegion": "Elke regio",
    "tournamentList.filter.noRegionsBefore":
      "Toernooien van vóór november 2026 hebben geen regio.",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Elke sport",
    "tournamentList.filter.submit": "Filteren",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "Jaren",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Eerdere jaren",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.newerBuild.message":
      "Er is een nieuwere versie van deze site beschikbaar.",
    "admin.newerBuild.reload": "Opnieuw laden",
    "admin.title": "Beheer",
    "admin.tournaments.new": "Nieuw toernooi",
    "admin.tournaments.none": "Geen toernooien",
    "admin.tournaments.filter.none": "Geen toernooien gevonden",
    "admin.tournaments.show": "Tonen",
    "admin.tournaments.managerScorer": "Leider/Scorebijhouder",
    "admin.tournaments.worldRanking": "Wereldranglijst",
    "admin.tournaments.notWorldRanking": "Niet wereldranglijst",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Gearchiveerd",
    "admin.tournaments.manage": "Beheren",
    "admin.tournaments.edit": "Bewerken",
    "admin.tournaments.archive": "Archiveren",
    "admin.tournaments.restore": "Herstellen",
    "admin.tournaments.scores": "Scores",
    "admin.tournaments.players": "Spelers",
    "admin.years.label": "Jaren",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Eerdere jaren",
    "admin.tournament.name": "Naam",
    "admin.tournament.starts": "Begint",
    "admin.tournament.finishes": "Eindigt",
    "admin.tournament.format": "Opzet",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Regio",
    "admin.tournament.subtitle": "Ondertitel",
    "admin.rules.handicap": "Gespeeld met handicaps",
    "admin.rules.drawsAllowed": "Gelijkspel toegestaan",
    "admin.tournament.levelTestsDrawn": "Gelijke tests zijn gelijkspel",
    "admin.rules.worldRankings": "Telt mee voor de wereldranglijsten",
    "admin.tournament.national": "Evenement op nationaal niveau",
    "admin.tournament.international": "Evenement op internationaal niveau",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Dit kan zo niet worden geaccepteerd.",
    "admin.newTournament.title": "Nieuw toernooi",
    "admin.newTournament.submit": "Toernooi aanmaken",
    "admin.editTournament.title": "Toernooi bewerken",
    "admin.editTournament.submit": "Toernooi bijwerken",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "Dit toernooi kan niet worden gewijzigd.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Toernooi",
    "admin.view.players": "Spelers",
    "admin.view.competitions": "Competities",
    "admin.view.managers": "Toernooileiders",
    "admin.view.notes": "Notities",
    "admin.view.scorers": "Scorebijhouders",
    "admin.view.rankings": "Ranglijsten",
    "admin.rankings.file":
      "De wereldranglijsten gebruiken de resultaten van het toernooi via deze functie, en toernooileiders hoeven niets te doen.",
    "admin.rankings.download": "Partijen downloaden voor de wereldranglijst",
    "rankings.notAvailable": "Ranglijsten zijn niet beschikbaar",
    "rankings.notAvailable.sport":
      "De sport van dit toernooi heeft geen wereldranglijsten, dus er zijn geen ranglijsten om te versturen.",
    "rankings.notAvailable.notCounted":
      "Geen van de competities van dit toernooi telt mee voor de wereldranglijsten.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "Dit toernooi kan van hieruit niet worden beheerd.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Competitie",
    "admin.competitionView.players": "Spelers",
    "admin.competitionView.scores": "Scores",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "Het toernooi en zijn competities",
    "admin.sections.tournament": "Toernooi",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "De pagina's van de beheerder",
    "admin.administrator.sections.tournaments": "Toernooien",
    "admin.administrator.sections.accounts": "Accounts",
    "admin.administrator.sections.worldRankings": "Wereldranglijsten",
    "admin.administrator.sections.importErrors": "Importfouten",
    "admin.administrator.sections.logs": "Logboek",
    "admin.administrator.sections.databaseStatus": "Databasetoegang",
    "admin.administrator.sections.countries": "Landen",
    "admin.databaseStatus.title": "Databasetoegang",
    "admin.databaseStatus.on": "Databasetoegang staat aan.",
    "admin.databaseStatus.off": "Databasetoegang staat uit.",
    "admin.databaseStatus.expected":
      "De site is naar verwachting over {minutes} minuten terug.",
    "admin.databaseStatus.expectedOne":
      "De site is naar verwachting over 1 minuut terug.",
    "admin.databaseStatus.longer": "Het duurt langer dan verwacht.",
    "admin.databaseStatus.told": "Lezers krijgen te lezen: {words}",
    "admin.databaseStatus.toldUsual":
      "Lezers krijgen de gebruikelijke zin te lezen.",
    "admin.databaseStatus.minutes": "Verwachte minuten",
    "admin.databaseStatus.words": "Tekst voor lezers",
    "admin.databaseStatus.turnOff": "Uitzetten",
    "admin.databaseStatus.change": "Wijzigen",
    "admin.databaseStatus.turnOn": "Aanzetten",
    "admin.databaseStatus.minutesNeeded": "De minuten zijn verplicht.",
    "admin.databaseStatus.otherwise": "Er is iets misgegaan op de site.",
    "DatabaseAccess.MinutesNotWhole":
      "De minuten moeten een geheel getal zijn.",
    "DatabaseAccess.MinutesOutOfRange":
      "De minuten moeten van 1 tot 1440 zijn.",
    "DatabaseAccess.WordsTooLong":
      "De tekst mag uit hooguit 500 tekens bestaan.",
    "DatabaseAccess.NotOff": "Databasetoegang staat niet uit.",
    "admin.administrator.title": "Beheerder",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Accounts",
    "admin.roles.add": "Toevoegen",
    "admin.roles.administrator.heading": "Beheerders",
    "admin.roles.administrator.none": "Geen andere beheerders",
    "admin.roles.administrator.removeTitle": "Beheerder verwijderen",
    "admin.roles.administrator.removeExplanation":
      "{name} is niet langer beheerder van deze site.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Wereldranglijstbeheerders associatiecroquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Geen wereldranglijstbeheerders associatiecroquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Wereldranglijstbeheerder associatiecroquet verwijderen",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} is niet langer wereldranglijstbeheerder associatiecroquet.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Wereldranglijstbeheerders golfcroquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Geen wereldranglijstbeheerders golfcroquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Wereldranglijstbeheerder golfcroquet verwijderen",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} is niet langer wereldranglijstbeheerder golfcroquet.",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list. Not about the address, since it may be the session that
    // ended or the site that failed.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon,
    // so that one player and many are said the same way.
    "admin.worldRankings.title": "Wereldranglijstspelers importeren",
    "admin.worldRankings.import": "Importeren",
    "admin.worldRankings.log": "Hoe de import verliep",
    "admin.worldRankings.ac.reading":
      "De lijst associatiecroquet wordt gelezen",
    "admin.worldRankings.ac.read":
      "Spelers associatiecroquet gelezen: {players}",
    "admin.worldRankings.ac.kept":
      "Spelers associatiecroquet bewaard: {players}",
    "admin.worldRankings.ac.refused":
      "De lijst associatiecroquet kon niet worden gelezen, dus de spelers zijn gelaten zoals ze waren.",
    "admin.worldRankings.gc.reading": "De lijst golfcroquet wordt gelezen",
    "admin.worldRankings.gc.read": "Spelers golfcroquet gelezen: {players}",
    "admin.worldRankings.gc.kept": "Spelers golfcroquet bewaard: {players}",
    "admin.worldRankings.gc.refused":
      "De lijst golfcroquet kon niet worden gelezen, dus de spelers zijn gelaten zoals ze waren.",
    "admin.worldRankings.finished": "Klaar",
    "admin.worldRankings.failed": "De import is niet voltooid.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "Er is iets misgegaan op de site.",
    "WorldRankingLists.Unreachable":
      "De site van de wereldranglijsten was niet bereikbaar.",
    "WorldRankingLists.Unreadable":
      "De lijst is niet opgemaakt zoals de wereldranglijsten die opmaken: een regel erin kon niet worden gelezen, er staat niemand op, of hij is niet in UTF-8 geschreven.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "Importfouten",
    "admin.importErrors.none": "Geen importfouten",
    "admin.importErrors.otherwise": "Er is iets misgegaan op de site.",
    "admin.countries.title": "Landen",
    "admin.countries.none":
      "Geen toernooi wordt gespeeld in een land dat de lijsten niet noemen",
    "admin.countries.oldSite": "Oude site",
    "admin.countries.otherwise": "Er is iets misgegaan op de site.",
    "admin.logs.title": "Logboek",
    "admin.logs.severity": "Ernst",
    "admin.logs.text": "Opzoeken",
    "admin.logs.show": "Tonen",
    "admin.logs.prune": "Opschonen",
    "admin.logs.pruneAsk":
      "Het logboek van vóór het laatste uur verwijderen? Niets brengt het terug.",
    "admin.logs.removed": "{count} items zijn verwijderd",
    "admin.logs.none": "Geen logitems",
    "admin.logs.otherwise": "Er is iets misgegaan op de site.",
    "admin.hover.logs.show": "Toon de items die overeenkomen",
    "admin.hover.logs.prune": "Verwijder het logboek van vóór het laatste uur",
    "admin.hover.logs.pruneAgree":
      "Verwijder het logboek van vóór het laatste uur",
    "admin.importError.title": "Importfout",
    "admin.importError.documentId": "Document-id",
    "admin.importError.tournament": "Toernooi",
    "admin.importError.competition": "Competitie",
    "admin.importError.newSite": "Nieuwe site",
    "admin.importError.oldSite": "Oude site",
    "ImportErrorKept.NotFound":
      "De import heeft geen fout bij dat document bewaard.",
    "admin.competitionView.otherwise":
      "Deze competitie kan van hieruit niet worden beheerd.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
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
    // The competition dialog.
    "admin.competition.addTitle": "Competitie toevoegen",
    "admin.competition.editTitle": "Competitie bewerken",
    "admin.competition.name": "Naam",
    "admin.competition.kind": "Soort",
    "admin.competition.bestOf": "Best of",
    "admin.competition.rounds": "Rondes",
    "admin.competition.places": "Plaatsen",
    "admin.competition.round": "Ronde {number}",
    "admin.competition.bestOfs": "Best-ofs",
    "admin.competition.quarters": "Kwartfinales",
    "admin.competition.semis": "Halve finales",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Toevoegen",
    "admin.competition.save": "Opslaan",
    "admin.competition.added": "{name} is toegevoegd.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise":
      "Deze competitie kan zo niet worden bewaard.",
    "CompetitionName.Missing": "Vul een naam in.",
    "CompetitionName.TooLong": "Een naam mag uit hooguit 254 tekens bestaan.",
    "CompetitionName.NoLetterOrDigit":
      "Een naam moet een letter of cijfer bevatten.",
    "Tournament.KnockoutPlayerHasGames":
      "Spelers in deze loting hebben partijen, dus de plaatsen kunnen niet veranderen.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Een ronde met een beslechte wedstrijd kan geen kortere best-of krijgen.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Een ronde kan niet meer worden gewijzigd als er in een latere ronde een partij is gespeeld.",
    "Tournament.CompetitionNameTaken":
      "Een andere competitie in dit toernooi heeft die naam al.",
    "BestOf.NotWhole": "Vul een geheel aantal partijen in.",
    "BestOf.TooSmall":
      "Een wedstrijd moet een best-of van minstens 1 partij zijn.",
    "Rounds.NotWhole": "Vul een geheel aantal rondes in.",
    "Rounds.TooSmall": "Een poule moet in minstens 1 ronde worden gespeeld.",
    "KnockoutDraw.EvenBestOf":
      "Een wedstrijd in een knock-out moet een winnaar hebben, dus het is een best-of van een oneven aantal partijen.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Maak een nieuw toernooi aan",
    "admin.hover.tournaments.manage":
      "Beheer de spelers, teams, competities en scores van dit toernooi",
    "admin.hover.tournaments.edit": "Wijzig de gegevens van dit toernooi",
    "admin.hover.tournaments.scores": "Voer de scores van dit toernooi in",
    "admin.hover.tournaments.players": "Beheer de spelers van dit toernooi",
    "admin.hover.competitions.view":
      "Open deze competitie om de spelers en scores te zien en in te voeren",
    "admin.hover.tests.view":
      "Open deze test om de scores te zien en in te voeren",
    "admin.hover.teams.view":
      "Open dit team om de spelers te zien en te beheren",
    "admin.hover.dialog.player.add": "Voeg deze speler toe aan het toernooi",
    "admin.hover.dialog.player.save": "Bewaar de wijzigingen aan deze speler",
    "admin.hover.dialog.team.add": "Voeg dit team toe aan het toernooi",
    "admin.hover.dialog.team.save": "Bewaar de wijzigingen aan dit team",
    "admin.hover.dialog.test.add": "Voeg deze test toe aan het toernooi",
    "admin.hover.dialog.test.save": "Bewaar de wijzigingen aan deze test",
    "admin.hover.dialog.competition.add":
      "Voeg deze competitie toe aan het toernooi",
    "admin.hover.dialog.competition.save":
      "Bewaar de wijzigingen aan deze competitie",
    "admin.hover.dialog.score.add": "Voeg deze score toe aan de competitie",
    "admin.hover.dialog.score.save": "Bewaar de correctie van deze score",
    "admin.hover.dialog.carryForward.save":
      "Neem de resultaten van deze speler mee",
    "admin.hover.dialog.tournament.new": "Maak dit toernooi aan",
    "admin.hover.dialog.tournament.edit":
      "Bewaar de wijzigingen aan dit toernooi",
    "admin.hover.modal.cancel": "Sluit dit zonder iets te bewaren",
    "admin.hover.modal.ok": "Sluit dit bericht",
    "admin.hover.tab": "Toon het tabblad {name}",
    "admin.hover.tournaments.archive":
      "Archiveer dit toernooi; het kan worden hersteld",
    "admin.hover.tournaments.restore": "Haal dit gearchiveerde toernooi terug",
    "admin.hover.players.add": "Voeg een speler toe aan dit toernooi",
    "admin.hover.players.edit": "Wijzig de gegevens van deze speler",
    "admin.hover.players.up": "Verplaats deze speler omhoog in de lijst",
    "admin.hover.players.down": "Verplaats deze speler omlaag in de lijst",
    "admin.hover.players.archive":
      "Archiveer deze speler; hij of zij kan worden hersteld",
    "admin.hover.players.restore": "Haal deze gearchiveerde speler terug",
    "admin.hover.teams.add": "Voeg een team toe aan dit toernooi",
    "admin.hover.teams.edit": "Wijzig de gegevens van dit team",
    "admin.hover.teams.up": "Verplaats dit team omhoog in de lijst",
    "admin.hover.teams.down": "Verplaats dit team omlaag in de lijst",
    "admin.hover.teams.archive": "Archiveer dit team; het kan worden hersteld",
    "admin.hover.teams.restore": "Haal dit gearchiveerde team terug",
    "admin.hover.competitions.add": "Voeg een competitie toe aan dit toernooi",
    "admin.hover.competitions.edit": "Wijzig de gegevens van deze competitie",
    "admin.hover.competitions.up":
      "Verplaats deze competitie omhoog in de lijst",
    "admin.hover.competitions.down":
      "Verplaats deze competitie omlaag in de lijst",
    "admin.hover.competitions.archive":
      "Archiveer deze competitie; ze kan worden hersteld",
    "admin.hover.competitions.restore":
      "Haal deze gearchiveerde competitie terug",
    "admin.hover.tests.add": "Voeg een test tussen twee teams toe",
    "admin.hover.tests.edit": "Wijzig de gegevens van deze test",
    "admin.hover.tests.up": "Verplaats deze test omhoog in de lijst",
    "admin.hover.tests.down": "Verplaats deze test omlaag in de lijst",
    "admin.hover.tests.archive": "Archiveer deze test; hij kan worden hersteld",
    "admin.hover.tests.restore": "Haal deze gearchiveerde test terug",
    "admin.hover.tests.toTeams":
      "Ga naar het tabblad Teams om de teams toe te voegen die een test nodig heeft",
    "admin.hover.scores.add":
      "Voeg de score van een partij toe aan deze competitie",
    "admin.hover.scores.edit": "Corrigeer deze score",
    "admin.hover.scores.archive":
      "Archiveer deze score zodat hij niet meer meetelt; hij kan worden hersteld",
    "admin.hover.scores.restore":
      "Haal deze gearchiveerde score terug, zodat hij weer meetelt",
    "admin.hover.scores.withdraw":
      "Houd deze score in de lijst maar laat hem niet meer meetellen",
    "admin.hover.scores.unwithdraw":
      "Laat deze teruggetrokken score weer meetellen",
    "admin.hover.scores.up": "Verplaats deze score eerder in de lijst",
    "admin.hover.scores.down": "Verplaats deze score later in de lijst",
    "admin.hover.competitionPlayers.add":
      "Zet de gekozen speler in deze competitie",
    "admin.hover.competitionPlayers.up":
      "Verplaats deze speler omhoog in de lijst",
    "admin.hover.competitionPlayers.down":
      "Verplaats deze speler omlaag in de lijst",
    "admin.hover.competitionPlayers.remove":
      "Haal deze speler uit de competitie",
    "admin.hover.competitionPlayers.withdraw":
      "Trek deze speler terug uit de competitie",
    "admin.hover.competitionPlayers.unwithdraw":
      "Zet deze teruggetrokken speler weer in de competitie",
    "admin.hover.competitionPlayers.carryForward":
      "Neem de resultaten van deze speler mee uit een andere competitie",
    "admin.hover.notes.add": "Schrijf een nieuwe notitie voor dit toernooi",
    "admin.hover.notes.edit": "Wijzig deze notitie",
    "admin.hover.notes.delete": "Wis deze notitie",
    "admin.hover.note.add":
      "Bewaar deze notitie en voeg haar toe aan het toernooi",
    "admin.hover.note.save": "Bewaar de wijzigingen aan deze notitie",
    "admin.hover.people.add": "Geef deze persoon de rol",
    "admin.hover.people.remove": "Neem de rol van deze persoon af",
    "admin.hover.worldRankings.import":
      "Haal de wereldranglijsten op en voeg hun spelers toe",
    "admin.modal.cancel": "Annuleren",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "OK",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "E-mailadres",
    "admin.people.remove": "Verwijderen",
    "admin.people.otherwise": "Dat kon niet worden gedaan.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Jij",
    "admin.managers.add": "Toernooileider toevoegen",
    "admin.managers.email": "Toernooileiders mailen",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "Geen toernooileiders",
    "admin.managers.removeTitle": "Toernooileider verwijderen",
    "admin.managers.removeExplanation":
      "{name} kan dit toernooi niet langer beheren.",
    "admin.managers.removeYourself.explanation":
      "Je kunt dit toernooi niet langer beheren, en niemand hier kan dat voor je terugdraaien. Een andere toernooileider kan je weer toernooileider maken.",
    "admin.managers.otherwise": "Dat adres kan geen toernooileider worden.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Speler toevoegen",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise":
      "Deze speler kan niet worden toegevoegd.",
    "admin.competitionPlayers.choose": "Toe te voegen speler",
    "admin.competitionPlayers.nobody": "Kies een speler",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Elke speler zit in de competitie",
    "admin.competitionPlayers.none": "Geen spelers",
    "admin.competitionPlayers.up": "Omhoog",
    "admin.competitionPlayers.down": "Omlaag",
    "admin.competitionPlayers.remove": "Verwijderen",
    "admin.competitionPlayers.withdraw": "Terugtrekken",
    "admin.competitionPlayers.unwithdraw": "Hervatten",
    "admin.competitionPlayers.withdrawn": "Teruggetrokken spelers",
    "admin.competitionPlayers.removeTitle": "Speler verwijderen",
    "admin.competitionPlayers.removeQuestion":
      "{name} wordt uit de competitie gehaald. Dit kan niet ongedaan worden gemaakt.",
    "admin.competitionPlayers.withdrawTitle": "Speler terugtrekken",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} speelt de rest van de competitie niet meer, en de partijen die nog niet zijn gespeeld worden zonder die speler beslist.",
    "admin.competitionPlayers.carryForward": "Meenemen",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "Meenemen - {name}",
    "admin.carryForward.save": "Opslaan",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise":
      "Dit meegenomen resultaat kan niet worden bewaard.",
    "admin.carryForward.matchWins": "Gewonnen wedstrijden",
    "admin.carryForward.matchLosses": "Verloren wedstrijden",
    "admin.carryForward.gameWins": "Gewonnen partijen",
    "admin.carryForward.gameLosses": "Verloren partijen",
    "admin.carryForward.hoopsFor": "Poortjes voor",
    "admin.carryForward.hoopsAgainst": "Poortjes tegen",
    "CarryForward.MatchWinsNotWhole":
      "Vul een geheel aantal gewonnen wedstrijden in.",
    "CarryForward.MatchWinsBelowZero": "Vul 0 of meer gewonnen wedstrijden in.",
    "CarryForward.MatchLossesNotWhole":
      "Vul een geheel aantal verloren wedstrijden in.",
    "CarryForward.MatchLossesBelowZero":
      "Vul 0 of meer verloren wedstrijden in.",
    "CarryForward.GameWinsNotWhole":
      "Vul een geheel aantal gewonnen partijen in.",
    "CarryForward.GameWinsBelowZero": "Vul 0 of meer gewonnen partijen in.",
    "CarryForward.GameLossesNotWhole":
      "Vul een geheel aantal verloren partijen in.",
    "CarryForward.GameLossesBelowZero": "Vul 0 of meer verloren partijen in.",
    "CarryForward.HoopsForNotWhole": "Vul een geheel aantal poortjes voor in.",
    "CarryForward.HoopsForBelowZero": "Vul 0 of meer poortjes voor in.",
    "CarryForward.HoopsAgainstNotWhole":
      "Vul een geheel aantal poortjes tegen in.",
    "CarryForward.HoopsAgainstBelowZero": "Vul 0 of meer poortjes tegen in.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Score toevoegen",
    "admin.scores.none": "Geen scores",
    "admin.scores.edit": "Bewerken",
    "admin.scores.drawNotFilledTitle": "Loting niet compleet",
    "admin.scores.archive": "Archiveren",
    "admin.scores.up": "Omhoog",
    "admin.scores.down": "Omlaag",
    "admin.scores.restore": "Herstellen",
    "admin.scores.archived": "Gearchiveerde scores",
    "admin.scores.archivedSaid": "Gearchiveerd",
    "admin.scores.withdraw": "Terugtrekken",
    "admin.scores.unwithdraw": "Hervatten",
    "admin.scores.withdrawnSaid": "Teruggetrokken",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "Dat kon niet worden gedaan.",
    "admin.score.title": "Score toevoegen",
    "admin.score.add": "Partij toevoegen",
    "admin.score.winner": "Winnaar",
    "admin.score.winnerScore": "Score van de winnaar",
    "admin.score.loser": "Verliezer",
    "admin.score.loserScore": "Score van de verliezer",
    "admin.score.beat": "versloeg",
    "admin.score.added":
      "De partij die {winner} won van {loser} is toegevoegd.",
    "admin.score.otherwise": "De partij kon niet worden toegevoegd.",
    "admin.score.correctTitle": "Score bewerken",
    "admin.score.save": "Opslaan",
    "admin.score.notCorrected": "De score kon niet worden gecorrigeerd.",
    "Game.WinnerMissing": "Kies de winnaar.",
    "Game.WinnerScoreMissing": "Typ de score van de winnaar.",
    "Game.LoserMissing": "Kies de verliezer.",
    "Game.LoserScoreMissing": "Typ de score van de verliezer.",
    "Score.NoPoints": "Een score begint met het aantal punten.",
    "Game.SamePlayer": "Niemand speelt tegen zichzelf.",
    "Game.WinnerNotAhead":
      "De score van de winnaar moet hoger zijn dan die van de verliezer, of als gewonnen zijn gemarkeerd.",
    "Game.LoserMarked":
      "De score van de verliezer kan niet als gewonnen worden gemarkeerd.",
    "Game.ResultChanged":
      "Een correctie behoudt de uitslag: een gewonnen partij blijft gewonnen, en een gelijke partij blijft gelijk.",
    "Competition.MatchDecided": "Hun wedstrijd is al beslist.",
    "Competition.DrawFull":
      "De speler kan niet worden toegevoegd omdat de knock-out vol is.",
    "Competition.DrawNotFilled":
      "Er kunnen geen scores worden toegevoegd zolang niet elke plaats in de knock-out is gevuld met een speler of een bye.",
    "Competition.ByeOutsideKnockout":
      "Alleen een knock-out kan een bye hebben.",
    "Competition.NotDrawnToMeet":
      "Deze spelers zijn in de knock-out momenteel niet geloot om tegen elkaar te spelen.",
    "Competition.WinnerHasPlayedOn":
      "De winnaar van deze wedstrijd heeft zijn of haar volgende partij al gespeeld, dus wie won kan niet meer veranderen.",
    "CompetitionPlayer.Withdrawn":
      "Een teruggetrokken speler speelt niet meer.",
    "admin.players.add": "Speler toevoegen",
    "admin.players.none": "Geen spelers",
    "admin.players.edit": "Bewerken",
    "admin.players.archive": "Archiveren",
    "admin.players.restore": "Herstellen",
    "admin.players.up": "Omhoog",
    "admin.players.down": "Omlaag",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "Speler archiveren",
    "admin.players.archiveQuestion":
      "{name} wordt uit deze competities verwijderd:",
    "admin.players.archive.explanation":
      "Herstellen zet de speler niet terug in deze competities.",
    "admin.players.archived": "Gearchiveerde spelers",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Gearchiveerd",
    // The player dialog.
    "admin.player.addTitle": "Speler toevoegen",
    "admin.player.editTitle": "Speler bewerken",
    "admin.player.name": "Naam",
    "admin.player.representing": "Vertegenwoordigt",
    "admin.player.worldRankingName": "Naam van de speler op de wereldranglijst",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown": "De wereldranglijsten kennen deze naam.",
    "admin.player.worldRankingQuestioned":
      "De wereldranglijsten hebben geen speler met deze naam. Hij kan verkeerd gespeld zijn, of de speler is nieuw op de ranglijsten.",
    "admin.player.flag": "Vlag",
    "admin.player.add": "Toevoegen",
    "admin.player.save": "Opslaan",
    "admin.player.added": "{name} is toegevoegd.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "Deze speler kan zo niet worden bewaard.",
    "Tournament.PlayerNameTaken":
      "Een andere speler in dit toernooi heeft die naam al.",
    "TournamentPlayer.NoSuchFlag": "Kies een van de bestaande vlaggen.",
    "TournamentPlayer.NamedBye": "Een speler kan niet Bye heten.",
    "TournamentPlayer.NoLetterOrDigit":
      "Een naam moet een letter of cijfer bevatten.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Byes hoeven niet te worden toegevoegd",
    "admin.player.byes":
      "Een bye is geen speler van het toernooi. Een knock-out biedt Bye aan wanneer de spelers worden toegevoegd, zo vaak als de loting nodig heeft.",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "Teams",
    "admin.view.tests": "Tests",
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
      "Waaronder de tests van het team bekend staan, zoals AUS v ENG.",
    "admin.team.flag": "Vlag",
    "admin.team.add": "Toevoegen",
    "admin.team.save": "Opslaan",
    "admin.team.added": "{name} is toegevoegd.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise": "Dit team kan zo niet worden bewaard.",
    "admin.teamView.otherwise": "Dit team kan van hieruit niet worden bekeken.",
    "admin.teamView.players": "Spelers",
    "TeamName.Missing": "Zeg hoe het team heet.",
    "TeamName.TooLong": "Die naam is te lang.",
    "admin.notes.add": "Notitie toevoegen",
    "admin.notes.none": "Geen notities",
    "admin.notes.edit": "Bewerken",
    "admin.notes.delete": "Wissen",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "Notitie wissen",
    "admin.notes.deleteQuestion": "De notitie „{title}” wissen?",
    "admin.notes.delete.explanation":
      "Een gewiste notitie is voorgoed weg en kan niet worden teruggehaald.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "Dat kon niet worden gedaan.",
    // The note dialog, its description's tabs and the toolbar above its box.
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
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise": "Deze notitie kan zo niet worden bewaard.",
    "ManagerNoteTitle.Missing": "Geef de notitie een titel.",
    "ManagerNoteTitle.TooLong": "Die titel is te lang.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Een titel moet een letter of cijfer bevatten.",
    "ManagerNoteDescription.TooLong": "Die beschrijving is te lang.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Die notitie is er niet meer. Een andere toernooileider heeft haar misschien gewist.",
    "EditManagerNote.NoSuchManagerNote":
      "Die notitie is er niet meer. Een andere toernooileider heeft haar misschien gewist.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Die notitie is er niet meer. Een andere toernooileider heeft haar misschien gewist.",
    "ManagerNote.Deleted":
      "Die notitie is gewist. Een andere toernooileider heeft haar misschien gewist.",
    "CommentaryTitle.Missing": "Geef het commentaar een titel.",
    "CommentaryTitle.TooLong": "Die titel is te lang.",
    "CommentaryTitle.NoLetterOrDigit":
      "Een titel moet een letter of cijfer bevatten.",
    "Commentary.TitleTaken": "Een ander commentaar heeft die titel al.",
    "CommentText.Missing": "Schrijf iets in de reactie.",
    "CommentText.TooLong": "Die reactie is te lang.",
    "TeamShortName.Missing": "Geef het team een korte naam.",
    "TeamShortName.TooLong":
      "Een korte naam mag uit hooguit 10 tekens bestaan.",
    "TeamShortName.NoLetterOrDigit":
      "Een korte naam moet een letter of cijfer bevatten.",
    "Team.ShortNameLongerThanName":
      "Een korte naam mag niet langer zijn dan de naam van het team.",
    "Team.NoSuchFlag": "Kies een van de bestaande vlaggen.",
    "Team.Archived": "Dat team is gearchiveerd en wordt eerst hersteld.",
    "Team.InATest":
      "Dat team speelt in een test en kan niet worden gearchiveerd.",
    "Team.PlayerNameTaken": "Een andere speler in dit team heeft die naam al.",
    "TeamPlayer.NamedBye": "Een speler kan niet Bye heten.",
    "TeamPlayer.Archived":
      "Die speler is gearchiveerd en wordt eerst hersteld.",
    "TeamPlayer.HasGames":
      "Die speler heeft gespeeld en kan niet worden gearchiveerd.",
    "Tournament.TeamNameTaken":
      "Een ander team in dit toernooi heeft die naam al.",
    "Tournament.TeamShortNameTaken":
      "Een ander team in dit toernooi heeft die korte naam al.",
    "Tournament.NoSuchTeam": "Dit toernooi heeft geen team op dit adres.",
    "Tournament.TeamArchived":
      "Dit team is gearchiveerd en kan alleen vanuit het tabblad Teams worden hersteld.",
    "admin.tests.add": "Test toevoegen",
    "admin.tests.none": "Geen tests",
    "admin.tests.edit": "Bewerken",
    "admin.tests.view": "Bekijken",
    "admin.tests.archive": "Archiveren",
    "admin.tests.restore": "Herstellen",
    "admin.tests.up": "Omhoog",
    "admin.tests.down": "Omlaag",
    "admin.tests.archived": "Gearchiveerde tests",
    "admin.tests.twoTeamsNeeded":
      "Een test is tussen twee teams, dus er zijn eerst twee teams nodig.",
    "admin.tests.toTeams": "Ga naar Teams",
    "admin.tests.matches.one": "{count} wedstrijd",
    "admin.tests.matches.other": "{count} wedstrijden",
    "admin.tests.bestOf": "best of {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "Dat kon niet worden gedaan.",
    "admin.test.addTitle": "Test toevoegen",
    "admin.test.editTitle": "Test bewerken",
    "admin.test.firstTeam": "Team A",
    "admin.test.secondTeam": "Team B",
    "admin.test.versus": "v",
    "admin.test.starts": "Begint",
    "admin.test.finishes": "Eindigt",
    "admin.test.expectedMatches": "Verwachte wedstrijden",
    "admin.test.bestOf": "Best of",
    "admin.test.group": "Groep",
    "admin.test.add": "Toevoegen",
    "admin.test.save": "Opslaan",
    "admin.test.added": "{name} is toegevoegd.",
    "admin.test.otherwise": "Deze test kan zo niet worden bewaard.",
    "admin.testView.otherwise":
      "Deze test kan van hieruit niet worden bekeken.",
    "AddTest.FirstTeamMissing": "Kies het eerste team.",
    "AddTest.SecondTeamMissing": "Kies het tweede team.",
    "UpdateTest.FirstTeamMissing": "Kies het eerste team.",
    "UpdateTest.SecondTeamMissing": "Kies het tweede team.",
    "ExpectedMatches.NotWhole": "Vul een geheel aantal wedstrijden in.",
    "ExpectedMatches.TooSmall":
      "Van een test worden minstens 1 wedstrijd verwacht.",
    "TestGroup.TooLong": "Die groep is te lang.",
    "Tournament.TestAgainstItself": "Een team speelt geen test tegen zichzelf.",
    "Tournament.TestFinishesBeforeStarts":
      "Een test kan niet eindigen voordat hij begint.",
    "Tournament.TestStartsBeforeTournament":
      "Een test kan niet beginnen voordat het toernooi begint.",
    "Tournament.TestFinishesAfterTournament":
      "Een test kan niet eindigen nadat het toernooi eindigt.",
    "Tournament.TestHasGamesInUse":
      "Deze test heeft partijen, dus hij kan pas worden gearchiveerd als die dat zijn.",
    "Tournament.TestHasGames":
      "Deze test heeft nu partijen, dus de teams kunnen niet meer worden gewijzigd.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Er zijn al meer wedstrijden begonnen dan dat.",
    "Tournament.BestOfBelowGamesPlayed":
      "Twee spelers hebben al meer partijen gespeeld dan dat.",
    "Competition.ExpectedMatchesReached":
      "Van deze test zijn al zoveel wedstrijden begonnen als er worden verwacht.",
    "Competition.SameTeam":
      "Twee spelers van hetzelfde team spelen niet tegen elkaar.",
    "AddManager.NoSuchAccount":
      "Dat adres heeft geen account dat toernooileider kan worden.",
    "admin.scorers.add": "Scorebijhouder toevoegen",
    "admin.scorers.none": "Geen scorebijhouders",
    "admin.scorers.removeTitle": "Scorebijhouder verwijderen",
    "admin.scorers.removeExplanation":
      "{name} kan de scores van dit toernooi niet langer invoeren.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "Dat adres kan geen scorebijhouder worden.",
    "AddScorer.NoSuchAccount":
      "Dat adres heeft geen account dat scorebijhouder kan worden.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Alleen een beheerder kan dat doen.",
    "AddRole.NoSuchAccount":
      "Dat adres heeft geen account dat de rol kan krijgen.",
    "AddRole.NoSuchRole": "Die rol bestaat niet.",
    "RemoveRole.NoSuchAccount": "Dat account bestaat niet.",
    "RemoveRole.NoSuchRole": "Die rol bestaat niet.",
    "RemoveRole.Yourself": "Je kunt jezelf de rol van beheerder niet afnemen.",
    "AccountsWithRole.NoSuchRole": "Die rol bestaat niet.",
    "Tournament.AlreadyAManager":
      "Dat account beheert het toernooi al, en kan alles wat een scorebijhouder kan.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "Zeg hoe het toernooi heet.",
    "TournamentName.TooShort": "Die naam is te kort.",
    "TournamentName.TooLong": "Die naam is te lang.",
    "TournamentName.AllLowerCase":
      "Een naam mag niet helemaal in kleine letters staan.",
    "TournamentName.AllCapitals":
      "Een naam mag niet helemaal in hoofdletters staan.",
    "TournamentName.NoLetterOrDigit":
      "Een naam moet een letter of cijfer bevatten.",
    "ReadOnlyDate.Unreadable": "Geef de dag op.",
    "Tournament.FinishesBeforeStarts":
      "Een toernooi kan niet eindigen voordat het begint.",
    "Tournament.StartsAfterNextYear":
      "Een toernooi kan niet na volgend jaar beginnen.",
    "Tournament.FinishesAfterNextYear":
      "Een toernooi kan niet na volgend jaar eindigen.",
    "CreateTournament.NoSuchCountry": "Kies het land.",
    "TournamentSubtitle.TooLong":
      "Een ondertitel mag uit hooguit 2000 tekens bestaan.",
    "Tournament.NotAManager":
      "Alleen een toernooileider van dit toernooi kan het wijzigen.",
    "Tournament.NotAManagerOrScorer":
      "Alleen een toernooileider of scorebijhouder van dit toernooi kan het zien.",
    "Tournament.Archived":
      "Dit toernooi is gearchiveerd en wordt hersteld voordat het kan worden gewijzigd.",
    "UpdateTournament.NoSuchTournament": "Er is geen toernooi op dit adres.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form.
    "sport.ac": "Associatiecroquet",
    "sport.gc": "Golfcroquet",
    "sport.a6w": "American 6 Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standaard",
    "format.teams": "Teams",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship":
      "Wereldkampioenschap golfcroquet voor teams",
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
    "country.by": "Belarus",
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
    "country.mv": "Malediven",
    "country.mw": "Malawi",
    "country.mx": "Mexico",
    "country.my": "Maleisië",
    "country.mz": "Mozambique",
    "country.na": "Namibië",
    "country.nc": "Nieuw-Caledonië",
    "country.ne": "Niger",
    "country.nf": "Norfolkeiland",
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

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. `{link}` is the link the email carries,
    // `{site}` the site's address, `{buttonBackgroundColour}` and
    // `{buttonTextColour}` what a button is painted with, `{emailFromName}` the
    // name each email is signed off with, and `{siteName}` what the site is
    // called. None greets its reader by name.

    "Email.ConfirmAddress.subject": "Bevestig je e-mailadres voor {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hallo,</p>

<p>
    Bedankt voor het aanmaken van een account bij <strong>{siteName}</strong>.<br />
    Bevestig voordat je je account kunt gebruiken eerst je e-mailadres door op de knop hieronder te klikken:
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
      "Een nieuwe link om je e-mailadres voor {siteName} te bevestigen",
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
    Zodra het is bevestigd, kun je je account zonder onderbreking blijven gebruiken.
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
    Iemand heeft geprobeerd zich bij <strong>{siteName}</strong> te registreren met dit e-mailadres, dat al een account heeft. Er is niets aan je account veranderd.<br />
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
    Was jij het niet, dan hoef je niets te doen. Niemand heeft toegang tot je account gekregen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bevestig de verhuizing van je {siteName}-account naar dit adres",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hallo,</p>

<p>
    Iemand die was ingelogd op een <strong>{siteName}</strong>-account heeft gevraagd het naar dit e-mailadres te verhuizen. Was jij het, bevestig het dan hier, ingelogd op dat account. De link werkt 24 uur.
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
        Mijn account verhuizen
    </a>
</p>

<p>
    Of kopieer dit adres naar je browser:<br />
    {link}
</p>

<p>
    Was jij het niet, dan hoef je niets te doen. Er verhuist geen account naar dit adres.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Iemand vroeg om een account naar je e-mailadres te verhuizen",
    "Email.AlreadyHasAnAccount.body": `
<p>Hallo,</p>

<p>
    Iemand die was ingelogd op een <strong>{siteName}</strong>-account heeft gevraagd het naar dit e-mailadres te verhuizen, dat al een eigen account heeft. Er is niets verhuisd en er is niets aan je account veranderd.
</p>

<p>
    Was jij het, dan heb je al een account op dit adres en kun je daarop inloggen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Je {siteName}-account is verhuisd",
    "Email.EmailAddressChanged.body": `
<p>Hallo,</p>

<p>
    Je <strong>{siteName}</strong>-account is zojuist verhuisd naar een ander e-mailadres, {emailAddress}, en logt vanaf nu met dat adres in.
</p>

<p>
    Was jij het niet, dan heeft iemand anders je account. Antwoord op deze e-mail en laat het ons weten.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Je {siteName}-wachtwoord is gewijzigd",
    "Email.PasswordChanged.body": `
<p>Hallo,</p>

<p>
    Het wachtwoord van je <strong>{siteName}</strong>-account is zojuist gewijzigd, en elke andere browser die op het account was ingelogd, is uitgelogd.<br />
    Was jij het, dan hoef je niets te doen.
</p>

<p>
    Was jij het niet, dan heeft iemand anders je wachtwoord. Stel hier een nieuw wachtwoord in, dan wordt die persoon uitgelogd:
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
    Je hebt onlangs gevraagd om je wachtwoord voor <strong>{siteName}</strong> opnieuw in te stellen.<br />
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
    Heb je niet gevraagd om je wachtwoord opnieuw in te stellen, dan kun je deze e-mail gerust negeren.
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
    Er is gevraagd het wachtwoord opnieuw in te stellen voor een e-mailadres dat niet bij een account op <strong>{siteName}</strong> hoort.
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
    Volg de knop hieronder om te zien wat dat betekent, en om zeker te zeggen dat je het wilt:
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
    Zodra het is vergeten, kunnen je naam en e-mailadres nooit meer door wie dan ook worden gelezen, en kan er niet meer op je account worden ingelogd. Het kan niet ongedaan worden gemaakt.
</p>

<p>
    De link werkt één keer, tot 15 minuten nadat je erom vroeg, en alleen zolang je bent ingelogd op dit account. Vraag het daarna opnieuw aan vanuit je account.
</p>

<p>
    Heb je er niet om gevraagd, dan gebeurt er niets tenzij de link wordt gevolgd. Iemand die was ingelogd op je account heeft er echter om gevraagd, dus stel via de pagina voor vergeten wachtwoorden een nieuw wachtwoord in om zeker te zijn dat die persoon niet opnieuw kan inloggen.
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
    {siteName} kon {service} om {when} niet bereiken. Totdat die antwoordt, krijgen lezers die dat nodig hebben, om zich te registreren of een nieuw wachtwoord in te stellen, te horen dat ze het later opnieuw moeten proberen.
</p>

<p>
    Er hoeft niets te worden opgeheven. Elke poging vraagt {service} opnieuw, en de pagina's werken weer zodra die antwoordt.
</p>

<p>
    Zolang {service} uitgevallen blijft, word je hier hooguit één keer per uur over gemaild.
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
    {siteName} kon om {when} zijn database niet bereiken. Totdat die antwoordt, vertelt elke pagina die hem nodig heeft aan lezers dat de site niet beschikbaar is en dat ze het later opnieuw moeten proberen.
</p>

<p>
    Er hoeft niets te worden opgeheven. Elk verzoek vraagt opnieuw om een verbinding, en de site werkt weer zodra de database antwoordt.
</p>

<p>
    Zolang de database uitgevallen blijft, word je hier hooguit één keer per {minutes} minuten over gemaild.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} is mislukt bij een verzoek",
    "Email.UnhandledError.body": `
<p>Hallo,</p>

<p>
    {siteName} is om {when} mislukt bij een verzoek om {asked}. De lezer kreeg de referentie {reference} te zien, en het logboek heeft de oorzaak daaronder.
</p>

<p>
    Een site die kapot is, mislukt meestal bij elk verzoek, dus je krijgt hooguit 4 keer per uur een e-mail over mislukkingen. De latere staan toch in het logboek.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
