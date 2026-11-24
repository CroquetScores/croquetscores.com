# Beth sy'n newydd

## Rhyddhawyd 2026-11-24

- **Mae crynodeb bloc yn dweud y gemau net hefyd.** Lle mae gemau bloc yn orau o fwy nag un gêm, mae ei grynodeb yn dweud buddugoliaethau, colledion, gemau net a chylchau net, gan fod gemau net yn penderfynu ar gyfartal cyn cylchau. Mae bloc o gemau sengl yn dweud buddugoliaethau, colledion a chylchau net fel o'r blaen. Nid yw'r crynodeb yn dweud mwyach sut y rhestrir ei chwaraewyr.

- **Mae teilsen cystadleuaeth yn y bar adrannau mor llydan â'i henw.** Roedd gan enw byr fel "Block A" deilsen mor llydan ag un hir, felly roedd y bar yn rhedeg allan o le yn gynt nag oedd angen.

- **Ar ffôn, mae dyddiadau'r hafan yn cymryd llai o le.** Mae colofn y dyddiadau mor llydan â dyddiadau penwythnos, fel "19-21 Nov", a'r enwau sy'n cael y gweddill. Mae dyddiadau sy'n mynd o un mis i'r nesaf yn torri cyn y cysylltnod, fel bod yr ail linell yn dechrau ag ef. Yn **Eich twrnameintiau diweddar**, nid yw twrnamaint o'r flwyddyn hon yn dweud blwyddyn, ac mae un o flwyddyn arall yn ei dweud o dan ei ddyddiadau.

### I ddatblygwyr apiau

- **Gall ap newid pethau, ag allwedd a wnaed i ysgrifennu.** Mae'r hyn y mae tudalennau'r wefan ei hun yn ei newid yn cael ei newid gan yr un cyfeiriadau yn `/api/v0`: gwneud twrnamaint, ei gystadlaethau, ei chwaraewyr, ei dimau a'i gemau, a phwy a gaiff ei reoli a chadw'r sgorau. Caiff allwedd wneud yr hyn y caiff y cyfrif y gwnaed hi ar ei gyfer ei wneud, a chaiff allwedd sgorwr wneud yr hyn a wneir â sgorau, a dim arall. Mae'r dudalen **Terfynbwyntiau POST yr API** yn y cymorth yn dweud beth y mae pob cyfeiriad yn ei gymryd ac yn ei ateb. Maent yn dal i gael eu setlo, a bydd rhai yn cael eu tynnu.

- **Gall ap ofyn beth y gall twrnamaint fod.** Mae'r campau, y fformatau a'r gwledydd â'u rhanbarthau yn `/api/v0/tournaments/sports`, `/api/v0/tournaments/formats` a `/api/v0/countries`, yn yr iaith y mae'r ap yn gofyn amdani, fel mai'r hyn y mae'n gwneud twrnamaint ag ef yw'r hyn y mae'r wefan yn ei gynnig.

- **Gall ap ddarllen chwaraewyr safleoedd y byd a'u gemau.** Mae'r chwaraewyr Association Croquet y mae safleoedd y byd yn eu hadnabod yn `/api/v0/ac/world-ranking-players`, a gemau pob chwaraewr, yn y drefn yr ychwanegwyd hwy, yn y cyfeiriad y mae'r chwaraewr yn ei ddweud. Mae'r enwau'n cael eu diweddaru o'r safleoedd pan ofynnir am y rhestr o'r dechrau, unwaith yr awr ar y mwyaf.

- **Mae terfynbwyntiau'r API yn ddwy dudalen yn y cymorth, un ar gyfer y terfynbwyntiau GET ac un ar gyfer y terfynbwyntiau POST,** ym mhob iaith.

### Swyddogion detholion y byd

- **Cedwir chwaraewr safleoedd Association Croquet wrth y rhif y mae'r safleoedd yn ei roi iddo.** Mae chwaraewr y mae'r safleoedd yn ei ailenwi yr un chwaraewr, caiff un sy'n disgyn oddi ar y rhestr ei archifo ac nid ei anghofio, ac nid yw un a restrir eto wedi'i archifo mwyach. Gwrthodir rhestr sy'n rhoi un enw i ddau chwaraewr, neu un rhif i ddau enw, yn gyfan a newidir dim, a rhoddir gwybod i'r gweinyddwr drwy e-bost.

