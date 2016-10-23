var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var config = require('config');

var io = require('./events_io/todo_listener.js')(http);

// Pass our instance of io to response.
app.use(function(req, res, next){
  req.io = io;
  next();
});

app.use( bodyParser.json() );              //To support JSON-encoded bodies
app.use(config.get('apiUrl'), require('./controllers')); //Loading index.js,loads controllers

console.log('Server Listens on *:' + config.get('listenPort') + '\n');
http.listen(config.get('listenPort'), function(){
});

module.exports = {app: app, server: http};
