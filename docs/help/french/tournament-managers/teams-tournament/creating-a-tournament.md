# Créer un tournoi

Appuyez sur **Nouveau tournoi**, au-dessus de la liste des tournois dans l’administration. Il est au-dessus de la liste plutôt qu’en dessous, pour qu’une longue liste ne le pousse pas hors de l’écran d’un téléphone.

![Le formulaire de nouveau tournoi, rempli pour un tournoi par équipes](images/new-tournament.png)

Le formulaire demande tout ce avec quoi un tournoi commence. Ce qui compte le plus ici est le **Format**, qui est ce qui fait d’un tournoi un tournoi par équipes.

## Ce que demande le formulaire

**Nom.** Ce que les lecteurs cherchent pour trouver le tournoi, comme « Trans-Tasman Tests ». Il compte entre 3 et 254 caractères. Un nom tout en minuscules, ou tout en majuscules, est refusé, parce qu’il aurait l’air d’une erreur sur chaque page où il s’affiche. Deux tournois peuvent porter le même nom, puisque le même tournoi se joue chaque année.

**Début** et **Fin.** Les jours où se joue le tournoi. Chaque rencontre se joue entre ces dates ; fixez-les donc pour couvrir toute l’épreuve. Un tournoi ne peut pas finir avant de commencer, ni commencer ou finir après la fin de l’année prochaine. Un tournoi appartient à l’année où il commence, qui est aussi l’année de son adresse.

**Format.** Choisissez l’un des formats par équipes :

- **Équipes** est le format général pour toute épreuve entre équipes.
- **Coupe d'Irlande**, **Bouclier interétatique** et **Championnat du monde par équipes de croquet golf** sont des épreuves particulières, chacune gardée comme un format à part pour pouvoir être organisée comme cette épreuve se joue.

Standard est le seul format qui ne se joue pas par équipes, et ce n’est pas celui que vous voulez ici. Gateball Scores ne propose aucun format, puisque chaque tournoi y est un tournoi standard de gateball ; un tournoi par équipes se crée sur Croquet Scores.

**Sport.** Les sports que propose le site, dans son ordre : Croquet association, Croquet golf, Croquet américain à 6 arceaux et Ricochet.

**Pays** et **Région.** Là où se joue le tournoi. Une région n’est demandée que si le pays choisi est divisé en régions, comme les États d’Australie, et peut rester non choisie même alors.

**Sous-titre.** Tout ce que vous voulez faire savoir aux lecteurs et qui n’a pas de champ à lui : où se garer, à quelle heure est le déjeuner, qui appeler. Il s’affiche sous le nom du tournoi sur chaque page publique. Il s’écrit en Markdown : un mot se met en gras entre des astérisques, et une liste se fait avec un tiret au début de chaque ligne. Il peut compter jusqu’à 2000 caractères, et peut rester vide.

La façon dont se jouent et se comptent ses rencontres, avec ou sans handicap, avec ou sans matchs nuls, et pour le classement mondial ou non, est à dire pour chacune au moment où elle est ajoutée.

**Événement de niveau national** et **Événement de niveau international.** Un tournoi peut être l’un, l’autre, ou aucun des deux, mais jamais les deux : cocher l’un décoche l’autre.

## Le créer

Appuyez sur **Créer le tournoi**. Vous arrivez sur la page du tournoi dans l’administration, ouverte sur son onglet Équipes, et vous êtes son premier organisateur. Il est listé dans l’administration sous l’année où il commence.

![Un tournoi tout juste créé, sans équipe encore](images/tournament-page-empty.png)

L’adresse publique du tournoi est faite de son année, de son sport et de son nom, comme `/2026/ac/trans-tasman-tests`. Il garde cette adresse quand son nom est corrigé plus tard, pour qu’un lien déjà envoyé le retrouve ; il ne déménage que si l’année où il commence, ou son sport, change.

## Si quelque chose est refusé

Ce qui est refusé est dit sous le champ concerné, et ce que vous avez saisi reste saisi. Rien n’est enregistré tant que chaque champ n’est pas accepté. Les refus les plus fréquents : un nom tapé tout en minuscules, une fin avant le début, et un pays non choisi.

Suite : [Équipes](teams.md).
