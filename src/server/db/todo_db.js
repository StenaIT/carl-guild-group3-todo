
var todos = [];

function get(id) {
  var l = todos.filter(function (todo) {
    return todo.id == id
  });

  if(l.length > 0)
    return l[0];
  return undefined;
}

function add(todo) {
  todos.push(todo)
}

function del(id) {
  todos = todos.filter(function (todo) {
    return todo.id != id
  });
}

function edit(data) {
  let {id, text} = data;

  todos = todos.filter(function (todo) {
    if(todo.id == id) {
      todo.text = text;
    }
    return true;
  });
}

function complete(data) {
  let {id,completed} = data;

  todos = todos.filter(function (todo) {
    if(todo.id == id) {
      todo.completed = completed;
    }
    return true;
  });
}

function getTodos() {
  return todos;
}

module.exports = {get: get, add : add, delete: del, edit: edit, complete: complete, todos: getTodos}
