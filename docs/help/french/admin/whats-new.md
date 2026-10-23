# Nouveautés pour les responsables de tournoi

## Publié le 2026-10-23

Voici les principaux changements depuis la dernière version. Chacun renvoie à la pull request qui l'a apportée.

- **Les handicaps, les résultats nuls et les classements mondiaux se règlent dans chaque compétition.** Ils relevaient du tournoi, si bien qu'un même tournoi ne pouvait pas avoir un bloc avec handicap à côté d'un bloc sans, ni une rencontre où le nul est permis à côté d'une élimination directe où il ne l'est pas. Chaque compétition, et chaque rencontre, demande désormais les trois quand on l'ajoute ou la modifie, et le formulaire du tournoi ne les demande plus. Le dernier n'est demandé que pour un sport qui a un classement mondial, et une compétition qui ne compte pas est laissée hors du fichier des classements. Voir [Compétitions](../tournament-managers/standard-tournament/competitions.md). ([#341](https://github.com/CroquetScores/croquetscores.com/pull/341))

- **La liste des tournois de l'administration peut être restreinte par pays, région et sport.** Les choix figurent dans l'adresse, si bien qu'on peut renvoyer vers une liste filtrée, et seul ce que contient votre liste est proposé. Une région est proposée dès qu'un pays est choisi. Les tournois d'avant novembre 2026 n'ont pas de région : en choisir une les masque, et les listes publiques le disent. ([#354](https://github.com/CroquetScores/croquetscores.com/pull/354), [#351](https://github.com/CroquetScores/croquetscores.com/pull/351))

- **Les responsables du classement mondial forment désormais un rôle par sport.** Un responsable du croquet association voit les tournois de croquet association et s'en occupe, et un responsable du croquet golf ceux de croquet golf. Un tournoi dont vous êtes organisateur ou marqueur reste dans votre liste, quel que soit son sport. ([#348](https://github.com/CroquetScores/croquetscores.com/pull/348), [#356](https://github.com/CroquetScores/croquetscores.com/pull/356))

- **L'onglet Classements explique le fichier en un seul paragraphe, quel que soit le sport,** avec le lien de téléchargement en dessous. Voir [Classements](../tournament-managers/standard-tournament/rankings.md). ([#346](https://github.com/CroquetScores/croquetscores.com/pull/346))

- **Le nom d'un tournoi ne peut pas être entièrement en minuscules ni entièrement en capitales,** et le message le dit maintenant comme une règle. ([#345](https://github.com/CroquetScores/croquetscores.com/pull/345))

- **Retirer est une corbeille** dans les onglets des organisateurs et des marqueurs, dans les joueurs d'une compétition et dans la page des comptes de l'administrateur, comme Archiver et Supprimer l'étaient déjà. Elle s'appelle toujours Retirer quand on la pointe, et un lecteur d'écran la lit toujours comme Retirer. ([#353](https://github.com/CroquetScores/croquetscores.com/pull/353))

- **Chaque langue a de nouveaux mots.** Les mots du site dans les seize autres langues sont écrits à neuf, et l'aide est remise en accord avec eux. L'aide pour les lecteurs et pour les comptes, ainsi que les conditions d'utilisation, existent désormais dans chaque langue aussi. Aucune n'a encore été relue par un locuteur natif : dites-nous ce qui se lit mal. ([#355](https://github.com/CroquetScores/croquetscores.com/pull/355), [#349](https://github.com/CroquetScores/croquetscores.com/pull/349), [#350](https://github.com/CroquetScores/croquetscores.com/pull/350))

- **Dans les coulisses.** L'import des anciens sites donne à certains fuseaux horaires et à un tournoi un autre pays ([#344](https://github.com/CroquetScores/croquetscores.com/pull/344)), et charge une sauvegarde dans le serveur et fabrique les modèles de lecture avec un script ([#340](https://github.com/CroquetScores/croquetscores.com/pull/340)). Le site est déployé par un script, depuis un ordinateur ou depuis GitHub, et non plus à chaque fusion ([#352](https://github.com/CroquetScores/croquetscores.com/pull/352)).

## Publié le 2026-10-19

Voici les principaux changements pour ceux qui organisent des tournois. L'[aide pour les responsables de tournoi](../tournament-managers/index.md) donne tous les détails.

- **Les joueurs sont saisis une seule fois, dans le tournoi.** Sur l'ancien site, les joueurs étaient ajoutés dans chaque compétition. Désormais, c'est l'onglet **Joueurs** du tournoi qui sert à les ajouter, les corriger, les ordonner et les archiver, et un joueur corrigé là l'est dans toutes les compétitions où il figure et sur toutes les pages publiques. Voir [Joueurs](../tournament-managers/standard-tournament/players.md).

- **Les joueurs sont placés dans une compétition à partir d'une liste.** Sur la page d'une compétition, choisissez un joueur du tournoi dans la liste déroulante et appuyez sur **Ajouter un joueur**. La liste ne propose que les joueurs qui ne sont pas déjà dans la compétition. Dans une élimination directe, elle propose aussi **Bye** pour les places restantes. Voir [Inscrire des joueurs dans une compétition](../tournament-managers/standard-tournament/entering-players-in-a-competition.md).

- **Un seul bouton ajoute une compétition.** À la place des boutons distincts pour une nouvelle poule, un nouveau système suisse et une nouvelle élimination directe, appuyez sur **Ajouter une compétition**. La boîte de dialogue demande le nom et le type (une poule, une élimination directe ou un système suisse), puis ce dont ce type a besoin : le nombre de manches gagnantes de chaque match (au meilleur des), et pour une élimination directe les places de son tableau. Elle reste ouverte pour que vous puissiez en ajouter plusieurs d'un coup. Le type d'une compétition ne peut pas être changé ensuite : archivez-la et ajoutez-la de nouveau. Voir [Compétitions](../tournament-managers/standard-tournament/competitions.md).

- **Notes des responsables : utilisez-les plutôt qu'un commentaire pour dire aux joueurs ce qu'ils doivent savoir.** Le format, un changement dans l'ordre de jeu, l'heure du déjeuner. Une note s'écrit dans l'onglet **Notes** du tournoi, avec un titre et une description en Markdown, et vous pouvez la prévisualiser avant de l'ajouter. Les joueurs trouvent les notes sur la page Notes publique du tournoi. Une note qu'ils n'ont pas lue est signalée par un astérisque, tout comme la rubrique Notes sur chaque page du tournoi, jusqu'à ce qu'ils l'ouvrent. Une note que vous modifiez est de nouveau signalée pour tous ceux qui l'avaient lue. Voir [Notes](../tournament-managers/standard-tournament/notes.md).

- **Les notes du tournoi de l'ancien site sont désormais le sous-titre.** Ce que vous y aviez écrit est conservé comme sous-titre du tournoi, et s'affiche toujours sous le nom du tournoi sur chaque page publique. Il s'écrit en Markdown et peut compter jusqu'à 2000 caractères. Il sert à ce que les lecteurs doivent savoir quelle que soit la page où ils se trouvent. Utilisez une note pour les nouvelles qui changent au fil du tournoi.
