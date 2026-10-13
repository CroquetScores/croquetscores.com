// The site's words in Swedish. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as du rather than ni: Swedish dropped ni as the polite
// form decades ago and uses du to everybody, and the English it is written
// from is plain and direct rather than formal. Items in menus and on buttons
// are written in sentence case, as Swedish writes them, where the English
// capitalises each word.
//
// The croquet words are the ones Swedish players use: hoops are bågar, and a
// bye is a frilott. The sports and formats that have no established Swedish
// name keep the English one, as a name is not translated.
import type { Language } from "../common/language.js";

export const swedish: Language = {
  tag: "sv",
  name: "Svenska",
  words: {
    "site.skipToContent": "Hoppa till innehållet",
    "navigation.menu": "Meny",
    "navigation.label": "Huvudmeny",
    "navigation.home": "Hem",
    "navigation.help": "Hjälp",
    "navigation.admin": "Administration",
    "sections.label": "Avdelningar",
    "theme.label": "Tema",
    "theme.light": "Ljust",
    "theme.dark": "Mörkt",
    "theme.system": "System",
    "footer.donate": "Donera",
    "footer.plea":
      "Gillar du {siteName}? Donera gärna för att hjälpa till med den fortsatta utvecklingen.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "tryWebsite.banner":
      "Det här är en trygg plats att lära sig {siteName} på. Allt som skrivs in här kan tas bort när som helst.",

    "language.label": "Språk",
    "language.choose": "Byt",

    "form.otherwise":
      "Något stämmer inte här. Kontrollera det du skrev in och försök igen.",

    "account.menu": "Konto",
    "account.register": "Registrera dig",
    "account.signIn": "Logga in",
    "account.forgotPassword": "Jag har glömt mitt lösenord",
    "account.signOut": "Logga ut",
    "account.profile": "Profil",
    "account.changePassword": "Byt lösenord",
    "account.changeEmailAddress": "Byt e-postadress",
    "account.changeName": "Byt namn",
    "account.setPassword": "Ange lösenord",
    "account.forgetAccount": "Glöm kontot",

    "register.title": "Registrera dig",
    "register.emailAddress": "E-postadress",
    "register.submit": "Registrera dig",
    "register.withGoogle": "Registrera dig med Google",
    "register.or": "eller",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google har inte bekräftat att den e-postadressen är din, så den kan inte användas här med Google. Använd din e-postadress nedan i stället.",
    "SignInWithGoogle.LinkedToAnother":
      "Den e-postadressen har redan ett konto, som är kopplat till ett annat Google-konto. Logga in med det Google-kontot, eller med din e-postadress och ditt lösenord.",
    "SignInWithGoogle.NameMissing":
      "Google berättade inte vad du heter, och ett konto behöver ett namn. Använd din e-postadress nedan i stället.",
    "Google.Unreachable":
      "Google gick inte att nå just nu. Försök igen om några minuter, eller använd din e-postadress nedan.",
    "Registration.NotAPerson":
      "Det här såg inte ut att komma från en människa. Försök igen, och om det fortsätter, vänta några minuter och kom tillbaka.",

    "EmailAddress.Missing": "Ange en e-postadress.",
    "EmailAddress.NoAt": "En e-postadress innehåller ett @.",
    "EmailAddress.MoreThanOneAt": "En e-postadress innehåller ett enda @.",
    "EmailAddress.NoDomain":
      "En e-postadress har en domän efter @, till exempel example.com.",

    "welcome.title": "Kontrollera din e-post",
    "welcome.checkEmail":
      "Ett e-postmeddelande är på väg till adressen du angav. Följ länken i det för att gå vidare.",
    "welcome.nothingArrived":
      "Om inget kommer inom några minuter, titta i skräppostmappen.",
    "welcome.home": "Tillbaka till {siteName}",
    "newConfirmationLink.title": "Hämta en ny länk",
    "newConfirmationLink.explanation":
      "Länken för att bekräfta din e-postadress har gått ut. Be om en ny så skickas den till adressen du registrerade dig med.",
    "newConfirmationLink.send": "Skicka en ny länk till mig",
    "newConfirmationLink.home": "Tillbaka till {siteName}",
    "newConfirmationLink.signIn": "Logga in",
    "newConfirmationLink.sent.title": "Kontrollera din e-post",
    "newConfirmationLink.sent.explanation":
      "En ny länk är på väg. Följ den för att bekräfta din e-postadress. Om inget kommer inom några minuter, titta i skräppostmappen.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Den e-postadressen är redan bekräftad",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Det finns inget mer att bekräfta. Logga in med lösenordet du angav när du bekräftade den.",
    "newConfirmationLink.noLongerWorks.title":
      "Den länken fungerar inte längre",
    "newConfirmationLink.noLongerWorks.explanation":
      "Kontrollera att du följde hela länken från e-postmeddelandet, utan att något saknas i slutet av den. Om den ändå inte fungerar, registrera dig igen så skickas en ny länk.",
    "newConfirmationLink.tooMany.title": "Försök igen senare",
    "newConfirmationLink.tooMany.explanation":
      "Flera länkar har nyligen skickats till den här adressen. Vänta en timme och be om en ny, och titta under tiden i skräppostmappen.",

    "forgotPassword.title": "Har du glömt ditt lösenord?",
    "forgotPassword.emailAddress": "E-postadress",
    "forgotPassword.submit": "Skicka mig en väg tillbaka in",
    "forgotPassword.home": "Tillbaka till {siteName}",
    "forgotPassword.sent.title": "Kontrollera din e-post",
    "forgotPassword.sent.explanation":
      "Om den adressen har ett konto är en länk för att ange ett nytt lösenord på väg. Följ den inom en timme. Om inget kommer inom några minuter, titta i skräppostmappen.",
    "forgotPassword.tryAgainLater":
      "Det har nyligen begärts för många vägar tillbaka in härifrån. Vänta en timme och försök igen.",

    "setNewPassword.title": "Ange ett nytt lösenord",
    "setNewPassword.password": "Lösenord",
    "setNewPassword.confirmPassword": "Bekräfta lösenordet",
    "setNewPassword.submit": "Ange mitt nya lösenord",
    "setNewPassword.home": "Tillbaka till {siteName}",
    "setNewPassword.signIn": "Logga in",
    "setNewPassword.askAgain": "Be om en ny länk",
    "setNewPassword.changed.title": "Ditt lösenord har ändrats",
    "setNewPassword.changed.explanation":
      "Du har loggats ut överallt där du var inloggad. Logga in med ditt nya lösenord.",
    "setNewPassword.expired.title": "Den länken har gått ut",
    "setNewPassword.expired.explanation":
      "En länk för att ange ett nytt lösenord fungerar i en timme. Be om en till, så skickas den till samma adress.",
    "setNewPassword.noLongerWorks.title": "Den länken fungerar inte längre",
    "setNewPassword.noLongerWorks.explanation":
      "Den kan redan ha använts, eller så kan något saknas i slutet av den. Be om en ny om du fortfarande behöver en.",

    "BreachedPasswords.Unreachable":
      "Ditt lösenord kan inte kontrolleras just nu, så det har inte ändrats. Försök igen om några minuter; din länk fungerar tills den går ut.",

    "forgetAccount.title": "Glöm ditt konto",
    "forgetAccount.explanation":
      "Ditt namn och din e-postadress kan göras oläsliga för alltid, och ditt konto stängas. För att vara säkra på att det är du skickar vi först en länk till kontots adress, och ingenting glöms förrän du följer den.",
    "forgetAccount.submit": "Skicka länken till mig",
    "forgetAccount.sent.title": "Kontrollera din e-post",
    "forgetAccount.sent.explanation":
      "Vi har skickat en länk till kontots adress. Den fungerar i 15 minuter, och bara medan du är inloggad på det här kontot.",
    "forgetAccount.confirm.title": "Glömma ditt konto för alltid?",
    "forgetAccount.confirm.explanation":
      "När kontot är glömt kan ditt namn och din e-postadress aldrig läsas igen, av någon, och det går inte att logga in på kontot. Det kan inte ångras.",
    "forgetAccount.confirm.submit": "Glöm mitt konto",
    "forgetAccount.forgotten.title": "Ditt konto har glömts",
    "forgetAccount.forgotten.explanation":
      "Ditt namn och din e-postadress kan inte längre läsas, och du har loggats ut överallt där du var inloggad.",
    "forgetAccount.noLongerWorks.title": "Den länken fungerar inte längre",
    "forgetAccount.noLongerWorks.explanation":
      "Den kan ha gått ut, redan ha använts, eller höra till ett konto som du inte är inloggad på. Be om en ny från ditt konto om du fortfarande vill att det ska glömmas.",
    "forgetAccount.lastAdministrator.title": "Ditt konto kan inte glömmas",
    "forgetAccount.lastAdministrator.explanation":
      "Du är den här webbplatsens enda administratör. Ge rollen administratör till någon annan, så kan ditt konto glömmas.",
    "forgetAccount.askAgain": "Be om en ny länk",
    "forgetAccount.home": "Tillbaka till {siteName}",

    "registrationsSuspended.title": "Registreringen är tillfälligt avstängd",
    "registrationsSuspended.explanation":
      "En tjänst som registreringen behöver går inte att nå just nu, så ingen kan registrera sig förrän den svarar igen. Ingenting av det du skrev in sparades.",
    "registrationsSuspended.tryAgainLater":
      "Försök igen om en stund. Webbplatsens administratör har fått veta.",
    "registrationsSuspended.home": "Tillbaka till {siteName}",

    "signIn.title": "Logga in",
    "signIn.emailAddress": "E-postadress",
    "signIn.password": "Lösenord",
    "signIn.submit": "Logga in",
    "signIn.forgotPassword": "Har du glömt lösenordet?",
    "signIn.register": "Registrera dig",
    "signIn.withGoogle": "Logga in med Google",
    "signIn.or": "eller",
    "signIn.tryAgainLater":
      "Det har nyligen gjorts för många försök. Vänta en timme och försök igen.",

    "SignIn.Failed": "E-postadressen eller lösenordet är fel. Försök igen.",

    "profile.title": "Profil",
    "profile.name": "Namn:",
    "profile.emailAddress": "E-postadress:",

    "changeName.title": "Byt namn",
    "changeName.name": "Namn",
    "changeName.submit": "Byt namn",

    "setPassword.title": "Ange ett lösenord",
    "setPassword.explanation":
      "Ditt konto har inget lösenord: du loggar in med Google. För att kunna logga in med ett lösenord också skickar vi en länk för att ange ett till {emailAddress}.",
    "setPassword.submit": "Skicka en länk till mig",
    "setPassword.sent.title": "Kontrollera din e-post",
    "setPassword.sent.explanation":
      "Vi har skickat en länk till dig för att ange ett lösenord. Den fungerar i en timme.",
    "setPassword.profile": "Tillbaka till din profil",

    "changePassword.title": "Byt lösenord",
    "changePassword.currentPassword": "Nuvarande lösenord",
    "changePassword.password": "Nytt lösenord",
    "changePassword.passwordConfirmation": "Bekräfta lösenordet",
    "changePassword.forgotPassword": "Har du glömt lösenordet?",
    "changePassword.submit": "Byt lösenord",
    "ChangePassword.WrongPassword": "Det är inte ditt lösenord.",

    "changeEmailAddress.title": "Byt e-postadress",
    "changeEmailAddress.emailAddress": "Ny e-postadress",
    "changeEmailAddress.currentPassword": "Nuvarande lösenord",
    "changeEmailAddress.submit": "Skicka en länk för att bekräfta",
    "changeEmailAddress.sent.title": "Kontrollera din e-post",
    "changeEmailAddress.sent.explanation":
      "En länk för att bekräfta flytten har skickats till den nya e-postadressen. Följ den, inloggad, för att flytta ditt konto dit.",
    "changeEmailAddress.confirm.title": "Flytta ditt konto",
    "changeEmailAddress.confirm.explanation":
      "Ditt konto flyttas till {emailAddress}. Du loggar in med den adressen från och med nu.",
    "changeEmailAddress.confirm.submit": "Flytta mitt konto",
    "changeEmailAddress.noLongerWorks.title":
      "Den här länken fungerar inte längre",
    "changeEmailAddress.noLongerWorks.explanation":
      "Den har gått ut, har redan använts eller skickades inte för det konto du är inloggad på. Be om en ny från din profil.",
    "changeEmailAddress.taken.title": "Ditt konto har inte flyttats",
    "changeEmailAddress.profile": "Tillbaka till din profil",
    "ChangeEmailAddress.WrongPassword": "Det är inte ditt lösenord.",
    "ChangeEmailAddress.Unchanged": "Ditt konto har redan den här adressen.",
    "ChangeEmailAddress.Taken":
      "Den e-postadressen har numera ett eget konto, så ditt kan inte flyttas dit.",

    "confirmEmailAddress.title": "Bekräfta din e-postadress",
    "confirmEmailAddress.name": "Namn",
    "confirmEmailAddress.password": "Lösenord",
    "confirmEmailAddress.confirmPassword": "Bekräfta lösenordet",
    "confirmEmailAddress.submit": "Bekräfta min e-postadress",
    "confirmEmailAddress.signIn": "Logga in",
    "confirmEmailAddress.home": "Tillbaka till {siteName}",
    "confirmEmailAddress.confirmed.title": "Din e-postadress är bekräftad",
    "confirmEmailAddress.confirmed.explanation":
      "Ditt konto är klart. Logga in med e-postadressen och lösenordet du just angav.",
    "confirmEmailAddress.expired.title": "Den länken har gått ut",
    "confirmEmailAddress.expired.explanation":
      "En länk för att bekräfta en e-postadress fungerar i 24 timmar. Be om en ny, så skickas den till samma adress.",
    "confirmEmailAddress.expired.newLink": "Skicka en ny länk till mig",
    "confirmEmailAddress.noLongerWorks.title":
      "Den länken fungerar inte längre",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Kontrollera att du följde hela länken från e-postmeddelandet, utan att något saknas i slutet av den. Om den ändå inte fungerar, registrera dig igen så skickas en ny länk.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Den e-postadressen är redan bekräftad",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Det finns inget mer att göra. Logga in med lösenordet du angav när du bekräftade den.",

    "PersonName.Missing": "Ange ett namn.",
    "PersonName.TooShort": "Ett namn måste vara minst 3 tecken långt.",
    "PersonName.TooLong": "Ett namn får vara högst 254 tecken långt.",
    "WorldRankingName.TooShort":
      "Ett namn på världsranking måste vara minst 3 tecken långt.",
    "WorldRankingName.TooLong":
      "Ett namn på världsranking får vara högst 254 tecken långt.",
    "Password.Missing": "Ange ett lösenord.",
    "Password.TooShort": "Ett lösenord måste vara minst 12 tecken långt.",
    "Password.ConfirmationDiffers":
      "Det här är inte samma som lösenordet ovan. Skriv det igen.",
    "Password.Breached":
      "Det här lösenordet har förekommit i ett dataintrång någon annanstans, så det är inte säkert att använda här. Välj ett annat.",

    "javaScriptRequired.title": "Skript behövs",
    "javaScriptRequired.explanation":
      "För att registrera dig måste skript vara påslagna för den här webbplatsen, så att den kan kontrollera att den som registrerar sig är en människa. Slå på dem och registrera dig sedan igen.",
    "javaScriptRequired.register": "Tillbaka till registreringen",
    "javaScriptRequired.home": "Tillbaka till {siteName}",

    "errors.backHome": "Tillbaka till {siteName}",
    "errors.notFound": "Hittades inte",
    "errors.refused": "Det gick inte att göra",
    "errors.refusedDetail": "Något i det som skickades stämde inte.",
    "errors.sorry": "Förlåt",
    "errors.sorryDetail": "Den begäran kunde inte hanteras.",
    "errors.failed": "Något gick fel",
    "errors.reference": "Referens {reference}.",

    "home.recentResults": "Senaste resultat",
    "home.recentResults.none":
      "Inga matcher har lagts till de senaste sju dagarna.",
    "home.upcomingTournaments": "Kommande turneringar",
    "home.upcomingTournaments.none":
      "Inga turneringar startar de kommande sextio dagarna.",
    "home.allTournaments": "Alla turneringar {year}",
    "year.heading": "Turneringar {year}",
    "year.none": "Inga turneringar startar {year}.",
    "yearSport.heading": "{sport}-turneringar {year}",
    "yearSport.none": "Inga {sport}-turneringar startar {year}.",
    "tournament.recent": "Senaste",
    "tournament.summary": "Sammanfattning",
    "test.bestOf": "Varje match spelas bäst av {count}.",
    "test.vs": "mot",
    "test.matches": "Matcher",
    "test.games": "Partier",
    "test.hoops": "Bågar",
    "teamSummary.tests": "Testmatcher",
    "teamSummary.matches": "Matcher",
    "teamSummary.games": "Partier",
    "teamSummary.hoops": "Bågar",
    "teamSummary.wins": "Vinster",
    "teamSummary.losses": "Förluster",
    "teamSummary.draws": "Oavgjorda",
    "teamSummary.for": "För",
    "teamSummary.against": "Emot",
    "teamSummary.net": "Netto",
    "tournament.players": "Spelare",
    "tournament.test": "{first} mot {second}",
    "tournament.notes": "Anteckningar",
    "tournament.commentary": "Livekommentarer",
    "tournament.beat": "besegrade",
    "tournament.drewWith": "spelade oavgjort mot",
    "tournament.ago.seconds": "{count} sek",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 timme",
    "tournament.ago.hours": "{count} timmar",
    "tournament.none": "Inga partier har spelats ännu.",
    "players.none": "Inga spelare har lagts till ännu.",
    "commentaries.by": "av",
    "commentaries.start": "Starta en ny livekommentar",
    "commentaries.disclaimer.heading": "Ansvarsfriskrivning",
    "commentaries.disclaimer":
      "De åsikter och synpunkter som uttrycks i dessa livekommentarer är skribenternas egna och speglar inte nödvändigtvis åsikterna hos Tim Murphy eller {site}.",
    "commentaries.guidelines.heading": "Riktlinjer",
    "commentaries.guidelines.responsible": "Du ansvarar för din livekommentar.",
    "commentaries.guidelines.purpose":
      'Livekommentarerna är till för att förmedla vad som händer på turneringen. De är inte tänkta som en plats för "sociala medier" där man skickar hälsningar och liknande.',
    "commentaries.guidelines.hatred":
      "Lägg inte upp material som kan uppmana till våld eller hat. Vi accepterar inga kommentarer som förnedrar andra på grund av ras, religion, etnicitet, kön, ålder, psykisk eller fysisk funktionsnedsättning eller sexuell läggning.",
    "commentaries.guidelines.abuse":
      "Onödiga påhopp accepteras inte. Den allmänna regeln här är att kommentarer ska handla om sakfrågan och inte angripa någon personligen.",
    "commentaries.guidelines.unlawful":
      "Kommentarer som är juridiskt tveksamma, till exempel möjliga intrång i upphovsrätt eller material som kan vara ärekränkande, tas bort.",
    "commentaries.guidelines.shouting":
      "Svär inte och skriv inte med enbart versaler i livekommentarer.",
    "commentaries.guidelines.selling":
      "Använd inte kommentarsfältet för kommersiella syften eller skräppost. Kommentarer som marknadsför, främjar eller efterfrågar varor eller tjänster tas bort.",
    "commentaries.guidelines.links":
      "Begränsa gärna användningen av länkar i kommentarer. Kommentarer med länkar till olämpligt material tas bort.",
    "commentaries.guidelines.impersonating":
      "Utge dig inte för att vara någon annan i kommentarsfältet, och lägg inte upp personuppgifter – telefonnummer, postadresser eller e-postadresser – som av misstag kan försätta någon i fara.",
    "commentaries.reporting.heading": "Anmäla en livekommentar",
    "commentaries.reporting.before":
      "Anmäl livekommentarer som inte följer dessa riktlinjer till",
    "commentaries.reporting.after":
      ". Ange webbadressen och den tveksamma kommentaren, t.ex.",
    "commentaries.reporting.exampleComment":
      '"en kommentar som borde tas bort"',
    "commentaries.reporting.exampleReason":
      "Den här kommentaren borde tas bort eftersom...",
    "commentaries.reporting.reviewed":
      "En anmälan innebär inte att kommentaren tas bort automatiskt, men alla anmälningar granskas.",
    "commentaries.reporting.reserved":
      "{site} förbehåller sig rätten att ta bort livekommentarer.",
    "commentaries.reporting.subject": "Anmälan av livekommentar på {site}",
    "commentaries.reporting.body":
      "Ange webbadressen, den tveksamma kommentaren och varför den bör tas bort.",
    "startCommentary.title": "Starta en ny livekommentar",
    "startCommentary.titleField": "Rubrik",
    "startCommentary.submit": "Starta livekommentar",
    "marks.new": "ny",
    "notes.none": "Turneringsledarna har inte skrivit några anteckningar ännu.",
    "note.edited": "redigerad",
    "commentary.none": "Inga kommentarer har skrivits ännu.",
    "commentary.edited": "redigerad",
    "commentary.edit": "Redigera",
    "commentary.delete": "Ta bort",
    "commentary.comment": "Kommentar",
    "commentary.add": "Lägg till kommentar",
    "commentary.notSent":
      "Kommentaren kunde inte skickas. Läs in sidan igen för att se om den sparades.",
    "changeCommentaryTitle.title": "Byt rubrik",
    "changeCommentaryTitle.submit": "Spara",
    "editComment.title": "Redigera kommentar",
    "editComment.save": "Spara",
    "deleteComment.title": "Ta bort kommentar",
    "deleteComment.question":
      "Ta bort den här kommentaren? Det kan inte ångras.",
    "deleteComment.confirm": "Ta bort kommentaren",
    "deleteComment.keep": "Behåll den",
    "player.games": "Partier",
    "player.competitions": "Tävlingar",
    "player.beat": "besegrade",
    "player.lostTo": "förlorade mot",
    "player.drewWith": "spelade oavgjort mot",
    "player.score": "{score} mot {opponent}",
    "player.noGames": "Inga partier har spelats ännu.",
    "player.noCompetitions": "Har ännu inte anmälts till någon tävling.",
    "block.wins": "Vinster",
    "block.matches": "Matcher",
    "block.netGames": "Nettopartier",
    "block.games": "Partier",
    "block.netHoops": "Nettobågar",
    "block.won": "vunnit",
    "block.lost": "förlorat",
    "block.drawn": "oavgjort",
    "block.withdrawn": "tillbakadragen",
    "block.gameWithdrawn": "tillbakadraget",
    "block.losses": "Förluster",
    "competition.views": "Vyer",
    "competition.view.grid": "Tabell",
    "competition.view.summary": "Sammanfattning",
    "competition.view.orderOfPlay": "Spelordning",
    "blockSummary.ranking":
      "Rangordnade efter andelen vunna matcher, sedan efter nettobågar. En turnerings egna regler kan placera dess spelare på annat sätt.",
    "orderOfPlay.none": "Inga partier har spelats ännu.",
    "knockout.round.final": "Final",
    "knockout.round.semis": "Semifinaler",
    "knockout.round.quarters": "Kvartsfinaler",
    "knockout.round.number": "Omgång {number}",
    "knockout.bye": "Frilott",
    "swiss.games": "Partier",
    "swiss.wins": "Vinster",
    "swiss.winShare": "Vinst %",
    "swiss.results": "Resultat",
    "knockout.onward": "Senare omgångar",
    "knockout.back": "Tidigare omgångar",
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Namn",
    "tournamentList.onlyIn": "Bara turneringar i {country}",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Alla länder",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Alla regioner",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Alla sporter",
    "tournamentList.filter.submit": "Filtrera",
    "years.label": "År",
    "years.earlier": "Tidigare år",

    "admin.newerBuild.message": "En nyare version av webbplatsen finns.",
    "admin.newerBuild.reload": "Läs in igen",
    "admin.title": "Administration",
    "admin.tournaments.new": "Ny turnering",
    "admin.tournaments.none": "Inga turneringar",
    "admin.tournaments.archived": "Arkiverad",
    "admin.tournaments.manage": "Hantera",
    "admin.tournaments.edit": "Redigera",
    "admin.tournaments.archive": "Arkivera",
    "admin.tournaments.restore": "Återställ",
    "admin.tournaments.scores": "Resultat",
    "admin.tournaments.players": "Spelare",
    "admin.years.label": "År",
    "admin.years.earlier": "Tidigare år",
    "admin.tournament.name": "Namn",
    "admin.tournament.starts": "Startar",
    "admin.tournament.finishes": "Slutar",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Underrubrik",
    "admin.tournament.handicap": "Spelas med handikapp",
    "admin.tournament.drawsAllowed": "Tillåter oavgjorda resultat",
    "admin.tournament.levelTestsDrawn": "Lika testmatcher är oavgjorda",
    "admin.tournament.worldRankings": "Räknas med i världsrankingen",
    "admin.tournament.national": "Tävling på nationell nivå",
    "admin.tournament.international": "Tävling på internationell nivå",
    "admin.tournament.otherwise": "Det här kan inte godtas som det är.",
    "admin.newTournament.title": "Ny turnering",
    "admin.newTournament.submit": "Skapa turnering",
    "admin.editTournament.title": "Redigera turnering",
    "admin.editTournament.submit": "Uppdatera turnering",
    "admin.editTournament.otherwise": "Den här turneringen kan inte ändras.",
    "admin.view.tabs": "Turnering",
    "admin.view.players": "Spelare",
    "admin.view.competitions": "Tävlingar",
    "admin.view.managers": "Turneringsledare",
    "admin.view.notes": "Anteckningar",
    "admin.view.scorers": "Resultatförare",
    "admin.view.rankings": "Rankingar",
    "admin.rankings.textFile":
      "Turneringens resultat skickas till världsrankingen som en textfil, som webbplatsen skriver utifrån de inmatade matcherna.",
    "admin.rankings.spreadsheet":
      "Turneringens resultat skickas till världsrankingen som ett kalkylblad, som webbplatsen skriver utifrån de inmatade matcherna.",
    "admin.rankings.fillInWinners":
      "Webbplatsen kan bara gissa vem som vann varje tävling, så kontrollera raden Vinnare för var och en innan du skickar filen.",
    "admin.rankings.fillInWinner":
      "Webbplatsen kan inte veta vem som vann turneringen, så fyll i det längst ned i kalkylbladet innan du skickar det.",
    "admin.rankings.sendIt":
      "Skicka sedan filen till världsrankingens funktionärer.",
    "admin.rankings.download": "Ladda ned rankingar",
    "rankings.notAvailable": "Rankingar är inte tillgängliga",
    "rankings.notAvailable.sport":
      "Turneringens sport har ingen världsranking, så det finns inga rankingar att skicka.",
    "rankings.notAvailable.handicap":
      "Den här turneringen spelas med handicap och räknas därför inte med i världsrankingen.",
    "rankings.notAvailable.drawnGames":
      "Den här turneringen tillåter oavgjorda matcher och räknas därför inte med i världsrankingen.",
    "rankings.notAvailable.notCounted":
      "Turneringens arrangör har angett att den inte räknas med i världsrankingen.",
    "admin.view.otherwise": "Den här turneringen kan inte skötas härifrån.",
    "admin.competitionView.tabs": "Tävling",
    "admin.competitionView.players": "Spelare",
    "admin.competitionView.scores": "Resultat",
    "admin.sections.label": "Turneringen och dess tävlingar",
    "admin.sections.tournament": "Turnering",
    "admin.administrator.sections.label": "Administratörens sidor",
    "admin.administrator.sections.tournaments": "Turneringar",
    "admin.administrator.sections.accounts": "Konton",
    "admin.administrator.sections.worldRankings": "Världsranking",
    "admin.administrator.sections.importErrors": "Importfel",
    "admin.administrator.title": "Administratör",
    "admin.accounts.title": "Konton",
    "admin.roles.add": "Lägg till",
    "admin.roles.administrator.heading": "Administratörer",
    "admin.roles.administrator.none": "Inga andra administratörer",
    "admin.roles.administrator.removeTitle": "Ta bort administratör",
    "admin.roles.administrator.removeExplanation":
      "{name} kommer inte längre att vara administratör för den här webbplatsen.",
    "admin.roles.world-ranking-officer.heading": "Världsrankingansvariga",
    "admin.roles.world-ranking-officer.none": "Inga världsrankingansvariga",
    "admin.roles.world-ranking-officer.removeTitle":
      "Ta bort världsrankingansvarig",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} kommer inte längre att vara världsrankingansvarig.",
    "admin.worldRankings.title": "Importera spelare från världsrankingen",
    "admin.worldRankings.import": "Importera",
    "admin.worldRankings.log": "Så gick importen",
    "admin.worldRankings.ac.reading": "Läser listan för associationscroquet",
    "admin.worldRankings.ac.read":
      "Spelare i associationscroquet som lästes: {players}",
    "admin.worldRankings.ac.kept":
      "Spelare i associationscroquet som behölls: {players}",
    "admin.worldRankings.ac.refused":
      "Listan för associationscroquet gick inte att läsa, så dess spelare lämnades som de var.",
    "admin.worldRankings.gc.reading": "Läser listan för golfcroquet",
    "admin.worldRankings.gc.read":
      "Spelare i golfcroquet som lästes: {players}",
    "admin.worldRankings.gc.kept":
      "Spelare i golfcroquet som behölls: {players}",
    "admin.worldRankings.gc.refused":
      "Listan för golfcroquet gick inte att läsa, så dess spelare lämnades som de var.",
    "admin.worldRankings.finished": "Klart",
    "admin.worldRankings.failed": "Importen blev inte klar.",
    "admin.worldRankings.otherwise": "Något gick fel på webbplatsen.",
    "WorldRankingLists.Unreachable":
      "Världsrankingens webbplats gick inte att nå.",
    "WorldRankingLists.Unreadable":
      "Listan är inte upplagd som världsrankingen lägger upp sina: en rad i den gick inte att läsa, ingen finns med i den, eller så är den inte skriven i UTF-8.",
    "admin.importErrors.title": "Importfel",
    "admin.importErrors.none": "Inga importfel",
    "admin.importErrors.otherwise": "Något gick fel på webbplatsen.",
    "admin.importError.title": "Importfel",
    "admin.importError.documentId": "Dokument-id",
    "admin.importError.tournament": "Turnering",
    "admin.importError.competition": "Tävling",
    "admin.importError.newSite": "Ny webbplats",
    "admin.importError.oldSite": "Gammal webbplats",
    "ImportErrorKept.NotFound":
      "Importen sparade inget fel för det dokumentet.",
    "admin.competitionView.otherwise":
      "Den här tävlingen kan inte skötas härifrån.",
    "admin.competitions.block": "Block",
    "admin.competitions.knockout": "Utslagsturnering",
    "admin.competitions.swiss": "Schweizer",
    "admin.competitions.view": "Visa",
    "admin.competitions.edit": "Redigera",
    "admin.competitions.up": "Upp",
    "admin.competitions.down": "Ned",
    "admin.competitions.archive": "Arkivera",
    "admin.competitions.restore": "Återställ",
    "admin.competitions.archived": "Arkiverade tävlingar",
    "admin.competitions.none": "Inga tävlingar",
    "admin.competitions.add": "Lägg till tävling",
    "admin.competition.addTitle": "Lägg till tävling",
    "admin.competition.editTitle": "Redigera tävling",
    "admin.competition.name": "Namn",
    "admin.competition.kind": "Sort",
    "admin.competition.bestOf": "Bäst av",
    "admin.competition.rounds": "Omgångar",
    "admin.competition.places": "Platser",
    "admin.competition.round": "Omgång {number}",
    "admin.competition.bestOfs": "Bäst av per omgång",
    "admin.competition.quarters": "Kvartsfinaler",
    "admin.competition.semis": "Semifinaler",
    "admin.competition.final": "Final",
    "admin.competition.add": "Lägg till",
    "admin.competition.save": "Spara",
    "admin.competition.added": "{name} lades till.",
    "admin.competition.otherwise":
      "Den här tävlingen kan inte sparas som den är.",
    "CompetitionName.Missing": "Ange ett namn.",
    "CompetitionName.TooLong": "Ett namn får vara högst 254 tecken långt.",
    "CompetitionName.NoLetterOrDigit":
      "Ett namn måste innehålla en bokstav eller en siffra.",
    "Tournament.KnockoutPlayerHasGames":
      "Spelare i den här lottningen har partier, så dess platser kan inte ändras.",
    "Tournament.CompetitionNameTaken":
      "En annan tävling i den här turneringen har redan det namnet.",
    "BestOf.NotWhole": "Ange ett helt antal partier.",
    "BestOf.TooSmall": "En match måste spelas bäst av minst 1 parti.",
    "Rounds.NotWhole": "Ange ett helt antal omgångar.",
    "Rounds.TooSmall": "Ett block måste spelas i minst 1 omgång.",
    "KnockoutDraw.EvenBestOf":
      "En match i en utslagsturnering måste ha en vinnare, så den spelas bäst av ett udda antal partier.",
    "admin.hover.tournaments.new": "Skapa en ny turnering",
    "admin.hover.tournaments.manage":
      "Hantera den här turneringens spelare, lag, tävlingar och resultat",
    "admin.hover.tournaments.edit": "Ändra den här turneringens uppgifter",
    "admin.hover.tournaments.scores": "Skriv in den här turneringens resultat",
    "admin.hover.tournaments.players": "Sköt om den här turneringens spelare",
    "admin.hover.competitions.view":
      "Öppna den här tävlingen för att se och skriva in dess spelare och resultat",
    "admin.hover.tests.view":
      "Öppna den här testmatchen för att se och skriva in dess resultat",
    "admin.hover.teams.view":
      "Öppna det här laget för att se och hantera dess spelare",
    "admin.hover.dialog.player.add": "Lägg till spelaren i turneringen",
    "admin.hover.dialog.player.save": "Spara ändringarna för den här spelaren",
    "admin.hover.dialog.team.add": "Lägg till laget i turneringen",
    "admin.hover.dialog.team.save": "Spara ändringarna för det här laget",
    "admin.hover.dialog.test.add": "Lägg till testmatchen i turneringen",
    "admin.hover.dialog.test.save": "Spara ändringarna för den här testmatchen",
    "admin.hover.dialog.competition.add": "Lägg till tävlingen i turneringen",
    "admin.hover.dialog.competition.save":
      "Spara ändringarna för den här tävlingen",
    "admin.hover.dialog.score.add": "Lägg till resultatet i tävlingen",
    "admin.hover.dialog.score.save": "Spara rättelsen av det här resultatet",
    "admin.hover.dialog.carryForward.save":
      "För över den här spelarens resultat",
    "admin.hover.dialog.tournament.new": "Skapa den här turneringen",
    "admin.hover.dialog.tournament.edit":
      "Spara ändringarna för den här turneringen",
    "admin.hover.modal.cancel": "Stäng utan att spara något",
    "admin.hover.modal.ok": "Stäng meddelandet",
    "admin.hover.tab": "Visa fliken {name}",
    "admin.hover.tournaments.archive":
      "Arkivera den här turneringen; den kan återställas",
    "admin.hover.tournaments.restore":
      "Hämta tillbaka den här arkiverade turneringen",
    "admin.hover.players.add": "Lägg till en spelare i den här turneringen",
    "admin.hover.players.edit": "Ändra den här spelarens uppgifter",
    "admin.hover.players.up": "Flytta spelaren uppåt i listan",
    "admin.hover.players.down": "Flytta spelaren nedåt i listan",
    "admin.hover.players.archive":
      "Arkivera den här spelaren; spelaren kan återställas",
    "admin.hover.players.restore": "Hämta tillbaka den här arkiverade spelaren",
    "admin.hover.teams.add": "Lägg till ett lag i den här turneringen",
    "admin.hover.teams.edit": "Ändra det här lagets uppgifter",
    "admin.hover.teams.up": "Flytta laget uppåt i listan",
    "admin.hover.teams.down": "Flytta laget nedåt i listan",
    "admin.hover.teams.archive": "Arkivera det här laget; det kan återställas",
    "admin.hover.teams.restore": "Hämta tillbaka det här arkiverade laget",
    "admin.hover.competitions.add":
      "Lägg till en tävling i den här turneringen",
    "admin.hover.competitions.edit": "Ändra den här tävlingens uppgifter",
    "admin.hover.competitions.up": "Flytta tävlingen uppåt i listan",
    "admin.hover.competitions.down": "Flytta tävlingen nedåt i listan",
    "admin.hover.competitions.archive":
      "Arkivera den här tävlingen; den kan återställas",
    "admin.hover.competitions.restore":
      "Hämta tillbaka den här arkiverade tävlingen",
    "admin.hover.tests.add": "Lägg till en testmatch mellan två lag",
    "admin.hover.tests.edit": "Ändra den här testmatchens uppgifter",
    "admin.hover.tests.up": "Flytta testmatchen uppåt i listan",
    "admin.hover.tests.down": "Flytta testmatchen nedåt i listan",
    "admin.hover.tests.archive":
      "Arkivera den här testmatchen; den kan återställas",
    "admin.hover.tests.restore":
      "Hämta tillbaka den här arkiverade testmatchen",
    "admin.hover.tests.toTeams":
      "Gå till fliken Lag för att lägga till de lag en testmatch behöver",
    "admin.hover.scores.add": "Lägg till resultatet av ett parti i tävlingen",
    "admin.hover.scores.edit": "Rätta det här resultatet",
    "admin.hover.scores.archive":
      "Arkivera det här resultatet så att det slutar räknas; det kan återställas",
    "admin.hover.scores.restore":
      "Hämta tillbaka det här arkiverade resultatet, så att det räknas igen",
    "admin.hover.scores.withdraw":
      "Behåll det här resultatet i listan men låt det sluta räknas",
    "admin.hover.scores.unwithdraw":
      "Låt det här tillbakadragna resultatet räknas igen",
    "admin.hover.scores.up": "Flytta resultatet tidigare i listan",
    "admin.hover.scores.down": "Flytta resultatet senare i listan",
    "admin.hover.competitionPlayers.add":
      "Lägg den valda spelaren i den här tävlingen",
    "admin.hover.competitionPlayers.up": "Flytta spelaren uppåt i listan",
    "admin.hover.competitionPlayers.down": "Flytta spelaren nedåt i listan",
    "admin.hover.competitionPlayers.remove": "Ta bort spelaren från tävlingen",
    "admin.hover.competitionPlayers.withdraw":
      "Dra tillbaka spelaren från tävlingen",
    "admin.hover.competitionPlayers.unwithdraw":
      "Sätt tillbaka den tillbakadragna spelaren i tävlingen",
    "admin.hover.competitionPlayers.carryForward":
      "För över spelarens resultat från en annan tävling",
    "admin.hover.notes.add": "Skriv en ny anteckning för den här turneringen",
    "admin.hover.notes.edit": "Ändra den här anteckningen",
    "admin.hover.notes.delete": "Ta bort den här anteckningen",
    "admin.hover.note.add":
      "Spara den här anteckningen och lägg till den i turneringen",
    "admin.hover.note.save": "Spara ändringarna i den här anteckningen",
    "admin.hover.people.add": "Ge personen rollen",
    "admin.hover.people.remove": "Ta bort rollen från personen",
    "admin.hover.worldRankings.import":
      "Hämta världsrankingen och lägg till dess spelare",
    "admin.modal.cancel": "Avbryt",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "E-postadress",
    "admin.people.remove": "Ta bort",
    "admin.people.otherwise": "Det gick inte att göra.",
    "admin.managers.you": "Du",
    "admin.managers.add": "Lägg till turneringsledare",
    "admin.managers.none": "Inga turneringsledare",
    "admin.managers.removeTitle": "Ta bort turneringsledare",
    "admin.managers.removeExplanation":
      "{name} kommer inte längre att kunna leda den här turneringen.",
    "admin.managers.removeYourself.explanation":
      "Du kommer inte längre att kunna leda den här turneringen, och ingen här kan ångra det åt dig. En annan turneringsledare kan göra dig till turneringsledare igen.",
    "admin.managers.otherwise":
      "Den adressen kan inte göras till turneringsledare.",
    "admin.competitionPlayers.add": "Lägg till spelare",
    "admin.competitionPlayers.otherwise":
      "Den här spelaren kan inte läggas till.",
    "admin.competitionPlayers.choose": "Spelare att lägga till",
    "admin.competitionPlayers.nobody": "Välj en spelare",
    "admin.competitionPlayers.bye": "Frilott",
    "admin.competitionPlayers.all": "Alla spelare är med i tävlingen",
    "admin.competitionPlayers.none": "Inga spelare",
    "admin.competitionPlayers.up": "Upp",
    "admin.competitionPlayers.down": "Ned",
    "admin.competitionPlayers.remove": "Ta bort",
    "admin.competitionPlayers.withdraw": "Dra tillbaka",
    "admin.competitionPlayers.unwithdraw": "Ta tillbaka",
    "admin.competitionPlayers.withdrawn": "Tillbakadragna spelare",
    "admin.competitionPlayers.removeTitle": "Ta bort spelare",
    "admin.competitionPlayers.removeQuestion":
      "{name} tas bort från tävlingen. Det kan inte ångras.",
    "admin.competitionPlayers.withdrawTitle": "Dra tillbaka spelare",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} spelar inte mer i tävlingen, och de partier som inte har spelats avgörs utan spelaren.",
    "admin.competitionPlayers.carryForward": "För över resultat",
    "admin.carryForward.title": "För över resultat - {name}",
    "admin.carryForward.save": "Spara",
    "admin.carryForward.otherwise":
      "Det här överförda resultatet kan inte sparas.",
    "admin.carryForward.matchWins": "Vunna matcher",
    "admin.carryForward.matchLosses": "Förlorade matcher",
    "admin.carryForward.gameWins": "Vunna partier",
    "admin.carryForward.gameLosses": "Förlorade partier",
    "admin.carryForward.hoopsFor": "Bågar för",
    "admin.carryForward.hoopsAgainst": "Bågar emot",
    "CarryForward.MatchWinsNotWhole": "Ange ett helt antal vunna matcher.",
    "CarryForward.MatchWinsBelowZero": "Ange 0 eller fler vunna matcher.",
    "CarryForward.MatchLossesNotWhole":
      "Ange ett helt antal förlorade matcher.",
    "CarryForward.MatchLossesBelowZero": "Ange 0 eller fler förlorade matcher.",
    "CarryForward.GameWinsNotWhole": "Ange ett helt antal vunna partier.",
    "CarryForward.GameWinsBelowZero": "Ange 0 eller fler vunna partier.",
    "CarryForward.GameLossesNotWhole": "Ange ett helt antal förlorade partier.",
    "CarryForward.GameLossesBelowZero": "Ange 0 eller fler förlorade partier.",
    "CarryForward.HoopsForNotWhole": "Ange ett helt antal bågar för.",
    "CarryForward.HoopsForBelowZero": "Ange 0 eller fler bågar för.",
    "CarryForward.HoopsAgainstNotWhole": "Ange ett helt antal bågar emot.",
    "CarryForward.HoopsAgainstBelowZero": "Ange 0 eller fler bågar emot.",
    "admin.scores.add": "Lägg till resultat",
    "admin.scores.none": "Inga resultat",
    "admin.scores.edit": "Redigera",
    "admin.scores.drawNotFilledTitle": "Lottningen är inte fylld",
    "admin.scores.archive": "Arkivera",
    "admin.scores.up": "Upp",
    "admin.scores.down": "Ned",
    "admin.scores.restore": "Återställ",
    "admin.scores.archived": "Arkiverade resultat",
    "admin.scores.archivedSaid": "Arkiverat",
    "admin.scores.withdraw": "Dra tillbaka",
    "admin.scores.unwithdraw": "Ta tillbaka",
    "admin.scores.withdrawnSaid": "Tillbakadraget",
    "admin.scores.otherwise": "Det gick inte att göra.",
    "admin.score.title": "Lägg till resultat",
    "admin.score.add": "Lägg till parti",
    "admin.score.winner": "Vinnare",
    "admin.score.winnerScore": "Vinnarens resultat",
    "admin.score.loser": "Förlorare",
    "admin.score.loserScore": "Förlorarens resultat",
    "admin.score.beat": "besegrade",
    "admin.score.added": "Partiet som {winner} vann mot {loser} lades till.",
    "admin.score.otherwise": "Partiet kunde inte läggas till.",
    "admin.score.correctTitle": "Redigera resultat",
    "admin.score.save": "Spara",
    "admin.score.notCorrected": "Resultatet kunde inte rättas.",
    "Game.WinnerMissing": "Välj vinnaren.",
    "Game.WinnerScoreMissing": "Skriv in vinnarens resultat.",
    "Game.LoserMissing": "Välj förloraren.",
    "Game.LoserScoreMissing": "Skriv in förlorarens resultat.",
    "Score.NoPoints": "Ett resultat börjar med sitt antal poäng.",
    "Game.SamePlayer": "Ingen spelar mot sig själv.",
    "Game.WinnerNotAhead":
      "Vinnarens resultat måste vara högre än förlorarens, eller markeras som vunnet.",
    "Game.LoserMarked": "Förlorarens resultat kan inte markeras som vunnet.",
    "Game.ResultChanged":
      "En rättelse behåller utgången: ett vunnet parti förblir vunnet, och ett oavgjort parti förblir oavgjort.",
    "Competition.MatchDecided": "Deras match är redan avgjord.",
    "Competition.DrawFull":
      "Spelaren kan inte läggas till eftersom utslagsturneringen är full.",
    "Competition.DrawNotFilled":
      "Resultat kan inte läggas till förrän varje plats i utslagsturneringen är fylld med en spelare eller en frilott.",
    "Competition.ByeOutsideKnockout":
      "Bara en utslagsturnering kan ha en frilott.",
    "Competition.NotDrawnToMeet":
      "De här spelarna är för närvarande inte lottade att möta varandra i utslagsturneringen.",
    "Competition.WinnerHasPlayedOn":
      "Vinnaren av den här matchen har redan spelat sitt nästa parti, så vem som vann den kan inte ändras.",
    "CompetitionPlayer.Withdrawn": "En tillbakadragen spelare spelar inte mer.",
    "admin.players.add": "Lägg till spelare",
    "admin.players.none": "Inga spelare",
    "admin.players.edit": "Redigera",
    "admin.players.archive": "Arkivera",
    "admin.players.restore": "Återställ",
    "admin.players.up": "Upp",
    "admin.players.down": "Ned",
    "admin.players.archiveTitle": "Arkivera spelare",
    "admin.players.archiveQuestion": "{name} tas bort från de här tävlingarna:",
    "admin.players.archive.explanation":
      "Om spelaren återställs hamnar den inte tillbaka i de här tävlingarna.",
    "admin.players.archived": "Arkiverade spelare",
    "admin.players.archivedSaid": "Arkiverad",
    "admin.player.addTitle": "Lägg till spelare",
    "admin.player.editTitle": "Redigera spelare",
    "admin.player.name": "Namn",
    "admin.player.representing": "Representerar",
    "admin.player.worldRankingName": "Spelarens namn i världsrankingen",
    "admin.player.worldRankingKnown":
      "Världsrankingen känner till det här namnet.",
    "admin.player.worldRankingQuestioned":
      "Världsrankingen har ingen spelare med det här namnet. Det kan vara felstavat, eller så kan spelaren vara ny i rankingen.",
    "admin.player.flag": "Flagga",
    "admin.player.add": "Lägg till",
    "admin.player.save": "Spara",
    "admin.player.added": "{name} lades till.",
    "admin.player.otherwise": "Den här spelaren kan inte sparas som den är.",
    "Tournament.PlayerNameTaken":
      "En annan spelare i den här turneringen har redan det namnet.",
    "TournamentPlayer.NoSuchFlag": "Välj en av de flaggor som finns.",
    "TournamentPlayer.NamedBye": "En spelare kan inte heta Frilott.",
    "TournamentPlayer.NoLetterOrDigit":
      "Ett namn måste innehålla en bokstav eller en siffra.",
    "admin.player.byesTitle": "Frilotter behöver inte läggas till",
    "admin.player.byes":
      "En frilott är ingen av turneringens spelare. En utslagsturnering erbjuder Frilott varje gång dess spelare läggs till, så många gånger som lottningen behöver.",
    "admin.view.teams": "Lag",
    "admin.view.tests": "Testmatcher",
    "admin.teams.add": "Lägg till lag",
    "admin.teams.none": "Inga lag",
    "admin.teams.edit": "Redigera",
    "admin.teams.view": "Visa",
    "admin.teams.archive": "Arkivera",
    "admin.teams.restore": "Återställ",
    "admin.teams.up": "Upp",
    "admin.teams.down": "Ned",
    "admin.teams.archived": "Arkiverade lag",
    "admin.teams.archivedSaid": "Arkiverat",
    "admin.team.addTitle": "Lägg till lag",
    "admin.team.editTitle": "Redigera lag",
    "admin.team.name": "Namn",
    "admin.team.shortName": "Kortnamn",
    "admin.team.shortName.explanation":
      "Det som lagets testmatcher kallas med, till exempel AUS v ENG.",
    "admin.team.flag": "Flagga",
    "admin.team.add": "Lägg till",
    "admin.team.save": "Spara",
    "admin.team.added": "{name} lades till.",
    "admin.team.otherwise": "Det här laget kan inte sparas som det är.",
    "admin.teamView.otherwise": "Det här laget kan inte visas härifrån.",
    "admin.teamView.players": "Spelare",
    "TeamName.Missing": "Ange vad laget heter.",
    "TeamName.TooLong": "Det namnet är för långt.",
    "admin.notes.add": "Lägg till anteckning",
    "admin.notes.none": "Inga anteckningar",
    "admin.notes.edit": "Redigera",
    "admin.notes.delete": "Ta bort",
    "admin.notes.deleteTitle": "Ta bort anteckning",
    "admin.notes.deleteQuestion": "Ta bort anteckningen ”{title}”?",
    "admin.notes.delete.explanation":
      "En borttagen anteckning är borta för alltid och kan inte hämtas tillbaka.",
    "admin.notes.otherwise": "Det gick inte att göra.",
    "admin.note.addTitle": "Lägg till anteckning",
    "admin.note.editTitle": "Redigera anteckning",
    "admin.note.title": "Rubrik",
    "admin.note.description": "Beskrivning",
    "admin.note.write": "Skriv",
    "admin.note.preview": "Förhandsgranska",
    "admin.note.toolbar": "Formatering",
    "admin.note.tool.heading": "Rubrik",
    "admin.note.tool.bold": "Fet stil",
    "admin.note.tool.italic": "Kursiv stil",
    "admin.note.tool.quote": "Citat",
    "admin.note.tool.code": "Kod",
    "admin.note.tool.link": "Länk",
    "admin.note.tool.numberedList": "Numrerad lista",
    "admin.note.tool.bulletedList": "Punktlista",
    "admin.note.tool.taskList": "Uppgiftslista",
    "admin.note.add": "Lägg till",
    "admin.note.save": "Spara",
    "admin.note.otherwise": "Den här anteckningen kan inte sparas som den är.",
    "ManagerNoteTitle.Missing": "Ge anteckningen en rubrik.",
    "ManagerNoteTitle.TooLong": "Den rubriken är för lång.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "En rubrik måste innehålla en bokstav eller en siffra.",
    "ManagerNoteDescription.TooLong": "Den beskrivningen är för lång.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Den anteckningen finns inte längre. En annan turneringsledare kan ha tagit bort den.",
    "EditManagerNote.NoSuchManagerNote":
      "Den anteckningen finns inte längre. En annan turneringsledare kan ha tagit bort den.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Den anteckningen finns inte längre. En annan turneringsledare kan ha tagit bort den.",
    "ManagerNote.Deleted":
      "Den anteckningen har tagits bort. En annan turneringsledare kan ha tagit bort den.",
    "CommentaryTitle.Missing": "Ge livekommentaren en rubrik.",
    "CommentaryTitle.TooLong": "Den rubriken är för lång.",
    "CommentaryTitle.NoLetterOrDigit":
      "En rubrik måste innehålla en bokstav eller en siffra.",
    "Commentary.TitleTaken": "En annan livekommentar har redan den rubriken.",
    "CommentText.Missing": "Skriv något i kommentaren.",
    "CommentText.TooLong": "Den kommentaren är för lång.",
    "TeamShortName.Missing": "Ge laget ett kortnamn.",
    "TeamShortName.TooLong": "Ett kortnamn får vara högst 10 tecken långt.",
    "TeamShortName.NoLetterOrDigit":
      "Ett kortnamn måste innehålla en bokstav eller en siffra.",
    "Team.ShortNameLongerThanName":
      "Ett kortnamn kan inte vara längre än lagets namn.",
    "Team.NoSuchFlag": "Välj en av de flaggor som finns.",
    "Team.Archived": "Det laget är arkiverat och måste återställas först.",
    "Team.InATest": "Det laget spelar i en testmatch och kan inte arkiveras.",
    "Team.PlayerNameTaken":
      "En annan spelare i det här laget har redan det namnet.",
    "TeamPlayer.NamedBye": "En spelare kan inte heta Frilott.",
    "TeamPlayer.Archived":
      "Den spelaren är arkiverad och måste återställas först.",
    "TeamPlayer.HasGames": "Den spelaren har spelat och kan inte arkiveras.",
    "Tournament.TeamNameTaken":
      "Ett annat lag i den här turneringen har redan det namnet.",
    "Tournament.TeamShortNameTaken":
      "Ett annat lag i den här turneringen har redan det kortnamnet.",
    "Tournament.NoSuchTeam":
      "Den här turneringen har inget lag på den här adressen.",
    "Tournament.TeamArchived":
      "Det här laget är arkiverat och kan bara återställas från fliken Lag.",
    "admin.tests.add": "Lägg till testmatch",
    "admin.tests.none": "Inga testmatcher",
    "admin.tests.edit": "Redigera",
    "admin.tests.view": "Visa",
    "admin.tests.archive": "Arkivera",
    "admin.tests.restore": "Återställ",
    "admin.tests.up": "Upp",
    "admin.tests.down": "Ned",
    "admin.tests.archived": "Arkiverade testmatcher",
    "admin.tests.twoTeamsNeeded":
      "En testmatch spelas mellan två lag, så två lag behövs först.",
    "admin.tests.toTeams": "Gå till Lag",
    "admin.tests.matches.one": "{count} match",
    "admin.tests.matches.other": "{count} matcher",
    "admin.tests.bestOf": "bäst av {games}",
    "admin.tests.otherwise": "Det gick inte att göra.",
    "admin.test.addTitle": "Lägg till testmatch",
    "admin.test.editTitle": "Redigera testmatch",
    "admin.test.firstTeam": "Lag A",
    "admin.test.secondTeam": "Lag B",
    "admin.test.versus": "v",
    "admin.test.starts": "Startar",
    "admin.test.finishes": "Slutar",
    "admin.test.expectedMatches": "Förväntade matcher",
    "admin.test.bestOf": "Bäst av",
    "admin.test.group": "Grupp",
    "admin.test.add": "Lägg till",
    "admin.test.save": "Spara",
    "admin.test.added": "{name} lades till.",
    "admin.test.otherwise": "Den här testmatchen kan inte sparas som den är.",
    "admin.testView.otherwise": "Den här testmatchen kan inte visas härifrån.",
    "AddTest.FirstTeamMissing": "Välj det första laget.",
    "AddTest.SecondTeamMissing": "Välj det andra laget.",
    "UpdateTest.FirstTeamMissing": "Välj det första laget.",
    "UpdateTest.SecondTeamMissing": "Välj det andra laget.",
    "ExpectedMatches.NotWhole": "Ange ett helt antal matcher.",
    "ExpectedMatches.TooSmall":
      "En testmatch måste förväntas ha minst 1 match.",
    "TestGroup.TooLong": "Den gruppen är för lång.",
    "Tournament.TestAgainstItself":
      "Ett lag spelar inte testmatch mot sig självt.",
    "Tournament.TestFinishesBeforeStarts":
      "En testmatch kan inte sluta innan den startar.",
    "Tournament.TestStartsBeforeTournament":
      "En testmatch kan inte starta före sin turnering.",
    "Tournament.TestFinishesAfterTournament":
      "En testmatch kan inte sluta efter sin turnering.",
    "Tournament.TestHasGamesInUse":
      "Den här testmatchen har partier, så den kan inte arkiveras förrän de är arkiverade.",
    "Tournament.TestHasGames":
      "Den här testmatchen har nu partier, så dess lag kan inte längre ändras.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Fler matcher än så har redan startat.",
    "Tournament.BestOfBelowGamesPlayed":
      "Två spelare har redan spelat fler partier än så.",
    "Competition.ExpectedMatchesReached":
      "Den här testmatchen har startat lika många matcher som den förväntas ha.",
    "Competition.SameTeam": "Två spelare i samma lag spelar inte mot varandra.",
    "AddManager.NoSuchAccount":
      "Den adressen har inget konto som kan göras till turneringsledare.",
    "admin.scorers.add": "Lägg till resultatförare",
    "admin.scorers.none": "Inga resultatförare",
    "admin.scorers.removeTitle": "Ta bort resultatförare",
    "admin.scorers.removeExplanation":
      "{name} kommer inte längre att kunna skriva in den här turneringens resultat.",
    "admin.scorers.otherwise":
      "Den adressen kan inte göras till resultatförare.",
    "AddScorer.NoSuchAccount":
      "Den adressen har inget konto som kan göras till resultatförare.",
    "Account.NotAnAdministrator": "Bara en administratör kan göra det.",
    "AddRole.NoSuchAccount": "Den adressen har inget konto som kan få rollen.",
    "AddRole.NoSuchRole": "Det finns ingen sådan roll.",
    "RemoveRole.NoSuchAccount": "Det finns inget sådant konto.",
    "RemoveRole.NoSuchRole": "Det finns ingen sådan roll.",
    "RemoveRole.Yourself":
      "Du kan inte ta rollen administratör från dig själv.",
    "AccountsWithRole.NoSuchRole": "Det finns ingen sådan roll.",
    "Tournament.AlreadyAManager":
      "Det kontot leder redan turneringen och kan göra allt en resultatförare kan.",

    "TournamentName.Missing": "Ange vad turneringen heter.",
    "TournamentName.TooShort": "Det namnet är för kort.",
    "TournamentName.TooLong": "Det namnet är för långt.",
    "TournamentName.AllLowerCase": "Ett namn skrivs inte helt med gemener.",
    "TournamentName.AllCapitals": "Ett namn skrivs inte helt med versaler.",
    "TournamentName.NoLetterOrDigit":
      "Ett namn måste innehålla en bokstav eller en siffra.",
    "ReadOnlyDate.Unreadable": "Ange dagen.",
    "Tournament.FinishesBeforeStarts":
      "En turnering kan inte sluta innan den startar.",
    "Tournament.StartsAfterNextYear":
      "En turnering kan inte starta efter nästa år.",
    "Tournament.FinishesAfterNextYear":
      "En turnering kan inte sluta efter nästa år.",
    "CreateTournament.NoSuchCountry": "Välj landet.",
    "TournamentSubtitle.TooLong":
      "En underrubrik får vara högst 2000 tecken lång.",
    "Tournament.NotAManager":
      "Bara en turneringsledare för den här turneringen kan ändra den.",
    "Tournament.NotAManagerOrScorer":
      "Bara en turneringsledare eller resultatförare för den här turneringen kan se den.",
    "Tournament.Archived":
      "Den här turneringen är arkiverad och återställs innan den kan ändras.",
    "UpdateTournament.NoSuchTournament":
      "Det finns ingen turnering på den här adressen.",

    // The sports and formats that have no established Swedish name keep the
    // English one, and a format named for a competition keeps its name.
    "sport.ac": "Associationscroquet",
    "sport.gc": "Golfcroquet",
    "sport.a6w": "Amerikansk 6-bågars croquet",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Lag",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Förenade Arabemiraten",
    "country.af": "Afghanistan",
    "country.ag": "Antigua och Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanien",
    "country.am": "Armenien",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Amerikanska Samoa",
    "country.at": "Österrike",
    "country.au": "Australien",
    "country.aw": "Aruba",
    "country.ax": "Åland",
    "country.az": "Azerbajdzjan",
    "country.ba": "Bosnien och Hercegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesh",
    "country.be": "Belgien",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarien",
    "country.bh": "Bahrain",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Brunei",
    "country.bo": "Bolivia",
    "country.br": "Brasilien",
    "country.bs": "Bahamas",
    "country.bt": "Bhutan",
    "country.bv": "Bouvetön",
    "country.bw": "Botswana",
    "country.by": "Belarus",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalonien",
    "country.cc": "Kokosöarna",
    "country.cd": "Demokratiska republiken Kongo",
    "country.cf": "Centralafrikanska republiken",
    "country.cg": "Republiken Kongo",
    "country.ch": "Schweiz",
    "country.ci": "Elfenbenskusten",
    "country.ck": "Cooköarna",
    "country.cl": "Chile",
    "country.cm": "Kamerun",
    "country.cn": "Kina",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Kuba",
    "country.cv": "Kap Verde",
    "country.cx": "Julön",
    "country.cy": "Cypern",
    "country.cz": "Tjeckien",
    "country.de": "Tyskland",
    "country.dj": "Djibouti",
    "country.dk": "Danmark",
    "country.dm": "Dominica",
    "country.do": "Dominikanska republiken",
    "country.dz": "Algeriet",
    "country.ec": "Ecuador",
    "country.ee": "Estland",
    "country.eg": "Egypten",
    "country.eh": "Västsahara",
    "country.england": "England",
    "country.er": "Eritrea",
    "country.es": "Spanien",
    "country.et": "Etiopien",
    "country.fi": "Finland",
    "country.fj": "Fiji",
    "country.fk": "Falklandsöarna",
    "country.fm": "Mikronesien",
    "country.fo": "Färöarna",
    "country.fr": "Frankrike",
    "country.ga": "Gabon",
    "country.gb": "Storbritannien",
    "country.gd": "Grenada",
    "country.ge": "Georgien",
    "country.gf": "Franska Guyana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Grönland",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadeloupe",
    "country.gq": "Ekvatorialguinea",
    "country.gr": "Grekland",
    "country.gs": "Sydgeorgien och Sydsandwichöarna",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heard- och McDonaldöarna",
    "country.hn": "Honduras",
    "country.hr": "Kroatien",
    "country.ht": "Haiti",
    "country.hu": "Ungern",
    "country.id": "Indonesien",
    "country.ie": "Irland",
    "country.il": "Israel",
    "country.im": "Isle of Man",
    "country.in": "Indien",
    "country.io": "Brittiska territoriet i Indiska oceanen",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Island",
    "country.it": "Italien",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Jordanien",
    "country.jp": "Japan",
    "country.ke": "Kenya",
    "country.kg": "Kirgizistan",
    "country.kh": "Kambodja",
    "country.ki": "Kiribati",
    "country.km": "Komorerna",
    "country.kn": "Saint Kitts och Nevis",
    "country.kp": "Nordkorea",
    "country.kr": "Sydkorea",
    "country.kw": "Kuwait",
    "country.ky": "Caymanöarna",
    "country.kz": "Kazakstan",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Litauen",
    "country.lu": "Luxemburg",
    "country.lv": "Lettland",
    "country.ly": "Libyen",
    "country.ma": "Marocko",
    "country.mc": "Monaco",
    "country.md": "Moldavien",
    "country.me": "Montenegro",
    "country.mg": "Madagaskar",
    "country.mh": "Marshallöarna",
    "country.mk": "Nordmakedonien",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongoliet",
    "country.mo": "Macao",
    "country.mp": "Nordmarianerna",
    "country.mq": "Martinique",
    "country.mr": "Mauretanien",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maldiverna",
    "country.mw": "Malawi",
    "country.mx": "Mexiko",
    "country.my": "Malaysia",
    "country.mz": "Moçambique",
    "country.na": "Namibia",
    "country.nc": "Nya Kaledonien",
    "country.ne": "Niger",
    "country.nf": "Norfolkön",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Nederländerna",
    "country.no": "Norge",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nya Zeeland",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Franska Polynesien",
    "country.pg": "Papua Nya Guinea",
    "country.ph": "Filippinerna",
    "country.pk": "Pakistan",
    "country.pl": "Polen",
    "country.pm": "Saint-Pierre och Miquelon",
    "country.pn": "Pitcairnöarna",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "Réunion",
    "country.ro": "Rumänien",
    "country.rs": "Serbien",
    "country.ru": "Ryssland",
    "country.rw": "Rwanda",
    "country.sa": "Saudiarabien",
    "country.sb": "Salomonöarna",
    "country.sc": "Seychellerna",
    "country.scotland": "Skottland",
    "country.sd": "Sudan",
    "country.se": "Sverige",
    "country.sg": "Singapore",
    "country.sh": "Sankt Helena",
    "country.si": "Slovenien",
    "country.sj": "Svalbard och Jan Mayen",
    "country.sk": "Slovakien",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Surinam",
    "country.st": "São Tomé och Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Syrien",
    "country.sz": "Eswatini",
    "country.tc": "Turks- och Caicosöarna",
    "country.td": "Tchad",
    "country.tf": "Franska sydterritorierna",
    "country.tg": "Togo",
    "country.th": "Thailand",
    "country.tj": "Tadzjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Östtimor",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunisien",
    "country.to": "Tonga",
    "country.tr": "Turkiet",
    "country.tt": "Trinidad och Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzania",
    "country.ua": "Ukraina",
    "country.ug": "Uganda",
    "country.um": "USA:s mindre öar i Oceanien och Västindien",
    "country.us": "USA",
    "country.uy": "Uruguay",
    "country.uz": "Uzbekistan",
    "country.va": "Vatikanstaten",
    "country.vc": "Saint Vincent och Grenadinerna",
    "country.ve": "Venezuela",
    "country.vg": "Brittiska Jungfruöarna",
    "country.vi": "Amerikanska Jungfruöarna",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wales",
    "country.wf": "Wallis och Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Sydafrika",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    // The emails are written in Swedish rather than translated line by line;
    // the placeholders each fills in are english.ts's, and say there what
    // they are.
    "Email.ConfirmAddress.subject": "Bekräfta din e-postadress för {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hej,</p>