## Rhyddhawyd 2026-11-22

- **Mae'r hafan yn cofio'r twrnameintiau yr edrychoch arnynt yn ddiweddar.** Pan fyddwch yn agor twrnamaint, mae'n dod yn gyntaf yn **Eich twrnameintiau diweddar**, rhwng yr hidlydd a'r canlyniadau diweddar, hyd at bump ohonynt, fel y gallwch fynd yn ôl at y rhai rydych yn eu dilyn heb chwilio amdanynt yn y rhestrau. Fe'u cedwir ar eich dyfais eich hun, mewn cwci sy'n cynnwys cyfeiriadau'r twrnameintiau a dim byd arall, ac nid yw'r rhestr yn cael ei dangos o gwbl nes eich bod wedi agor un. Mae'r cymorth yn dweud beth yw'r cwci.

- **Mae'r twrnameintiau i ddod yn cynnwys y rhai a ddechreuodd yn y ddau ddiwrnod diwethaf.** Mae twrnamaint sydd wedi dechrau ac heb orffen yn cael ei restru tan y diwrnod y mae'n gorffen, cyhyd â'i fod wedi dechrau ddim mwy na dau ddiwrnod yn ôl, fel y gellir ei ganfod ar y dyddiau y caiff ei chwarae cyn i neb gofnodi gêm ynddo. Mae'r rhai a ddechreuodd ynghynt yn y canlyniadau diweddar unwaith y bydd gêm wedi'i hychwanegu.

- **Mae twrnamaint ag ymadael yn dweud yr orau o faint yw gemau pob rownd.** Uwchben pob rownd yn nhabl twrnamaint ag ymadael, ac o dan enw pob rownd yn ei grynodeb, mae'n dweud "Yr orau o 3", neu'r hyn a ddewisodd rheolwr y twrnamaint ar gyfer y rownd honno.

- **Mae sgôr yn ffitio yn ei flwch yng nghrynodeb twrnamaint ag ymadael, ac mae enw'n aros gyda'i gilydd yng nghrynodeb bloc.** Ar sgrin gul, roedd sgôr Advantage wedi'i hysgrifennu fel "83% (5/6)" yn llifo allan o'i flwch dros yr enwau, a gallai enw yng nghrynodeb bloc dorri ar ôl yr enw cyntaf. Mae pâr yn cael ei gadw gyda'i gilydd ar bob ochr i'r ampersand.

- **Gallwch roi'r safle ar sgrin gartref eich ffôn.** Mae botwm yn y troedyn yn ei gynnig pan fydd eich porwr yn gallu, ac mae **Ychwanegu'r safle at eich sgrin gartref** yn y cymorth yn dweud sut, ar gyfer iPhone ac ar gyfer ffôn Android. Mae gan Croquet Scores a Gateball Scores eicon yr un, fel y gallwch eu hadnabod ar wahân.

- **Mae rhanbarthau croce Seland Newydd wedi'u rhestru.** Gellir dewis Central Districts, Counties Manukau, Marlborough Nelson West Coast, South Canterbury a'r rhanbarthau eraill y rhennir twrnameintiau cenedlaethol Seland Newydd iddynt yn rhanbarth twrnamaint.

### I ddatblygwyr apiau

- **Mae API cyhoeddus.** Gall ap ddarllen twrnameintiau blwyddyn, twrnamaint gyda'i gystadlaethau a'i chwaraewyr, gemau a safleoedd cystadleuaeth, y twrnameintiau a newidiodd flwyddyn a'r twrnameintiau a archifwyd, fel JSON, yn `/api/v0`. Mae'n `v0` tra bydd yn cael ei ddatblygu. Gall unrhyw un ddarllen, ac mae gan ap sy'n anfon allwedd a wnaed o dan **Allweddi API** yn eich cyfrif lwfans ei hun, 60 cais y funud a 10,000 y dydd i ddechrau. Mae ap heb allwedd yn rhannu lwfans yn ôl ei gyfeiriad, 10 y funud a 500 y dydd.

