require('dotenv').config();

const routes = require('../server/routes');
const InputError = require('../exceptions/InputError');
const loadModel = require('../services/loadModel');
const Hapi = require('@hapi/hapi');
(async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
              origin: ['*'],
            },
        },
    });

    const model = await loadModel();
    console.log("Model loaded successfully");

    server.app.model = model;

    server.route(routes);

    server.ext('onPreResponse', function(request, h){
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `Prediction Error: ${response.message}`
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