<p>
    Tack för att du skapade ett konto hos <strong>{siteName}</strong>.<br />
    Innan du kan börja använda ditt konto behöver du bekräfta din e-postadress genom
    att klicka på knappen nedan:
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
        Bekräfta min e-postadress
    </a>
</p>

<p>
    Om knappen inte fungerar kan du också bekräfta din e-postadress genom att öppna den här länken i webbläsaren:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Om du inte skapade det här kontot kan du bortse från det här e-postmeddelandet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "En ny länk för att bekräfta din e-postadress för {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hej,</p>

<p>
    Du har nyligen bett om ett nytt e-postmeddelande för att bekräfta din e-postadress för <strong>{siteName}</strong>.<br />
    Bekräfta din e-postadress genom att klicka på knappen nedan:
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
        Bekräfta min e-postadress
    </a>
</p>

<p>
    Om knappen inte fungerar kan du också bekräfta din e-postadress genom att öppna den här länken i webbläsaren:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    När den är bekräftad kan du fortsätta använda ditt konto utan avbrott.
</p>

<p>
    Om du inte bad om det här e-postmeddelandet kan du bortse från det.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Någon försökte registrera sig med din e-postadress",
    "Email.AlreadyRegistered.body": `
<p>Hej,</p>

<p>
    Någon försökte registrera sig hos <strong>{siteName}</strong> med den här
    e-postadressen, som redan har ett konto. Ingenting har ändrats på ditt
    konto.<br />
    Om det var du har du redan ett konto och kan logga in på det:
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
        Logga in
    </a>
</p>

<p>
    Om du har glömt ditt lösenord kan du återställa det här:
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
        Glömt lösenord
    </a>
</p>

<p>
    Om det inte var du behöver du inte göra något. Ingen har fått en väg in på
    ditt konto.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bekräfta flytten av ditt konto på {siteName} till den här adressen",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hej,</p>

<p>
    Någon som var inloggad på ett konto hos <strong>{siteName}</strong> bad om att
    flytta det till den här e-postadressen. Om det var du, bekräfta det här,
    inloggad på det kontot. Länken fungerar i 24 timmar.
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
        Flytta mitt konto
    </a>
</p>

<p>
    Eller kopiera den här adressen till webbläsaren:<br />
    {link}
</p>

<p>
    Om det inte var du behöver du inte göra något. Inget konto flyttas hit.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Någon bad om att flytta ett konto till din e-postadress",
    "Email.AlreadyHasAnAccount.body": `
