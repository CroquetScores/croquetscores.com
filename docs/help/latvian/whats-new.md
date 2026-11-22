# Kas jauns

## Izlaists 2026-11-22

- **Sākumlapa atceras turnīrus, ko nesen skatījāties.** Kad atverat turnīru, tas kļūst par pirmo sadaļā **Jūsu nesenie turnīri**, starp filtru un nesenajiem rezultātiem, līdz pieciem, lai varētu atgriezties pie tiem, kurus sekojat, nemeklējot tos sarakstos. Tie tiek glabāti jūsu pašu ierīcē sīkdatnē, kurā ir tikai turnīru adreses, un saraksts netiek rādīts vispār, līdz esat atvēruši kādu. Palīdzība pasaka, kas ir šī sīkdatne.

- **Gaidāmajos turnīros ir arī tie, kas sākās pēdējās divās dienās.** Turnīrs, kas ir sācies un nav beidzies, tiek rādīts līdz dienai, kad tas beidzas, ja tas sākās ne agrāk kā pirms divām dienām, tāpēc dienās, kad to spēlē, to var atrast, pirms kāds tajā ir ierakstījis partiju. Tie, kas sākās agrāk, ir nesenajos rezultātos, kad ir pievienota partija.

- **Izslēgšanas turnīrs norāda, no cik partijām ir katras kārtas mači.** Virs katras kārtas izslēgšanas turnīra režģī un zem katras kārtas nosaukuma tā kopsavilkumā ir teikts „Labākais no 3” vai tas, ko turnīra pārvaldnieks izvēlējies šai kārtai.

- **Rezultāts ietilpst savā rūtiņā izslēgšanas turnīra kopsavilkumā, un vārds paliek kopā grupas kopsavilkumā.** Šaurā ekrānā Advantage rezultāts, kas rakstīts kā „83% (5/6)”, izlīda no savas rūtiņas pāri vārdiem, un vārds grupas kopsavilkumā varēja tikt pārnests aiz vārda. Pāris paliek kopā katrā & zīmes pusē.

- **Vietni var pievienot tālruņa sākuma ekrānam.** Poga lapas kājenē to piedāvā, kad to var jūsu pārlūks, un **Vietnes pievienošana sākuma ekrānam** palīdzībā pasaka, kā to izdarīt iPhone un Android tālrunim. Croquet Scores un Gateball Scores ir katrai sava ikona, lai jūs tās varētu atšķirt.

- **Ir norādīti Jaunzēlandes kroketa reģioni.** Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury un pārējos reģionus, kādos tiek dalīti Jaunzēlandes nacionālie turnīri, var izvēlēties kā turnīra reģionu.

### Lietotņu izstrādātājiem

- **Ir atklāta API.** Lietotne var lasīt viena gada turnīrus, turnīru ar tā sacensībām un spēlētājiem, sacensību partijas un kārtību, turnīrus, kas mainījuši gadu, un turnīrus, kas arhivēti, kā JSON adresē `/api/v0`. Tā ir `v0`, kamēr tā tiek izstrādāta. Lasīt drīkst ikviens, un lietotnei, kas sūta atslēgu, kas izveidota sadaļā **API atslēgas** jūsu kontā, ir sava kvota, sākumā 60 pieprasījumu minūtē un 10 000 dienā. Lietotne bez atslēgas dala kvotu pēc savas adreses, 10 minūtē un 500 dienā.

- **Atslēga ļauj lietotnei darboties jūsu vārdā bez jūsu paroles.** Izveidojiet atslēgu savā kontā, pasakiet, kam tā paredzēta, un atsauciet to, kad vairs nevēlaties, lai to lieto. Atslēgu var izveidot tikai lasīšanai vai lasīšanai un rakstīšanai, un to var ierobežot ar vienu turnīru. API pagaidām tikai lasa. Tiek glabāts tikai atslēgas jaucējkods (hash), tāpēc atslēga tiek parādīta vienu reizi, kad to izveidojat.

- **Atbildei var pievienot laukus bez jaunas versijas.** Lietotnei jāignorē lauks, ko tā nepazīst. Izmaiņa, kas salauztu lietotni, tiek izdarīta kā jauna versija blakus vecajai, lai lietotne, kas rakstīta `v1`, turpinātu darboties, kad parādīsies `v2`. **Palīdzība lietotņu izstrādātājiem** un **API galapunkti** palīdzībā pasaka, ko katra adrese pieņem un atbild, visās valodās.

