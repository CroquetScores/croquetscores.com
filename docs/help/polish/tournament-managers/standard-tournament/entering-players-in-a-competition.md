# Zgłaszanie zawodników do konkurencji

Stronę konkurencji otwiera się z jej nazwy na karcie Konkurencje albo z ciemnozielonego paska. Jej nagłówkiem jest nazwa konkurencji, a pod nim są dwie karty: **Zawodnicy** i **Wyniki**. Otwiera się na karcie Zawodnicy, bo zawodników zgłasza się, zanim cokolwiek zostanie rozegrane.

Zawodnik w konkurencji jest jednym z zawodników turnieju, więc zgłasza się go przez wybranie, a nie wpisanie. Wszystko, co go dotyczy, poza jego miejscem w konkurencji i tym, co do niej przenosi, zmienia się na karcie Zawodnicy turnieju.

![Karta Zawodnicy konkurencji grupowej, z czworgiem zgłoszonych zawodników](images/competition-players-tab.png)

## Dodawanie zawodnika

Nad listą lista rozwijana oferuje każdego zawodnika turnieju, który nie jest jeszcze w konkurencji, w kolejności turnieju. Wybierz jednego i naciśnij **Dodaj zawodnika**. Zawodnik trafia w kolejności turnieju między już zgłoszonych, lista rozwijana już go nie oferuje, a kursor wraca do listy rozwijanej, by następnego można było wybrać z klawiatury. Gdy każdy zawodnik turnieju jest w konkurencji, lista rozwijana nie jest pokazywana, a karta o tym mówi.

Zarchiwizowani zawodnicy turnieju nie są oferowani.

## Bye w konkurencji pucharowej {#byes-in-a-knockout}

Konkurencję pucharową rozgrywa się dopiero wtedy, gdy każde miejsce w jej drabince jest zajęte, a miejsca, których nie zajmują zawodnicy, wypełnia się Bye. Dlatego w konkurencji pucharowej lista rozwijana oferuje **Bye** jako pierwszy, przed zawodnikami, i oferuje go dalej niezależnie od tego, ile Bye dodano, bo drabinka może potrzebować kilku.

![Konkurencja pucharowa o czterech miejscach z trzema zawodnikami i Bye](images/knockout-players.png)

Bye umieszcza się w drabince tak jak zawodnika: można je przesuwać w górę i w dół oraz usunąć, ale nie może się wycofać, bo nic nie gra. Zawodnik zgłoszony do konkurencji pucharowej, której każde miejsce jest zajęte, jest odrzucany, a karta mówi o tym pod listą rozwijaną.

Kolejność zawodników konkurencji pucharowej jest jej drabinką. Pierwsze dwa miejsca spotykają się w pierwszym meczu, następne dwa w następnym, i tak dalej. Ustaw zawodników w kolejności, w jakiej drabinka ma być rozgrywana, zanim wprowadzisz jakikolwiek wynik, bo gdy konkurencja pucharowa ma grę w użyciu, jej zawodnicy są ustaleni: nikogo nie można dodać, usunąć ani przesunąć. Zawodnik nadal może się wycofać.

![Konkurencja pucharowa po wprowadzeniu gry: nikogo nie można dodać, przesunąć ani usunąć](images/knockout-players-fixed.png)

## Kolejność

Zawodnicy są wymienieni w kolejności konkurencji, czyli w kolejności, w jakiej losuje się konkurencję pucharową i w jakiej konkurencja grupowa jest wymieniona na swojej stronie publicznej. **W górę** i **W dół** przesuwają zawodnika o jedno miejsce.

## Przenoszenie wyników {#carry-forward}

**Przenieś wyniki** mówi, co zawodnik wnosi do konkurencji z gry, której tu nie zapisano: rezultaty wcześniejszego etapu albo gier rozegranych, zanim konkurencję zaczęto tu zapisywać. Jest oferowane w konkurencji grupowej i szwajcarskiej, które mają klasyfikację, do której można to liczyć, a nie w konkurencji pucharowej.

![Okno Przenieś wyniki](images/carry-forward-dialog.png)

Okno pyta o sześć liczb: wygrane i przegrane mecze, wygrane i przegrane gry oraz bramki zdobyte i stracone. Każda liczba jest opcjonalna. Liczba zostawiona pusta nie przenosi nic, co nie jest tym samym co przeniesienie 0, by ten, kto zmieni ją później, widział ją tak, jak została zostawiona. Naciśnij **Zapisz**, by zachować wszystkie sześć.

## Usuwanie zawodnika {#removing-a-player}

**Usuń** zabiera zawodnika zgłoszonego przez pomyłkę. Pozostaje on jednym z zawodników turnieju i znów jest oferowany na liście rozwijanej, ale nic z jego miejsca w konkurencji nie jest zachowywane, więc Usuń najpierw pyta.

![Pytanie zadawane przed usunięciem zawodnika](images/remove-player-asks.png)

Zawodnika, który ma w konkurencji jakąkolwiek grę w użyciu, nie można usunąć, bo gry byłyby wtedy przeciwko komuś, kogo już nie ma, i nie oferuje mu się Usuń. Zawodnika, którego wszystkie gry są zarchiwizowane, można, a jego zarchiwizowane wyniki odchodzą razem z nim.

## Wycofywanie zawodnika {#withdrawing-a-player}

**Wycofaj** jest dla zawodnika, który nie zagra już w konkurencji. Pozostaje w niej, z grami, które rozegrał, i jest wymieniony pod **Wycofani zawodnicy** po tych, którzy nadal grają. W konkurencji pucharowej jego przeciwnik w nierozstrzygniętym jeszcze meczu przechodzi dalej.

Wycofaj najpierw pyta, bo zmienia wynik konkurencji: gry, których zawodnik nie rozegrał, są rozstrzygane bez niego.

![Pytanie zadawane przed wycofaniem zawodnika](images/withdraw-player-asks.png)

Wycofany zawodnik oferuje tylko **Cofnij wycofanie**, które przywraca go między grających, po tych, którzy zostali, bez pytania.

![Konkurencja grupowa z wycofanym zawodnikiem](images/competition-players-withdrawn.png)

Dalej: [Wyniki](scores.md).
