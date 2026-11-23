# نقاط وصول POST في الـ API

**ملحوظة: ده مسوّدة. فيه كام نقطة وصول عارف إنها هتتشال.**

العناوين دي بتغيّر حاجة. اللي بتقرا بس موجودة في [نقاط وصول GET](get-endpoints.md). كل عنوان هنا تحت `/api/v0` على الموقع، واللي صفحات الموقع نفسها بتغيّره بتغيّره نفس العناوين دي، فالتطبيق مش معاه مجموعة أصغر من اللي معاها الموقع. اللي بيسري على الكل، زي المفاتيح والحصص والأخطاء، موجود في [المساعدة لمطوّري التطبيقات](index.md)؛ ومين يقدر يكتب موجود [تحت](#who-may-write).

البطولة والمسابقة وباقي الحاجات بتتسمّى في العنوان بالجزء من الـ id بتاعها اللي بعد الشرطة المايلة: لـ `tournament/4f2a…` العنوان بيقول `4f2a…`. محتوى الطلب بيسمّي الحاجات التانية بنفس الطريقة، زي ما `player` بيعمل تحت، إلا لو قال إنه الـ id كله.

ابعت محتوى الطلب كـ JSON، مع `Content-Type: application/json`. الحقل اللي اتساب بيبقى زي الحقل الفاضي، وبيتترفض على الأساس ده. اللي بيتبعت وماتذكرش في الصفحة دي بيتتجاهل. الرد بيشيل `Cache-Control: no-store`.

## مين يقدر يكتب {#who-may-write}

الطلب اللي بيغيّر حاجة بيتعمل من مفتاح اتعمل عشان يكتب (شوف [المفاتيح](index.md#keys))، أو من شخص داخل على الموقع. المفتاح يقدر يعمل اللي الحساب اللي اتعمل له يقدر يعمله، ومش أكتر:

- المفتاح اللي اتعمل عشان يقرا بس بيتترفض بـ `ApiKey.ReadOnly`.
- المفتاح اللي اتعمل لبطولة واحدة يقدر يغيّر البطولة دي بس. وبيتترفض لأي بطولة تانية بـ `ApiKey.LimitedToAnotherTournament`، ومايقدرش يعمل بطولة، لأنها مش تابعة لأي واحدة.
- مديرين البطولة يقدروا يغيّروا فيها أي حاجة.
- مسجّلين النتايج في البطولة يقدروا يعملوا اللي بيتعمل في النتايج، ومش أي حاجة تانية: يضيفوا لعبة، يصحّحوها، ينقلوها، يأرشفوها، يرجّعوها، يسحبوها ويلغوا سحبها. أي حاجة تانية في البطولة بتتترفض لهم بـ `Tournament.NotAManager`.
- أي حد تاني بيتترفض بـ `Tournament.NotAManager`، أو بـ `Tournament.NotAManagerOrScorer` في المكان اللي كان مسجّل النتايج هيتقبل فيه.

`GET /api/v0/tournaments/{id}/permissions` بيقول المفتاح له إيه دوره في البطولة (شوف [المفتاح يقدر يعمل إيه](get-endpoints.md#permissions))، عشان التطبيق يقدر يقول ليه الكتابة هتتترفض قبل ما يبعتها.

## الرد بيبقى إيه {#answers}

الطلب اللي بيعمل حاجة بيتردّ عليه بـ `201` ومعاه `id` الحاجة الجديدة، وهو الـ id بتاعها كله، زي ما نقاط وصول GET بتقوله. الطلب اللي بيغيّر حاجة موجودة بيتردّ عليه بـ `204`، من غير حاجة في المحتوى. الطلب المترفوض بيتردّ عليه زي أي خطأ (شوف [الأخطاء](index.md#errors)): بالـ `code` بتاعه، اللي التطبيق بيعتمد عليه، وبالـ `field` اللي كان بيخصّه، لو كان فيه واحد.

إنك تبعت طلب مرتين مش زي ما تبعته مرة: لعبة اتضافت مرتين يعني لعبتين. التطبيق اللي ماتقالوش لو الطلب عدّى لازم يقرا اللي اتغيّر قبل ما يبعته تاني.

## البطولات {#tournaments}

### إنشاء بطولة {#create-tournament}

`POST /api/v0/tournaments`

بياخد `name` و`starts` و`finishes` (مكتوبين زي `2026-10-03T00:00:00Z`) و`format` و`sport` (كود، شوف [الرياضات](get-endpoints.md#sports)) و`country` (كود زي `au`)، ولو عايز `region` و`subtitle` و`levelTestsDrawn` و`national` و`international`، وكل واحد من التلاتة الأخيرين `true` أو `false`. بيرد بـ `201` ومعاه `id` و`address`، وهو المكان اللي الموقع بيعرضها فيه.

### أرشفة أو استرجاع أو شيل الوضع المميّز {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

`POST /api/v0/tournaments/{id}/remove-notable-status`

مابياخدوش محتوى وبيردّوا بـ `204`. شيل الوضع المميّز، اللي بيقول إن البطولة لا وطنية ولا دولية، ده شغل مدير الموقع.

### مسح بطولة تجريبية {#delete-tournament}

`POST /api/v0/tournaments/{id}/delete`

ده شغل مدير الموقع، اللي حكم إن البطولة تجريبية. بياخد `message`، اللي بيتقال لمديرين البطولة، و`archive`، `true` عشان البطولة تتأرشف كمان. بيرد بـ `204`.

### إضافة ملحوظة مدير {#notes}

`POST /api/v0/tournaments/{id}/notes`

بياخد `title` و`description`. بيرد بـ `201` ومعاه `id` الملحوظة. الوصف ممكن يوصل لـ 750,000 حرف، والطلب ممكن يبقى كبير زي ما ده محتاج.

## الناس اللي ليهم دور في بطولة {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

بيخلّوا حد مسجّل نتايج أو مدير. بياخدوا `emailAddress`، عنوان الإيميل بتاع حسابه، وبيردّوا بـ `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

بيشيلوا مسجّل نتايج أو مدير. مابياخدوش محتوى وبيردّوا بـ `204`. الـ `account` هو الجزء من id الحساب اللي بعد `account/`.

## المسابقات {#competitions}

### إضافة مسابقة {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

بياخد `kind`، واحد من `block` أو `swiss` أو `knockout` أو `losers-knockout`، و`name`، وبعدين اللي نوعها ليه:

- المجموعة (block) بتاخد `bestOf` و`rounds` (كل واحد بيلعب ضد كل واحد كام مرة)، وممكن تاخد `tieBreak`.
- السويسري بيأخد `bestOf`.
- خروج المغلوب بياخد `places` و`rounds`، قايمة بأحسن كام في كل دور، وممكن ياخد `losers`، قايمة بخروج المغلوب بتاع الخاسرين اللي بتتعمل معاه، كل واحد له `name` و`round`.
- خروج المغلوب بتاع الخاسرين بياخد `from`، المسابقة اللي بياخد الخاسرين بتوعها، و`round` الدور اللي بياخدهم منه.

المجموعة والسويسري وخروج المغلوب ممكن ياخدوا كمان بيتلعبوا وبيتحسبوا إزاي: `handicap` و`drawsAllowed` و`worldRankings` و`advantage`، وكل واحد `true` أو `false`، و`maximumHoops`، رقم، أو `null` لو مفيش حد أقصى. المسابقة اللي بتقول `advantage` بتتترفض بـ `Advantage.NotOffered` طول ما الموقع مش بيقدّم Advantage Golf Croquet. بيرد بـ `201` ومعاه `id` المسابقة.

### إضافة لقاء {#add-test}

`POST /api/v0/tournaments/{id}/tests`

اللقاء هو المباراة بين فريقين في بطولة فرق. بياخد `firstTeam` و`secondTeam`، كل واحد id فريق بعد `team/`، و`starts` و`finishes` و`expectedMatches` و`bestOf` و`group` ونفس القواعد اللي المسابقة ممكن تاخدها. بيرد بـ `201` ومعاه `id` بتاعه، وهو id مسابقة.

### نقل مسابقة أو أرشفتها أو استرجاعها {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

بيطلّعوها أو بينزّلوها مكان واحد في قايمة البطولة، أو بيأرشفوها، أو بيرجّعوها. مابياخدوش محتوى وبيردّوا بـ `204`. اللقاء كمان بيتنقل وبيتأرشف وبيترجّع بيهم.

## لاعبين المسابقة {#competition-players}

### تسجيل لاعب {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

بيسجّل واحد من لاعبين البطولة في المسابقة. بياخد `player`، الجزء من id لاعب البطولة اللي بعد `tournament-player/`. بيرد بـ `201` ومعاه `id`، وهو id اللاعب في المسابقة مش في البطولة.

### تسجيل لاعبين كتير {#enter-players}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/many`

بياخد `players`، قايمة بلاعبين البطولة زي `player` فوق، و`enterWhatCan`. افتراضيًا بيتسجّلوا كلهم أو ولا واحد. لو فيه ناس مايتسجّلوش، الرد بيقول مين فيهم وماسجّلش حد، عشان المدير يختار؛ ابعت `enterWhatCan` بـ `true` عشان الباقيين يتسجّلوا. بيرد بـ `201` ومعاه `ids`، بترتيب اللاعبين اللي اتدّى، و`refused`.

### نقل لاعب أو سحبه أو رجوعه أو شيله {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

بيطلّعوا لاعب أو بينزّلوه مكان واحد، أو بيسحبوه، أو بيلغوا سحبه، أو بيشيلوه من المسابقة. الـ `player` هو الجزء من id بتاعه في المسابقة اللي بعد `competition-player/`. مابياخدوش محتوى وبيردّوا بـ `204`.

كل bye في مسابقة له نفس الـ id، فالـ bye بيتميّز بـ `order`، رقم صحيح بيتضاف للعنوان زي `?order=2`. أي حاجة تانية بتتترفض بـ `Request.Invalid`.

## ألعاب المسابقة {#games}

### إضافة لعبة {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

بياخد `winner` و`loser`، كل واحد الجزء من id لاعب المسابقة اللي بعد `competition-player/`، والنتايج. لاعبين اللقاء مش بتوعه، فلو لقاء كل واحد هو الـ id كله للاعب في فريق من فرقه، زي `team-player/…`.

النتايج زي ما المسابقة بتحتفظ بيها:

- `winnerScore` و`loserScore`، زي ما اتكتبوا، زي `26` أو `26tp`.
- لمسابقة بتتلعب كـ Advantage Golf Croquet، بداله، `winnerHoops` و`winnerTarget` و`loserHoops` و`loserTarget`: الأطواق اللي عملها كل طرف والأطواق اللي كان بيلعب لحدها. حرف `w` بعد واحد منهم، زي `"3w"`، بيقول إن الطرف ده كسب لما الكسور بتبقى متساوية.

الطلب اللي فيه نوع النتيجة اللي المسابقة مابتحتفظش بيه بيتترفض، بـ `Game.AdvantageScoreTyped` أو `Game.HoopsAndTargetsNotAdvantage`. بيرد بـ `201` ومعاه `id` اللعبة.

### تصحيح لعبة {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

بياخد النتايج زي إضافة لعبة، ولو اتغيّروا، `winner` و`loser`. اللاعب اللي مابيتبعتش هو اللي اللعبة معاها أصلًا. الـ `game` هو الجزء من id بتاعها اللي بعد `game/`. بيرد بـ `204`.

### نقل لعبة أو أرشفتها أو استرجاعها أو سحبها {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

بيطلّعوا نتيجة لقاء أو بينزّلوها مكان واحد، أو بيأرشفوا لعبة أو بيرجّعوها، أو بيسحبوها (اتلعبت ومابتتحسبش) أو بيلغوا سحبها. مابياخدوش محتوى وبيردّوا بـ `204`. دول، واللي فوقهم، هم اللي مسجّل النتايج يقدر يعملهم.

## لاعبين البطولة {#tournament-players}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

بيطلّعوا واحد من لاعبين البطولة أو بينزّلوه مكان واحد، أو بيأرشفوه أو بيرجّعوه. الـ `player` هو الجزء من id بتاعه اللي بعد `tournament-player/`. مابياخدوش محتوى وبيردّوا بـ `204`.

## فرق البطولة {#teams}

### إضافة فريق {#add-team}

`POST /api/v0/tournaments/{id}/teams`

بياخد `name` و`shortName`، وممكن ياخد `flag`. بيرد بـ `201` ومعاه `id` الفريق.

### إضافة لاعب لفريق {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

بياخد `name`، وممكن ياخد `worldRankingName`. بيرد بـ `201` ومعاه `id` اللاعب.

### نقل فريق أو أرشفته أو استرجاعه {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

مابياخدوش محتوى وبيردّوا بـ `204`.

### نقل لاعب فريق أو أرشفته أو استرجاعه {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

الـ `player` هو الجزء من id بتاعه اللي بعد `team-player/`. مابياخدوش محتوى وبيردّوا بـ `204`.
