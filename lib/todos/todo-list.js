var dom = require('dom')
var Collection = require('collection')
var Todo = require('./todo-item')

module.exports = function list(el) {
  var tpl = dom.firstChild(el)

  el.innerHTML = ''

  return new TodoList(el, tpl)
}

function TodoList(el, tpl) {
  this.el = el
  this.tpl = tpl
}

Collection(TodoList.prototype)

TodoList.prototype.createItem = function(cmd) {
  var el = this.tpl.cloneNode(true)
  var todo = new Todo(el, cmd)

  this.el.appendChild(el)

  return todo
}
