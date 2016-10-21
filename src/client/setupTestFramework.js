
//https://gist.github.com/jsdf/6fc35890e4ed4a219072
var util = require('util');

// keep a reference to the original console methods
var consoleWarn = console.warn;
var consoleError = console.error;

function logToError() {
  throw new Error(util.format.apply(this, arguments).replace(/^Error: (?:Warning: )?/, ''));
}

beforeEach(function() {
  // make calls to console.warn and console.error throw an error
  console.warn = logToError;
  console.error = logToError;
});

afterEach(function() {
  // return console.warn and console.error to default behaviour
  console.warn = consoleWarn;
  console.error = consoleError;
});
