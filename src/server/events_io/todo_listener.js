module.exports = ( http) =>  {
  var io = require('socket.io')(http,{ path: '/sioapi' }); //Global
  var todo_db = require('../db/todo_db')
  var ClientEvents = require('../../common/client_events.jsx');
  var ServerEvents = require('../../common/server_events.jsx');

  function _add(todo) {
    console.log('todo:add');

    todo_db.add(todo);
    this.broadcast.emit(ClientEvents.TODO_ADDED, todo);
  };

  function _delete(data) {
    let {id} = data;

    console.log('todo:delete');

    todo_db.delete(id);
    this.broadcast.emit(ClientEvents.TODO_DELETED, {id} );
  };

  function _complete(data) {
    console.log('todo:complete');

    let {id,completed} = data;

    todo_db.complete( {id,completed});
    this.broadcast.emit(ClientEvents.TODO_COMPLETED, {id,completed} );
  }

  function _edit(data) {
    console.log('todo:edit');

    let {id, text} = data;

    todo_db.edit({id,text});
    this.broadcast.emit(ClientEvents.TODO_EDITED, {id,text} );
  };

  io.on('connection', function (socket) {
      //let ip =  socket.request.connection.remoteAddress;
      var ip = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
      console.log('[CONNECT] socket.io client IP:"' + ip + '"');
      // Send the current todo list
      socket.emit(ClientEvents.TODO_LIST, todo_db.todos());

      socket.on(ServerEvents.TODO_ADD, _add);
      socket.on(ServerEvents.TODO_DELETE, _delete);
      socket.on(ServerEvents.TODO_EDIT, _edit);
      socket.on(ServerEvents.TODO_COMPLETE, _complete);

      socket.on('disconnect', function (client) {
        console.log('[DISCONNECT] socket.io client IP:"' + ip + '"');
      });
  });

  return io;
}
