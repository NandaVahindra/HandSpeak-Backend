const predictClassification = require('../services/inferenceService');
const fs = require('fs');
const formidable = require('formidable');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


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

async function postRegisterHandler(request, h) {
    const { username, password } = request.payload;
    const { db } = request.server.app;

    if (!username || !password) {
        return h.response({ message: 'Username and password are required' }).code(400);
    }

    try {
        // Check if the username already exists
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return h.response({ message: 'Username already exists' }).code(400);
        }

        // If username doesn't exist, proceed to register
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return h.response({ message: 'User registered successfully' }).code(201);
    } catch (err) {
        console.error(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}

async function postLoginHandler(request, h) {
    const { username, password } = request.payload;
    const { db } = request.server.app;
    const { JWT_SECRET } = request.server.app;

    if (!username || !password) {
        return h.response({ message: 'Username and password are required' }).code(400);
    }

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return h.response({ message: 'Invalid username or password' }).code(401);
        }

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return h.response({ message: 'Invalid username or password' }).code(401);
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        return h.response({ message: 'Login successful', token }).code(200);
    } catch (err) {
        console.error(err);
        return h.response({ message: 'Internal Server Error' }).code(500);
    }
}

async function postLogoutHandler(request, h) {
    // Invalidate token logic here (client-side should handle token removal)
    return h.response({ message: 'Logout successful' }).code(200);
}

module.exports = {
    postPredictHandler,
    postRegisterHandler,
    postLoginHandler,
    postLogoutHandler
};