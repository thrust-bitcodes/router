/**
 * @author Nery Jr
 */

let router = require('router')
let majesty = require('majesty')
let mocks = require('./mocks')

/* let reqGetTemplate = mocks.mountRequest('get1')
let reqPostTemplate = mocks.mountRequest('post1')

function processGET(req) {
    var request = Object.assign({}, reqGetTemplate, req)
    var response = mocks.mountResponse()
    var params = mocks.parseParams(request.queryString, request.contentType)

    router.process(params, request, response)
} */



function log(user, url, endPointFileName, endPointMethodName, params, req) {
    let d = new Date()

    print(d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate(), '|',
        d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds() + '.' + d.getMilliseconds(), '|',
        user, '|', endPointFileName, '|', endPointMethodName, '|',
        '[' + JSON.stringify(params) + ']')
}
router.logFunction = log.bind(null, 'Nery')

function exec(describe, it, beforeEach, afterEach, expect, should, assert) {
    // var result
    // afterEach(function() { })
    // beforeEach(function() { })

    let response = mocks.mountResponse()
    let request = Object.assign({}, reqGetTemplate, req)
    let params = mocks.parseParams(request.queryString, request.contentType)


    describe('Módulo de tratamento de rotas [router]', function() {
        describe('Executando rota padrão [http://<host>/<path_file>/<method>]', function() {
            it('[GET] ', function() {
                expect(false).to.equal(false)
                expect({ error: false }).to.satisfy(function(result) {
                    return result && result.error === false
                })
            })

            it('[POST]', function() {
                expect(false).to.equal(false)
            })
        })
    })
}

let res = majesty.run(exec)

print('', res.success.length, ' scenarios executed with success and')
print('', res.failure.length, ' scenarios executed with failure.\n')

res
    .failure
    .forEach(function(fail) {
        print('[' + fail.scenario + '] =>', fail.execption)
        if (fail.execption.printStackTrace) {
            fail.execption.printStackTrace()
        }
    })

// java.lang.Runtime.getRuntime().exec("cmd /k chcp 65001")
