var dom = require('dom')
var clone = require('clone')
var Actor = require('actor')
var View = require('view')

module.exports = Todo

function Todo(el, uid, data) {
  this.el = el
  this.uid = uid
  this.view = new TodoView(this.el)
  this.view.pipe(this)
  this.update(data)
}

Actor(Todo.prototype)

Todo.prototype.update = function(data) {
  this.data = clone(data)
  this.view.set(this.data)
}

Todo.prototype.destroy = function() {
  dom.remove(this.el)
}

Todo.prototype.enterEditMode = function() {
  this.view.inputText(this.data.text)
  this.view.editing(true)
}

Todo.prototype.exitEditMode = function() {
  this.view.editing(false)
}

Todo.prototype.del = function() {
  this.out('del', this.uid)
}

Todo.prototype.toggle = function(on) {
  this.data.completed = on
  this.out('update', this.uid, this.data)
}

Todo.prototype.updateText = function(text) {
  this.view.editing(false)
  this.data.text = text
  this.out('update', this.uid, this.data)
}

var TodoView = View.extend()
  .setter('inputText')
  .setter('editing')
  .registerBinding('focus', function(on, el) {
    on && el.focus()
  })
