import React from 'react';
import renderer from 'react-test-renderer';
import TodoList from '../../../../src/client/components/todo/todolist.jsx';
import {default as UUID} from "node-uuid";

describe('TodoList', () => {
  describe('Snapshot', () => {
    it('should render a view', () => {

      const todos = [
        {
          todo: {
            id: '9b9eb348-4dfe-422a-baf4-3bc3e2e76f54',
            text: 'Todo 1',
            completed: false
          },
          editTodo:     function() {},
          deleteTodo:   function() {},
          completeTodo: function() {}
        },
        {
          todo: {
            id: '04797e25-4cfb-488d-9ef3-ad11e1aeb40f',
            text: 'Todo 2',
            completed: true
          },
          editTodo:     function() {},
          deleteTodo:   function() {},
          completeTodo: function() {}
        },
        {
          todo: {
            id: 'cbc5731a-0107-43bb-a7fb-fb68182b8e66',
            text: 'Todo 3',
            completed: false
          },
          editTodo:     function() {},
          deleteTodo:   function() {},
          completeTodo: function() {}
        }
      ]

      const component = renderer.create(<TodoList todos={todos} />);
      const json = component.toJSON();
      expect(json).toMatchSnapshot();
    });
  });
});