<p>Hej,</p>

<p>
    Någon som var inloggad på ett konto hos <strong>{siteName}</strong> bad om att
    flytta det till den här e-postadressen, som redan har ett eget konto.
    Ingenting har flyttats, och ingenting har ändrats på ditt konto.
</p>

<p>
    Om det var du har du redan ett konto på den här adressen och kan logga in
    på det.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Ditt konto på {siteName} har flyttats",
    "Email.EmailAddressChanged.body": `
<p>Hej,</p>

<p>
    Ditt konto hos <strong>{siteName}</strong> flyttades nyss till en annan
    e-postadress, {emailAddress}, och du loggar in med den adressen från och med nu.
</p>

<p>
    Om det inte var du har någon annan tillgång till ditt konto. Svara på det här
    e-postmeddelandet och berätta för oss.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Ditt lösenord på {siteName} ändrades",
    "Email.PasswordChanged.body": `
<p>Hej,</p>

<p>
    Lösenordet till ditt konto hos <strong>{siteName}</strong> ändrades nyss, och
    alla andra webbläsare som var inloggade på det loggades ut.<br />
    Om det var du behöver du inte göra något.
</p>

<p>
    Om det inte var du har någon annan ditt lösenord. Ange ett nytt här, så
    loggas de ut:
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
        Glömt lösenord
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Ange ett nytt lösenord för {siteName}",
    "Email.SetNewPassword.body": `
<p>Hej,</p>

<p>
    Du har nyligen bett om att återställa ditt lösenord för <strong>{siteName}</strong>.<br />
    Du kan återställa ditt lösenord genom att klicka på knappen nedan:
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
        Återställ lösenord
    </a>
</p>

<p>
    Om knappen inte fungerar kan du också återställa ditt lösenord genom att öppna den här länken i webbläsaren:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Om du inte bad om att få återställa lösenordet kan du bortse från det här e-postmeddelandet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Ange ett lösenord för {siteName}",
    "Email.SetPassword.body": `
