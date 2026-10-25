# Rankingi

Gdy konkurencja liczy się do rankingów światowych, jego wyniki są wysyłane do rankingów jako plik, który strona tworzy za ciebie z tego, co zostało wprowadzone. Karta **Rankingi** to miejsce, w którym go dostajesz.

## Karta

Otwórz stronę turnieju i wybierz **Rankingi**, ostatnią z jego kart. Mówi ona, czym jest plik: plikiem tekstowym w krokiecie klasycznym, arkuszem kalkulacyjnym w krokiecie golfowym i amerykańskim krokiecie sześciobramkowym. Mówi też, co zostaje do zrobienia ręcznie, i że plik należy potem wysłać do osób odpowiedzialnych za rankingi. Pod spodem jest **Pobierz gry do rankingu światowego**, które zapisuje plik. Jest tam jeszcze przed wprowadzeniem choćby jednego wyniku i daje plik, w którym nic nie ma, dopóki jakiś wynik nie zostanie wprowadzony.

Karta jest tylko na stronie turnieju w dyscyplinie, która ma rankingi światowe, i tylko dla jego organizatorów: osoba wprowadzająca wyniki jej nie dostaje. Sam plik jest pod adresem turnieju z dopisanym `/rankings`, na przykład `/2026/ac/spring-open/rankings`, który to adres strona zawsze mu nadawała, i każdy, kto zna adres, może go otworzyć.

## Co jest w pliku

Jest w nim każdy wynik, który został wprowadzony i nie został zarchiwizowany, w kolejności wprowadzenia, także wynik wycofany i wyniki zawodnika, który się wycofał. Wyniku zarchiwizowanego w nim nie ma. Mecz wygrany wolnym losem albo walkowerem nie został rozegrany, więc nie ma swojego wiersza.

Zawodnik jest podany pod swoją nazwą w rankingu światowym, czyli pod swoją nazwą, jeśli nie nadano mu innej.

**Krokiet klasyczny** ma blok dla każdej konkurencji, w której jest wynik: nazwę turnieju, daty, zwycięzcę, informację, czy były to mecze, czy pojedyncze gry, i ponumerowany wiersz dla każdego wyniku, na przykład „1 Sam Someone beat Alex Another +9”. Wynik to bramki zwycięzcy minus bramki przegranego, z plusem, gdy zwycięzca zdobył więcej, a po nim idą peele. Mecz pucharowy to jeden wiersz, a po nim po kolei wyniki poszczególnych gier. Strona może tylko zgadywać, kto wygrał konkurencję, więc sprawdź wiersz **Winner** (w pliku jest po angielsku) w każdym bloku i popraw go, zanim wyślesz plik dalej.

**Krokiet golfowy i Amerykański krokiet sześciobramkowy** mają arkusz kalkulacyjny: nazwę turnieju, jego dni i liczbę gier, a potem ponumerowany wiersz dla każdej gier, z nazwiskiem i imieniem zwycięzcy, „beat”, nazwiskiem i imieniem przegranego oraz dwoma wynikami. Każda gra meczu pucharowego to osobny wiersz. Pod ostatnim jest wiersz **Tournament winner:** (w pliku po angielsku), który zostaje pusty, byś go uzupełnił.

## Gdy nie ma pliku

Turniej, w którym żadna konkurencja nie liczy się do rankingów światowych, nie ma pliku. Otwarcie jego adresu rankingów pokazuje stronę, która mówi, że go nie ma, i dlaczego: jego dyscyplina nie ma rankingów światowych albo żadna z jego konkurencji się nie liczy, bo każda jest rozgrywana z handicapami, dopuszcza remisy albo odznaczono, by się liczyła. Ustala się to przy dodawaniu każdej konkurencji, a zmienia przez jej **Edytuj**. W pliku są tylko konkurencje, które się liczą.

Dalej: [Zmiana, archiwizowanie i przywracanie turnieju](changing-and-archiving.md).
