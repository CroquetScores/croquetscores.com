# Senhas

## O que o site pede de uma senha

Sempre que você escolhe uma senha, ao confirmar o seu endereço de e-mail, ao definir uma nova senha ou ao alterá-la, o site pede que ela:

- tenha **pelo menos 12 caracteres**;
- seja digitada duas vezes igual, a segunda como **Confirmar senha**;
- não seja uma que **apareceu em um vazamento de dados** em outro lugar.

Os espaços no começo e no fim são descartados, como ao entrar, então um espaço sem querer não deixa você de fora. Os espaços no meio são mantidos, o que serve para uma frase-senha de várias palavras.

## Escolhendo uma boa

O site pede o tamanho e nada mais: nem letras maiúsculas, nem dígitos, nem símbolos. Isso segue o conselho atual, segundo o qual uma senha longa, nunca usada em outro lugar, é mais forte e mais fácil de lembrar do que uma curta tornada difícil de ler. O conselho que o site segue é o do Instituto Nacional de Padrões e Tecnologia dos Estados Unidos (NIST), que você pode ler nas [diretrizes de identidade digital do NIST, sobre senhas](https://pages.nist.gov/800-63-4/sp800-63b.html).

Em resumo:

- **Faça-a longa.** Várias palavras sem relação entre si formam uma frase-senha fácil de lembrar e difícil de adivinhar.
- **Use-a aqui e em nenhum outro lugar.** Uma senha usada em dois sites é tão segura quanto o mais fraco deles, e senhas roubadas de um são testadas em outros.
- **Guarde-a em um gerenciador de senhas**, se puder, que pode criar uma senha longa para cada site e lembrar todas.
- **Não a troque por calendário.** Troque quando achar que outra pessoa pode conhecê-la, e não fora disso.

## Como o site verifica se uma senha vazou

São publicadas listas de senhas roubadas de outros sites, e quem tenta entrar em contas as experimenta primeiro. Por isso, quando você escolhe uma senha, o site pergunta a um serviço externo se ela está em uma dessas listas. O serviço é mantido por terceiros, e o site o usa só para isso.

A sua senha não sai do site. O site faz dela uma impressão digital de mão única, que não pode ser transformada de volta na senha, e envia ao serviço apenas os cinco primeiros caracteres dessa impressão. O serviço responde com o resto da impressão de cada senha vazada que começa do mesmo modo, que são algumas centenas, e o site procura a sua entre elas. Assim, o serviço fica sabendo que a sua senha é uma entre algumas centenas, e nunca qual. [Como isso funciona, explicado pela Cloudflare](https://blog.cloudflare.com/validating-leaked-passwords-with-k-anonymity/), diz mais.

Uma senha que está na lista é recusada com uma mensagem dizendo isso, e você escolhe outra. Se o serviço não puder ser alcançado, a sua senha não pode ser verificada agora, então ela não é aceita nem alterada. Tente de novo em alguns minutos. Um link que você recebeu continua funcionando até expirar.

## Alterando a sua senha

Escolha **Alterar senha** no menu **Conta**. A página pede a sua **Senha atual**, uma **Nova senha** e ela de novo como **Confirmar senha**. A atual é pedida porque estar conectado não basta: um celular deixado desbloqueado permitiria a quem o pegasse deixar você de fora.

Depois da alteração, você continua conectado neste navegador e todos os outros são desconectados. O site envia um e-mail ao seu endereço avisando que a senha foi alterada, para que você descubra se não foi você. Uma senha atual errada conta para os mesmos limites da entrada.

Se você não lembra a senha atual, a página indica **Esqueci a senha?**.

A seguir: [Cuidando da sua conta](looking-after-your-account.md).
