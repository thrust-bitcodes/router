let Charset = Java.type('java.nio.charset.Charset')

let router = {
    applicationDirectory: './',

    middlewares: [],

    endpoints: {},

    vroutes: {
        '/': function runningThrust(params, request, response) {
            response.contentType = 'text/html; charset=utf-8'
            response.write('<H1>Thrust is running!</H1>')
        }
    },

    setApplicationDirectory: function(appDirectory) {
        router.applicationDirectory = appDirectory
    },

    addRoute: function(virtualRoute, realRoute) {
        router.vroutes[virtualRoute] = realRoute
    },

    addMiddleware: function(middleware) {
        if (typeof middleware === 'function') {
            router
                .middlewares
                .push(middleware)
        } else if (typeof middleware === 'object' && typeof middleware.middleware === 'function') {
            router
                .middlewares
                .push(middleware.middleware)
        } else {
            throw new Error('A middleware must be a function or contain a function called \'middleware\'')
        }
    },

    process: function(params, request, response) {
        let mimes = [
            'text/html',
            'text/xml',
            'text/plain',
            'text/javascript',
            'application/javascript',
            'application/json'
        ]

        let isItOK = this
            .middlewares
            .reduce(function execMiddleware(flag, middFnc) {
                flag = (flag === undefined) ? true : flag

                return flag && middFnc(params, request, response)
            }, true)

        if (isItOK) {
            this.processRoute(params, request, response)
        }

        let httpResponse = response.httpResponse

        httpResponse.setStatus(response.status)
        httpResponse.setContentType(response.contentType)
        httpResponse.setCharacterEncoding(response.charset)

        for (let key in response.headers) {
            httpResponse.setHeader(key, response.headers[key])
        }

        let type = response.contentType.split(';')[0]

        if (mimes.indexOf(type) >= 0) {
            let sout = (response.contentType.indexOf('json') >= 0)
                ? response.toJson()
                : response.toString()

            httpResponse.setContentLength(sout.getBytes(Charset.forName(response.charset)).length)
            httpResponse.getWriter().println(sout)
            httpResponse.flushBuffer()
        } else {
            let ops = httpResponse.getOutputStream()

            httpResponse.setContentLength(response.contentLength)
            ops.write(response.out[0])
            ops.flush()
        }
    },

    processRoute: function(paramsObject, request, response) {
        let params = paramsObject || {}
        let nurl = request.rest.replace(/\/$/g, '')
        let keys = Object.keys(this.vroutes)
        let vrota
        let rrota

        function runMethodOnModule(rrota) {
            let path = router
                .applicationDirectory
                .concat(rrota)
                .replace(/^\//, '')
                .split('/')
            let methodName = path.pop()
            let module = require(path.join('/') + '.js')
            let fncMetodo = module[methodName]

            if (!fncMetodo) {
                if (!request || !request.method || !module || !module[
                    request
                        .method
                        .toUpperCase()
                ]) {
                    response.json('Error 404: URI not found.', 404)
                    return
                }

                fncMetodo = module[
                    request
                        .method
                        .toUpperCase()
                ][methodName]
            }

            fncMetodo(paramsObject, request, response)
        }

        let splitRoute = nurl
            .replace(/^\//, '')
            .split('/')

        nurl = (nurl === '')
            ? '/'
            : nurl
        vrota = ['/' + splitRoute.shift()].join('')

        if (vrota.charAt(1) === '@' && keys.indexOf(vrota) >= 0) {
            rrota = this.vroutes[vrota]
            rrota = rrota.concat((splitRoute.length === 0)
                ? ''
                : [
                    '/', splitRoute.shift()
                ].join(''))

            if (Object.keys(params).toString() === '') {
                paramsObject = splitRoute
            }
        } else if (keys.indexOf(nurl) >= 0) {/* É simplesmente um virtual path? */
            rrota = this.vroutes[nurl]
        } else {/* Ou é uma rota com placeholder ou é uma url do tipo ../modulo/metodo */
            let vrout = keys.map(function(rt, index) {
                return {
                    rota: rt.replace(/:(\w+)/g, '(\\w+)'),
                    index: index
                }
            })
                .filter(function(rotaIndex) {
                    return new RegExp('^' + rotaIndex.rota + '$').test(nurl)
                })[0]

            /* É uma rota com placeholder? */
            if (vrout !== undefined) {
                vrota = keys[vrout.index]
                rrota = (vrout)
                    ? this.vroutes[vrota]
                    : rrota

                let mat
                let regIds = /:(\w+)/gi
                let ids = []

                while ((mat = regIds.exec(vrota)) !== null) {
                    ids.push(mat[1])
                }

                let values = nurl
                    .match(vrout.rota)
                    .slice(1)

                for (let i = 0; i < ids.length; i++) {
                    params[ids[i]] = values[i]
                }
            } else {/* Não, é uma rota do tipo ../module/method */
                rrota = nurl
            }
        }

        // print("\nnurl => [" + nurl + "]") print("\nvrota => [" + vrota + "]")
        // print("\ntypeof(rrota) => [" + typeof(rrota) + "]")

        if (typeof (rrota) === 'function') {
            rrota(params, request, response)
        } else {
            runMethodOnModule(rrota)
        }
    }
}

exports = router
