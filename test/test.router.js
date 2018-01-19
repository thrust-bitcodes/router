/**
 * @author Nery Jr
 */

// let cfgRouter = getBitcodeConfig('router')()

function log (user, url, endPointFileName, endPointMethodName, params, req) {
  let d = new Date()

  print(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(), '|',
    d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds(), '|',
    user, '|', endPointFileName, '|', endPointMethodName, '|',
    '[' + JSON.stringify(params) + ']'
  )
}

// cfgRouter.logFunction = log.bind(null, "Nery")

let majesty = require('majesty')
let router = require('router')

router.logFunction = log.bind(null, 'Nery')

function exec (describe, it, beforeEach, afterEach, expect, should, assert) {
  var result

  // afterEach(function() { })
  // beforeEach(function() { })

  describe('Módulo de tratamento de rotas [router]', function () {
    describe('Executando rota padrão [http://<host>/<path_file>/<method>]', function () {
      it('[GET] ', function () {
        expect(false).to.equal(false)
        expect({error: false}).to.satisfy(function (result) {
          return result && result.error === false
        })
      })

      it('[POST]', function () {
        expect(false).to.equal(false)
      })

    })
  })
}

let res = majesty.run(exec)

print('', res.success.length, ' scenarios executed with success and')
print('', res.failure.length, ' scenarios executed with failure.\n')

res.failure.forEach(function (fail) {
  print('[' + fail.scenario + '] =>', fail.execption)
//   if (fail.execption.printStackTrace) {
//     fail.execption.printStackTrace()
//   }
})

// java.lang.Runtime.getRuntime().exec("cmd /k chcp 65001");
