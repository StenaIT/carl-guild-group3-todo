
module.exports = ( http) =>  {
  var io = require('socket.io')(http,{ path: '/sioapi' }); //Global
  var todo_db = require('../db/todo_db')
  var ClientEvents = require('../../common/client_events.jsx');
  var ServerEvents = require('../../common/server_events.jsx');
  var moment = require('moment');
  var path = require('path');

  function _add(todo) {
    logEvent('TODO_ADD', this);

    todo_db.add(todo);
    this.broadcast.emit(ClientEvents.TODO_ADDED, todo);
  };

  function _delete(data) {
    logEvent('TODO_DELETE', this);

    let {id} = data;
    todo_db.delete(id);
    this.broadcast.emit(ClientEvents.TODO_DELETED, {id} );
  };

  function _complete(data) {
    logEvent('TODO_COMPLETE', this);

    let {id,completed} = data;
    todo_db.complete( {id,completed});
    this.broadcast.emit(ClientEvents.TODO_COMPLETED, {id,completed} );
  }

  function _edit(data) {
    logEvent('TODO_EDIT', this);

    let {id, text} = data;
    todo_db.edit({id,text});
    this.broadcast.emit(ClientEvents.TODO_EDITED, {id,text} );
  };

  function getIp(socket) {
    var ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    return ip;
  }

  function logEvent(event, socket) {
    var space = '                    ';
    console.log('time: ' + moment().format("YYYY-MM-DD HH:mm:ss.SSS Z") + ' event: [' + event + ']' + space.slice(event.length+2, space.length) + 'clientIP: ' + socket.ip );
  }

  io.on('connection', function (socket) {
      //let ip =  socket.request.connection.remoteAddress;
      socket.ip = getIp(socket);
      logEvent('CONNECT', socket);
      // Send the current todo list
      socket.emit(ClientEvents.TODO_LIST, todo_db.todos());

      socket.on(ServerEvents.TODO_ADD, _add);
      socket.on(ServerEvents.TODO_DELETE, _delete);
      socket.on(ServerEvents.TODO_EDIT, _edit);
      socket.on(ServerEvents.TODO_COMPLETE, _complete);

      socket.on('disconnect', function (client) {
        logEvent('DISCONNECT', this);
      });
  });

  return io;
}