- **Handikaps API ir skaitlis.** Tas ir `4.5`, nevis `"4.5"`, un `null`, ja spēlētājam tā nav.

### Pasaules ranga atbildīgie

- **Otrā Golf Croquet partiju izklājlapa satur dienu, kad katra partija tika ierakstīta.** Pievienojiet adresei `rankings2` tur, kur ir `rankings`, un I kolonna norāda dienu, kad katra partija tika ierakstīta, kā Excel datumu, tās vietas laikā, kur turnīrs tiek spēlēts. Cilne Rangi to piedāvā kā **Lejupielādēt partijas pasaules rangam ar partijas datumu**. Pirmā izklājlapa ir tāda, kāda bija, jo atbildīgo programmatūra to lasa pēc pozīcijas.

## Izlaists 2026-11-15

- **Dubultspēļu pāris meklēšanā ir viens spēlētājs, neatkarīgi no tā, kurš no abiem spēlētājiem nosaukts pirmais.** "Sam Someone & Alex Another" un "Alex Another & Sam Someone" spēlētāju lapā bija divi ieraksti, tāpat kā "Peter & Rosie Landrebe" un "Rosie & Peter Landrebe". Tagad tie ir viens, vienā adresē, norādīts ar nosaukumu, ko rakstīja pēdējais turnīrs.

- **Dubultspēļu pāri var rakstīt arī ar slīpsvītru, plusa zīmi vai angļu vārdu "and", ne tikai ar &.** "Sam Someone / Alex Another", "Sam Someone + Alex Another" un "Sam Someone and Alex Another" visi tiek lasīti kā pāris. Vārds "and" tiek ņemts vērā tikai tad, ja stāv viens pats, tāpēc tādu vārdu kā "Sam Anderson" nepieņem par pāri.

- **Pāris Šveices sistēmas rezultātos un grupu tabulās tiek nosaukts īsi.** Šveices sistēmas rezultātā bija pirmā spēlētāja vārda pirmais burts un otrā spēlētāja uzvārds. Tagad tajā nosaukts katrs spēlētājs, kā "T. Murphy & A. Sharpe", un uzvārds, kas abiem ir kopīgs, tiek nosaukts vienreiz, kā "R. & P. Landrebe". Grupas tabulas kolonnu virsraksti ir katra spēlētāja iniciāļi, savienoti ar &, piemēram, "TM&AS", vai "RL&PL" kopīga uzvārda gadījumā.

- **Gvatemala ir iekļauta valstīs, kurās nesen neviens nav spēlējis.** Agrāk tā bija norādīta kopā ar valstīm, kurās turnīri notikuši kopš 2025. gada.

- **Vietne skaita, cik lasītāju nāk un kuras lapas viņi lasa.** Tā izmanto Cloudflare tīmekļa analītiku katrā lapā, ko redz lasītāji. Lapas, kurās strādā pārvaldnieki, netiek skaitītas. Tā neizmanto sīkdatnes un lietotāju neidentificē citādi kā pēc viņa IP adreses.

- **Turnīri tiek publicēti kā faili, ko var izmantot ikviens.** Katrs publiskais turnīrs, gan kroketa, gan gateball, tiek ierakstīts savā failā ar saviem spēlētājiem un sacensībām vai ar komandām un testiem tur, kur spēlē komandas, iekļaujot atsauktās partijas, kas atzīmētas kā atsauktas. Tie glabājas Git repozitorijā `CroquetScores/data.croquetscores.com`, ko atjaunina katru stundu, tāpēc varat sakārtot rezultātus vai kaut ko no tiem izveidot, un labojums parādās kā izmaiņa ar datumu. Failā nav neviena konta, e-pasta adreses, piezīmes vai komentāra, nav arī nekā arhivēta vai no izmēģinājuma vietnes.

### Ārkārtas gadījumā

