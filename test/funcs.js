exports = {
    hello: function(params, req, res) {
        res.write('Hello Thrust!')
    },

    hellop: function(params, req, res) {
        res.write('Hi ' + params.nome + '!')
    },

    GET: {
        ghello: function(params, req, res) {
            res.write('Hello Thrust!')
        }
    },

    POST: {
        phello: function name(params, req, res) {
            res.write('Hello Thrust!')
        }
    }

}
