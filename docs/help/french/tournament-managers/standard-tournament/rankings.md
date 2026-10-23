# Classements

Quand une compétition compte pour le classement mondial, ses résultats lui sont envoyés sous forme de fichier, que le site écrit pour vous à partir de ce que vous avez saisi. L’onglet **Classements** est l’endroit où vous le récupérez.

## L’onglet

Ouvrez la page du tournoi et choisissez **Classements**, le dernier de ses onglets. Il dit ce qu’est le fichier : un fichier texte pour le croquet association, un tableur pour le croquet golf et le croquet américain à 6 arceaux. Il dit ce qu’il vous reste à faire à la main, et que le fichier doit ensuite être envoyé aux responsables du classement. En dessous se trouve **Télécharger les classements**, qui enregistre le fichier. Il est là avant qu’un seul résultat soit saisi, et donne un fichier vide tant qu’il n’y en a pas.

L’onglet n’existe que sur la page d’un tournoi d’un sport qui a un classement mondial, et seulement pour ses organisateurs : un marqueur ne le voit pas. Le fichier lui-même se trouve à l’adresse du tournoi suivie de `/rankings`, comme `/2026/ac/spring-open/rankings`, qui est l’adresse que le site lui a toujours donnée, et toute personne qui connaît l’adresse peut l’ouvrir.

## Ce que contient le fichier

Chaque résultat saisi et non archivé y figure, dans l’ordre où il a été saisi, y compris un résultat qui a été retiré, et ceux d’un joueur qui s’est retiré. Un résultat archivé n’y est pas. Un match gagné par un exempt ou par un forfait n’a pas été joué ; il n’a donc pas de ligne.

Un joueur est désigné par son nom dans le classement mondial, qui est son nom tant qu’on ne lui en a pas donné un autre.

Le **croquet association** a un bloc pour chaque compétition qui a un résultat : son épreuve, ses dates, son vainqueur, si elle se jouait en matchs ou en parties simples, et une ligne numérotée pour chaque résultat, comme « 1 Sam Someone beat Alex Another +9 ». Un score est le nombre d’arceaux du vainqueur moins celui du perdant, avec un plus quand le vainqueur en a marqué davantage, et les peels ensuite. Le match d’une élimination directe tient sur une ligne, avec le score de chaque partie à la suite. Le site ne peut que deviner qui a gagné une compétition ; vérifiez donc la ligne **Winner** de chaque bloc (le mot est en anglais dans le fichier) et corrigez-la avant d’envoyer le fichier.

Le **croquet golf et le croquet américain à 6 arceaux** ont un tableur : le nom du tournoi, ses jours et le nombre de parties qu’il compte, puis une ligne numérotée pour chaque partie, avec le nom de famille et le prénom du vainqueur, « beat », ceux du perdant, et les deux scores. Chaque partie du match d’une élimination directe a sa propre ligne. Sous la dernière, la ligne **Tournament winner:** est laissée vide, pour que vous la remplissiez.

## Quand il n’y a pas de fichier

Un tournoi dont aucune compétition ne compte pour le classement mondial n’a pas de fichier. Ouvrir son adresse de classements montre une page qui le dit, et dit pourquoi : son sport n’a pas de classement mondial, ou aucune de ses compétitions ne compte, parce que chacune se joue avec handicaps, admet les matchs nuls, ou a vu sa case pour compter décochée. Cela se décide quand chaque compétition est ajoutée, et se change avec son **Modifier**. Seules les compétitions qui comptent sont dans le fichier.

Suite : [Modifier, archiver et restaurer un tournoi](changing-and-archiving.md).
