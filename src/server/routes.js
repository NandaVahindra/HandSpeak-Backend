const postPredictHandler = require('../server/handler').postPredictHandler;
const postRegisterHandler = require('../server/handler').postRegisterHandler;
const postLoginHandler = require('../server/handler').postLoginHandler;
const postLogoutHandler = require('../server/handler').postLogoutHandler;

 
const routes = [
  {
    method: 'POST',
    path: '/predict',
    options: {
        auth: 'jwt',
        payload: {
            output: 'stream',
            parse: false,
            allow: 'multipart/form-data',
            maxBytes: 209715200,
            timeout: false
        }
    },
    handler: postPredictHandler,
  },
  {
    method: 'POST',
    path: '/register',
    options: {
        auth: false
    },
    handler: postRegisterHandler,
  },
  {
    method: 'POST',
    path: '/login',
    options: {
        auth: false
    },
    handler: postLoginHandler,
  },
  {
     method: 'POST',
     path: '/logout',
     options: {
         auth: 'jwt'
     },
     handler: postLogoutHandler,
  }
]
 
module.exports = routes;