var dom = require('dom')
var clone = require('clone')
var Stream = require('stream')
var View = require('view')

module.exports = Todo

function Todo(el, cmd) {
  this.el = el
  this.bind(el)
  this.push(cmd)
}

Stream(Todo.prototype)
View(Todo.prototype)

Todo.prototype
  .setter('inputText')
  .setter('editing')
  .event('enterEditMode')
  .event('exitEditMode')
  .event('del')
  .event('toggle')
  .event('updateText')

Todo.prototype.enterEditMode = function() {
  this.inputText(this.data.text)
  this.editing(true)
}

Todo.prototype.exitEditMode = function() {
  this.editing(false)
}

Todo.prototype.del = function() {
  this.out({
    type: 'delete',
    uid: this.data.uid
  })
}

Todo.prototype.toggle = function(on) {
  this.data.completed = on
  this.update()
}

Todo.prototype.updateText = function(text) {
  this.editing(false)
  this.data.text = text
  this.update()
}

Todo.prototype.push = function(cmd) {
  switch (cmd.type) {
    case 'create':
    case 'update':
      this.data = clone(cmd.data)
      this.set(cmd.data)
      break
    case 'delete':
      dom.remove(this.el)
      break
  }
}

Todo.prototype.update = function() {
  this.out({
    type: 'update',
    uid: this.data.uid,
    data: this.data
  })
}

Todo.prototype.registerBinding('focus', function(on, el) {
  on && el.focus()
})
