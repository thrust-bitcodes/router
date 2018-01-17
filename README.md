Router
===============

Router é um *bitcode* de roteamento para [Thrust](https://github.com/Thrustjs/thrust).

Usado em conjunto com o *bitcode* [thrust-bitcodes/http](https://github.com/thrust-bitcodes/http) para criar rotas de requisição REST, com suporte a middleware, rotas virtuais, dentre outros.

# Instalação

Posicionado em um app [ThrustJS](https://github.com/thrustjs/thrust), no seu terminal:

```bash
thrust install router
```

## Tutorial

```javascript
var server = require('http')
var router = require('router')
var auth   = require('authentication')

router.addMiddleware(auth.validateAccess)

router.addMiddleware(function(params, request, response) {
  print(JSON.stringify(params))
  return true
})

router.addRoute('caminho/virtual/funcaoX', 'caminho/real/do/arquivo/funcaoX')

server.createServer(8778, router)
```

Acesse um tutorial mais rico sobre roteamentos físicos e virtuais em nosso [gitbook](https://thrustjs.gitbooks.io/thrustjs/roteamento.html).

## API

```javascript
/**
 * Usado para configurar o diretório root,
 * de onde o roteamento pesquisará pelos endpoints
 * */
setApplicationDirectory(appDirectory) /* default "./" */

/**
 * Usado para adicionar middlewares na aplicação.
 * Middlewares são funções com assinatura (prams, request, response)
 * que são chamadas no inicio do processamento das rotas.
 * Caso algum middleware retorne false, a chamada é interrompida.
*/
addMiddleware(fn)

/**
 * Usado para adicionar rotas virtuais na aplicação
*/
addRoute(pathVirtual, pathReal)
```

Acesse também os outros *bitcodes* utilizados no exemplo para melhor entendimento:

- [thrust-bitcodes/http](https://github.com/thrust-bitcodes/http)
- [thrust-bitcodes/authentication](https://github.com/thrust-bitcodes/authentication)



