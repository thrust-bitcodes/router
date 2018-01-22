/**
 * @author Nery Jr
 */

let router = require('../index')
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
    // afterEach(function() { })
    // beforeEach(function() { })

    let http = mocks.http
    let site = 'http://127.0.1:8888'
    let ret

    describe('Módulo de tratamento de rotas [router]', function() {
        describe('Executando rota padrão [http://<host>:<port>/<path_file>/<method>]', function() {
            it('[GET] rota: <arquivo>/<method>', function() {
                expect(http.get(site + '/funcs/hello').execute(router)).to.equal('Hello Thrust!')
                expect(http.get(site + '/funcs/ghello').execute(router)).to.equal('Hello Thrust!')
                expect(http.post(site + '/funcs/ghello').execute(router)).to.satisfy(function(result) {
                    return result && show('result => ', result)
                })
            })

            it('[GET] rota: <arquivo>/<method>?<query_string>', function() {
                ret = http.get('http://127.0.1:8888/funcs/hellop?nome=thrust').execute(router)

                expect(ret).to.equal('Hi thrust!')
            })

            it('[POST] rota: <arquivo>/<method>', function() {
                expect(http.post('http://127.0.1:8888/funcs/phello').execute(router)).to.equal('Hello Thrust!')
            })
        })

        // describe('Executando rota padrão [http://<host>:<port>/<path_file>/<method>]', function() {
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
            // fail.execption.printStackTrace()
        }
    })

// java.lang.Runtime.getRuntime().exec("cmd /k chcp 65001")
