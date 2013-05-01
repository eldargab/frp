var mix = require('mix')
var ArrayBinding = require('./array-binding')

module.exports = View

function View(obj) {
  if (obj) return mix(obj, View.prototype)
}

View.prototype.bind = function(el) {
  this.el = el
  this.bindings = {}
  this.subviews = {}
  this._bind(this.el)
  this._bindChilds(this.el)
}

View.prototype._bindChilds = function(el) {
  var child = el.firstChild
  while(child) {
    if (child.nodeType == 1) {
      var view = child.getAttribute('data-view')
      if (view) {
        this.subviews[view] = child
      } else {
        this._bind(child)
        this._bindChilds(child)
      }
    }
    child = child.nextSibling
  }
}

View.prototype._bind = function(el) {
  this.onbind(el)
  var bindings = el.getAttribute('data-bind')
  if (!bindings) return
  bindings = bindings.split(',')
  for (var i = 0; i < bindings.length; i++) {
    var def = bindings[i].split(':')
    var path = def[1].trim()
    var bf = def[0].split('|')
    var tp = bf[0].trim()
    var index = tp.indexOf('-')
    var type = ~index ? tp.slice(0, index) : tp
    var param = ~index ? tp.slice(index) : ''

    var binding = this._createBinding(el, type, param)
    for (var j = 1; j < bf.length; i++) {
      binding = this._applyFilter(bf[j].trim(), binding)
    }

    this._assignBinding(path, binding)
  }
}

View.prototype._createBinding = function(el, type, param) {
  var Binding = this.defs[type]
  if (!Binding) throw new Error('Binding ' + type + ' not defined')
  return new Binding(el, param, this)
}

View.prototype._applyFilter = function(type, binding) {
  var Filter = this.filters[type]
  if (!filter) throw new Error('Filter ' + type + ' not defined')
  return new Filter(binding)
}

View.prototype._assignBinding = function(path, binding) {
  var current = this.bindings[path]
  if (!current) return this.bindings[path] = binding
  if (current._add_) return current._add_(binding)
  return new ArrayBinding([current, binding])
}

View.prototype.registerBinding = function(name, Binding) {
  this.defs = mix({}, this.defs)
  this.defs[name] = Binding
  return this
}

View.prototype.registerFilter = function(name, filter) {
  this.filters = mix({}, this.filters)
  this.filters[name] = filter
  return this
}

View.prototype.set = function(obj) {
  for (var key in obj) {
    var binding = this.bindings[key]
    binding && binding.set(obj[key])
  }
  return this
}

View.prototype.setter = function(name) {
  var setter = new Function('val',
    'var binding = this.bindings.' + name + ';\n' +
    'binding && binding.set(val); return this'
  )
  this[name] = setter
  return this
}

View.prototype.bindings = {}

View.prototype.defs = require('./bindings')

View.prototype.filters = require('./filters')
