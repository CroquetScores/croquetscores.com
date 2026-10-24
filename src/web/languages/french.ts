// Les mots du site en français. Le lecteur est vouvoyé partout. Les boutons,
// les éléments de menu et les titres suivent l'usage français : majuscule à
// la première lettre seulement ("Changer l'adresse e-mail"), sauf pour les noms
// propres. Les termes retenus : "adresse e-mail" (jamais "courriel"),
// "mot de passe", "se connecter" / "connexion", "s'inscrire" / "inscription",
// "oublier le compte" pour effacer à jamais les données d'un compte, "tournoi",
// "partie" pour un game, "match" pour un match, "rencontre" pour un test, "arceau" pour un hoop, "croquet golf" pour golf croquet.
// Les mots que le site vérifie lui-même (par exemple "bye") restent comme
// l'anglais les écrit.
import type { Language } from "../common/language.js";

export const french: Language = {
  tag: "fr",
  name: "Français",
  words: {
    // The site's own bars. What the site is called is not among them: a name
    // is not a word of anybody's language, so it is configured and filled into
    // the plea that names it (site.ts).
    "site.skipToContent": "Aller au contenu",
    "navigation.menu": "Menu",
    "navigation.label": "Principale",
    "navigation.home": "Accueil",
    "navigation.help": "Aide",
    "navigation.admin": "Administration",
    "sections.label": "Rubriques",
    "theme.label": "Thème",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",
    "footer.donate": "Faire un don",
    "footer.plea":
      "Vous aimez {siteName} ? Faites un don pour aider à poursuivre son développement.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Confidentialité",
    "footer.termsOfUse": "Conditions d'utilisation",
    "beta.banner":
      "Ce site est en version bêta. Les données peuvent être réinitialisées à tout moment.",
    "privacy.contact":
      "Une question sur cette page, ou sur ce qui est conservé à votre sujet : {emailAddress}",
    // The box a reader ticks to agree to the terms of use for those who write,
    // on the forms where writing begins. The link's words are found in the
    // box's and made the link, so they must be written exactly as they are
    // there.
    "termsOfUse.agree": "J'accepte les conditions d'utilisation",
    "termsOfUse.link": "conditions d'utilisation",
    // Beneath the terms for those who write, as privacy.contact is beneath the
    // privacy statement.
    "termsOfUse.report":
      "Signaler un contenu publié, ou poser une question sur ces conditions : {emailAddress}",
    "TermsOfUse.NotAgreed":
      "Cochez la case pour accepter les conditions d'utilisation.",
    // Said on every page of a try website, beneath the site bar.
    "tryWebsite.banner":
      "Ce site est un espace sans risque pour apprendre à utiliser {siteName}. Tout ce qui y est saisi peut être supprimé à tout moment.",

    "language.label": "Langue",
    "language.choose": "Changer",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Il y a du nouveau à lire.",
    "whatsNew.admin.message":
      "Il y a du nouveau pour les personnes qui organisent des tournois.",
    "whatsNew.view": "Voir les nouveautés",
    "whatsNew.later": "Me le rappeler la prochaine fois",
    "whatsNew.never": "Ne plus m'afficher cette alerte",

    "form.otherwise":
      "Quelque chose ne va pas. Vérifiez ce que vous avez saisi et réessayez.",

    // The account menu in the header: what the person stands for, and every
    // item it opens on.
    "account.menu": "Compte",
    "account.register": "S'inscrire",
    "account.signIn": "Se connecter",
    "account.forgotPassword": "Mot de passe oublié",
    "account.signOut": "Se déconnecter",
    "account.profile": "Profil",
    "account.changePassword": "Changer le mot de passe",
    "account.changeEmailAddress": "Changer l'adresse e-mail",
    "account.changeName": "Changer le nom",
    "account.setPassword": "Définir un mot de passe",
    "account.forgetAccount": "Oublier le compte",

    "register.title": "Inscription",
    "register.emailAddress": "Adresse e-mail",
    "register.submit": "S'inscrire",
    "register.withGoogle": "S'inscrire avec Google",
    "register.or": "ou",
    // Said above the form when Google sent the reader back without them being
    // let in, each by the code the way back gave. The register page and the
    // sign in page both say them, so they say "use your email address" rather
    // than naming what either form does with it.
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google n'a pas confirmé que cette adresse e-mail est la vôtre, elle ne peut donc pas être utilisée ici avec Google. Utilisez plutôt votre adresse e-mail ci-dessous.",
    "SignInWithGoogle.LinkedToAnother":
      "Cette adresse e-mail a déjà un compte, lié à un autre compte Google. Connectez-vous avec ce compte Google, ou avec votre adresse e-mail et votre mot de passe.",
    "SignInWithGoogle.NameMissing":
      "Google ne nous a pas communiqué votre nom, or un compte en a besoin. Utilisez plutôt votre adresse e-mail ci-dessous.",
    "Google.Unreachable":
      "Google est inaccessible pour le moment. Réessayez dans quelques minutes, ou utilisez votre adresse e-mail ci-dessous.",
    "Registration.NotAPerson":
      "Cela ne semble pas venir d'une personne. Réessayez, et si le problème persiste, attendez quelques minutes avant de revenir.",

    // A rule the address can break, said beneath the field it is about.
    "EmailAddress.Missing": "Saisissez une adresse e-mail.",
    "EmailAddress.NoAt": "Une adresse e-mail contient un @.",
    "EmailAddress.MoreThanOneAt":
      "Une adresse e-mail ne contient qu'un seul @.",
    "EmailAddress.NoDomain":
      "Une adresse e-mail comporte un domaine après le @, par exemple example.com.",

    "welcome.title": "Consultez vos e-mails",
    "welcome.checkEmail":
      "Un e-mail est en route vers l'adresse que vous avez indiquée. Suivez le lien qu'il contient pour continuer.",
    "welcome.nothingArrived":
      "Si rien n'arrive d'ici quelques minutes, regardez dans votre dossier de courrier indésirable ou de spam.",
    "welcome.home": "Retour à {siteName}",
    "newConfirmationLink.title": "Obtenir un nouveau lien",
    "newConfirmationLink.explanation":
      "Le lien de confirmation de votre adresse e-mail a expiré. Demandez-en un nouveau, il sera envoyé à l'adresse avec laquelle vous vous êtes inscrit.",
    "newConfirmationLink.send": "M'envoyer un nouveau lien",
    "newConfirmationLink.home": "Retour à {siteName}",
    "newConfirmationLink.signIn": "Se connecter",
    "newConfirmationLink.sent.title": "Consultez vos e-mails",
    "newConfirmationLink.sent.explanation":
      "Un nouveau lien est en route. Suivez-le pour confirmer votre adresse e-mail. Si rien n'arrive d'ici quelques minutes, regardez dans votre dossier de courrier indésirable ou de spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Cette adresse e-mail est déjà confirmée",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "Il n'y a rien de plus à confirmer. Connectez-vous avec le mot de passe que vous avez choisi lors de la confirmation.",
    "newConfirmationLink.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "newConfirmationLink.noLongerWorks.explanation":
      "Vérifiez que vous avez suivi le lien en entier, tel qu'il figure dans l'e-mail, sans qu'il manque quoi que ce soit à la fin. S'il ne fonctionne toujours pas, inscrivez-vous de nouveau et un nouveau lien vous sera envoyé.",
    "newConfirmationLink.tooMany.title": "Réessayez plus tard",
    "newConfirmationLink.tooMany.explanation":
      "Plusieurs liens ont été envoyés à cette adresse récemment. Attendez une heure avant de refaire la demande, et regardez entre-temps dans votre dossier de courrier indésirable ou de spam.",

    "forgotPassword.title": "Mot de passe oublié ?",
    "forgotPassword.emailAddress": "Adresse e-mail",
    "forgotPassword.submit": "M'envoyer un moyen de revenir",
    "forgotPassword.home": "Retour à {siteName}",
    "forgotPassword.sent.title": "Consultez vos e-mails",
    "forgotPassword.sent.explanation":
      "Si cette adresse a un compte, un lien pour définir un nouveau mot de passe est en route. Suivez-le dans l'heure. Si rien n'arrive d'ici quelques minutes, regardez dans votre dossier de courrier indésirable ou de spam.",
    "forgotPassword.tryAgainLater":
      "Trop de demandes de retour ont été faites depuis ici récemment. Attendez une heure et réessayez.",

    "setNewPassword.title": "Définir un nouveau mot de passe",
    "setNewPassword.password": "Mot de passe",
    "setNewPassword.confirmPassword": "Confirmer le mot de passe",
    "setNewPassword.submit": "Définir mon nouveau mot de passe",
    "setNewPassword.home": "Retour à {siteName}",
    "setNewPassword.signIn": "Se connecter",
    "setNewPassword.askAgain": "Demander un nouveau lien",
    "setNewPassword.changed.title": "Votre mot de passe a été changé",
    "setNewPassword.changed.explanation":
      "Vous avez été déconnecté partout où vous étiez connecté. Connectez-vous avec votre nouveau mot de passe.",
    "setNewPassword.expired.title": "Ce lien a expiré",
    "setNewPassword.expired.explanation":
      "Un lien pour définir un nouveau mot de passe est valable une heure. Demandez-en un autre, il sera envoyé à la même adresse.",
    "setNewPassword.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "setNewPassword.noLongerWorks.explanation":
      "Il a peut-être déjà été utilisé, ou il manque peut-être quelque chose à la fin. Demandez-en un autre si vous en avez toujours besoin.",

    // Said above the fields when the breached password check cannot be asked.
    "BreachedPasswords.Unreachable":
      "Votre mot de passe ne peut pas être vérifié pour le moment, il n'a donc pas été changé. Réessayez dans quelques minutes ; votre lien reste valable jusqu'à son expiration.",

    "forgetAccount.title": "Oublier votre compte",
    "forgetAccount.explanation":
      "Votre nom et votre adresse e-mail peuvent être rendus définitivement illisibles, et votre compte fermé. Pour nous assurer que c'est bien vous, nous enverrons d'abord par e-mail un lien à l'adresse de votre compte, et rien ne sera oublié tant que vous ne l'aurez pas suivi.",
    "forgetAccount.submit": "M'envoyer le lien par e-mail",
    "forgetAccount.sent.title": "Consultez vos e-mails",
    "forgetAccount.sent.explanation":
      "Nous avons envoyé un lien à l'adresse de votre compte. Il est valable 15 minutes, et seulement tant que vous êtes connecté à ce compte.",
    "forgetAccount.confirm.title": "Oublier définitivement votre compte ?",
    "forgetAccount.confirm.explanation":
      "Une fois oubliés, votre nom et votre adresse e-mail ne pourront plus jamais être lus, par personne, et il ne sera plus possible de se connecter à votre compte. Cette action est irréversible.",
    "forgetAccount.confirm.submit": "Oublier mon compte",
    "forgetAccount.forgotten.title": "Votre compte a été oublié",
    "forgetAccount.forgotten.explanation":
      "Votre nom et votre adresse e-mail ne peuvent plus être lus, et vous avez été déconnecté partout où vous étiez connecté.",
    "forgetAccount.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "forgetAccount.noLongerWorks.explanation":
      "Il a peut-être expiré, déjà été utilisé, ou concerne un compte auquel vous n'êtes pas connecté. Refaites la demande depuis votre compte si vous souhaitez toujours qu'il soit oublié.",
    "forgetAccount.lastAdministrator.title":
      "Votre compte ne peut pas être oublié",
    "forgetAccount.lastAdministrator.explanation":
      "Vous êtes le seul administrateur de ce site. Donnez le rôle d'administrateur à quelqu'un d'autre, et votre compte pourra alors être oublié.",
    "forgetAccount.askAgain": "Redemander",
    "forgetAccount.home": "Retour à {siteName}",

    "registrationsSuspended.title":
      "Les inscriptions sont suspendues pour le moment",
    "registrationsSuspended.explanation":
      "Un service dont l'inscription a besoin est inaccessible pour le moment, personne ne peut donc s'inscrire tant qu'il ne répond pas. Rien de ce que vous avez saisi n'a été conservé.",
    "registrationsSuspended.tryAgainLater":
      "Réessayez dans un moment. L'administrateur du site a été prévenu.",
    "registrationsSuspended.home": "Retour à {siteName}",

    "signIn.title": "Connexion",
    "signIn.emailAddress": "Adresse e-mail",
    "signIn.password": "Mot de passe",
    "signIn.submit": "Se connecter",
    "signIn.forgotPassword": "Mot de passe oublié ?",
    "signIn.register": "S'inscrire",
    "signIn.withGoogle": "Se connecter avec Google",
    "signIn.or": "ou",
    "signIn.tryAgainLater":
      "Trop de tentatives ont été faites récemment. Attendez une heure et réessayez.",

    // The one answer to a wrong password and to an address nobody registered.
    // It says neither which it was nor which it was not.
    "SignIn.Failed":
      "L'adresse e-mail ou le mot de passe est incorrect. Veuillez réessayer.",

    "profile.title": "Profil",
    // A label's colon is its words', since languages set it differently.
    "profile.name": "Nom :",
    "profile.emailAddress": "Adresse e-mail :",

    "changeName.title": "Changer le nom",
    "changeName.name": "Nom",
    "changeName.submit": "Changer le nom",

    "setPassword.title": "Définir un mot de passe",
    "setPassword.explanation":
      "Votre compte n'a pas de mot de passe : vous vous connectez avec Google. Pour pouvoir aussi vous connecter avec un mot de passe, nous enverrons à {emailAddress} un lien pour en définir un.",
    "setPassword.submit": "M'envoyer un lien par e-mail",
    "setPassword.sent.title": "Consultez vos e-mails",
    "setPassword.sent.explanation":
      "Nous vous avons envoyé un lien pour définir un mot de passe. Il est valable une heure.",
    "setPassword.profile": "Retour à votre profil",

    "changePassword.title": "Changer le mot de passe",
    "changePassword.currentPassword": "Mot de passe actuel",
    "changePassword.password": "Nouveau mot de passe",
    "changePassword.passwordConfirmation": "Confirmer le mot de passe",
    "changePassword.forgotPassword": "Mot de passe oublié ?",
    "changePassword.submit": "Changer le mot de passe",
    // Beneath the current password, which is the one it is about.
    "ChangePassword.WrongPassword": "Ce n'est pas votre mot de passe.",

    "changeEmailAddress.title": "Changer l'adresse e-mail",
    "changeEmailAddress.emailAddress": "Nouvelle adresse e-mail",
    "changeEmailAddress.currentPassword": "Mot de passe actuel",
    "changeEmailAddress.submit": "Envoyer un lien de confirmation",
    "changeEmailAddress.sent.title": "Consultez vos e-mails",
    "changeEmailAddress.sent.explanation":
      "Un lien pour confirmer le changement a été envoyé à la nouvelle adresse e-mail. Suivez-le en étant connecté pour y déplacer votre compte.",
    "changeEmailAddress.confirm.title": "Déplacer votre compte",
    "changeEmailAddress.confirm.explanation":
      "Votre compte va être déplacé vers {emailAddress}. Vous vous connecterez désormais avec cette adresse.",
    "changeEmailAddress.confirm.submit": "Déplacer mon compte",
    "changeEmailAddress.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "changeEmailAddress.noLongerWorks.explanation":
      "Il a expiré, a déjà été utilisé, ou n'a pas été envoyé pour le compte auquel vous êtes connecté. Refaites la demande depuis votre profil.",
    "changeEmailAddress.taken.title": "Votre compte n'a pas été déplacé",
    "changeEmailAddress.profile": "Retour à votre profil",
    // Beneath the field each is about.
    "ChangeEmailAddress.WrongPassword": "Ce n'est pas votre mot de passe.",
    "ChangeEmailAddress.Unchanged": "Votre compte est déjà à cette adresse.",
    "ChangeEmailAddress.Taken":
      "Cette adresse e-mail a désormais son propre compte, le vôtre ne peut donc pas y être déplacé.",

    "confirmEmailAddress.title": "Confirmez votre adresse e-mail",
    "confirmEmailAddress.name": "Nom",
    "confirmEmailAddress.password": "Mot de passe",
    "confirmEmailAddress.confirmPassword": "Confirmer le mot de passe",
    "confirmEmailAddress.submit": "Confirmer mon adresse e-mail",
    "confirmEmailAddress.signIn": "Se connecter",
    "confirmEmailAddress.home": "Retour à {siteName}",
    "confirmEmailAddress.confirmed.title": "Votre adresse e-mail est confirmée",
    "confirmEmailAddress.confirmed.explanation":
      "Votre compte est prêt. Connectez-vous avec l'adresse e-mail et le mot de passe que vous venez d'indiquer.",
    "confirmEmailAddress.expired.title": "Ce lien a expiré",
    "confirmEmailAddress.expired.explanation":
      "Un lien de confirmation d'adresse e-mail est valable 24 heures. Demandez-en un nouveau, il sera envoyé à la même adresse.",
    "confirmEmailAddress.expired.newLink": "M'envoyer un nouveau lien",
    "confirmEmailAddress.noLongerWorks.title": "Ce lien ne fonctionne plus",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Vérifiez que vous avez suivi le lien en entier, tel qu'il figure dans l'e-mail, sans qu'il manque quoi que ce soit à la fin. S'il ne fonctionne toujours pas, inscrivez-vous de nouveau et un nouveau lien vous sera envoyé.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Cette adresse e-mail est déjà confirmée",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "Il n'y a rien de plus à faire. Connectez-vous avec le mot de passe que vous avez choisi lors de la confirmation.",

    // A rule broken, keyed by its code, so that every form saying it says it
    // the same way. Said to whoever typed it, beneath the field it reads.
    "PersonName.Missing": "Saisissez un nom.",
    "PersonName.TooShort": "Un nom doit comporter au moins 3 caractères.",
    "PersonName.TooLong": "Un nom ne peut pas dépasser 254 caractères.",
    "WorldRankingName.TooShort":
      "Un nom de classement mondial doit comporter au moins 3 caractères.",
    "WorldRankingName.TooLong":
      "Un nom de classement mondial ne peut pas dépasser 254 caractères.",
    "Password.Missing": "Saisissez un mot de passe.",
    "Password.TooShort":
      "Un mot de passe doit comporter au moins 12 caractères.",
    "Password.ConfirmationDiffers":
      "Ceci n'est pas identique au mot de passe ci-dessus. Saisissez-le de nouveau.",
    "Password.Breached":
      "Ce mot de passe est apparu dans une fuite de données ailleurs, il n'est donc pas sûr de l'utiliser ici. Choisissez-en un autre.",

    "javaScriptRequired.title": "JavaScript requis",
    "javaScriptRequired.explanation":
      "L'inscription nécessite que JavaScript soit activé pour ce site, afin de vérifier que la personne qui s'inscrit est bien une personne. Activez-le, puis inscrivez-vous de nouveau.",
    "javaScriptRequired.register": "Retour à l'inscription",
    "javaScriptRequired.home": "Retour à {siteName}",

    "errors.backHome": "Retour à {siteName}",
    "errors.notFound": "Introuvable",
    "errors.refused": "Cela n'a pas pu être fait",
    "errors.refusedDetail": "Quelque chose dans ce qui a été envoyé ne va pas.",
    "errors.sorry": "Désolé",
    "errors.sorryDetail": "Cette requête n'a pas pu être traitée.",
    "errors.failed": "Un problème est survenu",
    "errors.reference": "Référence {reference}.",
    "errors.recorded":
      "L'erreur a été enregistrée et un e-mail a été envoyé à l'administrateur. Il est utile d'écrire à l'administrateur en indiquant la référence et une description de ce que vous faisiez.",
    "errors.message": "Écrire à l'administrateur",
    "errors.messageSubject": "Erreur {reference} sur {siteName}",
    "errors.messageBody": "Ce que je faisais quand cela s'est produit :\n\n",
    "errors.unavailable": "Le site est indisponible",
    "errors.unavailableDetail":
      "Le site ne peut pas accéder à ce dont il a besoin pour le moment. Veuillez réessayer plus tard.",
    "errors.maintenance": "Le site est en maintenance.",
    "errors.maintenanceMinutes":
      "Il devrait être de retour dans {minutes} minutes.",
    "errors.maintenanceMinute": "Il devrait être de retour dans 1 minute.",
    "errors.maintenanceLonger":
      "Cela prend plus de temps que prévu, le site sera bientôt de retour.",

    // The home page's two lists, what each says when it has nothing in it,
    // and the way beneath them to every tournament this year.
    "home.recentResults": "Résultats récents",
    "home.recentResults.none":
      "Aucune partie n'a été ajoutée ces sept derniers jours.",
    "home.upcomingTournaments": "Tournois à venir",
    "home.upcomingTournaments.none":
      "Aucun tournoi ne commence dans les soixante prochains jours.",
    "home.allTournaments": "Tous les tournois de {year}",
    // A year's page: its heading, and what it says when it has nothing in it.
    "year.heading": "Tournois de {year}",
    "year.none": "Aucun tournoi ne commence en {year}.",
    // A sport's page in a year: the same, of the sport alone.
    "yearSport.heading": "Tournois de {sport} en {year}",
    "yearSport.none": "Aucun tournoi de {sport} ne commence en {year}.",
    // A tournament's page: its sections, what it says of a game, how long ago
    // one was added, and what it says when it has none.
    "tournament.recent": "Récent",
    "tournament.summary": "Récapitulatif",
    // A tournament played by teams' summary: its table's groups and columns.
    // A test's grid: what each match is the best of, the word between its
    // teams, and its totals beneath the matches.
    "test.bestOf": "Chaque match se joue au meilleur des {count}.",
    "test.vs": "contre",
    "test.matches": "Matchs",
    "test.games": "Parties",
    "test.hoops": "Arceaux",
    "teamSummary.tests": "Rencontres",
    "teamSummary.matches": "Matchs",
    "teamSummary.games": "Parties",
    "teamSummary.hoops": "Arceaux",
    "teamSummary.wins": "Victoires",
    "teamSummary.losses": "Défaites",
    "teamSummary.draws": "Nuls",
    "teamSummary.for": "Pour",
    "teamSummary.against": "Contre",
    "teamSummary.net": "Différence",
    "tournament.players": "Joueurs",
    "search.label": "Recherche",
    "search.tournaments": "Tournois",
    "search.competitions": "Compétitions",
    "search.nothingFound": "Rien n'a été trouvé.",
    "players.search.label": "Rechercher des joueurs",
    "players.search.prompt": "Saisissez le nom d'un joueur pour le trouver.",
    "players.search.none": "Aucun joueur n'a été trouvé.",
    "search.more":
      "Seuls les {count} premiers sont affichés. Précisez davantage le nom pour affiner la recherche.",
    "websitePlayer.tournament": "Tournoi",
    // A test in a tournament's sections: its two teams' short names.
    "tournament.test": "{first} contre {second}",
    "tournament.notes": "Notes",
    "tournament.commentary": "Commentaires",
    "tournament.beat": "a battu",
    "tournament.drewWith": "a fait match nul avec",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 heure",
    "tournament.ago.hours": "{count} heures",
    "tournament.none": "Aucune partie n'a encore été jouée.",
    // A tournament's players' page, when it has none.
    "players.none": "Aucun joueur n'a encore été ajouté.",
    // A tournament's commentaries page, in the old site's words: how a
    // commentary is listed, and the link to start one.
    "commentaries.by": "par",
    "commentaries.start": "Commencer un nouveau commentaire",
    // The page that starts a commentary.
    "startCommentary.title": "Commencer un nouveau commentaire",
    "startCommentary.titleField": "Titre",
    "startCommentary.submit": "Commencer le commentaire",
    // "New" is said to a screen reader in place of the red asterisk that marks
    // a note or a commentary not read as it is now.
    "marks.new": "nouveau",
    // A tournament's Notes page, and a note's own page.
    "notes.none": "Les organisateurs n'ont pas encore écrit de notes.",
    "note.edited": "modifié",
    // A commentary's page: what it says when it has no comments, what it says
    // of a comment, and the box its writer writes the next one in.
    "commentary.none": "Aucun commentaire n'a encore été écrit.",
    "commentary.edited": "modifié",
    "commentary.edit": "Modifier",
    "commentary.delete": "Supprimer",
    "commentary.comment": "Commentaire",
    "commentary.add": "Ajouter un commentaire",
    "commentary.notSent":
      "Le commentaire n'a pas pu être envoyé. Rechargez la page pour voir s'il a été conservé.",
    // The page that changes a commentary's title.
    "changeCommentaryTitle.title": "Changer le titre",
    "changeCommentaryTitle.submit": "Enregistrer",
    // A comment's own page, where its writer edits it or deletes it, and the
    // page that asks before it is deleted.
    "editComment.title": "Modifier le commentaire",
    "editComment.save": "Enregistrer",
    "deleteComment.title": "Supprimer le commentaire",
    "deleteComment.question":
      "Supprimer ce commentaire ? Cette action est irréversible.",
    "deleteComment.confirm": "Supprimer le commentaire",
    "deleteComment.keep": "Le garder",
    // A player's page: its two parts, how a game is said as the player played
    // it, and what each part says when it has nothing in it.
    "player.games": "Parties",
    "player.competitions": "Compétitions",
    "player.beat": "a battu",
    "player.lostTo": "a perdu contre",
    "player.drewWith": "a fait match nul avec",
    "player.score": "{score} à {opponent}",
    "player.noGames": "Aucune partie n'a encore été jouée.",
    "player.noCompetitions": "Inscrit à aucune compétition pour le moment.",
    // A block's page: its grid's totals, what a score is for the row's player,
    // said aloud rather than shown, and a player who has withdrawn.
    "block.wins": "Victoires",
    "block.matches": "Matchs",
    "block.netGames": "Différence de parties",
    "block.games": "Parties",
    "block.netHoops": "Différence de arceaux",
    "block.won": "gagné",
    "block.lost": "perdu",
    "block.drawn": "nul",
    "block.withdrawn": "retiré",
    // A game withdrawn, which Spanish says otherwise than a player.
    "block.gameWithdrawn": "retirée",
    "block.losses": "Défaites",
    // The three views of a block, offered beneath its heading.
    "competition.views": "Vues",
    "competition.view.grid": "Grille",
    "competition.view.summary": "Récapitulatif",
    "competition.view.orderOfPlay": "Ordre de jeu",
    "blockSummary.ranking":
      "Classement selon la part de matchs gagnés, puis selon la différence de arceaux. Le règlement propre à un tournoi peut classer ses joueurs autrement.",
    "orderOfPlay.none": "Aucune partie n'a encore été jouée.",
    // A knockout's rounds, named as the old site named them, counted back from
    // the last, and a bye drawn in place of a player.
    "knockout.round.final": "Finale",
    "knockout.round.semis": "Demi-finales",
    "knockout.round.quarters": "Quarts de finale",
    "knockout.round.number": "Tour {number}",
    "knockout.bye": "Bye",
    // A Swiss's table: what each player has played and won, and their results.
    "swiss.games": "Parties",
    "swiss.wins": "Victoires",
    "swiss.winShare": "% de victoires",
    "swiss.results": "Résultats",
    // The arrows that scroll a knockout's grid across to its final, and back
    // to its first round.
    "knockout.onward": "Tours suivants",
    "knockout.back": "Tours précédents",
    // What every list of tournaments shares, on the home page and a year's:
    // the columns each is a table of, and what narrows them.
    "tournamentList.column.date": "Date",
    "tournamentList.column.name": "Nom",
    // A flag, which narrows the lists to its country, named by what it does.
    "tournamentList.onlyIn": "Seulement les tournois : {country}",
    "tournamentList.filter.country": "Pays",
    "tournamentList.filter.anyCountry": "Tous les pays",
    "tournamentList.filter.region": "Région",
    "tournamentList.filter.anyRegion": "Toutes les régions",
    "tournamentList.filter.noRegionsBefore":
      "Les tournois antérieurs à novembre 2026 n’ont pas de région.",
    "tournamentList.filter.sport": "Sport",
    "tournamentList.filter.anySport": "Tous les sports",
    "tournamentList.filter.submit": "Filtrer",
    // The years there are tournaments in, the secondary navigation of both.
    "years.label": "Années",
    // The drop-down list holding the years that do not fit as tabs.
    "years.earlier": "Années précédentes",

    // The admin's words. The admin draws them in the browser, so the server
    // says them into its page as it sends it (adminPage.ts): these, and the
    // tournament's refusals below.
    "admin.newerBuild.message":
      "Une version plus récente de ce site est disponible.",
    "admin.newerBuild.reload": "Recharger",
    "admin.title": "Administration",
    "admin.tournaments.new": "Nouveau tournoi",
    "admin.tournaments.none": "Aucun tournoi",
    "admin.tournaments.filter.none": "Aucun tournoi ne correspond",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.tournaments.archived": "Archivé",
    "admin.tournaments.manage": "Gérer",
    "admin.tournaments.edit": "Modifier",
    "admin.tournaments.archive": "Archiver",
    "admin.tournaments.restore": "Restaurer",
    "admin.tournaments.scores": "Scores",
    "admin.tournaments.players": "Joueurs",
    "admin.years.label": "Années",
    // What the drop-down list of years says while the year chosen is a tab.
    "admin.years.earlier": "Années précédentes",
    "admin.tournament.name": "Nom",
    "admin.tournament.starts": "Début",
    "admin.tournament.finishes": "Fin",
    "admin.tournament.format": "Format",
    "admin.tournament.sport": "Sport",
    "admin.tournament.country": "Pays",
    "admin.tournament.region": "Région",
    "admin.tournament.subtitle": "Sous-titre",
    "admin.rules.handicap": "Joué avec handicaps",
    "admin.rules.drawsAllowed": "Autorise les matchs nuls",
    "admin.tournament.levelTestsDrawn":
      "Les rencontres à égalité sont déclarées nulles",
    "admin.rules.worldRankings": "Compte pour les classements mondiaux",
    "admin.tournament.national": "Événement de niveau national",
    "admin.tournament.international": "Événement de niveau international",
    // A refusal with no words of its own, above the fields.
    "admin.tournament.otherwise": "Cela ne peut pas être accepté tel quel.",
    "admin.newTournament.title": "Nouveau tournoi",
    "admin.newTournament.submit": "Créer le tournoi",
    "admin.editTournament.title": "Modifier le tournoi",
    "admin.editTournament.submit": "Mettre à jour le tournoi",
    // Said in place of the form, for a refusal with no words of its own.
    "admin.editTournament.otherwise": "Ce tournoi ne peut pas être modifié.",
    // A tournament's page, and the tabs what there is to run is in.
    "admin.view.tabs": "Tournoi",
    "admin.view.players": "Joueurs",
    "admin.view.competitions": "Compétitions",
    "admin.view.managers": "Organisateurs",
    "admin.view.notes": "Notes",
    "admin.view.scorers": "Marqueurs",
    "admin.view.rankings": "Classements",
    "admin.rankings.file":
      "Les classements mondiaux utiliseront les résultats du tournoi grâce à cette fonction, et les organisateurs n'ont rien à faire.",
    "admin.rankings.download": "Télécharger les classements",
    "rankings.notAvailable": "Les classements ne sont pas disponibles",
    "rankings.notAvailable.sport":
      "Le sport de ce tournoi n'a pas de classements mondiaux, il n'y a donc aucun classement à envoyer.",
    "rankings.notAvailable.notCounted":
      "Aucune des compétitions de ce tournoi ne compte pour les classements mondiaux.",
    // Said in place of the tabs, for a refusal with no words of its own.
    "admin.view.otherwise": "Ce tournoi ne peut pas être géré d'ici.",
    // A competition's page, and the tabs what there is to run is in.
    "admin.competitionView.tabs": "Compétition",
    "admin.competitionView.players": "Joueurs",
    "admin.competitionView.scores": "Scores",
    // The section bar of a tournament's page and its competitions' pages.
    "admin.sections.label": "Le tournoi et ses compétitions",
    "admin.sections.tournament": "Tournoi",
    // The section bar of the administrator's pages.
    "admin.administrator.sections.label": "Les pages de l'administrateur",
    "admin.administrator.sections.tournaments": "Tournois",
    "admin.administrator.sections.accounts": "Comptes",
    "admin.administrator.sections.worldRankings": "Classements mondiaux",
    "admin.administrator.sections.importErrors": "Erreurs d'importation",
    "admin.administrator.sections.logs": "Journaux",
    "admin.administrator.sections.databaseStatus": "Accès à la base de données",
    "admin.databaseStatus.title": "Accès à la base de données",
    "admin.databaseStatus.on": "L'accès à la base de données est activé.",
    "admin.databaseStatus.off": "L'accès à la base de données est désactivé.",
    "admin.databaseStatus.expected":
      "Le site devrait être de retour dans {minutes} minutes.",
    "admin.databaseStatus.expectedOne":
      "Le site devrait être de retour dans 1 minute.",
    "admin.databaseStatus.longer": "Cela prend plus de temps que prévu.",
    "admin.databaseStatus.told": "Les lecteurs lisent : {words}",
    "admin.databaseStatus.toldUsual":
      "Les lecteurs lisent la phrase habituelle.",
    "admin.databaseStatus.minutes": "Minutes prévues",
    "admin.databaseStatus.words": "Texte pour les lecteurs",
    "admin.databaseStatus.turnOff": "Désactiver",
    "admin.databaseStatus.change": "Modifier",
    "admin.databaseStatus.turnOn": "Activer",
    "admin.databaseStatus.minutesNeeded": "Les minutes sont requises.",
    "admin.databaseStatus.otherwise": "Un problème est survenu sur le site.",
    "DatabaseAccess.MinutesNotWhole":
      "Les minutes doivent être un nombre entier.",
    "DatabaseAccess.MinutesOutOfRange":
      "Les minutes doivent être comprises entre 1 et 1440.",
    "DatabaseAccess.WordsTooLong":
      "Le texte ne doit pas dépasser 500 caractères.",
    "DatabaseAccess.NotOff":
      "L'accès à la base de données n'est pas désactivé.",
    "admin.administrator.title": "Administrateur",
    // The accounts page, a section for each role.
    "admin.accounts.title": "Comptes",
    "admin.roles.add": "Ajouter",
    "admin.roles.administrator.heading": "Administrateurs",
    "admin.roles.administrator.none": "Aucun autre administrateur",
    "admin.roles.administrator.removeTitle": "Retirer l'administrateur",
    "admin.roles.administrator.removeExplanation":
      "{name} ne sera plus administrateur de ce site.",
    "admin.roles.ac-world-ranking-officer.heading":
      "Responsables du classement mondial du croquet association",
    "admin.roles.ac-world-ranking-officer.none":
      "Aucun responsable du classement mondial du croquet association",
    "admin.roles.ac-world-ranking-officer.removeTitle":
      "Retirer le responsable du classement mondial du croquet association",
    "admin.roles.ac-world-ranking-officer.removeExplanation":
      "{name} ne sera plus responsable du classement mondial du croquet association.",
    "admin.roles.gc-world-ranking-officer.heading":
      "Responsables du classement mondial du croquet golf",
    "admin.roles.gc-world-ranking-officer.none":
      "Aucun responsable du classement mondial du croquet golf",
    "admin.roles.gc-world-ranking-officer.removeTitle":
      "Retirer le responsable du classement mondial du croquet golf",
    "admin.roles.gc-world-ranking-officer.removeExplanation":
      "{name} ne sera plus responsable du classement mondial du croquet golf.",
    // For a refusal with no words of its own, beneath the field or in place
    // of the list. Not about the address, since it may be the session that
    // ended or the site that failed.
    // The page where the world ranking players are imported, and its log, a
    // line for each thing the import says. A count is said after a colon,
    // so that one player and many are said the same way.
    "admin.worldRankings.title": "Importer les joueurs du classement mondial",
    "admin.worldRankings.import": "Importer",
    "admin.worldRankings.log": "Déroulement de l'importation",
    "admin.worldRankings.ac.reading":
      "Lecture de la liste du croquet association",
    "admin.worldRankings.ac.read":
      "Joueurs de croquet association lus : {players}",
    "admin.worldRankings.ac.kept":
      "Joueurs de croquet association conservés : {players}",
    "admin.worldRankings.ac.refused":
      "La liste du croquet association n'a pas pu être lue, ses joueurs ont donc été laissés tels quels.",
    "admin.worldRankings.gc.reading": "Lecture de la liste du croquet golf",
    "admin.worldRankings.gc.read": "Joueurs de croquet golf lus : {players}",
    "admin.worldRankings.gc.kept":
      "Joueurs de croquet golf conservés : {players}",
    "admin.worldRankings.gc.refused":
      "La liste du croquet golf n'a pas pu être lue, ses joueurs ont donc été laissés tels quels.",
    "admin.worldRankings.finished": "Terminé",
    "admin.worldRankings.failed": "L'importation ne s'est pas terminée.",
    // For a refusal with no words of its own, as a failure of the site's.
    "admin.worldRankings.otherwise": "Un problème est survenu sur le site.",
    "WorldRankingLists.Unreachable":
      "Le site des classements mondiaux est inaccessible.",
    "WorldRankingLists.Unreadable":
      "La liste n'est pas présentée comme les classements mondiaux présentent la leur : une de ses lignes n'a pas pu être lue, elle ne contient personne, ou elle n'est pas écrite en UTF-8.",
    // The documents the import from the old sites refused, and the page of one.
    "admin.importErrors.title": "Erreurs d'importation",
    "admin.importErrors.none": "Aucune erreur d'importation",
    "admin.importErrors.otherwise": "Un problème est survenu sur le site.",
    "admin.logs.title": "Journaux",
    "admin.logs.severity": "Gravité",
    "admin.logs.text": "Rechercher",
    "admin.logs.show": "Afficher",
    "admin.logs.prune": "Purger",
    "admin.logs.pruneAsk":
      "Supprimer le journal antérieur à la dernière heure ? Rien ne permet de le récupérer.",
    "admin.logs.removed": "{count} entrées ont été supprimées",
    "admin.logs.none": "Aucune entrée de journal",
    "admin.logs.otherwise": "Un problème est survenu sur le site.",
    "admin.hover.logs.show": "Afficher les entrées correspondantes",
    "admin.hover.logs.prune":
      "Supprimer le journal antérieur à la dernière heure",
    "admin.hover.logs.pruneAgree":
      "Supprimer le journal antérieur à la dernière heure",
    "admin.importError.title": "Erreur d'importation",
    "admin.importError.documentId": "Identifiant du document",
    "admin.importError.tournament": "Tournoi",
    "admin.importError.competition": "Compétition",
    "admin.importError.newSite": "Nouveau site",
    "admin.importError.oldSite": "Ancien site",
    "ImportErrorKept.NotFound":
      "L'importation n'a conservé aucune erreur pour ce document.",
    "admin.competitionView.otherwise":
      "Cette compétition ne peut pas être gérée d'ici.",
    // The Competitions tab: each competition's kind, what can be done with it,
    // and the heading the archived ones are under.
    "admin.competitions.block": "Poule",
    "admin.competitions.knockout": "Élimination directe",
    "admin.competitions.swiss": "Système suisse",
    "admin.competitions.view": "Voir",
    "admin.competitions.edit": "Modifier",
    "admin.competitions.up": "Monter",
    "admin.competitions.down": "Descendre",
    "admin.competitions.archive": "Archiver",
    "admin.competitions.restore": "Restaurer",
    "admin.competitions.archived": "Compétitions archivées",
    "admin.competitions.none": "Aucune compétition",
    "admin.competitions.add": "Ajouter une compétition",
    // The competition dialog.
    "admin.competition.addTitle": "Ajouter une compétition",
    "admin.competition.editTitle": "Modifier la compétition",
    "admin.competition.name": "Nom",
    "admin.competition.kind": "Type",
    "admin.competition.bestOf": "Au meilleur des",
    "admin.competition.rounds": "Tours",
    "admin.competition.places": "Places",
    "admin.competition.round": "Tour {number}",
    "admin.competition.bestOfs": "Meilleur des",
    "admin.competition.quarters": "Quarts",
    "admin.competition.semis": "Demi-finales",
    "admin.competition.final": "Finale",
    "admin.competition.add": "Ajouter",
    "admin.competition.save": "Enregistrer",
    "admin.competition.added": "{name} a été ajoutée.",
    // Above the fields, for a refusal with no words of its own.
    "admin.competition.otherwise":
      "Cette compétition ne peut pas être conservée telle quelle.",
    "CompetitionName.Missing": "Saisissez un nom.",
    "CompetitionName.TooLong": "Un nom ne peut pas dépasser 254 caractères.",
    "CompetitionName.NoLetterOrDigit":
      "Un nom doit contenir une lettre ou un chiffre.",
    "Tournament.KnockoutPlayerHasGames":
      "Des joueurs de ce tableau ont des parties, ses places ne peuvent donc pas changer.",
    "Tournament.KnockoutRoundHasDecidedMatch":
      "Un tour comportant un match décidé ne peut pas être ramené à un meilleur des moins de parties.",
    "Tournament.KnockoutLaterRoundHasGames":
      "Un tour ne peut pas être modifié dès qu'une partie a été jouée dans un tour suivant.",
    "Tournament.CompetitionNameTaken":
      "Une autre compétition de ce tournoi porte déjà ce nom.",
    "BestOf.NotWhole": "Saisissez un nombre entier de parties.",
    "BestOf.TooSmall":
      "Un match doit se jouer au meilleur d'au moins 1 partie.",
    "Rounds.NotWhole": "Saisissez un nombre entier de tours.",
    "Rounds.TooSmall": "Une poule doit se jouer en au moins 1 tour.",
    "KnockoutDraw.EvenBestOf":
      "Un match d'élimination directe doit avoir un vainqueur, il se joue donc au meilleur d'un nombre impair de parties.",
    // Every modal dialog's way out, since the page beneath cannot be reached.
    "admin.hover.tournaments.new": "Créer un nouveau tournoi",
    "admin.hover.tournaments.manage":
      "Gérer les joueurs, les équipes, les compétitions et les scores de ce tournoi",
    "admin.hover.tournaments.edit": "Modifier les informations de ce tournoi",
    "admin.hover.tournaments.scores": "Saisir les scores de ce tournoi",
    "admin.hover.tournaments.players": "Gérer les joueurs de ce tournoi",
    "admin.hover.competitions.view":
      "Ouvrir cette compétition pour voir et saisir ses joueurs et ses scores",
    "admin.hover.tests.view":
      "Ouvrir cette rencontre pour voir et saisir ses scores",
    "admin.hover.teams.view":
      "Ouvrir cette équipe pour voir et gérer ses joueurs",
    "admin.hover.dialog.player.add": "Ajouter ce joueur au tournoi",
    "admin.hover.dialog.player.save":
      "Conserver les modifications de ce joueur",
    "admin.hover.dialog.team.add": "Ajouter cette équipe au tournoi",
    "admin.hover.dialog.team.save":
      "Conserver les modifications de cette équipe",
    "admin.hover.dialog.test.add": "Ajouter cette rencontre au tournoi",
    "admin.hover.dialog.test.save":
      "Conserver les modifications de cette rencontre",
    "admin.hover.dialog.competition.add":
      "Ajouter cette compétition au tournoi",
    "admin.hover.dialog.competition.save":
      "Conserver les modifications de cette compétition",
    "admin.hover.dialog.score.add": "Ajouter ce score à la compétition",
    "admin.hover.dialog.score.save": "Conserver la correction de ce score",
    "admin.hover.dialog.carryForward.save":
      "Reporter les résultats de ce joueur",
    "admin.hover.dialog.tournament.new": "Créer ce tournoi",
    "admin.hover.dialog.tournament.edit":
      "Conserver les modifications de ce tournoi",
    "admin.hover.modal.cancel": "Fermer sans rien conserver",
    "admin.hover.modal.ok": "Fermer ce message",
    "admin.hover.tab": "Afficher l'onglet {name}",
    "admin.hover.tournaments.archive":
      "Archiver ce tournoi ; il pourra être restauré",
    "admin.hover.tournaments.restore": "Ramener ce tournoi archivé",
    "admin.hover.players.add": "Ajouter un joueur à ce tournoi",
    "admin.hover.players.edit": "Modifier les informations de ce joueur",
    "admin.hover.players.up": "Monter ce joueur dans la liste",
    "admin.hover.players.down": "Descendre ce joueur dans la liste",
    "admin.hover.players.archive":
      "Archiver ce joueur ; il pourra être restauré",
    "admin.hover.players.restore": "Ramener ce joueur archivé",
    "admin.hover.teams.add": "Ajouter une équipe à ce tournoi",
    "admin.hover.teams.edit": "Modifier les informations de cette équipe",
    "admin.hover.teams.up": "Monter cette équipe dans la liste",
    "admin.hover.teams.down": "Descendre cette équipe dans la liste",
    "admin.hover.teams.archive":
      "Archiver cette équipe ; elle pourra être restaurée",
    "admin.hover.teams.restore": "Ramener cette équipe archivée",
    "admin.hover.competitions.add": "Ajouter une compétition à ce tournoi",
    "admin.hover.competitions.edit":
      "Modifier les informations de cette compétition",
    "admin.hover.competitions.up": "Monter cette compétition dans la liste",
    "admin.hover.competitions.down":
      "Descendre cette compétition dans la liste",
    "admin.hover.competitions.archive":
      "Archiver cette compétition ; elle pourra être restaurée",
    "admin.hover.competitions.restore": "Ramener cette compétition archivée",
    "admin.hover.tests.add": "Ajouter une rencontre entre deux équipes",
    "admin.hover.tests.edit": "Modifier les informations de cette rencontre",
    "admin.hover.tests.up": "Monter cette rencontre dans la liste",
    "admin.hover.tests.down": "Descendre cette rencontre dans la liste",
    "admin.hover.tests.archive":
      "Archiver cette rencontre ; elle pourra être restaurée",
    "admin.hover.tests.restore": "Ramener cette rencontre archivée",
    "admin.hover.tests.toTeams":
      "Aller à l'onglet Équipes pour ajouter les équipes dont une rencontre a besoin",
    "admin.hover.scores.add":
      "Ajouter le score d'une partie à cette compétition",
    "admin.hover.scores.edit": "Corriger ce score",
    "admin.hover.scores.archive":
      "Archiver ce score pour qu'il ne compte plus ; il pourra être restauré",
    "admin.hover.scores.restore":
      "Ramener ce score archivé, pour qu'il compte de nouveau",
    "admin.hover.scores.withdraw":
      "Garder ce score dans la liste mais ne plus le compter",
    "admin.hover.scores.unwithdraw": "Faire compter de nouveau ce score retiré",
    "admin.hover.scores.up": "Placer ce score plus haut dans la liste",
    "admin.hover.scores.down": "Placer ce score plus bas dans la liste",
    "admin.hover.competitionPlayers.add":
      "Mettre le joueur choisi dans cette compétition",
    "admin.hover.competitionPlayers.up": "Monter ce joueur dans la liste",
    "admin.hover.competitionPlayers.down": "Descendre ce joueur dans la liste",
    "admin.hover.competitionPlayers.remove":
      "Sortir ce joueur de la compétition",
    "admin.hover.competitionPlayers.withdraw":
      "Retirer ce joueur de la compétition",
    "admin.hover.competitionPlayers.unwithdraw":
      "Remettre ce joueur retiré dans la compétition",
    "admin.hover.competitionPlayers.carryForward":
      "Reporter les résultats de ce joueur depuis une autre compétition",
    "admin.hover.notes.add": "Écrire une nouvelle note pour ce tournoi",
    "admin.hover.notes.edit": "Modifier cette note",
    "admin.hover.notes.delete": "Supprimer cette note",
    "admin.hover.note.add": "Conserver cette note et l'ajouter au tournoi",
    "admin.hover.note.save": "Conserver les modifications de cette note",
    "admin.hover.people.add": "Donner le rôle à cette personne",
    "admin.hover.people.remove": "Retirer le rôle à cette personne",
    "admin.hover.worldRankings.import":
      "Récupérer les classements mondiaux et ajouter leurs joueurs",
    "admin.modal.cancel": "Annuler",
    // The one button of a modal dialog that only tells the reader something.
    "admin.modal.ok": "OK",
    // The Managers and Scorers tabs, each of which makes somebody one by their
    // email address and takes one off.
    "admin.people.emailAddress": "Adresse e-mail",
    "admin.people.remove": "Retirer",
    "admin.people.otherwise": "Cela n'a pas pu être fait.",
    // Beside the reader's own name among the managers.
    "admin.managers.you": "Vous",
    "admin.managers.add": "Ajouter un organisateur",
    "admin.managers.email": "Écrire aux organisateurs",
    // Never said, since a tournament always has a manager, but a list says
    // what it says when it is empty.
    "admin.managers.none": "Aucun organisateur",
    "admin.managers.removeTitle": "Retirer l'organisateur",
    "admin.managers.removeExplanation":
      "{name} ne pourra plus gérer ce tournoi.",
    "admin.managers.removeYourself.explanation":
      "Vous ne pourrez plus gérer ce tournoi, et personne ici ne peut annuler cela pour vous. Un autre organisateur peut vous redonner ce rôle.",
    "admin.managers.otherwise":
      "Cette adresse ne peut pas devenir organisateur.",
    // The Players tab.
    // A competition's Players tab.
    "admin.competitionPlayers.add": "Ajouter un joueur",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "Ce joueur ne peut pas être ajouté.",
    "admin.competitionPlayers.choose": "Joueur à ajouter",
    "admin.competitionPlayers.nobody": "Choisissez un joueur",
    // Offered in a knockout's drop-down, and what a bye is listed as.
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all": "Tous les joueurs sont dans la compétition",
    "admin.competitionPlayers.none": "Aucun joueur",
    "admin.competitionPlayers.up": "Monter",
    "admin.competitionPlayers.down": "Descendre",
    "admin.competitionPlayers.remove": "Retirer",
    "admin.competitionPlayers.withdraw": "Retirer de la compétition",
    "admin.competitionPlayers.unwithdraw": "Réintégrer",
    "admin.competitionPlayers.withdrawn": "Joueurs retirés",
    "admin.competitionPlayers.removeTitle": "Retirer le joueur",
    "admin.competitionPlayers.removeQuestion":
      "{name} sera sorti de la compétition. Cette action est irréversible.",
    "admin.competitionPlayers.withdrawTitle":
      "Retirer le joueur de la compétition",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} ne jouera plus dans la compétition, et les parties qu'il n'a pas jouées seront décidées sans lui.",
    "admin.competitionPlayers.carryForward": "Reporter",
    // The carry forward dialog, over a competition's Players tab.
    "admin.carryForward.title": "Report - {name}",
    "admin.carryForward.save": "Enregistrer",
    // Above the counts, for a refusal with no words of its own.
    "admin.carryForward.otherwise": "Ce report ne peut pas être conservé.",
    "admin.carryForward.matchWins": "Matchs gagnés",
    "admin.carryForward.matchLosses": "Matchs perdus",
    "admin.carryForward.gameWins": "Parties gagnées",
    "admin.carryForward.gameLosses": "Parties perdues",
    "admin.carryForward.hoopsFor": "Arceaux pour",
    "admin.carryForward.hoopsAgainst": "Arceaux contre",
    "CarryForward.MatchWinsNotWhole":
      "Saisissez un nombre entier de matchs gagnés.",
    "CarryForward.MatchWinsBelowZero": "Saisissez 0 match gagné ou plus.",
    "CarryForward.MatchLossesNotWhole":
      "Saisissez un nombre entier de matchs perdus.",
    "CarryForward.MatchLossesBelowZero": "Saisissez 0 match perdu ou plus.",
    "CarryForward.GameWinsNotWhole":
      "Saisissez un nombre entier de parties gagnées.",
    "CarryForward.GameWinsBelowZero": "Saisissez 0 partie gagnée ou plus.",
    "CarryForward.GameLossesNotWhole":
      "Saisissez un nombre entier de parties perdues.",
    "CarryForward.GameLossesBelowZero": "Saisissez 0 partie perdue ou plus.",
    "CarryForward.HoopsForNotWhole":
      "Saisissez un nombre entier de arceaux pour.",
    "CarryForward.HoopsForBelowZero": "Saisissez 0 arceau pour ou plus.",
    "CarryForward.HoopsAgainstNotWhole":
      "Saisissez un nombre entier de arceaux contre.",
    "CarryForward.HoopsAgainstBelowZero": "Saisissez 0 arceau contre ou plus.",
    // A competition's Scores tab and the score dialog.
    "admin.scores.add": "Ajouter un score",
    "admin.scores.none": "Aucun score",
    "admin.scores.edit": "Modifier",
    "admin.scores.drawNotFilledTitle": "Tableau incomplet",
    "admin.scores.archive": "Archiver",
    "admin.scores.up": "Monter",
    "admin.scores.down": "Descendre",
    "admin.scores.restore": "Restaurer",
    "admin.scores.archived": "Scores archivés",
    "admin.scores.archivedSaid": "Archivé",
    "admin.scores.withdraw": "Retirer",
    "admin.scores.unwithdraw": "Réintégrer",
    "admin.scores.withdrawnSaid": "Retiré",
    // Above the list, for a refusal with no words of its own.
    "admin.scores.otherwise": "Cela n'a pas pu être fait.",
    "admin.score.title": "Ajouter un score",
    "admin.score.add": "Ajouter la partie",
    "admin.score.winner": "Vainqueur",
    "admin.score.winnerScore": "Score du vainqueur",
    "admin.score.loser": "Perdant",
    "admin.score.loserScore": "Score du perdant",
    "admin.score.beat": "a battu",
    "admin.score.added":
      "La partie gagnée par {winner} contre {loser} a été ajoutée.",
    "admin.score.otherwise": "La partie n'a pas pu être ajoutée.",
    "admin.score.correctTitle": "Modifier le score",
    "admin.score.save": "Enregistrer",
    "admin.score.notCorrected": "Le score n'a pas pu être corrigé.",
    "Game.WinnerMissing": "Choisissez le vainqueur.",
    "Game.WinnerScoreMissing": "Saisissez le score du vainqueur.",
    "Game.LoserMissing": "Choisissez le perdant.",
    "Game.LoserScoreMissing": "Saisissez le score du perdant.",
    "Score.NoPoints": "Un score commence par son nombre de points.",
    "Game.SamePlayer": "Personne ne joue contre soi-même.",
    "Game.WinnerNotAhead":
      "Le score du vainqueur doit être supérieur à celui du perdant, ou marqué comme gagné.",
    "Game.LoserMarked":
      "Le score du perdant ne peut pas être marqué comme gagné.",
    "Game.ResultChanged":
      "Une correction conserve le résultat : une partie gagnée reste gagnée, et une partie nulle reste nulle.",
    "Competition.MatchDecided": "Leur match est déjà décidé.",
    "Competition.DrawFull":
      "Impossible d'ajouter le joueur, car le tableau d'élimination est complet.",
    "Competition.DrawNotFilled":
      "Aucun score ne peut être ajouté tant que chaque place du tableau d'élimination n'est pas occupée par un joueur ou un bye.",
    "Competition.ByeOutsideKnockout":
      "Seul un tableau d'élimination peut avoir un bye.",
    "Competition.NotDrawnToMeet":
      "Ces joueurs ne sont pas actuellement appariés dans le tableau d'élimination.",
    "Competition.WinnerHasPlayedOn":
      "Le vainqueur de ce match a déjà joué sa partie suivante, le nom du vainqueur ne peut donc plus changer.",
    "CompetitionPlayer.Withdrawn": "Un joueur retiré ne joue plus.",
    "admin.players.add": "Ajouter un joueur",
    "admin.players.none": "Aucun joueur",
    "admin.players.edit": "Modifier",
    "admin.players.archive": "Archiver",
    "admin.players.restore": "Restaurer",
    "admin.players.up": "Monter",
    "admin.players.down": "Descendre",
    // Asked before archiving a player who is in competitions, since archiving
    // removes them from each, and restoring them does not put them back.
    "admin.players.archiveTitle": "Archiver le joueur",
    "admin.players.archiveQuestion": "{name} sera retiré de ces compétitions :",
    "admin.players.archive.explanation":
      "Le restaurer ne le remettra pas dans ces compétitions.",
    "admin.players.archived": "Joueurs archivés",
    // Said to a screen reader, since a line through a name is not read out.
    "admin.players.archivedSaid": "Archivé",
    // The player dialog.
    "admin.player.addTitle": "Ajouter un joueur",
    "admin.player.editTitle": "Modifier le joueur",
    "admin.player.name": "Nom",
    "admin.player.representing": "Représente",
    "admin.player.worldRankingName": "Nom du joueur dans le classement mondial",
    // Beside the world ranking name: whether the world rankings know it.
    "admin.player.worldRankingKnown":
      "Les classements mondiaux connaissent ce nom.",
    "admin.player.worldRankingQuestioned":
      "Les classements mondiaux n'ont aucun joueur de ce nom. Il est peut-être mal orthographié, ou le joueur est peut-être nouveau dans les classements.",
    "admin.player.flag": "Drapeau",
    "admin.player.add": "Ajouter",
    "admin.player.save": "Enregistrer",
    "admin.player.added": "{name} a été ajouté.",
    // Above the fields, for a refusal with no words of its own.
    "admin.player.otherwise": "Ce joueur ne peut pas être conservé tel quel.",
    "Tournament.PlayerNameTaken":
      "Un autre joueur de ce tournoi porte déjà ce nom.",
    "TournamentPlayer.NoSuchFlag": "Choisissez l'un des drapeaux proposés.",
    "TournamentPlayer.NamedBye": "Un joueur ne peut pas s'appeler Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Un nom doit contenir une lettre ou un chiffre.",
    // The dialog over the player dialog when a player is named as a bye.
    "admin.player.byesTitle": "Les byes n'ont pas besoin d'être ajoutés",
    "admin.player.byes":
      "Un bye n'est pas l'un des joueurs du tournoi. Un tableau d'élimination propose Bye chaque fois que ses joueurs sont ajoutés, autant de fois que son tirage l'exige.",
    // A tournament played by teams (view.feature): its Teams and Tests tabs,
    // a team's page, and their dialogs.
    "admin.view.teams": "Équipes",
    "admin.view.tests": "Rencontres",
    "admin.teams.add": "Ajouter une équipe",
    "admin.teams.none": "Aucune équipe",
    "admin.teams.edit": "Modifier",
    "admin.teams.view": "Voir",
    "admin.teams.archive": "Archiver",
    "admin.teams.restore": "Restaurer",
    "admin.teams.up": "Monter",
    "admin.teams.down": "Descendre",
    "admin.teams.archived": "Équipes archivées",
    "admin.teams.archivedSaid": "Archivée",
    "admin.team.addTitle": "Ajouter une équipe",
    "admin.team.editTitle": "Modifier l'équipe",
    "admin.team.name": "Nom",
    "admin.team.shortName": "Nom court",
    "admin.team.shortName.explanation":
      "Sous quel nom les rencontres de l'équipe sont désignées, comme AUS v ENG.",
    "admin.team.flag": "Drapeau",
    "admin.team.add": "Ajouter",
    "admin.team.save": "Enregistrer",
    "admin.team.added": "{name} a été ajoutée.",
    // Above the fields, for a refusal with no words of its own.
    "admin.team.otherwise":
      "Cette équipe ne peut pas être conservée telle quelle.",
    "admin.teamView.otherwise":
      "Cette équipe ne peut pas être consultée d'ici.",
    "admin.teamView.players": "Joueurs",
    "TeamName.Missing": "Indiquez le nom de l'équipe.",
    "TeamName.TooLong": "Ce nom est trop long.",
    "admin.notes.add": "Ajouter une note",
    "admin.notes.none": "Aucune note",
    "admin.notes.edit": "Modifier",
    "admin.notes.delete": "Supprimer",
    // Asked before deleting a note, since a note deleted is gone for good.
    "admin.notes.deleteTitle": "Supprimer la note",
    "admin.notes.deleteQuestion": "Supprimer la note « {title} » ?",
    "admin.notes.delete.explanation":
      "Une note supprimée l'est définitivement et ne peut pas être récupérée.",
    // Above the list, for a refusal with no words of its own.
    "admin.notes.otherwise": "Cela n'a pas pu être fait.",
    // The note dialog, its description's tabs and the toolbar above its box.
    "admin.note.addTitle": "Ajouter une note",
    "admin.note.editTitle": "Modifier la note",
    "admin.note.title": "Titre",
    "admin.note.description": "Description",
    "admin.note.write": "Écrire",
    "admin.note.preview": "Aperçu",
    "admin.note.toolbar": "Mise en forme",
    "admin.note.tool.heading": "Titre",
    "admin.note.tool.bold": "Gras",
    "admin.note.tool.italic": "Italique",
    "admin.note.tool.quote": "Citation",
    "admin.note.tool.code": "Code",
    "admin.note.tool.link": "Lien",
    "admin.note.tool.numberedList": "Liste numérotée",
    "admin.note.tool.bulletedList": "Liste à puces",
    "admin.note.tool.taskList": "Liste de tâches",
    "admin.note.add": "Ajouter",
    "admin.note.save": "Enregistrer",
    // Above the fields, for a refusal with no words of its own.
    "admin.note.otherwise":
      "Cette note ne peut pas être conservée telle quelle.",
    "ManagerNoteTitle.Missing": "Donnez un titre à la note.",
    "ManagerNoteTitle.TooLong": "Ce titre est trop long.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Un titre doit contenir une lettre ou un chiffre.",
    "ManagerNoteDescription.TooLong": "Cette description est trop longue.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Cette note n'existe plus. Un autre organisateur l'a peut-être supprimée.",
    "EditManagerNote.NoSuchManagerNote":
      "Cette note n'existe plus. Un autre organisateur l'a peut-être supprimée.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Cette note n'existe plus. Un autre organisateur l'a peut-être supprimée.",
    "ManagerNote.Deleted":
      "Cette note a été supprimée. Un autre organisateur l'a peut-être supprimée.",
    "CommentaryTitle.Missing": "Donnez un titre au commentaire.",
    "CommentaryTitle.TooLong": "Ce titre est trop long.",
    "CommentaryTitle.NoLetterOrDigit":
      "Un titre doit contenir une lettre ou un chiffre.",
    "Commentary.TitleTaken": "Un autre commentaire porte déjà ce titre.",
    "CommentText.Missing": "Écrivez quelque chose dans le commentaire.",
    "CommentText.TooLong": "Ce commentaire est trop long.",
    "TeamShortName.Missing": "Donnez un nom court à l'équipe.",
    "TeamShortName.TooLong": "Un nom court ne peut pas dépasser 10 caractères.",
    "TeamShortName.NoLetterOrDigit":
      "Un nom court doit contenir une lettre ou un chiffre.",
    "Team.ShortNameLongerThanName":
      "Un nom court ne peut pas être plus long que le nom de l'équipe.",
    "Team.NoSuchFlag": "Choisissez l'un des drapeaux proposés.",
    "Team.Archived":
      "Cette équipe est archivée, elle doit d'abord être restaurée.",
    "Team.InATest":
      "Cette équipe joue une rencontre, elle ne peut pas être archivée.",
    "Team.PlayerNameTaken":
      "Un autre joueur de cette équipe porte déjà ce nom.",
    "TeamPlayer.NamedBye": "Un joueur ne peut pas s'appeler Bye.",
    "TeamPlayer.Archived":
      "Ce joueur est archivé, il doit d'abord être restauré.",
    "TeamPlayer.HasGames": "Ce joueur a joué, il ne peut pas être archivé.",
    "Tournament.TeamNameTaken":
      "Une autre équipe de ce tournoi porte déjà ce nom.",
    "Tournament.TeamShortNameTaken":
      "Une autre équipe de ce tournoi porte déjà ce nom court.",
    "Tournament.NoSuchTeam": "Ce tournoi n'a aucune équipe à cette adresse.",
    "Tournament.TeamArchived":
      "Cette équipe est archivée, elle ne peut être restaurée que depuis l'onglet Équipes.",
    "admin.tests.add": "Ajouter une rencontre",
    "admin.tests.none": "Aucune rencontre",
    "admin.tests.edit": "Modifier",
    "admin.tests.view": "Voir",
    "admin.tests.archive": "Archiver",
    "admin.tests.restore": "Restaurer",
    "admin.tests.up": "Monter",
    "admin.tests.down": "Descendre",
    "admin.tests.archived": "Rencontres archivées",
    "admin.tests.twoTeamsNeeded":
      "Une rencontre oppose deux équipes, il faut donc d'abord deux équipes.",
    "admin.tests.toTeams": "Aller aux équipes",
    "admin.tests.matches.one": "{count} match",
    "admin.tests.matches.other": "{count} matchs",
    "admin.tests.bestOf": "au meilleur des {games}",
    // Beside the list, for a refusal with no words of its own.
    "admin.tests.otherwise": "Cela n'a pas pu être fait.",
    "admin.test.addTitle": "Ajouter une rencontre",
    "admin.test.editTitle": "Modifier la rencontre",
    "admin.test.firstTeam": "Équipe A",
    "admin.test.secondTeam": "Équipe B",
    "admin.test.versus": "v",
    "admin.test.starts": "Début",
    "admin.test.finishes": "Fin",
    "admin.test.expectedMatches": "Matchs prévus",
    "admin.test.bestOf": "Au meilleur des",
    "admin.test.group": "Groupe",
    "admin.test.add": "Ajouter",
    "admin.test.save": "Enregistrer",
    "admin.test.added": "{name} a été ajoutée.",
    "admin.test.otherwise":
      "Cette rencontre ne peut pas être conservée telle quelle.",
    "admin.testView.otherwise":
      "Cette rencontre ne peut pas être consultée d'ici.",
    "AddTest.FirstTeamMissing": "Choisissez la première équipe.",
    "AddTest.SecondTeamMissing": "Choisissez la deuxième équipe.",
    "UpdateTest.FirstTeamMissing": "Choisissez la première équipe.",
    "UpdateTest.SecondTeamMissing": "Choisissez la deuxième équipe.",
    "ExpectedMatches.NotWhole": "Saisissez un nombre entier de matchs.",
    "ExpectedMatches.TooSmall":
      "Une rencontre doit comporter au moins 1 match prévu.",
    "TestGroup.TooLong": "Ce groupe est trop long.",
    "Tournament.TestAgainstItself":
      "Une équipe ne joue pas une rencontre contre elle-même.",
    "Tournament.TestFinishesBeforeStarts":
      "Une rencontre ne peut pas finir avant d'avoir commencé.",
    "Tournament.TestStartsBeforeTournament":
      "Une rencontre ne peut pas commencer avant son tournoi.",
    "Tournament.TestFinishesAfterTournament":
      "Une rencontre ne peut pas finir après son tournoi.",
    "Tournament.TestHasGamesInUse":
      "Cette rencontre a des parties, elle ne peut donc pas être archivée tant qu'elles ne le sont pas.",
    "Tournament.TestHasGames":
      "Cette rencontre a désormais des parties, ses équipes ne peuvent donc plus être changées.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Plus de matchs que cela ont déjà commencé.",
    "Tournament.BestOfBelowGamesPlayed":
      "Deux joueurs ont déjà joué plus de parties que cela.",
    "Competition.ExpectedMatchesReached":
      "Cette rencontre a commencé autant de matchs qu'elle devrait en avoir.",
    "Competition.SameTeam":
      "Deux joueurs de la même équipe ne s'affrontent pas.",
    "AddManager.NoSuchAccount":
      "Cette adresse n'a aucun compte pouvant devenir organisateur.",
    "admin.scorers.add": "Ajouter un marqueur",
    "admin.scorers.none": "Aucun marqueur",
    "admin.scorers.removeTitle": "Retirer le marqueur",
    "admin.scorers.removeExplanation":
      "{name} ne pourra plus saisir les scores de ce tournoi.",
    // Beneath the field, for a refusal with no words of its own.
    "admin.scorers.otherwise": "Cette adresse ne peut pas devenir marqueur.",
    "AddScorer.NoSuchAccount":
      "Cette adresse n'a aucun compte pouvant devenir marqueur.",
    // Giving, taking and listing roles, which only an administrator can do.
    "Account.NotAnAdministrator": "Seul un administrateur peut faire cela.",
    "AddRole.NoSuchAccount":
      "Cette adresse n'a aucun compte pouvant recevoir le rôle.",
    "AddRole.NoSuchRole": "Ce rôle n'existe pas.",
    "RemoveRole.NoSuchAccount": "Ce compte n'existe pas.",
    "RemoveRole.NoSuchRole": "Ce rôle n'existe pas.",
    "RemoveRole.Yourself":
      "Vous ne pouvez pas vous retirer le rôle d'administrateur.",
    "AccountsWithRole.NoSuchRole": "Ce rôle n'existe pas.",
    "Tournament.AlreadyAManager":
      "Ce compte gère déjà le tournoi, et peut faire tout ce que peut faire un marqueur.",

    // A tournament's refusals, keyed by their codes as every rule broken is.
    // Beneath the field each is about, or in place of the form where the page
    // itself is refused.
    "TournamentName.Missing": "Indiquez le nom du tournoi.",
    "TournamentName.TooShort": "Ce nom est trop court.",
    "TournamentName.TooLong": "Ce nom est trop long.",
    "TournamentName.AllLowerCase":
      "Un nom ne peut pas être entièrement en minuscules.",
    "TournamentName.AllCapitals":
      "Un nom ne peut pas être entièrement en majuscules.",
    "TournamentName.NoLetterOrDigit":
      "Un nom doit contenir une lettre ou un chiffre.",
    "ReadOnlyDate.Unreadable": "Indiquez le jour.",
    "Tournament.FinishesBeforeStarts":
      "Un tournoi ne peut pas finir avant d'avoir commencé.",
    "Tournament.StartsAfterNextYear":
      "Un tournoi ne peut pas commencer après l'année prochaine.",
    "Tournament.FinishesAfterNextYear":
      "Un tournoi ne peut pas finir après l'année prochaine.",
    "CreateTournament.NoSuchCountry": "Choisissez le pays.",
    "TournamentSubtitle.TooLong":
      "Un sous-titre ne peut pas dépasser 2000 caractères.",
    "Tournament.NotAManager":
      "Seul un organisateur de ce tournoi peut le modifier.",
    "Tournament.NotAManagerOrScorer":
      "Seul un organisateur ou un marqueur de ce tournoi peut le consulter.",
    "Tournament.Archived":
      "Ce tournoi est archivé, il doit être restauré avant de pouvoir être modifié.",
    "UpdateTournament.NoSuchTournament":
      "Il n'y a aucun tournoi à cette adresse.",

    // What a tournament is played in and where, by code, as the API offers
    // them to the admin's form. English takes the names the domain knows them
    // by, rather than writing each out a second time to drift from it.
    "sport.ac": "Croquet association",
    "sport.gc": "Croquet golf",
    "sport.a6w": "Croquet américain à 6 arceaux",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Standard",
    "format.teams": "Équipes",
    "format.eire-cup": "Coupe d'Irlande",
    "format.interstate-shield": "Bouclier interétatique",
    "format.gc-world-team-championship":
      "Championnat du monde par équipes de croquet golf",
    "country.ad": "Andorre",
    "country.ae": "Émirats arabes unis",
    "country.af": "Afghanistan",
    "country.ag": "Antigua-et-Barbuda",
    "country.ai": "Anguilla",
    "country.al": "Albanie",
    "country.am": "Arménie",
    "country.ao": "Angola",
    "country.ar": "Argentine",
    "country.as": "Samoa américaines",
    "country.at": "Autriche",
    "country.au": "Australie",
    "country.aw": "Aruba",
    "country.ax": "Îles Åland",
    "country.az": "Azerbaïdjan",
    "country.ba": "Bosnie-Herzégovine",
    "country.bb": "Barbade",
    "country.bd": "Bangladesh",
    "country.be": "Belgique",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgarie",
    "country.bh": "Bahreïn",
    "country.bi": "Burundi",
    "country.bj": "Bénin",
    "country.bm": "Bermudes",
    "country.bn": "Brunei",
    "country.bo": "Bolivie",
    "country.br": "Brésil",
    "country.bs": "Bahamas",
    "country.bt": "Bhoutan",
    "country.bv": "Île Bouvet",
    "country.bw": "Botswana",
    "country.by": "Biélorussie",
    "country.bz": "Belize",
    "country.ca": "Canada",
    "country.catalonia": "Catalogne",
    "country.cc": "Îles Cocos (Keeling)",
    "country.cd": "République démocratique du Congo",
    "country.cf": "République centrafricaine",
    "country.cg": "République du Congo",
    "country.ch": "Suisse",
    "country.ci": "Côte d'Ivoire",
    "country.ck": "Îles Cook",
    "country.cl": "Chili",
    "country.cm": "Cameroun",
    "country.cn": "Chine",
    "country.co": "Colombie",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Cap-Vert",
    "country.cx": "Île Christmas",
    "country.cy": "Chypre",
    "country.cz": "Tchéquie",
    "country.de": "Allemagne",
    "country.dj": "Djibouti",
    "country.dk": "Danemark",
    "country.dm": "Dominique",
    "country.do": "République dominicaine",
    "country.dz": "Algérie",
    "country.ec": "Équateur",
    "country.ee": "Estonie",
    "country.eg": "Égypte",
    "country.eh": "Sahara occidental",
    "country.england": "Angleterre",
    "country.er": "Érythrée",
    "country.es": "Espagne",
    "country.et": "Éthiopie",
    "country.fi": "Finlande",
    "country.fj": "Fidji",
    "country.fk": "Îles Malouines",
    "country.fm": "Micronésie",
    "country.fo": "Îles Féroé",
    "country.fr": "France",
    "country.ga": "Gabon",
    "country.gb": "Royaume-Uni",
    "country.gd": "Grenade",
    "country.ge": "Géorgie",
    "country.gf": "Guyane française",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenland",
    "country.gm": "Gambie",
    "country.gn": "Guinée",
    "country.gp": "Guadeloupe",
    "country.gq": "Guinée équatoriale",
    "country.gr": "Grèce",
    "country.gs": "Géorgie du Sud et îles Sandwich du Sud",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinée-Bissau",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Îles Heard-et-MacDonald",
    "country.hn": "Honduras",
    "country.hr": "Croatie",
    "country.ht": "Haïti",
    "country.hu": "Hongrie",
    "country.id": "Indonésie",
    "country.ie": "Irlande",
    "country.il": "Israël",
    "country.im": "Île de Man",
    "country.in": "Inde",
    "country.io": "Territoire britannique de l'océan Indien",
    "country.iq": "Irak",
    "country.ir": "Iran",
    "country.is": "Islande",
    "country.it": "Italie",
    "country.je": "Jersey",
    "country.jm": "Jamaïque",
    "country.jo": "Jordanie",
    "country.jp": "Japon",
    "country.ke": "Kenya",
    "country.kg": "Kirghizistan",
    "country.kh": "Cambodge",
    "country.ki": "Kiribati",
    "country.km": "Comores",
    "country.kn": "Saint-Christophe-et-Niévès",
    "country.kp": "Corée du Nord",
    "country.kr": "Corée du Sud",
    "country.kw": "Koweït",
    "country.ky": "Îles Caïmans",
    "country.kz": "Kazakhstan",
    "country.la": "Laos",
    "country.lb": "Liban",
    "country.lc": "Sainte-Lucie",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Libéria",
    "country.ls": "Lesotho",
    "country.lt": "Lituanie",
    "country.lu": "Luxembourg",
    "country.lv": "Lettonie",
    "country.ly": "Libye",
    "country.ma": "Maroc",
    "country.mc": "Monaco",
    "country.md": "Moldavie",
    "country.me": "Monténégro",
    "country.mg": "Madagascar",
    "country.mh": "Îles Marshall",
    "country.mk": "Macédoine du Nord",
    "country.ml": "Mali",
    "country.mm": "Myanmar",
    "country.mn": "Mongolie",
    "country.mo": "Macao",
    "country.mp": "Îles Mariannes du Nord",
    "country.mq": "Martinique",
    "country.mr": "Mauritanie",
    "country.ms": "Montserrat",
    "country.mt": "Malte",
    "country.mu": "Maurice",
    "country.mv": "Maldives",
    "country.mw": "Malawi",
    "country.mx": "Mexique",
    "country.my": "Malaisie",
    "country.mz": "Mozambique",
    "country.na": "Namibie",
    "country.nc": "Nouvelle-Calédonie",
    "country.ne": "Niger",
    "country.nf": "Île Norfolk",
    "country.ng": "Nigéria",
    "country.ni": "Nicaragua",
    "country.nl": "Pays-Bas",
    "country.no": "Norvège",
    "country.np": "Népal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nouvelle-Zélande",
    "country.om": "Oman",
    "country.pa": "Panama",
    "country.pe": "Pérou",
    "country.pf": "Polynésie française",
    "country.pg": "Papouasie-Nouvelle-Guinée",
    "country.ph": "Philippines",
    "country.pk": "Pakistan",
    "country.pl": "Pologne",
    "country.pm": "Saint-Pierre-et-Miquelon",
    "country.pn": "Îles Pitcairn",
    "country.pr": "Porto Rico",
    "country.ps": "Palestine",
    "country.pt": "Portugal",
    "country.pw": "Palaos",
    "country.py": "Paraguay",
    "country.qa": "Qatar",
    "country.re": "La Réunion",
    "country.ro": "Roumanie",
    "country.rs": "Serbie",
    "country.ru": "Russie",
    "country.rw": "Rwanda",
    "country.sa": "Arabie saoudite",
    "country.sb": "Îles Salomon",
    "country.sc": "Seychelles",
    "country.scotland": "Écosse",
    "country.sd": "Soudan",
    "country.se": "Suède",
    "country.sg": "Singapour",
    "country.sh": "Sainte-Hélène",
    "country.si": "Slovénie",
    "country.sj": "Svalbard et Jan Mayen",
    "country.sk": "Slovaquie",
    "country.sl": "Sierra Leone",
    "country.sm": "Saint-Marin",
    "country.sn": "Sénégal",
    "country.so": "Somalie",
    "country.sr": "Suriname",
    "country.st": "Sao Tomé-et-Principe",
    "country.sv": "Salvador",
    "country.sy": "Syrie",
    "country.sz": "Eswatini",
    "country.tc": "Îles Turks et Caïques",
    "country.td": "Tchad",
    "country.tf": "Terres australes françaises",
    "country.tg": "Togo",
    "country.th": "Thaïlande",
    "country.tj": "Tadjikistan",
    "country.tk": "Tokelau",
    "country.tl": "Timor oriental",
    "country.tm": "Turkménistan",
    "country.tn": "Tunisie",
    "country.to": "Tonga",
    "country.tr": "Turquie",
    "country.tt": "Trinité-et-Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taïwan",
    "country.tz": "Tanzanie",
    "country.ua": "Ukraine",
    "country.ug": "Ouganda",
    "country.um": "Îles mineures éloignées des États-Unis",
    "country.us": "États-Unis",
    "country.uy": "Uruguay",
    "country.uz": "Ouzbékistan",
    "country.va": "Vatican",
    "country.vc": "Saint-Vincent-et-les-Grenadines",
    "country.ve": "Venezuela",
    "country.vg": "Îles Vierges britanniques",
    "country.vi": "Îles Vierges des États-Unis",
    "country.vn": "Viêt Nam",
    "country.vu": "Vanuatu",
    "country.wales": "Pays de Galles",
    "country.wf": "Wallis-et-Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yémen",
    "country.yt": "Mayotte",
    "country.za": "Afrique du Sud",
    "country.zm": "Zambie",
    "country.zw": "Zimbabwe",

    // An email is two entries: its subject, which is text, and its body, which
    // is the whole of its markup. This is the one place a catalogue holds
    // markup, and it holds it because an email is written and translated as a
    // piece of writing rather than as a list of phrases somewhere else puts in
    // order: whoever writes one sees what its reader will see. Only what fills
    // an email in is escaped, so nothing given to one can become markup; the
    // markup here is the site's own. `{link}` is the link the email carries,
    // `{site}` the site's address, for a link to one of its own pages,
    // `{buttonBackgroundColour}` and `{buttonTextColour}` what a button is
    // painted with, `{emailFromName}` the name the site's emails are sent
    // from, which each email is signed off with, and `{siteName}` what the
    // site is called, which is the same name its pages call it. The last four
    // are the site's own and are filled in by the writer, never by what queued
    // the email. A button is painted where it stands, because a mail program
    // reads no stylesheet. None greets its reader by name, so that nothing
    // about a person but the address an email goes to need be put in the queue.

    "Email.ConfirmAddress.subject":
      "Confirmez votre adresse e-mail pour {siteName}",
    "Email.ConfirmAddress.body": `
<p>Bonjour,</p>

<p>
    Merci d'avoir créé un compte sur <strong>{siteName}</strong>.<br />
    Avant de pouvoir utiliser votre compte, veuillez confirmer votre adresse e-mail 
    en cliquant sur le bouton ci-dessous :
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Confirmer mon adresse e-mail
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi confirmer votre adresse e-mail en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si vous n'avez pas créé ce compte, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Un nouveau lien pour confirmer votre adresse e-mail pour {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Bonjour,</p>

<p>
    Vous avez récemment demandé un nouvel e-mail pour confirmer votre adresse e-mail pour <strong>{siteName}</strong>.<br />
    Veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Confirmer mon adresse e-mail
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi confirmer votre adresse e-mail en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Une fois l'adresse confirmée, vous pourrez continuer à utiliser votre compte sans interruption.
</p>

<p>
    Si vous n'avez pas demandé cet e-mail, vous pouvez l'ignorer sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Quelqu'un a essayé de s'inscrire avec votre adresse e-mail",
    "Email.AlreadyRegistered.body": `
<p>Bonjour,</p>

<p>
    Quelqu'un a essayé de s'inscrire sur <strong>{siteName}</strong> avec cette
    adresse e-mail, qui a déjà un compte. Rien n'a changé dans votre compte.<br />
    Si c'était vous, vous avez déjà un compte, auquel vous pouvez vous connecter :
</p>

<p>
    <a href="{site}/account/sign-in" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Se connecter
    </a>
</p>

<p>
    Si vous avez oublié votre mot de passe, vous pouvez le réinitialiser ici :
</p>

<p>
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Mot de passe oublié
    </a>
</p>

<p>
    Si ce n'était pas vous, vous n'avez rien à faire. Personne n'a reçu de moyen
    d'accéder à votre compte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Confirmez le déplacement de votre compte {siteName} vers cette adresse",
    "Email.ConfirmNewEmailAddress.body": `
<p>Bonjour,</p>

<p>
    Quelqu'un connecté à un compte <strong>{siteName}</strong> a demandé à le déplacer
    vers cette adresse e-mail. Si c'était vous, confirmez-le ici, en étant connecté à ce
    compte. Le lien est valable 24 heures.
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Déplacer mon compte
    </a>
</p>

<p>
    Ou copiez cette adresse dans votre navigateur :<br />
    {link}
</p>

<p>
    Si ce n'était pas vous, vous n'avez rien à faire. Aucun compte ne sera déplacé ici.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Quelqu'un a demandé à déplacer un compte vers votre adresse e-mail",
    "Email.AlreadyHasAnAccount.body": `
<p>Bonjour,</p>

<p>
    Quelqu'un connecté à un compte <strong>{siteName}</strong> a demandé à le déplacer
    vers cette adresse e-mail, qui a déjà son propre compte. Rien n'a été déplacé,
    et rien n'a changé dans votre compte.
</p>

<p>
    Si c'était vous, vous avez déjà un compte à cette adresse, auquel vous pouvez
    vous connecter.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Votre compte {siteName} a été déplacé",
    "Email.EmailAddressChanged.body": `
<p>Bonjour,</p>

<p>
    Votre compte <strong>{siteName}</strong> vient d'être déplacé vers une autre adresse
    e-mail, {emailAddress}, et vous vous y connecterez désormais avec cette adresse.
</p>

<p>
    Si ce n'était pas vous, quelqu'un d'autre a accès à votre compte. Répondez à cet
    e-mail pour nous le signaler.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Votre mot de passe {siteName} a été changé",
    "Email.PasswordChanged.body": `
<p>Bonjour,</p>

<p>
    Le mot de passe de votre compte <strong>{siteName}</strong> vient d'être
    changé, et tous les autres navigateurs connectés à ce compte ont été déconnectés.<br />
    Si c'était vous, vous n'avez rien à faire.
</p>

<p>
    Si ce n'était pas vous, quelqu'un d'autre a votre mot de passe. Définissez-en un
    nouveau ici, et cette personne sera déconnectée :
</p>

<p>
    <a href="{site}/account/forgot-password" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Mot de passe oublié
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Définissez un nouveau mot de passe pour {siteName}",
    "Email.SetNewPassword.body": `
<p>Bonjour,</p>

<p>
    Vous avez récemment demandé à réinitialiser votre mot de passe pour <strong>{siteName}</strong>.<br />
    Vous pouvez le réinitialiser en cliquant sur le bouton ci-dessous :
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Réinitialiser le mot de passe
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi réinitialiser votre mot de passe en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Définissez un mot de passe pour {siteName}",
    "Email.SetPassword.body": `
<p>Bonjour,</p>

<p>
    Votre compte <strong>{siteName}</strong> n'a pas de mot de passe : vous vous connectez avec Google.<br />
    Vous avez demandé à en définir un, pour pouvoir aussi vous connecter avec votre adresse e-mail et un mot de passe.
    Vous pouvez le définir en cliquant sur le bouton ci-dessous :
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Définir un mot de passe
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi définir votre mot de passe en ouvrant ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Le lien est valable une heure. Si vous n'avez pas demandé à définir un mot de passe, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "Il n'existe aucun compte {siteName} pour cette adresse e-mail",
    "Email.RegisterInstead.body": `
<p>Bonjour,</p>

<p>
    Une demande de réinitialisation de mot de passe a été faite pour une adresse e-mail 
    qui n'est associée à aucun compte sur <strong>{siteName}</strong>.
</p>

<p>
    Si vous souhaitez utiliser notre service, vous pouvez créer un compte en vous rendant sur :<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail sans crainte.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Confirmez que votre compte {siteName} doit être oublié",
    "Email.ConfirmForgetting.body": `
<p>Bonjour,</p>

<p>
    Vous avez demandé que votre compte <strong>{siteName}</strong> soit
    oublié.<br />
    Suivez le bouton ci-dessous pour voir ce que cela signifie, et pour dire
    avec certitude que vous le voulez :
</p>

<p>
    <a href="{link}" style="
        background-color:{buttonBackgroundColour};
        color:{buttonTextColour};
        font-weight:bold;
        padding:12px 24px;
        border-radius:4px;
        text-decoration:none;
        display:inline-block;
    ">
        Oublier mon compte
    </a>
</p>

<p>
    Si le bouton ne fonctionne pas, vous pouvez aussi ouvrir ce lien dans votre navigateur :<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Une fois oubliés, votre nom et votre adresse e-mail ne pourront plus jamais être
    lus, par personne, et il ne sera plus possible de se connecter à votre compte.
    Cette action est irréversible.
</p>

<p>
    Le lien ne fonctionne qu'une fois, jusqu'à 15 minutes après votre demande, et
    seulement tant que vous êtes connecté à ce compte. Passé ce délai, refaites la
    demande depuis votre compte.
</p>

<p>
    Si vous n'avez rien demandé, il ne se passera rien tant que le lien n'est pas suivi.
    Quelqu'un connecté à votre compte a pourtant fait cette demande : définissez donc un
    nouveau mot de passe depuis la page du mot de passe oublié pour être sûr que cette
    personne ne puisse plus se connecter.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "Les inscriptions sont suspendues : {service} est inaccessible",
    "Email.RegistrationsSuspended.body": `
<p>Bonjour,</p>

<p>
    {siteName} n'a pas pu joindre {service} à {when}. Tant qu'il ne répond pas,
    les lecteurs qui en ont besoin, pour s'inscrire ou pour définir un nouveau mot de passe,
    sont invités à réessayer plus tard.
</p>

<p>
    Rien n'est à débloquer. Chaque tentative interroge {service} à nouveau, et les pages
    refonctionnent dès qu'il répond.
</p>

<p>
    Tant que {service} reste hors service, vous recevrez un e-mail à ce sujet au plus
    une fois par heure.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} ne peut pas joindre sa base de données",
    "Email.DatabaseUnreachable.body": `
<p>Bonjour,</p>

<p>
    {siteName} n'a pas pu joindre sa base de données à {when}. Tant qu'elle ne répond pas, chaque page qui en a besoin indique aux lecteurs que le site est indisponible et qu'ils doivent réessayer plus tard.
</p>

<p>
    Rien n'est à débloquer. Chaque requête demande une nouvelle connexion, et le site refonctionne dès que la base de données répond.
</p>

<p>
    Tant que la base de données reste hors service, vous recevrez un e-mail à ce sujet au plus une fois toutes les {minutes} minutes.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} a échoué sur une requête",
    "Email.UnhandledError.body": `
<p>Bonjour,</p>

<p>
    {siteName} a échoué à {when} sur une requête pour {asked}. Le lecteur a vu la référence {reference}, et le journal en donne la cause.
</p>

<p>
    Un site en panne échoue en général sur chaque requête, vous recevrez donc un e-mail sur les échecs au plus 4 fois par heure. Les suivants figurent quand même dans le journal.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
