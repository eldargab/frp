var value = require('value')

exports.not = Not

function Not(binding) {
  this.binding = binding
}

Not.prototype.set = function(val) {
  this.binding.set(!val)
}

exports.value = Value

function Value(binding) {
  this.binding = binding
}

Value.prototype.set = function(listener) {
  this.binding.set(function() {
    listener.call(this, value(this.target))
  })
}

exports.enter = Enter

function Enter(binding) {
  this.binding = binding
}

Enter.prototype.set = function(listener) {
  this.binding.set(function() {
    if (this.keyCode == 13) listener.apply(this, arguments)
  })
}

exports._create = function(fn) {
  function Filter(binding) {
    this.binding = binding
  }

  Filter.prototype.set = function(val) {
    this.binding.set(fn(val))
  }

  return Filter
}
