# Co nowego dla organizatorów turniejów

## Wydano 2026-10-23

To główne zmiany od ostatniego wydania. Każda odsyła do pull requesta, który ją wprowadził.

- **Handicapy, remisy i rankingi światowe ustawia się w każdej konkurencji.** Kiedyś decydował o nich turniej, więc w jednym turnieju nie mogły być grupa z handicapem obok grupy bez niego ani test, który może zakończyć się remisem, obok pucharowej, w której remisu być nie może. Teraz każda konkurencja i każdy test pyta o wszystkie trzy przy dodawaniu lub edycji, a formularz turnieju już nie pyta. O ostatnie pyta się tylko tam, gdzie dyscyplina ma rankingi światowe, a konkurencja, która się nie liczy, jest pomijana w pliku rankingów. Zobacz [Konkurencje](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **Listę turniejów w administracji można zawęzić według kraju, regionu i dyscypliny.** Wybory są w adresie, więc można podać odsyłacz do przefiltrowanej listy, a do wyboru są tylko te pozycje, które ma twoja lista. Region można wybrać po wybraniu kraju. Turnieje sprzed listopada 2026 nie mają regionu, więc wybranie go je ukrywa, a listy publiczne o tym informują. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Osoby odpowiedzialne za ranking światowy mają teraz jedną rolę dla każdej dyscypliny.** Osoba odpowiedzialna za ranking w krokiecie klasycznym widzi turnieje w krokiecie klasycznym i się nimi opiekuje, a w krokiecie golfowym turnieje w krokiecie golfowym. Turniej, którym zarządzasz lub w którym wprowadzasz wyniki, nadal jest na twojej liście, niezależnie od dyscypliny. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **Karta Rankingi w jednym akapicie wyjaśnia plik, niezależnie od dyscypliny,** a pod nim jest odsyłacz do pobrania. Zobacz [Rankingi](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **Nazwa turnieju nie może składać się wyłącznie z małych liter ani wyłącznie z wielkich,** a komunikat mówi teraz o tym jako o regule. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Usuń to kosz** na kartach organizatorów i osób wprowadzających wyniki, przy zawodnikach konkurencji i na stronie kont administratora, tak jak wcześniej Archiwizuj i Usuń. Po wskazaniu go kursorem nadal nazywa się Usuń, a czytnik ekranu nadal czyta Usuń. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Każdy język ma nowe słowa.** Słownictwo serwisu we wszystkich szesnastu pozostałych językach napisano od nowa, a pomoc dostosowano do niego. Pomoc dla czytelników i dla kont oraz warunki korzystania są teraz także we wszystkich językach. Żadnego z nich nie czytała jeszcze osoba, dla której jest językiem ojczystym, więc napisz nam, co brzmi źle. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Za kulisami.** Import starych stron nadaje niektórym strefom czasowym i jednemu turniejowi inny kraj ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), a zrzut danych wczytuje na serwer i tworzy modele odczytu skryptem ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). Serwis jest wdrażany skryptem, z komputera lub z GitHuba, i już nie przy każdym scaleniu ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Wydano 2026-10-19

To główne zmiany dla osób, które prowadzą turnieje. [Pomoc dla organizatorów turniejów](../tournament-managers/index.md) zawiera wszystkie szczegóły.

- **Zawodników wpisuje się raz, do turnieju.** Na starej stronie zawodników dodawało się w każdej konkurencji. Teraz karta **Zawodnicy** turnieju to miejsce, w którym ich dodajesz, poprawiasz, porządkujesz i archiwizujesz, a zawodnik poprawiony tam jest poprawiony w każdej konkurencji, w której gra, i na każdej stronie publicznej. Zobacz [Zawodnicy](../tournament-managers/standard-tournament/players.md).

- **Zawodników wstawia się do konkurencji z listy.** Na stronie konkurencji wybierz zawodnika turnieju z listy rozwijanej i naciśnij **Dodaj zawodnika**. Lista oferuje tylko zawodników, których nie ma jeszcze w konkurencji. W konkurencji pucharowej oferuje też **Bye** na pozostałe miejsca. Zobacz [Wpisywanie zawodników do konkurencji](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Jeden przycisk dodaje konkurencję.** Zamiast osobnych przycisków nowej konkurencji grupowej, nowej szwajcarskiej i nowej pucharowej naciśnij **Dodaj konkurencję**. Okno pyta o nazwę i rodzaj (grupowa, pucharowa lub szwajcarska), a potem o to, czego ten rodzaj potrzebuje: do ilu wygranych jest każdy mecz, a w konkurencji pucharowej miejsca w drabince. Pozostaje otwarte, abyś mógł dodać kilka naraz. Rodzaju konkurencji nie można potem zmienić: zarchiwizuj ją i dodaj ponownie. Zobacz [Konkurencje](../tournament-managers/standard-tournament/competitions.md).

- **Notatki organizatora: używaj ich zamiast komentarzy, by przekazać zawodnikom to, co muszą wiedzieć.** Format, zmianę kolejności gier, godzinę obiadu. Notatkę pisze się na karcie **Notatki** turnieju, z tytułem i opisem w Markdown, a przed dodaniem można ją obejrzeć w podglądzie. Zawodnicy znajdą notatki na publicznej stronie Notatki turnieju. Notatka, której nie przeczytali, jest oznaczona gwiazdką, tak samo jak sekcja Notatki na każdej stronie turnieju, dopóki jej nie otworzą. Notatka, którą edytujesz, jest oznaczana ponownie dla wszystkich, którzy ją przeczytali. Zobacz [Notatki](../tournament-managers/standard-tournament/notes.md).

- **Notatki turnieju ze starej strony to teraz Podtytuł.** To, co tam napisano, zostaje jako podtytuł turnieju i nadal jest wyświetlane pod nazwą turnieju na każdej stronie publicznej. Pisze się go w Markdown i może mieć do 2000 znaków. Służy do tego, co czytelnicy powinni wiedzieć na każdej stronie. Na wieści zmieniające się w trakcie turnieju używaj notatki.
