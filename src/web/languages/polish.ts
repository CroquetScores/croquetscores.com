// Polskie słowa serwisu. Decyzje: do czytelnika zwracamy się na „ty” (małą
// literą), bez form zależnych od płci (stąd „Wylogowano cię...”, „otwarta
// sesja” zamiast „zalogowany”). Pozycje menu i przyciski piszemy zwykłą
// polską pisownią, z wielką literą tylko na początku. „Adres e-mail” (nie
// „e-mail”) to adres, „e-mail” to wiadomość; „odsyłacz” to link; konkurencja
// to competition, grupa/pucharowa/szwajcarska to jej rodzaje; „Bye” zostaje
// po angielsku, bo serwis sprawdza to słowo.
import type { Language } from "../common/language.js";

export const polish: Language = {
  tag: "pl",
  name: "Polski",
  words: {
    // Paski strony.
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
      "Podoba ci się {siteName}? Wesprzyj nas, aby pomóc w dalszym rozwoju.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Prywatność",
    "footer.termsOfUse": "Regulamin",
    "footer.reportBug": "Zgłoś błąd",
    "beta.banner":
      "To jest wersja beta serwisu. Dane mogą zostać zresetowane w każdej chwili.",
    "privacy.contact":
      "Pytania o tę stronę lub o to, co jest o tobie przechowywane: {emailAddress}",
    // Pole wyboru ze zgodą na regulamin dla osób piszących. Słowa odsyłacza
    // muszą być zapisane dokładnie tak, jak w polu.
    "termsOfUse.agree": "Akceptuję regulamin",
    "termsOfUse.link": "regulamin",
    "termsOfUse.report":
      "Zgłoś napisaną treść lub zapytaj o ten regulamin: {emailAddress}",
    "TermsOfUse.NotAgreed": "Zaznacz pole, aby zaakceptować regulamin.",
    "tryWebsite.banner":
      "To bezpieczne miejsce do nauki obsługi {siteName}. Wszystko, co tu wpiszesz, może zostać usunięte w każdej chwili.",

    "language.label": "Język",
    "language.choose": "Zmień",

    "whatsNew.public.message": "Jest coś nowego do przeczytania.",
    "whatsNew.admin.message": "Jest coś nowego dla osób prowadzących turnieje.",
    "whatsNew.view": "Zobacz nowości",
    "whatsNew.later": "Przypomnij następnym razem",
    "whatsNew.never": "Nie pokazuj mi więcej tego powiadomienia",

    "form.otherwise":
      "Coś tu się nie zgadza. Sprawdź, co zostało wpisane, i spróbuj ponownie.",

    // Menu konta w nagłówku.
    "account.menu": "Konto",
    "account.register": "Zarejestruj się",
    "account.signIn": "Zaloguj się",
    "account.forgotPassword": "Nie pamiętam hasła",
    "account.signOut": "Wyloguj się",
    "account.profile": "Profil",
    "account.changePassword": "Zmień hasło",
    "account.changeEmailAddress": "Zmień adres e-mail",
    "account.changeName": "Zmień nazwę",
    "account.setPassword": "Ustaw hasło",
    "account.forgetAccount": "Zapomnij konto",

    "register.title": "Rejestracja",
    "register.emailAddress": "Adres e-mail",
    "register.submit": "Zarejestruj się",
    "register.withGoogle": "Zarejestruj się przez Google",
    "register.or": "lub",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google nie potwierdziło, że ten adres e-mail należy do ciebie, więc nie można go tu użyć z Google. Użyj poniżej swojego adresu e-mail.",
    "SignInWithGoogle.LinkedToAnother":
      "Dla tego adresu e-mail istnieje już konto, powiązane z innym kontem Google. Zaloguj się tym kontem Google albo adresem e-mail i hasłem.",
    "SignInWithGoogle.NameMissing":
      "Google nie przekazało nam twojej nazwy, a konto jej wymaga. Użyj poniżej swojego adresu e-mail.",
    "Google.Unreachable":
      "Nie można teraz połączyć się z Google. Spróbuj ponownie za kilka minut albo użyj poniżej swojego adresu e-mail.",
    "Registration.NotAPerson":
      "To nie wyglądało na działanie człowieka. Spróbuj ponownie, a jeśli to się powtarza, odczekaj kilka minut i wróć.",

    // Zasady, które może złamać adres.
    "EmailAddress.Missing": "Wpisz adres e-mail.",
    "EmailAddress.NoAt": "Adres e-mail zawiera znak @.",
    "EmailAddress.MoreThanOneAt": "Adres e-mail zawiera jeden znak @.",
    "EmailAddress.NoDomain":
      "Adres e-mail zawiera po znaku @ domenę, na przykład example.com.",

    "welcome.title": "Sprawdź pocztę",
    "welcome.checkEmail":
      "E-mail jest w drodze na podany adres. Kliknij w nim odsyłacz, aby kontynuować.",
    "welcome.nothingArrived":
      "Jeśli nic nie dotrze w ciągu kilku minut, zajrzyj do folderu ze spamem.",
    "welcome.home": "Wróć do {siteName}",
    "newConfirmationLink.title": "Uzyskaj nowy odsyłacz",
    "newConfirmationLink.explanation":
      "Odsyłacz potwierdzający adres e-mail wygasł. Poproś o nowy, a zostanie wysłany na adres użyty przy rejestracji.",
    "newConfirmationLink.send": "Wyślij nowy odsyłacz",
    "newConfirmationLink.home": "Wróć do {siteName}",
    "newConfirmationLink.signIn": "Zaloguj się",
    "newConfirmationLink.sent.title": "Sprawdź pocztę",
    "newConfirmationLink.sent.explanation":
      "Nowy odsyłacz jest w drodze. Kliknij go, aby potwierdzić adres e-mail. Jeśli nic nie dotrze w ciągu kilku minut, zajrzyj do folderu ze spamem.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Ten adres e-mail jest już potwierdzony",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Nie ma już nic do potwierdzenia. Zaloguj się hasłem podanym przy potwierdzaniu.",
    "newConfirmationLink.noLongerWorks.title": "Ten odsyłacz już nie działa",
    "newConfirmationLink.noLongerWorks.explanation":
      "Sprawdź, czy użyto całego odsyłacza z e-maila, bez brakującego końca. Jeśli nadal nie działa, zarejestruj się ponownie, a zostanie wysłany nowy odsyłacz.",
    "newConfirmationLink.tooMany.title": "Spróbuj później",
    "newConfirmationLink.tooMany.explanation":
      "Na ten adres wysłano ostatnio kilka odsyłaczy. Odczekaj godzinę i poproś ponownie, a w międzyczasie zajrzyj do folderu ze spamem.",

    "forgotPassword.title": "Nie pamiętasz hasła?",
    "forgotPassword.emailAddress": "Adres e-mail",
    "forgotPassword.submit": "Wyślij mi sposób na powrót",
    "forgotPassword.home": "Wróć do {siteName}",
    "forgotPassword.sent.title": "Sprawdź pocztę",
    "forgotPassword.sent.explanation":
      "Jeśli ten adres ma konto, odsyłacz do ustawienia nowego hasła jest w drodze. Skorzystaj z niego w ciągu godziny. Jeśli nic nie dotrze w ciągu kilku minut, zajrzyj do folderu ze spamem.",
    "forgotPassword.tryAgainLater":
      "Z tego miejsca poproszono ostatnio zbyt wiele razy o powrót do konta. Odczekaj godzinę i spróbuj ponownie.",

    "setNewPassword.title": "Ustaw nowe hasło",
    "setNewPassword.password": "Hasło",
    "setNewPassword.confirmPassword": "Powtórz hasło",
    "setNewPassword.submit": "Ustaw nowe hasło",
    "setNewPassword.home": "Wróć do {siteName}",
    "setNewPassword.signIn": "Zaloguj się",
    "setNewPassword.askAgain": "Poproś o nowy odsyłacz",
    "setNewPassword.changed.title": "Hasło zostało zmienione",
    "setNewPassword.changed.explanation":
      "Wylogowano cię ze wszystkich miejsc, w których była otwarta sesja. Zaloguj się nowym hasłem.",
    "setNewPassword.expired.title": "Ten odsyłacz wygasł",
    "setNewPassword.expired.explanation":
      "Odsyłacz do ustawienia nowego hasła działa przez godzinę. Poproś o kolejny, a zostanie wysłany na ten sam adres.",
    "setNewPassword.noLongerWorks.title": "Ten odsyłacz już nie działa",
    "setNewPassword.noLongerWorks.explanation":
      "Mógł zostać już użyty albo może brakować jego końca. Poproś o kolejny, jeśli nadal jest potrzebny.",

    "BreachedPasswords.Unreachable":
      "Nie można teraz sprawdzić hasła, więc nie zostało zmienione. Spróbuj ponownie za kilka minut; odsyłacz działa do czasu wygaśnięcia.",

    "forgetAccount.title": "Zapomnij konto",
    "forgetAccount.explanation":
      "Twoja nazwa i adres e-mail mogą zostać na stałe uczynione nieczytelnymi, a konto zamknięte. Aby mieć pewność, że to ty, najpierw wyślemy e-mailem odsyłacz na adres konta i nic nie zostanie zapomniane, dopóki z niego nie skorzystasz.",
    "forgetAccount.submit": "Wyślij mi odsyłacz",
    "forgetAccount.sent.title": "Sprawdź pocztę",
    "forgetAccount.sent.explanation":
      "Wysłaliśmy odsyłacz na adres konta. Działa przez 15 minut i tylko przy otwartej sesji tego konta.",
    "forgetAccount.confirm.title": "Zapomnieć konto na stałe?",
    "forgetAccount.confirm.explanation":
      "Po zapomnieniu nazwa i adres e-mail nigdy więcej nie będą czytelne dla nikogo, a na konto nie będzie można się zalogować. Tego nie można cofnąć.",
    "forgetAccount.confirm.submit": "Zapomnij moje konto",
    "forgetAccount.forgotten.title": "Konto zostało zapomniane",
    "forgetAccount.forgotten.explanation":
      "Twoja nazwa i adres e-mail nie są już czytelne, a wszystkie sesje tego konta zostały zakończone.",
    "forgetAccount.noLongerWorks.title": "Ten odsyłacz już nie działa",
    "forgetAccount.noLongerWorks.explanation":
      "Mógł wygasnąć, zostać już użyty albo dotyczyć konta, do którego nie masz otwartej sesji. Jeśli nadal chcesz zapomnieć konto, poproś ponownie z poziomu konta.",
    "forgetAccount.lastAdministrator.title": "Tego konta nie można zapomnieć",
    "forgetAccount.lastAdministrator.explanation":
      "Jesteś jedynym administratorem tego serwisu. Przekaż rolę administratora komuś innemu, a wtedy konto będzie można zapomnieć.",
    "forgetAccount.askAgain": "Poproś ponownie",
    "forgetAccount.home": "Wróć do {siteName}",

    "registrationsSuspended.title": "Rejestracja jest na razie wstrzymana",
    "registrationsSuspended.explanation":
      "Nie można teraz połączyć się z usługą potrzebną do rejestracji, więc nikt nie może się zarejestrować, dopóki znów nie odpowie. Nic z tego, co wpisano, nie zostało zachowane.",
    "registrationsSuspended.tryAgainLater":
      "Spróbuj ponownie za jakiś czas. Administrator serwisu został powiadomiony.",
    "registrationsSuspended.home": "Wróć do {siteName}",

    "signIn.title": "Logowanie",
    "signIn.emailAddress": "Adres e-mail",
    "signIn.password": "Hasło",
    "signIn.submit": "Zaloguj się",
    "signIn.forgotPassword": "Nie pamiętam hasła",
    "signIn.register": "Zarejestruj się",
    "signIn.withGoogle": "Zaloguj się przez Google",
    "signIn.or": "lub",
    "signIn.tryAgainLater":
      "W ostatnim czasie podjęto zbyt wiele prób. Odczekaj godzinę i spróbuj ponownie.",

    "SignIn.Failed":
      "Adres e-mail lub hasło jest nieprawidłowe. Spróbuj ponownie.",

    "profile.title": "Profil",
    "profile.name": "Nazwa:",
    "profile.emailAddress": "Adres e-mail:",

    "changeName.title": "Zmień nazwę",
    "changeName.name": "Nazwa",
    "changeName.submit": "Zmień nazwę",

    "setPassword.title": "Ustaw hasło",
    "setPassword.explanation":
      "Twoje konto nie ma hasła: logujesz się przez Google. Aby logować się także hasłem, wyślemy na adres {emailAddress} odsyłacz do jego ustawienia.",
    "setPassword.submit": "Wyślij mi odsyłacz",
    "setPassword.sent.title": "Sprawdź pocztę",
    "setPassword.sent.explanation":
      "Wysłaliśmy ci odsyłacz do ustawienia hasła. Działa przez godzinę.",
    "setPassword.profile": "Wróć do profilu",

    "changePassword.title": "Zmień hasło",
    "changePassword.currentPassword": "Obecne hasło",
    "changePassword.password": "Nowe hasło",
    "changePassword.passwordConfirmation": "Powtórz hasło",
    "changePassword.forgotPassword": "Nie pamiętam hasła",
    "changePassword.submit": "Zmień hasło",
    "ChangePassword.WrongPassword": "To nie jest twoje hasło.",

    "changeEmailAddress.title": "Zmień adres e-mail",
    "changeEmailAddress.emailAddress": "Nowy adres e-mail",
    "changeEmailAddress.currentPassword": "Obecne hasło",
    "changeEmailAddress.submit": "Wyślij odsyłacz do potwierdzenia",
    "changeEmailAddress.sent.title": "Sprawdź pocztę",
    "changeEmailAddress.sent.explanation":
      "Odsyłacz potwierdzający przeniesienie został wysłany na nowy adres e-mail. Kliknij go po zalogowaniu, aby przenieść tam konto.",
    "changeEmailAddress.confirm.title": "Przenieś konto",
    "changeEmailAddress.confirm.explanation":
      "Twoje konto zostanie przeniesione na adres {emailAddress}. Od teraz będziesz logować się tym adresem.",
    "changeEmailAddress.confirm.submit": "Przenieś moje konto",
    "changeEmailAddress.noLongerWorks.title": "Ten odsyłacz już nie działa",
    "changeEmailAddress.noLongerWorks.explanation":
      "Wygasł, został już użyty albo nie wysłano go dla konta z otwartą sesją. Poproś ponownie z poziomu profilu.",
    "changeEmailAddress.taken.title": "Konto nie zostało przeniesione",
    "changeEmailAddress.profile": "Wróć do profilu",
    "ChangeEmailAddress.WrongPassword": "To nie jest twoje hasło.",
    "ChangeEmailAddress.Unchanged": "Twoje konto ma już ten adres.",
    "ChangeEmailAddress.Taken":
      "Ten adres e-mail ma już własne konto, więc twojego nie można tam przenieść.",

    "confirmEmailAddress.title": "Potwierdź adres e-mail",
    "confirmEmailAddress.name": "Nazwa",
    "confirmEmailAddress.password": "Hasło",
    "confirmEmailAddress.confirmPassword": "Powtórz hasło",
    "confirmEmailAddress.submit": "Potwierdź mój adres e-mail",
    "confirmEmailAddress.signIn": "Zaloguj się",
    "confirmEmailAddress.home": "Wróć do {siteName}",
    "confirmEmailAddress.confirmed.title": "Adres e-mail został potwierdzony",
    "confirmEmailAddress.confirmed.explanation":
      "Twoje konto jest gotowe. Zaloguj się adresem e-mail i hasłem, które przed chwilą podano.",
    "confirmEmailAddress.expired.title": "Ten odsyłacz wygasł",
    "confirmEmailAddress.expired.explanation":
      "Odsyłacz potwierdzający adres e-mail działa przez 24 godziny. Poproś o nowy, a zostanie wysłany na ten sam adres.",
    "confirmEmailAddress.expired.newLink": "Wyślij nowy odsyłacz",
    "confirmEmailAddress.noLongerWorks.title": "Ten odsyłacz już nie działa",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Sprawdź, czy użyto całego odsyłacza z e-maila, bez brakującego końca. Jeśli nadal nie działa, zarejestruj się ponownie, a zostanie wysłany nowy odsyłacz.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Ten adres e-mail jest już potwierdzony",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Nie ma już nic do zrobienia. Zaloguj się hasłem podanym przy potwierdzaniu.",

    // Naruszona zasada, nazwana kodem, pokazywana pod polem.
    "PersonName.Missing": "Wpisz nazwę.",
    "PersonName.TooShort": "Nazwa musi mieć co najmniej 3 znaki.",
    "PersonName.TooLong": "Nazwa może mieć najwyżej 254 znaki.",
    "WorldRankingName.TooShort":
      "Nazwa w rankingu światowym musi mieć co najmniej 3 znaki.",
    "WorldRankingName.TooLong":
      "Nazwa w rankingu światowym może mieć najwyżej 254 znaki.",
    "Password.Missing": "Wpisz hasło.",
    "Password.TooShort": "Hasło musi mieć co najmniej 12 znaków.",
    "Password.ConfirmationDiffers":
      "To nie jest to samo co hasło powyżej. Wpisz je jeszcze raz.",
    "Password.Breached":
      "To hasło pojawiło się w wycieku danych gdzie indziej, więc nie jest bezpieczne w tym miejscu. Wybierz inne.",

    "javaScriptRequired.title": "Wymagane skrypty",
    "javaScriptRequired.explanation":
      "Rejestracja wymaga włączenia skryptów dla tego serwisu, aby można było sprawdzić, że rejestruje się człowiek. Włącz je, a potem zarejestruj się ponownie.",
    "javaScriptRequired.register": "Wróć do rejestracji",
    "javaScriptRequired.home": "Wróć do {siteName}",

    "errors.backHome": "Wróć do {siteName}",
    "errors.notFound": "Nie znaleziono",
    "errors.refused": "Nie udało się tego zrobić",
    "errors.refusedDetail": "Coś w wysłanych danych jest nieprawidłowe.",
    "errors.sorry": "Przepraszamy",
    "errors.sorryDetail": "Nie udało się obsłużyć tego żądania.",
    "errors.failed": "Coś poszło nie tak",
    "errors.reference": "Numer referencyjny {reference}.",
    "errors.recorded":
      "Błąd został zapisany, a administratorowi wysłano e-mail. Warto napisać do administratora, podając numer referencyjny i opis tego, co było robione.",
    "errors.message": "Napisz do administratora",
    "errors.messageSubject": "Błąd {reference} w {siteName}",
    "errors.messageBody": "Co robiono, gdy to się stało:\n\n",
    "errors.unavailable": "Serwis jest niedostępny",
    "errors.unavailableDetail":
      "Serwis nie może teraz połączyć się z tym, czego potrzebuje. Spróbuj ponownie później.",
    "errors.maintenance":
      "Serwis jest wyłączony z powodu prac konserwacyjnych.",
    "errors.maintenanceMinutes": "Powrót spodziewany za {minutes} min.",
    "errors.maintenanceMinute": "Powrót spodziewany za 1 minutę.",
    "errors.maintenanceLonger":
      "Trwa to dłużej, niż oczekiwano, ale serwis wkrótce wróci.",

    // Dwie listy strony głównej i odsyłacz do wszystkich turniejów roku.
    "home.recentResults": "Ostatnie wyniki",
    "home.recentResults.none":
      "W ciągu ostatnich siedmiu dni nie dodano żadnych gier.",
    "home.upcomingTournaments": "Nadchodzące turnieje",
    "home.upcomingTournaments.none":
      "W ciągu najbliższych sześćdziesięciu dni nie zaczyna się żaden turniej.",
    "home.allTournaments": "Wszystkie turnieje w roku {year}",
    "year.heading": "Turnieje w roku {year}",
    "year.none": "W roku {year} nie zaczyna się żaden turniej.",
    "yearSport.heading": "Turnieje: {sport}, rok {year}",
    "yearSport.none": "W roku {year} nie zaczyna się żaden turniej: {sport}.",
    // Strona turnieju: jej sekcje, opis gry, jak dawno ją dodano i co mówi,
    // gdy nic nie ma.
    "tournament.recent": "Ostatnie",
    "tournament.summary": "Podsumowanie",
    // Siatka testu: czego najlepszym z meczów jest każdy mecz, słowo między
    // drużynami i sumy pod meczami.
    "test.bestOf": "Każdy mecz toczy się do {count} wygranych gier.",
    "test.vs": "vs",
    "test.matches": "Mecze",
    "test.games": "Gry",
    "test.hoops": "Bramki",
    "teamSummary.tests": "Testy",
    "teamSummary.matches": "Mecze",
    "teamSummary.games": "Gry",
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
    "players.search.prompt": "Wpisz nazwę zawodnika, aby go znaleźć.",
    "players.search.none": "Nie znaleziono żadnych zawodników.",
    "search.more":
      "Pokazano tylko pierwsze {count}. Wpisz więcej nazwy, aby zawęzić wyszukiwanie.",
    "websitePlayer.tournament": "Turniej",
    "tournament.test": "{first} vs {second}",
    "tournament.notes": "Notatki",
    "tournament.commentary": "Komentarz",
    "tournament.beat": "wygrywa z",
    "tournament.drewWith": "remisuje z",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 godz.",
    "tournament.ago.hours": "{count} godz.",
    "tournament.none": "Nie rozegrano jeszcze żadnej gry.",
    "players.none": "Nie dodano jeszcze żadnych zawodników.",
    // Strona komentarzy turnieju: jak wypisany jest komentarz i odsyłacz do
    // założenia nowego.
    "commentaries.by": "autor:",
    "commentaries.start": "Zacznij nowy komentarz",
    "startCommentary.title": "Zacznij nowy komentarz",
    "startCommentary.titleField": "Tytuł",
    "startCommentary.submit": "Zacznij komentarz",
    // „Nowe” czyta czytnik ekranu zamiast czerwonej gwiazdki oznaczającej
    // notatkę lub komentarz, które nie zostały przeczytane w obecnej postaci.
    "marks.new": "nowe",
    "notes.none": "Organizatorzy nie napisali jeszcze żadnych notatek.",
    "note.edited": "zmieniono",
    "commentary.none": "Nie napisano jeszcze żadnych komentarzy.",
    "commentary.edited": "zmieniono",
    "commentary.edit": "Edytuj",
    "commentary.delete": "Usuń",
    "commentary.comment": "Komentarz",
    "commentary.add": "Dodaj komentarz",
    "commentary.notSent":
      "Nie udało się wysłać komentarza. Załaduj stronę ponownie, aby zobaczyć, czy został zachowany.",
    "changeCommentaryTitle.title": "Zmień tytuł",
    "changeCommentaryTitle.submit": "Zapisz",
    "editComment.title": "Edytuj komentarz",
    "editComment.save": "Zapisz",
    "deleteComment.title": "Usuń komentarz",
    "deleteComment.question": "Usunąć ten komentarz? Tego nie można cofnąć.",
    "deleteComment.confirm": "Usuń komentarz",
    "deleteComment.keep": "Zostaw",
    // Strona zawodnika.
    "player.games": "Gry",
    "player.competitions": "Konkurencje",
    "player.beat": "wygrana z",
    "player.lostTo": "przegrana z",
    "player.drewWith": "remis z",
    "player.score": "{score} do {opponent}",
    "player.noGames": "Nie rozegrano jeszcze żadnej gry.",
    "player.noCompetitions": "Nie zgłoszono jeszcze do żadnej konkurencji.",
    // Strona grupy: sumy w siatce, wynik dla zawodnika w wierszu czytany na
    // głos oraz zawodnik, który się wycofał.
    "block.wins": "Wygrane",
    "block.matches": "Mecze",
    "block.netGames": "Bilans gier",
    "block.games": "Gry",
    "block.netHoops": "Bilans bramek",
    "block.won": "wygrana",
    "block.lost": "przegrana",
    "block.drawn": "remis",
    "block.withdrawn": "wycofany",
    "block.gameWithdrawn": "wycofana",
    "block.losses": "Przegrane",
    "competition.views": "Widoki",
    "competition.view.grid": "Siatka",
    "competition.view.summary": "Podsumowanie",
    "competition.view.orderOfPlay": "Kolejność gier",
    "competition.print": "Drukuj",
    "blockSummary.ranking":
      "Kolejność według odsetka wygranych meczów, potem według bilansu bramek. Regulamin turnieju może ustalać kolejność zawodników inaczej.",
    "orderOfPlay.none": "Nie rozegrano jeszcze żadnej gry.",
    "orderOfPlay.column.game": "Gra",
    "orderOfPlay.column.date": "Data",
    // Rundy turnieju pucharowego, liczone od ostatniej.
    "knockout.round.final": "Finał",
    "knockout.round.semis": "Półfinały",
    "knockout.round.quarters": "Ćwierćfinały",
    "knockout.round.number": "Runda {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Gry",
    "swiss.wins": "Wygrane",
    "swiss.winShare": "% wygranych",
    "swiss.results": "Wyniki",
    "knockout.onward": "Dalsze rundy",
    "knockout.back": "Wcześniejsze rundy",
    "tournamentList.column.date": "Data",
    "tournamentList.column.name": "Nazwa",
    "tournamentList.onlyIn": "Tylko turnieje: {country}",
    "tournamentList.usualOrder": "Wróć do zwykłej kolejności",
    "tournamentList.filter.country": "Kraj",
    "tournamentList.filter.anyCountry": "Dowolny kraj",
    "tournamentList.filter.region": "Region",
    "tournamentList.filter.anyRegion": "Dowolny region",
    "tournamentList.filter.noRegionsBefore":
      "Turnieje sprzed listopada 2026 nie mają regionu.",
    "tournamentList.filter.sport": "Dyscyplina",
    "tournamentList.filter.anySport": "Dowolna dyscyplina",
    "tournamentList.filter.submit": "Filtruj",
    "years.label": "Lata",
    "years.earlier": "Wcześniejsze lata",

    // Słowa administracji.
    "admin.newerBuild.message": "Dostępna jest nowsza wersja tego serwisu.",
    "admin.newerBuild.reload": "Załaduj ponownie",
    "admin.title": "Administracja",
    "admin.tournaments.new": "Nowy turniej",
    "admin.tournaments.none": "Brak turniejów",
    "admin.tournaments.filter.none": "Żaden turniej nie pasuje",
    "admin.tournaments.show": "Pokaż",
    "admin.tournaments.managerScorer": "Kierownik/Sędzia punktowy",
    "admin.tournaments.worldRanking": "Ranking światowy",
    "admin.tournaments.notWorldRanking": "Poza rankingiem światowym",
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
    "admin.tournament.format": "Formuła",
    "admin.tournament.sport": "Dyscyplina",
    "admin.tournament.country": "Kraj",
    "admin.tournament.region": "Region",
    "admin.tournament.subtitle": "Podtytuł",
    "admin.rules.handicap": "Rozgrywany z handicapem",
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
    "admin.view.scorers": "Osoby wprowadzające wyniki",
    "admin.view.rankings": "Rankingi",
    "admin.rankings.file":
      "Rankingi światowe wykorzystają wyniki turnieju za pomocą tej funkcji, więc organizatorzy nie muszą nic robić.",
    "admin.rankings.download": "Pobierz gry do rankingu światowego",
    "rankings.notAvailable": "Rankingi są niedostępne",
    "rankings.notAvailable.sport":
      "Dyscyplina tego turnieju nie ma rankingów światowych, więc nie ma rankingów do wysłania.",
    "rankings.notAvailable.notCounted":
      "Żadna konkurencja tego turnieju nie liczy się do rankingów światowych.",
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
    "admin.administrator.sections.countries": "Kraje",
    "admin.databaseStatus.title": "Dostęp do bazy danych",
    "admin.databaseStatus.on": "Dostęp do bazy danych jest włączony.",
    "admin.databaseStatus.off": "Dostęp do bazy danych jest wyłączony.",
    "admin.databaseStatus.expected": "Serwis ma wrócić za {minutes} min.",
    "admin.databaseStatus.expectedOne": "Serwis ma wrócić za 1 minutę.",
    "admin.databaseStatus.longer": "Trwa to dłużej, niż oczekiwano.",
    "admin.databaseStatus.told": "Czytelnicy widzą: {words}",
    "admin.databaseStatus.toldUsual": "Czytelnicy widzą zwykłe zdanie.",
    "admin.databaseStatus.minutes": "Oczekiwane minuty",
    "admin.databaseStatus.words": "Słowa dla czytelników",
    "admin.databaseStatus.turnOff": "Wyłącz",
    "admin.databaseStatus.change": "Zmień",
    "admin.databaseStatus.turnOn": "Włącz",
    "admin.databaseStatus.minutesNeeded": "Wymagana jest liczba minut.",
    "admin.databaseStatus.otherwise": "W serwisie coś poszło nie tak.",
    "DatabaseAccess.MinutesNotWhole": "Liczba minut musi być liczbą całkowitą.",
    "DatabaseAccess.MinutesOutOfRange":
      "Liczba minut musi mieścić się w zakresie od 1 do 1440.",
    "DatabaseAccess.WordsTooLong": "Słowa mogą mieć najwyżej 500 znaków.",
    "DatabaseAccess.NotOff": "Dostęp do bazy danych nie jest wyłączony.",
    "admin.administrator.title": "Administrator",
    // Strona kont, sekcja dla każdej roli.
    "admin.accounts.title": "Konta",
    "admin.roles.add": "Dodaj",
    "admin.roles.administrator.heading": "Administratorzy",
    "admin.roles.administrator.none": "Brak innych administratorów",
    "admin.roles.administrator.removeTitle": "Usuń administratora",
    "admin.roles.administrator.removeExplanation":
      "{name} nie będzie już administratorem tego serwisu.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Osoby odpowiedzialne za ranking światowy w krokiecie klasycznym",
    "admin.roles.ac-world-ranking-officer.none":
      "Brak osób odpowiedzialnych za ranking światowy w krokiecie klasycznym",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Usuń osobę odpowiedzialną za ranking światowy w krokiecie klasycznym",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} nie będzie już osobą odpowiedzialną za ranking światowy w krokiecie klasycznym.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Osoby odpowiedzialne za ranking światowy w krokiecie golfowym",
    "admin.roles.gc-world-ranking-officer.none":
      "Brak osób odpowiedzialnych za ranking światowy w krokiecie golfowym",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Usuń osobę odpowiedzialną za ranking światowy w krokiecie golfowym",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} nie będzie już osobą odpowiedzialną za ranking światowy w krokiecie golfowym.",
    // Strona importu zawodników rankingów światowych i jej dziennik.
    "admin.worldRankings.title": "Import zawodników rankingów światowych",
    "admin.worldRankings.import": "Importuj",
    "admin.worldRankings.log": "Przebieg importu",
    "admin.worldRankings.ac.reading": "Czytanie listy krokieta klasycznego",
    "admin.worldRankings.ac.read":
      "Przeczytani zawodnicy krokieta klasycznego: {players}",
    "admin.worldRankings.ac.kept":
      "Zachowani zawodnicy krokieta klasycznego: {players}",
    "admin.worldRankings.ac.refused":
      "Nie udało się przeczytać listy krokieta klasycznego, więc jej zawodnicy pozostali bez zmian.",
    "admin.worldRankings.gc.reading": "Czytanie listy krokieta golfowego",
    "admin.worldRankings.gc.read":
      "Przeczytani zawodnicy krokieta golfowego: {players}",
    "admin.worldRankings.gc.kept":
      "Zachowani zawodnicy krokieta golfowego: {players}",
    "admin.worldRankings.gc.refused":
      "Nie udało się przeczytać listy krokieta golfowego, więc jej zawodnicy pozostali bez zmian.",
    "admin.worldRankings.finished": "Zakończono",
    "admin.worldRankings.failed": "Import nie został ukończony.",
    "admin.worldRankings.otherwise": "W serwisie coś poszło nie tak.",
    "WorldRankingLists.Unreachable":
      "Nie można połączyć się ze stroną rankingów światowych.",
    "WorldRankingLists.Unreadable":
      "Lista nie ma układu, w jakim rankingi światowe ją podają: nie udało się przeczytać jednego z jej wierszy, nikogo na niej nie ma albo nie jest zapisana w UTF-8.",
    // Dokumenty odrzucone przy imporcie ze starych serwisów i strona jednego z nich.
    "admin.importErrors.title": "Błędy importu",
    "admin.importErrors.none": "Brak błędów importu",
    "admin.importErrors.otherwise": "W serwisie coś poszło nie tak.",
    "admin.countries.title": "Kraje",
    "admin.countries.none":
      "Żaden turniej nie odbywa się w kraju, którego listy nie wymieniają",
    "admin.countries.oldSite": "Stara strona",
    "admin.countries.otherwise": "W serwisie coś poszło nie tak.",
    "admin.logs.title": "Dzienniki",
    "admin.logs.severity": "Ważność",
    "admin.logs.text": "Wyszukaj",
    "admin.logs.show": "Pokaż",
    "admin.logs.prune": "Wyczyść",
    "admin.logs.pruneAsk":
      "Usunąć dziennik sprzed ostatniej godziny? Nic tego nie przywróci.",
    "admin.logs.removed": "Usunięto wpisów: {count}",
    "admin.logs.none": "Brak wpisów w dzienniku",
    "admin.logs.otherwise": "W serwisie coś poszło nie tak.",
    "admin.hover.logs.show": "Pokaż pasujące wpisy",
    "admin.hover.logs.prune": "Usuń dziennik sprzed ostatniej godziny",
    "admin.hover.logs.pruneAgree": "Usuń dziennik sprzed ostatniej godziny",
    "admin.importError.title": "Błąd importu",
    "admin.importError.documentId": "Identyfikator dokumentu",
    "admin.importError.tournament": "Turniej",
    "admin.importError.competition": "Konkurencja",
    "admin.importError.newSite": "Nowy serwis",
    "admin.importError.oldSite": "Stary serwis",
    "ImportErrorKept.NotFound":
      "Import nie zachował żadnego błędu dla tego dokumentu.",
    "admin.competitionView.otherwise":
      "Tą konkurencją nie można stąd zarządzać.",
    // Zakładka Konkurencje: rodzaj każdej konkurencji, co można z nią zrobić
    // i nagłówek, pod którym są zarchiwizowane.
    "admin.competitions.block": "Grupowa",
    "admin.competitions.knockout": "Pucharowa",
    "admin.competitions.swiss": "Szwajcarska",
    "admin.competitions.view": "Zobacz",
    "admin.competitions.edit": "Edytuj",
    "admin.competitions.up": "W górę",
    "admin.competitions.down": "W dół",
    "admin.competitions.archive": "Archiwizuj",
    "admin.competitions.restore": "Przywróć",
    "admin.competitions.archived": "Zarchiwizowane konkurencje",
    "admin.competitions.none": "Brak konkurencji",
    "admin.competitions.add": "Dodaj konkurencję",
    // Okno konkurencji.
    "admin.competition.addTitle": "Dodaj konkurencję",
    "admin.competition.editTitle": "Edytuj konkurencję",
    "admin.competition.name": "Nazwa",
    "admin.competition.kind": "Rodzaj",
    "admin.competition.bestOf": "Do wygranych gier",
    "admin.competition.rounds": "Rundy",
    "admin.competition.places": "Miejsca",
    "admin.competition.round": "Runda {number}",
    "admin.competition.bestOfs": "Do wygranych gier w rundach",
    "admin.competition.quarters": "Ćwierćfinały",
    "admin.competition.semis": "Półfinały",
    "admin.competition.final": "Finał",
    "admin.competition.add": "Dodaj",
    "admin.competition.save": "Zapisz",
    "admin.competition.added": "Dodano: {name}.",
    "admin.competition.otherwise":
      "Tej konkurencji nie można zachować w tej postaci.",
    "CompetitionName.Missing": "Wpisz nazwę.",
    "CompetitionName.TooLong": "Nazwa może mieć najwyżej 254 znaki.",
    "CompetitionName.NoLetterOrDigit": "Nazwa musi zawierać literę lub cyfrę.",
    "Tournament.KnockoutPlayerHasGames":
      "Zawodnicy w tym losowaniu mają rozegrane gry, więc jego miejsc nie można zmienić.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Rundy z rozstrzygniętym meczem nie można zamienić na krótszą, do mniejszej liczby wygranych gier.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Rundy nie można zmienić, gdy w późniejszej rundzie rozegrano już grę.",
    "Tournament.CompetitionNameTaken":
      "Inna konkurencja w tym turnieju ma już taką nazwę.",
    "BestOf.NotWhole": "Wpisz całkowitą liczbę gier.",
    "BestOf.TooSmall": "Mecz musi toczyć się co najmniej do 1 gry.",
    "Rounds.NotWhole": "Wpisz całkowitą liczbę rund.",
    "Rounds.TooSmall": "Grupa musi być rozegrana w co najmniej 1 rundzie.",
    "KnockoutDraw.EvenBestOf":
      "Mecz pucharowy musi mieć zwycięzcę, więc toczy się do nieparzystej liczby gier.",
    // Podpowiedzi przycisków i okien.
    "admin.hover.tournaments.new": "Utwórz nowy turniej",
    "admin.hover.tournaments.manage":
      "Zarządzaj zawodnikami, drużynami, konkurencjami i wynikami tego turnieju",
    "admin.hover.tournaments.edit": "Zmień dane tego turnieju",
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
    "admin.hover.dialog.carryForward.save":
      "Przenieś wyniki tego zawodnika dalej",
    "admin.hover.dialog.tournament.new": "Utwórz ten turniej",
    "admin.hover.dialog.tournament.edit": "Zachowaj zmiany tego turnieju",
    "admin.hover.modal.cancel": "Zamknij bez zachowywania czegokolwiek",
    "admin.hover.modal.ok": "Zamknij ten komunikat",
    "admin.hover.tab": "Pokaż zakładkę {name}",
    "admin.hover.tournaments.archive":
      "Zarchiwizuj ten turniej; można go przywrócić",
    "admin.hover.tournaments.restore": "Przywróć ten zarchiwizowany turniej",
    "admin.hover.players.add": "Dodaj zawodnika do tego turnieju",
    "admin.hover.players.addMany":
      "Dodaj kilku zawodników do tego turnieju naraz",
    "admin.hover.dialog.players.add": "Dodaj tych zawodników do turnieju",
    "admin.hover.players.edit": "Zmień dane tego zawodnika",
    "admin.hover.players.up": "Przesuń tego zawodnika w górę listy",
    "admin.hover.players.down": "Przesuń tego zawodnika w dół listy",
    "admin.hover.players.archive":
      "Zarchiwizuj tego zawodnika; można go przywrócić",
    "admin.hover.players.restore": "Przywróć tego zarchiwizowanego zawodnika",
    "admin.hover.teams.add": "Dodaj drużynę do tego turnieju",
    "admin.hover.teams.edit": "Zmień dane tej drużyny",
    "admin.hover.teams.up": "Przesuń tę drużynę w górę listy",
    "admin.hover.teams.down": "Przesuń tę drużynę w dół listy",
    "admin.hover.teams.archive": "Zarchiwizuj tę drużynę; można ją przywrócić",
    "admin.hover.teams.restore": "Przywróć tę zarchiwizowaną drużynę",
    "admin.hover.competitions.add": "Dodaj konkurencję do tego turnieju",
    "admin.hover.competitions.edit": "Zmień dane tej konkurencji",
    "admin.hover.competitions.up": "Przesuń tę konkurencję w górę listy",
    "admin.hover.competitions.down": "Przesuń tę konkurencję w dół listy",
    "admin.hover.competitions.archive":
      "Zarchiwizuj tę konkurencję; można ją przywrócić",
    "admin.hover.competitions.restore":
      "Przywróć tę zarchiwizowaną konkurencję",
    "admin.hover.tests.add": "Dodaj test między dwiema drużynami",
    "admin.hover.tests.edit": "Zmień dane tego testu",
    "admin.hover.tests.up": "Przesuń ten test w górę listy",
    "admin.hover.tests.down": "Przesuń ten test w dół listy",
    "admin.hover.tests.archive": "Zarchiwizuj ten test; można go przywrócić",
    "admin.hover.tests.restore": "Przywróć ten zarchiwizowany test",
    "admin.hover.tests.toTeams":
      "Przejdź do zakładki Drużyny, aby dodać drużyny potrzebne do testu",
    "admin.hover.scores.add": "Dodaj wynik gry do tej konkurencji",
    "admin.hover.scores.edit": "Popraw ten wynik",
    "admin.hover.scores.archive":
      "Zarchiwizuj ten wynik, aby przestał się liczyć; można go przywrócić",
    "admin.hover.scores.restore":
      "Przywróć ten zarchiwizowany wynik, aby znów się liczył",
    "admin.hover.scores.withdraw":
      "Zostaw ten wynik na liście, ale przestań go liczyć",
    "admin.hover.scores.unwithdraw":
      "Spraw, aby ten wycofany wynik znów się liczył",
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
    // Zakładki Organizatorzy i Osoby wprowadzające wyniki: każda robi kogoś
    // jednym z nich po adresie e-mail i go odbiera.
    "admin.people.emailAddress": "Adres e-mail",
    "admin.people.remove": "Usuń",
    "admin.people.otherwise": "Tego nie udało się zrobić.",
    "admin.managers.you": "Ty",
    "admin.managers.add": "Dodaj organizatora",
    "admin.managers.email": "Napisz do organizatorów",
    "admin.managers.none": "Brak organizatorów",
    "admin.managers.removeTitle": "Usuń organizatora",
    "admin.managers.removeExplanation":
      "{name} nie będzie już mieć możliwości prowadzenia tego turnieju.",
    "admin.managers.removeYourself.explanation":
      "Nie będziesz już mieć możliwości prowadzenia tego turnieju i nikt tutaj nie może tego za ciebie cofnąć. Inny organizator może znów cię nim uczynić.",
    "admin.managers.otherwise": "Ten adres nie może zostać organizatorem.",
    // Zakładka Zawodnicy konkurencji.
    "admin.competitionPlayers.add": "Dodaj zawodnika",
    "admin.competitionPlayers.otherwise": "Tego zawodnika nie można dodać.",
    "admin.competitionPlayers.choose": "Zawodnik do dodania",
    "admin.competitionPlayers.nobody": "Wybierz zawodnika",
    "admin.competitionPlayers.bye": "Bye",
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
      "{name} zostanie usunięty z konkurencji. Tego nie można cofnąć.",
    "admin.competitionPlayers.withdrawTitle": "Wycofaj zawodnika",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} nie będzie już grać w konkurencji, a gry, których nie rozegrano, zostaną rozstrzygnięte bez udziału tego zawodnika.",
    "admin.competitionPlayers.carryForward": "Przenieś wyniki",
    "admin.carryForward.title": "Przenieś wyniki - {name}",
    "admin.carryForward.save": "Zapisz",
    "admin.carryForward.otherwise":
      "Tych przeniesionych wyników nie można zachować.",
    "admin.carryForward.matchWins": "Wygrane mecze",
    "admin.carryForward.matchLosses": "Przegrane mecze",
    "admin.carryForward.gameWins": "Wygrane gry",
    "admin.carryForward.gameLosses": "Przegrane gry",
    "admin.carryForward.hoopsFor": "Bramki zdobyte",
    "admin.carryForward.hoopsAgainst": "Bramki stracone",
    "CarryForward.MatchWinsNotWhole":
      "Wpisz całkowitą liczbę wygranych meczów.",
    "CarryForward.MatchWinsBelowZero": "Wpisz 0 lub więcej wygranych meczów.",
    "CarryForward.MatchLossesNotWhole":
      "Wpisz całkowitą liczbę przegranych meczów.",
    "CarryForward.MatchLossesBelowZero":
      "Wpisz 0 lub więcej przegranych meczów.",
    "CarryForward.GameWinsNotWhole": "Wpisz całkowitą liczbę wygranych gier.",
    "CarryForward.GameWinsBelowZero": "Wpisz 0 lub więcej wygranych gier.",
    "CarryForward.GameLossesNotWhole":
      "Wpisz całkowitą liczbę przegranych gier.",
    "CarryForward.GameLossesBelowZero": "Wpisz 0 lub więcej przegranych gier.",
    "CarryForward.HoopsForNotWhole": "Wpisz całkowitą liczbę bramek zdobytych.",
    "CarryForward.HoopsForBelowZero": "Wpisz 0 lub więcej bramek zdobytych.",
    "CarryForward.HoopsAgainstNotWhole":
      "Wpisz całkowitą liczbę bramek straconych.",
    "CarryForward.HoopsAgainstBelowZero":
      "Wpisz 0 lub więcej bramek straconych.",
    // Zakładka Wyniki konkurencji i okno wyniku.
    "admin.scores.add": "Dodaj wynik",
    "admin.scores.none": "Brak wyników",
    "admin.scores.edit": "Edytuj",
    "admin.scores.drawNotFilledTitle": "Losowanie niewypełnione",
    "admin.scores.archive": "Archiwizuj",
    "admin.scores.up": "W górę",
    "admin.scores.down": "W dół",
    "admin.scores.restore": "Przywróć",
    "admin.scores.archived": "Zarchiwizowane wyniki",
    "admin.scores.archivedSaid": "Zarchiwizowany",
    "admin.scores.withdraw": "Wycofaj",
    "admin.scores.unwithdraw": "Cofnij wycofanie",
    "admin.scores.withdrawnSaid": "Wycofany",
    "admin.scores.otherwise": "Tego nie udało się zrobić.",
    "admin.score.title": "Dodaj wynik",
    "admin.score.add": "Dodaj grę",
    "admin.score.winner": "Zwycięzca",
    "admin.score.winnerScore": "Wynik zwycięzcy",
    "admin.score.loser": "Przegrany",
    "admin.score.loserScore": "Wynik przegranego",
    "admin.score.beat": "pokonuje",
    "admin.score.added": "Dodano grę: {winner} wygrywa z {loser}.",
    "admin.score.otherwise": "Nie udało się dodać gry.",
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
      "Poprawka zachowuje rezultat: gra wygrana pozostaje wygrana, a zremisowana pozostaje remisem.",
    "Competition.MatchDecided": "Ich mecz jest już rozstrzygnięty.",
    "Competition.DrawFull":
      "Nie można dodać zawodnika, ponieważ drabinka pucharowa jest pełna.",
    "Competition.DrawNotFilled":
      "Wyników nie można dodawać, dopóki każde miejsce w drabince pucharowej nie zostanie zapełnione zawodnikiem lub bye.",
    "Competition.ByeOutsideKnockout":
      "Bye może mieć tylko konkurencja pucharowa.",
    "Competition.NotDrawnToMeet":
      "Ci zawodnicy nie są obecnie wylosowani do gry ze sobą w drabince pucharowej.",
    "Competition.WinnerHasPlayedOn":
      "Zwycięzca tego meczu rozegrał już następną grę, więc nie można zmienić, kto go wygrał.",
    "CompetitionPlayer.Withdrawn": "Wycofany zawodnik już nie gra.",
    "admin.players.add": "Dodaj zawodnika",
    "admin.players.addMany": "Dodaj zawodników",
    "admin.players.none": "Brak zawodników",
    "admin.players.edit": "Edytuj",
    "admin.players.archive": "Archiwizuj",
    "admin.players.restore": "Przywróć",
    "admin.players.up": "W górę",
    "admin.players.down": "W dół",
    // Pytanie przed zarchiwizowaniem zawodnika biorącego udział w konkurencjach.
    "admin.players.archiveTitle": "Archiwizuj zawodnika",
    "admin.players.archiveQuestion":
      "{name} zostanie usunięty z tych konkurencji:",
    "admin.players.archive.explanation":
      "Przywrócenie zawodnika nie wprowadzi go z powrotem do tych konkurencji.",
    "admin.players.archived": "Zarchiwizowani zawodnicy",
    "admin.players.archivedSaid": "Zarchiwizowany",
    // Okno zawodnika.
    "admin.player.addTitle": "Dodaj zawodnika",
    "admin.player.editTitle": "Edytuj zawodnika",
    "admin.player.name": "Nazwa",
    "admin.player.handicap": "Handicap",
    "admin.player.representing": "Reprezentuje",
    "admin.player.worldRankingName": "Nazwa zawodnika w rankingu światowym",
    "admin.player.worldRankingKnown": "Rankingi światowe znają tę nazwę.",
    "admin.player.worldRankingQuestioned":
      "Rankingi światowe nie mają zawodnika o takiej nazwie. Może być źle napisana albo zawodnik może być nowy w rankingach.",
    "admin.player.flag": "Flaga",
    "admin.player.add": "Dodaj",
    "admin.player.save": "Zapisz",
    "admin.player.added": "Dodano: {name}.",
    // The players dialog (players.feature): several players written in one box.
    "admin.players.addManyTitle": "Dodaj zawodników",
    // A link in the title bar of a dialog, to the help that explains it.
    "admin.dialog.help": "Pomoc",
    "admin.players.many": "Zawodnicy",
    "admin.players.line": "Wiersz {line}: {words}",
    "AddPlayers.FieldsMissing": "Wpisz nazwy pól w pierwszym wierszu.",
    "AddPlayers.NameMissing": "Pola muszą obejmować Name.",
    "AddPlayers.FieldNotAllowed":
      "Polem może być Name, Representing, Flag, Handicap lub WorldRankingPlayerName.",
    "AddPlayers.FieldRepeated": "Każde pole można nazwać tylko raz.",
    "AddPlayers.PlayersMissing":
      "Wpisz zawodnika w każdym wierszu po pierwszym.",
    "AddPlayers.TooManyPlayers":
      "Lista może zawierać najwyżej 500 zawodników. Resztę dodaj na innej liście.",
    "AddPlayers.ValuesMismatched":
      "Każdy zawodnik musi mieć wartość lub pustą wartość dla każdego pola z pierwszego wiersza.",
    "admin.player.otherwise":
      "Tego zawodnika nie można zachować w tej postaci.",
    "Tournament.PlayerNameTaken":
      "Inny zawodnik w tym turnieju ma już taką nazwę.",
    "TournamentPlayer.NoSuchFlag": "Wybierz jedną z dostępnych flag.",
    "TournamentPlayer.HandicapMalformed":
      "Wpisz handicap jako liczbę. Na przykład: -1.5, -1, 0, 1, 2.5, 24.",
    "TournamentPlayer.NamedBye": "Zawodnik nie może nazywać się Bye.",
    "TournamentPlayer.NoLetterOrDigit": "Nazwa musi zawierać literę lub cyfrę.",
    "admin.player.byesTitle": "Bye nie trzeba dodawać",
    "admin.player.byes":
      "Bye nie jest jednym z zawodników turnieju. Konkurencja pucharowa oferuje Bye przy każdym dodawaniu zawodników, tyle razy, ile wymaga jej losowanie.",
    // Turniej drużynowy: zakładki Drużyny i Testy, strona drużyny i okna.
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
    "admin.team.shortName": "Skrót",
    "admin.team.shortName.explanation":
      "Jak nazywane są testy drużyny, na przykład AUS v ENG.",
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
      "Usuniętej notatki nie można odzyskać ani przywrócić.",
    "admin.notes.otherwise": "Tego nie udało się zrobić.",
    // Okno notatki, zakładki jej opisu i pasek narzędzi nad polem.
    "admin.note.addTitle": "Dodaj notatkę",
    "admin.note.editTitle": "Edytuj notatkę",
    "admin.note.title": "Tytuł",
    "admin.note.description": "Opis",
    "admin.note.write": "Pisz",
    "admin.note.preview": "Podgląd",
    "admin.note.toolbar": "Formatowanie",
    "admin.note.tool.heading": "Nagłówek",
    "admin.note.tool.bold": "Pogrubienie",
    "admin.note.tool.italic": "Kursywa",
    "admin.note.tool.quote": "Cytat",
    "admin.note.tool.code": "Kod",
    "admin.note.tool.link": "Odsyłacz",
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
    "CommentaryTitle.Missing": "Nadaj komentarzowi tytuł.",
    "CommentaryTitle.TooLong": "Ten tytuł jest zbyt długi.",
    "CommentaryTitle.NoLetterOrDigit": "Tytuł musi zawierać literę lub cyfrę.",
    "Commentary.TitleTaken": "Inny komentarz ma już taki tytuł.",
    "CommentText.Missing": "Napisz coś w komentarzu.",
    "CommentText.TooLong": "Ten komentarz jest zbyt długi.",
    "TeamShortName.Missing": "Nadaj drużynie skrót.",
    "TeamShortName.TooLong": "Skrót może mieć najwyżej 10 znaków.",
    "TeamShortName.NoLetterOrDigit": "Skrót musi zawierać literę lub cyfrę.",
    "Team.ShortNameLongerThanName":
      "Skrót nie może być dłuższy niż nazwa drużyny.",
    "Team.NoSuchFlag": "Wybierz jedną z dostępnych flag.",
    "Team.Archived":
      "Ta drużyna jest zarchiwizowana i najpierw trzeba ją przywrócić.",
    "Team.InATest": "Ta drużyna gra w teście i nie można jej zarchiwizować.",
    "Team.PlayerNameTaken": "Inny zawodnik w tej drużynie ma już taką nazwę.",
    "TeamPlayer.NamedBye": "Zawodnik nie może nazywać się Bye.",
    "TeamPlayer.Archived":
      "Ten zawodnik jest zarchiwizowany i najpierw trzeba go przywrócić.",
    "TeamPlayer.HasGames": "Ten zawodnik grał i nie można go zarchiwizować.",
    "Tournament.TeamNameTaken":
      "Inna drużyna w tym turnieju ma już taką nazwę.",
    "Tournament.TeamShortNameTaken":
      "Inna drużyna w tym turnieju ma już taki skrót.",
    "Tournament.NoSuchTeam": "Ten turniej nie ma drużyny pod tym adresem.",
    "Tournament.TeamArchived":
      "Ta drużyna jest zarchiwizowana i można ją przywrócić tylko z zakładki Drużyny.",
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
    "admin.tests.matches.one": "{count} mecz",
    "admin.tests.matches.other": "Mecze: {count}",
    "admin.tests.bestOf": "do {games} wygranych gier",
    "admin.tests.otherwise": "Tego nie udało się zrobić.",
    "admin.test.addTitle": "Dodaj test",
    "admin.test.editTitle": "Edytuj test",
    "admin.test.firstTeam": "Drużyna A",
    "admin.test.secondTeam": "Drużyna B",
    "admin.test.versus": "v",
    "admin.test.starts": "Początek",
    "admin.test.finishes": "Koniec",
    "admin.test.expectedMatches": "Oczekiwana liczba meczów",
    "admin.test.bestOf": "Do wygranych gier",
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
    "TestGroup.TooLong": "Ta grupa ma zbyt długą nazwę.",
    "Tournament.TestAgainstItself":
      "Drużyna nie rozgrywa testu przeciwko sobie.",
    "Tournament.TestFinishesBeforeStarts":
      "Test nie może się skończyć, zanim się zacznie.",
    "Tournament.TestStartsBeforeTournament":
      "Test nie może zacząć się przed turniejem.",
    "Tournament.TestFinishesAfterTournament":
      "Test nie może skończyć się po turnieju.",
    "Tournament.TestHasGamesInUse":
      "Ten test ma gry, więc nie można go zarchiwizować, dopóki one nie zostaną zarchiwizowane.",
    "Tournament.TestHasGames":
      "Ten test ma już gry, więc jego drużyn nie można już zmieniać.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Rozpoczęto już więcej meczów niż ta liczba.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dwóch zawodników rozegrało już więcej gier niż ta liczba.",
    "Competition.ExpectedMatchesReached":
      "W tym teście rozpoczęto już tyle meczów, ile się spodziewano.",
    "Competition.SameTeam":
      "Dwoje zawodników z tej samej drużyny nie gra ze sobą.",
    "AddManager.NoSuchAccount":
      "Ten adres nie ma konta, które można uczynić organizatorem.",
    "admin.scorers.add": "Dodaj osobę wprowadzającą wyniki",
    "admin.scorers.none": "Brak osób wprowadzających wyniki",
    "admin.scorers.removeTitle": "Usuń osobę wprowadzającą wyniki",
    "admin.scorers.removeExplanation":
      "{name} nie będzie już mieć możliwości wprowadzania wyników tego turnieju.",
    "admin.scorers.otherwise":
      "Ten adres nie może zostać osobą wprowadzającą wyniki.",
    "AddScorer.NoSuchAccount":
      "Ten adres nie ma konta, które można uczynić osobą wprowadzającą wyniki.",
    // Nadawanie, odbieranie i wypisywanie ról, co może robić tylko administrator.
    "Account.NotAnAdministrator": "Może to zrobić tylko administrator.",
    "AddRole.NoSuchAccount":
      "Ten adres nie ma konta, któremu można nadać rolę.",
    "AddRole.NoSuchRole": "Nie ma takiej roli.",
    "RemoveRole.NoSuchAccount": "Nie ma takiego konta.",
    "RemoveRole.NoSuchRole": "Nie ma takiej roli.",
    "RemoveRole.Yourself": "Nie możesz odebrać sobie roli administratora.",
    "AccountsWithRole.NoSuchRole": "Nie ma takiej roli.",
    "Tournament.AlreadyAManager":
      "To konto już zarządza turniejem i może robić wszystko, co robi osoba wprowadzająca wyniki.",

    // Odmowy dotyczące turnieju, nazwane kodami.
    "TournamentName.Missing": "Wpisz nazwę turnieju.",
    "TournamentName.TooShort": "Ta nazwa jest zbyt krótka.",
    "TournamentName.TooLong": "Ta nazwa jest zbyt długa.",
    "TournamentName.AllLowerCase":
      "Nazwa nie może składać się z samych małych liter.",
    "TournamentName.AllCapitals":
      "Nazwa nie może składać się z samych wielkich liter.",
    "TournamentName.NoLetterOrDigit": "Nazwa musi zawierać literę lub cyfrę.",
    "ReadOnlyDate.Unreadable": "Podaj dzień.",
    "Tournament.FinishesBeforeStarts":
      "Turniej nie może się skończyć, zanim się zacznie.",
    "Tournament.StartsAfterNextYear":
      "Turniej nie może zacząć się później niż w przyszłym roku.",
    "Tournament.FinishesAfterNextYear":
      "Turniej nie może skończyć się później niż w przyszłym roku.",
    "CreateTournament.NoSuchCountry": "Wybierz kraj.",
    "TournamentSubtitle.TooLong": "Podtytuł może mieć najwyżej 2000 znaków.",
    "Tournament.NotAManager":
      "Tylko organizator tego turnieju może go zmieniać.",
    "Tournament.NotAManagerOrScorer":
      "Tylko organizator lub osoba wprowadzająca wyniki tego turnieju może go zobaczyć.",
    "Tournament.Archived":
      "Ten turniej jest zarchiwizowany i trzeba go przywrócić, zanim będzie można go zmienić.",
    "UpdateTournament.NoSuchTournament": "Pod tym adresem nie ma turnieju.",

    // Dyscypliny, formuły i kraje według kodów.
    "sport.ac": "Krokiet klasyczny",
    "sport.gc": "Krokiet golfowy",
    "sport.a6w": "Amerykański krokiet sześciobramkowy",
    "sport.rc": "Rykoszet",
    "sport.gb": "Gateball",
    "format.standard": "Standardowa",
    "format.teams": "Drużynowa",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship":
      "Drużynowe mistrzostwa świata w krokiecie golfowym",
    // Kraje według kodów.
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

    // Wiadomości e-mail: temat i treść, w całości z kodem HTML. Pola w klamrach są wypełniane przez serwis.
    "Email.ConfirmAddress.subject": "Potwierdź swój adres e-mail w {siteName}",
    "Email.ConfirmAddress.body": `
<p>Cześć,</p>

<p>
    Dziękujemy za założenie konta w <strong>{siteName}</strong>.<br />
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
        Potwierdź mój adres e-mail
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też potwierdzić adres e-mail, otwierając ten odsyłacz w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Jeśli konto nie zostało założone przez ciebie, możesz bezpiecznie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Nowy odsyłacz do potwierdzenia adresu e-mail w {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Cześć,</p>

<p>
    Niedawno poproszono o nową wiadomość potwierdzającą adres e-mail w <strong>{siteName}</strong>.<br />
    Potwierdź adres e-mail, klikając poniższy przycisk:
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
        Potwierdź mój adres e-mail
    </a>
</p>

<p>
    Jeśli przycisk nie działa, możesz też potwierdzić adres e-mail, otwierając ten odsyłacz w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Po potwierdzeniu będziesz mieć możliwość dalszego korzystania z konta bez przerwy.
</p>

<p>
    Jeśli ta wiadomość nie została zamówiona przez ciebie, możesz ją bezpiecznie zignorować.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Ktoś próbował zarejestrować się na twój adres e-mail",
    "Email.AlreadyRegistered.body": `
<p>Cześć,</p>

<p>
    Ktoś próbował zarejestrować się w <strong>{siteName}</strong> na ten adres e-mail, który ma już konto. Nic w twoim koncie się nie zmieniło.<br />
    Jeśli to twoja próba, konto już istnieje i możesz się do niego zalogować:
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
    Jeśli to nie ty, nie musisz nic robić. Nikt nie dostał dostępu do twojego konta.
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
    Ktoś zalogowany na konto w <strong>{siteName}</strong> poprosił o przeniesienie go na ten adres e-mail. Jeśli to ty, potwierdź to tutaj, po zalogowaniu na to konto. Odsyłacz działa przez 24 godziny.
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
    Możesz też skopiować ten adres do przeglądarki:<br />
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
    Ktoś zalogowany na konto w <strong>{siteName}</strong> poprosił o przeniesienie go na ten adres e-mail, który ma już własne konto. Nic nie zostało przeniesione i nic w twoim koncie się nie zmieniło.
</p>

<p>
    Jeśli to twoja próba, konto pod tym adresem już istnieje i możesz się do niego zalogować.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Twoje konto w {siteName} zostało przeniesione",
    "Email.EmailAddressChanged.body": `
<p>Cześć,</p>

<p>
    Twoje konto w <strong>{siteName}</strong> zostało właśnie przeniesione na inny adres e-mail, {emailAddress}, i od teraz loguje się tym adresem.
</p>

<p>
    Jeśli to nie ty, ktoś inny ma twoje konto. Odpowiedz na tę wiadomość i daj nam znać.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject": "Hasło do {siteName} zostało zmienione",
    "Email.PasswordChanged.body": `
<p>Cześć,</p>

<p>
    Hasło do twojego konta w <strong>{siteName}</strong> zostało właśnie zmienione, a każda inna przeglądarka z otwartą sesją tego konta została wylogowana.<br />
    Jeśli to ty, nie musisz nic robić.
</p>

<p>
    Jeśli to nie ty, ktoś inny zna twoje hasło. Ustaw nowe tutaj, a ta osoba zostanie wylogowana:
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

    "Email.SetNewPassword.subject": "Ustaw nowe hasło do {siteName}",
    "Email.SetNewPassword.body": `
<p>Cześć,</p>

<p>
    Niedawno poproszono o zresetowanie hasła do <strong>{siteName}</strong>.<br />
    Możesz zresetować hasło, klikając poniższy przycisk:
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
    Jeśli przycisk nie działa, możesz też zresetować hasło, otwierając ten odsyłacz w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Jeśli reset hasła nie został zamówiony przez ciebie, możesz bezpiecznie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Ustaw hasło do {siteName}",
    "Email.SetPassword.body": `
<p>Cześć,</p>

<p>
    Twoje konto w <strong>{siteName}</strong> nie ma hasła: logujesz się przez Google.<br />
    Poproszono o ustawienie hasła, aby można było logować się także adresem e-mail i hasłem.
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
    Jeśli przycisk nie działa, możesz też ustawić hasło, otwierając ten odsyłacz w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Odsyłacz działa przez godzinę. Jeśli ustawienie hasła nie zostało zamówione przez ciebie, możesz bezpiecznie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Nie ma konta w {siteName} dla tego adresu e-mail",
    "Email.RegisterInstead.body": `
<p>Cześć,</p>

<p>
    Zgłoszono prośbę o zresetowanie hasła dla adresu e-mail, który nie jest powiązany z żadnym kontem w <strong>{siteName}</strong>.
</p>

<p>
    Jeśli chcesz korzystać z naszego serwisu, możesz założyć nowe konto, odwiedzając:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Jeśli ta prośba nie pochodziła od ciebie, możesz bezpiecznie zignorować tę wiadomość.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Potwierdź, że konto w {siteName} ma zostać zapomniane",
    "Email.ConfirmForgetting.body": `
<p>Cześć,</p>

<p>
    Poproszono o zapomnienie konta w <strong>{siteName}</strong>.<br />
    Kliknij poniższy przycisk, aby zobaczyć, co to oznacza, i potwierdzić, że tego chcesz:
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
    Jeśli przycisk nie działa, możesz też otworzyć ten odsyłacz w przeglądarce:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Po zapomnieniu nazwa i adres e-mail nigdy więcej nie będą czytelne dla nikogo, a na konto nie będzie można się zalogować. Tego nie można cofnąć.
</p>

<p>
    Odsyłacz działa jednorazowo, do 15 minut od prośby, i tylko przy otwartej sesji tego konta. Potem poproś ponownie z poziomu konta.
</p>

<p>
    Jeśli prośba nie pochodzi od ciebie, nic się nie stanie, dopóki odsyłacz nie zostanie otwarty. Ktoś zalogowany na twoje konto jednak o to poprosił, więc ustaw nowe hasło na stronie „Nie pamiętam hasła”, aby mieć pewność, że ta osoba nie zaloguje się ponownie.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Rejestracja jest wstrzymana: nie można połączyć się z {service}",
    "Email.RegistrationsSuspended.body": `
<p>Cześć,</p>

<p>
    {siteName} nie mógł połączyć się z {service} o {when}. Dopóki usługa nie odpowie, czytelnicy, którzy jej potrzebują, by się zarejestrować lub ustawić nowe hasło, są proszeni o spróbowanie później.
</p>

<p>
    Nic nie trzeba odblokowywać. Każda próba ponownie pyta {service}, a strony działają znów w chwili, gdy ta odpowie.
</p>

<p>
    Dopóki {service} nie działa, dostaniesz o tym e-mail najwyżej raz na godzinę.
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
    {siteName} nie mógł połączyć się ze swoją bazą danych o {when}. Dopóki nie odpowie, każda strona, która jej potrzebuje, informuje czytelników, że serwis jest niedostępny i że trzeba spróbować później.
</p>

<p>
    Nic nie trzeba odblokowywać. Każde żądanie ponownie prosi o połączenie, a serwis działa znów w chwili, gdy baza odpowie.
</p>

<p>
    Dopóki baza danych nie działa, dostaniesz o tym e-mail najwyżej raz na {minutes} min.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} zawiódł przy żądaniu",
    "Email.UnhandledError.body": `
<p>Cześć,</p>

<p>
    {siteName} zawiódł o {when} przy żądaniu {asked}. Czytelnikowi pokazano numer referencyjny {reference}, a dziennik zawiera pod nim przyczynę.
</p>

<p>
    Zepsuty serwis zwykle zawodzi przy każdym żądaniu, więc dostaniesz e-mail o awariach najwyżej 4 razy na godzinę. Kolejne i tak są w dzienniku.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
