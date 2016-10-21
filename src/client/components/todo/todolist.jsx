import React, { PropTypes } from 'react'
import Todo from './todo.jsx'

export default class TodoList extends React.Component {
  static defaultProps = {
    todos: []
  }

  render() {
    var todoNodes = this.props.todos.map(function(todo) {
      return (
        <Todo {...todo} key={todo.todo.id}/>
      );
    });
    return (
      <div className="todolist">
        {todoNodes}
      </div>
    );
  }
}
