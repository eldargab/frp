
exports.not = Not

function Not(binding) {
  this.binding = binding
}

Not.prototype.set = function(val) {
  this.binding.set(!val)
}
