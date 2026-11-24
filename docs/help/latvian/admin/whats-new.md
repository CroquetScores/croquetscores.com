# Kas jauns turnīru pārvaldniekiem

## Izdots 2026-11-25

### Turnīrs

- **Pirms turnīra, kura nosaukums izskatās pēc testa, tiek jautāts.** Veidojot turnīru, kura nosaukumā ir viss vārds „test“, „testing“, „trial“, „fake“ vai „dummy“, vispirms atveras dialogs, kas saka, ka turnīrs tiks saglabāts un uzskaitīts visiem, un kas ved uz izmēģinājuma vietni, kur testam ir īstā vieta. **Saglabāt šo turnīru** to izveido, un **Atcelt** atstāj veidlapu tādu, kādu to ievadījāt. Izmēģinājuma vietnē neprasa, nedz arī tad, kad turnīru maina.

### Sacensības

- **Rezultātā ierakstīta nespēlēta uzvara jautā, vai pretinieku izstādīt.** Nospiežot **Pievienot partiju** pie rezultāta ar „w/o“, atveras dialogs, kas nosauc zaudētāju: **Izstādīt pretinieku**, **Pievienot rezultātu** vai **Atcelt**. Pretinieka izstādīšana nepievieno partiju un iztukšo rezultāta dialogu nākamajam. Izstādīts spēlētājs vairs nespēlē, un partijas, ko viņš nav izspēlējis, tiek izšķirtas bez viņa, kas skaitās labāk nekā partija, kas nekad nav notikusi. Jautā tikai par jaunu rezultātu un ne testa vai Advantage sacensībās.

### Lietotnes

- **API tagad ir `v1`.** Lietotnes adreses ir `/api/v1` tur, kur tās bija `/api/v0`. Lietotni, kas joprojām izsauc `/api/v0`, pāradresācija nosūta uz jauno adresi, tāpēc tā turpina darboties, taču tā jāmaina, jo pāradresāciju var noņemt.

## Izdots 2026-11-24

### Sacensības

- **Bloka kopsavilkums norāda arī partiju starpību.** Ja bloka mači ir labākie no vairāk nekā vienas partijas, kopsavilkums norāda uzvaras, zaudējumus, partiju starpību un vārtiņu starpību, jo partiju starpība neizšķirtu rezultātu izšķir pirms vārtiņiem. Kopsavilkums vairs nesaka, kā tā spēlētāji tiek ranžēti.

- **Sacensību flīzīte sadaļu joslā ir tikpat plata kā tās nosaukums.** Īsam nosaukumam vairs nav tikpat platas flīzītes kā garam.

### Lietotnes

- **Atslēga tagad var kaut ko mainīt.** Atslēga, kas izveidota lasīšanai un rakstīšanai, turnīrā drīkst darīt to, ko drīkst konts, kam tā izveidota: pārvaldnieka atslēga visu, rezultātu ievadītāja atslēga to, ko dara ar rezultātiem, un neko citu. Izveidojiet vienu sadaļā **API atslēgas** savā kontā, ja vēlaties, ierobežojiet to ar vienu turnīru un atsauciet to jebkurā laikā. Lapa **API POST galapunkti** palīdzībā saka, ko lietotne drīkst sūtīt. Tie vēl tiek nostiprināti, un daži tiks noņemti. Glabājiet atslēgu tikpat slepenībā kā paroli.

## Izdots 2026-11-22

### Turnīrs

- **Var izvēlēties Jaunzēlandes kroketa reģionus.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury un pārējie reģioni, kādos tiek dalīti Jaunzēlandes nacionālie turnīri, ir norādīti kā turnīra reģions blakus provincēm.

- **E-pasts par noņemtu nacionālo vai starptautisko statusu to pasaka.** Kad administrators noņem turnīram statusu, e-pasts tā pārvaldniekiem tagad saka, ka tas ir noņemts, un lūdz jūs pateikt, kāpēc nepiekrītat, ja nepiekrītat. Tas kā nacionāla pasākuma piemēru min Australian Open un kā starptautiska piemēru WCF Association Croquet Singles.

