// The site's words in Spanish. Keyed as the English catalogue is, which is
// what a word missing here falls back to.
//
// Written to the reader as tú rather than usted: the site talks to people
// scoring and following croquet, and the English it is written from is plain
// and direct rather than formal. Items in menus and on buttons are written in
// sentence case, as Spanish writes them, where the English capitalises each
// word.
import type { Language } from "../common/language.js";

export const spanish: Language = {
  tag: "es",
  name: "Español",
  words: {
    "site.skipToContent": "Saltar al contenido",
    "navigation.menu": "Menú",
    "navigation.label": "Principal",
    "navigation.home": "Inicio",
    "navigation.help": "Ayuda",
    "navigation.admin": "Administración",
    "sections.label": "Secciones",
    "theme.label": "Tema",
    "theme.light": "Claro",
    "theme.dark": "Oscuro",
    "theme.system": "Sistema",
    "footer.donate": "Donar",
    "footer.plea":
      "¿Te está gustando {siteName}? Haz un donativo para ayudar a seguir desarrollándolo.",
    "footer.copyright": "© Copyright {years}, {owner}",
    "footer.privacy": "Privacidad",
    "beta.banner":
      "Este es un sitio beta. Los datos pueden restablecerse en cualquier momento.",
    "privacy.contact":
      "Preguntas sobre esta página, o sobre lo que se guarda de ti: {emailAddress}",
    "tryWebsite.banner":
      "Este es un lugar seguro para aprender {siteName}. Todo lo que introduzcas aquí puede borrarse en cualquier momento.",

    "language.label": "Idioma",
    "language.choose": "Cambiar",

    // The alert that tells a reader there is something new to read.
    "whatsNew.public.message": "Hay novedades para leer.",
    "whatsNew.admin.message": "Hay novedades para quienes organizan torneos.",
    "whatsNew.view": "Ver las novedades",
    "whatsNew.later": "Recordármelo la próxima vez",
    "whatsNew.never": "No volver a mostrar este aviso",

    "form.otherwise":
      "Algo no está bien. Revisa lo que has introducido y vuelve a intentarlo.",

    "account.menu": "Cuenta",
    "account.register": "Registrarse",
    "account.signIn": "Iniciar sesión",
    "account.forgotPassword": "He olvidado mi contraseña",
    "account.signOut": "Cerrar sesión",
    "account.profile": "Perfil",
    "account.changePassword": "Cambiar contraseña",
    "account.changeEmailAddress": "Cambiar dirección de correo electrónico",
    "account.changeName": "Cambiar nombre",
    "account.setPassword": "Establecer contraseña",
    "account.forgetAccount": "Olvidar cuenta",

    "register.title": "Registrarse",
    "register.emailAddress": "Dirección de correo electrónico",
    "register.submit": "Registrarse",
    "register.withGoogle": "Registrarse con Google",
    "register.or": "o",
    "SignInWithGoogle.EmailAddressNotVerified":
      "Google no ha confirmado que esa dirección de correo electrónico sea tuya, así que no puede usarse aquí con Google. Usa tu dirección de correo electrónico a continuación.",
    "SignInWithGoogle.LinkedToAnother":
      "Esa dirección de correo electrónico ya tiene una cuenta, vinculada a otra cuenta de Google. Inicia sesión con esa cuenta de Google, o con tu dirección de correo electrónico y tu contraseña.",
    "SignInWithGoogle.NameMissing":
      "Google no nos ha dicho tu nombre, y una cuenta necesita uno. Usa tu dirección de correo electrónico a continuación.",
    "Google.Unreachable":
      "No se ha podido contactar con Google en este momento. Vuelve a intentarlo dentro de unos minutos, o usa tu dirección de correo electrónico a continuación.",
    "Registration.NotAPerson":
      "Esto no parecía venir de una persona. Vuelve a intentarlo y, si sigue ocurriendo, espera unos minutos y vuelve.",

    "EmailAddress.Missing": "Introduce una dirección de correo electrónico.",
    "EmailAddress.NoAt": "Una dirección de correo electrónico lleva una @.",
    "EmailAddress.MoreThanOneAt":
      "Una dirección de correo electrónico lleva una sola @.",
    "EmailAddress.NoDomain":
      "Una dirección de correo electrónico lleva un dominio después de la @, como example.com.",

    "welcome.title": "Revisa tu correo",
    "welcome.checkEmail":
      "Te hemos enviado un correo a la dirección que nos has dado. Sigue el enlace que contiene para continuar.",
    "welcome.nothingArrived":
      "Si no llega nada en unos minutos, mira en tu carpeta de correo no deseado o spam.",
    "welcome.home": "Volver a {siteName}",
    "newConfirmationLink.title": "Pide un enlace nuevo",
    "newConfirmationLink.explanation":
      "El enlace para confirmar tu dirección de correo electrónico ha caducado. Pide uno nuevo y se enviará a la dirección con la que te registraste.",
    "newConfirmationLink.send": "Envíame un enlace nuevo",
    "newConfirmationLink.home": "Volver a {siteName}",
    "newConfirmationLink.signIn": "Iniciar sesión",
    "newConfirmationLink.sent.title": "Revisa tu correo",
    "newConfirmationLink.sent.explanation":
      "Te hemos enviado un enlace nuevo. Síguelo para confirmar tu dirección de correo electrónico. Si no llega nada en unos minutos, mira en tu carpeta de correo no deseado o spam.",
    "newConfirmationLink.alreadyConfirmed.title":
      "Esa dirección de correo electrónico ya está confirmada",
    "newConfirmationLink.alreadyConfirmed.explanation":
      "No queda nada por confirmar. Inicia sesión con la contraseña que diste al confirmarla.",
    "newConfirmationLink.noLongerWorks.title": "Ese enlace ya no funciona",
    "newConfirmationLink.noLongerWorks.explanation":
      "Comprueba que has seguido el enlace completo del correo, sin que falte nada al final. Si sigue sin funcionar, vuelve a registrarte y se te enviará un enlace nuevo.",
    "newConfirmationLink.tooMany.title": "Vuelve a intentarlo más tarde",
    "newConfirmationLink.tooMany.explanation":
      "Se han enviado varios enlaces a esta dirección últimamente. Espera una hora y vuelve a pedirlo, y mientras tanto mira en tu carpeta de correo no deseado o spam.",

    "forgotPassword.title": "¿Has olvidado tu contraseña?",
    "forgotPassword.emailAddress": "Dirección de correo electrónico",
    "forgotPassword.submit": "Envíame una forma de volver a entrar",
    "forgotPassword.home": "Volver a {siteName}",
    "forgotPassword.sent.title": "Revisa tu correo",
    "forgotPassword.sent.explanation":
      "Si esa dirección tiene una cuenta, te hemos enviado un enlace para establecer una contraseña nueva. Síguelo antes de que pase una hora. Si no llega nada en unos minutos, mira en tu carpeta de correo no deseado o spam.",
    "forgotPassword.tryAgainLater":
      "Se han pedido demasiadas formas de volver a entrar desde aquí últimamente. Espera una hora y vuelve a intentarlo.",

    "setNewPassword.title": "Establece una contraseña nueva",
    "setNewPassword.password": "Contraseña",
    "setNewPassword.confirmPassword": "Confirmar contraseña",
    "setNewPassword.submit": "Establecer mi contraseña nueva",
    "setNewPassword.home": "Volver a {siteName}",
    "setNewPassword.signIn": "Iniciar sesión",
    "setNewPassword.askAgain": "Pedir un enlace nuevo",
    "setNewPassword.changed.title": "Tu contraseña se ha cambiado",
    "setNewPassword.changed.explanation":
      "Se ha cerrado tu sesión en todos los sitios donde la tenías iniciada. Inicia sesión con tu contraseña nueva.",
    "setNewPassword.expired.title": "Ese enlace ha caducado",
    "setNewPassword.expired.explanation":
      "Un enlace para establecer una contraseña nueva funciona durante una hora. Pide otro y se enviará a la misma dirección.",
    "setNewPassword.noLongerWorks.title": "Ese enlace ya no funciona",
    "setNewPassword.noLongerWorks.explanation":
      "Puede que ya se haya usado, o que falte algo al final. Pide otro si todavía lo necesitas.",

    "BreachedPasswords.Unreachable":
      "No se puede comprobar tu contraseña en este momento, así que no se ha cambiado. Vuelve a intentarlo dentro de unos minutos; tu enlace sigue funcionando hasta que caduque.",

    "forgetAccount.title": "Olvida tu cuenta",
    "forgetAccount.explanation":
      "Tu nombre y tu dirección de correo electrónico pueden hacerse ilegibles para siempre, y tu cuenta cerrarse. Para asegurarnos de que eres tú, primero enviaremos un enlace a la dirección de tu cuenta, y no se olvida nada hasta que lo sigas.",
    "forgetAccount.submit": "Envíame el enlace",
    "forgetAccount.sent.title": "Revisa tu correo",
    "forgetAccount.sent.explanation":
      "Hemos enviado un enlace a la dirección de tu cuenta. Funciona durante 15 minutos, y solo mientras tengas iniciada la sesión en esta cuenta.",
    "forgetAccount.confirm.title": "¿Olvidar tu cuenta para siempre?",
    "forgetAccount.confirm.explanation":
      "Una vez olvidada, nadie podrá volver a leer tu nombre ni tu dirección de correo electrónico, y no se podrá iniciar sesión en tu cuenta. No se puede deshacer.",
    "forgetAccount.confirm.submit": "Olvidar mi cuenta",
    "forgetAccount.forgotten.title": "Tu cuenta se ha olvidado",
    "forgetAccount.forgotten.explanation":
      "Tu nombre y tu dirección de correo electrónico ya no se pueden leer, y se ha cerrado tu sesión en todos los sitios donde la tenías iniciada.",
    "forgetAccount.noLongerWorks.title": "Ese enlace ya no funciona",
    "forgetAccount.noLongerWorks.explanation":
      "Puede que haya caducado, que ya se haya usado o que sea de una cuenta en la que no tienes iniciada la sesión. Vuelve a pedirlo desde tu cuenta si todavía quieres que se olvide.",
    "forgetAccount.lastAdministrator.title": "Tu cuenta no se puede olvidar",
    "forgetAccount.lastAdministrator.explanation":
      "Eres el único administrador de este sitio. Da el rol de administrador a otra persona y después se podrá olvidar tu cuenta.",
    "forgetAccount.askAgain": "Volver a pedirlo",
    "forgetAccount.home": "Volver a {siteName}",

    "registrationsSuspended.title": "El registro está suspendido por ahora",
    "registrationsSuspended.explanation":
      "No se puede contactar en este momento con un servicio que el registro necesita, así que nadie puede registrarse hasta que vuelva a responder. No se ha guardado nada de lo que escribiste.",
    "registrationsSuspended.tryAgainLater":
      "Vuelve a intentarlo dentro de un rato. Se ha avisado al administrador del sitio.",
    "registrationsSuspended.home": "Volver a {siteName}",

    "signIn.title": "Iniciar sesión",
    "signIn.emailAddress": "Dirección de correo electrónico",
    "signIn.password": "Contraseña",
    "signIn.submit": "Iniciar sesión",
    "signIn.forgotPassword": "¿Has olvidado tu contraseña?",
    "signIn.register": "Registrarse",
    "signIn.withGoogle": "Iniciar sesión con Google",
    "signIn.or": "o",
    "signIn.tryAgainLater":
      "Se han hecho demasiados intentos últimamente. Espera una hora y vuelve a intentarlo.",

    "SignIn.Failed":
      "La dirección de correo electrónico o la contraseña no son correctas. Vuelve a intentarlo.",

    "profile.title": "Perfil",
    "profile.name": "Nombre:",
    "profile.emailAddress": "Dirección de correo electrónico:",

    "changeName.title": "Cambiar nombre",
    "changeName.name": "Nombre",
    "changeName.submit": "Cambiar nombre",

    "setPassword.title": "Establece una contraseña",
    "setPassword.explanation":
      "Tu cuenta no tiene contraseña: inicias sesión con Google. Para poder iniciar sesión también con una contraseña, enviaremos a {emailAddress} un enlace para establecerla.",
    "setPassword.submit": "Envíame un enlace",
    "setPassword.sent.title": "Revisa tu correo",
    "setPassword.sent.explanation":
      "Te hemos enviado un enlace para establecer una contraseña. Funciona durante una hora.",
    "setPassword.profile": "Volver a tu perfil",

    "changePassword.title": "Cambiar contraseña",
    "changePassword.currentPassword": "Contraseña actual",
    "changePassword.password": "Contraseña nueva",
    "changePassword.passwordConfirmation": "Confirmar contraseña",
    "changePassword.forgotPassword": "¿Has olvidado tu contraseña?",
    "changePassword.submit": "Cambiar contraseña",
    "ChangePassword.WrongPassword": "Esa no es tu contraseña.",

    "changeEmailAddress.title": "Cambiar dirección de correo electrónico",
    "changeEmailAddress.emailAddress": "Dirección de correo electrónico nueva",
    "changeEmailAddress.currentPassword": "Contraseña actual",
    "changeEmailAddress.submit": "Enviar un enlace de confirmación",
    "changeEmailAddress.sent.title": "Revisa tu correo",
    "changeEmailAddress.sent.explanation":
      "Se ha enviado a la dirección de correo electrónico nueva un enlace para confirmar el traslado. Síguelo, con la sesión iniciada, para trasladar allí tu cuenta.",
    "changeEmailAddress.confirm.title": "Traslada tu cuenta",
    "changeEmailAddress.confirm.explanation":
      "Tu cuenta se trasladará a {emailAddress}. A partir de ahora iniciarás sesión con esa dirección.",
    "changeEmailAddress.confirm.submit": "Trasladar mi cuenta",
    "changeEmailAddress.noLongerWorks.title": "Este enlace ya no funciona",
    "changeEmailAddress.noLongerWorks.explanation":
      "Ha caducado, ya se ha usado o no se envió para la cuenta en la que tienes iniciada la sesión. Vuelve a pedirlo desde tu perfil.",
    "changeEmailAddress.taken.title": "Tu cuenta no se ha trasladado",
    "changeEmailAddress.profile": "Volver a tu perfil",
    "ChangeEmailAddress.WrongPassword": "Esa no es tu contraseña.",
    "ChangeEmailAddress.Unchanged": "Tu cuenta ya está en esta dirección.",
    "ChangeEmailAddress.Taken":
      "Esa dirección de correo electrónico ya tiene una cuenta propia, así que la tuya no puede trasladarse allí.",

    "confirmEmailAddress.title": "Confirma tu dirección de correo electrónico",
    "confirmEmailAddress.name": "Nombre",
    "confirmEmailAddress.password": "Contraseña",
    "confirmEmailAddress.confirmPassword": "Confirmar contraseña",
    "confirmEmailAddress.submit":
      "Confirmar mi dirección de correo electrónico",
    "confirmEmailAddress.signIn": "Iniciar sesión",
    "confirmEmailAddress.home": "Volver a {siteName}",
    "confirmEmailAddress.confirmed.title":
      "Tu dirección de correo electrónico está confirmada",
    "confirmEmailAddress.confirmed.explanation":
      "Tu cuenta está lista. Inicia sesión con la dirección de correo electrónico y la contraseña que acabas de dar.",
    "confirmEmailAddress.expired.title": "Ese enlace ha caducado",
    "confirmEmailAddress.expired.explanation":
      "Un enlace para confirmar una dirección de correo electrónico funciona durante 24 horas. Pide uno nuevo y se enviará a la misma dirección.",
    "confirmEmailAddress.expired.newLink": "Envíame un enlace nuevo",
    "confirmEmailAddress.noLongerWorks.title": "Ese enlace ya no funciona",
    "confirmEmailAddress.noLongerWorks.explanation":
      "Comprueba que has seguido el enlace completo del correo, sin que falte nada al final. Si sigue sin funcionar, vuelve a registrarte y se te enviará un enlace nuevo.",
    "confirmEmailAddress.alreadyConfirmed.title":
      "Esa dirección de correo electrónico ya está confirmada",
    "confirmEmailAddress.alreadyConfirmed.explanation":
      "No queda nada por hacer. Inicia sesión con la contraseña que diste al confirmarla.",

    "PersonName.Missing": "Introduce un nombre.",
    "PersonName.TooShort": "Un nombre tiene que tener al menos 3 caracteres.",
    "PersonName.TooLong": "Un nombre puede tener como mucho 254 caracteres.",
    "WorldRankingName.TooShort":
      "El nombre en el ranking mundial debe tener al menos 3 caracteres.",
    "WorldRankingName.TooLong":
      "El nombre en el ranking mundial puede tener como mucho 254 caracteres.",
    "Password.Missing": "Introduce una contraseña.",
    "Password.TooShort":
      "Una contraseña tiene que tener al menos 12 caracteres.",
    "Password.ConfirmationDiffers":
      "No coincide con la contraseña de arriba. Vuelve a escribirla.",
    "Password.Breached":
      "Esta contraseña ha aparecido en una filtración de datos en otro sitio, así que no es seguro usarla aquí. Elige otra.",

    "javaScriptRequired.title": "Hace falta JavaScript",
    "javaScriptRequired.explanation":
      "Para registrarte hace falta tener JavaScript activado en este sitio, para poder comprobar que quien se registra es una persona. Actívalo y vuelve a registrarte.",
    "javaScriptRequired.register": "Volver al registro",
    "javaScriptRequired.home": "Volver a {siteName}",

    "errors.backHome": "Volver a {siteName}",
    "errors.notFound": "No encontrado",
    "errors.refused": "No se ha podido hacer",
    "errors.refusedDetail": "Algo de lo que se envió no estaba bien.",
    "errors.sorry": "Lo sentimos",
    "errors.sorryDetail": "No se ha podido atender esa petición.",
    "errors.failed": "Algo ha ido mal",
    "errors.reference": "Referencia {reference}.",
    "errors.recorded":
      "El error se ha registrado y se ha enviado un correo electrónico al administrador. Ayuda escribir al administrador con la referencia y una descripción de lo que estabas haciendo.",
    "errors.message": "Escribir un correo electrónico al administrador",
    "errors.messageSubject": "Error {reference} en {siteName}",
    "errors.messageBody": "Lo que estaba haciendo cuando ocurrió:\n\n",
    "errors.unavailable": "El sitio no está disponible",
    "errors.unavailableDetail":
      "El sitio no puede acceder ahora a lo que necesita. Inténtalo de nuevo más tarde.",
    "errors.maintenance": "El sitio está en mantenimiento.",
    "errors.maintenanceMinutes": "Se espera que vuelva en {minutes} minutos.",
    "errors.maintenanceMinute": "Se espera que vuelva en 1 minuto.",
    "errors.maintenanceLonger":
      "Está tardando más de lo previsto y volverá pronto.",

    "home.recentResults": "Resultados recientes",
    "home.recentResults.none":
      "No se ha añadido ninguna partida en los últimos siete días.",
    "home.upcomingTournaments": "Próximos torneos",
    "home.upcomingTournaments.none":
      "Ningún torneo empieza en los próximos sesenta días.",
    "tournamentList.column.date": "Fecha",
    "tournamentList.column.name": "Nombre",
    "tournamentList.onlyIn": "Solo torneos en {country}",
    "tournamentList.filter.country": "País",
    "tournamentList.filter.anyCountry": "Cualquier país",
    "tournamentList.filter.region": "Región",
    "tournamentList.filter.anyRegion": "Cualquier región",
    "tournamentList.filter.sport": "Deporte",
    "tournamentList.filter.anySport": "Cualquier deporte",
    "tournamentList.filter.submit": "Filtrar",
    "home.allTournaments": "Todos los torneos de {year}",
    "year.heading": "Torneos de {year}",
    "year.none": "Ningún torneo empieza en {year}.",
    "yearSport.heading": "Torneos de {sport} en {year}",
    "yearSport.none": "Ningún torneo de {sport} empieza en {year}.",
    "tournament.recent": "Recientes",
    "tournament.summary": "Resumen",
    "test.bestOf": "Cada encuentro es al mejor de {count}.",
    "test.vs": "vs",
    "test.matches": "Partidos",
    "test.games": "Partidas",
    "test.hoops": "Aros",
    "teamSummary.tests": "Tests",
    "teamSummary.matches": "Partidos",
    "teamSummary.games": "Partidas",
    "teamSummary.hoops": "Aros",
    "teamSummary.wins": "Victorias",
    "teamSummary.losses": "Derrotas",
    "teamSummary.draws": "Empates",
    "teamSummary.for": "A favor",
    "teamSummary.against": "En contra",
    "teamSummary.net": "Neto",
    "tournament.players": "Jugadores",
    "search.label": "Buscar",
    "search.tournaments": "Torneos",
    "search.competitions": "Competiciones",
    "search.nothingFound": "No se encontró nada.",
    "players.search.label": "Buscar jugadores",
    "players.search.prompt":
      "Escribe el nombre de un jugador para encontrarlo.",
    "players.search.none": "No se encontraron jugadores.",
    "search.more":
      "Solo se muestran los primeros {count}. Añade más del nombre para acotar la búsqueda.",
    "websitePlayer.tournament": "Torneo",
    "tournament.test": "{first} vs {second}",
    "tournament.notes": "Notas",
    "tournament.commentary": "Comentarios",
    "tournament.beat": "ganó a",
    "tournament.drewWith": "empató con",
    "tournament.ago.seconds": "{count} s",
    "tournament.ago.minutes": "{count} min",
    "tournament.ago.hour": "1 hora",
    "tournament.ago.hours": "{count} horas",
    "tournament.none": "Aún no se ha jugado ninguna partida.",
    "players.none": "Aún no se ha añadido ningún jugador.",
    "commentaries.by": "por",
    "commentaries.start": "Empezar un comentario nuevo",
    "commentaries.disclaimer.heading": "Aviso",
    "commentaries.disclaimer":
      "Las opiniones expresadas en estos comentarios son de sus autores y no reflejan necesariamente las de Tim Murphy ni las de {site}.",
    "commentaries.guidelines.heading": "Normas",
    "commentaries.guidelines.responsible":
      "Eres responsable de tus comentarios.",
    "commentaries.guidelines.purpose":
      'Los comentarios sirven para contar lo que está pasando en el torneo. No están pensados como una "red social" para mandar buenos deseos, etc.',
    "commentaries.guidelines.hatred":
      "No publiques nada que pueda incitar a la violencia o al odio. No toleraremos comentarios que humillen a otros por su raza, religión, origen étnico, género, edad, discapacidad mental o física, u orientación sexual.",
    "commentaries.guidelines.abuse":
      "No se tolerarán los insultos gratuitos. La norma general es que los comentarios jueguen la bola y no al jugador, es decir, que no ataquen a nadie personalmente sino que traten del asunto en cuestión.",
    "commentaries.guidelines.unlawful":
      "Se retirará cualquier comentario de legalidad dudosa, como posibles infracciones de derechos de autor o material que pueda ser difamatorio.",
    "commentaries.guidelines.shouting":
      "Por favor, no digas palabrotas ni escribas todo en mayúsculas en los comentarios.",
    "commentaries.guidelines.selling":
      "No uses los comentarios con fines comerciales ni para spam. Se retirarán los comentarios que anuncien, promocionen u ofrezcan bienes o servicios.",
    "commentaries.guidelines.links":
      "Por favor, limita los enlaces en los comentarios. Se retirarán los comentarios con enlaces a material inapropiado.",
    "commentaries.guidelines.impersonating":
      "No te hagas pasar por otros en los comentarios, ni publiques datos personales – números de teléfono, direcciones postales o de correo electrónico – que puedan poner a alguien en peligro sin querer.",
    "commentaries.reporting.heading": "Denunciar comentarios",
    "commentaries.reporting.before":
      "Por favor, denuncia los comentarios que no cumplan estas normas a",
    "commentaries.reporting.after":
      ". Cita la dirección web y el comentario dudoso. Por ejemplo:",
    "commentaries.reporting.exampleComment":
      '"un comentario que debería retirarse"',
    "commentaries.reporting.exampleReason":
      "Este comentario debería retirarse porque...",
    "commentaries.reporting.reviewed":
      "Denunciar algo no significa que se retire automáticamente, pero se revisarán todas las denuncias.",
    "commentaries.reporting.reserved":
      "{site} se reserva el derecho a retirar comentarios.",
    "commentaries.reporting.subject": "{site} Denuncia de comentario",
    "commentaries.reporting.body":
      "Por favor, cita la dirección web, el comentario dudoso y por qué debería retirarse.",
    "startCommentary.title": "Empezar un comentario nuevo",
    "startCommentary.titleField": "Título",
    "startCommentary.submit": "Empezar el comentario",
    // A tournament's Notes page, and a note's own page, as the English says.
    "notes.none": "Los organizadores aún no han escrito notas.",
    "marks.new": "nuevo",
    "note.edited": "editada",
    "commentary.none": "Aún no se ha escrito nada.",
    "commentary.edited": "editado",
    "commentary.edit": "Editar",
    "commentary.delete": "Eliminar",
    "commentary.comment": "Comentario",
    "commentary.add": "Añadir",
    "commentary.notSent":
      "No se pudo enviar el comentario. Vuelve a cargar la página para ver si se guardó.",
    "changeCommentaryTitle.title": "Cambiar el título",
    "changeCommentaryTitle.submit": "Guardar",
    "editComment.title": "Editar el comentario",
    "editComment.save": "Guardar",
    "deleteComment.title": "Eliminar el comentario",
    "deleteComment.question":
      "¿Eliminar este comentario? No se puede deshacer.",
    "deleteComment.confirm": "Eliminar el comentario",
    "deleteComment.keep": "Conservarlo",
    "player.games": "Partidas",
    "player.competitions": "Competiciones",
    "player.beat": "ganó a",
    "player.lostTo": "perdió con",
    "player.drewWith": "empató con",
    "player.score": "{score} a {opponent}",
    "player.noGames": "Aún no se ha jugado ninguna partida.",
    "player.noCompetitions": "Aún no está inscrito en ninguna competición.",
    "block.wins": "Victorias",
    "block.matches": "Encuentros",
    "block.netGames": "Partidas netas",
    "block.games": "Partidas",
    "block.netHoops": "Aros netos",
    "block.won": "ganada",
    "block.lost": "perdida",
    "block.drawn": "empatada",
    "block.withdrawn": "retirado",
    "block.gameWithdrawn": "retirada",
    "block.losses": "Derrotas",
    "competition.views": "Vistas",
    "competition.view.grid": "Cuadro",
    "competition.view.summary": "Resumen",
    "competition.view.orderOfPlay": "Orden de juego",
    "blockSummary.ranking":
      "Clasificados por la proporción de encuentros ganados y después por aros netos. El reglamento de un torneo puede ordenar a sus jugadores de otro modo.",
    "orderOfPlay.none": "Aún no se ha jugado ninguna partida.",
    "knockout.round.final": "Final",
    "knockout.round.semis": "Semifinales",
    "knockout.round.quarters": "Cuartos de final",
    "knockout.round.number": "Ronda {number}",
    "knockout.bye": "Bye",
    "swiss.games": "Partidas",
    "swiss.wins": "Victorias",
    "swiss.winShare": "% de victorias",
    "swiss.results": "Resultados",
    "knockout.onward": "Rondas siguientes",
    "knockout.back": "Rondas anteriores",
    "years.label": "Años",
    "years.earlier": "Años anteriores",

    "admin.newerBuild.message": "Hay una versión más reciente de este sitio.",
    "admin.newerBuild.reload": "Recargar",
    "admin.title": "Administración",
    "admin.tournaments.new": "Nuevo torneo",
    "admin.tournaments.none": "No hay torneos",
    "admin.tournaments.archived": "Archivado",
    "admin.tournaments.manage": "Gestionar",
    "admin.tournaments.edit": "Editar",
    "admin.tournaments.archive": "Archivar",
    "admin.tournaments.restore": "Restaurar",
    "admin.tournaments.scores": "Resultados",
    "admin.tournaments.players": "Jugadores",
    "admin.years.label": "Años",
    "admin.years.earlier": "Años anteriores",
    "admin.tournament.name": "Nombre",
    "admin.tournament.starts": "Empieza",
    "admin.tournament.finishes": "Termina",
    "admin.tournament.format": "Formato",
    "admin.tournament.sport": "Deporte",
    "admin.tournament.country": "País",
    "admin.tournament.region": "Región",
    "admin.tournament.subtitle": "Subtítulo",
    "admin.tournament.handicap": "Jugado con hándicap",
    "admin.tournament.drawsAllowed": "Permite empates",
    "admin.tournament.levelTestsDrawn": "Los tests igualados son empate",
    "admin.tournament.worldRankings": "Cuenta para el ranking mundial",
    "admin.tournament.national": "Evento de nivel nacional",
    "admin.tournament.international": "Evento de nivel internacional",
    "admin.tournament.otherwise": "Esto no se puede aceptar tal como está.",
    "admin.newTournament.title": "Nuevo torneo",
    "admin.newTournament.submit": "Crear torneo",
    "admin.editTournament.title": "Editar torneo",
    "admin.editTournament.submit": "Actualizar torneo",
    "admin.editTournament.otherwise": "Este torneo no se puede cambiar.",
    "admin.view.tabs": "Torneo",
    "admin.view.players": "Jugadores",
    "admin.view.competitions": "Competiciones",
    "admin.view.managers": "Gestores",
    "admin.view.notes": "Notas",
    "admin.view.scorers": "Anotadores",
    "admin.view.rankings": "Rankings",
    "admin.rankings.textFile":
      "Los resultados del torneo se envían al ranking mundial como un archivo de texto, que el sitio escribe a partir de las partidas introducidas.",
    "admin.rankings.spreadsheet":
      "Los resultados del torneo se envían al ranking mundial como una hoja de cálculo, que el sitio escribe a partir de las partidas introducidas.",
    "admin.rankings.fillInWinners":
      "El sitio solo puede adivinar quién ganó cada competición, así que revise la línea Winner de cada una antes de enviar el archivo.",
    "admin.rankings.fillInWinner":
      "El sitio no puede saber quién ganó el torneo, así que anótelo al final de la hoja de cálculo antes de enviarla.",
    "admin.rankings.sendIt":
      "Después envíe el archivo a los responsables del ranking mundial.",
    "admin.rankings.download": "Descargar rankings",
    "rankings.notAvailable": "Los rankings no están disponibles",
    "rankings.notAvailable.sport":
      "El deporte de este torneo no tiene ranking mundial, así que no hay rankings que enviar.",
    "rankings.notAvailable.handicap":
      "Este torneo se juega con hándicap, así que no cuenta para el ranking mundial.",
    "rankings.notAvailable.drawnGames":
      "Este torneo permite partidas empatadas, así que no cuenta para el ranking mundial.",
    "rankings.notAvailable.notCounted":
      "El organizador de este torneo ha indicado que no cuenta para el ranking mundial.",
    "admin.view.otherwise": "Este torneo no se puede gestionar desde aquí.",
    "admin.competitionView.tabs": "Competición",
    "admin.competitionView.players": "Jugadores",
    "admin.competitionView.scores": "Resultados",
    "admin.sections.label": "El torneo y sus competiciones",
    "admin.sections.tournament": "Torneo",
    "admin.administrator.sections.label": "Las páginas del administrador",
    "admin.administrator.sections.tournaments": "Torneos",
    "admin.administrator.sections.accounts": "Cuentas",
    "admin.administrator.sections.worldRankings": "Ranking mundial",
    "admin.administrator.sections.importErrors": "Errores de importación",
    "admin.administrator.sections.logs": "Registros",
    "admin.administrator.title": "Administrador",
    "admin.accounts.title": "Cuentas",
    "admin.roles.add": "Añadir",
    "admin.roles.administrator.heading": "Administradores",
    "admin.roles.administrator.none": "No hay otros administradores",
    "admin.roles.administrator.removeTitle": "Quitar administrador",
    "admin.roles.administrator.removeExplanation":
      "{name} dejará de ser administrador de este sitio.",
    "admin.roles.world-ranking-officer.heading":
      "Responsables del ranking mundial",
    "admin.roles.world-ranking-officer.none":
      "No hay responsables del ranking mundial",
    "admin.roles.world-ranking-officer.removeTitle":
      "Quitar responsable del ranking mundial",
    "admin.roles.world-ranking-officer.removeExplanation":
      "{name} dejará de ser responsable del ranking mundial.",
    "admin.worldRankings.title": "Importar jugadores del ranking mundial",
    "admin.worldRankings.import": "Importar",
    "admin.worldRankings.log": "Cómo fue la importación",
    "admin.worldRankings.ac.reading":
      "Leyendo la lista de croquet de asociación",
    "admin.worldRankings.ac.read":
      "Jugadores de croquet de asociación leídos: {players}",
    "admin.worldRankings.ac.kept":
      "Jugadores de croquet de asociación guardados: {players}",
    "admin.worldRankings.ac.refused":
      "No se pudo leer la lista de croquet de asociación, así que sus jugadores se han dejado como estaban.",
    "admin.worldRankings.gc.reading": "Leyendo la lista de golf croquet",
    "admin.worldRankings.gc.read":
      "Jugadores de golf croquet leídos: {players}",
    "admin.worldRankings.gc.kept":
      "Jugadores de golf croquet guardados: {players}",
    "admin.worldRankings.gc.refused":
      "No se pudo leer la lista de golf croquet, así que sus jugadores se han dejado como estaban.",
    "admin.worldRankings.finished": "Terminado",
    "admin.worldRankings.failed": "La importación no terminó.",
    "admin.worldRankings.otherwise": "Algo ha fallado en el sitio.",
    "WorldRankingLists.Unreachable":
      "No se ha podido llegar al sitio del ranking mundial.",
    "WorldRankingLists.Unreadable":
      "La lista no tiene la forma de las listas del ranking mundial: una línea no se ha podido leer, no tiene a nadie o no está escrita en UTF-8.",
    "admin.importErrors.title": "Errores de importación",
    "admin.importErrors.none": "No hay errores de importación",
    "admin.importErrors.otherwise": "Algo ha fallado en el sitio.",
    "admin.logs.title": "Registros",
    "admin.logs.severity": "Gravedad",
    "admin.logs.text": "Buscar",
    "admin.logs.show": "Mostrar",
    "admin.logs.prune": "Depurar",
    "admin.logs.pruneAsk":
      "¿Quitar el registro anterior a la última hora? Nada lo recupera.",
    "admin.logs.removed": "Se quitaron {count} entradas",
    "admin.logs.none": "No hay entradas en el registro",
    "admin.logs.otherwise": "Algo ha fallado en el sitio.",
    "admin.hover.logs.show": "Mostrar las entradas que coinciden",
    "admin.hover.logs.prune": "Quitar el registro anterior a la última hora",
    "admin.hover.logs.pruneAgree":
      "Quitar el registro anterior a la última hora",
    "admin.importError.title": "Error de importación",
    "admin.importError.documentId": "Id del documento",
    "admin.importError.tournament": "Torneo",
    "admin.importError.competition": "Competición",
    "admin.importError.newSite": "Sitio nuevo",
    "admin.importError.oldSite": "Sitio antiguo",
    "ImportErrorKept.NotFound":
      "La importación no guardó ningún error de ese documento.",
    "admin.competitionView.otherwise":
      "Esta competición no se puede gestionar desde aquí.",
    "admin.competitions.block": "Bloque",
    "admin.competitions.knockout": "Eliminatoria",
    "admin.competitions.swiss": "Suizo",
    "admin.competitions.view": "Ver",
    "admin.competitions.edit": "Editar",
    "admin.competitions.up": "Subir",
    "admin.competitions.down": "Bajar",
    "admin.competitions.archive": "Archivar",
    "admin.competitions.restore": "Restaurar",
    "admin.competitions.archived": "Competiciones archivadas",
    "admin.competitions.none": "No hay competiciones",
    "admin.competitions.add": "Añadir competición",
    // The competition dialog.
    "admin.competition.addTitle": "Añadir competición",
    "admin.competition.editTitle": "Editar competición",
    "admin.competition.name": "Nombre",
    "admin.competition.kind": "Tipo",
    "admin.competition.bestOf": "Al mejor de",
    "admin.competition.rounds": "Rondas",
    "admin.competition.places": "Plazas",
    "admin.competition.round": "Ronda {number}",
    "admin.competition.bestOfs": "Al mejor de",
    "admin.competition.quarters": "Cuartos",
    "admin.competition.semis": "Semis",
    "admin.competition.final": "Final",
    "admin.competition.add": "Añadir",
    "admin.competition.save": "Guardar",
    "admin.competition.added": "Se ha añadido {name}.",
    "admin.competition.otherwise":
      "Esta competición no se puede guardar tal como está.",
    "CompetitionName.Missing": "Introduce un nombre.",
    "CompetitionName.TooLong":
      "Un nombre puede tener como mucho 254 caracteres.",
    "CompetitionName.NoLetterOrDigit":
      "Un nombre necesita una letra o un número.",
    "Tournament.KnockoutPlayerHasGames":
      "Hay jugadores de este cuadro con partidos, así que sus plazas no pueden cambiar.",
    "Tournament.CompetitionNameTaken":
      "Otra competición de este torneo ya tiene ese nombre.",
    "BestOf.NotWhole": "Introduce un número entero de partidas.",
    "BestOf.TooSmall":
      "Un encuentro tiene que ser al mejor de al menos 1 partida.",
    "Rounds.NotWhole": "Introduce un número entero de rondas.",
    "Rounds.TooSmall": "Un bloque tiene que jugarse en al menos 1 ronda.",
    "KnockoutDraw.EvenBestOf":
      "Un encuentro de eliminatoria tiene que tener ganador, así que es al mejor de un número impar de partidas.",
    "admin.hover.tournaments.new": "Crear un torneo nuevo",
    "admin.hover.tournaments.manage":
      "Gestionar los jugadores, equipos, competiciones y resultados de este torneo",
    "admin.hover.tournaments.edit": "Cambiar los datos de este torneo",
    "admin.hover.tournaments.scores":
      "Introducir los resultados de este torneo",
    "admin.hover.tournaments.players":
      "Ocuparse de los jugadores de este torneo",
    "admin.hover.competitions.view":
      "Abrir esta competición para ver e introducir sus jugadores y resultados",
    "admin.hover.tests.view":
      "Abrir este test para ver e introducir sus resultados",
    "admin.hover.teams.view":
      "Abrir este equipo para ver y gestionar sus jugadores",
    "admin.hover.dialog.player.add": "Añadir a este jugador al torneo",
    "admin.hover.dialog.player.save": "Guardar los cambios de este jugador",
    "admin.hover.dialog.team.add": "Añadir este equipo al torneo",
    "admin.hover.dialog.team.save": "Guardar los cambios de este equipo",
    "admin.hover.dialog.test.add": "Añadir este test al torneo",
    "admin.hover.dialog.test.save": "Guardar los cambios de este test",
    "admin.hover.dialog.competition.add": "Añadir esta competición al torneo",
    "admin.hover.dialog.competition.save":
      "Guardar los cambios de esta competición",
    "admin.hover.dialog.score.add": "Añadir este resultado a la competición",
    "admin.hover.dialog.score.save": "Guardar la corrección de este resultado",
    "admin.hover.dialog.carryForward.save":
      "Trasladar los resultados de este jugador",
    "admin.hover.dialog.tournament.new": "Crear este torneo",
    "admin.hover.dialog.tournament.edit": "Guardar los cambios de este torneo",
    "admin.hover.modal.cancel": "Cerrar esto sin guardar nada",
    "admin.hover.modal.ok": "Cerrar este mensaje",
    "admin.hover.tab": "Mostrar la pestaña {name}",
    "admin.hover.tournaments.archive":
      "Archivar este torneo; se puede restaurar",
    "admin.hover.tournaments.restore": "Recuperar este torneo archivado",
    "admin.hover.players.add": "Añadir un jugador a este torneo",
    "admin.hover.players.edit": "Cambiar los datos de este jugador",
    "admin.hover.players.up": "Subir a este jugador en la lista",
    "admin.hover.players.down": "Bajar a este jugador en la lista",
    "admin.hover.players.archive":
      "Archivar a este jugador; se puede restaurar",
    "admin.hover.players.restore": "Recuperar a este jugador archivado",
    "admin.hover.teams.add": "Añadir un equipo a este torneo",
    "admin.hover.teams.edit": "Cambiar los datos de este equipo",
    "admin.hover.teams.up": "Subir este equipo en la lista",
    "admin.hover.teams.down": "Bajar este equipo en la lista",
    "admin.hover.teams.archive": "Archivar este equipo; se puede restaurar",
    "admin.hover.teams.restore": "Recuperar este equipo archivado",
    "admin.hover.competitions.add": "Añadir una competición a este torneo",
    "admin.hover.competitions.edit": "Cambiar los datos de esta competición",
    "admin.hover.competitions.up": "Subir esta competición en la lista",
    "admin.hover.competitions.down": "Bajar esta competición en la lista",
    "admin.hover.competitions.archive":
      "Archivar esta competición; se puede restaurar",
    "admin.hover.competitions.restore": "Recuperar esta competición archivada",
    "admin.hover.tests.add": "Añadir un test entre dos equipos",
    "admin.hover.tests.edit": "Cambiar los datos de este test",
    "admin.hover.tests.up": "Subir este test en la lista",
    "admin.hover.tests.down": "Bajar este test en la lista",
    "admin.hover.tests.archive": "Archivar este test; se puede restaurar",
    "admin.hover.tests.restore": "Recuperar este test archivado",
    "admin.hover.tests.toTeams":
      "Ir a la pestaña Equipos para añadir los equipos que necesita un test",
    "admin.hover.scores.add":
      "Añadir el resultado de un partido a esta competición",
    "admin.hover.scores.edit": "Corregir este resultado",
    "admin.hover.scores.archive":
      "Archivar este resultado para que deje de contar; se puede restaurar",
    "admin.hover.scores.restore":
      "Recuperar este resultado archivado, para que vuelva a contar",
    "admin.hover.scores.withdraw":
      "Dejar este resultado en la lista pero que no cuente",
    "admin.hover.scores.unwithdraw":
      "Hacer que este resultado retirado vuelva a contar",
    "admin.hover.scores.up": "Mover este resultado antes en la lista",
    "admin.hover.scores.down": "Mover este resultado después en la lista",
    "admin.hover.competitionPlayers.add":
      "Poner al jugador elegido en esta competición",
    "admin.hover.competitionPlayers.up": "Subir a este jugador en la lista",
    "admin.hover.competitionPlayers.down": "Bajar a este jugador en la lista",
    "admin.hover.competitionPlayers.remove":
      "Sacar a este jugador de la competición",
    "admin.hover.competitionPlayers.withdraw":
      "Retirar a este jugador de la competición",
    "admin.hover.competitionPlayers.unwithdraw":
      "Volver a poner en la competición a este jugador retirado",
    "admin.hover.competitionPlayers.carryForward":
      "Trasladar los resultados de este jugador desde otra competición",
    "admin.hover.notes.add": "Escribir una nota nueva para este torneo",
    "admin.hover.notes.edit": "Cambiar esta nota",
    "admin.hover.notes.delete": "Eliminar esta nota",
    "admin.hover.note.add": "Guardar esta nota y añadirla al torneo",
    "admin.hover.note.save": "Guardar los cambios de esta nota",
    "admin.hover.people.add": "Dar el rol a esta persona",
    "admin.hover.people.remove": "Quitar el rol a esta persona",
    "admin.hover.worldRankings.import":
      "Obtener las clasificaciones mundiales y añadir a sus jugadores",
    "admin.modal.cancel": "Cancelar",
    "admin.modal.ok": "Aceptar",
    "admin.people.emailAddress": "Dirección de correo electrónico",
    "admin.people.remove": "Quitar",
    "admin.people.otherwise": "No se ha podido hacer.",
    "admin.managers.you": "Tú",
    "admin.managers.add": "Añadir gestor",
    "admin.managers.none": "No hay gestores",
    "admin.managers.removeTitle": "Quitar gestor",
    "admin.managers.removeExplanation":
      "{name} ya no podrá gestionar este torneo.",
    "admin.managers.removeYourself.explanation":
      "Ya no podrás gestionar este torneo, y nadie aquí puede deshacerlo por ti. Otro gestor puede volver a hacerte gestor.",
    "admin.managers.otherwise": "Esa dirección no se puede hacer gestora.",
    "admin.competitionPlayers.add": "Añadir jugador",
    // Beneath the drop-down, for a refusal with no words of its own.
    "admin.competitionPlayers.otherwise": "No se puede añadir a este jugador.",
    "admin.competitionPlayers.choose": "Jugador que añadir",
    "admin.competitionPlayers.nobody": "Elige un jugador",
    "admin.competitionPlayers.bye": "Bye",
    "admin.competitionPlayers.all":
      "Todos los jugadores están en la competición",
    "admin.competitionPlayers.none": "No hay jugadores",
    "admin.competitionPlayers.up": "Subir",
    "admin.competitionPlayers.down": "Bajar",
    "admin.competitionPlayers.remove": "Quitar",
    "admin.competitionPlayers.withdraw": "Retirar",
    "admin.competitionPlayers.unwithdraw": "Deshacer la retirada",
    "admin.competitionPlayers.withdrawn": "Jugadores retirados",
    "admin.competitionPlayers.removeTitle": "Quitar jugador",
    "admin.competitionPlayers.removeQuestion":
      "{name} saldrá de la competición. No se puede deshacer.",
    "admin.competitionPlayers.withdrawTitle": "Retirar jugador",
    "admin.competitionPlayers.withdrawQuestion":
      "{name} no jugará más en la competición, y las partidas que no ha jugado se decidirán sin su participación.",
    "admin.competitionPlayers.carryForward": "Arrastre",
    "admin.carryForward.title": "Arrastre - {name}",
    "admin.carryForward.save": "Guardar",
    "admin.carryForward.otherwise": "No se puede guardar este arrastre.",
    "admin.carryForward.matchWins": "Partidos ganados",
    "admin.carryForward.matchLosses": "Partidos perdidos",
    "admin.carryForward.gameWins": "Juegos ganados",
    "admin.carryForward.gameLosses": "Juegos perdidos",
    "admin.carryForward.hoopsFor": "Aros a favor",
    "admin.carryForward.hoopsAgainst": "Aros en contra",
    "CarryForward.MatchWinsNotWhole":
      "Escribe un número entero de partidos ganados.",
    "CarryForward.MatchWinsBelowZero": "Escribe 0 o más partidos ganados.",
    "CarryForward.MatchLossesNotWhole":
      "Escribe un número entero de partidos perdidos.",
    "CarryForward.MatchLossesBelowZero": "Escribe 0 o más partidos perdidos.",
    "CarryForward.GameWinsNotWhole":
      "Escribe un número entero de juegos ganados.",
    "CarryForward.GameWinsBelowZero": "Escribe 0 o más juegos ganados.",
    "CarryForward.GameLossesNotWhole":
      "Escribe un número entero de juegos perdidos.",
    "CarryForward.GameLossesBelowZero": "Escribe 0 o más juegos perdidos.",
    "CarryForward.HoopsForNotWhole":
      "Escribe un número entero de aros a favor.",
    "CarryForward.HoopsForBelowZero": "Escribe 0 o más aros a favor.",
    "CarryForward.HoopsAgainstNotWhole":
      "Escribe un número entero de aros en contra.",
    "CarryForward.HoopsAgainstBelowZero": "Escribe 0 o más aros en contra.",
    "admin.scores.add": "Añadir resultado",
    "admin.scores.none": "No hay resultados",
    "admin.scores.edit": "Editar",
    "admin.scores.drawNotFilledTitle": "Cuadro incompleto",
    "admin.scores.archive": "Archivar",
    "admin.scores.up": "Subir",
    "admin.scores.down": "Bajar",
    "admin.scores.restore": "Restaurar",
    "admin.scores.archived": "Resultados archivados",
    "admin.scores.archivedSaid": "Archivado",
    "admin.scores.withdraw": "Retirar",
    "admin.scores.unwithdraw": "Deshacer la retirada",
    "admin.scores.withdrawnSaid": "Retirado",
    "admin.scores.otherwise": "No se ha podido hacer.",
    "admin.score.title": "Añadir resultado",
    "admin.score.add": "Añadir partida",
    "admin.score.winner": "Ganador",
    "admin.score.winnerScore": "Puntos del ganador",
    "admin.score.loser": "Perdedor",
    "admin.score.loserScore": "Puntos del perdedor",
    "admin.score.beat": "ganó a",
    "admin.score.added": "Se añadió la partida que {winner} ganó a {loser}.",
    "admin.score.otherwise": "No se pudo añadir la partida.",
    "admin.score.correctTitle": "Editar resultado",
    "admin.score.save": "Guardar",
    "admin.score.notCorrected": "No se pudo corregir el resultado.",
    "Game.WinnerMissing": "Elige el ganador.",
    "Game.WinnerScoreMissing": "Escribe los puntos del ganador.",
    "Game.LoserMissing": "Elige el perdedor.",
    "Game.LoserScoreMissing": "Escribe los puntos del perdedor.",
    "Score.NoPoints": "Los puntos empiezan por un número.",
    "Game.SamePlayer": "Nadie juega contra sí mismo.",
    "Game.WinnerNotAhead":
      "El ganador tiene que tener más puntos que el perdedor, o marcarse como ganador.",
    "Game.LoserMarked":
      "Los puntos del perdedor no pueden marcarse como ganados.",
    "Game.ResultChanged":
      "Una corrección mantiene el resultado: una partida ganada sigue ganada, y una empatada sigue empatada.",
    "Competition.MatchDecided": "Su partido ya está decidido.",
    "Competition.DrawFull":
      "No se puede añadir el jugador porque el cuadro está lleno.",
    "Competition.DrawNotFilled":
      "No se pueden añadir resultados hasta que cada puesto del cuadro tenga un jugador o un bye.",
    "Competition.ByeOutsideKnockout": "Solo una eliminatoria puede tener byes.",
    "Competition.NotDrawnToMeet": "No les toca jugar entre sí.",
    "Competition.WinnerHasPlayedOn":
      "El ganador de este partido ya ha jugado su siguiente partida, así que no puede cambiar quién lo ganó.",
    "CompetitionPlayer.Withdrawn": "Un jugador retirado ya no juega.",
    "admin.players.add": "Añadir jugador",
    "admin.players.none": "No hay jugadores",
    "admin.players.edit": "Editar",
    "admin.players.archive": "Archivar",
    "admin.players.restore": "Restaurar",
    "admin.players.up": "Subir",
    "admin.players.down": "Bajar",
    "admin.players.archiveTitle": "Archivar jugador",
    "admin.players.archiveQuestion":
      "{name} se quitará de estas competiciones:",
    "admin.players.archive.explanation":
      "Restaurar al jugador no lo devolverá a estas competiciones.",
    "admin.players.archived": "Jugadores archivados",
    "admin.players.archivedSaid": "Archivado",
    "admin.player.addTitle": "Añadir jugador",
    "admin.player.editTitle": "Editar jugador",
    "admin.player.name": "Nombre",
    "admin.player.representing": "Representa a",
    "admin.player.worldRankingName": "Nombre en el ranking mundial",
    "admin.player.worldRankingKnown": "El ranking mundial conoce este nombre.",
    "admin.player.worldRankingQuestioned":
      "El ranking mundial no tiene ningún jugador con este nombre. Puede que esté mal escrito, o que el jugador sea nuevo en el ranking.",
    "admin.player.flag": "Bandera",
    "admin.player.add": "Añadir",
    "admin.player.save": "Guardar",
    "admin.player.added": "Se ha añadido a {name}.",
    "admin.player.otherwise": "Este jugador no se puede guardar tal como está.",
    "Tournament.PlayerNameTaken":
      "Otro jugador de este torneo ya tiene ese nombre.",
    "TournamentPlayer.NoSuchFlag": "Elige una de las banderas que hay.",
    "TournamentPlayer.NamedBye": "Un jugador no puede llamarse Bye.",
    "TournamentPlayer.NoLetterOrDigit":
      "Un nombre necesita una letra o un número.",
    "admin.player.byesTitle": "Los byes no se añaden",
    "admin.player.byes":
      "Un bye no es un jugador del torneo. Una eliminatoria ofrece Bye cuando se añaden sus jugadores, tantas veces como necesite su cuadro.",
    "admin.view.teams": "Equipos",
    "admin.view.tests": "Tests",
    "admin.teams.add": "Añadir equipo",
    "admin.teams.none": "No hay equipos",
    "admin.teams.edit": "Editar",
    "admin.teams.view": "Ver",
    "admin.teams.archive": "Archivar",
    "admin.teams.restore": "Restaurar",
    "admin.teams.up": "Subir",
    "admin.teams.down": "Bajar",
    "admin.teams.archived": "Equipos archivados",
    "admin.teams.archivedSaid": "Archivado",
    "admin.team.addTitle": "Añadir equipo",
    "admin.team.editTitle": "Editar equipo",
    "admin.team.name": "Nombre",
    "admin.team.shortName": "Nombre corto",
    "admin.team.shortName.explanation":
      "Cómo se llaman los tests del equipo, como AUS v ENG.",
    "admin.team.flag": "Bandera",
    "admin.team.add": "Añadir",
    "admin.team.save": "Guardar",
    "admin.team.added": "Se ha añadido {name}.",
    "admin.team.otherwise": "Este equipo no se puede guardar tal como está.",
    "admin.teamView.otherwise": "Este equipo no se puede ver desde aquí.",
    "admin.teamView.players": "Jugadores",
    "TeamName.Missing": "Di cómo se llama el equipo.",
    "TeamName.TooLong": "Ese nombre es demasiado largo.",
    "admin.notes.add": "Añadir nota",
    "admin.notes.none": "No hay notas",
    "admin.notes.edit": "Editar",
    "admin.notes.delete": "Eliminar",
    "admin.notes.deleteTitle": "Eliminar nota",
    "admin.notes.deleteQuestion": "¿Eliminar la nota «{title}»?",
    "admin.notes.delete.explanation":
      "Una nota eliminada desaparece para siempre y no se puede recuperar.",
    "admin.notes.otherwise": "No se ha podido hacer.",
    "admin.note.addTitle": "Añadir nota",
    "admin.note.editTitle": "Editar nota",
    "admin.note.title": "Título",
    "admin.note.description": "Descripción",
    "admin.note.write": "Escribir",
    "admin.note.preview": "Vista previa",
    "admin.note.toolbar": "Formato",
    "admin.note.tool.heading": "Encabezado",
    "admin.note.tool.bold": "Negrita",
    "admin.note.tool.italic": "Cursiva",
    "admin.note.tool.quote": "Cita",
    "admin.note.tool.code": "Código",
    "admin.note.tool.link": "Enlace",
    "admin.note.tool.numberedList": "Lista numerada",
    "admin.note.tool.bulletedList": "Lista con viñetas",
    "admin.note.tool.taskList": "Lista de tareas",
    "admin.note.add": "Añadir",
    "admin.note.save": "Guardar",
    "admin.note.otherwise": "Esta nota no se puede guardar así.",
    "ManagerNoteTitle.Missing": "Ponle un título a la nota.",
    "ManagerNoteTitle.TooLong": "Ese título es demasiado largo.",
    "ManagerNoteTitle.NoLetterOrDigit":
      "Un título necesita una letra o un número.",
    "ManagerNoteDescription.TooLong": "Esa descripción es demasiado larga.",
    "ManagerNoteToEdit.NoSuchManagerNote":
      "Esa nota ya no está. Puede que otro organizador la haya eliminado.",
    "EditManagerNote.NoSuchManagerNote":
      "Esa nota ya no está. Puede que otro organizador la haya eliminado.",
    "DeleteManagerNote.NoSuchManagerNote":
      "Esa nota ya no está. Puede que otro organizador la haya eliminado.",
    "ManagerNote.Deleted":
      "Esa nota ha sido eliminada. Puede que otro organizador la haya eliminado.",
    "CommentaryTitle.Missing": "Ponle un título al comentario.",
    "CommentaryTitle.TooLong": "Ese título es demasiado largo.",
    "CommentaryTitle.NoLetterOrDigit":
      "Un título necesita una letra o un número.",
    "Commentary.TitleTaken": "Otro comentario ya tiene ese título.",
    "CommentText.Missing": "Escribe algo en el comentario.",
    "CommentText.TooLong": "Ese comentario es demasiado largo.",
    "TeamShortName.Missing": "Dale al equipo un nombre corto.",
    "TeamShortName.TooLong": "Un nombre corto tiene como mucho 10 caracteres.",
    "TeamShortName.NoLetterOrDigit":
      "Un nombre corto necesita una letra o un número.",
    "Team.ShortNameLongerThanName":
      "Un nombre corto no puede ser más largo que el nombre del equipo.",
    "Team.NoSuchFlag": "Elige una de las banderas que hay.",
    "Team.Archived": "Ese equipo está archivado, y antes hay que restaurarlo.",
    "Team.InATest": "Ese equipo juega en un test, y no se puede archivar.",
    "Team.PlayerNameTaken": "Otro jugador de este equipo ya tiene ese nombre.",
    "TeamPlayer.NamedBye": "Un jugador no puede llamarse Bye.",
    "TeamPlayer.Archived":
      "Ese jugador está archivado, y antes hay que restaurarlo.",
    "TeamPlayer.HasGames": "Ese jugador ha jugado, y no se puede archivar.",
    "Tournament.TeamNameTaken":
      "Otro equipo de este torneo ya tiene ese nombre.",
    "Tournament.TeamShortNameTaken":
      "Otro equipo de este torneo ya tiene ese nombre corto.",
    "Tournament.NoSuchTeam":
      "Este torneo no tiene ningún equipo en esta dirección.",
    "Tournament.TeamArchived":
      "Este equipo está archivado, y solo se puede restaurar desde la pestaña Equipos.",
    "admin.tests.add": "Añadir test",
    "admin.tests.none": "No hay tests",
    "admin.tests.edit": "Editar",
    "admin.tests.view": "Ver",
    "admin.tests.archive": "Archivar",
    "admin.tests.restore": "Restaurar",
    "admin.tests.up": "Subir",
    "admin.tests.down": "Bajar",
    "admin.tests.archived": "Tests archivados",
    "admin.tests.twoTeamsNeeded":
      "Un test es entre dos equipos, así que antes hacen falta dos equipos.",
    "admin.tests.toTeams": "Ir a Equipos",
    "admin.tests.matches.one": "{count} partido",
    "admin.tests.matches.other": "{count} partidos",
    "admin.tests.bestOf": "al mejor de {games}",
    "admin.tests.otherwise": "No se ha podido hacer.",
    "admin.test.addTitle": "Añadir test",
    "admin.test.editTitle": "Editar test",
    "admin.test.firstTeam": "Equipo A",
    "admin.test.secondTeam": "Equipo B",
    "admin.test.versus": "v",
    "admin.test.starts": "Empieza",
    "admin.test.finishes": "Termina",
    "admin.test.expectedMatches": "Partidos previstos",
    "admin.test.bestOf": "Al mejor de",
    "admin.test.group": "Grupo",
    "admin.test.add": "Añadir",
    "admin.test.save": "Guardar",
    "admin.test.added": "Se ha añadido {name}.",
    "admin.test.otherwise": "Este test no se puede guardar tal como está.",
    "admin.testView.otherwise": "Este test no se puede ver desde aquí.",
    "AddTest.FirstTeamMissing": "Elige el primer equipo.",
    "AddTest.SecondTeamMissing": "Elige el segundo equipo.",
    "UpdateTest.FirstTeamMissing": "Elige el primer equipo.",
    "UpdateTest.SecondTeamMissing": "Elige el segundo equipo.",
    "ExpectedMatches.NotWhole": "Escribe un número entero de partidos.",
    "ExpectedMatches.TooSmall":
      "Un test tiene que tener previsto al menos 1 partido.",
    "TestGroup.TooLong": "Ese grupo es demasiado largo.",
    "Tournament.TestAgainstItself":
      "Un equipo no juega un test contra sí mismo.",
    "Tournament.TestFinishesBeforeStarts":
      "Un test no puede terminar antes de empezar.",
    "Tournament.TestStartsBeforeTournament":
      "Un test no puede empezar antes que su torneo.",
    "Tournament.TestFinishesAfterTournament":
      "Un test no puede terminar después que su torneo.",
    "Tournament.TestHasGamesInUse":
      "Este test tiene partidas, así que no se puede archivar hasta que se archiven.",
    "Tournament.TestHasGames":
      "Este test ya tiene partidas, así que sus equipos ya no se pueden cambiar.",
    "Tournament.ExpectedMatchesBelowStarted":
      "Ya han empezado más partidos que esos.",
    "Tournament.BestOfBelowGamesPlayed":
      "Dos jugadores ya han jugado más partidas que esas.",
    "Competition.ExpectedMatchesReached":
      "Este test ya ha empezado todos los partidos que tiene previstos.",
    "Competition.SameTeam":
      "Dos jugadores del mismo equipo no juegan entre sí.",
    "AddManager.NoSuchAccount":
      "Esa dirección no tiene ninguna cuenta que se pueda hacer gestora.",
    "Account.NotAnAdministrator": "Solo un administrador puede hacer eso.",
    "AddRole.NoSuchAccount":
      "Esa dirección no tiene ninguna cuenta a la que se pueda dar el rol.",
    "AddRole.NoSuchRole": "No existe ese rol.",
    "RemoveRole.NoSuchAccount": "No existe esa cuenta.",
    "RemoveRole.NoSuchRole": "No existe ese rol.",
    "RemoveRole.Yourself":
      "No puedes quitarte a ti mismo el rol de administrador.",
    "AccountsWithRole.NoSuchRole": "No existe ese rol.",
    "admin.scorers.add": "Añadir anotador",
    "admin.scorers.none": "No hay anotadores",
    "admin.scorers.removeTitle": "Quitar anotador",
    "admin.scorers.removeExplanation":
      "{name} ya no podrá anotar los resultados de este torneo.",
    "admin.scorers.otherwise": "Esa dirección no se puede hacer anotadora.",
    "AddScorer.NoSuchAccount":
      "Esa dirección no tiene ninguna cuenta que se pueda hacer anotadora.",
    "Tournament.AlreadyAManager":
      "Esa cuenta ya gestiona el torneo, y puede hacer todo lo que hace un anotador.",

    "TournamentName.Missing": "Di cómo se llama el torneo.",
    "TournamentName.TooShort": "Ese nombre es demasiado corto.",
    "TournamentName.TooLong": "Ese nombre es demasiado largo.",
    "TournamentName.AllLowerCase":
      "Un nombre no se escribe todo en minúsculas.",
    "TournamentName.AllCapitals": "Un nombre no se escribe todo en mayúsculas.",
    "TournamentName.NoLetterOrDigit":
      "Un nombre necesita una letra o un número.",
    "ReadOnlyDate.Unreadable": "Indica el día.",
    "Tournament.FinishesBeforeStarts":
      "Un torneo no puede terminar antes de empezar.",
    "Tournament.StartsAfterNextYear":
      "Un torneo no puede empezar después del año que viene.",
    "Tournament.FinishesAfterNextYear":
      "Un torneo no puede terminar después del año que viene.",
    "CreateTournament.NoSuchCountry": "Elige el país.",
    "TournamentSubtitle.TooLong":
      "El subtítulo puede tener como mucho 2000 caracteres.",
    "Tournament.NotAManager":
      "Solo quien gestiona este torneo puede cambiarlo.",
    "Tournament.NotAManagerOrScorer":
      "Solo quien gestiona o anota este torneo puede verlo.",
    "Tournament.Archived":
      "Este torneo está archivado, y hay que restaurarlo antes de poder cambiarlo.",
    "UpdateTournament.NoSuchTournament":
      "No hay ningún torneo en esta dirección.",

    // The sports keep the names their players use in Spanish, and the formats
    // named for a competition keep its name, as a name is not translated.
    "sport.ac": "Croquet Asociación",
    "sport.gc": "Golf Croquet",
    "sport.a6w": "Croquet americano de 6 aros",
    "sport.rc": "Ricochet",
    "sport.gb": "Gateball",
    "format.standard": "Estándar",
    "format.teams": "Por equipos",
    "format.eire-cup": "Eire Cup",
    "format.interstate-shield": "Interstate Shield",
    "format.gc-world-team-championship": "GC World Team Championship",
    "country.ad": "Andorra",
    "country.ae": "Emiratos Árabes Unidos",
    "country.af": "Afganistán",
    "country.ag": "Antigua y Barbuda",
    "country.ai": "Anguila",
    "country.al": "Albania",
    "country.am": "Armenia",
    "country.ao": "Angola",
    "country.ar": "Argentina",
    "country.as": "Samoa Americana",
    "country.at": "Austria",
    "country.au": "Australia",
    "country.aw": "Aruba",
    "country.ax": "Islas Åland",
    "country.az": "Azerbaiyán",
    "country.ba": "Bosnia y Herzegovina",
    "country.bb": "Barbados",
    "country.bd": "Bangladés",
    "country.be": "Bélgica",
    "country.bf": "Burkina Faso",
    "country.bg": "Bulgaria",
    "country.bh": "Baréin",
    "country.bi": "Burundi",
    "country.bj": "Benín",
    "country.bm": "Bermudas",
    "country.bn": "Brunéi",
    "country.bo": "Bolivia",
    "country.br": "Brasil",
    "country.bs": "Bahamas",
    "country.bt": "Bután",
    "country.bv": "Isla Bouvet",
    "country.bw": "Botsuana",
    "country.by": "Bielorrusia",
    "country.bz": "Belice",
    "country.ca": "Canadá",
    "country.catalonia": "Cataluña",
    "country.cc": "Islas Cocos",
    "country.cd": "República Democrática del Congo",
    "country.cf": "República Centroafricana",
    "country.cg": "República del Congo",
    "country.ch": "Suiza",
    "country.ci": "Costa de Marfil",
    "country.ck": "Islas Cook",
    "country.cl": "Chile",
    "country.cm": "Camerún",
    "country.cn": "China",
    "country.co": "Colombia",
    "country.cr": "Costa Rica",
    "country.cu": "Cuba",
    "country.cv": "Cabo Verde",
    "country.cx": "Isla de Navidad",
    "country.cy": "Chipre",
    "country.cz": "Chequia",
    "country.de": "Alemania",
    "country.dj": "Yibuti",
    "country.dk": "Dinamarca",
    "country.dm": "Dominica",
    "country.do": "República Dominicana",
    "country.dz": "Argelia",
    "country.ec": "Ecuador",
    "country.ee": "Estonia",
    "country.eg": "Egipto",
    "country.eh": "Sáhara Occidental",
    "country.england": "Inglaterra",
    "country.er": "Eritrea",
    "country.es": "España",
    "country.et": "Etiopía",
    "country.fi": "Finlandia",
    "country.fj": "Fiyi",
    "country.fk": "Islas Malvinas",
    "country.fm": "Micronesia",
    "country.fo": "Islas Feroe",
    "country.fr": "Francia",
    "country.ga": "Gabón",
    "country.gb": "Reino Unido",
    "country.gd": "Granada",
    "country.ge": "Georgia",
    "country.gf": "Guayana Francesa",
    "country.gh": "Ghana",
    "country.gi": "Gibraltar",
    "country.gl": "Groenlandia",
    "country.gm": "Gambia",
    "country.gn": "Guinea",
    "country.gp": "Guadalupe",
    "country.gq": "Guinea Ecuatorial",
    "country.gr": "Grecia",
    "country.gs": "Islas Georgias del Sur y Sandwich del Sur",
    "country.gt": "Guatemala",
    "country.gu": "Guam",
    "country.gw": "Guinea-Bisáu",
    "country.gy": "Guyana",
    "country.hk": "Hong Kong",
    "country.hm": "Islas Heard y McDonald",
    "country.hn": "Honduras",
    "country.hr": "Croacia",
    "country.ht": "Haití",
    "country.hu": "Hungría",
    "country.id": "Indonesia",
    "country.ie": "Irlanda",
    "country.il": "Israel",
    "country.im": "Isla de Man",
    "country.in": "India",
    "country.io": "Territorio Británico del Océano Índico",
    "country.iq": "Irak",
    "country.ir": "Irán",
    "country.is": "Islandia",
    "country.it": "Italia",
    "country.je": "Jersey",
    "country.jm": "Jamaica",
    "country.jo": "Jordania",
    "country.jp": "Japón",
    "country.ke": "Kenia",
    "country.kg": "Kirguistán",
    "country.kh": "Camboya",
    "country.ki": "Kiribati",
    "country.km": "Comoras",
    "country.kn": "San Cristóbal y Nieves",
    "country.kp": "Corea del Norte",
    "country.kr": "Corea del Sur",
    "country.kw": "Kuwait",
    "country.ky": "Islas Caimán",
    "country.kz": "Kazajistán",
    "country.la": "Laos",
    "country.lb": "Líbano",
    "country.lc": "Santa Lucía",
    "country.li": "Liechtenstein",
    "country.lk": "Sri Lanka",
    "country.lr": "Liberia",
    "country.ls": "Lesoto",
    "country.lt": "Lituania",
    "country.lu": "Luxemburgo",
    "country.lv": "Letonia",
    "country.ly": "Libia",
    "country.ma": "Marruecos",
    "country.mc": "Mónaco",
    "country.md": "Moldavia",
    "country.me": "Montenegro",
    "country.mg": "Madagascar",
    "country.mh": "Islas Marshall",
    "country.mk": "Macedonia del Norte",
    "country.ml": "Malí",
    "country.mm": "Myanmar",
    "country.mn": "Mongolia",
    "country.mo": "Macao",
    "country.mp": "Islas Marianas del Norte",
    "country.mq": "Martinica",
    "country.mr": "Mauritania",
    "country.ms": "Montserrat",
    "country.mt": "Malta",
    "country.mu": "Mauricio",
    "country.mv": "Maldivas",
    "country.mw": "Malaui",
    "country.mx": "México",
    "country.my": "Malasia",
    "country.mz": "Mozambique",
    "country.na": "Namibia",
    "country.nc": "Nueva Caledonia",
    "country.ne": "Níger",
    "country.nf": "Isla Norfolk",
    "country.ng": "Nigeria",
    "country.ni": "Nicaragua",
    "country.nl": "Países Bajos",
    "country.no": "Noruega",
    "country.np": "Nepal",
    "country.nr": "Nauru",
    "country.nu": "Niue",
    "country.nz": "Nueva Zelanda",
    "country.om": "Omán",
    "country.pa": "Panamá",
    "country.pe": "Perú",
    "country.pf": "Polinesia Francesa",
    "country.pg": "Papúa Nueva Guinea",
    "country.ph": "Filipinas",
    "country.pk": "Pakistán",
    "country.pl": "Polonia",
    "country.pm": "San Pedro y Miquelón",
    "country.pn": "Islas Pitcairn",
    "country.pr": "Puerto Rico",
    "country.ps": "Palestina",
    "country.pt": "Portugal",
    "country.pw": "Palaos",
    "country.py": "Paraguay",
    "country.qa": "Catar",
    "country.re": "Reunión",
    "country.ro": "Rumania",
    "country.rs": "Serbia",
    "country.ru": "Rusia",
    "country.rw": "Ruanda",
    "country.sa": "Arabia Saudí",
    "country.sb": "Islas Salomón",
    "country.sc": "Seychelles",
    "country.scotland": "Escocia",
    "country.sd": "Sudán",
    "country.se": "Suecia",
    "country.sg": "Singapur",
    "country.sh": "Santa Elena",
    "country.si": "Eslovenia",
    "country.sj": "Svalbard y Jan Mayen",
    "country.sk": "Eslovaquia",
    "country.sl": "Sierra Leona",
    "country.sm": "San Marino",
    "country.sn": "Senegal",
    "country.so": "Somalia",
    "country.sr": "Surinam",
    "country.st": "Santo Tomé y Príncipe",
    "country.sv": "El Salvador",
    "country.sy": "Siria",
    "country.sz": "Esuatini",
    "country.tc": "Islas Turcas y Caicos",
    "country.td": "Chad",
    "country.tf": "Territorios Australes Franceses",
    "country.tg": "Togo",
    "country.th": "Tailandia",
    "country.tj": "Tayikistán",
    "country.tk": "Tokelau",
    "country.tl": "Timor Oriental",
    "country.tm": "Turkmenistán",
    "country.tn": "Túnez",
    "country.to": "Tonga",
    "country.tr": "Turquía",
    "country.tt": "Trinidad y Tobago",
    "country.tv": "Tuvalu",
    "country.tw": "Taiwán",
    "country.tz": "Tanzania",
    "country.ua": "Ucrania",
    "country.ug": "Uganda",
    "country.um": "Islas Ultramarinas Menores de Estados Unidos",
    "country.us": "Estados Unidos",
    "country.uy": "Uruguay",
    "country.uz": "Uzbekistán",
    "country.va": "Ciudad del Vaticano",
    "country.vc": "San Vicente y las Granadinas",
    "country.ve": "Venezuela",
    "country.vg": "Islas Vírgenes Británicas",
    "country.vi": "Islas Vírgenes de los Estados Unidos",
    "country.vn": "Vietnam",
    "country.vu": "Vanuatu",
    "country.wales": "Gales",
    "country.wf": "Wallis y Futuna",
    "country.ws": "Samoa",
    "country.ye": "Yemen",
    "country.yt": "Mayotte",
    "country.za": "Sudáfrica",
    "country.zm": "Zambia",
    "country.zw": "Zimbabue",

    // The emails are the English ones, rewritten rather than translated line
    // by line; the placeholders each fills in are english.ts's, and say there
    // what they are.

    "Email.ConfirmAddress.subject":
      "Confirma tu dirección de correo electrónico para {siteName}",
    "Email.ConfirmAddress.body": `
<p>Hola:</p>

<p>
    Gracias por crear una cuenta en <strong>{siteName}</strong>.<br />
    Antes de empezar a usar tu cuenta, confirma tu dirección de correo electrónico
    pulsando el botón de abajo:
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
        Confirmar mi dirección de correo electrónico
    </a>
</p>

<p>
    Si el botón no funciona, también puedes confirmar tu dirección de correo electrónico abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si no has creado esta cuenta, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmAddressAgain.subject":
      "Un enlace nuevo para confirmar tu dirección de correo electrónico para {siteName}",
    "Email.ConfirmAddressAgain.body": `
<p>Hola:</p>

<p>
    Hace poco pediste un correo nuevo para confirmar tu dirección de correo electrónico para <strong>{siteName}</strong>.<br />
    Confirma tu dirección de correo electrónico pulsando el botón de abajo:
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
        Confirmar mi dirección de correo electrónico
    </a>
</p>

<p>
    Si el botón no funciona, también puedes confirmar tu dirección de correo electrónico abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una vez confirmada, podrás seguir usando tu cuenta sin interrupciones.
</p>

<p>
    Si no has pedido este correo, puedes ignorarlo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyRegistered.subject":
      "Alguien ha intentado registrarse con tu dirección de correo electrónico",
    "Email.AlreadyRegistered.body": `
<p>Hola:</p>

<p>
    Alguien ha intentado registrarse en <strong>{siteName}</strong> con esta
    dirección de correo electrónico, que ya tiene una cuenta. No ha cambiado
    nada en tu cuenta.<br />
    Si has sido tú, ya tienes una cuenta y puedes iniciar sesión en ella:
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
        Iniciar sesión
    </a>
</p>

<p>
    Si has olvidado tu contraseña, puedes restablecerla aquí:
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
        He olvidado mi contraseña
    </a>
</p>

<p>
    Si no has sido tú, no tienes que hacer nada. Nadie ha recibido una forma de
    entrar en tu cuenta.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmNewEmailAddress.subject":
      "Confirma el traslado de tu cuenta de {siteName} a esta dirección",
    "Email.ConfirmNewEmailAddress.body": `
<p>Hola:</p>

<p>
    Alguien con la sesión iniciada en una cuenta de <strong>{siteName}</strong>
    ha pedido trasladarla a esta dirección de correo electrónico. Si has sido tú,
    confírmalo aquí, con la sesión iniciada en esa cuenta. El enlace funciona
    durante 24 horas.
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
        Trasladar mi cuenta
    </a>
</p>

<p>
    O copia esta dirección en tu navegador:<br />
    {link}
</p>

<p>
    Si no has sido tú, no tienes que hacer nada. No se trasladará ninguna cuenta aquí.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.AlreadyHasAnAccount.subject":
      "Alguien ha pedido trasladar una cuenta a tu dirección de correo electrónico",
    "Email.AlreadyHasAnAccount.body": `
<p>Hola:</p>

<p>
    Alguien con la sesión iniciada en una cuenta de <strong>{siteName}</strong>
    ha pedido trasladarla a esta dirección de correo electrónico, que ya tiene
    una cuenta propia. No se ha trasladado nada, y no ha cambiado nada en tu
    cuenta.
</p>

<p>
    Si has sido tú, ya tienes una cuenta en esta dirección y puedes iniciar
    sesión en ella.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.EmailAddressChanged.subject":
      "Tu cuenta de {siteName} se ha trasladado",
    "Email.EmailAddressChanged.body": `
<p>Hola:</p>

<p>
    Tu cuenta de <strong>{siteName}</strong> se acaba de trasladar a otra
    dirección de correo electrónico, {emailAddress}, y a partir de ahora se
    inicia sesión con esa dirección.
</p>

<p>
    Si no has sido tú, otra persona tiene tu cuenta. Responde a este correo y
    cuéntanoslo.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.PasswordChanged.subject":
      "Se ha cambiado tu contraseña de {siteName}",
    "Email.PasswordChanged.body": `
<p>Hola:</p>

<p>
    Se acaba de cambiar la contraseña de tu cuenta de <strong>{siteName}</strong>,
    y se ha cerrado la sesión en todos los demás navegadores que la tenían iniciada.<br />
    Si has sido tú, no tienes que hacer nada.
</p>

<p>
    Si no has sido tú, otra persona tiene tu contraseña. Establece una nueva
    aquí y se cerrará su sesión:
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
        He olvidado mi contraseña
    </a>
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetNewPassword.subject":
      "Establece una contraseña nueva para {siteName}",
    "Email.SetNewPassword.body": `
<p>Hola:</p>

<p>
    Hace poco pediste restablecer tu contraseña de <strong>{siteName}</strong>.<br />
    Puedes restablecerla pulsando el botón de abajo:
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
        Restablecer contraseña
    </a>
</p>

<p>
    Si el botón no funciona, también puedes restablecer tu contraseña abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Si no has pedido restablecer tu contraseña, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.SetPassword.subject": "Establece una contraseña para {siteName}",
    "Email.SetPassword.body": `
<p>Hola:</p>

<p>
    Tu cuenta de <strong>{siteName}</strong> no tiene contraseña: inicias sesión con Google.<br />
    Has pedido establecer una, para poder iniciar sesión también con tu dirección de correo electrónico y una contraseña.
    Puedes establecerla pulsando el botón de abajo:
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
        Establecer contraseña
    </a>
</p>

<p>
    Si el botón no funciona, también puedes establecer tu contraseña abriendo este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    El enlace funciona durante una hora. Si no has pedido establecer una contraseña, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegisterInstead.subject":
      "No hay ninguna cuenta de {siteName} para esta dirección de correo electrónico",
    "Email.RegisterInstead.body": `
<p>Hola:</p>

<p>
    Se ha pedido restablecer la contraseña de una dirección de correo electrónico
    que no está asociada a ninguna cuenta de <strong>{siteName}</strong>.
</p>

<p>
    Si quieres usar nuestro servicio, puedes crear una cuenta nueva aquí:<br />
    <a href="{site}/account/register">{site}/account/register</a>
</p>

<p>
    Si no has hecho esta petición, puedes ignorar este correo sin problema.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.ConfirmForgetting.subject":
      "Confirma que quieres que se olvide tu cuenta de {siteName}",
    "Email.ConfirmForgetting.body": `
<p>Hola:</p>

<p>
    Has pedido que se olvide tu cuenta de <strong>{siteName}</strong>.<br />
    Sigue el botón de abajo para ver qué significa eso, y para confirmar con
    seguridad que es lo que quieres:
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
        Olvidar mi cuenta
    </a>
</p>

<p>
    Si el botón no funciona, también puedes abrir este enlace en tu navegador:<br />
    <a href="{link}">{link}</a>
</p>

<p>
    Una vez olvidada, nadie podrá volver a leer tu nombre ni tu dirección de
    correo electrónico, y no se podrá iniciar sesión en tu cuenta. No se puede
    deshacer.
</p>

<p>
    El enlace funciona una sola vez, hasta 15 minutos después de que lo
    pidieras, y solo mientras tengas iniciada la sesión en esta cuenta. Después,
    vuelve a pedirlo desde tu cuenta.
</p>

<p>
    Si no lo has pedido tú, no pasará nada a menos que alguien siga el enlace.
    Aun así, lo ha pedido alguien con la sesión iniciada en tu cuenta, así que
    establece una contraseña nueva desde la página de contraseña olvidada para
    asegurarte de que no pueda volver a iniciar sesión.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.RegistrationsSuspended.subject":
      "El registro está suspendido: no se puede contactar con {service}",
    "Email.RegistrationsSuspended.body": `
<p>Hola:</p>

<p>
    {siteName} no pudo contactar con {service} a las {when}. Hasta que responda,
    a quienes lo necesiten, para registrarse o para establecer una contraseña
    nueva, se les dice que vuelvan a intentarlo más tarde.
</p>

<p>
    No hay nada que levantar. Cada intento vuelve a preguntar a {service}, y las
    páginas vuelven a funcionar en cuanto responde.
</p>

<p>
    Mientras {service} siga sin responder, recibirás como mucho un correo por
    hora sobre ello.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.DatabaseUnreachable.subject":
      "{siteName} no puede acceder a su base de datos",
    "Email.DatabaseUnreachable.body": `
<p>Hola:</p>

<p>
    {siteName} no pudo acceder a su base de datos a las {when}. Hasta que responda, cada página que la necesita dice a los lectores que el sitio no está disponible y que lo intenten de nuevo más tarde.
</p>

<p>
    No hay nada que levantar. Cada petición pide una conexión de nuevo, y el sitio vuelve a funcionar en cuanto la base de datos responde.
</p>

<p>
    Mientras la base de datos siga caída, recibirás un correo sobre ello como máximo una vez cada {minutes} minutos.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,

    "Email.UnhandledError.subject": "{siteName} falló en una solicitud",
    "Email.UnhandledError.body": `
<p>Hola:</p>

<p>
    {siteName} falló a las {when} en una solicitud de {asked}. Al lector se le mostró la referencia {reference}, y el registro tiene la causa debajo de ella.
</p>

<p>
    Un sitio roto suele fallar en cada solicitud, así que recibirás como máximo 4 correos electrónicos por hora sobre fallos. Los siguientes quedan igualmente en el registro.
</p>

<p>
    {emailFromName}<br />
    {siteName}
</p>
`,
  },
};
