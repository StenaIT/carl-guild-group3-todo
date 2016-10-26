import React, {Component, PropTypes} from 'react'
import classnames from 'classnames'
import TodoEdit from './todo_edit.jsx'
import ValidatorPropTypes from 'react-validator-prop-types'

class Todo extends React.Component {
  // Syntax made possible with babel plugin "transform-class-properties"
  // https://medium.com/@joshblack/writing-a-react-component-in-es2015-a0b27e1ed50a#.xz74o217a
  state = {
    editing: false
  }

  // Syntax made possible with babel plugin "transform-class-properties"
  // nested types: http://andrewhfarmer.com/validate-nested-proptypes/
  static propTypes = {
    todo: React.PropTypes.shape({
        id:  ValidatorPropTypes.uuid.isRequired,
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
    }),
    editTodo: PropTypes.func.isRequired,
    deleteTodo: PropTypes.func.isRequired,
    completeTodo: PropTypes.func.isRequired
  }

  // Syntax made possible with babel plugin "transform-class-properties"
  static defaultProps = {
  }

  // Syntax made possible with babel plugin "transform-class-properties"
  // We dont need to bind htis  in the constructor any more to be able to use it
  handleClick = () => {
    this.setState({ editing: true })
  }

  handleSave = (id, text) => {
    if (text.length === 0) {
      this.props.deleteTodo(id)
    } else {
      this.props.editTodo(id, text)
    }
    this.setState({ editing: false })
  }

  render() {
    const { todo, completeTodo, deleteTodo } = this.props
    let todoElement;

    if(this.state.editing)
    {
      todoElement = (
        <TodoEdit text={todo.text}
                       editing={this.state.editing}
                       onSave={(text) => this.handleSave(todo.id, text)} />
      )
    } else  {

        todoElement = (
          <div className="view">
            <input
              className="toggle"
              type="checkbox"
              checked={todo.completed}
              onChange={() => completeTodo(todo)} />
            <label onClick={this.handleClick}>
              {todo.text}
            </label>
            <button
              className="trash"
              onClick={() =>deleteTodo(todo.id)} />
          </div>
        )
    }

    return ( todoElement );
  }
}


export default Todo;
