var dom = require('dom')
var Elements = require('elements')
var Collection = require('collection')
var Stream = require('stream')
var Todo = require('./todo-item')

module.exports = function list(el) {
  var tpl = dom.firstChild(el)

  el.innerHTML = ''

  var elements = Elements(el, tpl)

  var list = Collection(function(cmd) {
    return new Todo(cmd.el, cmd)
  })

  var todos = new Stream

  todos.push = function(cmd) {
    elements.push(cmd)
  }

  list.each(function(cmd) {
    todos._push(cmd)
  })

  elements.pipe(list)

  return todos
}