- **Mae allwedd yn gadael i ap weithredu drosoch heb eich cyfrinair.** Gwnewch allwedd yn eich cyfrif, dywedwch beth yw ei diben, a'i dirymu pan na fyddwch eisiau iddi gael ei defnyddio mwyach. Gellir gwneud allwedd i ddarllen yn unig neu i ddarllen ac ysgrifennu, a gellir ei chyfyngu i un twrnamaint. Dim ond darllen y mae'r API am y tro. Dim ond hash o'r allwedd a gedwir, felly dangosir yr allwedd unwaith, pan fyddwch yn ei gwneud.

- **Gellir ychwanegu meysydd at ateb heb fersiwn newydd.** Rhaid i ap anwybyddu maes nad yw'n ei adnabod. Gwneir newid a fyddai'n torri ap fel fersiwn newydd wrth ochr yr hen un, fel bod ap a ysgrifennwyd ar gyfer `v1` yn dal i weithio pan ddaw `v2`. Mae **Cymorth i ddatblygwyr apiau** a **Terfynbwyntiau'r API** yn y cymorth yn dweud beth y mae pob cyfeiriad yn ei gymryd ac yn ei ateb, ym mhob iaith.

- **Mae anfantais yn yr API yn rhif.** Mae'n `4.5` ac nid `"4.5"`, ac yn `null` lle nad oes gan chwaraewr un.

### Swyddogion detholion y byd

- **Mae gan ail daenlen o gemau Golf Croquet y diwrnod y cofnodwyd pob un.** Ychwanegwch `rankings2` at y cyfeiriad, lle mae `rankings`, ac mae colofn I yn dweud y diwrnod y cofnodwyd pob gêm, fel dyddiad Excel, yn amser y lle y chwaraeir y twrnamaint. Mae'r tab Detholion yn ei gynnig fel **Lawrlwytho gemau ar gyfer Safle'r Byd gyda dyddiad y gêm**. Mae'r daenlen gyntaf fel yr oedd, gan fod meddalwedd y swyddogion yn ei darllen yn ôl safle.

## Rhyddhawyd 2026-11-15

- **Mae pâr dyblau yn un chwaraewr yn y chwilio, pa un bynnag o'i ddau chwaraewr a enwir gyntaf.** Roedd "Sam Someone & Alex Another" ac "Alex Another & Sam Someone" yn ddau gofnod ar dudalen y chwaraewyr, felly hefyd "Peter & Rosie Landrebe" a "Rosie & Peter Landrebe". Nawr maen nhw'n un, ar un cyfeiriad, wedi'i restru dan yr enw a ysgrifennodd y twrnamaint diweddaraf.

- **Gellir ysgrifennu pâr dyblau â blaenslaes, â phlws neu â'r gair Saesneg "and", yn ogystal ag ampersand.** Mae "Sam Someone / Alex Another", "Sam Someone + Alex Another" a "Sam Someone and Alex Another" i gyd yn cael eu darllen fel pâr. Dim ond pan fydd ar ei ben ei hun y mae'r gair "and" yn cyfrif, felly ni chymerir enw fel "Sam Anderson" am bâr.

- **Dywedir pâr yn fyr mewn canlyniadau Swisaidd a gridiau blociau.** Roedd canlyniad Swisaidd yn rhoi llythyren gyntaf enw cyntaf y chwaraewr cyntaf ac enw olaf yr ail. Nawr mae'n dweud pob chwaraewr, fel "T. Murphy & A. Sharpe", a dywedir enw olaf y mae'r ddau yn ei rannu unwaith, fel "R. & P. Landrebe". Mae colofnau grid bloc wedi'u pennawdu gan lythrennau cyntaf pob chwaraewr wedi'u huno ag ampersand, fel "TM&AS", neu "RL&PL" ar gyfer enw olaf a rennir.

- **Rhestrir Guatemala gyda'r gwledydd lle nad oes neb wedi chwarae yn ddiweddar.** Fe'i rhestrwyd o'r blaen gyda'r gwledydd lle chwaraewyd twrnameintiau ers 2025.

