var todoController = require('./todo');

var express = require('express');
var config = require('config');

console.log('Loading controllers:');
// DEFINE ALL controllers here
module.exports = function(app) {
  var router = express.Router();
  var routs = config.get('routs');

  router = todoController(app, config.get('apiUrl'), router, config.get('loggingActive'));
  return router;
}
