const predictClassification = require('../services/inferenceService');
const fs = require('fs');
const formidable = require('formidable');

async function postPredictHandler(request, h) {
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

    const fileArray = files.file;
    if (!fileArray || fileArray.length === 0) {
        // console.error('File not found in the request payload');
        const response = h.response({
            status: 'fail',
            message: 'No input image, file not found',
        })
        response.code(400);
        return response;
    }

    const file = fileArray[0];
    // show file path
    // console.log('File path:', file.filepath);

    const buffer = fs.readFileSync(file.filepath);


    const { model } = request.server.app;

    const label = await predictClassification(model, buffer);

    const createdAt = new Date().toISOString();

    const data = {
        "result": label,
      }

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data
    })
      response.code(201);
      return response;
}
module.exports = postPredictHandler;