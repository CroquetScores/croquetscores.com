# Τα σημεία πρόσβασης POST του API

Αυτές οι διευθύνσεις αλλάζουν κάτι. Όσες απλώς διαβάζουν βρίσκονται στα [σημεία πρόσβασης GET](get-endpoints.md). Κάθε διεύθυνση εδώ βρίσκεται κάτω από το `/api/v0` του ιστότοπου, και ό,τι αλλάζουν οι ίδιες οι σελίδες του ιστότοπου το αλλάζουν οι ίδιες διευθύνσεις, ώστε μια εφαρμογή να μην έχει μικρότερο σύνολο από τον ιστότοπο. Όσα ισχύουν για όλες, όπως τα κλειδιά, τα όρια και τα σφάλματα, βρίσκονται στη [βοήθεια για προγραμματιστές εφαρμογών](index.md)· ποιος μπορεί να γράφει, [παρακάτω](#who-may-write).

Ένα τουρνουά, ένα αγώνισμα και τα υπόλοιπα ονομάζονται σε μια διεύθυνση με το μέρος του id τους μετά την κάθετο: για το `tournament/4f2a…` η διεύθυνση λέει `4f2a…`. Ένα σώμα ονομάζει άλλα πράγματα με τον ίδιο τρόπο, όπως κάνει το `player` παρακάτω, εκτός όπου λέει ότι είναι ολόκληρο το id.

Στείλτε το σώμα ως JSON, με `Content-Type: application/json`. Ένα πεδίο που παραλείπεται είναι το ίδιο με ένα κενό και απορρίπτεται ως τέτοιο. Ό,τι αποστέλλεται και δεν αναφέρεται σε αυτή τη σελίδα αγνοείται. Μια απάντηση φέρει `Cache-Control: no-store`.

## Ποιος μπορεί να γράφει {#who-may-write}

Ένα αίτημα που αλλάζει κάτι γίνεται από ένα κλειδί που δημιουργήθηκε για εγγραφή (βλ. [κλειδιά](index.md#keys)) ή από ένα άτομο που έχει συνδεθεί στον ιστότοπο. Ένα κλειδί μπορεί να κάνει ό,τι μπορεί ο λογαριασμός για τον οποίο δημιουργήθηκε, και όχι περισσότερα:

- Ένα κλειδί που δημιουργήθηκε μόνο για ανάγνωση απορρίπτεται με `ApiKey.ReadOnly`.
- Ένα κλειδί που δημιουργήθηκε για ένα τουρνουά μπορεί να αλλάζει μόνο αυτό το τουρνουά. Για άλλο απορρίπτεται με `ApiKey.LimitedToAnotherTournament`, και δεν μπορεί να δημιουργήσει τουρνουά, που δεν ανήκει σε κανένα.
- Οι υπεύθυνοι ενός τουρνουά μπορούν να αλλάζουν τα πάντα σε αυτό.
- Οι καταχωρητές ενός τουρνουά μπορούν να κάνουν ό,τι γίνεται με τα σκορ, και τίποτε άλλο: να προσθέσουν ένα παιχνίδι, να το διορθώσουν, να το μετακινήσουν, να το αρχειοθετήσουν, να το επαναφέρουν, να το αποσύρουν και να αναιρέσουν την απόσυρσή του. Οτιδήποτε άλλο στο τουρνουά τους απορρίπτεται με `Tournament.NotAManager`.
- Όποιος άλλος απορρίπτεται με `Tournament.NotAManager`, ή με `Tournament.NotAManagerOrScorer` όπου θα είχε γίνει δεκτός ένας καταχωρητής.

Το `GET /api/v0/tournaments/{id}/permissions` λέει ποιον ρόλο έχει ένα κλειδί σε ένα τουρνουά (βλ. [τι μπορεί να κάνει ένα κλειδί](get-endpoints.md#permissions)), ώστε μια εφαρμογή να μπορεί να πει γιατί μια εγγραφή θα απορριπτόταν προτού τη στείλει.

## Τι είναι μια απάντηση {#answers}

Ένα αίτημα που δημιουργεί κάτι απαντιέται με `201` και το `id` του νέου πράγματος, που είναι ολόκληρο το id του, όπως το λένε τα σημεία πρόσβασης GET. Ένα αίτημα που αλλάζει κάτι που υπάρχει απαντιέται με `204`, χωρίς τίποτε στο σώμα. Ένα αίτημα που απορρίπτεται απαντιέται όπως κάθε σφάλμα (βλ. [σφάλματα](index.md#errors)): με το `code` του, στο οποίο στηρίζεται μια εφαρμογή, και με το `field` για το οποίο ήταν, όπου υπήρχε.

Το να στείλετε ένα αίτημα δύο φορές δεν είναι το ίδιο με το να το στείλετε μία: ένα παιχνίδι που προστέθηκε δύο φορές είναι δύο παιχνίδια. Μια εφαρμογή που δεν ενημερώθηκε αν ένα αίτημα πέρασε πρέπει να διαβάσει τι άλλαξε πριν το στείλει ξανά.

## Τουρνουά {#tournaments}

### Δημιουργία τουρνουά {#create-tournament}

`POST /api/v0/tournaments`

Δέχεται `name`, `starts` και `finishes` (γραμμένα ως `2026-10-03T00:00:00Z`), `format` (έναν κωδικό, βλ. [τις μορφές](get-endpoints.md#formats)), `sport` (έναν κωδικό, βλ. [τα αθλήματα](get-endpoints.md#sports)), `country` (έναν κωδικό όπως `au`, βλ. [τις χώρες](get-endpoints.md#countries)) και, αν θέλετε, `region` (έναν κωδικό της χώρας, από την ίδια λίστα), `subtitle`, `levelTestsDrawn`, `national` και `international`, καθένα από τα τελευταία τρία `true` ή `false`. Απαντά `201` με `id` και `address`, που είναι το σημείο όπου το δείχνει ο ιστότοπος.

### Αρχειοθέτηση ή επαναφορά ενός τουρνουά {#tournament-actions}

`POST /api/v0/tournaments/{id}/archive`

`POST /api/v0/tournaments/{id}/restore`

Δεν δέχονται σώμα και απαντούν `204`.

### Προσθήκη σημείωσης υπευθύνου {#notes}

`POST /api/v0/tournaments/{id}/notes`

Δέχεται `title` και `description`. Απαντά `201` με το `id` της σημείωσης. Μια περιγραφή μπορεί να έχει έως 750.000 χαρακτήρες, και το αίτημα μπορεί να είναι όσο μεγάλο χρειάζεται γι' αυτό.

## Τα άτομα που έχουν ρόλο σε ένα τουρνουά {#people}

`POST /api/v0/tournaments/{id}/scorers`

`POST /api/v0/tournaments/{id}/managers`

Κάνουν κάποιον καταχωρητή ή υπεύθυνο. Δέχονται `emailAddress`, τη διεύθυνση email του λογαριασμού του, και απαντούν `204`.

`POST /api/v0/tournaments/{id}/scorers/{account}/remove`

`POST /api/v0/tournaments/{id}/managers/{account}/remove`

Αφαιρούν έναν καταχωρητή ή έναν υπεύθυνο. Δεν δέχονται σώμα και απαντούν `204`. Το `account` είναι το μέρος του id του λογαριασμού μετά το `account/`.

## Αγωνίσματα {#competitions}

### Προσθήκη αγωνίσματος {#add-competition}

`POST /api/v0/tournaments/{id}/competitions`

Δέχεται `kind`, ένα από `block`, `swiss`, `knockout` ή `losers-knockout`, και ένα `name`, και μετά ό,τι έχει το είδος του:

- Ένα μπλοκ δέχεται `bestOf` και `rounds` (πόσες φορές παίζει ο καθένας με τον καθένα) και μπορεί να δεχτεί `tieBreak`.
- Ένα ελβετικό δέχεται `bestOf`.
- Ένα νοκ-άουτ δέχεται `places` και `rounds`, μια λίστα με το καλύτερο από πόσα για κάθε γύρο, και μπορεί να δεχτεί `losers`, μια λίστα από νοκ-άουτ των ηττημένων που δημιουργούνται μαζί του, καθένα με ένα `name` και ένα `round`.
- Ένα νοκ-άουτ των ηττημένων δέχεται `from`, το αγώνισμα του οποίου τους ηττημένους παίρνει, και το `round` από το οποίο τους παίρνει.

Ένα μπλοκ, ένα ελβετικό και ένα νοκ-άουτ μπορούν επίσης να δεχτούν πώς παίζονται και μετρώνται: `handicap`, `drawsAllowed`, `worldRankings` και `advantage`, καθένα `true` ή `false`, και `maximumHoops`, έναν αριθμό, ή `null` για κανένα μέγιστο. Ένα αγώνισμα που λέει `advantage` απορρίπτεται με `Advantage.NotOffered` όσο ο ιστότοπος δεν προσφέρει Advantage Golf Croquet. Απαντά `201` με το `id` του αγωνίσματος.

### Προσθήκη τεστ {#add-test}

`POST /api/v0/tournaments/{id}/tests`

Ένα τεστ είναι ο αγώνας ανάμεσα σε δύο ομάδες ενός τουρνουά ομάδων. Δέχεται `firstTeam` και `secondTeam`, καθένα το id μιας ομάδας μετά το `team/`, `starts` και `finishes`, `expectedMatches`, `bestOf`, `group` και τους ίδιους κανόνες που μπορεί να δεχτεί ένα αγώνισμα. Απαντά `201` με το `id` του, που είναι ενός αγωνίσματος.

### Μετακίνηση, αρχειοθέτηση ή επαναφορά αγωνίσματος {#competition-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/restore`

Το μετακινούν μια θέση πάνω ή κάτω στη λίστα του τουρνουά, ή το αρχειοθετούν, ή το επαναφέρουν. Δεν δέχονται σώμα και απαντούν `204`. Ένα τεστ μετακινείται, αρχειοθετείται και επαναφέρεται και με αυτά.

## Οι παίκτες ενός αγωνίσματος {#competition-players}

### Εγγραφή παίκτη {#enter-player}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players`

Εγγράφει έναν από τους παίκτες του τουρνουά στο αγώνισμα. Δέχεται `player`, το μέρος του id του παίκτη του τουρνουά μετά το `tournament-player/`. Απαντά `201` με `id`, που είναι το id του παίκτη στο αγώνισμα και όχι στο τουρνουά.

### Μετακίνηση, απόσυρση, επαναφορά ή αφαίρεση παίκτη {#competition-player-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/unwithdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/players/{player}/remove`

Μετακινούν έναν παίκτη μια θέση πάνω ή κάτω, τον αποσύρουν, αναιρούν την απόσυρσή του ή τον βγάζουν από το αγώνισμα. Το `player` είναι το μέρος του id του στο αγώνισμα μετά το `competition-player/`. Δεν δέχονται σώμα και απαντούν `204`.

Κάθε bye σε ένα αγώνισμα έχει το ίδιο id, οπότε ένα bye ξεχωρίζει με το `order`, έναν ακέραιο που προστίθεται στη διεύθυνση ως `?order=2`. Οτιδήποτε άλλο απορρίπτεται με `Request.Invalid`.

## Τα παιχνίδια ενός αγωνίσματος {#games}

### Προσθήκη παιχνιδιού {#add-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games`

Δέχεται τον `winner` και τον `loser`, καθένα το μέρος του id ενός παίκτη του αγωνίσματος μετά το `competition-player/`, και τα σκορ. Οι παίκτες ενός τεστ δεν είναι δικοί του, οπότε για ένα τεστ καθένας είναι ολόκληρο το id ενός παίκτη σε μία από τις ομάδες του, όπως `team-player/…`.

Τα σκορ είναι όπως τα κρατά το αγώνισμα:

- `winnerScore` και `loserScore`, όπως πληκτρολογήθηκαν, όπως `26` ή `26tp`.
- Για ένα αγώνισμα που παίζεται ως Advantage Golf Croquet, στη θέση τους, `winnerHoops`, `winnerTarget`, `loserHoops` και `loserTarget`: τα τόξα που έκανε κάθε πλευρά και τα τόξα που έπαιζε. Ένα `w` μετά από ένα, όπως `"3w"`, λέει ότι αυτή η πλευρά κέρδισε όπου τα κλάσματα είναι ίσα.

Ένα αίτημα με το είδος σκορ που το αγώνισμα δεν κρατά απορρίπτεται, με `Game.AdvantageScoreTyped` ή `Game.HoopsAndTargetsNotAdvantage`. Απαντά `201` με το `id` του παιχνιδιού.

### Διόρθωση παιχνιδιού {#correct-game}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/correct`

Δέχεται τα σκορ όπως η προσθήκη παιχνιδιού και, όπου άλλαξαν, `winner` και `loser`. Ένας παίκτης που δεν στέλνεται μένει αυτός που έχει ήδη το παιχνίδι. Το `game` είναι το μέρος του id του μετά το `game/`. Απαντά `204`.

### Μετακίνηση, αρχειοθέτηση, επαναφορά ή απόσυρση παιχνιδιού {#game-actions}

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/up`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/down`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/archive`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/restore`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/withdraw`

`POST /api/v0/tournaments/{id}/competitions/{competition}/games/{game}/unwithdraw`

Μετακινούν το σκορ ενός τεστ μια θέση πάνω ή κάτω, αρχειοθετούν ένα παιχνίδι ή το επαναφέρουν, το αποσύρουν (παίχτηκε και δεν μετρά) ή αναιρούν την απόσυρσή του. Δεν δέχονται σώμα και απαντούν `204`. Αυτά, και τα δύο παραπάνω, μπορεί να τα κάνει ένας καταχωρητής.

## Οι παίκτες ενός τουρνουά {#tournament-players}

### Προσθήκη παίκτη {#add-tournament-player}

`POST /api/v0/tournaments/{id}/players`

Προσθέτει έναν παίκτη στο τουρνουά. Δέχεται `name` και μπορεί να δεχτεί `representing`, `handicap`, `flag` και `worldRankingName`· ό,τι λείπει ή είναι κενό μένει ανείπωτο. Απαντά `201` με το `id` του παίκτη, που είναι ολόκληρο το id του, όπως το λένε τα σημεία πρόσβασης GET. Ένας παίκτης χωρίς όνομα, ή με το όνομα ενός που υπάρχει ήδη, απορρίπτεται. Ένας παίκτης [εγγράφεται](#enter-player) σε ένα αγώνισμα με το μέρος αυτού του `id` μετά το `tournament-player/`.

### Μετακίνηση, αρχειοθέτηση ή επαναφορά παίκτη {#tournament-player-actions}

`POST /api/v0/tournaments/{id}/players/{player}/up`

`POST /api/v0/tournaments/{id}/players/{player}/down`

`POST /api/v0/tournaments/{id}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/players/{player}/restore`

Μετακινούν έναν από τους παίκτες του τουρνουά μια θέση πάνω ή κάτω, ή τον αρχειοθετούν ή τον επαναφέρουν. Το `player` είναι το μέρος του id του μετά το `tournament-player/`. Δεν δέχονται σώμα και απαντούν `204`.

## Οι ομάδες ενός τουρνουά {#teams}

### Προσθήκη ομάδας {#add-team}

`POST /api/v0/tournaments/{id}/teams`

Δέχεται `name` και `shortName` και μπορεί να δεχτεί `flag`. Απαντά `201` με το `id` της ομάδας.

### Προσθήκη παίκτη σε ομάδα {#add-team-player}

`POST /api/v0/tournaments/{id}/teams/{team}/players`

Δέχεται `name` και μπορεί να δεχτεί `worldRankingName`. Απαντά `201` με το `id` του παίκτη.

### Μετακίνηση, αρχειοθέτηση ή επαναφορά ομάδας {#team-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/restore`

Δεν δέχονται σώμα και απαντούν `204`.

### Μετακίνηση, αρχειοθέτηση ή επαναφορά παίκτη ομάδας {#team-player-actions}

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/up`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/down`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/archive`

`POST /api/v0/tournaments/{id}/teams/{team}/players/{player}/restore`

Το `player` είναι το μέρος του id του μετά το `team-player/`. Δεν δέχονται σώμα και απαντούν `204`.
