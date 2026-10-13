# Tests

L’onglet **Tests** de la page d’un tournoi est l’endroit où les tests entre ses équipes sont ajoutés, modifiés, mis en ordre et mis de côté. Un test est l’une des compétitions du tournoi : une confrontation entre deux équipes, désignée par leurs noms courts, comme « AUS v NZ », jouée sous forme d’un certain nombre de matchs entre un joueur de chaque équipe. Chaque test a sa propre page, où ses résultats sont saisis.

![L’onglet Tests, avec trois tests dans un groupe](images/tests-tab.png)

Chaque test dit son nom, les jours où il se joue, le nombre de matchs qu’il doit avoir et au meilleur de combien de parties se joue chacun, comme « 6 matchs, au meilleur des 3 », et son groupe quand il en a un.

## Deux équipes d’abord

Un test oppose deux équipes en service ; tant que le tournoi en a moins de deux, l’onglet le dit là où serait Ajouter un test, et mène à l’onglet Équipes.

![L’onglet Tests avant qu’il y ait deux équipes](images/tests-tab-two-teams-needed.png)

## Ajouter un test

Appuyez sur **Ajouter un test**, au-dessus de la liste. Une boîte de dialogue s’ouvre sur la page, dans l’ordre où l’on annonce un test à voix haute.

![La boîte de dialogue Ajouter un test, remplie](images/add-test-dialog.png)

**Équipe A** et **Équipe B** se choisissent chacune parmi les équipes en service du tournoi, par leur nom, dans l’ordre du tournoi. Aucune n’est choisie au départ, pour qu’un test ne soit jamais ajouté entre des équipes que vous n’avez pas choisies. Équipe B propose chaque équipe sauf celle choisie comme Équipe A, puisqu’une équipe ne joue pas de test contre elle-même. Équipe A est la première équipe : ses joueurs sont à gauche sur la page du test et sur la page publique. Un test n’a pas de nom à taper ; il est désigné par les noms courts de ses équipes.

**Début** et **Fin** sont les jours où le test se joue, qui commencent au premier jour du tournoi. Un test se joue au sein de son tournoi ; des jours avant le début du tournoi ou après sa fin sont donc refusés.

**Matchs prévus** est le nombre de matchs que le test doit avoir, fixé par l’épreuve avant qu’il ne commence, pour que celui qui lit ses résultats voie où il en est. C’est un nombre entier à partir de 1. C’est aussi une limite : une fois qu’autant de matchs ont commencé que le test doit en avoir, une partie qui en commencerait un autre est refusée, tandis que les matchs déjà commencés se jouent jusqu’au bout. Un test qui doit en avoir plus se modifie pour les prévoir.

**Au meilleur des** est le nombre de parties au meilleur desquelles se joue chaque match. Il peut être pair, puisqu’un match peut être partagé.

**Groupe** est le groupe où se trouve le test, quand l’épreuve se joue en groupes, comme « Block A ». Il est facultatif : laissé vide, le test n’est dans aucun groupe. Les tests d’un groupe ont leur propre page sur le site public, montrant où en sont les équipes du groupe.

Appuyez sur **Ajouter**. Le test est ajouté, la boîte de dialogue dit lequel par son nom, et les équipes se vident pour le suivant, les jours, les matchs prévus, le nombre de parties et le groupe restant tels quels : les tests s’ajoutent par tour, entre des équipes qui se rencontrent le même jour, de sorte que le test suivant du tour n’est que ses deux équipes. Appuyez sur **Annuler** une fois qu’ils sont tous saisis.

![La boîte de dialogue après l’ajout d’un test](images/add-test-dialog-added.png)

## Modifier un test

**Modifier** ouvre la même boîte de dialogue sur le test, intitulée Modifier le test, remplie telle que le test est. Appuyez sur **Enregistrer** pour garder la modification.

![La boîte de dialogue Modifier le test](images/edit-test-dialog.png)

Un test qui a des parties en service garde ses équipes : la boîte de dialogue les montre, mais elles ne peuvent pas être changées. Le reste peut l’être, dans les limites de ce qui a été joué : des matchs prévus moins nombreux que les matchs déjà commencés sont refusés, de même qu’un nombre de parties inférieur au plus grand nombre de parties que deux joueurs ont déjà jouées.

## Ordre

Les tests sont listés dans l’ordre du tournoi, qui est l’ordre dans lequel ils apparaissent sur les pages publiques et dans la barre vert foncé. **Monter** et **Descendre** déplacent un test d’une place.

## Aller à un test

Le nom d’un test, ou **Voir**, ouvre sa page, où ses résultats sont saisis. La barre vert foncé y mène aussi, depuis la page du tournoi ou celle de n’importe quel autre test.

## Archiver un test

**Archiver** met un test de côté, et **Restaurer** l’annule ; aucun des deux ne demande donc d’abord. Un test archivé est listé sous **Tests archivés**, barré, n’offre plus que Restaurer, et n’est pas sur les pages publiques.

Un test qui a des parties en service a été joué, et ne peut pas être archivé tant que ses parties ne le sont pas. Un test dont toutes les parties sont archivées peut l’être, puisqu’une partie archivée ne compte pour rien. Un test dont l’équipe a été archivée depuis n’est pas restauré tant que l’équipe ne l’est pas, et l’onglet le dit.

Suite : [Résultats](scores.md).
