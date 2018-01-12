Router
===============

Router é um *bitcode* de roteamento para o servidor [thrust-bitcodes/http](https://github.com/thrust-bitcodes/http), usado para criar rotas de requisição REST, com suporte a middleware, rotas virtuais, dentre outros.

## Tutorial

```javascript
var server = require('thrust-bitcodes/http')
var router = require('thrust-bitcodes/router')
var auth   = require('thrust-bitcodes/authentication')

router.middlewares.push(auth.validateAccess)

router.middlewares.push(function(params, request, response) {
  print(JSON.stringify(params))
})

server.createServer(8778, router)
```
O modulo router contém as seguintes propriedades

```javascript
/**
 * Usado para configurar o diretório root,
 * de onde o roteamento pesquisará pelos endpoints
 * */
applicationDirectory /*String ["./"]*/

/**
 * Usado para adicionar middlewares na aplicação.
 * Middlewares são funções com assinatura (prams, request, response)
 * que são chamadas no inicio do processamento das rotas.
 * Caso algum middleware retorne false, a chamada é interrompida.
*/
middlewares /*Array*/

/**
 * Usado para adicionar rotas virtuais na aplicação.
*/
vroutes /*Object*/
```

Acesse também os outros módulos utilizados no exemplo para melhor entendimento:

- [thrust-bitcodes/http](https://github.com/thrust-bitcodes/http)
- [thrust-bitcodes/authentication](https://github.com/thrust-bitcodes/authentication)