- **Mae'r wefan yn cyfrif faint o ddarllenwyr sy'n dod a pha dudalennau maen nhw'n eu darllen.** Mae'n gwneud hynny gyda dadansoddeg gwe Cloudflare, ar bob tudalen y mae darllenwyr yn ei gweld. Ni chyfrifir y tudalennau y mae rheolwyr yn gweithio ynddynt. Nid yw'n defnyddio cwcis ac nid yw'n adnabod y defnyddiwr mewn unrhyw ffordd heblaw trwy ei gyfeiriad IP.

- **Cyhoeddir y twrnameintiau fel ffeiliau y gall unrhyw un eu defnyddio.** Ysgrifennir pob twrnamaint cyhoeddus, o groce ac o gateball, fel ffeil ei hun, gyda'i chwaraewyr a'i gystadlaethau, neu ei dimau a'i brofion lle caiff ei chwarae gan dimau, gyda gemau a dynnwyd yn ôl wedi'u cynnwys ac wedi'u dweud eu bod wedi'u tynnu'n ôl. Cânt eu cadw mewn storfa Git, `CroquetScores/data.croquetscores.com`, a ddiweddarir bob awr, fel y gallwch restru'r canlyniadau neu adeiladu rhywbeth ohonynt, ac mae cywiriad yn ymddangos fel newid â dyddiad arno. Nid oes cyfrif, cyfeiriad e-bost, nodyn na sylw mewn ffeil, na dim sydd wedi'i archifo neu o wefan arbrofi.

### Mewn argyfwng

- **Mae tudalen i rywun y mae'n rhaid iddo gymryd y wefan drosodd.** Os na all yr un sy'n rhedeg y wefan, am ei fod yn sâl neu i ffwrdd am amser hir, gall unrhyw un sydd wedi mewngofnodi agor **In case of emergency** yn y gweinyddu, dweud pwy ydyw a pham ei fod yn ei chymryd drosodd, a phwyso **Send**. Ar ôl cadarnhad, anfonir yr hyn a ddywedodd trwy e-bost at y bobl sy'n gwybod cyfrinair y nodyn â phopeth y mae ei angen ar y wefan, ac mae atebion yn mynd at yr anfonwr. Gall cyfrif ofyn unwaith mewn 48 awr, a dywedir wrtho pryd y gall ofyn eto. Mae'r dudalen yn agor â rhybudd i beidio â'i defnyddio oni bai bod y gweinyddwr wedi cael e-bost ac heb ateb o fewn 48 awr, ac i beidio â'i phrofi. Unwaith y caiff y neges ei hanfon, mae'r dudalen yn dweud hynny ac nid yw'n gofyn dim mwy.

## Rhyddhawyd 2026-11-11

- **Caiff y ddewislen ar ffôn ei rhoi o'r neilltu trwy wasgu y tu allan iddi.** Mae'r ddewislen y tu ôl i'r botwm ar frig sgrin gul yn cau pan wasgwch unrhyw le arall ar y dudalen, yn ogystal â phan wasgwch y botwm eto neu ddilyn dolen.

- **Caiff dewislen y cyfrif ei rhoi o'r neilltu trwy wasgu y tu allan iddi.** Mae'r person ar ddiwedd y pennyn, sy'n agor Cofrestru, Mewngofnodi a'r gweddill, yn cau pan wasgwch unrhyw le arall ar y dudalen, yn ogystal â phan wasgwch ef eto.

- **Pinsiwch a thynnwch i newid maint y testun.** Ar sgrin gyffwrdd, pinsiwch â dau fys i wneud y testun yn llai a thynnwch nhw ar wahân i'w wneud yn fwy, i faint rhwng hanner a dwbl y maint arferol. Yn wahanol i chwyddo'r porwr ei hun, mae'r dudalen yn aros mor llydan â'r sgrin, felly ni fyddwch byth yn gorfod sgrolio i'r ochr i ddarllen llinell. Cedwir y maint, felly mae'r un fath ar bob tudalen ac ar bob ymweliad. Mae un bys yn dal i sgrolio fel o'r blaen.

