var Stream = require('stream')
var mix = require('mix')
var defs = require('./bindings')
var filters = require('./filters')

module.exports = View

function View(el) {
  this.el = el
  this.bindings = {}
  this.views = {}
  this.bind(this.el)
  this.bindChilds(this.el)
}

Stream(View.prototype)

View.prototype.set = View.prototype.push = function(name, val) {
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

View.prototype.defs = defs

View.prototype.filters = filters

View.prototype.bindChilds = function(el) {
  var child = el.firstChild
  while(child) {
    if (child.nodeType == 1) {
      var view = child.getAttribute('data-view')
      if (view) {
        this.views[view] = child
      } else {
        this.bind(child)
        this.bindChilds(child)
      }
    }
    child = child.nextSibling
  }
}

View.prototype.bind = function(el) {
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

    var binding = this.createBinding(el, type, param)
    var event = binding.event

    for (var j = 1; j < bf.length; j++) {
      binding = this.applyFilter(bf[j].trim(), binding)
    }

    if (event) {
      this.subscribe(path, binding)
    }

    this.assignBinding(path, binding)
  }
}

View.prototype.createBinding = function(el, type, param) {
  var Binding = this.defs[type]
  if (!Binding) throw new Error('Binding ' + type + ' not defined')
  return new Binding(el, param, this)
}

View.prototype.applyFilter = function(type, binding) {
  var Filter = this.filters[type]
  if (!Filter) throw new Error('Filter ' + type + ' not defined')
  return new Filter(binding)
}

View.prototype.subscribe = function(path, binding) {
  var self = this
  binding.set(function() {
    var args = new Array(arguments.length + 1)
    args[0] = path
    for (var i = 0; i < arguments.length; i++) {
      args[i + 1] = arguments[i]
    }
    self.out.apply(self, args)
  })
}

View.prototype.assignBinding = function(path, binding) {
  var current = this.bindings[path]
  if (!current) return this.bindings[path] = binding
  if (current._add_) return current._add_(binding)
  this.bindings[path] = new defs._Multi([current, binding])
}

View.setter = function(name) {
  this.prototype[name] = function(val) {
    var binding = this.bindings[name]
    binding && binding.set(val)
    return this
  }
  return this
}

View.registerBinding = function(name, Binding) {
  this.prototype.defs = mix({}, this.prototype.defs)
  this.prototype.defs[name] = Binding.prototype.set
    ? Binding
    : defs._create(Binding)
  return this
}

View.registerFilter = function(name, filter) {
  this.prototype.filters = mix({}, this.prototype.filters)
  this.prototype.filters[name] = filter.prototype.set
    ? filter
    : filters._create(filter)
  return this
}

View.create = function(el) {
  return new this(el)
}

View.extend = function() {
  function CustomView(el) {
    View.call(this, el)
  }

  CustomView.prototype = Object.create(View.prototype)

  CustomView.setter = View.setter

  CustomView.registerBinding = View.registerBinding

  CustomView.registerFilter = View.registerFilter

  CustomView.create = View.create

  return CustomView
}
