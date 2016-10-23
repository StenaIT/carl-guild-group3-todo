//Can use this when React has released v15.4
//https://github.com/facebook/jest/issues/1353
//import React from 'react';
//import renderer from 'react-test-renderer';
//import {shallow} from 'enzyme';

import Todo from '../../../components/todo/todo.jsx';

// We need to include resetmodules until React has released v15.4
beforeEach(() => jest.resetModules());

describe('Todo', () => {
  describe('Snapshot', () => {
    it('should render a view', () => {
      // We need to include require in each test until React has released v15.4
      const React = require('react');
      const renderer = require('react-test-renderer');

      const view = {
          todo: {
            id: '2974203a-8c9f-4e3b-963d-801bbba5e9fb',
            text: 'View this todo',
            completed: false
          },
          editTodo: jest.fn(),
          deleteTodo: jest.fn(),
          completeTodo: jest.fn()
      }

      const component = renderer.create(<Todo { ...view}/>);
      const json = component.toJSON();
      expect(json).toMatchSnapshot();
    });
  });

  describe('Component', () => {
    // We use our consle.warn to throw instead of output it to console.
    require('../../../setupTestFramework.js')

    it('should warn when missing todo data', () => {
      const React = require( 'react');
      const shallow = require('enzyme').shallow;

      expect(() => {shallow(<Todo />) }).toThrowError(/Warning..Failed.prop.type..Required.prop/);
    });

    it('should warn when invalid todo data', () => {
      const React = require( 'react');
      const shallow = require('enzyme').shallow;

      const invalid = {
        todo: {
          id: '26b7dbf3-d3cf-4843-8d42-93e2d3f97886',
          test: "invalid",
        },
        editTodo: jest.fn(),
        deleteTodo: jest.fn(),
        completeTodo: jest.fn()
      }

      expect(() => {shallow(<Todo {...invalid}/>) }).toThrowError(/Warning..Failed.prop.type..Required.prop/);
    });

    it('should be able to change to be editable', () => {
      // We need to include require in each test until React has released v15.4
      const React = require( 'react');
      const shallow = require('enzyme').shallow;

      const edit = {
          todo: {
            id: '1717f1ba-e0d2-468b-996f-d3af4794bf6c',
            text: 'Edit this todo',
            completed: false
          },
          editTodo: jest.fn(),
          deleteTodo: jest.fn(),
          completeTodo: jest.fn()
      }

      const todo = shallow(<Todo {...edit} />);
      expect(todo.find('label').text()).toEqual('Edit this todo');

      todo.find('label').simulate('doubleclick');
      expect(todo.state('editing')).toEqual(true);
    });
  });
});
