Router
===============

Router é um *bitcode* de roteamento para [thrust](https://github.com/Thrustjs/thrust).

Usado em conjunto com o *bitcode* [thrust-bitcodes/http](https://github.com/thrust-bitcodes/http) para criar rotas de requisição REST, com suporte a middleware, rotas virtuais, dentre outros.

# Instalação

Posicionado em um app [thrust](https://github.com/thrustjs/thrust), no seu terminal:

```bash
thrust install router
```

## Tutorial

O *bitcode* de roteamento é usado para configurar *endpoints* da aplicação, por padrão toda requisição feita no app, o roteador tentará encontrar um arquivo segundo o caminho da URL para responder a requisição, por exemplo:

```javascript
GET: localhost:8080/app/teste/hello
```
Será buscado em seu app o arquivo ```/app/teste.js``` que por sua vez, exporta uma função chamada ```hello```.

Também podemos criar rotas virtuais, para que as URLs não tenham que necessariamente se traduzir em uma hierarquia de arquivos no app, sendo assim podemos criar URLs de acesso mais curtas.
Vejamos o exemplo abaixo:

```javascript
// importamos os bitcodes necessários
var server = require('http')
var router = require('router')
var auth   = require('authentication')

// auth contém a função 'middleware'
router.addMiddleware(auth)

// podemos também passar uma função de middleware
router.addMiddleware(function(params, request, response) {
  print(JSON.stringify(params))
  return true //Retornando false, a cadeia de middlewares é quebrada e a requisição não é processada
})

// Criamos uma rota virtual que redireciona para um arquivo real
router.addRoute('caminho/virtual/funcaoX', 'caminho/real/do/arquivo/funcaoX')

// Criamos uma rota virtual que mapeia um modulo inteiro
// Assim podemos acessar via /@virtual/funcaoX
router.addRoute('@virtual', 'caminho/real/do/arquivo')

// Levantamos o servidor com a instância do roteador
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
 * Caso um módulo contenha a função 'middleware' então o módulo
 * pode ser passado como argumento e esta função será usada.
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