- **Mae'r ddewislen ar ffôn yn sgrolio.** Ar sgrin fer, nid yw'r ddewislen yn dalach na'r sgrin ac mae'n sgrolio ynddi, felly gellir cyrraedd pob eitem, ac mae'r dudalen y tu ôl iddi yn aros lle'r oedd nes i'r ddewislen gau.

- **Mae Pedro Echeguren wedi gwella'r Sbaeneg.** Adolygodd Pedro eiriau Sbaeneg y wefan a'u cywiro. Diolch, Pedro.

## Rhyddhawyd 2026-11-10

Mae Croquet Scores wedi'i ailysgrifennu'n llwyr. Gobeithio y bydd y fersiwn newydd yn plesio.

### Dod o hyd i bethau

- **Chwilio.** Mae gan bob tudalen flwch chwilio ar y brig. Teipiwch enw a gwasgwch Chwilio i ddod o hyd i dwrnameintiau, cystadlaethau a chwaraewyr.

- **Culhau'r twrnameintiau yn ôl gwlad, talaith neu ranbarth, a champ.** Ar yr hafan, dewiswch wlad i weld dim ond y twrnameintiau a chwaraewyd ynddi. Ar ôl dewis gwlad, gallwch ddewis talaith neu ranbarth ohoni, a gallwch ddewis camp hefyd. Mae eich ffôn neu gyfrifiadur yn cofio'r hyn a ddewisoch, ac yn dechrau ohono y tro nesaf. **Dim ond twrnameintiau newydd y mae dewis talaith neu ranbarth yn eu canfod.** Ni roddwyd talaith na rhanbarth i'r rhai hŷn, felly mae dewis un yn eu gadael allan.

- **Culhau'r twrnameintiau yn ôl dyddiau.** Rhowch ddiwrnod cyntaf a diwrnod olaf, gyda'i gilydd, ac ni restrir ond y twrnameintiau sy'n dechrau rhyngddynt. Mae'r ddau ddiwrnod wedi'u cynnwys.

- **Mae tudalen blwyddyn yn dangos ei misoedd.** Rhestrir pob mis ar gau, gan ddweud faint o dwrnameintiau sy'n dechrau ynddo. Gwasgwch fis i agor ei dwrnameintiau, ac agorwch gynifer ag y mynnwch. Mae **Dangos y cyfan** yn agor pob mis.

- **Mae rhestrau hir mewn tudalennau.** Mae rhestr o dwrnameintiau yn dangos cant ar y tro, felly nid yw chwiliad eang bellach yn llwytho pob rhes ar unwaith.

- **Mae'r cymorth yn dod o hyd i ateb yn ôl yr hyn rydych yn ei olygu.** Gofynnwch gwestiwn yn y blwch chwilio ar dudalen gyntaf y cymorth, a bydd yn dod o hyd i'r erthygl hyd yn oed lle mae'r erthygl yn defnyddio geiriau eraill sy'n golygu'r un peth. Mae'r dudalen gyntaf hefyd yn cynnig cwestiynau poblogaidd a'r pynciau fel cardiau.

### Dilyn twrnamaint

- **Nodiadau gan y rheolwyr.** Gall rheolwyr twrnamaint nawr ysgrifennu nodiadau i ddweud wrth ei chwaraewyr yr hyn sydd angen iddynt ei wybod wrth i'r twrnamaint gael ei chwarae: y fformat, newid i drefn y chwarae, amser cinio. Maen nhw yn adran Nodiadau newydd y twrnamaint, gyda'r diweddaraf yn gyntaf a pha mor hir yn ôl yr ysgrifennwyd pob un.

- **Mae seren (\*) yn nodi'r hyn nad ydych wedi'i ddarllen.** Mae gan nodyn un nes i chi ei agor, ac eto os caiff ei newid ar ôl i chi ei ddarllen. Tra bod unrhyw nodyn heb ei ddarllen, mae gan yr adran Nodiadau un hefyd, ar bob tudalen o'r twrnamaint, fel y gallwch weld bod newyddion heb orfod mynd i edrych. Mae sylwebaethau'n cael eu nodi yn yr un modd. Mae eich porwr yn cofio'r hyn rydych wedi'i ddarllen, felly nid oes angen i chi fewngofnodi. Mae ffôn neu gyfrifiadur arall yn dechrau heb ddim wedi'i ddarllen.

