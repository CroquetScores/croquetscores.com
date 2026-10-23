# Mots de passe

## Ce que le site demande d’un mot de passe

Chaque fois que vous choisissez un mot de passe, quand vous confirmez votre adresse e-mail, définissez un nouveau mot de passe ou en changez, le site demande qu’il :

- compte **au moins 12 caractères** ;
- soit saisi deux fois à l’identique, la seconde dans **Confirmer le mot de passe** ;
- ne soit pas un mot de passe qui a **figuré dans une fuite de données** ailleurs.

Les espaces au début et à la fin sont retirés, comme lorsque vous vous connectez, de sorte qu’une espace en trop ne vous enferme pas dehors. Les espaces au milieu sont conservées, ce qui convient à une phrase de passe de plusieurs mots.

## Bien choisir

Le site demande de la longueur et rien d’autre : ni majuscules, ni chiffres, ni symboles. C’est ce que recommandent les conseils actuels : un mot de passe long, qui ne sert nulle part ailleurs, est plus solide et plus facile à retenir qu’un mot de passe court rendu illisible. Le site suit les conseils du National Institute of Standards and Technology des États-Unis, que vous pouvez lire dans [les lignes directrices du NIST sur l’identité numérique, au sujet des mots de passe](https://pages.nist.gov/800-63-4/sp800-63b.html).

En bref :

- **Faites-le long.** Plusieurs mots sans rapport entre eux font une phrase de passe facile à retenir et difficile à deviner.
- **Utilisez-le ici et nulle part ailleurs.** Un mot de passe utilisé sur deux sites n’est aussi sûr que le plus faible des deux, et les mots de passe volés sur l’un sont essayés sur les autres.
- **Gardez-le dans un gestionnaire de mots de passe** si vous le pouvez : il peut créer un mot de passe long pour chaque site et se souvenir de tous.
- **Ne le changez pas selon un calendrier.** Changez-le quand vous pensez que quelqu’un d’autre le connaît, et pas autrement.

## Comment le site vérifie qu’un mot de passe n’a pas fuité

Des listes de mots de passe volés sur d’autres sites sont publiées, et ceux qui cherchent à entrer dans des comptes les essaient en premier. Quand vous choisissez un mot de passe, le site demande donc à un service extérieur s’il figure sur une telle liste. Ce service est exploité par un tiers, et le site ne l’utilise que pour cela.

Votre mot de passe ne quitte pas le site. Le site en fait une empreinte à sens unique, qui ne peut pas être reconvertie en mot de passe, et n’envoie au service que les cinq premiers caractères de cette empreinte. Le service répond avec la suite de l’empreinte de chaque mot de passe divulgué qui commence de la même façon, soit plusieurs centaines, et le site cherche la sienne parmi elles. Le service apprend donc que votre mot de passe est l’un de plusieurs centaines, et jamais lequel. [Le fonctionnement expliqué par Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/) en dit plus.

Un mot de passe qui figure sur la liste est refusé avec un message qui le dit, et vous en choisissez un autre. Si le service est injoignable, votre mot de passe ne peut pas être vérifié pour le moment, et il n’est donc ni accepté ni changé. Réessayez dans quelques minutes. Un lien qu’on vous a envoyé fonctionne toujours jusqu’à son expiration.

## Changer de mot de passe

Choisissez **Changer le mot de passe** dans le menu **Compte**. La page demande votre **Mot de passe actuel**, un **Nouveau mot de passe**, puis ce même mot de passe dans **Confirmer le mot de passe**. Le mot de passe actuel est demandé parce qu’être connecté ne suffit pas : sans cela, un téléphone laissé déverrouillé permettrait à qui le ramasse de vous enfermer dehors.

Une fois le mot de passe changé, vous restez connecté sur ce navigateur et tous les autres sont déconnectés. Le site envoie un e-mail à votre adresse pour dire que le mot de passe a été changé, afin que, si ce n’était pas vous, vous le sachiez. Un mot de passe actuel erroné compte dans les mêmes limites que la connexion.

Si vous ne vous souvenez pas du mot de passe actuel, la page renvoie vers **Mot de passe oublié ?**.

Suite : [Prendre soin de votre compte](looking-after-your-account.md).