### Spēlētāji

- **Vārds pasaules rangā, ko pasaules rangs nepazīst, seko labotajam vārdam.** Vārda labošana atstāja **Spēlētāja vārds pasaules rangā** tādu, kāds tas bija, tāpēc spēlētājs, kas pievienots kā „aaa” un laboīts uz „Tim Murphy”, rangā joprojām bija pazīstams kā „aaa”. Ja rangs nepazīst vārdu, ar kādu spēlētājs tika atvērts, tas tagad kļūst par labojumu vārdu, kamēr jūs to rakstāt, līdz paši sākat rakstīt pasaules ranga vārdā. Tāds, ko rangs pazīst, ko parāda atzīme blakus, tiek saglabāts.

- **Handikaps tiek rādīts kā skaitlis, kāds tas ir.** Spēlētāju saraksts rāda „4” handikapam, ko ierakstījāt kā „4.0”, un „4” handikapam „+4”. Handikaps ar daļu, piemēram, „-1.5”, tiek rādīts tāds, kāds tas ir. To joprojām var ierakstīt ar zīmi vai punktu.

### Lietotnes

- **Lietotne var lasīt jūsu turnīrus no vietnes API.** Vietnei ir atklāta API (skatiet **Palīdzība lietotņu izstrādātājiem**), kas pagaidām tikai lasa. Varat izveidot atslēgu sadaļā **API atslēgas** savā kontā, lai lietotnei dotu savu kvotu: to var izveidot tikai lasīšanai vai lasīšanai un rakstīšanai, to var ierobežot ar vienu turnīru, un jūs to varat atsaukt jebkurā laikā. Glabājiet atslēgu tikpat slepenībā kā paroli.

### Ko redz sabiedrība

- **Gaidāmie turnīri sākumlapā ietver turnīru, kas sākās pēdējās divās dienās.** Turnīrs tiek rādīts no sešdesmit dienām pirms tā sākuma līdz dienai, kad tas beidzas, bet tāds, kas sākās pirms vairāk nekā divām dienām, tiek izlaists. Tātad dienās, kad to spēlē, to var atrast, pirms kāds tajā ir ierakstījis partiju, un pēc pirmajām divām dienām tas ir nesenajos rezultātos, kad ir pievienota partija.

- **Izslēgšanas turnīrs norāda, no cik partijām ir katras kārtas mači.** Virs katras kārtas izslēgšanas turnīra režģī un zem katras kārtas nosaukuma tā kopsavilkumā tagad ir teikts „Labākais no 3” vai tas, ko esat izvēlējies šai kārtai, lai nevienam nebūtu jāskaita rezultātu rūtiņas, lai to uzzinātu. Skatiet [Ko redz sabiedrība](../tournament-managers/standard-tournament/what-the-public-sees.md).

## Izdots 2026-11-15

### Turnīrs

- **Divas atzīmes nacionāla un starptautiska līmeņa pasākumam ir ievietotas rāmī ar nosaukumu "Neobligāti".** Lapā, kas izveido vai maina turnīru, **Nacionāla līmeņa pasākums** un **Starptautiska līmeņa pasākums** bija vienīgie, par ko jautāja zem apakšvirsraksta, un daži tos uzskatīja par izvēli, kas jāizdara. Turnīram nav jābūt nevienam no tiem, un rāmis to tagad saka. Vārds ir pievienots katrā vietnes valodā, un tulkojumiem, kas nav angļu valodā, vajadzīga dzimtās valodas lasītāja acs.

- **Turnīru, kas izveidots tikai kā tests, administrators var arhivēt, un viņš jūs informē.** Kas apgūst vietni, dažkārt izveido īstajā vietnē turnīru, kas vienmēr bija tikai tests. Administrators to tagad var arhivēt un nosūtīt e-pastu tā pārvaldniekiem, norādot izmēģinājuma vietni, kurā vingrināties. Nekas netiek dzēsts, tāpēc arhivētu turnīru var atjaunot. Pārvaldnieki, kas aizmirsuši savus kontus, un rezultātu ievadītāji e-pastu nesaņem.