- **Ir lapa tam, kam jāpārņem vietne.** Ja tas, kas vada vietni, to nevar, jo ir slims vai ilgi prombūtnē, ikviens pieteicies var admin sadaļā atvērt **In case of emergency**, pateikt, kas viņš ir un kāpēc pārņem vietni, un nospiest **Send**. Pēc apstiprinājuma tas, ko viņš pateicis, tiek nosūtīts pa e-pastu cilvēkiem, kuri zina paroli piezīmei ar visu, kas vietnei vajadzīgs, un atbildes nonāk pie sūtītāja. Konts var lūgt vienreiz 48 stundās, un tam pasaka, kad var lūgt atkal. Lapa sākas ar brīdinājumu to neizmantot, ja administratoram nav nosūtīts e-pasts un viņš 48 stundu laikā nav atbildējis, un to netestēt. Tiklīdz ziņa nosūtīta, lapa to pasaka un vairs neko neprasa.

## Izlaists 2026-11-11

- **Izvēlni tālrunī var aizvērt, nospiežot ārpus tās.** Izvēlne aiz pogas šaura ekrāna augšā aizveras, kad nospiežat jebkur citur lapā, tāpat kā tad, kad vēlreiz nospiežat pogu vai atverat saiti.

- **Konta izvēlni var aizvērt, nospiežot ārpus tās.** Cilvēka ikona galvenes galā, kas atver reģistrēšanos, pierakstīšanos un pārējo, aizveras, kad nospiežat jebkur citur lapā, tāpat kā tad, kad to nospiežat vēlreiz.

- **Savelciet un izpletiet pirkstus, lai mainītu teksta izmēru.** Skārienekrānā savelciet divus pirkstus, lai teksts kļūtu mazāks, un izpletiet tos, lai tas kļūtu lielāks, līdz izmēram no puses līdz divkāršam parastajam. Atšķirībā no pārlūka paša tālummaiņas lapa paliek tikpat plata kā ekrāns, tāpēc rindas lasīšanai nekad nav jāritina uz sāniem. Izmērs tiek atcerēts, tāpēc tas ir vienāds katrā lapā un katrā apmeklējumā. Viens pirksts joprojām ritina kā agrāk.

- **Izvēlne tālrunī ritinās.** Zemā ekrānā izvēlne nav augstāka par ekrānu un ritinās tā iekšienē, tāpēc var aizsniegt katru vienumu, un lapa aiz tās paliek vietā, līdz izvēlne tiek aizvērta.

- **Pedro Echeguren ir uzlabojis spāņu valodu.** Pedro pārskatīja vietnes spāņu vārdus un tos izlaboja. Paldies, Pedro.

## Izlaists 2026-11-10

Croquet Scores ir pilnībā uzrakstīts no jauna. Ceru, ka jaunā versija jums patiks.

### Atrast vajadzīgo

- **Meklēšana.** Katras lapas augšā ir meklēšanas lauks. Ierakstiet vārdu vai nosaukumu un nospiediet Meklēt, lai atrastu turnīrus, sacensības un spēlētājus.

- **Turnīru sašaurināšana pēc valsts, štata vai provinces un sporta veida.** Sākumlapā izvēlieties valsti, lai redzētu tikai tajā aizvadītos turnīrus. Kad valsts izvēlēta, var izvēlēties arī tās štatu vai provinci, kā arī sporta veidu. Jūsu tālrunis vai dators atceras izvēlēto un nākamreiz sāk no tā. **Izvēloties štatu vai provinci, tiek atrasti tikai jauni turnīri.** Vecākiem turnīriem štats vai province netika norādīta, tāpēc tie pēc šādas izvēles netiek rādīti.

- **Turnīru sašaurināšana pēc dienām.** Norādiet pirmo un pēdējo dienu kopā, un tiks parādīti tikai turnīri, kas sākas starp tām. Abas dienas ir iekļautas.

- **Gada lapā redzami tā mēneši.** Katrs mēnesis ir aizvērts, un tajā teikts, cik turnīru tajā sākas. Nospiediet mēnesi, lai atvērtu tā turnīrus, un varat atvērt cik vēlaties. **+ Rādīt visu** atver visus mēnešus.

- **Garie saraksti ir pa lapām.** Turnīru saraksts vienlaikus rāda simts turnīru, tāpēc plaša meklēšana vairs neielādē visas rindas uzreiz.

- **Palīdzība atrod atbildi pēc nozīmes.** Uzdodiet jautājumu palīdzības pirmās lapas meklēšanas laukā, un tā atradīs rakstu arī tad, ja rakstā ir citi vārdi ar to pašu nozīmi. Pirmā lapa piedāvā arī populārus jautājumus un tēmas kā kartītes.

### Turnīra sekošana

