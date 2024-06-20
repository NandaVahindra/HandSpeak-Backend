const postBisindoPredictHandler = require('../server/handler').postBisindoPredictHandler;
const postSibiPredictHandler = require('../server/handler').postSibiPredictHandler;
 
const routes = [
  {
    path: '/predictBisindo',
    method: 'POST',
    handler: postBisindoPredictHandler,
    options: {
      payload: {
        output: 'stream',
        parse: false,
        allow: 'multipart/form-data',
        maxBytes: 10485760, // Limit to 10MB
        timeout: false // Disable timeout for large uploads
      }
    }
  },
  {
    path: '/predictSibi',
    method: 'POST',
    handler: postSibiPredictHandler,
    options: {
      payload: {
        output: 'stream',
        parse: false,
        allow: 'multipart/form-data',
        maxBytes: 10485760, // Limit to 10MB
        timeout: false // Disable timeout for large uploads
      }
    }
  },
]
 
module.exports = routes;