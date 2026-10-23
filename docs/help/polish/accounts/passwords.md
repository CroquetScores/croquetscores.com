# Hasła

## Czego strona wymaga od hasła

Wszędzie, gdzie wybierasz hasło, czyli przy potwierdzaniu adresu e-mail, ustawianiu nowego hasła lub zmianie hasła, strona wymaga, żeby:

- miało **co najmniej 12 znaków**;
- było wpisane dwa razy tak samo, za drugim razem jako **Powtórz hasło**;
- nie było takim, które **pojawiło się w wycieku danych** gdzie indziej.

Spacje na początku i na końcu są pomijane, tak jak przy logowaniu, więc przypadkowa spacja cię nie zablokuje. Spacje w środku są zachowywane, co pasuje do hasła złożonego z kilku słów.

## Wybór dobrego hasła

Strona wymaga długości i niczego więcej: ani wielkich liter, ani cyfr, ani symboli. Tak radzą dzisiejsze zalecenia: długie hasło, nigdzie indziej niepoużywane, jest silniejsze i łatwiejsze do zapamiętania niż krótkie, utrudnione do odczytania. Strona stosuje zalecenia amerykańskiego Narodowego Instytutu Standardów i Technologii (NIST), które możesz przeczytać w [wytycznych NIST dotyczących tożsamości cyfrowej, w części o hasłach](https://pages.nist.gov/800-63-4/sp800-63b.html).

W skrócie:

- **Niech będzie długie.** Kilka niepowiązanych słów tworzy hasło łatwe do zapamiętania i trudne do odgadnięcia.
- **Używaj go tutaj i nigdzie indziej.** Hasło użyte na dwóch stronach jest tylko tak bezpieczne jak słabsza z nich, a hasła skradzione na jednej wypróbowuje się na innych.
- **Trzymaj je w menedżerze haseł**, jeśli możesz, bo potrafi wymyślić długie hasło dla każdej strony i zapamiętać wszystkie.
- **Nie zmieniaj go według harmonogramu.** Zmień je, gdy uważasz, że ktoś inny może je znać, a nie w innych przypadkach.

## Jak strona sprawdza, czy hasło wyciekło

Publikowane są listy haseł skradzionych z innych stron, a ci, którzy próbują dostać się na konta, wypróbowują je najpierw. Dlatego gdy wybierasz hasło, strona pyta zewnętrzną usługę, czy jest ono na takiej liście. Usługę prowadzi osoba trzecia, a strona używa jej tylko do tego.

Twoje hasło nie opuszcza strony. Strona robi z niego jednokierunkowy odcisk, którego nie da się zamienić z powrotem w hasło, i wysyła usłudze tylko pierwsze pięć znaków tego odcisku. Usługa odpowiada resztą odcisku każdego wyciekłego hasła zaczynającego się tak samo, a to kilkaset haseł, i strona szuka wśród nich swojego. Usługa dowiaduje się więc, że twoje hasło jest jednym z kilkuset, ale nigdy którym. Więcej mówi [wyjaśnienie, jak to działa, od Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/).

Hasło, które jest na liście, zostaje odrzucone z komunikatem o tym, a ty wybierasz inne. Jeśli z usługą nie da się połączyć, hasła nie można teraz sprawdzić, więc nie zostaje przyjęte ani zmienione. Spróbuj za kilka minut. Otrzymany odsyłacz nadal działa do czasu, aż wygaśnie.

## Zmiana hasła

Wybierz **Zmień hasło** w menu **Konto**. Strona prosi o **Obecne hasło**, **Nowe hasło** i jego powtórzenie jako **Powtórz hasło**. Obecne hasło jest wymagane, bo samo bycie zalogowanym nie wystarcza: telefon zostawiony odblokowany pozwoliłby temu, kto go podniesie, zablokować ci dostęp.

Po zmianie ta przeglądarka pozostaje zalogowana, a każda inna zostaje wylogowana. Strona wysyła na twój adres e-mail wiadomość, że hasło zostało zmienione, żeby od razu było wiadomo, jeśli to nie ty. Błędne obecne hasło liczy się do tych samych limitów co logowanie.

Jeśli nie pamiętasz obecnego hasła, strona odsyła do **Nie pamiętam hasła?**.

Dalej: [Dbanie o konto](looking-after-your-account.md).
