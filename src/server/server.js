var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var config = require('config');
var indexController = require('./controllers/index');
var io = require('./events_io/todo_listener.js')(http);

// Pass our instance of io to response.
app.use(function(req, res, next){
  req.io = io;
  next();
});

app.use( bodyParser.json() );              //To support JSON-encoded bodies

indexController(app);

console.log('Server Listens on *:' + config.get('listenPort') + '\n');
http.listen(config.get('listenPort'), function(){
});

module.exports = {app: app, server: http};