<p>Hej,</p>

<p>
    Ditt konto hos <strong>{siteName}</strong> har inget lösenord: du loggar in med Google.<br />
    Du bad om att få ange ett, så att du också kan logga in med din e-postadress och ett lösenord.
    Du kan ange det genom att klicka på knappen nedan:
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
        Ange lösenord
    </a>
</p>

<p>
    Om knappen inte fungerar kan du också ange ditt lösenord genom att öppna den här länken i webbläsaren:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Länken fungerar i en timme. Om du inte bad om att få ange ett lösenord kan du bortse från det här e-postmeddelandet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Det finns inget konto hos {siteName} för den här e-postadressen",
    "Email.RegisterInstead.body": `
<p>Hej,</p>

<p>
    En begäran gjordes om att återställa lösenordet för en e-postadress som inte
    hör till något konto hos <strong>{siteName}</strong>.
</p>

<p>
    Om du vill använda vår tjänst kan du skapa ett nytt konto här:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Om du inte gjorde den här begäran kan du bortse från det här e-postmeddelandet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bekräfta att ditt konto på {siteName} ska glömmas",
    "Email.ConfirmForgetting.body": `
<p>Hej,</p>

<p>
    Du bad om att ditt konto hos <strong>{siteName}</strong> skulle
    glömmas.<br />
    Följ knappen nedan för att se vad det innebär, och för att säga säkert
    att du vill det:
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
        Glöm mitt konto
    </a>
