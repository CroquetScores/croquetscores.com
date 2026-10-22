// The site's words in Polish. Keyed as the English catalogue is, which is what
// a word missing here falls back to.
//
// Written to the reader as ty rather than Pan or Pani: the site talks to
// people scoring and following croquet, and the English it is written from is
// plain and direct rather than formal. Polish past tenses and the words for a
// signed in person carry the reader's gender, which the site does not know, so
// they are put in the present tense or turned around ("Wylogowano cię") rather
// than guessed at. Items in menus and on buttons are written in sentence case,
// as Polish writes them, where the English capitalises each word.
//
// Polish counts three ways (1 mecz, 2 mecze, 5 meczów) where a count here has
// only a singular and a plural, so a count is put after a label ("Mecze: 3")
// where saying it with a noun would be wrong for some numbers. The croquet
// words are the ones Polish players use: bramka for a hoop, partia for a game,
// mecz for a match, and wolny los for a bye.
import type { Language } from "../common/language.js";

export const polish: Language = {
  tag: "pl",
  name: "Polski",
  words: {
    "site.skipToContent": "Przejdź do treści",
    "navigation.menu": "Menu",
    "navigation.label": "Główna",
    "navigation.home": "Strona główna",
    "navigation.help": "Pomoc",
    "navigation.admin": "Administracja",
    "sections.label": "Sekcje",
    "theme.label": "Motyw",
    "theme.light": "Jasny",
    "theme.dark": "Ciemny",
    "theme.system": "Systemowy",
    "footer.donate": "Wesprzyj",
    "footer.plea":
      "Podoba ci się {siteName}? Wesprzyj nas darowizną, by pomóc w dalszym rozwoju.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Prywatność",
    "footer.termsOfUse": "Warunki korzystania",
    "beta.banner":
      "To jest strona w wersji beta. Dane mogą zostać zresetowane w dowolnej chwili.",
    "privacy.contact":
      "Pytania o tę stronę lub o to, co jest o tobie przechowywane: {emailAddress}",
    "termsOfUse.agree": "Akceptuję warunki korzystania",
    "termsOfUse.link": "warunki korzystania",
    "termsOfUse.report":
      "Zgłoś to, co zostało napisane, lub zapytaj o te warunki: {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Zaznacz pole, aby zaakceptować warunki korzystania.",
    "tryWebsite.banner":
      "To bezpieczne miejsce do nauki {siteName}. Wszystko, co tu wpiszesz, może zostać usunięte w dowolnej chwili.",

    "language.label": "Język",
    "language.choose": "Zmień",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Jest coś nowego do przeczytania.",
    "whatsNew.admin.message": "Jest coś nowego dla osób prowadzących turnieje.",
    "whatsNew.view": "Zobacz, co nowego",
    "whatsNew.later": "Przypomnij mi następnym razem",
    "whatsNew.never": "Nigdy więcej nie pokazuj tego komunikatu",

    "form.otherwise":
      "Coś tu się nie zgadza. Sprawdź wpisane dane i spróbuj ponownie.",

    "account.menu": "Konto",
    "account.register": "Zarejestruj się",
    "account.signIn": "Zaloguj się",
    "account.forgotPassword": "Nie pamiętam hasła",
    "account.signOut": "Wyloguj się",
    "account.profile": "Profil",
    "account.changePassword": "Zmień hasło",
    "account.changeEmailAddress": "Zmień adres e-mail",
    "account.changeName": "Zmień imię i nazwisko",
    "account.setPassword": "Ustaw hasło",
    "account.forgetAccount": "Zapomnij konto",

    "register.title": "Rejestracja",
    "register.emailAddress": "Adres e-mail",
    "register.submit": "Zarejestruj się",
    "register.withGoogle": "Zarejestruj się przez Google",
    "register.or": "lub",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google nie potwierdziło, że ten adres e-mail należy do ciebie, więc nie można go tu użyć z Google. Użyj zamiast tego swojego adresu e-mail poniżej.",
    "SignInWithGoogle.LinkedToAnother":
      "Ten adres e-mail ma już konto, połączone z innym kontem Google. Zaloguj się tym kontem Google albo swoim adresem e-mail i hasłem.",
    "SignInWithGoogle.NameMissing":
      "Google nie podało nam twojego imienia i nazwiska, a konto go wymaga. Użyj zamiast tego swojego adresu e-mail poniżej.",
    "Google.Unreachable":
      "Nie udało się teraz połączyć z Google. Spróbuj ponownie za kilka minut albo użyj swojego adresu e-mail poniżej.",
    "Registration.NotAPerson":
      "To nie wyglądało na działanie człowieka. Spróbuj ponownie, a jeśli to się powtarza, poczekaj kilka minut i wróć.",

    "EmailAddress.Missing": "Wpisz adres e-mail.",
    "EmailAddress.NoAt": "Adres e-mail zawiera znak @.",
    "EmailAddress.MoreThanOneAt": "Adres e-mail zawiera tylko jeden znak @.",
    "EmailAddress.NoDomain":
      "Adres e-mail ma po znaku @ domenę, na przykład example.com.",

    "welcome.title": "Sprawdź pocztę",
    "welcome.checkEmail":
      "Wiadomość e-mail jest już w drodze na podany adres. Kliknij zawarty w niej link, aby przejść dalej.",
    "welcome.nothingArrived":
      "Jeśli przez kilka minut nic nie przyjdzie, zajrzyj do folderu ze spamem.",
    "welcome.home": "Wróć do {siteName}",
    "newConfirmationLink.title": "Nowy link",
    "newConfirmationLink.explanation":
      "Link potwierdzający twój adres e-mail wygasł. Poproś o nowy, a zostanie wysłany na adres, którego użyto przy rejestracji.",
    "newConfirmationLink.send": "Wyślij mi nowy link",
    "newConfirmationLink.home": "Wróć do {siteName}",
    "newConfirmationLink.signIn": "Zaloguj się",
    "newConfirmationLink.sent.title": "Sprawdź pocztę",
    "newConfirmationLink.sent.explanation":
      "Nowy link jest w drodze. Kliknij go, aby potwierdzić swój adres e-mail. Jeśli przez kilka minut nic nie przyjdzie, zajrzyj do folderu ze spamem.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Ten adres e-mail jest już potwierdzony",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Nie ma już nic do potwierdzenia. Zaloguj się hasłem podanym przy potwierdzaniu.",
    "newConfirmationLink.noLongerWorks.title": "Ten link już nie działa",
    "newConfirmationLink.noLongerWorks.explanation":
      "Sprawdź, czy użyto całego linku z wiadomości, bez brakującego końca. Jeśli nadal nie działa, zarejestruj się ponownie, a zostanie wysłany nowy link.",
    "newConfirmationLink.tooMany.title": "Spróbuj później",
    "newConfirmationLink.tooMany.explanation":
      "Na ten adres wysłano ostatnio kilka linków. Odczekaj godzinę i poproś ponownie, a w międzyczasie zajrzyj do folderu ze spamem.",

    "forgotPassword.title": "Nie pamiętasz hasła?",
    "forgotPassword.emailAddress": "Adres e-mail",
    "forgotPassword.submit": "Wyślij mi sposób na odzyskanie dostępu",
    "forgotPassword.home": "Wróć do {siteName}",
    "forgotPassword.sent.title": "Sprawdź pocztę",
    "forgotPassword.sent.explanation":
      "Jeśli ten adres ma konto, link do ustawienia nowego hasła jest już w drodze. Kliknij go w ciągu godziny. Jeśli przez kilka minut nic nie przyjdzie, zajrzyj do folderu ze spamem.",
    "forgotPassword.tryAgainLater":
      "Z tego miejsca poproszono ostatnio o zbyt wiele linków do odzyskania dostępu. Odczekaj godzinę i spróbuj ponownie.",

    "setNewPassword.title": "Ustaw nowe hasło",
    "setNewPassword.password": "Hasło",
    "setNewPassword.confirmPassword": "Potwierdź hasło",
    "setNewPassword.submit": "Ustaw moje nowe hasło",
    "setNewPassword.home": "Wróć do {siteName}",
    "setNewPassword.signIn": "Zaloguj się",
    "setNewPassword.askAgain": "Poproś o nowy link",
    "setNewPassword.changed.title": "Twoje hasło zostało zmienione",
    "setNewPassword.changed.explanation":
      "Wylogowano cię ze wszystkich miejsc, w których to konto było używane. Zaloguj się nowym hasłem.",
    "setNewPassword.expired.title": "Ten link wygasł",
    "setNewPassword.expired.explanation":
      "Link do ustawienia nowego hasła działa przez godzinę. Poproś o kolejny, a zostanie wysłany na ten sam adres.",
    "setNewPassword.noLongerWorks.title": "Ten link już nie działa",
    "setNewPassword.noLongerWorks.explanation":
      "Mógł już zostać użyty albo może brakować jego końca. Jeśli nadal go potrzebujesz, poproś o kolejny.",

    "BreachedPasswords.Unreachable":
      "Nie można teraz sprawdzić twojego hasła, więc nie zostało zmienione. Spróbuj ponownie za kilka minut; twój link działa do chwili wygaśnięcia.",

    "forgetAccount.title": "Zapomnij swoje konto",
    "forgetAccount.explanation":
      "Twoje imię i nazwisko oraz adres e-mail można na stałe uczynić nieczytelnymi, a konto zamknąć. Aby mieć pewność, że to ty, najpierw wyślemy link na adres twojego konta, i nic nie zostanie zapomniane, dopóki go nie klikniesz.",
    "forgetAccount.submit": "Wyślij mi link",
    "forgetAccount.sent.title": "Sprawdź pocztę",
    "forgetAccount.sent.explanation":
      "Wysłaliśmy link na adres twojego konta. Działa przez 15 minut i tylko po zalogowaniu na to konto.",
    "forgetAccount.confirm.title": "Zapomnieć twoje konto na zawsze?",
    "forgetAccount.confirm.explanation":
      "Po zapomnieniu nikt nigdy nie odczyta już twojego imienia i nazwiska ani adresu e-mail, a na konto nie będzie można się zalogować. Tego nie da się cofnąć.",
    "forgetAccount.confirm.submit": "Zapomnij moje konto",
    "forgetAccount.forgotten.title": "Twoje konto zostało zapomniane",
    "forgetAccount.forgotten.explanation":
      "Twojego imienia i nazwiska oraz adresu e-mail nie da się już odczytać, a z konta wylogowano cię ze wszystkich miejsc.",
    "forgetAccount.noLongerWorks.title": "Ten link już nie działa",
    "forgetAccount.noLongerWorks.explanation":
      "Mógł wygasnąć, zostać już użyty albo dotyczyć konta innego niż to, na które się zalogowano. Jeśli nadal chcesz zapomnieć konto, poproś ponownie ze swojego konta.",
    "forgetAccount.lastAdministrator.title":
      "Twojego konta nie można zapomnieć",
    "forgetAccount.lastAdministrator.explanation":
      "Jesteś jedynym administratorem tej strony. Nadaj rolę administratora komuś innemu, a wtedy twoje konto będzie można zapomnieć.",
    "forgetAccount.askAgain": "Poproś ponownie",
    "forgetAccount.home": "Wróć do {siteName}",

    "registrationsSuspended.title": "Rejestracja jest chwilowo wstrzymana",
    "registrationsSuspended.explanation":
      "Nie można teraz połączyć się z usługą potrzebną do rejestracji, więc nikt nie może się zarejestrować, dopóki nie zacznie odpowiadać. Nic z tego, co wpisano, nie zostało zachowane.",
    "registrationsSuspended.tryAgainLater":
      "Spróbuj ponownie za jakiś czas. Administrator strony został powiadomiony.",
    "registrationsSuspended.home": "Wróć do {siteName}",

    "signIn.title": "Logowanie",
    "signIn.emailAddress": "Adres e-mail",
    "signIn.password": "Hasło",
    "signIn.submit": "Zaloguj się",
    "signIn.forgotPassword": "Nie pamiętasz hasła?",
    "signIn.register": "Zarejestruj się",
    "signIn.withGoogle": "Zaloguj się przez Google",
    "signIn.or": "lub",
    "signIn.tryAgainLater":
      "Ostatnio podjęto zbyt wiele prób. Odczekaj godzinę i spróbuj ponownie.",

    "SignIn.Failed":
      "Adres e-mail lub hasło są nieprawidłowe. Spróbuj ponownie.",

    "profile.title": "Profil",
    "profile.name": "Imię i nazwisko:",
    "profile.emailAddress": "Adres e-mail:",

    "changeName.title": "Zmień imię i nazwisko",
    "changeName.name": "Imię i nazwisko",
    "changeName.submit": "Zmień imię i nazwisko",

    "setPassword.title": "Ustaw hasło",
    "setPassword.explanation":
      "Twoje konto nie ma hasła: logujesz się przez Google. Aby móc logować się także hasłem, wyślemy na adres {emailAddress} link do jego ustawienia.",
    "setPassword.submit": "Wyślij mi link",
    "setPassword.sent.title": "Sprawdź pocztę",
    "setPassword.sent.explanation":
      "Wysłaliśmy ci link do ustawienia hasła. Działa przez godzinę.",
    "setPassword.profile": "Wróć do profilu",

    "changePassword.title": "Zmień hasło",
    "changePassword.currentPassword": "Obecne hasło",
    "changePassword.password": "Nowe hasło",
    "changePassword.passwordConfirmation": "Potwierdź hasło",
    "changePassword.forgotPassword": "Nie pamiętasz hasła?",
    "changePassword.submit": "Zmień hasło",
    "ChangePassword.WrongPassword": "To nie jest twoje hasło.",

    "changeEmailAddress.title": "Zmień adres e-mail",
    "changeEmailAddress.emailAddress": "Nowy adres e-mail",
    "changeEmailAddress.currentPassword": "Obecne hasło",
    "changeEmailAddress.submit": "Wyślij link potwierdzający",
    "changeEmailAddress.sent.title": "Sprawdź pocztę",
    "changeEmailAddress.sent.explanation":
      "Link potwierdzający przeniesienie został wysłany na nowy adres e-mail. Kliknij go po zalogowaniu, aby przenieść tam swoje konto.",
    "changeEmailAddress.confirm.title": "Przenieś swoje konto",
    "changeEmailAddress.confirm.explanation":
      "Twoje konto zostanie przeniesione na adres {emailAddress}. Od tej pory będziesz logować się tym adresem.",
    "changeEmailAddress.confirm.submit": "Przenieś moje konto",
    "changeEmailAddress.noLongerWorks.title": "Ten link już nie działa",
    "changeEmailAddress.noLongerWorks.explanation":
      "Wygasł, został już użyty albo nie został wysłany dla konta, na które się zalogowano. Poproś ponownie ze swojego profilu.",
    "changeEmailAddress.taken.title": "Twoje konto nie zostało przeniesione",
    "changeEmailAddress.profile": "Wróć do profilu",
    "ChangeEmailAddress.WrongPassword": "To nie jest twoje hasło.",
    "ChangeEmailAddress.Unchanged": "Twoje konto ma już ten adres.",
    "ChangeEmailAddress.Taken":
      "Ten adres e-mail ma już własne konto, więc twojego nie można tam przenieść.",

    "confirmEmailAddress.title": "Potwierdź swój adres e-mail",
    "confirmEmailAddress.name": "Imię i nazwisko",
    "confirmEmailAddress.password": "Hasło",
    "confirmEmailAddress.confirmPassword": "Potwierdź hasło",
    "confirmEmailAddress.submit": "Potwierdzam mój adres e-mail",
    "confirmEmailAddress.signIn": "Zaloguj się",
    "confirmEmailAddress.home": "Wróć do {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Twój adres e-mail został potwierdzony",
    "confirmEmailAddress.confirmed.explanation":
      "Twoje konto jest gotowe. Zaloguj się adresem e-mail i hasłem, które właśnie podano.",
    "confirmEmailAddress.expired.title": "Ten link wygasł",
    "confirmEmailAddress.expired.explanation":
      "Link potwierdzający adres e-mail działa przez 24 godziny. Poproś o nowy, a zostanie wysłany na ten sam adres.",
    "confirmEmailAddress.expired.newLink": "Wyślij mi nowy link",
    "confirmEmailAddress.noLongerWorks.title": "Ten link już nie działa",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Sprawdź, czy użyto całego linku z wiadomości, bez brakującego końca. Jeśli nadal nie działa, zarejestruj się ponownie, a zostanie wysłany nowy link.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Ten adres e-mail jest już potwierdzony",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Nie ma już nic do zrobienia. Zaloguj się hasłem podanym przy potwierdzaniu.",

    "PersonName.Missing": "Wpisz imię i nazwisko.",
    "PersonName.TooShort": "Imię i nazwisko musi mieć co najmniej 3 znaki.",
    "PersonName.TooLong": "Imię i nazwisko może mieć co najwyżej 254 znaki.",
    "WorldRankingName.TooShort":
      "Nazwa w rankingu światowym musi mieć co najmniej 3 znaki.",
    "WorldRankingName.TooLong":
      "Nazwa w rankingu światowym może mieć co najwyżej 254 znaki.",
    "Password.Missing": "Wpisz hasło.",
    "Password.TooShort": "Hasło musi mieć co najmniej 12 znaków.",
    "Password.ConfirmationDiffers":
      "To nie jest to samo co hasło powyżej. Wpisz je ponownie.",
    "Password.Breached":
      "To hasło pojawiło się gdzieś indziej w wycieku danych, więc nie jest bezpieczne w użyciu tutaj. Wybierz inne.",

    "javaScriptRequired.title": "Potrzebne skrypty",
    "javaScriptRequired.explanation":
      "Rejestracja wymaga włączonych skryptów na tej stronie, aby można było sprawdzić, że rejestruje się człowiek. Włącz je i zarejestruj się ponownie.",
    "javaScriptRequired.register": "Wróć do rejestracji",
    "javaScriptRequired.home": "Wróć do {siteName}",

    "errors.backHome": "Wróć do {siteName}",
    "errors.notFound": "Nie znaleziono",
    "errors.refused": "Nie można tego zrobić",
    "errors.refusedDetail": "Coś w wysłanych danych było nieprawidłowe.",
    "errors.sorry": "Przepraszamy",
    "errors.sorryDetail": "Nie udało się obsłużyć tego żądania.",
    "errors.failed": "Coś poszło nie tak",
    "errors.reference": "Numer referencyjny {reference}.",
    "errors.recorded":
      "Błąd został zapisany w dzienniku, a do administratora wysłano e-mail. Pomoże, jeśli napiszesz do administratora e-mail z numerem referencyjnym i opisem tego, co robisz.",
    "errors.message": "Napisz e-mail do administratora",
    "errors.messageSubject": "Błąd {reference} w serwisie {siteName}",
    "errors.messageBody": "Co się działo, gdy to się stało:\n\n",
    "errors.unavailable": "Serwis jest niedostępny",
    "errors.unavailableDetail":
      "Serwis nie może teraz połączyć się z tym, czego potrzebuje. Spróbuj ponownie później.",
    "errors.maintenance":
      "Serwis jest wyłączony z powodu prac konserwacyjnych.",
    "errors.maintenanceMinutes": "Powinien wrócić za {minutes} min.",
    "errors.maintenanceMinute": "Powinien wrócić za 1 min.",
    "errors.maintenanceLonger":
      "Trwa to dłużej, niż oczekiwano; serwis wróci wkrótce.",

    "home.recentResults": "Ostatnie wyniki",
    "home.recentResults.none":
      "W ciągu ostatnich siedmiu dni nie dodano żadnych partii.",
    "home.upcomingTournaments": "Nadchodzące turnieje",
    "home.upcomingTournaments.none":
      "Żaden turniej nie zaczyna się w ciągu najbliższych sześćdziesięciu dni.",
    "home.allTournaments": "Wszystkie turnieje w roku {year}",
    "year.heading": "Turnieje w roku {year}",
    "year.none": "Żaden turniej nie zaczyna się w roku {year}.",
    "yearSport.heading": "Turnieje {sport} w roku {year}",
    "yearSport.none": "Żaden turniej {sport} nie zaczyna się w roku {year}.",
    "tournament.recent": "Ostatnie",
    "tournament.summary": "Podsumowanie",
    "test.bestOf": "Każdy mecz: najlepszy z {count} partii.",
    "test.vs": "vs",
    "test.matches": "Mecze",
    "test.games": "Partie",
    "test.hoops": "Bramki",
    "teamSummary.tests": "Testy",
    "teamSummary.matches": "Mecze",
    "teamSummary.games": "Partie",
    "teamSummary.hoops": "Bramki",
    "teamSummary.wins": "Wygrane",
    "teamSummary.losses": "Przegrane",
    "teamSummary.draws": "Remisy",
    "teamSummary.for": "Zdobyte",
    "teamSummary.against": "Stracone",
    "teamSummary.net": "Bilans",
    "tournament.players": "Zawodnicy",
    "search.label": "Szukaj",
    "search.tournaments": "Turnieje",
    "search.competitions": "Konkurencje",
    "search.nothingFound": "Nic nie znaleziono.",
    "players.search.label": "Szukaj zawodników",
    "players.search.prompt": "Wpisz nazwisko zawodnika, aby go znaleźć.",
    "players.search.none": "Nie znaleziono zawodników.",
    "search.more":
      "Wyświetlono tylko pierwsze {count}. Wpisz więcej nazwy, aby zawęzić wyszukiwanie.",
    "websitePlayer.tournament": "Turniej",
    "tournament.test": "{first} vs {second}",
    "tournament.notes": "Notatki",
    "tournament.commentary": "Relacja",
    // The present tense, since "beat" in the past carries the player's gender.
    "tournament.beat": "wygrywa z",
    "tournament.drewWith": "remisuje z",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 godz.",
    "tournament.ago.hours": "{count} godz.",
    "tournament.none": "Nie rozegrano jeszcze żadnych partii.",
    "players.none": "Nie dodano jeszcze żadnych zawodników.",
    "commentaries.by": "autor:",
    "commentaries.start": "Rozpocznij nową relację",
    "startCommentary.title": "Rozpocznij nową relację",
    "startCommentary.titleField": "Tytuł",
    "startCommentary.submit": "Rozpocznij relację",
    "marks.new": "nowe",
    "notes.none": "Organizatorzy nie napisali jeszcze żadnych notatek.",
    "note.edited": "edytowano",
    "commentary.none": "Nie napisano jeszcze żadnych komentarzy.",
    "commentary.edited": "edytowano",
    "commentary.edit": "Edytuj",
    "commentary.delete": "Usuń",
    "commentary.comment": "Komentarz",
    "commentary.add": "Dodaj komentarz",
    "commentary.notSent":
      "Nie udało się wysłać komentarza. Załaduj stronę ponownie, aby sprawdzić, czy został zachowany.",
    "changeCommentaryTitle.title": "Zmień tytuł",
    "changeCommentaryTitle.submit": "Zapisz",
    "editComment.title": "Edytuj komentarz",
    "editComment.save": "Zapisz",
    "deleteComment.title": "Usuń komentarz",
    "deleteComment.question": "Usunąć ten komentarz? Tego nie da się cofnąć.",
    "deleteComment.confirm": "Usuń komentarz",
    "deleteComment.keep": "Zostaw go",
    "player.games": "Partie",
    "player.competitions": "Konkurencje",
    "player.beat": "wygrywa z",
    "player.lostTo": "przegrywa z",
    "player.drewWith": "remisuje z",
    "player.score": "{score} do {opponent}",
    "player.noGames": "Nie rozegrano jeszcze żadnych partii.",
    "player.noCompetitions": "Nie zgłoszono jeszcze do żadnej konkurencji.",
    "block.wins": "Wygrane",
    "block.matches": "Mecze",
    "block.netGames": "Bilans partii",
    "block.games": "Partie",
    "block.netHoops": "Bilans bramek",
    "block.won": "wygrana",
    "block.lost": "przegrana",
    "block.drawn": "remis",
    "block.withdrawn": "wycofany",
    // A game withdrawn, which Polish says otherwise than a player.
    "block.gameWithdrawn": "wycofana",
    "block.losses": "Przegrane",
    "competition.views": "Widoki",
    "competition.view.grid": "Tabela",
    "competition.view.summary": "Podsumowanie",
    "competition.view.orderOfPlay": "Kolejność gier",
    "blockSummary.ranking":
      "Uszeregowano według odsetka wygranych meczów, a następnie bilansu bramek. Regulamin turnieju może ustalać kolejność zawodników inaczej.",
    "orderOfPlay.none": "Nie rozegrano jeszcze żadnych partii.",
    "knockout.round.final": "Finał",
    "knockout.round.semis": "Półfinały",
    "knockout.round.quarters": "Ćwierćfinały",
    "knockout.round.number": "Runda {number}",
    "knockout.bye": "Wolny los",
    "swiss.games": "Partie",
    "swiss.wins": "Wygrane",
    "swiss.winShare": "% wygranych",
    "swiss.results": "Wyniki",
    "knockout.onward": "Dalsze rundy",
    "knockout.back": "Wcześniejsze rundy",
    "tournamentList.column.date": "Data",
    "tournamentList.column.name": "Nazwa",
    "tournamentList.onlyIn": "Tylko turnieje w kraju: {country}",
    "tournamentList.filter.country": "Kraj",
    "tournamentList.filter.anyCountry": "Dowolny kraj",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Dowolny region",
    "tournamentList.filter.sport": "Dyscyplina",
    "tournamentList.filter.anySport": "Dowolna dyscyplina",
    "tournamentList.filter.submit": "Filtruj",
    "years.label": "Lata",
    "years.earlier": "Wcześniejsze lata",

    "admin.newerBuild.message": "Dostępna jest nowsza wersja tej strony.",
    "admin.newerBuild.reload": "Załaduj ponownie",
    "admin.title": "Administracja",
    "admin.tournaments.new": "Nowy turniej",
    "admin.tournaments.none": "Brak turniejów",
    "admin.tournaments.archived": "Zarchiwizowany",
    "admin.tournaments.manage": "Zarządzaj",
    "admin.tournaments.edit": "Edytuj",
    "admin.tournaments.archive": "Archiwizuj",
    "admin.tournaments.restore": "Przywróć",
    "admin.tournaments.scores": "Wyniki",
    "admin.tournaments.players": "Zawodnicy",
    "admin.years.label": "Lata",
    "admin.years.earlier": "Wcześniejsze lata",
    "admin.tournament.name": "Nazwa",
    "admin.tournament.starts": "Początek",
    "admin.tournament.finishes": "Koniec",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Dyscyplina",
    "admin.tournament.country": "Kraj",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Podtytuł",
    "admin.rules.handicap": "Rozgrywany z handicapami",
    "admin.rules.drawsAllowed": "Dopuszcza remisy",
    "admin.tournament.levelTestsDrawn": "Wyrównane testy kończą się remisem",
    "admin.rules.worldRankings": "Liczy się do rankingów światowych",
    "admin.tournament.national": "Wydarzenie rangi krajowej",
    "admin.tournament.international": "Wydarzenie rangi międzynarodowej",
    "admin.tournament.otherwise": "Tego nie można przyjąć w tej postaci.",
    "admin.newTournament.title": "Nowy turniej",
    "admin.newTournament.submit": "Utwórz turniej",
    "admin.editTournament.title": "Edytuj turniej",
    "admin.editTournament.submit": "Zaktualizuj turniej",
    "admin.editTournament.otherwise": "Tego turnieju nie można zmienić.",
    "admin.view.tabs": "Turniej",
    "admin.view.players": "Zawodnicy",
    "admin.view.competitions": "Konkurencje",
    "admin.view.managers": "Organizatorzy",
    "admin.view.notes": "Notatki",
    "admin.view.scorers": "Wprowadzający wyniki",
    "admin.view.rankings": "Rankingi",
    "admin.rankings.file":
      "Wyniki turnieju są wysyłane do rankingu światowego jako plik tekstowy, który strona tworzy z wprowadzonych gier.",
    "admin.rankings.download": "Pobierz rankingi",
    "rankings.notAvailable": "Rankingi są niedostępne",
    "rankings.notAvailable.sport":
      "Dyscyplina tego turnieju nie ma rankingu światowego, więc nie ma rankingów do wysłania.",
    "rankings.notAvailable.notCounted":
      "Żadne z zawodów tego turnieju nie liczy się do światowego rankingu.",
    "admin.view.otherwise": "Tym turniejem nie można stąd zarządzać.",
    "admin.competitionView.tabs": "Konkurencja",
    "admin.competitionView.players": "Zawodnicy",
    "admin.competitionView.scores": "Wyniki",
    "admin.sections.label": "Turniej i jego konkurencje",
    "admin.sections.tournament": "Turniej",
    "admin.administrator.sections.label": "Strony administratora",
    "admin.administrator.sections.tournaments": "Turnieje",
    "admin.administrator.sections.accounts": "Konta",
    "admin.administrator.sections.worldRankings": "Rankingi światowe",
    "admin.administrator.sections.importErrors": "Błędy importu",
    "admin.administrator.sections.logs": "Dzienniki",
    "admin.administrator.sections.databaseStatus": "Dostęp do bazy danych",
    "admin.databaseStatus.title": "Dostęp do bazy danych",
    "admin.databaseStatus.on": "Dostęp do bazy danych jest włączony.",
    "admin.databaseStatus.off": "Dostęp do bazy danych jest wyłączony.",
    "admin.databaseStatus.expected":
      "Przewidywany czas powrotu witryny: {minutes} min.",
    "admin.databaseStatus.expectedOne":
      "Przewidywany czas powrotu witryny: 1 min.",
    "admin.databaseStatus.longer": "Trwa to dłużej, niż przewidywano.",
    "admin.databaseStatus.told": "Czytelnicy widzą: {words}",
    "admin.databaseStatus.toldUsual": "Czytelnicy widzą zwykłe zdanie.",
    "admin.databaseStatus.minutes": "Przewidywane minuty",
    "admin.databaseStatus.words": "Tekst dla czytelników",
    "admin.databaseStatus.turnOff": "Wyłącz",
    "admin.databaseStatus.change": "Zmień",
    "admin.databaseStatus.turnOn": "Włącz",
    "admin.databaseStatus.minutesNeeded": "Podaj liczbę minut.",
    "admin.databaseStatus.otherwise": "Coś poszło nie tak w witrynie.",
    "DatabaseAccess.MinutesNotWhole": "Liczba minut musi być liczbą całkowitą.",
    "DatabaseAccess.MinutesOutOfRange":
      "Liczba minut musi mieścić się w zakresie od 1 do 1440.",
    "DatabaseAccess.WordsTooLong": "Tekst może mieć najwyżej 500 znaków.",
    "DatabaseAccess.NotOff": "Dostęp do bazy danych nie jest wyłączony.",
    "admin.administrator.title": "Administrator",
    "admin.accounts.title": "Konta",
    "admin.roles.add": "Dodaj",
    "admin.roles.administrator.heading": "Administratorzy",
    "admin.roles.administrator.none": "Brak innych administratorów",
    "admin.roles.administrator.removeTitle": "Usuń administratora",
    "admin.roles.administrator.removeExplanation":
      "{name} nie będzie już administratorem tej strony.",
    "admin.roles.world-ranking-officer.heading":
      "Odpowiedzialni za rankingi światowe",
    "admin.roles.world-ranking-officer.none":
      "Brak osób odpowiedzialnych za rankingi światowe",
    "admin.roles.world-ranking-officer.removeTitle":
      "Usuń osobę odpowiedzialną za rankingi światowe",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} nie będzie już osobą odpowiedzialną za rankingi światowe.",
    "admin.worldRankings.title": "Import zawodników z rankingów światowych",
    "admin.worldRankings.import": "Importuj",
    "admin.worldRankings.log": "Jak poszedł import",
    "admin.worldRankings.ac.reading": "Odczyt listy association croquet",
    "admin.worldRankings.ac.read":
      "Odczytani zawodnicy association croquet: {players}",
    "admin.worldRankings.ac.kept":
      "Zachowani zawodnicy association croquet: {players}",
    "admin.worldRankings.ac.refused":
      "Nie udało się odczytać listy association croquet, więc jej zawodników pozostawiono bez zmian.",
    "admin.worldRankings.gc.reading": "Odczyt listy golf croquet",
    "admin.worldRankings.gc.read":
      "Odczytani zawodnicy golf croquet: {players}",
    "admin.worldRankings.gc.kept":
      "Zachowani zawodnicy golf croquet: {players}",
    "admin.worldRankings.gc.refused":
      "Nie udało się odczytać listy golf croquet, więc jej zawodników pozostawiono bez zmian.",
    "admin.worldRankings.finished": "Zakończono",
    "admin.worldRankings.failed": "Import nie został dokończony.",
    "admin.worldRankings.otherwise": "Coś poszło nie tak na stronie.",
    "WorldRankingLists.Unreachable":
      "Nie udało się połączyć ze stroną rankingów światowych.",
    "WorldRankingLists.Unreadable":
      "Lista nie ma układu, w jakim rankingi światowe ją zapisują: nie dało się odczytać jednego z jej wierszy, nikogo na niej nie ma albo nie jest zapisana w UTF-8.",
    "admin.importErrors.title": "Błędy importu",
    "admin.importErrors.none": "Brak błędów importu",
    "admin.importErrors.otherwise": "Coś poszło nie tak na stronie.",
    "admin.logs.title": "Dzienniki",
    "admin.logs.severity": "Ważność",
    "admin.logs.text": "Szukaj",
    "admin.logs.show": "Pokaż",
    "admin.logs.prune": "Wyczyść",
    "admin.logs.pruneAsk":
      "Usunąć dziennik sprzed ostatniej godziny? Nic go nie przywróci.",
    "admin.logs.removed": "Usunięto wpisów: {count}",
    "admin.logs.none": "Brak wpisów w dzienniku",
    "admin.logs.otherwise": "Coś poszło nie tak na stronie.",
    "admin.hover.logs.show": "Pokaż pasujące wpisy",
    "admin.hover.logs.prune": "Usuń dziennik sprzed ostatniej godziny",
    "admin.hover.logs.pruneAgree": "Usuń dziennik sprzed ostatniej godziny",
    "admin.importError.title": "Błąd importu",
    "admin.importError.documentId": "Identyfikator dokumentu",
    "admin.importError.tournament": "Turniej",
    "admin.importError.competition": "Konkurencja",
    "admin.importError.newSite": "Nowa strona",
    "admin.importError.oldSite": "Stara strona",
    "ImportErrorKept.NotFound":
      "Import nie zachował żadnego błędu dla tego dokumentu.",
    "admin.competitionView.otherwise":
      "Tą konkurencją nie można stąd zarządzać.",
    "admin.competitions.block": "Blok",
    "admin.competitions.knockout": "System pucharowy",
    "admin.competitions.swiss": "System szwajcarski",
    "admin.competitions.view": "Zobacz",
    "admin.competitions.edit": "Edytuj",
    "admin.competitions.up": "W górę",
    "admin.competitions.down": "W dół",
    "admin.competitions.archive": "Archiwizuj",
    "admin.competitions.restore": "Przywróć",
    "admin.competitions.archived": "Zarchiwizowane konkurencje",
    "admin.competitions.none": "Brak konkurencji",
    "admin.competitions.add": "Dodaj konkurencję",
    "admin.competition.addTitle": "Dodaj konkurencję",
    "admin.competition.editTitle": "Edytuj konkurencję",
    "admin.competition.name": "Nazwa",
    "admin.competition.kind": "Rodzaj",
    "admin.competition.bestOf": "Najlepszy z",
    "admin.competition.rounds": "Rundy",
    "admin.competition.places": "Miejsca",
    "admin.competition.round": "Runda {number}",
    "admin.competition.bestOfs": "Najlepszy z, według rund",
    "admin.competition.quarters": "Ćwierćfinały",
    "admin.competition.semis": "Półfinały",
    "admin.competition.final": "Finał",
    "admin.competition.add": "Dodaj",
    "admin.competition.save": "Zapisz",
    "admin.competition.added": "Dodano: {name}.",
    "admin.competition.otherwise":
      "Tej konkurencji nie można zachować w tej postaci.",
    "CompetitionName.Missing": "Wpisz nazwę.",
    "CompetitionName.TooLong": "Nazwa może mieć co najwyżej 254 znaki.",
    "CompetitionName.NoLetterOrDigit": "Nazwa musi zawierać literę lub cyfrę.",
    "Tournament.KnockoutPlayerHasGames":
      "Zawodnicy w tym losowaniu mają rozegrane partie, więc jego miejsc nie można zmienić.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Rundy z rozstrzygniętym meczem nie można skrócić.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Rundy nie można zmienić, gdy w późniejszej rundzie rozegrano już partię.",
    "Tournament.CompetitionNameTaken":
      "Inna konkurencja w tym turnieju ma już taką nazwę.",
    "BestOf.NotWhole": "Wpisz całkowitą liczbę partii.",
    "BestOf.TooSmall":
      "Mecz musi być rozgrywany w systemie najlepszy z co najmniej 1 partii.",
    "Rounds.NotWhole": "Wpisz całkowitą liczbę rund.",
    "Rounds.TooSmall": "Blok musi być rozgrywany w co najmniej 1 rundzie.",
    "KnockoutDraw.EvenBestOf":
      "Mecz pucharowy musi mieć zwycięzcę, więc rozgrywa się go w systemie najlepszy z nieparzystej liczby partii.",
    "admin.hover.tournaments.new": "Utwórz nowy turniej",
    "admin.hover.tournaments.manage":
      "Zarządzaj zawodnikami, drużynami, konkurencjami i wynikami tego turnieju",
    "admin.hover.tournaments.edit": "Zmień szczegóły tego turnieju",
    "admin.hover.tournaments.scores": "Wprowadź wyniki tego turnieju",
    "admin.hover.tournaments.players": "Zajmij się zawodnikami tego turnieju",
    "admin.hover.competitions.view":
      "Otwórz tę konkurencję, aby zobaczyć i wprowadzać jej zawodników i wyniki",
    "admin.hover.tests.view":
      "Otwórz ten test, aby zobaczyć i wprowadzać jego wyniki",
    "admin.hover.teams.view":
      "Otwórz tę drużynę, aby zobaczyć jej zawodników i nimi zarządzać",
    "admin.hover.dialog.player.add": "Dodaj tego zawodnika do turnieju",
    "admin.hover.dialog.player.save": "Zachowaj zmiany tego zawodnika",
    "admin.hover.dialog.team.add": "Dodaj tę drużynę do turnieju",
    "admin.hover.dialog.team.save": "Zachowaj zmiany tej drużyny",
    "admin.hover.dialog.test.add": "Dodaj ten test do turnieju",
    "admin.hover.dialog.test.save": "Zachowaj zmiany tego testu",
    "admin.hover.dialog.competition.add": "Dodaj tę konkurencję do turnieju",
    "admin.hover.dialog.competition.save": "Zachowaj zmiany tej konkurencji",
    "admin.hover.dialog.score.add": "Dodaj ten wynik do konkurencji",
    "admin.hover.dialog.score.save": "Zachowaj poprawkę tego wyniku",
    "admin.hover.dialog.carryForward.save": "Przenieś wyniki tego zawodnika",
    "admin.hover.dialog.tournament.new": "Utwórz ten turniej",
    "admin.hover.dialog.tournament.edit": "Zachowaj zmiany tego turnieju",
    "admin.hover.modal.cancel": "Zamknij bez zachowywania czegokolwiek",
    "admin.hover.modal.ok": "Zamknij tę wiadomość",
    "admin.hover.tab": "Pokaż kartę {name}",
    "admin.hover.tournaments.archive":
      "Zarchiwizuj ten turniej; można go przywrócić",
    "admin.hover.tournaments.restore": "Przywróć ten zarchiwizowany turniej",
    "admin.hover.players.add": "Dodaj zawodnika do tego turnieju",
    "admin.hover.players.edit": "Zmień szczegóły tego zawodnika",
    "admin.hover.players.up": "Przesuń tego zawodnika w górę listy",
    "admin.hover.players.down": "Przesuń tego zawodnika w dół listy",
    "admin.hover.players.archive":
      "Zarchiwizuj tego zawodnika; można go przywrócić",
    "admin.hover.players.restore": "Przywróć tego zarchiwizowanego zawodnika",
    "admin.hover.teams.add": "Dodaj drużynę do tego turnieju",
    "admin.hover.teams.edit": "Zmień szczegóły tej drużyny",
    "admin.hover.teams.up": "Przesuń tę drużynę w górę listy",
    "admin.hover.teams.down": "Przesuń tę drużynę w dół listy",
    "admin.hover.teams.archive": "Zarchiwizuj tę drużynę; można ją przywrócić",
    "admin.hover.teams.restore": "Przywróć tę zarchiwizowaną drużynę",
    "admin.hover.competitions.add": "Dodaj konkurencję do tego turnieju",
    "admin.hover.competitions.edit": "Zmień szczegóły tej konkurencji",
    "admin.hover.competitions.up": "Przesuń tę konkurencję w górę listy",
    "admin.hover.competitions.down": "Przesuń tę konkurencję w dół listy",
    "admin.hover.competitions.archive":
      "Zarchiwizuj tę konkurencję; można ją przywrócić",
    "admin.hover.competitions.restore":
      "Przywróć tę zarchiwizowaną konkurencję",
    "admin.hover.tests.add": "Dodaj test między dwiema drużynami",
    "admin.hover.tests.edit": "Zmień szczegóły tego testu",
    "admin.hover.tests.up": "Przesuń ten test w górę listy",
    "admin.hover.tests.down": "Przesuń ten test w dół listy",
    "admin.hover.tests.archive": "Zarchiwizuj ten test; można go przywrócić",
    "admin.hover.tests.restore": "Przywróć ten zarchiwizowany test",
    "admin.hover.tests.toTeams":
      "Przejdź do karty Drużyny, aby dodać drużyny potrzebne do testu",
    "admin.hover.scores.add": "Dodaj wynik partii do tej konkurencji",
    "admin.hover.scores.edit": "Popraw ten wynik",
    "admin.hover.scores.archive":
      "Zarchiwizuj ten wynik, aby przestał się liczyć; można go przywrócić",
    "admin.hover.scores.restore":
      "Przywróć ten zarchiwizowany wynik, aby znów się liczył",
    "admin.hover.scores.withdraw":
      "Zostaw ten wynik na liście, ale przestań go liczyć",
    "admin.hover.scores.unwithdraw":
      "Spraw, by ten wycofany wynik znów się liczył",
    "admin.hover.scores.up": "Przesuń ten wynik wcześniej na liście",
    "admin.hover.scores.down": "Przesuń ten wynik później na liście",
    "admin.hover.competitionPlayers.add":
      "Dodaj wybranego zawodnika do tej konkurencji",
    "admin.hover.competitionPlayers.up": "Przesuń tego zawodnika w górę listy",
    "admin.hover.competitionPlayers.down": "Przesuń tego zawodnika w dół listy",
    "admin.hover.competitionPlayers.remove":
      "Usuń tego zawodnika z konkurencji",
    "admin.hover.competitionPlayers.withdraw":
      "Wycofaj tego zawodnika z konkurencji",
    "admin.hover.competitionPlayers.unwithdraw":
      "Przywróć tego wycofanego zawodnika do konkurencji",
    "admin.hover.competitionPlayers.carryForward":
      "Przenieś wyniki tego zawodnika z innej konkurencji",
    "admin.hover.notes.add": "Napisz nową notatkę do tego turnieju",
    "admin.hover.notes.edit": "Zmień tę notatkę",
    "admin.hover.notes.delete": "Usuń tę notatkę",
    "admin.hover.note.add": "Zachowaj tę notatkę i dodaj ją do turnieju",
    "admin.hover.note.save": "Zachowaj zmiany tej notatki",
    "admin.hover.people.add": "Nadaj tej osobie rolę",
    "admin.hover.people.remove": "Odbierz tej osobie rolę",
    "admin.hover.worldRankings.import":
      "Pobierz rankingi światowe i dodaj ich zawodników",
    "admin.modal.cancel": "Anuluj",
    "admin.modal.ok": "OK",
    "admin.people.emailAddress": "Adres e-mail",
    "admin.people.remove": "Usuń",
    "admin.people.otherwise": "Nie można tego zrobić.",
    "admin.managers.you": "Ty",
    "admin.managers.add": "Dodaj organizatora",
    "admin.managers.none": "Brak organizatorów",
    "admin.managers.removeTitle": "Usuń organizatora",
    "admin.managers.removeExplanation":
      "{name} straci możliwość prowadzenia tego turnieju.",
    "admin.managers.removeYourself.explanation":
      "Utracisz możliwość prowadzenia tego turnieju i nikt tutaj nie może tego cofnąć. Inny organizator może ponownie uczynić cię organizatorem.",
    "admin.managers.otherwise": "Nie można uczynić tego adresu organizatorem.",
    "admin.competitionPlayers.add": "Dodaj zawodnika",
    "admin.competitionPlayers.otherwise": "Tego zawodnika nie można dodać.",
    "admin.competitionPlayers.choose": "Zawodnik do dodania",
    "admin.competitionPlayers.nobody": "Wybierz zawodnika",
    "admin.competitionPlayers.bye": "Wolny los",
    "admin.competitionPlayers.all": "Każdy zawodnik jest w konkurencji",
    "admin.competitionPlayers.none": "Brak zawodników",
    "admin.competitionPlayers.up": "W górę",
    "admin.competitionPlayers.down": "W dół",
    "admin.competitionPlayers.remove": "Usuń",
    "admin.competitionPlayers.withdraw": "Wycofaj",
    "admin.competitionPlayers.unwithdraw": "Cofnij wycofanie",
    "admin.competitionPlayers.withdrawn": "Wycofani zawodnicy",
    "admin.competitionPlayers.removeTitle": "Usuń zawodnika",
    "admin.competitionPlayers.removeQuestion":
      "Zawodnik {name} zostanie usunięty z konkurencji. Tego nie da się cofnąć.",
    "admin.competitionPlayers.withdrawTitle": "Wycofaj zawodnika",
    "admin.competitionPlayers.withdrawQuestion":
      "Zawodnik {name} nie zagra już w tej konkurencji, a partie, których nie rozegrano, zostaną rozstrzygnięte bez niego.",
    "admin.competitionPlayers.carryForward": "Przenieś wyniki",
    "admin.carryForward.title": "Przenieś wyniki – {name}",
    "admin.carryForward.save": "Zapisz",
    "admin.carryForward.otherwise":
      "Nie można zachować tego przeniesienia wyników.",
    "admin.carryForward.matchWins": "Wygrane mecze",
    "admin.carryForward.matchLosses": "Przegrane mecze",
    "admin.carryForward.gameWins": "Wygrane partie",
    "admin.carryForward.gameLosses": "Przegrane partie",
    "admin.carryForward.hoopsFor": "Bramki zdobyte",
    "admin.carryForward.hoopsAgainst": "Bramki stracone",
    "CarryForward.MatchWinsNotWhole":
      "Wpisz całkowitą liczbę wygranych meczów.",
    "CarryForward.MatchWinsBelowZero": "Wpisz 0 lub więcej wygranych meczów.",
    "CarryForward.MatchLossesNotWhole":
      "Wpisz całkowitą liczbę przegranych meczów.",
    "CarryForward.MatchLossesBelowZero":
      "Wpisz 0 lub więcej przegranych meczów.",
    "CarryForward.GameWinsNotWhole": "Wpisz całkowitą liczbę wygranych partii.",
    "CarryForward.GameWinsBelowZero": "Wpisz 0 lub więcej wygranych partii.",
    "CarryForward.GameLossesNotWhole":
      "Wpisz całkowitą liczbę przegranych partii.",
    "CarryForward.GameLossesBelowZero":
      "Wpisz 0 lub więcej przegranych partii.",
    "CarryForward.HoopsForNotWhole": "Wpisz całkowitą liczbę zdobytych bramek.",
    "CarryForward.HoopsForBelowZero": "Wpisz 0 lub więcej zdobytych bramek.",
    "CarryForward.HoopsAgainstNotWhole":
      "Wpisz całkowitą liczbę straconych bramek.",
    "CarryForward.HoopsAgainstBelowZero":
      "Wpisz 0 lub więcej straconych bramek.",
    "admin.scores.add": "Dodaj wynik",
    "admin.scores.none": "Brak wyników",
    "admin.scores.edit": "Edytuj",
    "admin.scores.drawNotFilledTitle": "Losowanie nie jest zapełnione",
    "admin.scores.archive": "Archiwizuj",
    "admin.scores.up": "W górę",
    "admin.scores.down": "W dół",
    "admin.scores.restore": "Przywróć",
    "admin.scores.archived": "Zarchiwizowane wyniki",
    "admin.scores.archivedSaid": "Zarchiwizowany",
    "admin.scores.withdraw": "Wycofaj",
    "admin.scores.unwithdraw": "Cofnij wycofanie",
    "admin.scores.withdrawnSaid": "Wycofany",
    "admin.scores.otherwise": "Nie można tego zrobić.",
    "admin.score.title": "Dodaj wynik",
    "admin.score.add": "Dodaj partię",
    "admin.score.winner": "Zwycięzca",
    "admin.score.winnerScore": "Wynik zwycięzcy",
    "admin.score.loser": "Przegrany",
    "admin.score.loserScore": "Wynik przegranego",
    "admin.score.beat": "wygrywa z",
    "admin.score.added": "Dodano partię wygraną przez {winner} z {loser}.",
    "admin.score.otherwise": "Nie udało się dodać partii.",
    "admin.score.correctTitle": "Edytuj wynik",
    "admin.score.save": "Zapisz",
    "admin.score.notCorrected": "Nie udało się poprawić wyniku.",
    "Game.WinnerMissing": "Wybierz zwycięzcę.",
    "Game.WinnerScoreMissing": "Wpisz wynik zwycięzcy.",
    "Game.LoserMissing": "Wybierz przegranego.",
    "Game.LoserScoreMissing": "Wpisz wynik przegranego.",
    "Score.NoPoints": "Wynik zaczyna się od liczby punktów.",
    "Game.SamePlayer": "Nikt nie gra sam ze sobą.",
    "Game.WinnerNotAhead":
      "Wynik zwycięzcy musi być wyższy niż wynik przegranego albo oznaczony jako wygrana.",
    "Game.LoserMarked": "Wyniku przegranego nie można oznaczyć jako wygranej.",
    "Game.ResultChanged":
      "Poprawka zachowuje rezultat: wygrana partia pozostaje wygrana, a zremisowana – zremisowana.",
    "Competition.MatchDecided": "Ich mecz jest już rozstrzygnięty.",
    "Competition.DrawFull":
      "Nie można dodać zawodnika, ponieważ drabinka pucharowa jest pełna.",
    "Competition.DrawNotFilled":
      "Nie można dodać wyników, dopóki każde miejsce w drabince pucharowej nie zostanie zajęte przez zawodnika lub wolny los.",
    "Competition.ByeOutsideKnockout":
      "Wolny los może mieć tylko system pucharowy.",
    "Competition.NotDrawnToMeet":
      "Ci zawodnicy nie są obecnie rozlosowani do gry ze sobą w drabince pucharowej.",
    "Competition.WinnerHasPlayedOn":
      "Następna partia zwycięzcy tego meczu została już rozegrana, więc nie można zmienić, kto go wygrał.",
    "CompetitionPlayer.Withdrawn": "Wycofany zawodnik już nie gra.",
    "admin.players.add": "Dodaj zawodnika",
    "admin.players.none": "Brak zawodników",
    "admin.players.edit": "Edytuj",
    "admin.players.archive": "Archiwizuj",
    "admin.players.restore": "Przywróć",
    "admin.players.up": "W górę",
    "admin.players.down": "W dół",
    "admin.players.archiveTitle": "Archiwizuj zawodnika",
    "admin.players.archiveQuestion":
      "Zawodnik {name} zostanie usunięty z tych konkurencji:",
    "admin.players.archive.explanation":
      "Przywrócenie nie wstawi zawodnika z powrotem do tych konkurencji.",
    "admin.players.archived": "Zarchiwizowani zawodnicy",
    "admin.players.archivedSaid": "Zarchiwizowany",
    "admin.player.addTitle": "Dodaj zawodnika",
    "admin.player.editTitle": "Edytuj zawodnika",
    "admin.player.name": "Imię i nazwisko",
    "admin.player.representing": "Reprezentuje",
    "admin.player.worldRankingName": "Nazwa zawodnika w rankingu światowym",
    "admin.player.worldRankingKnown": "Rankingi światowe znają tę nazwę.",
    "admin.player.worldRankingQuestioned":
      "Rankingi światowe nie mają zawodnika o takiej nazwie. Mogła zostać źle zapisana albo zawodnik jest nowy w rankingach.",
    "admin.player.flag": "Flaga",
    "admin.player.add": "Dodaj",
    "admin.player.save": "Zapisz",
    "admin.player.added": "Dodano: {name}.",
    "admin.player.otherwise":
      "Tego zawodnika nie można zachować w tej postaci.",
    "Tournament.PlayerNameTaken":
      "Inny zawodnik w tym turnieju ma już takie imię i nazwisko.",
    "TournamentPlayer.NoSuchFlag": "Wybierz jedną z dostępnych flag.",
    "TournamentPlayer.NamedBye": "Zawodnik nie może nazywać się Bye.",
    "TournamentPlayer.NoLetterOrDigit": "Nazwa musi zawierać literę lub cyfrę.",
    "admin.player.byesTitle": "Wolnych losów nie trzeba dodawać",
    "admin.player.byes":
      "Wolny los nie jest jednym z zawodników turnieju. System pucharowy oferuje wolny los (Bye) przy dodawaniu zawodników, tyle razy, ile potrzeba w jego losowaniu.",
    "admin.view.teams": "Drużyny",
    "admin.view.tests": "Testy",
    "admin.teams.add": "Dodaj drużynę",
    "admin.teams.none": "Brak drużyn",
    "admin.teams.edit": "Edytuj",
    "admin.teams.view": "Zobacz",
    "admin.teams.archive": "Archiwizuj",
    "admin.teams.restore": "Przywróć",
    "admin.teams.up": "W górę",
    "admin.teams.down": "W dół",
    "admin.teams.archived": "Zarchiwizowane drużyny",
    "admin.teams.archivedSaid": "Zarchiwizowana",
    "admin.team.addTitle": "Dodaj drużynę",
    "admin.team.editTitle": "Edytuj drużynę",
    "admin.team.name": "Nazwa",
    "admin.team.shortName": "Skrót nazwy",
    "admin.team.shortName.explanation":
      "Skrót, którym nazywane są testy drużyny, np. AUS v ENG.",
    "admin.team.flag": "Flaga",
    "admin.team.add": "Dodaj",
    "admin.team.save": "Zapisz",
    "admin.team.added": "Dodano: {name}.",
    "admin.team.otherwise": "Tej drużyny nie można zachować w tej postaci.",
    "admin.teamView.otherwise": "Tej drużyny nie można stąd zobaczyć.",
    "admin.teamView.players": "Zawodnicy",
    "TeamName.Missing": "Wpisz nazwę drużyny.",
    "TeamName.TooLong": "Ta nazwa jest zbyt długa.",
    "admin.notes.add": "Dodaj notatkę",
    "admin.notes.none": "Brak notatek",
    "admin.notes.edit": "Edytuj",
    "admin.notes.delete": "Usuń",
    "admin.notes.deleteTitle": "Usuń notatkę",
    "admin.notes.deleteQuestion": "Usunąć notatkę „{title}”?",
    "admin.notes.delete.explanation":
      "Usuniętej notatki nie da się przywrócić.",
    "admin.notes.otherwise": "Nie można tego zrobić.",
    "admin.note.addTitle": "Dodaj notatkę",
    "admin.note.editTitle": "Edytuj notatkę",
    "admin.note.title": "Tytuł",
    "admin.note.description": "Opis",
    "admin.note.write": "Pisanie",
    "admin.note.preview": "Podgląd",
    "admin.note.toolbar": "Formatowanie",
    "admin.note.tool.heading": "Nagłówek",
    "admin.note.tool.bold": "Pogrubienie",
    "admin.note.tool.italic": "Kursywa",
    "admin.note.tool.quote": "Cytat",
    "admin.note.tool.code": "Kod",
    "admin.note.tool.link": "Link",
    "admin.note.tool.numberedList": "Lista numerowana",
    "admin.note.tool.bulletedList": "Lista punktowana",
    "admin.note.tool.taskList": "Lista zadań",
    "admin.note.add": "Dodaj",
    "admin.note.save": "Zapisz",
    "admin.note.otherwise": "Tej notatki nie można zachować w tej postaci.",
    "ManagerNoteTitle.Missing": "Nadaj notatce tytuł.",
    "ManagerNoteTitle.TooLong": "Ten tytuł jest zbyt długi.",
    "ManagerNoteTitle.NoLetterOrDigit": "Tytuł musi zawierać literę lub cyfrę.",
    "ManagerNoteDescription.TooLong": "Ten opis jest zbyt długi.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Tej notatki już nie ma. Mógł ją usunąć inny organizator.",
    "EditManagerNote.NoSuchManagerNote":
      "Tej notatki już nie ma. Mógł ją usunąć inny organizator.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Tej notatki już nie ma. Mógł ją usunąć inny organizator.",
    "ManagerNote.Deleted":
      "Ta notatka została usunięta. Mógł ją usunąć inny organizator.",
    "CommentaryTitle.Missing": "Nadaj relacji tytuł.",
    "CommentaryTitle.TooLong": "Ten tytuł jest zbyt długi.",
    "CommentaryTitle.NoLetterOrDigit": "Tytuł musi zawierać literę lub cyfrę.",
    "Commentary.TitleTaken": "Inna relacja ma już taki tytuł.",
    "CommentText.Missing": "Napisz coś w komentarzu.",
    "CommentText.TooLong": "Ten komentarz jest zbyt długi.",
    "TeamShortName.Missing": "Nadaj drużynie skrót nazwy.",
    "TeamShortName.TooLong": "Skrót nazwy może mieć co najwyżej 10 znaków.",
    "TeamShortName.NoLetterOrDigit":
      "Skrót nazwy musi zawierać literę lub cyfrę.",
    "Team.ShortNameLongerThanName":
      "Skrót nazwy nie może być dłuższy niż nazwa drużyny.",
    "Team.NoSuchFlag": "Wybierz jedną z dostępnych flag.",
    "Team.Archived":
      "Ta drużyna jest zarchiwizowana, więc najpierw trzeba ją przywrócić.",
    "Team.InATest":
      "Ta drużyna gra w teście, więc nie można jej zarchiwizować.",
    "Team.PlayerNameTaken":
      "Inny zawodnik w tej drużynie ma już takie imię i nazwisko.",
    "TeamPlayer.NamedBye": "Zawodnik nie może nazywać się Bye.",
    "TeamPlayer.Archived":
      "Ten zawodnik jest zarchiwizowany, więc najpierw trzeba go przywrócić.",
    "TeamPlayer.HasGames":
      "Ten zawodnik rozegrał partie, więc nie można go zarchiwizować.",
    "Tournament.TeamNameTaken":
      "Inna drużyna w tym turnieju ma już taką nazwę.",
    "Tournament.TeamShortNameTaken":
      "Inna drużyna w tym turnieju ma już taki skrót nazwy.",
    "Tournament.NoSuchTeam": "Ten turniej nie ma drużyny pod tym adresem.",
    "Tournament.TeamArchived":
      "Ta drużyna jest zarchiwizowana i można ją przywrócić tylko na karcie Drużyny.",
    "admin.tests.add": "Dodaj test",
    "admin.tests.none": "Brak testów",
    "admin.tests.edit": "Edytuj",
    "admin.tests.view": "Zobacz",
    "admin.tests.archive": "Archiwizuj",
    "admin.tests.restore": "Przywróć",
    "admin.tests.up": "W górę",
    "admin.tests.down": "W dół",
    "admin.tests.archived": "Zarchiwizowane testy",
    "admin.tests.twoTeamsNeeded":
      "Test rozgrywają dwie drużyny, więc najpierw potrzebne są dwie drużyny.",
    "admin.tests.toTeams": "Przejdź do drużyn",
    "admin.tests.matches.one": "Mecze: {count}",
    "admin.tests.matches.other": "Mecze: {count}",
    "admin.tests.bestOf": "najlepszy z {games}",
    "admin.tests.otherwise": "Nie można tego zrobić.",
    "admin.test.addTitle": "Dodaj test",
    "admin.test.editTitle": "Edytuj test",
    "admin.test.firstTeam": "Drużyna A",
    "admin.test.secondTeam": "Drużyna B",
    "admin.test.versus": "v",
    "admin.test.starts": "Początek",
    "admin.test.finishes": "Koniec",
    "admin.test.expectedMatches": "Oczekiwana liczba meczów",
    "admin.test.bestOf": "Najlepszy z",
    "admin.test.group": "Grupa",
    "admin.test.add": "Dodaj",
    "admin.test.save": "Zapisz",
    "admin.test.added": "Dodano: {name}.",
    "admin.test.otherwise": "Tego testu nie można zachować w tej postaci.",
    "admin.testView.otherwise": "Tego testu nie można stąd zobaczyć.",
    "AddTest.FirstTeamMissing": "Wybierz pierwszą drużynę.",
    "AddTest.SecondTeamMissing": "Wybierz drugą drużynę.",
    "UpdateTest.FirstTeamMissing": "Wybierz pierwszą drużynę.",
    "UpdateTest.SecondTeamMissing": "Wybierz drugą drużynę.",
    "ExpectedMatches.NotWhole": "Wpisz całkowitą liczbę meczów.",
    "ExpectedMatches.TooSmall": "W teście oczekiwany jest co najmniej 1 mecz.",
    "TestGroup.TooLong": "Ta grupa jest zbyt długa.",
    "Tournament.TestAgainstItself":
      "Drużyna nie rozgrywa testu przeciwko sobie.",
    "Tournament.TestFinishesBeforeStarts":
      "Test nie może zakończyć się przed rozpoczęciem.",
    "Tournament.TestStartsBeforeTournament":
      "Test nie może zacząć się przed początkiem turnieju.",
    "Tournament.TestFinishesAfterTournament":
      "Test nie może zakończyć się po zakończeniu turnieju.",
    "Tournament.TestHasGamesInUse":
      "Ten test ma partie, więc nie można go zarchiwizować, dopóki one nie zostaną zarchiwizowane.",
    "Tournament.TestHasGames":
      "Ten test ma już partie, więc jego drużyn nie można już zmieniać.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Rozpoczęto już więcej meczów niż ta liczba.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dwóch zawodników rozegrało już więcej partii niż ta liczba.",
    "Competition.ExpectedMatchesReached":
      "W tym teście rozpoczęto już tyle meczów, ile się spodziewano.",
    "Competition.SameTeam":
      "Dwóch zawodników z tej samej drużyny nie gra ze sobą.",
    "AddManager.NoSuchAccount":
      "Ten adres nie ma konta, które można uczynić organizatorem.",
    "admin.scorers.add": "Dodaj osobę wprowadzającą wyniki",
    "admin.scorers.none": "Brak osób wprowadzających wyniki",
    "admin.scorers.removeTitle": "Usuń osobę wprowadzającą wyniki",
    "admin.scorers.removeExplanation":
      "Od teraz {name} nie może wprowadzać wyników tego turnieju.",
    "admin.scorers.otherwise":
      "Nie można uczynić tego adresu osobą wprowadzającą wyniki.",
    "AddScorer.NoSuchAccount":
      "Ten adres nie ma konta, które można uczynić osobą wprowadzającą wyniki.",
    "Account.NotAnAdministrator": "Może to zrobić tylko administrator.",
    "AddRole.NoSuchAccount":
      "Ten adres nie ma konta, któremu można nadać rolę.",
    "AddRole.NoSuchRole": "Nie ma takiej roli.",
    "RemoveRole.NoSuchAccount": "Nie ma takiego konta.",
    "RemoveRole.NoSuchRole": "Nie ma takiej roli.",
    "RemoveRole.Yourself": "Nie możesz odebrać sobie roli administratora.",
    "AccountsWithRole.NoSuchRole": "Nie ma takiej roli.",
    "Tournament.AlreadyAManager":
      "To konto już zarządza turniejem i może robić wszystko, co osoba wprowadzająca wyniki.",

    "TournamentName.Missing": "Wpisz nazwę turnieju.",
    "TournamentName.TooShort": "Ta nazwa jest zbyt krótka.",
    "TournamentName.TooLong": "Ta nazwa jest zbyt długa.",
    "TournamentName.AllLowerCase":
      "Nazwa nie może składać się wyłącznie z małych liter.",
    "TournamentName.AllCapitals":
      "Nazwa nie może składać się wyłącznie z wielkich liter.",
    "TournamentName.NoLetterOrDigit": "Nazwa musi zawierać literę lub cyfrę.",
    "ReadOnlyDate.Unreadable": "Podaj dzień.",
    "Tournament.FinishesBeforeStarts":
      "Turniej nie może zakończyć się przed rozpoczęciem.",
    "Tournament.StartsAfterNextYear":
      "Turniej nie może zacząć się po przyszłym roku.",
    "Tournament.FinishesAfterNextYear":
      "Turniej nie może zakończyć się po przyszłym roku.",
    "CreateTournament.NoSuchCountry": "Wybierz kraj.",
    "TournamentSubtitle.TooLong": "Podtytuł może mieć co najwyżej 2000 znaków.",
    "Tournament.NotAManager":
      "Tylko organizator tego turnieju może go zmienić.",
    "Tournament.NotAManagerOrScorer":
      "Tylko organizator lub osoba wprowadzająca wyniki tego turnieju może go zobaczyć.",
    "Tournament.Archived":
      "Ten turniej jest zarchiwizowany i trzeba go przywrócić, zanim będzie można go zmienić.",
    "UpdateTournament.NoSuchTournament": "Nie ma turnieju pod tym adresem.",

    // The sports and formats named for a competition keep their English names,
    // since Polish players call them so; only the plain ones are translated.
    "sport.ac": "Association Croquet",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "American Six-Wicket",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standardowy",
    "format.teams": "Drużynowy",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andora",
    "country.ae": "Zjednoczone Emiraty Arabskie",
    "country.af": "Afganistan",
    "country.ag": "Antigua i Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Argentyna",
    "country.as": "Samoa Amerykańskie",
    "country.at": "Austria",
    "country.au": "Australia",
    "country.aw": "Aruba",
    "country.ax": "Wyspy Alandzkie",
    "country.az": "Azerbejdżan",
    "country.ba": "Bośnia i Hercegowina",
    "country.bb": "Barbados",
    "country.bd": "Bangladesz",
    "country.be": "Belgia",
    "country.bf": "Burkina Faso",
    "country.bg": "Bułgaria",
    "country.bh": "Bahrajn",
    "country.bi": "Burundi",
    "country.bj": "Benin",
    "country.bm": "Bermudy",
    "country.bn": "Brunei",
    "country.bo": "Boliwia",
    "country.br": "Brazylia",
    "country.bs": "Bahamy",
    "country.bt": "Bhutan",
    "country.bv": "Wyspa Bouveta",
    "country.bw": "Botswana",
    "country.by": "Białoruś",
    "country.bz": "Belize",
    "country.ca": "Kanada",
    "country.catalonia": "Katalonia",
    "country.cc": "Wyspy Kokosowe",
    "country.cd": "Demokratyczna Republika Konga",
    "country.cf": "Republika Środkowoafrykańska",
    "country.cg": "Republika Konga",
    "country.ch": "Szwajcaria",
    "country.ci": "Wybrzeże Kości Słoniowej",
    "country.ck": "Wyspy Cooka",
    "country.cl": "Chile",
    "country.cm": "Kamerun",
    "country.cn": "Chiny",
    "country.co": "Kolumbia",
    "country.cr": "Kostaryka",
    "country.cu": "Kuba",
    "country.cv": "Republika Zielonego Przylądka",
    "country.cx": "Wyspa Bożego Narodzenia",
    "country.cy": "Cypr",
    "country.cz": "Czechy",
    "country.de": "Niemcy",
    "country.dj": "Dżibuti",
    "country.dk": "Dania",
    "country.dm": "Dominika",
    "country.do": "Dominikana",
    "country.dz": "Algieria",
    "country.ec": "Ekwador",
    "country.ee": "Estonia",
    "country.eg": "Egipt",
    "country.eh": "Sahara Zachodnia",
    "country.england": "Anglia",
    "country.er": "Erytrea",
    "country.es": "Hiszpania",
    "country.et": "Etiopia",
    "country.fi": "Finlandia",
    "country.fj": "Fidżi",
    "country.fk": "Falklandy",
    "country.fm": "Mikronezja",
    "country.fo": "Wyspy Owcze",
    "country.fr": "Francja",
    "country.ga": "Gabon",
    "country.gb": "Wielka Brytania",
    "country.gd": "Grenada",
    "country.ge": "Gruzja",
    "country.gf": "Gujana Francuska",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Grenlandia",
    "country.gm": "Gambia",
    "country.gn": "Gwinea",
    "country.gp": "Gwadelupa",
    "country.gq": "Gwinea Równikowa",
    "country.gr": "Grecja",
    "country.gs": "Georgia Południowa i Sandwich Południowy",
    "country.gt": "Gwatemala",
    "country.gu": "Guam",
    "country.gw": "Gwinea Bissau",
    "country.gy": "Gujana",
    "country.hk": "Hongkong",
    "country.hm": "Wyspy Heard i McDonalda",
    "country.hn": "Honduras",
    "country.hr": "Chorwacja",
    "country.ht": "Haiti",
    "country.hu": "Węgry",
    "country.id": "Indonezja",
    "country.ie": "Irlandia",
    "country.il": "Izrael",
    "country.im": "Wyspa Man",
    "country.in": "Indie",
    "country.io": "Brytyjskie Terytorium Oceanu Indyjskiego",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Islandia",
    "country.it": "Włochy",
    "country.je": "Jersey",
    "country.jm": "Jamajka",
    "country.jo": "Jordania",
    "country.jp": "Japonia",
    "country.ke": "Kenia",
    "country.kg": "Kirgistan",
    "country.kh": "Kambodża",
    "country.ki": "Kiribati",
    "country.km": "Komory",
    "country.kn": "Saint Kitts i Nevis",
    "country.kp": "Korea Północna",
    "country.kr": "Korea Południowa",
    "country.kw": "Kuwejt",
    "country.ky": "Kajmany",
    "country.kz": "Kazachstan",
    "country.la": "Laos",
    "country.lb": "Liban",
    "country.lc": "Saint Lucia",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesotho",
    "country.lt": "Litwa",
    "country.lu": "Luksemburg",
    "country.lv": "Łotwa",
    "country.ly": "Libia",
    "country.ma": "Maroko",
    "country.mc": "Monako",
    "country.md": "Mołdawia",
    "country.me": "Czarnogóra",
    "country.mg": "Madagaskar",
    "country.mh": "Wyspy Marshalla",
    "country.mk": "Macedonia Północna",
    "country.ml": "Mali",
    "country.mm": "Mjanma",
    "country.mn": "Mongolia",
    "country.mo": "Makau",
    "country.mp": "Mariany Północne",
    "country.mq": "Martynika",
    "country.mr": "Mauretania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauritius",
    "country.mv": "Malediwy",
    "country.mw": "Malawi",
    "country.mx": "Meksyk",
    "country.my": "Malezja",
    "country.mz": "Mozambik",
    "country.na": "Namibia",
    "country.nc": "Nowa Kaledonia",
    "country.ne": "Niger",
    "country.nf": "Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nikaragua",
    "country.nl": "Holandia",
    "country.no": "Norwegia",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nowa Zelandia",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Peru",
    "country.pf": "Polinezja Francuska",
    "country.pg": "Papua-Nowa Gwinea",
    "country.ph": "Filipiny",
    "country.pk": "Pakistan",
    "country.pl": "Polska",
    "country.pm": "Saint-Pierre i Miquelon",
    "country.pn": "Pitcairn",
    "country.pr": "Portoryko",
    "country.ps": "Palestyna",
    "country.pt": "Portugalia",
    "country.pw": "Palau",
    "country.py": "Paragwaj",
    "country.qa": "Katar",
    "country.re": "Reunion",
    "country.ro": "Rumunia",
    "country.rs": "Serbia",
    "country.ru": "Rosja",
    "country.rw": "Rwanda",
    "country.sa": "Arabia Saudyjska",
    "country.sb": "Wyspy Salomona",
    "country.sc": "Seszele",
    "country.scotland": "Szkocja",
    "country.sd": "Sudan",
    "country.se": "Szwecja",
    "country.sg": "Singapur",
    "country.sh": "Wyspa Świętej Heleny",
    "country.si": "Słowenia",
    "country.sj": "Svalbard i Jan Mayen",
    "country.sk": "Słowacja",
    "country.sl": "Sierra Leone",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Surinam",
    "country.st": "Wyspy Świętego Tomasza i Książęca",
    "country.sv": "Salwador",
    "country.sy": "Syria",
    "country.sz": "Eswatini",
    "country.tc": "Turks i Caicos",
    "country.td": "Czad",
    "country.tf": "Francuskie Terytoria Południowe i Antarktyczne",
    "country.tg": "Togo",
    "country.th": "Tajlandia",
    "country.tj": "Tadżykistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor Wschodni",
    "country.tm": "Turkmenistan",
    "country.tn": "Tunezja",
    "country.to": "Tonga",
    "country.tr": "Turcja",
    "country.tt": "Trynidad i Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Tajwan",
    "country.tz": "Tanzania",
    "country.ua": "Ukraina",
    "country.ug": "Uganda",
    "country.um": "Dalekie Wyspy Mniejsze Stanów Zjednoczonych",
    "country.us": "Stany Zjednoczone",
    "country.uy": "Urugwaj",
    "country.uz": "Uzbekistan",
    "country.va": "Watykan",
    "country.vc": "Saint Vincent i Grenadyny",
    "country.ve": "Wenezuela",
    "country.vg": "Brytyjskie Wyspy Dziewicze",
    "country.vi": "Wyspy Dziewicze Stanów Zjednoczonych",
    "country.vn": "Wietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Walia",
    "country.wf": "Wallis i Futuna",
    "country.ws": "Samoa",
    "country.ye": "Jemen",
    "country.yt": "Majotta",
    "country.za": "Republika Południowej Afryki",
    "country.zm": "Zambia",
    "country.zw": "Zimbabwe",

    // An email is two entries, as in English: a subject and a body whose
    // markup is kept as it is, with only the words between the tags changed.

    "Email.ConfirmAddress.subject": "Potwierdź swój adres e-mail w {siteName}",
    "Email.ConfirmAddress.body": `
<p>Cześć,</p>

<p>
    Dziękujemy za utworzenie konta w <strong>{siteName}</strong>.<br />
    Zanim zaczniesz korzystać z konta, potwierdź swój adres e-mail, klikając poniższy przycisk:
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
        Potwierdzam mój adres e-mail
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też potwierdzić swój adres e-mail, otwierając ten link w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Jeśli konto nie zostało założone przez ciebie, możesz spokojnie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Nowy link do potwierdzenia adresu e-mail w {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Cześć,</p>

<p>
    Niedawno poproszono o nową wiadomość potwierdzającą adres e-mail w <strong>{siteName}</strong>.<br />
    Potwierdź swój adres e-mail, klikając poniższy przycisk:
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
        Potwierdzam mój adres e-mail
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też potwierdzić swój adres e-mail, otwierając ten link w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Po potwierdzeniu konto będzie działać dalej bez przerw.
</p>

<p>
    Jeśli ta wiadomość nie jest odpowiedzią na twoją prośbę, możesz ją zignorować.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Ktoś próbował zarejestrować się z twoim adresem e-mail",
    "Email.AlreadyRegistered.body": `
<p>Cześć,</p>

<p>
    Ktoś próbował zarejestrować się w <strong>{siteName}</strong> przy użyciu tego
    adresu e-mail, który ma już konto. Nic w twoim koncie się nie zmieniło.<br />
    Jeśli to ty, masz już konto i możesz się do niego zalogować:
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
        Zaloguj się
    </a>
</p>

<p>
    Jeśli nie pamiętasz hasła, możesz je zresetować tutaj:
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
        Nie pamiętam hasła
    </a>
</p>

<p>
    Jeśli to nie ty, nie musisz nic robić. Nikt nie uzyskał dostępu do
    twojego konta.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Potwierdź przeniesienie konta {siteName} na ten adres",
    "Email.ConfirmNewEmailAddress.body": `
<p>Cześć,</p>

<p>
    Ktoś zalogowany na konto <strong>{siteName}</strong> poprosił o przeniesienie
    go na ten adres e-mail. Jeśli to ty, potwierdź to tutaj, po zalogowaniu na
    to konto. Link działa przez 24 godziny.
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
        Przenieś moje konto
    </a>
</p>

<p>
    Albo skopiuj ten adres do przeglądarki:<br />
    {link}
</p>

<p>
    Jeśli to nie ty, nie musisz nic robić. Żadne konto nie zostanie tu przeniesione.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Ktoś poprosił o przeniesienie konta na twój adres e-mail",
    "Email.AlreadyHasAnAccount.body": `
<p>Cześć,</p>

<p>
    Ktoś zalogowany na konto <strong>{siteName}</strong> poprosił o przeniesienie
    go na ten adres e-mail, który ma już własne konto. Nic nie zostało
    przeniesione i nic w twoim koncie się nie zmieniło.
</p>

<p>
    Jeśli to ty, masz już konto pod tym adresem i możesz się do niego
    zalogować.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Twoje konto {siteName} zostało przeniesione",
    "Email.EmailAddressChanged.body": `
<p>Cześć,</p>

<p>
    Twoje konto <strong>{siteName}</strong> zostało właśnie przeniesione na inny
    adres e-mail, {emailAddress}, i od teraz loguje się tym adresem.
</p>

<p>
    Jeśli to nie ty, ktoś inny ma dostęp do twojego konta. Odpowiedz na tę
    wiadomość i daj nam znać.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Twoje hasło do {siteName} zostało zmienione",
    "Email.PasswordChanged.body": `
<p>Cześć,</p>

<p>
    Hasło do twojego konta <strong>{siteName}</strong> zostało właśnie zmienione, a
    wszystkie inne przeglądarki zalogowane na to konto zostały wylogowane.<br />
    Jeśli to ty, nie musisz nic robić.
</p>

<p>
    Jeśli to nie ty, ktoś inny zna twoje hasło. Ustaw nowe tutaj, a ta osoba
    zostanie wylogowana:
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
        Nie pamiętam hasła
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject": "Ustaw nowe hasło w {siteName}",
    "Email.SetNewPassword.body": `
<p>Cześć,</p>

<p>
    Niedawno poproszono o zresetowanie hasła do <strong>{siteName}</strong>.<br />
    Możesz je zresetować, klikając poniższy przycisk:
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
        Zresetuj hasło
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też zresetować hasło, otwierając ten link w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Jeśli reset hasła nie był twoją prośbą, możesz spokojnie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Ustaw hasło w {siteName}",
    "Email.SetPassword.body": `
<p>Cześć,</p>

<p>
    Twoje konto <strong>{siteName}</strong> nie ma hasła: logujesz się przez Google.<br />
    Poproszono o jego ustawienie, aby można było logować się także adresem e-mail i hasłem.
    Możesz je ustawić, klikając poniższy przycisk:
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
        Ustaw hasło
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też ustawić hasło, otwierając ten link w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Link działa przez godzinę. Jeśli ustawienie hasła nie było twoją prośbą, możesz spokojnie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Nie ma konta {siteName} dla tego adresu e-mail",
    "Email.RegisterInstead.body": `
<p>Cześć,</p>

<p>
    Poproszono o zresetowanie hasła dla adresu e-mail, który nie jest
    powiązany z żadnym kontem w <strong>{siteName}</strong>.
</p>

<p>
    Jeśli chcesz skorzystać z naszej usługi, możesz utworzyć nowe konto,
    odwiedzając:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Jeśli ta prośba nie pochodzi od ciebie, możesz spokojnie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Potwierdź, że konto {siteName} ma zostać zapomniane",
    "Email.ConfirmForgetting.body": `
<p>Cześć,</p>

<p>
    Poproszono o zapomnienie twojego konta <strong>{siteName}</strong>.<br />
    Kliknij poniższy przycisk, aby zobaczyć, co to oznacza, i potwierdzić, że
    tego chcesz:
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
        Zapomnij moje konto
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też otworzyć ten link w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Po zapomnieniu nikt nigdy nie odczyta już twojego imienia i nazwiska ani
    adresu e-mail, a na konto nie będzie można się zalogować. Tego nie da się
    cofnąć.
</p>

<p>
    Link działa jednorazowo, do 15 minut od chwili prośby, i tylko po
    zalogowaniu na to konto. Potem poproś ponownie ze swojego konta.
</p>

<p>
    Jeśli to nie ty, nic się nie stanie, dopóki link nie zostanie kliknięty.
    Ktoś zalogowany na twoje konto jednak o to poprosił, więc ustaw nowe hasło
    na stronie „Nie pamiętam hasła”, aby mieć pewność, że nie zaloguje się
    ponownie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Rejestracja wstrzymana: nie można połączyć się z {service}",
    "Email.RegistrationsSuspended.body": `
<p>Cześć,</p>

<p>
    Nie udało się połączyć {siteName} z {service} ({when}). Dopóki usługa nie
    odpowie, osoby, które jej potrzebują, by się zarejestrować lub ustawić
    nowe hasło, są proszone o spróbowanie później.
</p>

<p>
    Nic nie trzeba odblokowywać. Każda próba odpytuje {service} na nowo, a
    strony zaczynają działać w chwili, gdy usługa odpowie.
</p>

<p>
    Dopóki {service} nie działa, wiadomość e-mail o tym będzie wysyłana do
    ciebie co najwyżej raz na godzinę.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} nie może połączyć się z bazą danych",
    "Email.DatabaseUnreachable.body": `
<p>Cześć,</p>

<p>
    {siteName} nie mógł połączyć się z bazą danych o {when}. Dopóki nie odpowie, każda strona, która jej potrzebuje, mówi czytelnikom, że serwis jest niedostępny i żeby spróbowali ponownie później.
</p>

<p>
    Nic nie trzeba odblokowywać. Każde żądanie prosi o połączenie od nowa, a serwis znów działa, gdy tylko baza danych odpowie.
</p>

<p>
    Dopóki baza danych nie odpowiada, dostaniesz o tym e-mail najwyżej raz na {minutes} min.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} nie obsłużył żądania",
    "Email.UnhandledError.body": `
<p>Cześć,</p>

<p>
    {siteName} nie obsłużył o {when} żądania dotyczącego {asked}. Czytelnik zobaczył numer referencyjny {reference}, a w dzienniku pod tym numerem jest przyczyna.
</p>

<p>
    Zepsuty serwis zwykle zawodzi przy każdym żądaniu, więc o błędach dostaniesz najwyżej 4 e-maile na godzinę. Pozostałe i tak są w dzienniku.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
