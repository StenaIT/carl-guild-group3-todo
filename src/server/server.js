var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http,{ path: '/sioapi' }); //Global
var config = require('config');

// Pass our instance of io to response.
app.use(function(req, res, next){
  req.io = io;
  next();
});

app.use( bodyParser.json() );              //To support JSON-encoded bodies
app.use(config.get('apiUrl'), require('./controllers')); //Loading index.js,loads controllers

http.listen(config.get('listenPort'), function(){
  console.log('Server Listens on *:' + config.get('listenPort') + '\n');
});

io.on('connection', function (socket) {
    let ip =  socket.request.connection.remoteAddress;
    console.log('[CONNECT] socket.io client IP:"' + ip + '"');

    // Send the current todo list
    socket.emit('todo:list', require('./controllers/todo').todos);

    socket.on('todo:add', function (todo) {
      console.log('todo:add');

      require('./controllers/todo').todos.push(todo)
      
      socket.broadcast.emit('todo:added', todo);
    });

    socket.on('todo:delete', function (data) {
      let {id} = data;

      console.log('todo:delete');

      let todos = require('./controllers/todo').todos;
      todos = todos.filter(function (todo) {
        if(todo.id == id) {
          todo.completed = !todo.completed;
        }
        return true;
      });

      require('./controllers/todo').todos = todos;

      socket.broadcast.emit('todo:deleted', {id} );
    });

    socket.on('todo:edit', function (data) {
      console.log('todo:edit');

      let {id, text} = data;
      let todos = require('./controllers/todo').todos;

      todos = todos.filter(function (todo) {
        if(todo.id == id) {
          todo.text = text;
        }
        return true;
      });

      socket.broadcast.emit('todo:edited', {id,text} );
    });

    socket.on('todo:complete', function (data) {
      console.log('todo:complete');

      let {id,completed} = data;

      let todos = require('./controllers/todo').todos;

      todos = todos.filter(function (todo) {
        if(todo.id == id) {
          todo.completed = completed;
        }
        return true;
      });

      socket.broadcast.emit('todo:completed', {id,completed} );
    });

    socket.on('disconnect', function (client) {
      console.log('[DISCONNECT] socket.io client IP:"' + ip + '"');
    });

});

module.exports = {app: app, server: http};
