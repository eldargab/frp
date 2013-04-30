var dom = require('dom')
var clone = require('clone')
var Stream = require('stream')

module.exports = Todo

function Todo(el, cmd) {
  this.el = el
  this.label = dom('label', el)
  this.toggle = dom('.toggle', el)
  this.input = dom('input.edit', el)

  this.init(cmd)
}

Stream(Todo.prototype)

Todo.prototype.init = function(cmd) {
  var self = this

  dom.on(this.label, 'dblclick', function() {
    self.enterEditMode()
  })

  dom.on(this.toggle, 'click', function() {
    self.onchange()
  })

  dom.on(this.input, 'keypress', function(ev) {
    if (ev.keyCode == 13) self.onchange() //enter
  })

  dom.on(this.input, 'blur', function() {
    self.exitEditMode()
  })

  dom.on(dom('button.destroy', this.el), 'click', function() {
    self._push({
      type: 'delete',
      uid: self.data.uid
    })
  })

  this.push(cmd)
}

Todo.prototype.push = function(cmd) {
  switch (cmd.type) {
    case 'create':
    case 'update':
      this.update(cmd.data)
      break
    case 'delete':
      dom.remove(this.el)
      break
    case 'hide':
      dom.toggle('hidden', cmd.hide, this.el)
      break
  }
}

Todo.prototype.update = function(data) {
  this.data = clone(data)
  this.sync()
}

Todo.prototype.sync = function() {
  var data = this.data
    , completed = data.completed
    , text = data.text

  dom.toggle('completed', completed, this.el)
  this.toggle.checked = !!completed
  this.input.value = text
  this.label.textContent = text
}

Todo.prototype.onchange = function() {
  this.exitEditMode()

  this.data.text = this.input.value
  this.data.completed = this.toggle.checked

  this.sync()

  this._push({
    type: 'update',
    uid: this.data.uid,
    data: this.data
  })
}

Todo.prototype.enterEditMode = function() {
  dom.toggle('editing', true, this.el)
  this.input.focus()
}

Todo.prototype.exitEditMode = function() {
  dom.toggle('editing', false, this.el)
}
