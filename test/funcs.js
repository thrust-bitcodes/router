exports = {
    hiThrust: function(params, req, res) {
        res.write('Hi Thrust!')
    },

    helloWrite: function(params, req, res) {
        res.write('Hello ' + params.nome + '!')
    },

    helloJson: function(params, req, res) {
        res.json({ hello: params.nome })
    },

    GET: {
        ghiThrust: function(params, req, res) {
            res.write('[GET] Hi Thrust!')
        },
        ghelloJson: function(params, req, res) {
            res.json({ hello: params.nome })
        }
    },

    POST: {
        phiThrust: function name(params, req, res) {
            res.write('Hi Thrust!')
        }
    }

}
