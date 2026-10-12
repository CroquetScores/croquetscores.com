# Tworzenie turnieju

Naciśnij **Nowy turniej** nad listą turniejów w administracji. Przycisk jest nad listą, a nie pod nią, by długa lista nie zepchnęła go poza ekran telefonu.

![Formularz nowego turnieju, wypełniony dla turnieju drużynowego](../../../english/tournament-managers/teams-tournament/images/new-tournament.png)

Formularz pyta o wszystko, z czym turniej się zaczyna. Najważniejszy jest tu **Format**, bo to on czyni turniej drużynowym.

## O co pyta formularz

**Nazwa.** To, czego szukają czytelnicy, by znaleźć turniej, na przykład „Trans-Tasman Tests". Ma od 3 do 254 znaków. Nazwa napisana samymi małymi literami albo samymi wielkimi jest odrzucana, bo na każdej stronie, na której by się pojawiła, wyglądałaby jak pomyłka. Dwa turnieje mogą mieć tę samą nazwę, bo ten sam turniej rozgrywa się co roku.

**Początek** i **Koniec.** Dni, w których trwa turniej. Każdy test jest rozgrywany w ich obrębie, więc ustaw je tak, by obejmowały całe wydarzenie. Turniej nie może zakończyć się przed rozpoczęciem ani zacząć się czy skończyć później niż z końcem przyszłego roku. Turniej należy do roku, w którym się zaczyna, i ten rok jest też w jego adresie.

**Format.** Wybierz jeden z formatów drużynowych:

- **Drużynowy** to ogólny format dla każdego wydarzenia między drużynami.
- **Eire Cup**, **Interstate Shield** i **GC World Team Championship** to konkretne wydarzenia, każde zachowane jako osobny format, by można je było prowadzić tak, jak prowadzi się to wydarzenie.

Standardowy to jedyny format, który nie jest drużynowy, i nie tego tu chcesz. Gateball Scores nie oferuje formatu, bo każdy turniej tam jest standardowym turniejem gateballa; turniej drużynowy tworzy się na Croquet Scores.

**Dyscyplina.** Dyscypliny, które oferuje strona, w jej kolejności: Association Croquet, Golf Croquet, American Six-Wicket i Ricochet.

**Kraj** i **Region.** Gdzie rozgrywany jest turniej. O region pyta się tylko wtedy, gdy wybrany kraj dzieli się na regiony, jak stany Australii, i nawet wtedy nie trzeba go wybierać.

**Podtytuł.** Wszystko, co chcesz przekazać czytelnikom, a co nie ma własnego pola: gdzie parkować, kiedy jest obiad, do kogo dzwonić. Jest pokazywany pod nazwą turnieju na każdej stronie publicznej. Pisze się go w Markdownie, więc słowo można pogrubić gwiazdkami wokół niego, a listę zrobić myślnikiem na początku każdego wiersza. Może mieć do 2000 znaków i można go zostawić pusty.

**Rozgrywany z handicapami.** Zaznacz to dla wydarzenia handicapowego.

**Dopuszcza remisy.** Zaznacz to tam, gdzie partia może skończyć się bez zwycięzcy. Gdy jest zaznaczone, wynik wprowadzony z równymi punktami i bez oznaczenia jest zachowywany jako remis; gdy nie jest, partia na równych punktach musi mówić, kto ją wygrał, oznaczeniem po wyniku zwycięzcy, na przykład „6w".

**Wyrównane testy kończą się remisem.** Pytanie pojawia się dopiero po wybraniu formatu drużynowego. Test wygrywa drużyna, która wygra więcej jego meczów, a test wyrównany w meczach rozstrzyga bilans partii, a potem bilans bramek – chyba że to jest zaznaczone, bo wtedy test wyrównany w meczach kończy się remisem, jak przyjmują to niektóre wydarzenia drużynowe. Na początku jest odznaczone dla formatu Drużynowy, a zaznaczone dla GC World Team Championship, w którym wyrównany test zawsze był remisem.

**Liczy się do rankingów światowych.** Pytanie pojawia się tylko tam, gdzie może się liczyć: w turnieju Association Croquet lub Golf Croquet, który nie jest rozgrywany z handicapami ani nie dopuszcza remisów. Na początku jest zaznaczone.

**Wydarzenie rangi krajowej** i **Wydarzenie rangi międzynarodowej.** Turniej może być jednym, drugim albo żadnym, ale nigdy obydwoma: zaznaczenie jednego odznacza drugie.

## Tworzenie

Naciśnij **Utwórz turniej**. Trafiasz na stronę turnieju w administracji, otwartą na karcie Drużyny, i jesteś jego pierwszym organizatorem. Jest wymieniony w administracji pod rokiem, w którym się zaczyna.

![Nowo utworzony turniej, jeszcze bez drużyn](../../../english/tournament-managers/teams-tournament/images/tournament-page-empty.png)

Publiczny adres turnieju składa się z jego roku, dyscypliny i nazwy, jak `/2026/ac/trans-tasman-tests`. Turniej zachowuje ten adres, gdy jego nazwa zostanie później poprawiona, by już wysłany link nadal go znajdował; przenosi się tylko wtedy, gdy zmieni się rok, w którym się zaczyna, albo jego dyscyplina.

## Jeśli coś zostanie odrzucone

To, co odrzucono, jest powiedziane pod polem, którego dotyczy, a to, co wpisano, pozostaje wpisane. Nic nie jest zachowywane, dopóki każde pole nie zostanie przyjęte. Najczęściej odrzucane są nazwa wpisana samymi małymi literami, koniec przed początkiem i niewybrany kraj.

Dalej: [Drużyny](teams.md).
