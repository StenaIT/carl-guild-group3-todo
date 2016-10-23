module.exports = ( http) =>  {
  var io = require('socket.io')(http,{ path: '/sioapi' }); //Global
  var todo_db = require('../db/todo_db')
  var socket = 'test socket';

  function _add(todo) {
    console.log('todo:add');

    todo_db.add(todo);
    this.broadcast.emit('todo:added', todo);
  };

  function _delete(data) {
    let {id} = data;

    console.log('todo:delete');

    todo_db.delete(id);
    this.broadcast.emit('todo:deleted', {id} );
  };

  function _complete(data) {
    console.log('todo:complete');

    let {id,completed} = data;

    todo_db.complete( {id,completed});
    this.broadcast.emit('todo:completed', {id,completed} );
  }

  function _edit(data) {
    console.log('todo:edit');

    let {id, text} = data;

    todo_db.edit({id,text});
    this.broadcast.emit('todo:edited', {id,text} );
  };

  io.on('connection', function (socket) {
      let ip =  socket.request.connection.remoteAddress;
      console.log('[CONNECT] socket.io client IP:"' + ip + '"');
      // Send the current todo list
      socket.emit('todo:list', todo_db.todos());

      socket.on('todo:add', _add);
      socket.on('todo:delete', _delete);
      socket.on('todo:edit', _edit);
      socket.on('todo:complete', _complete);

      socket.on('disconnect', function (client) {
        console.log('[DISCONNECT] socket.io client IP:"' + ip + '"');
      });
  });

  return io;
}
