// The site's words in Afrikaans. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as jy rather than u: the site talks to people scoring
// and following croquet, and the English it is written from is plain and
// direct rather than formal. Afrikaans on websites and in apps has settled on
// jy, and u would read as a bank talking. Items in menus and on buttons are
// written in sentence case, as Afrikaans writes them, where the English
// capitalises each word.
//
// An email address is an e-posadres and an email is e-pos, never the one for
// the other. Where croquet has no established Afrikaans word, as with most of
// the formats, the English one is kept, since that is what players say.
import type { Language } from "../common/language.js";

export const afrikaans: Language = {
  tag: "af",
  name: "Afrikaans",
  words: {
    "site.skipToContent": "Slaan oor na die inhoud",
    "navigation.menu": "Kieslys",
    "navigation.label": "Hoof",
    "navigation.home": "Tuis",
    "navigation.help": "Hulp",
    "navigation.admin": "Administrasie",
    "sections.label": "Afdelings",
    "theme.label": "Tema",
    "theme.light": "Lig",
    "theme.dark": "Donker",
    "theme.system": "Stelsel",
    "footer.donate": "Skenk",
    "footer.plea":
      "Hou jy van {siteName}? Maak 'n skenking om te help dat dit verder ontwikkel word.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privaatheid",
    "beta.banner":
      "Dit is 'n beta-webwerf. Data kan enige tyd teruggestel word.",
    "privacy.contact":
      "Vrae oor hierdie bladsy, of oor wat oor jou bewaar word: {emailAddress}",
    "tryWebsite.banner":
      "Dit is 'n veilige plek om {siteName} te leer ken. Alles wat jy hier invoer, kan enige tyd uitgevee word.",

    "language.label": "Taal",
    "language.choose": "Verander",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Daar is iets nuuts om te lees.",
    "whatsNew.admin.message":
      "Daar is iets nuuts vir mense wat toernooie bestuur.",
    "whatsNew.view": "Kyk wat is nuut",
    "whatsNew.later": "Herinner my volgende keer",
    "whatsNew.never": "Moet my nooit hierdie kennisgewing wys nie",

    "form.otherwise":
      "Iets is nie reg nie. Gaan na wat jy ingevoer het en probeer weer.",

    "account.menu": "Rekening",
    "account.register": "Registreer",
    "account.signIn": "Meld aan",
    "account.forgotPassword": "Ek het my wagwoord vergeet",
    "account.signOut": "Meld af",
    "account.profile": "Profiel",
    "account.changePassword": "Verander wagwoord",
    "account.changeEmailAddress": "Verander e-posadres",
    "account.changeName": "Verander naam",
    "account.setPassword": "Stel wagwoord",
    "account.forgetAccount": "Vergeet rekening",

    "register.title": "Registreer",
    "register.emailAddress": "E-posadres",
    "register.submit": "Registreer",
    "register.withGoogle": "Registreer met Google",
    "register.or": "of",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google het nie bevestig dat daardie e-posadres joune is nie, so dit kan nie hier saam met Google gebruik word nie. Gebruik jou e-posadres hieronder.",
    "SignInWithGoogle.LinkedToAnother":
      "Daardie e-posadres het reeds 'n rekening, wat aan 'n ander Google-rekening gekoppel is. Meld aan met daardie Google-rekening, of met jou e-posadres en jou wagwoord.",
    "SignInWithGoogle.NameMissing":
      "Google het ons nie jou naam gesê nie, en 'n rekening het een nodig. Gebruik jou e-posadres hieronder.",
    "Google.Unreachable":
      "Google kon op die oomblik nie bereik word nie. Probeer oor 'n paar minute weer, of gebruik jou e-posadres hieronder.",
    "Registration.NotAPerson":
      "Dit het nie gelyk of dit van 'n mens af kom nie. Probeer weer en, as dit aanhou gebeur, wag 'n paar minute en kom terug.",

    "EmailAddress.Missing": "Voer 'n e-posadres in.",
    "EmailAddress.NoAt": "'n E-posadres het 'n @ in.",
    "EmailAddress.MoreThanOneAt": "'n E-posadres het net een @ in.",
    "EmailAddress.NoDomain":
      "'n E-posadres het 'n domein ná die @, soos example.com.",

    "welcome.title": "Kyk na jou e-pos",
    "welcome.checkEmail":
      "Ons het 'n e-pos gestuur na die e-posadres wat jy ons gegee het. Volg die skakel daarin om voort te gaan.",
    "welcome.nothingArrived":
      "As niks binne 'n paar minute opdaag nie, kyk in jou gemorspos- of spam-vouer.",
    "welcome.home": "Terug na {siteName}",
    "newConfirmationLink.title": "Vra vir 'n nuwe skakel",
    "newConfirmationLink.explanation":
      "Die skakel om jou e-posadres te bevestig het verval. Vra vir 'n nuwe een, en dit word gestuur na die e-posadres waarmee jy geregistreer het.",
    "newConfirmationLink.send": "Stuur vir my 'n nuwe skakel",
    "newConfirmationLink.home": "Terug na {siteName}",
    "newConfirmationLink.signIn": "Meld aan",
    "newConfirmationLink.sent.title": "Kyk na jou e-pos",
    "newConfirmationLink.sent.explanation":
      "Ons het vir jou 'n nuwe skakel gestuur. Volg dit om jou e-posadres te bevestig. As niks binne 'n paar minute opdaag nie, kyk in jou gemorspos- of spam-vouer.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Daardie e-posadres is reeds bevestig",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Daar is niks meer om te bevestig nie. Meld aan met die wagwoord wat jy gegee het toe jy dit bevestig het.",
    "newConfirmationLink.noLongerWorks.title":
      "Daardie skakel werk nie meer nie",
    "newConfirmationLink.noLongerWorks.explanation":
      "Maak seker jy het die hele skakel in die e-pos gevolg, met niks wat aan die einde ontbreek nie. As dit steeds nie werk nie, registreer weer en 'n nuwe skakel sal vir jou gestuur word.",
    "newConfirmationLink.tooMany.title": "Probeer later weer",
    "newConfirmationLink.tooMany.explanation":
      "Daar is die afgelope tyd verskeie skakels na hierdie e-posadres gestuur. Wag 'n uur en vra weer, en kyk intussen in jou gemorspos- of spam-vouer.",

    "forgotPassword.title": "Het jy jou wagwoord vergeet?",
    "forgotPassword.emailAddress": "E-posadres",
    "forgotPassword.submit": "Stuur vir my 'n manier om weer in te kom",
    "forgotPassword.home": "Terug na {siteName}",
    "forgotPassword.sent.title": "Kyk na jou e-pos",
    "forgotPassword.sent.explanation":
      "As daardie e-posadres 'n rekening het, het ons vir jou 'n skakel gestuur om 'n nuwe wagwoord te stel. Volg dit binne 'n uur. As niks binne 'n paar minute opdaag nie, kyk in jou gemorspos- of spam-vouer.",
    "forgotPassword.tryAgainLater":
      "Daar is die afgelope tyd te veel maniere om weer in te kom van hier af gevra. Wag 'n uur en probeer weer.",

    "setNewPassword.title": "Stel 'n nuwe wagwoord",
    "setNewPassword.password": "Wagwoord",
    "setNewPassword.confirmPassword": "Bevestig wagwoord",
    "setNewPassword.submit": "Stel my nuwe wagwoord",
    "setNewPassword.home": "Terug na {siteName}",
    "setNewPassword.signIn": "Meld aan",
    "setNewPassword.askAgain": "Vra vir 'n nuwe skakel",
    "setNewPassword.changed.title": "Jou wagwoord is verander",
    "setNewPassword.changed.explanation":
      "Jy is afgemeld oral waar jy aangemeld was. Meld aan met jou nuwe wagwoord.",
    "setNewPassword.expired.title": "Daardie skakel het verval",
    "setNewPassword.expired.explanation":
      "'n Skakel om 'n nuwe wagwoord te stel werk vir 'n uur. Vra vir 'n ander een, en dit word na dieselfde e-posadres gestuur.",
    "setNewPassword.noLongerWorks.title": "Daardie skakel werk nie meer nie",
    "setNewPassword.noLongerWorks.explanation":
      "Dit is dalk reeds gebruik, of iets ontbreek aan die einde. Vra vir 'n ander een as jy dit nog nodig het.",

    "BreachedPasswords.Unreachable":
      "Jou wagwoord kan op die oomblik nie nagegaan word nie, so dit is nie verander nie. Probeer oor 'n paar minute weer; jou skakel werk nog totdat dit verval.",

    "forgetAccount.title": "Vergeet jou rekening",
    "forgetAccount.explanation":
      "Jou naam en jou e-posadres kan vir altyd onleesbaar gemaak word, en jou rekening gesluit word. Om seker te maak dit is jy, stuur ons eers 'n skakel na die e-posadres van jou rekening, en niks word vergeet voordat jy dit volg nie.",
    "forgetAccount.submit": "Stuur vir my die skakel",
    "forgetAccount.sent.title": "Kyk na jou e-pos",
    "forgetAccount.sent.explanation":
      "Ons het 'n skakel gestuur na die e-posadres van jou rekening. Dit werk vir 15 minute, en net solank jy by hierdie rekening aangemeld is.",
    "forgetAccount.confirm.title": "Jou rekening vir altyd vergeet?",
    "forgetAccount.confirm.explanation":
      "Sodra dit vergeet is, sal niemand weer jou naam of jou e-posadres kan lees nie, en niemand sal by jou rekening kan aanmeld nie. Dit kan nie ongedaan gemaak word nie.",
    "forgetAccount.confirm.submit": "Vergeet my rekening",
    "forgetAccount.forgotten.title": "Jou rekening is vergeet",
    "forgetAccount.forgotten.explanation":
      "Jou naam en jou e-posadres kan nie meer gelees word nie, en jy is afgemeld oral waar jy aangemeld was.",
    "forgetAccount.noLongerWorks.title": "Daardie skakel werk nie meer nie",
    "forgetAccount.noLongerWorks.explanation":
      "Dit het dalk verval, is reeds gebruik, of is vir 'n rekening waarby jy nie aangemeld is nie. Vra weer vanuit jou rekening as jy nog wil hê dit moet vergeet word.",
    "forgetAccount.lastAdministrator.title":
      "Jou rekening kan nie vergeet word nie",
    "forgetAccount.lastAdministrator.explanation":
      "Jy is die enigste administrateur van hierdie werf. Gee die administrateurrol aan iemand anders, en dan kan jou rekening vergeet word.",
    "forgetAccount.askAgain": "Vra weer",
    "forgetAccount.home": "Terug na {siteName}",

    "registrationsSuspended.title": "Registrasie is vir eers opgeskort",
    "registrationsSuspended.explanation":
      "'n Diens wat registrasie nodig het kan op die oomblik nie bereik word nie, so niemand kan registreer totdat dit weer antwoord nie. Niks wat jy getik het, is gestoor nie.",
    "registrationsSuspended.tryAgainLater":
      "Probeer oor 'n rukkie weer. Die administrateur van die werf is in kennis gestel.",
    "registrationsSuspended.home": "Terug na {siteName}",

    "signIn.title": "Meld aan",
    "signIn.emailAddress": "E-posadres",
    "signIn.password": "Wagwoord",
    "signIn.submit": "Meld aan",
    "signIn.forgotPassword": "Het jy jou wagwoord vergeet?",
    "signIn.register": "Registreer",
    "signIn.withGoogle": "Meld aan met Google",
    "signIn.or": "of",
    "signIn.tryAgainLater":
      "Daar is die afgelope tyd te veel pogings aangewend. Wag 'n uur en probeer weer.",

    "SignIn.Failed": "Die e-posadres of wagwoord is nie reg nie. Probeer weer.",

    "profile.title": "Profiel",
    "profile.name": "Naam:",
    "profile.emailAddress": "E-posadres:",

    "changeName.title": "Verander naam",
    "changeName.name": "Naam",
    "changeName.submit": "Verander naam",

    "setPassword.title": "Stel 'n wagwoord",
    "setPassword.explanation":
      "Jou rekening het nie 'n wagwoord nie: jy meld met Google aan. Om ook met 'n wagwoord te kan aanmeld, stuur ons 'n skakel na {emailAddress} om een te stel.",
    "setPassword.submit": "Stuur vir my 'n skakel",
    "setPassword.sent.title": "Kyk na jou e-pos",
    "setPassword.sent.explanation":
      "Ons het vir jou 'n skakel gestuur om 'n wagwoord te stel. Dit werk vir 'n uur.",
    "setPassword.profile": "Terug na jou profiel",

    "changePassword.title": "Verander wagwoord",
    "changePassword.currentPassword": "Huidige wagwoord",
    "changePassword.password": "Nuwe wagwoord",
    "changePassword.passwordConfirmation": "Bevestig wagwoord",
    "changePassword.forgotPassword": "Het jy jou wagwoord vergeet?",
    "changePassword.submit": "Verander wagwoord",
    "ChangePassword.WrongPassword": "Dit is nie jou wagwoord nie.",

    "changeEmailAddress.title": "Verander e-posadres",
    "changeEmailAddress.emailAddress": "Nuwe e-posadres",
    "changeEmailAddress.currentPassword": "Huidige wagwoord",
    "changeEmailAddress.submit": "Stuur 'n bevestigingskakel",
    "changeEmailAddress.sent.title": "Kyk na jou e-pos",
    "changeEmailAddress.sent.explanation":
      "'n Skakel om die skuif te bevestig is gestuur na die nuwe e-posadres. Volg dit, terwyl jy aangemeld is, om jou rekening soontoe te skuif.",
    "changeEmailAddress.confirm.title": "Skuif jou rekening",
    "changeEmailAddress.confirm.explanation":
      "Jou rekening sal skuif na {emailAddress}. Van nou af sal jy met daardie e-posadres aanmeld.",
    "changeEmailAddress.confirm.submit": "Skuif my rekening",
    "changeEmailAddress.noLongerWorks.title":
      "Hierdie skakel werk nie meer nie",
    "changeEmailAddress.noLongerWorks.explanation":
      "Dit het verval, is reeds gebruik, of is nie gestuur vir die rekening waarby jy aangemeld is nie. Vra weer vanuit jou profiel.",
    "changeEmailAddress.taken.title": "Jou rekening is nie geskuif nie",
    "changeEmailAddress.profile": "Terug na jou profiel",
    "ChangeEmailAddress.WrongPassword": "Dit is nie jou wagwoord nie.",
    "ChangeEmailAddress.Unchanged":
      "Jou rekening is reeds by hierdie e-posadres.",
    "ChangeEmailAddress.Taken":
      "Daardie e-posadres het reeds 'n rekening van sy eie, so joune kan nie soontoe skuif nie.",

    "confirmEmailAddress.title": "Bevestig jou e-posadres",
    "confirmEmailAddress.name": "Naam",
    "confirmEmailAddress.password": "Wagwoord",
    "confirmEmailAddress.confirmPassword": "Bevestig wagwoord",
    "confirmEmailAddress.submit": "Bevestig my e-posadres",
    "confirmEmailAddress.signIn": "Meld aan",
    "confirmEmailAddress.home": "Terug na {siteName}",
    "confirmEmailAddress.confirmed.title": "Jou e-posadres is bevestig",
    "confirmEmailAddress.confirmed.explanation":
      "Jou rekening is gereed. Meld aan met die e-posadres en wagwoord wat jy pas gegee het.",
    "confirmEmailAddress.expired.title": "Daardie skakel het verval",
    "confirmEmailAddress.expired.explanation":
      "'n Skakel om 'n e-posadres te bevestig werk vir 24 uur. Vra vir 'n nuwe een, en dit word na dieselfde e-posadres gestuur.",
    "confirmEmailAddress.expired.newLink": "Stuur vir my 'n nuwe skakel",
    "confirmEmailAddress.noLongerWorks.title":
      "Daardie skakel werk nie meer nie",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Maak seker jy het die hele skakel in die e-pos gevolg, met niks wat aan die einde ontbreek nie. As dit steeds nie werk nie, registreer weer en 'n nuwe skakel sal vir jou gestuur word.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Daardie e-posadres is reeds bevestig",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Daar is niks meer om te doen nie. Meld aan met die wagwoord wat jy gegee het toe jy dit bevestig het.",

    "PersonName.Missing": "Voer 'n naam in.",
    "PersonName.TooShort": "'n Naam moet minstens 3 karakters lank wees.",
    "PersonName.TooLong": "'n Naam mag hoogstens 254 karakters lank wees.",
    "WorldRankingName.TooShort":
      "Die naam op die wêreldranglys moet minstens 3 karakters lank wees.",
    "WorldRankingName.TooLong":
      "Die naam op die wêreldranglys mag hoogstens 254 karakters lank wees.",
    "Password.Missing": "Voer 'n wagwoord in.",
    "Password.TooShort": "'n Wagwoord moet minstens 12 karakters lank wees.",
    "Password.ConfirmationDiffers":
      "Dit stem nie ooreen met die wagwoord hierbo nie. Tik dit weer.",
    "Password.Breached":
      "Hierdie wagwoord het in 'n datalek op 'n ander werf verskyn, so dit is nie veilig om hier te gebruik nie. Kies 'n ander een.",

    "javaScriptRequired.title": "JavaScript is nodig",
    "javaScriptRequired.explanation":
      "Om te registreer moet JavaScript vir hierdie werf aan wees, sodat daar nagegaan kan word dat dit 'n mens is wat registreer. Skakel dit aan en registreer weer.",
    "javaScriptRequired.register": "Terug na registrasie",
    "javaScriptRequired.home": "Terug na {siteName}",

    "errors.backHome": "Terug na {siteName}",
    "errors.notFound": "Nie gevind nie",
    "errors.refused": "Dit kon nie gedoen word nie",
    "errors.refusedDetail": "Iets in wat gestuur is, was nie reg nie.",
    "errors.sorry": "Jammer",
    "errors.sorryDetail": "Daardie versoek kon nie hanteer word nie.",
    "errors.failed": "Iets het skeefgeloop",
    "errors.reference": "Verwysing {reference}.",
    "errors.recorded":
      "Die fout is aangeteken en ’n e-pos is aan die administrateur gestuur. Dit help om die administrateur te e-pos met die verwysing en ’n beskrywing van wat jy gedoen het.",
    "errors.message": "E-pos die administrateur",
    "errors.messageSubject": "Fout {reference} op {siteName}",
    "errors.messageBody": "Wat ek gedoen het toe dit gebeur het:\n\n",
    "errors.unavailable": "Die webwerf is nie beskikbaar nie",
    "errors.unavailableDetail":
      "Die webwerf kan nou nie bykom wat dit nodig het nie. Probeer asseblief later weer.",
    "errors.maintenance": "Die webwerf is af vir instandhouding.",
    "errors.maintenanceMinutes": "Dit word oor {minutes} minute terug verwag.",
    "errors.maintenanceMinute": "Dit word oor 1 minuut terug verwag.",
    "errors.maintenanceLonger":
      "Dit neem langer as verwag en sal binnekort terug wees.",

    "home.recentResults": "Onlangse uitslae",
    "home.recentResults.none":
      "Geen spel is die afgelope sewe dae bygevoeg nie.",
    "home.upcomingTournaments": "Komende toernooie",
    "home.upcomingTournaments.none":
      "Geen toernooi begin in die volgende sestig dae nie.",
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Naam",
    "tournamentList.onlyIn": "Net toernooie in {country}",
    "tournamentList.filter.country": "Land",
    "tournamentList.filter.anyCountry": "Enige land",
    "tournamentList.filter.region": "Streek",
    "tournamentList.filter.anyRegion": "Enige streek",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Enige sport",
    "tournamentList.filter.submit": "Filtreer",
    "home.allTournaments": "Al die toernooie van {year}",
    "year.heading": "Toernooie van {year}",
    "year.none": "Geen toernooi begin in {year} nie.",
    "yearSport.heading": "{sport}-toernooie in {year}",
    "yearSport.none": "Geen {sport}-toernooi begin in {year} nie.",
    "tournament.recent": "Onlangs",
    "tournament.summary": "Opsomming",
    "test.bestOf": "Elke ontmoeting is die beste van {count}.",
    "test.vs": "teen",
    "test.matches": "Wedstryde",
    "test.games": "Spelle",
    "test.hoops": "Hoepels",
    "teamSummary.tests": "Toetse",
    "teamSummary.matches": "Wedstryde",
    "teamSummary.games": "Spelle",
    "teamSummary.hoops": "Hoepels",
    "teamSummary.wins": "Oorwinnings",
    "teamSummary.losses": "Verliese",
    "teamSummary.draws": "Gelykopuitslae",
    "teamSummary.for": "Vir",
    "teamSummary.against": "Teen",
    "teamSummary.net": "Netto",
    "tournament.players": "Spelers",
    "search.label": "Soek",
    "search.tournaments": "Toernooie",
    "search.competitions": "Kompetisies",
    "search.nothingFound": "Niks is gevind nie.",
    "players.search.label": "Soek spelers",
    "players.search.prompt": "Tik 'n speler se naam om hulle te vind.",
    "players.search.none": "Geen spelers is gevind nie.",
    "search.more":
      "Slegs die eerste {count} word gewys. Voeg meer van die naam by om die soektog te verfyn.",
    "websitePlayer.tournament": "Toernooi",
    "tournament.test": "{first} teen {second}",
    "tournament.notes": "Notas",
    "tournament.commentary": "Kommentaar",
    "tournament.beat": "het gewen teen",
    "tournament.drewWith": "het gelykop gespeel teen",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 uur",
    "tournament.ago.hours": "{count} uur",
    "tournament.none": "Nog geen spel is gespeel nie.",
    "players.none": "Nog geen speler is bygevoeg nie.",
    "commentaries.by": "deur",
    "commentaries.start": "Begin 'n nuwe kommentaar",
    "commentaries.disclaimer.heading": "Vrywaring",
    "commentaries.disclaimer":
      "Die menings wat in hierdie kommentaar uitgespreek word, is dié van hul skrywers en weerspieël nie noodwendig dié van Tim Murphy of {site} nie.",
    "commentaries.guidelines.heading": "Riglyne",
    "commentaries.guidelines.responsible":
      "Jy is verantwoordelik vir jou kommentaar.",
    "commentaries.guidelines.purpose":
      'Kommentaar is bedoel om te vertel wat in die toernooi aan die gang is. Dit is nie bedoel as \'n "sosiale netwerk" om goeie wense en so meer te stuur nie.',
    "commentaries.guidelines.hatred":
      "Moenie iets plaas wat tot geweld of haat kan aanhits nie. Ons sal nie kommentaar duld wat ander verneder op grond van hul ras, godsdiens, etniese herkoms, geslag, ouderdom, verstandelike of liggaamlike gestremdheid, of seksuele oriëntasie nie.",
    "commentaries.guidelines.abuse":
      "Growwe beledigings sal nie geduld word nie. Die algemene reël is dat kommentaar die bal speel en nie die man nie, dit wil sê, dit moet nie iemand persoonlik aanval nie maar oor die saak self gaan.",
    "commentaries.guidelines.unlawful":
      "Enige kommentaar wat moontlik onwettig is, soos moontlike skendings van outeursreg of materiaal wat lasterlik kan wees, sal verwyder word.",
    "commentaries.guidelines.shouting":
      "Moet asseblief nie vloek of alles in hoofletters skryf in kommentaar nie.",
    "commentaries.guidelines.selling":
      "Moenie kommentaar vir handelsdoeleindes of spam gebruik nie. Kommentaar wat goedere of dienste adverteer, bevorder of aanbied, sal verwyder word.",
    "commentaries.guidelines.links":
      "Beperk asseblief skakels in kommentaar. Kommentaar met skakels na onvanpaste materiaal sal verwyder word.",
    "commentaries.guidelines.impersonating":
      "Moenie jou in kommentaar as iemand anders voordoen nie, en moenie persoonlike besonderhede plaas nie – telefoonnommers, posadresse of e-posadresse – wat iemand per ongeluk in gevaar kan stel.",
    "commentaries.reporting.heading": "Rapporteer kommentaar",
    "commentaries.reporting.before":
      "Rapporteer asseblief kommentaar wat nie aan hierdie riglyne voldoen nie aan",
    "commentaries.reporting.after":
      ". Noem die webadres en die betwiste kommentaar. Byvoorbeeld:",
    "commentaries.reporting.exampleComment":
      '"\'n kommentaar wat verwyder behoort te word"',
    "commentaries.reporting.exampleReason":
      "Hierdie kommentaar behoort verwyder te word omdat...",
    "commentaries.reporting.reviewed":
      "Om iets te rapporteer beteken nie dit word outomaties verwyder nie, maar elke verslag sal nagegaan word.",
    "commentaries.reporting.reserved":
      "{site} behou die reg voor om kommentaar te verwyder.",
    "commentaries.reporting.subject": "{site} Kommentaarverslag",
    "commentaries.reporting.body":
      "Noem asseblief die webadres, die betwiste kommentaar en hoekom dit verwyder behoort te word.",
    "startCommentary.title": "Begin 'n nuwe kommentaar",
    "startCommentary.titleField": "Titel",
    "startCommentary.submit": "Begin die kommentaar",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Die organiseerders het nog geen notas geskryf nie.",
    "marks.new": "nuut",
    "note.edited": "gewysig",
    "commentary.none": "Nog niks is geskryf nie.",
    "commentary.edited": "gewysig",
    "commentary.edit": "Wysig",
    "commentary.delete": "Skrap",
    "commentary.comment": "Kommentaar",
    "commentary.add": "Voeg by",
    "commentary.notSent":
      "Die kommentaar kon nie gestuur word nie. Laai die bladsy weer om te sien of dit gestoor is.",
    "changeCommentaryTitle.title": "Verander die titel",
    "changeCommentaryTitle.submit": "Stoor",
    "editComment.title": "Wysig die kommentaar",
    "editComment.save": "Stoor",
    "deleteComment.title": "Skrap die kommentaar",
    "deleteComment.question":
      "Hierdie kommentaar skrap? Dit kan nie ongedaan gemaak word nie.",
    "deleteComment.confirm": "Skrap die kommentaar",
    "deleteComment.keep": "Hou dit",
    "player.games": "Spelle",
    "player.competitions": "Kompetisies",
    "player.beat": "het gewen teen",
    "player.lostTo": "het verloor teen",
    "player.drewWith": "het gelykop gespeel teen",
    "player.score": "{score} teen {opponent}",
    "player.noGames": "Nog geen spel is gespeel nie.",
    "player.noCompetitions": "Nog nie vir enige kompetisie ingeskryf nie.",
    "block.wins": "Oorwinnings",
    "block.matches": "Ontmoetings",
    "block.netGames": "Netto spelle",
    "block.games": "Spelle",
    "block.netHoops": "Netto hoepels",
    "block.won": "gewen",
    "block.lost": "verloor",
    "block.drawn": "gelykop",
    "block.withdrawn": "onttrek",
    "block.gameWithdrawn": "onttrek",
    "block.losses": "Verliese",
    "competition.views": "Aansigte",
    "competition.view.grid": "Rooster",
    "competition.view.summary": "Opsomming",
    "competition.view.orderOfPlay": "Speelorde",
    "blockSummary.ranking":
      "Gerangskik volgens die aandeel ontmoetings gewen en dan volgens netto hoepels. 'n Toernooi se reëls kan sy spelers anders rangskik.",
    "orderOfPlay.none": "Nog geen spel is gespeel nie.",
    "knockout.round.final": "Eindstryd",
    "knockout.round.semis": "Halfeindrondtes",
    "knockout.round.quarters": "Kwarteindrondtes",
    "knockout.round.number": "Ronde {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Spelle",
    "swiss.wins": "Oorwinnings",
    "swiss.winShare": "% oorwinnings",
    "swiss.results": "Uitslae",
    "knockout.onward": "Volgende rondes",
    "knockout.back": "Vorige rondes",
    "years.label": "Jare",
    "years.earlier": "Vroeër jare",

    "admin.newerBuild.message": "Daar is 'n nuwer weergawe van hierdie werf.",
    "admin.newerBuild.reload": "Laai weer",
    "admin.title": "Administrasie",
    "admin.tournaments.new": "Nuwe toernooi",
    "admin.tournaments.none": "Geen toernooie nie",
    "admin.tournaments.archived": "Geargiveer",
    "admin.tournaments.manage": "Bestuur",
    "admin.tournaments.edit": "Wysig",
    "admin.tournaments.archive": "Argiveer",
    "admin.tournaments.restore": "Herstel",
    "admin.tournaments.scores": "Uitslae",
    "admin.tournaments.players": "Spelers",
    "admin.years.label": "Jare",
    "admin.years.earlier": "Vroeër jare",
    "admin.tournament.name": "Naam",
    "admin.tournament.starts": "Begin",
    "admin.tournament.finishes": "Eindig",
    "admin.tournament.format": "Formaat",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Land",
    "admin.tournament.region": "Streek",
    "admin.tournament.subtitle": "Onderskrif",
    "admin.tournament.handicap": "Met voorgee gespeel",
    "admin.tournament.drawsAllowed": "Laat gelykopuitslae toe",
    "admin.tournament.levelTestsDrawn": "Gelyke toetse is gelykop",
    "admin.tournament.worldRankings": "Tel vir die wêreldranglys",
    "admin.tournament.national": "Byeenkoms op nasionale vlak",
    "admin.tournament.international": "Byeenkoms op internasionale vlak",
    "admin.tournament.otherwise": "Dit kan nie aanvaar word soos dit is nie.",
    "admin.newTournament.title": "Nuwe toernooi",
    "admin.newTournament.submit": "Skep toernooi",
    "admin.editTournament.title": "Wysig toernooi",
    "admin.editTournament.submit": "Dateer toernooi op",
    "admin.editTournament.otherwise":
      "Hierdie toernooi kan nie verander word nie.",
    "admin.view.tabs": "Toernooi",
    "admin.view.players": "Spelers",
    "admin.view.competitions": "Kompetisies",
    "admin.view.managers": "Bestuurders",
    "admin.view.notes": "Notas",
    "admin.view.scorers": "Telers",
    "admin.view.rankings": "Ranglyste",
    "admin.rankings.textFile":
      "Die uitslae van die toernooi word as 'n teksleer aan die wêreldranglys gestuur, wat die webwerf uit die ingevoerde wedstryde skryf.",
    "admin.rankings.spreadsheet":
      "Die uitslae van die toernooi word as 'n sigblad aan die wêreldranglys gestuur, wat die webwerf uit die ingevoerde wedstryde skryf.",
    "admin.rankings.fillInWinners":
      "Die webwerf kan net raai wie elke kompetisie gewen het, so kontroleer die Winner-reël van elkeen voordat jy die leer stuur.",
    "admin.rankings.fillInWinner":
      "Die webwerf kan nie weet wie die toernooi gewen het nie, so vul dit onderaan die sigblad in voordat jy dit stuur.",
    "admin.rankings.sendIt":
      "Stuur dan die leer na die beamptes van die wêreldranglys.",
    "admin.rankings.download": "Laai ranglyste af",
    "rankings.notAvailable": "Ranglyste is nie beskikbaar nie",
    "rankings.notAvailable.sport":
      "Hierdie toernooi se sportsoort het geen wêreldranglys nie, so daar is geen ranglyste om te stuur nie.",
    "rankings.notAvailable.handicap":
      "Hierdie toernooi word met handicap gespeel, so dit tel nie vir die wêreldranglys nie.",
    "rankings.notAvailable.drawnGames":
      "Hierdie toernooi laat gelykopwedstryde toe, so dit tel nie vir die wêreldranglys nie.",
    "rankings.notAvailable.notCounted":
      "Die bestuurder van hierdie toernooi het gesê dit tel nie vir die wêreldranglys nie.",
    "admin.view.otherwise":
      "Hierdie toernooi kan nie van hier af bestuur word nie.",
    "admin.competitionView.tabs": "Kompetisie",
    "admin.competitionView.players": "Spelers",
    "admin.competitionView.scores": "Uitslae",
    "admin.sections.label": "Die toernooi en sy kompetisies",
    "admin.sections.tournament": "Toernooi",
    "admin.administrator.sections.label": "Die administrateur se bladsye",
    "admin.administrator.sections.tournaments": "Toernooie",
    "admin.administrator.sections.accounts": "Rekeninge",
    "admin.administrator.sections.worldRankings": "Wêreldranglys",
    "admin.administrator.sections.importErrors": "Invoerfoute",
    "admin.administrator.sections.logs": "Logboeke",
    "admin.administrator.title": "Administrateur",
    "admin.accounts.title": "Rekeninge",
    "admin.roles.add": "Voeg by",
    "admin.roles.administrator.heading": "Administrateurs",
    "admin.roles.administrator.none": "Geen ander administrateurs nie",
    "admin.roles.administrator.removeTitle": "Verwyder administrateur",
    "admin.roles.administrator.removeExplanation":
      "{name} sal nie meer 'n administrateur van hierdie werf wees nie.",
    "admin.roles.world-ranking-officer.heading":
      "Beamptes vir die wêreldranglys",
    "admin.roles.world-ranking-officer.none":
      "Geen beamptes vir die wêreldranglys nie",
    "admin.roles.world-ranking-officer.removeTitle":
      "Verwyder beampte vir die wêreldranglys",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} sal nie meer 'n beampte vir die wêreldranglys wees nie.",
    "admin.worldRankings.title": "Voer wêreldranglyspelers in",
    "admin.worldRankings.import": "Voer in",
    "admin.worldRankings.log": "Hoe die invoer verloop het",
    "admin.worldRankings.ac.reading": "Lees tans die association croquet-lys",
    "admin.worldRankings.ac.read":
      "Association croquet-spelers gelees: {players}",
    "admin.worldRankings.ac.kept":
      "Association croquet-spelers gehou: {players}",
    "admin.worldRankings.ac.refused":
      "Die association croquet-lys kon nie gelees word nie, so sy spelers is gelaat soos hulle was.",
    "admin.worldRankings.gc.reading": "Lees tans die golf croquet-lys",
    "admin.worldRankings.gc.read": "Golf croquet-spelers gelees: {players}",
    "admin.worldRankings.gc.kept": "Golf croquet-spelers gehou: {players}",
    "admin.worldRankings.gc.refused":
      "Die golf croquet-lys kon nie gelees word nie, so sy spelers is gelaat soos hulle was.",
    "admin.worldRankings.finished": "Klaar",
    "admin.worldRankings.failed": "Die invoer is nie voltooi nie.",
    "admin.worldRankings.otherwise": "Iets het op die werf skeefgeloop.",
    "WorldRankingLists.Unreachable":
      "Die wêreldranglyswerf kon nie bereik word nie.",
    "WorldRankingLists.Unreadable":
      "Die lys het nie die vorm van die wêreldranglyste nie: 'n reël kon nie gelees word nie, het niemand in nie, of is nie in UTF-8 geskryf nie.",
    "admin.importErrors.title": "Invoerfoute",
    "admin.importErrors.none": "Geen invoerfoute nie",
    "admin.importErrors.otherwise": "Iets het op die werf skeefgeloop.",
    "admin.logs.title": "Logboeke",
    "admin.logs.severity": "Erns",
    "admin.logs.text": "Soek",
    "admin.logs.show": "Wys",
    "admin.logs.prune": "Snoei",
    "admin.logs.pruneAsk":
      "Die logboek van voor die laaste uur verwyder? Niks bring dit terug nie.",
    "admin.logs.removed": "{count} inskrywings is verwyder",
    "admin.logs.none": "Geen logboekinskrywings nie",
    "admin.logs.otherwise": "Iets het op die werf skeefgeloop.",
    "admin.hover.logs.show": "Wys die inskrywings wat ooreenstem",
    "admin.hover.logs.prune": "Verwyder die logboek van voor die laaste uur",
    "admin.hover.logs.pruneAgree":
      "Verwyder die logboek van voor die laaste uur",
    "admin.importError.title": "Invoerfout",
    "admin.importError.documentId": "Dokument-id",
    "admin.importError.tournament": "Toernooi",
    "admin.importError.competition": "Kompetisie",
    "admin.importError.newSite": "Nuwe werf",
    "admin.importError.oldSite": "Ou werf",
    "ImportErrorKept.NotFound":
      "Die invoer het geen fout vir daardie dokument gehou nie.",
    "admin.competitionView.otherwise":
      "Hierdie kompetisie kan nie van hier af bestuur word nie.",
    "admin.competitions.block": "Blok",
    "admin.competitions.knockout": "Uitskakeling",
    "admin.competitions.swiss": "Switsers",
    "admin.competitions.view": "Bekyk",
    "admin.competitions.edit": "Wysig",
    "admin.competitions.up": "Op",
    "admin.competitions.down": "Af",
    "admin.competitions.archive": "Argiveer",
    "admin.competitions.restore": "Herstel",
    "admin.competitions.archived": "Geargiveerde kompetisies",
    "admin.competitions.none": "Geen kompetisies nie",
    "admin.competitions.add": "Voeg kompetisie by",
    // The competition dialog.
    "admin.competition.addTitle": "Voeg kompetisie by",
    "admin.competition.editTitle": "Wysig kompetisie",
    "admin.competition.name": "Naam",
    "admin.competition.kind": "Soort",
    "admin.competition.bestOf": "Beste van",
    "admin.competition.rounds": "Rondes",
    "admin.competition.places": "Plekke",
    "admin.competition.round": "Ronde {number}",
    "admin.competition.bestOfs": "Beste van",
    "admin.competition.quarters": "Kwarteindrondtes",
    "admin.competition.semis": "Halfeindrondtes",
    "admin.competition.final": "Eindstryd",
    "admin.competition.add": "Voeg by",
    "admin.competition.save": "Stoor",
    "admin.competition.added": "{name} is bygevoeg.",
    "admin.competition.otherwise":
      "Hierdie kompetisie kan nie gestoor word soos dit is nie.",
    "CompetitionName.Missing": "Voer 'n naam in.",
    "CompetitionName.TooLong": "'n Naam mag hoogstens 254 karakters lank wees.",
    "CompetitionName.NoLetterOrDigit": "'n Naam het 'n letter of syfer nodig.",
    "Tournament.KnockoutPlayerHasGames":
      "Spelers in hierdie rooster het wedstryde, so hul plekke kan nie verander nie.",
    "Tournament.CompetitionNameTaken":
      "Nog 'n kompetisie in hierdie toernooi het reeds daardie naam.",
    "BestOf.NotWhole": "Voer 'n heelgetal spelle in.",
    "BestOf.TooSmall": "'n Ontmoeting moet die beste van minstens 1 spel wees.",
    "Rounds.NotWhole": "Voer 'n heelgetal rondes in.",
    "Rounds.TooSmall": "'n Blok moet in minstens 1 ronde gespeel word.",
    "KnockoutDraw.EvenBestOf":
      "'n Uitskakelingsontmoeting moet 'n wenner hê, so dit is die beste van 'n onewe getal spelle.",
    "admin.hover.tournaments.new": "Skep 'n nuwe toernooi",
    "admin.hover.tournaments.manage":
      "Bestuur hierdie toernooi se spelers, spanne, kompetisies en uitslae",
    "admin.hover.tournaments.edit":
      "Verander die besonderhede van hierdie toernooi",
    "admin.hover.tournaments.scores":
      "Voer die uitslae van hierdie toernooi in",
    "admin.hover.tournaments.players":
      "Sorg vir die spelers van hierdie toernooi",
    "admin.hover.competitions.view":
      "Maak hierdie kompetisie oop om sy spelers en uitslae te sien en in te voer",
    "admin.hover.tests.view":
      "Maak hierdie toets oop om sy uitslae te sien en in te voer",
    "admin.hover.teams.view":
      "Maak hierdie span oop om sy spelers te sien en te bestuur",
    "admin.hover.dialog.player.add": "Voeg hierdie speler by die toernooi",
    "admin.hover.dialog.player.save":
      "Stoor die veranderinge aan hierdie speler",
    "admin.hover.dialog.team.add": "Voeg hierdie span by die toernooi",
    "admin.hover.dialog.team.save": "Stoor die veranderinge aan hierdie span",
    "admin.hover.dialog.test.add": "Voeg hierdie toets by die toernooi",
    "admin.hover.dialog.test.save": "Stoor die veranderinge aan hierdie toets",
    "admin.hover.dialog.competition.add":
      "Voeg hierdie kompetisie by die toernooi",
    "admin.hover.dialog.competition.save":
      "Stoor die veranderinge aan hierdie kompetisie",
    "admin.hover.dialog.score.add": "Voeg hierdie uitslag by die kompetisie",
    "admin.hover.dialog.score.save":
      "Stoor die regstelling van hierdie uitslag",
    "admin.hover.dialog.carryForward.save": "Dra hierdie speler se uitslae oor",
    "admin.hover.dialog.tournament.new": "Skep hierdie toernooi",
    "admin.hover.dialog.tournament.edit":
      "Stoor die veranderinge aan hierdie toernooi",
    "admin.hover.modal.cancel": "Maak dit toe sonder om iets te stoor",
    "admin.hover.modal.ok": "Maak hierdie boodskap toe",
    "admin.hover.tab": "Wys die {name}-oortjie",
    "admin.hover.tournaments.archive":
      "Argiveer hierdie toernooi; dit kan herstel word",
    "admin.hover.tournaments.restore":
      "Kry hierdie geargiveerde toernooi terug",
    "admin.hover.players.add": "Voeg 'n speler by hierdie toernooi",
    "admin.hover.players.edit": "Verander die besonderhede van hierdie speler",
    "admin.hover.players.up": "Skuif hierdie speler op in die lys",
    "admin.hover.players.down": "Skuif hierdie speler af in die lys",
    "admin.hover.players.archive":
      "Argiveer hierdie speler; die speler kan herstel word",
    "admin.hover.players.restore": "Kry hierdie geargiveerde speler terug",
    "admin.hover.teams.add": "Voeg 'n span by hierdie toernooi",
    "admin.hover.teams.edit": "Verander die besonderhede van hierdie span",
    "admin.hover.teams.up": "Skuif hierdie span op in die lys",
    "admin.hover.teams.down": "Skuif hierdie span af in die lys",
    "admin.hover.teams.archive": "Argiveer hierdie span; dit kan herstel word",
    "admin.hover.teams.restore": "Kry hierdie geargiveerde span terug",
    "admin.hover.competitions.add": "Voeg 'n kompetisie by hierdie toernooi",
    "admin.hover.competitions.edit":
      "Verander die besonderhede van hierdie kompetisie",
    "admin.hover.competitions.up": "Skuif hierdie kompetisie op in die lys",
    "admin.hover.competitions.down": "Skuif hierdie kompetisie af in die lys",
    "admin.hover.competitions.archive":
      "Argiveer hierdie kompetisie; dit kan herstel word",
    "admin.hover.competitions.restore":
      "Kry hierdie geargiveerde kompetisie terug",
    "admin.hover.tests.add": "Voeg 'n toets tussen twee spanne by",
    "admin.hover.tests.edit": "Verander die besonderhede van hierdie toets",
    "admin.hover.tests.up": "Skuif hierdie toets op in die lys",
    "admin.hover.tests.down": "Skuif hierdie toets af in die lys",
    "admin.hover.tests.archive": "Argiveer hierdie toets; dit kan herstel word",
    "admin.hover.tests.restore": "Kry hierdie geargiveerde toets terug",
    "admin.hover.tests.toTeams":
      "Gaan na die Spanne-oortjie om die spanne by te voeg wat 'n toets nodig het",
    "admin.hover.scores.add":
      "Voeg die uitslag van 'n wedstryd by hierdie kompetisie",
    "admin.hover.scores.edit": "Korrigeer hierdie uitslag",
    "admin.hover.scores.archive":
      "Argiveer hierdie uitslag sodat dit nie meer tel nie; dit kan herstel word",
    "admin.hover.scores.restore":
      "Kry hierdie geargiveerde uitslag terug, sodat dit weer tel",
    "admin.hover.scores.withdraw":
      "Laat hierdie uitslag in die lys, maar moenie dit laat tel nie",
    "admin.hover.scores.unwithdraw": "Laat hierdie onttrekte uitslag weer tel",
    "admin.hover.scores.up": "Skuif hierdie uitslag vroeër in die lys",
    "admin.hover.scores.down": "Skuif hierdie uitslag later in die lys",
    "admin.hover.competitionPlayers.add":
      "Plaas die gekose speler in hierdie kompetisie",
    "admin.hover.competitionPlayers.up": "Skuif hierdie speler op in die lys",
    "admin.hover.competitionPlayers.down": "Skuif hierdie speler af in die lys",
    "admin.hover.competitionPlayers.remove":
      "Haal hierdie speler uit die kompetisie",
    "admin.hover.competitionPlayers.withdraw":
      "Trek hierdie speler uit die kompetisie terug",
    "admin.hover.competitionPlayers.unwithdraw":
      "Sit hierdie onttrekte speler terug in die kompetisie",
    "admin.hover.competitionPlayers.carryForward":
      "Dra hierdie speler se uitslae oor vanaf 'n ander kompetisie",
    "admin.hover.notes.add": "Skryf 'n nuwe nota vir hierdie toernooi",
    "admin.hover.notes.edit": "Verander hierdie nota",
    "admin.hover.notes.delete": "Skrap hierdie nota",
    "admin.hover.note.add": "Stoor hierdie nota en voeg dit by die toernooi",
    "admin.hover.note.save": "Stoor die veranderinge aan hierdie nota",
    "admin.hover.people.add": "Gee die rol aan hierdie persoon",
    "admin.hover.people.remove": "Neem die rol van hierdie persoon af",
    "admin.hover.worldRankings.import":
      "Haal die wêreldranglyste en voeg hul spelers by",
    "admin.modal.cancel": "Kanselleer",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "E-posadres",
    "admin.people.remove": "Verwyder",
    "admin.people.otherwise": "Dit kon nie gedoen word nie.",
    "admin.managers.you": "Jy",
    "admin.managers.add": "Voeg bestuurder by",
    "admin.managers.none": "Geen bestuurders nie",
    "admin.managers.removeTitle": "Verwyder bestuurder",
    "admin.managers.removeExplanation":
      "{name} sal nie meer hierdie toernooi kan bestuur nie.",
    "admin.managers.removeYourself.explanation":
      "Jy sal nie meer hierdie toernooi kan bestuur nie, en niemand hier kan dit vir jou ongedaan maak nie. 'n Ander bestuurder kan jou weer 'n bestuurder maak.",
    "admin.managers.otherwise":
      "Daardie e-posadres kan nie 'n bestuurder gemaak word nie.",
    "admin.competitionPlayers.add": "Voeg speler by",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise":
      "Hierdie speler kan nie bygevoeg word nie.",
    "admin.competitionPlayers.choose": "Speler om by te voeg",
    "admin.competitionPlayers.nobody": "Kies 'n speler",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Al die spelers is in die kompetisie",
    "admin.competitionPlayers.none": "Geen spelers nie",
    "admin.competitionPlayers.up": "Op",
    "admin.competitionPlayers.down": "Af",
    "admin.competitionPlayers.remove": "Verwyder",
    "admin.competitionPlayers.withdraw": "Trek terug",
    "admin.competitionPlayers.unwithdraw": "Maak die onttrekking ongedaan",
    "admin.competitionPlayers.withdrawn": "Onttrekte spelers",
    "admin.competitionPlayers.removeTitle": "Verwyder speler",
    "admin.competitionPlayers.removeQuestion":
      "{name} sal uit die kompetisie gaan. Dit kan nie ongedaan gemaak word nie.",
    "admin.competitionPlayers.withdrawTitle": "Trek speler terug",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} sal nie meer in die kompetisie speel nie, en die spelle wat nog nie gespeel is nie, word sonder hul deelname beslis.",
    "admin.competitionPlayers.carryForward": "Oordrag",
    "admin.carryForward.title": "Oordrag - {name}",
    "admin.carryForward.save": "Stoor",
    "admin.carryForward.otherwise": "Hierdie oordrag kan nie gestoor word nie.",
    "admin.carryForward.matchWins": "Wedstryde gewen",
    "admin.carryForward.matchLosses": "Wedstryde verloor",
    "admin.carryForward.gameWins": "Spelle gewen",
    "admin.carryForward.gameLosses": "Spelle verloor",
    "admin.carryForward.hoopsFor": "Hoepels vir",
    "admin.carryForward.hoopsAgainst": "Hoepels teen",
    "CarryForward.MatchWinsNotWhole": "Tik 'n heelgetal wedstryde gewen.",
    "CarryForward.MatchWinsBelowZero": "Tik 0 of meer wedstryde gewen.",
    "CarryForward.MatchLossesNotWhole": "Tik 'n heelgetal wedstryde verloor.",
    "CarryForward.MatchLossesBelowZero": "Tik 0 of meer wedstryde verloor.",
    "CarryForward.GameWinsNotWhole": "Tik 'n heelgetal spelle gewen.",
    "CarryForward.GameWinsBelowZero": "Tik 0 of meer spelle gewen.",
    "CarryForward.GameLossesNotWhole": "Tik 'n heelgetal spelle verloor.",
    "CarryForward.GameLossesBelowZero": "Tik 0 of meer spelle verloor.",
    "CarryForward.HoopsForNotWhole": "Tik 'n heelgetal hoepels vir.",
    "CarryForward.HoopsForBelowZero": "Tik 0 of meer hoepels vir.",
    "CarryForward.HoopsAgainstNotWhole": "Tik 'n heelgetal hoepels teen.",
    "CarryForward.HoopsAgainstBelowZero": "Tik 0 of meer hoepels teen.",
    "admin.scores.add": "Voeg uitslag by",
    "admin.scores.none": "Geen uitslae nie",
    "admin.scores.edit": "Wysig",
    "admin.scores.drawNotFilledTitle": "Rooster onvolledig",
    "admin.scores.archive": "Argiveer",
    "admin.scores.up": "Op",
    "admin.scores.down": "Af",
    "admin.scores.restore": "Herstel",
    "admin.scores.archived": "Geargiveerde uitslae",
    "admin.scores.archivedSaid": "Geargiveer",
    "admin.scores.withdraw": "Trek terug",
    "admin.scores.unwithdraw": "Maak die onttrekking ongedaan",
    "admin.scores.withdrawnSaid": "Onttrek",
    "admin.scores.otherwise": "Dit kon nie gedoen word nie.",
    "admin.score.title": "Voeg uitslag by",
    "admin.score.add": "Voeg spel by",
    "admin.score.winner": "Wenner",
    "admin.score.winnerScore": "Wenner se punte",
    "admin.score.loser": "Verloorder",
    "admin.score.loserScore": "Verloorder se punte",
    "admin.score.beat": "het gewen teen",
    "admin.score.added":
      "Die spel wat {winner} teen {loser} gewen het, is bygevoeg.",
    "admin.score.otherwise": "Die spel kon nie bygevoeg word nie.",
    "admin.score.correctTitle": "Wysig uitslag",
    "admin.score.save": "Stoor",
    "admin.score.notCorrected": "Die uitslag kon nie reggestel word nie.",
    "Game.WinnerMissing": "Kies die wenner.",
    "Game.WinnerScoreMissing": "Tik die wenner se punte.",
    "Game.LoserMissing": "Kies die verloorder.",
    "Game.LoserScoreMissing": "Tik die verloorder se punte.",
    "Score.NoPoints": "Punte begin met 'n getal.",
    "Game.SamePlayer": "Niemand speel teen homself nie.",
    "Game.WinnerNotAhead":
      "Die wenner moet meer punte as die verloorder hê, of as wenner gemerk wees.",
    "Game.LoserMarked":
      "Die verloorder se punte kan nie as gewen gemerk word nie.",
    "Game.ResultChanged":
      "'n Regstelling behou die uitslag: 'n gewonne spel bly gewonne, en 'n gelykopspel bly gelykop.",
    "Competition.MatchDecided": "Hul wedstryd is reeds beslis.",
    "Competition.DrawFull":
      "Die speler kan nie bygevoeg word nie omdat die rooster vol is.",
    "Competition.DrawNotFilled":
      "Uitslae kan nie bygevoeg word voordat elke plek in die rooster 'n speler of 'n bye het nie.",
    "Competition.ByeOutsideKnockout":
      "Net 'n uitskakelingskompetisie kan byes hê.",
    "Competition.NotDrawnToMeet":
      "Hulle is nie getrek om teen mekaar te speel nie.",
    "Competition.WinnerHasPlayedOn":
      "Die wenner van hierdie wedstryd het reeds sy volgende wedstryd gespeel, so wie dit gewen het, kan nie verander nie.",
    "CompetitionPlayer.Withdrawn": "'n Onttrekte speler speel nie meer nie.",
    "admin.players.add": "Voeg speler by",
    "admin.players.none": "Geen spelers nie",
    "admin.players.edit": "Wysig",
    "admin.players.archive": "Argiveer",
    "admin.players.restore": "Herstel",
    "admin.players.up": "Op",
    "admin.players.down": "Af",
    "admin.players.archiveTitle": "Argiveer speler",
    "admin.players.archiveQuestion":
      "{name} sal uit hierdie kompetisies verwyder word:",
    "admin.players.archive.explanation":
      "As die speler herstel word, kom die speler nie weer in hierdie kompetisies nie.",
    "admin.players.archived": "Geargiveerde spelers",
    "admin.players.archivedSaid": "Geargiveer",
    "admin.player.addTitle": "Voeg speler by",
    "admin.player.editTitle": "Wysig speler",
    "admin.player.name": "Naam",
    "admin.player.representing": "Verteenwoordig",
    "admin.player.worldRankingName": "Naam op die wêreldranglys",
    "admin.player.worldRankingKnown": "Die wêreldranglys ken hierdie naam.",
    "admin.player.worldRankingQuestioned":
      "Die wêreldranglys het geen speler met hierdie naam nie. Dit is dalk verkeerd gespel, of die speler is nuut op die ranglys.",
    "admin.player.flag": "Vlag",
    "admin.player.add": "Voeg by",
    "admin.player.save": "Stoor",
    "admin.player.added": "{name} is bygevoeg.",
    "admin.player.otherwise":
      "Hierdie speler kan nie gestoor word soos dit is nie.",
    "Tournament.PlayerNameTaken":
      "Nog 'n speler in hierdie toernooi het reeds daardie naam.",
    "TournamentPlayer.NoSuchFlag": "Kies een van die vlae wat daar is.",
    "TournamentPlayer.NamedBye": "'n Speler kan nie Bye genoem word nie.",
    "TournamentPlayer.NoLetterOrDigit": "'n Naam het 'n letter of syfer nodig.",
    "admin.player.byesTitle": "Byes word nie bygevoeg nie",
    "admin.player.byes":
      "'n Bye is nie 'n speler in die toernooi nie. 'n Uitskakelingskompetisie bied Bye aan wanneer sy spelers bygevoeg word, so dikwels as wat sy rooster dit nodig het.",
    "admin.view.teams": "Spanne",
    "admin.view.tests": "Toetse",
    "admin.teams.add": "Voeg span by",
    "admin.teams.none": "Geen spanne nie",
    "admin.teams.edit": "Wysig",
    "admin.teams.view": "Bekyk",
    "admin.teams.archive": "Argiveer",
    "admin.teams.restore": "Herstel",
    "admin.teams.up": "Op",
    "admin.teams.down": "Af",
    "admin.teams.archived": "Geargiveerde spanne",
    "admin.teams.archivedSaid": "Geargiveer",
    "admin.team.addTitle": "Voeg span by",
    "admin.team.editTitle": "Wysig span",
    "admin.team.name": "Naam",
    "admin.team.shortName": "Kortnaam",
    "admin.team.shortName.explanation":
      "Hoe die span se toetse genoem word, soos AUS v ENG.",
    "admin.team.flag": "Vlag",
    "admin.team.add": "Voeg by",
    "admin.team.save": "Stoor",
    "admin.team.added": "{name} is bygevoeg.",
    "admin.team.otherwise":
      "Hierdie span kan nie gestoor word soos dit is nie.",
    "admin.teamView.otherwise":
      "Hierdie span kan nie van hier af bekyk word nie.",
    "admin.teamView.players": "Spelers",
    "TeamName.Missing": "Sê wat die span se naam is.",
    "TeamName.TooLong": "Daardie naam is te lank.",
    "admin.notes.add": "Voeg nota by",
    "admin.notes.none": "Geen notas nie",
    "admin.notes.edit": "Wysig",
    "admin.notes.delete": "Skrap",
    "admin.notes.deleteTitle": "Skrap nota",
    "admin.notes.deleteQuestion": "Die nota «{title}» skrap?",
    "admin.notes.delete.explanation":
      "'n Geskrapte nota is vir altyd weg en kan nie teruggekry word nie.",
    "admin.notes.otherwise": "Dit kon nie gedoen word nie.",
    "admin.note.addTitle": "Voeg nota by",
    "admin.note.editTitle": "Wysig nota",
    "admin.note.title": "Titel",
    "admin.note.description": "Beskrywing",
    "admin.note.write": "Skryf",
    "admin.note.preview": "Voorskou",
    "admin.note.toolbar": "Formatering",
    "admin.note.tool.heading": "Opskrif",
    "admin.note.tool.bold": "Vetgedruk",
    "admin.note.tool.italic": "Skuinsgedruk",
    "admin.note.tool.quote": "Aanhaling",
    "admin.note.tool.code": "Kode",
    "admin.note.tool.link": "Skakel",
    "admin.note.tool.numberedList": "Genommerde lys",
    "admin.note.tool.bulletedList": "Lys met kolpunte",
    "admin.note.tool.taskList": "Taaklys",
    "admin.note.add": "Voeg by",
    "admin.note.save": "Stoor",
    "admin.note.otherwise": "Hierdie nota kan nie so gestoor word nie.",
    "ManagerNoteTitle.Missing": "Gee die nota 'n titel.",
    "ManagerNoteTitle.TooLong": "Daardie titel is te lank.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "'n Titel het 'n letter of syfer nodig.",
    "ManagerNoteDescription.TooLong": "Daardie beskrywing is te lank.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Daardie nota is nie meer daar nie. 'n Ander organiseerder het dit dalk geskrap.",
    "EditManagerNote.NoSuchManagerNote":
      "Daardie nota is nie meer daar nie. 'n Ander organiseerder het dit dalk geskrap.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Daardie nota is nie meer daar nie. 'n Ander organiseerder het dit dalk geskrap.",
    "ManagerNote.Deleted":
      "Daardie nota is geskrap. 'n Ander organiseerder het dit dalk geskrap.",
    "CommentaryTitle.Missing": "Gee die kommentaar 'n titel.",
    "CommentaryTitle.TooLong": "Daardie titel is te lank.",
    "CommentaryTitle.NoLetterOrDigit": "'n Titel het 'n letter of syfer nodig.",
    "Commentary.TitleTaken": "Nog 'n kommentaar het reeds daardie titel.",
    "CommentText.Missing": "Skryf iets in die kommentaar.",
    "CommentText.TooLong": "Daardie kommentaar is te lank.",
    "TeamShortName.Missing": "Gee die span 'n kortnaam.",
    "TeamShortName.TooLong": "'n Kortnaam is hoogstens 10 karakters lank.",
    "TeamShortName.NoLetterOrDigit":
      "'n Kortnaam het 'n letter of syfer nodig.",
    "Team.ShortNameLongerThanName":
      "'n Kortnaam kan nie langer as die span se naam wees nie.",
    "Team.NoSuchFlag": "Kies een van die vlae wat daar is.",
    "Team.Archived": "Daardie span is geargiveer, en moet eers herstel word.",
    "Team.InATest":
      "Daardie span speel in 'n toets, en kan nie geargiveer word nie.",
    "Team.PlayerNameTaken":
      "Nog 'n speler in hierdie span het reeds daardie naam.",
    "TeamPlayer.NamedBye": "'n Speler kan nie Bye genoem word nie.",
    "TeamPlayer.Archived":
      "Daardie speler is geargiveer, en moet eers herstel word.",
    "TeamPlayer.HasGames":
      "Daardie speler het gespeel, en kan nie geargiveer word nie.",
    "Tournament.TeamNameTaken":
      "Nog 'n span in hierdie toernooi het reeds daardie naam.",
    "Tournament.TeamShortNameTaken":
      "Nog 'n span in hierdie toernooi het reeds daardie kortnaam.",
    "Tournament.NoSuchTeam":
      "Hierdie toernooi het geen span by hierdie adres nie.",
    "Tournament.TeamArchived":
      "Hierdie span is geargiveer, en kan net vanaf die Spanne-oortjie herstel word.",
    "admin.tests.add": "Voeg toets by",
    "admin.tests.none": "Geen toetse nie",
    "admin.tests.edit": "Wysig",
    "admin.tests.view": "Bekyk",
    "admin.tests.archive": "Argiveer",
    "admin.tests.restore": "Herstel",
    "admin.tests.up": "Op",
    "admin.tests.down": "Af",
    "admin.tests.archived": "Geargiveerde toetse",
    "admin.tests.twoTeamsNeeded":
      "'n Toets is tussen twee spanne, so jy het eers twee spanne nodig.",
    "admin.tests.toTeams": "Gaan na Spanne",
    "admin.tests.matches.one": "{count} wedstryd",
    "admin.tests.matches.other": "{count} wedstryde",
    "admin.tests.bestOf": "beste van {games}",
    "admin.tests.otherwise": "Dit kon nie gedoen word nie.",
    "admin.test.addTitle": "Voeg toets by",
    "admin.test.editTitle": "Wysig toets",
    "admin.test.firstTeam": "Span A",
    "admin.test.secondTeam": "Span B",
    "admin.test.versus": "v",
    "admin.test.starts": "Begin",
    "admin.test.finishes": "Eindig",
    "admin.test.expectedMatches": "Verwagte wedstryde",
    "admin.test.bestOf": "Beste van",
    "admin.test.group": "Groep",
    "admin.test.add": "Voeg by",
    "admin.test.save": "Stoor",
    "admin.test.added": "{name} is bygevoeg.",
    "admin.test.otherwise":
      "Hierdie toets kan nie gestoor word soos dit is nie.",
    "admin.testView.otherwise":
      "Hierdie toets kan nie van hier af bekyk word nie.",
    "AddTest.FirstTeamMissing": "Kies die eerste span.",
    "AddTest.SecondTeamMissing": "Kies die tweede span.",
    "UpdateTest.FirstTeamMissing": "Kies die eerste span.",
    "UpdateTest.SecondTeamMissing": "Kies die tweede span.",
    "ExpectedMatches.NotWhole": "Tik 'n heelgetal wedstryde.",
    "ExpectedMatches.TooSmall": "'n Toets moet minstens 1 wedstryd verwag.",
    "TestGroup.TooLong": "Daardie groep is te lank.",
    "Tournament.TestAgainstItself":
      "'n Span speel nie 'n toets teen homself nie.",
    "Tournament.TestFinishesBeforeStarts":
      "'n Toets kan nie eindig voordat dit begin nie.",
    "Tournament.TestStartsBeforeTournament":
      "'n Toets kan nie voor sy toernooi begin nie.",
    "Tournament.TestFinishesAfterTournament":
      "'n Toets kan nie na sy toernooi eindig nie.",
    "Tournament.TestHasGamesInUse":
      "Hierdie toets het spelle, so dit kan nie geargiveer word totdat hulle geargiveer is nie.",
    "Tournament.TestHasGames":
      "Hierdie toets het reeds spelle, so sy spanne kan nie meer verander word nie.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Meer wedstryde as dit het reeds begin.",
    "Tournament.BestOfBelowGamesPlayed":
      "Twee spelers het reeds meer spelle as dit gespeel.",
    "Competition.ExpectedMatchesReached":
      "Hierdie toets het reeds al die wedstryde begin wat dit verwag.",
    "Competition.SameTeam":
      "Twee spelers van dieselfde span speel nie teen mekaar nie.",
    "AddManager.NoSuchAccount":
      "Daardie e-posadres het geen rekening wat 'n bestuurder gemaak kan word nie.",
    "Account.NotAnAdministrator": "Net 'n administrateur kan dit doen.",
    "AddRole.NoSuchAccount":
      "Daardie e-posadres het geen rekening aan wie die rol gegee kan word nie.",
    "AddRole.NoSuchRole": "Daardie rol bestaan nie.",
    "RemoveRole.NoSuchAccount": "Daardie rekening bestaan nie.",
    "RemoveRole.NoSuchRole": "Daardie rol bestaan nie.",
    "RemoveRole.Yourself": "Jy kan nie jou eie administrateurrol afneem nie.",
    "AccountsWithRole.NoSuchRole": "Daardie rol bestaan nie.",
    "admin.scorers.add": "Voeg teller by",
    "admin.scorers.none": "Geen telers nie",
    "admin.scorers.removeTitle": "Verwyder teller",
    "admin.scorers.removeExplanation":
      "{name} sal nie meer die uitslae van hierdie toernooi kan aanteken nie.",
    "admin.scorers.otherwise":
      "Daardie e-posadres kan nie 'n teller gemaak word nie.",
    "AddScorer.NoSuchAccount":
      "Daardie e-posadres het geen rekening wat 'n teller gemaak kan word nie.",
    "Tournament.AlreadyAManager":
      "Daardie rekening bestuur reeds die toernooi, en kan alles doen wat 'n teller doen.",

    "TournamentName.Missing": "Sê wat die toernooi se naam is.",
    "TournamentName.TooShort": "Daardie naam is te kort.",
    "TournamentName.TooLong": "Daardie naam is te lank.",
    "TournamentName.AllLowerCase":
      "'n Naam word nie heeltemal in kleinletters geskryf nie.",
    "TournamentName.AllCapitals":
      "'n Naam word nie heeltemal in hoofletters geskryf nie.",
    "TournamentName.NoLetterOrDigit": "'n Naam het 'n letter of syfer nodig.",
    "ReadOnlyDate.Unreadable": "Gee die dag.",
    "Tournament.FinishesBeforeStarts":
      "'n Toernooi kan nie eindig voordat dit begin nie.",
    "Tournament.StartsAfterNextYear":
      "'n Toernooi kan nie na volgende jaar begin nie.",
    "Tournament.FinishesAfterNextYear":
      "'n Toernooi kan nie na volgende jaar eindig nie.",
    "CreateTournament.NoSuchCountry": "Kies die land.",
    "TournamentSubtitle.TooLong":
      "Die onderskrif mag hoogstens 2000 karakters lank wees.",
    "Tournament.NotAManager":
      "Net iemand wat hierdie toernooi bestuur, kan dit verander.",
    "Tournament.NotAManagerOrScorer":
      "Net iemand wat hierdie toernooi bestuur of die uitslae daarvan aanteken, kan dit sien.",
    "Tournament.Archived":
      "Hierdie toernooi is geargiveer, en moet herstel word voordat dit verander kan word.",
    "UpdateTournament.NoSuchTournament":
      "Daar is geen toernooi by hierdie adres nie.",

    // The sports keep the names their players use in Afrikaans, and the formats
    // named for a competition keep its name, as a name is not translated.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "Amerikaanse 6-hoepel-croquet",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standaard",
    "format.teams": "Spanne",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Verenigde Arabiese Emirate",
    "country.af": "Afghanistan",
    "country.ag": "Antigua en Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanië",
    "country.am": "Armenië",
    "country.ao": "Angola",
    "country.ar": "Argentinië",
    "country.as": "Amerikaanse Samoa",
    "country.at": "Oostenryk",
    "country.au": "Australië",
    "country.aw": "Aruba",
    "country.ax": "Ålandeilande",
    "country.az": "Azerbeidjan",
    "country.ba": "Bosnië en Herzegowina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesj",
    "country.be": "België",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarye",
    "country.bh": "Bahrein",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermuda",
    "country.bn": "Broenei",
    "country.bo": "Bolivië",
    "country.br": "Brasilië",
    "country.bs": "Bahamas",
    "country.bt": "Bhoetan",
    "country.bv": "Bouvet-eiland",
    "country.bw": "Botswana",
    "country.by": "Wit-Rusland",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalonië",
    "country.cc": "Cocoseilande",
    "country.cd": "Demokratiese Republiek van die Kongo",
    "country.cf": "Sentraal-Afrikaanse Republiek",
    "country.cg": "Republiek van die Kongo",
    "country.ch": "Switserland",
    "country.ci": "Ivoorkus",
    "country.ck": "Cookeilande",
    "country.cl": "Chili",
    "country.cm": "Kameroen",
    "country.cn": "China",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Kuba",
    "country.cv": "Kaap Verde",
    "country.cx": "Kerseiland",
    "country.cy": "Ciprus",
    "country.cz": "Tsjeggië",
    "country.de": "Duitsland",
    "country.dj": "Djiboeti",
    "country.dk": "Denemarke",
    "country.dm": "Dominica",
    "country.do": "Dominikaanse Republiek",
    "country.dz": "Algerië",
    "country.ec": "Ecuador",
    "country.ee": "Estland",
    "country.eg": "Egipte",
    "country.eh": "Wes-Sahara",
    "country.england": "Engeland",
    "country.er": "Eritrea",
    "country.es": "Spanje",
    "country.et": "Ethiopië",
    "country.fi": "Finland",
    "country.fj": "Fidji",
    "country.fk": "Falklandeilande",
    "country.fm": "Mikronesië",
    "country.fo": "Faroëreilande",
    "country.fr": "Frankryk",
    "country.ga": "Gaboen",
    "country.gb": "Verenigde Koninkryk",
    "country.gd": "Grenada",
    "country.ge": "Georgië",
    "country.gf": "Frans-Guyana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenland",
    "country.gm": "Gambië",
    "country.gn": "Guinee",
    "country.gp": "Guadeloupe",
    "country.gq": "Ekwatoriaal-Guinee",
    "country.gr": "Griekeland",
    "country.gs": "Suid-Georgië en die Suidelike Sandwicheilande",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinee-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heard- en McDonaldeilande",
    "country.hn": "Honduras",
    "country.hr": "Kroasië",
    "country.ht": "Haïti",
    "country.hu": "Hongarye",
    "country.id": "Indonesië",
    "country.ie": "Ierland",
    "country.il": "Israel",
    "country.im": "Eiland Man",
    "country.in": "Indië",
    "country.io": "Brits-Indiese Oseaangebied",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Ysland",
    "country.it": "Italië",
    "country.je": "Jersey",
    "country.jm": "Jamaika",
    "country.jo": "Jordanië",
    "country.jp": "Japan",
    "country.ke": "Kenia",
    "country.kg": "Kirgisië",
    "country.kh": "Kambodja",
    "country.ki": "Kiribati",
    "country.km": "Comore",
    "country.kn": "Saint Kitts en Nevis",
    "country.kp": "Noord-Korea",
    "country.kr": "Suid-Korea",
    "country.kw": "Koeweit",
    "country.ky": "Kaaimanseilande",
    "country.kz": "Kazakstan",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberië",
    "country.ls": "Lesotho",
    "country.lt": "Litaue",
    "country.lu": "Luxemburg",
    "country.lv": "Letland",
    "country.ly": "Libië",
    "country.ma": "Marokko",
    "country.mc": "Monaco",
    "country.md": "Moldowa",
    "country.me": "Montenegro",
    "country.mg": "Madagaskar",
    "country.mh": "Marshalleilande",
    "country.mk": "Noord-Macedonië",
    "country.ml": "Mali",
    "country.mm": "Mianmar",
    "country.mn": "Mongolië",
    "country.mo": "Macau",
    "country.mp": "Noord-Mariane-eilande",
    "country.mq": "Martinique",
    "country.mr": "Mauritanië",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Maledive",
    "country.mw": "Malawi",
    "country.mx": "Meksiko",
    "country.my": "Maleisië",
    "country.mz": "Mosambiek",
    "country.na": "Namibië",
    "country.nc": "Nieu-Kaledonië",
    "country.ne": "Niger",
    "country.nf": "Norfolkeiland",
    "country.ng": "Nigerië",
    "country.ni": "Nicaragua",
    "country.nl": "Nederland",
    "country.no": "Noorweë",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nieu-Seeland",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Frans-Polinesië",
    "country.pg": "Papoea-Nieu-Guinee",
    "country.ph": "Filippyne",
    "country.pk": "Pakistan",
    "country.pl": "Pole",
    "country.pm": "Saint-Pierre en Miquelon",
    "country.pn": "Pitcairneilande",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Katar",
    "country.re": "Réunion",
    "country.ro": "Roemenië",
    "country.rs": "Serwië",
    "country.ru": "Rusland",
    "country.rw": "Rwanda",
    "country.sa": "Saoedi-Arabië",
    "country.sb": "Salomonseilande",
    "country.sc": "Seychelle",
    "country.scotland": "Skotland",
    "country.sd": "Soedan",
    "country.se": "Swede",
    "country.sg": "Singapoer",
    "country.sh": "Sint Helena",
    "country.si": "Slowenië",
    "country.sj": "Svalbard en Jan Mayen",
    "country.sk": "Slowakye",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalië",
    "country.sr": "Suriname",
    "country.st": "São Tomé en Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Sirië",
    "country.sz": "Eswatini",
    "country.tc": "Turks- en Caicoseilande",
    "country.td": "Tsjad",
    "country.tf": "Franse Suidelike Gebiede",
    "country.tg": "Togo",
    "country.th": "Thailand",
    "country.tj": "Tadjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Oos-Timor",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunisië",
    "country.to": "Tonga",
    "country.tr": "Turkye",
    "country.tt": "Trinidad en Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwan",
    "country.tz": "Tanzanië",
    "country.ua": "Oekraïne",
    "country.ug": "Uganda",
    "country.um": "Klein Afgeleë Eilande van die Verenigde State",
    "country.us": "Verenigde State van Amerika",
    "country.uy": "Uruguay",
    "country.uz": "Oesbekistan",
    "country.va": "Vatikaanstad",
    "country.vc": "Saint Vincent en die Grenadine",
    "country.ve": "Venezuela",
    "country.vg": "Britse Maagde-eilande",
    "country.vi": "Maagde-eilande van die Verenigde State",
    "country.vn": "Viëtnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wallis",
    "country.wf": "Wallis en Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Suid-Afrika",
    "country.zm": "Zambië",
    "country.zw": "Zimbabwe",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject": "Bevestig jou e-posadres vir {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hallo,</p>

<p>
    Dankie dat jy 'n rekening by <strong>{siteName}</strong> geskep het.<br />
    Voordat jy jou rekening begin gebruik, bevestig asseblief jou e-posadres
    deur op die knoppie hieronder te klik:
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
        Bevestig my e-posadres
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou e-posadres ook bevestig deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    As jy nie hierdie rekening geskep het nie, kan jy hierdie e-pos gerus ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "'n Nuwe skakel om jou e-posadres vir {siteName} te bevestig",
    "Email.ConfirmAddressAgain.body": `
<p>Hallo,</p>

<p>
    Jy het onlangs vir 'n nuwe e-pos gevra om jou e-posadres vir <strong>{siteName}</strong> te bevestig.<br />
    Bevestig jou e-posadres deur op die knoppie hieronder te klik:
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
        Bevestig my e-posadres
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou e-posadres ook bevestig deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sodra dit bevestig is, kan jy jou rekening sonder onderbreking bly gebruik.
</p>

<p>
    As jy nie vir hierdie e-pos gevra het nie, kan jy dit gerus ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Iemand het probeer registreer met jou e-posadres",
    "Email.AlreadyRegistered.body": `
<p>Hallo,</p>

<p>
    Iemand het probeer om by <strong>{siteName}</strong> te registreer met
    hierdie e-posadres, wat reeds 'n rekening het. Niks aan jou rekening het
    verander nie.<br />
    As dit jy was, het jy reeds 'n rekening en kan jy daarby aanmeld:
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
        Meld aan
    </a>
</p>

<p>
    As jy jou wagwoord vergeet het, kan jy dit hier terugstel:
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
        Ek het my wagwoord vergeet
    </a>
</p>

<p>
    As dit nie jy was nie, hoef jy niks te doen nie. Niemand het 'n manier
    gekry om by jou rekening in te kom nie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Bevestig dat jou {siteName}-rekening na hierdie e-posadres skuif",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hallo,</p>

<p>
    Iemand wat by 'n <strong>{siteName}</strong>-rekening aangemeld is, het
    gevra dat dit na hierdie e-posadres skuif. As dit jy was, bevestig dit hier,
    terwyl jy by daardie rekening aangemeld is. Die skakel werk vir 24 uur.
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
        Skuif my rekening
    </a>
</p>

<p>
    Of kopieer hierdie adres na jou blaaier:<br />
    {link}
</p>

<p>
    As dit nie jy was nie, hoef jy niks te doen nie. Geen rekening sal hierheen skuif nie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Iemand het gevra dat 'n rekening na jou e-posadres skuif",
    "Email.AlreadyHasAnAccount.body": `
<p>Hallo,</p>

<p>
    Iemand wat by 'n <strong>{siteName}</strong>-rekening aangemeld is, het
    gevra dat dit na hierdie e-posadres skuif, wat reeds 'n rekening van sy eie
    het. Niks is geskuif nie, en niks aan jou rekening het verander nie.
</p>

<p>
    As dit jy was, het jy reeds 'n rekening by hierdie e-posadres en kan jy
    daarby aanmeld.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Jou {siteName}-rekening het geskuif",
    "Email.EmailAddressChanged.body": `
<p>Hallo,</p>

<p>
    Jou <strong>{siteName}</strong>-rekening het pas na 'n ander e-posadres,
    {emailAddress}, geskuif, en van nou af meld jy met daardie e-posadres aan.
</p>

<p>
    As dit nie jy was nie, het iemand anders toegang tot jou rekening. Antwoord
    op hierdie e-pos en vertel ons.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Jou {siteName}-wagwoord is verander",
    "Email.PasswordChanged.body": `
<p>Hallo,</p>

<p>
    Die wagwoord van jou <strong>{siteName}</strong>-rekening is pas verander,
    en jy is afgemeld in al die ander blaaiers waar jy aangemeld was.<br />
    As dit jy was, hoef jy niks te doen nie.
</p>

<p>
    As dit nie jy was nie, het iemand anders jou wagwoord. Stel hier 'n nuwe een
    en hulle sal afgemeld word:
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
        Ek het my wagwoord vergeet
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Stel 'n nuwe wagwoord vir {siteName}",
    "Email.SetNewPassword.body": `
<p>Hallo,</p>

<p>
    Jy het onlangs gevra om jou <strong>{siteName}</strong>-wagwoord terug te stel.<br />
    Jy kan dit terugstel deur op die knoppie hieronder te klik:
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
        Stel wagwoord terug
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou wagwoord ook terugstel deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    As jy nie gevra het om jou wagwoord terug te stel nie, kan jy hierdie e-pos gerus ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Stel 'n wagwoord vir {siteName}",
    "Email.SetPassword.body": `
<p>Hallo,</p>

<p>
    Jou <strong>{siteName}</strong>-rekening het nie 'n wagwoord nie: jy meld met Google aan.<br />
    Jy het gevra om een te stel, sodat jy ook met jou e-posadres en 'n wagwoord kan aanmeld.
    Jy kan dit stel deur op die knoppie hieronder te klik:
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
        Stel wagwoord
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy jou wagwoord ook stel deur hierdie skakel in jou blaaier oop te maak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Die skakel werk vir 'n uur. As jy nie gevra het om 'n wagwoord te stel nie, kan jy hierdie e-pos gerus ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Daar is geen {siteName}-rekening vir hierdie e-posadres nie",
    "Email.RegisterInstead.body": `
<p>Hallo,</p>

<p>
    Daar is gevra om die wagwoord terug te stel van 'n e-posadres wat nie aan
    enige <strong>{siteName}</strong>-rekening gekoppel is nie.
</p>

<p>
    As jy ons diens wil gebruik, kan jy hier 'n nuwe rekening skep:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    As jy nie hierdie versoek gedoen het nie, kan jy hierdie e-pos gerus ignoreer.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Bevestig dat jy wil hê jou {siteName}-rekening moet vergeet word",
    "Email.ConfirmForgetting.body": `
<p>Hallo,</p>

<p>
    Jy het gevra dat jou <strong>{siteName}</strong>-rekening vergeet word.<br />
    Volg die knoppie hieronder om te sien wat dit beteken, en om veilig te
    bevestig dat dit is wat jy wil hê:
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
        Vergeet my rekening
    </a>
</p>

<p>
    As die knoppie nie werk nie, kan jy ook hierdie skakel in jou blaaier oopmaak:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Sodra dit vergeet is, sal niemand weer jou naam of jou e-posadres kan lees
    nie, en niemand sal by jou rekening kan aanmeld nie. Dit kan nie ongedaan
    gemaak word nie.
</p>

<p>
    Die skakel werk net een keer, tot 15 minute nadat jy dit gevra het, en net
    solank jy by hierdie rekening aangemeld is. Vra daarna weer vanuit jou
    rekening.
</p>

<p>
    As jy nie hiervoor gevra het nie, sal niks gebeur tensy iemand die skakel
    volg nie. Tog het iemand wat by jou rekening aangemeld is dit gevra, so stel
    'n nuwe wagwoord vanaf die bladsy vir vergete wagwoorde om seker te maak
    hulle kan nie weer aanmeld nie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registrasie is opgeskort: {service} kan nie bereik word nie",
    "Email.RegistrationsSuspended.body": `
<p>Hallo,</p>

<p>
    {siteName} kon {service} nie om {when} bereik nie. Totdat dit antwoord,
    word mense wat dit nodig het, om te registreer of om 'n nuwe wagwoord te
    stel, gesê om later weer te probeer.
</p>

<p>
    Daar is niks om op te hef nie. Elke poging vra weer vir {service}, en die
    bladsye werk weer sodra dit antwoord.
</p>

<p>
    Solank {service} nie antwoord nie, sal jy hoogstens een e-pos per uur
    daaroor kry.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} kan nie sy databasis bereik nie",
    "Email.DatabaseUnreachable.body": `
<p>Hallo,</p>

<p>
    {siteName} kon om {when} nie sy databasis bereik nie. Totdat dit antwoord, sê elke bladsy wat dit nodig het vir lesers dat die webwerf nie beskikbaar is nie en dat hulle later weer moet probeer.
</p>

<p>
    Niks hoef opgehef te word nie. Elke versoek vra opnuut vir ’n verbinding, en die webwerf werk weer sodra die databasis antwoord.
</p>

<p>
    Solank die databasis af bly, sal jy hoogstens een keer elke {minutes} minute daaroor ’n e-pos kry.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} het op ’n versoek misluk",
    "Email.UnhandledError.body": `
<p>Hallo,</p>

<p>
    {siteName} het om {when} misluk met ’n versoek om {asked}. Die leser is die verwysing {reference} gewys, en die log het die oorsaak daaronder.
</p>

<p>
    ’n Webwerf wat stukkend is, misluk gewoonlik by elke versoek, so jy sal hoogstens 4 keer in ’n uur oor mislukkings ge-e-pos word. Die res staan steeds in die log.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
