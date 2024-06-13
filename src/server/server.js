'use strict';
require('dotenv').config();

const routes = require('../server/routes');
const InputError = require('../exceptions/InputError');
const loadModel = require('../services/loadModel');
const Hapi = require('@hapi/hapi');
const connectDb = require('../services/connectDb');
const crypto = require('crypto');
const Jwt = require('@hapi/jwt');



(async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ['*'], // Allow all origins
                additionalHeaders: ['cache-control', 'x-requested-with'] // Allow additional headers
            }
        }
    });

    const db = await connectDb();
    console.log("Connected to MySQL database");
    const model = await loadModel();
    console.log("Model loaded successfully");
    const JWT_SECRET = crypto.randomBytes(32).toString('hex');
    console.log('JWT key generated');

    server.app.JWT_SECRET = JWT_SECRET;
    server.app.db = db;
    server.app.model = model;

    await server.register(Jwt);

    server.auth.strategy('jwt', 'jwt', {
        keys: JWT_SECRET,
        validate: async (artifacts, request, h) => {
            try {
                const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [artifacts.decoded.payload.username]);
                if (rows.length === 0) {
                    return { isValid: false };
                }
                return { isValid: true };
            } catch (err) {
                console.error(err);
                return { isValid: false };
            }
        },
        verify: {
            aud: false,
            iss: false,
            sub: false,
            nbf: false,
            exp: true,
            maxAgeSec: 14400,
            timeSkewSec: 15
        }
    });

    server.auth.default('jwt');

    server.route(routes);

    server.ext('onPreResponse', function(request, h){
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `Terjadi kesalahan dalam melakukan prediksi`
            })
            newResponse.code(response.statusCode)
            return newResponse;
        }

        if (response.isBoom) {
            let message = response.message;
            if(response.output.statusCode === 413){
                message = 'Payload content length greater than maximum allowed';
            }
            const newResponse = h.response({
                status: 'fail',
                message: message
            })
            newResponse.code(response.output.statusCode)
            return newResponse;
        }
        
        return h.continue;
    });

    await server.start();
    console.log(`Server start at: ${server.info.uri}`);
})();