### Spēlētāji

- **Dubultspēļu pāri var rakstīt arī ar slīpsvītru, plusa zīmi vai angļu vārdu "and", ne tikai ar &.** "Sam Someone / Alex Another" ir tas pats pāris, kas "Sam Someone & Alex Another". Vārds "and" tiek ņemts vērā tikai tad, ja stāv viens pats, tāpēc tādu vārdu kā "Sam Anderson" nepieņem par pāri. Kur pāris spēlē Šveices sistēmā vai grupā, to nosauc "T. Murphy & A. Sharpe" Šveices sistēmas rezultātā un "TM&AS" grupas tabulas augšā.

## Izdots 2026-11-11

### Turnīrs

- **Turnīra nosaukums piedāvā nosaukumus, kas vietnei jau ir.** Turnīrs bieži ir daļa no sērijas, ko katru gadu spēlē ar gandrīz tādu pašu nosaukumu. Tāpēc, kamēr lapā, kas izveido vai maina turnīru, rakstāt laukā **Nosaukums**, tiek piedāvāti vietnes turnīru nosaukumi. Nosaukums tiek piedāvāts, ja tajā ir katrs jūsu uzrakstītais vārds, jebkurā secībā un ar jebkādiem burtiem, tāpēc "CNSW Bronze" atrod "CNSW AC Bronze Medal". Izvēlieties kādu ar klikšķi vai ar bulttaustiņiem un taustiņu Enter un mainiet to, kā vēlaties. Taustiņš Escape aizver piedāvājumus. Nosaukums tiek piedāvāts vienu reizi neatkarīgi no tā, cik turnīriem tas ir, un turnīram, ko maināt, tā paša nosaukums netiek piedāvāts.

### Sacensības

- **Sacensības atveras cilnē Rezultāti, līdzko ir ievadīta kāda partija.** Atgriežoties sacensībās, lai ievadītu vēl rezultātus, vairs nav katru reizi jānospiež **Rezultāti**. Sacensības, kurās nav neviena lietojamas partijas, arī tādas, kurās vienīgā partija ir arhivēta, joprojām atveras cilnē **Spēlētāji**. Rezultātu ievadītājam tiek rādīta tikai cilne **Rezultāti**, kā agrāk.

- **Arhivējot sacensības vai testu, aiz to nosaukuma tiek pievienots numurs, lai nosaukumu varētu izmantot vēlreiz.** Sacensības, kas izveidotas ar nepareizu veidu, ir jāarhivē un jāpievieno no jauna, un jaunajām tagad var dot to pašu nosaukumu, kāds bija vecajām. Arhivējot "Block A", tās kļūst par "Block A (1)", izmantojot pirmo numuru, ar kuru neviena cita sacensību nosaukums nebeidzas. To adrese paliek tāda, kāda bija, un atjaunotas sacensības saglabā jauno nosaukumu. Arhivēts tests tiek numurēts tāpat, un, mainot komandas īsais nosaukums, tas paliek nemainīts. Skatiet [Sacensības](../tournament-managers/standard-tournament/competitions.md).

## Izdots 2026-11-10

Šīs ir galvenās izmaiņas tiem, kas vada turnīrus. [Palīdzībā turnīru pārvaldniekiem](../tournament-managers/index.md) ir visas detaļas.

### Spēlētāji

- **Spēlētāji tiek ievadīti vienreiz, turnīrā.** Vecajā vietnē spēlētāji tika pievienoti katrās sacensībās atsevišķi. Tagad turnīra cilne **Spēlētāji** ir vieta, kur tos pievienot, labot, sakārtot un arhivēt, un tur izlabots spēlētājs ir izlabots katrās sacensībās, kurās viņš ir, un katrā publiskajā lapā. Skatiet [Spēlētāji](../tournament-managers/standard-tournament/players.md).