</p>

<p>
    Om knappen inte fungerar kan du också öppna den här länken i webbläsaren:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    När kontot är glömt kan ditt namn och din e-postadress aldrig läsas igen, av
    någon, och det går inte att logga in på kontot. Det kan inte ångras.
</p>

<p>
    Länken fungerar en gång, till 15 minuter efter att du bad om den, och bara
    medan du är inloggad på det här kontot. Därefter får du be om en ny från
    ditt konto.
</p>

<p>
    Om du inte bad om det händer ingenting om inte länken följs. Någon som var
    inloggad på ditt konto bad dock om det, så ange ett nytt lösenord från sidan
    för glömt lösenord för att vara säker på att de inte kan logga in igen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registreringen är avstängd: {service} går inte att nå",
    "Email.RegistrationsSuspended.body": `
<p>Hej,</p>

<p>
    {siteName} kunde inte nå {service} klockan {when}. Tills den svarar får
    läsare som behöver den, för att registrera sig eller ange ett nytt lösenord,
    veta att de ska försöka igen senare.
</p>

<p>
    Inget behöver häva. Varje försök frågar {service} på nytt, och sidorna
    fungerar igen i samma stund som den svarar.
</p>

<p>
    Medan {service} ligger nere får du e-post om det högst en gång i timmen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
