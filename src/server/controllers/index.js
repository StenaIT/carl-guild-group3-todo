var express = require('express');
var router = express.Router();
var routs = require('config').get('routs');

console.log('Loading controllers:');
// DEFINE ALL controllers here
router.use('/' + routs.get('todo'), require('./todo').router);


module.exports = router;
