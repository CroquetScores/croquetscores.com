# Ajuda para desenvolvedores de aplicativos

O Croquet Scores tem uma API pública, para que um aplicativo possa acompanhar os torneios de um esporte sem ler as páginas do site. Ela responde em JSON e, durante o desenvolvimento, fica em `/api/v0`. Quando for lançada, ficará em `/api/v1`.

## Em que pé ela está {#where-it-stands}

A API está em desenvolvimento, e é por isso que é `v0`. Quando todos os envolvidos a aceitarem, ela passará a ser `v1`.

Uma mudança que quebra um aplicativo nunca é feita numa versão que já existe. Ela é feita como uma nova versão ao lado da antiga, de modo que um aplicativo escrito para a `v1` continua funcionando quando a `v2` chegar. O que não conta como quebra é dito a seguir, para que um aplicativo possa ser escrito já esperando por isso.

## Campos podem ser acrescentados {#fields-may-be-added}

Um campo pode ser acrescentado a uma resposta no futuro, sem mudar a versão, já que um aplicativo escrito para ignorar o que não conhece não quebra por causa disso. Por isso, um aplicativo deve ignorar todo campo que não conhece e não pode falhar por causa de um campo assim, nem pela ordem em que os campos chegam.

O que foi dito a um aplicativo não muda sem uma nova versão: o nome de um campo, o seu tipo e o que ele significa.

As palavras da `message` de um erro podem ser reescritas a qualquer momento. Um aplicativo lê o `code` e nunca a `message`.

## Perguntar com economia {#reading-cheaply}

Toda resposta traz um `ETag`. Faça a mesma pergunta de novo enviando-o em `If-None-Match`, e a resposta é `304`, sem mais nada, quando nada mudou. Um torneio e uma competição trazem também um `Last-Modified`, com o qual `If-Modified-Since` pode ser enviado. Uma lista é conferida só pelo seu `ETag`, porque uma lista que perdeu um torneio não tem uma data mais recente para dizer isso.

Cada torneio de uma lista traz também um `etag` próprio, feito do que ele diz. Um aplicativo que fica sabendo que uma lista mudou consegue ver quais torneios dela mudaram sem compará-los campo a campo.

Uma lista dos torneios de um ano aceita `changedSince`, escrito como `2026-03-01T10:00:00Z`, para que um aplicativo que relê um ano peça só o que mudou. Uma lista é uma página de no máximo 100, com o caminho para a próxima, e aceita `page` e `pageSize`.

O que cada endereço responde está nos [endpoints GET](get-endpoints.md), e o que cada um que muda algo recebe está nos [endpoints POST](post-endpoints.md).

## Chaves {#keys}

Ler é para qualquer pessoa: uma requisição sem chave é respondida como uma com chave. Uma chave diz contra a cota de quem a requisição é contada e o que quem chama pode fazer além de ler.

Uma chave é criada para ler, ou para ler e escrever. Uma chave que escreve pode, em um torneio, fazer o que a conta para a qual foi criada pode fazer, o que é mais para um organizador do que para um anotador (veja [quem pode escrever](post-endpoints.md#who-may-write)); e uma chave pode ser limitada a um torneio.

Crie uma chave na sua conta, em **Chaves de API**, com **Criar uma chave**. Envie-a com cada requisição como um token de portador (bearer token):

```
Authorization: Bearer <the key>
```

Nunca coloque uma chave num endereço, que navegadores, proxies e logs guardam. Mantenha uma chave tão secreta quanto uma senha. Uma chave que não funciona é recusada com `401`, para que um aplicativo que acha que está enviando uma descubra que não está.

## Cotas {#allowances}

Cada requisição conta contra uma cota, uma por minuto e uma por dia, seja o que for que ela peça. Uma chave começa com 60 por minuto e 10.000 por dia, o que um administrador pode aumentar para um parceiro. Uma requisição sem chave, ou com uma chave que não funciona, conta contra o seu endereço, com 10 por minuto e 500 por dia.

Um aplicativo que usou toda a sua cota recebe a resposta `429`, com quanto tempo deve esperar. Uma requisição respondida com `304` conta como qualquer outra.

## Erros {#errors}

Todo erro tem a mesma forma:

```json
{
  "code": "Tournaments.YearMissing",
  "message": "Say which year, as year=2026.",
  "field": "year"
}
```

O `code` é no que um aplicativo se apoia. O `field` é a parte da requisição que estava errada, quando havia uma. A `message` é para quem lê um log.
