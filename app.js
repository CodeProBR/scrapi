const express = require('express');
const cors = require('cors');
const app = express();
const rateLimit = require('express-rate-limit');
const apicache = require('apicache');
let cache = apicache.middleware;
const auth = require('./config/auth');
const db = require('./config/database');
const request = require('./config/request');

const apiLimiter = rateLimit({
    windowMs: 60 * 1000, //tempo = 1 minuto maximo de 2 requisições a cada 5 segundos por token
    max: async (req, res) => { //request em tempo
        return await db.rpm(req.headers.token);
    },
    standardHeaders: true,
    legacyHeaders: false, 
    keyGenerator: async (req, res) => { //return all apllications by token
        return await db.account(req.headers.token);
    },
    handler: function(req, res, next) {
        res.status(429).json({status: 'too many requests', message: 'Number of requests made per token exceeded the allowed limit. Maximum 2 requests every 5 seconds.'});
    },
});

app.use(cors());
app.use(express.json());

app.use('/v1/scrapi', cache('1 day'), require('./routes/scrapi'));

app.use('/v1/correios', apiLimiter, auth.token, cache('1 day'), require('./routes/correios'));
app.use('/v1/cep', require('./routes/cep'));
app.use('/v1/ip', require('./routes/ip'));
app.use('/v1/lottery', require('./routes/lottery'));
app.use('/v1/fipe', require('./routes/fipe'));
app.use('/v1/place', require('./routes/place'));
app.use('/v1/cnae', require('./routes/cnae'));
app.use('/v1/cnpj', apiLimiter, auth.token, cache('1 day'), request.params, require('./routes/cnpj'));
app.use('/v1/domains', require('./routes/domains'));
app.use('/v1/weather', require('./routes/weather'));
app.use('/v1/currencies', require('./routes/currencies'));

app.use(apiLimiter, function(req, res, next) {
    res.status(404).json({status: 'not found', message: 'The requested resource does not exist'});
});

app.listen(3000);

exports.handler = app;