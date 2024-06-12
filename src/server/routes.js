const postPredictHandler = require('../server/handler');
 
const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        output: 'stream',
        parse: false,
        allow: 'multipart/form-data',
        maxBytes: 20971520, // Limit to 20MB
        timeout: false // Disable timeout for large uploads
      }
    }
  }
]
 
module.exports = routes;