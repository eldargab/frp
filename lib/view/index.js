var mix = require('mix')
var defs = require('./bindings')
var filters = require('./filters')

module.exports = View

function View(obj) {
  if (obj) return mix(obj, View.prototype)
}

View.prototype.bind = function(el) {
  this.el = el
  this.bindings = {}
  this.views = {}
  this._bind(this.el)
  this._bindChilds(this.el)
  this._subscribe()
  return this
}

View.prototype._bindChilds = function(el) {
  var child = el.firstChild
  while(child) {
    if (child.nodeType == 1) {
      var view = child.getAttribute('data-view')
      if (view) {
        this.views[view] = child
      } else {
        this._bind(child)
        this._bindChilds(child)
      }
    }
    child = child.nextSibling
  }
}

View.prototype._bind = function(el) {
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
    var param = ~index ? tp.slice(index + 1) : ''

    var binding = this._createBinding(el, type, param)
    for (var j = 1; j < bf.length; j++) {
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
  if (!Filter) throw new Error('Filter ' + type + ' not defined')
  return new Filter(binding)
}

View.prototype._assignBinding = function(path, binding) {
  var current = this.bindings[path]
  if (!current) return this.bindings[path] = binding
  if (current._add_) return current._add_(binding)
  this.bindings[path] = new defs._Multi([current, binding])
}

View.prototype._subscribe = function() {
  for (var i = 0; i < this.events.length; i++) {
    this.events[i](this)
  }
}

View.prototype.registerBinding = function(name, Binding) {
  this.defs = mix({}, this.defs)
  this.defs[name] = Binding.prototype.set
    ? Binding
    : defs._create(Binding)
  return this
}

View.prototype.registerFilter = function(name, filter) {
  this.filters = mix({}, this.filters)
  this.filters[name] = filter.prototype.set
    ? filter
    : filters._create(filter)
  return this
}

View.prototype.set = function(name, val) {
  if (typeof name == 'object') {
    for (var key in name) {
      this.set(key, name[key])
    }
  } else {
    var binding = this.bindings[name]
    binding && binding.set(val)
  }
  return this
}

View.prototype.setter = function(name) {
  // TODO: try code generation here
  this[name] = function(val) {
    var binding = this.bindings[name]
    binding && binding.set(val)
    return this
  }
  return this
}

View.prototype.event = function(name, fn) {
  this.events = this.events.concat(function(view) {
    var binding = view.bindings[name]
    binding && binding.set(function() {
      view[name].apply(view, arguments)
    })
  })
  if (fn) this[name] = fn
  return this
}

View.prototype.bindings = {}

View.prototype.defs = defs

View.prototype.filters = filters

View.prototype.events = []
