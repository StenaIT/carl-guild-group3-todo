var expressListRoutes   = require('express-list-routes');
var config = require('config');
var express = require('express');
var ClientEvents = require('../../common/client_events.jsx');
var todo_db = require('../db/todo_db.js');

module.exports = function(app, rootApi, router, active) {
  var todoRoute = config.get('routs.todo')
  var logging = function( active, message)
  {
      if(active) {
        console.log(message);
      }
  }

  app.use(rootApi+ todoRoute, router);

  logging(active, '\n  * Todo controller API:');

  router.get('/list',function (req, res) {
    var result = todo_db.todos();
    res.status(200).json(result);
  });

  router.post('/add' ,function (req, res) {
    var todo = req.body.todo;
    logging(active, '/add ' + todo.id);
    todo_db.add(todo);

    req.io.emit(ClientEvents.TODO_ADDED, todo);
    res.status(201).json(todo_db.todos());
  });

  router.put('/edit_description' ,function (req, res) {
    let {id, text} = req.body.todo;
    logging(active, '/edit_description/:id ' + id);
    todo_db.edit({id,text});

    req.io.sockets.emit(ClientEvents.TODO_EDITED, { id, text });
    res.status(200).json(todo_db.get(id));
  });

  router.delete('/delete/:id' ,function (req, res) {
    let id = req.params.id;
    logging(active, '/delete/:id ' + id);
    var result = todo_db.get(id);
    todo_db.delete(id);
    req.io.sockets.emit(ClientEvents.TODO_DELETED, { id });

    res.status(200).json(result);
  });

  router.put('/complete/toggle/:id' ,function (req, res) {
    let id = req.params.id;
    logging(active, '/complete/toggle/:id ' + id);

    let todo = todo_db.get(id);
    let completed = !todo.completed;

    todo_db.complete({id, completed: completed});

    req.io.sockets.emit(ClientEvents.TODO_COMPLETED, {id, completed});

    res.status(200).json(todo);
  });

  expressListRoutes({ prefix: rootApi + todoRoute }, '', router );
  logging(active, '');

  return router;
}
