# Todo App by carl-guild-group 3

## Prerequisites
Node.js and NPM must be installed.

* Get all node modules for the client.
``` CMD/Bash
cd ./src/client
npm update
```

* Get all node modules for the server.
``` CMD/Bash
cd ./src/server
npm update
```
## Docker constainers
This is still missing...

### What's left to be DONE
* Need to add a container for Client
* Need to add a container for Server
* Need to add a container for Database


## Client
The client is a web gui that uses [React](https://facebook.github.io/react/), [Redux](http://redux.js.org/) frameworks and the source is compiled with [Babel](https://babeljs.io/).

[Webpack](https://github.com/webpack/webpack) is utilized to automate Babel compiling and deploying.

[Webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) is used to publish our Single Page App to clients.

Tesing is done with [Jest](https://facebook.github.io/jest/) for snapshot testing and [Enzyme](https://github.com/airbnb/enzyme) shallow testing on components.

### What's left to be DONE
* Write test for Main component.
* Setup a css.
* Use redux beacuse we are not using it right now.
* Put the Events in a file with constants that can be shared between client/server.
* [Optional] Add multiple todo lists.
* [Optional] Add Offline functionallity.
* [Optional] Add Undo functionallity, this should be easy if we successfully apply a CQRS pattern with eventstore on server side.


#### Start client
Webpack is used in conjunction with bable to parse '.jsx' files into '.js'.
webpack-dev-server with hot reload is then used to runt the Single Page app.

``` CMD/Bash
cd ./src/client
npm start
```

1. Will build everything that are needed for the deploy on a server  ./dist/*
2. Load our develop environment at localhost:8080.
3. Hot reload is active so you should only alter and save the '.jsx' file to see the change in web-browser.

> If you wish to change port number it can be done in webpack.config.js *clientPort*

> Trouble with a port use the cmd: **"netstat -o -n -a | findstr :8080"** to find which process that currently using the port.

Listen to Events on the socket.io Api:

| Event                          |Request data           | Description                           |
| ------------------------------ | --------------------- | ------------------------------------- |
|todo:added                      |{id, text, completed}  | A todo was added                      |
|todo:edited                     |{id, text}             | A todo has changed description        |
|todo:deleted                    |{id}                   | A todo task was deleted               |
|todo:completed                  |{id, completed}        | A todo task was complete/uncompleted  |

#### Build
Webpack is used in conjunction with bable to parse '.jsx' files into '.js'.

``` CMD/Bash
cd ./src/client
npm run build
```
1. Will build everything that are needed for the deploy on a webserver  ./dist/*

#### Run tests
Test are written with test suites Jest and Enzyme.
``` CMD/Bash
cd ./src/client
npm test
```
1. Will run snapshot tests.
2. Will run component tests.


## Server
The server is a node.js server that utilize socket.io and express and store it in a event store.

### What's left to be DONE
* ~~We need to check out why socket.io  broadcast.emit  also emits event to sender.~~
* Write test for api.
* Put the Events in a file with constants that can be shared between client/server.
* ~~Move the Event listeners into its own component.~~
* We need to look into [validator.js](https://www.npmjs.com/package/validator) to validate requests
* We need XSS Sanitization, [xss-filters library](https://github.com/yahoo/xss-filters) or [DOMPurify](https://github.com/cure53/DOMPurify).
* We need some db storage, [nodeCQRS](https://github.com/jamuhl/nodeCQRS).

#### Start Server
Start the server on port 3009.
``` CMD/Bash
cd ./src/server
npm start
```

> If you wish to change port number it can be done in 'default.json' **listenPort**

> Trouble with a port use the cmd: **"netstat -o -n -a | findstr :3009"** to find which process that currently using the port.

Listen on REST Api:

|Request type| Url                            | Description                           |Emit event      |
| ---------- | ------------------------------ | ------------------------------------- | -------------- |
|GET         |/api/v1/todo/list               | Get a list of todos                   |                |
|POST        |/api/v1/todo/add                | Add a todo                            | todo:added     |
|PUT         |/api/v1/todo/edit_description   | Edit a todo task description          | todo:edited    |
|DELETE      |/api/v1/todo/delete/:id         | Delete a todo task                    | todo:deleted   |
|PUT         |/api/v1/todo/complete/toggle/:id| Toggle todo task complete/uncompleted | todo:completed |


Listen to Events on the socket.io Api:

| Event                          |Request data           | Description                           |Emit event      |
| ------------------------------ | --------------------- | ------------------------------------- | -------------- |
|todo:list                       |                       | Get a list of todos                   |                |
|todo:add                        |{id, text, completed}  | Add a todo                            | todo:added     |
|todo:edit                       |{id, text}             | Edit a todo task description          | todo:edited    |
|todo:delete                     |{id}                   | Delete a todo task                    | todo:deleted   |
|todo:complete                   |{id, completed}        | Toggle todo task complete/uncompleted | todo:completed |
