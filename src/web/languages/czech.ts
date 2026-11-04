// Čeština. Čtenáře oslovujeme vykáním, v množném čísle zdvořilosti („Zadejte“,
// „Klikněte“), jak je u softwaru zvykem. Nabídky, tlačítka a nadpisy se píšou
// jako obyčejné české věty: velké je jen první písmeno („Změnit heslo“, nikoli
// „Změnit Heslo“). O adrese říkáme „e-mailová adresa“, o samotné zprávě
// „e-mail“. Slova, na kterých jsme se shodli: turnaj, soutěž, blok, pavouk
// (vyřazovací soutěž), švýcarský systém, branky (hoops), zápas (match), hra
// (game), archivovat/obnovit, odebrat (remove) a smazat (delete), odstoupit
// (withdraw hráče) a neuznat (withdraw skóre), organizátor (manager) a
// zapisovatel (scorer). „Bye“ zůstává jako v angličtině, protože toto slovo
// webová stránka sama rozpoznává. Počty píšeme tak, aby se slovo za číslem
// nemuselo skloňovat („Zápasy: {count}“), protože čeština má tři tvary.
import type { Language } from "../common/language.js";

export const czech: Language = {
  tag: "cs",
  name: "Čeština",
  words: {
    // Vlastní lišty webové stránky. Název stránky není slovem žádného jazyka,
    // a proto se doplňuje do výzvy, která ho zmiňuje.
    "site.skipToContent": "Přejít na obsah",
    "navigation.menu": "Menu",
    "navigation.label": "Hlavní nabídka",
    "navigation.home": "Domů",
    "navigation.help": "Nápověda",
    "navigation.admin": "Admin",
    "sections.label": "Oddíly",
    "theme.label": "Motiv",
    "theme.light": "Světlý",
    "theme.dark": "Tmavý",
    "theme.system": "Systémový",
    "footer.donate": "Přispět",
    "footer.plea":
      "Líbí se vám {siteName}? Přispějte prosím a pomozte nám s dalším vývojem.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Soukromí",
    "footer.termsOfUse": "Podmínky použití",
    "footer.reportBug": "Nahlásit chybu",
    "beta.banner":
      "Toto je zkušební (beta) web. Data mohou být kdykoli vynulována.",
    "privacy.contact":
      "Dotazy k této stránce nebo k tomu, co se o vás uchovává: {emailAddress}",
    // Políčko, které čtenář zaškrtne, aby souhlasil s podmínkami použití pro
    // ty, kdo píšou. Slova odkazu se hledají ve slovech políčka a mění se v
    // odkaz, takže musí být napsána přesně jako tam.
    "termsOfUse.agree": "Souhlasím s podmínkami použití",
    "termsOfUse.link": "podmínkami použití",
    // Pod podmínkami pro ty, kdo píšou, tak jako privacy.contact pod
    // prohlášením o soukromí.
    "termsOfUse.report":
      "Nahlaste, co bylo napsáno, nebo se zeptejte na tyto podmínky: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Zaškrtněte políčko a souhlaste s podmínkami použití.",
    // Říká se na každé stránce zkušebního webu, pod lištou webu.
    "tryWebsite.banner":
      "Toto je bezpečné místo, kde se můžete naučit používat {siteName}. Cokoli sem zadáte, může být kdykoli odstraněno.",

    "language.label": "Jazyk",
    "language.choose": "Změnit",

    // Upozornění, které čtenáři říká, že je co číst.
    "whatsNew.public.message": "Je tu něco nového ke čtení.",
    "whatsNew.admin.message": "Je tu něco nového pro ty, kdo vedou turnaje.",
    "whatsNew.view": "Zobrazit novinky",
    "whatsNew.later": "Připomenout příště",
    "whatsNew.never": "Už mi toto upozornění nezobrazovat",

    // The panel at the top of the help that finds a page from a question.
    "helpSearch.title": "Zeptejte se {siteName}",
    "helpSearch.label": "Vaše otázka",
    "helpSearch.submit": "Hledat",
    "helpSearch.none":
      "Žádná stránka nápovědy na to neodpovídá. Zkuste jiná slova.",
    "helpSearch.tooLong": "Otázka může mít nejvýše {most} znaků.",
    "helpSearch.failed": "V nápovědě se nepodařilo hledat. Zkuste to znovu.",

    "form.otherwise":
      "Něco tu není v pořádku. Zkontrolujte, co jste zadali, a zkuste to znovu.",

    // Nabídka účtu v záhlaví: za koho mluví a každá položka, kterou otevírá.
    "account.menu": "Účet",
    "account.register": "Registrovat se",
    "account.signIn": "Přihlásit se",
    "account.forgotPassword": "Zapomenuté heslo",
    "account.signOut": "Odhlásit se",
    "account.profile": "Profil",
    "account.changePassword": "Změnit heslo",
    "account.changeEmailAddress": "Změnit e-mailovou adresu",
    "account.changeName": "Změnit jméno",
    "account.setPassword": "Nastavit heslo",
    "account.forgetAccount": "Zapomenout účet",

    "register.title": "Registrace",
    "register.emailAddress": "E-mailová adresa",
    "register.submit": "Registrovat se",
    "register.withGoogle": "Registrovat se přes Google",
    "register.or": "nebo",
    // Říká se nad formulářem, když Google poslal čtenáře zpět, aniž by byl
    // vpuštěn, vždy podle kódu, který cesta zpět dala. Říkají je stránka
    // registrace i stránka přihlášení, a proto říkají „použijte svou e-mailovou
    // adresu“ a nejmenují, co s ní který formulář dělá.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google nepotvrdil, že tato e-mailová adresa patří vám, a proto ji tady nelze s Googlem použít. Použijte místo toho svou e-mailovou adresu níže.",
    "SignInWithGoogle.LinkedToAnother":
      "Tato e-mailová adresa už má účet propojený s jiným účtem Google. Přihlaste se tímto účtem Google, nebo svou e-mailovou adresou a heslem.",
    "SignInWithGoogle.NameMissing":
      "Google nám nesdělil vaše jméno a účet ho potřebuje. Použijte místo toho svou e-mailovou adresu níže.",
    "Google.Unreachable":
      "Google se teď nepodařilo zastihnout. Zkuste to znovu za několik minut, nebo použijte svou e-mailovou adresu níže.",
    "Registration.NotAPerson":
      "Nevypadalo to, že to odeslal člověk. Zkuste to znovu, a pokud se to bude opakovat, počkejte pár minut a vraťte se.",

    // Pravidlo, které adresa může porušit, řečené pod polem, o které jde.
    "EmailAddress.Missing": "Zadejte e-mailovou adresu.",
    "EmailAddress.NoAt": "E-mailová adresa obsahuje znak @.",
    "EmailAddress.MoreThanOneAt": "E-mailová adresa obsahuje jeden znak @.",
    "EmailAddress.NoDomain":
      "E-mailová adresa má za znakem @ doménu, například example.com.",

    "welcome.title": "Zkontrolujte e-mail",
    "welcome.checkEmail":
      "Na zadanou adresu vám byl odeslán e-mail. Pokračujte odkazem v něm.",
    "welcome.nothingArrived":
      "Pokud nic nedorazí do několika minut, podívejte se do složky s nevyžádanou poštou (spamu).",
    "welcome.home": "Zpět na {siteName}",
    "newConfirmationLink.title": "Získat nový odkaz",
    "newConfirmationLink.explanation":
      "Odkaz pro potvrzení vaší e-mailové adresy vypršel. Požádejte o nový a bude odeslán na adresu, kterou jste se registrovali.",
    "newConfirmationLink.send": "Poslat nový odkaz",
    "newConfirmationLink.home": "Zpět na {siteName}",
    "newConfirmationLink.signIn": "Přihlásit se",
    "newConfirmationLink.sent.title": "Zkontrolujte e-mail",
    "newConfirmationLink.sent.explanation":
      "Nový odkaz je na cestě. Jeho otevřením potvrdíte svou e-mailovou adresu. Pokud nic nedorazí do několika minut, podívejte se do složky s nevyžádanou poštou (spamu).",
    "newConfirmationLink.alreadyConfirmed.title":
      "Tato e-mailová adresa je již potvrzena",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Není co dalšího potvrzovat. Přihlaste se heslem, které jste zadali při potvrzení.",
    "newConfirmationLink.noLongerWorks.title": "Tento odkaz již nefunguje",
    "newConfirmationLink.noLongerWorks.explanation":
      "Zkontrolujte, že jste otevřeli celý odkaz z e-mailu a že na jeho konci nic nechybí. Pokud stále nefunguje, zaregistrujte se znovu a bude vám odeslán nový odkaz.",
    "newConfirmationLink.tooMany.title": "Zkuste to později",
    "newConfirmationLink.tooMany.explanation":
      "Na tuto adresu bylo v poslední době odesláno několik odkazů. Počkejte hodinu, požádejte znovu a mezitím se podívejte do složky s nevyžádanou poštou (spamu).",

    "forgotPassword.title": "Zapomněli jste heslo?",
    "forgotPassword.emailAddress": "E-mailová adresa",
    "forgotPassword.submit": "Poslat cestu zpět",
    "forgotPassword.home": "Zpět na {siteName}",
    "forgotPassword.sent.title": "Zkontrolujte e-mail",
    "forgotPassword.sent.explanation":
      "Pokud má tato adresa účet, je na cestě odkaz pro nastavení nového hesla. Otevřete ho do hodiny. Pokud nic nedorazí do několika minut, podívejte se do složky s nevyžádanou poštou (spamu).",
    "forgotPassword.tryAgainLater":
      "Odsud bylo v poslední době požádáno o příliš mnoho cest zpět. Počkejte hodinu a zkuste to znovu.",

    "setNewPassword.title": "Nastavit nové heslo",
    "setNewPassword.password": "Heslo",
    "setNewPassword.confirmPassword": "Potvrzení hesla",
    "setNewPassword.submit": "Nastavit nové heslo",
    "setNewPassword.home": "Zpět na {siteName}",
    "setNewPassword.signIn": "Přihlásit se",
    "setNewPassword.askAgain": "Požádat o nový odkaz",
    "setNewPassword.changed.title": "Vaše heslo bylo změněno",
    "setNewPassword.changed.explanation":
      "Byli jste odhlášeni všude, kde jste byli přihlášeni. Přihlaste se novým heslem.",
    "setNewPassword.expired.title": "Platnost odkazu vypršela",
    "setNewPassword.expired.explanation":
      "Odkaz pro nastavení nového hesla platí hodinu. Požádejte o další a bude odeslán na stejnou adresu.",
    "setNewPassword.noLongerWorks.title": "Tento odkaz již nefunguje",
    "setNewPassword.noLongerWorks.explanation":
      "Možná už byl použit, nebo na jeho konci něco chybí. Pokud ho stále potřebujete, požádejte o další.",

    // Říká se nad poli, když se kontrola prozrazených hesel nedá zeptat.
    "BreachedPasswords.Unreachable":
      "Vaše heslo se teď nedá zkontrolovat, a proto nebylo změněno. Zkuste to znovu za několik minut; váš odkaz funguje, dokud nevyprší.",

    "forgetAccount.title": "Zapomenout váš účet",
    "forgetAccount.explanation":
      "Vaše jméno a e-mailová adresa mohou být natrvalo znečitelněny a váš účet uzavřen. Abychom si byli jisti, že jste to vy, nejprve pošleme odkaz na adresu vašeho účtu a nic se nezapomene, dokud ho neotevřete.",
    "forgetAccount.submit": "Poslat mi odkaz e-mailem",
    "forgetAccount.sent.title": "Zkontrolujte e-mail",
    "forgetAccount.sent.explanation":
      "Poslali jsme odkaz na adresu vašeho účtu. Platí 15 minut a jen dokud jste k tomuto účtu přihlášeni.",
    "forgetAccount.confirm.title": "Zapomenout váš účet nadobro?",
    "forgetAccount.confirm.explanation":
      "Po zapomenutí už nikdo nikdy nepřečte vaše jméno ani e-mailovou adresu a k vašemu účtu se nebude možné přihlásit. Nelze to vrátit zpět.",
    "forgetAccount.confirm.submit": "Zapomenout můj účet",
    "forgetAccount.forgotten.title": "Váš účet byl zapomenut",
    "forgetAccount.forgotten.explanation":
      "Vaše jméno a e-mailovou adresu už nelze přečíst a byli jste odhlášeni všude, kde jste byli přihlášeni.",
    "forgetAccount.noLongerWorks.title": "Tento odkaz již nefunguje",
    "forgetAccount.noLongerWorks.explanation":
      "Mohla mu vypršet platnost, mohl být již použit, nebo patří k účtu, ke kterému nejste přihlášeni. Pokud chcete účet stále zapomenout, požádejte znovu ze svého účtu.",
    "forgetAccount.lastAdministrator.title": "Váš účet nelze zapomenout",
    "forgetAccount.lastAdministrator.explanation":
      "Jste jediným administrátorem tohoto webu. Předejte roli administrátora někomu jinému a poté bude možné váš účet zapomenout.",
    "forgetAccount.askAgain": "Požádat znovu",
    "forgetAccount.home": "Zpět na {siteName}",

    "registrationsSuspended.title": "Registrace jsou nyní pozastaveny",
    "registrationsSuspended.explanation":
      "Služba, kterou registrace potřebuje, se teď nedá zastihnout, a proto se nikdo nemůže registrovat, dokud znovu neodpoví. Nic z toho, co jste napsali, nebylo uloženo.",
    "registrationsSuspended.tryAgainLater":
      "Zkuste to znovu za chvíli. Administrátor webu byl informován.",
    "registrationsSuspended.home": "Zpět na {siteName}",

    "signIn.title": "Přihlášení",
    "signIn.emailAddress": "E-mailová adresa",
    "signIn.password": "Heslo",
    "signIn.submit": "Přihlásit se",
    "signIn.forgotPassword": "Zapomenuté heslo?",
    "signIn.register": "Registrovat se",
    "signIn.withGoogle": "Přihlásit se přes Google",
    "signIn.or": "nebo",
    "signIn.tryAgainLater":
      "V poslední době bylo provedeno příliš mnoho pokusů. Počkejte hodinu a zkuste to znovu.",

    // Jediná odpověď na špatné heslo i na adresu, kterou nikdo neregistroval.
    // Neříká, která z toho to byla, ani která to nebyla.
    "SignIn.Failed":
      "E-mailová adresa nebo heslo není správné. Zkuste to znovu.",

    "profile.title": "Profil",
    // Dvojtečka u popisku patří k jeho slovům, protože jazyky ji píšou různě.
    "profile.name": "Jméno:",
    "profile.emailAddress": "E-mailová adresa:",

    "changeName.title": "Změnit jméno",
    "changeName.name": "Jméno",
    "changeName.submit": "Změnit jméno",

    "setPassword.title": "Nastavit heslo",
    "setPassword.explanation":
      "Váš účet nemá heslo: přihlašujete se přes Google. Abyste se mohli přihlašovat i heslem, pošleme na {emailAddress} e-mail s odkazem pro jeho nastavení.",
    "setPassword.submit": "Poslat mi odkaz e-mailem",
    "setPassword.sent.title": "Zkontrolujte e-mail",
    "setPassword.sent.explanation":
      "Poslali jsme vám e-mail s odkazem pro nastavení hesla. Platí hodinu.",
    "setPassword.profile": "Zpět na váš profil",

    "changePassword.title": "Změnit heslo",
    "changePassword.currentPassword": "Současné heslo",
    "changePassword.password": "Nové heslo",
    "changePassword.passwordConfirmation": "Potvrzení hesla",
    "changePassword.forgotPassword": "Zapomenuté heslo?",
    "changePassword.submit": "Změnit heslo",
    // Pod současným heslem, o které jde.
    "ChangePassword.WrongPassword": "To není vaše heslo.",

    "changeEmailAddress.title": "Změnit e-mailovou adresu",
    "changeEmailAddress.emailAddress": "Nová e-mailová adresa",
    "changeEmailAddress.currentPassword": "Současné heslo",
    "changeEmailAddress.submit": "Poslat potvrzovací odkaz",
    "changeEmailAddress.sent.title": "Zkontrolujte e-mail",
    "changeEmailAddress.sent.explanation":
      "Na novou e-mailovou adresu byl odeslán odkaz pro potvrzení přesunu. Otevřete ho přihlášeni a váš účet se tam přesune.",
    "changeEmailAddress.confirm.title": "Přesunout váš účet",
    "changeEmailAddress.confirm.explanation":
      "Váš účet se přesune na {emailAddress}. Od nynějška se budete přihlašovat touto adresou.",
    "changeEmailAddress.confirm.submit": "Přesunout můj účet",
    "changeEmailAddress.noLongerWorks.title": "Tento odkaz již nefunguje",
    "changeEmailAddress.noLongerWorks.explanation":
      "Vypršela mu platnost, byl již použit, nebo nebyl poslán pro účet, ke kterému jste přihlášeni. Požádejte znovu ze svého profilu.",
    "changeEmailAddress.taken.title": "Váš účet se nepřesunul",
    "changeEmailAddress.profile": "Zpět na váš profil",
    // Pod polem, o které jde.
    "ChangeEmailAddress.WrongPassword": "To není vaše heslo.",
    "ChangeEmailAddress.Unchanged": "Váš účet už je na této adrese.",
    "ChangeEmailAddress.Taken":
      "Tato e-mailová adresa má nyní vlastní účet, a proto se k ní ten váš nemůže přesunout.",

    "confirmEmailAddress.title": "Potvrďte svou e-mailovou adresu",
    "confirmEmailAddress.name": "Jméno",
    "confirmEmailAddress.password": "Heslo",
    "confirmEmailAddress.confirmPassword": "Potvrzení hesla",
    "confirmEmailAddress.submit": "Potvrdit mou e-mailovou adresu",
    "confirmEmailAddress.signIn": "Přihlásit se",
    "confirmEmailAddress.home": "Zpět na {siteName}",
    "confirmEmailAddress.confirmed.title": "Vaše e-mailová adresa je potvrzena",
    "confirmEmailAddress.confirmed.explanation":
      "Váš účet je připraven. Přihlaste se e-mailovou adresou a heslem, které jste právě zadali.",
    "confirmEmailAddress.expired.title": "Platnost odkazu vypršela",
    "confirmEmailAddress.expired.explanation":
      "Odkaz pro potvrzení e-mailové adresy platí 24 hodin. Požádejte o nový a bude odeslán na stejnou adresu.",
    "confirmEmailAddress.expired.newLink": "Poslat nový odkaz",
    "confirmEmailAddress.noLongerWorks.title": "Tento odkaz již nefunguje",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Zkontrolujte, že jste otevřeli celý odkaz z e-mailu a že na jeho konci nic nechybí. Pokud stále nefunguje, zaregistrujte se znovu a bude vám odeslán nový odkaz.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Tato e-mailová adresa je již potvrzena",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Není co dalšího dělat. Přihlaste se heslem, které jste zadali při potvrzení.",

    // Porušené pravidlo, označené svým kódem, aby ho každý formulář říkal
    // stejně. Říká se tomu, kdo to napsal, pod polem, které se čte.
    "PersonName.Missing": "Zadejte jméno.",
    "PersonName.TooShort": "Jméno musí mít alespoň 3 znaky.",
    "PersonName.TooLong": "Jméno může mít nejvýše 254 znaků.",
    "WorldRankingName.TooShort":
      "Jméno ve světovém žebříčku musí mít alespoň 3 znaky.",
    "WorldRankingName.TooLong":
      "Jméno ve světovém žebříčku může mít nejvýše 254 znaků.",
    "Password.Missing": "Zadejte heslo.",
    "Password.TooShort": "Heslo musí mít alespoň 12 znaků.",
    "Password.ConfirmationDiffers":
      "Toto není stejné jako heslo výše. Napište ho znovu.",
    "Password.Breached":
      "Toto heslo se objevilo při úniku dat jinde, a proto ho zde není bezpečné používat. Zvolte jiné.",

    "javaScriptRequired.title": "Je potřeba skriptování",
    "javaScriptRequired.explanation":
      "Registrace vyžaduje zapnuté skriptování pro tento web, aby se dalo ověřit, že se registruje člověk. Zapněte ho a zaregistrujte se znovu.",
    "javaScriptRequired.register": "Zpět k registraci",
    "javaScriptRequired.home": "Zpět na {siteName}",

    "errors.backHome": "Zpět na {siteName}",
    "errors.notFound": "Nenalezeno",
    "errors.refused": "Toto nešlo provést",
    "errors.refusedDetail": "Něco z toho, co bylo odesláno, nebylo v pořádku.",
    "errors.sorry": "Omlouváme se",
    "errors.sorryDetail": "Tento požadavek nešlo vyřídit.",
    "errors.failed": "Něco se pokazilo",
    "errors.reference": "Referenční číslo {reference}.",
    "errors.recorded":
      "Chyba byla zaznamenána do protokolu a administrátorovi byl odeslán e-mail. Pomůže, když administrátorovi napíšete e-mail s referenčním číslem a popisem toho, co jste dělali.",
    "errors.message": "Napsat administrátorovi",
    "errors.messageSubject": "Chyba {reference} na {siteName}",
    "errors.messageBody": "Co jsem dělal(a), když se to stalo:\n\n",
    "errors.unavailable": "Web je nedostupný",
    "errors.unavailableDetail":
      "Web se teď nemůže dostat k tomu, co potřebuje. Zkuste to prosím později.",
    "errors.maintenance": "Web je vypnutý kvůli údržbě.",
    "errors.maintenanceMinutes": "Očekává se, že bude zpět za {minutes} min.",
    "errors.maintenanceMinute": "Očekává se, že bude zpět za 1 minutu.",
    "errors.maintenanceLonger":
      "Trvá to déle, než se čekalo, ale brzy bude zpět.",

    // Dva seznamy domovské stránky, co říká každý, když v něm nic není, a
    // cesta pod nimi ke všem letošním turnajům.
    "home.recentResults": "Nedávné výsledky",
    "home.recentResults.none":
      "Za posledních sedm dní nebyly přidány žádné hry.",
    "home.upcomingTournaments": "Nadcházející turnaje",
    "home.upcomingTournaments.none":
      "Během příštích šedesáti dní nezačíná žádný turnaj.",
    "home.allTournaments": "Všechny turnaje v roce {year}",
    // Stránka roku: její nadpis.
    "year.heading": "Turnaje v roce {year}",
    // Měsíce stránky roku, které se načítají po stisknutí.
    "year.needsScripting":
      "Měsíce roku se otevírají skriptováním, které je vypnuté. Zapněte ho prosím pro tento web.",
    "year.showAll": "Zobrazit vše",
    "year.hideAll": "Skrýt vše",
    "year.monthNone": "{month} {year}: žádný turnaj nezačíná.",
    "year.monthFailed": "Turnaje se nepodařilo načíst. Zkuste to prosím znovu.",
    // Stránka sportu v roce: totéž, jen pro tento sport.
    "yearSport.heading": "{sport}: turnaje v roce {year}",
    "yearSport.monthNone": "{sport}, {month} {year}: žádný turnaj nezačíná.",
    // Stránka turnaje: její oddíly, co říká o hře, jak dávno byla přidána a co
    // říká, když žádnou nemá.
    "tournament.recent": "Nedávné",
    "tournament.summary": "Přehled",
    // Přehled turnaje hraného týmy: skupiny a sloupce jeho tabulky.
    // Mřížka testu: z kolika her se každý zápas hraje, slovo mezi týmy a součty
    // pod zápasy.
    "test.bestOf": "Počet her v každém zápase nejvýše: {count}.",
    "test.vs": "proti",
    "test.matches": "Zápasy",
    "test.games": "Hry",
    "test.hoops": "Branky",
    "teamSummary.tests": "Testy",
    "teamSummary.matches": "Zápasy",
    "teamSummary.games": "Hry",
    "teamSummary.hoops": "Branky",
    "teamSummary.wins": "Výhry",
    "teamSummary.losses": "Prohry",
    "teamSummary.draws": "Remízy",
    "teamSummary.for": "Pro",
    "teamSummary.against": "Proti",
    "teamSummary.net": "Rozdíl",
    "tournament.players": "Hráči",
    "search.label": "Hledat",
    "search.tournaments": "Turnaje",
    "search.competitions": "Soutěže",
    "search.nothingFound": "Nic nebylo nalezeno.",
    "players.search.label": "Hledat hráče",
    "players.search.prompt": "Napište jméno hráče, abyste ho našli.",
    "players.search.none": "Žádní hráči nebyli nalezeni.",
    "search.more":
      "Zobrazuje se jen prvních {count}. Doplňte další část jména a hledání se zúží.",
    "websitePlayer.tournament": "Turnaj",
    // Test v oddílech turnaje: krátké názvy jeho dvou týmů.
    "tournament.test": "{first} proti {second}",
    "tournament.notes": "Poznámky",
    "tournament.commentary": "Komentář",
    "tournament.beat": "porazil(a)",
    "tournament.drewWith": "remizoval(a) s",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 h",
    "tournament.ago.hours": "{count} h",
    "tournament.none": "Zatím nebyly odehrány žádné hry.",
    // Stránka hráčů turnaje, když žádné nemá.
    "players.none": "Zatím nebyli přidáni žádní hráči.",
    // Stránka komentářů turnaje, ve slovech starého webu: jak se komentář
    // uvádí a odkaz na založení nového.
    "commentaries.by": "od",
    "commentaries.start": "Založit nový komentář",
    // Stránka, která zakládá komentář.
    "startCommentary.title": "Založit nový komentář",
    "startCommentary.titleField": "Název",
    "startCommentary.submit": "Založit komentář",
    // „Nové“ se čtečce obrazovky říká místo červené hvězdičky, která označuje
    // poznámku nebo komentář, jež nejsou přečteny tak, jak jsou nyní.
    "marks.new": "nové",
    // Stránka poznámek turnaje a stránka jedné poznámky.
    // Stránka se jmenuje Poznámky organizátorů, zatímco její oddíl v liště je
    // Poznámky (tournament.notes), na což je tam jediné místo.
    "notes.heading": "Poznámky organizátorů",
    "notes.none": "Zatím žádné poznámky.",
    "note.edited": "upraveno",
    // Stránka komentáře: co říká, když nemá žádné příspěvky, co říká o
    // příspěvku a pole, do kterého jeho autor píše další.
    "commentary.none": "Zatím nebyly napsány žádné příspěvky.",
    "commentary.edited": "upraveno",
    "commentary.edit": "Upravit",
    "commentary.delete": "Smazat",
    "commentary.comment": "Příspěvek",
    "commentary.add": "Přidat příspěvek",
    "commentary.notSent":
      "Příspěvek se nepodařilo odeslat. Načtěte stránku znovu a zjistěte, zda byl uložen.",
    // Stránka, která mění název komentáře.
    "changeCommentaryTitle.title": "Změnit název",
    "changeCommentaryTitle.submit": "Uložit",
    // Stránka jednoho příspěvku, kde ho jeho autor upravuje nebo maže, a
    // stránka, která se ptá před smazáním.
    "editComment.title": "Upravit příspěvek",
    "editComment.save": "Uložit",
    "deleteComment.title": "Smazat příspěvek",
    "deleteComment.question": "Smazat tento příspěvek? Nelze to vrátit zpět.",
    "deleteComment.confirm": "Smazat příspěvek",
    "deleteComment.keep": "Ponechat",
    // Stránka hráče: její dvě části, jak se říká hra tak, jak ji hráč hrál, a
    // co říká každá část, když v ní nic není.
    "player.games": "Hry",
    "player.competitions": "Soutěže",
    "player.beat": "porazil(a)",
    "player.lostTo": "prohrál(a) s",
    "player.drewWith": "remizoval(a) s",
    "player.score": "{score}:{opponent}",
    "player.noGames": "Zatím nebyly odehrány žádné hry.",
    "player.noCompetitions": "Zatím není přihlášen do žádné soutěže.",
    // Stránka bloku: součty jeho mřížky, co je skóre pro hráče v řádku, řečené
    // nahlas místo zobrazeného, a hráč, který odstoupil.
    "block.wins": "Výhry",
    "block.matches": "Zápasy",
    "block.netGames": "Rozdíl her",
    "block.games": "Hry",
    "block.netHoops": "Rozdíl branek",
    "block.won": "výhra",
    "block.lost": "prohra",
    "block.drawn": "remíza",
    "block.withdrawn": "odstoupení",
    // Hra, která byla neuznána, což se říká jinak než o hráči.
    "block.gameWithdrawn": "neuznáno",
    "block.losses": "Prohry",
    // Sloupec pořadí na konci mřížky bloku, přehledu a tisku a co se pod
    // každým říká o tom, jak se rozlišují hráči se stejným počtem vyhraných
    // zápasů. Rozdíl branek je v druhém na prvním místě, pro blok, jehož
    // zápasy jsou jedna hra, kde by rozdíl her jen opakoval, co říkají výhry.
    "block.placing": "#",
    "block.tieBreak.netGamesNetHoopsWhoBeatWho":
      "Shodu rozhoduje rozdíl her, poté rozdíl branek a poté vzájemný zápas.",
    "block.tieBreak.netHoopsWhoBeatWho":
      "Shodu rozhoduje rozdíl branek a poté vzájemný zápas.",
    "block.tieBreak.whoBeatWho": "Shodu rozhoduje vzájemný zápas.",
    "block.tieBreak.other": "Způsob rozhodování shody není znám.",
    // Tři pohledy na blok, nabízené pod jeho nadpisem.
    "competition.views": "Pohledy",
    "competition.view.grid": "Mřížka",
    "competition.view.summary": "Přehled",
    "competition.view.orderOfPlay": "Pořadí her",
    "competition.print": "Tisk",
    "competition.playedTo": "Počet branek ve hře: {hoops}",
    "blockSummary.ranking":
      "Pořadí podle podílu vyhraných zápasů. Vlastní pravidla turnaje mohou hráče seřadit jinak.",
    "orderOfPlay.none": "Zatím nebyly odehrány žádné hry.",
    "orderOfPlay.column.game": "Hra",
    "orderOfPlay.column.date": "Datum",
    // Kola pavouka, pojmenovaná tak, jak je pojmenoval starý web, počítaná od
    // posledního, a bye nakreslený místo hráče.
    "knockout.round.final": "Finále",
    "knockout.round.semis": "Semifinále",
    "knockout.round.quarters": "Čtvrtfinále",
    "knockout.round.number": "{number}. kolo",
    "knockout.bye": "Bye",
    // Tabulka švýcarského systému: co každý hráč odehrál a vyhrál a jeho
    // výsledky.
    "swiss.games": "Hry",
    "swiss.wins": "Výhry",
    "swiss.winShare": "Výhry %",
    "swiss.results": "Výsledky",
    // Šipky, které posouvají mřížku pavouka k finále a zpět k prvnímu kolu.
    "knockout.onward": "Další kola",
    "knockout.back": "Předchozí kola",
    // Co mají společné všechny seznamy turnajů, na domovské stránce i na
    // stránce roku: sloupce, z nichž je každý tabulkou, a co je zužuje.
    "tournamentList.column.date": "Datum",
    "tournamentList.column.name": "Název",
    // Vlajka, která zužuje seznamy na svou zemi, pojmenovaná tím, co dělá.
    "tournamentList.onlyIn": "Pouze turnaje: {country}",
    "tournamentList.usualOrder": "Zpět na obvyklé pořadí",
    "tournamentList.filter.country": "Země",
    "tournamentList.filter.anyCountry": "Kterákoli země",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Kterýkoli region",
    "tournamentList.filter.noRegionsBefore":
      "Turnaje před listopadem 2026 nemají regiony.",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Kterýkoli sport",
    "tournamentList.filter.submit": "Filtrovat",
    "tournamentList.filter.from": "Od",
    "tournamentList.filter.to": "Do",
    "tournamentsInDays.heading": "Turnaje od {from} do {to}",
    "tournamentsInDays.headingAll": "Turnaje",
    "tournamentsInDays.none": "V těchto dnech nezačíná žádný turnaj.",
    "tournamentsInDays.previous": "Předchozí",
    "tournamentsInDays.next": "Další",
    "tournamentsInDays.page": "Strana {page} / {last}",
    // Roky, ve kterých turnaje jsou, vedlejší navigace obou stránek.
    "years.label": "Roky",
    // Rozbalovací seznam s roky, které se nevejdou jako karty.
    "years.earlier": "Dřívější roky",

    // Slova adminu. Admin je kreslí v prohlížeči, a proto je server říká do
    // své stránky, když ji posílá (adminPage.ts): tato a odmítnutí turnaje
    // níže.
    "admin.newerBuild.message": "Je k dispozici novější verze tohoto webu.",
    "admin.newerBuild.reload": "Načíst znovu",
    "admin.title": "Admin",
    "admin.tournaments.new": "Nový turnaj",
    "admin.tournaments.none": "Žádné turnaje",
    "admin.tournaments.filter.none": "Žádný turnaj nevyhovuje",
    "admin.tournaments.show": "Zobrazit",
    "admin.tournaments.managerScorer": "Organizátor/zapisovatel",
    "admin.tournaments.worldRanking": "Světový žebříček",
    "admin.tournaments.notWorldRanking": "Mimo světový žebříček",
    // Říká se čtečce obrazovky, protože čára přes jméno se nečte nahlas.
    "admin.tournaments.archived": "Archivováno",
    "admin.tournaments.manage": "Spravovat",
    "admin.tournaments.edit": "Upravit",
    "admin.tournaments.archive": "Archivovat",
    "admin.tournaments.restore": "Obnovit",
    "admin.tournaments.scores": "Skóre",
    "admin.tournaments.players": "Hráči",
    "admin.years.label": "Roky",
    // Co říká rozbalovací seznam roků, dokud je zvolený rok kartou.
    "admin.years.earlier": "Dřívější roky",
    "admin.tournament.name": "Název",
    "admin.tournament.starts": "Začátek",
    "admin.tournament.finishes": "Konec",
    "admin.tournament.format": "Formát",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Země",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Podtitul",
    "admin.rules.handicap": "Hraje se s handicapy",
    "admin.rules.drawsAllowed": "Povoluje remízy",
    "admin.tournament.levelTestsDrawn": "Vyrovnané testy jsou remízy",
    "admin.rules.worldRankings": "Počítá se do světových žebříčků",
    "admin.rules.maximumHoops": "Nejvyšší počet branek",
    "admin.tournament.national": "Akce na národní úrovni",
    "admin.tournament.international": "Akce na mezinárodní úrovni",
    // Odmítnutí bez vlastních slov, nad poli.
    "admin.tournament.otherwise": "Toto nelze přijmout tak, jak to je.",
    "admin.newTournament.title": "Nový turnaj",
    "admin.newTournament.submit": "Vytvořit turnaj",
    "admin.editTournament.title": "Upravit turnaj",
    "admin.editTournament.submit": "Aktualizovat turnaj",
    // Říká se místo formuláře u odmítnutí bez vlastních slov.
    "admin.editTournament.otherwise": "Tento turnaj nelze změnit.",
    // Stránka turnaje a karty, v nichž je, co se dá spravovat.
    "admin.view.tabs": "Turnaj",
    "admin.view.players": "Hráči",
    "admin.view.competitions": "Soutěže",
    "admin.view.managers": "Organizátoři",
    "admin.view.notes": "Poznámky",
    "admin.view.scorers": "Zapisovatelé",
    "admin.view.rankings": "Žebříčky",
    "admin.rankings.file":
      "Světové žebříčky použijí výsledky turnaje prostřednictvím této funkce, takže organizátoři nemusí dělat nic.",
    "admin.rankings.download": "Stáhnout hry pro světový žebříček",
    "rankings.notAvailable": "Žebříčky nejsou k dispozici",
    "rankings.notAvailable.sport":
      "Sport tohoto turnaje nemá světové žebříčky, a proto není co odesílat.",
    "rankings.notAvailable.notCounted":
      "Žádná ze soutěží tohoto turnaje se nezapočítává do světových žebříčků.",
    // Říká se místo karet u odmítnutí bez vlastních slov.
    "admin.view.otherwise": "Tento turnaj odsud nelze spravovat.",
    // Stránka soutěže a karty, v nichž je, co se dá spravovat.
    "admin.competitionView.tabs": "Soutěž",
    "admin.competitionView.players": "Hráči",
    "admin.competitionView.scores": "Skóre",
    "admin.competitionView.losers": "Poražení",
    "admin.losers.add": "Přidat pavouka poražených",
    "admin.losers.round": "Poražení z",
    "admin.losers.option": "{round} (poražených: {count})",
    "admin.losers.name": "Název pavouka poražených",
    "admin.losers.none": "Žádní pavouci poražených.",
    "admin.losers.noRounds":
      "Tento pavouk nemá kolo, jehož poražení by mohli hrát dál.",
    "admin.losers.remove": "Odebrat",
    "admin.losers.readOnly":
      "Hráči tohoto pavouka jsou poražení z jiného pavouka, sem dosazovaní podle toho, jak se rozhodují zápasy.",
    "admin.hover.losers.add":
      "Přidat pavouka pro poražené z jednoho kola tohoto pavouka",
    "Tournament.NoSuchRound":
      "Pavouk nemá takové kolo, z něhož poražení postupují dál.",
    "Tournament.KnockoutHasLosersKnockouts":
      "Poražené z tohoto pavouka přebírá jiný pavouk, a proto nelze měnit jeho místa.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "Poražené z tohoto pavouka přebírá jiný používaný pavouk, nejprve proto archivujte ten.",
    "Tournament.LosersKnockoutSourceArchived":
      "Tento pavouk poražených přebírá poražené z archivovaného pavouka, nejprve proto obnovte ten.",
    "Tournament.LosersKnockoutPlacesFixed":
      "Pavouk poražených má tolik míst, kolik zápasů má kolo, z něhož poražené přebírá.",
    "Competition.PlayersSetAutomatically":
      "Hráči pavouka poražených se sem dosazují podle toho, jak se rozhodují zápasy, ne ručně.",
    // Lišta oddílů stránky turnaje a stránek jeho soutěží.
    "admin.sections.label": "Turnaj a jeho soutěže",
    "admin.sections.tournament": "Turnaj",
    // Lišta oddílů stránek administrátora.
    "admin.administrator.sections.label": "Stránky administrátora",
    "admin.administrator.sections.tournaments": "Turnaje",
    "admin.administrator.sections.accounts": "Účty",
    "admin.administrator.sections.worldRankings": "Světové žebříčky",
    "admin.administrator.sections.importErrors": "Chyby importu",
    "admin.administrator.sections.logs": "Protokoly",
    "admin.administrator.sections.databaseStatus": "Přístup k databázi",
    "admin.administrator.sections.countries": "Země",
    "admin.databaseStatus.title": "Přístup k databázi",
    "admin.databaseStatus.on": "Přístup k databázi je zapnutý.",
    "admin.databaseStatus.off": "Přístup k databázi je vypnutý.",
    "admin.databaseStatus.expected":
      "Očekává se, že web bude zpět za {minutes} min.",
    "admin.databaseStatus.expectedOne":
      "Očekává se, že web bude zpět za 1 minutu.",
    "admin.databaseStatus.longer": "Trvá to déle, než se čekalo.",
    "admin.databaseStatus.told": "Čtenářům se říká: {words}",
    "admin.databaseStatus.toldUsual": "Čtenářům se říká obvyklá věta.",
    "admin.databaseStatus.minutes": "Očekávané minuty",
    "admin.databaseStatus.words": "Slova pro čtenáře",
    "admin.databaseStatus.turnOff": "Vypnout",
    "admin.databaseStatus.change": "Změnit",
    "admin.databaseStatus.turnOn": "Zapnout",
    "admin.databaseStatus.minutesNeeded": "Minuty jsou potřeba.",
    "admin.databaseStatus.otherwise": "Na webu se něco pokazilo.",
    "DatabaseAccess.MinutesNotWhole": "Minuty musí být celé číslo.",
    "DatabaseAccess.MinutesOutOfRange": "Minuty musí být od 1 do 1440.",
    "DatabaseAccess.WordsTooLong": "Slova nesmí mít více než 500 znaků.",
    "DatabaseAccess.NotOff": "Přístup k databázi není vypnutý.",
    "admin.administrator.title": "Administrátor",
    // Stránka účtů, oddíl pro každou roli.
    "admin.accounts.title": "Účty",
    "admin.roles.add": "Přidat",
    "admin.roles.administrator.heading": "Administrátoři",
    "admin.roles.administrator.none": "Žádní další administrátoři",
    "admin.roles.administrator.removeTitle": "Odebrat administrátora",
    "admin.roles.administrator.removeExplanation":
      "{name} už nebude administrátorem tohoto webu.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Správci světového žebříčku asociačního kroketu",
    "admin.roles.ac-world-ranking-officer.none":
      "Žádní správci světového žebříčku asociačního kroketu",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Odebrat správce světového žebříčku asociačního kroketu",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} už nebude správcem světového žebříčku asociačního kroketu.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Správci světového žebříčku golfového kroketu",
    "admin.roles.gc-world-ranking-officer.none":
      "Žádní správci světového žebříčku golfového kroketu",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Odebrat správce světového žebříčku golfového kroketu",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} už nebude správcem světového žebříčku golfového kroketu.",
    // Pro odmítnutí bez vlastních slov, pod polem nebo místo seznamu. Ne o
    // adrese, protože to může být skončená relace nebo selhání webu.
    // Stránka, kde se importují hráči světového žebříčku, a její protokol,
    // řádek pro každou věc, kterou import říká. Počet se říká za dvojtečkou,
    // aby se jeden hráč i mnoho hráčů říkali stejně.
    "admin.worldRankings.title": "Importovat hráče světového žebříčku",
    "admin.worldRankings.import": "Importovat",
    "admin.worldRankings.log": "Jak import probíhal",
    "admin.worldRankings.ac.reading": "Čte se seznam asociačního kroketu",
    "admin.worldRankings.ac.read":
      "Načtení hráči asociačního kroketu: {players}",
    "admin.worldRankings.ac.kept":
      "Ponechaní hráči asociačního kroketu: {players}",
    "admin.worldRankings.ac.refused":
      "Seznam asociačního kroketu se nepodařilo přečíst, a proto jeho hráči zůstali, jací byli.",
    "admin.worldRankings.gc.reading": "Čte se seznam golfového kroketu",
    "admin.worldRankings.gc.read": "Načtení hráči golfového kroketu: {players}",
    "admin.worldRankings.gc.kept":
      "Ponechaní hráči golfového kroketu: {players}",
    "admin.worldRankings.gc.refused":
      "Seznam golfového kroketu se nepodařilo přečíst, a proto jeho hráči zůstali, jací byli.",
    "admin.worldRankings.finished": "Dokončeno",
    "admin.worldRankings.failed": "Import nebyl dokončen.",
    // Pro odmítnutí bez vlastních slov, jako selhání webu.
    "admin.worldRankings.otherwise": "Na webu se něco pokazilo.",
    "WorldRankingLists.Unreachable":
      "Web světových žebříčků se nepodařilo zastihnout.",
    "WorldRankingLists.Unreadable":
      "Seznam nemá takové uspořádání, jaké mají světové žebříčky: nějaký jeho řádek nešlo přečíst, nikdo na něm není, nebo není zapsán v UTF-8.",
    // Dokumenty, které import ze starých webů odmítl, a stránka jednoho z nich.
    "admin.importErrors.title": "Chyby importu",
    "admin.importErrors.none": "Žádné chyby importu",
    "admin.importErrors.otherwise": "Na webu se něco pokazilo.",
    "admin.countries.title": "Země",
    "admin.countries.none":
      "Žádný turnaj se nehraje v zemi, kterou seznamy nepojmenovávají",
    "admin.countries.oldSite": "Starý web",
    "admin.countries.otherwise": "Na webu se něco pokazilo.",
    "admin.logs.title": "Protokoly",
    "admin.logs.severity": "Závažnost",
    "admin.logs.text": "Vyhledat",
    "admin.logs.show": "Zobrazit",
    "admin.logs.prune": "Vyčistit",
    "admin.logs.pruneAsk":
      "Odstranit protokol starší než poslední hodina? Nic ho nevrátí.",
    "admin.logs.removed": "Odstraněno záznamů: {count}",
    "admin.logs.none": "Žádné záznamy protokolu",
    "admin.logs.otherwise": "Na webu se něco pokazilo.",
    "admin.hover.logs.show": "Zobrazit odpovídající záznamy",
    "admin.hover.logs.prune": "Odstranit protokol starší než poslední hodina",
    "admin.hover.logs.pruneAgree":
      "Odstranit protokol starší než poslední hodina",
    "admin.importError.title": "Chyba importu",
    "admin.importError.documentId": "ID dokumentu",
    "admin.importError.tournament": "Turnaj",
    "admin.importError.competition": "Soutěž",
    "admin.importError.newSite": "Nový web",
    "admin.importError.oldSite": "Starý web",
    "ImportErrorKept.NotFound":
      "Import k tomuto dokumentu žádnou chybu neuložil.",
    "admin.competitionView.otherwise": "Tuto soutěž odsud nelze spravovat.",
    // Karta Soutěže: druh každé soutěže, co se s ní dá dělat, a nadpis, pod
    // kterým jsou archivované.
    "admin.competitions.block": "Blok",
    "admin.competitions.knockout": "Pavouk",
    "admin.competitions.swiss": "Švýcarský systém",
    "admin.competitions.view": "Zobrazit",
    "admin.competitions.edit": "Upravit",
    "admin.competitions.up": "Nahoru",
    "admin.competitions.down": "Dolů",
    "admin.competitions.archive": "Archivovat",
    "admin.competitions.restore": "Obnovit",
    "admin.competitions.archived": "Archivované soutěže",
    "admin.competitions.none": "Žádné soutěže",
    "admin.competitions.add": "Přidat soutěž",
    // Dialog soutěže.
    "admin.competition.addTitle": "Přidat soutěž",
    "admin.competition.editTitle": "Upravit soutěž",
    "admin.competition.name": "Název",
    "admin.competition.kind": "Druh",
    "admin.competition.bestOf": "Nejlepší z",
    "admin.competition.rounds": "Kola",
    "admin.competition.tieBreaks": "Rozhodování shody",
    "admin.competition.tieBreak.net-games-net-hoops-who-beat-who":
      "Rozdíl her, poté rozdíl branek, poté vzájemný zápas",
    "admin.competition.tieBreak.who-beat-who": "Vzájemný zápas",
    "admin.competition.tieBreak.other": "Jiné",
    "admin.competition.places": "Místa",
    "admin.competition.round": "{number}. kolo",
    "admin.competition.bestOfs": "Nejlepší z (podle kol)",
    "admin.competition.quarters": "Čtvrtfinále",
    "admin.competition.semis": "Semifinále",
    "admin.competition.final": "Finále",
    "admin.competition.add": "Přidat",
    "admin.competition.save": "Uložit",
    "admin.competition.added": "Přidáno: {name}.",
    // Nad poli, pro odmítnutí bez vlastních slov.
    "admin.competition.otherwise": "Tuto soutěž nelze uložit tak, jak je.",
    "CompetitionName.Missing": "Zadejte název.",
    "CompetitionName.TooLong": "Název může mít nejvýše 254 znaků.",
    "CompetitionName.NoLetterOrDigit":
      "Název musí obsahovat písmeno nebo číslici.",
    "Tournament.KnockoutPlayerHasGames":
      "Hráči v tomto losu mají hry, a proto se jeho místa nemohou měnit.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Kolo s rozhodnutým zápasem nelze změnit na kratší „nejlepší z“.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Kolo nelze změnit, jakmile se v pozdějším kole odehrála hra.",
    "Tournament.CompetitionNameTaken":
      "Jiná soutěž v tomto turnaji už má tento název.",
    "Tournament.MaximumHoopsInvalid":
      "Zadejte celé číslo branek, alespoň 1, nebo pole nechte prázdné pro žádné maximum.",
    "BestOf.NotWhole": "Zadejte celé číslo her.",
    "BestOf.TooSmall": "Zápas musí být nejlepší z alespoň 1 hry.",
    "Rounds.NotWhole": "Zadejte celé číslo kol.",
    "Rounds.TooSmall": "Blok se musí hrát alespoň v 1 kole.",
    "KnockoutDraw.EvenBestOf":
      "Zápas v pavouku musí mít vítěze, a proto je nejlepší z lichého počtu her.",
    // Každé modální okno má cestu ven, protože na stránku pod ním se nedá
    // dostat.
    "admin.hover.tournaments.new": "Vytvořit nový turnaj",
    "admin.hover.tournaments.manage":
      "Spravovat hráče, týmy, soutěže a skóre tohoto turnaje",
    "admin.hover.tournaments.edit": "Změnit údaje o tomto turnaji",
    "admin.hover.tournaments.scores": "Zadávat skóre tohoto turnaje",
    "admin.hover.tournaments.players": "Spravovat hráče tohoto turnaje",
    "admin.hover.competitions.view":
      "Otevřít tuto soutěž, abyste viděli a zadávali její hráče a skóre",
    "admin.hover.tests.view":
      "Otevřít tento test, abyste viděli a zadávali jeho skóre",
    "admin.hover.teams.view":
      "Otevřít tento tým, abyste viděli a spravovali jeho hráče",
    "admin.hover.dialog.player.add": "Přidat tohoto hráče do turnaje",
    "admin.hover.dialog.player.save": "Uložit změny tohoto hráče",
    "admin.hover.dialog.team.add": "Přidat tento tým do turnaje",
    "admin.hover.dialog.team.save": "Uložit změny tohoto týmu",
    "admin.hover.dialog.test.add": "Přidat tento test do turnaje",
    "admin.hover.dialog.test.save": "Uložit změny tohoto testu",
    "admin.hover.dialog.competition.add": "Přidat tuto soutěž do turnaje",
    "admin.hover.dialog.competition.save": "Uložit změny této soutěže",
    "admin.hover.dialog.score.add": "Přidat toto skóre do soutěže",
    "admin.hover.dialog.score.save": "Uložit opravu tohoto skóre",
    "admin.hover.dialog.carryForward.save":
      "Převést výsledky tohoto hráče do dalšího kola",
    "admin.hover.dialog.tournament.new": "Vytvořit tento turnaj",
    "admin.hover.dialog.tournament.edit": "Uložit změny tohoto turnaje",
    "admin.hover.modal.cancel": "Zavřít bez uložení čehokoli",
    "admin.hover.modal.ok": "Zavřít tuto zprávu",
    "admin.hover.tab": "Zobrazit kartu {name}",
    "admin.hover.tournaments.archive":
      "Archivovat tento turnaj; lze ho obnovit",
    "admin.hover.tournaments.restore": "Vrátit tento archivovaný turnaj",
    "admin.hover.players.add": "Přidat hráče do tohoto turnaje",
    "admin.hover.players.addMany":
      "Přidat do tohoto turnaje několik hráčů najednou",
    "admin.hover.dialog.players.add": "Přidat tyto hráče do turnaje",
    "admin.hover.players.edit": "Změnit údaje o tomto hráči",
    "admin.hover.players.up": "Posunout tohoto hráče v seznamu nahoru",
    "admin.hover.players.down": "Posunout tohoto hráče v seznamu dolů",
    "admin.hover.players.archive": "Archivovat tohoto hráče; lze ho obnovit",
    "admin.hover.players.restore": "Vrátit tohoto archivovaného hráče",
    "admin.hover.teams.add": "Přidat tým do tohoto turnaje",
    "admin.hover.teams.edit": "Změnit údaje o tomto týmu",
    "admin.hover.teams.up": "Posunout tento tým v seznamu nahoru",
    "admin.hover.teams.down": "Posunout tento tým v seznamu dolů",
    "admin.hover.teams.archive": "Archivovat tento tým; lze ho obnovit",
    "admin.hover.teams.restore": "Vrátit tento archivovaný tým",
    "admin.hover.competitions.add": "Přidat soutěž do tohoto turnaje",
    "admin.hover.competitions.edit": "Změnit údaje o této soutěži",
    "admin.hover.competitions.up": "Posunout tuto soutěž v seznamu nahoru",
    "admin.hover.competitions.down": "Posunout tuto soutěž v seznamu dolů",
    "admin.hover.competitions.archive":
      "Archivovat tuto soutěž; lze ji obnovit",
    "admin.hover.competitions.restore": "Vrátit tuto archivovanou soutěž",
    "admin.hover.tests.add": "Přidat test mezi dvěma týmy",
    "admin.hover.tests.edit": "Změnit údaje o tomto testu",
    "admin.hover.tests.up": "Posunout tento test v seznamu nahoru",
    "admin.hover.tests.down": "Posunout tento test v seznamu dolů",
    "admin.hover.tests.archive": "Archivovat tento test; lze ho obnovit",
    "admin.hover.tests.restore": "Vrátit tento archivovaný test",
    "admin.hover.tests.toTeams":
      "Přejít na kartu Týmy a přidat týmy, které test potřebuje",
    "admin.hover.scores.add": "Přidat skóre hry do této soutěže",
    "admin.hover.scores.edit": "Opravit toto skóre",
    "admin.hover.scores.archive":
      "Archivovat toto skóre, aby se přestalo počítat; lze ho obnovit",
    "admin.hover.scores.restore":
      "Vrátit toto archivované skóre, aby se znovu počítalo",
    "admin.hover.scores.withdraw":
      "Ponechat toto skóre v seznamu, ale přestat ho počítat",
    "admin.hover.scores.unwithdraw": "Znovu započítat toto neuznané skóre",
    "admin.hover.scores.up": "Posunout toto skóre v seznamu dříve",
    "admin.hover.scores.down": "Posunout toto skóre v seznamu později",
    "admin.hover.competitionPlayers.add":
      "Zařadit vybraného hráče do této soutěže",
    "admin.hover.competitionPlayers.up":
      "Posunout tohoto hráče v seznamu nahoru",
    "admin.hover.competitionPlayers.down":
      "Posunout tohoto hráče v seznamu dolů",
    "admin.hover.competitionPlayers.remove": "Vyřadit tohoto hráče ze soutěže",
    "admin.hover.competitionPlayers.withdraw":
      "Nechat tohoto hráče odstoupit ze soutěže",
    "admin.hover.competitionPlayers.unwithdraw":
      "Vrátit tohoto hráče, který odstoupil, zpět do soutěže",
    "admin.hover.competitionPlayers.carryForward":
      "Převést výsledky tohoto hráče z jiné soutěže",
    "admin.hover.notes.add": "Napsat novou poznámku k tomuto turnaji",
    "admin.hover.notes.edit": "Změnit tuto poznámku",
    "admin.hover.notes.delete": "Smazat tuto poznámku",
    "admin.hover.note.add": "Uložit tuto poznámku a přidat ji k turnaji",
    "admin.hover.note.save": "Uložit změny této poznámky",
    "admin.hover.people.add": "Přidělit této osobě roli",
    "admin.hover.people.remove": "Odebrat této osobě roli",
    "admin.hover.worldRankings.import":
      "Načíst světové žebříčky a přidat jejich hráče",
    "admin.modal.cancel": "Zrušit",
    // Jediné tlačítko modálního okna, které čtenáři jen něco sděluje.
    "admin.modal.ok": "OK",
    // Karty Organizátoři a Zapisovatelé, z nichž každá někoho jeho e-mailovou
    // adresou udělá organizátorem či zapisovatelem a také ho zase odebere.
    "admin.people.emailAddress": "E-mailová adresa",
    "admin.people.remove": "Odebrat",
    "admin.people.otherwise": "Toto nešlo provést.",
    // Vedle vlastního jména čtenáře mezi organizátory.
    "admin.managers.you": "Vy",
    "admin.managers.add": "Přidat organizátora",
    "admin.managers.email": "Napsat organizátorům",
    // Nikdy se neříká, protože turnaj má vždy organizátora, ale seznam říká
    // to, co říká, když je prázdný.
    "admin.managers.none": "Žádní organizátoři",
    "admin.managers.removeTitle": "Odebrat organizátora",
    "admin.managers.removeExplanation":
      "{name} už nebude moci tento turnaj řídit.",
    "admin.managers.removeYourself.explanation":
      "Už nebudete moci tento turnaj řídit a nikdo tady to za vás nemůže vrátit. Jiný organizátor vás může znovu učinit organizátorem.",
    "admin.managers.otherwise": "Z této adresy nelze udělat organizátora.",
    // Karta Hráči.
    // Karta Hráči jedné soutěže.
    "admin.competitionPlayers.add": "Přidat hráče",
    // Pod rozbalovacím seznamem, pro odmítnutí bez vlastních slov.
    "admin.competitionPlayers.otherwise": "Tohoto hráče nelze přidat.",
    "admin.competitionPlayers.addSeveral": "Přidat více",
    "admin.hover.competitionPlayers.addSeveral":
      "Vyberte několik hráčů turnaje a přidejte je do této soutěže najednou",
    "admin.addPlayers.title": "Přidat hráče",
    "admin.addPlayers.selectAll": "Vybrat všechny",
    "admin.addPlayers.add": "Přidat vybrané",
    "admin.hover.dialog.addPlayers.add": "Přidat vybrané hráče do této soutěže",
    "admin.addPlayers.otherwise": "Tyto hráče nelze přidat.",
    "admin.addPlayers.someRefusedTitle": "Někteří hráči nelze přidat",
    "admin.addPlayers.someRefusedQuestion":
      "Uvedené hráče nelze přidat. Chcete přidat ostatní z vybraných?",
    "admin.addPlayers.addTheRest": "Přidat ostatní",
    "admin.hover.dialog.addPlayers.addTheRest":
      "Přidat hráče, které lze přidat, do této soutěže a ostatní vynechat",
    "Competition.PlayerAlreadyEntered": "Už je v soutěži",
    "TournamentPlayer.Archived": "V turnaji odložen",
    "Tournament.NoSuchPlayer": "Není hráčem turnaje",
    "Competition.DrawFixed": "Los je pevný, protože byla zadána hra",
    "admin.competitionPlayers.choose": "Hráč k přidání",
    "admin.competitionPlayers.nobody": "Vyberte hráče",
    // Nabízí se v rozbalovacím seznamu pavouka a tak se uvádí bye.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Každý hráč je v soutěži",
    "admin.competitionPlayers.none": "Žádní hráči",
    "admin.competitionPlayers.up": "Nahoru",
    "admin.competitionPlayers.down": "Dolů",
    "admin.competitionPlayers.remove": "Odebrat",
    "admin.competitionPlayers.withdraw": "Odstoupit",
    "admin.competitionPlayers.unwithdraw": "Vrátit",
    "admin.competitionPlayers.withdrawn": "Hráči, kteří odstoupili",
    "admin.competitionPlayers.removeTitle": "Odebrat hráče",
    "admin.competitionPlayers.removeQuestion":
      "{name} bude vyřazen ze soutěže. Nelze to vrátit zpět.",
    "admin.competitionPlayers.withdrawTitle": "Odstoupení hráče",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} už v soutěži nebude hrát a hry, které neodehrál, se rozhodnou bez něj.",
    "admin.competitionPlayers.carryForward": "Převést výsledky",
    // Dialog převodu výsledků, nad kartou Hráči soutěže.
    "admin.carryForward.title": "Převést výsledky - {name}",
    "admin.carryForward.save": "Uložit",
    // Nad počty, pro odmítnutí bez vlastních slov.
    "admin.carryForward.otherwise": "Tento převod výsledků nelze uložit.",
    "admin.carryForward.matchWins": "Vyhrané zápasy",
    "admin.carryForward.matchLosses": "Prohrané zápasy",
    "admin.carryForward.gameWins": "Vyhrané hry",
    "admin.carryForward.gameLosses": "Prohrané hry",
    "admin.carryForward.hoopsFor": "Branky pro",
    "admin.carryForward.hoopsAgainst": "Branky proti",
    "CarryForward.MatchWinsNotWhole": "Zadejte celé číslo vyhraných zápasů.",
    "CarryForward.MatchWinsBelowZero": "Zadejte 0 nebo více vyhraných zápasů.",
    "CarryForward.MatchLossesNotWhole": "Zadejte celé číslo prohraných zápasů.",
    "CarryForward.MatchLossesBelowZero":
      "Zadejte 0 nebo více prohraných zápasů.",
    "CarryForward.GameWinsNotWhole": "Zadejte celé číslo vyhraných her.",
    "CarryForward.GameWinsBelowZero": "Zadejte 0 nebo více vyhraných her.",
    "CarryForward.GameLossesNotWhole": "Zadejte celé číslo prohraných her.",
    "CarryForward.GameLossesBelowZero": "Zadejte 0 nebo více prohraných her.",
    "CarryForward.HoopsForNotWhole": "Zadejte celé číslo branek pro.",
    "CarryForward.HoopsForBelowZero": "Zadejte 0 nebo více branek pro.",
    "CarryForward.HoopsAgainstNotWhole": "Zadejte celé číslo branek proti.",
    "CarryForward.HoopsAgainstBelowZero": "Zadejte 0 nebo více branek proti.",
    // Karta Skóre soutěže a dialog skóre.
    "admin.scores.add": "Přidat skóre",
    "admin.scores.none": "Žádné skóre",
    "admin.scores.edit": "Upravit",
    "admin.scores.drawNotFilledTitle": "Los není obsazen",
    "admin.scores.archive": "Archivovat",
    "admin.scores.up": "Nahoru",
    "admin.scores.down": "Dolů",
    "admin.scores.restore": "Obnovit",
    "admin.scores.archived": "Archivovaná skóre",
    "admin.scores.archivedSaid": "Archivováno",
    "admin.scores.withdraw": "Neuznat",
    "admin.scores.unwithdraw": "Uznat",
    "admin.scores.withdrawnSaid": "Neuznáno",
    // Nad seznamem, pro odmítnutí bez vlastních slov.
    "admin.scores.otherwise": "Toto nešlo provést.",
    "admin.score.title": "Přidat skóre",
    "admin.score.add": "Přidat hru",
    "admin.score.winner": "Vítěz",
    "admin.score.winnerScore": "Skóre vítěze",
    "admin.score.loser": "Poražený",
    "admin.score.loserScore": "Skóre poraženého",
    "admin.score.beat": "porazil(a)",
    "admin.score.added":
      "Hra byla přidána. Vítěz: {winner}, poražený: {loser}.",
    "admin.score.otherwise": "Hru nešlo přidat.",
    "admin.score.playersUnread":
      "Hráče se nepodařilo načíst. Zavřete toto okno a otevřete ho znovu.",
    "admin.score.correctTitle": "Upravit skóre",
    "admin.score.save": "Uložit",
    "admin.score.notCorrected": "Skóre se nepodařilo opravit.",
    "Game.WinnerMissing": "Vyberte vítěze.",
    "Game.WinnerScoreMissing": "Zadejte skóre vítěze.",
    "Game.LoserMissing": "Vyberte poraženého.",
    "Game.LoserScoreMissing": "Zadejte skóre poraženého.",
    "Score.NoPoints": "Skóre začíná počtem bodů.",
    "Game.SamePlayer": "Nikdo nehraje sám proti sobě.",
    "Game.WinnerNotAhead":
      "Skóre vítěze musí být vyšší než skóre poraženého, nebo označené jako vítězné.",
    "Game.LoserMarked": "Skóre poraženého nelze označit jako vítězné.",
    "Game.ResultChanged":
      "Oprava ponechává výsledek: vyhraná hra zůstává vyhraná a remizovaná hra zůstává remizovaná.",
    "Competition.MatchDecided": "Jejich zápas je již rozhodnutý.",
    "Competition.DrawFull": "Hráče nelze přidat, protože pavouk je plný.",
    "Competition.DrawNotFilled":
      "Skóre nelze přidat, dokud není každé místo v pavouku obsazeno hráčem nebo bye.",
    "Competition.ByeOutsideKnockout": "Bye může mít jen pavouk.",
    "Competition.NotDrawnToMeet":
      "Tito hráči nejsou v pavouku aktuálně nalosováni proti sobě.",
    "Competition.WinnerHasPlayedOn":
      "Vítěz tohoto zápasu už odehrál svou další hru, a proto se kdo zápas vyhrál, nedá změnit.",
    "CompetitionPlayer.Withdrawn": "Hráč, který odstoupil, už nehraje.",
    "admin.players.add": "Přidat hráče",
    "admin.players.addPair": "Přidat pár",
    "admin.hover.players.addPair": "Vytvořit čtyřhru ze dvou hráčů turnaje",
    "admin.pair.title": "Přidat pár",
    "admin.pair.first": "První hráč",
    "admin.pair.second": "Druhý hráč",
    "admin.pair.choose": "Vyberte hráče",
    "admin.hover.dialog.pair.add": "Vytvořit pár ze dvou vybraných hráčů",
    "admin.pair.otherwise": "Tento pár nelze přidat.",
    "AddPair.SamePlayerTwice": "Vyberte dva různé hráče.",
    "admin.players.addMany": "Přidat více hráčů",
    "admin.players.none": "Žádní hráči",
    "admin.players.edit": "Upravit",
    "admin.players.archive": "Archivovat",
    "admin.players.restore": "Obnovit",
    "admin.players.up": "Nahoru",
    "admin.players.down": "Dolů",
    // Ptá se před archivací hráče, který je v soutěžích, protože archivace ho
    // z každé odebere a obnovení ho nevrátí.
    "admin.players.archiveTitle": "Archivovat hráče",
    "admin.players.archiveQuestion": "{name} bude odebrán z těchto soutěží:",
    "admin.players.archive.explanation":
      "Obnovením se do těchto soutěží nevrátí.",
    "admin.players.archived": "Archivovaní hráči",
    // Říká se čtečce obrazovky, protože čára přes jméno se nečte nahlas.
    "admin.players.archivedSaid": "Archivováno",
    // Dialog hráče.
    "admin.player.addTitle": "Přidat hráče",
    "admin.player.editTitle": "Upravit hráče",
    "admin.player.name": "Jméno",
    "admin.player.handicap": "Handicap",
    "admin.player.representing": "Zastupuje",
    "admin.player.worldRankingName": "Jméno hráče ve světovém žebříčku",
    // Vedle jména ve světovém žebříčku: zda ho žebříčky znají.
    "admin.player.worldRankingKnown": "Světové žebříčky toto jméno znají.",
    "admin.player.worldRankingQuestioned":
      "Světové žebříčky nemají hráče s tímto jménem. Může být špatně napsáno, nebo může být hráč v žebříčcích nový.",
    "admin.player.flag": "Vlajka",
    "admin.player.add": "Přidat",
    "admin.player.save": "Uložit",
    "admin.player.added": "Přidáno: {name}.",
    // Dialog hráčů (players.feature): několik hráčů zapsaných v jednom poli.
    "admin.players.addManyTitle": "Přidat více hráčů",
    // Odkaz v záhlaví dialogu na nápovědu, která ho vysvětluje.
    "admin.dialog.help": "Nápověda",
    "admin.players.many": "Hráči",
    "admin.players.line": "Řádek {line}: {words}",
    "AddPlayers.FieldsMissing": "Napište názvy polí na první řádek.",
    "AddPlayers.FirstRowNotFields":
      "První řádek musí obsahovat názvy polí, více informací viz {help}.",
    "AddPlayers.NameMissing": "Pole musí zahrnovat Name.",
    "AddPlayers.FieldNotAllowed":
      "Polem může být Name, Representing, Flag, Handicap nebo WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Pole lze pojmenovat jen jednou.",
    "AddPlayers.PlayersMissing":
      "Na každý řádek po prvním napište jednoho hráče.",
    "AddPlayers.TooManyPlayers":
      "Seznam může mít nejvýše 500 hráčů. Zbytek přidejte v jiném seznamu.",
    "AddPlayers.ValuesMismatched":
      "Každý hráč potřebuje hodnotu, nebo nic, pro každé pole pojmenované na prvním řádku.",
    // Nad poli, pro odmítnutí bez vlastních slov.
    "admin.player.otherwise": "Tohoto hráče nelze uložit tak, jak je.",
    "Tournament.PlayerNameTaken": "Jiný hráč v tomto turnaji už má toto jméno.",
    "TournamentPlayer.NoSuchFlag": "Vyberte jednu z existujících vlajek.",
    "TournamentPlayer.HandicapMalformed":
      "Napište handicap jako číslo. Například: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Hráč se nesmí jmenovat Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Jméno musí obsahovat písmeno nebo číslici.",
    // Dialog nad dialogem hráče, když je hráč pojmenován jako bye.
    "admin.player.byesTitle": "Bye se nepřidávají",
    "admin.player.byes":
      "Bye není jedním z hráčů turnaje. Pavouk nabízí Bye vždy, když se přidávají jeho hráči, tolikrát, kolikrát jeho los potřebuje.",
    // Turnaj hraný týmy (view.feature): karty Týmy a Testy, stránka týmu a
    // jejich dialogy.
    "admin.view.teams": "Týmy",
    "admin.view.tests": "Testy",
    "admin.teams.add": "Přidat tým",
    "admin.teams.none": "Žádné týmy",
    "admin.teams.edit": "Upravit",
    "admin.teams.view": "Zobrazit",
    "admin.teams.archive": "Archivovat",
    "admin.teams.restore": "Obnovit",
    "admin.teams.up": "Nahoru",
    "admin.teams.down": "Dolů",
    "admin.teams.archived": "Archivované týmy",
    "admin.teams.archivedSaid": "Archivováno",
    "admin.team.addTitle": "Přidat tým",
    "admin.team.editTitle": "Upravit tým",
    "admin.team.name": "Název",
    "admin.team.shortName": "Zkrácený název",
    "admin.team.shortName.explanation":
      "Jak se jmenují testy týmu, například AUS v ENG.",
    "admin.team.flag": "Vlajka",
    "admin.team.add": "Přidat",
    "admin.team.save": "Uložit",
    "admin.team.added": "Přidáno: {name}.",
    // Nad poli, pro odmítnutí bez vlastních slov.
    "admin.team.otherwise": "Tento tým nelze uložit tak, jak je.",
    "admin.teamView.otherwise": "Tento tým odsud nelze zobrazit.",
    "admin.teamView.players": "Hráči",
    "TeamName.Missing": "Napište, jak se tým jmenuje.",
    "TeamName.TooLong": "Tento název je příliš dlouhý.",
    "admin.notes.add": "Přidat poznámku",
    "admin.notes.none": "Žádné poznámky",
    "admin.notes.edit": "Upravit",
    "admin.notes.delete": "Smazat",
    // Ptá se před smazáním poznámky, protože smazaná poznámka je pryč nadobro.
    "admin.notes.deleteTitle": "Smazat poznámku",
    "admin.notes.deleteQuestion": "Smazat poznámku „{title}“?",
    "admin.notes.delete.explanation":
      "Smazaná poznámka je pryč nadobro a nelze ji vrátit.",
    // Nad seznamem, pro odmítnutí bez vlastních slov.
    "admin.notes.otherwise": "Toto nešlo provést.",
    // Dialog poznámky, karty jejího popisu a nástrojová lišta nad jeho polem.
    "admin.note.addTitle": "Přidat poznámku",
    "admin.note.editTitle": "Upravit poznámku",
    "admin.note.title": "Název",
    "admin.note.description": "Popis",
    "admin.note.write": "Psát",
    "admin.note.preview": "Náhled",
    "admin.note.toolbar": "Formátování",
    "admin.note.tool.heading": "Nadpis",
    "admin.note.tool.bold": "Tučně",
    "admin.note.tool.italic": "Kurzívou",
    "admin.note.tool.quote": "Citace",
    "admin.note.tool.code": "Kód",
    "admin.note.tool.link": "Odkaz",
    "admin.note.tool.numberedList": "Číslovaný seznam",
    "admin.note.tool.bulletedList": "Odrážkový seznam",
    "admin.note.tool.taskList": "Seznam úkolů",
    "admin.note.add": "Přidat",
    "admin.note.save": "Uložit",
    // Nad poli, pro odmítnutí bez vlastních slov.
    "admin.note.otherwise": "Tuto poznámku nelze uložit tak, jak je.",
    "ManagerNoteTitle.Missing": "Dejte poznámce název.",
    "ManagerNoteTitle.TooLong": "Tento název je příliš dlouhý.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Název musí obsahovat písmeno nebo číslici.",
    "ManagerNoteDescription.TooLong": "Tento popis je příliš dlouhý.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Tato poznámka už tu není. Mohl ji smazat jiný organizátor.",
    "EditManagerNote.NoSuchManagerNote":
      "Tato poznámka už tu není. Mohl ji smazat jiný organizátor.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Tato poznámka už tu není. Mohl ji smazat jiný organizátor.",
    "ManagerNote.Deleted":
      "Tato poznámka byla smazána. Mohl ji smazat jiný organizátor.",
    "CommentaryTitle.Missing": "Dejte komentáři název.",
    "CommentaryTitle.TooLong": "Tento název je příliš dlouhý.",
    "CommentaryTitle.NoLetterOrDigit":
      "Název musí obsahovat písmeno nebo číslici.",
    "Commentary.TitleTaken": "Jiný komentář už má tento název.",
    "CommentText.Missing": "Napište do příspěvku něco.",
    "CommentText.TooLong": "Tento příspěvek je příliš dlouhý.",
    "TeamShortName.Missing": "Dejte týmu zkrácený název.",
    "TeamShortName.TooLong": "Zkrácený název může mít nejvýše 10 znaků.",
    "TeamShortName.NoLetterOrDigit":
      "Zkrácený název musí obsahovat písmeno nebo číslici.",
    "Team.ShortNameLongerThanName":
      "Zkrácený název nemůže být delší než název týmu.",
    "Team.NoSuchFlag": "Vyberte jednu z existujících vlajek.",
    "Team.Archived": "Tento tým je archivován a nejprve se obnoví.",
    "Team.InATest": "Tento tým hraje v testu a nelze ho archivovat.",
    "Team.PlayerNameTaken": "Jiný hráč v tomto týmu už má toto jméno.",
    "TeamPlayer.NamedBye": "Hráč se nesmí jmenovat Bye.",
    "TeamPlayer.Archived": "Tento hráč je archivován a nejprve se obnoví.",
    "TeamPlayer.HasGames": "Tento hráč už hrál a nelze ho archivovat.",
    "Tournament.TeamNameTaken": "Jiný tým v tomto turnaji už má tento název.",
    "Tournament.TeamShortNameTaken":
      "Jiný tým v tomto turnaji už má tento zkrácený název.",
    "Tournament.NoSuchTeam": "Tento turnaj nemá na této adrese žádný tým.",
    "Tournament.TeamArchived":
      "Tento tým je archivován a lze ho obnovit jen z karty Týmy.",
    "admin.tests.add": "Přidat test",
    "admin.tests.none": "Žádné testy",
    "admin.tests.edit": "Upravit",
    "admin.tests.view": "Zobrazit",
    "admin.tests.archive": "Archivovat",
    "admin.tests.restore": "Obnovit",
    "admin.tests.up": "Nahoru",
    "admin.tests.down": "Dolů",
    "admin.tests.archived": "Archivované testy",
    "admin.tests.twoTeamsNeeded":
      "Test se hraje mezi dvěma týmy, a proto jsou nejprve potřeba dva týmy.",
    "admin.tests.toTeams": "Přejít na Týmy",
    "admin.tests.matches.one": "Zápasy: {count}",
    "admin.tests.matches.other": "Zápasy: {count}",
    "admin.tests.bestOf": "her nejvýše: {games}",
    // Vedle seznamu, pro odmítnutí bez vlastních slov.
    "admin.tests.otherwise": "Toto nešlo provést.",
    "admin.test.addTitle": "Přidat test",
    "admin.test.editTitle": "Upravit test",
    "admin.test.firstTeam": "Tým A",
    "admin.test.secondTeam": "Tým B",
    "admin.test.versus": "v",
    "admin.test.starts": "Začátek",
    "admin.test.finishes": "Konec",
    "admin.test.expectedMatches": "Očekávané zápasy",
    "admin.test.bestOf": "Nejlepší z",
    "admin.test.group": "Skupina",
    "admin.test.add": "Přidat",
    "admin.test.save": "Uložit",
    "admin.test.added": "Přidáno: {name}.",
    "admin.test.otherwise": "Tento test nelze uložit tak, jak je.",
    "admin.testView.otherwise": "Tento test odsud nelze zobrazit.",
    "AddTest.FirstTeamMissing": "Vyberte první tým.",
    "AddTest.SecondTeamMissing": "Vyberte druhý tým.",
    "UpdateTest.FirstTeamMissing": "Vyberte první tým.",
    "UpdateTest.SecondTeamMissing": "Vyberte druhý tým.",
    "ExpectedMatches.NotWhole": "Zadejte celé číslo zápasů.",
    "ExpectedMatches.TooSmall": "U testu se musí očekávat alespoň 1 zápas.",
    "TestGroup.TooLong": "Tato skupina je příliš dlouhá.",
    "Tournament.TestAgainstItself": "Tým nehraje test sám proti sobě.",
    "Tournament.FormatHasNoGroups":
      "Test v tomto formátu se do skupiny neřadí.",
    "Tournament.TestFinishesBeforeStarts":
      "Test nemůže skončit dříve, než začne.",
    "Tournament.TestStartsBeforeTournament":
      "Test nemůže začít dříve než jeho turnaj.",
    "Tournament.TestFinishesAfterTournament":
      "Test nemůže skončit později než jeho turnaj.",
    "Tournament.TestHasGamesInUse":
      "Tento test má hry, a proto ho nelze archivovat, dokud nejsou archivovány i ty.",
    "Tournament.TestHasGames":
      "Tento test už má hry, a proto už nelze měnit jeho týmy.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Více zápasů, než kolik je zadáno, už začalo.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dva hráči už odehráli více her, než kolik je zadáno.",
    "Competition.ExpectedMatchesReached":
      "Tento test už začal tolik zápasů, kolik se u něj očekává.",
    "Competition.SameTeam": "Dva hráči stejného týmu spolu nehrají.",
    "AddManager.NoSuchAccount":
      "K této adrese není účet, z něhož by šlo udělat organizátora.",
    "admin.scorers.add": "Přidat zapisovatele",
    "admin.scorers.none": "Žádní zapisovatelé",
    "admin.scorers.removeTitle": "Odebrat zapisovatele",
    "admin.scorers.removeExplanation":
      "{name} už nebude moci zadávat skóre tohoto turnaje.",
    // Pod polem, pro odmítnutí bez vlastních slov.
    "admin.scorers.otherwise": "Z této adresy nelze udělat zapisovatele.",
    "AddScorer.NoSuchAccount":
      "K této adrese není účet, z něhož by šlo udělat zapisovatele.",
    // Přidělování, odebírání a výpis rolí, což může dělat jen administrátor.
    "Account.NotAnAdministrator": "To může udělat jen administrátor.",
    "AddRole.NoSuchAccount":
      "K této adrese není účet, kterému by šlo roli přidělit.",
    "AddRole.NoSuchRole": "Taková role není.",
    "RemoveRole.NoSuchAccount": "Takový účet není.",
    "RemoveRole.NoSuchRole": "Taková role není.",
    "RemoveRole.Yourself": "Nemůžete si sami odebrat roli administrátora.",
    "AccountsWithRole.NoSuchRole": "Taková role není.",
    "Tournament.AlreadyAManager":
      "Tento účet už turnaj organizuje a může dělat všechno, co zapisovatel.",

    // Odmítnutí turnaje, označená svými kódy, jako každé porušené pravidlo.
    // Pod polem, o které jde, nebo místo formuláře, když je odmítnuta sama
    // stránka.
    "TournamentName.Missing": "Napište, jak se turnaj jmenuje.",
    "TournamentName.TooShort": "Tento název je příliš krátký.",
    "TournamentName.TooLong": "Tento název je příliš dlouhý.",
    "TournamentName.AllLowerCase": "Název nesmí být celý malými písmeny.",
    "TournamentName.AllCapitals": "Název nesmí být celý velkými písmeny.",
    "TournamentName.NoLetterOrDigit":
      "Název musí obsahovat písmeno nebo číslici.",
    "ReadOnlyDate.Unreadable": "Zadejte den.",
    "Tournament.FinishesBeforeStarts":
      "Turnaj nemůže skončit dříve, než začne.",
    "Tournament.StartsAfterNextYear": "Turnaj nemůže začít po příštím roce.",
    "Tournament.FinishesAfterNextYear":
      "Turnaj nemůže skončit po příštím roce.",
    "CreateTournament.NoSuchCountry": "Vyberte zemi.",
    "TournamentSubtitle.TooLong": "Podtitul nesmí být delší než 2000 znaků.",
    "Tournament.NotAManager": "Jen organizátor tohoto turnaje ho může změnit.",
    "Tournament.NotAManagerOrScorer":
      "Jen organizátor nebo zapisovatel tohoto turnaje ho může vidět.",
    "Tournament.Archived":
      "Tento turnaj je archivován a před změnou se obnoví.",
    "UpdateTournament.NoSuchTournament": "Na této adrese není žádný turnaj.",

    // V čem se turnaj hraje a kde, podle kódu, jak je API nabízí formuláři
    // adminu.
    "sport.ac": "Asociační kroket",
    "sport.gc": "Golfový kroket",
    "sport.a6w": "Americký kroket (6 branek)",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standardní",
    "format.teams": "Týmy",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship":
      "Mistrovství světa týmů v golfovém kroketu",
    "country.ad": "Andorra",
    "country.ae": "Spojené arabské emiráty",
    "country.af": "Afghánistán",
    "country.ag": "Antigua a Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albánie",
    "country.am": "Arménie",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Americká Samoa",
    "country.at": "Rakousko",
    "country.au": "Austrálie",
    "country.aw": "Aruba",
    "country.ax": "Ålandy",
    "country.az": "Ázerbájdžán",
    "country.ba": "Bosna a Hercegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladéš",
    "country.be": "Belgie",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulharsko",
    "country.bh": "Bahrajn",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermudy",
    "country.bn": "Brunej",
    "country.bo": "Bolívie",
    "country.br": "Brazílie",
    "country.bs": "Bahamy",
    "country.bt": "Bhútán",
    "country.bv": "Bouvetův ostrov",
    "country.bw": "Botswana",
    "country.by": "Bělorusko",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalánsko",
    "country.cc": "Kokosové ostrovy",
    "country.cd": "Demokratická republika Kongo",
    "country.cf": "Středoafrická republika",
    "country.cg": "Republika Kongo",
    "country.ch": "Švýcarsko",
    "country.ci": "Pobřeží slonoviny",
    "country.ck": "Cookovy ostrovy",
    "country.cl": "Chile",
    "country.cm": "Kamerun",
    "country.cn": "Čína",
    "country.co": "Kolumbie",
    "country.cr": "Kostarika",
    "country.cu": "Kuba",
    "country.cv": "Kapverdy",
    "country.cx": "Vánoční ostrov",
    "country.cy": "Kypr",
    "country.cz": "Česko",
    "country.de": "Německo",
    "country.dj": "Džibutsko",
    "country.dk": "Dánsko",
    "country.dm": "Dominika",
    "country.do": "Dominikánská republika",
    "country.dz": "Alžírsko",
    "country.ec": "Ekvádor",
    "country.ee": "Estonsko",
    "country.eg": "Egypt",
    "country.eh": "Západní Sahara",
    "country.england": "Anglie",
    "country.er": "Eritrea",
    "country.es": "Španělsko",
    "country.et": "Etiopie",
    "country.fi": "Finsko",
    "country.fj": "Fidži",
    "country.fk": "Falklandy",
    "country.fm": "Mikronésie",
    "country.fo": "Faerské ostrovy",
    "country.fr": "Francie",
    "country.ga": "Gabon",
    "country.gb": "Spojené království",
    "country.gd": "Grenada",
    "country.ge": "Gruzie",
    "country.gf": "Francouzská Guyana",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Grónsko",
    "country.gm": "Gambie",
    "country.gn": "Guinea",
    "country.gp": "Guadeloupe",
    "country.gq": "Rovníková Guinea",
    "country.gr": "Řecko",
    "country.gs": "Jižní Georgie a Jižní Sandwichovy ostrovy",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hongkong",
    "country.hm": "Heardův ostrov a McDonaldovy ostrovy",
    "country.hn": "Honduras",
    "country.hr": "Chorvatsko",
    "country.ht": "Haiti",
    "country.hu": "Maďarsko",
    "country.id": "Indonésie",
    "country.ie": "Irsko",
    "country.il": "Izrael",
    "country.im": "Ostrov Man",
    "country.in": "Indie",
    "country.io": "Britské indickooceánské území",
    "country.iq": "Irák",
    "country.ir": "Írán",
    "country.is": "Island",
    "country.it": "Itálie",
    "country.je": "Jersey",
    "country.jm": "Jamajka",
    "country.jo": "Jordánsko",
    "country.jp": "Japonsko",
    "country.ke": "Keňa",
    "country.kg": "Kyrgyzstán",
    "country.kh": "Kambodža",
    "country.ki": "Kiribati",
    "country.km": "Komory",
    "country.kn": "Svatý Kryštof a Nevis",
    "country.kp": "Severní Korea",
    "country.kr": "Jižní Korea",
    "country.kw": "Kuvajt",
    "country.ky": "Kajmanské ostrovy",
    "country.kz": "Kazachstán",
    "country.la": "Laos",
    "country.lb": "Libanon",
    "country.lc": "Svatá Lucie",
    "country.li": "Lichtenštejnsko",
    "country.lk": "Srí Lanka",
    "country.lr": "Libérie",
    "country.ls": "Lesotho",
    "country.lt": "Litva",
    "country.lu": "Lucembursko",
    "country.lv": "Lotyšsko",
    "country.ly": "Libye",
    "country.ma": "Maroko",
    "country.mc": "Monako",
    "country.md": "Moldavsko",
    "country.me": "Černá Hora",
    "country.mg": "Madagaskar",
    "country.mh": "Marshallovy ostrovy",
    "country.mk": "Severní Makedonie",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolsko",
    "country.mo": "Macao",
    "country.mp": "Severní Mariany",
    "country.mq": "Martinik",
    "country.mr": "Mauritánie",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauricius",
    "country.mv": "Maledivy",
    "country.mw": "Malawi",
    "country.mx": "Mexiko",
    "country.my": "Malajsie",
    "country.mz": "Mosambik",
    "country.na": "Namibie",
    "country.nc": "Nová Kaledonie",
    "country.ne": "Niger",
    "country.nf": "Norfolk",
    "country.ng": "Nigérie",
    "country.ni": "Nikaragua",
    "country.nl": "Nizozemsko",
    "country.no": "Norsko",
    "country.np": "Nepál",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nový Zéland",
    "country.om": "Omán",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Francouzská Polynésie",
    "country.pg": "Papua-Nová Guinea",
    "country.ph": "Filipíny",
    "country.pk": "Pákistán",
    "country.pl": "Polsko",
    "country.pm": "Saint-Pierre a Miquelon",
    "country.pn": "Pitcairnovy ostrovy",
    "country.pr": "Portoriko",
    "country.ps": "Palestina",
    "country.pt": "Portugalsko",
    "country.pw": "Palau",
    "country.py": "Paraguay",
    "country.qa": "Katar",
    "country.re": "Réunion",
    "country.ro": "Rumunsko",
    "country.rs": "Srbsko",
    "country.ru": "Rusko",
    "country.rw": "Rwanda",
    "country.sa": "Saúdská Arábie",
    "country.sb": "Šalamounovy ostrovy",
    "country.sc": "Seychely",
    "country.scotland": "Skotsko",
    "country.sd": "Súdán",
    "country.se": "Švédsko",
    "country.sg": "Singapur",
    "country.sh": "Svatá Helena",
    "country.si": "Slovinsko",
    "country.sj": "Svalbard a Jan Mayen",
    "country.sk": "Slovensko",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somálsko",
    "country.sr": "Surinam",
    "country.st": "Svatý Tomáš a Princův ostrov",
    "country.sv": "Salvador",
    "country.sy": "Sýrie",
    "country.sz": "Svazijsko (Eswatini)",
    "country.tc": "Turks a Caicos",
    "country.td": "Čad",
    "country.tf": "Francouzská jižní území",
    "country.tg": "Togo",
    "country.th": "Thajsko",
    "country.tj": "Tádžikistán",
    "country.tk": "Tokelau",
    "country.tl": "Východní Timor",
    "country.tm": "Turkmenistán",
    "country.tn": "Tunisko",
    "country.to": "Tonga",
    "country.tr": "Turecko",
    "country.tt": "Trinidad a Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Tchaj-wan",
    "country.tz": "Tanzanie",
    "country.ua": "Ukrajina",
    "country.ug": "Uganda",
    "country.um": "Menší odlehlé ostrovy USA",
    "country.us": "Spojené státy",
    "country.uy": "Uruguay",
    "country.uz": "Uzbekistán",
    "country.va": "Vatikán",
    "country.vc": "Svatý Vincenc a Grenadiny",
    "country.ve": "Venezuela",
    "country.vg": "Britské Panenské ostrovy",
    "country.vi": "Americké Panenské ostrovy",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Wales",
    "country.wf": "Wallis a Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Mayotte",
    "country.za": "Jižní Afrika",
    "country.zm": "Zambie",
    "country.zw": "Zimbabwe",

    // E-mail jsou dva záznamy: předmět, který je text, a tělo, které je celé
    // jeho značkování. Je to jediné místo, kde katalog drží značkování, a drží
    // ho proto, že e-mail se píše a překládá jako kus textu, a ne jako seznam
    // frází, které někdo jinde seřadí: kdo ho píše, vidí to, co uvidí jeho
    // čtenář. Escapuje se jen to, co se do e-mailu doplňuje, takže z ničeho,
    // co se mu dá, se nemůže stát značkování; značkování zde je vlastní
    // značkování webu. `{link}` je odkaz, který e-mail nese, `{site}` adresa
    // webu, pro odkaz na jednu z jeho vlastních stránek,
    // `{buttonBackgroundColour}` a `{buttonTextColour}` čím je tlačítko
    // vybarveno, `{emailFromName}` jméno, ze kterého se e-maily webu posílají
    // a kterým je každý podepsán, a `{siteName}` jak se web jmenuje, což je
    // totéž jméno, kterým ho nazývají jeho stránky. Poslední čtyři jsou
    // vlastní webu a doplňuje je ten, kdo e-mail píše, nikdy to, co ho zařadilo
    // do fronty. Tlačítko se vybarvuje tam, kde stojí, protože poštovní program
    // nečte žádnou šablonu stylů. Žádný e-mail neoslovuje čtenáře jménem, aby
    // se do fronty nemuselo dávat nic o člověku kromě adresy, na kterou e-mail
    // jde.

    "Email.ConfirmAddress.subject":
      "Potvrďte svou e-mailovou adresu pro {siteName}",
    "Email.ConfirmAddress.body": `
<p>Dobrý den,</p>

<p>
    děkujeme, že jste si vytvořili účet na <strong>{siteName}</strong>.<br />
    Než začnete svůj účet používat, potvrďte prosím svou e-mailovou adresu 
    kliknutím na tlačítko níže:
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
        Potvrdit mou e-mailovou adresu
    </a>
</p>

<p>
    Pokud tlačítko nefunguje, můžete svou e-mailovou adresu potvrdit také otevřením tohoto odkazu v prohlížeči:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Pokud jste tento účet nevytvořili vy, můžete tento e-mail bez obav ignorovat.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Nový odkaz pro potvrzení vaší e-mailové adresy pro {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Dobrý den,</p>

<p>
    nedávno jste požádali o nový e-mail pro potvrzení své e-mailové adresy pro <strong>{siteName}</strong>.<br />
    Potvrďte prosím svou e-mailovou adresu kliknutím na tlačítko níže:
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
        Potvrdit mou e-mailovou adresu
    </a>
</p>

<p>
    Pokud tlačítko nefunguje, můžete svou e-mailovou adresu potvrdit také otevřením tohoto odkazu v prohlížeči:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Po potvrzení budete moci svůj účet dál používat bez přerušení.
</p>

<p>
    Pokud jste o tento e-mail nežádali vy, můžete ho bez obav ignorovat.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Někdo se zkusil zaregistrovat s vaší e-mailovou adresou",
    "Email.AlreadyRegistered.body": `
<p>Dobrý den,</p>

<p>
    někdo se zkusil zaregistrovat na <strong>{siteName}</strong> s touto
    e-mailovou adresou, která už účet má. Na vašem účtu se nic
    nezměnilo.<br />
    Pokud jste to byli vy, účet už máte a můžete se k němu přihlásit:
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
        Přihlásit se
    </a>
</p>

<p>
    Pokud jste zapomněli heslo, můžete ho obnovit zde:
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
        Zapomenuté heslo
    </a>
</p>

<p>
    Pokud jste to nebyli vy, nemusíte dělat nic. Nikdo nezískal cestu do
    vašeho účtu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Potvrďte přesun vašeho účtu {siteName} na tuto adresu",
    "Email.ConfirmNewEmailAddress.body": `
<p>Dobrý den,</p>

<p>
    někdo přihlášený k účtu <strong>{siteName}</strong> požádal o jeho přesun
    na tuto e-mailovou adresu. Pokud jste to byli vy, potvrďte to zde,
    přihlášeni k tomuto účtu. Odkaz platí 24 hodin.
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
        Přesunout můj účet
    </a>
</p>

<p>
    Nebo zkopírujte tuto adresu do prohlížeče:<br />
    {link}
</p>

<p>
    Pokud jste to nebyli vy, nemusíte dělat nic. Žádný účet se sem nepřesune.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Někdo požádal o přesun účtu na vaši e-mailovou adresu",
    "Email.AlreadyHasAnAccount.body": `
<p>Dobrý den,</p>

<p>
    někdo přihlášený k účtu <strong>{siteName}</strong> požádal o jeho přesun
    na tuto e-mailovou adresu, která už má vlastní účet. Nic se nepřesunulo
    a na vašem účtu se nic nezměnilo.
</p>

<p>
    Pokud jste to byli vy, na této adrese už účet máte a můžete se k němu
    přihlásit.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Váš účet {siteName} se přesunul",
    "Email.EmailAddressChanged.body": `
<p>Dobrý den,</p>

<p>
    váš účet <strong>{siteName}</strong> byl právě přesunut na jinou e-mailovou
    adresu, {emailAddress}, a od nynějška se k němu přihlašuje touto adresou.
</p>

<p>
    Pokud jste to nebyli vy, váš účet má někdo jiný. Odpovězte na tento e-mail
    a řekněte nám to.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Vaše heslo k {siteName} bylo změněno",
    "Email.PasswordChanged.body": `
<p>Dobrý den,</p>

<p>
    heslo k vašemu účtu <strong>{siteName}</strong> bylo právě
    změněno a každý další prohlížeč, který byl k němu přihlášen, byl odhlášen.<br />
    Pokud jste to byli vy, nemusíte dělat nic.
</p>

<p>
    Pokud jste to nebyli vy, vaše heslo má někdo jiný. Nastavte si zde nové a
    on bude odhlášen:
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
        Zapomenuté heslo
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Nastavte nové heslo pro {siteName}",
    "Email.SetNewPassword.body": `
<p>Dobrý den,</p>

<p>
    nedávno jste požádali o obnovení hesla pro <strong>{siteName}</strong>.<br />
    Své heslo můžete obnovit kliknutím na tlačítko níže:
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
        Obnovit heslo
    </a>
</p>

<p>
    Pokud tlačítko nefunguje, můžete své heslo obnovit také otevřením tohoto odkazu v prohlížeči:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Pokud jste o obnovení hesla nežádali, můžete tento e-mail bez obav ignorovat.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Nastavte heslo pro {siteName}",
    "Email.SetPassword.body": `
<p>Dobrý den,</p>

<p>
    váš účet <strong>{siteName}</strong> nemá heslo: přihlašujete se přes Google.<br />
    Požádali jste o jeho nastavení, abyste se mohli přihlašovat také e-mailovou adresou a heslem.
    Nastavit ho můžete kliknutím na tlačítko níže:
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
        Nastavit heslo
    </a>
</p>

<p>
    Pokud tlačítko nefunguje, můžete své heslo nastavit také otevřením tohoto odkazu v prohlížeči:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Odkaz platí hodinu. Pokud jste o nastavení hesla nežádali, můžete tento e-mail bez obav ignorovat.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Pro tuto e-mailovou adresu není žádný účet na {siteName}",
    "Email.RegisterInstead.body": `
<p>Dobrý den,</p>

<p>
    byl podán požadavek na obnovení hesla pro e-mailovou adresu, která 
    není spojena s žádným účtem na <strong>{siteName}</strong>.
</p>

<p>
    Pokud chcete naši službu používat, můžete si vytvořit nový účet na adrese:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Pokud jste tento požadavek nepodali vy, můžete tento e-mail bez obav ignorovat.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Potvrďte, že se má váš účet {siteName} zapomenout",
    "Email.ConfirmForgetting.body": `
<p>Dobrý den,</p>

<p>
    požádali jste, aby se váš účet <strong>{siteName}</strong>
    zapomněl.<br />
    Přejděte přes tlačítko níže, kde uvidíte, co to znamená, a řeknete
    s určitostí, že to chcete:
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
        Zapomenout můj účet
    </a>
</p>

<p>
    Pokud tlačítko nefunguje, můžete tento odkaz otevřít také v prohlížeči:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Po zapomenutí už nikdo nikdy nepřečte vaše jméno ani e-mailovou adresu
    a k vašemu účtu se nebude možné přihlásit. Nelze to vrátit zpět.
</p>

<p>
    Odkaz funguje jednou, do 15 minut od vaší žádosti, a jen dokud jste
    přihlášeni k tomuto účtu. Poté požádejte znovu ze svého účtu.
</p>

<p>
    Pokud jste o to nežádali, nestane se nic, dokud se odkaz neotevře.
    O zapomenutí ale požádal někdo přihlášený k vašemu účtu, a proto si na
    stránce zapomenutého hesla nastavte nové heslo, abyste měli jistotu,
    že se už nemůže přihlásit.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Registrace jsou pozastaveny: {service} se nedá zastihnout",
    "Email.RegistrationsSuspended.body": `
<p>Dobrý den,</p>

<p>
    {siteName} nezastihl službu {service} v {when}. Dokud neodpoví,
    čtenářům, kteří ji potřebují, k registraci nebo k nastavení nového hesla,
    se říká, aby to zkusili později.
</p>

<p>
    Nic není třeba zvedat. Každý pokus se službu {service} ptá znovu
    a stránky znovu fungují, jakmile odpoví.
</p>

<p>
    Dokud je {service} nedostupná, dostanete o tom e-mail nejvýše jednou
    za hodinu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} se nedostal ke své databázi",
    "Email.DatabaseUnreachable.body": `
<p>Dobrý den,</p>

<p>
    {siteName} nezastihl svou databázi v {when}. Dokud neodpoví, každá stránka, která ji potřebuje, říká čtenářům, že web je nedostupný a ať to zkusí později.
</p>

<p>
    Nic není třeba zvedat. Každý požadavek žádá o spojení znovu a web znovu funguje, jakmile databáze odpoví.
</p>

<p>
    Dokud je databáze nedostupná, dostanete o tom e-mail nejvýše jednou za {minutes} minut.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject":
      "{siteName} selhal při vyřizování požadavku",
    "Email.UnhandledError.body": `
<p>Dobrý den,</p>

<p>
    {siteName} selhal v {when} při požadavku na {asked}. Čtenáři bylo ukázáno referenční číslo {reference} a protokol má pod ním příčinu.
</p>

<p>
    Rozbitý web obvykle selhává při každém požadavku, a proto dostanete e-mail o selháních nejvýše 4krát za hodinu. Ty další jsou přesto v protokolu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
