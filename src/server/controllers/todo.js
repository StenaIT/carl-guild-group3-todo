var expressListRoutes   = require('express-list-routes');
var express = require('express');
var router = express.Router();
var config = require('config');
var todos = [];

console.log('\n  * Todo controller API:');

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  req.io.emit('news', { hello: 'world' });

  next();
});

router.get('/list',function (req, res) {
    var result = todos;
    res.status(201).json(result);
});

console.log('/add/todo');
router.post('/add' ,function (req, res) {
  var result = todos.slice();

  result.push(req.body.todo);
  todos.push(req.body.todo);

  req.io.sockets.emit('todo:add', req.body.todo);

  res.status(201).json(result);
});


router.put('/edit_description' ,function (req, res) {
  let {id, text} = req.body.todo;
  var result = todos.filter(function (todo) {
    if(todo.id ==  id)
      todo.text =  text;

    return true;
  });

  req.io.sockets.emit('todo:edit', { id, text });

  res.status(201).json(result);
});


router.delete('/delete/:id' ,function (req, res) {
  let id = req.params.id;
  var result = todos.filter(function (todo) {
    return todo.id != id
  })

  todos = result;

  console.log('Todo list:');
  console.log(todos);

  req.io.sockets.emit('todo:delete', { id });

  res.status(201).json(result);
});

router.put('/complete/toggle/:id' ,function (req, res) {
  let completed = false;
  let id = req.params.id;

  var result = todos.filter(function (todo) {
    if(todo.id ==  id) {
      completed = !todo.completed;
      todo.completed =  completed;
    }
    return true;
  });

  req.io.sockets.emit('todo:complete', {id, completed});

  res.status(201).json(result);
});


expressListRoutes({ prefix: config.get('apiUrl') + config.get('routs.todo') }, '', router );
console.log('');

module.exports = {router: router, todos: todos};
