var expressListRoutes   = require('express-list-routes');
var express = require('express');
var router = express.Router();
var config = require('config');
var todo_db = require('../db/todo_db')
var ClientEvents = require('../../common/client_events.jsx');

console.log('\n  * Todo controller API:');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/list',function (req, res) {
    var result = todo_db.todos();
    res.status(200).json(result);
});

router.post('/add' ,function (req, res) {
  var todo = req.body.todo;

  todo_db.add(todo);

  req.io.emit(ClientEvents.TODO_ADDED, todo);

  res.status(201).json(todo_db.todos());
});


router.put('/edit_description' ,function (req, res) {
  console.log(req.body);
  let {id, text} = req.body.todo;

  todo_db.edit({id,text});
  req.io.sockets.emit(ClientEvents.TODO_EDITED, { id, text });

  res.status(200).json(todo_db.get(id));
});


router.delete('/delete/:id' ,function (req, res) {
  let id = req.params.id;
  console.log(id);
  var result = todo_db.get(id);
  todo_db.delete(id);
  req.io.sockets.emit(ClientEvents.TODO_DELETED, { id });

  res.status(200).json(result);
});

router.put('/complete/toggle/:id' ,function (req, res) {
  let id = req.params.id;
  let todo = todo_db.get(id);
  let completed = !todo.completed;

  todo_db.complete({id, completed: completed});

  req.io.sockets.emit(ClientEvents.TODO_COMPLETED, {id, completed});

  res.status(200).json(todo);
});


expressListRoutes({ prefix: config.get('apiUrl') + config.get('routs.todo') }, '', router );
console.log('');

module.exports = {router: router};
