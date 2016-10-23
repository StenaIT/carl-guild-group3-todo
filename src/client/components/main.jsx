import React from 'react';
import ReactDOM from 'react-dom';
import TodoList from './todo/todolist.jsx';
import TodoEdit from './todo/todo_edit.jsx';
import {default as UUID} from "node-uuid";
import io from 'socket.io-client/socket.io';

class Main extends React.Component {
  state = {
    todos: []
  }

  componentDidMount = () => {
    console.log('componentDidMount');

    this.socket = io({path: '/sioapi' });
    this.socket.on('connect', this._connected );
    this.socket.on('todo:list', this._todosUpdated );
    this.socket.on('todo:added', this._todoAdded);
    this.socket.on('todo:deleted', this._todoDeleted);
    this.socket.on('todo:edited', this._todoEdited);
    this.socket.on('todo:completed', this._todoCompleted);
  }

  _connected = () => {
    console.log('socket.io is now connected');
  }

  _todosUpdated = data => {
    console.log('_todosUpdated');

    let self = this;
    let todoList = data.map(function(item) {
      let t = {
        todo: item,
        editTodo: self.handleEdit,
        deleteTodo:  self.handleDelete,
        completeTodo:  self.handleComplete
      }
      return t;
    });
    this.setState({ todos: todoList })
  }

  _todoAdded = todo => {
    console.log('_todoAdded ' + todo.id);

    let self = this;
    let t = {
      todo: todo,
      editTodo: self.handleEdit,
      deleteTodo:  self.handleDelete,
      completeTodo:  self.handleComplete
    }

    this.state.todos.push(t);
    this.setState({ todo: this.state.todos })
  }

  _todoDeleted = data => {
    let {id}= data
    console.log('_todoDeleted ' + id);

    let self = this;

    let l = this.state.todos.filter(function (todo) {
      return todo.todo.id != id
    })

    console.log(l);

    this.setState({ todos: l });
  }

  _todoEdited = data => {
    let {id,text} = data
    console.log('_todoEdited ' + id);

    let l = this.state.todos.filter(function (todo) {
      if(todo.todo.id == id) {
        todo.todo.text = text;
      }
      return true;
    })

    this.setState({ todos: l });

  }

  _todoCompleted = data => {
    let {id,completed} = data
    console.log('_todoCompleted ' +id + ' ' + completed) ;

    let self = this;

    let l = this.state.todos.filter(function (todo) {
      if(todo.todo.id == id) {
        todo.todo.completed = completed;
      }
      return true;
    })

    this.setState({ todos: l });
  }

  handleAdd = text => {
    if (text.length !== 0) {
      let todo = {
          id: UUID.v4(),
          text: text,
          completed: false
      }

      this._todoAdded(todo);
      this.socket.emit('todo:add', todo);
    }
  }

  handleEdit = (id,text) => {
    this._todoEdited({id,text})
    this.socket.emit('todo:edit', {id,text});
  }

  handleDelete = (id) => {
    this._todoDeleted({id});
    this.socket.emit('todo:delete', {id});
  }

  handleComplete = (data) => {
    let {id,completed} = data
    completed = !completed;
    this._todoCompleted({id,completed});
    this.socket.emit('todo:complete', {id, completed});
  }

  render() {
    return (
      <div className='main'>
        <TodoEdit newTodo
                  onSave={this.handleAdd}
                  placeholder="Add Todo" />
                <TodoList todos={this.state.todos}/>
      </div>
   )
  }
}

export default Main;
