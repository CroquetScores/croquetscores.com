# Palīdzība lietotņu izstrādātājiem

Croquet Scores ir atklāta API, lai lietotne varētu sekot sporta veida turnīriem, nelasot vietnes lapas. Tā atbild JSON formātā, un izstrādes laikā tā atrodas adresē `/api/v0`. Kad tā tiks izlaista, tā atradīsies adresē `/api/v1`.

## Kur tā atrodas {#where-it-stands}

API ir izstrādē, tāpēc tā ir `v0`. Kad visi iesaistītie to būs pieņēmuši, tā kļūs par `v1`.

Izmaiņa, kas salauž lietotni, nekad netiek izdarīta esošā versijā. To izdara kā jaunu versiju blakus vecajai, lai lietotne, kas rakstīta `v1`, turpinātu darboties, kad parādīsies `v2`. Kas netiek uzskatīts par salaušanu, ir pateikts tālāk, lai lietotni varētu uzrakstīt tā, ka tā to sagaida.

## Lauki var tikt pievienoti {#fields-may-be-added}

Atbildei nākotnē var tikt pievienots lauks, nemainot versiju, jo lietotne, kas uzrakstīta tā, ka ignorē to, ko nepazīst, no tā nesabojājas. Tāpēc lietotnei jāignorē katrs lauks, ko tā nepazīst, un tā nedrīkst izgāzties ne šāda lauka dēļ, ne tāpēc, kādā secībā lauki nāk.

Tas, ko lietotnei ir pateikts, bez jaunas versijas nemainās: lauka nosaukums, tā tips un nozīme.

Kļūdas `message` formulējumu var pārfrāzēt jebkurā brīdī. Lietotne lasa `code` un nekad `message`.

## Lēti pieprasīt {#reading-cheaply}

Katra atbilde nes `ETag`. Uzdodiet to pašu jautājumu vēlreiz, nosūtot to laukā `If-None-Match`, un atbilde ir `304` bez nekā cita, ja nekas nav mainījies. Turnīrs un sacensību grupa nes arī `Last-Modified`, ar ko var nosūtīt `If-Modified-Since`. Sarakstu nosaka tikai tā `ETag`, jo sarakstam, kurā turnīra vairs nav, nav jaunāka datuma, ar ko to pateikt.

Katrs turnīrs sarakstā nes arī savu `etag`, veidotu no tā, ko tas saka. Lietotne, kurai pasaka, ka saraksts ir mainījies, var redzēt, kuri tā turnīri mainījušies, nesalīdzinot tos lauku pa laukam.

Viena gada turnīru saraksts pieņem `changedSince`, rakstītu kā `2026-03-01T10:00:00Z`, lai lietotne, kas gadu lasa vēlreiz, prasītu tikai to, kas mainījies. Saraksts ir lapa ar ne vairāk kā 100 ierakstiem un ceļu uz nākamo, un tas pieņem `page` un `pageSize`.

Ko atbild katra adrese, ir [GET galapunktos](get-endpoints.md), un ko pieņem katra, kas kaut ko maina, ir [POST galapunktos](post-endpoints.md).

## Atslēgas {#keys}

Lasīt drīkst ikviens: pieprasījums bez atslēgas tiek atbildēts tāpat kā ar atslēgu. Atslēga nosaka, kura limits pieprasījumam tiek skaitīts, un ko izsaucējs drīkst papildus lasīšanai.

Atslēgu izveido lasīšanai vai lasīšanai un rakstīšanai. Atslēga, kas raksta, turnīrā drīkst to, ko drīkst konts, kuram tā izveidota, un pārvaldniekam tas ir vairāk nekā rezultātu ievadītājam (skatiet [kas drīkst rakstīt](post-endpoints.md#who-may-write)); atslēgu var arī ierobežot ar vienu turnīru.

Izveidojiet atslēgu savā kontā sadaļā **API atslēgas** ar **Izveidot atslēgu**. Sūtiet to ar katru pieprasījumu kā nesēja pilnvaru (bearer token):

```
Authorization: Bearer <the key>
```

Nekad neliekiet atslēgu adresē, ko glabā pārlūki, starpniekserveri un žurnāli. Glabājiet atslēgu tikpat slepenībā kā paroli. Atslēga, kas nedarbojas, tiek noraidīta ar `401`, lai lietotne, kas domā, ka sūta atslēgu, uzzinātu, ka tā nesūta.

## Limiti {#allowances}

Katrs pieprasījums tiek skaitīts limitā, minūtes un dienas, neatkarīgi no tā, ko tas prasa. Atslēga sākas ar 60 minūtē un 10 000 dienā, ko administrators var palielināt vienam partnerim. Pieprasījums bez atslēgas vai ar atslēgu, kas nedarbojas, tiek skaitīts pret tā adresi ar 10 minūtē un 500 dienā.

Lietotne, kas izmantojusi savu limitu, saņem atbildi `429` ar norādi, cik ilgi jāgaida. Pieprasījums, uz kuru atbild ar `304`, tiek skaitīts kā jebkurš cits.

## Kļūdas {#errors}

Katrai kļūdai ir viena un tā pati forma:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

Uz `code` lietotne paļaujas. `field` ir tā pieprasījuma daļa, kas bija nepareiza, ja tāda bija. `message` ir paredzēts tam, kurš lasa žurnālu.
