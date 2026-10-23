# Contraseñas

## Lo que el sitio pide de una contraseña

Siempre que eliges una contraseña, al confirmar tu dirección de correo electrónico, al establecer una contraseña nueva o al cambiarla, el sitio pide que la contraseña:

- tenga **al menos 12 caracteres**;
- se escriba dos veces igual, la segunda como **Confirmar contraseña**;
- no sea una que haya **aparecido en una filtración de datos** en algún otro sitio.

Los espacios al principio y al final se eliminan, como cuando inicias sesión, así que un espacio suelto no te deja fuera. Los espacios del medio se conservan, lo que conviene a una frase de contraseña de varias palabras.

## Elegir una buena

El sitio pide longitud y nada más: ni mayúsculas, ni dígitos, ni símbolos. Eso sigue el consejo actual, que dice que una contraseña larga, que no se use en ningún otro sitio, es más fuerte y más fácil de recordar que una corta hecha difícil de leer. El consejo que sigue el sitio es el del Instituto Nacional de Estándares y Tecnología de Estados Unidos, que puedes leer en [las pautas de identidad digital del NIST, sobre contraseñas](https://pages.nist.gov/800-63-4/sp800-63b.html).

En resumen:

- **Hazla larga.** Varias palabras sin relación forman una frase de contraseña fácil de recordar y difícil de adivinar.
- **Úsala aquí y en ningún otro sitio.** Una contraseña usada en dos sitios es tan segura como el más débil de los dos, y las contraseñas robadas en uno se prueban en otros.
- **Guárdala en un gestor de contraseñas** si puedes, que puede crear una contraseña larga para cada sitio y recordarlas todas.
- **No la cambies según un calendario.** Cámbiala cuando creas que otra persona puede conocerla, y no en otro caso.

## Cómo comprueba el sitio si una contraseña se ha filtrado

Se publican listas de contraseñas robadas en otros sitios, y quienes intentan entrar en cuentas ajenas las prueban primero. Por eso, cuando eliges una contraseña, el sitio pregunta a un servicio externo si está en una de esas listas. El servicio lo gestiona un tercero, y el sitio lo usa solo para esto.

Tu contraseña no sale del sitio. El sitio hace de ella una huella de un solo sentido, que no puede convertirse de nuevo en la contraseña, y envía al servicio solo los cinco primeros caracteres de esa huella. El servicio responde con el resto de la huella de cada contraseña filtrada que empieza igual, que son varios cientos, y el sitio busca la suya entre ellas. Así el servicio sabe que tu contraseña es una entre varios cientos, y nunca cuál. [Cómo funciona esto, explicado por Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), lo cuenta con más detalle.

Una contraseña que está en la lista se rechaza con un mensaje que lo dice, y eliges otra. Si no se puede contactar con el servicio, tu contraseña no se puede comprobar ahora, así que no se acepta ni se cambia. Inténtalo de nuevo en unos minutos. Un enlace que se te envió sigue funcionando hasta que caduque.

## Cambiar tu contraseña

Elige **Cambiar contraseña** en el menú **Cuenta**. La página te pide tu **Contraseña actual**, una **Contraseña nueva** y otra vez la nueva como **Confirmar contraseña**. Se pide la actual porque tener la sesión iniciada no basta: un teléfono desbloqueado y olvidado dejaría, si no, que quien lo recoja te deje fuera.

Una vez cambiada, sigues con la sesión iniciada en este navegador y se cierra la de todos los demás. El sitio envía un correo a tu dirección para decir que la contraseña se cambió, de modo que si no fuiste tú, lo sepas. Una contraseña actual incorrecta cuenta para los mismos límites que tiene iniciar sesión.

Si no recuerdas la contraseña actual, la página remite a **¿Olvidaste tu contraseña?**.

Siguiente: [Cuidar tu cuenta](looking-after-your-account.md).
