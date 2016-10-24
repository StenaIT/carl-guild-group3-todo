'use strict'

// Setup of test ref: http://evanshortiss.com/development/javascript/2016/04/15/express-testing-using-ioc.html

// We'll use this to override require calls in routes
var proxyquire = require('proxyquire');
// This will create stubbed functions for our overrides
var sinon = require('sinon');
// Supertest allows us to make requests against an express object
var supertest = require('supertest');
// Natural language-like assertions
var expect = require('chai').expect;

var express = require('express');

var config = require('config');

var bodyParser = require('body-parser');

var ClientEvents = require('../../common/client_events.jsx');

describe('Todo Controller', function() {
  var app, ioStub, getTodosStub, getStub, addStub, deleteStub, expressListStub, request, route, apiUrl, todoUrl;

  beforeEach(function () {
    // A stub we can use to control conditionals
    var i = 0;
    getTodosStub = sinon.stub();
    addStub = sinon.stub();
    deleteStub = sinon.stub();
    getStub = sinon.stub();
    expressListStub = sinon.stub();
    ioStub =  {
      emit: function(event,json) {}
    }

    // Create an express application object
    app = express();
    var router = express.Router();

    app.use(function(req, res, next){
      req.io = ioStub;
      next();
    });

    // Get our router module, with a stubbed out todo_db and express-list-routes
    // dependencies we stub this out so we can control the results returned by
    // the todo controller module to ensure we execute all paths in our code
    route = proxyquire('../controllers/todo.js', {
      '../db/todo_db.js': {
        todos: getTodosStub,
        add: addStub,
        delete: deleteStub,
        get: getStub,
        '@noCallThru': true
      },
      'express-list-routes': expressListStub
    });

    apiUrl = config.get('apiUrl');

    app.use( bodyParser.json() );
    // Bind a route to our application
    route(app, apiUrl, router, false);

    // Get a supertest instance so we can make requests
    request = supertest(app);
  });

  function hasBodyEmptyArray(res) {
   if (res.body.length != 0 ) {
     throw new Error("Todos Is not Empty");
   }
  }



  describe('Routes', function() {

    it('/api/v1/todo/list - Should return and empty list and http status 200', function(done) {
      var todos = [];
      getTodosStub.returns(todos);
      request
       .get('/api/v1/todo/list')
       .set('Accept', 'application/json')
       .expect('Content-Type', /json/)
       .expect(200)                         // Http Status code
       .expect(hasBodyEmptyArray)
       .end(done);
     });

     it('/api/v1/todo/add - Should return the all stored todos and http status 201 "Created"', function(done) {
      var todo = {
        todo: {
          id: "a3eafa59-0854-481a-a9d4-5530ff6058a2",
          text: "Test 2",
          completed: false
        }
      };
      getTodosStub.returns([todo.todo]);

      var spy = sinon.spy(ioStub, "emit");

      function hasSocketIoEventEmittedOnce() {
        if (spy.withArgs(ClientEvents.TODO_ADDED, sinon.match.any).calledOnce != true)
        {
          throw new Error("Do not emit correct event to socket.io");
        }
      }

      request
       .post('/api/v1/todo/add')
       .set('Accept', 'application/json')
       .type('json')
       .send(todo)
       .expect('Content-Type', /json/)
       .expect(201)
       .expect( hasSocketIoEventEmittedOnce ) // Check so we do not emit multiple times.
       .expect([todo.todo]) // Returns all items that has been stored.
       .end(done);
     });
   });

//   it('/api/v1/todo/delete - Should return the deleted todo and http status 200 "Ok"', function(done) {
//    var todos = [
//      {
//        id: "a3eafa59-0854-481a-a9d4-5530ff6058a2",
//        text: "Test 3",
//        completed: false
//      }
//    ];

//    getTodosStub.returns(todos);

//    var spy = sinon.spy(ioStub, "emit");

//    function hasSocketIoEventEmittedOnce() {
//      if (spy.withArgs(ClientEvents.TODO_DELETED, sinon.match.any).calledOnce != true)
//      {
//        throw new Error("Do not emit correct event to socket.io");
//      }
//    }

//    request
//     .del('/api/v1/todo/delete/a3eafa59-0854-481a-a9d4-5530ff6058a2')
//     .set('Accept', 'application/json')
//     .type('json')
//     .expect('Content-Type', /json/)
//     .expect(200)
//     .expect( hasSocketIoEventEmittedOnce ) // Check so we do not emit multiple times.
//     .expect(todos[0]) // Returns all items that has been stored.
//     .end(done);
//   });
});