- **Mae sylwebaeth yn haws ei dilyn.** Ar yr hen wefan, roedd pob sylw newydd yn taflu'r dudalen i lawr i'r gwaelod, felly roedd pawb a oedd yn edrych yn ôl drwy sylwadau cynharach yn colli eu lle. Nawr dim ond os ydych eisoes ar y gwaelod, yn darllen y diweddaraf, y mae'r dudalen yn symud i lawr at sylw newydd. Os ydych wedi sgrolio'n ôl i ddarllen sylwadau cynharach, mae'n eich gadael lle'r ydych.

- **Mae bloc yn dangos safle pob chwaraewr.** Mae'r golofn olaf yn rhoi safle pob chwaraewr: 1, neu =2 lle na ellir gwahanu chwaraewyr a'u bod yn rhannu'r ail safle. Lle mae chwaraewyr yn gyfartal ar y gemau y maent wedi'u hennill, mae llinell oddi tano yn dweud sut y gwahanwyd hwy.

- **Gellir trefnu trefn y chwarae.** Gwasgwch Gêm i drefnu'r gemau yn ôl enw'r enillydd, neu Dyddiad i drefnu yn ôl pryd yr ychwanegwyd pob un. Gwasgwch eto i'w troi am yn ôl. Mae'r wefan yn cofio sut y gwnaethoch drefnu, ar gyfer pob cystadleuaeth a hefyd ar gyfer y rhestrau o dwrnameintiau, ac mae dolen o dan restr, Yn ôl i'r drefn arferol, yn ei hanghofio.

- **Dangosir handicapiau.** Lle mae gan chwaraewr handicap, mae ar ôl ei enw, gyda'r hyn y mae'n ei gynrychioli, fel yn Tim Murphy (4, Australia).

- **Mae cystadleuaeth yn dweud i faint o gylchoedd y chwaraeir ei gemau** lle nad dyna'r arfer ar gyfer ei champ, fel "Chwaraeir i 14 cylch".

### Y wefan

- **Eich iaith.** Mae'r wefan nawr mewn deuddeg iaith: Afrikaans, Arabeg (yr Aifft), Tsieceg, Saesneg, Almaeneg, Groeg, Latfieg, Norwyeg, Portiwgaleg, Sbaeneg, Swedeg a Chymraeg. Dangosir i chi'r iaith gyntaf y mae eich porwr yn gofyn amdani ac sydd gan y wefan, neu Saesneg os nad oes gan y wefan yr un. I ddewis un arall, defnyddiwch y rhestr yn y troedyn ar waelod unrhyw dudalen a gwasgwch y botwm wrth ei hymyl. Os hoffech weld iaith yn cael ei hychwanegu, anfonwch e-bost i <croquetscores@gmail.com>.

- **Golau neu dywyll.** Hefyd yn y troedyn: dewiswch Golau, Tywyll neu System. Mae System yn dilyn eich ffôn neu gyfrifiadur. Mae'r wefan yn cofio eich dewis ar bob tudalen ac ym mhob ymweliad.

- **Pa fersiwn rydych arni.** Mae'r troedyn nawr yn dangos fersiwn y wefan rydych yn edrych arni, fel v234. Os byddwch yn adrodd am broblem, dywedwch pa fersiwn oedd hi.

- **Eich data.** Mae'r dudalen /data-deletion-policy yn dweud sut i gael dileu'r hyn y mae'r wefan yn ei gadw amdanoch, beth a ddileir a beth a gedwir.

### Cod Agored

Mae'r cod nawr yn god agored, o dan Drwydded Gyhoeddus Gyffredinol GNU Affero fersiwn 3 (AGPL-3.0). Gall unrhyw un ei ddarllen, ei ddefnyddio a'i newid, ac mae'n rhaid i unrhyw un sy'n rhedeg fersiwn wedi'i newid fel gwefan rannu eu newidiadau o dan yr un drwydded.