- **Pārvaldnieku piezīmes.** Turnīra pārvaldnieki tagad var rakstīt piezīmes, lai pateiktu spēlētājiem, kas viņiem jāzina turnīra laikā: formātu, spēļu secības izmaiņu, pusdienu laiku. Tās ir turnīra jaunajā sadaļā Piezīmes, jaunākās pirmās, un pie katras norādīts, cik sen tā uzrakstīta.

- **Zvaigznīte (\*) atzīmē nelasīto.** Piezīmei tā ir, kamēr to neatverat, un atkal, ja piezīme mainīta pēc tam, kad to izlasījāt. Kamēr kāda piezīme ir nelasīta, arī sadaļai Piezīmes tā ir, katrā turnīra lapā, tāpēc redzat, ka ir jaunumi, un nav jāiet skatīties. Reportāžu atzīmē tāpat. Jūsu pārlūks atceras, ko esat izlasījis, tāpēc nav jāpierakstās. Citā tālrunī vai datorā nekas nav atzīmēts kā izlasīts.

- **Reportāžu ir vieglāk sekot.** Vecajā vietnē katrs jauns komentārs aizsvieda lapu līdz pašai apakšai, tāpēc tas, kurš pārlasīja agrākos komentārus, pazaudēja vietu. Tagad lapa uz jaunu komentāru noritina tikai tad, ja jau esat apakšā un lasāt jaunāko. Ja esat atritinājis atpakaļ, lai lasītu agrākos komentārus, lapa paliek tur, kur esat.

- **Grupā redzams, kurā vietā katrs spēlētājs.** Pēdējā kolonnā ir katra spēlētāja vieta: 1 vai =2, ja spēlētājus nevar nošķirt un viņi dala otro vietu. Ja spēlētājiem ir vienāds uzvarēto maču skaits, zemāk esošā rindiņa saka, kā viņi tika nošķirti.

- **Spēļu secību var kārtot.** Nospiediet Partija, lai kārtotu partijas pēc uzvarētāja vārda, vai Datums, lai kārtotu pēc tā, kad katra pievienota. Nospiediet vēlreiz, lai apgrieztu kārtību. Vietne atceras, kā kārtojāt, katrām sacensībām un arī turnīru sarakstiem, un saite zem saraksta, Atpakaļ uz parasto kārtību, to aizmirst.

- **Tiek rādīta handikapa vērtība.** Ja spēlētājam ir handikaps, tas ir aiz viņa vārda kopā ar to, ko viņš pārstāv, piemēram, Tim Murphy (4, Australia).

- **Sacensības saka, līdz cik vārtiņiem tajās spēlē,** ja tas nav parastais skaits šim sporta veidam, kā "Spēlē līdz 14 vārtiņiem".

### Vietne

- **Jūsu valoda.** Vietne tagad ir divpadsmit valodās: afrikandu, arābu (Ēģipte), čehu, angļu, vācu, grieķu, latviešu, norvēģu, portugāļu, spāņu, zviedru un velsiešu. Jums tiek rādīta pirmā valoda, ko jūsu pārlūks pieprasa un kas vietnei ir, vai angļu valoda, ja tādas nav. Lai izvēlētos citu, izmantojiet sarakstu kājenē jebkuras lapas apakšā un nospiediet pogu blakus tam. Ja vēlaties, lai pievieno kādu valodu, rakstiet uz <croquetscores@gmail.com>.

- **Gaišs vai tumšs.** Arī kājenē: izvēlieties Gaišs, Tumšs vai Sistēmas. Sistēmas motīvs seko jūsu tālrunim vai datoram. Vietne jūsu izvēli atceras katrā lapā un katrā apmeklējumā.

- **Kāda versija jums ir.** Kājenē tagad redzama vietnes versija, ko skatāties, piemēram, v234. Ja ziņojat par problēmu, lūdzu, norādiet, kura versija tā bija.

- **Jūsu dati.** Lapa /data-deletion-policy saka, kā panākt, lai dzēš to, ko vietne par jums glabā, kas tiek dzēsts un kas tiek saglabāts.

### Atvērtais kods

Kods tagad ir atvērts saskaņā ar GNU Affero General Public License 3. versiju (AGPL-3.0). Ikviens drīkst to lasīt, lietot un mainīt, un ikvienam, kas mainītu versiju palaiž kā vietni, savas izmaiņas jādala ar to pašu licenci.
