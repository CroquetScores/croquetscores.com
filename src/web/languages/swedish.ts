// Svenska. Läsaren tiltalas med "du". Menyval, knappar och rubriker skrivs
// som vanliga svenska satser: bara första ordet har stor bokstav ("Byt
// e-postadress", inte "Byt E-postadress"). Vi säger "e-postadress" om adressen
// och "e-post" om själva meddelandet. Ord vi har bestämt oss för: turnering,
// tävling, block, utslagning, schweizer, bågar (hoops), match, parti (game),
// arkivera/återställ, ta bort (remove) och radera (delete). "Bye" behålls som
// på engelska, eftersom webbplatsen själv känner igen det ordet.
import type { Language } from "../common/language.js";

export const swedish: Language = {
  tag: "sv",
  name: "Svenska",
  words: {
    // Webbplatsens egna fält. Webbplatsens namn är inte ett ord i någons språk
    // och sätts därför in i uppmaningen som nämner det.
    "site.skipToContent": "Hoppa till innehållet",
    "navigation.menu": "Meny",
    "navigation.label": "Huvudmeny",
    "navigation.home": "Hem",
    "navigation.help": "Hjälp",
    "navigation.admin": "Admin",
    "sections.label": "Avsnitt",
    "theme.label": "Tema",
    "theme.light": "Ljust",
    "theme.dark": "Mörkt",
    "theme.system": "System",
    "footer.donate": "Donera",
    "footer.plea":
      "Gillar du {siteName}? Donera gärna och hjälp oss utveckla sidan vidare.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Integritet",
    "footer.termsOfUse": "Användarvillkor",
    "footer.reportBug": "Rapportera ett fel",
    "beta.banner":
      "Det här är en betawebbplats. Data kan nollställas när som helst.",
    "privacy.contact":
      "Frågor om den här sidan, eller om vad som sparas om dig: {emailAddress}",
    // Rutan som läsaren kryssar i för att godkänna användarvillkoren för dem
    // som skriver. Länkens ord letas upp i rutans ord och görs till länken,
    // så de måste skrivas exakt som där.
    "termsOfUse.agree": "Jag godkänner användarvillkoren",
    "termsOfUse.link": "användarvillkoren",
    // Under villkoren för dem som skriver, som privacy.contact står under
    // integritetstexten.
    "termsOfUse.report":
      "Anmäl vad som skrivits, eller fråga om villkoren: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Kryssa i rutan för att godkänna användarvillkoren.",
    // Sägs på varje sida på en prova-på-webbplats, under webbplatsfältet.
    "tryWebsite.banner":
      "Här kan du lära dig {siteName} utan risk. Allt som skrivs in här kan tas bort när som helst.",

    "language.label": "Språk",
    "language.choose": "Byt",

    // Aviseringen som talar om att det finns något nytt att läsa.
    "whatsNew.public.message": "Det finns något nytt att läsa.",
    "whatsNew.admin.message":
      "Det finns något nytt för dem som driver turneringar.",
    "whatsNew.view": "Visa vad som är nytt",
    "whatsNew.later": "Påminn mig nästa gång",
    "whatsNew.never": "Visa aldrig den här aviseringen igen",

    "form.otherwise":
      "Något här stämmer inte. Kontrollera vad du skrev och försök igen.",

    // Kontomenyn i sidhuvudet: vad personen står för, och alla val den öppnar.
    "account.menu": "Konto",
    "account.register": "Registrera dig",
    "account.signIn": "Logga in",
    "account.forgotPassword": "Glömt lösenord",
    "account.signOut": "Logga ut",
    "account.profile": "Profil",
    "account.changePassword": "Byt lösenord",
    "account.changeEmailAddress": "Byt e-postadress",
    "account.changeName": "Byt namn",
    "account.setPassword": "Skapa lösenord",
    "account.forgetAccount": "Glöm kontot",

    "register.title": "Registrera dig",
    "register.emailAddress": "E-postadress",
    "register.submit": "Registrera dig",
    "register.withGoogle": "Registrera dig med Google",
    "register.or": "eller",
    // Sägs ovanför formuläret när Google skickade tillbaka läsaren utan att
    // släppa in hen, var och en efter koden som vägen tillbaka gav. Både
    // registreringssidan och inloggningssidan säger dem, så de säger
    // "använd din e-postadress" i stället för att nämna vad varje formulär
    // gör med den.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google har inte bekräftat att den e-postadressen är din, så den kan inte användas med Google här. Använd din e-postadress nedan i stället.",
    "SignInWithGoogle.LinkedToAnother":
      "Den e-postadressen har redan ett konto, länkat till ett annat Google-konto. Logga in med det Google-kontot, eller med din e-postadress och ditt lösenord.",
    "SignInWithGoogle.NameMissing":
      "Google berättade inte vad du heter, och ett konto måste ha ett namn. Använd din e-postadress nedan i stället.",
    "Google.Unreachable":
      "Det gick inte att nå Google just nu. Försök igen om några minuter, eller använd din e-postadress nedan.",
    "Registration.NotAPerson":
      "Det här såg inte ut att komma från en människa. Försök igen, och om det fortsätter, vänta några minuter och kom tillbaka.",

    // En regel som adressen kan bryta, sagd under fältet den gäller.
    "EmailAddress.Missing": "Ange en e-postadress.",
    "EmailAddress.NoAt": "En e-postadress innehåller ett @.",
    "EmailAddress.MoreThanOneAt": "En e-postadress innehåller ett enda @.",
    "EmailAddress.NoDomain":
      "En e-postadress har en domän efter @, till exempel example.com.",

    "welcome.title": "Kolla din e-post",
    "welcome.checkEmail":
      "Ett e-postmeddelande är på väg till adressen du angav. Följ länken i det för att gå vidare.",
    "welcome.nothingArrived":
      "Om inget kommer inom några minuter, titta i skräpposten.",
    "welcome.home": "Tillbaka till {siteName}",
    "newConfirmationLink.title": "Hämta en ny länk",
    "newConfirmationLink.explanation":
      "Länken för att bekräfta din e-postadress har gått ut. Be om en ny, så skickas den till adressen du registrerade dig med.",
    "newConfirmationLink.send": "Skicka en ny länk till mig",
    "newConfirmationLink.home": "Tillbaka till {siteName}",
    "newConfirmationLink.signIn": "Logga in",
    "newConfirmationLink.sent.title": "Kolla din e-post",
    "newConfirmationLink.sent.explanation":
      "En ny länk är på väg. Följ den för att bekräfta din e-postadress. Om inget kommer inom några minuter, titta i skräpposten.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Den e-postadressen är redan bekräftad",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Det finns inget mer att bekräfta. Logga in med lösenordet du angav när du bekräftade den.",
    "newConfirmationLink.noLongerWorks.title":
      "Den länken fungerar inte längre",
    "newConfirmationLink.noLongerWorks.explanation":
      "Kontrollera att du följde hela länken från e-postmeddelandet, utan att något saknas i slutet. Fungerar den ändå inte, registrera dig igen så skickas en ny länk.",
    "newConfirmationLink.tooMany.title": "Försök igen senare",
    "newConfirmationLink.tooMany.explanation":
      "Flera länkar har nyligen skickats till den här adressen. Vänta en timme och be om en ny, och titta under tiden i skräpposten.",

    "forgotPassword.title": "Har du glömt ditt lösenord?",
    "forgotPassword.emailAddress": "E-postadress",
    "forgotPassword.submit": "Skicka mig en väg in",
    "forgotPassword.home": "Tillbaka till {siteName}",
    "forgotPassword.sent.title": "Kolla din e-post",
    "forgotPassword.sent.explanation":
      "Om den adressen har ett konto är en länk för att skapa ett nytt lösenord på väg. Följ den inom en timme. Om inget kommer inom några minuter, titta i skräpposten.",
    "forgotPassword.tryAgainLater":
      "För många vägar in har begärts härifrån på sistone. Vänta en timme och försök igen.",

    "setNewPassword.title": "Skapa ett nytt lösenord",
    "setNewPassword.password": "Lösenord",
    "setNewPassword.confirmPassword": "Bekräfta lösenordet",
    "setNewPassword.submit": "Spara mitt nya lösenord",
    "setNewPassword.home": "Tillbaka till {siteName}",
    "setNewPassword.signIn": "Logga in",
    "setNewPassword.askAgain": "Be om en ny länk",
    "setNewPassword.changed.title": "Ditt lösenord har ändrats",
    "setNewPassword.changed.explanation":
      "Du har loggats ut överallt där du var inloggad. Logga in med ditt nya lösenord.",
    "setNewPassword.expired.title": "Den länken har gått ut",
    "setNewPassword.expired.explanation":
      "En länk för att skapa ett nytt lösenord fungerar i en timme. Be om en ny, så skickas den till samma adress.",
    "setNewPassword.noLongerWorks.title": "Den länken fungerar inte längre",
    "setNewPassword.noLongerWorks.explanation":
      "Den kan redan ha använts, eller så kan något saknas i slutet av den. Be om en ny om du fortfarande behöver en.",

    // Sägs ovanför fälten när kontrollen mot läckta lösenord inte kan göras.
    "BreachedPasswords.Unreachable":
      "Ditt lösenord kan inte kontrolleras just nu, så det har inte ändrats. Försök igen om några minuter; din länk fungerar tills den går ut.",

    "forgetAccount.title": "Glöm ditt konto",
    "forgetAccount.explanation":
      "Ditt namn och din e-postadress kan göras oläsliga för alltid, och ditt konto stängas. För att vara säkra på att det är du skickar vi först en länk till kontots adress, och inget glöms förrän du följer den.",
    "forgetAccount.submit": "Skicka länken till mig",
    "forgetAccount.sent.title": "Kolla din e-post",
    "forgetAccount.sent.explanation":
      "Vi har skickat en länk till kontots adress. Den fungerar i 15 minuter, och bara medan du är inloggad på det här kontot.",
    "forgetAccount.confirm.title": "Glömma ditt konto för alltid?",
    "forgetAccount.confirm.explanation":
      "När det är glömt kan ditt namn och din e-postadress aldrig läsas igen, av någon, och det går inte att logga in på kontot. Det kan inte ångras.",
    "forgetAccount.confirm.submit": "Glöm mitt konto",
    "forgetAccount.forgotten.title": "Ditt konto har glömts",
    "forgetAccount.forgotten.explanation":
      "Ditt namn och din e-postadress kan inte längre läsas, och du har loggats ut överallt där du var inloggad.",
    "forgetAccount.noLongerWorks.title": "Den länken fungerar inte längre",
    "forgetAccount.noLongerWorks.explanation":
      "Den kan ha gått ut, redan ha använts eller höra till ett konto du inte är inloggad på. Be om en ny från ditt konto om du fortfarande vill att det ska glömmas.",
    "forgetAccount.lastAdministrator.title": "Ditt konto kan inte glömmas",
    "forgetAccount.lastAdministrator.explanation":
      "Du är den här webbplatsens enda administratör. Ge rollen som administratör till någon annan, så kan ditt konto glömmas.",
    "forgetAccount.askAgain": "Fråga igen",
    "forgetAccount.home": "Tillbaka till {siteName}",

    "registrationsSuspended.title": "Registreringen är pausad för tillfället",
    "registrationsSuspended.explanation":
      "En tjänst som registreringen behöver går inte att nå just nu, så ingen kan registrera sig förrän den svarar igen. Inget av det du skrev sparades.",
    "registrationsSuspended.tryAgainLater":
      "Försök igen om en stund. Webbplatsens administratör har fått veta.",
    "registrationsSuspended.home": "Tillbaka till {siteName}",

    "signIn.title": "Logga in",
    "signIn.emailAddress": "E-postadress",
    "signIn.password": "Lösenord",
    "signIn.submit": "Logga in",
    "signIn.forgotPassword": "Glömt lösenord?",
    "signIn.register": "Registrera dig",
    "signIn.withGoogle": "Logga in med Google",
    "signIn.or": "eller",
    "signIn.tryAgainLater":
      "För många försök har gjorts på sistone. Vänta en timme och försök igen.",

    // Det enda svaret på ett felaktigt lösenord och på en adress ingen har
    // registrerat. Det säger varken vilket det var eller inte var.
    "SignIn.Failed": "E-postadressen eller lösenordet är fel. Försök igen.",

    "profile.title": "Profil",
    // En etiketts kolon hör till dess ord, eftersom språk sätter det olika.
    "profile.name": "Namn:",
    "profile.emailAddress": "E-postadress:",

    "changeName.title": "Byt namn",
    "changeName.name": "Namn",
    "changeName.submit": "Byt namn",

    "setPassword.title": "Skapa ett lösenord",
    "setPassword.explanation":
      "Ditt konto har inget lösenord: du loggar in med Google. För att också kunna logga in med lösenord skickar vi en länk för att skapa ett till {emailAddress}.",
    "setPassword.submit": "Skicka en länk till mig",
    "setPassword.sent.title": "Kolla din e-post",
    "setPassword.sent.explanation":
      "Vi har skickat en länk för att skapa ett lösenord. Den fungerar i en timme.",
    "setPassword.profile": "Tillbaka till din profil",

    "changePassword.title": "Byt lösenord",
    "changePassword.currentPassword": "Nuvarande lösenord",
    "changePassword.password": "Nytt lösenord",
    "changePassword.passwordConfirmation": "Bekräfta lösenordet",
    "changePassword.forgotPassword": "Glömt lösenord?",
    "changePassword.submit": "Byt lösenord",
    // Under det nuvarande lösenordet, som det gäller.
    "ChangePassword.WrongPassword": "Det är inte ditt lösenord.",

    "changeEmailAddress.title": "Byt e-postadress",
    "changeEmailAddress.emailAddress": "Ny e-postadress",
    "changeEmailAddress.currentPassword": "Nuvarande lösenord",
    "changeEmailAddress.submit": "Skicka en länk att bekräfta",
    "changeEmailAddress.sent.title": "Kolla din e-post",
    "changeEmailAddress.sent.explanation":
      "En länk för att bekräfta flytten har skickats till den nya e-postadressen. Följ den, inloggad, för att flytta ditt konto dit.",
    "changeEmailAddress.confirm.title": "Flytta ditt konto",
    "changeEmailAddress.confirm.explanation":
      "Ditt konto flyttas till {emailAddress}. Du loggar in med den adressen från och med nu.",
    "changeEmailAddress.confirm.submit": "Flytta mitt konto",
    "changeEmailAddress.noLongerWorks.title":
      "Den här länken fungerar inte längre",
    "changeEmailAddress.noLongerWorks.explanation":
      "Den har gått ut, har använts eller skickades inte för kontot du är inloggad på. Be om en ny från din profil.",
    "changeEmailAddress.taken.title": "Ditt konto har inte flyttats",
    "changeEmailAddress.profile": "Tillbaka till din profil",
    // Under fältet var och en gäller.
    "ChangeEmailAddress.WrongPassword": "Det är inte ditt lösenord.",
    "ChangeEmailAddress.Unchanged": "Ditt konto har redan den här adressen.",
    "ChangeEmailAddress.Taken":
      "Den e-postadressen har nu ett eget konto, så ditt kan inte flyttas dit.",

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
      "Kontrollera att du följde hela länken från e-postmeddelandet, utan att något saknas i slutet. Fungerar den ändå inte, registrera dig igen så skickas en ny länk.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Den e-postadressen är redan bekräftad",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Det finns inget mer att göra. Logga in med lösenordet du angav när du bekräftade den.",

    // En regel som brutits, nycklad med sin kod så att varje formulär som
    // säger den säger den likadant. Sägs till den som skrev, under fältet.
    "PersonName.Missing": "Ange ett namn.",
    "PersonName.TooShort": "Ett namn måste vara minst 3 tecken.",
    "PersonName.TooLong": "Ett namn får vara högst 254 tecken.",
    "WorldRankingName.TooShort":
      "Ett namn på världsrankingen måste vara minst 3 tecken.",
    "WorldRankingName.TooLong":
      "Ett namn på världsrankingen får vara högst 254 tecken.",
    "Password.Missing": "Ange ett lösenord.",
    "Password.TooShort": "Ett lösenord måste vara minst 12 tecken.",
    "Password.ConfirmationDiffers":
      "Det här är inte samma som lösenordet ovan. Skriv det igen.",
    "Password.Breached":
      "Det här lösenordet har förekommit i ett dataintrång någon annanstans, så det är inte säkert att använda här. Välj ett annat.",

    "javaScriptRequired.title": "JavaScript krävs",
    "javaScriptRequired.explanation":
      "För att registrera dig måste JavaScript vara aktiverat för den här webbplatsen, så att den kan kontrollera att den som registrerar sig är en människa. Aktivera det och registrera dig sedan igen.",
    "javaScriptRequired.register": "Tillbaka till registreringen",
    "javaScriptRequired.home": "Tillbaka till {siteName}",

    "errors.backHome": "Tillbaka till {siteName}",
    "errors.notFound": "Hittades inte",
    "errors.refused": "Det gick inte att göra",
    "errors.refusedDetail": "Något i det som skickades stämde inte.",
    "errors.sorry": "Tyvärr",
    "errors.sorryDetail": "Den begäran gick inte att hantera.",
    "errors.failed": "Något gick fel",
    "errors.reference": "Referens {reference}.",
    "errors.recorded":
      "Felet har loggats och ett e-postmeddelande har skickats till administratören. Det hjälper om du mejlar administratören med referensen och en beskrivning av vad du gjorde.",
    "errors.message": "Mejla administratören",
    "errors.messageSubject": "Fel {reference} på {siteName}",
    "errors.messageBody": "Det här gjorde jag när det hände:\n\n",
    "errors.unavailable": "Webbplatsen är otillgänglig",
    "errors.unavailableDetail":
      "Webbplatsen når inte det den behöver just nu. Försök igen senare.",
    "errors.maintenance": "Webbplatsen är nere för underhåll.",
    "errors.maintenanceMinutes":
      "Den väntas vara tillbaka om {minutes} minuter.",
    "errors.maintenanceMinute": "Den väntas vara tillbaka om 1 minut.",
    "errors.maintenanceLonger":
      "Det tar längre tid än väntat, men den är snart tillbaka.",

    // Startsidans två listor, vad var och en säger när den är tom, och vägen
    // under dem till alla turneringar i år.
    "home.recentResults": "Senaste resultat",
    "home.recentResults.none":
      "Inga partier har lagts till de senaste sju dagarna.",
    "home.upcomingTournaments": "Kommande turneringar",
    "home.upcomingTournaments.none":
      "Inga turneringar startar de närmaste sextio dagarna.",
    "home.allTournaments": "Alla turneringar {year}",
    // Ett års sida: dess rubrik, och vad den säger när den är tom.
    "year.heading": "Turneringar {year}",
    "year.none": "Inga turneringar startar {year}.",
    // En sports sida under ett år: samma sak, för sporten ensam.
    "yearSport.heading": "{sport}-turneringar {year}",
    "yearSport.none": "Inga {sport}-turneringar startar {year}.",
    // En turnerings sida: dess avsnitt, vad den säger om ett parti, hur länge
    // sedan ett lades till, och vad den säger när den inte har några.
    "tournament.recent": "Senaste",
    "tournament.summary": "Sammanfattning",
    // Sammanfattningen för en turnering som spelas av lag: tabellens grupper
    // och kolumner.
    // En landskamps rutnät: vad varje match är bäst av, ordet mellan lagen,
    // och summorna under matcherna.
    "test.bestOf": "Varje match är bäst av {count}.",
    "test.vs": "mot",
    "test.matches": "Matcher",
    "test.games": "Partier",
    "test.hoops": "Bågar",
    "teamSummary.tests": "Landskamper",
    "teamSummary.matches": "Matcher",
    "teamSummary.games": "Partier",
    "teamSummary.hoops": "Bågar",
    "teamSummary.wins": "Vinster",
    "teamSummary.losses": "Förluster",
    "teamSummary.draws": "Oavgjorda",
    "teamSummary.for": "För",
    "teamSummary.against": "Mot",
    "teamSummary.net": "Netto",
    "tournament.players": "Spelare",
    "search.label": "Sök",
    "search.tournaments": "Turneringar",
    "search.competitions": "Tävlingar",
    "search.nothingFound": "Inget hittades.",
    "players.search.label": "Sök spelare",
    "players.search.prompt": "Skriv en spelares namn för att hitta hen.",
    "players.search.none": "Inga spelare hittades.",
    "search.more":
      "Bara de första {count} visas. Skriv mer av namnet för att begränsa sökningen.",
    "websitePlayer.tournament": "Turnering",
    // En landskamp i en turnerings avsnitt: de två lagens korta namn.
    "tournament.test": "{first} mot {second}",
    "tournament.notes": "Anteckningar",
    "tournament.commentary": "Kommentarer",
    "tournament.beat": "slog",
    "tournament.drewWith": "spelade oavgjort mot",
    "tournament.ago.seconds": "{count} sek",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 timme",
    "tournament.ago.hours": "{count} timmar",
    "tournament.none": "Inga partier har spelats än.",
    // Sidan med en turnerings spelare, när den inte har några.
    "players.none": "Inga spelare har lagts till än.",
    // Sidan med en turnerings kommentarer, med den gamla webbplatsens ord: hur
    // en kommentar listas, och länken för att starta en.
    "commentaries.by": "av",
    "commentaries.start": "Starta ny kommentar",
    // Sidan som startar en kommentar.
    "startCommentary.title": "Starta ny kommentar",
    "startCommentary.titleField": "Rubrik",
    "startCommentary.submit": "Starta kommentar",
    // "Ny" sägs till en skärmläsare i stället för den röda asterisken som
    // markerar en anteckning eller kommentar som inte är läst som den är nu.
    "marks.new": "ny",
    // En turnerings sida med anteckningar, och en antecknings egen sida.
    "notes.none": "Arrangörerna har inte skrivit några anteckningar än.",
    "note.edited": "redigerad",
    // En kommentars sida: vad den säger när den saknar inlägg, vad den säger
    // om ett inlägg, och rutan där skribenten skriver nästa.
    "commentary.none": "Inga inlägg har skrivits än.",
    "commentary.edited": "redigerad",
    "commentary.edit": "Redigera",
    "commentary.delete": "Radera",
    "commentary.comment": "Inlägg",
    "commentary.add": "Lägg till inlägg",
    "commentary.notSent":
      "Inlägget kunde inte skickas. Ladda om sidan för att se om det sparades.",
    // Sidan som ändrar en kommentars rubrik.
    "changeCommentaryTitle.title": "Byt rubrik",
    "changeCommentaryTitle.submit": "Spara",
    // Ett inläggs egen sida, där skribenten redigerar eller raderar det, och
    // sidan som frågar innan det raderas.
    "editComment.title": "Redigera inlägg",
    "editComment.save": "Spara",
    "deleteComment.title": "Radera inlägg",
    "deleteComment.question": "Radera det här inlägget? Det kan inte ångras.",
    "deleteComment.confirm": "Radera inlägg",
    "deleteComment.keep": "Behåll det",
    // En spelares sida: dess två delar, hur ett parti sägs så som spelaren
    // spelade det, och vad varje del säger när den är tom.
    "player.games": "Partier",
    "player.competitions": "Tävlingar",
    "player.beat": "slog",
    "player.lostTo": "förlorade mot",
    "player.drewWith": "spelade oavgjort mot",
    "player.score": "{score} mot {opponent}",
    "player.noGames": "Inga partier har spelats än.",
    "player.noCompetitions": "Inte anmäld till någon tävling än.",
    // Ett blocks sida: rutnätets summor, vad ett resultat är för radens
    // spelare, sagt högt i stället för visat, och en spelare som har dragit
    // sig ur.
    "block.wins": "Vinster",
    "block.matches": "Matcher",
    "block.netGames": "Nettopartier",
    "block.games": "Partier",
    "block.netHoops": "Nettobågar",
    "block.won": "vann",
    "block.lost": "förlorade",
    "block.drawn": "oavgjort",
    "block.withdrawn": "utgått",
    // Ett parti som dragits tillbaka, vilket spanskan säger annorlunda än en
    // spelare.
    "block.gameWithdrawn": "utgått",
    "block.losses": "Förluster",
    // Ett blocks tre vyer, som erbjuds under rubriken.
    "competition.views": "Vyer",
    "competition.view.grid": "Rutnät",
    "competition.view.summary": "Sammanfattning",
    "competition.view.orderOfPlay": "Speltabell",
    "competition.print": "Skriv ut",
    "competition.playedTo": "Spelas till {hoops} bågar",
    "blockSummary.ranking":
      "Rankad efter andelen vunna matcher, därefter efter nettobågar. En turnerings egna regler kan placera spelarna annorlunda.",
    "orderOfPlay.none": "Inga partier har spelats än.",
    "orderOfPlay.column.game": "Match",
    "orderOfPlay.column.date": "Datum",
    // En utslagnings ronder, benämnda som den gamla webbplatsen gjorde, räknade
    // bakifrån från den sista, och en bye ritad i stället för en spelare.
    "knockout.round.final": "Final",
    "knockout.round.semis": "Semifinaler",
    "knockout.round.quarters": "Kvartsfinaler",
    "knockout.round.number": "Rond {number}",
    "knockout.bye": "Bye",
    // En schweizertabell: vad varje spelare har spelat och vunnit, och deras
    // resultat.
    "swiss.games": "Partier",
    "swiss.wins": "Vinster",
    "swiss.winShare": "Vinst-%",
    "swiss.results": "Resultat",
    // Pilarna som rullar en utslagnings rutnät fram till finalen, och tillbaka
    // till första ronden.
    "knockout.onward": "Senare ronder",
    "knockout.back": "Tidigare ronder",
    // Det som alla turneringslistor delar, på startsidan och på ett års sida:
    // kolumnerna som var och en är en tabell av, och det som begränsar dem.
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Namn",
    // En flagga, som begränsar listorna till sitt land, benämnd efter vad den
    // gör.
    "tournamentList.onlyIn": "Bara turneringar i {country}",
    "tournamentList.usualOrder": "Tillbaka till den vanliga ordningen",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Alla länder",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Alla regioner",
    "tournamentList.filter.noRegionsBefore":
      "Turneringar före november 2026 har ingen region.",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Alla sporter",
    "tournamentList.filter.submit": "Filtrera",
    // Åren det finns turneringar i, den sekundära navigeringen för båda.
    "years.label": "År",
    // Rullgardinslistan med de år som inte får plats som flikar.
    "years.earlier": "Tidigare år",

    // Adminens ord. Admin ritar dem i webbläsaren, så servern säger dem i sin
    // sida när den skickar den (adminPage.ts): dessa, och turneringens
    // avslag nedan.
    "admin.newerBuild.message": "En nyare version av webbplatsen finns.",
    "admin.newerBuild.reload": "Ladda om",
    "admin.title": "Admin",
    "admin.tournaments.new": "Ny turnering",
    "admin.tournaments.none": "Inga turneringar",
    "admin.tournaments.filter.none": "Inga turneringar matchar",
    "admin.tournaments.show": "Visa",
    "admin.tournaments.managerScorer": "Ansvarig/Poängräknare",
    "admin.tournaments.worldRanking": "Världsranking",
    "admin.tournaments.notWorldRanking": "Utanför världsrankingen",
    // Sägs till en skärmläsare, eftersom ett streck genom ett namn inte läses
    // upp.
    "admin.tournaments.archived": "Arkiverad",
    "admin.tournaments.manage": "Hantera",
    "admin.tournaments.edit": "Redigera",
    "admin.tournaments.archive": "Arkivera",
    "admin.tournaments.restore": "Återställ",
    "admin.tournaments.scores": "Resultat",
    "admin.tournaments.players": "Spelare",
    "admin.years.label": "År",
    // Vad rullgardinslistan med år säger medan det valda året är en flik.
    "admin.years.earlier": "Tidigare år",
    "admin.tournament.name": "Namn",
    "admin.tournament.starts": "Börjar",
    "admin.tournament.finishes": "Slutar",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Underrubrik",
    "admin.rules.handicap": "Spelas med handikapp",
    "admin.rules.drawsAllowed": "Tillåter oavgjorda resultat",
    "admin.tournament.levelTestsDrawn": "Jämna landskamper blir oavgjorda",
    "admin.rules.worldRankings": "Räknas med i världsrankingen",
    "admin.rules.maximumHoops": "Högsta antal bågar",
    "admin.tournament.national": "Nationell tävling",
    "admin.tournament.international": "Internationell tävling",
    // Ett avslag utan egna ord, ovanför fälten.
    "admin.tournament.otherwise": "Det här kan inte godtas som det är.",
    "admin.newTournament.title": "Ny turnering",
    "admin.newTournament.submit": "Skapa turnering",
    "admin.editTournament.title": "Redigera turnering",
    "admin.editTournament.submit": "Uppdatera turnering",
    // Sägs i stället för formuläret, för ett avslag utan egna ord.
    "admin.editTournament.otherwise": "Den här turneringen kan inte ändras.",
    // En turnerings sida, och flikarna det som ska drivas finns i.
    "admin.view.tabs": "Turnering",
    "admin.view.players": "Spelare",
    "admin.view.competitions": "Tävlingar",
    "admin.view.managers": "Arrangörer",
    "admin.view.notes": "Anteckningar",
    "admin.view.scorers": "Resultatförare",
    "admin.view.rankings": "Rankingar",
    "admin.rankings.file":
      "Världsrankingen använder turneringens resultat via den här funktionen, så arrangörerna behöver inte göra något.",
    "admin.rankings.download": "Ladda ner partier för världsranking",
    "rankings.notAvailable": "Rankingar är inte tillgängliga",
    "rankings.notAvailable.sport":
      "Den här turneringens sport har ingen världsranking, så det finns inga rankingar att skicka.",
    "rankings.notAvailable.notCounted":
      "Ingen av den här turneringens tävlingar räknas med i världsrankingen.",
    // Sägs i stället för flikarna, för ett avslag utan egna ord.
    "admin.view.otherwise": "Den här turneringen kan inte drivas härifrån.",
    // En tävlings sida, och flikarna det som ska drivas finns i.
    "admin.competitionView.tabs": "Tävling",
    "admin.competitionView.players": "Spelare",
    "admin.competitionView.scores": "Resultat",
    // Avsnittsfältet på en turnerings sida och dess tävlingars sidor.
    "admin.sections.label": "Turneringen och dess tävlingar",
    "admin.sections.tournament": "Turnering",
    // Avsnittsfältet på administratörens sidor.
    "admin.administrator.sections.label": "Administratörens sidor",
    "admin.administrator.sections.tournaments": "Turneringar",
    "admin.administrator.sections.accounts": "Konton",
    "admin.administrator.sections.worldRankings": "Världsrankingen",
    "admin.administrator.sections.importErrors": "Importfel",
    "admin.administrator.sections.logs": "Loggar",
    "admin.administrator.sections.databaseStatus": "Databasåtkomst",
    "admin.administrator.sections.countries": "Länder",
    "admin.databaseStatus.title": "Databasåtkomst",
    "admin.databaseStatus.on": "Databasåtkomsten är på.",
    "admin.databaseStatus.off": "Databasåtkomsten är av.",
    "admin.databaseStatus.expected":
      "Webbplatsen väntas vara tillbaka om {minutes} minuter.",
    "admin.databaseStatus.expectedOne":
      "Webbplatsen väntas vara tillbaka om 1 minut.",
    "admin.databaseStatus.longer": "Det tar längre tid än väntat.",
    "admin.databaseStatus.told": "Läsarna får veta: {words}",
    "admin.databaseStatus.toldUsual": "Läsarna får den vanliga meningen.",
    "admin.databaseStatus.minutes": "Förväntade minuter",
    "admin.databaseStatus.words": "Ord till läsarna",
    "admin.databaseStatus.turnOff": "Stäng av",
    "admin.databaseStatus.change": "Ändra",
    "admin.databaseStatus.turnOn": "Slå på",
    "admin.databaseStatus.minutesNeeded": "Minuterna behövs.",
    "admin.databaseStatus.otherwise": "Något gick fel på webbplatsen.",
    "DatabaseAccess.MinutesNotWhole": "Minuterna måste vara ett heltal.",
    "DatabaseAccess.MinutesOutOfRange":
      "Minuterna måste vara från 1 till 1440.",
    "DatabaseAccess.WordsTooLong": "Orden får vara högst 500 tecken.",
    "DatabaseAccess.NotOff": "Databasåtkomsten är inte avstängd.",
    "admin.administrator.title": "Administratör",
    // Kontosidan, ett avsnitt för varje roll.
    "admin.accounts.title": "Konton",
    "admin.roles.add": "Lägg till",
    "admin.roles.administrator.heading": "Administratörer",
    "admin.roles.administrator.none": "Inga andra administratörer",
    "admin.roles.administrator.removeTitle": "Ta bort administratör",
    "admin.roles.administrator.removeExplanation":
      "{name} kommer inte längre att vara administratör för den här webbplatsen.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Rankingansvariga för association croquet",
    "admin.roles.ac-world-ranking-officer.none":
      "Inga rankingansvariga för association croquet",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Ta bort rankingansvarig för association croquet",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} kommer inte längre att vara rankingansvarig för association croquet.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Rankingansvariga för golfcroquet",
    "admin.roles.gc-world-ranking-officer.none":
      "Inga rankingansvariga för golfcroquet",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Ta bort rankingansvarig för golfcroquet",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} kommer inte längre att vara rankingansvarig för golfcroquet.",
    // För ett avslag utan egna ord, under fältet eller i stället för listan.
    // Inte om adressen, eftersom det kan vara sessionen som tog slut eller
    // webbplatsen som föll.
    // Sidan där världsrankingens spelare importeras, och dess logg, en rad för
    // varje sak importen säger. Ett antal sägs efter ett kolon, så att en
    // spelare och många sägs på samma sätt.
    "admin.worldRankings.title": "Importera världsrankingens spelare",
    "admin.worldRankings.import": "Importera",
    "admin.worldRankings.log": "Hur importen gick",
    "admin.worldRankings.ac.reading": "Läser listan för association croquet",
    "admin.worldRankings.ac.read":
      "Spelare i association croquet som lästs: {players}",
    "admin.worldRankings.ac.kept":
      "Spelare i association croquet som behållits: {players}",
    "admin.worldRankings.ac.refused":
      "Listan för association croquet gick inte att läsa, så dess spelare lämnades som de var.",
    "admin.worldRankings.gc.reading": "Läser listan för golfcroquet",
    "admin.worldRankings.gc.read": "Spelare i golfcroquet som lästs: {players}",
    "admin.worldRankings.gc.kept":
      "Spelare i golfcroquet som behållits: {players}",
    "admin.worldRankings.gc.refused":
      "Listan för golfcroquet gick inte att läsa, så dess spelare lämnades som de var.",
    "admin.worldRankings.finished": "Klart",
    "admin.worldRankings.failed": "Importen blev inte klar.",
    // För ett avslag utan egna ord, som ett fel hos webbplatsen.
    "admin.worldRankings.otherwise": "Något gick fel på webbplatsen.",
    "WorldRankingLists.Unreachable":
      "Det gick inte att nå världsrankingens webbplats.",
    "WorldRankingLists.Unreadable":
      "Listan är inte uppställd som världsrankingen ställer upp sin: en rad i den gick inte att läsa, ingen finns med på den, eller så är den inte skriven i UTF-8.",
    // Dokumenten som importen från de gamla webbplatserna avvisade, och sidan
    // för ett av dem.
    "admin.importErrors.title": "Importfel",
    "admin.importErrors.none": "Inga importfel",
    "admin.importErrors.otherwise": "Något gick fel på webbplatsen.",
    "admin.countries.title": "Länder",
    "admin.countries.none":
      "Ingen turnering spelas i ett land som listorna inte nämner",
    "admin.countries.oldSite": "Gamla sidan",
    "admin.countries.otherwise": "Något gick fel på webbplatsen.",
    "admin.logs.title": "Loggar",
    "admin.logs.severity": "Allvarlighet",
    "admin.logs.text": "Slå upp",
    "admin.logs.show": "Visa",
    "admin.logs.prune": "Rensa",
    "admin.logs.pruneAsk":
      "Ta bort loggen från före den senaste timmen? Inget för tillbaka den.",
    "admin.logs.removed": "{count} poster togs bort",
    "admin.logs.none": "Inga loggposter",
    "admin.logs.otherwise": "Något gick fel på webbplatsen.",
    "admin.hover.logs.show": "Visa posterna som matchar",
    "admin.hover.logs.prune": "Ta bort loggen från före den senaste timmen",
    "admin.hover.logs.pruneAgree":
      "Ta bort loggen från före den senaste timmen",
    "admin.importError.title": "Importfel",
    "admin.importError.documentId": "Dokument-id",
    "admin.importError.tournament": "Turnering",
    "admin.importError.competition": "Tävling",
    "admin.importError.newSite": "Ny webbplats",
    "admin.importError.oldSite": "Gammal webbplats",
    "ImportErrorKept.NotFound":
      "Importen sparade inget fel för det dokumentet.",
    "admin.competitionView.otherwise":
      "Den här tävlingen kan inte drivas härifrån.",
    // Fliken Tävlingar: varje tävlings slag, vad som kan göras med den, och
    // rubriken de arkiverade står under.
    "admin.competitions.block": "Block",
    "admin.competitions.knockout": "Utslagning",
    "admin.competitions.swiss": "Schweizer",
    "admin.competitions.view": "Visa",
    "admin.competitions.edit": "Redigera",
    "admin.competitions.up": "Upp",
    "admin.competitions.down": "Ner",
    "admin.competitions.archive": "Arkivera",
    "admin.competitions.restore": "Återställ",
    "admin.competitions.archived": "Arkiverade tävlingar",
    "admin.competitions.none": "Inga tävlingar",
    "admin.competitions.add": "Lägg till tävling",
    // Tävlingsdialogen.
    "admin.competition.addTitle": "Lägg till tävling",
    "admin.competition.editTitle": "Redigera tävling",
    "admin.competition.name": "Namn",
    "admin.competition.kind": "Slag",
    "admin.competition.bestOf": "Bäst av",
    "admin.competition.rounds": "Ronder",
    "admin.competition.places": "Platser",
    "admin.competition.round": "Rond {number}",
    "admin.competition.bestOfs": "Bäst av per rond",
    "admin.competition.quarters": "Kvartsfinaler",
    "admin.competition.semis": "Semifinaler",
    "admin.competition.final": "Final",
    "admin.competition.add": "Lägg till",
    "admin.competition.save": "Spara",
    "admin.competition.added": "{name} lades till.",
    // Ovanför fälten, för ett avslag utan egna ord.
    "admin.competition.otherwise":
      "Den här tävlingen kan inte sparas som den är.",
    "CompetitionName.Missing": "Ange ett namn.",
    "CompetitionName.TooLong": "Ett namn får vara högst 254 tecken.",
    "CompetitionName.NoLetterOrDigit":
      "Ett namn måste innehålla en bokstav eller en siffra.",
    "Tournament.KnockoutPlayerHasGames":
      "Spelare i den här lottningen har partier, så dess platser kan inte ändras.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "En rond med en avgjord match kan inte få ett kortare bäst-av.",
    "Tournament.KnockoutLaterRoundHasGames":
      "En rond kan inte ändras när ett parti har spelats i en senare rond.",
    "Tournament.CompetitionNameTaken":
      "En annan tävling i den här turneringen har redan det namnet.",
    "Tournament.MaximumHoopsInvalid":
      "Ange ett helt antal bågar, minst 1, eller lämna tomt för inget högsta antal.",
    "BestOf.NotWhole": "Ange ett heltal för antalet partier.",
    "BestOf.TooSmall": "En match måste vara bäst av minst 1 parti.",
    "Rounds.NotWhole": "Ange ett heltal för antalet ronder.",
    "Rounds.TooSmall": "Ett block måste spelas i minst 1 rond.",
    "KnockoutDraw.EvenBestOf":
      "En match i en utslagning måste ha en vinnare, så den är bäst av ett udda antal partier.",
    // Varje modal dialogs väg ut, eftersom sidan under inte kan nås.
    "admin.hover.tournaments.new": "Skapa en ny turnering",
    "admin.hover.tournaments.manage":
      "Hantera den här turneringens spelare, lag, tävlingar och resultat",
    "admin.hover.tournaments.edit": "Ändra den här turneringens uppgifter",
    "admin.hover.tournaments.scores": "Skriv in den här turneringens resultat",
    "admin.hover.tournaments.players":
      "Ta hand om den här turneringens spelare",
    "admin.hover.competitions.view":
      "Öppna den här tävlingen för att se och skriva in dess spelare och resultat",
    "admin.hover.tests.view":
      "Öppna den här landskampen för att se och skriva in dess resultat",
    "admin.hover.teams.view":
      "Öppna det här laget för att se och hantera dess spelare",
    "admin.hover.dialog.player.add": "Lägg till spelaren i turneringen",
    "admin.hover.dialog.player.save": "Spara ändringarna för spelaren",
    "admin.hover.dialog.team.add": "Lägg till laget i turneringen",
    "admin.hover.dialog.team.save": "Spara ändringarna för laget",
    "admin.hover.dialog.test.add": "Lägg till landskampen i turneringen",
    "admin.hover.dialog.test.save": "Spara ändringarna för landskampen",
    "admin.hover.dialog.competition.add": "Lägg till tävlingen i turneringen",
    "admin.hover.dialog.competition.save": "Spara ändringarna för tävlingen",
    "admin.hover.dialog.score.add": "Lägg till resultatet i tävlingen",
    "admin.hover.dialog.score.save": "Spara rättelsen av resultatet",
    "admin.hover.dialog.carryForward.save": "För spelarens resultat vidare",
    "admin.hover.dialog.tournament.new": "Skapa turneringen",
    "admin.hover.dialog.tournament.edit": "Spara ändringarna för turneringen",
    "admin.hover.modal.cancel": "Stäng utan att spara något",
    "admin.hover.modal.ok": "Stäng meddelandet",
    "admin.hover.tab": "Visa fliken {name}",
    "admin.hover.tournaments.archive":
      "Arkivera turneringen; den kan återställas",
    "admin.hover.tournaments.restore":
      "Hämta tillbaka den arkiverade turneringen",
    "admin.hover.players.add": "Lägg till en spelare i turneringen",
    "admin.hover.players.addMany":
      "Lägg till flera spelare i turneringen på en gång",
    "admin.hover.dialog.players.add": "Lägg till spelarna i turneringen",
    "admin.hover.players.edit": "Ändra spelarens uppgifter",
    "admin.hover.players.up": "Flytta spelaren upp i listan",
    "admin.hover.players.down": "Flytta spelaren ner i listan",
    "admin.hover.players.archive": "Arkivera spelaren; hen kan återställas",
    "admin.hover.players.restore": "Hämta tillbaka den arkiverade spelaren",
    "admin.hover.teams.add": "Lägg till ett lag i turneringen",
    "admin.hover.teams.edit": "Ändra lagets uppgifter",
    "admin.hover.teams.up": "Flytta laget upp i listan",
    "admin.hover.teams.down": "Flytta laget ner i listan",
    "admin.hover.teams.archive": "Arkivera laget; det kan återställas",
    "admin.hover.teams.restore": "Hämta tillbaka det arkiverade laget",
    "admin.hover.competitions.add": "Lägg till en tävling i turneringen",
    "admin.hover.competitions.edit": "Ändra tävlingens uppgifter",
    "admin.hover.competitions.up": "Flytta tävlingen upp i listan",
    "admin.hover.competitions.down": "Flytta tävlingen ner i listan",
    "admin.hover.competitions.archive":
      "Arkivera tävlingen; den kan återställas",
    "admin.hover.competitions.restore":
      "Hämta tillbaka den arkiverade tävlingen",
    "admin.hover.tests.add": "Lägg till en landskamp mellan två lag",
    "admin.hover.tests.edit": "Ändra landskampens uppgifter",
    "admin.hover.tests.up": "Flytta landskampen upp i listan",
    "admin.hover.tests.down": "Flytta landskampen ner i listan",
    "admin.hover.tests.archive": "Arkivera landskampen; den kan återställas",
    "admin.hover.tests.restore": "Hämta tillbaka den arkiverade landskampen",
    "admin.hover.tests.toTeams":
      "Gå till fliken Lag för att lägga till lagen en landskamp behöver",
    "admin.hover.scores.add": "Lägg till ett partis resultat i tävlingen",
    "admin.hover.scores.edit": "Rätta resultatet",
    "admin.hover.scores.archive":
      "Arkivera resultatet så att det slutar räknas; det kan återställas",
    "admin.hover.scores.restore":
      "Hämta tillbaka det arkiverade resultatet, så att det räknas igen",
    "admin.hover.scores.withdraw":
      "Behåll resultatet i listan men låt det sluta räknas",
    "admin.hover.scores.unwithdraw":
      "Låt det tillbakadragna resultatet räknas igen",
    "admin.hover.scores.up": "Flytta resultatet tidigare i listan",
    "admin.hover.scores.down": "Flytta resultatet senare i listan",
    "admin.hover.competitionPlayers.add": "Lägg den valda spelaren i tävlingen",
    "admin.hover.competitionPlayers.up": "Flytta spelaren upp i listan",
    "admin.hover.competitionPlayers.down": "Flytta spelaren ner i listan",
    "admin.hover.competitionPlayers.remove": "Ta bort spelaren från tävlingen",
    "admin.hover.competitionPlayers.withdraw":
      "Dra tillbaka spelaren från tävlingen",
    "admin.hover.competitionPlayers.unwithdraw":
      "Sätt tillbaka den tillbakadragna spelaren i tävlingen",
    "admin.hover.competitionPlayers.carryForward":
      "För spelarens resultat vidare från en annan tävling",
    "admin.hover.notes.add": "Skriv en ny anteckning för turneringen",
    "admin.hover.notes.edit": "Ändra anteckningen",
    "admin.hover.notes.delete": "Radera anteckningen",
    "admin.hover.note.add":
      "Spara anteckningen och lägg till den i turneringen",
    "admin.hover.note.save": "Spara ändringarna för anteckningen",
    "admin.hover.people.add": "Ge personen rollen",
    "admin.hover.people.remove": "Ta rollen från personen",
    "admin.hover.worldRankings.import":
      "Hämta världsrankingen och lägg till dess spelare",
    "admin.modal.cancel": "Avbryt",
    // Den enda knappen i en modal dialog som bara berättar något för läsaren.
    "admin.modal.ok": "OK",
    // Flikarna Arrangörer och Resultatförare, där man gör någon till det med
    // dess e-postadress och tar bort en.
    "admin.people.emailAddress": "E-postadress",
    "admin.people.remove": "Ta bort",
    "admin.people.otherwise": "Det gick inte att göra.",
    // Bredvid läsarens eget namn bland arrangörerna.
    "admin.managers.you": "Du",
    "admin.managers.add": "Lägg till arrangör",
    "admin.managers.email": "Mejla arrangörerna",
    // Sägs aldrig, eftersom en turnering alltid har en arrangör, men en lista
    // säger något när den är tom.
    "admin.managers.none": "Inga arrangörer",
    "admin.managers.removeTitle": "Ta bort arrangör",
    "admin.managers.removeExplanation":
      "{name} kommer inte längre att kunna driva den här turneringen.",
    "admin.managers.removeYourself.explanation":
      "Du kommer inte längre att kunna driva den här turneringen, och ingen här kan ångra det åt dig. En annan arrangör kan göra dig till arrangör igen.",
    "admin.managers.otherwise": "Den adressen kan inte göras till arrangör.",
    // Fliken Spelare.
    // En tävlings flik Spelare.
    "admin.competitionPlayers.add": "Lägg till spelare",
    // Under rullgardinslistan, för ett avslag utan egna ord.
    "admin.competitionPlayers.otherwise": "Spelaren kan inte läggas till.",
    "admin.competitionPlayers.choose": "Spelare att lägga till",
    "admin.competitionPlayers.nobody": "Välj en spelare",
    // Erbjuds i en utslagnings rullgardinslista, och vad en bye listas som.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Alla spelare är med i tävlingen",
    "admin.competitionPlayers.none": "Inga spelare",
    "admin.competitionPlayers.up": "Upp",
    "admin.competitionPlayers.down": "Ner",
    "admin.competitionPlayers.remove": "Ta bort",
    "admin.competitionPlayers.withdraw": "Dra tillbaka",
    "admin.competitionPlayers.unwithdraw": "Återinsätt",
    "admin.competitionPlayers.withdrawn": "Tillbakadragna spelare",
    "admin.competitionPlayers.removeTitle": "Ta bort spelare",
    "admin.competitionPlayers.removeQuestion":
      "{name} tas bort från tävlingen. Det kan inte ångras.",
    "admin.competitionPlayers.withdrawTitle": "Dra tillbaka spelare",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} spelar inte mer i tävlingen, och partierna hen inte har spelat avgörs utan hen.",
    "admin.competitionPlayers.carryForward": "För vidare",
    // Dialogen För vidare, över en tävlings flik Spelare.
    "admin.carryForward.title": "För vidare - {name}",
    "admin.carryForward.save": "Spara",
    // Ovanför antalen, för ett avslag utan egna ord.
    "admin.carryForward.otherwise": "Det här kan inte sparas.",
    "admin.carryForward.matchWins": "Matchvinster",
    "admin.carryForward.matchLosses": "Matchförluster",
    "admin.carryForward.gameWins": "Partivinster",
    "admin.carryForward.gameLosses": "Partiförluster",
    "admin.carryForward.hoopsFor": "Bågar för",
    "admin.carryForward.hoopsAgainst": "Bågar mot",
    "CarryForward.MatchWinsNotWhole": "Ange ett heltal för matchvinster.",
    "CarryForward.MatchWinsBelowZero": "Ange 0 eller fler matchvinster.",
    "CarryForward.MatchLossesNotWhole": "Ange ett heltal för matchförluster.",
    "CarryForward.MatchLossesBelowZero": "Ange 0 eller fler matchförluster.",
    "CarryForward.GameWinsNotWhole": "Ange ett heltal för partivinster.",
    "CarryForward.GameWinsBelowZero": "Ange 0 eller fler partivinster.",
    "CarryForward.GameLossesNotWhole": "Ange ett heltal för partiförluster.",
    "CarryForward.GameLossesBelowZero": "Ange 0 eller fler partiförluster.",
    "CarryForward.HoopsForNotWhole": "Ange ett heltal för bågar för.",
    "CarryForward.HoopsForBelowZero": "Ange 0 eller fler bågar för.",
    "CarryForward.HoopsAgainstNotWhole": "Ange ett heltal för bågar mot.",
    "CarryForward.HoopsAgainstBelowZero": "Ange 0 eller fler bågar mot.",
    // En tävlings flik Resultat och resultatdialogen.
    "admin.scores.add": "Lägg till resultat",
    "admin.scores.none": "Inga resultat",
    "admin.scores.edit": "Redigera",
    "admin.scores.drawNotFilledTitle": "Lottningen är inte fylld",
    "admin.scores.archive": "Arkivera",
    "admin.scores.up": "Upp",
    "admin.scores.down": "Ner",
    "admin.scores.restore": "Återställ",
    "admin.scores.archived": "Arkiverade resultat",
    "admin.scores.archivedSaid": "Arkiverat",
    "admin.scores.withdraw": "Dra tillbaka",
    "admin.scores.unwithdraw": "Återinsätt",
    "admin.scores.withdrawnSaid": "Tillbakadraget",
    // Ovanför listan, för ett avslag utan egna ord.
    "admin.scores.otherwise": "Det gick inte att göra.",
    "admin.score.title": "Lägg till resultat",
    "admin.score.add": "Lägg till parti",
    "admin.score.winner": "Vinnare",
    "admin.score.winnerScore": "Vinnarens resultat",
    "admin.score.loser": "Förlorare",
    "admin.score.loserScore": "Förlorarens resultat",
    "admin.score.beat": "slog",
    "admin.score.added": "Partiet som {winner} vann mot {loser} lades till.",
    "admin.score.otherwise": "Partiet kunde inte läggas till.",
    "admin.score.correctTitle": "Redigera resultat",
    "admin.score.save": "Spara",
    "admin.score.notCorrected": "Resultatet kunde inte rättas.",
    "Game.WinnerMissing": "Välj vinnaren.",
    "Game.WinnerScoreMissing": "Skriv vinnarens resultat.",
    "Game.LoserMissing": "Välj förloraren.",
    "Game.LoserScoreMissing": "Skriv förlorarens resultat.",
    "Score.NoPoints": "Ett resultat börjar med antalet poäng.",
    "Game.SamePlayer": "Ingen spelar mot sig själv.",
    "Game.WinnerNotAhead":
      "Vinnarens resultat måste vara högre än förlorarens, eller markerat som vunnet.",
    "Game.LoserMarked": "Förlorarens resultat kan inte markeras som vunnet.",
    "Game.ResultChanged":
      "En rättelse behåller resultatet: ett vunnet parti förblir vunnet, och ett oavgjort förblir oavgjort.",
    "Competition.MatchDecided": "Deras match är redan avgjord.",
    "Competition.DrawFull":
      "Spelaren kan inte läggas till eftersom utslagningen är full.",
    "Competition.DrawNotFilled":
      "Resultat kan inte läggas till förrän varje plats i utslagningen är fylld med en spelare eller en bye.",
    "Competition.ByeOutsideKnockout": "Bara en utslagning kan ha en bye.",
    "Competition.NotDrawnToMeet":
      "De här spelarna är för tillfället inte lottade att möta varandra i utslagningen.",
    "Competition.WinnerHasPlayedOn":
      "Vinnaren av den här matchen har redan spelat sitt nästa parti, så vem som vann kan inte ändras.",
    "CompetitionPlayer.Withdrawn": "En tillbakadragen spelare spelar inte mer.",
    "admin.players.add": "Lägg till spelare",
    "admin.players.addMany": "Lägg till flera spelare",
    "admin.players.none": "Inga spelare",
    "admin.players.edit": "Redigera",
    "admin.players.archive": "Arkivera",
    "admin.players.restore": "Återställ",
    "admin.players.up": "Upp",
    "admin.players.down": "Ner",
    // Frågas innan en spelare som är med i tävlingar arkiveras, eftersom
    // arkiveringen tar bort hen från varje, och återställningen sätter inte
    // tillbaka hen.
    "admin.players.archiveTitle": "Arkivera spelare",
    "admin.players.archiveQuestion": "{name} tas bort från de här tävlingarna:",
    "admin.players.archive.explanation":
      "Att återställa hen sätter inte tillbaka hen i de här tävlingarna.",
    "admin.players.archived": "Arkiverade spelare",
    // Sägs till en skärmläsare, eftersom ett streck genom ett namn inte läses
    // upp.
    "admin.players.archivedSaid": "Arkiverad",
    // Spelardialogen.
    "admin.player.addTitle": "Lägg till spelare",
    "admin.player.editTitle": "Redigera spelare",
    "admin.player.name": "Namn",
    "admin.player.handicap": "Handicap",
    "admin.player.representing": "Representerar",
    "admin.player.worldRankingName": "Spelarens namn i världsrankingen",
    // Bredvid namnet i världsrankingen: om världsrankingen känner till det.
    "admin.player.worldRankingKnown":
      "Världsrankingen känner till det här namnet.",
    "admin.player.worldRankingQuestioned":
      "Världsrankingen har ingen spelare med det här namnet. Det kan vara felstavat, eller så är spelaren ny i rankingen.",
    "admin.player.flag": "Flagga",
    "admin.player.add": "Lägg till",
    "admin.player.save": "Spara",
    "admin.player.added": "{name} lades till.",
    // The players dialog (players.feature): several players written in one box.
    "admin.players.addManyTitle": "Lägg till flera spelare",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "Hjälp",
    "admin.players.many": "Spelare",
    "admin.players.line": "Rad {line}: {words}",
    "AddPlayers.FieldsMissing": "Skriv fältens namn på första raden.",
    "AddPlayers.NameMissing": "Fälten måste innehålla Name.",
    "AddPlayers.FieldNotAllowed":
      "Ett fält kan vara Name, Representing, Flag, Handicap eller WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Ett fält kan bara namnges en gång.",
    "AddPlayers.PlayersMissing":
      "Skriv en spelare på varje rad efter den första.",
    "AddPlayers.TooManyPlayers":
      "En lista kan innehålla högst 500 spelare. Lägg till resten i en annan lista.",
    "AddPlayers.ValuesMismatched":
      "Varje spelare behöver ett värde, eller inget, för varje fält som namnges på första raden.",
    // Ovanför fälten, för ett avslag utan egna ord.
    "admin.player.otherwise": "Den här spelaren kan inte sparas som hen är.",
    "Tournament.PlayerNameTaken":
      "En annan spelare i den här turneringen har redan det namnet.",
    "TournamentPlayer.NoSuchFlag": "Välj en av de flaggor som finns.",
    "TournamentPlayer.HandicapMalformed":
      "Skriv handicapet som ett tal. Till exempel: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "En spelare kan inte heta Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Ett namn måste innehålla en bokstav eller en siffra.",
    // Dialogen över spelardialogen när en spelare får namnet bye.
    "admin.player.byesTitle": "Byes behöver inte läggas till",
    "admin.player.byes":
      "En bye är ingen av turneringens spelare. En utslagning erbjuder Bye varje gång dess spelare läggs till, så många gånger som lottningen behöver.",
    // En turnering som spelas av lag (view.feature): flikarna Lag och
    // Landskamper, ett lags sida och deras dialoger.
    "admin.view.teams": "Lag",
    "admin.view.tests": "Landskamper",
    "admin.teams.add": "Lägg till lag",
    "admin.teams.none": "Inga lag",
    "admin.teams.edit": "Redigera",
    "admin.teams.view": "Visa",
    "admin.teams.archive": "Arkivera",
    "admin.teams.restore": "Återställ",
    "admin.teams.up": "Upp",
    "admin.teams.down": "Ner",
    "admin.teams.archived": "Arkiverade lag",
    "admin.teams.archivedSaid": "Arkiverat",
    "admin.team.addTitle": "Lägg till lag",
    "admin.team.editTitle": "Redigera lag",
    "admin.team.name": "Namn",
    "admin.team.shortName": "Kortnamn",
    "admin.team.shortName.explanation":
      "Det som lagets landskamper kallas, som AUS v ENG.",
    "admin.team.flag": "Flagga",
    "admin.team.add": "Lägg till",
    "admin.team.save": "Spara",
    "admin.team.added": "{name} lades till.",
    // Ovanför fälten, för ett avslag utan egna ord.
    "admin.team.otherwise": "Det här laget kan inte sparas som det är.",
    "admin.teamView.otherwise": "Det här laget kan inte visas härifrån.",
    "admin.teamView.players": "Spelare",
    "TeamName.Missing": "Ange vad laget heter.",
    "TeamName.TooLong": "Det namnet är för långt.",
    "admin.notes.add": "Lägg till anteckning",
    "admin.notes.none": "Inga anteckningar",
    "admin.notes.edit": "Redigera",
    "admin.notes.delete": "Radera",
    // Frågas innan en anteckning raderas, eftersom en raderad anteckning är
    // borta för gott.
    "admin.notes.deleteTitle": "Radera anteckning",
    "admin.notes.deleteQuestion": "Radera anteckningen ”{title}”?",
    "admin.notes.delete.explanation":
      "En raderad anteckning är borta för gott och kan inte hämtas tillbaka.",
    // Ovanför listan, för ett avslag utan egna ord.
    "admin.notes.otherwise": "Det gick inte att göra.",
    // Anteckningsdialogen, beskrivningens flikar och verktygsfältet ovanför
    // rutan.
    "admin.note.addTitle": "Lägg till anteckning",
    "admin.note.editTitle": "Redigera anteckning",
    "admin.note.title": "Rubrik",
    "admin.note.description": "Beskrivning",
    "admin.note.write": "Skriv",
    "admin.note.preview": "Förhandsgranska",
    "admin.note.toolbar": "Formatering",
    "admin.note.tool.heading": "Rubrik",
    "admin.note.tool.bold": "Fet",
    "admin.note.tool.italic": "Kursiv",
    "admin.note.tool.quote": "Citat",
    "admin.note.tool.code": "Kod",
    "admin.note.tool.link": "Länk",
    "admin.note.tool.numberedList": "Numrerad lista",
    "admin.note.tool.bulletedList": "Punktlista",
    "admin.note.tool.taskList": "Uppgiftslista",
    "admin.note.add": "Lägg till",
    "admin.note.save": "Spara",
    // Ovanför fälten, för ett avslag utan egna ord.
    "admin.note.otherwise": "Den här anteckningen kan inte sparas som den är.",
    "ManagerNoteTitle.Missing": "Ge anteckningen en rubrik.",
    "ManagerNoteTitle.TooLong": "Den rubriken är för lång.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "En rubrik måste innehålla en bokstav eller en siffra.",
    "ManagerNoteDescription.TooLong": "Den beskrivningen är för lång.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Den anteckningen finns inte längre. En annan arrangör kan ha raderat den.",
    "EditManagerNote.NoSuchManagerNote":
      "Den anteckningen finns inte längre. En annan arrangör kan ha raderat den.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Den anteckningen finns inte längre. En annan arrangör kan ha raderat den.",
    "ManagerNote.Deleted":
      "Den anteckningen har raderats. En annan arrangör kan ha raderat den.",
    "CommentaryTitle.Missing": "Ge kommentaren en rubrik.",
    "CommentaryTitle.TooLong": "Den rubriken är för lång.",
    "CommentaryTitle.NoLetterOrDigit":
      "En rubrik måste innehålla en bokstav eller en siffra.",
    "Commentary.TitleTaken": "En annan kommentar har redan den rubriken.",
    "CommentText.Missing": "Skriv något i inlägget.",
    "CommentText.TooLong": "Det inlägget är för långt.",
    "TeamShortName.Missing": "Ge laget ett kortnamn.",
    "TeamShortName.TooLong": "Ett kortnamn får vara högst 10 tecken.",
    "TeamShortName.NoLetterOrDigit":
      "Ett kortnamn måste innehålla en bokstav eller en siffra.",
    "Team.ShortNameLongerThanName":
      "Ett kortnamn kan inte vara längre än lagets namn.",
    "Team.NoSuchFlag": "Välj en av de flaggor som finns.",
    "Team.Archived": "Det laget är arkiverat och måste återställas först.",
    "Team.InATest": "Det laget spelar i en landskamp och kan inte arkiveras.",
    "Team.PlayerNameTaken":
      "En annan spelare i det här laget har redan det namnet.",
    "TeamPlayer.NamedBye": "En spelare kan inte heta Bye.",
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
    "admin.tests.add": "Lägg till landskamp",
    "admin.tests.none": "Inga landskamper",
    "admin.tests.edit": "Redigera",
    "admin.tests.view": "Visa",
    "admin.tests.archive": "Arkivera",
    "admin.tests.restore": "Återställ",
    "admin.tests.up": "Upp",
    "admin.tests.down": "Ner",
    "admin.tests.archived": "Arkiverade landskamper",
    "admin.tests.twoTeamsNeeded":
      "En landskamp spelas mellan två lag, så två lag behövs först.",
    "admin.tests.toTeams": "Gå till Lag",
    "admin.tests.matches.one": "{count} match",
    "admin.tests.matches.other": "{count} matcher",
    "admin.tests.bestOf": "bäst av {games}",
    // Bredvid listan, för ett avslag utan egna ord.
    "admin.tests.otherwise": "Det gick inte att göra.",
    "admin.test.addTitle": "Lägg till landskamp",
    "admin.test.editTitle": "Redigera landskamp",
    "admin.test.firstTeam": "Lag A",
    "admin.test.secondTeam": "Lag B",
    "admin.test.versus": "v",
    "admin.test.starts": "Börjar",
    "admin.test.finishes": "Slutar",
    "admin.test.expectedMatches": "Förväntade matcher",
    "admin.test.bestOf": "Bäst av",
    "admin.test.group": "Grupp",
    "admin.test.add": "Lägg till",
    "admin.test.save": "Spara",
    "admin.test.added": "{name} lades till.",
    "admin.test.otherwise": "Den här landskampen kan inte sparas som den är.",
    "admin.testView.otherwise": "Den här landskampen kan inte visas härifrån.",
    "AddTest.FirstTeamMissing": "Välj det första laget.",
    "AddTest.SecondTeamMissing": "Välj det andra laget.",
    "UpdateTest.FirstTeamMissing": "Välj det första laget.",
    "UpdateTest.SecondTeamMissing": "Välj det andra laget.",
    "ExpectedMatches.NotWhole": "Ange ett heltal för antalet matcher.",
    "ExpectedMatches.TooSmall":
      "En landskamp måste förväntas ha minst 1 match.",
    "TestGroup.TooLong": "Den gruppen är för lång.",
    "Tournament.TestAgainstItself":
      "Ett lag spelar inte landskamp mot sig självt.",
    "Tournament.FormatHasNoGroups":
      "En landskamp i det här formatet läggs inte i en grupp.",
    "Tournament.TestFinishesBeforeStarts":
      "En landskamp kan inte sluta innan den börjar.",
    "Tournament.TestStartsBeforeTournament":
      "En landskamp kan inte börja före sin turnering.",
    "Tournament.TestFinishesAfterTournament":
      "En landskamp kan inte sluta efter sin turnering.",
    "Tournament.TestHasGamesInUse":
      "Den här landskampen har partier, så den kan inte arkiveras förrän de är det.",
    "Tournament.TestHasGames":
      "Den här landskampen har nu partier, så dess lag kan inte längre ändras.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Fler matcher än så har redan startat.",
    "Tournament.BestOfBelowGamesPlayed":
      "Två spelare har redan spelat fler partier än så.",
    "Competition.ExpectedMatchesReached":
      "Den här landskampen har startat lika många matcher som den förväntas ha.",
    "Competition.SameTeam": "Två spelare i samma lag spelar inte mot varandra.",
    "AddManager.NoSuchAccount":
      "Den adressen har inget konto som kan göras till arrangör.",
    "admin.scorers.add": "Lägg till resultatförare",
    "admin.scorers.none": "Inga resultatförare",
    "admin.scorers.removeTitle": "Ta bort resultatförare",
    "admin.scorers.removeExplanation":
      "{name} kommer inte längre att kunna skriva in den här turneringens resultat.",
    // Under fältet, för ett avslag utan egna ord.
    "admin.scorers.otherwise":
      "Den adressen kan inte göras till resultatförare.",
    "AddScorer.NoSuchAccount":
      "Den adressen har inget konto som kan göras till resultatförare.",
    // Att ge, ta bort och lista roller, vilket bara en administratör kan göra.
    "Account.NotAnAdministrator": "Bara en administratör kan göra det.",
    "AddRole.NoSuchAccount": "Den adressen har inget konto som kan få rollen.",
    "AddRole.NoSuchRole": "Det finns ingen sådan roll.",
    "RemoveRole.NoSuchAccount": "Det finns inget sådant konto.",
    "RemoveRole.NoSuchRole": "Det finns ingen sådan roll.",
    "RemoveRole.Yourself":
      "Du kan inte ta administratörsrollen från dig själv.",
    "AccountsWithRole.NoSuchRole": "Det finns ingen sådan roll.",
    "Tournament.AlreadyAManager":
      "Det kontot är redan arrangör för turneringen och kan göra allt en resultatförare kan.",

    // En turnerings avslag, nycklade med sina koder som varje brutet regel.
    // Under fältet var och en gäller, eller i stället för formuläret där
    // själva sidan avvisas.
    "TournamentName.Missing": "Ange vad turneringen heter.",
    "TournamentName.TooShort": "Det namnet är för kort.",
    "TournamentName.TooLong": "Det namnet är för långt.",
    "TournamentName.AllLowerCase":
      "Ett namn får inte vara skrivet helt med gemener.",
    "TournamentName.AllCapitals":
      "Ett namn får inte vara skrivet helt med versaler.",
    "TournamentName.NoLetterOrDigit":
      "Ett namn måste innehålla en bokstav eller en siffra.",
    "ReadOnlyDate.Unreadable": "Ange dagen.",
    "Tournament.FinishesBeforeStarts":
      "En turnering kan inte sluta innan den börjar.",
    "Tournament.StartsAfterNextYear":
      "En turnering kan inte börja efter nästa år.",
    "Tournament.FinishesAfterNextYear":
      "En turnering kan inte sluta efter nästa år.",
    "CreateTournament.NoSuchCountry": "Välj land.",
    "TournamentSubtitle.TooLong": "En underrubrik får vara högst 2000 tecken.",
    "Tournament.NotAManager":
      "Bara en arrangör av den här turneringen kan ändra den.",
    "Tournament.NotAManagerOrScorer":
      "Bara en arrangör eller resultatförare av den här turneringen kan se den.",
    "Tournament.Archived":
      "Den här turneringen är arkiverad och återställs innan den kan ändras.",
    "UpdateTournament.NoSuchTournament":
      "Det finns ingen turnering på den här adressen.",

    // Vad en turnering spelas i och var, per kod, så som API:et erbjuder dem
    // till adminens formulär.
    "sport.ac": "Association croquet",
    "sport.gc": "Golfcroquet",
    "sport.a6w": "Amerikansk 6-bågars croquet",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Lag",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship":
      "Världsmästerskapet för lag i golfcroquet",
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

    // Ett e-postmeddelande är två poster: ämnet, som är text, och innehållet,
    // som är hela dess markup. Det är det enda stället i en katalog som rymmer
    // markup, eftersom ett e-postmeddelande skrivs och översätts som ett
    // stycke text. Bara det som fyller i ett meddelande escapas; markupen här
    // är webbplatsens egen. `{link}` är länken meddelandet bär, `{site}`
    // webbplatsens adress, `{buttonBackgroundColour}` och `{buttonTextColour}`
    // knappens färger, `{emailFromName}` namnet meddelandena skickas från och
    // signeras med, och `{siteName}` vad webbplatsen heter. Inget hälsar
    // läsaren vid namn.

    "Email.ConfirmAddress.subject": "Bekräfta din e-postadress för {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hej,</p>

<p>
    Tack för att du skapade ett konto hos <strong>{siteName}</strong>.<br />
    Innan du kan börja använda ditt konto behöver du bekräfta din e-postadress
    genom att klicka på knappen nedan:
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
    Om knappen inte fungerar kan du också bekräfta din e-postadress genom att öppna den här länken i din webbläsare:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Om du inte skapade det här kontot kan du tryggt bortse från det här meddelandet.
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
    Du har nyligen begärt ett nytt meddelande för att bekräfta din e-postadress för <strong>{siteName}</strong>.<br />
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
    Om knappen inte fungerar kan du också bekräfta din e-postadress genom att öppna den här länken i din webbläsare:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    När den är bekräftad kan du fortsätta använda ditt konto utan avbrott.
</p>

<p>
    Om du inte begärde det här meddelandet kan du tryggt bortse från det.
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
    Om det inte var du behöver du inte göra något. Ingen har fått någon väg in
    på ditt konto.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bekräfta att ditt konto hos {siteName} flyttas till den här adressen",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hej,</p>

<p>
    Någon som var inloggad på ett konto hos <strong>{siteName}</strong> bad om
    att flytta det till den här e-postadressen. Om det var du, bekräfta det här,
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
    Eller kopiera den här adressen till din webbläsare:<br />
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
    Någon som var inloggad på ett konto hos <strong>{siteName}</strong> bad om
    att flytta det till den här e-postadressen, som redan har ett eget konto.
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
      "Ditt konto hos {siteName} har flyttats",
    "Email.EmailAddressChanged.body": `
<p>Hej,</p>

<p>
    Ditt konto hos <strong>{siteName}</strong> har just flyttats till en annan
    e-postadress, {emailAddress}, och du loggar in med den adressen från och med nu.
</p>

<p>
    Om det inte var du har någon annan tagit över ditt konto. Svara på det här
    meddelandet och berätta.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Ditt lösenord hos {siteName} har ändrats",
    "Email.PasswordChanged.body": `
<p>Hej,</p>

<p>
    Lösenordet för ditt konto hos <strong>{siteName}</strong> har just
    ändrats, och alla andra webbläsare som var inloggade på det har loggats ut.<br />
    Om det var du behöver du inte göra något.
</p>

<p>
    Om det inte var du har någon annan ditt lösenord. Skapa ett nytt här, så
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

    "Email.SetNewPassword.subject": "Skapa ett nytt lösenord för {siteName}",
    "Email.SetNewPassword.body": `
<p>Hej,</p>

<p>
    Du har nyligen begärt att återställa ditt lösenord för <strong>{siteName}</strong>.<br />
    Du kan återställa lösenordet genom att klicka på knappen nedan:
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
    Om knappen inte fungerar kan du också återställa lösenordet genom att öppna den här länken i din webbläsare:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Om du inte begärde en återställning av lösenordet kan du tryggt bortse från det här meddelandet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Skapa ett lösenord för {siteName}",
    "Email.SetPassword.body": `
<p>Hej,</p>

<p>
    Ditt konto hos <strong>{siteName}</strong> har inget lösenord: du loggar in med Google.<br />
    Du bad om att skapa ett, så att du också kan logga in med din e-postadress och ett lösenord.
    Du kan skapa det genom att klicka på knappen nedan:
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
        Skapa lösenord
    </a>
</p>

<p>
    Om knappen inte fungerar kan du också skapa lösenordet genom att öppna den här länken i din webbläsare:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Länken fungerar i en timme. Om du inte bad om att skapa ett lösenord kan du tryggt bortse från det här meddelandet.
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
    En begäran gjordes om att återställa lösenordet för en e-postadress som
    inte hör till något konto hos <strong>{siteName}</strong>.
</p>

<p>
    Om du vill använda vår tjänst kan du skapa ett nytt konto genom att besöka:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Om du inte gjorde den här begäran kan du tryggt bortse från det här meddelandet.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bekräfta att ditt konto hos {siteName} ska glömmas",
    "Email.ConfirmForgetting.body": `
<p>Hej,</p>

<p>
    Du bad om att ditt konto hos <strong>{siteName}</strong> ska
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
    Om knappen inte fungerar kan du också öppna den här länken i din webbläsare:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    När det är glömt kan ditt namn och din e-postadress aldrig läsas igen, av
    någon, och det går inte att logga in på kontot. Det kan inte ångras.
</p>

<p>
    Länken fungerar en gång, till 15 minuter efter att du bad om den, och bara
    medan du är inloggad på det här kontot. Därefter får du be om en ny från
    ditt konto.
</p>

<p>
    Om du inte bad om det händer ingenting om inte länken följs. Någon som var
    inloggad på ditt konto bad om det, så skapa ett nytt lösenord från sidan
    för glömt lösenord för att vara säker på att de inte kan logga in igen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registreringen är pausad: {service} går inte att nå",
    "Email.RegistrationsSuspended.body": `
<p>Hej,</p>

<p>
    {siteName} kunde inte nå {service} kl. {when}. Tills den svarar får
    läsare som behöver den, för att registrera sig eller skapa ett nytt
    lösenord, veta att de ska försöka igen senare.
</p>

<p>
    Inget behöver hävas. Varje försök frågar {service} på nytt, och sidorna
    fungerar igen i samma stund som den svarar.
</p>

<p>
    Medan {service} är nere får du e-post om det högst en gång i timmen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject": "{siteName} når inte sin databas",
    "Email.DatabaseUnreachable.body": `
<p>Hej,</p>

<p>
    {siteName} kunde inte nå sin databas kl. {when}. Tills den svarar talar varje sida som behöver den om för läsarna att webbplatsen är otillgänglig och att de ska försöka igen senare.
</p>

<p>
    Inget behöver hävas. Varje begäran ber om en anslutning på nytt, och webbplatsen fungerar igen i samma stund som databasen svarar.
</p>

<p>
    Medan databasen är nere får du e-post om det högst en gång var {minutes}:e minut.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} misslyckades med en begäran",
    "Email.UnhandledError.body": `
<p>Hej,</p>

<p>
    {siteName} misslyckades kl. {when} med en begäran om {asked}. Läsaren fick se referensen {reference}, och loggen har orsaken under den.
</p>

<p>
    En trasig webbplats brukar misslyckas med varje begäran, så du får e-post om misslyckanden högst 4 gånger i timmen. De därefter finns ändå i loggen.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
