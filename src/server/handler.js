const predictClassification = require('../services/inferenceService');
const fs = require('fs');
const formidable = require('formidable');

async function postBisindoPredictHandler(request, h) {
    const form = new formidable.IncomingForm();

    const { files } = await new Promise((resolve, reject) => {
        form.parse(request.raw.req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            resolve({ fields, files });
        });
    });

    // console.log('Files:', files); // Debugging log
    const fileKey = Object.keys(files)[0];
    const fileArray = files[fileKey];
    if (!fileArray || fileArray.length === 0) {
        // console.error('File not found in the request payload');
        const response = h.response({
            status: 'fail',
            code_status: 400,
            message: 'No input image, file not found',
        })
        response.code(400);
        return response;
    }

    const file = fileArray[0];
    // show file path
    // console.log('File path:', file.filepath);

    const buffer = fs.readFileSync(file.filepath);


    const model = request.server.app.modelBisindo;

    const label = await predictClassification(model, buffer);


    const data = {
        "result": label,
    }

    const response = h.response({
        status: 'success',
        code_status: 201,
        message: 'Bisindo Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
}

async function postSibiPredictHandler(request, h) {
    const form = new formidable.IncomingForm();

    const { files } = await new Promise((resolve, reject) => {
        form.parse(request.raw.req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }
            resolve({ fields, files });
        });
    });

    // console.log('Files:', files); // Debugging log
    const fileKey = Object.keys(files)[0];
    const fileArray = files[fileKey];
    if (!fileArray || fileArray.length === 0) {
        // console.error('File not found in the request payload');
        const response = h.response({
            status: 'fail',
            code_status: 400,
            message: 'No input image, file not found',
        })
        response.code(400);
        return response;
    }

    const file = fileArray[0];
    // show file path
    // console.log('File path:', file.filepath);

    const buffer = fs.readFileSync(file.filepath);


    const model = request.server.app.modelSibi;

    const label = await predictClassification(model, buffer);


    const data = {
        "result": label,
    }

    const response = h.response({
        status: 'success',
        code_status: 201,
        message: 'Sibi Model is predicted successfully',
        data
    })
    response.code(201);
    return response;
}

module.exports = {postBisindoPredictHandler, postSibiPredictHandler};