# Créer un tournoi

Appuyez sur **Nouveau tournoi**, au-dessus de la liste des tournois dans l’administration. Il est au-dessus de la liste plutôt qu’en dessous, pour qu’une longue liste ne le pousse pas hors de l’écran d’un téléphone.

![Le formulaire de nouveau tournoi, rempli pour un tournoi par équipes](../../../english/tournament-managers/teams-tournament/images/new-tournament.png)

Le formulaire demande tout ce avec quoi un tournoi commence. Ce qui compte le plus ici est le **Format**, qui est ce qui fait d’un tournoi un tournoi par équipes.

## Ce que demande le formulaire

**Nom.** Ce que les lecteurs cherchent pour trouver le tournoi, comme « Trans-Tasman Tests ». Il compte entre 3 et 254 caractères. Un nom tout en minuscules, ou tout en majuscules, est refusé, parce qu’il aurait l’air d’une erreur sur chaque page où il s’affiche. Deux tournois peuvent porter le même nom, puisque le même tournoi se joue chaque année.

**Début** et **Fin.** Les jours où se joue le tournoi. Chaque test se joue entre ces dates ; fixez-les donc pour couvrir toute l’épreuve. Un tournoi ne peut pas finir avant de commencer, ni commencer ou finir après la fin de l’année prochaine. Un tournoi appartient à l’année où il commence, qui est aussi l’année de son adresse.

**Format.** Choisissez l’un des formats par équipes :

- **Par équipes** est le format général pour toute épreuve entre équipes.
- **Eire Cup**, **Interstate Shield** et **GC World Team Championship** sont des épreuves particulières, chacune gardée comme un format à part pour pouvoir être organisée comme cette épreuve se joue.

Standard est le seul format qui ne se joue pas par équipes, et ce n’est pas celui que vous voulez ici. Gateball Scores ne propose aucun format, puisque chaque tournoi y est un tournoi standard de gateball ; un tournoi par équipes se crée sur Croquet Scores.

**Sport.** Les sports que propose le site, dans son ordre : Croquet association, Croquet golf, Croquet américain à 6 arceaux et Ricochet.

**Pays** et **Région.** Là où se joue le tournoi. Une région n’est demandée que si le pays choisi est divisé en régions, comme les États d’Australie, et peut rester non choisie même alors.

**Sous-titre.** Tout ce que vous voulez faire savoir aux lecteurs et qui n’a pas de champ à lui : où se garer, à quelle heure est le déjeuner, qui appeler. Il s’affiche sous le nom du tournoi sur chaque page publique. Il s’écrit en Markdown : un mot se met en gras entre des astérisques, et une liste se fait avec un tiret au début de chaque ligne. Il peut compter jusqu’à 2000 caractères, et peut rester vide.

**Joué avec handicap.** Cochez cette case pour une épreuve à handicap.

**Matchs nuls autorisés.** Cochez cette case là où une partie peut finir sans qu’aucun joueur ne gagne. Quand elle est cochée, un résultat saisi à points égaux et sans marque est gardé comme un match nul ; quand elle ne l’est pas, une partie à points égaux doit dire qui l’a gagnée par une marque après les points du vainqueur, comme « 6w ».

**Les tests à égalité sont nuls.** Demandé seulement une fois qu’un format par équipes est choisi. Un test est gagné par l’équipe qui remporte le plus de ses matchs, et un test à égalité de matchs se décide aux parties nettes, puis aux arceaux nets, sauf si cette case est cochée, auquel cas un test à égalité de matchs est nul, comme le veulent certaines épreuves par équipes. Elle est décochée au départ pour Par équipes, et cochée pour le GC World Team Championship, qui a toujours tenu pour nul un test à égalité.

**Compte pour le classement mondial.** Demandé seulement là où cela peut compter : un tournoi de croquet association ou de croquet golf qui n’est ni joué avec handicap ni ouvert aux matchs nuls. La case est cochée au départ.

**Épreuve de niveau national** et **Épreuve de niveau international.** Un tournoi peut être l’un, l’autre, ou aucun des deux, mais jamais les deux : cocher l’un décoche l’autre.

## Le créer

Appuyez sur **Créer le tournoi**. Vous arrivez sur la page du tournoi dans l’administration, ouverte sur son onglet Équipes, et vous êtes son premier gestionnaire. Il est listé dans l’administration sous l’année où il commence.

![Un tournoi tout juste créé, sans équipe encore](../../../english/tournament-managers/teams-tournament/images/tournament-page-empty.png)

L’adresse publique du tournoi est faite de son année, de son sport et de son nom, comme `/2026/ac/trans-tasman-tests`. Il garde cette adresse quand son nom est corrigé plus tard, pour qu’un lien déjà envoyé le retrouve ; il ne déménage que si l’année où il commence, ou son sport, change.

## Si quelque chose est refusé

Ce qui est refusé est dit sous le champ concerné, et ce que vous avez saisi reste saisi. Rien n’est enregistré tant que chaque champ n’est pas accepté. Les refus les plus fréquents : un nom tapé tout en minuscules, une fin avant le début, et un pays non choisi.

Suite : [Équipes](teams.md).
