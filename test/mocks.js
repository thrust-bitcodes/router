let httpResponse = {
    out: '',
    status: 0,
    contentType: '',
    charset: '',
    headers: {},
    contentLength: 0,
    content: '',

    getWriter: function() {
        var println = function(str) {
            // ths.out.push(str, '\n')
            this.out = str
            // print('out =>', str)
        }.bind(this)

        return {
            println: println
        }
    },

    getOutputStream: function() {
        let ths = this

        return {
            write: function(str) {
                ths.out = str
                // ths.out.push(str)
            },
            flush: function() {
                // ths.content = ths.out.join('')
                // ths.out = []
                ths.content = ths.out
                ths.out = ''

                return ths.content
            }
        }
    },

    flushBuffer: function(params) {
        // this.content = this.out.join('')
        // this.out = []
        this.content = this.out
        this.out = ''

        return this.content
    },

    setStatus: function(status) { this.status = status },

    setContentType: function(contentType) { this.contentType = contentType },

    setCharacterEncoding: function(charset) { this.charset = charset },

    setHeader: function(key, value) { this.headers[key] = value },

    setContentLength: function(contentLength) { this.contentLength = contentLength }

}

let reqs = {
    get: {
        httpRequest: null,
        host: 'localhost',
        port: '8778',
        queryString: 'nome=thrust&rate=100',
        rest: '/test/echo',
        contentType: '',
        method: 'GET',
        requestURI: '/test/echo',
        pathInfo: null,
        scheme: 'http',
        contextPath: '',
        servletPath: '',
        parts: null,
        headers: {
            'Content-Length': 20,
            'Content-Type': 'application/json'
        }
    },
    post: {
        httpRequest: null,
        host: '127.0.0.1',
        port: '8778',
        queryString: '{"nome": "thrust", "rate":100}',
        rest: '/test/echo',
        contentType: '',
        method: 'POST',
        requestURI: '/test/echo',
        pathInfo: null,
        scheme: 'http',
        contextPath: '',
        servletPath: '',
        parts: null,
        headers: {
            'Content-Length': 20,
            'Content-Type': 'application/json'
        }
    }
}

let response = {
    httpResponse: Object.assign({}, httpResponse, { out: '' }),
    status: 200,
    contentLength: 0,
    contentType: 'text/html',
    charset: 'UTF-8',
    headers: {},
    out: [],
    clean: function() {
        this.out = []
        this.headers = {}
        this.contentLength = 0
        this.contentType = 'text/html'
        this.charset = 'utf-8'
    },
    write: function(content) {
        this.out.push(content)

        return this
    },
    setOut: function(content) {
        this.out = [content]

        return this
    },
    toBytes: function() {
        return new java.lang.String(this.out).getBytes()
    },
    toJson: function() {
        let strOut = (typeof (this.out[0]) === 'object') ? JSON.stringify(this.out[0]) : this.out.join('')

        this.clean()
        return strOut
    },
    toString: function() {
        // print('toString =>', this.out)
        let strOut = this.out.join('')

        this.clean()
        return strOut
    },
    addHeader: function(name, value) {
        this.headers[name] = value
    },
    json: function(data, statusCode, headers) {
        this.contentType = 'application/json'
        this.status = statusCode || 200

        for (var opt in (headers || {})) {
            this.headers[opt] = headers[opt]
        }

        this.out[0] = (typeof (data) === 'object') ? JSON.stringify(data) : data
        // print('response::json::strOut =>', this.out)
        // let strOut = (typeof (data) === 'object') ? JSON.stringify(data) : data

        // this.clean()
        // return strOut
    },
    error: {
        json: function(message, statusCode, headers) {
            this.contentType = 'application/json'
            this.status = statusCode || 200

            for (var opt in (headers || {})) {
                this.headers[opt] = headers[opt]
            }

            this.out[0] = JSON.stringify({
                // let strOut = JSON.stringify({
                status: this.status,
                message: message
            })

            // this.clean()
            // return strOut
        }
    }
}

