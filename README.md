## Serviço de classificação de praias para realizar Surf

Este projeto é uma **cópia** baseada no projeto do [Waldemar Neto](https://github.com/waldemarnt/node-typescript-api/tree/master).
Ele foi realizado seguindo os passos da [playlist](https://www.youtube.com/watch?v=W2ld5xRS3cY&list=PLz_YTBuxtxt6_Zf1h-qzNsvVt46H8ziKh&index=2&ab_channel=WaldemarNeto-DevLab) de aulas gratuítas disponibilizada no youtube.

Vale avisar sobre algumas diferenças entre os projetos.

1. Foi adotado um modelo de exportação padrão (`export default`) para as classes da aplicação.
2. A nomeação de classes foi feita usando uma convenção de nomes para descrever a sua funcionalidade, apesar da estrutura de pastas já deixar explícito.
Classes dentro dos diretórios `clients`, `controllers`, `models` e `services` foram acompanhadas respectivamente de `Client`, `Controller`, `Repository` e `Service`.
3. As classes modelos (models) foram nomeadas com `Repository` por me lembrar implementações feitas Java.
4. A classe `Request` implementada pelo Waldemar foi renomeada para `HttpClient` por me lembrar de implementações feitas em Angular.
5. As funções de acessar e fechar o banco de dados foram colocadas em uma classe específica chamada `Database` para manter as convenções.
6. Algumas declarações de tipos foram feitas de forma diferente como a do express porque resolvi seguir outros modelos encontrados pela internet.
7. O estilizador de código do `prittier` foi removido em virtude da utilização do eslint para realizar este trabalho.
8. Foi adicionar a dependência do `pre-commit` para manter a qualidade de código.
Para ignorar execuções das etapas durante o commit é necessário utilizar `--no-verify` no comando de `commit` (ex: `git commit --no-verify -m "msg"`).
9. Alguns `comandos` foram adicionados, removidos, ou renomeados do projeto original.
10. O `github workflow` foi configurado de forma distinta para evitar o deploy na master.
11. O `postman/insominia` foram descartados em virtude do desejo em utilizar o `CURL` em testes manuais, e assim ter um contato mais direto com ferramentas de terminal.
12. Foi utilizado o padrão `Factory` para evitar a passagem de classes concretas por construtor na classe 'ForecastService', como foi feito pelo Waldemar. Comentei no seu [vídeo](https://www.youtube.com/watch?v=H_a1zliq5KA&list=PLz_YTBuxtxt6_Zf1h-qzNsvVt46H8ziKh&index=36&ab_channel=WaldemarNeto-DevLab) sobre e ele me pediu para realizar uma implementação para poder mostrar as diferenças de implementação. Este padrão é muito utilizado em Java e simplesmente exige uma interface intermediária que cria a classe alvo, neste caso era o `RatingService`. A classe concreta para este papel é a `RatingServiceFactory`.
13. O parametro da autenticação foi alterado de `x-access-token` para `authorization`.

## Get started (Inicializando o projeto)

```console
$ yarn # Para instalar as dependências

$ yarn dev # Inicializa o projeto em modo de desenvolvimento
$ yarn start # Inicializa o projeto em modo de produção

$ yarn test # Realiza todos os testes
$ yarn test:unit # Realiza todos os testes de unidade
$ yarn test:functional # Realiza todos os testes funcionais
```

## Avisos

Caso você tenham algum problema com o script encontrado em `scripts/deploy.sh`, vale lembrar que ele deve ter permissão de execução (ex: `chmod +x scripts/deploy.sh`).

## Referencias gerais

* [Video aulas](https://www.youtube.com/watch?v=rTzdy3JjZFg&list=PLz_YTBuxtxt6_Zf1h-qzNsvVt46H8ziKh&index=24&ab_channel=WaldemarNeto-DevLab)
* [Regras do Eslint](https://eslint.org/docs/user-guide/configuring/rules)
