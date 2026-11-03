// Latviešu valoda. Lasītājam vēršamies ar "jūs" (pieklājīgā forma, kā
// programmatūrā parasti). Izvēlņu, pogu un virsrakstu tekstos ar lielo burtu
// rakstām tikai pirmo vārdu ("Mainīt e-pasta adresi", nevis "Mainīt E-pasta
// Adresi"). Par adresi sakām "e-pasta adrese", par pašu vēstuli "e-pasts".
// Vārdi, par kuriem vienojāmies: turnīrs, sacensības, grupa (block),
// izslēgšanas turnīrs (knockout), Šveices sistēma (Swiss), vārtiņi (hoops),
// mačs (match), partija (game), arhivēt/atjaunot, noņemt (remove) un dzēst
// (delete). Daudzskaitļa formas ar skaitli ("1 stunda", "5 stundas") šeit
// apejam ar saīsinājumiem vai ar vārdu pirms skaitļa ("zaudētāju: 3"), jo
// latviešu valodā locījums mainās ar skaitli. "Bye" paliek angliski, jo
// vietne pati atpazīst šo vārdu.
import type { Language } from "../common/language.js";

export const latvian: Language = {
  tag: "lv",
  name: "Latviešu",
  words: {
    // Vietnes pašas joslas. Vietnes nosaukums nav neviena valodas vārds, tāpēc
    // tas tiek ielikts uzaicinājumā, kas to min.
    "site.skipToContent": "Pāriet uz saturu",
    "navigation.menu": "Izvēlne",
    "navigation.label": "Galvenā izvēlne",
    "navigation.home": "Sākums",
    "navigation.help": "Palīdzība",
    "navigation.admin": "Administrēšana",
    "sections.label": "Sadaļas",
    "theme.label": "Motīvs",
    "theme.light": "Gaišs",
    "theme.dark": "Tumšs",
    "theme.system": "Sistēmas",
    "footer.donate": "Ziedot",
    "footer.plea":
      "Vai jums patīk {siteName}? Lūdzu, ziedojiet, lai palīdzētu to turpināt attīstīt.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privātums",
    "footer.termsOfUse": "Lietošanas noteikumi",
    "footer.reportBug": "Ziņot par kļūdu",
    "beta.banner":
      "Šī ir beta vietne. Dati jebkurā brīdī var tikt atiestatīti.",
    "privacy.contact":
      "Jautājumi par šo lapu vai par to, kas tiek glabāts par jums: {emailAddress}",
    // Rūtiņa, kurā lasītājs atzīmē, ka piekrīt lietošanas noteikumiem tiem, kas
    // raksta. Saites vārdi tiek meklēti rūtiņas vārdos un pārvērsti par saiti,
    // tāpēc tiem jābūt uzrakstītiem tieši tāpat.
    "termsOfUse.agree": "Es piekrītu lietošanas noteikumiem",
    "termsOfUse.link": "lietošanas noteikumiem",
    // Zem noteikumiem tiem, kas raksta, tāpat kā privacy.contact ir zem
    // privātuma paziņojuma.
    "termsOfUse.report":
      "Ziņot par uzrakstīto vai jautāt par noteikumiem: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Atzīmējiet rūtiņu, lai piekristu lietošanas noteikumiem.",
    // Tiek rādīts katrā izmēģinājuma vietnes lapā, zem vietnes joslas.
    "tryWebsite.banner":
      "Šeit varat droši iemācīties lietot {siteName}. Viss, kas šeit tiek ievadīts, jebkurā brīdī var tikt noņemts.",

    "language.label": "Valoda",
    "language.choose": "Mainīt",

    // Paziņojums, kas lasītājam saka, ka ir kaut kas jauns, ko lasīt.
    "whatsNew.public.message": "Ir kaut kas jauns, ko lasīt.",
    "whatsNew.admin.message": "Ir kaut kas jauns tiem, kas vada turnīrus.",
    "whatsNew.view": "Skatīt, kas jauns",
    "whatsNew.later": "Atgādināt nākamreiz",
    "whatsNew.never": "Nekad vairs nerādīt šo paziņojumu",

    "form.otherwise":
      "Kaut kas šeit nav kārtībā. Pārbaudiet ievadīto un mēģiniet vēlreiz.",

    // Konta izvēlne galvenē: ko cilvēks pārstāv un katrs tās vienums.
    "account.menu": "Konts",
    "account.register": "Reģistrēties",
    "account.signIn": "Pierakstīties",
    "account.forgotPassword": "Aizmirsu paroli",
    "account.signOut": "Izrakstīties",
    "account.profile": "Profils",
    "account.changePassword": "Mainīt paroli",
    "account.changeEmailAddress": "Mainīt e-pasta adresi",
    "account.changeName": "Mainīt vārdu",
    "account.setPassword": "Iestatīt paroli",
    "account.forgetAccount": "Aizmirst kontu",

    "register.title": "Reģistrēties",
    "register.emailAddress": "E-pasta adrese",
    "register.submit": "Reģistrēties",
    "register.withGoogle": "Reģistrēties ar Google",
    "register.or": "vai",
    // Tiek teikts virs veidlapas, kad Google lasītāju atsūtījis atpakaļ, bet
    // neielaidis, katrs pēc ceļa atpakaļ doto koda. Gan reģistrēšanās, gan
    // pierakstīšanās lapa tos saka, tāpēc tie saka "izmantojiet savu e-pasta
    // adresi", nenosaucot, ko katra veidlapa ar to dara.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google nav apstiprinājis, ka šī e-pasta adrese ir jūsu, tāpēc to šeit nevar izmantot ar Google. Izmantojiet savu e-pasta adresi zemāk.",
    "SignInWithGoogle.LinkedToAnother":
      "Šai e-pasta adresei jau ir konts, kas saistīts ar citu Google kontu. Piesakieties ar to Google kontu vai ar savu e-pasta adresi un paroli.",
    "SignInWithGoogle.NameMissing":
      "Google mums nepateica jūsu vārdu, bet kontam tāds ir vajadzīgs. Izmantojiet savu e-pasta adresi zemāk.",
    "Google.Unreachable":
      "Šobrīd nevarēja sazināties ar Google. Mēģiniet vēlreiz pēc dažām minūtēm vai izmantojiet savu e-pasta adresi zemāk.",
    "Registration.NotAPerson":
      "Šķiet, ka tas nav nācis no cilvēka. Mēģiniet vēlreiz, un, ja tas atkārtojas, uzgaidiet dažas minūtes un atgriezieties.",

    // Noteikums, ko adrese var pārkāpt, teikts zem lauka, uz kuru tas attiecas.
    "EmailAddress.Missing": "Ievadiet e-pasta adresi.",
    "EmailAddress.NoAt": "E-pasta adresē ir simbols @.",
    "EmailAddress.MoreThanOneAt": "E-pasta adresē ir viens simbols @.",
    "EmailAddress.NoDomain":
      "E-pasta adresē aiz @ ir domēns, piemēram, example.com.",

    "welcome.title": "Pārbaudiet savu e-pastu",
    "welcome.checkEmail":
      "Uz jūsu norādīto adresi ir nosūtīts e-pasts. Lai turpinātu, atveriet tajā esošo saiti.",
    "welcome.nothingArrived":
      "Ja pēc dažām minūtēm nekas nav atnācis, pārbaudiet surogātpasta mapi.",
    "welcome.home": "Atpakaļ uz {siteName}",
    "newConfirmationLink.title": "Saņemt jaunu saiti",
    "newConfirmationLink.explanation":
      "Saites derīguma termiņš e-pasta adreses apstiprināšanai ir beidzies. Pieprasiet jaunu, un tā tiks nosūtīta uz adresi, ar kuru reģistrējāties.",
    "newConfirmationLink.send": "Nosūtiet man jaunu saiti",
    "newConfirmationLink.home": "Atpakaļ uz {siteName}",
    "newConfirmationLink.signIn": "Pierakstīties",
    "newConfirmationLink.sent.title": "Pārbaudiet savu e-pastu",
    "newConfirmationLink.sent.explanation":
      "Jauna saite ir ceļā. Atveriet to, lai apstiprinātu savu e-pasta adresi. Ja pēc dažām minūtēm nekas nav atnācis, pārbaudiet surogātpasta mapi.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Šī e-pasta adrese jau ir apstiprināta",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Vairs nav ko apstiprināt. Piesakieties ar paroli, ko norādījāt, apstiprinot adresi.",
    "newConfirmationLink.noLongerWorks.title": "Šī saite vairs nedarbojas",
    "newConfirmationLink.noLongerWorks.explanation":
      "Pārbaudiet, vai atvērāt visu saiti no e-pasta, nekas netrūkst tās beigās. Ja tā joprojām nedarbojas, reģistrējieties vēlreiz, un tiks nosūtīta jauna saite.",
    "newConfirmationLink.tooMany.title": "Mēģiniet vēlreiz vēlāk",
    "newConfirmationLink.tooMany.explanation":
      "Uz šo adresi nesen ir nosūtītas vairākas saites. Uzgaidiet stundu un pieprasiet vēlreiz, bet pa to laiku pārbaudiet surogātpasta mapi.",

    "forgotPassword.title": "Aizmirsāt paroli?",
    "forgotPassword.emailAddress": "E-pasta adrese",
    "forgotPassword.submit": "Nosūtiet man ceļu atpakaļ",
    "forgotPassword.home": "Atpakaļ uz {siteName}",
    "forgotPassword.sent.title": "Pārbaudiet savu e-pastu",
    "forgotPassword.sent.explanation":
      "Ja šai adresei ir konts, uz to ir nosūtīta saite jaunas paroles iestatīšanai. Atveriet to stundas laikā. Ja pēc dažām minūtēm nekas nav atnācis, pārbaudiet surogātpasta mapi.",
    "forgotPassword.tryAgainLater":
      "No šejienes nesen ir pieprasīts pārāk daudz ceļu atpakaļ. Uzgaidiet stundu un mēģiniet vēlreiz.",

    "setNewPassword.title": "Iestatīt jaunu paroli",
    "setNewPassword.password": "Parole",
    "setNewPassword.confirmPassword": "Apstipriniet paroli",
    "setNewPassword.submit": "Iestatīt manu jauno paroli",
    "setNewPassword.home": "Atpakaļ uz {siteName}",
    "setNewPassword.signIn": "Pierakstīties",
    "setNewPassword.askAgain": "Pieprasīt jaunu saiti",
    "setNewPassword.changed.title": "Jūsu parole ir nomainīta",
    "setNewPassword.changed.explanation":
      "Jūs esat izrakstīts visur, kur bijāt pierakstījies. Piesakieties ar savu jauno paroli.",
    "setNewPassword.expired.title": "Šīs saites derīguma termiņš ir beidzies",
    "setNewPassword.expired.explanation":
      "Saite jaunas paroles iestatīšanai darbojas vienu stundu. Pieprasiet citu, un tā tiks nosūtīta uz to pašu adresi.",
    "setNewPassword.noLongerWorks.title": "Šī saite vairs nedarbojas",
    "setNewPassword.noLongerWorks.explanation":
      "Iespējams, tā jau ir izmantota vai tās beigās kaut kas trūkst. Ja jums vēl vajag, pieprasiet citu.",

    // Tiek teikts virs laukiem, kad nevar pajautāt par nopludinātajām parolēm.
    "BreachedPasswords.Unreachable":
      "Šobrīd jūsu paroli nevar pārbaudīt, tāpēc tā nav mainīta. Mēģiniet vēlreiz pēc dažām minūtēm; jūsu saite darbojas, līdz tās termiņš beidzas.",

    "forgetAccount.title": "Aizmirst savu kontu",
    "forgetAccount.explanation":
      "Jūsu vārdu un e-pasta adresi var padarīt neizlasāmus uz visiem laikiem, un jūsu kontu aizvērt. Lai pārliecinātos, ka tas esat jūs, vispirms nosūtīsim saiti uz jūsu konta adresi, un nekas netiek aizmirsts, kamēr to neatverat.",
    "forgetAccount.submit": "Nosūtiet man saiti e-pastā",
    "forgetAccount.sent.title": "Pārbaudiet savu e-pastu",
    "forgetAccount.sent.explanation":
      "Mēs nosūtījām saiti uz jūsu konta adresi. Tā darbojas 15 minūtes un tikai tad, kamēr esat pierakstījies šajā kontā.",
    "forgetAccount.confirm.title": "Aizmirst savu kontu uz visiem laikiem?",
    "forgetAccount.confirm.explanation":
      "Kad konts būs aizmirsts, jūsu vārdu un e-pasta adresi nekad vairs nevarēs izlasīt neviens, un kontā nevarēs pierakstīties. To nevar atsaukt.",
    "forgetAccount.confirm.submit": "Aizmirst manu kontu",
    "forgetAccount.forgotten.title": "Jūsu konts ir aizmirsts",
    "forgetAccount.forgotten.explanation":
      "Jūsu vārdu un e-pasta adresi vairs nevar izlasīt, un jūs esat izrakstīts visur, kur bijāt pierakstījies.",
    "forgetAccount.noLongerWorks.title": "Šī saite vairs nedarbojas",
    "forgetAccount.noLongerWorks.explanation":
      "Iespējams, tās termiņš ir beidzies, tā jau izmantota vai attiecas uz kontu, kurā neesat pierakstījies. Ja joprojām vēlaties, lai konts tiek aizmirsts, pieprasiet vēlreiz no sava konta.",
    "forgetAccount.lastAdministrator.title": "Jūsu kontu nevar aizmirst",
    "forgetAccount.lastAdministrator.explanation":
      "Jūs esat šīs vietnes vienīgais administrators. Piešķiriet administratora lomu kādam citam, un tad jūsu kontu varēs aizmirst.",
    "forgetAccount.askAgain": "Pieprasīt vēlreiz",
    "forgetAccount.home": "Atpakaļ uz {siteName}",

    "registrationsSuspended.title": "Reģistrēšanās pagaidām ir apturēta",
    "registrationsSuspended.explanation":
      "Šobrīd nevar sazināties ar pakalpojumu, kas vajadzīgs reģistrēšanai, tāpēc neviens nevar reģistrēties, kamēr tas neatsāk atbildēt. Nekas no jūsu ievadītā netika saglabāts.",
    "registrationsSuspended.tryAgainLater":
      "Mēģiniet vēlreiz pēc brīža. Vietnes administrators ir informēts.",
    "registrationsSuspended.home": "Atpakaļ uz {siteName}",

    "signIn.title": "Pierakstīties",
    "signIn.emailAddress": "E-pasta adrese",
    "signIn.password": "Parole",
    "signIn.submit": "Pierakstīties",
    "signIn.forgotPassword": "Aizmirsu paroli?",
    "signIn.register": "Reģistrēties",
    "signIn.withGoogle": "Pierakstīties ar Google",
    "signIn.or": "vai",
    "signIn.tryAgainLater":
      "Nesen ir veikts pārāk daudz mēģinājumu. Uzgaidiet stundu un mēģiniet vēlreiz.",

    // Vienīgā atbilde gan uz nepareizu paroli, gan uz adresi, ko neviens nav
    // reģistrējis. Tā nesaka ne to, kurš no tiem tas bija, ne to, kurš nebija.
    "SignIn.Failed":
      "E-pasta adrese vai parole nav pareiza. Lūdzu, mēģiniet vēlreiz.",

    "profile.title": "Profils",
    // Etiķetes kols ir tās vārdu daļa, jo valodas to liek dažādi.
    "profile.name": "Vārds:",
    "profile.emailAddress": "E-pasta adrese:",

    "changeName.title": "Mainīt vārdu",
    "changeName.name": "Vārds",
    "changeName.submit": "Mainīt vārdu",

    "setPassword.title": "Iestatīt paroli",
    "setPassword.explanation":
      "Jūsu kontam nav paroles: jūs pierakstāties ar Google. Lai varētu pierakstīties arī ar paroli, uz {emailAddress} nosūtīsim saiti tās iestatīšanai.",
    "setPassword.submit": "Nosūtiet man saiti e-pastā",
    "setPassword.sent.title": "Pārbaudiet savu e-pastu",
    "setPassword.sent.explanation":
      "Mēs nosūtījām jums saiti paroles iestatīšanai. Tā darbojas vienu stundu.",
    "setPassword.profile": "Atpakaļ uz jūsu profilu",

    "changePassword.title": "Mainīt paroli",
    "changePassword.currentPassword": "Pašreizējā parole",
    "changePassword.password": "Jaunā parole",
    "changePassword.passwordConfirmation": "Apstipriniet paroli",
    "changePassword.forgotPassword": "Aizmirsu paroli?",
    "changePassword.submit": "Mainīt paroli",
    // Zem pašreizējās paroles, uz kuru tas attiecas.
    "ChangePassword.WrongPassword": "Tā nav jūsu parole.",

    "changeEmailAddress.title": "Mainīt e-pasta adresi",
    "changeEmailAddress.emailAddress": "Jaunā e-pasta adrese",
    "changeEmailAddress.currentPassword": "Pašreizējā parole",
    "changeEmailAddress.submit": "Nosūtīt apstiprinājuma saiti",
    "changeEmailAddress.sent.title": "Pārbaudiet savu e-pastu",
    "changeEmailAddress.sent.explanation":
      "Uz jauno e-pasta adresi ir nosūtīta saite pārcelšanas apstiprināšanai. Atveriet to, būdami pierakstījies, lai pārceltu savu kontu uz turieni.",
    "changeEmailAddress.confirm.title": "Pārcelt savu kontu",
    "changeEmailAddress.confirm.explanation":
      "Jūsu konts tiks pārcelts uz {emailAddress}. No šī brīža jūs pierakstīsieties ar šo adresi.",
    "changeEmailAddress.confirm.submit": "Pārcelt manu kontu",
    "changeEmailAddress.noLongerWorks.title": "Šī saite vairs nedarbojas",
    "changeEmailAddress.noLongerWorks.explanation":
      "Tās termiņš ir beidzies, tā ir izmantota vai nav nosūtīta kontam, kurā esat pierakstījies. Pieprasiet vēlreiz no sava profila.",
    "changeEmailAddress.taken.title": "Jūsu konts nav pārcelts",
    "changeEmailAddress.profile": "Atpakaļ uz jūsu profilu",
    // Zem lauka, uz kuru katrs attiecas.
    "ChangeEmailAddress.WrongPassword": "Tā nav jūsu parole.",
    "ChangeEmailAddress.Unchanged": "Jūsu konts jau ir pie šīs adreses.",
    "ChangeEmailAddress.Taken":
      "Šai e-pasta adresei tagad ir savs konts, tāpēc jūsu konts uz to nevar pāriet.",

    "confirmEmailAddress.title": "Apstiprināt savu e-pasta adresi",
    "confirmEmailAddress.name": "Vārds",
    "confirmEmailAddress.password": "Parole",
    "confirmEmailAddress.confirmPassword": "Apstipriniet paroli",
    "confirmEmailAddress.submit": "Apstiprināt manu e-pasta adresi",
    "confirmEmailAddress.signIn": "Pierakstīties",
    "confirmEmailAddress.home": "Atpakaļ uz {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Jūsu e-pasta adrese ir apstiprināta",
    "confirmEmailAddress.confirmed.explanation":
      "Jūsu konts ir gatavs. Piesakieties ar e-pasta adresi un paroli, ko tikko norādījāt.",
    "confirmEmailAddress.expired.title":
      "Šīs saites derīguma termiņš ir beidzies",
    "confirmEmailAddress.expired.explanation":
      "Saite e-pasta adreses apstiprināšanai darbojas 24 stundas. Pieprasiet jaunu, un tā tiks nosūtīta uz to pašu adresi.",
    "confirmEmailAddress.expired.newLink": "Nosūtiet man jaunu saiti",
    "confirmEmailAddress.noLongerWorks.title": "Šī saite vairs nedarbojas",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Pārbaudiet, vai atvērāt visu saiti no e-pasta, nekas netrūkst tās beigās. Ja tā joprojām nedarbojas, reģistrējieties vēlreiz, un tiks nosūtīta jauna saite.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Šī e-pasta adrese jau ir apstiprināta",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Vairs nav ko darīt. Piesakieties ar paroli, ko norādījāt, apstiprinot adresi.",

    // Pārkāpts noteikums, atslēgts ar tā kodu, lai katra veidlapa to saka
    // vienādi. Tiek teikts tam, kas to ievadīja, zem lauka, ko tā lasa.
    "PersonName.Missing": "Ievadiet vārdu.",
    "PersonName.TooShort": "Vārdā jābūt vismaz 3 rakstzīmēm.",
    "PersonName.TooLong": "Vārdā var būt ne vairāk kā 254 rakstzīmes.",
    "WorldRankingName.TooShort":
      "Pasaules ranga vārdā jābūt vismaz 3 rakstzīmēm.",
    "WorldRankingName.TooLong":
      "Pasaules ranga vārdā var būt ne vairāk kā 254 rakstzīmes.",
    "Password.Missing": "Ievadiet paroli.",
    "Password.TooShort": "Parolē jābūt vismaz 12 rakstzīmēm.",
    "Password.ConfirmationDiffers":
      "Tā nav tāda pati kā parole augstāk. Ievadiet to vēlreiz.",
    "Password.Breached":
      "Šī parole ir parādījusies datu noplūdē kaut kur citur, tāpēc to nav droši izmantot šeit. Izvēlieties citu.",

    "javaScriptRequired.title": "Nepieciešami skripti",
    "javaScriptRequired.explanation":
      "Reģistrēšanās prasa, lai šai vietnei būtu ieslēgti skripti, lai varētu pārbaudīt, ka reģistrētājs ir cilvēks. Ieslēdziet tos un reģistrējieties vēlreiz.",
    "javaScriptRequired.register": "Atpakaļ uz reģistrēšanos",
    "javaScriptRequired.home": "Atpakaļ uz {siteName}",

    "errors.backHome": "Atpakaļ uz {siteName}",
    "errors.notFound": "Nav atrasts",
    "errors.refused": "To nevarēja izdarīt",
    "errors.refusedDetail": "Kaut kas nosūtītajā nebija kārtībā.",
    "errors.sorry": "Atvainojiet",
    "errors.sorryDetail": "Šo pieprasījumu nevarēja apstrādāt.",
    "errors.failed": "Kaut kas nogāja greizi",
    "errors.reference": "Atsauce {reference}.",
    "errors.recorded":
      "Kļūda ir reģistrēta, un administratoram ir nosūtīts e-pasts. Lai palīdzētu, uzrakstiet administratoram e-pastu ar atsauci un aprakstu, ko darījāt.",
    "errors.message": "Rakstīt administratoram e-pastu",
    "errors.messageSubject": "Kļūda {reference} vietnē {siteName}",
    "errors.messageBody": "Ko es darīju, kad tas notika:\n\n",
    "errors.unavailable": "Vietne nav pieejama",
    "errors.unavailableDetail":
      "Vietne šobrīd nevar sasniegt to, kas tai vajadzīgs. Lūdzu, mēģiniet vēlāk.",
    "errors.maintenance": "Vietne ir izslēgta apkopes dēļ.",
    "errors.maintenanceMinutes":
      "Gaidāms, ka tā atgriezīsies pēc {minutes} min.",
    "errors.maintenanceMinute": "Gaidāms, ka tā atgriezīsies pēc 1 minūtes.",
    "errors.maintenanceLonger":
      "Tas aizņem ilgāk nekā gaidīts, un vietne drīz atgriezīsies.",

    // Sākumlapas divi saraksti, ko katrs saka, kad tajā nekā nav, un ceļš zem
    // tiem uz visiem šī gada turnīriem.
    "home.recentResults": "Nesenie rezultāti",
    "home.recentResults.none":
      "Pēdējās septiņās dienās nav pievienota neviena partija.",
    "home.upcomingTournaments": "Gaidāmie turnīri",
    "home.upcomingTournaments.none":
      "Tuvāko sešdesmit dienu laikā nesākas neviens turnīrs.",
    "home.allTournaments": "Visi turnīri {year}. gadā",
    // Gada lapa: tās virsraksts.
    "year.heading": "Turnīri {year}. gadā",
    // Gada lapas mēneši, kas tiek ielādēti, tos nospiežot.
    "year.needsScripting":
      "Gada mēneši tiek atvērti ar skriptiem, kas ir izslēgti. Lūdzu, ieslēdziet tos šai vietnei.",
    "year.showAll": "Rādīt visu",
    "year.hideAll": "Slēpt visu",
    "year.monthNone": "Nav turnīru, kas sāktos: {month} {year}.",
    "year.monthFailed": "Turnīrus nevarēja ielādēt. Lūdzu, mēģiniet vēlreiz.",
    // Sporta veida lapa gadā: tas pats, tikai šī sporta veida.
    "yearSport.heading": "{sport}: turnīri {year}. gadā",
    "yearSport.monthNone": "{sport}: nav turnīru, kas sāktos: {month} {year}.",
    // Turnīra lapa: tās sadaļas, ko tā saka par partiju, cik sen tā pievienota
    // un ko tā saka, kad partiju nav.
    "tournament.recent": "Nesenie",
    "tournament.summary": "Kopsavilkums",
    // Komandu turnīra kopsavilkums: tā tabulas grupas un kolonnas.
    // Testa režģis: kāds ir katra mača maksimālais partiju skaits, vārds starp
    // tā komandām un kopsummas zem mačiem.
    "test.bestOf": "Katrs mačs: labākais no {count}.",
    "test.vs": "pret",
    "test.matches": "Mači",
    "test.games": "Partijas",
    "test.hoops": "Vārtiņi",
    "teamSummary.tests": "Testi",
    "teamSummary.matches": "Mači",
    "teamSummary.games": "Partijas",
    "teamSummary.hoops": "Vārtiņi",
    "teamSummary.wins": "Uzvaras",
    "teamSummary.losses": "Zaudējumi",
    "teamSummary.draws": "Neizšķirti",
    "teamSummary.for": "Gūti",
    "teamSummary.against": "Zaudēti",
    "teamSummary.net": "Starpība",
    "tournament.players": "Spēlētāji",
    "search.label": "Meklēt",
    "search.tournaments": "Turnīri",
    "search.competitions": "Sacensības",
    "search.nothingFound": "Nekas netika atrasts.",
    "players.search.label": "Meklēt spēlētājus",
    "players.search.prompt": "Ievadiet spēlētāja vārdu, lai viņu atrastu.",
    "players.search.none": "Neviens spēlētājs netika atrasts.",
    "search.more":
      "Tiek rādīti tikai pirmie {count}. Pievienojiet vairāk no vārda, lai sašaurinātu meklēšanu.",
    "websitePlayer.tournament": "Turnīrs",
    // Tests turnīra sadaļās: tā divu komandu īsie nosaukumi.
    "tournament.test": "{first} pret {second}",
    "tournament.notes": "Piezīmes",
    "tournament.commentary": "Reportāža",
    "tournament.beat": "uzvarēja",
    "tournament.drewWith": "nospēlēja neizšķirti ar",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 stunda",
    "tournament.ago.hours": "{count} st.",
    "tournament.none": "Vēl nav nospēlēta neviena partija.",
    // Turnīra spēlētāju lapa, kad tajā nav neviena.
    "players.none": "Vēl nav pievienots neviens spēlētājs.",
    // Turnīra reportāžu lapa vecās vietnes vārdiem: kā reportāža tiek uzskaitīta
    // un saite, lai sāktu jaunu.
    "commentaries.by": "autors:",
    "commentaries.start": "Sākt jaunu reportāžu",
    // Lapa, kas sāk reportāžu.
    "startCommentary.title": "Sākt jaunu reportāžu",
    "startCommentary.titleField": "Nosaukums",
    "startCommentary.submit": "Sākt reportāžu",
    // "Jauns" tiek teikts ekrāna lasītājam sarkanās zvaigznītes vietā, kas
    // atzīmē piezīmi vai reportāžu, kas nav lasīta tādā veidā, kāda tā ir tagad.
    "marks.new": "jauns",
    // Turnīra piezīmju lapa un pašas piezīmes lapa.
    // Lapas virsraksts ir "Pārvaldnieka piezīmes", bet tās sadaļa joslā ir
    // "Piezīmes" (tournament.notes), jo tur citādi nav vietas.
    "notes.heading": "Pārvaldnieka piezīmes",
    "notes.none": "Vēl nav piezīmju.",
    "note.edited": "labots",
    // Reportāžas lapa: ko tā saka, kad komentāru nav, ko tā saka par komentāru
    // un lodziņš, kurā tā autors raksta nākamo.
    "commentary.none": "Vēl nav uzrakstīts neviens komentārs.",
    "commentary.edited": "labots",
    "commentary.edit": "Labot",
    "commentary.delete": "Dzēst",
    "commentary.comment": "Komentārs",
    "commentary.add": "Pievienot komentāru",
    "commentary.notSent":
      "Komentāru nevarēja nosūtīt. Ielādējiet lapu vēlreiz, lai redzētu, vai tas tika saglabāts.",
    // Lapa, kas maina reportāžas nosaukumu.
    "changeCommentaryTitle.title": "Mainīt nosaukumu",
    "changeCommentaryTitle.submit": "Saglabāt",
    // Komentāra pašas lapa, kur tā autors to labo vai dzēš, un lapa, kas
    // jautā pirms dzēšanas.
    "editComment.title": "Labot komentāru",
    "editComment.save": "Saglabāt",
    "deleteComment.title": "Dzēst komentāru",
    "deleteComment.question": "Dzēst šo komentāru? To nevar atsaukt.",
    "deleteComment.confirm": "Dzēst komentāru",
    "deleteComment.keep": "Paturēt",
    // Spēlētāja lapa: tās divas daļas, kā partija tiek teikta tā, kā spēlētājs
    // to spēlēja, un ko katra daļa saka, kad tajā nekā nav.
    "player.games": "Partijas",
    "player.competitions": "Sacensības",
    "player.beat": "uzvarēja",
    "player.lostTo": "zaudēja pret",
    "player.drewWith": "nospēlēja neizšķirti ar",
    "player.score": "{score} pret {opponent}",
    "player.noGames": "Vēl nav nospēlēta neviena partija.",
    "player.noCompetitions": "Vēl nav pieteikts nevienās sacensībās.",
    // Grupas lapa: tās režģa kopsummas, kas rezultāts ir rindas spēlētājam,
    // teikts skaļi, nevis rādīts, un spēlētājs, kas izstājies.
    "block.wins": "Uzvaras",
    "block.matches": "Mači",
    "block.netGames": "Partiju starpība",
    "block.games": "Partijas",
    "block.netHoops": "Vārtiņu starpība",
    "block.won": "uzvarēts",
    "block.lost": "zaudēts",
    "block.drawn": "neizšķirti",
    "block.withdrawn": "izstājies",
    // Atsaukta partija, ko spāņu valoda saka citādi nekā spēlētāju.
    "block.gameWithdrawn": "neieskaitīta",
    "block.losses": "Zaudējumi",
    // Vietu kolonna grupas režģa beigās, kopsavilkumā un drukā, un ko zem
    // katras saka par to, kā tiek šķirti spēlētāji ar vienādu uzvarēto maču
    // skaitu. Vārtiņu starpība ir pirmā otrajā, grupai, kuras mači ir viena
    // partija, kur partiju starpība tikai atkārtotu to, ko jau saka uzvaras.
    "block.placing": "#",
    "block.tieBreak.netGamesNetHoopsWhoBeatWho":
      "Neizšķirtu rezultātu izšķir pēc partiju starpības, tad pēc vārtiņu starpības, tad pēc tā, kurš kuru uzvarēja.",
    "block.tieBreak.netHoopsWhoBeatWho":
      "Neizšķirtu rezultātu izšķir pēc vārtiņu starpības, tad pēc tā, kurš kuru uzvarēja.",
    "block.tieBreak.whoBeatWho":
      "Neizšķirtu rezultātu izšķir pēc tā, kurš kuru uzvarēja.",
    "block.tieBreak.other": "Nav zināmas neizšķirta rezultāta metodes.",
    // Trīs grupas skati, piedāvāti zem tās virsraksta.
    "competition.views": "Skati",
    "competition.view.grid": "Režģis",
    "competition.view.summary": "Kopsavilkums",
    "competition.view.orderOfPlay": "Spēļu kārtība",
    "competition.print": "Drukāt",
    "competition.playedTo": "Spēlē līdz {hoops} vārtiņiem",
    "blockSummary.ranking":
      "Sakārtots pēc uzvarēto maču daļas. Turnīra paša noteikumi spēlētājus var sakārtot citādi.",
    "orderOfPlay.none": "Vēl nav nospēlēta neviena partija.",
    "orderOfPlay.column.game": "Partija",
    "orderOfPlay.column.date": "Datums",
    // Izslēgšanas turnīra kārtas, nosauktas tā, kā tās nosauca vecā vietne,
    // skaitot atpakaļ no pēdējās, un bye, ko zīmē spēlētāja vietā.
    "knockout.round.final": "Fināls",
    "knockout.round.semis": "Pusfināli",
    "knockout.round.quarters": "Ceturtdaļfināli",
    "knockout.round.number": "{number}. kārta",
    "knockout.bye": "Bye",
    // Šveices sistēmas tabula: ko katrs spēlētājs ir spēlējis un uzvarējis, un
    // viņu rezultāti.
    "swiss.games": "Partijas",
    "swiss.wins": "Uzvaras",
    "swiss.winShare": "Uzvaru %",
    "swiss.results": "Rezultāti",
    // Bultiņas, kas ritina izslēgšanas turnīra režģi uz fināla pusi un atpakaļ
    // uz pirmo kārtu.
    "knockout.onward": "Vēlākās kārtas",
    "knockout.back": "Agrākās kārtas",
    // Kas kopīgs katram turnīru sarakstam sākumlapā un gada lapā: kolonnas, no
    // kurām katrs sastāv, un kas tos sašaurina.
    "tournamentList.column.date": "Datums",
    "tournamentList.column.name": "Nosaukums",
    // Karogs, kas sašaurina sarakstus līdz tā valstij, nosaukts pēc tā, ko dara.
    "tournamentList.onlyIn": "Tikai turnīri valstī: {country}",
    "tournamentList.usualOrder": "Atpakaļ uz parasto kārtību",
    "tournamentList.filter.country": "Valsts",
    "tournamentList.filter.anyCountry": "Jebkura valsts",
    "tournamentList.filter.region": "Reģions",
    "tournamentList.filter.anyRegion": "Jebkurš reģions",
    "tournamentList.filter.noRegionsBefore":
      "Turnīriem pirms 2026. gada novembra nav reģionu.",
    "tournamentList.filter.sport": "Sporta veids",
    "tournamentList.filter.anySport": "Jebkurš sporta veids",
    "tournamentList.filter.submit": "Filtrēt",
    "tournamentList.filter.from": "No",
    "tournamentList.filter.to": "Līdz",
    "tournamentsInDays.heading": "Turnīri no {from} līdz {to}",
    "tournamentsInDays.headingAll": "Turnīri",
    "tournamentsInDays.none": "Šajās dienās nesākas neviens turnīrs.",
    "tournamentsInDays.previous": "Iepriekšējā",
    "tournamentsInDays.next": "Nākamā",
    "tournamentsInDays.page": "{page}. lapa no {last}",
    // Gadi, kuros ir turnīri, abu otrā navigācija.
    "years.label": "Gadi",
    // Nolaižamais saraksts ar gadiem, kas neietilpst cilnēs.
    "years.earlier": "Agrākie gadi",

    // Administrēšanas vārdi. Administrēšanu zīmē pārlūkā, tāpēc serveris tos
    // ieliek lapā, to sūtot (adminPage.ts): šie un turnīra atteikumi zemāk.
    "admin.newerBuild.message": "Ir pieejama jaunāka šīs vietnes versija.",
    "admin.newerBuild.reload": "Ielādēt vēlreiz",
    "admin.title": "Administrēšana",
    "admin.tournaments.new": "Jauns turnīrs",
    "admin.tournaments.none": "Nav turnīru",
    "admin.tournaments.filter.none": "Neviens turnīrs neatbilst",
    "admin.tournaments.show": "Rādīt",
    "admin.tournaments.managerScorer": "Pārvaldnieks/rezultātu ievadītājs",
    "admin.tournaments.worldRanking": "Pasaules rangs",
    "admin.tournaments.notWorldRanking": "Nav pasaules rangā",
    // Tiek teikts ekrāna lasītājam, jo svītra cauri nosaukumam netiek nolasīta.
    "admin.tournaments.archived": "Arhivēts",
    "admin.tournaments.manage": "Pārvaldīt",
    "admin.tournaments.edit": "Labot",
    "admin.tournaments.archive": "Arhivēt",
    "admin.tournaments.restore": "Atjaunot",
    "admin.tournaments.scores": "Rezultāti",
    "admin.tournaments.players": "Spēlētāji",
    "admin.years.label": "Gadi",
    // Ko saka nolaižamais gadu saraksts, kamēr izvēlētais gads ir cilne.
    "admin.years.earlier": "Agrākie gadi",
    "admin.tournament.name": "Nosaukums",
    "admin.tournament.starts": "Sākas",
    "admin.tournament.finishes": "Beidzas",
    "admin.tournament.format": "Formāts",
    "admin.tournament.sport": "Sporta veids",
    "admin.tournament.country": "Valsts",
    "admin.tournament.region": "Reģions",
    "admin.tournament.subtitle": "Apakšvirsraksts",
    "admin.rules.handicap": "Spēlē ar handikapiem",
    "admin.rules.drawsAllowed": "Pieļauj neizšķirtus rezultātus",
    "admin.tournament.levelTestsDrawn": "Vienādi testi ir neizšķirti",
    "admin.rules.worldRankings": "Ieskaita pasaules rangā",
    "admin.rules.maximumHoops": "Maksimālais vārtiņu skaits",
    "admin.tournament.national": "Nacionāla līmeņa pasākums",
    "admin.tournament.international": "Starptautiska līmeņa pasākums",
    // Atteikums bez savu vārdu, virs laukiem.
    "admin.tournament.otherwise": "To nevar pieņemt tādu, kāds tas ir.",
    "admin.newTournament.title": "Jauns turnīrs",
    "admin.newTournament.submit": "Izveidot turnīru",
    "admin.editTournament.title": "Labot turnīru",
    "admin.editTournament.submit": "Atjaunināt turnīru",
    // Tiek teikts veidlapas vietā atteikumam bez savu vārdu.
    "admin.editTournament.otherwise": "Šo turnīru nevar mainīt.",
    // Turnīra lapa un cilnes, kurās ir viss, ko vadīt.
    "admin.view.tabs": "Turnīrs",
    "admin.view.players": "Spēlētāji",
    "admin.view.competitions": "Sacensības",
    "admin.view.managers": "Pārvaldnieki",
    "admin.view.notes": "Piezīmes",
    "admin.view.scorers": "Rezultātu ievadītāji",
    "admin.view.rankings": "Rangi",
    "admin.rankings.file":
      "Pasaules rangi izmantos turnīra rezultātus ar šīs funkcijas palīdzību, tāpēc pārvaldniekiem nekas nav jādara.",
    "admin.rankings.download": "Lejupielādēt partijas pasaules rangam",
    "rankings.notAvailable": "Rangi nav pieejami",
    "rankings.notAvailable.sport":
      "Šī turnīra sporta veidam nav pasaules rangu, tāpēc nav ko sūtīt.",
    "rankings.notAvailable.notCounted":
      "Neviena no šī turnīra sacensībām netiek ieskaitīta pasaules rangos.",
    // Tiek teikts cilņu vietā atteikumam bez savu vārdu.
    "admin.view.otherwise": "Šo turnīru nevar vadīt no šejienes.",
    // Sacensību lapa un cilnes, kurās ir viss, ko vadīt.
    "admin.competitionView.tabs": "Sacensības",
    "admin.competitionView.players": "Spēlētāji",
    "admin.competitionView.scores": "Rezultāti",
    "admin.competitionView.losers": "Zaudētāji",
    "admin.losers.add": "Pievienot zaudētāju izslēgšanas turnīru",
    "admin.losers.round": "Zaudētāji no",
    "admin.losers.option": "{round} (zaudētāju: {count})",
    "admin.losers.name": "Zaudētāju izslēgšanas turnīra nosaukums",
    "admin.losers.none": "Nav zaudētāju izslēgšanas turnīru.",
    "admin.losers.noRounds":
      "Šim izslēgšanas turnīram nav kārtas, kuras zaudētāji varētu spēlēt tālāk.",
    "admin.losers.remove": "Noņemt",
    "admin.losers.readOnly":
      "Šī izslēgšanas turnīra spēlētāji ir cita izslēgšanas turnīra zaudētāji, kas šeit tiek ielikti, kad izšķiras katrs mačs.",
    "admin.hover.losers.add":
      "Pievienot izslēgšanas turnīru kādas šī izslēgšanas turnīra kārtas zaudētājiem",
    "Tournament.NoSuchRound":
      "Izslēgšanas turnīrā nav tādas kārtas, kuras zaudētāji iet tālāk.",
    "Tournament.KnockoutHasLosersKnockouts":
      "Cits izslēgšanas turnīrs ņem šī zaudētājus, tāpēc tā vietas nevar mainīt.",
    "Tournament.KnockoutHasLosersKnockoutsInUse":
      "Cits izmantotais izslēgšanas turnīrs ņem šī zaudētājus, tāpēc vispirms arhivējiet to.",
    "Tournament.LosersKnockoutSourceArchived":
      "Šis zaudētāju izslēgšanas turnīrs ņem zaudētājus no arhivēta izslēgšanas turnīra, tāpēc vispirms atjaunojiet to.",
    "Tournament.LosersKnockoutPlacesFixed":
      "Zaudētāju izslēgšanas turnīrā ir tik vietu, cik maču ir kārtā, no kuras tas ņem zaudētājus.",
    "Competition.PlayersSetAutomatically":
      "Zaudētāju izslēgšanas turnīra spēlētāji tiek ielikti, kad izšķiras mači, nevis ar roku.",
    // Turnīra lapas un tā sacensību lapu sadaļu josla.
    "admin.sections.label": "Turnīrs un tā sacensības",
    "admin.sections.tournament": "Turnīrs",
    // Administratora lapu sadaļu josla.
    "admin.administrator.sections.label": "Administratora lapas",
    "admin.administrator.sections.tournaments": "Turnīri",
    "admin.administrator.sections.accounts": "Konti",
    "admin.administrator.sections.worldRankings": "Pasaules rangi",
    "admin.administrator.sections.importErrors": "Importa kļūdas",
    "admin.administrator.sections.logs": "Žurnāli",
    "admin.administrator.sections.databaseStatus": "Piekļuve datubāzei",
    "admin.administrator.sections.countries": "Valstis",
    "admin.databaseStatus.title": "Piekļuve datubāzei",
    "admin.databaseStatus.on": "Piekļuve datubāzei ir ieslēgta.",
    "admin.databaseStatus.off": "Piekļuve datubāzei ir izslēgta.",
    "admin.databaseStatus.expected":
      "Gaidāms, ka vietne atgriezīsies pēc {minutes} min.",
    "admin.databaseStatus.expectedOne":
      "Gaidāms, ka vietne atgriezīsies pēc 1 minūtes.",
    "admin.databaseStatus.longer": "Tas aizņem ilgāk nekā gaidīts.",
    "admin.databaseStatus.told": "Lasītājiem tiek teikts: {words}",
    "admin.databaseStatus.toldUsual":
      "Lasītājiem tiek teikts parastais teikums.",
    "admin.databaseStatus.minutes": "Gaidāmās minūtes",
    "admin.databaseStatus.words": "Vārdi lasītājiem",
    "admin.databaseStatus.turnOff": "Izslēgt",
    "admin.databaseStatus.change": "Mainīt",
    "admin.databaseStatus.turnOn": "Ieslēgt",
    "admin.databaseStatus.minutesNeeded": "Minūtes ir nepieciešamas.",
    "admin.databaseStatus.otherwise": "Vietnē kaut kas nogāja greizi.",
    "DatabaseAccess.MinutesNotWhole": "Minūtēm jābūt veselam skaitlim.",
    "DatabaseAccess.MinutesOutOfRange": "Minūtēm jābūt no 1 līdz 1440.",
    "DatabaseAccess.WordsTooLong": "Vārdu var būt ne vairāk kā 500 rakstzīmes.",
    "DatabaseAccess.NotOff": "Piekļuve datubāzei nav izslēgta.",
    "admin.administrator.title": "Administrators",
    // Kontu lapa, katrai lomai sadaļa.
    "admin.accounts.title": "Konti",
    "admin.roles.add": "Pievienot",
    "admin.roles.administrator.heading": "Administratori",
    "admin.roles.administrator.none": "Nav citu administratoru",
    "admin.roles.administrator.removeTitle": "Noņemt administratoru",
    "admin.roles.administrator.removeExplanation":
      "{name} vairs nebūs šīs vietnes administrators.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Asociācijas kroketa pasaules ranga atbildīgie",
    "admin.roles.ac-world-ranking-officer.none":
      "Nav asociācijas kroketa pasaules ranga atbildīgo",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Noņemt asociācijas kroketa pasaules ranga atbildīgo",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} vairs nebūs asociācijas kroketa pasaules ranga atbildīgais.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Golfa kroketa pasaules ranga atbildīgie",
    "admin.roles.gc-world-ranking-officer.none":
      "Nav golfa kroketa pasaules ranga atbildīgo",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Noņemt golfa kroketa pasaules ranga atbildīgo",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} vairs nebūs golfa kroketa pasaules ranga atbildīgais.",
    // Lapa, kurā tiek importēti pasaules ranga spēlētāji, un tās žurnāls, rinda
    // par katru lietu, ko imports saka. Skaits tiek teikts aiz kola, lai viens
    // spēlētājs un daudzi tiktu teikti vienādi.
    "admin.worldRankings.title": "Importēt pasaules ranga spēlētājus",
    "admin.worldRankings.import": "Importēt",
    "admin.worldRankings.log": "Kā izdevās imports",
    "admin.worldRankings.ac.reading":
      "Tiek lasīts asociācijas kroketa saraksts",
    "admin.worldRankings.ac.read":
      "Nolasīto asociācijas kroketa spēlētāju skaits: {players}",
    "admin.worldRankings.ac.kept":
      "Paturēto asociācijas kroketa spēlētāju skaits: {players}",
    "admin.worldRankings.ac.refused":
      "Asociācijas kroketa sarakstu nevarēja nolasīt, tāpēc tā spēlētāji tika atstāti, kā bija.",
    "admin.worldRankings.gc.reading": "Tiek lasīts golfa kroketa saraksts",
    "admin.worldRankings.gc.read":
      "Nolasīto golfa kroketa spēlētāju skaits: {players}",
    "admin.worldRankings.gc.kept":
      "Paturēto golfa kroketa spēlētāju skaits: {players}",
    "admin.worldRankings.gc.refused":
      "Golfa kroketa sarakstu nevarēja nolasīt, tāpēc tā spēlētāji tika atstāti, kā bija.",
    "admin.worldRankings.finished": "Pabeigts",
    "admin.worldRankings.failed": "Imports netika pabeigts.",
    // Atteikumam bez savu vārdu, kā vietnes kļūmei.
    "admin.worldRankings.otherwise": "Vietnē kaut kas nogāja greizi.",
    "WorldRankingLists.Unreachable":
      "Nevarēja sazināties ar pasaules rangu vietni.",
    "WorldRankingLists.Unreadable":
      "Saraksts nav veidots tā, kā pasaules rangi veido savu: rindu tajā nevarēja nolasīt, tajā nav neviena vai tas nav rakstīts UTF-8.",
    // Dokumenti, ko imports no vecajām vietnēm noraidīja, un viena lapa.
    "admin.importErrors.title": "Importa kļūdas",
    "admin.importErrors.none": "Nav importa kļūdu",
    "admin.importErrors.otherwise": "Vietnē kaut kas nogāja greizi.",
    "admin.countries.title": "Valstis",
    "admin.countries.none":
      "Neviens turnīrs netiek spēlēts valstī, ko saraksti nenosauc",
    "admin.countries.oldSite": "Vecā vietne",
    "admin.countries.otherwise": "Vietnē kaut kas nogāja greizi.",
    "admin.logs.title": "Žurnāli",
    "admin.logs.severity": "Svarīgums",
    "admin.logs.text": "Meklēt",
    "admin.logs.show": "Rādīt",
    "admin.logs.prune": "Iztīrīt",
    "admin.logs.pruneAsk":
      "Noņemt žurnālu no laika pirms pēdējās stundas? Nekas to neatgriezīs.",
    "admin.logs.removed": "Noņemto ierakstu skaits: {count}",
    "admin.logs.none": "Nav žurnāla ierakstu",
    "admin.logs.otherwise": "Vietnē kaut kas nogāja greizi.",
    "admin.hover.logs.show": "Rādīt ierakstus, kas atbilst",
    "admin.hover.logs.prune": "Noņemt žurnālu no laika pirms pēdējās stundas",
    "admin.hover.logs.pruneAgree":
      "Noņemt žurnālu no laika pirms pēdējās stundas",
    "admin.importError.title": "Importa kļūda",
    "admin.importError.documentId": "Dokumenta id",
    "admin.importError.tournament": "Turnīrs",
    "admin.importError.competition": "Sacensības",
    "admin.importError.newSite": "Jaunā vietne",
    "admin.importError.oldSite": "Vecā vietne",
    "ImportErrorKept.NotFound":
      "Imports nav paturējis kļūdu pret šo dokumentu.",
    "admin.competitionView.otherwise":
      "Šīs sacensības nevar vadīt no šejienes.",
    // Cilne Sacensības: katras sacensības veids, ko ar tām var darīt, un
    // virsraksts, zem kura ir arhivētās.
    "admin.competitions.block": "Grupa",
    "admin.competitions.knockout": "Izslēgšanas turnīrs",
    "admin.competitions.swiss": "Šveices sistēma",
    "admin.competitions.view": "Skatīt",
    "admin.competitions.edit": "Labot",
    "admin.competitions.up": "Uz augšu",
    "admin.competitions.down": "Uz leju",
    "admin.competitions.archive": "Arhivēt",
    "admin.competitions.restore": "Atjaunot",
    "admin.competitions.archived": "Arhivētās sacensības",
    "admin.competitions.none": "Nav sacensību",
    "admin.competitions.add": "Pievienot sacensības",
    // Sacensību dialogs.
    "admin.competition.addTitle": "Pievienot sacensības",
    "admin.competition.editTitle": "Labot sacensības",
    "admin.competition.name": "Nosaukums",
    "admin.competition.kind": "Veids",
    "admin.competition.bestOf": "Labākais no",
    "admin.competition.rounds": "Kārtas",
    "admin.competition.tieBreaks": "Neizšķirta rezultāta izšķiršana",
    "admin.competition.tieBreak.net-games-net-hoops-who-beat-who":
      "Partiju starpība, tad vārtiņu starpība, tad kurš kuru uzvarēja",
    "admin.competition.tieBreak.who-beat-who": "Kurš kuru uzvarēja",
    "admin.competition.tieBreak.other": "Cits",
    "admin.competition.places": "Vietas",
    "admin.competition.round": "{number}. kārta",
    "admin.competition.bestOfs": "Labākais no, pa kārtām",
    "admin.competition.quarters": "Ceturtdaļfināli",
    "admin.competition.semis": "Pusfināli",
    "admin.competition.final": "Fināls",
    "admin.competition.add": "Pievienot",
    "admin.competition.save": "Saglabāt",
    "admin.competition.added": "Pievienots: {name}.",
    // Virs laukiem, atteikumam bez savu vārdu.
    "admin.competition.otherwise":
      "Šīs sacensības nevar saglabāt tādas, kādas tās ir.",
    "CompetitionName.Missing": "Ievadiet nosaukumu.",
    "CompetitionName.TooLong": "Nosaukumā var būt ne vairāk kā 254 rakstzīmes.",
    "CompetitionName.NoLetterOrDigit": "Nosaukumā jābūt burtam vai ciparam.",
    "Tournament.KnockoutPlayerHasGames":
      "Šīs izlozes spēlētājiem ir partijas, tāpēc tās vietas nevar mainīt.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Kārtu ar izšķirtu maču nevar padarīt par īsāku mača formātu.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Kārtu nevar mainīt, kad vēlākā kārtā ir nospēlēta partija.",
    "Tournament.CompetitionNameTaken":
      "Citām sacensībām šajā turnīrā jau ir šāds nosaukums.",
    "Tournament.MaximumHoopsInvalid":
      "Ievadiet vārtiņu veselu skaitu, vismaz 1, vai atstājiet tukšu, ja nav maksimuma.",
    "BestOf.NotWhole": "Ievadiet veselu partiju skaitu.",
    "BestOf.TooSmall": "Mačā jābūt vismaz 1 partijai.",
    "Rounds.NotWhole": "Ievadiet veselu kārtu skaitu.",
    "Rounds.TooSmall": "Grupa jāspēlē vismaz 1 kārtā.",
    "KnockoutDraw.EvenBestOf":
      "Izslēgšanas turnīra mačā jābūt uzvarētājam, tāpēc tajā ir nepāra partiju skaits.",
    // Katra modālā dialoga izeja, jo lapai zem tā nevar piekļūt.
    "admin.hover.tournaments.new": "Izveidot jaunu turnīru",
    "admin.hover.tournaments.manage":
      "Pārvaldīt šī turnīra spēlētājus, komandas, sacensības un rezultātus",
    "admin.hover.tournaments.edit": "Mainīt šī turnīra informāciju",
    "admin.hover.tournaments.scores": "Ievadīt šī turnīra rezultātus",
    "admin.hover.tournaments.players": "Pārvaldīt šī turnīra spēlētājus",
    "admin.hover.competitions.view":
      "Atvērt šīs sacensības, lai redzētu un ievadītu to spēlētājus un rezultātus",
    "admin.hover.tests.view":
      "Atvērt šo testu, lai redzētu un ievadītu tā rezultātus",
    "admin.hover.teams.view":
      "Atvērt šo komandu, lai redzētu un pārvaldītu tās spēlētājus",
    "admin.hover.dialog.player.add": "Pievienot šo spēlētāju turnīram",
    "admin.hover.dialog.player.save": "Saglabāt izmaiņas šim spēlētājam",
    "admin.hover.dialog.team.add": "Pievienot šo komandu turnīram",
    "admin.hover.dialog.team.save": "Saglabāt izmaiņas šai komandai",
    "admin.hover.dialog.test.add": "Pievienot šo testu turnīram",
    "admin.hover.dialog.test.save": "Saglabāt izmaiņas šim testam",
    "admin.hover.dialog.competition.add": "Pievienot šīs sacensības turnīram",
    "admin.hover.dialog.competition.save": "Saglabāt izmaiņas šīm sacensībām",
    "admin.hover.dialog.score.add": "Pievienot šo rezultātu sacensībām",
    "admin.hover.dialog.score.save": "Saglabāt šī rezultāta labojumu",
    "admin.hover.dialog.carryForward.save": "Pārnest šī spēlētāja rezultātus",
    "admin.hover.dialog.tournament.new": "Izveidot šo turnīru",
    "admin.hover.dialog.tournament.edit": "Saglabāt izmaiņas šim turnīram",
    "admin.hover.modal.cancel": "Aizvērt šo, neko nesaglabājot",
    "admin.hover.modal.ok": "Aizvērt šo ziņojumu",
    "admin.hover.tab": "Rādīt cilni {name}",
    "admin.hover.tournaments.archive": "Arhivēt šo turnīru; to var atjaunot",
    "admin.hover.tournaments.restore": "Atgriezt šo arhivēto turnīru",
    "admin.hover.players.add": "Pievienot spēlētāju šim turnīram",
    "admin.hover.players.addMany":
      "Pievienot šim turnīram vairākus spēlētājus uzreiz",
    "admin.hover.dialog.players.add": "Pievienot šos spēlētājus turnīram",
    "admin.hover.players.edit": "Mainīt šī spēlētāja informāciju",
    "admin.hover.players.up": "Pārvietot šo spēlētāju augstāk sarakstā",
    "admin.hover.players.down": "Pārvietot šo spēlētāju zemāk sarakstā",
    "admin.hover.players.archive": "Arhivēt šo spēlētāju; viņu var atjaunot",
    "admin.hover.players.restore": "Atgriezt šo arhivēto spēlētāju",
    "admin.hover.teams.add": "Pievienot komandu šim turnīram",
    "admin.hover.teams.edit": "Mainīt šīs komandas informāciju",
    "admin.hover.teams.up": "Pārvietot šo komandu augstāk sarakstā",
    "admin.hover.teams.down": "Pārvietot šo komandu zemāk sarakstā",
    "admin.hover.teams.archive": "Arhivēt šo komandu; to var atjaunot",
    "admin.hover.teams.restore": "Atgriezt šo arhivēto komandu",
    "admin.hover.competitions.add": "Pievienot sacensības šim turnīram",
    "admin.hover.competitions.edit": "Mainīt šo sacensību informāciju",
    "admin.hover.competitions.up": "Pārvietot šīs sacensības augstāk sarakstā",
    "admin.hover.competitions.down": "Pārvietot šīs sacensības zemāk sarakstā",
    "admin.hover.competitions.archive":
      "Arhivēt šīs sacensības; tās var atjaunot",
    "admin.hover.competitions.restore": "Atgriezt šīs arhivētās sacensības",
    "admin.hover.tests.add": "Pievienot testu starp divām komandām",
    "admin.hover.tests.edit": "Mainīt šī testa informāciju",
    "admin.hover.tests.up": "Pārvietot šo testu augstāk sarakstā",
    "admin.hover.tests.down": "Pārvietot šo testu zemāk sarakstā",
    "admin.hover.tests.archive": "Arhivēt šo testu; to var atjaunot",
    "admin.hover.tests.restore": "Atgriezt šo arhivēto testu",
    "admin.hover.tests.toTeams":
      "Pāriet uz cilni Komandas, lai pievienotu komandas, kas testam vajadzīgas",
    "admin.hover.scores.add": "Pievienot partijas rezultātu šīm sacensībām",
    "admin.hover.scores.edit": "Labot šo rezultātu",
    "admin.hover.scores.archive":
      "Arhivēt šo rezultātu, lai tas vairs netiktu ieskaitīts; to var atjaunot",
    "admin.hover.scores.restore":
      "Atgriezt šo arhivēto rezultātu, lai tas atkal tiktu ieskaitīts",
    "admin.hover.scores.withdraw":
      "Atstāt šo rezultātu sarakstā, bet vairs neieskaitīt",
    "admin.hover.scores.unwithdraw":
      "Atkal ieskaitīt šo neieskaitīto rezultātu",
    "admin.hover.scores.up": "Pārvietot šo rezultātu sarakstā agrāk",
    "admin.hover.scores.down": "Pārvietot šo rezultātu sarakstā vēlāk",
    "admin.hover.competitionPlayers.add":
      "Ielikt izvēlēto spēlētāju šajās sacensībās",
    "admin.hover.competitionPlayers.up":
      "Pārvietot šo spēlētāju augstāk sarakstā",
    "admin.hover.competitionPlayers.down":
      "Pārvietot šo spēlētāju zemāk sarakstā",
    "admin.hover.competitionPlayers.remove":
      "Izņemt šo spēlētāju no sacensībām",
    "admin.hover.competitionPlayers.withdraw":
      "Izstādīt šo spēlētāju no sacensībām",
    "admin.hover.competitionPlayers.unwithdraw":
      "Ielikt šo izstājušos spēlētāju atpakaļ sacensībās",
    "admin.hover.competitionPlayers.carryForward":
      "Pārnest šī spēlētāja rezultātus no citām sacensībām",
    "admin.hover.notes.add": "Uzrakstīt jaunu piezīmi šim turnīram",
    "admin.hover.notes.edit": "Mainīt šo piezīmi",
    "admin.hover.notes.delete": "Dzēst šo piezīmi",
    "admin.hover.note.add": "Saglabāt šo piezīmi un pievienot to turnīram",
    "admin.hover.note.save": "Saglabāt izmaiņas šajā piezīmē",
    "admin.hover.people.add": "Piešķirt šim cilvēkam lomu",
    "admin.hover.people.remove": "Atņemt šim cilvēkam lomu",
    "admin.hover.worldRankings.import":
      "Atnest pasaules rangus un pievienot to spēlētājus",
    "admin.modal.cancel": "Atcelt",
    // Vienīgā modālā dialoga poga, kas lasītājam tikai ko pasaka.
    "admin.modal.ok": "Labi",
    // Cilnes Pārvaldnieki un Rezultātu ievadītāji, no kurām katra padara kādu
    // par tādu pēc e-pasta adreses un noņem.
    "admin.people.emailAddress": "E-pasta adrese",
    "admin.people.remove": "Noņemt",
    "admin.people.otherwise": "To nevarēja izdarīt.",
    // Blakus lasītāja paša vārdam starp pārvaldniekiem.
    "admin.managers.you": "Jūs",
    "admin.managers.add": "Pievienot pārvaldnieku",
    "admin.managers.email": "Rakstīt pārvaldniekiem e-pastu",
    // Nekad netiek teikts, jo turnīram vienmēr ir pārvaldnieks, bet saraksts
    // saka to, ko tas saka, kad ir tukšs.
    "admin.managers.none": "Nav pārvaldnieku",
    "admin.managers.removeTitle": "Noņemt pārvaldnieku",
    "admin.managers.removeExplanation":
      "{name} vairs nevarēs vadīt šo turnīru.",
    "admin.managers.removeYourself.explanation":
      "Jūs vairs nevarēsiet vadīt šo turnīru, un neviens šeit to nevar atcelt jūsu vietā. Cits pārvaldnieks var jūs atkal padarīt par pārvaldnieku.",
    "admin.managers.otherwise": "Šo adresi nevar padarīt par pārvaldnieku.",
    // Cilne Spēlētāji.
    // Sacensību cilne Spēlētāji.
    "admin.competitionPlayers.add": "Pievienot spēlētāju",
    // Zem nolaižamā saraksta, atteikumam bez savu vārdu.
    "admin.competitionPlayers.otherwise": "Šo spēlētāju nevar pievienot.",
    "admin.competitionPlayers.choose": "Pievienojamais spēlētājs",
    "admin.competitionPlayers.nobody": "Izvēlieties spēlētāju",
    // Piedāvāts izslēgšanas turnīra nolaižamajā sarakstā, un kā bye tiek
    // uzskaitīts.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Visi spēlētāji ir sacensībās",
    "admin.competitionPlayers.none": "Nav spēlētāju",
    "admin.competitionPlayers.up": "Uz augšu",
    "admin.competitionPlayers.down": "Uz leju",
    "admin.competitionPlayers.remove": "Noņemt",
    "admin.competitionPlayers.withdraw": "Izstādīt",
    "admin.competitionPlayers.unwithdraw": "Atcelt izstādīšanu",
    "admin.competitionPlayers.withdrawn": "Izstājušies spēlētāji",
    "admin.competitionPlayers.removeTitle": "Noņemt spēlētāju",
    "admin.competitionPlayers.removeQuestion":
      "{name} tiks izņemts no sacensībām. To nevar atsaukt.",
    "admin.competitionPlayers.withdrawTitle": "Izstādīt spēlētāju",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} vairs nespēlēs sacensībās, un partijas, ko viņš nav nospēlējis, tiks izšķirtas bez viņa.",
    "admin.competitionPlayers.carryForward": "Pārnest",
    // Pārneses dialogs virs sacensību cilnes Spēlētāji.
    "admin.carryForward.title": "Pārnest - {name}",
    "admin.carryForward.save": "Saglabāt",
    // Virs skaitļiem, atteikumam bez savu vārdu.
    "admin.carryForward.otherwise": "Šo pārnesi nevar saglabāt.",
    "admin.carryForward.matchWins": "Uzvarētie mači",
    "admin.carryForward.matchLosses": "Zaudētie mači",
    "admin.carryForward.gameWins": "Uzvarētās partijas",
    "admin.carryForward.gameLosses": "Zaudētās partijas",
    "admin.carryForward.hoopsFor": "Gūtie vārtiņi",
    "admin.carryForward.hoopsAgainst": "Zaudētie vārtiņi",
    "CarryForward.MatchWinsNotWhole": "Ievadiet veselu uzvarēto maču skaitu.",
    "CarryForward.MatchWinsBelowZero": "Ievadiet 0 vai vairāk uzvarētu maču.",
    "CarryForward.MatchLossesNotWhole": "Ievadiet veselu zaudēto maču skaitu.",
    "CarryForward.MatchLossesBelowZero": "Ievadiet 0 vai vairāk zaudētu maču.",
    "CarryForward.GameWinsNotWhole": "Ievadiet veselu uzvarēto partiju skaitu.",
    "CarryForward.GameWinsBelowZero": "Ievadiet 0 vai vairāk uzvarētu partiju.",
    "CarryForward.GameLossesNotWhole":
      "Ievadiet veselu zaudēto partiju skaitu.",
    "CarryForward.GameLossesBelowZero":
      "Ievadiet 0 vai vairāk zaudētu partiju.",
    "CarryForward.HoopsForNotWhole": "Ievadiet veselu gūto vārtiņu skaitu.",
    "CarryForward.HoopsForBelowZero": "Ievadiet 0 vai vairāk gūtu vārtiņu.",
    "CarryForward.HoopsAgainstNotWhole":
      "Ievadiet veselu zaudēto vārtiņu skaitu.",
    "CarryForward.HoopsAgainstBelowZero":
      "Ievadiet 0 vai vairāk zaudētu vārtiņu.",
    // Sacensību cilne Rezultāti un rezultāta dialogs.
    "admin.scores.add": "Pievienot rezultātu",
    "admin.scores.none": "Nav rezultātu",
    "admin.scores.edit": "Labot",
    "admin.scores.drawNotFilledTitle": "Izloze nav aizpildīta",
    "admin.scores.archive": "Arhivēt",
    "admin.scores.up": "Uz augšu",
    "admin.scores.down": "Uz leju",
    "admin.scores.restore": "Atjaunot",
    "admin.scores.archived": "Arhivētie rezultāti",
    "admin.scores.archivedSaid": "Arhivēts",
    "admin.scores.withdraw": "Neieskaitīt",
    "admin.scores.unwithdraw": "Ieskaitīt atkal",
    "admin.scores.withdrawnSaid": "Neieskaitīts",
    // Virs saraksta, atteikumam bez savu vārdu.
    "admin.scores.otherwise": "To nevarēja izdarīt.",
    "admin.score.title": "Pievienot rezultātu",
    "admin.score.add": "Pievienot partiju",
    "admin.score.winner": "Uzvarētājs",
    "admin.score.winnerScore": "Uzvarētāja rezultāts",
    "admin.score.loser": "Zaudētājs",
    "admin.score.loserScore": "Zaudētāja rezultāts",
    "admin.score.beat": "uzvarēja",
    "admin.score.added":
      "Tika pievienota partija, kurā {winner} uzvarēja pret {loser}.",
    "admin.score.otherwise": "Partiju nevarēja pievienot.",
    "admin.score.playersUnread":
      "Spēlētājus nevarēja nolasīt. Aizveriet šo dialogu un atveriet to vēlreiz.",
    "admin.score.correctTitle": "Labot rezultātu",
    "admin.score.save": "Saglabāt",
    "admin.score.notCorrected": "Rezultātu nevarēja izlabot.",
    "Game.WinnerMissing": "Izvēlieties uzvarētāju.",
    "Game.WinnerScoreMissing": "Ievadiet uzvarētāja rezultātu.",
    "Game.LoserMissing": "Izvēlieties zaudētāju.",
    "Game.LoserScoreMissing": "Ievadiet zaudētāja rezultātu.",
    "Score.NoPoints": "Rezultāts sākas ar punktu skaitu.",
    "Game.SamePlayer": "Neviens nespēlē pats pret sevi.",
    "Game.WinnerNotAhead":
      "Uzvarētāja rezultātam jābūt lielākam par zaudētāja vai atzīmētam kā uzvarētam.",
    "Game.LoserMarked": "Zaudētāja rezultātu nevar atzīmēt kā uzvarētu.",
    "Game.ResultChanged":
      "Labojums saglabā iznākumu: uzvarēta partija paliek uzvarēta, un neizšķirta partija paliek neizšķirta.",
    "Competition.MatchDecided": "Viņu mačs jau ir izšķirts.",
    "Competition.DrawFull":
      "Spēlētāju nevar pievienot, jo izslēgšanas turnīrs ir pilns.",
    "Competition.DrawNotFilled":
      "Rezultātus nevar pievienot, kamēr katra izslēgšanas turnīra vieta nav aizpildīta ar spēlētāju vai bye.",
    "Competition.ByeOutsideKnockout": "Bye var būt tikai izslēgšanas turnīrā.",
    "Competition.NotDrawnToMeet":
      "Šiem spēlētājiem pašlaik izslēgšanas turnīrā nav jāspēlē vienam pret otru.",
    "Competition.WinnerHasPlayedOn":
      "Šī mača uzvarētājs jau ir nospēlējis savu nākamo partiju, tāpēc to, kurš uzvarēja, vairs nevar mainīt.",
    "CompetitionPlayer.Withdrawn": "Izstājies spēlētājs vairs nespēlē.",
    "admin.players.add": "Pievienot spēlētāju",
    "admin.players.addMany": "Pievienot spēlētājus",
    "admin.players.none": "Nav spēlētāju",
    "admin.players.edit": "Labot",
    "admin.players.archive": "Arhivēt",
    "admin.players.restore": "Atjaunot",
    "admin.players.up": "Uz augšu",
    "admin.players.down": "Uz leju",
    // Tiek jautāts pirms spēlētāja arhivēšanas, ja viņš ir sacensībās, jo
    // arhivēšana viņu no katrām noņem, bet atjaunošana neieliek atpakaļ.
    "admin.players.archiveTitle": "Arhivēt spēlētāju",
    "admin.players.archiveQuestion": "{name} tiks noņemts no šīm sacensībām:",
    "admin.players.archive.explanation":
      "Atjaunošana viņu šajās sacensībās neieliks atpakaļ.",
    "admin.players.archived": "Arhivētie spēlētāji",
    // Tiek teikts ekrāna lasītājam, jo svītra cauri nosaukumam netiek nolasīta.
    "admin.players.archivedSaid": "Arhivēts",
    // Spēlētāja dialogs.
    "admin.player.addTitle": "Pievienot spēlētāju",
    "admin.player.editTitle": "Labot spēlētāju",
    "admin.player.name": "Vārds",
    "admin.player.handicap": "Handikaps",
    "admin.player.representing": "Pārstāv",
    "admin.player.worldRankingName": "Spēlētāja vārds pasaules rangā",
    // Blakus pasaules ranga vārdam: vai pasaules rangi to zina.
    "admin.player.worldRankingKnown": "Pasaules rangi zina šo vārdu.",
    "admin.player.worldRankingQuestioned":
      "Pasaules rangos nav spēlētāja ar šādu vārdu. Iespējams, tas ir uzrakstīts nepareizi vai spēlētājs rangos ir jauns.",
    "admin.player.flag": "Karogs",
    "admin.player.add": "Pievienot",
    "admin.player.save": "Saglabāt",
    "admin.player.added": "Pievienots: {name}.",
    // Spēlētāju dialogs (players.feature): vairāki spēlētāji, uzrakstīti vienā
    // lodziņā.
    "admin.players.addManyTitle": "Pievienot spēlētājus",
    // Saite dialoga virsraksta joslā uz palīdzību, kas to izskaidro.
    "admin.dialog.help": "Palīdzība",
    "admin.players.many": "Spēlētāji",
    "admin.players.line": "{line}. rinda: {words}",
    "AddPlayers.FieldsMissing": "Uzrakstiet lauku nosaukumus pirmajā rindā.",
    "AddPlayers.FirstRowNotFields":
      "Pirmajai rindai jābūt lauku nosaukumiem, vairāk informācijas skatiet: {help}.",
    "AddPlayers.NameMissing": "Laukos jābūt Name.",
    "AddPlayers.FieldNotAllowed":
      "Lauks var būt Name, Representing, Flag, Handicap vai WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Lauku var nosaukt tikai vienu reizi.",
    "AddPlayers.PlayersMissing": "Uzrakstiet spēlētāju katrā rindā pēc pirmās.",
    "AddPlayers.TooManyPlayers":
      "Sarakstā var būt ne vairāk kā 500 spēlētāju. Pārējos pievienojiet citā sarakstā.",
    "AddPlayers.ValuesMismatched":
      "Katram spēlētājam vajag vērtību vai neko katram laukam, kas nosaukts pirmajā rindā.",
    // Virs laukiem, atteikumam bez savu vārdu.
    "admin.player.otherwise": "Šo spēlētāju nevar saglabāt tādu, kāds viņš ir.",
    "Tournament.PlayerNameTaken":
      "Citam spēlētājam šajā turnīrā jau ir šāds vārds.",
    "TournamentPlayer.NoSuchFlag": "Izvēlieties vienu no esošajiem karogiem.",
    "TournamentPlayer.HandicapMalformed":
      "Handikapu rakstiet kā skaitli. Piemēram: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Spēlētāju nedrīkst saukt par Bye.",
    "TournamentPlayer.NoLetterOrDigit": "Vārdā jābūt burtam vai ciparam.",
    // Dialogs virs spēlētāja dialoga, kad spēlētājs tiek nosaukts par bye.
    "admin.player.byesTitle": "Bye nav jāpievieno",
    "admin.player.byes":
      "Bye nav viens no turnīra spēlētājiem. Izslēgšanas turnīrs piedāvā Bye, kad vien tiek pievienoti tā spēlētāji, tik reižu, cik vajag tā izlozei.",
    // Komandu turnīrs (view.feature): tā cilnes Komandas un Testi, komandas
    // lapa un to dialogi.
    "admin.view.teams": "Komandas",
    "admin.view.tests": "Testi",
    "admin.teams.add": "Pievienot komandu",
    "admin.teams.none": "Nav komandu",
    "admin.teams.edit": "Labot",
    "admin.teams.view": "Skatīt",
    "admin.teams.archive": "Arhivēt",
    "admin.teams.restore": "Atjaunot",
    "admin.teams.up": "Uz augšu",
    "admin.teams.down": "Uz leju",
    "admin.teams.archived": "Arhivētās komandas",
    "admin.teams.archivedSaid": "Arhivēta",
    "admin.team.addTitle": "Pievienot komandu",
    "admin.team.editTitle": "Labot komandu",
    "admin.team.name": "Nosaukums",
    "admin.team.shortName": "Īsais nosaukums",
    "admin.team.shortName.explanation":
      "Ar ko tiek saukti komandas testi, piemēram, AUS v ENG.",
    "admin.team.flag": "Karogs",
    "admin.team.add": "Pievienot",
    "admin.team.save": "Saglabāt",
    "admin.team.added": "Pievienots: {name}.",
    // Virs laukiem, atteikumam bez savu vārdu.
    "admin.team.otherwise": "Šo komandu nevar saglabāt tādu, kāda tā ir.",
    "admin.teamView.otherwise": "Šo komandu nevar redzēt no šejienes.",
    "admin.teamView.players": "Spēlētāji",
    "TeamName.Missing": "Pasakiet, kā komanda tiek saukta.",
    "TeamName.TooLong": "Šis nosaukums ir pārāk garš.",
    "admin.notes.add": "Pievienot piezīmi",
    "admin.notes.none": "Nav piezīmju",
    "admin.notes.edit": "Labot",
    "admin.notes.delete": "Dzēst",
    // Tiek jautāts pirms piezīmes dzēšanas, jo izdzēsta piezīme ir zudusi uz
    // visiem laikiem.
    "admin.notes.deleteTitle": "Dzēst piezīmi",
    "admin.notes.deleteQuestion": "Dzēst piezīmi “{title}”?",
    "admin.notes.delete.explanation":
      "Izdzēsta piezīme ir zudusi uz visiem laikiem, un to nevar atgriezt.",
    // Virs saraksta, atteikumam bez savu vārdu.
    "admin.notes.otherwise": "To nevarēja izdarīt.",
    // Piezīmes dialogs, tās apraksta cilnes un rīkjosla virs tā lodziņa.
    "admin.note.addTitle": "Pievienot piezīmi",
    "admin.note.editTitle": "Labot piezīmi",
    "admin.note.title": "Nosaukums",
    "admin.note.description": "Apraksts",
    "admin.note.write": "Rakstīt",
    "admin.note.preview": "Priekšskatījums",
    "admin.note.toolbar": "Formatēšana",
    "admin.note.tool.heading": "Virsraksts",
    "admin.note.tool.bold": "Treknraksts",
    "admin.note.tool.italic": "Kursīvs",
    "admin.note.tool.quote": "Citāts",
    "admin.note.tool.code": "Kods",
    "admin.note.tool.link": "Saite",
    "admin.note.tool.numberedList": "Numurēts saraksts",
    "admin.note.tool.bulletedList": "Aizzīmju saraksts",
    "admin.note.tool.taskList": "Uzdevumu saraksts",
    "admin.note.add": "Pievienot",
    "admin.note.save": "Saglabāt",
    // Virs laukiem, atteikumam bez savu vārdu.
    "admin.note.otherwise": "Šo piezīmi nevar saglabāt tādu, kāda tā ir.",
    "ManagerNoteTitle.Missing": "Dodiet piezīmei nosaukumu.",
    "ManagerNoteTitle.TooLong": "Šis nosaukums ir pārāk garš.",
    "ManagerNoteTitle.NoLetterOrDigit": "Nosaukumā jābūt burtam vai ciparam.",
    "ManagerNoteDescription.TooLong": "Šis apraksts ir pārāk garš.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Šīs piezīmes vairs nav. Iespējams, cits pārvaldnieks to izdzēsa.",
    "EditManagerNote.NoSuchManagerNote":
      "Šīs piezīmes vairs nav. Iespējams, cits pārvaldnieks to izdzēsa.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Šīs piezīmes vairs nav. Iespējams, cits pārvaldnieks to izdzēsa.",
    "ManagerNote.Deleted":
      "Šī piezīme ir izdzēsta. Iespējams, cits pārvaldnieks to izdzēsa.",
    "CommentaryTitle.Missing": "Dodiet reportāžai nosaukumu.",
    "CommentaryTitle.TooLong": "Šis nosaukums ir pārāk garš.",
    "CommentaryTitle.NoLetterOrDigit": "Nosaukumā jābūt burtam vai ciparam.",
    "Commentary.TitleTaken": "Citai reportāžai jau ir šāds nosaukums.",
    "CommentText.Missing": "Uzrakstiet komentārā kaut ko.",
    "CommentText.TooLong": "Šis komentārs ir pārāk garš.",
    "TeamShortName.Missing": "Dodiet komandai īsu nosaukumu.",
    "TeamShortName.TooLong":
      "Īsajā nosaukumā var būt ne vairāk kā 10 rakstzīmes.",
    "TeamShortName.NoLetterOrDigit":
      "Īsajā nosaukumā jābūt burtam vai ciparam.",
    "Team.ShortNameLongerThanName":
      "Īsais nosaukums nevar būt garāks par komandas nosaukumu.",
    "Team.NoSuchFlag": "Izvēlieties vienu no esošajiem karogiem.",
    "Team.Archived": "Šī komanda ir arhivēta, un vispirms tā jāatjauno.",
    "Team.InATest": "Šī komanda spēlē testā, un to nevar arhivēt.",
    "Team.PlayerNameTaken": "Citam spēlētājam šajā komandā jau ir šāds vārds.",
    "TeamPlayer.NamedBye": "Spēlētāju nedrīkst saukt par Bye.",
    "TeamPlayer.Archived":
      "Šis spēlētājs ir arhivēts, un vispirms viņš jāatjauno.",
    "TeamPlayer.HasGames": "Šis spēlētājs ir spēlējis, un viņu nevar arhivēt.",
    "Tournament.TeamNameTaken":
      "Citai komandai šajā turnīrā jau ir šāds nosaukums.",
    "Tournament.TeamShortNameTaken":
      "Citai komandai šajā turnīrā jau ir šāds īsais nosaukums.",
    "Tournament.NoSuchTeam": "Šajā turnīrā pie šīs adreses nav komandas.",
    "Tournament.TeamArchived":
      "Šī komanda ir arhivēta, un to var atjaunot tikai no cilnes Komandas.",
    "admin.tests.add": "Pievienot testu",
    "admin.tests.none": "Nav testu",
    "admin.tests.edit": "Labot",
    "admin.tests.view": "Skatīt",
    "admin.tests.archive": "Arhivēt",
    "admin.tests.restore": "Atjaunot",
    "admin.tests.up": "Uz augšu",
    "admin.tests.down": "Uz leju",
    "admin.tests.archived": "Arhivētie testi",
    "admin.tests.twoTeamsNeeded":
      "Tests ir starp divām komandām, tāpēc vispirms vajag divas komandas.",
    "admin.tests.toTeams": "Pāriet uz komandām",
    "admin.tests.matches.one": "{count} mačs",
    "admin.tests.matches.other": "Mači: {count}",
    "admin.tests.bestOf": "labākais no {games}",
    // Blakus sarakstam, atteikumam bez savu vārdu.
    "admin.tests.otherwise": "To nevarēja izdarīt.",
    "admin.test.addTitle": "Pievienot testu",
    "admin.test.editTitle": "Labot testu",
    "admin.test.firstTeam": "A komanda",
    "admin.test.secondTeam": "B komanda",
    "admin.test.versus": "pret",
    "admin.test.starts": "Sākas",
    "admin.test.finishes": "Beidzas",
    "admin.test.expectedMatches": "Gaidāmie mači",
    "admin.test.bestOf": "Labākais no",
    "admin.test.group": "Grupa",
    "admin.test.add": "Pievienot",
    "admin.test.save": "Saglabāt",
    "admin.test.added": "Pievienots: {name}.",
    "admin.test.otherwise": "Šo testu nevar saglabāt tādu, kāds tas ir.",
    "admin.testView.otherwise": "Šo testu nevar redzēt no šejienes.",
    "AddTest.FirstTeamMissing": "Izvēlieties pirmo komandu.",
    "AddTest.SecondTeamMissing": "Izvēlieties otro komandu.",
    "UpdateTest.FirstTeamMissing": "Izvēlieties pirmo komandu.",
    "UpdateTest.SecondTeamMissing": "Izvēlieties otro komandu.",
    "ExpectedMatches.NotWhole": "Ievadiet veselu maču skaitu.",
    "ExpectedMatches.TooSmall": "Testā jāgaida vismaz 1 mačs.",
    "TestGroup.TooLong": "Šī grupa ir pārāk gara.",
    "Tournament.TestAgainstItself": "Komanda nespēlē testu pati pret sevi.",
    "Tournament.FormatHasNoGroups": "Šajā formātā tests netiek ielikts grupā.",
    "Tournament.TestFinishesBeforeStarts":
      "Tests nevar beigties pirms tas sākas.",
    "Tournament.TestStartsBeforeTournament":
      "Tests nevar sākties pirms tā turnīra.",
    "Tournament.TestFinishesAfterTournament":
      "Tests nevar beigties pēc tā turnīra.",
    "Tournament.TestHasGamesInUse":
      "Šim testam ir partijas, tāpēc to nevar arhivēt, kamēr tās nav arhivētas.",
    "Tournament.TestHasGames":
      "Šim testam tagad ir partijas, tāpēc tā komandas vairs nevar mainīt.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Jau ir sākts vairāk maču nekā tik.",
    "Tournament.BestOfBelowGamesPlayed":
      "Divi spēlētāji jau ir nospēlējuši vairāk partiju nekā tik.",
    "Competition.ExpectedMatchesReached":
      "Šajā testā jau ir sākts tik maču, cik gaidāms.",
    "Competition.SameTeam":
      "Divi vienas komandas spēlētāji nespēlē viens pret otru.",
    "AddManager.NoSuchAccount":
      "Šai adresei nav konta, ko varētu padarīt par pārvaldnieku.",
    "admin.scorers.add": "Pievienot rezultātu ievadītāju",
    "admin.scorers.none": "Nav rezultātu ievadītāju",
    "admin.scorers.removeTitle": "Noņemt rezultātu ievadītāju",
    "admin.scorers.removeExplanation":
      "{name} vairs nevarēs ievadīt šī turnīra rezultātus.",
    // Zem lauka, atteikumam bez savu vārdu.
    "admin.scorers.otherwise":
      "Šo adresi nevar padarīt par rezultātu ievadītāju.",
    "AddScorer.NoSuchAccount":
      "Šai adresei nav konta, ko varētu padarīt par rezultātu ievadītāju.",
    // Lomu piešķiršana, atņemšana un uzskaitīšana, ko var tikai administrators.
    "Account.NotAnAdministrator": "To var tikai administrators.",
    "AddRole.NoSuchAccount": "Šai adresei nav konta, kam varētu piešķirt lomu.",
    "AddRole.NoSuchRole": "Tādas lomas nav.",
    "RemoveRole.NoSuchAccount": "Tāda konta nav.",
    "RemoveRole.NoSuchRole": "Tādas lomas nav.",
    "RemoveRole.Yourself": "Jūs nevarat atņemt administratora lomu sev.",
    "AccountsWithRole.NoSuchRole": "Tādas lomas nav.",
    "Tournament.AlreadyAManager":
      "Šis konts jau pārvalda turnīru un var darīt visu, ko rezultātu ievadītājs.",

    // Turnīra atteikumi, atslēgti ar to kodiem, kā katrs pārkāpts noteikums.
    // Zem lauka, uz kuru katrs attiecas, vai veidlapas vietā, kur atteikta
    // pati lapa.
    "TournamentName.Missing": "Pasakiet, kā turnīrs tiek saukts.",
    "TournamentName.TooShort": "Šis nosaukums ir pārāk īss.",
    "TournamentName.TooLong": "Šis nosaukums ir pārāk garš.",
    "TournamentName.AllLowerCase":
      "Nosaukums nedrīkst būt tikai ar mazajiem burtiem.",
    "TournamentName.AllCapitals":
      "Nosaukums nedrīkst būt tikai ar lielajiem burtiem.",
    "TournamentName.NoLetterOrDigit": "Nosaukumā jābūt burtam vai ciparam.",
    "ReadOnlyDate.Unreadable": "Norādiet dienu.",
    "Tournament.FinishesBeforeStarts":
      "Turnīrs nevar beigties pirms tas sākas.",
    "Tournament.StartsAfterNextYear": "Turnīrs nevar sākties pēc nākamā gada.",
    "Tournament.FinishesAfterNextYear":
      "Turnīrs nevar beigties pēc nākamā gada.",
    "CreateTournament.NoSuchCountry": "Izvēlieties valsti.",
    "TournamentSubtitle.TooLong":
      "Apakšvirsraksts nedrīkst būt garāks par 2000 rakstzīmēm.",
    "Tournament.NotAManager": "Šo turnīru var mainīt tikai tā pārvaldnieks.",
    "Tournament.NotAManagerOrScorer":
      "Šo turnīru var redzēt tikai tā pārvaldnieks vai rezultātu ievadītājs.",
    "Tournament.Archived":
      "Šis turnīrs ir arhivēts, un tas tiek atjaunots, pirms to var mainīt.",
    "UpdateTournament.NoSuchTournament": "Pie šīs adreses nav turnīra.",

    // Ko turnīrs tiek spēlēts un kur, pēc koda, kā API tos piedāvā
    // administrēšanas veidlapai.
    "sport.ac": "Asociācijas krokets",
    "sport.gc": "Golfa krokets",
    "sport.a6w": "Amerikāņu 6 vārtiņu krokets",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standarta",
    "format.teams": "Komandas",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC pasaules komandu čempionāts",
    "country.ad": "Andora",
    "country.ae": "Apvienotie Arābu Emirāti",
    "country.af": "Afganistāna",
    "country.ag": "Antigva un Barbuda",
    "country.ai": "Angilja",
    "country.al": "Albānija",
    "country.am": "Armēnija",
    "country.ao": "Angola",
    "country.ar": "Argentīna",
    "country.as": "ASV Samoa",
    "country.at": "Austrija",
    "country.au": "Austrālija",
    "country.aw": "Aruba",
    "country.ax": "Olandes salas",
    "country.az": "Azerbaidžāna",
    "country.ba": "Bosnija un Hercegovina",
    "country.bb": "Barbadosa",
    "country.bd": "Bangladeša",
    "country.be": "Beļģija",
    "country.bf": "Burkinafaso",
    "country.bg": "Bulgārija",
    "country.bh": "Bahreina",
    "country.bi": "Burundija",
    "country.bj": "Benina",
    "country.bm": "Bermudu salas",
    "country.bn": "Bruneja",
    "country.bo": "Bolīvija",
    "country.br": "Brazīlija",
    "country.bs": "Bahamu salas",
    "country.bt": "Butāna",
    "country.bv": "Buvē sala",
    "country.bw": "Botsvāna",
    "country.by": "Baltkrievija",
    "country.bz": "Beliza",
    "country.ca": "Kanāda",
    "country.catalonia": "Katalonija",
    "country.cc": "Kokosu (Kīlinga) salas",
    "country.cd": "Kongo Demokrātiskā Republika",
    "country.cf": "Centrālāfrikas Republika",
    "country.cg": "Kongo Republika",
    "country.ch": "Šveice",
    "country.ci": "Kotdivuāra",
    "country.ck": "Kuka salas",
    "country.cl": "Čīle",
    "country.cm": "Kamerūna",
    "country.cn": "Ķīna",
    "country.co": "Kolumbija",
    "country.cr": "Kostarika",
    "country.cu": "Kuba",
    "country.cv": "Kaboverde",
    "country.cx": "Ziemsvētku sala",
    "country.cy": "Kipra",
    "country.cz": "Čehija",
    "country.de": "Vācija",
    "country.dj": "Džibutija",
    "country.dk": "Dānija",
    "country.dm": "Dominika",
    "country.do": "Dominikāna",
    "country.dz": "Alžīrija",
    "country.ec": "Ekvadora",
    "country.ee": "Igaunija",
    "country.eg": "Ēģipte",
    "country.eh": "Rietumsahāra",
    "country.england": "Anglija",
    "country.er": "Eritreja",
    "country.es": "Spānija",
    "country.et": "Etiopija",
    "country.fi": "Somija",
    "country.fj": "Fidži",
    "country.fk": "Folklenda salas",
    "country.fm": "Mikronēzija",
    "country.fo": "Fēru salas",
    "country.fr": "Francija",
    "country.ga": "Gabona",
    "country.gb": "Apvienotā Karaliste",
    "country.gd": "Grenāda",
    "country.ge": "Gruzija",
    "country.gf": "Franču Gviāna",
    "country.gh": "Gana",
    "country.gi": "Gibraltārs",
    "country.gl": "Grenlande",
    "country.gm": "Gambija",
    "country.gn": "Gvineja",
    "country.gp": "Gvadelupa",
    "country.gq": "Ekvatoriālā Gvineja",
    "country.gr": "Grieķija",
    "country.gs": "Dienviddžordžija un Dienvidsendviču salas",
    "country.gt": "Gvatemala",
    "country.gu": "Guama",
    "country.gw": "Gvineja-Bisava",
    "country.gy": "Gajāna",
    "country.hk": "Honkonga",
    "country.hm": "Hērda sala un Makdonalda salas",
    "country.hn": "Hondurasa",
    "country.hr": "Horvātija",
    "country.ht": "Haiti",
    "country.hu": "Ungārija",
    "country.id": "Indonēzija",
    "country.ie": "Īrija",
    "country.il": "Izraēla",
    "country.im": "Mena",
    "country.in": "Indija",
    "country.io": "Britu Indijas okeāna teritorija",
    "country.iq": "Irāka",
    "country.ir": "Irāna",
    "country.is": "Īslande",
    "country.it": "Itālija",
    "country.je": "Džērsija",
    "country.jm": "Jamaika",
    "country.jo": "Jordānija",
    "country.jp": "Japāna",
    "country.ke": "Kenija",
    "country.kg": "Kirgizstāna",
    "country.kh": "Kambodža",
    "country.ki": "Kiribati",
    "country.km": "Komoru salas",
    "country.kn": "Sentkitsa un Nevisa",
    "country.kp": "Ziemeļkoreja",
    "country.kr": "Dienvidkoreja",
    "country.kw": "Kuveita",
    "country.ky": "Kaimanu salas",
    "country.kz": "Kazahstāna",
    "country.la": "Laosa",
    "country.lb": "Libāna",
    "country.lc": "Sentlūsija",
    "country.li": "Lihtenšteina",
    "country.lk": "Šrilanka",
    "country.lr": "Libērija",
    "country.ls": "Lesoto",
    "country.lt": "Lietuva",
    "country.lu": "Luksemburga",
    "country.lv": "Latvija",
    "country.ly": "Lībija",
    "country.ma": "Maroka",
    "country.mc": "Monako",
    "country.md": "Moldova",
    "country.me": "Melnkalne",
    "country.mg": "Madagaskara",
    "country.mh": "Māršala salas",
    "country.mk": "Ziemeļmaķedonija",
    "country.ml": "Mali",
    "country.mm": "Mjanma",
    "country.mn": "Mongolija",
    "country.mo": "Makao",
    "country.mp": "Ziemeļu Marianas salas",
    "country.mq": "Martinika",
    "country.mr": "Mauritānija",
    "country.ms": "Montserrata",
    "country.mt": "Malta",
    "country.mu": "Maurīcija",
    "country.mv": "Maldīvu salas",
    "country.mw": "Malāvija",
    "country.mx": "Meksika",
    "country.my": "Malaizija",
    "country.mz": "Mozambika",
    "country.na": "Namībija",
    "country.nc": "Jaunkaledonija",
    "country.ne": "Nigēra",
    "country.nf": "Norfolkas sala",
    "country.ng": "Nigērija",
    "country.ni": "Nikaragva",
    "country.nl": "Nīderlande",
    "country.no": "Norvēģija",
    "country.np": "Nepāla",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Jaunzēlande",
    "country.om": "Omāna",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Franču Polinēzija",
    "country.pg": "Papua-Jaungvineja",
    "country.ph": "Filipīnas",
    "country.pk": "Pakistāna",
    "country.pl": "Polija",
    "country.pm": "Senpjēra un Mikelona",
    "country.pn": "Pitkērnas salas",
    "country.pr": "Puertoriko",
    "country.ps": "Palestīna",
    "country.pt": "Portugāle",
    "country.pw": "Palau",
    "country.py": "Paragvaja",
    "country.qa": "Katara",
    "country.re": "Reinjona",
    "country.ro": "Rumānija",
    "country.rs": "Serbija",
    "country.ru": "Krievija",
    "country.rw": "Ruanda",
    "country.sa": "Saūda Arābija",
    "country.sb": "Zālamana salas",
    "country.sc": "Seišelu salas",
    "country.scotland": "Skotija",
    "country.sd": "Sudāna",
    "country.se": "Zviedrija",
    "country.sg": "Singapūra",
    "country.sh": "Svētās Helēnas sala",
    "country.si": "Slovēnija",
    "country.sj": "Svalbāra un Jana Majena sala",
    "country.sk": "Slovākija",
    "country.sl": "Sjerraleone",
    "country.sm": "Sanmarīno",
    "country.sn": "Senegāla",
    "country.so": "Somālija",
    "country.sr": "Surinama",
    "country.st": "Santome un Prinsipi",
    "country.sv": "Salvadora",
    "country.sy": "Sīrija",
    "country.sz": "Esvatini",
    "country.tc": "Tērksas un Kaikosas salas",
    "country.td": "Čada",
    "country.tf": "Franču Dienvidu teritorijas",
    "country.tg": "Togo",
    "country.th": "Taizeme",
    "country.tj": "Tadžikistāna",
    "country.tk": "Tokelau",
    "country.tl": "Austrumtimora",
    "country.tm": "Turkmenistāna",
    "country.tn": "Tunisija",
    "country.to": "Tonga",
    "country.tr": "Turcija",
    "country.tt": "Trinidada un Tobāgo",
    "country.tv": "Tuvalu",
    "country.tw": "Taivāna",
    "country.tz": "Tanzānija",
    "country.ua": "Ukraina",
    "country.ug": "Uganda",
    "country.um": "ASV Mazās Aizjūras salas",
    "country.us": "Amerikas Savienotās Valstis",
    "country.uy": "Urugvaja",
    "country.uz": "Uzbekistāna",
    "country.va": "Vatikāns",
    "country.vc": "Sentvinsenta un Grenadīnas",
    "country.ve": "Venecuēla",
    "country.vg": "Britu Virdžīnu salas",
    "country.vi": "ASV Virdžīnu salas",
    "country.vn": "Vjetnama",
    "country.vu": "Vanuatu",
    "country.wales": "Velsa",
    "country.wf": "Volisa un Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemena",
    "country.yt": "Majota",
    "country.za": "Dienvidāfrika",
    "country.zm": "Zambija",
    "country.zw": "Zimbabve",

    // E-pasts ir divi ieraksti: tā tēma, kas ir teksts, un tā saturs, kas ir
    // visa tā iezīmēšana. Šī ir vienīgā vieta, kur katalogs satur iezīmēšanu, un
    // tā to satur tāpēc, ka e-pasts tiek rakstīts un tulkots kā rakstīts
    // darbs, nevis kā frāžu saraksts, ko kaut kur citur sakārto: tas, kas to
    // raksta, redz to, ko redzēs tā lasītājs. Tikai tas, kas aizpilda e-pastu,
    // tiek apstrādāts, lai nekas tajā ievadītais nevarētu kļūt par iezīmēšanu;
    // iezīmēšana šeit ir vietnes pašas. {link} ir saite, ko e-pasts nes,
    // {site} vietnes adrese saitei uz kādu tās lapu, {buttonBackgroundColour}
    // un {buttonTextColour} tas, ar ko poga ir krāsota, {emailFromName} vārds,
    // no kura vietnes e-pasti tiek sūtīti un ar ko katrs e-pasts tiek parakstīts,
    // un {siteName} tas, kā vietne tiek saukta, tāpat kā tās lapas. Pēdējie
    // četri ir vietnes paša un tos aizpilda rakstītājs, nekad tas, kas e-pastu
    // ielika rindā. Poga tiek krāsota turpat, kur tā stāv, jo pasta programma
    // nelasa stilu lapu. Nekas neuzrunā lasītāju vārdā, lai rindā nebūtu
    // jāliek nekas par cilvēku, izņemot adresi, uz kuru e-pasts iet.

    "Email.ConfirmAddress.subject":
      "Apstipriniet savu e-pasta adresi vietnei {siteName}",
    "Email.ConfirmAddress.body": `
<p>Sveiki,</p>

<p>
    Paldies, ka izveidojāt kontu vietnē <strong>{siteName}</strong>.<br />
    Pirms varat sākt lietot savu kontu, lūdzu, apstipriniet savu e-pasta adresi,
    noklikšķinot uz pogas zemāk:
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
        Apstiprināt manu e-pasta adresi
    </a>
</p>

<p>
    Ja poga nedarbojas, savu e-pasta adresi varat apstiprināt arī, atverot šo saiti pārlūkā:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ja jūs šo kontu neveidojāt, varat droši ignorēt šo e-pastu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Jauna saite e-pasta adreses apstiprināšanai vietnei {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Sveiki,</p>

<p>
    Nesen jūs pieprasījāt jaunu e-pastu, lai apstiprinātu savu e-pasta adresi vietnei <strong>{siteName}</strong>.<br />
    Lūdzu, apstipriniet savu e-pasta adresi, noklikšķinot uz pogas zemāk:
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
        Apstiprināt manu e-pasta adresi
    </a>
</p>

<p>
    Ja poga nedarbojas, savu e-pasta adresi varat apstiprināt arī, atverot šo saiti pārlūkā:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Kad adrese būs apstiprināta, jūs varēsiet turpināt lietot savu kontu bez pārtraukuma.
</p>

<p>
    Ja jūs šo e-pastu nepieprasījāt, varat to droši ignorēt.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Kāds mēģināja reģistrēties ar jūsu e-pasta adresi",
    "Email.AlreadyRegistered.body": `
<p>Sveiki,</p>

<p>
    Kāds mēģināja reģistrēties vietnē <strong>{siteName}</strong>, izmantojot šo
    e-pasta adresi, kurai jau ir konts. Jūsu kontā nekas nav mainījies.<br />
    Ja tas bijāt jūs, jums jau ir konts, un jūs varat tajā pierakstīties:
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
        Pierakstīties
    </a>
</p>

<p>
    Ja esat aizmirsis paroli, varat to atiestatīt šeit:
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
        Aizmirsu paroli
    </a>
</p>

<p>
    Ja tas nebijāt jūs, jums nekas nav jādara. Neviens nav saņēmis ceļu uz
    jūsu kontu.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Apstipriniet sava {siteName} konta pārcelšanu uz šo adresi",
    "Email.ConfirmNewEmailAddress.body": `
<p>Sveiki,</p>

<p>
    Kāds, kas bija pierakstījies <strong>{siteName}</strong> kontā, lūdza to
    pārcelt uz šo e-pasta adresi. Ja tas bijāt jūs, apstipriniet to šeit,
    būdams pierakstījies šajā kontā. Saite darbojas 24 stundas.
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
        Pārcelt manu kontu
    </a>
</p>

<p>
    Vai nokopējiet šo adresi savā pārlūkā:<br />
    {link}
</p>

<p>
    Ja tas nebijāt jūs, jums nekas nav jādara. Neviens konts uz šejieni netiks pārcelts.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Kāds lūdza pārcelt kontu uz jūsu e-pasta adresi",
    "Email.AlreadyHasAnAccount.body": `
<p>Sveiki,</p>

<p>
    Kāds, kas bija pierakstījies <strong>{siteName}</strong> kontā, lūdza to
    pārcelt uz šo e-pasta adresi, kurai jau ir savs konts. Nekas nav pārcelts,
    un jūsu kontā nekas nav mainījies.
</p>

<p>
    Ja tas bijāt jūs, jums pie šīs adreses jau ir konts, un jūs varat tajā
    pierakstīties.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject": "Jūsu {siteName} konts ir pārcelts",
    "Email.EmailAddressChanged.body": `
<p>Sveiki,</p>

<p>
    Jūsu <strong>{siteName}</strong> konts tikko tika pārcelts uz citu e-pasta
    adresi, {emailAddress}, un no šī brīža pierakstās ar to.
</p>

<p>
    Ja tas nebijāt jūs, jūsu kontam ir piekļuvis kāds cits. Atbildiet uz šo
    e-pastu un pastāstiet mums.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Jūsu {siteName} parole tika nomainīta",
    "Email.PasswordChanged.body": `
<p>Sveiki,</p>

<p>
    Jūsu <strong>{siteName}</strong> konta parole tikko tika nomainīta, un
    katrs cits pārlūks, kas tajā bija pierakstījies, tika izrakstīts.<br />
    Ja tas bijāt jūs, jums nekas nav jādara.
</p>

<p>
    Ja tas nebijāt jūs, jūsu parole ir kādam citam. Iestatiet jaunu šeit, un
    viņš tiks izrakstīts:
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
        Aizmirsu paroli
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Iestatiet jaunu paroli vietnei {siteName}",
    "Email.SetNewPassword.body": `
<p>Sveiki,</p>

<p>
    Nesen jūs pieprasījāt atiestatīt savu paroli vietnei <strong>{siteName}</strong>.<br />
    Paroli varat atiestatīt, noklikšķinot uz pogas zemāk:
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
        Atiestatīt paroli
    </a>
</p>

<p>
    Ja poga nedarbojas, paroli varat atiestatīt arī, atverot šo saiti pārlūkā:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Ja jūs paroles atiestatīšanu nepieprasījāt, varat šo e-pastu droši ignorēt.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Iestatiet paroli vietnei {siteName}",
    "Email.SetPassword.body": `
<p>Sveiki,</p>

<p>
    Jūsu <strong>{siteName}</strong> kontam nav paroles: jūs pierakstāties ar Google.<br />
    Jūs lūdzāt to iestatīt, lai varētu pierakstīties arī ar e-pasta adresi un paroli.
    To varat iestatīt, noklikšķinot uz pogas zemāk:
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
        Iestatīt paroli
    </a>
</p>

<p>
    Ja poga nedarbojas, paroli varat iestatīt arī, atverot šo saiti pārlūkā:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Saite darbojas vienu stundu. Ja jūs paroles iestatīšanu nelūdzāt, varat šo e-pastu droši ignorēt.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject": "Šai e-pasta adresei nav {siteName} konta",
    "Email.RegisterInstead.body": `
<p>Sveiki,</p>

<p>
    Tika iesniegts pieprasījums atiestatīt paroli e-pasta adresei, kas nav
    saistīta ar kontu vietnē <strong>{siteName}</strong>.
</p>

<p>
    Ja vēlaties izmantot mūsu pakalpojumu, varat izveidot jaunu kontu, apmeklējot:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Ja jūs šo pieprasījumu neiesniedzāt, varat šo e-pastu droši ignorēt.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Apstipriniet, ka jūsu {siteName} konts jāaizmirst",
    "Email.ConfirmForgetting.body": `
<p>Sveiki,</p>

<p>
    Jūs lūdzāt, lai jūsu <strong>{siteName}</strong> konts tiktu
    aizmirsts.<br />
    Atveriet pogu zemāk, lai redzētu, ko tas nozīmē, un droši pateiktu,
    ka to vēlaties:
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
        Aizmirst manu kontu
    </a>
</p>

<p>
    Ja poga nedarbojas, varat atvērt arī šo saiti pārlūkā:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Kad konts būs aizmirsts, jūsu vārdu un e-pasta adresi nekad vairs nevarēs
    izlasīt neviens, un kontā nevarēs pierakstīties. To nevar atsaukt.
</p>

<p>
    Saite darbojas vienu reizi, līdz 15 minūtēm pēc tam, kad to pieprasījāt, un
    tikai tad, kamēr esat pierakstījies šajā kontā. Pēc tam pieprasiet vēlreiz
    no sava konta.
</p>

<p>
    Ja jūs to nelūdzāt, nekas nenotiks, ja saite netiks atvērta.
    Tomēr kāds, kas bija pierakstījies jūsu kontā, to lūdza, tāpēc iestatiet jaunu paroli
    no lapas Aizmirsu paroli, lai pārliecinātos, ka viņš vairs nevar pierakstīties.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Reģistrēšanās ir apturēta: nevar sazināties ar {service}",
    "Email.RegistrationsSuspended.body": `
<p>Sveiki,</p>

<p>
    {siteName} plkst. {when} nevarēja sazināties ar {service}. Kamēr tas neatbild,
    lasītājiem, kam tas vajadzīgs, lai reģistrētos vai iestatītu jaunu paroli,
    tiek teikts mēģināt vēlāk.
</p>

<p>
    Nekas nav jāatceļ. Katrs mēģinājums pieprasa {service} no jauna, un lapas
    atkal darbojas, tiklīdz tas atbild.
</p>

<p>
    Kamēr {service} nedarbojas, par to saņemsiet e-pastu ne biežāk kā reizi
    stundā.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} nevar sasniegt savu datubāzi",
    "Email.DatabaseUnreachable.body": `
<p>Sveiki,</p>

<p>
    {siteName} plkst. {when} nevarēja sasniegt savu datubāzi. Kamēr tā neatbild, katra lapa, kam tā vajadzīga, saka lasītājiem, ka vietne nav pieejama un jāmēģina vēlāk.
</p>

<p>
    Nekas nav jāatceļ. Katrs pieprasījums pieprasa savienojumu no jauna, un vietne atkal darbojas, tiklīdz datubāze atbild.
</p>

<p>
    Kamēr datubāze nedarbojas, par to saņemsiet e-pastu ne biežāk kā reizi {minutes} minūtēs.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject":
      "{siteName} neizdevās apstrādāt pieprasījumu",
    "Email.UnhandledError.body": `
<p>Sveiki,</p>

<p>
    {siteName} plkst. {when} neizdevās apstrādāt pieprasījumu par {asked}. Lasītājam tika parādīta atsauce {reference}, un žurnālā zem tās ir cēlonis.
</p>

<p>
    Salauzta vietne parasti neizdodas ar katru pieprasījumu, tāpēc par neveiksmēm saņemsiet e-pastu ne vairāk kā 4 reizes stundā. Pārējās tik un tā ir žurnālā.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
