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

    const modelBisindo = await loadModel(process.env.MODEL_BISINDO);
    console.log("First model loaded successfully");
    const modelSibi = await loadModel(process.env.MODEL_SIBI_RGB);
    console.log("Second model loaded successfully");

    server.app.modelBisindo = modelBisindo;
    server.app.modelSibi = modelSibi;

    server.route(routes);

    server.ext('onPreResponse', function(request, h){
        const response = request.response;

        if (response instanceof InputError) {
            const newResponse = h.response({
                status: 'fail',
                message: `Prediction error: ${response.message}`
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