- **Daudzus spēlētājus var pievienot uzreiz.** Cilnē **Spēlētāji** nospiediet **Pievienot spēlētājus**, blakus **Pievienot spēlētāju**, un ielīmējiet sarakstu, kurā katram spēlētājam ir sava rinda. Tiek pievienots katrs saraksta spēlētājs. Saraksta pirmajā rindā ir lauku nosaukumi.

- **Dubultspēļu pāri var izveidot no diviem jau ievadītiem spēlētājiem.** Cilnē **Spēlētāji** nospiediet **Pievienot pāri**, izvēlieties pirmo un otro spēlētāju un vēlreiz nospiediet **Pievienot pāri**. Pāris tiek nosaukts "Sam Someone & Alex Another" vai "Peter & Rosie Landrebe", ja abiem ir viens un tas pats uzvārds. Dialogs paliek atvērts, lai varētu izveidot nākamo pāri. Skatiet [Spēlētāji](../tournament-managers/standard-tournament/players.md#adding-a-pair).

- **Spēlētājam var būt handikaps**, piemēram, 4, +4 vai -1.5. Tas tiek rādīts aiz spēlētāja vārda kopā ar to, ko viņš pārstāv, ja tāds ir, kā Tim Murphy (4, Australia).

- **Tas, ko spēlētājs pārstāv, tiek ieteikts.** Rakstot to, tiek ieteikti klubi un valstis, ko spēlētāji ir pārstāvējuši, pievienojot viņus jebkurā turnīrā un jebkurā sporta veidā. Lai sāktu, uzrakstiet divus burtus.

### Sacensības

- **Viena poga pievieno sacensības.** Atsevišķo pogu jaunai grupai, jaunai Šveices sistēmai un jaunam izslēgšanas turnīram vietā nospiediet **Pievienot sacensības**. Dialogs prasa nosaukumu un veidu (grupa, izslēgšanas turnīrs vai Šveices sistēma) un tad to, ko šis veids prasa: kāds katrs mačs ir labākais no, un izslēgšanas turnīram vietas tā izlozē. Tas paliek atvērts, lai varētu pievienot vairākas uzreiz. Sacensību veidu pēc tam nevar mainīt: arhivējiet tās un pievienojiet vēlreiz. Skatiet [Sacensības](../tournament-managers/standard-tournament/competitions.md).

- **Izslēgšanas turnīrs var pārņemt cita izslēgšanas turnīra kārtas zaudētājus.** Izslēgšanas turnīra dialogā nospiediet **Pievienot zaudētāju izslēgšanas turnīru**, nosauciet to un izvēlieties kārtu, kuras zaudētāji tajā spēlē tālāk. Tā spēlētāji tur tiek ielikti, līdzko katrs mačs ir izšķirts, tāpēc jums nav jāievada viņi ar roku.

- **Grupai var norādīt, kā tiek izšķirti spēlētāji ar vienādu uzvarēto maču skaitu.** Grupas dialogā izvēlieties tās **Neizšķirta rezultāta izšķiršana**: partiju starpība, tad vārtiņu starpība, tad kurš kuru uzvarēja; tikai kurš kuru uzvarēja; vai cits, kas nozīmē, ka nav zināmas metodes, tāpēc spēlētāji paliek vienādi un dala vietu. Jauna grupa sākas ar partiju starpību, tad vārtiņu starpību, tad kurš kuru uzvarēja.

- **Sacensībās var norādīt lielāko vārtiņu skaitu, līdz kuram tiek spēlētas partijas.** Sacensību dialogā **Maksimālais vārtiņu skaits** pieņem veselu skaitli, kas ir vismaz 1. Atstājiet to tukšu, ja maksimuma nav, un sacensībām būs sava sporta veida parastais skaits: 26 vai 13 golfa kroketa gadījumā.

### Spēlētāji sacensībās

- **Spēlētāji tiek ielikti sacensībās no saraksta.** Sacensību lapā izvēlieties turnīra spēlētāju nolaižamajā sarakstā un nospiediet **Pievienot spēlētāju**. Nolaižamais saraksts piedāvā tikai spēlētājus, kas vēl nav sacensībās. Izslēgšanas turnīrā tas piedāvā arī **Bye** pāri palikušajām vietām. Skatiet [Spēlētāju ievadīšana sacensībās](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Vairākus spēlētājus var pievienot sacensībām uzreiz.** Sacensību cilnē **Spēlētāji** nospiediet **Pievienot vairākus**, blakus **Pievienot spēlētāju**, atzīmējiet vajadzīgos spēlētājus vai lodziņu virs saraksta, lai atzīmētu visus, un nospiediet **Pievienot atlasītos**. Viņi tiek ielikti turnīra kārtībā. Ja kādu nevar pievienot, otrs dialogs pasaka, kuru un kāpēc, un jautā, vai pievienot pārējos. Skatiet [Spēlētāju ievadīšana sacensībās](../tournament-managers/standard-tournament/entering-players-in-a-competition.md#adding-several).

### Turnīrs

- **Jauns turnīrs sākas šajā mēnesī.** Tā sākums ir šī mēneša pirmais datums un beigas ir tā pati diena, un beigu datums seko sākuma datumam, līdz izvēlaties savu.

- **Valsti, štatu vai provinci un sporta veidu izvēlieties no sarakstiem.** Turnīram vajadzīga valsts un sporta veids. Izvēloties citu valsti, štats vai province tiek notīrīta. Spēlētāja vai komandas karogs tiek izvēlēts no saraksta, kurā pirmās ir visbiežāk izmantotās valstis.

- **Sadaļu josla seko sacensībām.** Pēc sacensību vai testa pievienošanas, mainīšanas, pārvietošanas, arhivēšanas vai atjaunošanas josla turnīra lapā piedāvā to, kas turnīrā tagad ir, bez lapas atkārtotas atvēršanas.

- **Palīdzības ikona vairākās administrēšanas lapās.** Apaļā jautājuma zīme ir lapās, kas izveido un maina turnīru, turnīra un sacensību cilņu rindā un blakus turnīru sarakstam. Katra ved uz palīdzību par to, ko skatāties, citā cilnē, lai lapa paliktu atvērta.

### Piezīmes

- **Pārvaldnieka piezīmes: izmantojiet tās reportāžas vietā, lai pateiktu spēlētājiem, kas viņiem jāzina.** Formāts, izmaiņa spēļu kārtībā, pusdienu laiks. Piezīme tiek rakstīta turnīra cilnē **Piezīmes**, ar nosaukumu un aprakstu Markdown formātā, un pirms pievienošanas varat to priekšskatīt. Spēlētāji piezīmes atrod turnīra publiskajā lapā Piezīmes. Piezīme, ko viņi nav izlasījuši, ir atzīmēta ar zvaigznīti, un tāpat ir sadaļa Piezīmes katrā turnīra lapā, līdz viņi to atver. Piezīme, ko labojat, tiek atzīmēta vēlreiz visiem, kas to bija izlasījuši. Skatiet [Piezīmes](../tournament-managers/standard-tournament/notes.md).

- **Vecās vietnes turnīra Piezīmes tagad ir Apakšvirsraksts.** Tas, ko tur rakstījāt, tiek paturēts kā turnīra apakšvirsraksts un joprojām tiek rādīts zem turnīra nosaukuma katrā publiskajā lapā. Tas tiek rakstīts Markdown formātā un var būt līdz 2000 rakstzīmēm. Tas ir paredzēts tam, kas lasītājiem jāzina neatkarīgi no tā, kurā lapā viņi ir. Izmantojiet piezīmi jaunumiem, kas mainās, turnīram ritot.

### Ko redz publika

- **Grupā ir redzams, kurā vietā ir katrs spēlētājs**, pēdējā slejā ar virsrakstu #, ar rindu zem tabulas, kas saka, kā tika izšķirti spēlētāji ar vienādu uzvarēto maču skaitu.

- **Starpvalstu vairogs tiek sarindots pēc maču starpības.** Komandas tiek sarindotas pēc testiem: uzvarētie mači mīnus zaudētie mači.
