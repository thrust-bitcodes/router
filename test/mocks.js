let httResponse = {

    out: [],
    status: 0,
    contentType: '',
    charset: '',
    headers: {},
    contentLength: 0,

    getWriter: function() {
        let out = this.out

        return {
            println: function(str) {
                out.push(str, '\n')
            }
        }
    },

    getOutputStream: function() {
        let out = this.out

        return {
            write: function(str) {
                out.push(str)
            },
            flush: function(params) {
            }
        }
    },

    flushBuffer: function(params) {
    },

    setStatus: function(status) { this.status = status },

    setContentType: function(contentType) { this.contentType = contentType },

    setCharacterEncoding: function(charset) { this.charse = charset },

    setHeader: function(key, value) { this.headers[key] = value },

    setContentLength: function(contentLength) { this.contentLength = contentLength }

}

let reqs = {
    get: {
        httpRequest: null,
        host: '127.0.0.1',
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
    httpResponse: httResponse,
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
        return (typeof (this.out[0]) === 'object') ? JSON.stringify(this.out[0]) : this.out.join('')
    },
    toString: function() {
        return this.out.join('')
    },
    addHeader: function(name, value) {
        this.headers[name] = value
    },
    json: function(data, statusCode, headers) {
        var ths = this

        this.contentType = 'application/json'
        this.status = statusCode || 200

        for (var opt in (headers || {})) {
            ths.headers[opt] = headers[opt]
        }

        this.out[0] = (typeof (data) === 'object') ? JSON.stringify(data) : data
    },
    error: {
        json: function(message, statusCode, headers) {
            var ths = this

            this.contentType = 'application/json'
            this.status = statusCode || 200

            for (var opt in (headers || {})) {
                ths.headers[opt] = headers[opt]
            }

            this.out[0] = JSON.stringify({
                status: ths.status,
                message: message
            })
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
            if ((m != null && m.toString().length == k.length) || ko == '[]') {
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

let http = {

    request: null,
    response: null,
    body: function(params) {
        this.queryString = (params.constuctor.name === 'Object')
            ? JSON.stringify(params)
            : params.toString()

        return this
    },
    queryString: function(params) {
        this.queryString = params.toString()

        return this
    },
    get: function(uri) {
        let req
        let scheme = uri.split(/:\/\//g)
        let url = (scheme.length === 2) ? scheme[1] : scheme[0]

        url = url.split(/\?/g)

        this.request = req = Object.assign({}, reqs.get)
        req.scheme = (scheme.length === 2) ? scheme[0] : 'http'
        req.requestURI = url[0]
        req.queryString = url[1] || ''

        return this
    }
}

exports = {
    mountRequire: function(reqName) {
        return reqs[reqName]
    },

    mountResponse: function() {
        return response
    },

    reqs: reqs,

    parseParams: parseParams,

    http: http
}
