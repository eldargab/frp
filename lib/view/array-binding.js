module.exports = ArrayBinding

function ArrayBinding(initials) {
  this.bindings = initials || []
}

ArrayBinding.prototype.set = function(val) {
  for (var i = 0; i < this.bindings.length; i++) {
    this.bindings[i].set(val)
  }
}

ArrayBinding.prototype._add_ = function(binding) {
  this.bindings.push(binding)
  return this
}
