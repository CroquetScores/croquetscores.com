# Ayuda para desarrolladores de aplicaciones

Croquet Scores tiene una API pública, para que una aplicación pueda seguir los torneos de un deporte sin leer las páginas del sitio. Responde en JSON y, durante el desarrollo, está en `/api/v0`. Cuando se publique, estará en `/api/v1`.

## En qué punto está {#where-it-stands}

La API está en desarrollo, y por eso es `v0`. Cuando todos los interesados la acepten, pasará a ser `v1`.

Un cambio que rompe una aplicación nunca se hace en una versión que ya existe. Se hace como una versión nueva junto a la antigua, de modo que una aplicación escrita para `v1` sigue funcionando cuando llegue `v2`. Lo que no cuenta como romper se dice a continuación, para que una aplicación pueda escribirse esperándolo.

## Pueden añadirse campos {#fields-may-be-added}

En el futuro puede añadirse un campo a una respuesta sin cambiar la versión, ya que una aplicación escrita para ignorar lo que no conoce no se rompe por ello. Por eso una aplicación debe ignorar todo campo que no conozca y no debe fallar por uno así, ni por el orden en que llegan los campos.

Lo que se le ha dicho a una aplicación no cambia sin una versión nueva: el nombre de un campo, su tipo y lo que significa.

Las palabras del `message` de un error pueden reformularse en cualquier momento. Una aplicación lee el `code` y nunca el `message`.

## Preguntar con economía {#reading-cheaply}

Cada respuesta lleva un `ETag`. Haz de nuevo la misma pregunta enviándolo en `If-None-Match`, y la respuesta es `304` y nada más cuando nada ha cambiado. Un torneo y una competición llevan también un `Last-Modified`, con el que puede enviarse `If-Modified-Since`. Una lista se juzga solo por su `ETag`, porque una lista que ha perdido un torneo no tiene una fecha más reciente para decirlo.

Cada torneo de una lista lleva además un `etag` propio, hecho de lo que dice. Una aplicación a la que se le dice que una lista ha cambiado puede saber cuáles de sus torneos cambiaron sin compararlos campo por campo.

Una lista de los torneos de un año acepta `changedSince`, escrito como `2026-03-01T10:00:00Z`, para que una aplicación que vuelve a leer un año pida solo lo que cambió. Una lista es una página de 100 como máximo, con el camino a la siguiente, y acepta `page` y `pageSize`.

Lo que responde cada dirección está en [los puntos de acceso de la API](endpoints.md).

## Claves {#keys}

Leer es para cualquiera: una petición sin clave se responde como una con clave. Una clave dice contra el límite de quién se cuenta una petición y qué puede hacer quien llama, además de leer.

Crea una clave en tu cuenta, en **Claves de API**, con **Crear una clave**. Envíala con cada petición como un token de portador (bearer token):

```
Authorization: Bearer <the key>
```

Nunca pongas una clave en una dirección, que los navegadores, los proxies y los registros guardan. Mantén una clave tan secreta como una contraseña. Una clave que no funciona se rechaza con `401`, para que una aplicación que cree estar enviando una sepa que no es así.

## Límites {#allowances}

Cada petición cuenta contra un límite, uno por minuto y otro por día, pida lo que pida. Una clave empieza con 60 por minuto y 10.000 por día, algo que un administrador puede aumentar para un socio. Una petición sin clave, o con una clave que no funciona, cuenta contra su dirección, con 10 por minuto y 500 por día.

Una aplicación que ha agotado su límite recibe la respuesta `429`, con cuánto debe esperar. Una petición respondida con `304` cuenta como cualquier otra.

## Errores {#errors}

Todo error tiene la misma forma:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

El `code` es en lo que se apoya una aplicación. El `field` es la parte de la petición que estaba mal, cuando la había. El `message` es para quien lee un registro.