let parseParams = function(strParams, contentType) {
    var params = {}

    function parseValue(value) {
        var nv = parseFloat(value)

        return isNaN(nv) ? value : nv
    }

    function parseKey(skey, value) {
        let patt = /\w+|\[\w*\]/g
        let key = patt.exec(skey)[0]
        let p = params
        let k, ko

        while ((ko = patt.exec(skey)) != null) {
            k = ko.toString().replace(/\[|\]/g, '')
            var m = k.match(/\d+/gi)
            if ((m != null && m.toString().length === k.length) || ko === '[]') {
                k = parseInt(k)
                p[key] = p[key] || []
            } else {
                p[key] = p[key] || {}
            }
            p = p[key]
            key = k
        }
        if (typeof (key) === 'number' && isNaN(key)) {
            p.push(parseValue(value))
        } else {
            p[key] = parseValue(value)
        }
    }

    function parseParam(sparam) {
        var vpar = unescape(sparam).split('=')
        parseKey(vpar[0], vpar[1])
    }

    if (strParams !== null && strParams !== '') {
        if (contentType && contentType.startsWith('application/json')) {
            params = JSON.parse(strParams)
        } else {
            var arrParams = strParams.split('&')

            for (var i = 0; i < arrParams.length; i++) {
                parseParam(arrParams[i])
            }
        }
    }

    return params
}

function serializeParams(obj, prefix) {
    let str = []
    let p

    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + '[' + p + ']' : p
            let v = obj[p]

            str.push((v !== null && typeof v === 'object')
                ? serializeParams(v, k)
                : encodeURIComponent(k) + '=' + encodeURIComponent(v))
        }
    }
    return str.join('&')
}

let http = {
    request: null,

    body: function(params) {
        let isObject = params.constuctor.name === 'Object'

        this.request.queryString = (isObject)
            ? JSON.stringify(params)
            : params.toString()
        this.request.contentType = (isObject)
            ? 'application/json'
            : 'text/plain'

        return this
    },

    queryString: function(params) {
        let isObject = params.constuctor.name === 'Object'

        this.request.queryString = (isObject)
            ? serializeParams(params)
            : params.toString()
        this.request.contentType = (isObject)
            ? 'application/json'
            : 'text/plain'

        return this
    },

    get: function(uri) {
        let req
        let addr
        let scheme = uri.split(/:\/\//g)
        let url = (scheme.length === 2) ? scheme[1] : scheme[0]

        url = url.split(/\?/g)

        this.request = req = Object.assign({}, reqs.get)
        req.scheme = (scheme.length === 2) ? scheme[0] : 'http'
        req.requestURI = url[0]
        req.queryString = url[1] || ''

        addr = req.requestURI.split('/')[0]

        req.rest = req.requestURI.replace(addr, '')

        addr = addr.split(':')

        req.host = addr[0]
        req.port = addr[1] || '80'

        return this
    },

    post: function(uri) {
        let req
        let addr
        let scheme = uri.split(/:\/\//g)
        let url = (scheme.length === 2) ? scheme[1] : scheme[0]

        this.request = req = Object.assign({}, reqs.post)
        req.scheme = (scheme.length === 2) ? scheme[0] : 'http'
        req.requestURI = url

        addr = req.requestURI.split('/')[0]

        req.rest = req.requestURI.replace(addr, '')

        addr = addr.split(':')

        req.host = addr[0]
        req.port = addr[1] || '80'

        return this
    },

    execute: function(router) {
        // let res = createResponse()
        let res = Object.assign({}, response, { out: [], headers: {} })
        let req = Object.assign({}, this.request)
        let params = parseParams(req.queryString, req.contentType)

        router.process(params, req, res)

        return res.httpResponse
    }
}

exports = {
    reqs: reqs,

    http: http
}
